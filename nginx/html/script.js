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
    const dados = await res.json();
    document.getElementById('total-pedidos').innerText = dados.length;
    const lista = document.getElementById('lista-pedidos');
    lista.innerHTML = '';
    dados.forEach(p => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <div style="font-weight:600">${p.cliente}</div>
                <span class="status-badge">${p.status}</span>
            </div>
            <div class="actions">
                <button onclick="editarPedido(${p.id},'${p.cliente}','${p.status}')">Editar</button>
                <button class="btn-remove" onclick="abrirModalExcluir(${p.id})">Remover</button>
            </div>
        `;
        lista.appendChild(li);
    });
}

async function criarPedido() {
    const nome = document.getElementById('cliente').value;
    const status = document.getElementById('status').value;
    if(!nome) {
        showToast("Preencha o nome do cliente");
        return;
    }
    await fetch(apiUrl, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({cliente: nome, status})
    });
    document.getElementById('cliente').value = '';
    carregarPedidos();
}

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
    carregarPedidos();
}

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
    await fetch(`${apiUrl}/${id}`, {
        method:'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({cliente: c, status: s})
    });
    fecharModal();
    carregarPedidos();
}

carregarPedidos();