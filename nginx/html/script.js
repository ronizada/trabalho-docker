const apiUrl = '/api/pedidos';

async function carregarPedidos() {
    const res = await fetch(apiUrl);
    const pedidos = await res.json();
    const lista = document.getElementById('lista-pedidos');
    lista.innerHTML = '';
    
    pedidos.forEach(pedido => {
        const statusClass = pedido.status.toLowerCase().replace(/\s+/g, '-');
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <div class="card-info">
                <strong>${pedido.cliente}</strong>
                <span class="badge status-${statusClass}">${pedido.status}</span>
            </div>
            <div class="card-actions">
                <button class="btn-card-edit" onclick="abrirModalEditar(${pedido.id}, '${pedido.cliente}', '${pedido.status}')">✏️ Editar</button>
                <button class="btn-card-delete" onclick="abrirModalExcluir(${pedido.id})">🗑️ Excluir</button>
            </div>
        `;
        lista.appendChild(div);
    });
}

async function criarPedido() {
    const cliente = document.getElementById('cliente').value;
    const status = document.getElementById('status').value;
    if(!cliente) return alert('Por favor, digite o nome do cliente.');

    await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente, status })
    });
    
    document.getElementById('cliente').value = '';
    carregarPedidos();
}

// Funções do Modal de Edição
function abrirModalEditar(id, cliente, status) {
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-cliente').value = cliente;
    document.getElementById('edit-status').value = status;
    document.getElementById('modal-editar').style.display = 'block';
}

function fecharModal() {
    document.getElementById('modal-editar').style.display = 'none';
}

async function salvarEdicao() {
    const id = document.getElementById('edit-id').value;
    const cliente = document.getElementById('edit-cliente').value;
    const status = document.getElementById('edit-status').value;

    await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente, status })
    });
    
    fecharModal();
    carregarPedidos();
}

// Funções do Modal de Exclusão
function abrirModalExcluir(id) {
    document.getElementById('delete-id').value = id;
    document.getElementById('modal-excluir').style.display = 'block';
}

function fecharModalExcluir() {
    document.getElementById('modal-excluir').style.display = 'none';
}

async function confirmarExclusao() {
    const id = document.getElementById('delete-id').value;
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    fecharModalExcluir();
    carregarPedidos();
}

// Fechar ao clicar fora
window.onclick = function(event) {
    if (event.target.className === 'modal') {
        fecharModal();
        fecharModalExcluir();
    }
}

carregarPedidos();