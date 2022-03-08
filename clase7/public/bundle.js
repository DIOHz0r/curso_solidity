let ABI = [
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "x",
                "type": "uint256"
            }
        ],
        "name": "set",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "get",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
]

let contractAddress = '0x4b7C1fcF3FA90180f1c0F9016398E78EdD77CF51';
let web3 = new Web3('http://localhost:9545');
let simpleStorage = new web3.eth.Contract(ABI, contractAddress);

document.addEventListener('DOMContentLoaded', () => {
    let formData = document.getElementById('formData');
    let data = document.getElementById('data');
    let accounts = [];

    web3.eth.getAccounts().then(_accounts => {
        accounts = _accounts;
    });

    const getData = () => {
        simpleStorage.methods
            .get()
            .call()
            .then(result => {
            data.innerHTML = result;
        })
    };

    getData();

    formData.addEventListener('submit', e => {
        e.preventDefault();
        const data = e.target.elements[0].value;
        simpleStorage.methods
            .set(data)
            .send({from: accounts[0]})
            .then(getData);
    });
});