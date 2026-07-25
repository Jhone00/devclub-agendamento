// ==========================================================
// 1. DADOS E PERSISTÊNCIA (LOCALSTORAGE)
// ==========================================================

let listaUsuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
let listaAgendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
let usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado')) || null;

function persistirDados() {
    localStorage.setItem('usuarios', JSON.stringify(listaUsuarios));
    localStorage.setItem('agendamentos', JSON.stringify(listaAgendamentos));
    localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
}

// Credenciais do Administrador ocultas de forma segura no código
const ADMIN_CREDENCIAIS = {
    email: "jhone.walker@gmail.com",
    senha: "walker007"
};

// Verifica ao carregar a página se já existe usuário logado
window.addEventListener('DOMContentLoaded', () => {
    if (usuarioLogado) {
        mostrarAplicacao();
    }
});

// ==========================================================
// 2. AUTENTICAÇÃO (LOGIN E CADASTRO)
// ==========================================================

function alternarTelaAuth(tipo) {
    const formLogin = document.getElementById('formLogin');
    const formCadastro = document.getElementById('formCadastro');

    if (tipo === 'cadastro') {
        formLogin.classList.add('hidden');
        formCadastro.classList.remove('hidden');
    } else {
        formCadastro.classList.add('hidden');
        formLogin.classList.remove('hidden');
    }
}

function realizarCadastro(evento) {
    evento.preventDefault();

    const nome = document.getElementById('cadNome').value.trim();
    const telefone = document.getElementById('cadTelefone').value.trim();
    const email = document.getElementById('cadEmail').value.trim().toLowerCase();
    const senha = document.getElementById('cadSenha').value;

    if (email === ADMIN_CREDENCIAIS.email) {
        alert('Este e-mail é reservado.');
        return;
    }

    const usuarioExistente = listaUsuarios.find(u => u.email === email);
    if (usuarioExistente) {
        alert('Este e-mail já está cadastrado. Faça login.');
        return;
    }

    const novoUsuario = { nome, telefone, email, senha };
    listaUsuarios.push(novoUsuario);
    persistirDados();

    alert('Cadastro realizado com sucesso! Faça seu login.');
    document.getElementById('formCadastro').reset();
    alternarTelaAuth('login');
}

function realizarLogin(evento) {
    evento.preventDefault();

    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const senha = document.getElementById('loginSenha').value;

    // Valida o Administrador secreto
    if (email === ADMIN_CREDENCIAIS.email && senha === ADMIN_CREDENCIAIS.senha) {
        usuarioLogado = { nome: 'Administrador', email: ADMIN_CREDENCIAIS.email, isAdmin: true };
        persistirDados();
        mostrarAplicacao();
        return;
    }

    // Valida o Cliente cadastrado
    const clienteEncontrado = listaUsuarios.find(u => u.email === email && u.senha === senha);
    if (clienteEncontrado) {
        usuarioLogado = { nome: clienteEncontrado.nome, telefone: clienteEncontrado.telefone, email: clienteEncontrado.email, isAdmin: false };
        persistirDados();
        mostrarAplicacao();
        return;
    }

    alert('E-mail ou senha incorretos!');
}

function sairDaConta() {
    usuarioLogado = null;
    localStorage.removeItem('usuarioLogado');
    document.getElementById('appContainer').classList.add('hidden');
    document.getElementById('authContainer').classList.remove('hidden');
    document.getElementById('formLogin').reset();
}

function mostrarAplicacao() {
    document.getElementById('authContainer').classList.add('hidden');
    document.getElementById('appContainer').classList.remove('hidden');

    const btnAdmin = document.getElementById('btnAdmin');

    if (usuarioLogado.isAdmin) {
        btnAdmin.classList.remove('hidden');
        mudarAba('admin');
    } else {
        btnAdmin.classList.add('hidden');
        mudarAba('cliente');
    }
}

// ==========================================================
// 3. CONTROLE DE ABAS E AGENDAMENTOS
// ==========================================================

