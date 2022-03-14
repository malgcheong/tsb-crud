const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const { v1: uuid } = require('uuid');

function Blockchain() {
	this.chain = [];
	this.newTransactions = [];

	this.currentNodeUrl = currentNodeUrl;
	this.networkNodes = [];

	this.createNewBlock(100, '0', '0');
};


Blockchain.prototype.createNewBlock = function(nonce, prevBlockHash, hash) {
	const newBlock = {
		index: this.chain.length + 1,
		timestamp: Date.now(),
		transactions: this.newTransactions,
		nonce: nonce,
		hash: hash,
		prevBlockHash: prevBlockHash
	};

	this.newTransactions = [];
	this.chain.push(newBlock);

	return newBlock;
};


Blockchain.prototype.getLastBlock = function() {
	return this.chain[this.chain.length - 1];
};


Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
	const newTransaction = {
		amount: amount,
		sender: sender,
		recipient: recipient,
		transactionId: uuid().split('-').join('')
	};

	return newTransaction;
};


Blockchain.prototype.addTransactionToPendingTransactions = function(transactionObj) {
	this.newTransactions.push(transactionObj);
	return this.getLastBlock()['index'] + 1; 
};


Blockchain.prototype.hashBlock = function(preBlockHash, currentBlockData, nonce) {
	const dataAsString = preBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
	const hash = sha256(dataAsString);
	return hash;
};


Blockchain.prototype.proofOfWork = function(preBlockHash, currentBlockData) {
	let nonce = 0;
	let hash = this.hashBlock(preBlockHash, currentBlockData, nonce);
	while (hash.substring(0, 4) !== '0000') {
		nonce++;
		hash = this.hashBlock(preBlockHash, currentBlockData, nonce);
	}

	return nonce;
};

//blockchain 검증하는 이유
//There could even be a bad actor inside of the blockchain network, 
//who is sending out falseinformation or creating fraudulent transactions 
//on their copy of a blockchain, and trying tobroadcast them to the whole network 
//to convince everybody that they are legitimatetransactions.
//메서드 설명
//Now, this method will take in a blockchain as an argument, and will return to us whether the blockchain is valid or not:
Blockchain.prototype.chainIsValid = function(blockchain) {

	let validChain = true;

	for (var i = 1; i < blockchain.length; i++) {
		const currentBlock = blockchain[i];
		const prevBlock = blockchain[i - 1];
		const blockHash = this.hashBlock(prevBlock['hash'], { transactions: currentBlock['transactions'], index: currentBlock['index'] }, currentBlock['nonce']);
		console.log('prevBlockHash =>', prevBlock ['hash']);
		console.log('currentBlockHash =>', currentBlock ['hash']);
		
		if (blockHash.substring(0, 4) !== '0000') validChain = false;
		if (currentBlock['prevBlockHash'] !== prevBlock['hash']) validChain = false;
	};

	const genesisBlock = blockchain[0];
	const correctNonce = genesisBlock['nonce'] === 100;
	const correctprevBlockHash = genesisBlock['prevBlockHash'] === '0';
	const correctHash = genesisBlock['hash'] === '0';
	const correctTransactions = genesisBlock['transactions'].length === 0;

	if (!correctNonce || !correctprevBlockHash || !correctHash || !correctTransactions) validChain = false;

	return validChain;
};


Blockchain.prototype.getBlock = function(blockHash) {
	let correctBlock = null;
	this.chain.forEach(block => {
		if (block.hash === blockHash) correctBlock = block;
	});
	return correctBlock;
};


Blockchain.prototype.getTransaction = function(transactionId) {
	let correctTransaction = null;
	let correctBlock = null;

	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if (transaction.transactionId === transactionId) {
				correctTransaction = transaction;
				correctBlock = block;
			};
		});
	});

	return {
		transaction: correctTransaction,
		block: correctBlock
	};
};


Blockchain.prototype.getAddressData = function(address) {
	const addressTransactions = [];
	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if(transaction.sender === address || transaction.recipient === address) {
				addressTransactions.push(transaction);
			};
		});
	});

	let balance = 0;
	addressTransactions.forEach(transaction => {
		if (transaction.recipient === address) balance += transaction.amount;
		else if (transaction.sender === address) balance -= transaction.amount;
	});

	return {
		addressTransactions: addressTransactions,
		addressBalance: balance
	};
};





const bitcoin = new Blockchain();
module.exports = bitcoin;












