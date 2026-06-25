/* ==================== OBJETO PRINCIPAL DA APP ====================
   Tudo sobre o estado da aplicação fica aqui. 
   É como um "banco de dados em memória" */

const CAMPOS_FILTROS_PECAS = ['tipo', 'funcao', 'padronagem', 'tom', 'cor_detalhe', 'nivel_aquecimento', 'subtipo', 'utilizacao', 'local', 'situacao'];
const CAMPOS_FILTROS_LOOKS = ['situacao', 'utilizacao', 'indicador', 'clima', 'local', 'htt', 'ocasiao'];
const CAMPOS_FILTROS_GERAIS_HOJE = CAMPOS_FILTROS_PECAS.filter(campo => !['tipo', 'subtipo'].includes(campo));
const GRUPOS_REGISTRO_PECAS = [
    { id: 'roupas-principais', titulo: 'Blusas, calças, casacos, inteiros', tipos: ['blusa', 'calça', 'casaco', 'inteiro'] },
    { id: 'intimas-funcionais', titulo: 'Sutien, calcinha, modelador, tops, segunda-pele', tipos: ['sutien', 'calcinha', 'modelador', 'top', 'segunda-pele'] },
    { id: 'pijamas', titulo: 'Pijamas', tipos: ['pijama'] },
    { id: 'meias-calcados', titulo: 'Meias e calçados', tipos: ['meia', 'calçado'] },
    { id: 'bijus', titulo: 'Bijus', tipos: ['biju'] },
    { id: 'acessorios', titulo: 'Bolsa, cinto, pra cabeça, pro pescoço', tipos: ['bolsa', 'cinto', 'pra cabeça', 'pro pescoço'] },
    { id: 'praia', titulo: 'Roupa de praia', tipos: ['roupa de praia'] },
];

const app = {
    // Dados carregados do JSON (nunca mudam)
    pecas: {},
    looks: {},
    mapaOcasioes: {},
    ocasioes: ['Trabalho', 'Casual', 'Festa', 'Treino', 'Casa', 'Sair'],

    // Dados do usuário (salvos em localStorage)
    historico: [],           // Lista de {data, pecas, lookId?}
    looksFavoritos: {},      // Meus próprios looks criados {id: {nome, pecas, ocasiao}}

    // Estado temporário (mudam conforme usuário interage)
    pecasSelecionadasHoje: [],
    looksSelecionadosHoje: [],
    pecasSelecionadasLookHistorico: {},
    diaCriacaoLookHistorico: null,
    fotoNovoLookHistorico: null,
    pecaEmDetalhes: null,
    mesCalendarioHistorico: null,
    filtroHistoricoAtivo: null,
    supabase: null,
    usuarioSupabase: null,
    sincronizando: false,
    forcarEnvioLocalSupabase: false,
    recuperandoSenhaSupabase: false,
    
    // Filtros da página Home
    filtrosHome: Object.fromEntries(CAMPOS_FILTROS_PECAS.map(campo => [campo, []])),
    
    // Filtros da aba "Usar Hoje"
    filtrosHoje: Object.fromEntries(CAMPOS_FILTROS_GERAIS_HOJE.map(campo => [campo, []])),
    filtrosHojeGrupos: Object.fromEntries(GRUPOS_REGISTRO_PECAS.map(grupo => [grupo.id, { tipo: [], subtipo: [] }])),

    // Filtros da página Looks
    filtrosLooks: {
        ...Object.fromEntries(CAMPOS_FILTROS_LOOKS.map(campo => [campo, []])),
        situacao: ['em uso'],
        pecas: [],
    },

    // Filtros do card "Não uso há..." no histórico
    filtrosSemUso: {
        tipo: '',
        local: '',
        situacao: '',
        tempo: '',
    },
};

/* ==================== INICIALIZAR A APP ====================
   Chamado quando a página carrega. É o "ponto de entrada" */

async function inicializar() {
    console.log('🚀 Inicializando aplicação...');

    // 1. Carregar dados do Excel (JSON)
    await carregarDadosJSON();

    // 2. Carregar dados salvos no celular
    carregarDados();

    // 3. Montar a interface
    renderGaleria();
    preencherFiltrosHome();
    preencherSelectLooks();
    preencherFiltrosOcasiao();
    renderLooks(obterTodosLooks().filter(lookPassaNosFiltros));
    preencherFiltrosHoje();
    configurarEventosHistorico();
    await inicializarSupabase();
    atualizarDataHoje();

    console.log('✅ App inicializada!');
}

/* ==================== FUNÇÃO HELPER: OBTER CAMINHO DA FOTO ====================
   Carrega imagens em formato WebP */

function getCaminhoFoto(id) {
    return `fotos/${id}.webp`;
}

function getCaminhoFotoLook(id) {
    const look = obterLookPorId(id);
    if (look?.foto) return look.foto;

    const prefixo = String(id || '').replace(/\d+$/, '');
    return `fotos/${prefixo}/${id}.webp`;
}

function obterLookPorId(id) {
    return app.looksFavoritos[id] || app.looks[id] || null;
}

function escapeHtml(valor) {
    return String(valor ?? '').replace(/[&<>"']/g, caractere => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[caractere]));
}

function valorVisivel(valor) {
    const texto = String(valor ?? '').trim();
    return texto && texto.toLowerCase() !== 'na';
}

function formatarLabelCampo(campo) {
    return String(campo || '')
        .replace(/_/g, ' ')
        .split(' ')
        .map(palavra => palavra ? palavra[0].toUpperCase() + palavra.slice(1).toLowerCase() : '')
        .join(' ');
}

function imagemFallback() {
    return 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23f1f5f9%22 width=%22100%22 height=%22100%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%2394a3b8%22>sem foto</text></svg>';
}

function onErrorImagem(extensoes = ['png', 'jpg']) {
    const listaExtensoes = `[${extensoes.map(ext => `'${ext}'`).join(',')}]`;
    return `this.onerror=null;const base=this.src.replace(/\\.[^.]+$/,'');const exts=${listaExtensoes};let i=Number(this.dataset.fallbackIndex||0);if(i<exts.length){this.dataset.fallbackIndex=i+1;this.src=base+'.'+exts[i];}else{this.src='${imagemFallback()}';}`;
}

function criarImagem(src, alt, classe = '') {
    return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" class="${escapeHtml(classe)}" onerror="${onErrorImagem()}">`;
}

function obterDetalhePeca(peca, campo) {
    return (peca.detalhes || []).find(item => String(item.campo || '').toLowerCase() === campo.toLowerCase())?.valor || '';
}

function criarCamposPecaHtml(peca, compacto = false) {
    const camposBase = [
        ['Tipo', peca.tipo],
        ['Função', peca.funcao],
        ['Subtipo', peca.subtipo],
        ['Padronagem', peca.padronagem],
        ['Cor detalhe', peca.cor_detalhe],
        ['Tom', peca.tom],
        ['Aquecimento', peca.nivel_aquecimento],
        ['Utilização', peca.utilizacao],
        ['Local', peca.local],
        ['Situação', peca.situacao],
    ];

    const detalhes = (peca.detalhes || []).map(item => [item.campo, item.valor]);
    const camposSemDuplicidade = new Map();
    [...camposBase, ...detalhes].forEach(([label, valor]) => {
        if (!valorVisivel(valor)) return;
        const chave = String(label || '').toLowerCase();
        if (!camposSemDuplicidade.has(chave)) {
            camposSemDuplicidade.set(chave, [label, valor]);
        }
    });
    const campos = [...camposSemDuplicidade.values()];
    const limite = compacto ? 6 : campos.length;

    return campos.slice(0, limite).map(([label, valor]) => `
        <div class="campo-card-peca">
            <span>${escapeHtml(formatarLabelCampo(label))}</span>
            <strong>${escapeHtml(valor)}</strong>
        </div>
    `).join('');
}

function normalizarListaPeca(valor) {
    if (!valor) return [];
    return Array.isArray(valor) ? valor : [valor];
}

function criarMiniaturaPeca(item, opcoes = {}) {
    const id = item.id || item.codigo || '';
    const descricao = item.descricao || item.grupo || id;
    const foto = opcoes.foto || item.foto || (item.id ? getCaminhoFoto(item.id) : '');
    const conteudo = foto
        ? criarImagem(foto, descricao)
        : `<span class="miniatura-sem-foto">${escapeHtml(id || 'sem foto')}</span>`;

    return `
        <span class="miniatura-peca ${opcoes.classe || ''}" title="${escapeHtml(descricao)}">
            ${conteudo}
            <small>${escapeHtml(id)}</small>
        </span>
    `;
}

function criarAcessoriosHtml(peca) {
    const acessorios = normalizarListaPeca(peca.acessorios);
    if (!acessorios.length) return '';

    return `
        <div class="bloco-card-peca">
            <h4>Acessórios</h4>
            <div class="miniaturas-peca">
                ${acessorios.map(item => criarMiniaturaPeca(item)).join('')}
            </div>
        </div>
    `;
}

function criarRestricoesHtml(peca) {
    const restricoes = normalizarListaPeca(peca.combinacoes_nao_permitidas);
    if (!restricoes.length) return '';

    return `
        <div class="bloco-card-peca">
            <h4>Não combinar</h4>
            <div class="miniaturas-peca miniaturas-restricoes">
                ${restricoes.map(item => `
                    <span class="miniatura-peca" title="${escapeHtml(item.descricao || item.codigo)}">
                        ${criarImagem(`fotos/combinacoes/${item.codigo}.webp`, item.descricao || item.codigo)}
                        <small>${escapeHtml(item.codigo)}</small>
                    </span>
                `).join('')}
            </div>
        </div>
    `;
}

function criarCardPeca(peca) {
    const card = document.createElement('div');
    card.className = 'card-peca';
    const textoBusca = [
        peca.id,
        peca.tipo,
        peca.funcao,
        peca.subtipo,
        peca.padronagem,
        peca.cor_detalhe,
        peca.tom,
        peca.nivel_aquecimento,
        peca.utilizacao,
        peca.local,
        peca.situacao,
        ...(peca.detalhes || []).flatMap(item => [item.campo, item.valor]),
        ...(peca.acessorios || []).flatMap(item => [item.grupo, item.id]),
        ...(peca.combinacoes_nao_permitidas || []).flatMap(item => [item.codigo, item.descricao]),
    ].filter(valorVisivel).join(' ');

    card.dataset.textoBusca = textoBusca.toLowerCase();
    card.innerHTML = `
        ${criarImagem(getCaminhoFoto(peca.id), peca.tipo || peca.id, 'foto-card-peca')}
        <div class="card-peca-corpo">
            <div class="card-peca-titulo">
                <strong>${escapeHtml(peca.id)}</strong>
            </div>
        </div>
    `;
    card.onclick = () => abrirDetalhsPeca(peca.id);
    return card;
}

function obterDataCriacaoLook(look) {
    return look?.basicos?.['Data criação'] || look?.dataCriacao || look?.data_criacao || '';
}

function formatarDataLook(valor) {
    if (!valor) return 'sem data';
    return /^\d{4}-\d{2}-\d{2}/.test(valor) ? formatarDataBR(valor) : valor;
}

function obterLooksCompativeis(pecasSelecionadas) {
    const selecionadas = [...new Set((pecasSelecionadas || []).filter(Boolean))];
    if (selecionadas.length === 0) return [];
    const selecionadasSet = new Set(selecionadas);
    const pecasInteirasSelecionadas = selecionadas.filter(id => ehPecaInteiraParaRegistro(id));
    const pecasInteirasSet = new Set(pecasInteirasSelecionadas);

    return obterTodosLooks()
        .filter(look => !ehLookExcluido(look))
        .map(look => ({
            ...look,
            pecasCompativeis: (look.pecas || []).filter(id => selecionadasSet.has(id)),
            pecasInteirasCompativeis: (look.pecas || []).filter(id => pecasInteirasSet.has(id)),
        }))
        .filter(look => look.pecasCompativeis.length >= 2 || look.pecasInteirasCompativeis.length > 0)
        .sort((a, b) => String(a.id || '').localeCompare(String(b.id || ''), 'pt-BR', { numeric: true }));
}

function ehLookExcluido(look) {
    return normalizarTexto(look?.situacao || look?.basicos?.['situação'] || look?.basicos?.situacao) === 'excluido';
}

function ehPecaInteiraParaRegistro(id) {
    return ['pijama', 'inteiro', 'inteiros'].includes(normalizarTexto(app.pecas[id]?.tipo));
}

function obterTiposPecasInteirasCompativeis(look) {
    return [...new Set((look.pecasInteirasCompativeis || [])
        .map(id => normalizarTexto(app.pecas[id]?.tipo))
        .filter(Boolean))];
}

function formatarNomeFiltro(campo) {
    const nomes = {
        tipo: 'Tipo',
        funcao: 'Função',
        subtipo: 'Subtipo',
        padronagem: 'Padronagem',
        tom: 'Tom',
        cor_detalhe: 'Cor detalhe',
        nivel_aquecimento: 'Aquecimento',
        situacao: 'Situação',
        utilizacao: 'Utilização',
        indicador: 'Tipo',
        clima: 'Clima',
        local: 'Local',
        htt: 'HTT',
        ocasiao: 'Ocasião'
    };
    if (nomes[campo]) return nomes[campo];
    return campo.toUpperCase().replace('_', ' ');
}

function criarFiltroMultiplo(container, campo, valores, selecionados, aoAlterar) {
    const filtro = document.createElement('div');
    filtro.className = 'filtro-multiplo';

    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'filtro-multiplo-toggle';
    botao.innerHTML = `
        <span class="filtro-multiplo-label">${formatarNomeFiltro(campo)}</span>
        <span class="filtro-multiplo-contador"></span>
        <span class="filtro-multiplo-seta">v</span>
    `;

    const opcoes = document.createElement('div');
    opcoes.className = 'filtro-multiplo-opcoes';

    const cabecalho = document.createElement('div');
    cabecalho.className = 'filtro-multiplo-cabecalho';
    cabecalho.innerHTML = `
        <strong>${formatarNomeFiltro(campo)}</strong>
        <button type="button" class="filtro-multiplo-fechar" aria-label="Fechar filtro">x</button>
    `;
    cabecalho.querySelector('button').addEventListener('click', event => {
        event.stopPropagation();
        filtro.classList.remove('aberto');
    });
    opcoes.appendChild(cabecalho);

    const atualizarResumo = () => {
        const total = opcoes.querySelectorAll('input:checked').length;
        const contador = botao.querySelector('.filtro-multiplo-contador');
        contador.textContent = total > 0 ? total : '';
        filtro.classList.toggle('tem-selecao', total > 0);
    };

    botao.addEventListener('click', () => {
        const estavaAberto = filtro.classList.contains('aberto');
        document.querySelectorAll('.filtro-multiplo.aberto').forEach(item => {
            item.classList.remove('aberto');
        });
        filtro.classList.toggle('aberto', !estavaAberto);
    });

    valores.sort().forEach(valor => {
        const label = document.createElement('label');
        label.className = 'filtro-chip';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = valor;
        checkbox.checked = selecionados.includes(valor);
        label.classList.toggle('selecionado', checkbox.checked);

        checkbox.addEventListener('change', () => {
            const novosValores = [...opcoes.querySelectorAll('input:checked')].map(input => input.value);
            label.classList.toggle('selecionado', checkbox.checked);
            atualizarResumo();
            aoAlterar(novosValores);
        });

        label.appendChild(checkbox);
        const marcador = document.createElement('span');
        marcador.className = 'filtro-chip-marcador';
        const texto = document.createElement('span');
        texto.className = 'filtro-chip-texto';
        texto.textContent = valor.charAt(0).toUpperCase() + valor.slice(1);
        label.appendChild(marcador);
        label.appendChild(texto);
        opcoes.appendChild(label);
    });

    filtro.appendChild(botao);
    filtro.appendChild(opcoes);
    container.appendChild(filtro);
    atualizarResumo();
}

document.addEventListener('click', evento => {
    if (!evento.target.closest('.filtro-multiplo')) {
        document.querySelectorAll('.filtro-multiplo.aberto').forEach(item => {
            item.classList.remove('aberto');
        });
    }
});

function pecaPassaNosFiltros(peca, filtros) {
    for (let campo in filtros) {
        const valores = filtros[campo];

        if (Array.isArray(valores) && valores.length > 0 && !valores.includes(peca[campo])) {
            return false;
        }
    }

    return true;
}

/* ==================== CARREGAR DADOS DO JSON ====================
   Busca o arquivo JSON e coloca os dados no app */

async function carregarDadosJSON() {
    try {
        // fetch() = busca um arquivo da internet (ou local)
        const response = await fetch('dados_guarda_roupa.json?v=20260603-todos-looks', { cache: 'no-store' });
        
        // .json() = transforma texto em objeto JavaScript
        const dados = await response.json();

        // Atribui ao app
        app.pecas = dados.pecas;
        app.looks = dados.looks;
        app.mapaOcasioes = dados.ocasioes || {};
        const tiposOcasiao = [...new Set(Object.values(app.mapaOcasioes).map(item => item.tipo).filter(Boolean))];
        if (tiposOcasiao.length > 0) app.ocasioes = tiposOcasiao;

        console.log(`✅ Carregados ${Object.keys(app.pecas).length} peças`);
        console.log(`✅ Carregados ${Object.keys(app.looks).length} looks`);
    } catch (erro) {
        console.error('❌ Erro ao carregar dados:', erro);
        alert('Erro ao carregar dados. Verifique se dados_guarda_roupa.json existe.');
    }
}

/* ==================== CARREGAR DADOS DO CELULAR ====================
   Busca dados salvos em localStorage (histórico, looks favoritos) */

function carregarDados() {
    // localStorage.getItem() = busca um valor salvo
    // JSON.parse() = transforma string em objeto
    // || [] = se não existir, usa lista vazia

    try {
        const historicoSalvo = localStorage.getItem('app_historico');
        app.historico = historicoSalvo ? JSON.parse(historicoSalvo) : [];
        if (!Array.isArray(app.historico)) app.historico = [];
    } catch (erro) {
        console.warn('Histórico salvo inválido. Iniciando vazio.', erro);
        app.historico = [];
    }

    try {
        const looksFavSalvos = localStorage.getItem('app_looks_favs');
        app.looksFavoritos = looksFavSalvos ? JSON.parse(looksFavSalvos) : {};
        if (garantirLooksFavoritosSemColisao()) salvarDadosLocal();
    } catch (erro) {
        console.warn('Looks favoritos salvos inválidos. Iniciando vazio.', erro);
        app.looksFavoritos = {};
    }

    console.log(`✅ Carregados ${app.historico.length} registros do histórico`);
    console.log(`✅ Carregados ${Object.keys(app.looksFavoritos).length} looks favoritos`);
}

/* ==================== SALVAR DADOS NO CELULAR ====================
   Persiste dados em localStorage (sobrevive ao fechar a app) */

function salvarDados() {
    // localStorage.setItem() = salva um valor
    // JSON.stringify() = transforma objeto em texto

    localStorage.setItem('app_historico', JSON.stringify(app.historico));
    localStorage.setItem('app_looks_favs', JSON.stringify(app.looksFavoritos));

    console.log('💾 Dados salvos!');
    agendarEnvioSupabase();
}

/* ==================== IMPORTAR HISTÓRICO ====================
   Lê arquivos .xlsm, .xlsx, .csv ou .json e mescla com os registros já salvos */

function supabaseConfigurado() {
    const config = window.SUPABASE_CONFIG || {};
    return Boolean(config.url && config.anonKey && window.supabase?.createClient);
}

async function inicializarSupabase() {
    configurarEventosSupabase();

    if (!supabaseConfigurado()) {
        atualizarStatusSupabase('Configure js/supabase-config.js para ativar a sincronização.');
        atualizarUISupabase(null);
        return false;
    }

    const config = window.SUPABASE_CONFIG;
    app.supabase = window.supabase.createClient(config.url, config.anonKey);

    const { data, error } = await app.supabase.auth.getSession();
    if (error) {
        atualizarStatusSupabase(error.message, 'erro');
        return false;
    }

    app.usuarioSupabase = data.session?.user || null;
    atualizarUISupabase(app.usuarioSupabase);

    if (app.usuarioSupabase) {
        await baixarDadosSupabase({ silencioso: true });
    } else {
        atualizarStatusSupabase('Entre na sua conta para baixar ou enviar o histórico pela nuvem.');
    }

    app.supabase.auth.onAuthStateChange(async (event, session) => {
        app.usuarioSupabase = session?.user || null;
        if (event === 'PASSWORD_RECOVERY') {
            app.recuperandoSenhaSupabase = true;
            atualizarStatusSupabase('Link de recuperacao validado. Digite sua nova senha.', 'sucesso');
        }
        atualizarUISupabase(app.usuarioSupabase);
        if (app.usuarioSupabase && !app.recuperandoSenhaSupabase) {
            await baixarDadosSupabase({ silencioso: true });
        } else if (!app.recuperandoSenhaSupabase) {
            atualizarStatusSupabase('Entre na sua conta para baixar ou enviar o histórico pela nuvem.');
        }
    });
}

function configurarEventosSupabase() {
    const eventos = [
        ['supabase-entrar', entrarSupabase],
        ['supabase-criar-conta', criarContaSupabase],
        ['supabase-sair', sairSupabase],
        ['supabase-sincronizar', sincronizarSupabase],
        ['supabase-baixar', () => baixarDadosSupabase()],
        ['supabase-enviar', () => enviarDadosSupabase()],
        ['supabase-recuperar-senha', solicitarRecuperacaoSenhaSupabase],
        ['supabase-atualizar-senha', atualizarSenhaSupabase],
        ['supabase-cancelar-reset', cancelarRecuperacaoSenhaSupabase],
    ];

    eventos.forEach(([id, acao]) => {
        const botao = document.getElementById(id);
        if (!botao || botao.dataset.eventoConfigurado === 'true') return;
        botao.addEventListener('click', acao);
        botao.dataset.eventoConfigurado = 'true';
    });
}

function atualizarStatusSupabase(mensagem, tipo = '') {
    const status = document.getElementById('supabase-status');
    if (!status) return;
    status.textContent = mensagem;
    status.className = `texto-ajuda ${tipo}`.trim();
}

function atualizarUISupabase(usuario) {
    const login = document.getElementById('supabase-login');
    const logado = document.getElementById('supabase-logado');
    const resetSenha = document.getElementById('supabase-reset-senha');
    const usuarioEl = document.getElementById('supabase-usuario');

    if (!login || !logado) return;

    if (app.recuperandoSenhaSupabase) {
        login.style.display = 'none';
        logado.style.display = 'none';
        if (resetSenha) resetSenha.style.display = 'grid';
        return;
    }

    login.style.display = usuario ? 'none' : 'grid';
    logado.style.display = usuario ? 'grid' : 'none';
    if (resetSenha) resetSenha.style.display = 'none';
    if (usuarioEl) usuarioEl.textContent = usuario ? `Conectado como ${usuario.email}` : '';
}

function obterCredenciaisSupabase() {
    const email = document.getElementById('supabase-email')?.value?.trim();
    const password = document.getElementById('supabase-senha')?.value || '';

    if (!email || !password) {
        alert('Preencha email e senha.');
        return null;
    }

    return { email, password };
}

function obterUrlRedirectSupabase() {
    return `${window.location.origin}${window.location.pathname}`;
}

async function solicitarRecuperacaoSenhaSupabase() {
    if (!app.supabase) {
        atualizarStatusSupabase('Configure o Supabase antes de recuperar senha.', 'erro');
        return;
    }

    const email = document.getElementById('supabase-email')?.value?.trim();
    if (!email) {
        alert('Digite seu email para receber o link de recuperacao.');
        return;
    }

    atualizarStatusSupabase('Enviando email de recuperacao...');
    const { error } = await app.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: obterUrlRedirectSupabase(),
    });

    if (error) {
        atualizarStatusSupabase(error.message, 'erro');
        return;
    }

    atualizarStatusSupabase('Email de recuperacao enviado. Abra o link no mesmo app para definir a nova senha.', 'sucesso');
}

