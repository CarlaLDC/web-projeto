const express = require("express");
const cors = require("cors");
const app = express();

// mini banco de dados
let produtos = [
    {
        id: 1,
        nome: "Chirivia",
        descricao: "Plante na primavera. Demora 4 dias para crescer.",
        preco: 20.00,
        imagemUrl: "/img/chirivia.jpg"
    },
    {
        id: 2,
        nome: "Sementes do Verão",
        descricao: "Plante no verão. Cresce em 6 dias.",
        preco: 30.50,
        imagemUrl: "/img/semente_verao.png"
    }
];

// --- Configuração Middleware ---

app.use(cors()); 
app.use(express.json()); // necessário para ler o corpo (body) das requisições POST/PUT


/* ----------------------------------------------------------------------------------------------------- */

//GET listar Todos

app.get("/produtos", (req, res) => {
    return res.json(produtos);
});


/* ----------------------------------------------------------------------------------------------------- */

//GET buscar Um para Edição

app.get("/produtos/:id", (req, res) => {
    
    const idToFind = parseInt(req.params.id);
    const produto = produtos.find(p => p.id === idToFind);
    
    if (produto) {
        return res.json(produto);
    } 
    
    else {
        return res.status(404).json({ message: "Produto não encontrado." });
    }
});

/* ----------------------------------------------------------------------------------------------------- */


//POST adicionar 
app.post("/produtos", (req, res) => {

    const novoProduto = req.body;
    
    // Gera um novo ID
    novoProduto.id = produtos.length > 0 ? produtos[produtos.length - 1].id + 1 : 1;
    
    produtos.push(novoProduto);
    
    return res.status(201).json(novoProduto); 
});

/* ----------------------------------------------------------------------------------------------------- */

//PUT editar produto

app.put("/produtos/:id", (req, res) => {

    const idToUpdate = parseInt(req.params.id);
    const dadosAtualizados = req.body;
    let produtoAtualizado = null;
    
    produtos = produtos.map(p => {
        if (p.id === idToUpdate) {
            // Retorna o objeto com os dados atualizados, mantendo o ID original
            produtoAtualizado = { ...p, ...dadosAtualizados, id: idToUpdate }; 
            return produtoAtualizado;
        }

        return p;
    });

    if (produtoAtualizado) {
        return res.json(produtoAtualizado);
    } 
    
    else {
        return res.status(404).json({ message: "Produto não encontrado para atualização." });
    }
});

/* ----------------------------------------------------------------------------------------------------- */

// DELETE deletar produto

app.delete("/produtos/:id", (req, res) => {

    const idToDelete = parseInt(req.params.id);
    const initialLength = produtos.length;
    
    produtos = produtos.filter(p => p.id !== idToDelete);
    
    if (produtos.length < initialLength) {
        return res.status(204).send();
    } 
    
    else {
        return res.status(404).json({ message: "Produto não encontrado." });
    }
});


/* ----------------------------------------------------------------------------------------------------- */
//porta

app.listen(5500, () => {
    console.log("Servidor rodando na porta 3000.");
});