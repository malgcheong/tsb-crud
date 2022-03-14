//'/blockchain'으로 처리
const bitcoin = require('../dev/blockchain');
const express = require('express');
const router = express.Router();

//routes/index.js에서 '/'는 라우팅을 위한 경로와는 상관없이 '/'로 처리한다.
// get entire blockchain
router.get('/', function(req, res) {
    res.send(bitcoin);
  });

//만들어진 모듈을 export한다.
module.exports=router;
