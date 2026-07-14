/* ==================== OBJETO PRINCIPAL DA APP ====================
   Tudo sobre o estado da aplicaÃ§Ã£o fica aqui. 
   Ã‰ como um "banco de dados em memÃ³ria" */

const CAMPOS_FILTROS_PECAS = ['tipo', 'funcao', 'subtipo', 'padronagem', 'cor_detalhe', 'cor', 'tom', 'nivel_aquecimento', 'formalidade', 'tendencia', 'utilizacao', 'local', 'alocacao', 'situacao', 'conservacao', 'reposicao'];
const CAMPOS_FILTROS_LOOKS = ['situacao', 'utilizacao', 'categoria', 'indicador', 'clima', 'local', 'htt', 'ocasiao'];
const DIMENSAO_POR_CAMPO_PECA = {
    tipo: ['tipos_peca', 'tipo'],
    funcao: ['funcoes_peca', 'valor'],
    subtipo: ['tipos_subtipos_peca', 'subtipo'],
    padronagem: ['padronagens_peca', 'valor'],
    cor_detalhe: ['cores_detalhe', 'cor_detalhe'],
    cor: ['cores_peca', 'valor'],
    tom: ['tons_peca', 'valor'],
    nivel_aquecimento: ['aquecimentos_peca', 'valor'],
    formalidade: ['formalidades_peca', 'valor'],
    tendencia: ['tendencias_peca', 'valor'],
    utilizacao: ['utilizacoes_peca', 'valor'],
    local: ['locais', 'valor'],
    alocacao: ['alocacoes_peca', 'valor'],
    situacao: ['situacoes_peca', 'valor'],
    conservacao: ['conservacoes_peca', 'valor'],
    reposicao: ['reposicoes_peca', 'valor'],
};
const CAMPOS_FILTROS_GERAIS_HOJE = CAMPOS_FILTROS_PECAS.filter(campo => !['tipo', 'subtipo'].includes(campo));
const TEMA_VISUAL_STORAGE_KEY = 'temaVisualGuardaRoupa';
const ESTADO_FILTROS_STORAGE_KEY = 'estadoFiltrosGuardaRoupa';
const TEMAS_VISUAIS = ['sistema', 'claro', 'escuro'];
const GRUPOS_REGISTRO_PECAS = [
    { id: 'roupas-principais', titulo: 'Blusas, calÃ§as, casacos, inteiros', tipos: ['blusa', 'calÃ§a', 'casaco', 'inteiro'] },
    { id: 'intimas-funcionais', titulo: 'Sutien, calcinha, modelador, tops, segunda-pele', tipos: ['sutien', 'calcinha', 'modelador', 'top', 'segunda-pele'] },
    { id: 'pijamas', titulo: 'Pijamas', tipos: ['pijama'] },
    { id: 'meias-calcados', titulo: 'Meias e calÃ§ados', tipos: ['meia', 'calÃ§ado'] },
    { id: 'bijus', titulo: 'Bijus', tipos: ['biju'] },
    { id: 'acessorios', titulo: 'Bolsa, cinto, pra cabeÃ§a, pro pescoÃ§o', tipos: ['bolsa', 'cinto', 'pra cabeÃ§a', 'pro pescoÃ§o'] },
    { id: 'praia', titulo: 'Roupa de praia', tipos: ['roupa de praia'] },
];

const app = {
    // Dados carregados do JSON (nunca mudam)
    pecas: {},
    pecasPersonalizadas: {},
    looks: {},
    mapaOcasioes: {},
    climas: {},
    dimensoes: {},
    validacaoDimensoes: {},
    ocasioes: ['Trabalho', 'Casual', 'Festa', 'Treino', 'Casa', 'Sair'],

    // Dados do usuÃ¡rio (salvos em localStorage)
    historico: [],           // Lista de {data, pecas, lookId?}
    looksFavoritos: {},      // Meus prÃ³prios looks criados {id: {nome, pecas, ocasiao}}
    looksEmExibicao: [],
    limiteLooksExibidos: 0,
    timeoutFiltroPecasLooks: null,

    // Estado temporÃ¡rio (mudam conforme usuÃ¡rio interage)
    pecasSelecionadasHoje: [],
    looksSelecionadosHoje: [],
    pecasSelecionadasLookHistorico: {},
    diaCriacaoLookHistorico: null,
    fotoNovoLookHistorico: null,
    pecaEmDetalhes: null,
    mesCalendarioHistorico: null,
    filtroHistoricoAtivo: null,
    resumoHistoricoTipo: 'looks',
    registrosHistoricoPeriodo: [],
    importacaoHistoricoPendente: null,
    supabase: null,
    usuarioSupabase: null,
    sincronizando: false,
    ultimaSincronizacaoSupabase: null,
    supabaseSuportaPecas: true,
    forcarEnvioLocalSupabase: false,
    recuperandoSenhaSupabase: false,
    
    // Filtros da pÃ¡gina Home
    filtrosHome: Object.fromEntries(CAMPOS_FILTROS_PECAS.map(campo => [campo, []])),
    
    // Filtros da aba "Usar Hoje"
    filtrosHoje: Object.fromEntries(CAMPOS_FILTROS_GERAIS_HOJE.map(campo => [campo, []])),
    filtrosHojeGrupos: Object.fromEntries(GRUPOS_REGISTRO_PECAS.map(grupo => [grupo.id, { tipo: [], subtipo: [] }])),

    // Filtros da pÃ¡gina Looks
    filtrosLooks: {
        ...Object.fromEntries(CAMPOS_FILTROS_LOOKS.map(campo => [campo, []])),
        situacao: ['em uso'],
        pecas: [],
    },

    filtrosOcasioes: {
        tipo: [],
        clima: [],
        ocasiao: [],
        lookId: '',
        eixoGrafico: 'climas',
    },
    dropdownOcasioesAberto: null,

    // Filtros do card "NÃ£o uso hÃ¡..." no histÃ³rico
    filtrosSemUso: {
        tipo: '',
        local: '',
        situacao: '',
        tempo: '',
    },
    filtroDataUsoPecas: {
        inicio: '',
        fim: '',
    },
    ordenacaoTabelaPecas: {
        campo: 'id',
        direcao: 'asc',
    },
    filtrosLooksPeca: {
        htt: 'todos',
        peca1: '',
        peca2: '',
        peca3: '',
    },
    looksPecaSelecionados: [],
};

/* ==================== INICIALIZAR A APP ====================
   Chamado quando a pÃ¡gina carrega. Ã‰ o "ponto de entrada" */

async function inicializar() {
    configurarTemaVisual();
    console.log('ðŸš€ Inicializando aplicaÃ§Ã£o...');

    // 1. Carregar dados do Excel (JSON)
    await carregarDadosJSON();

    // 2. Carregar dados salvos no celular
    carregarDados();
    carregarEstadoFiltros();

    // 3. Montar a interface
    preencherFiltrosHome();
    renderGaleriaFiltrada();
    aplicarPesquisaPecasSalva();
    preencherSelectLooks();
    preencherFiltrosOcasiao();
    renderLooks(obterTodosLooks().filter(lookPassaNosFiltros));
    preencherFiltrosHoje();
    configurarEventosHistorico();
    inicializarPaginaOcasioes();
    await inicializarSupabase();
    atualizarDataHoje();

    console.log('âœ… App inicializada!');
}

/* ==================== FUNÃ‡ÃƒO HELPER: OBTER CAMINHO DA FOTO ====================
   Carrega imagens em formato WebP */

function configurarTemaVisual() {
    const temaSalvo = obterTemaVisualSalvo();
    aplicarTemaVisual(temaSalvo, { salvar: false });
    atualizarBotaoTemaVisual(temaSalvo);
}

function obterTemaVisualSalvo() {
    try {
        const tema = localStorage.getItem(TEMA_VISUAL_STORAGE_KEY) || 'sistema';
        return TEMAS_VISUAIS.includes(tema) ? tema : 'sistema';
    } catch (erro) {
        return 'sistema';
    }
}

function aplicarTemaVisual(tema, opcoes = {}) {
    const temaValido = TEMAS_VISUAIS.includes(tema) ? tema : 'sistema';

    if (temaValido === 'claro') {
        document.documentElement.dataset.theme = 'light';
    } else if (temaValido === 'escuro') {
        document.documentElement.dataset.theme = 'dark';
    } else {
        document.documentElement.removeAttribute('data-theme');
    }

    if (opcoes.salvar !== false) {
        try {
            localStorage.setItem(TEMA_VISUAL_STORAGE_KEY, temaValido);
        } catch (erro) {
            console.warn('Nao foi possivel salvar o tema visual.', erro);
        }
    }

    atualizarBotaoTemaVisual(temaValido);
}

function alternarTemaVisual() {
    const temaAtual = obterTemaVisualSalvo();
    const indiceAtual = TEMAS_VISUAIS.indexOf(temaAtual);
    const proximoTema = TEMAS_VISUAIS[(indiceAtual + 1) % TEMAS_VISUAIS.length];
    aplicarTemaVisual(proximoTema);
}

function atualizarBotaoTemaVisual(tema) {
    const botao = document.getElementById('botao-tema');
    if (!botao) return;

    const labels = {
        sistema: 'Sistema',
        claro: 'Claro',
        escuro: 'Escuro',
    };
    const label = labels[tema] || labels.sistema;

    botao.textContent = `Tema: ${label}`;
    botao.title = 'Alternar tema: sistema, claro ou escuro';
    botao.setAttribute('aria-label', `Tema atual: ${label}. Clique para alternar.`);
}

function getCaminhoFoto(id) {
    if (app.pecas?.[id]?.foto) return app.pecas[id].foto;
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
    return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" class="${escapeHtml(classe)}" loading="lazy" decoding="async" onerror="${onErrorImagem()}">`;
}

function atualizarFotoModalPeca(src) {
    const imagem = document.getElementById('foto-modal');
    if (!imagem) return;
    imagem.onerror = () => {
        imagem.onerror = null;
        imagem.src = imagemFallback();
    };
    imagem.src = src || imagemFallback();
}

function obterDetalhePeca(peca, campo) {
    return (peca.detalhes || []).find(item => String(item.campo || '').toLowerCase() === campo.toLowerCase())?.valor || '';
}

