const subjects = ['korean', 'math', 'social', 'science', 'english'];
const students =[
        {
            "name": "장동건",
            "korean": 50,
            "math": 95,
            "social": 100,
            "science": 85,
            "english": 70
        },
        {
            "name": "김태희",
            "korean": 70,
            "math": 85,
            "social": 95,
            "science": 100,
            "english": 80
        },
        {
            "name": "정우성",
            "korean": 100,
            "math": 80,
            "social": 70,
            "science": 55,
            "english": 100
        }
    ]



const gradecard = require('./gradeCard.js');

const express = require('express');
const app = new express();
const morgan = require('morgan');

app.set('port', 4000);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));


app.post('/add', (req, res)=>{
    let t = new gradecard.a();
    let arr = [req.body.korean, req.body.math, req.body.social, req.body.science, req.body.english];
    let newarr = arr.map(function(item){return parseInt(item);})
    t.createNewStudent(req.body.name, ...newarr);
    students.push(t);
    console.log(students);
    res.sendFile('index.html', {root: __dirname });
})
app.post('/modify', (req, res)=>{
    
    let result = students.findIndex(function(item){
        return item.name == req.body.name
    })
    if(req.body["subject"] === subjects[0]){ students[result][subjects[0]] = parseInt(req.body["score"]);}
    else if(req.body["subject"] === subjects[1]){ students[result][subjects[1]] = parseInt(req.body["score"]);}
    else if(req.body["subject"] === subjects[2]){ students[result][subjects[2]] = parseInt(req.body["score"]);}
    else if(req.body["subject"] === subjects[3]){ students[result][subjects[3]] = parseInt(req.body["score"]);}
    else if(req.body["subject"] === subjects[4]){ students[result][subjects[4]] = parseInt(req.body["score"]);}
    res.sendFile('index.html', {root: __dirname });
})

app.get('/delete', (req, res)=>{
    let result = students.findIndex(function(item){
        return item.name === req.query['name']
    })
    students.splice(result, 1);
    res.sendFile('index.html', {root: __dirname });
})
app.get('/students', (req, res)=>{
    res.send(students);
})

app.get('/gradeCard', (req, res)=>{
    res.sendFile('gradeCard.js', {root: __dirname });
})
app.get('/', (req, res)=>{
    res.sendFile('index.html', {root: __dirname });
})

app.listen(app.get('port'), ()=>{
    console.log('Waiting for connect...');
});
