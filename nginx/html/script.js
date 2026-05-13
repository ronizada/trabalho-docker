const apiUrl = '/api/pedidos';

// Exibe notificações Toast (substitui o alert nativo)
function showToast(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerText = msg;
    container.appendChild(t);
    
    setTimeout(() => {
        t.style.opacity = '0';
        setTimeout(() => t.remove(), 500);
    }, 3000);
}

// Carrega os pedidos e atualiza o contador e a lista
async function carregarPedidos() {
    try {
        const res = await fetch(apiUrl);
        const dados = await res.json();
        
        document.getElementById('total-pedidos').innerText = dados.length;
        const lista = document.getElementById('lista-pedidos');
        lista.innerHTML = '';

        dados.forEach(p => {
            // Define a classe de cor baseada no status para o CSS
            let classeStatus = '';
            if(p.status === 'Pendente') classeStatus = 'status-pendente';
            else if(p.status === 'Em Andamento') classeStatus = 'status-em-andamento';
            else if(p.status === 'Concluído') classeStatus = 'status-concluido';

            const li = document.createElement('li');
            li.innerHTML = `
                <div>
                    <div style="font-weight:700; font-size: 1.1rem; margin-bottom: 4px;">${p.cliente}</div>
                    <span class="status-badge ${classeStatus}">${p.status}</span>
                </div>
                <div class="actions">
                    <button class="btn-edit" onclick="editarPedido(${p.id},'${p.cliente}','${p.status}')">Editar</button>
                    <button class="btn-remove" onclick="abrirModalExcluir(${p.id})">Remover</button>
                </div>
            `;
            lista.appendChild(li);
        });
    } catch (error) {
        showToast("Erro ao carregar dados do servidor", "error");
    }
}

// Cria um novo pedido
async function criarPedido() {
    const nomeInput = document.getElementById('cliente');
    const status = document.getElementById('status').value;
    
    if(!nomeInput.value.trim()) {
        showToast("Por favor, informe o nome do cliente", "error");
        return;
    }

    await fetch(apiUrl, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({cliente: nomeInput.value, status})
    });
    
    nomeInput.value = '';
    showToast("Pedido lançado com sucesso!");
    carregarPedidos();
}

// Funções do Modal de Edição
function editarPedido(id, c, s) {
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-cliente').value = c;
    document.getElementById('edit-status').value = s;
    document.getElementById('modal-editar').style.display = 'block';
}

function fecharModal() {
    document.getElementById('modal-editar').style.display = 'none';
}

async function salvarEdicao() {
    const id = document.getElementById('edit-id').value;
    const c = document.getElementById('edit-cliente').value;
    const s = document.getElementById('edit-status').value;

    if(!c.trim()) {
        showToast("O nome não pode ficar vazio", "error");
        return;
    }

    await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({cliente: c, status: s})
    });
    
    fecharModal();
    showToast("Registro atualizado");
    carregarPedidos();
}

// Funções do Modal de Exclusão (substitui o confirm nativo)
function abrirModalExcluir(id) {
    document.getElementById('id-para-deletar').value = id;
    document.getElementById('modal-confirm').style.display = 'block';
}

function fecharModalConfirm() {
    document.getElementById('modal-confirm').style.display = 'none';
}

async function executarExclusao() {
    const id = document.getElementById('id-para-deletar').value;
    await fetch(`${apiUrl}/${id}`, {method:'DELETE'});
    
    fecharModalConfirm();
    showToast("Registro removido do sistema");
    carregarPedidos();
}

// Fecha modais ao clicar fora da caixa branca
window.onclick = function(event) {
    const modalEditar = document.getElementById('modal-editar');
    const modalExcluir = document.getElementById('modal-confirm');
    if (event.target == modalEditar) fecharModal();
    if (event.target == modalExcluir) fecharModalConfirm();
}

// Inicialização
carregarPedidos();