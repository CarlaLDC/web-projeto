// const express = require("express");
// const cors = require("cors");
// const app = express();

// // // mini banco de dados
// // let produtos = [
// //     {
// //         id: 1,
// //         nome: "Chirivia",
// //         descricao: "Plante na primavera. Demora 4 dias para crescer.",
// //         preco: 20.00,
// //         imagemUrl: "/img/chirivia.jpg"
// //     },
// //     {
// //         id: 2,
// //         nome: "Sementes do Verão",
// //         descricao: "Plante no verão. Cresce em 6 dias.",
// //         preco: 30.50,
// //         imagemUrl: "/img/semente_verao.png"
// //     }
// // ];

// let produtos = "https://691cfe80d58e64bf0d34a523.mockapi.io/produtos/produtos";

// // --- Configuração Middleware ---

// app.use(cors()); 
// app.use(express.json()); // necessário para ler o corpo (body) das requisições POST/PUT


// /* ----------------------------------------------------------------------------------------------------- */

// //GET listar Todos

// app.get("/produtos", (req, res) => {
//     return res.json(produtos);
// });


// /* ----------------------------------------------------------------------------------------------------- */

// //GET buscar Um para Edição

// app.get("/produtos/:id", (req, res) => {
    
//     const idToFind = parseInt(req.params.id);
//     const produto = produtos.find(p => p.id === idToFind);
    
//     if (produto) {
//         return res.json(produto);
//     } 
    
//     else {
//         return res.status(404).json({ message: "Produto não encontrado." });
//     }
// });

// /* ----------------------------------------------------------------------------------------------------- */


// //POST adicionar 
// app.post("/produtos", (req, res) => {

//     const novoProduto = req.body;
    
//     // Gera um novo ID
//     novoProduto.id = produtos.length > 0 ? produtos[produtos.length - 1].id + 1 : 1;
    
//     produtos.push(novoProduto);
    
//     return res.status(201).json(novoProduto); 
// });

// /* ----------------------------------------------------------------------------------------------------- */

// //PUT editar produto

// app.put("/produtos/:id", (req, res) => {

//     const idToUpdate = parseInt(req.params.id);
//     const dadosAtualizados = req.body;
//     let produtoAtualizado = null;
    
//     produtos = produtos.map(p => {
//         if (p.id === idToUpdate) {
//             // Retorna o objeto com os dados atualizados, mantendo o ID original
//             produtoAtualizado = { ...p, ...dadosAtualizados, id: idToUpdate }; 
//             return produtoAtualizado;
//         }

//         return p;
//     });

//     if (produtoAtualizado) {
//         return res.json(produtoAtualizado);
//     } 
    
//     else {
//         return res.status(404).json({ message: "Produto não encontrado para atualização." });
//     }
// });

// /* ----------------------------------------------------------------------------------------------------- */

// // DELETE deletar produto

// app.delete("/produtos/:id", (req, res) => {

//     const idToDelete = parseInt(req.params.id);
//     const initialLength = produtos.length;
    
//     produtos = produtos.filter(p => p.id !== idToDelete);
    
//     if (produtos.length < initialLength) {
//         return res.status(204).send();
//     } 
    
//     else {
//         return res.status(404).json({ message: "Produto não encontrado." });
//     }
// });


// /* ----------------------------------------------------------------------------------------------------- */
// //porta

// app.listen(5502, () => {
//     console.log("Servidor rodando na porta 3000.");
// });



// Para usar este código, você deve primeiro instalar o axios: npm install axios

const express = require("express");
const cors = require("cors");
const axios = require("axios"); // Importa a biblioteca axios para fazer requisições HTTP
const app = express();

// // URL Base do seu endpoint no MockAPI
const MOCKAPI_URL = "https://691cfe80d58e64bf0d34a523.mockapi.io/";

// --- Configuração Middleware ---

app.use(cors());
app.use(express.json()); // Necessário para ler o corpo (body) das requisições POST/PUT


