
let produtoEdicaoId = null; 


document.addEventListener('DOMContentLoaded', function() {
    
    const usuarioLogadoJSON = localStorage.getItem('usuario');
    let usuarioLogado;

    try {
        usuarioLogado = JSON.parse(usuarioLogadoJSON);
    } catch (e) {
        usuarioLogado = null; 
    }

    if (!usuarioLogado || usuarioLogado.isAdmin !== true) {
        alert("Acesso negado. Você precisa ser administrador.");
        window.location.href = 'login.html';
        return; 
    }
    
    listarProdutos();

/* ----------------------------------------------------------------------------------------------------- */

    document.getElementById('btnAdicionar').addEventListener('click', () => {
        const adicionar = document.getElementById('adicionarProduto');

        if (adicionar.style.display === 'none') {
            fecharForm(); 
            adicionar.style.display = 'block';
        } 
        
        else {
            adicionar.style.display = 'none';
        }
    });

    /* ----------------------------------------------------------------------------------------------------- */

    // Adicionar/Editar Produto (POST ou PUT)
    document.getElementById('produtoForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const form = event.target;
        const dadosProduto = {
            nome: form.nome.value,
            preco: parseFloat(form.preco.value), 
            descricao: form.descricao.value,
            imagemUrl: form.imagemUrl.value
        };

        try {
            if (produtoEdicaoId) {
                await fetchPUT(`/produtos/${produtoEdicaoId}`, dadosProduto); 
                alert(`Produto editado com sucesso!`);
            } 
            
            else {
                await fetchPOST('/produtos', dadosProduto); 
                alert('Produto adicionado com sucesso!');
            }
            
            fecharForm();
            listarProdutos(); 
            
        } catch (error) {
            console.error('Erro ao salvar produto:', error);
            alert(`Erro ao salvar produto: ${error.message}. Verifique o console.`);
        }
    });

});

/* ----------------------------------------------------------------------------------------------------- */
// Criar no index o card quando for inserido o produto, same as filter-web

function criarCardProduto(produto) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <img src="${produto.imageUrl || '/img/placeholder.jpg'}" alt="${produto.nome}">
        <div class="textos">
            <h3 style="margin-bottom: 3px;">${produto.nome}</h3>         
            <span>R$ ${produto.preco ? produto.preco.toFixed(2).replace('.', ',') : 'N/A'}</span>
            <p style="margin-top: 4px;">${produto.descricao}</p>

            <button 
                type="button" 
                onclick="abrirFormEdicao(${produto.id})" 
                data-produto-id="${produto.id}">
                Editar
            </button>
            <button 
                type="button" 
                onclick="deletarProduto(${produto.id})" 
                data-produto-id="${produto.id}">
                Deletar
            </button>
        </div>
    `;
    return card;
}

/* ----------------------------------------------------------------------------------------------------- */

// Listar Produtos
async function listarProdutos() {
    const container = document.getElementById('lista-produtos');
    container.innerHTML = 'Carregando produtos...';
    
    try {
        const produtos = await fetchGET('/produtos'); 
        
        container.innerHTML = ''; 
        
        if (produtos && produtos.length > 0) {
            produtos.forEach(produto => {
                container.appendChild(criarCardProduto(produto));
            });
        } 
        
        else {
            container.innerHTML = '<p>Nenhum produto cadastrado.</p>';
        }

    } catch (error) {
        console.error('Erro ao listar produtos:', error);
        container.innerHTML = `<p style="color: red;">Erro ao carregar os produtos: ${error.message}. Verifique sua API.</p>`;
    }
}

/* ----------------------------------------------------------------------------------------------------- */

// **Função Principal de Edição (Busca e Preenche)**
async function abrirFormEdicao(produtoId) {
    try {
        const produto = await fetchGET(`/produtos/${produtoId}`);
        
        if (!produto) {
            alert("Produto não encontrado.");
            return;
        }
        produtoEdicaoId = produtoId;
        document.querySelector('#adicionarProduto h3').textContent = `Editar Produto: ${produtoId}`;

        const form = document.getElementById('produtoForm');
        form.nome.value = produto.nome;
        form.preco.value = produto.preco;
        form.descricao.value = produto.descricao;
        form.imagemUrl.value = produto.imagemUrl;
        
        document.getElementById('adicionarProduto').style.display = 'block';

    } catch (error) {
        console.error('Erro ao abrir edição:', error);
        alert(`Não foi possível carregar o produto para edição: ${error.message}.`);
    }
}

/* ----------------------------------------------------------------------------------------------------- */
// Deletar Produto

async function deletarProduto(produtoId) {
    if (!confirm(`Tem certeza que deseja DELETAR este produto?`)) {
        return;
    }

    try {
        await fetchDELETE(`/produtos/${produtoId}`);
        alert('Produto deletado com sucesso!');
        listarProdutos(); 
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        alert(`Erro ao deletar produto: ${error.message}. Verifique o console.`);
    }
}

/* ----------------------------------------------------------------------------------------------------- */

function fecharForm() {
    document.getElementById('adicionarProduto').style.display = 'none';
    document.getElementById('produtoForm').reset();
    
    produtoEdicaoId = null;
    document.querySelector('#adicionarProduto h3').textContent = 'Adicionar Produto';
}