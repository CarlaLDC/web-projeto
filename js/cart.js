
// --- 1. Estado do Carrinho ---
function obterCarrinho() {
    const carrinhoJSON = localStorage.getItem('carrinho');
    return carrinhoJSON ? JSON.parse(carrinhoJSON) : [];
}

function salvarCarrinho(carrinho) {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarContadoresUI();
}

// --- 2. Ações CRUD do Carrinho ---

// Adicionar produto ao carrinho
function adicionarAoCarrinho(produto) {
    const carrinho = obterCarrinho();
    const itemExistente = carrinho.find(item => item.id === produto.id);

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }

    salvarCarrinho(carrinho);
    alert(`${produto.nome} adicionado ao carrinho!`);
}

// Remover item do carrinho
function removerDoCarrinho(produtoId) {
    if (!confirm("Deseja remover este item do carrinho?")) return;
    
    let carrinho = obterCarrinho();
    carrinho = carrinho.filter(item => item.id !== produtoId);
    
    salvarCarrinho(carrinho);
    
    // Se estiver na página do carrinho, atualiza a lista
    if (document.getElementById('carrinho-itens-lista')) {
        renderizarCarrinhoNaPagina();
    }
}

// Limpar todo o carrinho
function limparCarrinho() {
    if (!confirm("Tem certeza que deseja limpar todo o carrinho?")) return;
    
    localStorage.removeItem('carrinho');
    
    // Atualiza a UI se estiver na página do carrinho
    if (document.getElementById('carrinho-itens-lista')) {
        renderizarCarrinhoNaPagina();
    }
    atualizarContadoresUI();
}

// --- 3. Funções de Renderização e UI ---

function calcularTotal(carrinho) {
    return carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
}

// Atualiza o contador no cabeçalho (usado em todas as páginas)
function atualizarContadoresUI() {
    const carrinho = obterCarrinho();
    const contador = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    
    // Atualiza o contador no cabeçalho (Index/Admin)
    const contadorHeader = document.getElementById('contador-carrinho');
    if (contadorHeader) {
        contadorHeader.textContent = contador;
    }

    // Atualiza o contador na página do Carrinho
    const contadorPagina = document.getElementById('contador-carrinho-pagina');
    if (contadorPagina) {
        contadorPagina.textContent = contador;
    }
}

// Renderiza a lista de itens na página carrinho.html
function renderizarCarrinhoNaPagina() {
    const carrinho = obterCarrinho();
    const listaContainer = document.getElementById('carrinho-itens-lista');
    const totalElement = document.getElementById('carrinho-total-valor');
    
    listaContainer.innerHTML = '';
    
    if (carrinho.length === 0) {
        listaContainer.innerHTML = '<p class="carrinho-vazio">Seu carrinho está vazio. Comece a comprar na página inicial! 😊</p>';
    } else {
        carrinho.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('carrinho-item-detalhe');
            itemElement.innerHTML = `
                <span class="item-nome">${item.nome}</span>
                <span class="item-quantidade">${item.quantidade}x</span>
                <span class="item-preco">R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</span>
                <button 
                    class="remover-item-carrinho" 
                    onclick="removerDoCarrinho(${item.id})">
                    Remover
                </button>
            `;
            listaContainer.appendChild(itemElement);
        });
    }

    const total = calcularTotal(carrinho);
    totalElement.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    atualizarContadoresUI();
}

// --- 4. Inicialização ---

document.addEventListener('DOMContentLoaded', () => {
    // Roda em todas as páginas para atualizar o contador do header
    atualizarContadoresUI();
    
    // Se estiver na página do carrinho, renderiza a lista completa
    if (document.getElementById('carrinho-itens-lista')) {
        renderizarCarrinhoNaPagina();
    }
});