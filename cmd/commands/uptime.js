const os = require('os');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = {
  name: 'uptime',
  role: 0,
  prefix: false,
  description: 'Display system information.',
};

module.exports.run = async ({ api, event }) => {
  try {
    const hostname = os.hostname();
    const platform = os.platform();
    const arch = os.arch();
    const release = os.release();
    const totalMemory = Math.round(os.totalmem() / 1024 / 1024); // in MB
    const freeMemory = Math.round(os.freemem() / 1024 / 1024); // in MB
    const cpus = os.cpus();
    const uptime = os.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    // Get disk usage
    const { stdout: diskUsage } = await exec('df -h /');
    const diskInfo = diskUsage.split('\n')[1].split(/\s+/);

    // Get ping to Google DNS (8.8.8.8)
    const { stdout: pingOutput } = await exec('ping -c 1 8.8.8.8');
    const pingRegex = /time=(\d+\.\d+) ms/;
    const pingMatch = pingRegex.exec(pingOutput);
    const pingTime = pingMatch ? pingMatch[1] : 'N/A';

    const response = `
🖥️ **System Information**
- Hostname: ${hostname}
- Platform: ${platform}
- Architecture: ${arch}
- Kernel Release: ${release}
- CPU: @ ${cpuSpeed.toFixed(2)} GHz
- Total RAM: ${totalMemory} MB
- Free RAM: ${freeMemory} MB
- Uptime: ${hours}h ${minutes}m ${seconds}s
- Root Disk Usage: ${diskInfo[4]} used out of ${diskInfo[1]}
- Ping to 8.8.8.8: ${pingTime} ms`;

    api.sendMessage(response, event.threadID);
  } catch (err) {
    console.error(err);
    api.sendMessage('❌ Error fetching system information.', event.threadID);
  }
};