function mudarAba(destino) {
    const elCliente = document.getElementById('areaCliente');
    const elAdmin = document.getElementById('areaAdmin');
    const btnCliente = document.getElementById('btnCliente');
    const btnAdmin = document.getElementById('btnAdmin');

    if (destino === 'cliente') {
        elCliente.classList.add('active');
        elAdmin.classList.remove('active');
        btnCliente.classList.add('active');
        if (btnAdmin) btnAdmin.classList.remove('active');
    } else {
        elAdmin.classList.add('active');
        elCliente.classList.remove('active');
        if (btnAdmin) btnAdmin.classList.add('active');
        btnCliente.classList.remove('active');
        renderizarTabela();
    }
}

// Configura data mínima para o agendamento
const inputData = document.getElementById('data');
const dataAtual = new Date().toISOString().split('T')[0];
inputData.min = dataAtual;

inputData.addEventListener('change', () => {
    const dataEscolhida = inputData.value;
    const selectHorario = document.getElementById('horario');

    const horariosOcupados = listaAgendamentos
        .filter(item => item.data === dataEscolhida && item.status !== 'Cancelado')
        .map(item => item.horario);

    for (let i = 0; i < selectHorario.options.length; i++) {
        const option = selectHorario.options[i];
        if (horariosOcupados.includes(option.value)) {
            option.disabled = true;
            option.text = `${option.value} (Ocupado)`;
        } else {
            option.disabled = false;
            option.text = option.value.replace(' (Ocupado)', '');
        }
    }
});

document.getElementById('formAgendamento').addEventListener('submit', (evento) => {
    evento.preventDefault();

    const servico = document.getElementById('servico').value;
    const data = document.getElementById('data').value;
    const horario = document.getElementById('horario').value;

    if (!servico || !data || !horario) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const novoRegistro = {
        id: Date.now(),
        nome: usuarioLogado.nome,
        telefone: usuarioLogado.telefone,
        servico,
        data,
        horario,
        status: 'Agendado'
    };

    listaAgendamentos.push(novoRegistro);
    persistirDados();

    const feedback = document.getElementById('feedbackSucesso');
    feedback.classList.remove('hidden');
    setTimeout(() => feedback.classList.add('hidden'), 3500);

    document.getElementById('formAgendamento').reset();
    inputData.dispatchEvent(new Event('change'));
});

// ==========================================================
// 4. PAINEL ADMINISTRATIVO
// ==========================================================

function renderizarTabela() {
    const tbody = document.getElementById('tabelaCorpo');
    const filtroData = document.getElementById('filtroData').value;
    tbody.innerHTML = '';

    let dadosExibicao = listaAgendamentos;
    if (filtroData) {
        dadosExibicao = listaAgendamentos.filter(item => item.data === filtroData);
    }

    if (dadosExibicao.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center;">Nenhum agendamento encontrado.</td></tr>`;
        return;
    }

    dadosExibicao.forEach(item => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${item.nome}</td>
            <td>${item.telefone}</td>
            <td>${item.servico}</td>
            <td>${formatarDataParaBR(item.data)}</td>
            <td>${item.horario}</td>
            <td>
                <select class="select-status" onchange="atualizarStatus(${item.id}, this.value)">
                    <option value="Agendado" ${item.status === 'Agendado' ? 'selected' : ''}>Agendado</option>
                    <option value="Confirmado" ${item.status === 'Confirmado' ? 'selected' : ''}>Confirmado</option>
                    <option value="Concluído" ${item.status === 'Concluído' ? 'selected' : ''}>Concluído</option>
                    <option value="Cancelado" ${item.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
                </select>
            </td>
            <td>
                <button class="btn-delete" onclick="removerAgendamento(${item.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function atualizarStatus(id, novoStatus) {
    const registro = listaAgendamentos.find(item => item.id === id);
    if (registro) {
        registro.status = novoStatus;
        persistirDados();
    }
}

function removerAgendamento(id) {
    if (confirm('Deseja realmente excluir este agendamento?')) {
        listaAgendamentos = listaAgendamentos.filter(item => item.id !== id);
        persistirDados();
        renderizarTabela();
    }
}

function limparFiltro() {
    document.getElementById('filtroData').value = '';
    renderizarTabela();
}

function formatarDataParaBR(dataIso) {
    if (!dataIso) return '';
    const partes = dataIso.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}