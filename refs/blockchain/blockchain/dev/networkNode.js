//express안에 body-parser가 이제 내장 되어 있으므로 
//아래의 코드보단 그냥 express를 use하는 것이 나아보인다.
// const bodyParser = require('body-parser');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//모건 사용(https://backback.tistory.com/335)
const morgan = require('morgan');
app.use(morgan('dev'));  

//dotenv 사용
require('dotenv').config();
app.set('port', process.env.PORT || 4000);  //여기서 or연산자는 뒷부분을 default로 만드는 역할을 한다.
const port = process.argv[2];
//const port = app.get('port');

//routes폴더 사용
//routes/index.js
const routerindex = require('../routes/index');
app.use('/blockchain',routerindex);
//routes/register.js
const routerregister = require('../routes/register');
app.use('/register',routerregister);
//routes/transaction.js
const routertransaction = require('../routes/transaction');
app.use('/transaction',routertransaction);
//routes/mine.js
const routermine = require('../routes/mine');
app.use('/mine',routermine);
//routes/consensus.js
const routerconsensus = require('../routes/consensus');
app.use('/consensus',routerconsensus);
//routes/explorer.js
const routerexplorer = require('../routes/explorer');
app.use('/explorer',routerexplorer);

app.listen(port, function() {
	console.log(`Listening on port ${port}...`);
});