async function atualizarSenhaSupabase() {
    if (!app.supabase) return;

    const novaSenha = document.getElementById('supabase-nova-senha')?.value || '';
    const confirmarSenha = document.getElementById('supabase-confirmar-senha')?.value || '';

    if (novaSenha.length < 6) {
        alert('A nova senha precisa ter pelo menos 6 caracteres.');
        return;
    }
    if (novaSenha !== confirmarSenha) {
        alert('As senhas nao conferem.');
        return;
    }

    atualizarStatusSupabase('Atualizando senha...');
    const { data, error } = await app.supabase.auth.updateUser({ password: novaSenha });

    if (error) {
        atualizarStatusSupabase(error.message, 'erro');
        return;
    }

    app.recuperandoSenhaSupabase = false;
    app.usuarioSupabase = data.user || app.usuarioSupabase;
    document.getElementById('supabase-nova-senha').value = '';
    document.getElementById('supabase-confirmar-senha').value = '';
    atualizarUISupabase(app.usuarioSupabase);
    atualizarStatusSupabase('Senha atualizada. Voce ja esta conectada.', 'sucesso');
    await baixarDadosSupabase({ silencioso: true });
}

function cancelarRecuperacaoSenhaSupabase() {
    app.recuperandoSenhaSupabase = false;
    document.getElementById('supabase-nova-senha').value = '';
    document.getElementById('supabase-confirmar-senha').value = '';
    atualizarUISupabase(app.usuarioSupabase);
    atualizarStatusSupabase('Recuperacao de senha cancelada.');
}

async function entrarSupabase() {
    if (!app.supabase) {
        atualizarStatusSupabase('Configure o Supabase antes de entrar.', 'erro');
        return;
    }

    const credenciais = obterCredenciaisSupabase();
    if (!credenciais) return;

    atualizarStatusSupabase('Entrando...');
    const { data, error } = await app.supabase.auth.signInWithPassword(credenciais);
    if (error) {
        atualizarStatusSupabase(error.message, 'erro');
        return false;
    }

    app.usuarioSupabase = data.session?.user || data.user;
    app.recuperandoSenhaSupabase = false;
    atualizarUISupabase(app.usuarioSupabase);
    await baixarDadosSupabase();
}

async function criarContaSupabase() {
    if (!app.supabase) {
        atualizarStatusSupabase('Configure o Supabase antes de criar conta.', 'erro');
        return;
    }

    const credenciais = obterCredenciaisSupabase();
    if (!credenciais) return;

    atualizarStatusSupabase('Criando conta...');
    const { data, error } = await app.supabase.auth.signUp(credenciais);
    if (error) {
        atualizarStatusSupabase(error.message, 'erro');
        return;
    }

    if (!data.session) {
        app.usuarioSupabase = null;
        atualizarUISupabase(null);
        atualizarStatusSupabase('Conta criada. Confirme o email se o Supabase pediu confirmacao, depois volte aqui e clique em Entrar.', 'sucesso');
        return;
    }

    app.usuarioSupabase = data.session.user;
    atualizarUISupabase(app.usuarioSupabase);
    const enviou = await enviarDadosSupabase({ silencioso: true });
    atualizarStatusSupabase('Conta criada. Se o Supabase pedir confirmação de email, confirme antes do próximo login.', 'sucesso');
    atualizarStatusSupabase(
        enviou ? 'Conta criada e sincronizada com a nuvem.' : 'Conta criada, mas ainda nao consegui gravar na tabela. Clique em Sincronizar novamente.',
        enviou ? 'sucesso' : 'erro'
    );
}

async function sairSupabase() {
    if (!app.supabase) return;
    await app.supabase.auth.signOut();
    app.usuarioSupabase = null;
    app.recuperandoSenhaSupabase = false;
    atualizarUISupabase(null);
    atualizarStatusSupabase('Desconectado.');
}

async function sincronizarSupabase() {
    const sessao = await obterSessaoSupabase();
    if (!sessao?.user) {
        app.usuarioSupabase = null;
        atualizarUISupabase(null);
        alert('Entre na sua conta primeiro.');
        atualizarStatusSupabase('Entre com email e senha antes de sincronizar. Se acabou de criar a conta, confirme o email primeiro.', 'erro');
        return;
    }

    app.usuarioSupabase = sessao.user;
    atualizarUISupabase(app.usuarioSupabase);
    atualizarStatusSupabase('Sincronizando...');
    const baixou = await baixarDadosSupabase({ silencioso: true });
    if (!baixou) {
        atualizarStatusSupabase('Nao consegui baixar os dados atuais da nuvem antes de sincronizar.', 'erro');
        return;
    }

    const enviou = await enviarDadosSupabase({ silencioso: false, mesclarAntes: false });
    if (enviou) {
        atualizarStatusSupabase('Sincronizado com a nuvem. Atualize a tabela wardrobe_sync no Supabase para ver a linha.', 'sucesso');
    }
}

async function obterSessaoSupabase() {
    if (!app.supabase) return null;

    const { data, error } = await app.supabase.auth.getSession();
    if (error) {
        atualizarStatusSupabase(error.message, 'erro');
        return null;
    }

    return data.session || null;
}

async function baixarDadosSupabase({ silencioso = false } = {}) {
    if (!app.supabase || !app.usuarioSupabase) return false;
    if (!silencioso) atualizarStatusSupabase('Baixando dados da nuvem...');

    const { data, error } = await app.supabase
        .from('wardrobe_sync')
        .select('historico, looks_favoritos')
        .eq('user_id', app.usuarioSupabase.id)
        .maybeSingle();

    if (error) {
        atualizarStatusSupabase(error.message, 'erro');
        return false;
    }

    if (data) {
        mesclarDadosNuvem(data);
        salvarDadosLocal();
        atualizarTelasAposSync();
    }

    if (!silencioso) atualizarStatusSupabase('Dados baixados e mesclados.', 'sucesso');
    return true;
}

