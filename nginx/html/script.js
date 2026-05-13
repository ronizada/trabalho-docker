const apiUrl = '/api/pedidos';

async function carregarPedidos() {
    const res = await fetch(apiUrl);
    const pedidos = await res.json();
    const lista = document.getElementById('lista-pedidos');
    lista.innerHTML = '';
    
    pedidos.forEach(pedido => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span><strong>${pedido.cliente}</strong> - ${pedido.status}</span>
            <div>
                <button style="background-color: #ffc107; color: black; border:none; padding:5px 10px; cursor:pointer;" onclick="editarPedido(${pedido.id}, '${pedido.cliente}', '${pedido.status}')">Editar</button>
                <button class="btn-delete" style="border:none; color:white; padding:5px 10px; cursor:pointer;" onclick="deletarPedido(${pedido.id})">Excluir</button>
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

async function deletarPedido(id) {
    if(confirm("Tem certeza que deseja excluir?")) {
        await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        carregarPedidos();
    }
}

async function editarPedido(id, clienteAtual, statusAtual) {
    const novoCliente = prompt("Editar nome do cliente:", clienteAtual);
    const novoStatus = prompt("Editar status (Pendente, Em Andamento, Concluído):", statusAtual);

    if (novoCliente && novoStatus) {
        await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cliente: novoCliente, status: novoStatus })
        });
        carregarPedidos();
    }
}

// Carrega os pedidos ao abrir a página
carregarPedidos();