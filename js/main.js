document.addEventListener('DOMContentLoaded', function() {
    listarProdutosIndex();
});

/* ----------------------------------------------------------------------------------------------------- */

//criar o card do produto no index

function criarCardProdutoIndex(produto) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <img src="${produto.imagemUrl || '/img/placeholder.jpg'}" alt="${produto.nome}">
        <div class="textos">
            <h3 style="margin-bottom: 3px;">${produto.nome}</h3>         
            <span>R$ ${produto.preco ? produto.preco.toFixed(2).replace('.', ',') : 'N/A'}</span>
            <p style="margin-top: 4px;">${produto.descricao}</p>
        </div>
    `;
    return card;
}

/* ----------------------------------------------------------------------------------------------------- */


/**
 * Busca produtos na API e os exibe no index.html.
 * Assume que fetchGET está definido em apiService.js (que deve ser carregado antes).
 */

async function listarProdutosIndex() {
    const container = document.getElementById('lista-produtos');
    container.innerHTML = 'Carregando produtos...';
    
    try {
        const produtos = await fetchGET('/produtos'); // Função do seu apiService.js
        
        container.innerHTML = ''; // Limpa o "Carregando..."
        
        if (produtos && produtos.length > 0) {
            produtos.forEach(produto => {
                container.appendChild(criarCardProdutoIndex(produto));
            });
        } else {
            container.innerHTML = '<p>Nenhum produto encontrado no armazém.</p>';
        }

    } catch (error) {
        console.error('Erro ao listar produtos:', error);
        container.innerHTML = '<p style="color: red;">Erro ao carregar os produtos.</p>';
    }
}