function criarCamposPecaHtml(peca, compacto = false) {
    const camposBase = [
        ['Tipo', peca.tipo],
        ['FunÃ§Ã£o', peca.funcao],
        ['Subtipo', peca.subtipo],
        ['Padronagem', peca.padronagem],
        ['Cor detalhe', peca.cor_detalhe],
        ['Cor', peca.cor],
        ['Tom', peca.tom],
        ['Aquecimento', peca.nivel_aquecimento],
        ['Formalidade', peca.formalidade],
        ['TendÃªncia', peca.tendencia],
        ['UtilizaÃ§Ã£o', peca.utilizacao],
        ['Local', peca.local],
        ['AlocaÃ§Ã£o', peca.alocacao],
        ['SituaÃ§Ã£o', peca.situacao],
        ['ConservaÃ§Ã£o', peca.conservacao],
        ['ReposiÃ§Ã£o', peca.reposicao],
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
            <h4>AcessÃ³rios</h4>
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
            <h4>NÃ£o combinar</h4>
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
    const textoBusca = obterTextoBuscaPeca(peca);

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

function obterTextoBuscaPeca(peca) {
    return [
        peca.id,
        peca.tipo,
        peca.funcao,
        peca.subtipo,
        peca.padronagem,
        peca.cor_detalhe,
        peca.cor,
        peca.tom,
        peca.nivel_aquecimento,
        peca.utilizacao,
        peca.local,
        peca.situacao,
        obterInfoFotosPeca(peca),
        obterCombinacoesPeca(peca),
        ...(peca.detalhes || []).flatMap(item => [item.campo, item.valor]),
        ...(peca.acessorios || []).flatMap(item => [item.grupo, item.id]),
        ...(peca.combinacoes_nao_permitidas || []).flatMap(item => [item.codigo, item.descricao]),
    ].filter(valorVisivel).join(' ');
}

function obterDataCriacaoLook(look) {
    return look?.basicos?.['Data criaÃ§Ã£o'] || look?.dataCriacao || look?.data_criacao || '';
}

function formatarDataLook(valor) {
    if (!valor) return 'sem data';
    return /^\d{4}-\d{2}-\d{2}/.test(valor) ? formatarDataBR(valor) : valor;
}

function obterLooksCompativeis(pecasSelecionadas, opcoes = {}) {
    const selecionadas = [...new Set((pecasSelecionadas || []).filter(Boolean))];
    if (selecionadas.length === 0) return [];
    const selecionadasSet = new Set(selecionadas);
    const pecasInteirasSelecionadas = selecionadas.filter(id => ehPecaInteiraParaRegistro(id));
    const pecasInteirasSet = new Set(pecasInteirasSelecionadas);

    return obterTodosLooks()
        .filter(look => opcoes.incluirExcluidos || !ehLookExcluido(look))
        .map(look => ({
            ...look,
            pecasCompativeis: (look.pecas || []).filter(id => selecionadasSet.has(id)),
            pecasInteirasCompativeis: (look.pecas || []).filter(id => pecasInteirasSet.has(id)),
        }))
        .filter(look => look.pecasCompativeis.length >= 2 || look.pecasInteirasCompativeis.length > 0)
        .sort((a, b) => String(a.id || '').localeCompare(String(b.id || ''), 'pt-BR', { numeric: true }));
}

function ehLookExcluido(look) {
    return normalizarTexto(look?.situacao || look?.basicos?.['situaÃ§Ã£o'] || look?.basicos?.situacao) === 'excluido';
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
        funcao: 'FunÃ§Ã£o',
        subtipo: 'Subtipo',
        padronagem: 'Padronagem',
        tom: 'Tom',
        cor_detalhe: 'Cor detalhe',
        nivel_aquecimento: 'Aquecimento',
        situacao: 'SituaÃ§Ã£o',
        utilizacao: 'UtilizaÃ§Ã£o',
        indicador: 'Tipo',
        clima: 'Clima',
        local: 'Local',
        htt: 'HTT',
        ocasiao: 'OcasiÃ£o'
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
    return filtro;
}

document.addEventListener('click', evento => {
    if (!evento.target.closest('.filtro-multiplo')) {
        document.querySelectorAll('.filtro-multiplo.aberto').forEach(item => {
            item.classList.remove('aberto');
        });
    }
    if (!evento.target.closest('.ocasioes-dropdown-multiplo')) {
        app.dropdownOcasioesAberto = null;
        document.querySelectorAll('.ocasioes-dropdown-multiplo.aberto').forEach(item => {
            item.classList.remove('aberto');
            item.querySelector('.ocasioes-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
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
        const response = await fetch('dados_guarda_roupa.json?v=20260706-dimensoes-categorias', { cache: 'no-store' });
        
        // .json() = transforma texto em objeto JavaScript
        const dados = await response.json();

        // Atribui ao app
        app.pecas = dados.pecas;
        app.looks = dados.looks;
        app.mapaOcasioes = dados.ocasioes || {};
        app.climas = dados.climas || {};
        app.dimensoes = dados.dimensoes || {};
        app.validacaoDimensoes = dados.validacao_dimensoes || {};
        const tiposOcasiao = [...new Set(Object.values(app.mapaOcasioes).map(item => item.tipo).filter(Boolean))];
        if (tiposOcasiao.length > 0) app.ocasioes = tiposOcasiao;

        console.log(`âœ… Carregados ${Object.keys(app.pecas).length} peÃ§as`);
        console.log(`âœ… Carregados ${Object.keys(app.looks).length} looks`);
    } catch (erro) {
        console.error('âŒ Erro ao carregar dados:', erro);
        alert('Erro ao carregar dados. Verifique se dados_guarda_roupa.json existe.');
    }
}

/* ==================== CARREGAR DADOS DO CELULAR ====================
   Busca dados salvos em localStorage (histÃ³rico, looks favoritos) */

function carregarDados() {
    // localStorage.getItem() = busca um valor salvo
    // JSON.parse() = transforma string em objeto
    // || [] = se nÃ£o existir, usa lista vazia

    try {
        const pecasSalvas = localStorage.getItem('app_pecas_personalizadas');
        app.pecasPersonalizadas = pecasSalvas ? JSON.parse(pecasSalvas) : {};
        if (!app.pecasPersonalizadas || Array.isArray(app.pecasPersonalizadas)) app.pecasPersonalizadas = {};
        app.pecas = { ...app.pecas, ...app.pecasPersonalizadas };
        Object.values(app.pecas).forEach(normalizarDimensoesPeca);
    } catch (erro) {
        console.warn('PeÃ§as personalizadas invÃ¡lidas. Ignorando alteraÃ§Ãµes locais.', erro);
        app.pecasPersonalizadas = {};
    }

    try {
        const historicoSalvo = localStorage.getItem('app_historico');
        app.historico = historicoSalvo ? JSON.parse(historicoSalvo) : [];
        if (!Array.isArray(app.historico)) app.historico = [];
    } catch (erro) {
        console.warn('HistÃ³rico salvo invÃ¡lido. Iniciando vazio.', erro);
        app.historico = [];
    }

    try {
        const looksFavSalvos = localStorage.getItem('app_looks_favs');
        app.looksFavoritos = looksFavSalvos ? JSON.parse(looksFavSalvos) : {};
        if (garantirLooksFavoritosSemColisao()) salvarDadosLocal();
    } catch (erro) {
        console.warn('Looks favoritos salvos invÃ¡lidos. Iniciando vazio.', erro);
        app.looksFavoritos = {};
    }

    console.log(`âœ… Carregados ${app.historico.length} registros do histÃ³rico`);
    console.log(`âœ… Carregados ${Object.keys(app.looksFavoritos).length} looks favoritos`);
}

/* ==================== SALVAR DADOS NO CELULAR ====================
   Persiste dados em localStorage (sobrevive ao fechar a app) */

function clonarEstado(valor, fallback) {
    if (!valor || typeof valor !== 'object') return JSON.parse(JSON.stringify(fallback));
    return JSON.parse(JSON.stringify(valor));
}

function normalizarMapaFiltrosArrays(filtros, campos) {
    return Object.fromEntries(campos.map(campo => [
        campo,
        Array.isArray(filtros?.[campo]) ? filtros[campo].filter(Boolean) : [],
    ]));
}

function normalizarFiltrosHojeGrupos(filtrosGrupos) {
    return Object.fromEntries(GRUPOS_REGISTRO_PECAS.map(grupo => {
        const filtrosGrupo = filtrosGrupos?.[grupo.id] || {};
        return [grupo.id, {
            tipo: Array.isArray(filtrosGrupo.tipo) ? filtrosGrupo.tipo.filter(Boolean) : [],
            subtipo: Array.isArray(filtrosGrupo.subtipo) ? filtrosGrupo.subtipo.filter(Boolean) : [],
        }];
    }));
}

function carregarEstadoFiltros() {
    try {
        const salvo = localStorage.getItem(ESTADO_FILTROS_STORAGE_KEY);
        if (!salvo) return;

        const estado = JSON.parse(salvo);
        app.filtrosHome = normalizarMapaFiltrosArrays(estado.filtrosHome, CAMPOS_FILTROS_PECAS);
        app.filtrosHoje = normalizarMapaFiltrosArrays(estado.filtrosHoje, CAMPOS_FILTROS_GERAIS_HOJE);
        app.filtrosHojeGrupos = normalizarFiltrosHojeGrupos(estado.filtrosHojeGrupos);
        app.filtrosLooks = {
            ...normalizarMapaFiltrosArrays(estado.filtrosLooks, CAMPOS_FILTROS_LOOKS),
            pecas: Array.isArray(estado.filtrosLooks?.pecas) ? estado.filtrosLooks.pecas.filter(Boolean) : [],
        };
        app.filtrosOcasioes = {
            tipo: Array.isArray(estado.filtrosOcasioes?.tipo) ? estado.filtrosOcasioes.tipo.filter(Boolean) : [],
            clima: Array.isArray(estado.filtrosOcasioes?.clima) ? estado.filtrosOcasioes.clima.filter(Boolean) : [],
            ocasiao: Array.isArray(estado.filtrosOcasioes?.ocasiao) ? estado.filtrosOcasioes.ocasiao.filter(Boolean) : [],
            lookId: estado.filtrosOcasioes?.lookId || '',
            eixoGrafico: estado.filtrosOcasioes?.eixoGrafico === 'ocasioes' ? 'ocasioes' : 'climas',
        };
        app.filtroHistoricoAtivo = estado.filtroHistoricoAtivo || app.filtroHistoricoAtivo;
        app.mesCalendarioHistorico = estado.mesCalendarioHistorico || app.mesCalendarioHistorico;
        app.filtrosSemUso = {
            tipo: estado.filtrosSemUso?.tipo || '',
            local: estado.filtrosSemUso?.local || '',
            situacao: estado.filtrosSemUso?.situacao || '',
            tempo: estado.filtrosSemUso?.tempo || '',
        };
        app.filtroPesquisaPecas = estado.filtroPesquisaPecas || '';
        app.filtroDataUsoPecas = {
            inicio: estado.filtroDataUsoPecas?.inicio || '',
            fim: estado.filtroDataUsoPecas?.fim || '',
        };
    } catch (erro) {
        console.warn('Filtros salvos invalidos. Mantendo filtros padrao.', erro);
    }
}

function salvarEstadoFiltros() {
    try {
        const pesquisa = document.getElementById('filtro-pesquisa')?.value ?? app.filtroPesquisaPecas ?? '';
        app.filtroPesquisaPecas = pesquisa;
        localStorage.setItem(ESTADO_FILTROS_STORAGE_KEY, JSON.stringify({
            filtrosHome: clonarEstado(app.filtrosHome, {}),
            filtroPesquisaPecas: pesquisa,
            filtrosHoje: clonarEstado(app.filtrosHoje, {}),
            filtrosHojeGrupos: clonarEstado(app.filtrosHojeGrupos, {}),
            filtrosLooks: clonarEstado(app.filtrosLooks, {}),
            filtrosOcasioes: clonarEstado(app.filtrosOcasioes, {}),
            filtroHistoricoAtivo: clonarEstado(app.filtroHistoricoAtivo, null),
            mesCalendarioHistorico: app.mesCalendarioHistorico || '',
            filtrosSemUso: clonarEstado(app.filtrosSemUso, {}),
            filtroDataUsoPecas: clonarEstado(app.filtroDataUsoPecas, {}),
        }));
    } catch (erro) {
        console.warn('Nao foi possivel salvar os filtros.', erro);
    }
}

function aplicarPesquisaPecasSalva() {
    const input = document.getElementById('filtro-pesquisa');
    const dataInicio = document.getElementById('pecas-data-uso-inicio');
    const dataFim = document.getElementById('pecas-data-uso-fim');
    if (input) input.value = app.filtroPesquisaPecas || '';
    if (dataInicio) dataInicio.value = app.filtroDataUsoPecas.inicio || '';
    if (dataFim) dataFim.value = app.filtroDataUsoPecas.fim || '';
    atualizarResumoDataUsoPecas();
    filtrarPecas();
}

function salvarDados() {
    // localStorage.setItem() = salva um valor
    // JSON.stringify() = transforma objeto em texto

    app.mapaUsosLooksAtual = null;
    app.indiceLooksPorPecasAtual = null;

    localStorage.setItem('app_historico', JSON.stringify(app.historico));
    localStorage.setItem('app_looks_favs', JSON.stringify(app.looksFavoritos));
    localStorage.setItem('app_pecas_personalizadas', JSON.stringify(app.pecasPersonalizadas));

    console.log('ðŸ’¾ Dados salvos!');
    agendarEnvioSupabase();
}

function normalizarDimensoesPeca(peca) {
    const detalhes = new Map((peca?.detalhes || []).map(item => [normalizarTexto(item.campo), item.valor]));
    const campos = {
        formalidade: ['formalidade'],
        tendencia: ['tendencia'],
        alocacao: ['alocacao'],
        conservacao: ['conservacao'],
        reposicao: ['repor', 'reposicao'],
    };
    Object.entries(campos).forEach(([campo, aliases]) => {
        if (valorVisivel(peca[campo])) return;
        peca[campo] = aliases.map(alias => detalhes.get(alias)).find(valorVisivel) || '';
    });
    if (!valorVisivel(peca.cor)) {
        peca.cor = (app.dimensoes?.cores_detalhe || []).find(item =>
            normalizarTexto(item.cor_detalhe) === normalizarTexto(peca.cor_detalhe)
        )?.cor || '';
    }
    return peca;
}

/* ==================== IMPORTAR HISTÃ“RICO ====================
   LÃª arquivos .xlsm, .xlsx, .csv ou .json e mescla com os registros jÃ¡ salvos */

function supabaseConfigurado() {
    const config = window.SUPABASE_CONFIG || {};
    return Boolean(config.url && config.anonKey && window.supabase?.createClient);
}

async function inicializarSupabase() {
    configurarEventosSupabase();

    if (!supabaseConfigurado()) {
        atualizarStatusSupabase('Configure js/supabase-config.js para ativar a sincronizaÃ§Ã£o.');
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
        const baixou = await baixarDadosSupabase({ silencioso: true });
        if (baixou && app.supabaseSuportaPecas) {
            atualizarStatusSupabase('Conectado. Dados do app atualizados pela nuvem.', 'sucesso');
        } else if (baixou) {
            atualizarStatusSupabase('Conectado, mas falta atualizar o schema para sincronizar as peÃ§as.', 'erro');
        }
    } else {
        atualizarStatusSupabase('Entre na sua conta para sincronizar peÃ§as, looks e histÃ³rico.');
    }

    app.supabase.auth.onAuthStateChange(async (event, session) => {
        app.usuarioSupabase = session?.user || null;
        if (event === 'PASSWORD_RECOVERY') {
            app.recuperandoSenhaSupabase = true;
            atualizarStatusSupabase('Link de recuperacao validado. Digite sua nova senha.', 'sucesso');
        }
        atualizarUISupabase(app.usuarioSupabase);
        if (app.usuarioSupabase && !app.recuperandoSenhaSupabase) {
            const baixou = await baixarDadosSupabase({ silencioso: true });
            if (baixou && app.supabaseSuportaPecas) {
                atualizarStatusSupabase('Conta conectada e dados atualizados.', 'sucesso');
            } else if (baixou) {
                atualizarStatusSupabase('Conta conectada, mas falta atualizar o schema das peÃ§as.', 'erro');
            }
        } else if (!app.recuperandoSenhaSupabase) {
            atualizarStatusSupabase('Entre na sua conta para sincronizar peÃ§as, looks e histÃ³rico.');
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
    if (status) {
        status.textContent = mensagem;
        status.className = `texto-ajuda ${tipo}`.trim();
    }

    const botao = document.getElementById('supabase-global-toggle');
    if (botao) {
        botao.dataset.status = tipo || (app.usuarioSupabase ? 'conectado' : 'desconectado');
        botao.title = mensagem;
    }
}

function atualizarUISupabase(usuario) {
    const login = document.getElementById('supabase-login');
    const logado = document.getElementById('supabase-logado');
    const resetSenha = document.getElementById('supabase-reset-senha');
    const usuarioEl = document.getElementById('supabase-usuario');

    if (!login || !logado) return;

    const botaoGlobal = document.getElementById('supabase-global-toggle');
    const labelGlobal = document.getElementById('supabase-global-label');
    const configurado = supabaseConfigurado();
    if (botaoGlobal) {
        botaoGlobal.classList.toggle('conectado', Boolean(usuario));
        botaoGlobal.classList.toggle('indisponivel', !configurado);
    }
    if (labelGlobal) {
        labelGlobal.textContent = !configurado ? 'Nuvem indisponÃ­vel' : (usuario ? 'Nuvem conectada' : 'Conectar nuvem');
    }

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

function alternarPainelSupabase() {
    const painel = document.getElementById('supabase-global-panel');
    if (!painel) return;
    const abrir = painel.style.display === 'none';
    painel.style.display = abrir ? 'grid' : 'none';
    document.getElementById('supabase-global-toggle')?.setAttribute('aria-expanded', String(abrir));
    if (abrir && !app.usuarioSupabase) {
        window.setTimeout(() => document.getElementById('supabase-email')?.focus(), 0);
    }
}

function fecharPainelSupabase() {
    const painel = document.getElementById('supabase-global-panel');
    if (painel) painel.style.display = 'none';
    document.getElementById('supabase-global-toggle')?.setAttribute('aria-expanded', 'false');
}

document.addEventListener('click', evento => {
    const painel = document.getElementById('supabase-global-panel');
    if (!painel || painel.style.display === 'none') return;
    if (evento.target.closest('#supabase-global-panel, #supabase-global-toggle')) return;
    fecharPainelSupabase();
});

document.addEventListener('keydown', evento => {
    if (evento.key === 'Escape') fecharPainelSupabase();
});

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
    atualizarStatusSupabase('Conta criada. Se o Supabase pedir confirmaÃ§Ã£o de email, confirme antes do prÃ³ximo login.', 'sucesso');
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

    let { data, error } = await app.supabase
        .from('wardrobe_sync')
        .select('historico, looks_favoritos, pecas_personalizadas')
        .eq('user_id', app.usuarioSupabase.id)
        .maybeSingle();

    app.supabaseSuportaPecas = !(error && /pecas_personalizadas/i.test(`${error.message || ''} ${error.details || ''}`));
    if (!app.supabaseSuportaPecas) {
        ({ data, error } = await app.supabase
            .from('wardrobe_sync')
            .select('historico, looks_favoritos')
            .eq('user_id', app.usuarioSupabase.id)
            .maybeSingle());
    }

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
            if (!silencioso) atualizarStatusSupabase('NÃƒÂ£o enviei porque nÃƒÂ£o consegui conferir a nuvem primeiro.', 'erro');
            return false;
        }
    }

    const { error } = await app.supabase
        .from('wardrobe_sync')
        .upsert({
            user_id: app.usuarioSupabase.id,
            historico: app.historico,
            looks_favoritos: app.looksFavoritos,
            pecas_personalizadas: app.pecasPersonalizadas,
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

        const montarPayload = incluirPecas => ({
            user_id: app.usuarioSupabase.id,
            historico: app.historico,
            looks_favoritos: app.looksFavoritos,
            ...(incluirPecas ? { pecas_personalizadas: app.pecasPersonalizadas } : {}),
            updated_at: new Date().toISOString(),
        });

        const enviarPayload = incluirPecas => app.supabase
            .from('wardrobe_sync')
            .upsert(montarPayload(incluirPecas), { onConflict: 'user_id' })
            .select('updated_at')
            .single();

        let { data, error } = await enviarPayload(app.supabaseSuportaPecas !== false);

        if (error && /pecas_personalizadas/i.test(`${error.message || ''} ${error.details || ''}`)) {
            app.supabaseSuportaPecas = false;
            ({ data, error } = await enviarPayload(false));
        }

        if (error) {
            console.error('Erro ao enviar para Supabase:', error);
            atualizarStatusSupabase(`Erro ao enviar: ${error.message}`, 'erro');
            return false;
        }

        if (!silencioso) {
            const avisoPecas = app.supabaseSuportaPecas === false
                ? ' PeÃ§as personalizadas ainda nÃ£o foram enviadas porque falta atualizar o schema do Supabase.'
                : '';
            atualizarStatusSupabase(
                `Dados enviados para a nuvem (${app.historico.length} registros, ${Object.keys(app.looksFavoritos).length} looks criados). Ultima gravacao: ${formatarDataHoraSupabase(data?.updated_at)}.${avisoPecas}`,
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
    atualizarStatusSupabase('AlteraÃ§Ãµes locais aguardando sincronizaÃ§Ã£o.', 'sincronizando');
    app.timeoutSyncSupabase = window.setTimeout(async () => {
        atualizarStatusSupabase('Sincronizando alteraÃ§Ãµes com a nuvem...', 'sincronizando');
        const enviou = await enviarDadosSupabase({ silencioso: true, mesclarAntes });
        if (enviou) {
            app.ultimaSincronizacaoSupabase = new Date();
            atualizarStatusSupabase(
                `Sincronizado automaticamente Ã s ${app.ultimaSincronizacaoSupabase.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.`,
                'sucesso'
            );
        }
    }, 800);
}

function formatarDataHoraSupabase(valor) {
    if (!valor) return 'confirmada';

    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) return valor;

    return data.toLocaleString('pt-BR');
}

function formatarDataHoraFicha(valor) {
    if (!valor) return '';
    const texto = String(valor).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) return formatarDataBR(texto);
    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) return String(valor);
    return data.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function obterCampoPorNomes(objeto, nomes) {
    const nomesNormalizados = new Set(nomes.map(normalizarTexto));
    const entrada = Object.entries(objeto || {}).find(([campo, valor]) =>
        nomesNormalizados.has(normalizarTexto(campo)) && valorVisivel(valor)
    );
    return entrada?.[1] || '';
}

function obterDataAtualizacaoLook(look) {
    if (valorVisivel(look?.editadoEm)) return look.editadoEm;

    const ultimaAlteracao = obterCampoPorNomes(look?.basicos, [
        'Data Ãºltima alteraÃ§Ã£o',
        'Data ultima alteracao',
        'Data ult alt',
        'Ãšltima alteraÃ§Ã£o',
    ]) || look?.dataUltimaAlteracao || look?.data_ultima_alteracao;

    return valorVisivel(ultimaAlteracao) ? ultimaAlteracao : obterDataCriacaoLook(look);
}

function obterDataAtualizacaoPeca(peca) {
    return obterDataAtualizacaoTabelaPeca(peca);
}

function obterDataRevisaoPeca(peca) {
    if (valorVisivel(peca?.data_revisao)) return peca.data_revisao;
    if (valorVisivel(peca?.dataRevisao)) return peca.dataRevisao;

    return obterCampoPorNomes(
        Object.fromEntries((peca?.detalhes || []).map(item => [item.campo, item.valor])),
        ['Data revisÃ£o', 'Data revisao']
    );
}

function obterDataAtualizacaoTabelaPeca(peca) {
    if (valorVisivel(peca?.editadaEm)) return peca.editadaEm;
    if (valorVisivel(peca?.updatedAt)) return peca.updatedAt;
    if (valorVisivel(peca?.updated_at)) return peca.updated_at;
    if (valorVisivel(peca?.data_atualizacao)) return peca.data_atualizacao;
    if (valorVisivel(peca?.dataAtualizacao)) return peca.dataAtualizacao;

    return obterCampoPorNomes(
        Object.fromEntries((peca?.detalhes || []).map(item => [item.campo, item.valor])),
        ['Data atualizaÃ§Ã£o', 'Data atualizacao', 'Data Ãºltima alteraÃ§Ã£o', 'Data ultima alteracao', 'Ãšltima atualizaÃ§Ã£o', 'Ultima atualizacao']
    );
}

function salvarDadosLocal() {
    localStorage.setItem('app_historico', JSON.stringify(app.historico));
    localStorage.setItem('app_looks_favs', JSON.stringify(app.looksFavoritos));
    localStorage.setItem('app_pecas_personalizadas', JSON.stringify(app.pecasPersonalizadas));
}

function timestampValor(valor) {
    if (!valor && valor !== 0) return 0;
    const direto = new Date(valor);
    if (!Number.isNaN(direto.getTime())) return direto.getTime();
    const normalizado = normalizarDataHistorico(valor);
    const data = normalizado ? new Date(normalizado) : new Date(0);
    const tempo = data.getTime();
    return Number.isFinite(tempo) ? tempo : 0;
}

function timestampRegistroHistorico(registro) {
    return timestampValor(registro?.alteradoEm || registro?.updatedAt || registro?.updated_at || registro?.criadoEm || registro?.data);
}

function timestampLookSync(look) {
    return timestampValor(look?.editadoEm || look?.updatedAt || look?.updated_at || obterDataAtualizacaoLook(look));
}

function timestampPecaSync(peca) {
    return timestampValor(peca?.editadaEm || peca?.updatedAt || peca?.updated_at || obterDataAtualizacaoPeca(peca));
}

function mesclarMapaPorMaisRecente(local = {}, nuvem = {}, obterTimestamp) {
    const resultado = { ...(local || {}) };
    Object.entries(nuvem || {}).forEach(([id, itemNuvem]) => {
        const itemLocal = resultado[id];
        if (!itemLocal || obterTimestamp(itemNuvem) > obterTimestamp(itemLocal)) {
            resultado[id] = itemNuvem;
        }
    });
    return resultado;
}

function chaveConjuntoRegistrosHistorico(registros) {
    return (registros || []).map(chaveRegistroHistorico).sort().join('||');
}

function mesclarHistoricoPorMaisRecente(historicoNuvem) {
    const locais = agruparRegistrosPorDia((app.historico || []).map(normalizarRegistroUso).filter(Boolean));
    const nuvem = agruparRegistrosPorDia((historicoNuvem || []).map(normalizarRegistroUso).filter(Boolean));
    const dias = [...new Set([...Object.keys(locais), ...Object.keys(nuvem)])].sort();
    const resultado = [];

    dias.forEach(dia => {
        const registrosLocais = locais[dia] || [];
        const registrosNuvem = nuvem[dia] || [];

        if (registrosLocais.length === 0) {
            resultado.push(...registrosNuvem);
            return;
        }

        if (registrosNuvem.length === 0) {
            resultado.push(...registrosLocais);
            return;
        }

        if (chaveConjuntoRegistrosHistorico(registrosLocais) === chaveConjuntoRegistrosHistorico(registrosNuvem)) {
            resultado.push(...registrosLocais);
            return;
        }

        const tsLocal = Math.max(...registrosLocais.map(timestampRegistroHistorico));
        const tsNuvem = Math.max(...registrosNuvem.map(timestampRegistroHistorico));
        resultado.push(...(tsNuvem > tsLocal ? registrosNuvem : registrosLocais));
    });

    app.historico = resultado;
}

function mesclarDadosNuvem(data) {
    const historicoNuvem = Array.isArray(data.historico) ? data.historico : [];

    mesclarHistoricoPorMaisRecente(historicoNuvem);

    app.looksFavoritos = mesclarMapaPorMaisRecente(app.looksFavoritos, data.looks_favoritos || {}, timestampLookSync);
    app.pecasPersonalizadas = mesclarMapaPorMaisRecente(app.pecasPersonalizadas, data.pecas_personalizadas || {}, timestampPecaSync);
    app.pecas = { ...app.pecas, ...app.pecasPersonalizadas };
    app.mapaUsosLooksAtual = null;
    app.indiceLooksPorPecasAtual = null;
    garantirLooksFavoritosSemColisao();
}

function atualizarTelasAposSync() {
    renderGaleria();
    reconstruirFiltrosHome();
    preencherFiltrosHoje();
    preencherSelectLooks();
    preencherFiltrosOcasiao();
    if (document.getElementById('looks')?.style.display !== 'none') {
        renderLooks(obterTodosLooks().filter(lookPassaNosFiltros));
    }
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
        alert('Escolha um arquivo de histÃ³rico primeiro.');
        return;
    }

    atualizarStatusImportacao('Lendo arquivo...');

    try {
        const linhas = await lerTabelaHistorico(arquivo);
        const registros = normalizarLinhasHistorico(linhas);

        if ((registros.ignorados || 0) > 0) {
            alert(`${registros.ignorados} linha(s) nÃ£o tinham data ou peÃ§a/look reconhecido e foram ignoradas.`);
        }

        const plano = prepararImportacaoHistorico(registros);
        if (plano.conflitos.length > 0) {
            app.importacaoHistoricoPendente = { ...plano, ignorados: registros.ignorados || 0 };
            mostrarConflitosImportacaoHistorico();
            atualizarStatusImportacao(`${plano.conflitos.length} dia(s) precisam de revisÃ£o antes de importar.`, 'erro');
            return;
        }

        const resultado = aplicarPlanoImportacaoHistorico(plano);
        finalizarImportacaoHistorico(resultado, registros.ignorados || 0);

        input.value = '';
    } catch (erro) {
        console.error('Erro ao importar histÃ³rico:', erro);
        atualizarStatusImportacao(`NÃ£o consegui importar: ${erro.message}`, 'erro');
        alert(`NÃ£o consegui importar esse arquivo: ${erro.message}`);
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
    const lookIdsNormalizados = [...new Set([lookId, ...lookIds].filter(Boolean))];

    const pecas = extrairIdsPecas(linha);
    const pecasValidas = [...new Set(pecas)];

    if (!data || (pecasValidas.length === 0 && lookIdsNormalizados.length === 0)) return null;

    return {
        data,
        pecas: pecasValidas,
        lookId: lookId || null,
        lookIds: lookIdsNormalizados,
        alteradoEm: new Date().toISOString(),
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

    return extrairCodigosLook(valor)[0] || null;
}

// IDs de peças também têm letras e números (ex.: ID0292), mas nunca são looks.
function extrairCodigosLook(valor) {
    const texto = String(valor || '').toUpperCase();
    const codigos = texto.match(/\b(?:LOOK_\d+|[A-Z]{1,4}\d{4})\b/g) || [];
    return [...new Set(codigos.filter(codigo => !/^ID\d{4}$/.test(codigo)))];
}

function extrairIdsLooks(linha) {
    const ids = [];

    Object.entries(linha).forEach(([chave, valor]) => {
        if (valor === null || valor === undefined) return;

        const chaveNormalizada = normalizarTexto(chave);
        if (!chaveNormalizada.includes('look')) return;

        ids.push(...extrairCodigosLook(valor));
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

function prepararImportacaoHistorico(registros) {
    const registrosValidos = (registros || [])
        .map(normalizarRegistroUso)
        .filter(Boolean);
    const existentesPorDia = agruparRegistrosPorDia(app.historico || []);
    const importadosPorDia = agruparRegistrosPorDia(registrosValidos);
    const automaticos = [];
    const conflitos = [];

    Object.entries(importadosPorDia).forEach(([dia, importados]) => {
        const existentes = existentesPorDia[dia] || [];
        if (existentes.length === 0) {
            automaticos.push(...importados);
            return;
        }

        if (diaTemDiferencasHistorico(existentes, importados)) {
            conflitos.push({ dia, existentes, importados, decisao: 'manter' });
        } else {
            automaticos.push(...importados);
        }
    });

    return { automaticos, conflitos };
}

function diaTemDiferencasHistorico(existentes, importados) {
    const chavesExistentes = new Set((existentes || []).map(chaveRegistroHistorico));
    const chavesImportados = new Set((importados || []).map(chaveRegistroHistorico));
    if (chavesExistentes.size !== chavesImportados.size) return true;
    return [...chavesImportados].some(chave => !chavesExistentes.has(chave));
}

function aplicarPlanoImportacaoHistorico(plano) {
    const resultado = {
        adicionados: 0,
        duplicados: 0,
        substituidos: 0,
        mantidos: 0,
    };

    (plano.automaticos || []).forEach(registro => {
        if (mesclarRegistroHistorico(registro)) {
            resultado.adicionados++;
        } else {
            resultado.duplicados++;
        }
    });

    (plano.conflitos || []).forEach(conflito => {
        const decisao = conflito.decisao || 'manter';
        if (decisao === 'manter') {
            resultado.mantidos += (conflito.importados || []).length;
            return;
        }

        if (decisao === 'substituir') {
            app.historico = (app.historico || []).filter(registro => obterDiaRegistro(registro) !== conflito.dia);
            (conflito.importados || []).forEach(registro => {
                app.historico.push({ ...registro, alteradoEm: new Date().toISOString() });
                resultado.substituidos++;
            });
            return;
        }

        (conflito.importados || []).forEach(registro => {
            if (mesclarRegistroHistorico(registro)) {
                resultado.adicionados++;
            } else {
                resultado.duplicados++;
            }
        });
    });

    return resultado;
}

function finalizarImportacaoHistorico(resultado, ignorados = 0) {
    salvarDados();
    aplicarFiltroHistoricoAtivo();
    atualizarStatusImportacao(
        `ImportaÃ§Ã£o concluÃ­da: ${resultado.adicionados} novo(s), ${resultado.substituidos || 0} substituÃ­do(s), ${resultado.duplicados} duplicado(s) ignorado(s), ${resultado.mantidos || 0} mantido(s) no app${ignorados ? `, ${ignorados} linha(s) ignorada(s)` : ''}.`,
        'sucesso'
    );
}

function mostrarConflitosImportacaoHistorico() {
    const pendente = app.importacaoHistoricoPendente;
    const modal = document.getElementById('modal-conflitos-historico');
    const lista = document.getElementById('lista-conflitos-historico');
    if (!pendente || !modal || !lista) return;

    lista.innerHTML = pendente.conflitos.map((conflito, indice) => `
        <div class="conflito-historico-dia">
            <div class="conflito-historico-topo">
                <strong>${formatarDataBR(conflito.dia)}</strong>
                <span>${conflito.existentes.length} registro(s) no app Â· ${conflito.importados.length} registro(s) no arquivo</span>
            </div>
            <div class="conflito-historico-comparacao">
                <div>
                    <span>Atual no app</span>
                    ${resumirRegistrosHistoricoConflito(conflito.existentes)}
                </div>
                <div>
                    <span>Arquivo importado</span>
                    ${resumirRegistrosHistoricoConflito(conflito.importados)}
                </div>
            </div>
            <label>
                O que fazer neste dia?
                <select data-decisao-conflito-historico="${indice}">
                    <option value="manter">Manter como estÃ¡ no app</option>
                    <option value="adicionar">Adicionar registros do arquivo</option>
                    <option value="substituir">Substituir este dia pelo arquivo</option>
                </select>
            </label>
        </div>
    `).join('');

    modal.style.display = 'flex';
}

function resumirRegistrosHistoricoConflito(registros) {
    if (!registros?.length) return '<p class="texto-ajuda">Nenhum registro.</p>';

    const chavesPecas = registros.map(registro => [...(registro.pecas || [])].sort().join(','));
    const mesmasPecas = chavesPecas.length > 1 && new Set(chavesPecas).size === 1;

    return `
        ${mesmasPecas ? '<p class="texto-ajuda conflito-historico-nota">As linhas abaixo usam as mesmas peÃ§as; a diferenÃ§a estÃ¡ no look vinculado ao registro.</p>' : ''}
        <ul>
            ${registros.slice(0, 4).map((registro, indice) => {
                const looks = obterLookIdsRegistro(registro);
                const pecas = registro.pecas || [];
                const rotulo = looks.length
                    ? `Look vinculado: ${escapeHtml(looks.join(', '))}`
                    : 'Registro sem look vinculado';
                return `<li><strong>${indice + 1}. ${rotulo}</strong><br><span>${pecas.length} peÃ§a(s): ${escapeHtml(pecas.slice(0, 6).join(', '))}${pecas.length > 6 ? '...' : ''}</span></li>`;
            }).join('')}
            ${registros.length > 4 ? `<li>...mais ${registros.length - 4} registro(s)</li>` : ''}
        </ul>
    `;
}

function cancelarImportacaoHistoricoComConflitos() {
    app.importacaoHistoricoPendente = null;
    document.getElementById('modal-conflitos-historico').style.display = 'none';
    const input = document.getElementById('arquivo-historico');
    if (input) input.value = '';
    atualizarStatusImportacao('ImportaÃ§Ã£o cancelada. Nenhuma alteraÃ§Ã£o foi aplicada.', 'erro');
}

function confirmarImportacaoHistoricoComConflitos() {
    const pendente = app.importacaoHistoricoPendente;
    if (!pendente) return;

    document.querySelectorAll('[data-decisao-conflito-historico]').forEach(select => {
        const indice = Number(select.dataset.decisaoConflitoHistorico);
        if (pendente.conflitos[indice]) {
            pendente.conflitos[indice].decisao = select.value;
        }
    });

    const resultado = aplicarPlanoImportacaoHistorico(pendente);
    app.importacaoHistoricoPendente = null;
    document.getElementById('modal-conflitos-historico').style.display = 'none';
    const input = document.getElementById('arquivo-historico');
    if (input) input.value = '';
    finalizarImportacaoHistorico(resultado, pendente.ignorados || 0);
}

function normalizarRegistroUso(registro) {
    if (!registro || typeof registro !== 'object') return null;

    const data = normalizarDataHistorico(registro.data);
    const pecas = [...new Set(Array.isArray(registro.pecas) ? registro.pecas : [])];
    const lookIds = [...new Set([registro.lookId, ...(Array.isArray(registro.lookIds) ? registro.lookIds : [])].filter(Boolean))];
    const alteradoEm = registro.alteradoEm || registro.updatedAt || registro.updated_at || registro.criadoEm || '';

    if (!data || (pecas.length === 0 && lookIds.length === 0)) return null;

    return {
        ...registro,
        data,
        pecas,
        lookId: lookIds[0] || null,
        lookIds,
        alteradoEm,
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
    const caminhoPlanilha = obterCaminhoPlanilhaRegistro(arquivos);
    const xmlPlanilha = arquivos[caminhoPlanilha];

    if (!xmlPlanilha) {
        throw new Error('nao encontrei a aba registro dentro do .xlsx/.xlsm.');
    }

    const linhas = planilhaXmlParaMatriz(xmlPlanilha, sharedStrings);
    return matrizRegistroHistoricoParaObjetos(linhas);
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
        throw new Error('este navegador nÃ£o conseguiu ler o .xlsm/.xlsx. Salve a primeira aba como CSV e tente novamente.');
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

const COLUNAS_REGISTRO_LOOKS = ['C', 'G', 'J', 'N', 'W', 'AA', 'AG', 'AL', 'AM', 'AN', 'AO', 'AP'];
const COLUNAS_REGISTRO_PECAS = ['D', 'E', 'F', 'H', 'I', 'K', 'L', 'M', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y', 'Z', 'AB', 'AC', 'AD', 'AE', 'AF', 'AH', 'AI', 'AJ', 'AK'];

function obterCaminhoPlanilhaRegistro(arquivos) {
    const workbook = arquivos['xl/workbook.xml'];
    const rels = arquivos['xl/_rels/workbook.xml.rels'];
    if (!workbook || !rels) return obterCaminhoPrimeiraPlanilha(arquivos);

    const sheets = [...workbook.matchAll(/<sheet\b[^>]*>/g)].map(match => {
        const tag = match[0];
        return {
            nome: decodificarXml(tag.match(/\bname="([^"]+)"/)?.[1] || ''),
            relId: tag.match(/\br:id="([^"]+)"/)?.[1] || '',
        };
    });
    const sheetRegistro = sheets.find(sheet => normalizarTexto(sheet.nome) === 'registro');
    if (!sheetRegistro?.relId) return '';

    const rel = new RegExp(`<Relationship[^>]*Id="${sheetRegistro.relId}"[^>]*Target="([^"]+)"`).exec(rels);
    if (!rel) return '';

    return normalizarCaminhoPlanilhaWorkbook(rel[1]);
}

function normalizarCaminhoPlanilhaWorkbook(target) {
    const semPrefixo = String(target || '').replace(/^\/?xl\//, '');
    return `xl/${semPrefixo.replace(/^\.\.\//, '')}`;
}

function matrizRegistroHistoricoParaObjetos(linhas) {
    return (linhas || []).map(linha => {
        const data = linha[colunaParaIndice('A')] || '';
        const diaSemana = linha[colunaParaIndice('B')] || '';
        const lookIds = extrairIdsLooksDasColunasRegistro(linha);
        const pecas = extrairIdsPecasDasColunasRegistro(linha);

        return {
            data,
            diaSemana,
            lookIds,
            pecas,
            origem: 'excel-registro',
        };
    });
}

function extrairIdsLooksDasColunasRegistro(linha) {
    const ids = [];
    COLUNAS_REGISTRO_LOOKS.forEach(coluna => {
        const valor = linha[colunaParaIndice(coluna)];
        if (!valorVisivel(valor)) return;
        ids.push(...extrairCodigosLook(valor));
    });
    return [...new Set(ids)];
}

function extrairIdsPecasDasColunasRegistro(linha) {
    const ids = [];
    COLUNAS_REGISTRO_PECAS.forEach(coluna => {
        const valor = linha[colunaParaIndice(coluna)];
        if (!valorVisivel(valor)) return;
        const encontrados = String(valor).toUpperCase().match(/\bID\d{4}\b/g) || [];
        ids.push(...encontrados);
    });
    return [...new Set(ids)];
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

/* ==================== NAVEGAÃ‡ÃƒO: MOSTRAR/ESCONDER PÃGINAS ====================
   Sistema de single-page-app: uma pÃ¡gina HTML, mÃºltiplas visualizaÃ§Ãµes */

function mostrarPagina(nome) {
    salvarEstadoFiltros();

    // Esconde TODAS as pÃ¡ginas
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

    if (nome === 'pecas') {
        renderGaleriaFiltrada();
        aplicarPesquisaPecasSalva();
    }

    if (nome === 'usar-hoje') {
        preencherFiltrosHoje();
    }

    if (nome === 'looks') {
        renderLooks(obterTodosLooks().filter(lookPassaNosFiltros));
    }

    if (nome === 'ocasioes') {
        inicializarPaginaOcasioes();
    }

    console.log(`ðŸ“„ Mostrando pÃ¡gina: ${nome}`);
}

/* Mudar botÃ£o ativo da navbar */
function ativarNavBtn(index) {
    // Desativa todos
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Ativa o selecionado
    document.querySelectorAll('.nav-btn')[index].classList.add('active');
}

/* ==================== PÃGINA HOME: GALERIA DE PEÃ‡AS ====================
   Renderiza (desenha) a galeria com todas as peÃ§as */

function renderGaleria() {
    const galeria = document.getElementById('galeria');
    // innerHTML = "limpa" o conteÃºdo anterior
    galeria.innerHTML = '';

    // Object.values() = pega sÃ³ os valores (nÃ£o as chaves)
    // forEach() = repete para cada item
    Object.values(app.pecas).forEach(peca => {
        galeria.appendChild(criarCardPeca(peca));
    });

    console.log('ðŸ–¼ï¸ Galeria renderizada!');
}

/* ==================== FILTROS DA PÃGINA HOME ====================
   Preencher filtros dinamicamente com valores Ãºnicos do JSON */

function ordenarOpcoesDimensao(valores) {
    return [...new Set((valores || []).map(valor => String(valor ?? '').trim()).filter(valor => valor && normalizarTexto(valor) !== 'na'))]
        .sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true, sensitivity: 'base' }));
}

function obterValoresDimensaoPeca(campo, opcoes = {}) {
    const [nomeDimensao, propriedade] = DIMENSAO_POR_CAMPO_PECA[campo] || [];
    let valoresDimensao = nomeDimensao
        ? (app.dimensoes?.[nomeDimensao] || []).map(item => item?.[propriedade])
        : [];
    if (campo === 'subtipo' && opcoes.tipo) {
        valoresDimensao = (app.dimensoes?.tipos_subtipos_peca || [])
            .filter(item => normalizarTexto(item.tipo) === normalizarTexto(opcoes.tipo))
            .map(item => item.subtipo);
    }
    const pecasAtuais = campo === 'subtipo' && opcoes.tipo
        ? Object.values(app.pecas || {}).filter(peca => normalizarTexto(peca.tipo) === normalizarTexto(opcoes.tipo))
        : Object.values(app.pecas || {});
    const valoresAtuais = pecasAtuais.map(peca => peca?.[campo]);
    return ordenarOpcoesDimensao([...valoresDimensao, ...valoresAtuais, opcoes.valorAtual]);
}

function preencherFiltrosHome() {
    // Extrair valores Ãºnicos para cada campo
    const campos = CAMPOS_FILTROS_PECAS;
    
    const container = document.getElementById('filtros-home');
    container.querySelectorAll('.filtro-multiplo').forEach(filtro => filtro.remove());
    
    campos.forEach(campo => {
        const valores = obterValoresDimensaoPeca(campo);
        
        if (valores.length > 0) {
            criarFiltroMultiplo(container, campo, valores, app.filtrosHome[campo], novosValores => {
                filtrarHome(campo, novosValores);
                renderGaleriaFiltrada();
            });
        }
    });
    
    console.log('ðŸ“‹ Filtros da Home criados!');
}

/* Atualizar filtro da Home */
function filtrarHome(campo, valor) {
    app.filtrosHome[campo] = valor;
    salvarEstadoFiltros();
}

/* Resetar todos os filtros da Home */
function resetarFiltrosHome() {
    for (let campo in app.filtrosHome) {
        app.filtrosHome[campo] = [];
    }
    app.filtroDataUsoPecas = { inicio: '', fim: '' };
    
    // Resetar visualmente as caixas de selecao
    document.querySelectorAll('#filtros-home input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
        checkbox.closest('.filtro-chip')?.classList.remove('selecionado');
    });

    document.querySelectorAll('#filtros-home .filtro-multiplo').forEach(filtro => {
        filtro.classList.remove('tem-selecao', 'aberto');
        filtro.querySelector('.filtro-multiplo-contador').textContent = '';
    });
    const dataInicio = document.getElementById('pecas-data-uso-inicio');
    const dataFim = document.getElementById('pecas-data-uso-fim');
    if (dataInicio) dataInicio.value = '';
    if (dataFim) dataFim.value = '';
    atualizarResumoDataUsoPecas();
    
    renderGaleriaFiltrada();
    salvarEstadoFiltros();
}

/* Renderizar galeria com filtros aplicados */
function renderGaleriaFiltrada() {
    const galeria = document.getElementById('galeria');
    galeria.innerHTML = '';
    const pecasFiltradas = obterPecasFiltradasHome();
    renderTabelaPecasFiltradas(pecasFiltradas);

    if (pecasFiltradas.length === 0) {
        galeria.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #999;">Nenhuma peÃ§a encontrada para esses filtros.</p>';
        return;
    }

    pecasFiltradas.forEach(peca => {
        galeria.appendChild(criarCardPeca(peca));
    });

    console.log('Galeria filtrada renderizada!');
}

function obterPecasFiltradasHome() {
    const termo = normalizarTexto(document.getElementById('filtro-pesquisa')?.value || app.filtroPesquisaPecas || '');
    const idsPecasPorDataUso = obterIdsPecasPorDataUsoSelecionada();

    return Object.values(app.pecas).filter(peca => {
        // Verificar cada filtro
        let passouNosFiltros = true;
        
        for (let campo in app.filtrosHome) {
            const filtro = app.filtrosHome[campo];
            // Se o filtro nÃ£o estÃ¡ vazio, tem que bater
            if (Array.isArray(filtro) && filtro.length > 0) {
                if (!filtro.includes(peca[campo])) {
                    passouNosFiltros = false;
                    break;
                }
            }
        }

        if (!passouNosFiltros) return false;
        if (idsPecasPorDataUso && !idsPecasPorDataUso.has(peca.id)) return false;
        if (!termo) return true;

        return normalizarTexto(obterTextoBuscaPeca(peca)).includes(termo);
    });

    if (pecasFiltradas.length === 0) {
        galeria.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #999;">Nenhuma peÃ§a encontrada para esses filtros.</p>';
        return;
    }

    pecasFiltradas.forEach(peca => {
        galeria.appendChild(criarCardPeca(peca));
    });

    console.log('ðŸ–¼ï¸ Galeria filtrada renderizada!');
}

function renderTabelaPecasFiltradas(pecas) {
    const container = document.getElementById('tabela-pecas-filtradas');
    const contagem = document.getElementById('tabela-pecas-contagem');
    if (!container) return;

    if (contagem) {
        contagem.textContent = `${pecas.length} peÃ§a${pecas.length === 1 ? '' : 's'}`;
    }

    if (pecas.length === 0) {
        container.innerHTML = '<p class="texto-ajuda">Nenhuma peÃ§a encontrada para esses filtros.</p>';
        return;
    }

    const ultimoUso = obterUltimoUsoPorPeca();
    const pecasOrdenadas = ordenarPecasTabela(pecas, ultimoUso);
    container.innerHTML = `
        <div class="tabela-pecas-cabecalho">
            ${COLUNAS_TABELA_PECAS.map(criarCelulaCabecalhoTabelaPecas).join('')}
        </div>
        ${pecasOrdenadas.map(peca => criarLinhaTabelaPecaFiltrada(peca, ultimoUso)).join('')}
    `;
}

const COLUNAS_TABELA_PECAS = [
    { campo: 'foto', titulo: 'Foto', classe: 'tabela-pecas-foto' },
    { campo: 'id', titulo: 'ID', classe: 'tabela-pecas-id' },
    { campo: 'ultimoUso', titulo: 'Ultimo uso' },
    { campo: 'tipo', titulo: 'Tipo' },
    { campo: 'funcao', titulo: 'FunÃ§Ã£o' },
    { campo: 'subtipo', titulo: 'Subtipo' },
    { campo: 'nivel_aquecimento', titulo: 'nivel_aquecimento' },
    { campo: 'utilizacao', titulo: 'UtilizaÃ§Ã£o' },
    { campo: 'formalidade', titulo: 'Formalidade' },
    { campo: 'tendencia', titulo: 'TendÃªncia' },
    { campo: 'local', titulo: 'Local' },
    { campo: 'alocacao', titulo: 'AlocaÃ§Ã£o' },
    { campo: 'situacao', titulo: 'SituaÃ§Ã£o' },
    { campo: 'conservacao', titulo: 'ConservaÃ§Ã£o' },
    { campo: 'reposicao', titulo: 'Repor' },
    { campo: 'infoFotos', titulo: 'Info e fotos' },
    { campo: 'combinacao', titulo: 'CombinaÃ§Ã£o' },
    { campo: 'dataRevisao', titulo: 'Data revisÃ£o' },
    { campo: 'dataAtualizacao', titulo: 'Data atualizaÃ§Ã£o' },
];

function criarCelulaCabecalhoTabelaPecas(coluna) {
    const ordenacao = app.ordenacaoTabelaPecas || {};
    const ativo = ordenacao.campo === coluna.campo;
    const direcao = ativo ? ordenacao.direcao : '';
    const classe = [
        'tabela-pecas-ordenar',
        coluna.classe || '',
        ativo ? 'ativo' : '',
    ].filter(Boolean).join(' ');
    const indicador = ativo ? (direcao === 'desc' ? 'â†“' : 'â†‘') : '';

    return `
        <button type="button" class="${classe}" onclick="ordenarTabelaPecas('${coluna.campo}')">
            <span>${escapeHtml(coluna.titulo)}</span>
            <small aria-hidden="true">${indicador}</small>
        </button>
    `;
}

function ordenarTabelaPecas(campo) {
    const atual = app.ordenacaoTabelaPecas || {};
    const direcao = atual.campo === campo && atual.direcao === 'asc' ? 'desc' : 'asc';
    app.ordenacaoTabelaPecas = { campo, direcao };
    renderGaleriaFiltrada();
}

function ordenarPecasTabela(pecas, ultimoUso) {
    const { campo = 'id', direcao = 'asc' } = app.ordenacaoTabelaPecas || {};
    const multiplicador = direcao === 'desc' ? -1 : 1;

    return [...pecas].sort((a, b) => {
        const valorA = obterValorOrdenacaoTabelaPeca(a, campo, ultimoUso);
        const valorB = obterValorOrdenacaoTabelaPeca(b, campo, ultimoUso);
        const vazioA = !valorVisivel(valorA);
        const vazioB = !valorVisivel(valorB);

        if (vazioA && vazioB) return String(a.id).localeCompare(String(b.id), 'pt-BR', { numeric: true });
        if (vazioA) return 1;
        if (vazioB) return -1;

        return compararValoresTabelaPecas(valorA, valorB) * multiplicador
            || String(a.id).localeCompare(String(b.id), 'pt-BR', { numeric: true });
    });
}

function compararValoresTabelaPecas(valorA, valorB) {
    const dataA = normalizarDataHistorico(valorA);
    const dataB = normalizarDataHistorico(valorB);
    if (dataA && dataB) return dataA.localeCompare(dataB);

    const numeroA = Number(String(valorA).replace(',', '.'));
    const numeroB = Number(String(valorB).replace(',', '.'));
    if (Number.isFinite(numeroA) && Number.isFinite(numeroB)) return numeroA - numeroB;

    return String(valorA).localeCompare(String(valorB), 'pt-BR', { numeric: true, sensitivity: 'base' });
}

function obterValorOrdenacaoTabelaPeca(peca, campo, ultimoUso) {
    if (campo === 'foto' || campo === 'id') return peca.id;
    if (campo === 'ultimoUso') return ultimoUso[peca.id] || '';
    if (campo === 'reposicao') return peca.reposicao || obterDetalhePeca(peca, 'Repor') || '';
    if (campo === 'infoFotos') return obterInfoFotosPeca(peca);
    if (campo === 'combinacao') return obterCombinacoesPeca(peca);
    if (campo === 'dataRevisao') return obterDataRevisaoPeca(peca) || '';
    if (campo === 'dataAtualizacao') return obterDataAtualizacaoTabelaPeca(peca) || '';
    return peca[campo] || '';
}

function obterInfoFotosPeca(peca) {
    return peca.info_fotos
        || peca.infoFotos
        || peca.info_foto
        || peca.fotos_info
        || obterCampoPorNomes(peca, ['Info e fotos', 'Info/fotos', 'Info fotos', 'Fotos'])
        || obterCampoPorNomes(Object.fromEntries((peca?.detalhes || []).map(item => [item.campo, item.valor])), ['Info e fotos', 'Info/fotos', 'Info fotos', 'Fotos'])
        || '';
}

function obterCombinacoesPeca(peca) {
    const combinacoes = peca.combinacoes
        || peca.combinacao
        || obterCampoPorNomes(peca, ['CombinaÃ§Ã£o', 'Combinacao', 'CombinaÃ§Ãµes', 'Combinacoes'])
        || obterCampoPorNomes(Object.fromEntries((peca?.detalhes || []).map(item => [item.campo, item.valor])), ['CombinaÃ§Ã£o', 'Combinacao', 'CombinaÃ§Ãµes', 'Combinacoes'])
        || '';

    return valorVisivel(combinacoes) ? combinacoes : '';
}

function criarLinhaTabelaPecaFiltrada(peca, ultimoUso) {
    const dataUltimoUso = ultimoUso[peca.id];
    const ultimoUsoTexto = dataUltimoUso ? formatarDataBR(formatarDataInput(dataUltimoUso)) : '-';
    const dataRevisao = obterDataRevisaoPeca(peca);
    const dataAtualizacao = obterDataAtualizacaoTabelaPeca(peca);
    const infoFotos = obterInfoFotosPeca(peca);
    const combinacoes = obterCombinacoesPeca(peca);

    return `
        <button type="button" class="tabela-pecas-linha" onclick="mostrarDetalhesPeca('${peca.id}')">
            <span class="tabela-pecas-foto">
                <img src="${escapeHtml(getCaminhoFoto(peca.id))}" alt="${escapeHtml(peca.id)}" onerror="${onErrorImagem()}">
            </span>
            <span class="tabela-pecas-id"><strong>${escapeHtml(peca.id)}</strong></span>
            <span>${escapeHtml(ultimoUsoTexto)}</span>
            <span>${escapeHtml(valorTabelaPeca(peca.tipo))}</span>
            <span>${escapeHtml(valorTabelaPeca(peca.funcao))}</span>
            <span>${escapeHtml(valorTabelaPeca(peca.subtipo))}</span>
            <span>${escapeHtml(valorTabelaPeca(peca.nivel_aquecimento))}</span>
            <span>${escapeHtml(valorTabelaPeca(peca.utilizacao))}</span>
            <span>${escapeHtml(valorTabelaPeca(peca.formalidade))}</span>
            <span>${escapeHtml(valorTabelaPeca(peca.tendencia))}</span>
            <span>${escapeHtml(valorTabelaPeca(peca.local))}</span>
            <span>${escapeHtml(valorTabelaPeca(peca.alocacao))}</span>
            <span>${escapeHtml(valorTabelaPeca(peca.situacao))}</span>
            <span>${escapeHtml(valorTabelaPeca(peca.conservacao))}</span>
            <span>${escapeHtml(valorTabelaPeca(peca.reposicao || obterDetalhePeca(peca, 'Repor')))}</span>
            <span class="tabela-pecas-info">${escapeHtml(valorTabelaPeca(infoFotos))}</span>
            <span>${escapeHtml(valorTabelaPeca(combinacoes))}</span>
            <span>${escapeHtml(dataRevisao ? formatarDataBR(dataRevisao) : '-')}</span>
            <span>${escapeHtml(dataAtualizacao ? formatarDataHoraFicha(dataAtualizacao) : '-')}</span>
        </button>
    `;
}

function valorTabelaPeca(valor) {
    return valorVisivel(valor) ? String(valor) : '-';
}

/* Filtrar peÃ§as por texto na barra de pesquisa */
function filtrarPecas() {
    const termoOriginal = document.getElementById('filtro-pesquisa')?.value || '';
    app.filtroPesquisaPecas = termoOriginal;
    salvarEstadoFiltros();
    renderGaleriaFiltrada();
}

function consultarPecasPorDataUso() {
    const inicio = document.getElementById('pecas-data-uso-inicio')?.value || '';
    const fim = document.getElementById('pecas-data-uso-fim')?.value || inicio;

    if (!inicio) {
        alert('Informe a data inicial para consultar os usos.');
        return;
    }
    if (fim && fim < inicio) {
        alert('A data final nao pode ser anterior a data inicial.');
        return;
    }

    app.filtroDataUsoPecas = { inicio, fim };
    const campoFim = document.getElementById('pecas-data-uso-fim');
    if (campoFim) campoFim.value = fim;
    atualizarResumoDataUsoPecas();
    salvarEstadoFiltros();
    renderGaleriaFiltrada();
}

function obterIdsPecasPorDataUsoSelecionada() {
    const { inicio, fim } = app.filtroDataUsoPecas || {};
    if (!inicio) return null;

    const ids = new Set();
    obterRegistrosHistoricoEntre(inicio, fim || inicio).forEach(registro => {
        (registro.pecas || []).forEach(id => {
            if (app.pecas[id]) ids.add(id);
        });
    });
    return ids;
}

function atualizarResumoDataUsoPecas() {
    const resumo = document.getElementById('resumo-data-uso-pecas');
    if (!resumo) return;

    const { inicio, fim } = app.filtroDataUsoPecas || {};
    if (!inicio) {
        resumo.textContent = 'Nenhum periodo selecionado.';
        return;
    }

    const ids = obterIdsPecasPorDataUsoSelecionada();
    const periodo = fim && fim !== inicio
        ? `${formatarDataBR(inicio)} ate ${formatarDataBR(fim)}`
        : formatarDataBR(inicio);
    resumo.textContent = `${ids.size} peÃ§a${ids.size === 1 ? '' : 's'} usada${ids.size === 1 ? '' : 's'} em ${periodo}.`;
}

function reconstruirFiltrosHome() {
    preencherFiltrosHome();
    renderGaleriaFiltrada();
    filtrarPecas();
}

/* ==================== MODAL: DETALHES DA PEÃ‡A ====================
   Mostra informaÃ§Ãµes completas de uma peÃ§a */

function abrirDetalhsPeca(id) {
    const peca = app.pecas[id];
    if (!peca) return;
    const dataAtualizacao = obterDataAtualizacaoPeca(peca);
    const modalPeca = document.getElementById('modal-peca');
    const modalAbertoPorBaixo = [...document.querySelectorAll('.modal')]
        .some(modal => modal !== modalPeca && modal.style.display !== 'none');

    // Guardar referÃªncia para usar depois
    app.pecaEmDetalhes = id;

    // Preencher modal com dados
    document.querySelector('#modal-peca .ficha-peca').innerHTML = `
        <div class="campos-modal-peca">
            <div class="campo-ficha">
                <span class="label">ID:</span>
                <span>${escapeHtml(peca.id)}</span>
            </div>
            ${dataAtualizacao ? `
                <div class="campo-ficha">
                    <span class="label">Ãšltima atualizaÃ§Ã£o:</span>
                    <span>${escapeHtml(formatarDataHoraFicha(dataAtualizacao))}</span>
                </div>
            ` : ''}
            ${criarCamposPecaHtml(peca)}
        </div>
        ${criarAcessoriosHtml(peca)}
        ${criarRestricoesHtml(peca)}
    `;
    document.getElementById('titulo-modal').textContent = `${peca.tipo || peca.id}`;
    atualizarFotoModalPeca(getCaminhoFoto(peca.id));
    document.getElementById('editar-peca-modal').style.display = '';
    document.getElementById('looks-existentes-peca-modal').style.display = '';
    document.getElementById('cancelar-edicao-peca-modal').style.display = 'none';
    document.getElementById('salvar-peca-modal').style.display = 'none';
    document.getElementById('registrar-peca-modal').style.display = '';

    // Mostrar modal
    modalPeca.classList.toggle('modal-em-pilha', modalAbertoPorBaixo);
    modalPeca.style.display = 'flex';
}

function mostrarDetalhesPeca(id) {
    abrirDetalhsPeca(id);
}

function abrirLooksExistentesPeca() {
    const pecaId = app.pecaEmDetalhes;
    const peca = app.pecas[pecaId];
    if (!peca) return;

    app.filtrosLooksPeca = { htt: 'todos', peca1: '', peca2: '', peca3: '' };
    app.looksPecaSelecionados = [];

    const modal = document.getElementById('modal-looks-peca');
    modal.dataset.pecaId = pecaId;
    document.getElementById('looks-peca-foto').src = getCaminhoFoto(pecaId);
    document.getElementById('looks-peca-id').textContent = pecaId;
    renderLooksExistentesPeca();
    modal.classList.add('modal-em-pilha');
    modal.style.display = 'flex';
}

function fecharModalLooksPeca() {
    const modal = document.getElementById('modal-looks-peca');
    app.looksPecaSelecionados = [];
    modal.classList.remove('modal-em-pilha');
    modal.style.display = 'none';
}

function fecharModalLookDetalhes() {
    const modal = document.getElementById('modal-look-detalhes');
    const temModalPorBaixo = [...document.querySelectorAll('.modal')]
        .some(item => item !== modal && item.style.display !== 'none');

    if (!temModalPorBaixo) {
        fecharModal();
        return;
    }

    modal.classList.remove('modal-em-pilha');
    modal.style.display = 'none';
}

function obterLooksDaPeca(pecaId) {
    return obterTodosLooks()
        .filter(look => look?.id && Array.isArray(look.pecas))
        .filter(look => look.pecas.includes(pecaId))
        .sort((a, b) => String(a.id).localeCompare(String(b.id), 'pt-BR', { numeric: true }));
}

function renderLooksExistentesPeca() {
    const modal = document.getElementById('modal-looks-peca');
    const pecaId = modal?.dataset.pecaId || app.pecaEmDetalhes;
    const todosLooks = obterLooksDaPeca(pecaId);
    const looksFiltrados = filtrarLooksExistentesPeca(todosLooks);
    app.looksPecaSelecionados = obterIdsLooksPecaSelecionadosValidos(todosLooks);

    document.getElementById('looks-peca-resumo').textContent = `${looksFiltrados.length} de ${todosLooks.length} look${todosLooks.length === 1 ? '' : 's'} encontrado${todosLooks.length === 1 ? '' : 's'}.`;
    document.getElementById('looks-peca-filtros').innerHTML = criarFiltrosLooksPeca(todosLooks);
    document.getElementById('looks-peca-acoes-lote').innerHTML = criarAcoesLoteLooksPeca(looksFiltrados);
    document.getElementById('looks-peca-lista').innerHTML = criarGruposLooksPeca(looksFiltrados);
}

function obterIdsLooksPecaSelecionadosValidos(looks) {
    const idsValidos = new Set((looks || []).map(look => look.id));
    return [...new Set(app.looksPecaSelecionados || [])].filter(id => idsValidos.has(id));
}

function criarAcoesLoteLooksPeca(looksFiltrados) {
    const totalSelecionados = (app.looksPecaSelecionados || []).length;
    const idsFiltrados = (looksFiltrados || []).map(look => look.id);
    const totalFiltrados = idsFiltrados.length;
    const todosFiltradosSelecionados = totalFiltrados > 0 && idsFiltrados.every(id => app.looksPecaSelecionados.includes(id));

    return `
        <div class="looks-peca-lote-info">
            <strong>${totalSelecionados} selecionado${totalSelecionados === 1 ? '' : 's'}</strong>
            <span>${totalFiltrados} look${totalFiltrados === 1 ? '' : 's'} na lista atual</span>
        </div>
        <div class="looks-peca-lote-botoes">
            <button type="button" class="btn-secundario" onclick="selecionarLooksPecaFiltrados()" ${totalFiltrados ? '' : 'disabled'}>
                ${todosFiltradosSelecionados ? 'Desmarcar lista' : 'Selecionar lista'}
            </button>
            <button type="button" class="btn-secundario" onclick="limparSelecaoLooksPeca()" ${totalSelecionados ? '' : 'disabled'}>Limpar</button>
            <button type="button" class="btn-principal" onclick="abrirEdicaoLoteLooksPeca()" ${totalSelecionados ? '' : 'disabled'}>Editar selecionados</button>
        </div>
    `;
}

function alternarSelecaoLookPeca(lookId) {
    const selecionados = new Set(app.looksPecaSelecionados || []);
    if (selecionados.has(lookId)) {
        selecionados.delete(lookId);
    } else {
        selecionados.add(lookId);
    }
    app.looksPecaSelecionados = [...selecionados];
    renderLooksExistentesPeca();
}

function selecionarLooksPecaFiltrados() {
    const modal = document.getElementById('modal-looks-peca');
    const pecaId = modal?.dataset.pecaId || app.pecaEmDetalhes;
    const looksFiltrados = filtrarLooksExistentesPeca(obterLooksDaPeca(pecaId));
    const idsFiltrados = looksFiltrados.map(look => look.id);
    const selecionados = new Set(app.looksPecaSelecionados || []);
    const todosSelecionados = idsFiltrados.length > 0 && idsFiltrados.every(id => selecionados.has(id));

    idsFiltrados.forEach(id => {
        if (todosSelecionados) {
            selecionados.delete(id);
        } else {
            selecionados.add(id);
        }
    });

    app.looksPecaSelecionados = [...selecionados];
    renderLooksExistentesPeca();
}

function limparSelecaoLooksPeca() {
    app.looksPecaSelecionados = [];
    renderLooksExistentesPeca();
}

function filtrarLooksExistentesPeca(looks) {
    const filtros = app.filtrosLooksPeca || {};
    return looks.filter(look => {
        if (filtros.htt !== 'todos' && String(lookEhHTT(look)) !== filtros.htt) return false;
        if (filtros.peca1 && look.pecas?.[0] !== filtros.peca1) return false;
        if (filtros.peca2 && look.pecas?.[1] !== filtros.peca2) return false;
        if (filtros.peca3 && look.pecas?.[2] !== filtros.peca3) return false;
        return true;
    });
}

function criarFiltrosLooksPeca(looks) {
    const filtros = app.filtrosLooksPeca || {};
    return `
        <label class="looks-peca-filtro-htt">
            <span>HTT</span>
            <select onchange="alterarFiltroLooksPeca('htt', this.value)">
                <option value="todos" ${filtros.htt === 'todos' ? 'selected' : ''}>Todos</option>
                <option value="true" ${filtros.htt === 'true' ? 'selected' : ''}>HTT</option>
                <option value="false" ${filtros.htt === 'false' ? 'selected' : ''}>NÃ£o HTT</option>
            </select>
        </label>
        ${[0, 1, 2].map(indice => criarFiltroPecaLookExistente(looks, indice)).join('')}
    `;
}

function criarFiltroPecaLookExistente(looks, indice) {
    const campo = `peca${indice + 1}`;
    const selecionado = app.filtrosLooksPeca?.[campo] || '';
    const opcoes = obterOpcoesPecaPorPosicaoLooks(looks, indice);
    const rotulo = `PeÃ§a ${indice + 1}`;
    const textoSelecionado = selecionado || 'Todas';

    return `
        <details class="looks-peca-filtro">
            <summary>
                <span>${rotulo}</span>
                <strong>${escapeHtml(textoSelecionado)}</strong>
            </summary>
            <div class="looks-peca-opcoes">
                <button type="button" class="${selecionado ? '' : 'ativo'}" onclick="alterarFiltroLooksPeca('${campo}', '')">
                    <span class="looks-peca-opcao-vazia">Todas</span>
                </button>
                ${opcoes.map(id => criarOpcaoFiltroPecaLook(campo, id, selecionado)).join('')}
            </div>
        </details>
    `;
}

function obterOpcoesPecaPorPosicaoLooks(looks, indice) {
    const ids = new Set();
    looks.forEach(look => {
        const id = look.pecas?.[indice];
        if (id && app.pecas[id]) ids.add(id);
    });
    return [...ids].sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true }));
}

function criarOpcaoFiltroPecaLook(campo, id, selecionado) {
    const peca = app.pecas[id] || {};
    return `
        <button type="button" class="${selecionado === id ? 'ativo' : ''}" onclick="alterarFiltroLooksPeca('${campo}', '${id}')">
            <img src="${escapeHtml(getCaminhoFoto(id))}" alt="${escapeHtml(id)}" onerror="${onErrorImagem()}">
            <span>
                <strong>${escapeHtml(id)}</strong>
                <small>${escapeHtml([peca.tipo, peca.subtipo].filter(valorVisivel).join(' - ') || 'PeÃ§a')}</small>
            </span>
        </button>
    `;
}

function alterarFiltroLooksPeca(campo, valor) {
    app.filtrosLooksPeca = {
        ...(app.filtrosLooksPeca || {}),
        [campo]: valor,
    };
    renderLooksExistentesPeca();
}

function criarGruposLooksPeca(looks) {
    if (!looks.length) return '<p class="texto-ajuda">Nenhum look encontrado com esses filtros.</p>';

    const grupos = looks.reduce((mapa, look) => {
        const situacao = obterSituacaoLook(look) || 'Sem situaÃ§Ã£o';
        mapa[situacao] = mapa[situacao] || [];
        mapa[situacao].push(look);
        return mapa;
    }, {});

    return Object.entries(grupos)
        .sort(([a], [b]) => a.localeCompare(b, 'pt-BR', { numeric: true, sensitivity: 'base' }))
        .map(([situacao, itens]) => `
            <section class="looks-peca-grupo">
                <div class="looks-peca-grupo-topo">
                    <h3>${escapeHtml(situacao)}</h3>
                    <span>${itens.length}</span>
                </div>
                <div class="looks-peca-grid">
                    ${itens.map(criarCardLookExistentePeca).join('')}
                </div>
            </section>
        `)
        .join('');
}

function obterSituacaoLook(look) {
    return look?.situacao || look?.basicos?.['situaÃ§Ã£o'] || look?.basicos?.['situaÃƒÂ§ÃƒÂ£o'] || '';
}

function criarCardLookExistentePeca(look) {
    const pecasTexto = (look.pecas || []).join(' / ');
    const selecionado = (app.looksPecaSelecionados || []).includes(look.id);
    return `
        <div class="looks-peca-card ${selecionado ? 'selecionado' : ''}">
            <label class="looks-peca-check">
                <input type="checkbox" ${selecionado ? 'checked' : ''} onchange="alternarSelecaoLookPeca('${escapeHtml(look.id)}')">
                <span>Selecionar</span>
            </label>
            <img src="${escapeHtml(getCaminhoFotoLook(look.id))}" alt="${escapeHtml(look.id)}" onerror="${onErrorImagem()}">
            <strong>${escapeHtml(look.id)}</strong>
            <small>${escapeHtml(pecasTexto)}</small>
            ${lookEhHTT(look) ? '<span>HTT</span>' : ''}
            <button type="button" class="btn-secundario looks-peca-ficha" onclick="mostrarDetalhesLook('${escapeHtml(look.id)}')">Ficha</button>
        </div>
    `;
}

function abrirEdicaoLoteLooksPeca() {
    const idsSelecionados = obterIdsLooksSelecionadosParaEdicaoLote();
    if (!idsSelecionados.length) {
        alert('Selecione pelo menos um look para editar.');
        return;
    }

    const modal = document.getElementById('modal-edicao-lote-looks');
    const resumo = document.getElementById('edicao-lote-looks-resumo');
    const form = document.getElementById('form-edicao-lote-looks');
    if (!modal || !form) return;

    resumo.textContent = `${idsSelecionados.length} look${idsSelecionados.length === 1 ? '' : 's'} selecionado${idsSelecionados.length === 1 ? '' : 's'}: ${idsSelecionados.join(', ')}`;
    form.innerHTML = criarFormularioEdicaoLoteLooks();

    setTimeout(() => {
        renderControleVisualMultiploEdicaoLook('edit-lote-look-ocasioes', 'Pesquisar ocasiao');
        renderControleVisualMultiploEdicaoLook('edit-lote-look-sugestoes', 'Pesquisar peca');
    }, 0);

    modal.classList.add('modal-em-pilha');
    modal.style.display = 'flex';
}

function fecharModalEdicaoLoteLooks() {
    const modal = document.getElementById('modal-edicao-lote-looks');
    if (!modal) return;
    modal.classList.remove('modal-em-pilha');
    modal.style.display = 'none';
}

function obterIdsLooksSelecionadosParaEdicaoLote() {
    return [...new Set(app.looksPecaSelecionados || [])]
        .filter(id => Boolean(obterLookPorId(id)));
}

function criarFormularioEdicaoLoteLooks() {
    const opcoesSituacao = criarOptionsSituacaoLook('');
    const opcoesHtt = criarOptionsHttLook('false');
    const opcoesOcasioes = criarOptionsOcasioesLook([]);
    const opcoesSugestoes = criarOptionsSugestoesLook([]);

    return `
        <div class="form-edicao-look form-edicao-lote-looks">
            ${criarCampoAplicarEdicaoLote('situacao', `
                <label class="campo-edicao-look">
                    <span>SituaÃƒÂ§ÃƒÂ£o</span>
                    <select id="edit-lote-look-situacao">${opcoesSituacao}</select>
                </label>
            `)}
            ${criarCampoAplicarEdicaoLote('htt', `
                <label class="campo-edicao-look">
                    <span>HTT</span>
                    <select id="edit-lote-look-htt">${opcoesHtt}</select>
                </label>
            `)}
            ${criarCampoAplicarEdicaoLote('ocasioes', `
                <label class="campo-edicao-look campo-edicao-look-largo">
                    <span>OcasiÃƒÂµes</span>
                    <select id="edit-lote-look-ocasioes" multiple size="8">${opcoesOcasioes}</select>
                </label>
            `)}
            ${criarCampoAplicarEdicaoLote('sugestoes', `
                <label class="campo-edicao-look campo-edicao-look-largo">
                    <span>AcessÃƒÂ³rios e calÃƒÂ§ados sugeridos</span>
                    <select id="edit-lote-look-sugestoes" multiple size="10">${opcoesSugestoes}</select>
                </label>
            `)}
        </div>
    `;
}

function criarCampoAplicarEdicaoLote(campo, conteudo) {
    return `
        <div class="campo-edicao-lote" data-campo-lote="${campo}">
            <label class="campo-edicao-lote-aplicar">
                <input type="checkbox" data-aplicar-lote="${campo}">
                <span>Aplicar este campo</span>
            </label>
            ${conteudo}
        </div>
    `;
}

function campoLoteDeveAplicar(campo) {
    return Boolean(document.querySelector(`[data-aplicar-lote="${campo}"]`)?.checked);
}

function salvarEdicaoLoteLooks() {
    const idsSelecionados = obterIdsLooksSelecionadosParaEdicaoLote();
    if (!idsSelecionados.length) {
        alert('Selecione pelo menos um look para editar.');
        return;
    }

    const aplicarSituacao = campoLoteDeveAplicar('situacao');
    const aplicarHtt = campoLoteDeveAplicar('htt');
    const aplicarOcasioes = campoLoteDeveAplicar('ocasioes');
    const aplicarSugestoes = campoLoteDeveAplicar('sugestoes');

    if (!aplicarSituacao && !aplicarHtt && !aplicarOcasioes && !aplicarSugestoes) {
        alert('Marque pelo menos um campo para aplicar aos looks selecionados.');
        return;
    }

    const situacao = document.getElementById('edit-lote-look-situacao')?.value.trim() || '';
    const htt = document.getElementById('edit-lote-look-htt')?.value.trim() || '';
    const ocasioes = parseOcasioesEdicaoLook(obterValoresSelectMultiplo('edit-lote-look-ocasioes'));
    const sugestoes = obterSugestoesSelectMultiplo('edit-lote-look-sugestoes');
    const editadoEm = new Date().toISOString();

    idsSelecionados.forEach(lookId => {
        const lookOriginal = obterLookPorId(lookId);
        if (!lookOriginal) return;

        const basicos = { ...(lookOriginal.basicos || {}) };
        if (aplicarSituacao) basicos['situaÃƒÂ§ÃƒÂ£o'] = situacao;
        if (aplicarSituacao) basicos.situacao = situacao;
        if (aplicarHtt) basicos.HTT = htt;

        const lookEditado = {
            ...lookOriginal,
            id: lookId,
            ...(aplicarSituacao ? { situacao } : {}),
            ...(aplicarHtt ? { HTT: htt, htt } : {}),
            ...(aplicarOcasioes ? {
                ocasioes,
                ocasiao: ocasioes.map(item => item.descricao).join(', '),
            } : {}),
            ...(aplicarSugestoes ? { pecas_sugeridas: sugestoes } : {}),
            basicos: {
                ...basicos,
                ID: lookId,
            },
            editadoLocalmente: true,
            editadoEm,
            substituiLookBase: Boolean(app.looks[lookId] || lookOriginal.substituiLookBase) || undefined,
            id_original: undefined,
        };

        app.looksFavoritos[lookId] = lookEditado;
    });

    salvarDados();
    preencherSelectLooks();
    preencherFiltrosOcasiao();
    renderLooks(obterTodosLooks().filter(lookPassaNosFiltros));
    renderLooksExistentesPeca();
    fecharModalEdicaoLoteLooks();
    alert(`${idsSelecionados.length} look${idsSelecionados.length === 1 ? '' : 's'} atualizado${idsSelecionados.length === 1 ? '' : 's'} com sucesso.`);
}

function obterValoresSelectMultiplo(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return [];
    return [...select.selectedOptions].map(option => option.value);
}

function obterSugestoesSelectMultiplo(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return [];

    return [...select.selectedOptions].map(option => ({
        id: String(option.value || '').toUpperCase(),
        grupo: option.dataset.grupo || app.pecas[option.value]?.tipo || '',
    })).filter(item => item.id);
}

function fecharModal() {
    // Esconde todos os modais
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('modal-em-pilha');
        modal.style.display = 'none';
    });
}

/* ==================== PÃGINA USAR HOJE ====================
   Registra quais peÃ§as foram usadas hoje */

function atualizarDataHoje() {
    const hoje = new Date();
    document.getElementById('data-hoje').textContent = 'Escolha a data do uso e selecione as peÃ§as utilizadas.';

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

/* Renderizar galeria de peÃ§as com filtros aplicados na aba "Usar Hoje" */
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
        const valores = obterValoresDimensaoPeca(campo);

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
    salvarEstadoFiltros();
}

function resetarFiltrosHoje() {
    for (let campo in app.filtrosHoje) {
        app.filtrosHoje[campo] = [];
    }

    GRUPOS_REGISTRO_PECAS.forEach(grupo => {
        app.filtrosHojeGrupos[grupo.id] = { tipo: [], subtipo: [] };
    });

    preencherFiltrosHoje();
    salvarEstadoFiltros();
}

function gerarProximoIdPeca() {
    const numeros = Object.keys(app.pecas)
        .map(id => String(id).match(/^ID(\d+)$/i))
        .filter(Boolean)
        .map(match => Number(match[1]));
    const proximo = (numeros.length ? Math.max(...numeros) : 0) + 1;
    return `ID${String(proximo).padStart(4, '0')}`;
}

function abrirNovaPeca() {
    app.pecaEmDetalhes = null;
    mostrarFormularioPeca(null);
}

function abrirEdicaoPeca() {
    if (!app.pecaEmDetalhes) return;
    mostrarFormularioPeca(app.pecaEmDetalhes);
}

function cancelarEdicaoPeca() {
    if (app.pecaEmDetalhes) abrirDetalhsPeca(app.pecaEmDetalhes);
    else fecharModal();
}

function formatarDetalhesParaEdicao(detalhes) {
    const camposGerenciados = new Set(['formalidade', 'tendencia', 'alocacao', 'situacao', 'conservacao', 'repor', 'reposicao']);
    return (detalhes || [])
        .filter(item => !camposGerenciados.has(normalizarTexto(item?.campo)))
        .filter(item => valorVisivel(item?.campo) || valorVisivel(item?.valor))
        .map(item => `${item.campo || ''}: ${item.valor || ''}`)
        .join('\n');
}

function formatarIdsRelacionados(itens, campo) {
    return (itens || []).map(item => item?.[campo] || '').filter(Boolean).join(', ');
}

function obterOpcoesCampoPeca(campo, valorAtual = '') {
    const tipoAtual = document.querySelector('[data-campo-peca="tipo"]')?.value || app.pecas?.[app.pecaEmDetalhes]?.tipo || '';
    return obterValoresDimensaoPeca(campo, { valorAtual, tipo: campo === 'subtipo' ? tipoAtual : '' });
}

function criarCampoListaPeca(campo, label, valorAtual, obrigatorio = false) {
    const opcoes = obterOpcoesCampoPeca(campo, valorAtual);
    if (!opcoes.length) {
        return `<input type="text" data-campo-peca="${campo}" value="${escapeHtml(valorAtual || '')}" ${obrigatorio ? 'required' : ''}>`;
    }

    return `
        <select data-campo-peca="${campo}" ${obrigatorio ? 'required' : ''}>
            <option value="">Selecione...</option>
            ${opcoes.map(valor => `
                <option value="${escapeHtml(valor)}" ${String(valor) === String(valorAtual || '') ? 'selected' : ''}>${escapeHtml(valor)}</option>
            `).join('')}
        </select>
    `;
}

function preencherSelectDimensao(select, valores, valorAtual = '') {
    if (!select) return;
    select.innerHTML = '<option value="">Selecione...</option>' + ordenarOpcoesDimensao([...valores, valorAtual])
        .map(valor => `<option value="${escapeHtml(valor)}" ${normalizarTexto(valor) === normalizarTexto(valorAtual) ? 'selected' : ''}>${escapeHtml(valor)}</option>`)
        .join('');
}

function configurarDependenciasFormularioPeca() {
    const tipo = document.querySelector('[data-campo-peca="tipo"]');
    const subtipo = document.querySelector('[data-campo-peca="subtipo"]');
    const corDetalhe = document.querySelector('[data-campo-peca="cor_detalhe"]');
    const tom = document.querySelector('[data-campo-peca="tom"]');

    tipo?.addEventListener('change', () => {
        const valores = obterValoresDimensaoPeca('subtipo', { tipo: tipo.value });
        const atual = valores.some(valor => normalizarTexto(valor) === normalizarTexto(subtipo?.value)) ? subtipo.value : '';
        preencherSelectDimensao(subtipo, valores, atual);
    });

    corDetalhe?.addEventListener('change', () => {
        const cor = (app.dimensoes?.cores_detalhe || []).find(item =>
            normalizarTexto(item.cor_detalhe) === normalizarTexto(corDetalhe.value)
        )?.cor;
        const valores = (app.dimensoes?.cores_tons || [])
            .filter(item => normalizarTexto(item.cor) === normalizarTexto(cor))
            .map(item => item.tom);
        const atual = valores.some(valor => normalizarTexto(valor) === normalizarTexto(tom?.value)) ? tom.value : '';
        preencherSelectDimensao(tom, valores, atual);
    });
}

function mostrarFormularioPeca(id) {
    const peca = id ? app.pecas[id] : {
        id: gerarProximoIdPeca(), tipo: '', funcao: '', subtipo: '', padronagem: '',
        cor_detalhe: '', tom: '', nivel_aquecimento: '', utilizacao: '', local: '', situacao: 'ok',
        formalidade: '', tendencia: '', alocacao: '', conservacao: '', reposicao: '',
        detalhes: [], acessorios: [], combinacoes_nao_permitidas: [],
    };
    if (!peca) return;

    const nova = !id;
    const campos = [
        ['tipo', 'Tipo'], ['funcao', 'FunÃ§Ã£o'], ['subtipo', 'Subtipo'],
        ['padronagem', 'Padronagem'], ['cor_detalhe', 'Cor / detalhe'], ['tom', 'Tom'],
        ['nivel_aquecimento', 'NÃ­vel de aquecimento'], ['formalidade', 'Formalidade'],
        ['tendencia', 'TendÃªncia'], ['utilizacao', 'UtilizaÃ§Ã£o'], ['local', 'Local'],
        ['alocacao', 'AlocaÃ§Ã£o'], ['situacao', 'SituaÃ§Ã£o'],
        ['conservacao', 'ConservaÃ§Ã£o'], ['reposicao', 'ReposiÃ§Ã£o'],
    ];

    document.getElementById('titulo-modal').textContent = nova ? 'Adicionar nova peÃ§a' : `Editar ${peca.id}`;
    atualizarFotoModalPeca(getCaminhoFoto(peca.id));
    document.querySelector('#modal-peca .ficha-peca').innerHTML = `
        <form id="form-peca" class="form-edicao-peca" onsubmit="event.preventDefault(); salvarPeca();">
            <label class="campo-edicao-peca">
                <span>ID *</span>
                <input id="edit-peca-id" type="text" value="${escapeHtml(peca.id)}" ${nova ? '' : 'disabled'} required>
            </label>
            ${campos.map(([campo, label]) => `
                <label class="campo-edicao-peca">
                    <span>${label}${campo === 'tipo' ? ' *' : ''}</span>
                    ${criarCampoListaPeca(campo, label, peca[campo] || '', campo === 'tipo')}
                </label>
            `).join('')}
            <label class="campo-edicao-peca campo-edicao-peca-largo">
                <span>URL da foto</span>
                <input id="edit-peca-foto" type="text" value="${escapeHtml(peca.foto || '')}" placeholder="https://...">
            </label>
            <label class="campo-edicao-peca campo-edicao-peca-largo">
                <span>Enviar nova foto</span>
                <input id="edit-peca-foto-arquivo" type="file" accept="image/*">
            </label>
            <label class="campo-edicao-peca campo-edicao-peca-largo">
                <span>InformaÃ§Ãµes complementares</span>
                <textarea id="edit-peca-detalhes" rows="8" placeholder="Uma informaÃ§Ã£o por linha. Ex.: Marca: Renner">${escapeHtml(formatarDetalhesParaEdicao(peca.detalhes))}</textarea>
            </label>
            <label class="campo-edicao-peca campo-edicao-peca-largo">
                <span>IDs de acessÃ³rios relacionados</span>
                <input id="edit-peca-acessorios" type="text" value="${escapeHtml(formatarIdsRelacionados(peca.acessorios, 'id'))}" placeholder="ID0002, ID0045">
            </label>
            <label class="campo-edicao-peca campo-edicao-peca-largo">
                <span>IDs de peÃ§as que nÃ£o combinam</span>
                <input id="edit-peca-restricoes" type="text" value="${escapeHtml(formatarIdsRelacionados(peca.combinacoes_nao_permitidas, 'codigo'))}" placeholder="ID0010, ID0032">
            </label>
            <button type="submit" class="submit-oculto" aria-hidden="true" tabindex="-1"></button>
        </form>
    `;

    document.getElementById('editar-peca-modal').style.display = 'none';
    document.getElementById('looks-existentes-peca-modal').style.display = 'none';
    configurarDependenciasFormularioPeca();
    document.getElementById('cancelar-edicao-peca-modal').style.display = '';
    document.getElementById('salvar-peca-modal').style.display = '';
    document.getElementById('registrar-peca-modal').style.display = 'none';
    document.getElementById('modal-peca').style.display = 'flex';
}

function parseDetalhesPeca(valor) {
    return String(valor || '').split(/\r?\n/).map(linha => linha.trim()).filter(Boolean).map(linha => {
        const separador = linha.indexOf(':');
        return separador < 0
            ? { campo: linha, valor: '' }
            : { campo: linha.slice(0, separador).trim(), valor: linha.slice(separador + 1).trim() };
    }).filter(item => item.campo || item.valor);
}

function lerFotoPeca() {
    const arquivo = document.getElementById('edit-peca-foto-arquivo')?.files?.[0];
    if (!arquivo) return Promise.resolve('');
    return new Promise((resolve, reject) => {
        const leitor = new FileReader();
        leitor.onload = () => resolve(String(leitor.result || ''));
        leitor.onerror = () => reject(new Error('NÃ£o foi possÃ­vel ler a foto selecionada.'));
        leitor.readAsDataURL(arquivo);
    });
}

async function salvarPeca() {
    const formulario = document.getElementById('form-peca');
    if (!formulario?.reportValidity()) return;

    const editandoId = app.pecaEmDetalhes;
    const id = String(document.getElementById('edit-peca-id')?.value || '').trim().toUpperCase();
    if (!id) return;
    if (!editandoId && app.pecas[id]) {
        alert(`JÃ¡ existe uma peÃ§a com o ID ${id}.`);
        return;
    }

    try {
        const original = editandoId ? app.pecas[editandoId] : {};
        const campos = {};
        formulario.querySelectorAll('[data-campo-peca]').forEach(input => {
            campos[input.dataset.campoPeca] = input.value.trim();
        });
        campos.cor = (app.dimensoes?.cores_detalhe || []).find(item =>
            normalizarTexto(item.cor_detalhe) === normalizarTexto(campos.cor_detalhe)
        )?.cor || original.cor || '';
        const fotoArquivo = await lerFotoPeca();
        const fotoUrl = document.getElementById('edit-peca-foto')?.value.trim() || '';
        const acessorios = parseListaValores(document.getElementById('edit-peca-acessorios')?.value)
            .map(itemId => ({ id: itemId.toUpperCase(), grupo: app.pecas[itemId.toUpperCase()]?.tipo || '' }));
        const combinacoes = parseListaValores(document.getElementById('edit-peca-restricoes')?.value)
            .map(codigo => ({ codigo: codigo.toUpperCase(), descricao: app.pecas[codigo.toUpperCase()]?.tipo || codigo.toUpperCase() }));

        const peca = {
            ...original,
            ...campos,
            id,
            foto: fotoArquivo || fotoUrl || original.foto || '',
            detalhes: parseDetalhesPeca(document.getElementById('edit-peca-detalhes')?.value),
            acessorios,
            combinacoes_nao_permitidas: combinacoes,
            editadaLocalmente: true,
            editadaEm: new Date().toISOString(),
        };

        app.pecas[id] = peca;
        app.pecasPersonalizadas[id] = peca;
        const totalLooksAtualizados = recalcularLooksAfetadosPorPeca([editandoId, id], { idAntigo: editandoId, idNovo: id });
        app.pecaEmDetalhes = id;
        salvarDados();
        reconstruirFiltrosHome();
        preencherFiltrosHoje();
        preencherSelectLooks();
        preencherFiltrosOcasiao();
        if (document.getElementById('looks')?.style.display !== 'none') {
            renderLooks(obterTodosLooks().filter(lookPassaNosFiltros));
        }
        if (document.getElementById('historico')?.style.display !== 'none') {
            inicializarHistorico();
        }
        abrirDetalhsPeca(id);
        if (totalLooksAtualizados > 0) {
            console.log(`ðŸ”„ ${totalLooksAtualizados} look(s) recalculado(s) apÃ³s atualizar a peÃ§a ${id}.`);
        }
    } catch (erro) {
        console.error('Erro ao salvar peÃ§a:', erro);
        alert(erro.message || 'NÃ£o foi possÃ­vel salvar a peÃ§a.');
    }
}

function renderGaleriaUsarHojeAntiga() {
    const galeria = document.getElementById('galeria-usar-hoje');
    galeria.innerHTML = '';

    Object.entries(app.pecas).forEach(([id, peca]) => {
        // Verificar se atende ao filtro de tipo
        let passouNosFiltros = true;
        
        // Verificar se atende ao filtro de funÃ§Ã£o
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
                     onerror="if(this.src.endsWith('.jpg')){this.src='fotos/'+this.dataset.id+'.png';this.onerror=function(){this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23ddd%22 width=%22100%22 height=%22100%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22>âŒ</text></svg>'}}else{this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23ddd%22 width=%22100%22 height=%22100%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22>âŒ</text></svg>'}">
                <p>${peca.id}</p>
            `;

            // Clique adiciona Ã  seleÃ§Ã£o
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

    console.log('ðŸ–¼ï¸ Galeria "Usar Hoje" renderizada!');
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
    salvarEstadoFiltros();
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
        const grade = card.closest('.grupo-registro-grade');
        const posicaoRolagem = grade ? { top: grade.scrollTop, left: grade.scrollLeft } : null;
        if (!app.pecasSelecionadasHoje.includes(id)) {
            app.pecasSelecionadasHoje.push(id);
            card.classList.add('selecionado');
        }
        atualizarPecasSelecionadasHoje();
        if (grade && posicaoRolagem) {
            grade.scrollTop = posicaoRolagem.top;
            grade.scrollLeft = posicaoRolagem.left;
            requestAnimationFrame(() => {
                if (!grade.isConnected) return;
                grade.scrollTop = posicaoRolagem.top;
                grade.scrollLeft = posicaoRolagem.left;
            });
        }
    };

    return card;
}

function renderGaleriaUsarHoje() {
    const galeria = document.getElementById('galeria-usar-hoje');
    const chaveFiltroAberto = galeria
        .querySelector('.grupo-registro-filtros .filtro-multiplo.aberto')
        ?.dataset.filtroRegistro || '';
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
            const filtroTipo = criarFiltroMultiplo(filtros, 'tipo', valoresTipo, filtrosGrupo.tipo, valores => {
                filtrarGrupoHoje(grupo.id, 'tipo', valores);
            });
            filtroTipo.dataset.filtroRegistro = `${grupo.id}:tipo`;
            filtroTipo.classList.toggle('aberto', chaveFiltroAberto === filtroTipo.dataset.filtroRegistro);
        }

        if (valoresSubtipo.length > 0) {
            const filtroSubtipo = criarFiltroMultiplo(filtros, 'subtipo', valoresSubtipo, filtrosGrupo.subtipo, valores => {
                filtrarGrupoHoje(grupo.id, 'subtipo', valores);
            });
            filtroSubtipo.dataset.filtroRegistro = `${grupo.id}:subtipo`;
            filtroSubtipo.classList.toggle('aberto', chaveFiltroAberto === filtroSubtipo.dataset.filtroRegistro);
        }

        if (filtros.children.length > 0) secao.appendChild(filtros);

        const grade = document.createElement('div');
        grade.className = 'grupo-registro-grade';

        if (pecasFiltradas.length === 0) {
            grade.innerHTML = '<p class="grupo-registro-vazio">Nenhuma peÃ§a neste grupo com os filtros atuais.</p>';
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
        container.innerHTML = '<p class="lista-vazia">Nenhuma peÃ§a selecionada ainda</p>';
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
                 onerror="if(this.src.endsWith('.jpg')){this.src='fotos/'+this.dataset.id+'.png';this.onerror=function(){this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23ddd%22 width=%22100%22 height=%22100%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22>âŒ</text></svg>'}}else{this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23ddd%22 width=%22100%22 height=%22100%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22>âŒ</text></svg>'}">
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
        : 'Looks compatÃ­veis com as peÃ§as selecionadas';

    const looksSelecionados = (app.looksSelecionadosHoje || [])
        .map(id => obterLookPorId(id))
        .filter(Boolean);
    const resumoSelecionado = looksSelecionados.length > 0 ? `
        <div class="look-selecionado-registro">
            <div>
                <strong>Looks que serÃ£o registrados</strong>
                <span>${looksSelecionados.map(look => `${look.id} (${formatarDataLook(obterDataCriacaoLook(look))})`).join(' Â· ')}</span>
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
                    <small>${criarResumoCompatibilidadeLookHoje(look)} Â· ${formatarDataLook(obterDataCriacaoLook(look))}</small>
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

    return `${look.pecasCompativeis.length} peÃ§as`;
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

/* Selecionar peÃ§a do modal e adicionar ao uso hoje */
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
        alert('Selecione pelo menos uma peÃ§a!');
        return;
    }

    const dataRegistro = document.getElementById('data-registro-uso').value;
    if (!dataRegistro) {
        alert('Selecione a data do registro!');
        return;
    }

    // Verificar se usar um look favorito

    // Criar registro no histÃ³rico
    const registro = {
        data: new Date(`${dataRegistro}T12:00:00`).toISOString(),
        pecas: [...app.pecasSelecionadasHoje],
        lookId: app.looksSelecionadosHoje[0] || null,
        lookIds: [...app.looksSelecionadosHoje],
        alteradoEm: new Date().toISOString(),
    };

    app.historico.push(registro);
    salvarDados();

    // Feedback visual
    alert('âœ… Uso registrado com sucesso!');

    // Limpar
    app.pecasSelecionadasHoje = [];
    app.looksSelecionadosHoje = [];
    atualizarPecasSelecionadasHoje();
}

/* Mostrar/esconder select de look quando checkbox Ã© marcado */
/* ==================== PÃGINA LOOKS ====================
   Gerencia looks (combinaÃ§Ãµes de peÃ§as) e ocasiÃµes */

function preencherSelectLooks() {
    const select = document.getElementById('select-look-definido');
    if (!select) return;

    select.innerHTML = '<option value="">Selecione o look...</option>';

    // Adicionar looks do XML (BD looks)
    Object.entries(app.looks).forEach(([id, look]) => {
        const option = document.createElement('option');
        option.value = id;
        // Mostrar peÃ§as do look
        const pecasNomes = look.pecas
            .map(pid => app.pecas[pid]?.tipo || pid)
            .join(' + ');
        option.textContent = `${id}: ${pecasNomes}`;
        select.appendChild(option);
    });

    // Adicionar looks favoritos criados pelo usuÃ¡rio
    Object.entries(app.looksFavoritos).forEach(([id, look]) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = `â­ ${look.nome} (${look.pecas.length} peÃ§as)`;
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
        <span>IDs das peÃ§as</span>
        <input type="search" id="filtro-look-pecas" placeholder="ID0430, ID0446, ID0101" autocomplete="off" value="${escapeHtml((app.filtrosLooks.pecas || []).join(', '))}">
        <small>Use 1, 2 ou 3 IDs</small>
    `;

    const input = wrapper.querySelector('input');
    input.addEventListener('input', evento => {
        const ids = normalizarFiltroPecasLooks(evento.target.value);
        app.filtrosLooks.pecas = ids;
        salvarEstadoFiltros();
        window.clearTimeout(app.timeoutFiltroPecasLooks);
        app.timeoutFiltroPecasLooks = window.setTimeout(() => {
            renderLooks(obterTodosLooks().filter(lookPassaNosFiltros));
        }, 180);
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

    app.filtrosLooks.ocasiao = ocasiao === 'todas' ? [] : [ocasiao];
    salvarEstadoFiltros();

    if (ocasiao === 'todas') {
        // Mostrar todos os looks
        renderLooks(Object.values(app.looks).concat(Object.values(app.looksFavoritos)));
    } else {
        // Filtrar por ocasiÃ£o
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

        const idBaseEditado = look.id_original && idsReservados.has(look.id_original) && (look.editadoLocalmente || look.substituiLookBase)
            ? look.id_original
            : '';
        let idFinal = idBaseEditado || look.id || idOriginal;
        let substituiLookBase = Boolean(look.substituiLookBase || idBaseEditado || (idsReservados.has(idFinal) && look.editadoLocalmente));

        if (substituiLookBase && !look.substituiLookBase) {
            alterou = true;
        }

        if (idBaseEditado && idOriginal !== idBaseEditado) {
            substituirLookIdHistorico(idOriginal, idBaseEditado);
            alterou = true;
        }

        if (idsReservados.has(idFinal) && !substituiLookBase) {
            idFinal = gerarProximoIdLookDisponivel(obterIndicadorLook(look, idFinal), idsReservados);
            substituirLookIdHistorico(idOriginal, idFinal);
            alterou = true;
        }

        idsReservados.add(idFinal);
        favoritosAtualizados[idFinal] = {
            ...look,
            id: idFinal,
            nome: look.nome === idOriginal || look.nome === look.id ? idFinal : (look.nome || idFinal),
            id_original: substituiLookBase ? undefined : (look.id_original || (idFinal !== idOriginal ? idOriginal : undefined)),
            substituiLookBase: substituiLookBase || undefined,
            basicos: {
                ...(look.basicos || {}),
                ID: idFinal,
            },
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
    const valoresDimensao = {
        situacao: (app.dimensoes?.situacoes_look || []).map(item => item.valor),
        utilizacao: (app.dimensoes?.utilizacoes_look || []).map(item => item.valor),
        categoria: (app.dimensoes?.categorias_look || []).map(item => item.categoria),
        indicador: (app.dimensoes?.categorias_look || []).map(item => item.indicador),
        clima: Object.values(app.climas || {}).map(formatarClimaFiltro),
        local: (app.dimensoes?.locais || []).map(item => item.valor),
        ocasiao: Object.values(app.mapaOcasioes || {}).map(item => item.descricao),
    };
    const valores = new Map();
    const adicionarValor = valor => {
        if (valor === null || valor === undefined || String(valor).trim() === '') return;
        const texto = String(valor).trim();
        const chave = normalizarTexto(texto);
        if (!valores.has(chave)) valores.set(chave, texto);
    };

    (valoresDimensao[campo] || []).forEach(adicionarValor);
    obterTodosLooks().forEach(look => {
        obterValoresCampoLook(look, campo).forEach(adicionarValor);
    });

    return [...valores.values()].sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true, sensitivity: 'base' }));
}

function obterValoresCampoLook(look, campo) {
    const basicos = look.basicos || {};

    switch (campo) {
        case 'situacao':
            return [look.situacao || basicos['situaÃ§Ã£o'] || basicos.situacao];
        case 'utilizacao':
            return [look.utilizacao_calc || look.utilizacao];
        case 'indicador':
            return [look.indicador || basicos.Indicador];
        case 'categoria':
            return [look.categoria || obterCategoriaIndicadorLook(look.indicador || basicos.Indicador)];
        case 'clima':
            return [formatarClimaFiltroLook(look), obterCodigoClimaLook(look)];
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

function obterCategoriaIndicadorLook(indicador) {
    return (app.dimensoes?.categorias_look || []).find(item =>
        normalizarTexto(item.indicador) === normalizarTexto(indicador)
    )?.categoria || '';
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

function obterCodigoClimaLook(look) {
    const info = look?.clima_info || {};
    return String(look?.clima_calc || look?.clima || info.codigo || '').trim();
}

function formatarClimaFiltro(clima) {
    if (!clima) return '';
    const codigo = String(clima.codigo || '').trim();
    const descricao = String(clima.descricao || codigo).trim();
    if (!codigo && !descricao) return '';
    return codigo && descricao && normalizarTexto(codigo) !== normalizarTexto(descricao)
        ? `${codigo} - ${descricao}`
        : (codigo || descricao);
}

function formatarClimaFiltroLook(look) {
    const codigo = obterCodigoClimaLook(look);
    const info = look?.clima_info || app.climas?.[codigo] || {};
    return formatarClimaFiltro({
        codigo,
        descricao: info.descricao || codigo,
    });
}

function filtrarLooks(campo, valores) {
    app.filtrosLooks[campo] = valores;
    salvarEstadoFiltros();
    renderLooks(obterTodosLooks().filter(lookPassaNosFiltros));
}

function normalizarValorFiltroLook(campo, valor) {
    if (campo === 'clima') {
        const codigo = String(valor || '').split('-')[0].trim();
        return normalizarTexto(codigo || valor);
    }
    return normalizarTexto(valor);
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

    salvarEstadoFiltros();
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

        const valoresLook = obterValoresCampoLook(look, campo)
            .map(valor => normalizarValorFiltroLook(campo, valor))
            .filter(Boolean);
        const passou = selecionados.some(valorFiltro => valoresLook.includes(normalizarValorFiltroLook(campo, valorFiltro)));
        if (!passou) return false;
    }

    return true;
}

function filtrarLooksPorOcasiao(ocasiao) {
    app.filtrosLooks.ocasiao = ocasiao === 'todas' ? [] : [ocasiao];
    salvarEstadoFiltros();
    renderLooks(obterTodosLooks().filter(lookPassaNosFiltros));
}

function incrementarUsoLook(mapa, lookId) {
    const chave = normalizarTexto(lookId);
    if (!chave) return;
    mapa.set(chave, (mapa.get(chave) || 0) + 1);
}

function construirIndiceLooksPorPecas() {
    const looks = obterTodosLooks().filter(look => look?.id && Array.isArray(look.pecas) && look.pecas.length > 0);
    const looksPorPeca = new Map();
    const totalPecasPorLook = new Map();
    const idOriginalPorLook = new Map();

    looks.forEach(look => {
        const lookId = normalizarTexto(look.id);
        const pecas = [...new Set((look.pecas || []).map(id => normalizarTexto(id)).filter(Boolean))];
        if (!lookId || pecas.length === 0) return;

        totalPecasPorLook.set(lookId, pecas.length);
        idOriginalPorLook.set(lookId, look.id);
        pecas.forEach(pecaId => {
            if (!looksPorPeca.has(pecaId)) looksPorPeca.set(pecaId, []);
            looksPorPeca.get(pecaId).push(lookId);
        });
    });

    return { looksPorPeca, totalPecasPorLook, idOriginalPorLook };
}

function obterIndiceLooksPorPecasAtual() {
    if (!app.indiceLooksPorPecasAtual) {
        app.indiceLooksPorPecasAtual = construirIndiceLooksPorPecas();
    }
    return app.indiceLooksPorPecasAtual;
}

function inferirLookIdsPelasPecas(pecas) {
    const pecasRegistro = [...new Set((pecas || []).map(id => normalizarTexto(id)).filter(Boolean))];
    if (pecasRegistro.length === 0) return [];

    const { looksPorPeca, totalPecasPorLook, idOriginalPorLook } = obterIndiceLooksPorPecasAtual();
    const pecasSet = new Set(pecasRegistro);
    const candidatos = new Map();

    pecasSet.forEach(pecaId => {
        (looksPorPeca.get(pecaId) || []).forEach(lookId => {
            candidatos.set(lookId, (candidatos.get(lookId) || 0) + 1);
        });
    });

    return [...candidatos.entries()]
        .filter(([lookId, totalEncontrado]) => totalEncontrado >= (totalPecasPorLook.get(lookId) || Infinity))
        .map(([lookId]) => idOriginalPorLook.get(lookId) || lookId)
        .sort((a, b) => String(a).localeCompare(String(b), 'pt-BR', { numeric: true }));
}

function obterLookIdsRegistroOuInferidos(registro) {
    const explicitos = obterLookIdsRegistro(registro);
    const inferidos = inferirLookIdsPelasPecas(registro?.pecas || []);
    return [...new Set([...explicitos, ...inferidos])];
}

function obterLooksRegistroComOrigem(registro) {
    const explicitos = new Set(obterLookIdsRegistro(registro));
    const inferidos = new Set(inferirLookIdsPelasPecas(registro?.pecas || []));
    const ids = [...new Set([...explicitos, ...inferidos])];

    return ids.map(id => ({
        id,
        origem: explicitos.has(id) ? 'registrado' : 'inferido',
    }));
}

function calcularMapaUsosLooks() {
    const mapa = new Map();

    (app.historico || []).forEach(registro => {
        obterLookIdsRegistroOuInferidos(registro).forEach(id => incrementarUsoLook(mapa, id));
    });

    return mapa;
}

function obterMapaUsosLooksAtual() {
    if (!app.mapaUsosLooksAtual) {
        app.mapaUsosLooksAtual = calcularMapaUsosLooks();
    }
    return app.mapaUsosLooksAtual;
}

function contarUsosLook(lookId) {
    return obterMapaUsosLooksAtual().get(normalizarTexto(lookId)) || 0;
}

function formatarTotalUsosLook(total) {
    return `${total} ${total === 1 ? 'uso' : 'usos'}`;
}

function obterTamanhoLoteLooks() {
    return window.matchMedia('(max-width: 768px)').matches ? 24 : 60;
}

function renderLooks(looks) {
    const container = document.getElementById('lista-looks');
    container.innerHTML = '';
    app.indiceLooksPorPecasAtual = construirIndiceLooksPorPecas();
    app.mapaUsosLooksAtual = calcularMapaUsosLooks();
    app.looksEmExibicao = looks;
    app.limiteLooksExibidos = 0;

    if (looks.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">Nenhum look encontrado</p>';
        return;
    }

    adicionarLoteLooks();
}

function adicionarLoteLooks() {
    const container = document.getElementById('lista-looks');
    if (!container) return;
    container.querySelector('.looks-paginacao')?.remove();

    const inicio = app.limiteLooksExibidos;
    const fim = Math.min(inicio + obterTamanhoLoteLooks(), app.looksEmExibicao.length);
    const fragmento = document.createDocumentFragment();
    app.looksEmExibicao.slice(inicio, fim).forEach(look => {
        fragmento.appendChild(criarCardLook(look));
    });
    container.appendChild(fragmento);
    app.limiteLooksExibidos = fim;

    const paginacao = document.createElement('div');
    paginacao.className = 'looks-paginacao';
    paginacao.innerHTML = `<span>Mostrando ${fim} de ${app.looksEmExibicao.length} looks</span>`;
    if (fim < app.looksEmExibicao.length) {
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.className = 'btn-principal';
        botao.textContent = `Carregar mais ${Math.min(obterTamanhoLoteLooks(), app.looksEmExibicao.length - fim)}`;
        botao.addEventListener('click', adicionarLoteLooks);
        paginacao.appendChild(botao);
    }
    container.appendChild(paginacao);
}

function criarCardLook(look) {
    const card = document.createElement('div');
    card.className = 'look-card';

    const pecasTexto = (look.pecas || [])
        .map(id => escapeHtml(id))
        .join(' Â· ');
    const tags = (look.ocasioes || []).slice(0, 4).map(ocasiao => `<span>${ocasiao.descricao}</span>`).join('');
    const lookId = look.id || look.nome || '';
    const totalUsos = contarUsosLook(look.id);

    card.innerHTML = `
        <div class="look-card-foto-wrap">
            <img src="${getCaminhoFotoLook(look.id)}" alt="${escapeHtml(lookId)}" class="look-card-foto" loading="lazy" decoding="async"
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 120 120%22><rect fill=%22%23eee%22 width=%22120%22 height=%22120%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22>sem foto</text></svg>'">
            <span class="look-card-id-badge">${escapeHtml(lookId)}</span>
        </div>
        <div class="look-card-usos">${formatarTotalUsosLook(totalUsos)}</div>
        <div class="look-card-info">
            <h3>${escapeHtml(lookId)}</h3>
            <p>${pecasTexto}</p>
            <div class="tags-look">${tags}</div>
            <div class="look-card-acoes">
                <button class="btn-secundario" type="button" onclick="mostrarDetalhesLook('${look.id}')">Ficha</button>
                <button class="btn-secundario" type="button" onclick="abrirEdicaoLook('${look.id}')">Editar</button>
                <button class="btn-principal" type="button" onclick="usarLookHoje('${look.id}')">Usar</button>
            </div>
        </div>
    `;

    return card;
}

function abrirEdicaoLook(lookId) {
    mostrarDetalhesLook(lookId, true);
}

function mostrarDetalhesLook(lookId, editando = false) {
    const look = obterLookPorId(lookId);
    if (!look) return;

    const modal = document.getElementById('modal-look-detalhes');
    const modalAbertoPorBaixo = [...document.querySelectorAll('.modal')]
        .some(item => item !== modal && item.style.display !== 'none');
    modal.dataset.lookId = lookId;
    modal.dataset.editando = editando ? 'true' : 'false';

    document.getElementById('titulo-look-modal').textContent = look.nome || look.id;
    document.getElementById('foto-look-modal').src = getCaminhoFotoLook(look.id);
    document.getElementById('usar-look-modal').onclick = () => usarLookHoje(look.id);
    document.getElementById('editar-look-modal').onclick = () => mostrarDetalhesLook(lookId, true);
    document.getElementById('cancelar-edicao-look-modal').onclick = () => mostrarDetalhesLook(lookId, false);
    document.getElementById('salvar-look-modal').onclick = salvarEdicaoLook;
    document.getElementById('editar-look-modal').style.display = editando ? 'none' : '';
    document.getElementById('cancelar-edicao-look-modal').style.display = editando ? '' : 'none';
    document.getElementById('salvar-look-modal').style.display = editando ? '' : 'none';
    document.getElementById('usar-look-modal').style.display = editando ? 'none' : '';

    const tags = document.getElementById('tags-look-modal');
    tags.innerHTML = (look.ocasioes || []).length
        ? look.ocasioes.map(ocasiao => `<span title="${ocasiao.codigo}">${ocasiao.descricao}</span>`).join('')
        : '<span>Sem ocasiÃ£o definida</span>';

    const ficha = document.getElementById('ficha-look-modal');
    if (editando) {
        ficha.innerHTML = criarFormularioEdicaoLook(look);
    } else {
        renderFichaLookLeitura(look, ficha);
    }

    document.getElementById('pecas-look-modal').innerHTML = (look.pecas || [])
        .filter(id => app.pecas[id])
        .map(id => criarCardPecaHistorico(id))
        .join('') || '<p class="texto-ajuda">Nenhuma peÃ§a cadastrada.</p>';

    document.getElementById('sugestoes-look-modal').innerHTML = (look.pecas_sugeridas || [])
        .filter(item => app.pecas[item.id])
        .map(item => criarCardPecaLookSugerida(item))
        .join('') || '<p class="texto-ajuda">Nenhuma sugestÃ£o cadastrada.</p>';

    modal.classList.toggle('modal-em-pilha', modalAbertoPorBaixo);
    modal.style.display = 'flex';
}

function renderFichaLookLeitura(look, ficha) {
    const campos = look.basicos || {};
    const totalUsos = contarUsosLook(look.id);
    const camposClima = [
        ['Total de usos', formatarTotalUsosLook(totalUsos)],
        ['Ãšltima atualizaÃ§Ã£o', formatarDataHoraFicha(obterDataAtualizacaoLook(look))],
        ['Clima calculado', formatarClimaLook(look)],
        ['Aquecimento das peÃ§as', (look.aquecimentos || []).map(valor => valor || '-').join(' Â· ')],
        ['Local calculado', look.local_calc || ''],
        ['Local das peÃ§as', (look.locais_pecas || []).map(valor => valor || '-').join(' Â· ')],
        ['UtilizaÃ§Ã£o calculada', look.utilizacao_calc || ''],
        ['UtilizaÃ§Ã£o das peÃ§as', (look.utilizacoes_pecas || []).map(valor => valor || '-').join(' Â· ')],
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
}

function criarOptionsSituacaoLook(valorAtual) {
    const valores = [...new Set([
        ...(app.dimensoes?.situacoes_look || []).map(item => item.valor),
        ...obterTodosLooks().map(look => look.situacao || look.basicos?.['situaÃ§Ã£o'] || look.basicos?.['situaÃƒÂ§ÃƒÂ£o']).filter(valorVisivel),
        valorAtual,
    ].filter(valorVisivel))];
    const atualNormalizado = normalizarTexto(valorAtual);

    return valores
        .sort((a, b) => String(a).localeCompare(String(b), 'pt-BR'))
        .map(valor => `<option value="${escapeHtml(valor)}" ${normalizarTexto(valor) === atualNormalizado ? 'selected' : ''}>${escapeHtml(valor)}</option>`)
        .join('');
}

function criarOptionsIndicadorLook(valorAtual) {
    const atualNormalizado = normalizarTexto(valorAtual);
    const itens = [...(app.dimensoes?.categorias_look || [])];
    if (valorAtual && !itens.some(item => normalizarTexto(item.indicador) === atualNormalizado)) {
        itens.push({ indicador: valorAtual, categoria: 'Fora da aba Categorias' });
    }
    return itens.map(item => {
        const selecionado = normalizarTexto(item.indicador) === atualNormalizado ? 'selected' : '';
        return `<option value="${escapeHtml(item.indicador)}" ${selecionado}>${escapeHtml(item.indicador)} - ${escapeHtml(item.categoria)}</option>`;
    }).join('');
}

function criarOptionsHttLook(valorAtual) {
    const atualNormalizado = normalizarTexto(valorAtual || 'false');
    return ['false', 'true']
        .map(valor => `<option value="${valor}" ${normalizarTexto(valor) === atualNormalizado ? 'selected' : ''}>${valor}</option>`)
        .join('');
}

function criarOptionsOcasioesLook(ocasioesSelecionadas) {
    const selecionadas = new Set((ocasioesSelecionadas || []).flatMap(item => [
        normalizarTexto(item.codigo),
        normalizarTexto(item.descricao),
    ]).filter(Boolean));

    return Object.entries(app.mapaOcasioes || {})
        .map(([codigo, info]) => ({
            codigo,
            descricao: info.descricao || codigo,
            tipo: info.tipo || '',
        }))
        .sort((a, b) => String(a.codigo).localeCompare(String(b.codigo), 'pt-BR', { numeric: true }))
        .map(item => {
            const selecionada = selecionadas.has(normalizarTexto(item.codigo)) || selecionadas.has(normalizarTexto(item.descricao));
            const label = `${item.codigo} - ${item.descricao}${item.tipo ? ` (${item.tipo})` : ''}`;
            return `<option value="${escapeHtml(item.codigo)}" ${selecionada ? 'selected' : ''}>${escapeHtml(label)}</option>`;
        })
        .join('');
}

function obterOcasioesSelecionadasEdicaoLook() {
    const select = document.getElementById('edit-look-ocasioes');
    if (!select) return [];
    return [...select.selectedOptions].map(option => option.value);
}

function criarOptionsSugestoesLook(sugestoesSelecionadas) {
    const sugestoesMap = new Map((sugestoesSelecionadas || [])
        .filter(item => item?.id)
        .map(item => [String(item.id).toUpperCase(), item.grupo || '']));
    const tiposPermitidos = new Set(['calcado', 'cinto', 'bolsa']);

    return Object.values(app.pecas || {})
        .filter(peca => peca?.id)
        .filter(peca => tiposPermitidos.has(normalizarTexto(peca.tipo)))
        .filter(peca => normalizarTexto(peca.situacao) !== 'excluida')
        .sort((a, b) => String(a.id).localeCompare(String(b.id), 'pt-BR', { numeric: true }))
        .map(peca => {
            const id = String(peca.id).toUpperCase();
            const selecionada = sugestoesMap.has(id);
            const grupo = sugestoesMap.get(id) || peca.tipo || '';
            const label = `${id} - ${peca.tipo || ''}${peca.subtipo ? ` / ${peca.subtipo}` : ''}`;
            return `<option value="${escapeHtml(id)}" data-grupo="${escapeHtml(grupo)}" ${selecionada ? 'selected' : ''}>${escapeHtml(label)}</option>`;
        })
        .join('');
}

function obterSugestoesSelecionadasEdicaoLook() {
    const select = document.getElementById('edit-look-sugestoes');
    if (!select) return [];

    return [...select.selectedOptions].map(option => ({
        id: String(option.value || '').toUpperCase(),
        grupo: option.dataset.grupo || app.pecas[option.value]?.tipo || '',
    })).filter(item => item.id);
}

function configurarControlesVisuaisEdicaoLook() {
    renderControleVisualMultiploEdicaoLook('edit-look-ocasioes', 'Pesquisar ocasiao');
    renderControleVisualMultiploEdicaoLook('edit-look-sugestoes', 'Pesquisar peca');
}

function renderControleVisualMultiploEdicaoLook(selectId, placeholder) {
    const select = document.getElementById(selectId);
    if (!select) return;

    select.classList.add('select-nativo-oculto');

    let container = select.parentElement.querySelector(`.edicao-chip-select[data-select-id="${selectId}"]`);
    if (!container) {
        container = document.createElement('div');
        container.className = 'edicao-chip-select';
        container.dataset.selectId = selectId;
        select.insertAdjacentElement('afterend', container);
    }

    const buscaAnterior = container.querySelector('input')?.value || '';
    const termo = normalizarTexto(buscaAnterior);
    const opcoes = [...select.options];
    const selecionadas = opcoes.filter(option => option.selected).length;

    container.innerHTML = `
        <div class="edicao-chip-select-topo">
            <input type="search" value="${escapeHtml(buscaAnterior)}" placeholder="${escapeHtml(placeholder)}">
            <span>${selecionadas}</span>
        </div>
        <div class="edicao-chip-lista"></div>
    `;

    const inputBusca = container.querySelector('input');
    const lista = container.querySelector('.edicao-chip-lista');
    inputBusca.addEventListener('input', () => renderControleVisualMultiploEdicaoLook(selectId, placeholder));

    const opcoesFiltradas = opcoes.filter(option => {
        if (!termo) return true;
        return normalizarTexto(option.textContent).includes(termo) || normalizarTexto(option.value).includes(termo);
    });

    lista.innerHTML = opcoesFiltradas.length
        ? ''
        : '<p class="texto-ajuda">Nenhuma opcao encontrada.</p>';

    opcoesFiltradas.forEach(option => {
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.className = 'edicao-chip-opcao';
        botao.classList.toggle('ativo', option.selected);
        botao.textContent = option.textContent;
        botao.addEventListener('click', () => {
            option.selected = !option.selected;
            renderControleVisualMultiploEdicaoLook(selectId, placeholder);
        });
        lista.appendChild(botao);
    });
}

function campoBasicoEditavelLook(campo) {
    const camposGerenciados = new Set(['id', 'id1', 'id2', 'id3', 'situacao', 'indicador', 'htt', 'col_5']);
    return !camposGerenciados.has(normalizarTexto(campo));
}

function criarFormularioEdicaoLook(look) {
    const basicos = look.basicos || {};
    const sugestoes = (look.pecas_sugeridas || [])
        .map(item => `${item.id || ''}${item.grupo ? ` | ${item.grupo}` : ''}`)
        .join('\n');
    const situacaoAtual = look.situacao || basicos['situaÃƒÂ§ÃƒÂ£o'] || basicos['situaÃ§Ã£o'] || '';
    const httAtual = String(look.HTT || look.htt || basicos.HTT || '');
    const opcoesSituacao = criarOptionsSituacaoLook(situacaoAtual);
    const opcoesIndicador = criarOptionsIndicadorLook(obterIndicadorLook(look, look.id));
    const opcoesHtt = criarOptionsHttLook(httAtual);
    const opcoesOcasioes = criarOptionsOcasioesLook(look.ocasioes || []);
    const opcoesSugestoes = criarOptionsSugestoesLook(look.pecas_sugeridas || []);
    const camposBasicos = Object.entries(basicos)
        .filter(([campo]) => campoBasicoEditavelLook(campo))
        .sort(([a], [b]) => a.localeCompare(b, 'pt-BR', { numeric: true, sensitivity: 'base' }))
        .map(([campo, valor]) => `
            <label class="campo-edicao-look">
                <span>${escapeHtml(campo)}</span>
                <input type="text" data-basico="${escapeHtml(campo)}" value="${escapeHtml(valor)}">
            </label>
        `)
        .join('');

    setTimeout(() => {
        configurarRecalculoEdicaoLook();
        configurarControlesVisuaisEdicaoLook();
    }, 0);

    return `
        <div id="form-edicao-look" class="form-edicao-look">
            <label class="campo-edicao-look">
                <span>ID do look</span>
                <input type="text" id="edit-look-id" value="${escapeHtml(look.id || '')}" disabled>
            </label>
            <label class="campo-edicao-look">
                <span>Nome</span>
                <input type="text" id="edit-look-nome" value="${escapeHtml(look.nome || look.id || '')}">
            </label>
            <label class="campo-edicao-look">
                <span>Foto URL</span>
                <input type="text" id="edit-look-foto" value="${escapeHtml(look.foto || '')}">
            </label>
            <label class="campo-edicao-look campo-edicao-look-largo">
                <span>Nova foto</span>
                <input type="file" id="edit-look-foto-arquivo" accept="image/*">
            </label>
            <label class="campo-edicao-look">
                <span>SituaÃ§Ã£o</span>
                <select id="edit-look-situacao">${opcoesSituacao}</select>
            </label>
            <label class="campo-edicao-look">
                <span>Indicador</span>
                <select id="edit-look-indicador">${opcoesIndicador}</select>
            </label>
            <label class="campo-edicao-look">
                <span>HTT</span>
                <select id="edit-look-htt">${opcoesHtt}</select>
            </label>
            <label class="campo-edicao-look">
                <span>Clima calculado</span>
                <input type="text" id="edit-look-clima-calc" value="${escapeHtml(look.clima_calc || look.clima || '')}" disabled>
            </label>
            <label class="campo-edicao-look">
                <span>Local calculado</span>
                <input type="text" id="edit-look-local-calc" value="${escapeHtml(look.local_calc || look.local || '')}" disabled>
            </label>
            <label class="campo-edicao-look">
                <span>UtilizaÃ§Ã£o calculada</span>
                <input type="text" id="edit-look-utilizacao-calc" value="${escapeHtml(look.utilizacao_calc || look.utilizacao || '')}" disabled>
            </label>
            <label class="campo-edicao-look campo-edicao-look-largo">
                <span>PeÃ§as do look</span>
                <textarea id="edit-look-pecas" rows="2">${escapeHtml((look.pecas || []).join(', '))}</textarea>
            </label>
            <label class="campo-edicao-look campo-edicao-look-largo">
                <span>OcasiÃµes</span>
                <select id="edit-look-ocasioes" multiple size="8">${opcoesOcasioes}</select>
            </label>
            <label class="campo-edicao-look campo-edicao-look-largo">
                <span>Aquecimentos das peÃ§as</span>
                <textarea id="edit-look-aquecimentos" rows="2" disabled>${escapeHtml((look.aquecimentos || []).join(', '))}</textarea>
            </label>
            <label class="campo-edicao-look campo-edicao-look-largo">
                <span>Locais das peÃ§as</span>
                <textarea id="edit-look-locais-pecas" rows="2" disabled>${escapeHtml((look.locais_pecas || []).join(', '))}</textarea>
            </label>
            <label class="campo-edicao-look campo-edicao-look-largo">
                <span>UtilizaÃ§Ãµes das peÃ§as</span>
                <textarea id="edit-look-utilizacoes-pecas" rows="2" disabled>${escapeHtml((look.utilizacoes_pecas || []).join(', '))}</textarea>
            </label>
            <label class="campo-edicao-look campo-edicao-look-largo">
                <span>AcessÃ³rios e calÃ§ados sugeridos</span>
                <select id="edit-look-sugestoes" multiple size="10">${opcoesSugestoes}</select>
            </label>
            <div class="campo-edicao-look-grupo">
                <strong>Campos da ficha</strong>
                <div class="form-edicao-look">
                    ${camposBasicos || '<p class="texto-ajuda">Nenhum campo bÃ¡sico cadastrado.</p>'}
                </div>
            </div>
        </div>
    `;
}

function configurarRecalculoEdicaoLook() {
    const campoPecas = document.getElementById('edit-look-pecas');
    if (!campoPecas) return;

    const atualizar = () => {
        const calculados = calcularDadosLookPorPecas(parseListaIdsEdicaoLook(campoPecas.value));
        const clima = document.getElementById('edit-look-clima-calc');
        const local = document.getElementById('edit-look-local-calc');
        const utilizacao = document.getElementById('edit-look-utilizacao-calc');
        const aquecimentos = document.getElementById('edit-look-aquecimentos');
        const locais = document.getElementById('edit-look-locais-pecas');
        const utilizacoes = document.getElementById('edit-look-utilizacoes-pecas');
        if (clima) clima.value = calculados.clima_calc || '';
        if (local) local.value = calculados.local_calc || '';
        if (utilizacao) utilizacao.value = calculados.utilizacao_calc || '';
        if (aquecimentos) aquecimentos.value = calculados.aquecimentos.filter(Boolean).join(', ');
        if (locais) locais.value = calculados.locais_pecas.filter(Boolean).join(', ');
        if (utilizacoes) utilizacoes.value = calculados.utilizacoes_pecas.filter(Boolean).join(', ');
    };

    campoPecas.addEventListener('input', atualizar);
    atualizar();
}

function calcularDadosLookPorPecas(pecas) {
    const ids = (pecas || []).map(id => String(id || '').trim().toUpperCase()).filter(Boolean);
    const valoresPecas = ids.map(id => app.pecas[id] || null);
    const aquecimentos = valoresPecas.map(peca => valorVisivel(peca?.nivel_aquecimento) ? String(peca.nivel_aquecimento) : null);
    const locais = valoresPecas.map(peca => valorVisivel(peca?.local) ? String(peca.local) : null);
    const utilizacoes = valoresPecas.map(peca => valorVisivel(peca?.utilizacao) ? String(peca.utilizacao) : null);
    const climaCalc = aquecimentos
        .map(valor => Number(valor))
        .filter(valor => Number.isFinite(valor))
        .reduce((maior, valor) => Math.max(maior, valor), 0);
    const locaisValidos = locais.filter(Boolean);
    const utilizacoesValidas = utilizacoes.filter(Boolean);

    return {
        clima_calc: climaCalc ? String(climaCalc) : '',
        clima_info: climaCalc && app.climas?.[String(climaCalc)] ? { ...app.climas[String(climaCalc)] } : {},
        aquecimentos: preencherAteTres(aquecimentos),
        local_calc: calcularValorComposto(locaisValidos, 'misto', { virtualPrioritario: true }),
        locais_pecas: preencherAteTres(locais),
        utilizacao_calc: calcularValorComposto(utilizacoesValidas, 'mix'),
        utilizacoes_pecas: preencherAteTres(utilizacoes),
    };
}

function atualizarCalculadosLook(look, pecas, dataAtualizacao) {
    const calculados = calcularDadosLookPorPecas(pecas);
    const basicos = {
        ...(look.basicos || {}),
        ID: look.id,
        ID1: pecas[0] || '',
        ID2: pecas[1] || '',
        ID3: pecas[2] || '',
    };

    return {
        ...look,
        pecas,
        clima_calc: calculados.clima_calc,
        clima_info: calculados.clima_info,
        aquecimentos: calculados.aquecimentos,
        local_calc: calculados.local_calc,
        local: calculados.local_calc,
        locais_pecas: calculados.locais_pecas,
        utilizacao_calc: calculados.utilizacao_calc,
        utilizacao: calculados.utilizacao_calc,
        utilizacoes_pecas: calculados.utilizacoes_pecas,
        basicos,
        editadoLocalmente: true,
        editadoEm: dataAtualizacao,
        substituiLookBase: Boolean(app.looks[look.id] || look.substituiLookBase) || undefined,
        id_original: undefined,
    };
}

function recalcularLooksAfetadosPorPeca(pecaIds, opcoes = {}) {
    const idsAfetados = new Set((pecaIds || []).map(id => String(id || '').trim().toUpperCase()).filter(Boolean));
    if (idsAfetados.size === 0) return 0;

    const idAntigo = String(opcoes.idAntigo || '').trim().toUpperCase();
    const idNovo = String(opcoes.idNovo || '').trim().toUpperCase();
    const dataAtualizacao = opcoes.dataAtualizacao || new Date().toISOString();
    let total = 0;

    obterTodosLooks().forEach(look => {
        if (!look?.id || !Array.isArray(look.pecas)) return;

        let trocouId = false;
        const pecas = look.pecas.map(id => {
            const idNormalizado = String(id || '').trim().toUpperCase();
            if (idAntigo && idNovo && idAntigo !== idNovo && idNormalizado === idAntigo) {
                trocouId = true;
                return idNovo;
            }
            return idNormalizado;
        });

        const usaPecaAfetada = pecas.some(id => idsAfetados.has(id)) || (idAntigo && look.pecas.some(id => normalizarTexto(id) === normalizarTexto(idAntigo)));
        if (!usaPecaAfetada && !trocouId) return;

        const pecasUnicas = [...new Set(pecas.filter(Boolean))];
        const lookAtualizado = atualizarCalculadosLook(look, pecasUnicas, dataAtualizacao);
        app.looksFavoritos[look.id] = lookAtualizado;
        total += 1;
    });

    if (total > 0) {
        app.mapaUsosLooksAtual = null;
        app.indiceLooksPorPecasAtual = null;
    }

    return total;
}

function preencherAteTres(valores) {
    const resultado = [...(valores || [])];
    while (resultado.length < 3) resultado.push(null);
    return resultado.slice(0, 3);
}

function calcularValorComposto(valores, misto, opcoes = {}) {
    const validos = [...new Set((valores || []).filter(Boolean))];
    if (validos.length === 0) return '';
    if (opcoes.virtualPrioritario && validos.some(valor => normalizarTexto(valor) === 'virtual')) return 'virtual';
    return validos.length === 1 ? validos[0] : misto;
}

async function salvarEdicaoLook() {
    const modal = document.getElementById('modal-look-detalhes');
    const lookId = modal.dataset.lookId;
    const lookOriginal = obterLookPorId(lookId);
    if (!lookOriginal) return;

    const basicos = { ...(lookOriginal.basicos || {}) };
    document.querySelectorAll('#form-edicao-look [data-basico]').forEach(input => {
        basicos[input.dataset.basico] = input.value.trim();
    });

    const nome = document.getElementById('edit-look-nome')?.value.trim() || lookId;
    const situacao = document.getElementById('edit-look-situacao')?.value.trim() || '';
    const indicador = document.getElementById('edit-look-indicador')?.value.trim() || obterIndicadorLook(lookOriginal, lookId);
    const htt = document.getElementById('edit-look-htt')?.value.trim() || '';
    const fotoArquivo = await lerFotoEdicaoLook();
    const fotoUrl = document.getElementById('edit-look-foto')?.value.trim() || '';
    const pecas = parseListaIdsEdicaoLook(document.getElementById('edit-look-pecas')?.value || '')
        .map(id => id.toUpperCase());
    const ocasioes = parseOcasioesEdicaoLook(obterOcasioesSelecionadasEdicaoLook());
    const calculados = calcularDadosLookPorPecas(pecas);

    basicos.ID = lookId;
    basicos.ID1 = pecas[0] || '';
    basicos.ID2 = pecas[1] || '';
    basicos.ID3 = pecas[2] || '';
    basicos.Indicador = indicador;
    basicos['situaÃ§Ã£o'] = situacao;
    basicos.HTT = htt;

    const lookEditado = {
        ...lookOriginal,
        id: lookId,
        nome,
        foto: fotoArquivo || fotoUrl || lookOriginal.foto || getCaminhoFotoLook(lookId),
        situacao,
        indicador,
        categoria: obterCategoriaIndicadorLook(indicador),
        HTT: htt,
        htt,
        clima_calc: calculados.clima_calc,
        clima_info: calculados.clima_info,
        local_calc: calculados.local_calc,
        local: calculados.local_calc,
        utilizacao_calc: calculados.utilizacao_calc,
        utilizacao: calculados.utilizacao_calc,
        pecas,
        ocasioes,
        ocasiao: ocasioes.map(item => item.descricao).join(', '),
        aquecimentos: calculados.aquecimentos,
        locais_pecas: calculados.locais_pecas,
        utilizacoes_pecas: calculados.utilizacoes_pecas,
        pecas_sugeridas: obterSugestoesSelecionadasEdicaoLook(),
        basicos,
        editadoLocalmente: true,
        editadoEm: new Date().toISOString(),
        substituiLookBase: Boolean(app.looks[lookId] || lookOriginal.substituiLookBase) || undefined,
        id_original: undefined,
    };

    app.looksFavoritos[lookId] = lookEditado;
    salvarDados();
    preencherSelectLooks();
    preencherFiltrosOcasiao();
    renderLooks(obterTodosLooks().filter(lookPassaNosFiltros));
    mostrarDetalhesLook(lookId, false);
}

function parseListaValores(valor) {
    return String(valor || '')
        .split(/[\n,;]+/)
        .map(item => item.trim())
        .filter(Boolean);
}

function parseListaIdsEdicaoLook(valor) {
    return String(valor || '')
        .split(/[\s,;]+/)
        .map(item => item.trim())
        .filter(Boolean);
}

function parseOcasioesEdicaoLook(valor) {
    return parseListaValores(valor).map(item => {
        const encontrado = Object.entries(app.mapaOcasioes || {}).find(([codigo, info]) => {
            return normalizarTexto(codigo) === normalizarTexto(item)
                || normalizarTexto(info?.descricao) === normalizarTexto(item);
        });
        if (encontrado) {
            const [codigo, info] = encontrado;
            return { codigo, ...info };
        }
        return { codigo: normalizarTexto(item).toUpperCase() || item, descricao: item };
    });
}

function parseSugestoesEdicaoLook(valor) {
    return String(valor || '')
        .split(/\n+/)
        .map(linha => linha.trim())
        .filter(Boolean)
        .map(linha => {
            const [id, grupo = ''] = linha.split('|').map(parte => parte.trim());
            return id ? { id: id.toUpperCase(), grupo } : null;
        })
        .filter(Boolean);
}

function lerFotoEdicaoLook() {
    const arquivo = document.getElementById('edit-look-foto-arquivo')?.files?.[0];
    if (!arquivo) return Promise.resolve('');

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('NÃ£o consegui ler a foto do look.'));
        reader.readAsDataURL(arquivo);
    });
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

/* ==================== PÃGINA HISTÃ“RICO ====================
   Mostra estatÃ­sticas de uso */

/* ==================== PAGINA OCASIOES ==================== */

function inicializarPaginaOcasioes() {
    if (!document.getElementById('ocasioes')) return;

    preencherFiltrosPaginaOcasioes();
    renderPaginaOcasioes();
}

function obterOcasioesOrdenadas() {
    return Object.entries(app.mapaOcasioes || {})
        .map(([codigo, info]) => ({
            codigo,
            descricao: info.descricao || codigo,
            local: info.local || '',
            tipo: info.tipo || '',
            data_revisao: info.data_revisao || '',
        }))
        .sort((a, b) => String(a.codigo).localeCompare(String(b.codigo), 'pt-BR', { numeric: true }));
}

function obterOcasioesFiltradasPagina() {
    const tipos = app.filtrosOcasioes.tipo || [];
    return obterOcasioesOrdenadas().filter(ocasiao => tipos.length === 0 || tipos.includes(ocasiao.tipo));
}

function obterValoresSelectMultiplo(id) {
    const select = document.getElementById(id);
    if (!select) return [];
    const selecionados = [...select.selectedOptions].map(option => option.value);
    const valores = selecionados.filter(Boolean);
    return valores.length ? valores : [];
}

function marcarValoresSelectMultiplo(select, valores) {
    const selecionados = new Set(valores || []);
    [...select.options].forEach(option => {
        option.selected = option.value ? selecionados.has(option.value) : selecionados.size === 0;
    });
}

function renderControlesVisuaisOcasioes() {
    ['ocasioes-filtro-tipo', 'ocasioes-filtro-clima'].forEach(id => {
        const select = document.getElementById(id);
        if (select) renderDropdownMultiploOcasioes(select);
    });

    const selectOcasiao = document.getElementById('ocasioes-select');
    if (selectOcasiao) renderControleVisualOcasioes(selectOcasiao);
}

function renderDropdownMultiploOcasioes(select) {
    select.classList.add('select-nativo-oculto');
    select.parentElement.querySelector(`.ocasioes-chip-select[data-select-id="${select.id}"]`)?.remove();

    let container = select.parentElement.querySelector(`.ocasioes-dropdown-multiplo[data-select-id="${select.id}"]`);
    if (!container) {
        container = document.createElement('div');
        container.className = 'ocasioes-dropdown-multiplo';
        container.dataset.selectId = select.id;
        select.insertAdjacentElement('afterend', container);
    }

    const estavaAberto = container.classList.contains('aberto') || app.dropdownOcasioesAberto === select.id;
    const selecionados = obterValoresSelectMultiplo(select.id);
    const opcoes = [...select.options].filter(option => option.value);
    const todasSelecionadas = opcoes.length > 0 && selecionados.length === opcoes.length;
    const resumo = selecionados.length === 0 || todasSelecionadas
        ? 'Todos'
        : (selecionados.length === 1 ? opcoes.find(option => option.value === selecionados[0])?.textContent : `${selecionados.length} selecionados`);

    container.innerHTML = `
        <button type="button" class="ocasioes-dropdown-toggle" aria-expanded="${estavaAberto}">
            <span>${escapeHtml(resumo || 'Selecionar')}</span>
            <span class="ocasioes-dropdown-seta">âŒ„</span>
        </button>
        <div class="ocasioes-dropdown-painel">
            <div class="ocasioes-dropdown-acoes">
                <button type="button" data-acao="todos">Selecionar todos</button>
                <button type="button" data-acao="limpar">Limpar</button>
            </div>
            <div class="ocasioes-dropdown-lista">
                ${opcoes.map(option => `
                    <button type="button" class="ocasioes-dropdown-opcao ${selecionados.includes(option.value) ? 'ativo' : ''}" data-valor="${escapeHtml(option.value)}">
                        <span class="ocasioes-dropdown-check">${selecionados.includes(option.value) ? 'âœ“' : ''}</span>
                        <span>${escapeHtml(option.textContent)}</span>
                    </button>
                `).join('')}
            </div>
        </div>
    `;
    container.classList.toggle('aberto', estavaAberto);

    const toggle = container.querySelector('.ocasioes-dropdown-toggle');
    toggle.addEventListener('click', evento => {
        evento.stopPropagation();
        const abrir = !container.classList.contains('aberto');
        document.querySelectorAll('.ocasioes-dropdown-multiplo.aberto').forEach(item => item.classList.remove('aberto'));
        app.dropdownOcasioesAberto = abrir ? select.id : null;
        container.classList.toggle('aberto', abrir);
        toggle.setAttribute('aria-expanded', String(abrir));
    });
    container.querySelector('[data-acao="todos"]').addEventListener('click', evento => {
        evento.stopPropagation();
        definirTodosControleVisualOcasioes(select.id, true);
    });
    container.querySelector('[data-acao="limpar"]').addEventListener('click', evento => {
        evento.stopPropagation();
        definirTodosControleVisualOcasioes(select.id, false);
    });
    container.querySelectorAll('.ocasioes-dropdown-opcao').forEach(botao => {
        botao.addEventListener('click', evento => {
            evento.stopPropagation();
            alternarControleVisualOcasioes(select.id, botao.dataset.valor);
        });
    });
}

function definirTodosControleVisualOcasioes(selectId, selecionar) {
    const select = document.getElementById(selectId);
    if (!select) return;
    [...select.options].forEach(option => {
        option.selected = option.value ? selecionar : !selecionar;
    });
    app.dropdownOcasioesAberto = selectId;
    filtrarPaginaOcasioes();
}

function renderControleVisualOcasioes(select) {
    select.classList.add('select-nativo-oculto');

    let container = select.parentElement.querySelector(`.ocasioes-chip-select[data-select-id="${select.id}"]`);
    if (!container) {
        container = document.createElement('div');
        container.className = 'ocasioes-chip-select';
        container.dataset.selectId = select.id;
        select.insertAdjacentElement('afterend', container);
    }

    const selecionados = obterValoresSelectMultiplo(select.id);
    const temSelecao = selecionados.length > 0;
    const opcoes = [...select.options];
    container.innerHTML = '';

    opcoes.forEach(option => {
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.className = 'ocasioes-chip-opcao';
        botao.dataset.valor = option.value;
        botao.textContent = option.textContent;
        botao.classList.toggle('ativo', option.value ? selecionados.includes(option.value) : !temSelecao);
        botao.addEventListener('click', () => alternarControleVisualOcasioes(select.id, option.value));
        container.appendChild(botao);
    });
}

function alternarControleVisualOcasioes(selectId, valor) {
    const select = document.getElementById(selectId);
    if (!select) return;

    if (!valor) {
        [...select.options].forEach(option => {
            option.selected = !option.value;
        });
    } else {
        const option = [...select.options].find(item => item.value === valor);
        if (option) option.selected = !option.selected;

        const temSelecao = [...select.options].some(item => item.value && item.selected);
        [...select.options].forEach(item => {
            if (!item.value) item.selected = !temSelecao;
        });
    }

    if (selectId === 'ocasioes-select') {
        selecionarOcasiaoPagina();
        renderControlesVisuaisOcasioes();
        return;
    }

    app.dropdownOcasioesAberto = selectId;
    filtrarPaginaOcasioes();
}

function preencherFiltrosPaginaOcasioes() {
    const selectTipo = document.getElementById('ocasioes-filtro-tipo');
    const selectClima = document.getElementById('ocasioes-filtro-clima');
    const selectOcasiao = document.getElementById('ocasioes-select');
    if (!selectTipo || !selectClima || !selectOcasiao) return;

    const ocasioes = obterOcasioesOrdenadas();
    const tipos = [...new Set(ocasioes.map(item => item.tipo).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, 'pt-BR'));
    selectTipo.innerHTML = '<option value="">Todos</option>' +
        tipos.map(tipo => `<option value="${escapeHtml(tipo)}">${escapeHtml(tipo)}</option>`).join('');
    marcarValoresSelectMultiplo(selectTipo, app.filtrosOcasioes.tipo);

    const climas = Object.values(app.climas || {})
        .filter(clima => clima.codigo)
        .sort((a, b) => String(a.codigo).localeCompare(String(b.codigo), 'pt-BR', { numeric: true }));
    selectClima.innerHTML = '<option value="">Todas</option>' +
        climas.map(clima => `<option value="${escapeHtml(clima.codigo)}">${escapeHtml(clima.descricao || clima.codigo)}</option>`).join('');
    marcarValoresSelectMultiplo(selectClima, app.filtrosOcasioes.clima);

    const filtradas = obterOcasioesFiltradasPagina();
    selectOcasiao.innerHTML = '<option value="">Todas</option>' + filtradas
        .map(ocasiao => `<option value="${escapeHtml(ocasiao.codigo)}">${escapeHtml(ocasiao.descricao)}</option>`)
        .join('');

    const codigosDisponiveis = new Set(filtradas.map(ocasiao => ocasiao.codigo));
    app.filtrosOcasioes.ocasiao = (app.filtrosOcasioes.ocasiao || []).filter(codigo => codigosDisponiveis.has(codigo));
    marcarValoresSelectMultiplo(selectOcasiao, app.filtrosOcasioes.ocasiao);
    salvarEstadoFiltros();
    renderControlesVisuaisOcasioes();
}

function filtrarPaginaOcasioes() {
    app.filtrosOcasioes.tipo = obterValoresSelectMultiplo('ocasioes-filtro-tipo');
    app.filtrosOcasioes.clima = obterValoresSelectMultiplo('ocasioes-filtro-clima');
    app.filtrosOcasioes.lookId = '';
    salvarEstadoFiltros();
    preencherFiltrosPaginaOcasioes();
    renderPaginaOcasioes();
}

function selecionarOcasiaoPagina() {
    app.filtrosOcasioes.ocasiao = obterValoresSelectMultiplo('ocasioes-select');
    app.filtrosOcasioes.lookId = '';
    salvarEstadoFiltros();
    renderPaginaOcasioes();
    renderControlesVisuaisOcasioes();
}

function alterarEixoGraficoOcasioes(eixo) {
    app.filtrosOcasioes.eixoGrafico = eixo === 'ocasioes' ? 'ocasioes' : 'climas';
    salvarEstadoFiltros();
    renderPaginaOcasioes();
}

function selecionarLookOcasioes(lookId) {
    app.filtrosOcasioes.lookId = app.filtrosOcasioes.lookId === lookId ? '' : lookId;
    salvarEstadoFiltros();
    renderPaginaOcasioes();
}

function renderPaginaOcasioes() {
    const codigosSelecionados = app.filtrosOcasioes.ocasiao || [];
    const looks = obterLooksPaginaOcasioes(codigosSelecionados);
    if (app.filtrosOcasioes.lookId && !looks.some(look => look.id === app.filtrosOcasioes.lookId)) {
        app.filtrosOcasioes.lookId = '';
        salvarEstadoFiltros();
    }
    const lookIds = new Set(looks.map(look => look.id));
    const resumoOcasiao = obterResumoOcasiaoSelecionada(codigosSelecionados);

    document.getElementById('ocasiao-selecionada-nome').textContent = resumoOcasiao.nome;
    document.getElementById('ocasiao-selecionada-codigo').textContent = resumoOcasiao.codigo;
    document.getElementById('ocasioes-stat-usos').textContent = contarUsosLooksOcasiao(lookIds);
    document.getElementById('ocasioes-stat-looks').textContent = looks.length;
    document.getElementById('ocasioes-stat-htt').textContent = looks.filter(lookEhHTT).length;
    document.getElementById('ocasioes-data-revisao').textContent = resumoOcasiao.dataRevisao;
    document.getElementById('ocasioes-temperaturas').textContent = obterTemperaturasOcasiao(looks);

    renderLooksPaginaOcasioes(looks);
    renderGraficoClimasOcasioes(looks);
    renderSugestoesOcasioes(looks);
}

function obterResumoOcasiaoSelecionada(codigos) {
    if (!codigos.length) {
        return { nome: 'Todas', codigo: 'Todas', dataRevisao: '-' };
    }

    if (codigos.length === 1) {
        const codigo = codigos[0];
        const ocasiao = app.mapaOcasioes?.[codigo] || {};
        return {
            nome: ocasiao.descricao || codigo,
            codigo,
            dataRevisao: ocasiao.data_revisao ? formatarDataBR(ocasiao.data_revisao) : '-',
        };
    }

    return {
        nome: `${codigos.length} ocasioes`,
        codigo: `${codigos.length} selecionadas`,
        dataRevisao: '-',
    };
}

function obterLooksPaginaOcasioes(codigosSelecionados = []) {
    const climas = app.filtrosOcasioes.clima || [];
    const codigosOcasioes = codigosSelecionados.length ? codigosSelecionados : obterOcasioesFiltradasPagina().map(ocasiao => ocasiao.codigo);
    return obterTodosLooks()
        .filter(look => !ehLookExcluido(look))
        .filter(look => codigosOcasioes.some(codigoOcasiao => lookTemOcasiao(look, codigoOcasiao)))
        .filter(look => climas.length === 0 || climas.includes(String(look.clima_calc || look.clima || '')))
        .sort((a, b) => String(a.id || '').localeCompare(String(b.id || ''), 'pt-BR', { numeric: true }));
}

function lookTemOcasiao(look, codigo) {
    if (!codigo) return false;
    const alvo = normalizarTexto(codigo);
    const info = app.mapaOcasioes?.[codigo];
    const descricao = normalizarTexto(info?.descricao || '');

    if ((look.ocasioes || []).some(item => normalizarTexto(item.codigo) === alvo || normalizarTexto(item.descricao) === descricao)) {
        return true;
    }

    return descricao && obterValoresOcasiaoLook(look).some(valor => normalizarTexto(valor) === descricao);
}

function lookEhHTT(look) {
    return normalizarTexto(look?.HTT || look?.htt || look?.basicos?.HTT) === 'true';
}

function contarUsosLooksOcasiao(lookIds) {
    if (!lookIds.size) return 0;

    return app.historico.reduce((total, registro) => {
        const usados = obterLookIdsRegistroOuInferidos(registro);
        return total + (usados.some(id => lookIds.has(id)) ? 1 : 0);
    }, 0);
}

function obterTemperaturasOcasiao(looks) {
    const temperaturas = [...new Set(looks
        .map(look => look.clima_info?.temperatura || app.climas?.[String(look.clima_calc || look.clima || '')]?.temperatura)
        .filter(Boolean))];

    return temperaturas.length ? temperaturas.slice(0, 3).join(' / ') : '-';
}

function renderLooksPaginaOcasioes(looks) {
    const container = document.getElementById('ocasioes-lista-looks');
    const contador = document.getElementById('ocasioes-looks-contagem');
    if (!container) return;

    if (contador) contador.textContent = looks.length;
    container.innerHTML = looks.length
        ? looks.map(look => criarMiniCardLookOcasioes(look)).join('')
        : '<p class="texto-ajuda">Nenhum look encontrado para essa ocasiao.</p>';
}

function criarMiniCardLookOcasioes(look) {
    const selecionado = app.filtrosOcasioes.lookId === look.id;
    return `
        <button type="button" class="ocasioes-mini-card ${selecionado ? 'selecionado' : ''}" onclick="selecionarLookOcasioes('${escapeHtml(look.id)}')" title="Filtrar acessorios por este look">
            <img src="${getCaminhoFotoLook(look.id)}" alt="${escapeHtml(look.id)}"
                 onerror="this.src='${imagemFallback()}';">
            <strong>${escapeHtml(look.id)}</strong>
        </button>
    `;
}

function renderGraficoClimasOcasioes(looks) {
    const container = document.getElementById('ocasioes-grafico-climas');
    if (!container) return;

    const eixo = app.filtrosOcasioes.eixoGrafico === 'ocasioes' ? 'ocasioes' : 'climas';
    const selectEixo = document.getElementById('ocasioes-grafico-eixo');
    if (selectEixo) selectEixo.value = eixo;
    const grupos = eixo === 'ocasioes'
        ? obterGruposGraficoOcasioes()
        : obterGruposGraficoClimas(looks);

    if (grupos.length === 0) {
        container.innerHTML = '<p class="texto-ajuda">Nenhum dado para o grafico.</p>';
        return;
    }

    const maximo = Math.max(1, ...grupos.map(grupo => Math.max(grupo.atual, grupo.necessario)));

    container.innerHTML = grupos.map(grupo => `
        <div class="ocasioes-barra-clima">
            <div class="ocasioes-barras">
                <span class="barra-serie">
                    <strong>${grupo.atual}</strong>
                    <span class="barra-atual" style="height:${Math.max(4, (grupo.atual / maximo) * 96)}px" title="${grupo.atual} HTT atuais"></span>
                </span>
                <span class="barra-serie">
                    <strong>${grupo.necessario}</strong>
                    <span class="barra-htt" style="height:${Math.max(4, (grupo.necessario / maximo) * 96)}px" title="${grupo.necessario} necessÃ¡rios"></span>
                </span>
            </div>
            <small>${escapeHtml(grupo.label)}</small>
        </div>
    `).join('');
}

function obterGruposGraficoClimas(looks) {
    const climas = Object.values(app.climas || {})
        .filter(clima => clima.codigo && clima.codigo !== '0')
        .sort((a, b) => String(a.codigo).localeCompare(String(b.codigo), 'pt-BR', { numeric: true }));

    return climas.map(clima => {
        const atual = looks.filter(look => String(look.clima_calc || look.clima || '') === String(clima.codigo) && lookEhHTT(look)).length;
        const codigos = (app.filtrosOcasioes.ocasiao || []).length
            ? app.filtrosOcasioes.ocasiao
            : obterOcasioesFiltradasPagina().map(ocasiao => ocasiao.codigo);
        const necessario = codigos.reduce((total, codigo) =>
            total + Number(app.mapaOcasioes?.[codigo]?.quantidades_necessarias?.[clima.codigo] || 0), 0);
        return {
            label: clima.descricao || clima.codigo,
            atual,
            necessario,
        };
    });
}

function obterGruposGraficoOcasioes() {
    const climas = app.filtrosOcasioes.clima || [];
    const codigosSelecionados = app.filtrosOcasioes.ocasiao || [];
    const ocasioes = obterOcasioesFiltradasPagina()
        .filter(ocasiao => codigosSelecionados.length === 0 || codigosSelecionados.includes(ocasiao.codigo));
    return ocasioes.map(ocasiao => {
        const looks = obterTodosLooks()
            .filter(look => !ehLookExcluido(look))
            .filter(look => lookTemOcasiao(look, ocasiao.codigo))
            .filter(look => climas.length === 0 || climas.includes(String(look.clima_calc || look.clima || '')));

        const necessario = climas.length
            ? climas.reduce((total, clima) => total + Number(ocasiao.quantidades_necessarias?.[clima] || 0), 0)
            : Number(ocasiao.total_necessario || 0);
        return {
            label: `${ocasiao.codigo} ${ocasiao.descricao}`,
            atual: looks.filter(lookEhHTT).length,
            necessario,
        };
    });
}

function renderOutrasOcasioesPagina(codigoSelecionado) {
    const container = document.getElementById('ocasioes-outras-lista');
    if (!container) return;

    container.innerHTML = obterOcasioesFiltradasPagina()
        .map(ocasiao => `
            <button type="button"
                    class="${ocasiao.codigo === codigoSelecionado ? 'selecionada' : ''}"
                    onclick="selecionarOcasiaoPagina('${escapeHtml(ocasiao.codigo)}')">
                <span>${escapeHtml(ocasiao.codigo)}</span>
                <strong>${escapeHtml(ocasiao.descricao)}</strong>
            </button>
        `).join('');
}

function renderSugestoesOcasioes(looks) {
    const lookSelecionado = app.filtrosOcasioes.lookId;
    const looksBase = lookSelecionado
        ? looks.filter(look => look.id === lookSelecionado)
        : looks;
    const sugestoes = coletarSugestoesPecasOcasioes(looksBase);
    const calcados = sugestoes.filter(item => normalizarTexto(app.pecas[item.id]?.tipo) === 'calcado');
    const bolsas = sugestoes.filter(item => ['bolsa', 'cinto'].includes(normalizarTexto(app.pecas[item.id]?.tipo)));

    renderPecasSugestaoOcasioes('ocasioes-calcados', 'ocasioes-calcados-contagem', calcados);
    renderPecasSugestaoOcasioes('ocasioes-bolsas', 'ocasioes-bolsas-contagem', bolsas);
}

function coletarSugestoesPecasOcasioes(looks) {
    const mapa = new Map();

    looks.forEach(look => {
        (look.pecas_sugeridas || []).forEach(item => {
            if (!item.id || !app.pecas[item.id]) return;
            if (!mapa.has(item.id)) mapa.set(item.id, item);
        });
    });

    return [...mapa.values()].sort((a, b) => String(a.id).localeCompare(String(b.id), 'pt-BR', { numeric: true }));
}

function renderPecasSugestaoOcasioes(containerId, contadorId, itens) {
    const container = document.getElementById(containerId);
    const contador = document.getElementById(contadorId);
    if (!container) return;

    if (contador) contador.textContent = itens.length;
    container.innerHTML = itens.length
        ? itens.map(item => criarMiniCardPecaOcasioes(item.id)).join('')
        : '<p class="texto-ajuda">Nenhuma sugestao encontrada.</p>';
}

function criarMiniCardPecaOcasioes(id) {
    const peca = app.pecas[id];
    if (!peca) return '';

    return `
        <button type="button" class="ocasioes-mini-card" onclick="mostrarDetalhesPeca('${escapeHtml(id)}')">
            <img src="${getCaminhoFoto(id)}" alt="${escapeHtml(id)}"
                 onerror="this.src='${imagemFallback()}';">
            <strong>${escapeHtml(id)}</strong>
        </button>
    `;
}

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
    salvarEstadoFiltros();
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
    salvarEstadoFiltros();
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
        alert('A data inicial precisa ser anterior ou igual Ã  data final.');
        return;
    }

    renderHistorico(obterRegistrosHistoricoEntre(inicio, fim), inicio, fim);
    app.filtroHistoricoAtivo = { tipo: 'intervalo', inicio, fim };
    salvarEstadoFiltros();
    marcarFiltroPeriodoHistorico(null);
}

function renderHistorico(registrosPeriodo, inicio, fim) {
    registrosPeriodo = registrosPeriodo.filter(reg => Array.isArray(reg.pecas) && reg.pecas.length > 0);
    app.registrosHistoricoPeriodo = registrosPeriodo;

    atualizarResumoPeriodo(registrosPeriodo, inicio, fim);
    renderResumoItensPeriodo(registrosPeriodo);
    renderTabelaPecasMaisUsadas(registrosPeriodo);
    renderDetalheHistorico(registrosPeriodo);
    atualizarStatsHistorico(registrosPeriodo);
    renderCalendarioHistorico(inicio, fim);
    renderPecasSemUso();

    console.log(`ðŸ“Š HistÃ³rico atualizado: ${registrosPeriodo.length} registros`);
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
    const nomesDias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'SÃ¡b'];

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
                ${registros.length ? `<small>${pecas.length} peÃ§as</small>` : ''}
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
    salvarEstadoFiltros();
    renderCalendarioHistorico(
        document.getElementById('historico-data-inicio')?.value || null,
        document.getElementById('historico-data-fim')?.value || null
    );
}

function selecionarDiaCalendarioHistorico(dataISO) {
    app.filtroHistoricoAtivo = { tipo: 'intervalo', inicio: dataISO, fim: dataISO };
    salvarEstadoFiltros();
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
        .filter(peca => peca.situacao !== 'excluÃ­da')
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
        container.innerHTML = '<p style="text-align: center; color: #999;">Nenhuma peÃ§a encontrada para esses filtros.</p>';
        return;
    }

    container.innerHTML = pecas.map(({ peca, data, dias }) => `
        <button type="button" class="peca-sem-uso-card" onclick="mostrarDetalhesPeca('${peca.id}')">
            <img src="${getCaminhoFoto(peca.id)}" alt="${peca.id}"
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23eee%22 width=%22100%22 height=%22100%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22>sem foto</text></svg>'">
            <strong>${peca.id}</strong>
            <span>${dias === null ? 'Nunca usada' : `${dias} dias`}</span>
            <small>${data ? `Ãšltimo uso: ${formatarDataBR(formatarDataInput(data))}` : 'Sem registro'}</small>
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
    preencherSelectFiltroSemUso(selectSituacao, 'situacao', 'Todas as situaÃ§Ãµes');

    if (selectTipo) selectTipo.value = app.filtrosSemUso.tipo || '';
    if (selectLocal) selectLocal.value = app.filtrosSemUso.local || '';
    if (selectSituacao) selectSituacao.value = app.filtrosSemUso.situacao || '';
    if (selectTempo) selectTempo.value = app.filtrosSemUso.tempo || '';
}

function preencherSelectFiltroSemUso(select, campo, labelTodos) {
    if (!select || select.dataset.preenchido === 'true') return;

    const valores = [...new Set(Object.values(app.pecas)
        .filter(peca => peca.situacao !== 'excluÃ­da' && valorVisivel(peca[campo]))
        .map(peca => peca[campo]))]
        .sort((a, b) => a.localeCompare(b, 'pt-BR'));

    select.innerHTML = `<option value="">${labelTodos}</option>` +
        valores.map(valor => `<option value="${escapeHtml(valor)}">${escapeHtml(valor)}</option>`).join('');
    select.dataset.preenchido = 'true';
}

function atualizarFiltroSemUso(campo, evento) {
    app.filtrosSemUso[campo] = evento.target.value;
    salvarEstadoFiltros();
    renderPecasSemUso();
}

function pecaPassaFiltroSemUso({ peca, dias }) {
    const { tipo, local, situacao, tempo } = app.filtrosSemUso;

    if (tipo && peca.tipo !== tipo) return false;
    if (local && peca.local !== local) return false;
    if (situacao && peca.situacao !== situacao) return false;
    return pecaPassaFiltroTempoSemUso(dias, tempo);
}

function pecaPassaFiltroTempoSemUso(dias, tempo) {
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

function alterarTipoResumoHistorico(tipo) {
    app.resumoHistoricoTipo = tipo === 'pecas' ? 'pecas' : 'looks';
    renderResumoItensPeriodo(app.registrosHistoricoPeriodo || []);
}

function renderResumoItensPeriodo(registrosPeriodo) {
    const container = document.getElementById('historico-resumo-itens');
    const select = document.getElementById('historico-resumo-tipo');
    if (!container) return;

    const tipo = app.resumoHistoricoTipo === 'pecas' ? 'pecas' : 'looks';
    if (select) select.value = tipo;

    const resumo = calcularResumoUsoHistorico(registrosPeriodo, tipo);

    if (resumo.length === 0) {
        container.innerHTML = `<p class="texto-ajuda">Nenhum ${tipo === 'pecas' ? 'item' : 'look'} usado neste periodo.</p>`;
        return;
    }

    container.innerHTML = `
        <div class="historico-resumo-cabecalho">
            <span>ID</span>
            <span>Periodo</span>
            <span>Total</span>
            <span>1 uso</span>
            <span>Ult. uso</span>
        </div>
        ${resumo.map(item => criarLinhaResumoHistorico(item, tipo)).join('')}
    `;
}

function calcularResumoUsoHistorico(registrosPeriodo, tipo) {
    const contagemPeriodo = contarUsosHistorico(registrosPeriodo, tipo);
    const contagemTotal = contarUsosHistorico(app.historico, tipo);

    return [...contagemPeriodo.values()]
        .map(itemPeriodo => {
            const itemTotal = contagemTotal.get(itemPeriodo.id) || itemPeriodo;
            return {
                ...itemPeriodo,
                total: itemTotal.total || itemPeriodo.total,
                primeiro: itemTotal.primeiro || itemPeriodo.primeiro,
                ultimo: itemTotal.ultimo || itemPeriodo.ultimo,
            };
        })
        .sort((a, b) => b.periodo - a.periodo || String(a.id).localeCompare(String(b.id), 'pt-BR', { numeric: true }));
}

function contarUsosHistorico(registros, tipo) {
    const mapa = new Map();

    (registros || []).forEach(registro => {
        const dia = obterDiaRegistro(registro);
        if (!dia) return;

        const ids = tipo === 'pecas'
            ? [...new Set(registro.pecas || [])].filter(Boolean)
            : obterLookIdsRegistroOuInferidos(registro);

        ids.forEach(id => {
            const atual = mapa.get(id) || { id, periodo: 0, total: 0, primeiro: dia, ultimo: dia };
            atual.periodo += 1;
            atual.total += 1;
            if (dia < atual.primeiro) atual.primeiro = dia;
            if (dia > atual.ultimo) atual.ultimo = dia;
            mapa.set(id, atual);
        });
    });

    return mapa;
}

function criarLinhaResumoHistorico(item, tipo) {
    const existe = tipo === 'pecas' ? Boolean(app.pecas[item.id]) : Boolean(obterLookPorId(item.id));
    const detalhe = tipo === 'pecas'
        ? app.pecas[item.id]?.tipo || 'Peca'
        : obterLookPorId(item.id)?.nome || 'Look';
    const foto = tipo === 'pecas' ? getCaminhoFoto(item.id) : getCaminhoFotoLook(item.id);
    const acao = existe
        ? (tipo === 'pecas' ? `mostrarDetalhesPeca('${item.id}')` : `mostrarDetalhesLook('${item.id}')`)
        : '';

    return `
        <button type="button" class="historico-resumo-linha" ${acao ? `onclick="${acao}"` : 'disabled'}>
            <span class="historico-resumo-id">
                <img src="${escapeHtml(foto)}" alt="${escapeHtml(item.id)}"
                     onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 80 80%22><rect fill=%22%23eee%22 width=%2280%22 height=%2280%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22>foto</text></svg>'">
                <span>
                    <strong>${escapeHtml(item.id)}</strong>
                    <small>${escapeHtml(detalhe)}</small>
                </span>
            </span>
            <span>${item.periodo}</span>
            <span>${item.total}</span>
            <span>${formatarDataBR(item.primeiro)}</span>
            <span>${formatarDataBR(item.ultimo)}</span>
        </button>
    `;
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
        container.innerHTML = '<p style="text-align: center; color: #999;">Nenhum uso encontrado neste perÃ­odo.</p>';
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
        obterLookIdsRegistroOuInferidos(reg).forEach(id => looksUsados.add(id));
    });
    statCards[2].textContent = looksUsados.size;
}

function renderDetalheHistorico(registrosPeriodo) {
    const container = document.getElementById('detalhe-historico');
    if (!container) return;

    if (registrosPeriodo.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">Nenhum registro encontrado para esse perÃ­odo.</p>';
        return;
    }

    const registrosPorDia = agruparRegistrosPorDia(registrosPeriodo);
    container.innerHTML = '';

    Object.entries(registrosPorDia)
        .sort(([diaA], [diaB]) => diaB.localeCompare(diaA))
        .forEach(([dia, registros]) => {
            const pecasDia = [...new Set(registros.flatMap(reg => reg.pecas || []))].filter(id => app.pecas[id]);
            const looksDiaMap = new Map();
            registros.flatMap(reg => obterLooksRegistroComOrigem(reg)).forEach(item => {
                if (!obterLookPorId(item.id)) return;
                const atual = looksDiaMap.get(item.id);
                const origem = atual?.origem === 'registrado' || item.origem === 'registrado' ? 'registrado' : 'inferido';
                looksDiaMap.set(item.id, { id: item.id, origem });
            });
            const looksDia = [...looksDiaMap.values()];

            const grupo = document.createElement('div');
            grupo.className = 'historico-dia';
            grupo.dataset.dia = dia;

            const looksHtml = looksDia.length > 0
                ? looksDia.map(item => criarCardLookHistorico(item.id, item.origem)).join('')
                : '<p class="texto-ajuda">Nenhum look identificado nesse dia.</p>';

            const pecasHtml = pecasDia.length > 0
                ? pecasDia.map(id => criarCardPecaHistorico(id, { dia, removivel: true })).join('')
                : '<p class="texto-ajuda">Nenhuma peÃ§a identificada nesse dia.</p>';

            grupo.innerHTML = `
                <div class="historico-dia-cabecalho">
                    <h4>${formatarDataBR(dia)}</h4>
                    <span>${pecasDia.length} peÃ§as Â· ${looksDia.length} looks</span>
                </div>
                <div class="historico-bloco">
                    <h5>Looks</h5>
                    <div class="historico-look-grid">${looksHtml}</div>
                </div>
                <div class="historico-bloco">
                    <div class="historico-bloco-topo">
                        <h5>PeÃ§as</h5>
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

function criarCardLookHistorico(id, origem = 'registrado') {
    const look = obterLookPorId(id);
    const pecas = (look?.pecas || []).filter(pid => app.pecas[pid]);
    const nome = look?.nome || look?.id || id;
    const origemNormalizada = origem === 'inferido' ? 'inferido' : 'registrado';
    const origemLabel = origemNormalizada === 'inferido' ? 'Inferido pelas peÃ§as' : 'Registrado no histÃ³rico';

    return `
        <button type="button" class="historico-look-card historico-look-${origemNormalizada}" onclick="mostrarDetalhesLook('${id}')">
            <img src="${getCaminhoFotoLook(id)}" alt="${nome}" class="historico-look-foto"
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23eee%22 width=%22100%22 height=%22100%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22>sem foto</text></svg>'">
            <strong>${nome}</strong>
            <small>${pecas.length} peÃ§as</small>
            <span class="historico-look-origem">${origemLabel}</span>
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
                alteradoEm: new Date().toISOString(),
            };
        })
        .filter(registro => (registro.pecas || []).length > 0);

    if (!alterou) return;

    if (app.pecasSelecionadasLookHistorico[dia]) {
        app.pecasSelecionadasLookHistorico[dia] = app.pecasSelecionadasLookHistorico[dia].filter(id => id !== pecaId);
    }

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
    botao.textContent = total < 2 ? `Selecione ${2 - total} peÃ§a${total === 1 ? '' : 's'}` : `Criar look (${total})`;
    atualizarAvisoLookExistenteHistorico(dia);
}

function atualizarAvisoLookExistenteHistorico(dia) {
    const grupo = document.querySelector(`.historico-dia[data-dia="${dia}"]`);
    const container = grupo?.querySelector('[data-look-existente-dia]');
    if (!container) return;

    const pecas = app.pecasSelecionadasLookHistorico[dia] || [];
    const looks = obterLooksCompativeis(pecas, { incluirExcluidos: true });

    if (looks.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = `
        <strong>Essas peÃ§as jÃ¡ fazem parte de look cadastrado</strong>
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
        alert('Selecione pelo menos 2 peÃ§as desse dia para criar um look.');
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
            const situacao = look.situacao || look.basicos?.['situaÃ§Ã£o'] || '';
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
        const situacao = look.situacao || look.basicos?.['situaÃ§Ã£o'] || '';
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
    document.getElementById('look-historico-situacao').value = look.situacao || look.basicos?.['situaÃ§Ã£o'] || 'em uso';
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
    document.getElementById('look-historico-pecas-preview').textContent = `${pecas.length} peÃ§as selecionadas: ${pecas.join(', ')}`;

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
        const descricao = [peca.tipo, peca.subtipo].filter(Boolean).join(' Â· ');
        return `
            <div class="look-historico-ordem-item">
                <strong>${indice + 1}</strong>
                <img src="${getCaminhoFoto(id)}" alt="${peca.tipo || id}"
                     onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 60 60%22><rect fill=%22%23eee%22 width=%2260%22 height=%2260%22/></svg>'">
                <span class="look-historico-ordem-info">
                    <strong class="look-historico-peca-id">ID: ${escapeHtml(id)}</strong>
                    <small>${escapeHtml(descricao || 'Sem tipo')}</small>
                </span>
                <button type="button" aria-label="Subir" onclick="moverPecaLookHistorico(${indice}, -1)" ${indice === 0 ? 'disabled' : ''}>â†‘</button>
                <button type="button" aria-label="Descer" onclick="moverPecaLookHistorico(${indice}, 1)" ${indice === pecas.length - 1 ? 'disabled' : ''}>â†“</button>
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
        alert('Selecione pelo menos 2 peÃ§as.');
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
    const calculados = calcularDadosLookPorPecas(pecas);

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
        clima_calc: calculados.clima_calc,
        clima_info: calculados.clima_info,
        aquecimentos: calculados.aquecimentos,
        local_calc: calculados.local_calc,
        local: calculados.local_calc,
        locais_pecas: calculados.locais_pecas,
        utilizacao_calc: calculados.utilizacao_calc,
        utilizacao: calculados.utilizacao_calc,
        utilizacoes_pecas: calculados.utilizacoes_pecas,
        foto: foto || lookExistente?.foto || `fotos/${indicador}/${id}.webp`,
        substituiLookBase: modo === 'substituir' || undefined,
        substituidoEm: dataAlteracao || undefined,
        basicos: {
            ...basicosOriginais,
            ID: id,
            ID1: pecas[0] || '',
            ID2: pecas[1] || '',
            ID3: pecas[2] || '',
            'situação': situacao,
            Indicador: indicador,
            'Data criaÃ§Ã£o': dataCriacao,
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
    alvo.alteradoEm = new Date().toISOString();
}

function lerFotoLookHistorico() {
    const arquivo = document.getElementById('look-historico-foto')?.files?.[0];
    if (!arquivo) return Promise.resolve('');

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('NÃ£o consegui ler a foto do look.'));
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
        resumo.textContent = 'Nenhum histÃ³rico carregado ainda.';
        return;
    }

    resumo.textContent = `${registros.length} registro(s) entre ${formatarDataBR(inicio)} e ${formatarDataBR(fim)}.`;
}

function marcarFiltroPeriodoHistorico(valor) {
    const botoes = document.querySelectorAll('#historico .filtro-btn');
    botoes.forEach(botao => botao.classList.remove('ativo'));

    const textoEsperado = {
        '7': 'Ãšltimos 7 dias',
        '14': 'Ãšltimos 14 dias',
        '30': 'Ãšltimos 30 dias',
        todos: 'Todo histÃ³rico',
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

/* ==================== INICIAR QUANDO A PÃGINA CARREGA ====================
   window.addEventListener('DOMContentLoaded') = espera HTML estar pronto */

window.addEventListener('DOMContentLoaded', inicializar);

/*
   ðŸ’¡ ESTRUTURA GERAL DO CÃ“DIGO:

   1. OBJETO APP
      - Estado centralizado de toda a app
      - FÃ¡cil de debugar e entender

   2. INICIALIZAÃ‡ÃƒO
      - Carrega dados (JSON + localStorage)
      - Renderiza interface

   3. NAVEGAÃ‡ÃƒO
      - mostrarPagina() = muda qual pÃ¡gina estÃ¡ visÃ­vel
      - Single Page App = nÃ£o recarrega

   4. PÃGINAS
      - Home: galeria de peÃ§as
      - Usar Hoje: registra uso diÃ¡rio
      - Looks: gerencia combinaÃ§Ãµes
      - HistÃ³rico: estatÃ­sticas

   5. ARMAZENAMENTO
      - localStorage = dados persistem
      - JSON = dados do Excel

   6. EVENTOS
      - onclick = funÃ§Ãµes chamadas ao clicar
      - onkeyup = funÃ§Ãµes chamadas ao digitar
      - addEventListener = escuta eventos

   PRÃ“XIMOS PASSOS:
   - Teste a app abrindo index.html no navegador
   - Abra DevTools (F12) para debugar
   - Customize conforme necessÃ¡rio
*/

