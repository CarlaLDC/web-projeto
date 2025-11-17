
const URL = "http://localhost:3000"; 

/* ----------------------------------------------------------------------------------------------------- */

async function fetchGET(endpoint) {
    
    const response = await fetch(`${URL}${endpoint}`);

    if (!response.ok) {
        throw new Error(`Erro ${response.status} ao buscar ${endpoint}`);
    }
    return response.json();
}


/* ----------------------------------------------------------------------------------------------------- */

async function fetchPOST(endpoint, data) {

    const response = await fetch(`${URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`Erro ${response.status}: ${errorBody.message || 'Falha na requisição POST'}`);
    }
    return response.json();
}

/* ----------------------------------------------------------------------------------------------------- */

async function fetchPUT(endpoint, data) {

    const response = await fetch(`${URL}${endpoint}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`Erro ${response.status}: ${errorBody.message || 'Falha na requisição PUT'}`);
    }
    return response.json();
}

/* ----------------------------------------------------------------------------------------------------- */

async function fetchDELETE(endpoint) {

    const response = await fetch(`${URL}${endpoint}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error(`Erro ${response.status} ao deletar ${endpoint}`);
    }
    return response; 
}


/* ----------------------------------------------------------------------------------------------------- */


window.fetchGET = fetchGET;
window.fetchPOST = fetchPOST;
window.fetchPUT = fetchPUT;
window.fetchDELETE = fetchDELETE;



