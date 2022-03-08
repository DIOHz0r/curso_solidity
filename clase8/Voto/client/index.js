import Web3 from "web3";
import Votacion from "../build/contracts/Votacion.json";

let web3
let votacion

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
    const deploymentKey = Object.keys(Votacion.networks)[0]
    return new web3.eth.Contract(
        Votacion.abi, Votacion.networks[deploymentKey].address
    )
}

const initApp = () => {
    const create = document.getElementById('create')
    const createResult = document.getElementById('create-result')
    const votar = document.getElementById('votar')
    const mensaje = document.getElementById('mensaje')
    let accounts = []

    //get metamask account
    web3.eth.getAccounts()
        .then(_accounts => {
            accounts = _accounts;
        })

    //capture input value and create candidate
    create.addEventListener('submit', (e) => {
        e.preventDefault()
        const name = e.target.elements[0].value
        votacion.methods.createCandidate(name).send({
            form: accounts[0]
        }).then(result => {
            createResult.innerHTML = 'Candidato ${name} creado exitosamente'
        }).catch(_e => {
            createResult.innerHTML = 'Hubo un error creando el candidato'
        })
    })

    const obtenerValorCelda = (c) => {
        if (c === 1) {
            return 1;
        }
        if (c === 2) {
            return 3;
        }
        if (c === 3) {
            return 5;
        }
        if (c === 4) {
            return 7;
        }
        return -1;
    }
    const obtenerVotos = (v) => {
        const celdaAux = obtenerValorCelda(v);
        const celda = document.getElementById('td')[celdaAux]
        votacion.methods.getVotoCandidato(v).call().then(result => {
            celda.innerHTML = result
        })
    }

    //capture input value and update page result
    votar.addEventListener('submit', (e) => {
        e.preventDefault()
        const id = e.target.elements[0].value
        votacion.methods.updateVote(id).send({from: accounts[0]})
            .then(result=>{
                obtenerVotos(id)
                mensaje.innerHTML = 'Se actualizo los votos al candidato ${id}'
            })
            .catch(_e => {
                mensaje.innerHTML = 'Se al actualizar  los votos al candidato ${id}'
            })
    })
}

//init all
document.addEventListener('DOMContentLoaded', () => {
    initWeb3()
        .then(_web3 => {
            web3 = _web3
            votacion = initContract()
            initApp()
        })
        .catch(e => console.log(e.message))
})