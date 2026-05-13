const apiUrl = '/api/pedidos';

function showToast(msg) {
    const container = document.getElementById('toast-container');
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerText = msg;
    container.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

async function carregarPedidos() {
    const res = await fetch(apiUrl);
    const pedidos = await res.json();
    document.getElementById('total-pedidos').innerText = pedidos.length;
    const lista = document.getElementById('lista-pedidos');
    lista.innerHTML = '';
    
    pedidos.forEach(p => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <strong>${p.cliente}</strong><br>
                <span class="status-badge">${p.status.toUpperCase()}</span>
            </div>
            <div class="actions">
                <button class="btn-sec" onclick="editarPedido(${p.id}, '${p.cliente}', '${p.status}')">Editar</button>
                <button class="btn-danger" onclick="deletarPedido(${p.id})">Remover</button>
            </div>
        `;
        lista.appendChild(li);
    });
}

async function criarPedido() {
    const cliente = document.getElementById('cliente').value;
    const status = document.getElementById('status').value;
    if(!cliente) return showToast("Digite o nome!");

    await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente, status })
    });
    document.getElementById('cliente').value = '';
    showToast("Pedido lançado!");
    carregarPedidos();
}

function editarPedido(id, cliente, status) {
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
    showToast("Pedido atualizado!");
    carregarPedidos();
}

function deletarPedido(id) {
    document.getElementById('id-para-deletar').value = id;
    document.getElementById('modal-confirm').style.display = 'block';
}

function fecharModalConfirm() { document.getElementById('modal-confirm').style.display = 'none'; }

async function executarExclusao() {
    const id = document.getElementById('id-para-deletar').value;
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    fecharModalConfirm();
    showToast("Removido com sucesso!");
    carregarPedidos();
}

carregarPedidos();