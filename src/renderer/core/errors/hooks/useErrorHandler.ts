import toast from 'react-hot-toast';
import { writeFile } from 'node:fs/promises';
import { ipcRenderer } from 'electron';
import path from 'path';
import safeJsonStringify from 'safe-json-stringify';
import BusinessLogicError from '../business-logic-error';
import { useAppStore } from '../../../store/app.store';

export function useErrorHandler() {
  return async (err: Error) => {
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
  let data = JSON.stringify(err, null, 2);

  if (err instanceof Error) {
    data += `\n\n===================================\n\n`;
    data += err.stack;
  }

  data += `\n\n===================================\n\n`;
  data += `Memory Stack: ${JSON.stringify(process.memoryUsage(), null, 2)}`;

  const appState = useAppStore.getState();

  const filtered = {
    projects: appState.projects,
    selectedProject: appState.selectedProject,
    selectedProjectIndex: appState.selectedProjectIndex,
    title: appState.title,
  };

  data += `\n\n===================================\n\n`;
  data += `AppState: ${safeJsonStringify(filtered, null, 2)}`;

  await writeFile(
    path.join(
      await ipcRenderer.invoke('getPath', 'userData'),
      'app_logs',
      `${Date.now()}-error.log`,
    ),
    data,
  );
}
