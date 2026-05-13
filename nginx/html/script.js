const API = '/api/pedidos';
let _toastTimer;

/* ===== Toast ===== */
function toast(msg, type) {
    var el  = document.getElementById('toast');
    var dot = document.getElementById('toast-dot');
    var txt = document.getElementById('toast-msg');
    dot.style.background = type === 'danger' ? 'var(--danger-txt)' : 'var(--pill-done-txt)';
    txt.textContent = msg;
    el.classList.add('show');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(function() { el.classList.remove('show'); }, 2500);
}

/* ===== Status pill ===== */
function statusPill(s) {
    var map = {
        'Pendente':     ['pill-pend', 'Pendente'],
        'Em Andamento': ['pill-prog', 'Em andamento'],
        'Concluido':    ['pill-done', 'Concluído']
    };
    var entry = map[s] || ['pill-pend', s];
    return '<span class="pill ' + entry[0] + '">' + entry[1] + '</span>';
}

/* ===== List ===== */
async function list() {
    var data = [];
    try {
        var r = await fetch(API);
        data = await r.json();
    } catch (e) {
        data = window._demo || [];
    }

    var total = data.length;
    var pend  = data.filter(function(d) { return d.status === 'Pendente'; }).length;
    var done  = data.filter(function(d) { return d.status === 'Concluido'; }).length;

    document.getElementById('count-total').textContent = total;
    document.getElementById('count-pend').textContent  = pend;
    document.getElementById('count-done').textContent  = done;
    document.getElementById('badge-count').textContent =
        total + ' registro' + (total !== 1 ? 's' : '');

    var container = document.getElementById('data-list');

    if (!data.length) {
        container.innerHTML =
            '<div class="empty">&#9635; Nenhum registro encontrado</div>';
        return;
    }

    container.innerHTML = data.map(function(i) {
        var safeName = i.cliente.replace(/'/g, "\\'");
        return (
            '<div class="row">' +
                '<span class="row-name">' + i.cliente + '</span>' +
                '<span>' + statusPill(i.status) + '</span>' +
                '<div class="row-actions">' +
                    '<button class="btn-sm" onclick="openEdit(' + i.id + ',\'' + safeName + '\',\'' + i.status + '\')">' +
                        '&#9998; Editar' +
                    '</button>' +
                    '<button class="btn-sm btn-sm-del" onclick="openDel(' + i.id + ')">' +
                        '&#128465; Excluir' +
                    '</button>' +
                '</div>' +
            '</div>'
        );
    }).join('');
}

/* ===== Criar ===== */
async function criar() {
    var cliente = document.getElementById('f-cliente').value.trim();
    var status  = document.getElementById('f-status').value;

    if (!cliente) {
        document.getElementById('f-cliente').focus();
        return;
    }

    try {
        await fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cliente: cliente, status: status })
        });
    } catch (e) {
        if (!window._demo) window._demo = [];
        window._demo.push({ id: Date.now(), cliente: cliente, status: status });
    }

    document.getElementById('f-cliente').value = '';
    toast('Registro criado com sucesso');
    list();
}

/* ===== Modal editar ===== */
function openEdit(id, cliente, status) {
    document.getElementById('edit-id').value      = id;
    document.getElementById('edit-cliente').value = cliente;
    document.getElementById('edit-status').value  = status;
    document.getElementById('modal-edit').classList.add('open');
}

async function salvar() {
    var id      = document.getElementById('edit-id').value;
    var cliente = document.getElementById('edit-cliente').value.trim();
    var status  = document.getElementById('edit-status').value;

    if (!cliente) return;

    try {
        await fetch(API + '/' + id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cliente: cliente, status: status })
        });
    } catch (e) {
        if (window._demo) {
            var item = window._demo.find(function(d) { return d.id == id; });
            if (item) { item.cliente = cliente; item.status = status; }
        }
    }

    closeModal('modal-edit');
    toast('Registro atualizado');
    list();
}

/* ===== Modal deletar ===== */
function openDel(id) {
    document.getElementById('del-id').value = id;
    document.getElementById('modal-del').classList.add('open');
}

async function confirmarDel() {
    var id = document.getElementById('del-id').value;

    try {
        await fetch(API + '/' + id, { method: 'DELETE' });
    } catch (e) {
        if (window._demo) {
            window._demo = window._demo.filter(function(d) { return d.id != id; });
        }
    }

    closeModal('modal-del');
    toast('Registro removido', 'danger');
    list();
}

/* ===== Utilitários ===== */
function closeModal(id) {
    document.getElementById(id).classList.remove('open');
}

function overlayClick(e, id) {
    if (e.target === e.currentTarget) closeModal(id);
}

/* ===== Tecla Enter no formulário ===== */
document.getElementById('f-cliente').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') criar();
});

/* ===== Dados demo (quando API não está disponível) ===== */
window._demo = [
    { id: 1, cliente: 'Ana Paula Ferreira', status: 'Em Andamento' },
    { id: 2, cliente: 'Carlos Mendes',       status: 'Pendente'     },
    { id: 3, cliente: 'Beatriz Santos',      status: 'Concluido'    }
];

list();
