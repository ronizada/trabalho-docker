const apiUrl = '/api/pedidos';

async function carregarPedidos() {
    const res = await fetch(apiUrl);
    const pedidos = await res.json();
    const lista = document.getElementById('lista-pedidos');
    const counter = document.getElementById('order-count');
    
    lista.innerHTML = '';
    counter.innerText = `${pedidos.length} pedidos`;
    
    pedidos.forEach(p => {
        const div = document.createElement('div');
        div.className = 'order-card';
        div.innerHTML = `
            <div class="order-main">
                <strong>${p.cliente}</strong>
                <span class="status-pill">${p.status}</span>
            </div>
            <div class="order-actions">
                <button class="btn-icon btn-edit" onclick="abrirModalEditar(${p.id}, '${p.cliente}', '${p.status}')">✏️</button>
                <button class="btn-icon btn-delete" onclick="abrirModalExcluir(${p.id})">🗑️</button>
            </div>
        `;
        lista.appendChild(div);
    });
}

// ... (Mantenha as funções abrirModalEditar, fecharModal, salvarEdicao, etc., que já tínhamos)
// Apenas certifique-se de que os nomes dos IDs coincidam com o novo HTML

async function criarPedido() {
    const cliente = document.getElementById('cliente').value;
    const status = document.getElementById('status').value;
    if(!cliente) return;
    await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente, status })
    });
    document.getElementById('cliente').value = '';
    carregarPedidos();
}

function abrirModalEditar(id, cliente, status) {
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-cliente').value = cliente;
    document.getElementById('edit-status').value = status;
    document.getElementById('modal-editar').style.display = 'block';
}

function fecharModal() { document.getElementById('modal-editar').style.display = 'none'; }

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

function abrirModalExcluir(id) {
    document.getElementById('delete-id').value = id;
    document.getElementById('modal-excluir').style.display = 'block';
}

function fecharModalExcluir() { document.getElementById('modal-excluir').style.display = 'none'; }

async function confirmarExclusao() {
    const id = document.getElementById('delete-id').value;
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    fecharModalExcluir();
    carregarPedidos();
}

window.onclick = function(e) {
    if (e.target.className === 'modal-overlay') {
        fecharModal();
        fecharModalExcluir();
    }
}

carregarPedidos();