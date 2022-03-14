const express=require('express');
const app=new express();
const morgan=require('morgan');

app.use(morgan('dev'));

app.get('/', (req, res)=>{
    res.send("Hello1");
});

app.get('/test', (req, res)=>{
    res.send(`Hello Test`);
});

app.get('/test/body', (req, res)=>{
    res.send(`Hello body`);
});

app.get('/test/:idd', (req, res)=>{
    console.log(req.params);
    res.send(`Hello:${req.params.idd}`);
});

app.listen(4000, console.log('waiting 4000...'));