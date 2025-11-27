/* ----------------------------------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', function() {
    listarProdutosIndex();
});

/* ----------------------------------------------------------------------------------------------------- */
// Cria o card HTML para um único produto.

function criarCardProdutoIndex(produto) {
    const card = document.createElement('div');
    card.classList.add('card');
    
    const fallbackUrl = '/img/placeholder.png';
    const imageUrl = produto.imageUrl || fallbackUrl; 

    let cardContent = `
        <!-- 2. USO DA IMAGEM: Se imageUrl falhar, o 'onerror' garante o fallback -->
        <img src="${imageUrl}" 
             alt="${produto.nome}"
             onerror="this.onerror=null; this.src='${fallbackUrl}';">
        <div class="textos">
            <h3 style="margin-bottom: 3px;">${produto.nome}</h3>         
            <span>R$ ${produto.preco ? produto.preco.toFixed(2).replace('.', ',') : 'N/A'}</span>
            <p style="margin-top: 4px;">${produto.descricao}</p>
            
            <button 
                type="button" 
                class="btn-comprar"
                onclick="adicionarAoCarrinho({
                    id: ${produto.id},
                    nome: '${produto.nome.replace(/'/g, "\\'")}', 
                    preco: ${produto.preco}
                })">
                Comprar
            </button>
        </div>
    `;


    if (typeof usuarioLogado !== 'undefined' && usuarioLogado.perfil === 'admin') {
        cardContent += `
            <div class="admin-controls">
                <button type="button" class="btn-admin-edit" onclick="editarProduto(${produto.id})">
                    Editar
                </button>
                <button type="button" class="btn-admin-delete" onclick="deletarProduto(${produto.id})">
                    Excluir
                </button>
            </div>
        `;
    }

    card.innerHTML = cardContent;
    return card;
}

/* ----------------------------------------------------------------------------------------------------- */
// Lista os produtos na página inicial.

async function listarProdutosIndex() {
    const container = document.getElementById('lista-produtos');
    container.innerHTML = 'Carregando produtos...';
    
    try {
        const produtos = await fetchGET('/produtos');
        
        container.innerHTML = '';
        
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


async function enviarEmail() {
    alert("Um pombo-correio foi enviado com as instruções! - (Funcionalidade de envio de email ainda não implementada.)");
}