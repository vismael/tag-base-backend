
const cron = require('node-cron'), spawn = require('child_process').spawn;

let dbBackupTask = cron.schedule('07 10 * * *', () => {
  let backupProcess = spawn('mongodump', [
      '--uri=mongodb://localhost:27017/boowlk',
      '--db=boowlk',
      '--out='+  __dirname,
      '--gzip'
    ]);

  backupProcess.on('exit', (code, signal) => {
      if(code) 
          console.log('Backup process exited with code ', code);
      else if (signal)
          console.error('Backup process was killed with singal ', signal);
      else 
          console.log('Successfully backedup the database')
  });

});