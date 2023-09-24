const fs = require('fs');
const process = require('process');

if(process.argv.length > 2) {
   fs.readFile(process.argv[2], 'utf8', (err, input) => {
      if (err) throw err;

      for(let line of input.split("\n")){
         //Remove comments and whitespace
         let comment = line.indexOf("//");
         line = comment >= 0 ? line.substring(0, comment).trim() : line;
         line = line.replace(/\n|\r/g, "")
         if(!line.length) continue;
         
         console.log(line)
      }
   })
}
else{
   console.log("Program file must be specified.")
}