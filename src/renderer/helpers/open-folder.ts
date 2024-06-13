import { exec } from 'node:child_process';
import { shell } from 'electron';

export default function openFolder(folderPath: string) {
  if (process.platform === 'win32') {
    exec(`start "" "${folderPath}"`);
  } else {
    shell.openPath(folderPath);
  }
}