async function enviarDadosSupabaseAntigo({ silencioso = false, mesclarAntes = true } = {}) {
    if (!app.supabase || !app.usuarioSupabase || app.sincronizando) return false;

    app.sincronizando = true;
    if (!silencioso) atualizarStatusSupabase('Enviando dados para a nuvem...');

    if (mesclarAntes) {
        const baixou = await baixarDadosSupabase({ silencioso: true });
        if (!baixou) {
            app.sincronizando = false;
            if (!silencioso) atualizarStatusSupabase('NÃ£o enviei porque nÃ£o consegui conferir a nuvem primeiro.', 'erro');
            return false;
        }
    }

    const { error } = await app.supabase
        .from('wardrobe_sync')
        .upsert({
            user_id: app.usuarioSupabase.id,
            historico: app.historico,
            looks_favoritos: app.looksFavoritos,
            updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

    app.sincronizando = false;

    if (error) {
        atualizarStatusSupabase(error.message, 'erro');
        return;
    }

    if (!silencioso) atualizarStatusSupabase('Dados enviados para a nuvem.', 'sucesso');
    return true;
}

async function enviarDadosSupabase({ silencioso = false, mesclarAntes = true } = {}) {
    if (!app.supabase || !app.usuarioSupabase) {
        atualizarStatusSupabase('Entre na sua conta antes de enviar para a nuvem.', 'erro');
        return false;
    }

    if (app.sincronizando) return false;

    app.sincronizando = true;
    if (!silencioso) atualizarStatusSupabase('Enviando dados para a nuvem...');

    try {
        if (mesclarAntes) {
            const baixou = await baixarDadosSupabase({ silencioso: true });
            if (!baixou) {
                if (!silencioso) atualizarStatusSupabase('Nao enviei porque nao consegui conferir a nuvem primeiro.', 'erro');
                return false;
            }
        }

        const { data, error } = await app.supabase
            .from('wardrobe_sync')
            .upsert({
                user_id: app.usuarioSupabase.id,
                historico: app.historico,
                looks_favoritos: app.looksFavoritos,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' })
            .select('updated_at')
            .single();

        if (error) {
            console.error('Erro ao enviar para Supabase:', error);
            atualizarStatusSupabase(`Erro ao enviar: ${error.message}`, 'erro');
            return false;
        }

        if (!silencioso) {
            atualizarStatusSupabase(
                `Dados enviados para a nuvem (${app.historico.length} registros, ${Object.keys(app.looksFavoritos).length} looks criados). Ultima gravacao: ${formatarDataHoraSupabase(data?.updated_at)}.`,
                'sucesso'
            );
        }
        return true;
    } catch (erro) {
        console.error('Falha inesperada ao enviar para Supabase:', erro);
        atualizarStatusSupabase(`Falha inesperada ao enviar: ${erro.message}`, 'erro');
        return false;
    } finally {
        app.sincronizando = false;
    }
}

function agendarEnvioSupabase() {
    if (!app.supabase || !app.usuarioSupabase || app.sincronizando) return;
    window.clearTimeout(app.timeoutSyncSupabase);
    const mesclarAntes = !app.forcarEnvioLocalSupabase;
    app.forcarEnvioLocalSupabase = false;
    app.timeoutSyncSupabase = window.setTimeout(() => enviarDadosSupabase({ silencioso: true, mesclarAntes }), 800);
}

function formatarDataHoraSupabase(valor) {
    if (!valor) return 'confirmada';

    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) return valor;

    return data.toLocaleString('pt-BR');
}

function salvarDadosLocal() {
    localStorage.setItem('app_historico', JSON.stringify(app.historico));
    localStorage.setItem('app_looks_favs', JSON.stringify(app.looksFavoritos));
}

function mesclarDadosNuvem(data) {
    const historicoNuvem = Array.isArray(data.historico) ? data.historico : [];

    historicoNuvem.forEach(registro => {
        mesclarRegistroHistorico(registro);
    });

    app.looksFavoritos = {
        ...(data.looks_favoritos || {}),
        ...app.looksFavoritos,
    };
    garantirLooksFavoritosSemColisao();
}

function atualizarTelasAposSync() {
    preencherSelectLooks();
    preencherFiltrosOcasiao();
    if (document.getElementById('historico')?.style.display !== 'none') {
        inicializarHistorico();
    }
}

function atualizarStatusImportacao(mensagem, tipo = '') {
    const status = document.getElementById('status-importacao-historico');
    if (!status) return;

    status.textContent = mensagem;
    status.className = `texto-ajuda ${tipo}`.trim();
}

function configurarEventosHistorico() {
    const eventos = [
        ['historico-periodo-7', () => atualizarHistoricoPeriodo(7)],
        ['historico-periodo-14', () => atualizarHistoricoPeriodo(14)],
        ['historico-periodo-30', () => atualizarHistoricoPeriodo(30)],
        ['historico-periodo-todos', atualizarHistoricoCompleto],
        ['historico-consultar-datas', consultarHistoricoPorDatas],
        ['historico-importar-arquivo', importarHistoricoArquivo],
        ['filtro-sem-uso-tipo', evento => atualizarFiltroSemUso('tipo', evento), 'change'],
        ['filtro-sem-uso-local', evento => atualizarFiltroSemUso('local', evento), 'change'],
        ['filtro-sem-uso-situacao', evento => atualizarFiltroSemUso('situacao', evento), 'change'],
        ['filtro-sem-uso-tempo', evento => atualizarFiltroSemUso('tempo', evento), 'change'],
        ['calendario-mes-anterior', () => navegarMesCalendarioHistorico(-1)],
        ['calendario-mes-proximo', () => navegarMesCalendarioHistorico(1)],
    ];

    eventos.forEach(([id, acao, evento = 'click']) => {
        const botao = document.getElementById(id);
        if (!botao || botao.dataset.eventoConfigurado === 'true') return;

        botao.addEventListener(evento, acao);
        botao.dataset.eventoConfigurado = 'true';
    });
}

async function importarHistoricoArquivo() {
    const input = document.getElementById('arquivo-historico');
    const arquivo = input?.files?.[0];

    if (!arquivo) {
        alert('Escolha um arquivo de histórico primeiro.');
        return;
    }

    atualizarStatusImportacao('Lendo arquivo...');

    try {
        const linhas = await lerTabelaHistorico(arquivo);
        const registros = normalizarLinhasHistorico(linhas);
        const resultado = mesclarHistorico(registros);

        salvarDados();
        aplicarFiltroHistoricoAtivo();
        atualizarStatusImportacao(
            `Importação concluída: ${resultado.adicionados} novos registros, ${resultado.duplicados} duplicados ignorados.`,
            'sucesso'
        );

        if (resultado.ignorados > 0) {
            alert(`${resultado.ignorados} linha(s) não tinham data ou peça/look reconhecido e foram ignoradas.`);
        }

        input.value = '';
    } catch (erro) {
        console.error('Erro ao importar histórico:', erro);
        atualizarStatusImportacao(`Não consegui importar: ${erro.message}`, 'erro');
        alert(`Não consegui importar esse arquivo: ${erro.message}`);
    }
}

async function lerTabelaHistorico(arquivo) {
    const nome = arquivo.name.toLowerCase();

    if (nome.endsWith('.json')) {
        const dados = JSON.parse(await arquivo.text());
        return Array.isArray(dados) ? dados : dados.historico || [];
    }

    if (nome.endsWith('.csv')) {
        return csvParaObjetos(await arquivo.text());
    }

    if (nome.endsWith('.xlsx') || nome.endsWith('.xlsm')) {
        const buffer = await arquivo.arrayBuffer();
        return xlsxParaObjetos(buffer);
    }

    throw new Error('use um arquivo .xlsm, .xlsx, .csv ou .json.');
}

function normalizarLinhasHistorico(linhas) {
    const registros = [];
    let ignorados = 0;

    linhas.forEach(linha => {
        const registro = normalizarRegistroHistorico(linha);
        if (registro) {
            registros.push(registro);
        } else {
            ignorados++;
        }
    });

    registros.ignorados = ignorados;
    return registros;
}

function normalizarRegistroHistorico(linha) {
    if (!linha || typeof linha !== 'object') return null;

    const campos = mapearCamposNormalizados(linha);
    const data = normalizarDataHistorico(
        campos.data || campos.dia || campos.date || campos.datauso || campos.dataregistro || linha.data
    );

    const lookIds = extrairIdsLooks(linha);
    const lookId = lookIds[0] || normalizarLookId(
        campos.look || campos.lookid || campos.idlook || campos.look_id || linha.lookId
    );

    const pecas = extrairIdsPecas(linha);
    lookIds.forEach(id => {
        const look = obterLookPorId(id);
        if (look?.pecas) pecas.push(...look.pecas);
    });

    const pecasValidas = [...new Set(pecas)].filter(id => app.pecas[id]);

    if (!data || pecasValidas.length === 0) return null;

    return {
        data,
        pecas: pecasValidas,
        lookId: lookId || null,
        lookIds,
    };
}

function mapearCamposNormalizados(linha) {
    const campos = {};

    Object.entries(linha).forEach(([chave, valor]) => {
        const chaveNormalizada = normalizarTexto(chave);
        campos[chaveNormalizada] = valor;
    });

    return campos;
}

function normalizarTexto(texto) {
    return String(texto || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9_]/g, '')
        .toLowerCase();
}

function normalizarDataHistorico(valor) {
    if (!valor && valor !== 0) return null;

    if (valor instanceof Date && !Number.isNaN(valor.getTime())) {
        return criarDataMeioDia(valor.getFullYear(), valor.getMonth(), valor.getDate());
    }

    if (typeof valor === 'number') {
        const dataExcel = new Date(Math.round((valor - 25569) * 86400 * 1000));
        return criarDataMeioDia(dataExcel.getUTCFullYear(), dataExcel.getUTCMonth(), dataExcel.getUTCDate());
    }

    const texto = String(valor).trim();
    const numeroExcel = Number(texto.replace(',', '.'));
    if (/^\d+([,.]\d+)?$/.test(texto) && numeroExcel > 25000) {
        return normalizarDataHistorico(numeroExcel);
    }

    const dataBR = texto.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})$/);
    if (dataBR) {
        const ano = Number(dataBR[3].length === 2 ? `20${dataBR[3]}` : dataBR[3]);
        return criarDataMeioDia(ano, Number(dataBR[2]) - 1, Number(dataBR[1]));
    }

    const dataISO = texto.match(/^(\d{4})[\/.-](\d{1,2})[\/.-](\d{1,2})/);
    if (dataISO) {
        return criarDataMeioDia(Number(dataISO[1]), Number(dataISO[2]) - 1, Number(dataISO[3]));
    }

    const data = new Date(texto);
    if (!Number.isNaN(data.getTime())) {
        return criarDataMeioDia(data.getFullYear(), data.getMonth(), data.getDate());
    }

    return null;
}

function criarDataMeioDia(ano, mes, dia) {
    return new Date(ano, mes, dia, 12, 0, 0).toISOString();
}

function normalizarLookId(valor) {
    if (!valor) return null;

    const texto = String(valor).trim().toUpperCase();
    const ids = texto.match(/\b(?:LOOK_\d+|[A-Z]{1,4}\d{4})\b/g) || [];
    return ids.find(id => obterLookPorId(id)) || null;
}

function extrairIdsLooks(linha) {
    const ids = [];

    Object.entries(linha).forEach(([chave, valor]) => {
        if (valor === null || valor === undefined) return;

        const chaveNormalizada = normalizarTexto(chave);
        if (!chaveNormalizada.includes('look')) return;

        const texto = String(valor).toUpperCase();
        const encontrados = texto.match(/\b(?:LOOK_\d+|[A-Z]{1,4}\d{4})\b/g) || [];
        ids.push(...encontrados.filter(id => obterLookPorId(id)));
    });

    return [...new Set(ids)];
}

function extrairIdsPecas(linha) {
    const ids = [];

    Object.entries(linha).forEach(([chave, valor]) => {
        if (valor === null || valor === undefined) return;

        const chaveNormalizada = normalizarTexto(chave);
        const texto = String(valor).toUpperCase();

        if (chaveNormalizada.includes('look')) return;

        const encontrados = texto.match(/\bID\d{4}\b/g) || [];
        ids.push(...encontrados);
    });

    return [...new Set(ids)];
}

function mesclarHistorico(registros) {
    const resultado = {
        adicionados: 0,
        duplicados: 0,
        ignorados: registros.ignorados || 0,
    };

    registros.forEach(registro => {
        const mesclou = mesclarRegistroHistorico(registro);
        if (!mesclou) {
            resultado.duplicados++;
            return;
        }
        resultado.adicionados++;
    });

    return resultado;
}

function normalizarRegistroUso(registro) {
    if (!registro || typeof registro !== 'object') return null;

    const data = normalizarDataHistorico(registro.data);
    const pecas = [...new Set(Array.isArray(registro.pecas) ? registro.pecas : [])].filter(id => app.pecas[id]);
    const lookIds = [...new Set([registro.lookId, ...(Array.isArray(registro.lookIds) ? registro.lookIds : [])].filter(Boolean))];

    if (!data || pecas.length === 0) return null;

    return {
        ...registro,
        data,
        pecas,
        lookId: lookIds[0] || null,
        lookIds,
    };
}

function chaveRegistroHistoricoBase(registro) {
    const dia = normalizarDataHistorico(registro.data)?.slice(0, 10) || '';
    const pecas = [...(registro.pecas || [])].sort().join(',');
    return `${dia}|${pecas}`;
}

function mesclarRegistroHistorico(registro) {
    const normalizado = normalizarRegistroUso(registro);
    if (!normalizado) return false;

    const chaveCompleta = chaveRegistroHistorico(normalizado);
    const existenteCompleto = app.historico.find(item => chaveRegistroHistorico(item) === chaveCompleta);
    if (existenteCompleto) return false;

    const chaveBase = chaveRegistroHistoricoBase(normalizado);
    const existenteBase = app.historico.find(item => chaveRegistroHistoricoBase(item) === chaveBase);
    if (existenteBase) {
        const lookIds = new Set(obterLookIdsRegistro(existenteBase));
        obterLookIdsRegistro(normalizado).forEach(id => lookIds.add(id));
        existenteBase.lookIds = [...lookIds];
        existenteBase.lookId = existenteBase.lookId || normalizado.lookId || existenteBase.lookIds[0] || null;
        return true;
    }

    app.historico.push(normalizado);
    return true;
}

function chaveRegistroHistorico(registro) {
    const dia = normalizarDataHistorico(registro.data)?.slice(0, 10) || '';
    const pecas = [...(registro.pecas || [])].sort().join(',');
    const looks = [...new Set([registro.lookId, ...(registro.lookIds || [])].filter(Boolean))].sort().join(',');
    return `${dia}|${pecas}|${looks}`;
}

function csvParaObjetos(texto) {
    const delimitador = detectarDelimitadorCSV(texto);
    const linhas = [];
    let linha = [];
    let valor = '';
    let dentroAspas = false;

    for (let i = 0; i < texto.length; i++) {
        const char = texto[i];
        const proximo = texto[i + 1];

        if (char === '"' && dentroAspas && proximo === '"') {
            valor += '"';
            i++;
        } else if (char === '"') {
            dentroAspas = !dentroAspas;
        } else if (char === delimitador && !dentroAspas) {
            linha.push(valor.trim());
            valor = '';
        } else if ((char === '\n' || char === '\r') && !dentroAspas) {
            if (char === '\r' && proximo === '\n') i++;
            linha.push(valor.trim());
            if (linha.some(celula => celula !== '')) linhas.push(linha);
            linha = [];
            valor = '';
        } else {
            valor += char;
        }
    }

    linha.push(valor.trim());
    if (linha.some(celula => celula !== '')) linhas.push(linha);

    return matrizParaObjetos(linhas);
}

function detectarDelimitadorCSV(texto) {
    const primeiraLinha = texto.split(/\r?\n/).find(linha => linha.trim()) || '';
    const candidatos = [';', ',', '\t'];

    return candidatos
        .map(delimitador => ({
            delimitador,
            total: primeiraLinha.split(delimitador).length,
        }))
        .sort((a, b) => b.total - a.total)[0].delimitador;
}

async function xlsxParaObjetos(buffer) {
    const arquivos = await lerZipBasico(buffer);
    const sharedStrings = obterSharedStrings(arquivos['xl/sharedStrings.xml']);
    const caminhoPlanilha = obterCaminhoPrimeiraPlanilha(arquivos);
    const xmlPlanilha = arquivos[caminhoPlanilha];

    if (!xmlPlanilha) {
        throw new Error('não encontrei uma aba de planilha dentro do .xlsx.');
    }

    const linhas = planilhaXmlParaMatriz(xmlPlanilha, sharedStrings);
    return matrizParaObjetos(linhas);
}

