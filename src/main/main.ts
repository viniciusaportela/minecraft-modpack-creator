/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, protocol, net } from 'electron';
import * as os from 'os';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync, mkdirSync } from 'node:fs';
import StreamZip from 'node-stream-zip';
import * as crypto from 'crypto';
import { resolveHtmlPath } from './util';
import WindowManager from './core/window-manager';

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 800,
    height: 600,
    resizable: true,
    image: getAssetPath('icon.png'),
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  ipcMain.handle('getCurseForgeFolder', () => {
    if (process.platform === 'linux') {
      const home = os.homedir();
      return path.join(
        home,
        'Documents',
        'curseforge',
        'minecraft',
        'Instances',
      );
    }

    return null;
  });

  ipcMain.on('on-open-project', () => {
    mainWindow!.setSize(1280, 900);
  });

  ipcMain.handle('readFile', (ev, path: string) => {
    return readFile(path, 'utf8');
  });

  ipcMain.handle('readDir', (ev, path: string) => {
    return readdir(path);
  });

  ipcMain.handle('writeFile', (ev, savePath: string, value: string) => {
    console.log(savePath);
    const doesExists = existsSync(savePath.split('/').slice(0, -1).join('/'));

    if (!doesExists) {
      const parts = savePath.split('/').slice(0, -1).slice(1);
      console.log(parts);
      let currentPath = '';
      parts.forEach((part) => {
        currentPath = `${currentPath}/${part}`;
        console.log('verify', currentPath, existsSync(currentPath));
        if (!existsSync(currentPath)) {
          console.log('Creating folder', currentPath);
          mkdirSync(currentPath);
        }
      });
    }

    return writeFile(savePath, value);
  });

  ipcMain.handle('close', () => {
    mainWindow!.close();
  });

  ipcMain.handle('maximize', () => {
    if (mainWindow!.isMaximized()) {
      mainWindow!.unmaximize();
    } else {
      mainWindow!.maximize();
    }
  });

  ipcMain.handle('minimize', () => {
    mainWindow!.minimize();
  });

  ipcMain.handle('readConfig', async (_, modpackFolder: string) => {
    const filePath = path.join(modpackFolder, 'config.json');

    const fileExists = existsSync(filePath);

    if (!fileExists) {
      await writeFile(filePath, JSON.stringify({ modpackFolder }));
      return { modpackFolder };
    }

    const file = await readFile(filePath, 'utf8');

    return JSON.parse(file);
  });

  ipcMain.handle(
    'writeConfig',
    async (ev, modpackFolder: string, newJson: Record<string, unknown>) => {
      await writeFile(
        path.join(modpackFolder, 'config.json'),
        JSON.stringify(newJson),
      );
    },
  );

  ipcMain.handle('open', (_, page: string) => {
    return new Promise((resolve) => {
      const requestId = crypto.randomBytes(16).toString('hex');
      console.log('open', requestId);

      WindowManager.create({
        parent: mainWindow!,
        page,
        requestId,
        respondRequester: resolve,
      });
    });
  });

  ipcMain.on('windowResponse', (_, requestId: string, params: any) => {
    WindowManager.onWindowMessage(requestId, params);
  });

  ipcMain.handle('getEditTreeConfig', async (_, modpackPath: string) => {
    const basePath = path.join(
      modpackPath,
      'skilltree',
      'editor',
      'data',
      'skilltree',
    );

    const skillTree = JSON.parse(
      await readFile(
        path.join(basePath, 'skill_trees', 'main_tree.json'),
        'utf8',
      ),
    );

    const skills = [];
    const files = await readdir(path.join(basePath, 'skills'));
    for await (const fileName of files) {
      const file = await readFile(
        path.join(basePath, 'skills', fileName),
        'utf8',
      );
      skills.push(JSON.parse(file));
    }

    return { skillTree, skills };
  });

  ipcMain.handle(
    'loadTexture',
    async (ev, modId: string, modJarPath: string, texturePath: string) => {
      const imgFolderPath = path.join(
        app.getPath('userData'),
        'textures',
        modId,
      );

      const splittedTexture = texturePath.split('/');
      const textureName = splittedTexture.splice(-1);
      const finalPath = path.join(
        imgFolderPath,
        `${splittedTexture.join('_')}__${textureName}`,
      );

      if (existsSync(finalPath)) {
        return `textures://${finalPath}`;
      }

      const zip = new StreamZip.async({ file: modJarPath });

      const img = await zip.entryData(
        `assets/${modId}/textures/${texturePath}`,
      );

      if (!existsSync(path.join(app.getPath('userData'), 'textures'))) {
        mkdirSync(path.join(app.getPath('userData'), 'textures'));
      }

      if (!existsSync(imgFolderPath)) {
        mkdirSync(imgFolderPath);
      }

      await writeFile(finalPath, img);

      return `textures://${finalPath}`;
    },
  );

  ipcMain.handle(
    'loadAllTextures',
    async (_, modId: string, modJarPath: string) => {
      const exportedFolderPath = path.join(
        app.getPath('userData'),
        'textures',
        modId,
      );

      if (existsSync(path.join(exportedFolderPath, '.migrated'))) {
        return readdir(exportedFolderPath);
      }

      const modpackTexturesFolder = path.join(
        app.getPath('userData'),
        'textures',
        modId,
      );
      if (!existsSync(modpackTexturesFolder)) {
        mkdirSync(modpackTexturesFolder, { recursive: true });
      }

      const zip = new StreamZip.async({ file: modJarPath });
      const textures = [];

      const entries = await zip.entries();

      for await (const entry of Object.values(entries)) {
        console.log(entry);
        if (
          entry.name.startsWith(`assets/${modId}/textures`) &&
          entry.name.endsWith('.png')
        ) {
          const img = await zip.entryData(entry.name);

          const splittedTexture = entry.name
            .replace(`assets/${modId}/textures/`, '')
            .split('/');
          const textureName = splittedTexture.splice(-1);
          const finalPath = path.join(
            modpackTexturesFolder,
            `${splittedTexture.join('_')}__${textureName}`,
          );

          textures.push(finalPath);

          await writeFile(finalPath, img);
        }
      }

      await writeFile(path.join(exportedFolderPath, '.migrated'), '');
    },
  );

  ipcMain.handle('getPath', async (ev, name) => {
    return app.getPath(name);
  });

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    protocol.handle('textures', (request) => {
      return net.fetch(`file://${request.url.slice('textures://'.length)}`);
    });

    createWindow();

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
