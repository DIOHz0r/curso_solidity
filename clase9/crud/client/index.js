import Web3 from "web3";
import Crud from "../build/contracts/Crud.json";

let web3
let crud

const initWeb3 = () => {
    return new Promise((resolve, reject) => {
        //case 1: new metamask is present
        if (typeof window.ethereum !== 'undefined') {
            const web3 = new Web3(window.ethereum)
            window.ethereum.enable()
                .then(() => {
                    resolve(new Web3(window.ethereum))
                })
                .catch(e => {
                    reject(e)
                })
        }

        //case 2: old metamask is present
        if (typeof window.web3 !== 'undefined') {
            return resolve(new Web3(window.web3.currentProvider))
        }

        //case 3: no metamask present, connect to ganache
        resolve(new Web3('http://localhost:9545'))
    })
}

const initContract = () => {
    const deploymentKey = Object.keys(Crud.networks)[0]
    return new web3.eth.Contract(
        Crud.abi, Crud.networks[deploymentKey].address
    )
}

const initApp = () => {
    const create = document.getElementById('create')
    const createResult = document.getElementById('create-result')
    const read = document.getElementById('read')
    const readResult = document.getElementById('read-result')
    const edit = document.getElementById('edit')
    const editResult = document.getElementById('edit-result')
    const _delete = document.getElementById('delete')
    const deleteResult = document.getElementById('delete-result')

    let accounts = []

    //get metamask account
    web3.eth.getAccounts()
        .then(_accounts => {
            accounts = _accounts;
        })

    create.addEventListener('submit', (e) => {
        const value = e.target.elements[0].value;
        crud.methods.create(value).send({from: accounts[0]})
            .then(result => {
                createResult.innerHTML = 'New User ${name} successfully created';
            })
            .catch(e => {
                createResult.innerHTML = 'Opps there was an error creating the registry';
            })
    })

    read.addEventListener('submit', (e) => {
        const id = e.target.elements[0].value;
        crud.methods.read(id).call()
            .then(result => {
                readResult.innerHTML = 'Id: ${result[0]} Name: ${result[1]}';
            })
            .catch(e => {
                readResult.innerHTML = 'Opps there was an error reading the registry';
            })
    })

    edit.addEventListener('submit', (e) => {
        const id = e.target.elements[0].value;
        const name = e.target.elements[1].value;
        crud.methods.update(id, name).send({from: accounts[0]})
            .then(result => {
                editResult.innerHTML = 'New User ${id} successfully updated';
            })
            .catch(e => {
                editResult.innerHTML = 'Opps there was an error creating the registry';
            })
    })

    _delete.addEventListener('submit', (e) => {
        const id = e.target.elements[0].value;
        crud.methods.read(id).call()
            .then(result => {
                deleteResult.innerHTML = 'User ${result[0]} deleted';
            })
            .catch(e => {
                deleteResult.innerHTML = 'Opps there was an error deleting the registry';
            })
    })
}

//init all
document.addEventListener('DOMContentLoaded', () => {
    initWeb3()
        .then(_web3 => {
            web3 = _web3
            crud = initContract()
            initApp()
        })
        .catch(e => console.log(e.message))
})