async function lerZipBasico(buffer) {
    const bytes = new Uint8Array(buffer);
    const arquivos = {};
    const decoder = new TextDecoder('utf-8');
    let offset = 0;

    while (offset < bytes.length - 30) {
        const assinatura = lerUint32(bytes, offset);
        if (assinatura !== 0x04034b50) {
            offset++;
            continue;
        }

        const metodo = lerUint16(bytes, offset + 8);
        const tamanhoComprimido = lerUint32(bytes, offset + 18);
        const tamanhoNome = lerUint16(bytes, offset + 26);
        const tamanhoExtra = lerUint16(bytes, offset + 28);
        const inicioNome = offset + 30;
        const nome = decoder.decode(bytes.slice(inicioNome, inicioNome + tamanhoNome));
        const inicioDados = inicioNome + tamanhoNome + tamanhoExtra;
        const fimDados = inicioDados + tamanhoComprimido;
        const dados = bytes.slice(inicioDados, fimDados);

        if (!nome.endsWith('/')) {
            arquivos[nome] = await descomprimirZip(dados, metodo);
        }

        offset = fimDados;
    }

    return arquivos;
}

function lerUint16(bytes, offset) {
    return bytes[offset] | (bytes[offset + 1] << 8);
}

function lerUint32(bytes, offset) {
    return (bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16) | (bytes[offset + 3] << 24)) >>> 0;
}

async function descomprimirZip(dados, metodo) {
    if (metodo === 0) {
        return new TextDecoder('utf-8').decode(dados);
    }

    if (metodo !== 8 || typeof DecompressionStream === 'undefined') {
        throw new Error('este navegador não conseguiu ler o .xlsm/.xlsx. Salve a primeira aba como CSV e tente novamente.');
    }

    const stream = new Blob([dados]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    const buffer = await new Response(stream).arrayBuffer();
    return new TextDecoder('utf-8').decode(buffer);
}

function obterSharedStrings(xml = '') {
    const strings = [];
    const itens = xml.match(/<si[\s\S]*?<\/si>/g) || [];

    itens.forEach(item => {
        const textos = [...item.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)]
            .map(match => decodificarXml(match[1]));
        strings.push(textos.join(''));
    });

    return strings;
}

function obterCaminhoPrimeiraPlanilha(arquivos) {
    const workbook = arquivos['xl/workbook.xml'];
    const rels = arquivos['xl/_rels/workbook.xml.rels'];

    if (workbook && rels) {
        const sheet = workbook.match(/<sheet[^>]*r:id="([^"]+)"/);
        if (sheet) {
            const rel = new RegExp(`<Relationship[^>]*Id="${sheet[1]}"[^>]*Target="([^"]+)"`).exec(rels);
            if (rel) return `xl/${rel[1].replace(/^\/?xl\//, '')}`;
        }
    }

    return 'xl/worksheets/sheet1.xml';
}

function planilhaXmlParaMatriz(xml, sharedStrings) {
    const linhas = [];
    const linhasXml = xml.match(/<row[\s\S]*?<\/row>/g) || [];

    linhasXml.forEach(rowXml => {
        const linha = [];
        const celulas = rowXml.match(/<c[\s\S]*?<\/c>/g) || [];

        celulas.forEach(celulaXml => {
            const referencia = celulaXml.match(/r="([A-Z]+)\d+"/);
            const indiceColuna = referencia ? colunaParaIndice(referencia[1]) : linha.length;
            linha[indiceColuna] = obterValorCelula(celulaXml, sharedStrings);
        });

        linhas.push(linha.map(valor => valor ?? ''));
    });

    return linhas;
}

function colunaParaIndice(coluna) {
    return coluna.split('').reduce((total, letra) => total * 26 + letra.charCodeAt(0) - 64, 0) - 1;
}

function obterValorCelula(celulaXml, sharedStrings) {
    const tipo = celulaXml.match(/t="([^"]+)"/)?.[1];

    if (tipo === 'inlineStr') {
        return decodificarXml(celulaXml.match(/<t[^>]*>([\s\S]*?)<\/t>/)?.[1] || '');
    }

    const valor = celulaXml.match(/<v>([\s\S]*?)<\/v>/)?.[1] || '';
    if (tipo === 's') return sharedStrings[Number(valor)] || '';

    return decodificarXml(valor);
}

function matrizParaObjetos(linhas) {
    if (!linhas.length) return [];

    const cabecalhos = linhas[0].map((valor, index) => String(valor || `coluna_${index + 1}`).trim());

    return linhas.slice(1).map(linha => {
        const objeto = {};
        cabecalhos.forEach((cabecalho, index) => {
            objeto[cabecalho] = linha[index] ?? '';
        });
        return objeto;
    });
}

function decodificarXml(texto) {
    const mapa = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&apos;': "'",
    };

    return String(texto || '').replace(/&(amp|lt|gt|quot|apos);/g, entidade => mapa[entidade] || entidade);
}

/* ==================== NAVEGAÇÃO: MOSTRAR/ESCONDER PÁGINAS ====================
   Sistema de single-page-app: uma página HTML, múltiplas visualizações */

function mostrarPagina(nome) {
    // Esconde TODAS as páginas
    // querySelectorAll() = busca todos os elementos com essa classe
    document.querySelectorAll('.pagina').forEach(pagina => {
        pagina.style.display = 'none';
    });

    // Mostra apenas a selecionada
    const pagina = document.getElementById(nome);
    if (pagina) {
        pagina.style.display = 'block';
    }

    if (nome === 'historico') {
        inicializarHistorico();
    }

    if (nome === 'looks') {
        renderLooks(obterTodosLooks().filter(lookPassaNosFiltros));
    }

    console.log(`📄 Mostrando página: ${nome}`);
}

/* Mudar botão ativo da navbar */
function ativarNavBtn(index) {
    // Desativa todos
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Ativa o selecionado
    document.querySelectorAll('.nav-btn')[index].classList.add('active');
}

/* ==================== PÁGINA HOME: GALERIA DE PEÇAS ====================
   Renderiza (desenha) a galeria com todas as peças */

function renderGaleria() {
    const galeria = document.getElementById('galeria');
    // innerHTML = "limpa" o conteúdo anterior
    galeria.innerHTML = '';

    // Object.values() = pega só os valores (não as chaves)
    // forEach() = repete para cada item
    Object.values(app.pecas).forEach(peca => {
        galeria.appendChild(criarCardPeca(peca));
    });

    console.log('🖼️ Galeria renderizada!');
}

/* ==================== FILTROS DA PÁGINA HOME ====================
   Preencher filtros dinamicamente com valores únicos do JSON */

function preencherFiltrosHome() {
    // Extrair valores únicos para cada campo
    const campos = CAMPOS_FILTROS_PECAS;
    
    const container = document.getElementById('filtros-home');
    
    campos.forEach(campo => {
        const valores = [...new Set(Object.values(app.pecas).map(p => p[campo]).filter(v => v && v !== 'na'))];
        
        if (valores.length > 0) {
            criarFiltroMultiplo(container, campo, valores, app.filtrosHome[campo], novosValores => {
                filtrarHome(campo, novosValores);
                renderGaleriaFiltrada();
            });
        }
    });
    
    console.log('📋 Filtros da Home criados!');
}

/* Atualizar filtro da Home */
function filtrarHome(campo, valor) {
    app.filtrosHome[campo] = valor;
}

/* Resetar todos os filtros da Home */
function resetarFiltrosHome() {
    for (let campo in app.filtrosHome) {
        app.filtrosHome[campo] = [];
    }
    
    // Resetar visualmente as caixas de selecao
    document.querySelectorAll('#filtros-home input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
        checkbox.closest('.filtro-chip')?.classList.remove('selecionado');
    });

    document.querySelectorAll('#filtros-home .filtro-multiplo').forEach(filtro => {
        filtro.classList.remove('tem-selecao', 'aberto');
        filtro.querySelector('.filtro-multiplo-contador').textContent = '';
    });
    
    renderGaleriaFiltrada();
}

/* Renderizar galeria com filtros aplicados */
function renderGaleriaFiltrada() {
    const galeria = document.getElementById('galeria');
    galeria.innerHTML = '';

    Object.values(app.pecas).forEach(peca => {
        // Verificar cada filtro
        let passouNosFiltros = true;
        
        for (let campo in app.filtrosHome) {
            const filtro = app.filtrosHome[campo];
            // Se o filtro não está vazio, tem que bater
            if (Array.isArray(filtro) && filtro.length > 0) {
                if (!filtro.includes(peca[campo])) {
                    passouNosFiltros = false;
                    break;
                }
            }
        }

        if (!passouNosFiltros) return;

        galeria.appendChild(criarCardPeca(peca));
    });

    console.log('🖼️ Galeria filtrada renderizada!');
}

/* Filtrar peças por texto na barra de pesquisa */
function filtrarPecas() {
    const termo = document.getElementById('filtro-pesquisa').value.toLowerCase();
    const cards = document.querySelectorAll('.card-peca');

    cards.forEach(card => {
        const texto = card.dataset.textoBusca || card.textContent.toLowerCase();
        card.style.display = texto.includes(termo) ? '' : 'none';
    });
}

/* ==================== MODAL: DETALHES DA PEÇA ====================
   Mostra informações completas de uma peça */

function abrirDetalhsPeca(id) {
    const peca = app.pecas[id];
    if (!peca) return;

    // Guardar referência para usar depois
    app.pecaEmDetalhes = id;

    // Preencher modal com dados
    document.querySelector('#modal-peca .ficha-peca').innerHTML = `
        <div class="campos-modal-peca">
            <div class="campo-ficha">
                <span class="label">ID:</span>
                <span>${escapeHtml(peca.id)}</span>
            </div>
            ${criarCamposPecaHtml(peca)}
        </div>
        ${criarAcessoriosHtml(peca)}
        ${criarRestricoesHtml(peca)}
    `;
    document.getElementById('titulo-modal').textContent = `${peca.tipo || peca.id}`;
    document.getElementById('foto-modal').src = getCaminhoFoto(peca.id);

    // Mostrar modal
    document.getElementById('modal-peca').style.display = 'flex';
}

