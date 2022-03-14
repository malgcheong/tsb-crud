//트랜잭션 관련 endpoints
const bitcoin = require('../dev/blockchain');
const express = require('express');
const router = express.Router();
const rp = require('request-promise');

// create a new transaction
router.post('/', function(req, res) {
	const newTransaction = req.body;
	const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);
	res.json({ note: `Transaction will be added in block ${blockIndex}.` });
});

// broadcast transaction
router.post('/broadcast', function(req, res) {
	const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
	bitcoin.addTransactionToPendingTransactions(newTransaction);

	//so that we can run all the requests at the same time.
	const requestPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/transaction',
			method: 'POST',
			body: newTransaction,
			json: true
		};

		requestPromises.push(rp(requestOptions));
    });
	//let's run all of the requests.
	Promise.all(requestPromises) 
	//We're not actually going to use the data that comes back from all of these requests, 
    //but we are going to send a response, because, at this point, the entire broadcast is complete.
	.then(data => {
		res.json({ note: 'Transaction created and broadcast successfully.' });
	});
});

//만들어진 모듈을 export한다.
module.exports=router;