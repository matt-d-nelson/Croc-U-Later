//Import modules
const express = require('express');
const calcRouter = require('./modules/calculator');

//Constants
const app = express();
const port = 5000;

//app configuration
app.listen(port, ()=>{
    console.log('server up on:', port);
});

app.use(express.static('./server/public'));
app.use('/', calcRouter);