const apiUrl = '/api/pedidos';

async function carregarPedidos() {
    const res = await fetch(apiUrl);
    const pedidos = await res.json();
    const lista = document.getElementById('lista-pedidos');
    lista.innerHTML = '';
    
    pedidos.forEach(pedido => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="pedido-info">
                <strong>${pedido.cliente}</strong>
                <span class="status-badge">${pedido.status}</span>
            </div>
            <div class="actions">
                <button class="btn-edit" onclick="editarPedido(${pedido.id}, '${pedido.cliente}', '${pedido.status}')">Editar</button>
                <button class="btn-delete" onclick="deletarPedido(${pedido.id})">Excluir</button>
            </div>
        `;
        lista.appendChild(li);
    });
}

async function criarPedido() {
    const cliente = document.getElementById('cliente').value;
    const status = document.getElementById('status').value;
    if(!cliente) return alert('Preencha o cliente!');

    await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente, status })
    });
    
    document.getElementById('cliente').value = '';
    carregarPedidos();
}

function editarPedido(id, cliente, status) {
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

async function deletarPedido(id) {
    if(confirm("Tem certeza que deseja excluir?")) {
        await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        carregarPedidos();
    }
}

window.onclick = function(event) {
    const modal = document.getElementById('modal-editar');
    if (event.target == modal) fecharModal();
}

carregarPedidos();