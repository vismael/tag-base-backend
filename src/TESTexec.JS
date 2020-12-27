const exec = require("child_process").exec;



//backup mongodb database
const cmd =
"mongodump --uri mongodb://localhost:27017/boowlk --db boowlk --out " +__dirname; // Command for mongodb dump process

console.log("DB backup started ... ");
console.log(cmd);
exec(cmd, function(error, stdout, stderr) {
    console.log(stderr,'kcyo');
   //once successful or error 
});