import toast from 'react-hot-toast';
import { writeFile } from 'node:fs/promises';
import { ipcRenderer } from 'electron';
import path from 'path';
import BusinessLogicError from '../business-logic-error';
import { useAppStore } from '../../../store/app.store';
import { GlobalStateModel } from '../../models/global-state.model';

export function useErrorHandler() {
  return async (err: unknown) => {
    console.error(err?.stack);

    if (err instanceof BusinessLogicError) {
      toast.error(err.message);
    } else {
      toast.error('An unexpected error occurred');
    }

    await writeErrorLog(err);
  };
}

async function writeErrorLog(err: unknown) {
  const { realm } = useAppStore.getState();
  let data = JSON.stringify(err, null, 2);

  if (err instanceof Error) {
    data += `\n\n===================================\n\n`;
    data += err.stack;
  }

  data += `\n\n===================================\n\n`;
  data += `Stack: ${JSON.stringify(process.memoryUsage(), null, 2)}`;

  data += `\n\n===================================\n\n`;
  data += `GlobalState: ${JSON.stringify(realm.objects(GlobalStateModel)[0].toJSON() ?? {}, null, 2)}`;

  await writeFile(
    path.join(
      await ipcRenderer.invoke('getPath', 'userData'),
      'app_logs',
      `${Date.now()}-error.log`,
    ),
    data,
  );
}
