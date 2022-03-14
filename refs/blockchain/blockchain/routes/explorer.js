//탐색기 endpoints
const bitcoin = require('../dev/blockchain');
const express = require('express');
const router = express.Router();

//In order for the block explorer to function correctly, we'll need to query the 
//blockchain foraddresses, block hashes, and transaction IDs 
//so that we can search for a particular parameter and get that particular piece of data in return.
// get block by blockHash
router.get('/block/:blockHash', function(req, res) { 
	const blockHash = req.params.blockHash;
	const correctBlock = bitcoin.getBlock(blockHash);
	res.json({
		block: correctBlock
	});
});

// get transaction by transactionId
router.get('/transaction/:transactionId', function(req, res) {
	const transactionId = req.params.transactionId;
	const trasactionData = bitcoin.getTransaction(transactionId);
	res.json({
		transaction: trasactionData.transaction,
		block: trasactionData.block
	});
});

// get address by address
router.get('/address/:address', function(req, res) {
	const address = req.params.address;
	const addressData = bitcoin.getAddressData(address);
	res.json({
		addressData: addressData
	});
});

// block explorer
router.get('/block-explorer', function(req, res) {
	res.sendFile('/block-explorer/index.html', { root: __dirname });
});

//만들어진 모듈을 export한다.
module.exports=router;
