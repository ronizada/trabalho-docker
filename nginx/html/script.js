const API = '/api/pedidos';

async function list() {
    const r = await fetch(API);
    const data = await r.json();
    document.getElementById('reg-count').innerText = data.length.toString().padStart(2, '0');
    const container = document.getElementById('data-list');
    container.innerHTML = '';
    
    data.forEach(i => {
        const div = document.createElement('div');
        div.className = 'data-row';
        div.innerHTML = `
            <span class="col-name">${i.cliente.toUpperCase()}</span>
            <span class="col-status">[ ${i.status.toUpperCase()} ]</span>
            <div class="col-actions">
                <button class="btn-opt" onclick="openEdit(${i.id}, '${i.cliente}', '${i.status}')">EDIT</button>
                <button class="btn-opt" onclick="openDel(${i.id})">DROP</button>
            </div>
        `;
        container.appendChild(div);
    });
}

async function criar() {
    const cliente = document.getElementById('cliente').value;
    const status = document.getElementById('status').value;
    if(!cliente) return;

    await fetch(API, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({cliente, status})
    });
    document.getElementById('cliente').value = '';
    list();
}

function openEdit(id, cliente, status) {
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-cliente').value = cliente;
    document.getElementById('edit-status').value = status;
    document.getElementById('modal-edit').style.display = 'block';
}

async function salvar() {
    const id = document.getElementById('edit-id').value;
    const cliente = document.getElementById('edit-cliente').value;
    const status = document.getElementById('edit-status').value;

    await fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({cliente, status})
    });
    closeModal('modal-edit');
    list();
}

function openDel(id) {
    document.getElementById('del-id').value = id;
    document.getElementById('modal-del').style.display = 'block';
}

async function confirmarDel() {
    const id = document.getElementById('del-id').value;
    await fetch(`${API}/${id}`, {method: 'DELETE'});
    closeModal('modal-del');
    list();
}

function closeModal(id) { document.getElementById(id).style.display = 'none'; }

list();