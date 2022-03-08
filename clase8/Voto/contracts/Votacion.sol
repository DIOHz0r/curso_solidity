pragma solidity ^0.5.4;

contract Votacion {
    struct Candidato {
        uint id;
        string nombre;
        uint cantidad;
    }

    Candidato[] public candidatos;

    uint nextId = 1;

    function createCandidate(string memory _nombre) public {
        candidatos.push(Candidato(nextId, _nombre, 0));
        nextId++;
    }

    function getVotoCandidato(uint id) public returns(uint) {
        return candidatos[find(id)].cantidad;
    }

    function find(uint id) view internal returns(uint) {
        for(uint i=0; i< candidatos.length; i++){
            if(candidatos[i].id == id){
                return i;
            }
        }
        revert('Candidato no existe');
    }

    function updateVote(uint id) public {
        uint i = find(id);
        candidatos[i].cantidad = candidatos[i].cantidad + 1;
    }

}