function fecharModal() {
    // Esconde todos os modais
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

/* ==================== PÁGINA USAR HOJE ====================
   Registra quais peças foram usadas hoje */

function atualizarDataHoje() {
    const hoje = new Date();
    document.getElementById('data-hoje').textContent = 'Escolha a data do uso e selecione as peças utilizadas.';

    const campoData = document.getElementById('data-registro-uso');
    if (campoData && !campoData.value) {
        campoData.value = formatarDataParaInput(hoje);
    }
}

function formatarDataParaInput(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

/* Renderizar galeria de peças com filtros aplicados na aba "Usar Hoje" */
function preencherFiltrosHoje() {
    const container = document.getElementById('filtros-hoje');
    if (!container) return;

    container.innerHTML = '';

    const botaoLimpar = document.createElement('button');
    botaoLimpar.type = 'button';
    botaoLimpar.textContent = 'Limpar Filtros';
    botaoLimpar.onclick = resetarFiltrosHoje;
    container.appendChild(botaoLimpar);

    CAMPOS_FILTROS_GERAIS_HOJE.forEach(campo => {
        const valores = [...new Set(Object.values(app.pecas).map(p => p[campo]).filter(v => v && v !== 'na'))];

        if (valores.length > 0) {
            criarFiltroMultiplo(container, campo, valores, app.filtrosHoje[campo], novosValores => {
                filtrarHoje(campo, novosValores);
                renderGaleriaUsarHoje();
            });
        }
    });

    renderGaleriaUsarHoje();
}

function filtrarHoje(campo, valor) {
    app.filtrosHoje[campo] = valor;
}

function resetarFiltrosHoje() {
    for (let campo in app.filtrosHoje) {
        app.filtrosHoje[campo] = [];
    }

    GRUPOS_REGISTRO_PECAS.forEach(grupo => {
        app.filtrosHojeGrupos[grupo.id] = { tipo: [], subtipo: [] };
    });

    preencherFiltrosHoje();
}

function renderGaleriaUsarHojeAntiga() {
    const galeria = document.getElementById('galeria-usar-hoje');
    galeria.innerHTML = '';

    Object.entries(app.pecas).forEach(([id, peca]) => {
        // Verificar se atende ao filtro de tipo
        let passouNosFiltros = true;
        
        // Verificar se atende ao filtro de função
        for (let campo in app.filtrosHoje) {
            const filtro = app.filtrosHoje[campo];
            if (Array.isArray(filtro) && filtro.length > 0) {
                if (!filtro.includes(peca[campo])) {
                    passouNosFiltros = false;
                    break;
                }
            }
        }

        if (passouNosFiltros) {
            const card = document.createElement('div');
            card.className = 'card-peca';

            const caminho = getCaminhoFoto(id);

            card.innerHTML = `
                <img src="${caminho}" alt="${peca.tipo}" data-id="${id}"
                     onerror="if(this.src.endsWith('.jpg')){this.src='fotos/'+this.dataset.id+'.png';this.onerror=function(){this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23ddd%22 width=%22100%22 height=%22100%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22>❌</text></svg>'}}else{this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23ddd%22 width=%22100%22 height=%22100%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22>❌</text></svg>'}">
                <p>${peca.id}</p>
            `;

            // Clique adiciona à seleção
            card.innerHTML = `
                ${criarImagem(caminho, peca.tipo || id, 'foto-card-peca')}
                <div class="card-peca-corpo">
                    <div class="card-peca-titulo">
                        <strong>${escapeHtml(id)}</strong>
                    </div>
                </div>
            `;

            card.onclick = () => {
                if (!app.pecasSelecionadasHoje.includes(id)) app.pecasSelecionadasHoje.push(id);
                atualizarPecasSelecionadasHoje();
            };

            galeria.appendChild(card);
        }
    });

    console.log('🖼️ Galeria "Usar Hoje" renderizada!');
}



function obterFiltroGrupoRegistro(grupoId) {
    if (!app.filtrosHojeGrupos[grupoId]) {
        app.filtrosHojeGrupos[grupoId] = { tipo: [], subtipo: [] };
    }

    return app.filtrosHojeGrupos[grupoId];
}

function filtrarGrupoHoje(grupoId, campo, valores) {
    const filtros = obterFiltroGrupoRegistro(grupoId);
    filtros[campo] = valores;
    renderGaleriaUsarHoje();
}

function pecaPertenceAoGrupoRegistro(peca, grupo) {
    const tipoPeca = normalizarTexto(peca?.tipo);
    return grupo.tipos.some(tipo => normalizarTexto(tipo) === tipoPeca);
}

function obterValoresCampoPecas(pecas, campo, selecionados = []) {
    const valores = pecas
        .map(([, peca]) => peca[campo])
        .filter(v => v && v !== 'na');

    return [...new Set([...valores, ...selecionados])];
}

function criarCardPecaRegistro(id, peca) {
    const card = document.createElement('div');
    card.className = 'card-peca';
    if (app.pecasSelecionadasHoje.includes(id)) card.classList.add('selecionado');

    card.innerHTML = `
        ${criarImagem(getCaminhoFoto(id), peca.tipo || id, 'foto-card-peca')}
        <div class="card-peca-corpo">
            <div class="card-peca-titulo">
                <strong>${escapeHtml(id)}</strong>
            </div>
        </div>
    `;

    card.onclick = () => {
        if (!app.pecasSelecionadasHoje.includes(id)) app.pecasSelecionadasHoje.push(id);
        atualizarPecasSelecionadasHoje();
        renderGaleriaUsarHoje();
    };

    return card;
}

function renderGaleriaUsarHoje() {
    const galeria = document.getElementById('galeria-usar-hoje');
    galeria.innerHTML = '';

    GRUPOS_REGISTRO_PECAS.forEach(grupo => {
        const filtrosGrupo = obterFiltroGrupoRegistro(grupo.id);
        const pecasBaseGrupo = Object.entries(app.pecas)
            .filter(([, peca]) => pecaPertenceAoGrupoRegistro(peca, grupo))
            .filter(([, peca]) => pecaPassaNosFiltros(peca, app.filtrosHoje));
        const pecasFiltradas = pecasBaseGrupo
            .filter(([, peca]) => pecaPassaNosFiltros(peca, filtrosGrupo));

        if (pecasBaseGrupo.length === 0) return;

        const secao = document.createElement('section');
        secao.className = 'grupo-registro';

        const topo = document.createElement('div');
        topo.className = 'grupo-registro-topo';
        topo.innerHTML = `
            <h4>${escapeHtml(grupo.titulo)}</h4>
            <span>${pecasFiltradas.length} de ${pecasBaseGrupo.length}</span>
        `;
        secao.appendChild(topo);

        const filtros = document.createElement('div');
        filtros.className = 'grupo-registro-filtros';
        const valoresTipo = obterValoresCampoPecas(pecasBaseGrupo, 'tipo', filtrosGrupo.tipo);
        const valoresSubtipo = obterValoresCampoPecas(pecasBaseGrupo, 'subtipo', filtrosGrupo.subtipo);

        if (valoresTipo.length > 1) {
            criarFiltroMultiplo(filtros, 'tipo', valoresTipo, filtrosGrupo.tipo, valores => {
                filtrarGrupoHoje(grupo.id, 'tipo', valores);
            });
        }

        if (valoresSubtipo.length > 0) {
            criarFiltroMultiplo(filtros, 'subtipo', valoresSubtipo, filtrosGrupo.subtipo, valores => {
                filtrarGrupoHoje(grupo.id, 'subtipo', valores);
            });
        }

        if (filtros.children.length > 0) secao.appendChild(filtros);

        const grade = document.createElement('div');
        grade.className = 'grupo-registro-grade';

        if (pecasFiltradas.length === 0) {
            grade.innerHTML = '<p class="grupo-registro-vazio">Nenhuma peça neste grupo com os filtros atuais.</p>';
        } else {
            pecasFiltradas.forEach(([id, peca]) => {
                grade.appendChild(criarCardPecaRegistro(id, peca));
            });
        }

        secao.appendChild(grade);
        galeria.appendChild(secao);
    });

    console.log('Galeria "Usar Hoje" renderizada por grupos!');
}

function atualizarPecasSelecionadasHoje() {
    const container = document.getElementById('pecas-selecionadas-hoje');

    if (app.pecasSelecionadasHoje.length === 0) {
        container.innerHTML = '<p class="lista-vazia">Nenhuma peça selecionada ainda</p>';
        app.looksSelecionadosHoje = [];
        atualizarLooksCompativeisHoje();
        return;
    }

    container.innerHTML = '';

    app.pecasSelecionadasHoje.forEach((id, index) => {
        const peca = app.pecas[id];
        if (!peca) return;

        const caminho = getCaminhoFoto(id);
        const item = document.createElement('div');
        item.className = 'item-lista';
        item.innerHTML = `
            <img src="${caminho}" alt="${peca.tipo}" data-id="${id}"
                 onerror="if(this.src.endsWith('.jpg')){this.src='fotos/'+this.dataset.id+'.png';this.onerror=function(){this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23ddd%22 width=%22100%22 height=%22100%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22>❌</text></svg>'}}else{this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23ddd%22 width=%22100%22 height=%22100%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22>❌</text></svg>'}">
            <div class="item-lista-info">
                <strong>${peca.tipo || id}</strong><br>
                <small>${id}</small>
            </div>
            <button onclick="removerPecaHoje(${index})">Remover</button>
        `;
        container.appendChild(item);
    });

    atualizarLooksCompativeisHoje();
}

function removerPecaHoje(index) {
    app.pecasSelecionadasHoje.splice(index, 1);
    atualizarPecasSelecionadasHoje();
}

function atualizarLooksCompativeisHoje() {
    const container = document.getElementById('looks-compativeis-hoje');
    if (!container) return;

    const looks = obterLooksCompativeis(app.pecasSelecionadasHoje);
    const idsCompativeis = new Set(looks.map(look => look.id));
    app.looksSelecionadosHoje = (app.looksSelecionadosHoje || []).filter(id => idsCompativeis.has(id));

    if (looks.length === 0) {
        container.innerHTML = '';
        return;
    }

    const tiposPecasInteiras = [...new Set(looks.flatMap(obterTiposPecasInteirasCompativeis))];
    const tituloSugestoes = tiposPecasInteiras.length > 0
        ? 'Looks sugeridos para a peca inteira selecionada'
        : 'Looks compatíveis com as peças selecionadas';

    const looksSelecionados = (app.looksSelecionadosHoje || [])
        .map(id => obterLookPorId(id))
        .filter(Boolean);
    const resumoSelecionado = looksSelecionados.length > 0 ? `
        <div class="look-selecionado-registro">
            <div>
                <strong>Looks que serão registrados</strong>
                <span>${looksSelecionados.map(look => `${look.id} (${formatarDataLook(obterDataCriacaoLook(look))})`).join(' · ')}</span>
            </div>
            <button type="button" onclick="limparLooksSelecionadosHoje()">Remover looks</button>
        </div>
    ` : '';

    container.innerHTML = `
        ${resumoSelecionado}
        <strong>${tituloSugestoes}</strong>
        <div class="looks-compativeis-lista">
            ${looks.map(look => `
                <button type="button" class="${(app.looksSelecionadosHoje || []).includes(look.id) ? 'ativo' : ''}" onclick="alternarLookCompativelHoje('${look.id}')">
                    <img src="${getCaminhoFotoLook(look.id)}" alt="${look.id}"
                         onerror="this.style.display='none'">
                    <span>${look.id}</span>
                    <small>${criarResumoCompatibilidadeLookHoje(look)} · ${formatarDataLook(obterDataCriacaoLook(look))}</small>
                </button>
            `).join('')}
        </div>
    `;
}

function criarResumoCompatibilidadeLookHoje(look) {
    const tiposPecasInteiras = obterTiposPecasInteirasCompativeis(look);
    if (tiposPecasInteiras.length > 0 && look.pecasCompativeis.length < 2) {
        return `${tiposPecasInteiras.join(' / ')} selecionado`;
    }

    return `${look.pecasCompativeis.length} peças`;
}

function alternarLookCompativelHoje(lookId) {
    const look = obterLookPorId(lookId);
    if (!look) return;

    const selecionados = new Set(app.looksSelecionadosHoje || []);
    if (selecionados.has(lookId)) {
        selecionados.delete(lookId);
    } else {
        selecionados.add(lookId);
        app.pecasSelecionadasHoje = [...new Set([...(look.pecas || []), ...app.pecasSelecionadasHoje])];
    }

    app.looksSelecionadosHoje = [...selecionados];
    atualizarPecasSelecionadasHoje();
}

function limparLooksSelecionadosHoje() {
    app.looksSelecionadosHoje = [];
    atualizarLooksCompativeisHoje();
}

/* Selecionar peça do modal e adicionar ao uso hoje */
function selecionarPecaHoje() {
    if (app.pecaEmDetalhes) {
        if (!app.pecasSelecionadasHoje.includes(app.pecaEmDetalhes)) {
            app.pecasSelecionadasHoje.push(app.pecaEmDetalhes);
        }
        atualizarPecasSelecionadasHoje();
        fecharModal();
        mostrarPagina('usar-hoje');
    }
}

/* SALVAR USO DO DIA */
function salvarUsoHoje() {
    if (app.pecasSelecionadasHoje.length === 0) {
        alert('Selecione pelo menos uma peça!');
        return;
    }

    const dataRegistro = document.getElementById('data-registro-uso').value;
    if (!dataRegistro) {
        alert('Selecione a data do registro!');
        return;
    }

    // Verificar se usar um look favorito

    // Criar registro no histórico
    const registro = {
        data: new Date(`${dataRegistro}T12:00:00`).toISOString(),
        pecas: [...app.pecasSelecionadasHoje],
        lookId: app.looksSelecionadosHoje[0] || null,
        lookIds: [...app.looksSelecionadosHoje],
    };

    app.historico.push(registro);
    salvarDados();

    // Feedback visual
    alert('✅ Uso registrado com sucesso!');

    // Limpar
    app.pecasSelecionadasHoje = [];
    app.looksSelecionadosHoje = [];
    atualizarPecasSelecionadasHoje();
}

/* Mostrar/esconder select de look quando checkbox é marcado */
/* ==================== PÁGINA LOOKS ====================
   Gerencia looks (combinações de peças) e ocasiões */

function preencherSelectLooks() {
    const select = document.getElementById('select-look-definido');
    if (!select) return;

    select.innerHTML = '<option value="">Selecione o look...</option>';

    // Adicionar looks do XML (BD looks)
    Object.entries(app.looks).forEach(([id, look]) => {
        const option = document.createElement('option');
        option.value = id;
        // Mostrar peças do look
        const pecasNomes = look.pecas
            .map(pid => app.pecas[pid]?.tipo || pid)
            .join(' + ');
        option.textContent = `${id}: ${pecasNomes}`;
        select.appendChild(option);
    });

    // Adicionar looks favoritos criados pelo usuário
    Object.entries(app.looksFavoritos).forEach(([id, look]) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = `⭐ ${look.nome} (${look.pecas.length} peças)`;
        select.appendChild(option);
    });
}

function preencherFiltrosOcasiao() {
    const container = document.getElementById('filtros-ocasiao');
    if (!container) return;

    container.innerHTML = '';

    criarFiltroPecasLooks(container);

    CAMPOS_FILTROS_LOOKS.forEach(campo => {
        const valores = obterValoresFiltroLooks(campo);
        if (valores.length > 0) {
            criarFiltroMultiplo(container, campo, valores, app.filtrosLooks[campo], novosValores => {
                filtrarLooks(campo, novosValores);
            });
        }
    });

    const btnLimpar = document.createElement('button');
    btnLimpar.className = 'btn-secundario';
    btnLimpar.type = 'button';
    btnLimpar.textContent = 'Limpar filtros';
    btnLimpar.onclick = limparFiltrosLooks;
    container.appendChild(btnLimpar);
}

function criarFiltroPecasLooks(container) {
    const wrapper = document.createElement('label');
    wrapper.className = 'filtro-pecas-looks';
    wrapper.innerHTML = `
        <span>IDs das peças</span>
        <input type="search" id="filtro-look-pecas" placeholder="ID0430, ID0446, ID0101" autocomplete="off" value="${escapeHtml((app.filtrosLooks.pecas || []).join(', '))}">
        <small>Use 1, 2 ou 3 IDs</small>
    `;

    const input = wrapper.querySelector('input');
    input.addEventListener('input', evento => {
        const ids = normalizarFiltroPecasLooks(evento.target.value);
        app.filtrosLooks.pecas = ids;
        renderLooks(obterTodosLooks().filter(lookPassaNosFiltros));
    });
    input.addEventListener('change', () => {
        input.value = (app.filtrosLooks.pecas || []).join(', ');
    });

    container.appendChild(wrapper);
}

function normalizarFiltroPecasLooks(valor) {
    return [...new Set(String(valor || '')
        .toUpperCase()
        .split(/[\s,;]+/)
        .map(item => item.trim())
        .filter(Boolean))]
        .slice(0, 3);
}

function filtrarLooksPorOcasiao(ocasiao, evento) {
    const container = document.getElementById('lista-looks');
    container.innerHTML = '';

    const btnsFiltro = document.querySelectorAll('#filtros-ocasiao .filtro-btn');
    btnsFiltro.forEach(btn => btn.classList.remove('ativo'));
    if (evento?.target) evento.target.classList.add('ativo');

    if (ocasiao === 'todas') {
        // Mostrar todos os looks
        renderLooks(Object.values(app.looks).concat(Object.values(app.looksFavoritos)));
    } else {
        // Filtrar por ocasião
        const looksFiltrados = Object.values(app.looks).filter(look => lookTemOcasiao(look, ocasiao));
        renderLooks(looksFiltrados);
    }
}

function lookTemOcasiao(look, filtro) {
    const alvo = normalizarTexto(filtro);
    if (!alvo) return true;

    return obterValoresOcasiaoLook(look)
        .some(ocasiao => normalizarTexto(ocasiao).includes(alvo));
}

function obterTodosLooks() {
    return Object.values({
        ...app.looks,
        ...app.looksFavoritos,
    });
}

function garantirLooksFavoritosSemColisao() {
    if (!app.looksFavoritos || typeof app.looksFavoritos !== 'object') {
        app.looksFavoritos = {};
        return false;
    }

    const favoritosAtualizados = {};
    const idsReservados = new Set(Object.keys(app.looks || {}));
    let alterou = false;

    Object.entries(app.looksFavoritos).forEach(([idOriginal, look]) => {
        if (!look || typeof look !== 'object') return;

        let idFinal = look.id || idOriginal;
        if (idsReservados.has(idFinal) && !look.substituiLookBase) {
            idFinal = gerarProximoIdLookDisponivel(obterIndicadorLook(look, idFinal), idsReservados);
            substituirLookIdHistorico(idOriginal, idFinal);
            alterou = true;
        }

        idsReservados.add(idFinal);
        favoritosAtualizados[idFinal] = {
            ...look,
            id: idFinal,
            nome: look.nome === idOriginal ? idFinal : (look.nome || idFinal),
            id_original: look.id_original || (idFinal !== idOriginal ? idOriginal : undefined),
        };
    });

    app.looksFavoritos = favoritosAtualizados;
    return alterou;
}

function obterIndicadorLook(look, fallbackId = '') {
    const indicador = look?.indicador || look?.basicos?.Indicador;
    if (indicador) return String(indicador).toUpperCase();

    const match = String(fallbackId).toUpperCase().match(/^([A-Z]{1,4})\d+$/);
    return match ? match[1] : 'LOOK';
}

function gerarProximoIdLookDisponivel(indicador, idsReservados = new Set()) {
    const prefixo = String(indicador || 'LOOK').toUpperCase();
    const regex = new RegExp(`^${prefixo}(\\d+)$`, 'i');
    const todosIds = new Set([
        ...Object.keys(app.looks || {}),
        ...Object.keys(app.looksFavoritos || {}),
        ...idsReservados,
    ]);
    let maior = 0;

    todosIds.forEach(id => {
        const match = String(id || '').match(regex);
        if (match) maior = Math.max(maior, Number(match[1]));
    });

    let candidato;
    do {
        maior++;
        candidato = `${prefixo}${String(maior).padStart(4, '0')}`;
    } while (todosIds.has(candidato));

    return candidato;
}

function substituirLookIdHistorico(idAntigo, idNovo) {
    app.historico.forEach(registro => {
        if (registro.lookId === idAntigo) registro.lookId = idNovo;
        if (Array.isArray(registro.lookIds)) {
            registro.lookIds = [...new Set(registro.lookIds.map(id => id === idAntigo ? idNovo : id))];
        }
    });
}

function obterValoresFiltroLooks(campo) {
    const valores = new Set();

    obterTodosLooks().forEach(look => {
        obterValoresCampoLook(look, campo).forEach(valor => {
            if (valor !== null && valor !== undefined && String(valor).trim() !== '') {
                valores.add(String(valor).trim());
            }
        });
    });

    return [...valores].sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true, sensitivity: 'base' }));
}

function obterValoresCampoLook(look, campo) {
    const basicos = look.basicos || {};

    switch (campo) {
        case 'situacao':
            return [look.situacao || basicos['situação'] || basicos.situacao];
        case 'utilizacao':
            return [look.utilizacao_calc || look.utilizacao];
        case 'indicador':
            return [look.indicador || basicos.Indicador];
        case 'clima':
            return [formatarClimaLook(look) || look.clima_calc || look.clima];
        case 'local':
            return [look.local_calc || look.local];
        case 'htt':
            return [basicos.HTT || look.HTT || look.htt];
        case 'ocasiao':
            return obterValoresOcasiaoLook(look);
        default:
            return [look[campo] || basicos[campo]];
    }
}

