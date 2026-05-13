const apiUrl = '/api/pedidos';

// Carregar e Contar Pedidos
async function carregarPedidos() {
    try {
        const res = await fetch(apiUrl);
        const pedidos = await res.json();
        
        // Atualiza o contador (ID: total-pedidos)
        const contador = document.getElementById('total-pedidos');
        if (contador) contador.innerText = pedidos.length;
        
        const lista = document.getElementById('lista-pedidos');
        lista.innerHTML = '';
        
        pedidos.forEach(pedido => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="pedido-info">
                    <strong>${pedido.cliente}</strong>
                    <span class="status-badge">${pedido.status.toUpperCase()}</span>
                </div>
                <div class="actions">
                    <button class="btn-edit" style="background:#f59e0b; color:white; border:none; padding:8px 15px; border-radius:6px; cursor:pointer; margin-right:5px;" onclick="editarPedido(${pedido.id}, '${pedido.cliente}', '${pedido.status}')">Editar</button>
                    <button class="btn-delete" style="background:#ef4444; color:white; border:none; padding:8px 15px; border-radius:6px; cursor:pointer;" onclick="deletarPedido(${pedido.id})">Remover</button>
                </div>
            `;
            lista.appendChild(li);
        });
    } catch (err) {
        console.error("Erro ao carregar:", err);
    }
}

// Criar Pedido
async function criarPedido() {
    const clienteInput = document.getElementById('cliente');
    const statusSelect = document.getElementById('status');
    
    if(!clienteInput.value) {
        alert('Por favor, informe o nome do cliente!');
        return;
    }

    await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            cliente: clienteInput.value, 
            status: statusSelect.value 
        })
    });
    
    clienteInput.value = '';
    carregarPedidos();
}

// Funções de Exclusão
function deletarPedido(id) {
    if(confirm("Deseja realmente remover este registro?")) {
        executarExclusao(id);
    }
}

async function executarExclusao(id) {
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    carregarPedidos();
}

// Funções de Edição (Prompt Simples para garantir que funcione agora)
async function editarPedido(id, clienteAtual, statusAtual) {
    const novoNome = prompt("Novo nome do cliente:", clienteAtual);
    const novoStatus = prompt("Novo status (Pendente, Em Andamento, Concluído):", statusAtual);

    if (novoNome && novoStatus) {
        await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cliente: novoNome, status: novoStatus })
        });
        carregarPedidos();
    }
}

// Inicialização
carregarPedidos();