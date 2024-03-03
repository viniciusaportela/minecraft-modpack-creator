import os from 'os';
import path from 'path';

export default function getMinecraftFolder() {
  if (process.platform === 'linux') {
    const home = os.homedir();
    return path.join(home, '.minecraft');
  }

  return null;
}