function obterValoresOcasiaoLook(look) {
    const valores = [];
    (look.ocasioes || []).forEach(ocasiao => {
        if (ocasiao.descricao) valores.push(ocasiao.descricao);
    });

    if (valores.length === 0 && look.ocasiao) {
        valores.push(...String(look.ocasiao).split(','));
    }

    return [...new Set(valores)];
}

function filtrarLooks(campo, valores) {
    app.filtrosLooks[campo] = valores;
    renderLooks(obterTodosLooks().filter(lookPassaNosFiltros));
}

function limparFiltrosLooks() {
    for (let campo in app.filtrosLooks) {
        app.filtrosLooks[campo] = [];
    }

    document.querySelectorAll('#filtros-ocasiao input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
        checkbox.closest('.filtro-chip')?.classList.remove('selecionado');
    });

    document.querySelectorAll('#filtros-ocasiao .filtro-multiplo').forEach(filtro => {
        filtro.classList.remove('tem-selecao', 'aberto');
        filtro.querySelector('.filtro-multiplo-contador').textContent = '';
    });

    const filtroPecas = document.getElementById('filtro-look-pecas');
    if (filtroPecas) filtroPecas.value = '';

    renderLooks(obterTodosLooks());
}

function lookPassaNosFiltros(look) {
    for (let campo in app.filtrosLooks) {
        const selecionados = app.filtrosLooks[campo];
        if (!Array.isArray(selecionados) || selecionados.length === 0) continue;

        if (campo === 'pecas') {
            const pecasLook = (look.pecas || []).map(id => normalizarTexto(id));
            const passouPecas = selecionados.every(idFiltro => {
                const alvo = normalizarTexto(idFiltro);
                return pecasLook.some(idLook => idLook.includes(alvo));
            });
            if (!passouPecas) return false;
            continue;
        }

        const valoresLook = obterValoresCampoLook(look, campo).map(valor => normalizarTexto(valor));
        const passou = selecionados.some(valorFiltro => valoresLook.includes(normalizarTexto(valorFiltro)));
        if (!passou) return false;
    }

    return true;
}

function filtrarLooksPorOcasiao(ocasiao) {
    app.filtrosLooks.ocasiao = ocasiao === 'todas' ? [] : [ocasiao];
    renderLooks(obterTodosLooks().filter(lookPassaNosFiltros));
}

