//합의 endpoints
const bitcoin = require('../dev/blockchain');
const express = require('express');
const router = express.Router();
const rp = require('request-promise');

//For our blockchain network, we're going to create a consensus algorithm that implements the longest chain rule
// consensus
router.get('/', function(req, res) {
	const requestPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/blockchain',
			method: 'GET',
			json: true
		};

		requestPromises.push(rp(requestOptions));
	});

	Promise.all(requestPromises)
	.then(blockchains => {
		const currentChainLength = bitcoin.chain.length;
		let maxChainLength = currentChainLength;
		let newLongestChain = null;
		let newTransactions = bitcoin.newTransactions;

		blockchains.forEach(blockchain => {
			if (blockchain.chain.length > maxChainLength) {
				maxChainLength = blockchain.chain.length;
				newLongestChain = blockchain.chain;
				newTransactions = blockchain.newTransactions;
			}
			else if (blockchain.chain.length == maxChainLength) {
				if( newTransactions.length < blockchain.newTransactions.length){
					newLongestChain = blockchain.chain;
					newTransactions = blockchain.newTransactions;
				}
			}
		});

		if (!newLongestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain))) {
			res.json({
				note: 'Current chain has not been replaced.',
				chain: bitcoin.chain
			});
		}
		else {
			bitcoin.chain = newLongestChain;
			bitcoin.newTransactions = newTransactions;
			res.json({
				note: 'This chain has been replaced.',
				chain: bitcoin.chain
			});
		
		}
	});
});

//만들어진 모듈을 export한다.
module.exports=router;