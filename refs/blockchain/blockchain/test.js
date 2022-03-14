const Blockchain = require('./dev/blockchain');
const bitcoin = new Blockchain();

const bc1 =
{
    "chain": [
        {
        "index": 1,
        "timestamp": 1611994073028,
        "transactions": [],
        "nonce": 100,
        "hash": "0",
        "prevBlockHash": "0"
        },
        {
        "index": 2,
        "timestamp": 1611994094457,
        "transactions": [
        {
        "amount": 1000000,
        "sender": "mungchung",
        "recipient": "Yeojin",
        "transactionId": "483a812062d211eb880647b7bfa0c12e"
        },
        {
        "amount": 1000000,
        "sender": "mungchung",
        "recipient": "Yeojin",
        "transactionId": "48669a3062d211eb880647b7bfa0c12e"
        }
        ],
        "nonce": 14188,
        "hash": "0000282425e211217d17140711abc910710e93486d91c7245a4993a70a9f0693",
        "prevBlockHash": "0"
        }
        ],
        "newTransactions": [
        {
        "amount": 12.5,
        "sender": "0",
        "recipient": "4088984062d211eb880647b7bfa0c12e",
        "transactionId": "4d4f9f1062d211eb880647b7bfa0c12e"
        }
        ],
        "currentNodeUrl": "http://164.125.121.191:3001",
        "networkNodes": [
        "http://164.125.121.192:30"
        ]
    }

console.log('VALID: ', bitcoin.chainIsValid(bc1.chain));
