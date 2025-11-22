// document.addEventListener('DOMContentLoaded', function() {
//     listarProdutosIndex();
// });

// /* ----------------------------------------------------------------------------------------------------- */

// function criarCardProdutoIndex(produto) {
//     const card = document.createElement('div');
//     card.classList.add('card');
//     card.innerHTML = `
//         <img src="${produto.imagemUrl || '/img/placeholder.jpg'}" alt="${produto.nome}">
//         <div class="textos">
//             <h3 style="margin-bottom: 3px;">${produto.nome}</h3>         
//             <span>R$ ${produto.preco ? produto.preco.toFixed(2).replace('.', ',') : 'N/A'}</span>
//             <p style="margin-top: 4px;">${produto.descricao}</p>
            
//             <button 
//                 type="button" 
//                 class="btn-comprar"
//                 onclick="adicionarAoCarrinho({
//                     id: ${produto.id},
//                     nome: '${produto.nome.replace(/'/g, "\\'")}', 
//                     preco: ${produto.preco}
//                 })">
//                 Comprar
//             </button>
//         </div>
//     `;
//     return card;
// }

// /* ----------------------------------------------------------------------------------------------------- */


// /**
//  * Busca produtos na API e os exibe no index.html.
//  * Assume que fetchGET está definido em apiService.js (que deve ser carregado antes).
//  */

// async function listarProdutosIndex() {
//     const container = document.getElementById('lista-produtos');
//     container.innerHTML = 'Carregando produtos...';
    
//     try {
//         const produtos = await fetchGET('/produtos'); // Função do seu apiService.js
        
//         container.innerHTML = ''; // Limpa o "Carregando..."
        
//         if (produtos && produtos.length > 0) {
//             produtos.forEach(produto => {
//                 container.appendChild(criarCardProdutoIndex(produto));
//             });
//         } else {
//             container.innerHTML = '<p>Nenhum produto encontrado no armazém.</p>';
//         }

//     } catch (error) {
//         console.error('Erro ao listar produtos:', error);
//         container.innerHTML = '<p style="color: red;">Erro ao carregar os produtos.</p>';
//     }
// }

// /* ----------------------------------------------------------------------------------------------------- */

// function renderizarProdutos(produtos) {
//     if (usuarioLogado.perfil === 'admin') { // <-- PROBLEMA AQUI!
//         // ... SÓ ADMIN CHEGA NESTA PARTE ...
//         produtos.forEach(produto => {
//             // Cria o HTML do produto e insere no DOM
//         });
//     }
// }


// index.js - O arquivo que deve estar rodando na sua página principal

// 1. CHAMA A FUNÇÃO AO CARREGAR A PÁGINA
document.addEventListener('DOMContentLoaded', function() {
    // Certifique-se de que o contador do carrinho também é atualizado aqui
    // e que a função principal de listagem é chamada.
    listarProdutosIndex();
});

/* ----------------------------------------------------------------------------------------------------- */

/**
 * Cria o card HTML para um único produto.
 * Usa lógica de fallback para a imagem e adiciona botões de ADM condicionalmente.
 */
function criarCardProdutoIndex(produto) {
    const card = document.createElement('div');
    card.classList.add('card');
    
    // 1. DEFINE A URL DA IMAGEM: Tenta a URL real, senão usa o placeholder.
    // VERIFIQUE SE O CAMINHO E EXTENSÃO (.jpg/.png) ESTÃO CORRETOS
    const fallbackUrl = '/img/placeholder.png';
    const imageUrl = produto.imageUrl || fallbackUrl; 

    // Conteúdo básico do card (visível para todos)
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

    // 3. LÓGICA DE ADMIN: Verifica o perfil do usuário (a variável 'usuarioLogado' deve ser global)
    if (typeof usuarioLogado !== 'undefined' && usuarioLogado.perfil === 'admin') {
        // Se for admin, adiciona os botões de controle
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

// 3. FUNÇÃO QUE BUSCA E CHAMA O RENDER
async function listarProdutosIndex() {
    const container = document.getElementById('lista-produtos');
    container.innerHTML = 'Carregando produtos...'; // Mostra a mensagem de carregamento
    
    try {
        const produtos = await fetchGET('/produtos'); // Chama o seu API Service
        
        container.innerHTML = ''; // Limpa o "Carregando..."
        
        if (produtos && produtos.length > 0) {
            // AQUI É O PONTO CRÍTICO: ele deve iterar e chamar a função de criar card
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