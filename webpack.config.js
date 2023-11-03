const path = require('path'); 
module.exports = {
    entry: './assets/js/scheduler.js', // give the path to the scheduler file
output: {
     path: path.resolve(__dirname, 'dist'),
     filename: 'bundle.js'
     }
};
