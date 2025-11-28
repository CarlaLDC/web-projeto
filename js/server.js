
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();

const MOCKAPI_URL = "https://691cfe80d58e64bf0d34a523.mockapi.io/produtos";



app.use(cors());
app.use(express.json());


/* ----------------------------------------------------------------------------------------------------- */
// GET listar Todos os produtos

app.get("/produtos", async (req, res) => {
    try {
        const response = await axios.get(MOCKAPI_URL);

        return res.json(response.data);
    } catch (error) {
        console.error("Erro ao buscar todos os produtos:", error.message);

        return res.status(500).json({ message: "Falha na comunicação com o serviço externo." });
    }
});


/* ----------------------------------------------------------------------------------------------------- */
// GET buscar Um produto pelo ID

app.get("/produtos/:id", async (req, res) => {
    const productId = req.params.id; 
    
    try {
        const response = await axios.get(`${MOCKAPI_URL}/${productId}`);

        return res.json(response.data);
    } catch (error) {

        if (error.response && error.response.status === 404) {
             return res.status(404).json({ message: "Produto não encontrado." });
        }
        
        console.error(`Erro ao buscar produto ${productId}:`, error.message);
        return res.status(500).json({ message: "Falha na comunicação com o serviço externo." });
    }
});

/* ----------------------------------------------------------------------------------------------------- */
// POST adicionar um novo produto

app.post("/produtos", async (req, res) => {
    const novoProduto = req.body;
    
    try {
        const response = await axios.post(MOCKAPI_URL, novoProduto);
        
        return res.status(201).json(response.data); 
    } catch (error) {
        console.error("Erro ao adicionar produto:", error.message);
        return res.status(500).json({ message: "Falha ao salvar o produto no serviço externo." });
    }
});

/* ----------------------------------------------------------------------------------------------------- */
// PUT editar produto

app.put("/produtos/:id", async (req, res) => {
    const productId = req.params.id;
    const dadosAtualizados = req.body;
    
    try {
        const response = await axios.put(`${MOCKAPI_URL}/${productId}`, dadosAtualizados);

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

app.delete("/produtos/:id", async (req, res) => {
    const productId = req.params.id;
    
    try {
        await axios.delete(`${MOCKAPI_URL}/${productId}`);
        
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


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor Express rodando na porta ${PORT} e usando o MockAPI.`);
});