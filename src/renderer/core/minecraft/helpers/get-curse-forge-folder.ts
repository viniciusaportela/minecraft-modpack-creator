import os from 'os';
import path from 'path';

export default function getCurseForgeFolder() {
  if (process.platform === 'linux') {
    const home = os.homedir();
    return path.join(home, 'Documents', 'curseforge', 'minecraft', 'Instances');
  }

  return null;
}