function renderLooks(looks) {
    const container = document.getElementById('lista-looks');
    container.innerHTML = '';

    if (looks.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">Nenhum look encontrado</p>';
        return;
    }

    looks.forEach(look => {
        const card = document.createElement('div');
        card.className = 'look-card';

        const pecasTexto = (look.pecas || [])
            .map(id => escapeHtml(id))
            .join(' · ');
        const tags = (look.ocasioes || []).slice(0, 4).map(ocasiao => `<span>${ocasiao.descricao}</span>`).join('');
        const lookId = look.id || look.nome || '';

        card.innerHTML = `
            <div class="look-card-foto-wrap">
                <img src="${getCaminhoFotoLook(look.id)}" alt="${escapeHtml(lookId)}" class="look-card-foto"
                     onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 120 120%22><rect fill=%22%23eee%22 width=%22120%22 height=%22120%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22>sem foto</text></svg>'">
                <span class="look-card-id-badge">${escapeHtml(lookId)}</span>
            </div>
            <div class="look-card-info">
                <h3>${escapeHtml(lookId)}</h3>
                <p>${pecasTexto}</p>
                <div class="tags-look">${tags}</div>
                <div class="look-card-acoes">
                    <button class="btn-secundario" type="button" onclick="mostrarDetalhesLook('${look.id}')">Ficha</button>
                    <button class="btn-principal" type="button" onclick="usarLookHoje('${look.id}')">Usar</button>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

function mostrarDetalhesLook(lookId) {
    const look = obterLookPorId(lookId);
    if (!look) return;

    document.getElementById('titulo-look-modal').textContent = look.nome || look.id;
    document.getElementById('foto-look-modal').src = getCaminhoFotoLook(look.id);
    document.getElementById('usar-look-modal').onclick = () => usarLookHoje(look.id);

    const tags = document.getElementById('tags-look-modal');
    tags.innerHTML = (look.ocasioes || []).length
        ? look.ocasioes.map(ocasiao => `<span title="${ocasiao.codigo}">${ocasiao.descricao}</span>`).join('')
        : '<span>Sem ocasião definida</span>';

    const ficha = document.getElementById('ficha-look-modal');
    const campos = look.basicos || {};
    const climaInfo = look.clima_info || {};
    const camposClima = [
        ['Clima calculado', formatarClimaLook(look)],
        ['Aquecimento das peças', (look.aquecimentos || []).map(valor => valor || '-').join(' · ')],
        ['Local calculado', look.local_calc || ''],
        ['Local das peças', (look.locais_pecas || []).map(valor => valor || '-').join(' · ')],
        ['Utilização calculada', look.utilizacao_calc || ''],
        ['Utilização das peças', (look.utilizacoes_pecas || []).map(valor => valor || '-').join(' · ')],
    ];

    ficha.innerHTML = camposClima
        .filter(([, valor]) => valor)
        .map(([campo, valor]) => `
            <div class="campo-ficha">
                <span class="label">${campo}:</span>
                <span>${valor}</span>
            </div>
        `)
        .join('') + Object.entries(campos)
        .filter(([, valor]) => valor)
        .map(([campo, valor]) => `
            <div class="campo-ficha">
                <span class="label">${campo}:</span>
                <span>${valor}</span>
            </div>
        `)
        .join('');

    document.getElementById('pecas-look-modal').innerHTML = (look.pecas || [])
        .filter(id => app.pecas[id])
        .map(id => criarCardPecaHistorico(id))
        .join('') || '<p class="texto-ajuda">Nenhuma peça cadastrada.</p>';

    document.getElementById('sugestoes-look-modal').innerHTML = (look.pecas_sugeridas || [])
        .filter(item => app.pecas[item.id])
        .map(item => criarCardPecaLookSugerida(item))
        .join('') || '<p class="texto-ajuda">Nenhuma sugestão cadastrada.</p>';

    document.getElementById('modal-look-detalhes').style.display = 'flex';
}

function formatarClimaLook(look) {
    const info = look.clima_info || {};
    const codigo = look.clima_calc || look.clima || info.codigo;
    if (!codigo) return '';

    const descricao = info.descricao || codigo;
    const temperatura = info.temperatura ? ` (${info.temperatura})` : '';
    return `${codigo} - ${descricao}${temperatura}`;
}

function criarCardPecaLookSugerida(item) {
    const peca = app.pecas[item.id];
    return `
        <button type="button" class="historico-peca-card" onclick="mostrarDetalhesPeca('${item.id}')">
            <img src="${getCaminhoFoto(item.id)}" alt="${peca.tipo}" data-id="${item.id}"
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23eee%22 width=%22100%22 height=%22100%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22>sem foto</text></svg>'">
            <span>${item.grupo}: ${peca.tipo}</span>
            <small>${item.id}</small>
        </button>
    `;
}

function usarLookHoje(lookId) {
    const look = obterLookPorId(lookId);
    if (!look) return;

    app.pecasSelecionadasHoje = [...look.pecas];
    app.looksSelecionadosHoje = [lookId];

    mostrarPagina('usar-hoje');
    atualizarPecasSelecionadasHoje();
}

/* ==================== PÁGINA HISTÓRICO ====================
   Mostra estatísticas de uso */

function inicializarHistorico() {
    if (!document.getElementById('historico')) return;

    preencherFiltrosSemUso();

    if (!app.mesCalendarioHistorico) {
        const referencia = obterDataReferenciaHistorico() || new Date();
        app.mesCalendarioHistorico = formatarMesInput(referencia);
    }

    if (app.historico.length > 0) {
        aplicarFiltroHistoricoAtivo();
    } else {
        renderHistorico([], null, null);
    }

    renderCalendarioHistorico();
    renderPecasSemUso();
}

function atualizarHistorico(dias) {
    atualizarHistoricoPeriodo(dias);
}

function aplicarFiltroHistoricoAtivo() {
    if (!app.filtroHistoricoAtivo) {
        app.filtroHistoricoAtivo = { tipo: 'periodo', dias: 7 };
    }

    const filtro = app.filtroHistoricoAtivo;

    if (filtro.tipo === 'todos') {
        atualizarHistoricoCompleto();
        return;
    }

    if (filtro.tipo === 'intervalo') {
        const inicio = filtro.inicio;
        const fim = filtro.fim || inicio;
        preencherDatasHistorico(inicio, fim);
        renderHistorico(obterRegistrosHistoricoEntre(inicio, fim), inicio, fim);
        marcarFiltroPeriodoHistorico(null);
        return;
    }

    atualizarHistoricoPeriodo(filtro.dias || 30);
}

function atualizarHistoricoPeriodo(dias) {
    app.filtroHistoricoAtivo = { tipo: 'periodo', dias };
    const referencia = obterDataReferenciaHistorico();
    if (!referencia) {
        renderHistorico([], null, null);
        return;
    }

    const fim = formatarDataInput(referencia);
    const inicioData = new Date(referencia);
    inicioData.setDate(inicioData.getDate() - dias + 1);
    const inicio = formatarDataInput(inicioData);

    preencherDatasHistorico(inicio, fim);
    renderHistorico(obterRegistrosHistoricoEntre(inicio, fim), inicio, fim);
    marcarFiltroPeriodoHistorico(`${dias}`);
}

function atualizarHistoricoCompleto() {
    app.filtroHistoricoAtivo = { tipo: 'todos' };
    const intervalo = obterIntervaloCompletoHistorico();
    if (!intervalo) {
        renderHistorico([], null, null);
        return;
    }

    preencherDatasHistorico(intervalo.inicio, intervalo.fim);
    renderHistorico(obterRegistrosHistoricoEntre(intervalo.inicio, intervalo.fim), intervalo.inicio, intervalo.fim);
    marcarFiltroPeriodoHistorico('todos');
}

function consultarHistoricoPorDatas() {
    const inicio = document.getElementById('historico-data-inicio')?.value;
    const fim = document.getElementById('historico-data-fim')?.value || inicio;

    if (!inicio || !fim) {
        alert('Escolha pelo menos a data inicial.');
        return;
    }

    if (inicio > fim) {
        alert('A data inicial precisa ser anterior ou igual à data final.');
        return;
    }

    renderHistorico(obterRegistrosHistoricoEntre(inicio, fim), inicio, fim);
    app.filtroHistoricoAtivo = { tipo: 'intervalo', inicio, fim };
    marcarFiltroPeriodoHistorico(null);
}

function renderHistorico(registrosPeriodo, inicio, fim) {
    registrosPeriodo = registrosPeriodo.filter(reg => Array.isArray(reg.pecas) && reg.pecas.length > 0);

    atualizarResumoPeriodo(registrosPeriodo, inicio, fim);
    renderTabelaPecasMaisUsadas(registrosPeriodo);
    renderDetalheHistorico(registrosPeriodo);
    atualizarStatsHistorico(registrosPeriodo);
    renderCalendarioHistorico(inicio, fim);
    renderPecasSemUso();

    console.log(`📊 Histórico atualizado: ${registrosPeriodo.length} registros`);
}

function renderCalendarioHistorico(inicioSelecionado = null, fimSelecionado = null) {
    const container = document.getElementById('calendario-historico');
    const label = document.getElementById('calendario-mes-label');
    if (!container || !label) return;

    if (!app.mesCalendarioHistorico) {
        const referencia = obterDataReferenciaHistorico() || new Date();
        app.mesCalendarioHistorico = formatarMesInput(referencia);
    }

    const [ano, mes] = app.mesCalendarioHistorico.split('-').map(Number);
    const primeiroDia = new Date(ano, mes - 1, 1);
    const diasNoMes = new Date(ano, mes, 0).getDate();
    const inicioSemana = primeiroDia.getDay();
    const registrosPorDia = agruparRegistrosPorDia(app.historico);
    const nomesDias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    label.textContent = primeiroDia.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    container.innerHTML = nomesDias.map(dia => `<div class="calendario-dia-semana">${dia}</div>`).join('');

    for (let i = 0; i < inicioSemana; i++) {
        container.insertAdjacentHTML('beforeend', '<div class="calendario-dia vazio"></div>');
    }

    for (let dia = 1; dia <= diasNoMes; dia++) {
        const dataISO = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
        const registros = registrosPorDia[dataISO] || [];
        const pecas = [...new Set(registros.flatMap(reg => reg.pecas || []))].filter(id => app.pecas[id]);
        const selecionado = inicioSelecionado && fimSelecionado && dataISO >= inicioSelecionado && dataISO <= fimSelecionado;
        const fotos = pecas.slice(0, 3).map(id => `
            <img src="${getCaminhoFoto(id)}" alt="${id}"
                 onerror="this.style.display='none'">
        `).join('');

        container.insertAdjacentHTML('beforeend', `
            <button type="button"
                    class="calendario-dia ${registros.length ? 'tem-uso' : ''} ${selecionado ? 'selecionado' : ''}"
                    data-data="${dataISO}">
                <span>${dia}</span>
                <div class="calendario-miniaturas">${fotos}</div>
                ${registros.length ? `<small>${pecas.length} peças</small>` : ''}
            </button>
        `);
    }

    container.querySelectorAll('.calendario-dia.tem-uso').forEach(botao => {
        botao.addEventListener('click', () => selecionarDiaCalendarioHistorico(botao.dataset.data));
    });
}

function navegarMesCalendarioHistorico(delta) {
    const referencia = app.mesCalendarioHistorico
        ? new Date(`${app.mesCalendarioHistorico}-01T12:00:00`)
        : (obterDataReferenciaHistorico() || new Date());

    referencia.setMonth(referencia.getMonth() + delta);
    app.mesCalendarioHistorico = formatarMesInput(referencia);
    renderCalendarioHistorico(
        document.getElementById('historico-data-inicio')?.value || null,
        document.getElementById('historico-data-fim')?.value || null
    );
}

function selecionarDiaCalendarioHistorico(dataISO) {
    app.filtroHistoricoAtivo = { tipo: 'intervalo', inicio: dataISO, fim: dataISO };
    preencherDatasHistorico(dataISO, dataISO);
    renderHistorico(obterRegistrosHistoricoEntre(dataISO, dataISO), dataISO, dataISO);
    marcarFiltroPeriodoHistorico(null);
}

function renderPecasSemUso() {
    const container = document.getElementById('pecas-sem-uso');
    if (!container) return;

    const referencia = new Date();
    const ultimoUso = obterUltimoUsoPorPeca();
    const pecas = Object.values(app.pecas)
        .filter(peca => peca.situacao !== 'excluída')
        .map(peca => {
            const data = ultimoUso[peca.id] || null;
            const dias = data ? diferencaDias(data, referencia) : null;
            return { peca, data, dias };
        })
        .filter(item => pecaPassaFiltroSemUso(item))
        .sort((a, b) => {
            if (a.dias === null && b.dias === null) return a.peca.id.localeCompare(b.peca.id);
            if (a.dias === null) return -1;
            if (b.dias === null) return 1;
            return b.dias - a.dias;
        });

    if (pecas.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">Nenhuma peça encontrada para esses filtros.</p>';
        return;
    }

    container.innerHTML = pecas.map(({ peca, data, dias }) => `
        <button type="button" class="peca-sem-uso-card" onclick="mostrarDetalhesPeca('${peca.id}')">
            <img src="${getCaminhoFoto(peca.id)}" alt="${peca.id}"
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23eee%22 width=%22100%22 height=%22100%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22>sem foto</text></svg>'">
            <strong>${peca.id}</strong>
            <span>${dias === null ? 'Nunca usada' : `${dias} dias`}</span>
            <small>${data ? `Último uso: ${formatarDataBR(formatarDataInput(data))}` : 'Sem registro'}</small>
        </button>
    `).join('');
}

function preencherFiltrosSemUso() {
    const selectTipo = document.getElementById('filtro-sem-uso-tipo');
    const selectLocal = document.getElementById('filtro-sem-uso-local');
    const selectSituacao = document.getElementById('filtro-sem-uso-situacao');
    const selectTempo = document.getElementById('filtro-sem-uso-tempo');

    preencherSelectFiltroSemUso(selectTipo, 'tipo', 'Todos os tipos');
    preencherSelectFiltroSemUso(selectLocal, 'local', 'Todos os locais');
    preencherSelectFiltroSemUso(selectSituacao, 'situacao', 'Todas as situações');

    if (selectTipo) selectTipo.value = app.filtrosSemUso.tipo || '';
    if (selectLocal) selectLocal.value = app.filtrosSemUso.local || '';
    if (selectSituacao) selectSituacao.value = app.filtrosSemUso.situacao || '';
    if (selectTempo) selectTempo.value = app.filtrosSemUso.tempo || '';
}

function preencherSelectFiltroSemUso(select, campo, labelTodos) {
    if (!select || select.dataset.preenchido === 'true') return;

    const valores = [...new Set(Object.values(app.pecas)
        .filter(peca => peca.situacao !== 'excluída' && valorVisivel(peca[campo]))
        .map(peca => peca[campo]))]
        .sort((a, b) => a.localeCompare(b, 'pt-BR'));

    select.innerHTML = `<option value="">${labelTodos}</option>` +
        valores.map(valor => `<option value="${escapeHtml(valor)}">${escapeHtml(valor)}</option>`).join('');
    select.dataset.preenchido = 'true';
}

function atualizarFiltroSemUso(campo, evento) {
    app.filtrosSemUso[campo] = evento.target.value;
    renderPecasSemUso();
}

function pecaPassaFiltroSemUso({ peca, dias }) {
    const { tipo, local, situacao, tempo } = app.filtrosSemUso;

    if (tipo && peca.tipo !== tipo) return false;
    if (local && peca.local !== local) return false;
    if (situacao && peca.situacao !== situacao) return false;
    if (!tempo) return true;
    if (tempo === 'nunca') return dias === null;

    if (dias === null) return false;
    if (tempo === 'mais-1095') return dias > 1095;

    const faixas = {
        90: { min: 0, max: 90 },
        180: { min: 91, max: 180 },
        365: { min: 181, max: 365 },
        730: { min: 366, max: 730 },
        1095: { min: 731, max: 1095 },
    };
    const faixa = faixas[tempo];

    return faixa ? dias >= faixa.min && dias <= faixa.max : true;
}

function obterUltimoUsoPorPeca() {
    const ultimoUso = {};

    app.historico.forEach(reg => {
        const dia = obterDiaRegistro(reg);
        if (!dia) return;
        const data = new Date(`${dia}T12:00:00`);

        (reg.pecas || []).forEach(id => {
            if (!app.pecas[id]) return;
            if (!ultimoUso[id] || data > ultimoUso[id]) {
                ultimoUso[id] = data;
            }
        });
    });

    return ultimoUso;
}

function diferencaDias(dataInicio, dataFim) {
    const inicio = new Date(dataInicio.getFullYear(), dataInicio.getMonth(), dataInicio.getDate());
    const fim = new Date(dataFim.getFullYear(), dataFim.getMonth(), dataFim.getDate());
    return Math.max(0, Math.round((fim - inicio) / (24 * 60 * 60 * 1000)));
}

function renderTabelaPecasMaisUsadas(registrosPeriodo) {
    const contagem = {};
    registrosPeriodo.forEach(reg => {
        (reg.pecas || []).forEach(id => {
            contagem[id] = (contagem[id] || 0) + 1;
        });
    });

    const sortidos = Object.entries(contagem)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    const container = document.getElementById('tabela-historico');
    if (!container) return;

    if (sortidos.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">Nenhum uso encontrado neste período.</p>';
        return;
    }

    container.innerHTML = sortidos
        .filter(([id]) => app.pecas[id])
        .map(([id, usos]) => `
            <button type="button" class="peca-mais-usada-card" onclick="mostrarDetalhesPeca('${id}')">
                <img src="${getCaminhoFoto(id)}" alt="${id}" data-id="${id}"
                     onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23eee%22 width=%22100%22 height=%22100%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22>sem foto</text></svg>'">
                <strong>${id}</strong>
                <span>${usos} usos</span>
            </button>
        `)
        .join('');
}

function atualizarStatsHistorico(registrosPeriodo) {
    const statCards = document.querySelectorAll('.stat-numero');
    if (statCards.length < 3) return;

    statCards[0].textContent = registrosPeriodo.length;
    statCards[1].textContent = new Set(registrosPeriodo.flatMap(reg => reg.pecas || [])).size;

    const looksUsados = new Set();
    registrosPeriodo.forEach(reg => {
        if (reg.lookId) looksUsados.add(reg.lookId);
        (reg.lookIds || []).forEach(id => looksUsados.add(id));
    });
    statCards[2].textContent = looksUsados.size;
}

function renderDetalheHistorico(registrosPeriodo) {
    const container = document.getElementById('detalhe-historico');
    if (!container) return;

    if (registrosPeriodo.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">Nenhum registro encontrado para esse período.</p>';
        return;
    }

    const registrosPorDia = agruparRegistrosPorDia(registrosPeriodo);
    container.innerHTML = '';

    Object.entries(registrosPorDia)
        .sort(([diaA], [diaB]) => diaB.localeCompare(diaA))
        .forEach(([dia, registros]) => {
            const pecasDia = [...new Set(registros.flatMap(reg => reg.pecas || []))].filter(id => app.pecas[id]);
            const looksDia = [...new Set(registros.flatMap(reg => obterLookIdsRegistro(reg)))].filter(id => obterLookPorId(id));

            const grupo = document.createElement('div');
            grupo.className = 'historico-dia';
            grupo.dataset.dia = dia;

            const looksHtml = looksDia.length > 0
                ? looksDia.map(id => criarCardLookHistorico(id)).join('')
                : '<p class="texto-ajuda">Nenhum look identificado nesse dia.</p>';

            const pecasHtml = pecasDia.length > 0
                ? pecasDia.map(id => criarCardPecaHistorico(id, { dia, removivel: true })).join('')
                : '<p class="texto-ajuda">Nenhuma peça identificada nesse dia.</p>';

            grupo.innerHTML = `
                <div class="historico-dia-cabecalho">
                    <h4>${formatarDataBR(dia)}</h4>
                    <span>${pecasDia.length} peças · ${looksDia.length} looks</span>
                </div>
                <div class="historico-bloco">
                    <h5>Looks</h5>
                    <div class="historico-look-grid">${looksHtml}</div>
                </div>
                <div class="historico-bloco">
                    <div class="historico-bloco-topo">
                        <h5>Peças</h5>
                        <button type="button" class="btn-secundario" data-criar-look-dia onclick="abrirCriacaoLookHistorico('${dia}')" disabled>
                            Criar look
                        </button>
                    </div>
                    <div class="historico-look-existente" data-look-existente-dia></div>
                    <div class="historico-pecas-grid">${pecasHtml}</div>
                </div>
            `;

            container.appendChild(grupo);
        });
}

function criarCardLookHistorico(id) {
    const look = obterLookPorId(id);
    const pecas = (look?.pecas || []).filter(pid => app.pecas[pid]);
    const nome = look?.nome || look?.id || id;

    return `
        <button type="button" class="historico-look-card" onclick="mostrarDetalhesLook('${id}')">
            <img src="${getCaminhoFotoLook(id)}" alt="${nome}" class="historico-look-foto"
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23eee%22 width=%22100%22 height=%22100%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22>sem foto</text></svg>'">
            <strong>${nome}</strong>
            <small>${pecas.length} peças</small>
        </button>
    `;
}

function criarCardPecaHistorico(id, opcoes = {}) {
    const peca = app.pecas[id];
    if (!peca) return '';

    const acaoRemover = opcoes.removivel && opcoes.dia
        ? `<button type="button" class="historico-peca-remover" onclick="removerPecaDoHistoricoDia('${opcoes.dia}', '${id}')">Remover</button>`
        : '';

    return `
        <div class="historico-peca-card historico-peca-selecionavel" onclick="alternarCardPecaLookHistorico(event, this)">
            <label class="historico-peca-check" title="Selecionar para criar look">
                <input type="checkbox" value="${id}" onchange="alternarPecaLookHistorico(this)">
                <span></span>
            </label>
            <img src="${getCaminhoFoto(id)}" alt="${peca.tipo}" data-id="${id}"
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23eee%22 width=%22100%22 height=%22100%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22>sem foto</text></svg>'">
            <span>${peca.tipo}</span>
            <small>${id}</small>
            <button type="button" class="historico-peca-detalhes" onclick="mostrarDetalhesPeca('${id}')">Ficha</button>
            ${acaoRemover}
        </div>
    `;
}

function removerPecaDoHistoricoDia(dia, pecaId) {
    const peca = app.pecas[pecaId];
    const nome = peca?.tipo || pecaId;
    const confirmado = confirm(`Remover ${nome} (${pecaId}) do historico de ${formatarDataBR(dia)}?`);
    if (!confirmado) return;

    let alterou = false;

    app.historico = app.historico
        .map(registro => {
            if (obterDiaRegistro(registro) !== dia || !(registro.pecas || []).includes(pecaId)) {
                return registro;
            }

            alterou = true;
            const pecasAtualizadas = (registro.pecas || []).filter(id => id !== pecaId);
            const lookIdsAtualizados = obterLookIdsRegistro(registro)
                .filter(lookId => lookContinuaValidoNoRegistro(lookId, pecasAtualizadas));

            return {
                ...registro,
                pecas: pecasAtualizadas,
                lookId: lookIdsAtualizados[0] || null,
                lookIds: lookIdsAtualizados,
            };
        })
        .filter(registro => (registro.pecas || []).length > 0);

    if (!alterou) return;

    if (app.pecasSelecionadasLookHistorico[dia]) {
        app.pecasSelecionadasLookHistorico[dia] = app.pecasSelecionadasLookHistorico[dia].filter(id => id !== pecaId);
    }

    app.forcarEnvioLocalSupabase = true;
    salvarDados();
    atualizarHistoricoAposEdicao();
}

function lookContinuaValidoNoRegistro(lookId, pecasRegistro) {
    const look = obterLookPorId(lookId);
    if (!look?.pecas?.length) return false;

    const pecasSet = new Set(pecasRegistro);
    return look.pecas.every(id => pecasSet.has(id));
}

function atualizarHistoricoAposEdicao() {
    const inicio = document.getElementById('historico-data-inicio')?.value;
    const fim = document.getElementById('historico-data-fim')?.value || inicio;

    if (inicio && fim) {
        renderHistorico(obterRegistrosHistoricoEntre(inicio, fim), inicio, fim);
    } else {
        inicializarHistorico();
    }
}

function alternarPecaLookHistorico(checkbox) {
    const dia = checkbox.closest('.historico-dia')?.dataset?.dia;
    if (!dia) return;

    sincronizarPecasSelecionadasLookHistorico(dia);
    checkbox.closest('.historico-peca-card')?.classList.toggle('selecionada', checkbox.checked);
    atualizarBotaoCriarLookHistorico(dia);
}

function alternarCardPecaLookHistorico(evento, card) {
    if (evento.target.closest('button')) return;
    if (evento.target.closest('.historico-peca-check')) return;

    const checkbox = card.querySelector('.historico-peca-check input');
    if (!checkbox) return;

    checkbox.checked = !checkbox.checked;
    alternarPecaLookHistorico(checkbox);
}

function sincronizarPecasSelecionadasLookHistorico(dia) {
    const grupo = document.querySelector(`.historico-dia[data-dia="${dia}"]`);
    const checkboxes = grupo?.querySelectorAll('.historico-peca-check input:checked') || [];
    app.pecasSelecionadasLookHistorico[dia] = [...checkboxes].map(checkbox => checkbox.value);
}

function atualizarBotaoCriarLookHistorico(dia) {
    sincronizarPecasSelecionadasLookHistorico(dia);

    const grupo = document.querySelector(`.historico-dia[data-dia="${dia}"]`);
    const botao = grupo?.querySelector('[data-criar-look-dia]');
    if (!botao) return;

    const total = app.pecasSelecionadasLookHistorico[dia]?.length || 0;
    botao.disabled = total < 2;
    botao.textContent = total < 2 ? `Selecione ${2 - total} peça${total === 1 ? '' : 's'}` : `Criar look (${total})`;
    atualizarAvisoLookExistenteHistorico(dia);
}

function atualizarAvisoLookExistenteHistorico(dia) {
    const grupo = document.querySelector(`.historico-dia[data-dia="${dia}"]`);
    const container = grupo?.querySelector('[data-look-existente-dia]');
    if (!container) return;

    const pecas = app.pecasSelecionadasLookHistorico[dia] || [];
    const looks = obterLooksCompativeis(pecas);

    if (looks.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = `
        <strong>Essas peças já fazem parte de look cadastrado</strong>
        <div class="historico-look-existente-lista">
            ${looks.map(look => `
                <button type="button" onclick="mostrarDetalhesLook('${look.id}')">
                    <img src="${getCaminhoFotoLook(look.id)}" alt="${look.id}"
                         onerror="this.style.display='none'">
                    <span>${look.id}</span>
                    <small>criado em ${formatarDataLook(obterDataCriacaoLook(look))}</small>
                </button>
            `).join('')}
        </div>
    `;
}

function abrirCriacaoLookHistorico(dia) {
    const pecas = app.pecasSelecionadasLookHistorico[dia] || [];
    if (pecas.length < 2) {
        alert('Selecione pelo menos 2 peças desse dia para criar um look.');
        return;
    }

    app.diaCriacaoLookHistorico = dia;
    app.fotoNovoLookHistorico = null;

    document.getElementById('look-historico-modo').value = 'novo';
    document.getElementById('look-historico-data-alteracao').value = dia;
    document.getElementById('look-historico-data').value = dia;
    document.getElementById('look-historico-data').disabled = false;
    document.getElementById('look-historico-situacao').value = 'em uso';
    document.getElementById('look-historico-htt').value = 'false';
    document.getElementById('look-historico-foto').value = '';
    document.getElementById('look-historico-busca-look').value = '';

    preencherIndicadoresLookHistorico();
    preencherLooksExistentesLookHistorico();
    preencherOcasioesLookHistorico();
    configurarModoLookHistorico();
    renderOrdemPecasLookHistorico();
    atualizarPreviewLookHistorico();

    document.getElementById('modal-criar-look-historico').style.display = 'flex';
}

function configurarModoLookHistorico() {
    const modo = document.getElementById('look-historico-modo');
    const lookExistente = document.getElementById('look-historico-look-existente');
    const buscaLook = document.getElementById('look-historico-busca-look');
    if (modo) modo.onchange = alternarModoLookHistorico;
    if (lookExistente) lookExistente.onchange = aplicarLookExistenteNoFormulario;
    if (buscaLook) buscaLook.oninput = () => preencherLooksExistentesLookHistorico();
    alternarModoLookHistorico();
}

function obterModoLookHistorico() {
    return document.getElementById('look-historico-modo')?.value || 'novo';
}

function alternarModoLookHistorico() {
    const substituindo = obterModoLookHistorico() === 'substituir';
    const labelLook = document.getElementById('look-historico-look-existente-label');
    const labelDataAlteracao = document.getElementById('look-historico-data-alteracao-label');
    const dataCriacao = document.getElementById('look-historico-data');
    const indicador = document.getElementById('look-historico-indicador');

    if (labelLook) labelLook.style.display = substituindo ? '' : 'none';
    if (labelDataAlteracao) labelDataAlteracao.style.display = substituindo ? '' : 'none';
    if (dataCriacao) dataCriacao.disabled = substituindo;
    if (indicador) indicador.disabled = substituindo;

    if (substituindo) aplicarLookExistenteNoFormulario();
    atualizarPreviewLookHistorico();
}

function preencherIndicadoresLookHistorico() {
    const select = document.getElementById('look-historico-indicador');
    if (!select) return;

    const indicadores = [...new Set(obterTodosLooks()
        .map(look => look.indicador || look.basicos?.Indicador)
        .filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true }));

    select.innerHTML = indicadores.map(valor => `<option value="${valor}">${valor}</option>`).join('');
    select.onchange = atualizarPreviewLookHistorico;
}

function preencherLooksExistentesLookHistorico() {
    const select = document.getElementById('look-historico-look-existente');
    if (!select) return;

    const valorAnterior = select.value;
    const busca = normalizarTexto(document.getElementById('look-historico-busca-look')?.value || '');
    const looks = obterTodosLooks()
        .filter(look => look?.id)
        .filter(look => {
            if (!busca) return true;
            const pecas = (look.pecas || []).join(' ');
            const situacao = look.situacao || look.basicos?.['situação'] || '';
            const indicador = obterIndicadorLook(look, look.id);
            return normalizarTexto(`${look.id} ${situacao} ${indicador} ${pecas}`).includes(busca);
        })
        .sort((a, b) => String(a.id).localeCompare(String(b.id), 'pt-BR', { numeric: true }));

    if (!looks.length) {
        select.innerHTML = '<option value="">Nenhum look encontrado</option>';
        aplicarLookExistenteNoFormulario();
        return;
    }

    select.innerHTML = looks.map(look => {
        const pecas = (look.pecas || []).join(', ');
        const situacao = look.situacao || look.basicos?.['situação'] || '';
        return `<option value="${look.id}">${look.id}${situacao ? ` - ${situacao}` : ''}${pecas ? ` (${pecas})` : ''}</option>`;
    }).join('');

    if (valorAnterior && looks.some(look => String(look.id) === String(valorAnterior))) {
        select.value = valorAnterior;
    }

    aplicarLookExistenteNoFormulario();
}

function preencherOcasioesLookHistorico() {
    const select = document.getElementById('look-historico-ocasiao');
    if (!select) return;

    const ocasioes = [...new Set(Object.entries(app.mapaOcasioes || {}).map(([codigo, info]) => ({
        codigo,
        descricao: info.descricao || codigo,
        tipo: info.tipo || '',
        local: info.local || '',
    })).map(item => JSON.stringify(item)))]
        .map(item => JSON.parse(item))
        .sort((a, b) => a.descricao.localeCompare(b.descricao, 'pt-BR', { sensitivity: 'base' }));

    select.innerHTML = ocasioes
        .map(item => `<option value="${item.codigo}">${item.descricao}</option>`)
        .join('');
}

function aplicarLookExistenteNoFormulario() {
    if (obterModoLookHistorico() !== 'substituir') return;

    const lookId = document.getElementById('look-historico-look-existente')?.value;
    const look = obterLookPorId(lookId);
    if (!look) {
        atualizarPreviewLookHistorico();
        return;
    }

    const indicador = obterIndicadorLook(look, lookId);
    document.getElementById('look-historico-indicador').value = indicador;
    document.getElementById('look-historico-data').value = normalizarDataHistorico(obterDataCriacaoLook(look))?.slice(0, 10) || '';
    document.getElementById('look-historico-situacao').value = look.situacao || look.basicos?.['situação'] || 'em uso';
    document.getElementById('look-historico-htt').value = String(look.HTT || look.htt || look.basicos?.HTT || 'false');

    const codigos = new Set((look.ocasioes || []).map(item => item.codigo).filter(Boolean));
    [...document.getElementById('look-historico-ocasiao').options].forEach(option => {
        option.selected = codigos.has(option.value);
    });

    atualizarPreviewLookHistorico();
}

function atualizarPreviewLookHistorico() {
    const indicador = document.getElementById('look-historico-indicador')?.value;
    const modo = obterModoLookHistorico();
    const lookExistenteId = document.getElementById('look-historico-look-existente')?.value || '';
    const lookExistente = modo === 'substituir' ? obterLookPorId(lookExistenteId) : null;
    const proximoId = modo === 'substituir' ? lookExistenteId : (indicador ? gerarProximoIdLook(indicador) : '');
    const pecas = app.pecasSelecionadasLookHistorico[app.diaCriacaoLookHistorico] || [];
    const fotoPreview = document.getElementById('look-historico-foto-preview');

    document.getElementById('look-historico-id-preview').textContent = proximoId
        ? `${modo === 'substituir' ? 'Substituir' : 'ID'}: ${proximoId}`
        : 'ID: selecione o indicador';
    document.getElementById('look-historico-pecas-preview').textContent = `${pecas.length} peças selecionadas: ${pecas.join(', ')}`;

    if (fotoPreview) {
        if (lookExistente) {
            fotoPreview.style.display = '';
            fotoPreview.onerror = () => {
                fotoPreview.style.display = 'none';
            };
            fotoPreview.src = getCaminhoFotoLook(lookExistenteId);
        } else {
            fotoPreview.style.display = 'none';
            fotoPreview.removeAttribute('src');
        }
    }
}

function renderOrdemPecasLookHistorico() {
    const container = document.getElementById('look-historico-ordem');
    const dia = app.diaCriacaoLookHistorico;
    const pecas = app.pecasSelecionadasLookHistorico[dia] || [];
    if (!container) return;

    container.innerHTML = pecas.map((id, indice) => {
        const peca = app.pecas[id] || {};
        const descricao = [peca.tipo, peca.subtipo].filter(Boolean).join(' · ');
        return `
            <div class="look-historico-ordem-item">
                <strong>${indice + 1}</strong>
                <img src="${getCaminhoFoto(id)}" alt="${peca.tipo || id}"
                     onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 60 60%22><rect fill=%22%23eee%22 width=%2260%22 height=%2260%22/></svg>'">
                <span class="look-historico-ordem-info">
                    <strong class="look-historico-peca-id">ID: ${escapeHtml(id)}</strong>
                    <small>${escapeHtml(descricao || 'Sem tipo')}</small>
                </span>
                <button type="button" aria-label="Subir" onclick="moverPecaLookHistorico(${indice}, -1)" ${indice === 0 ? 'disabled' : ''}>↑</button>
                <button type="button" aria-label="Descer" onclick="moverPecaLookHistorico(${indice}, 1)" ${indice === pecas.length - 1 ? 'disabled' : ''}>↓</button>
            </div>
        `;
    }).join('');
}

function moverPecaLookHistorico(indice, direcao) {
    const dia = app.diaCriacaoLookHistorico;
    const pecas = app.pecasSelecionadasLookHistorico[dia] || [];
    const novoIndice = indice + direcao;
    if (novoIndice < 0 || novoIndice >= pecas.length) return;

    [pecas[indice], pecas[novoIndice]] = [pecas[novoIndice], pecas[indice]];
    app.pecasSelecionadasLookHistorico[dia] = pecas;
    renderOrdemPecasLookHistorico();
    atualizarPreviewLookHistorico();
}

function gerarProximoIdLook(indicador) {
    return gerarProximoIdLookDisponivel(indicador);
}

async function salvarLookHistorico() {
    const dia = app.diaCriacaoLookHistorico;
    const pecas = app.pecasSelecionadasLookHistorico[dia] || [];
    const modo = obterModoLookHistorico();
    const lookExistenteId = document.getElementById('look-historico-look-existente')?.value || '';
    const lookExistente = modo === 'substituir' ? obterLookPorId(lookExistenteId) : null;
    const indicador = modo === 'substituir'
        ? obterIndicadorLook(lookExistente, lookExistenteId)
        : document.getElementById('look-historico-indicador').value;

    if (pecas.length < 2) {
        alert('Selecione pelo menos 2 peças.');
        return;
    }
    if (modo === 'substituir' && !lookExistente) {
        alert('Selecione o look existente que sera substituido.');
        return;
    }
    if (!indicador) {
        alert('Selecione o indicador.');
        return;
    }

    const id = modo === 'substituir' ? lookExistenteId : gerarProximoIdLook(indicador);
    const dataCriacao = modo === 'substituir'
        ? (normalizarDataHistorico(obterDataCriacaoLook(lookExistente))?.slice(0, 10) || '')
        : (document.getElementById('look-historico-data').value || dia);
    const dataAlteracao = modo === 'substituir'
        ? (document.getElementById('look-historico-data-alteracao').value || dia)
        : '';
    const situacao = document.getElementById('look-historico-situacao').value;
    const htt = document.getElementById('look-historico-htt').value;
    const codigosOcasiao = [...document.getElementById('look-historico-ocasiao').selectedOptions].map(option => option.value);
    const foto = await lerFotoLookHistorico();
    const ocasioes = codigosOcasiao
        .map(codigo => app.mapaOcasioes[codigo] ? { codigo, ...app.mapaOcasioes[codigo] } : null)
        .filter(Boolean);
    const basicosOriginais = lookExistente?.basicos || {};

    app.looksFavoritos[id] = {
        ...(lookExistente || {}),
        id,
        nome: id,
        pecas: [...pecas],
        pecas_sugeridas: lookExistente?.pecas_sugeridas || [],
        ocasioes,
        ocasiao: ocasioes.map(item => item.descricao).join(', '),
        situacao,
        indicador,
        HTT: htt,
        foto: foto || lookExistente?.foto || `fotos/${indicador}/${id}.webp`,
        substituiLookBase: modo === 'substituir' || undefined,
        substituidoEm: dataAlteracao || undefined,
        basicos: {
            ...basicosOriginais,
            ID: id,
            ID1: pecas[0] || '',
            ID2: pecas[1] || '',
            ID3: pecas[2] || '',
            situação: situacao,
            Indicador: indicador,
            'Data criação': dataCriacao,
            'Data ult alt': dataAlteracao || basicosOriginais['Data ult alt'] || '',
            HTT: htt,
        },
    };

    vincularLookAoHistorico(dia, id, pecas);

    salvarDados();
    preencherSelectLooks();
    preencherFiltrosOcasiao();
    renderLooks(obterTodosLooks().filter(lookPassaNosFiltros));
    renderDetalheHistorico(obterRegistrosHistoricoEntre(dia, dia));

    alert(modo === 'substituir'
        ? `Look ${id} atualizado localmente. Essa alteracao nao sera sobrescrita ao recarregar a base.`
        : `Look ${id} criado com sucesso.`);
    fecharModal();
}

function vincularLookAoHistorico(dia, lookId, pecasLook) {
    const alvo = app.historico.find(registro => {
        const mesmoDia = obterDiaRegistro(registro) === dia;
        const pecasRegistro = new Set(registro.pecas || []);
        return mesmoDia && pecasLook.every(id => pecasRegistro.has(id));
    });

    if (!alvo) return;

    const lookIds = new Set([alvo.lookId, ...(alvo.lookIds || [])].filter(Boolean));
    lookIds.add(lookId);
    alvo.lookId = alvo.lookId || lookId;
    alvo.lookIds = [...lookIds];
}

function lerFotoLookHistorico() {
    const arquivo = document.getElementById('look-historico-foto')?.files?.[0];
    if (!arquivo) return Promise.resolve('');

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Não consegui ler a foto do look.'));
        reader.readAsDataURL(arquivo);
    });
}

function obterLookIdsRegistro(registro) {
    return [...new Set([registro.lookId, ...(registro.lookIds || [])].filter(Boolean))];
}

function agruparRegistrosPorDia(registros) {
    return registros.reduce((grupos, reg) => {
        const dia = obterDiaRegistro(reg);
        if (!dia) return grupos;
        grupos[dia] = grupos[dia] || [];
        grupos[dia].push(reg);
        return grupos;
    }, {});
}

function obterRegistrosHistoricoEntre(inicio, fim) {
    return app.historico.filter(reg => {
        const dia = obterDiaRegistro(reg);
        return dia && dia >= inicio && dia <= fim;
    });
}

function obterDiaRegistro(registro) {
    return normalizarDataHistorico(registro.data)?.slice(0, 10) || null;
}

function obterDataReferenciaHistorico() {
    const dias = app.historico
        .map(obterDiaRegistro)
        .filter(Boolean)
        .sort();

    if (dias.length === 0) return null;

    const ultimoDia = dias[dias.length - 1];
    return new Date(`${ultimoDia}T12:00:00`);
}

function obterIntervaloCompletoHistorico() {
    const dias = app.historico
        .map(obterDiaRegistro)
        .filter(Boolean)
        .sort();

    if (dias.length === 0) return null;

    return {
        inicio: dias[0],
        fim: dias[dias.length - 1],
    };
}

function preencherDatasHistorico(inicio, fim) {
    const campoInicio = document.getElementById('historico-data-inicio');
    const campoFim = document.getElementById('historico-data-fim');

    if (campoInicio) campoInicio.value = inicio || '';
    if (campoFim) campoFim.value = fim || '';
}

function atualizarResumoPeriodo(registros, inicio, fim) {
    const resumo = document.getElementById('resumo-periodo-historico');
    if (!resumo) return;

    if (!inicio || !fim) {
        resumo.textContent = 'Nenhum histórico carregado ainda.';
        return;
    }

    resumo.textContent = `${registros.length} registro(s) entre ${formatarDataBR(inicio)} e ${formatarDataBR(fim)}.`;
}

function marcarFiltroPeriodoHistorico(valor) {
    const botoes = document.querySelectorAll('#historico .filtro-btn');
    botoes.forEach(botao => botao.classList.remove('ativo'));

    const textoEsperado = {
        '7': 'Últimos 7 dias',
        '14': 'Últimos 14 dias',
        '30': 'Últimos 30 dias',
        todos: 'Todo histórico',
    }[valor];

    if (!textoEsperado) return;

    [...botoes].find(botao => botao.textContent.trim() === textoEsperado)?.classList.add('ativo');
}

function formatarDataInput(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

function formatarMesInput(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    return `${ano}-${mes}`;
}

function formatarDataBR(dataISO) {
    if (!dataISO) return '';
    const [ano, mes, dia] = dataISO.slice(0, 10).split('-');
    return `${dia}/${mes}/${ano}`;
}

/* ==================== INICIAR QUANDO A PÁGINA CARREGA ====================
   window.addEventListener('DOMContentLoaded') = espera HTML estar pronto */

window.addEventListener('DOMContentLoaded', inicializar);

/*
   💡 ESTRUTURA GERAL DO CÓDIGO:

   1. OBJETO APP
      - Estado centralizado de toda a app
      - Fácil de debugar e entender

   2. INICIALIZAÇÃO
      - Carrega dados (JSON + localStorage)
      - Renderiza interface

   3. NAVEGAÇÃO
      - mostrarPagina() = muda qual página está visível
      - Single Page App = não recarrega

   4. PÁGINAS
      - Home: galeria de peças
      - Usar Hoje: registra uso diário
      - Looks: gerencia combinações
      - Histórico: estatísticas

   5. ARMAZENAMENTO
      - localStorage = dados persistem
      - JSON = dados do Excel

   6. EVENTOS
      - onclick = funções chamadas ao clicar
      - onkeyup = funções chamadas ao digitar
      - addEventListener = escuta eventos

   PRÓXIMOS PASSOS:
   - Teste a app abrindo index.html no navegador
   - Abra DevTools (F12) para debugar
   - Customize conforme necessário
*/
