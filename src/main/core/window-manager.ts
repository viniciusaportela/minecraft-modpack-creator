import { BrowserWindow } from 'electron';
import { ICreateWindow } from '../interfaces/create-window.interface';
import windowConfigs from './window-configs';
import { resolveHtmlPath } from '../util';
import { IWindowContext } from '../interfaces/window-context.interface';

export default class WindowManager {
  static windows: IWindowContext[] = [];

  static create({ page, parent, requestId, respondRequester }: ICreateWindow) {
    const config = windowConfigs[page];

    if (!config) {
      throw new Error(`Invalid window config: ${page}`);
    }

    if (config.keepAlive) {
      console.log('keepAlive', this.windows);
      const windowCtx = this.windows.find((ctx) => ctx.config.page === page);

      if (windowCtx) {
        console.log('hasWindowCtx');
        windowCtx.respondRequester = respondRequester;
        windowCtx.window.show();
        return;
      }
    }

    const window = new BrowserWindow({
      show: false,
      width: 550,
      height: 550,
      parent: parent!,
      x: parent!.getPosition()[0] + parent!.getSize()[0] / 2 - 225,
      y: parent!.getPosition()[1] + parent!.getSize()[1] / 2 - 225,
      resizable: true,
      frame: false,
      webPreferences: {
        devTools: false,
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    const ctx = {
      window,
      config,
      fromRequestId: requestId,
      respondRequester,
    };
    this.windows.push(ctx);

    window.loadURL(
      `${resolveHtmlPath('index.html')}?${new URLSearchParams({ page, requestId }).toString()}`,
    );

    window.on('ready-to-show', () => {
      parent.getPosition();
      window.show();
    });

    window.on('blur', () => {
      if (config.closeOnBlur) {
        if (config.type === 'response') {
          this.respond(ctx, null);
        }

        if (config.keepAlive) {
          ctx.window.hide();
        } else {
          ctx.window.close();
        }
      }
    });

    window.on('close', () => {
      console.log('child closed', requestId);

      if (config.type === 'response') {
        this.respond(ctx, null);
      }
    });

    if (config.type !== 'response') {
      this.respond(ctx, { windowId: requestId });
    }
  }

  private static respond(ctx: IWindowContext, params: any) {
    console.log('respond', ctx.config, params);
    if (ctx.respondRequester) {
      ctx.respondRequester(params);
      ctx.respondRequester = null;

      if (ctx.config.type === 'response' && !ctx.config.keepAlive) {
        const index = this.windows.indexOf(ctx);
        this.windows.splice(index, 1);
      }
    }
  }

  static onWindowMessage(creationRequestId: string, params: any) {
    const windowCtx = this.windows.find(
      (ctx) => ctx.fromRequestId === creationRequestId,
    );

    if (
      windowCtx &&
      windowCtx.respondRequester &&
      windowCtx.config.type === 'response'
    ) {
      this.respond(windowCtx, params);

      if (windowCtx.config.keepAlive) {
        windowCtx.window.hide();
      } else {
        windowCtx.window.close();
      }
    }
  }
}
