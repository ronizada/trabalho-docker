const apiUrl = '/api/pedidos';

async function carregarPedidos() {
    const res = await fetch(apiUrl);
    const pedidos = await res.json();
    const lista = document.getElementById('lista-pedidos');
    const counter = document.getElementById('order-count');
    
    lista.innerHTML = '';
    counter.innerText = `${pedidos.length} registros no total`;
    
    pedidos.forEach(p => {
        const div = document.createElement('div');
        div.className = 'order-item';
        div.innerHTML = `
            <div class="item-info">
                <div style="font-weight: 600; margin-bottom: 4px;">${p.cliente}</div>
                <span class="item-status">${p.status}</span>
            </div>
            <div class="item-actions">
                <button class="btn-flat" style="padding: 4px 8px; font-size: 0.8rem;" onclick="abrirModalEditar(${p.id}, '${p.cliente}', '${p.status}')">Editar</button>
                <button class="btn-flat" style="padding: 4px 8px; font-size: 0.8rem; color: #b91c1c;" onclick="abrirModalExcluir(${p.id})">Remover</button>
            </div>
        `;
        lista.appendChild(div);
    });
}

// ... (Funções de Modal e API mantidas, mas sem alertas)

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
    if (e.target.className === 'modal-bg') {
        fecharModal();
        fecharModalExcluir();
    }
}

carregarPedidos();