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
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  protocol,
  net,
  dialog,
} from 'electron';
import * as crypto from 'crypto';
import chokidar from 'chokidar';
import { existsSync, mkdirSync } from 'node:fs';
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
    icon: getAssetPath('icon.png'),
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

  ipcMain.on('resize', (_, width: number, height: number) => {
    mainWindow!.setSize(width, height);
  });

  ipcMain.on('make-no-resizable', (_) => {
    mainWindow!.setResizable(false);
  });

  ipcMain.on('make-resizable', (_) => {
    mainWindow!.setResizable(true);
  });

  ipcMain.on(
    'watchMetadata',
    async (event, baseFolder: string, callBackChannel: string) => {
      const folderExists = existsSync(
        path.join(baseFolder, 'minecraft-toolkit'),
      );

      if (!folderExists) {
        await new Promise((resolve) => {
          const watcher = chokidar.watch(baseFolder, {
            ignored: /(^|[/\\])\../, // ignore dotfiles
            persistent: true,
            depth: 0, // Only watch direct children of the parent directory
          });

          watcher.on('addDir', (dirPath) => {
            // Check if the added directory is the specific folder
            if (path.basename(dirPath) === 'minecraft-toolkit') {
              watcher.close();
              watcher.removeAllListeners();
              resolve(undefined);
            }
          });
        });
      }

      const metadataExists = existsSync(
        path.join(baseFolder, 'minecraft-toolkit', 'metadata.json'),
      );

      if (!metadataExists) {
        await new Promise((resolve) => {
          const watcher = chokidar.watch(
            path.join(baseFolder, 'minecraft-toolkit'),
            {
              ignored: /(^|[/\\])\../, // ignore dotfiles
              persistent: true,
            },
          );

          watcher.on('add', (filePath) => {
            // Check if the added file is the specific file
            if (path.basename(filePath) === 'metadata.json') {
              watcher.close();
              watcher.removeAllListeners();
              resolve(undefined);
            }
          });
        });
      }

      mainWindow!.webContents.send(callBackChannel);
    },
  );

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

  ipcMain.handle('open', (_, page: string, projectIndex: number, ...params) => {
    return new Promise((resolve) => {
      const requestId = crypto.randomBytes(16).toString('hex');

      WindowManager.create({
        parent: mainWindow!,
        page,
        params,
        projectIndex: String(projectIndex),
        requestId,
        respondRequester: resolve,
      });
    });
  });

  ipcMain.on('windowResponse', (_, requestId: string, params: any) => {
    WindowManager.onWindowMessage(requestId, params);
  });

  ipcMain.handle('getPath', async (ev, name) => {
    return app.getPath(name);
  });

  ipcMain.handle('openDialog', async (ev, options) => {
    return dialog.showOpenDialog(options);
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
      const withoutProtocol = request.url.slice(
        `textures:${path.sep}${path.sep}`.length,
      );

      const filePath = path.posix.normalize(withoutProtocol);

      return net.fetch(`file://${filePath}`);
    });

    mkdirSync(path.join(app.getPath('userData'), 'app_logs'), {
      recursive: true,
    });

    createWindow();

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