/* ----------------------------------------------------------------------------------------------------- */

// GET listar Todos os produtos
// Faz uma requisição GET para o MockAPI
app.get("/produtos", async (req, res) => {
    try {
        const response = await axios.get(MOCKAPI_URL);
        // Retorna os dados que vieram do MockAPI
        return res.json(response.data);
    } catch (error) {
        console.error("Erro ao buscar todos os produtos:", error.message);
        // Retorna um erro 500 se o MockAPI estiver inacessível
        return res.status(500).json({ message: "Falha na comunicação com o serviço externo." });
    }
});


/* ----------------------------------------------------------------------------------------------------- */

// GET buscar Um produto pelo ID
// Faz uma requisição GET com o ID na URL para o MockAPI
app.get("/produtos/:id", async (req, res) => {
    const productId = req.params.id; // O ID já é uma string, não precisa de parseInt
    
    try {
        const response = await axios.get(`${MOCKAPI_URL}/${productId}`);
        // Se a requisição for bem-sucedida, retorna o produto
        return res.json(response.data);
    } catch (error) {
        // O MockAPI retorna erro 404 para item não encontrado
        if (error.response && error.response.status === 404) {
             return res.status(404).json({ message: "Produto não encontrado." });
        }
        
        console.error(`Erro ao buscar produto ${productId}:`, error.message);
        return res.status(500).json({ message: "Falha na comunicação com o serviço externo." });
    }
});

/* ----------------------------------------------------------------------------------------------------- */


// POST adicionar um novo produto
// Envia o corpo da requisição para o MockAPI
app.post("/produtos", async (req, res) => {
    const novoProduto = req.body;
    
    try {
        // O MockAPI gera o ID automaticamente, então apenas enviamos o body
        const response = await axios.post(MOCKAPI_URL, novoProduto);
        
        // Retorna o produto criado (com o ID gerado pelo MockAPI) e status 201
        return res.status(201).json(response.data); 
    } catch (error) {
        console.error("Erro ao adicionar produto:", error.message);
        return res.status(500).json({ message: "Falha ao salvar o produto no serviço externo." });
    }
});

/* ----------------------------------------------------------------------------------------------------- */

// PUT editar produto
// Envia os dados atualizados para o MockAPI usando o ID na URL
app.put("/produtos/:id", async (req, res) => {
    const productId = req.params.id;
    const dadosAtualizados = req.body;
    
    try {
        const response = await axios.put(`${MOCKAPI_URL}/${productId}`, dadosAtualizados);

        // Retorna o produto com os dados atualizados
        return res.json(response.data);
    } catch (error) {
        if (error.response && error.response.status === 404) {
             return res.status(404).json({ message: "Produto não encontrado para atualização." });
        }
        
        console.error(`Erro ao atualizar produto ${productId}:`, error.message);
        return res.status(500).json({ message: "Falha na comunicação com o serviço externo." });
    }
});

/* ----------------------------------------------------------------------------------------------------- */

// DELETE deletar produto
// Envia uma requisição DELETE para o MockAPI usando o ID na URL
app.delete("/produtos/:id", async (req, res) => {
    const productId = req.params.id;
    
    try {
        await axios.delete(`${MOCKAPI_URL}/${productId}`);
        
        // Retorna status 204 (No Content) para indicar sucesso sem corpo de resposta
        return res.status(204).send();
    } catch (error) {
        if (error.response && error.response.status === 404) {
             return res.status(404).json({ message: "Produto não encontrado para exclusão." });
        }
        
        console.error(`Erro ao deletar produto ${productId}:`, error.message);
        return res.status(500).json({ message: "Falha na comunicação com o serviço externo." });
    }
});


/* ----------------------------------------------------------------------------------------------------- */
// Inicia o servidor na porta 5502

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor Express rodando na porta ${PORT} e usando o MockAPI.`);
});