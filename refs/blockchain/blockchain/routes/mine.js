//채굴 endpoints
const bitcoin = require('../dev/blockchain');
const express = require('express');
const router = express.Router();
const rp = require('request-promise');
const {v1:uuid} = require("uuid");
var nodeAddress= uuid().split('-').join('');

// mine a block
router.post('/', function(req, res) {
	const lastBlock = bitcoin.getLastBlock();
	const preBlockHash = lastBlock['hash'];
	const currentBlockData = {
		transactions: bitcoin.newTransactions,
		index: lastBlock['index'] + 1
	};
	const nonce = bitcoin.proofOfWork(preBlockHash, currentBlockData);
	const blockHash = bitcoin.hashBlock(preBlockHash, currentBlockData, nonce);
	const newBlock = bitcoin.createNewBlock(nonce, preBlockHash, blockHash);

	const requestPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/mine/receive-new-block',
			method: 'POST',
			body: { newBlock: newBlock },
			json: true
		};

		requestPromises.push(rp(requestOptions));
	});

	Promise.all(requestPromises)
	.then(data => {
		const requestOptions = {
			uri: bitcoin.currentNodeUrl + '/transaction/broadcast',
			method: 'POST',
			body: {
				amount: 12.5,
				sender: "00",
				recipient: nodeAddress
			},
			json: true
		};
	
		return rp(requestOptions);
	})
	.then(data => {
		res.json({
			note: "New block mined & broadcast successfully",
			block: newBlock
		});
	});
});


// receive new block
router.post('/receive-new-block', function(req, res) {
	const newBlock = req.body.newBlock;
	const lastBlock = bitcoin.getLastBlock();
	const correctHash = lastBlock.hash === newBlock.prevBlockHash; 
	const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

	if (correctHash && correctIndex) {
		bitcoin.chain.push(newBlock);
		bitcoin.newTransactions = [];
		res.json({
			note: 'New block received and accepted.',
			newBlock: newBlock
		});
	} else {
		res.json({
			note: 'New block rejected.',
			newBlock: newBlock
		});
	}
});

//만들어진 모듈을 export한다.
module.exports=router;