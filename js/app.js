/* ==================== OBJETO PRINCIPAL DA APP ====================
   Tudo sobre o estado da aplicação fica aqui. 
   É como um "banco de dados em memória" */

const CAMPOS_FILTROS_PECAS = ['tipo', 'funcao', 'subtipo', 'local', 'alocacao', 'situacao', 'conservacao', 'reposicao', 'utilizacao', 'formalidade', 'nivel_aquecimento', 'padronagem', 'modelagem', 'tom', 'cor_detalhe', 'cor', 'tendencia', 'info_fotos', 'combinacoes'];
const CAMPOS_FILTROS_LOOKS = ['lookId', 'pecas', 'categoria', 'indicador', 'local', 'situacao', 'utilizacao', 'clima', 'htt', 'ocasiao'];
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
const CAMPOS_FILTROS_LOOKS_MULTIPLOS = CAMPOS_FILTROS_LOOKS.filter(campo => campo !== 'pecas');
const TEMA_VISUAL_STORAGE_KEY = 'temaVisualGuardaRoupa';
const ESTADO_FILTROS_STORAGE_KEY = 'estadoFiltrosGuardaRoupa';
const TEMAS_VISUAIS = ['sistema', 'claro', 'escuro'];
const TIPO_REGISTRO_AGENDAMENTO = 'agendamento';
const MODAL_Z_INDEX_BASE = 200;
const MODAL_Z_INDEX_STEP = 40;
const CAMPOS_IMPORTADOS_PECA = [
    {
        prop: 'info_fotos',
        aliases: ['Info e fotos', 'Info/fotos', 'Info fotos', 'Fotos'],
    },
    {
        prop: 'combinacoes',
        aliases: ['Combinação', 'Combinacao', 'Combinações', 'Combinacoes'],
    },
    {
        prop: 'data_revisao',
        aliases: ['Data revisão', 'Data revisao'],
    },
    {
        prop: 'no_lugar_de',
        aliases: ['No lugar de', 'no lugar de'],
    },
    {
        prop: 'substituida_por',
        aliases: ['Substituída por', 'Substituida por', 'substituida por'],
    },
];
const GRUPOS_FICHA_PECA = [
    {
        classe: 'ficha-grupo-azul',
        campos: [
            { chave: 'id', label: 'ID', prop: 'id', sempre: true },
            { chave: 'data_atualizacao', label: 'Data de atualização', tipo: 'dataHoraAtualizacao' },
        ],
    },
    {
        classe: 'ficha-grupo-vermelho',
        campos: [
            { chave: 'tipo', label: 'Tipo', prop: 'tipo' },
            { chave: 'funcao', label: 'Função', prop: 'funcao' },
            { chave: 'subtipo', label: 'Subtipo', prop: 'subtipo' },
        ],
    },
    {
        classe: 'ficha-grupo-roxo',
        campos: [
            { chave: 'local', label: 'Local', prop: 'local' },
            { chave: 'alocacao', label: 'Alocação', prop: 'alocacao' },
        ],
    },
    {
        classe: 'ficha-grupo-verde',
        campos: [
            { chave: 'situacao', label: 'Situação', prop: 'situacao' },
            { chave: 'conservacao', label: 'Conservação', prop: 'conservacao' },
            { chave: 'repor', label: 'Repor', prop: 'reposicao', aliases: ['Repor', 'Reposição', 'Reposicao'] },
        ],
    },
    {
        classe: 'ficha-grupo-amarelo',
        campos: [
            { chave: 'utilizacao', label: 'Utilização', prop: 'utilizacao' },
            { chave: 'formalidade', label: 'Formalidade', prop: 'formalidade' },
            { chave: 'nivel_aquecimento', label: 'Nível de aquecimento', prop: 'nivel_aquecimento' },
        ],
    },
    {
        classe: 'ficha-grupo-verde-claro',
        campos: [
            { chave: 'padronagem', label: 'Padronagem', prop: 'padronagem' },
            { chave: 'modelagem', label: 'Modelagem', aliases: ['Modelagem'] },
            { chave: 'tom', label: 'Tom', prop: 'tom' },
            { chave: 'cor_detalhe', label: 'Cor detalhe', prop: 'cor_detalhe' },
            { chave: 'cor', label: 'Cor', prop: 'cor' },
            { chave: 'tendencia', label: 'Tendência', prop: 'tendencia' },
        ],
    },
    {
        classe: 'ficha-grupo-azul-claro',
        campos: [
            { chave: 'data_aquisicao', label: 'Data aquisição', aliases: ['Data aquisição', 'Data aquisicao'], tipo: 'data' },
            { chave: 'data_revisao', label: 'Data revisão', prop: 'data_revisao', aliases: ['Data revisão', 'Data revisao'], tipo: 'data' },
            { chave: 'data_descarte', label: 'Data descarte', aliases: ['Data descarte'], tipo: 'data' },
        ],
    },
    {
        classe: 'ficha-grupo-laranja',
        campos: [
            { chave: 'info_fotos', label: 'Info e fotos', prop: 'info_fotos', aliases: ['Info e fotos', 'Info/fotos', 'Info fotos', 'Fotos'] },
            { chave: 'combinacoes', label: 'Combinação', prop: 'combinacoes', aliases: ['Combinação', 'Combinacao', 'Combinações', 'Combinacoes'] },
        ],
    },
    {
        classe: 'ficha-grupo-rosa',
        campos: [
            { chave: 'marca', label: 'Marca', aliases: ['Marca'] },
            { chave: 'loja', label: 'Loja', aliases: ['Loja'] },
            { chave: 'tamanho', label: 'Tamanho', aliases: ['Tamanho'] },
            { chave: 'custo', label: 'Custo', aliases: ['Custo'] },
        ],
    },
    {
        classe: 'ficha-grupo-marrom',
        campos: [
            { chave: 'no_lugar_de', label: 'No lugar de', prop: 'no_lugar_de', aliases: ['No lugar de', 'no lugar de'] },
            { chave: 'substituida_por', label: 'Substituída por', prop: 'substituida_por', aliases: ['Substituída por', 'Substituida por', 'substituida por'] },
        ],
    },
];
const GRUPOS_REGISTRO_PECAS = [
    { id: 'roupas-principais', titulo: 'Blusas, calças, casacos e inteiros', tipos: ['blusa', 'calça', 'casaco', 'inteiro'] },
    { id: 'intimas-funcionais', titulo: 'Sutiãs, calcinhas, modeladores, tops e segunda pele', tipos: ['sutien', 'calcinha', 'modelador', 'top', 'segunda-pele'] },
    { id: 'pijamas', titulo: 'Pijamas', tipos: ['pijama'] },
    { id: 'meias-calcados', titulo: 'Meias e calçados', tipos: ['meia', 'calçado'] },
    { id: 'bijus', titulo: 'Bijus', tipos: ['biju'] },
    { id: 'acessorios', titulo: 'Bolsas, cintos, para a cabeça e para o pescoço', tipos: ['bolsa', 'cinto', 'pra cabeça', 'pro pescoço'] },
    { id: 'praia', titulo: 'Roupa de praia', tipos: ['roupa de praia'] },
];

const app = {
    // Dados carregados do JSON (nunca mudam)
    pecas: {},
    pecasPersonalizadas: {},
    looks: {},
    mapaOcasioesBase: {},
    ocasioesPersonalizadas: {},
    mapaOcasioes: {},
    climas: {},
    dimensoes: {},
    validacaoDimensoes: {},
    ocasioes: ['Trabalho', 'Casual', 'Festa', 'Treino', 'Casa', 'Sair'],

    // Dados do usuário (salvos em localStorage)
    historico: [],           // Lista de {data, pecas, lookId?}
    looksFavoritos: {},      // Meus próprios looks criados {id: {nome, pecas, ocasiao}}
    looksEmExibicao: [],
    limiteLooksExibidos: 0,
    timeoutFiltroPecasLooks: null,

    // Estado temporário (mudam conforme usuário interage)
    pecasSelecionadasHoje: [],
    looksSelecionadosHoje: [],
    pecasSelecionadasLookHistorico: {},
    diaCriacaoLookHistorico: null,
    fotoNovoLookHistorico: null,
    pecaEmDetalhes: null,
    mesCalendarioHistorico: null,
    mesCalendarioRegistro: null,
    filtroHistoricoAtivo: null,
    resumoHistoricoTipo: 'looks',
    filtrosResumoHistorico: { categoria: '', utilizacao: '' },
    ordenacaoResumoHistorico: { campo: 'periodo', direcao: 'desc' },
    registrosHistoricoPeriodo: [],
    importacaoHistoricoPendente: null,
    supabase: null,
    usuarioSupabase: null,
    sincronizando: false,
    ultimaSincronizacaoSupabase: null,
    supabaseSuportaPecas: true,
    supabaseSuportaOcasioes: true,
    forcarEnvioLocalSupabase: false,
    recuperandoSenhaSupabase: false,
    statusSupabaseAtual: '',
    
    // Filtros da página Home
    filtrosHome: Object.fromEntries(CAMPOS_FILTROS_PECAS.map(campo => [campo, []])),
    
    // Filtros da aba "Usar Hoje"
    filtrosHoje: Object.fromEntries(CAMPOS_FILTROS_GERAIS_HOJE.map(campo => [campo, []])),
    filtrosHojeGrupos: Object.fromEntries(GRUPOS_REGISTRO_PECAS.map(grupo => [grupo.id, { tipo: [], subtipo: [] }])),

    // Filtros da página Looks
    filtrosLooks: {
        ...Object.fromEntries(CAMPOS_FILTROS_LOOKS_MULTIPLOS.map(campo => [campo, []])),
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
    editandoOcasiao: false,
    looksOcasioesSelecionados: [],
    dropdownOcasioesAberto: null,

    // Filtros do card "Não uso há..." no histórico
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
        utilizacao: '',
        categoria: '',
        peca1: '',
        peca2: '',
        peca3: '',
    },
    looksPecaSelecionados: [],
};

/* ==================== INICIALIZAR A APP ====================
   Chamado quando a página carrega. É o "ponto de entrada" */

async function inicializar() {
    configurarTemaVisual();
    console.log('🚀 Inicializando aplicação...');

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
    configurarEventosRegistro();
    configurarEventosHistorico();
    inicializarPaginaOcasioes();
    await inicializarSupabase();
    atualizarDataHoje();

    console.log('✅ App inicializada!');
}

/* ==================== FUNÇÃO HELPER: OBTER CAMINHO DA FOTO ====================
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

function criarImagem(src, alt, classe = '', opcoes = {}) {
    const loading = opcoes.loading || 'lazy';
    const fetchPriority = opcoes.fetchPriority ? ` fetchpriority="${escapeHtml(opcoes.fetchPriority)}"` : '';
    return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" class="${escapeHtml(classe)}" loading="${escapeHtml(loading)}" decoding="async"${fetchPriority} onerror="${onErrorImagem()}">`;
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

function formatarValorCampoFichaPeca(valor, tipo) {
    if (!valorVisivel(valor)) return '';
    if (tipo === 'dataHoraAtualizacao') return formatarDataHoraFicha(valor);
    if (tipo === 'data') return formatarDataBR(valor);
    return valor;
}

function obterValorCampoFichaPeca(peca, campo, dataAtualizacao) {
    if (campo.tipo === 'dataHoraAtualizacao') return dataAtualizacao || '';

    const detalhes = detalhesParaObjeto(peca?.detalhes);
    return peca?.[campo.prop]
        || obterCampoPorNomes(peca, campo.aliases || [])
        || obterCampoPorNomes(detalhes, campo.aliases || [campo.label])
        || '';
}

function criarCampoFichaHtml(label, valor, classeGrupo = '') {
    return `
        <div class="campo-card-peca ${classeGrupo}">
            <span>${escapeHtml(label)}</span>
            <strong>${escapeHtml(valor)}</strong>
        </div>
    `;
}

function obterClasseGrupoFichaPecaPorLabel(label) {
    const labelNormalizado = normalizarTexto(label);
    const grupo = GRUPOS_FICHA_PECA.find(item =>
        item.campos.some(campo =>
            normalizarTexto(campo.label) === labelNormalizado
            || normalizarTexto(campo.prop) === labelNormalizado
            || (campo.aliases || []).some(alias => normalizarTexto(alias) === labelNormalizado)
        )
    );
    return grupo?.classe || 'ficha-grupo-outros';
}

function obterDefinicoesCamposEdicaoPeca() {
    const camposEditaveis = new Map([
        ['tipo', { campo: 'tipo', label: 'Tipo', obrigatorio: true }],
        ['funcao', { campo: 'funcao', label: 'Função' }],
        ['subtipo', { campo: 'subtipo', label: 'Subtipo' }],
        ['local', { campo: 'local', label: 'Local' }],
        ['alocacao', { campo: 'alocacao', label: 'Alocação' }],
        ['situacao', { campo: 'situacao', label: 'Situação' }],
        ['conservacao', { campo: 'conservacao', label: 'Conservação' }],
        ['reposicao', { campo: 'reposicao', label: 'Reposição' }],
        ['utilizacao', { campo: 'utilizacao', label: 'Utilização' }],
        ['formalidade', { campo: 'formalidade', label: 'Formalidade' }],
        ['nivel_aquecimento', { campo: 'nivel_aquecimento', label: 'Nível de aquecimento' }],
        ['padronagem', { campo: 'padronagem', label: 'Padronagem' }],
        ['tom', { campo: 'tom', label: 'Tom' }],
        ['cor_detalhe', { campo: 'cor_detalhe', label: 'Cor detalhe' }],
        ['cor', { campo: 'cor', label: 'Cor' }],
        ['tendencia', { campo: 'tendencia', label: 'Tendência' }],
    ]);

    return GRUPOS_FICHA_PECA
        .flatMap(grupo => grupo.campos
            .filter(campoGrupo => !['id', 'data_atualizacao'].includes(campoGrupo.chave))
            .map(campoGrupo => {
                const campoEditavel = camposEditaveis.get(campoGrupo.chave) || camposEditaveis.get(campoGrupo.prop);
                if (campoEditavel) {
                    return {
                        ...campoEditavel,
                        tipoEdicao: 'campo',
                        classe: grupo.classe,
                    };
                }

                return {
                    campo: campoGrupo.aliases?.[0] || campoGrupo.label,
                    label: campoGrupo.label,
                    prop: campoGrupo.prop,
                    aliases: campoGrupo.aliases || [],
                    tipo: campoGrupo.tipo,
                    tipoEdicao: 'detalhe',
                    classe: grupo.classe,
                };
            }));
}

function criarCamposPecaHtml(peca, compacto = false, dataAtualizacao = obterDataAtualizacaoPeca(peca)) {
    const camposUsados = new Set();
    const camposOrdenados = [];

    GRUPOS_FICHA_PECA.forEach(grupo => {
        grupo.campos.forEach(campo => {
            camposUsados.add(normalizarTexto(campo.label));
            (campo.aliases || []).forEach(alias => camposUsados.add(normalizarTexto(alias)));

            const valor = formatarValorCampoFichaPeca(
                obterValorCampoFichaPeca(peca, campo, dataAtualizacao),
                campo.tipo
            );

            camposOrdenados.push([campo.label, valor || '-', grupo.classe]);
        });
    });

    const extras = (peca.detalhes || [])
        .filter(item => valorVisivel(item?.campo) || valorVisivel(item?.valor))
        .filter(item => !camposUsados.has(normalizarTexto(item?.campo)))
        .map(item => [formatarLabelCampo(item.campo), item.valor || '-', 'ficha-grupo-outros']);

    const campos = [...camposOrdenados, ...extras];
    const limite = compacto ? 6 : campos.length;

    return campos.slice(0, limite)
        .map(([label, valor, classeGrupo]) => criarCampoFichaHtml(label, valor, classeGrupo))
        .join('');
}

function normalizarListaPeca(valor) {
    if (!valor) return [];
    return Array.isArray(valor) ? valor : [valor];
}

function criarMiniaturaPeca(item, opcoes = {}) {
    const id = item.id || item.codigo || '';
    const descricao = item.descricao || item.grupo || id;
    const foto = opcoes.foto || item.foto || (app.pecas[id] ? getCaminhoFoto(id) : '');
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
                ${restricoes.map(item => criarMiniaturaPeca(item, {
                    foto: `fotos/combinacoes/${item.codigo}.webp`,
                })).join('')}
            </div>
        </div>
    `;
}

function criarCardPeca(peca, indice = 0) {
    const card = document.createElement('div');
    card.className = 'card-peca';
    const textoBusca = obterTextoBuscaPeca(peca);
    const imagemPrioritaria = indice < 9;

    card.dataset.textoBusca = textoBusca.toLowerCase();
    card.innerHTML = `
        ${criarImagem(getCaminhoFoto(peca.id), peca.tipo || peca.id, 'foto-card-peca', {
            loading: imagemPrioritaria ? 'eager' : 'lazy',
            fetchPriority: imagemPrioritaria ? 'high' : 'low',
        })}
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
    return look?.basicos?.['Data criação'] || look?.dataCriacao || look?.data_criacao || '';
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
        info_fotos: 'Info e fotos',
        combinacoes: 'Combinação',
        modelagem: 'Modelagem',
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

function criarFiltroMultiplo(container, campo, valores, selecionados, aoAlterar, opcoesFiltro = {}) {
    const filtro = document.createElement('div');
    filtro.className = ['filtro-multiplo', opcoesFiltro.classeGrupo || obterClasseGrupoFiltroPeca(campo)].filter(Boolean).join(' ');

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
        const textoExibido = corrigirTextoMojibake(valor);
        texto.textContent = textoExibido.charAt(0).toUpperCase() + textoExibido.slice(1);
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

function obterClasseGrupoFiltroPeca(campo) {
    if (campo === 'cor') return 'ficha-grupo-verde-claro';
    if (campo === 'modelagem') return 'ficha-grupo-verde-claro';
    if (campo === 'info_fotos' || campo === 'combinacoes') return 'ficha-grupo-laranja';
    return obterClasseGrupoFichaPecaPorLabel(campo);
}

function obterClasseGrupoFiltroLook(campo) {
    return {
        pecas: 'ficha-grupo-laranja',
        categoria: 'ficha-grupo-vermelho',
        indicador: 'ficha-grupo-vermelho',
        local: 'ficha-grupo-roxo',
        situacao: 'ficha-grupo-verde',
        utilizacao: 'ficha-grupo-amarelo',
        clima: 'ficha-grupo-amarelo',
        htt: 'ficha-grupo-rosa',
        ocasiao: 'ficha-grupo-azul-claro',
    }[campo] || 'ficha-grupo-outros';
}

document.addEventListener('click', evento => {
    const botaoEditarLoteLooks = evento.target.closest('[data-editar-lote-looks]');
    if (botaoEditarLoteLooks) {
        evento.preventDefault();
        abrirEdicaoLoteLooksPeca();
        return;
    }

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

        const corresponde = Array.isArray(valores) && valores.some(valor =>
            normalizarTexto(valor) === normalizarTexto(peca[campo])
        );
        if (Array.isArray(valores) && valores.length > 0 && !corresponde) {
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
        const response = await fetch('dados_guarda_roupa.json?v=20260731-utilizacoes-looks', { cache: 'no-store' });
        
        // .json() = transforma texto em objeto JavaScript
        const dados = await response.json();

        // Atribui ao app
        app.pecas = dados.pecas;
        app.looks = dados.looks;
        app.mapaOcasioesBase = dados.ocasioes || {};
        app.mapaOcasioes = { ...app.mapaOcasioesBase };
        app.climas = dados.climas || {};
        app.dimensoes = dados.dimensoes || {};
        app.validacaoDimensoes = dados.validacao_dimensoes || {};
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
        const pecasSalvas = localStorage.getItem('app_pecas_personalizadas');
        app.pecasPersonalizadas = pecasSalvas ? JSON.parse(pecasSalvas) : {};
        if (!app.pecasPersonalizadas || Array.isArray(app.pecasPersonalizadas)) app.pecasPersonalizadas = {};
        aplicarPecasPersonalizadas();
        Object.values(app.pecas).forEach(normalizarDimensoesPeca);
    } catch (erro) {
        console.warn('Peças personalizadas inválidas. Ignorando alterações locais.', erro);
        app.pecasPersonalizadas = {};
    }

    try {
        const historicoSalvo = localStorage.getItem('app_historico');
        app.historico = historicoSalvo ? JSON.parse(historicoSalvo) : [];
        if (!Array.isArray(app.historico)) app.historico = [];
        if (limparAgendamentosExpirados()) salvarDadosLocal();
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

    try {
        const ocasioesSalvas = localStorage.getItem('app_ocasioes_personalizadas');
        app.ocasioesPersonalizadas = ocasioesSalvas ? JSON.parse(ocasioesSalvas) : {};
        if (!app.ocasioesPersonalizadas || Array.isArray(app.ocasioesPersonalizadas)) app.ocasioesPersonalizadas = {};
        aplicarOcasioesPersonalizadas();
    } catch (erro) {
        console.warn('Ocasiões personalizadas inválidas. Ignorando alterações locais.', erro);
        app.ocasioesPersonalizadas = {};
        aplicarOcasioesPersonalizadas();
    }

    if (Object.keys(app.pecasPersonalizadas || {}).length > 0 || Object.keys(app.ocasioesPersonalizadas || {}).length > 0) {
        salvarDadosLocal();
    }

    console.log(`✅ Carregados ${app.historico.length} registros do histórico`);
    console.log(`✅ Carregados ${Object.keys(app.looksFavoritos).length} looks favoritos`);
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
            ...normalizarMapaFiltrosArrays(estado.filtrosLooks, CAMPOS_FILTROS_LOOKS_MULTIPLOS),
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
        app.filtrosResumoHistorico = {
            categoria: estado.filtrosResumoHistorico?.categoria || '',
            utilizacao: estado.filtrosResumoHistorico?.utilizacao || '',
        };
        app.ordenacaoResumoHistorico = {
            campo: estado.ordenacaoResumoHistorico?.campo || 'periodo',
            direcao: estado.ordenacaoResumoHistorico?.direcao === 'asc' ? 'asc' : 'desc',
        };
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
            filtrosResumoHistorico: clonarEstado(app.filtrosResumoHistorico, {}),
            ordenacaoResumoHistorico: clonarEstado(app.ordenacaoResumoHistorico, {}),
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

function salvarDados(opcoes = {}) {
    // localStorage.setItem() = salva um valor
    // JSON.stringify() = transforma objeto em texto
    const incluirLooks = opcoes.incluirLooks !== false;

    limparAgendamentosExpirados();
    app.mapaUsosLooksAtual = null;
    app.indiceLooksPorPecasAtual = null;

    localStorage.setItem('app_historico', JSON.stringify(app.historico));
    if (incluirLooks) localStorage.setItem('app_looks_favs', JSON.stringify(app.looksFavoritos));
    localStorage.setItem('app_pecas_personalizadas', JSON.stringify(app.pecasPersonalizadas));

    console.log('💾 Dados salvos!');
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
        const baixou = await baixarDadosSupabase({ silencioso: true });
        if (baixou && app.supabaseSuportaPecas && app.supabaseSuportaOcasioes) {
            atualizarStatusSupabase('Conectado. Dados do app atualizados pela nuvem.', 'sucesso');
        } else if (baixou) {
            atualizarStatusSupabase('Conectado, mas falta atualizar o schema para sincronizar todas as edições.', 'erro');
        }
    } else {
        atualizarStatusSupabase('Entre na sua conta para sincronizar peças, looks e histórico.');
    }

    app.supabase.auth.onAuthStateChange(async (event, session) => {
        app.usuarioSupabase = session?.user || null;
        if (event === 'PASSWORD_RECOVERY') {
            app.recuperandoSenhaSupabase = true;
            atualizarStatusSupabase('Link de recuperação validado. Digite sua nova senha.', 'sucesso');
        }
        atualizarUISupabase(app.usuarioSupabase);
        if (app.usuarioSupabase && !app.recuperandoSenhaSupabase) {
            const baixou = await baixarDadosSupabase({ silencioso: true });
            if (baixou && app.supabaseSuportaPecas && app.supabaseSuportaOcasioes) {
                atualizarStatusSupabase('Conta conectada e dados atualizados.', 'sucesso');
            } else if (baixou) {
                atualizarStatusSupabase('Conta conectada, mas falta atualizar o schema para sincronizar todas as edições.', 'erro');
            }
        } else if (!app.recuperandoSenhaSupabase) {
            atualizarStatusSupabase('Entre na sua conta para sincronizar peças, looks e histórico.');
        }
    });
}

function configurarEventosSupabase() {
    const eventos = [
        ['supabase-entrar', entrarSupabase],
        ['supabase-criar-conta', criarContaSupabase],
        ['supabase-sair', sairSupabase],
        ['supabase-sincronizar', sincronizarSupabase],
        ['supabase-baixar', confirmarBaixarDadosSupabase],
        ['supabase-enviar', confirmarEnviarDadosSupabase],
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
    app.statusSupabaseAtual = tipo || (app.usuarioSupabase ? 'conectado' : 'desconectado');
    const status = document.getElementById('supabase-status');
    if (status) {
        status.textContent = mensagem;
        status.className = `texto-ajuda ${tipo}`.trim();
    }

    const botao = document.getElementById('supabase-global-toggle');
    if (botao) {
        botao.dataset.status = app.statusSupabaseAtual;
        botao.title = mensagem;
    }

    atualizarResumoSupabase(mensagem, app.statusSupabaseAtual);
}

function obterHojeISO() {
    return formatarDataInput(new Date());
}

function registroEhAgendamento(registro) {
    return registro?.tipo === TIPO_REGISTRO_AGENDAMENTO || registro?.agendamento === true;
}

function agendamentoExpirado(registro) {
    const dia = obterDiaRegistro(registro);
    return registroEhAgendamento(registro) && dia && dia < obterHojeISO();
}

function limparAgendamentosExpirados() {
    const totalAntes = app.historico.length;
    app.historico = app.historico.filter(registro => !agendamentoExpirado(registro));
    return app.historico.length !== totalAntes;
}

function obterRegistrosUso(registros = app.historico) {
    return (registros || []).filter(registro => !registroEhAgendamento(registro));
}

function obterRegistrosHistoricoAtivos(registros = app.historico) {
    return (registros || []).filter(registro => !agendamentoExpirado(registro));
}

function confirmarBaixarDadosSupabase() {
    const confirmar = window.confirm(
        'Baixar da nuvem vai conferir os dados salvos no Supabase e mesclar com este aparelho. Quer continuar?'
    );
    if (!confirmar) return;
    baixarDadosSupabase();
}

function confirmarEnviarDadosSupabase() {
    const confirmar = window.confirm(
        'Enviar para nuvem vai conferir o Supabase primeiro e depois gravar os dados deste aparelho. Quer continuar?'
    );
    if (!confirmar) return;
    enviarDadosSupabase();
}

function obterLabelEstadoSupabase(tipo) {
    if (!supabaseConfigurado()) return 'Indisponível';
    if (tipo === 'erro') return 'Atenção';
    if (tipo === 'sincronizando') return 'Sincronizando';
    if (tipo === 'sucesso' || tipo === 'conectado') return app.usuarioSupabase ? 'Conectada' : 'Pronta';
    return app.usuarioSupabase ? 'Conectada' : 'Desconectada';
}

function formatarUltimaSincronizacaoSupabase(data = app.ultimaSincronizacaoSupabase) {
    if (!data) return 'Ainda não confirmada';
    const dataObj = data instanceof Date ? data : new Date(data);
    if (Number.isNaN(dataObj.getTime())) return String(data);
    return dataObj.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function atualizarResumoSupabase(mensagem = '', tipo = app.statusSupabaseAtual) {
    const estado = document.getElementById('supabase-estado-resumo');
    const ultima = document.getElementById('supabase-ultima-sync');
    const dados = document.getElementById('supabase-dados-resumo');

    if (estado) estado.textContent = obterLabelEstadoSupabase(tipo);
    if (ultima) ultima.textContent = formatarUltimaSincronizacaoSupabase();
    if (dados) {
        const partes = ['histórico', 'looks'];
        partes.push(app.supabaseSuportaPecas === false ? 'peças pendentes de schema' : 'peças');
        partes.push(app.supabaseSuportaOcasioes === false ? 'ocasiões pendentes de schema' : 'ocasiões');
        dados.textContent = partes.join(', ');
    }

    const labelGlobal = document.getElementById('supabase-global-label');
    if (labelGlobal && mensagem && tipo === 'sincronizando') {
        labelGlobal.textContent = 'Sincronizando';
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
        labelGlobal.textContent = !configurado ? 'Nuvem indisponível' : (usuario ? 'Nuvem conectada' : 'Conectar nuvem');
    }
    atualizarResumoSupabase('', app.statusSupabaseAtual);

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
        alert('Digite seu email para receber o link de recuperação.');
        return;
    }

    atualizarStatusSupabase('Enviando email de recuperação...');
    const { error } = await app.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: obterUrlRedirectSupabase(),
    });

    if (error) {
        atualizarStatusSupabase(error.message, 'erro');
        return;
    }

    atualizarStatusSupabase('Email de recuperação enviado. Abra o link no mesmo app para definir a nova senha.', 'sucesso');
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
        alert('As senhas não conferem.');
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
    atualizarStatusSupabase('Senha atualizada. Você já está conectada.', 'sucesso');
    await baixarDadosSupabase({ silencioso: true });
}

function cancelarRecuperacaoSenhaSupabase() {
    app.recuperandoSenhaSupabase = false;
    document.getElementById('supabase-nova-senha').value = '';
    document.getElementById('supabase-confirmar-senha').value = '';
    atualizarUISupabase(app.usuarioSupabase);
    atualizarStatusSupabase('Recuperação de senha cancelada.');
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
        atualizarStatusSupabase('Conta criada. Confirme o email se o Supabase pediu confirmação, depois volte aqui e clique em Entrar.', 'sucesso');
        return;
    }

    app.usuarioSupabase = data.session.user;
    atualizarUISupabase(app.usuarioSupabase);
    const enviou = await enviarDadosSupabase({ silencioso: true });
    atualizarStatusSupabase('Conta criada. Se o Supabase pedir confirmação de email, confirme antes do próximo login.', 'sucesso');
    atualizarStatusSupabase(
        enviou ? 'Conta criada e sincronizada com a nuvem.' : 'Conta criada, mas ainda não consegui gravar na tabela. Clique em Sincronizar novamente.',
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
        atualizarStatusSupabase('Não consegui baixar os dados atuais da nuvem antes de sincronizar.', 'erro');
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
        .select('historico, looks_favoritos, pecas_personalizadas, ocasioes_personalizadas')
        .eq('user_id', app.usuarioSupabase.id)
        .maybeSingle();

    app.supabaseSuportaPecas = !(error && /pecas_personalizadas/i.test(`${error.message || ''} ${error.details || ''}`));
    app.supabaseSuportaOcasioes = !(error && /ocasioes_personalizadas/i.test(`${error.message || ''} ${error.details || ''}`));
    if (!app.supabaseSuportaPecas || !app.supabaseSuportaOcasioes) {
        const colunas = ['historico', 'looks_favoritos'];
        if (app.supabaseSuportaPecas) colunas.push('pecas_personalizadas');
        if (app.supabaseSuportaOcasioes) colunas.push('ocasioes_personalizadas');
        ({ data, error } = await app.supabase
            .from('wardrobe_sync')
            .select(colunas.join(', '))
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

    app.ultimaSincronizacaoSupabase = new Date();
    if (!silencioso) atualizarStatusSupabase('Dados baixados e mesclados.', 'sucesso');
    else atualizarResumoSupabase('', 'sucesso');
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
            if (!silencioso) atualizarStatusSupabase('Não enviei porque não consegui conferir a nuvem primeiro.', 'erro');
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
            ocasioes_personalizadas: app.ocasioesPersonalizadas,
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
                if (!silencioso) atualizarStatusSupabase('Não enviei porque não consegui conferir a nuvem primeiro.', 'erro');
                return false;
            }
        }

        const montarPayload = (incluirPecas, incluirOcasioes) => ({
            user_id: app.usuarioSupabase.id,
            historico: app.historico,
            looks_favoritos: app.looksFavoritos,
            ...(incluirPecas ? { pecas_personalizadas: app.pecasPersonalizadas } : {}),
            ...(incluirOcasioes ? { ocasioes_personalizadas: app.ocasioesPersonalizadas } : {}),
            updated_at: new Date().toISOString(),
        });

        const enviarPayload = (incluirPecas, incluirOcasioes) => app.supabase
            .from('wardrobe_sync')
            .upsert(montarPayload(incluirPecas, incluirOcasioes), { onConflict: 'user_id' })
            .select('updated_at')
            .single();

        let { data, error } = await enviarPayload(app.supabaseSuportaPecas !== false, app.supabaseSuportaOcasioes !== false);

        if (error && /pecas_personalizadas|ocasioes_personalizadas/i.test(`${error.message || ''} ${error.details || ''}`)) {
            const textoErro = `${error.message || ''} ${error.details || ''}`;
            if (/pecas_personalizadas/i.test(textoErro)) app.supabaseSuportaPecas = false;
            if (/ocasioes_personalizadas/i.test(textoErro)) app.supabaseSuportaOcasioes = false;
            ({ data, error } = await enviarPayload(app.supabaseSuportaPecas !== false, app.supabaseSuportaOcasioes !== false));
        }

        if (error) {
            console.error('Erro ao enviar para Supabase:', error);
            atualizarStatusSupabase(`Erro ao enviar: ${error.message}`, 'erro');
            return false;
        }

        if (!silencioso) {
            const avisoPecas = app.supabaseSuportaPecas === false
                ? ' Peças personalizadas ainda não foram enviadas porque falta atualizar o schema do Supabase.'
                : '';
            const avisoOcasioes = app.supabaseSuportaOcasioes === false
                ? ' Ocasiões editadas ainda não foram enviadas porque falta atualizar o schema do Supabase.'
                : '';
            atualizarStatusSupabase(
                `Dados enviados para a nuvem (${app.historico.length} registros, ${Object.keys(app.looksFavoritos).length} looks criados). Última gravação: ${formatarDataHoraSupabase(data?.updated_at)}.${avisoPecas}${avisoOcasioes}`,
                'sucesso'
            );
        }
        app.ultimaSincronizacaoSupabase = data?.updated_at ? new Date(data.updated_at) : new Date();
        atualizarResumoSupabase('', 'sucesso');
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
    atualizarStatusSupabase('Alterações locais aguardando sincronização.', 'sincronizando');
    app.timeoutSyncSupabase = window.setTimeout(async () => {
        atualizarStatusSupabase('Sincronizando alterações com a nuvem...', 'sincronizando');
        const enviou = await enviarDadosSupabase({ silencioso: true, mesclarAntes });
        if (enviou) {
            app.ultimaSincronizacaoSupabase = new Date();
            atualizarStatusSupabase(
                `Sincronizado automaticamente às ${app.ultimaSincronizacaoSupabase.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.`,
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

function detalhesParaObjeto(detalhes) {
    return Object.fromEntries((detalhes || []).map(item => [item.campo, item.valor]));
}

function obterDetalhePorAliases(detalhes, aliases) {
    const aliasesNormalizados = new Set((aliases || []).map(normalizarTexto));
    return (detalhes || []).find(item => aliasesNormalizados.has(normalizarTexto(item?.campo)));
}

function obterValorCampoImportadoPeca(peca, definicao) {
    return peca?.[definicao.prop]
        || obterCampoPorNomes(peca, definicao.aliases)
        || obterCampoPorNomes(detalhesParaObjeto(peca?.detalhes), definicao.aliases)
        || '';
}

function preservarDetalhesImportadosPeca(origem, detalhesEditados) {
    const detalhes = Array.isArray(detalhesEditados) ? [...detalhesEditados] : [];
    const camposExistentes = new Set(detalhes.map(item => normalizarTexto(item?.campo)));

    CAMPOS_IMPORTADOS_PECA.forEach(definicao => {
        if (definicao.aliases.some(alias => camposExistentes.has(normalizarTexto(alias)))) return;

        const valor = obterValorCampoImportadoPeca(origem, definicao);
        if (!valorVisivel(valor)) return;

        detalhes.push({
            campo: definicao.aliases[0],
            valor,
        });
    });

    return detalhes;
}

function mesclarPecaPersonalizadaComBase(pecaBase = {}, pecaPersonalizada = {}) {
    const peca = {
        ...pecaBase,
        ...pecaPersonalizada,
    };

    CAMPOS_IMPORTADOS_PECA.forEach(definicao => {
        const detalhePersonalizado = obterDetalhePorAliases(pecaPersonalizada?.detalhes, definicao.aliases);
        if (detalhePersonalizado) {
            if (valorVisivel(detalhePersonalizado.valor)) {
                peca[definicao.prop] = detalhePersonalizado.valor;
            } else {
                delete peca[definicao.prop];
            }
            return;
        }

        const valor = obterValorCampoImportadoPeca(pecaPersonalizada, definicao)
            || obterValorCampoImportadoPeca(pecaBase, definicao);
        if (valorVisivel(valor)) peca[definicao.prop] = valor;
    });

    peca.detalhes = preservarDetalhesImportadosPeca(
        peca,
        Array.isArray(pecaPersonalizada.detalhes) ? pecaPersonalizada.detalhes : pecaBase.detalhes
    );

    return peca;
}

function aplicarPecasPersonalizadas() {
    const pecasBase = { ...app.pecas };
    const personalizadas = {};

    Object.entries(app.pecasPersonalizadas || {}).forEach(([id, pecaPersonalizada]) => {
        personalizadas[id] = mesclarPecaPersonalizadaComBase(pecasBase[id], pecaPersonalizada);
    });

    app.pecasPersonalizadas = personalizadas;
    app.pecas = { ...pecasBase, ...personalizadas };
}

function aplicarOcasioesPersonalizadas() {
    const base = { ...(app.mapaOcasioesBase || app.mapaOcasioes || {}) };
    Object.entries(app.ocasioesPersonalizadas || {}).forEach(([codigo, ocasiao]) => {
        if (!ocasiao || typeof ocasiao !== 'object') return;
        if (ocasiao.removida) {
            delete base[codigo];
            return;
        }
        base[codigo] = {
            ...(base[codigo] || {}),
            ...ocasiao,
            codigo,
        };
    });
    app.mapaOcasioes = base;
    const tiposOcasiao = [...new Set(Object.values(app.mapaOcasioes).map(item => item.tipo).filter(Boolean))];
    if (tiposOcasiao.length > 0) app.ocasioes = tiposOcasiao;
}

function obterDataAtualizacaoLook(look) {
    if (valorVisivel(look?.editadoEm)) return look.editadoEm;

    const dataUltimaAlteracao = obterDataUltimaAlteracaoLook(look);
    if (valorVisivel(dataUltimaAlteracao)) return dataUltimaAlteracao;

    return obterDataCriacaoLook(look);
}

function obterDataAtualizacaoPeca(peca) {
    return obterDataAtualizacaoTabelaPeca(peca);
}

function obterDataRevisaoPeca(peca) {
    if (valorVisivel(peca?.data_revisao)) return peca.data_revisao;
    if (valorVisivel(peca?.dataRevisao)) return peca.dataRevisao;

    return obterCampoPorNomes(
        Object.fromEntries((peca?.detalhes || []).map(item => [item.campo, item.valor])),
        ['Data revisão', 'Data revisao']
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
        ['Data atualização', 'Data atualizacao', 'Data última alteração', 'Data ultima alteracao', 'Última atualização', 'Ultima atualizacao']
    );
}

function salvarDadosLocal() {
    localStorage.setItem('app_historico', JSON.stringify(app.historico));
    localStorage.setItem('app_looks_favs', JSON.stringify(app.looksFavoritos));
    localStorage.setItem('app_pecas_personalizadas', JSON.stringify(app.pecasPersonalizadas));
    localStorage.setItem('app_ocasioes_personalizadas', JSON.stringify(app.ocasioesPersonalizadas));
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

function timestampOcasiaoSync(ocasiao) {
    return timestampValor(ocasiao?.editadaEm || ocasiao?.updatedAt || ocasiao?.updated_at || ocasiao?.data_revisao);
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
    app.ocasioesPersonalizadas = mesclarMapaPorMaisRecente(app.ocasioesPersonalizadas, data.ocasioes_personalizadas || {}, timestampOcasiaoSync);
    aplicarPecasPersonalizadas();
    aplicarOcasioesPersonalizadas();
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
        alert('Escolha um arquivo de histórico primeiro.');
        return;
    }

    atualizarStatusImportacao('Lendo arquivo...');

    try {
        const linhas = await lerTabelaHistorico(arquivo);
        const registros = normalizarLinhasHistorico(linhas);

        if ((registros.ignorados || 0) > 0) {
            alert(`${registros.ignorados} linha(s) não tinham data ou peça/look reconhecido e foram ignoradas.`);
        }

        const plano = prepararImportacaoHistorico(registros);
        if (plano.conflitos.length > 0) {
            app.importacaoHistoricoPendente = { ...plano, ignorados: registros.ignorados || 0 };
            mostrarConflitosImportacaoHistorico();
            atualizarStatusImportacao(`${plano.conflitos.length} dia(s) precisam de revisão antes de importar.`, 'erro');
            return;
        }

        const resultado = aplicarPlanoImportacaoHistorico(plano);
        finalizarImportacaoHistorico(resultado, registros.ignorados || 0);

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
    return corrigirTextoMojibake(texto)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9_]/g, '')
        .toLowerCase();
}

function corrigirTextoMojibake(texto) {
    let resultado = String(texto || '');

    for (let tentativa = 0; tentativa < 2 && /[\u00c3\u00c2]/.test(resultado); tentativa++) {
        try {
            resultado = decodeURIComponent(escape(resultado));
        } catch {
            break;
        }
    }

    return resultado;
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
    const existentesPorDia = agruparRegistrosPorDia(obterRegistrosUso(app.historico || []));
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
    // chaveRegistroHistorico usa somente os looks gravados no registro.
    // Looks inferidos pelas pecas nao participam da comparacao de importacao.
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
        `Importação concluída: ${resultado.adicionados} novo(s), ${resultado.substituidos || 0} substituído(s), ${resultado.duplicados} duplicado(s) ignorado(s), ${resultado.mantidos || 0} mantido(s) no app${ignorados ? `, ${ignorados} linha(s) ignorada(s)` : ''}.`,
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
                <span>${conflito.existentes.length} registro(s) no app · ${conflito.importados.length} registro(s) no arquivo</span>
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
                    <option value="manter">Manter como está no app</option>
                    <option value="adicionar">Adicionar registros do arquivo</option>
                    <option value="substituir">Substituir este dia pelo arquivo</option>
                </select>
            </label>
        </div>
    `).join('');

    abrirModalEmpilhado(modal);
}

function resumirRegistrosHistoricoConflito(registros) {
    if (!registros?.length) return '<p class="texto-ajuda">Nenhum registro.</p>';

    const chavesPecas = registros.map(registro => [...(registro.pecas || [])].sort().join(','));
    const mesmasPecas = chavesPecas.length > 1 && new Set(chavesPecas).size === 1;

    return `
        ${mesmasPecas ? '<p class="texto-ajuda conflito-historico-nota">As linhas abaixo usam as mesmas peças; a diferença está no look vinculado ao registro.</p>' : ''}
        <ul>
            ${registros.slice(0, 4).map((registro, indice) => {
                const looks = obterLookIdsRegistro(registro);
                const pecas = registro.pecas || [];
                const rotulo = looks.length
                    ? `Look vinculado: ${escapeHtml(looks.join(', '))}`
                    : 'Registro sem look vinculado';
                return `<li><strong>${indice + 1}. ${rotulo}</strong><br><span>${pecas.length} peça(s): ${escapeHtml(pecas.slice(0, 6).join(', '))}${pecas.length > 6 ? '...' : ''}</span></li>`;
            }).join('')}
            ${registros.length > 4 ? `<li>...mais ${registros.length - 4} registro(s)</li>` : ''}
        </ul>
    `;
}

function cancelarImportacaoHistoricoComConflitos() {
    app.importacaoHistoricoPendente = null;
    fecharModalEspecifico(document.getElementById('modal-conflitos-historico'));
    const input = document.getElementById('arquivo-historico');
    if (input) input.value = '';
    atualizarStatusImportacao('Importação cancelada. Nenhuma alteração foi aplicada.', 'erro');
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
    fecharModalEspecifico(document.getElementById('modal-conflitos-historico'));
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
    const tipo = registroEhAgendamento(registro) ? TIPO_REGISTRO_AGENDAMENTO : 'uso';
    return `${dia}|${tipo}|${pecas}`;
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
    const tipo = registroEhAgendamento(registro) ? TIPO_REGISTRO_AGENDAMENTO : 'uso';
    return `${dia}|${tipo}|${pecas}|${looks}`;
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
    // Os blocos da aba Registro podem mudar de posição. Preserva todos os looks
    // informados na linha, sem depender das colunas do modelo original.
    (linha || []).forEach(valor => {
        if (!valorVisivel(valor)) return;
        ids.push(...extrairCodigosLook(valor));
    });
    return [...new Set(ids)];
}

function extrairIdsPecasDasColunasRegistro(linha) {
    const ids = [];
    (linha || []).forEach(valor => {
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

/* ==================== NAVEGAÇÃO: MOSTRAR/ESCONDER PÁGINAS ====================
   Sistema de single-page-app: uma página HTML, múltiplas visualizações */

function mostrarPagina(nome) {
    salvarEstadoFiltros();

    // Esconde TODAS as páginas
    // querySelectorAll() = busca todos os elementos com essa classe
    document.querySelectorAll('.pagina').forEach(pagina => {
        pagina.style.display = 'none';
    });

    // Mostra apenas a selecionada
    const pagina = document.getElementById(nome);
    if (pagina) {
        pagina.style.display = '';
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
        renderCalendarioRegistro();
    }

    if (nome === 'looks') {
        renderLooks(obterTodosLooks().filter(lookPassaNosFiltros));
    }

    if (nome === 'ocasioes') {
        inicializarPaginaOcasioes();
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
    Object.values(app.pecas).forEach((peca, indice) => {
        galeria.appendChild(criarCardPeca(peca, indice));
    });

    console.log('🖼️ Galeria renderizada!');
}

/* ==================== FILTROS DA PÁGINA HOME ====================
   Preencher filtros dinamicamente com valores únicos do JSON */

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
    const valoresAtuais = pecasAtuais.map(peca => obterValorFiltroPeca(peca, campo));
    return ordenarOpcoesDimensao([...valoresDimensao, ...valoresAtuais, opcoes.valorAtual]);
}

function obterValorFiltroPeca(peca, campo) {
    if (campo === 'modelagem') return obterValorCampoFichaPeca(peca, { label: 'Modelagem', aliases: ['Modelagem'] });
    if (campo === 'info_fotos') return obterInfoFotosPeca(peca);
    if (campo === 'combinacoes') return obterCombinacoesPeca(peca);
    return peca?.[campo] || '';
}

function preencherFiltrosHome() {
    // Extrair valores únicos para cada campo
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
    
    console.log('📋 Filtros da Home criados!');
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
        galeria.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #999;">Nenhuma peça encontrada para esses filtros.</p>';
        return;
    }

    pecasFiltradas.forEach((peca, indice) => {
        galeria.appendChild(criarCardPeca(peca, indice));
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
            // Se o filtro não está vazio, tem que bater
            if (Array.isArray(filtro) && filtro.length > 0) {
                if (!filtro.includes(obterValorFiltroPeca(peca, campo))) {
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
        galeria.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #999;">Nenhuma peça encontrada para esses filtros.</p>';
        return;
    }

    pecasFiltradas.forEach((peca, indice) => {
        galeria.appendChild(criarCardPeca(peca, indice));
    });

    console.log('🖼️ Galeria filtrada renderizada!');
}

function renderTabelaPecasFiltradas(pecas) {
    const container = document.getElementById('tabela-pecas-filtradas');
    const contagem = document.getElementById('tabela-pecas-contagem');
    if (!container) return;

    if (contagem) {
        contagem.textContent = `${pecas.length} peça${pecas.length === 1 ? '' : 's'}`;
    }

    if (pecas.length === 0) {
        container.innerHTML = '<p class="texto-ajuda">Nenhuma peça encontrada para esses filtros.</p>';
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
    { campo: 'funcao', titulo: 'Função' },
    { campo: 'subtipo', titulo: 'Subtipo' },
    { campo: 'nivel_aquecimento', titulo: 'nivel_aquecimento' },
    { campo: 'utilizacao', titulo: 'Utilização' },
    { campo: 'formalidade', titulo: 'Formalidade' },
    { campo: 'tendencia', titulo: 'Tendência' },
    { campo: 'local', titulo: 'Local' },
    { campo: 'alocacao', titulo: 'Alocação' },
    { campo: 'situacao', titulo: 'Situação' },
    { campo: 'conservacao', titulo: 'Conservação' },
    { campo: 'reposicao', titulo: 'Repor' },
    { campo: 'infoFotos', titulo: 'Info e fotos' },
    { campo: 'combinacao', titulo: 'Combinação' },
    { campo: 'dataRevisao', titulo: 'Data revisão' },
    { campo: 'dataAtualizacao', titulo: 'Data atualização' },
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
    const indicador = ativo ? (direcao === 'desc' ? '↓' : '↑') : '';

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
        || obterCampoPorNomes(peca, ['Combinação', 'Combinacao', 'Combinações', 'Combinacoes'])
        || obterCampoPorNomes(Object.fromEntries((peca?.detalhes || []).map(item => [item.campo, item.valor])), ['Combinação', 'Combinacao', 'Combinações', 'Combinacoes'])
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

/* Filtrar peças por texto na barra de pesquisa */
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
    obterRegistrosUso(obterRegistrosHistoricoEntre(inicio, fim || inicio)).forEach(registro => {
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
    resumo.textContent = `${ids.size} peça${ids.size === 1 ? '' : 's'} usada${ids.size === 1 ? '' : 's'} em ${periodo}.`;
}

function reconstruirFiltrosHome() {
    preencherFiltrosHome();
    renderGaleriaFiltrada();
    filtrarPecas();
}

/* ==================== MODAL: DETALHES DA PEÇA ====================
   Mostra informações completas de uma peça */

function abrirDetalhsPeca(id) {
    const peca = app.pecas[id];
    if (!peca) return;
    const dataAtualizacao = obterDataAtualizacaoPeca(peca);
    const modalPeca = document.getElementById('modal-peca');

    // Guardar referência para usar depois
    app.pecaEmDetalhes = id;

    // Preencher modal com dados
    document.querySelector('#modal-peca .ficha-peca').innerHTML = `
        <div class="campos-modal-peca">
            ${criarCamposPecaHtml(peca, false, dataAtualizacao)}
        </div>
        ${criarAcessoriosHtml(peca)}
        ${criarRestricoesHtml(peca)}
    `;
    document.getElementById('titulo-modal').textContent = `${peca.tipo || peca.id}`;
    atualizarFotoModalPeca(getCaminhoFoto(peca.id));
    document.getElementById('editar-peca-modal').style.display = '';
    document.getElementById('looks-existentes-peca-modal').style.display = '';
    document.getElementById('looks-sugeridos-peca-modal').style.display = pecaPodeAparecerComoSugestaoLook(peca) ? '' : 'none';
    document.getElementById('cancelar-edicao-peca-modal').style.display = 'none';
    document.getElementById('salvar-peca-modal').style.display = 'none';
    document.getElementById('registrar-peca-modal').style.display = '';

    // Mostrar modal
    abrirModalEmpilhado(modalPeca);
}

function mostrarDetalhesPeca(id) {
    abrirDetalhsPeca(id);
}

function abrirLooksExistentesPeca() {
    abrirFichaLooksPeca('existentes');
}

function abrirLooksSugeridosPeca() {
    abrirFichaLooksPeca('sugeridos');
}

function abrirFichaLooksPeca(modo = 'existentes') {
    const pecaId = app.pecaEmDetalhes;
    const peca = app.pecas[pecaId];
    if (!peca) return;
    if (modo === 'sugeridos' && !pecaPodeAparecerComoSugestaoLook(peca)) return;

    app.filtrosLooksPeca = { htt: 'todos', utilizacao: '', categoria: '', peca1: '', peca2: '', peca3: '' };
    app.looksPecaSelecionados = [];

    const modal = document.getElementById('modal-looks-peca');
    modal.dataset.pecaId = pecaId;
    modal.dataset.modo = modo;
    document.getElementById('looks-peca-foto').src = getCaminhoFoto(pecaId);
    document.getElementById('looks-peca-id').textContent = pecaId;
    renderLooksExistentesPeca();
    abrirModalEmpilhado(modal);
}

function fecharModalLooksPeca() {
    const modal = document.getElementById('modal-looks-peca');
    app.looksPecaSelecionados = [];
    fecharModalEspecifico(modal);
}

function fecharModalLookDetalhes() {
    const modal = document.getElementById('modal-look-detalhes');
    const temModalPorBaixo = [...document.querySelectorAll('.modal')]
        .some(item => item !== modal && modalEstaAberto(item));

    if (!temModalPorBaixo) {
        fecharModal();
        return;
    }

    fecharModalEspecifico(modal);
}

function abrirDatasUsoLook(lookId) {
    const look = obterLookPorId(lookId);
    if (!look) return;

    const modal = document.getElementById('modal-datas-uso-look');
    const usos = obterDatasUsoLook(lookId);
    if (!modal) return;

    document.getElementById('titulo-datas-uso-look').textContent = `Datas de uso - ${look.id}`;
    document.getElementById('resumo-datas-uso-look').textContent = `${usos.registradas.length} registrada${usos.registradas.length === 1 ? '' : 's'} e ${usos.inferidas.length} inferida${usos.inferidas.length === 1 ? '' : 's'} pelas peças.`;
    document.getElementById('datas-uso-look-registradas').innerHTML = criarListaDatasUsoLook(usos.registradas, 'registrada');
    document.getElementById('datas-uso-look-inferidas').innerHTML = criarListaDatasUsoLook(usos.inferidas, 'inferida');

    abrirModalEmpilhado(modal);
}

function fecharModalDatasUsoLook() {
    const modal = document.getElementById('modal-datas-uso-look');
    fecharModalEspecifico(modal);
}

function obterDatasUsoLook(lookId) {
    const alvo = normalizarTexto(lookId);
    const registradas = [];
    const inferidas = [];

    obterUsosLooksAgrupadosPorDia(obterRegistrosUso(app.historico)).forEach(({ dia, registrados, inferidos }) => {
        if (registrados.some(id => normalizarTexto(id) === alvo)) registradas.push(dia);
        if (inferidos.some(id => normalizarTexto(id) === alvo)) inferidas.push(dia);
    });

    return {
        registradas: registradas.sort((a, b) => b.localeCompare(a)),
        inferidas: inferidas.sort((a, b) => b.localeCompare(a)),
    };
}

function criarListaDatasUsoLook(datas, origem) {
    if (!datas.length) return `<p class="texto-ajuda">Nenhuma data ${origem}.</p>`;

    return datas.map(dia => `
        <button type="button" class="data-uso-look-item" onclick="abrirHistoricoNaData('${escapeHtml(dia)}')">
            <strong>${escapeHtml(formatarDataBR(dia))}</strong>
            <span>${escapeHtml(origem)}</span>
        </button>
    `).join('');
}

function abrirHistoricoNaData(dia) {
    app.filtroHistoricoAtivo = { tipo: 'intervalo', inicio: dia, fim: dia };
    salvarEstadoFiltros();
    preencherDatasHistorico(dia, dia);
    renderHistorico(obterRegistrosHistoricoEntre(dia, dia), dia, dia);
    marcarFiltroPeriodoHistorico(null);
    fecharModalDatasUsoLook();
}

function pecaPodeAparecerComoSugestaoLook(peca) {
    return ['calcado', 'bolsa', 'cinto'].includes(normalizarGrupoSugestaoLook(peca?.tipo));
}

function lookTemPecaSugerida(look, pecaId) {
    const alvo = String(pecaId || '').trim().toUpperCase();
    if (!alvo) return false;

    return (look?.pecas_sugeridas || []).some(item =>
        String(item?.id || item || '').trim().toUpperCase() === alvo
    );
}

function obterLooksDaPeca(pecaId) {
    return obterTodosLooks()
        .filter(look => look?.id && Array.isArray(look.pecas))
        .filter(look => look.pecas.includes(pecaId))
        .map(look => ({ ...look, vinculoPeca: 'peca' }))
        .sort((a, b) => String(a.id).localeCompare(String(b.id), 'pt-BR', { numeric: true }));
}

function obterLooksSugeridosDaPeca(pecaId) {
    return obterTodosLooks()
        .filter(look => look?.id)
        .filter(look => lookTemPecaSugerida(look, pecaId))
        .map(look => ({ ...look, vinculoPeca: 'sugerida' }))
        .sort((a, b) => String(a.id).localeCompare(String(b.id), 'pt-BR', { numeric: true }));
}

function renderLooksExistentesPeca() {
    const modal = document.getElementById('modal-looks-peca');
    const pecaId = modal?.dataset.pecaId || app.pecaEmDetalhes;
    const modo = modal?.dataset.modo || 'existentes';
    const ehModoSugeridos = modo === 'sugeridos';
    const todosLooks = ehModoSugeridos ? obterLooksSugeridosDaPeca(pecaId) : obterLooksDaPeca(pecaId);
    const looksFiltrados = filtrarLooksExistentesPeca(todosLooks);
    app.looksPecaSelecionados = obterIdsLooksPecaSelecionadosValidos(todosLooks);

    document.getElementById('looks-peca-titulo').textContent = ehModoSugeridos ? 'Looks é acessório' : 'Looks existentes';
    document.getElementById('looks-peca-resumo').textContent = `${looksFiltrados.length} de ${todosLooks.length} look${todosLooks.length === 1 ? '' : 's'} encontrado${todosLooks.length === 1 ? '' : 's'}.`;
    document.getElementById('looks-peca-filtros').innerHTML = criarFiltrosLooksPeca(todosLooks);
    document.getElementById('looks-peca-acoes-lote').innerHTML = criarAcoesLoteLooksPeca(looksFiltrados, modo);
    document.getElementById('looks-peca-lista').innerHTML = criarGruposLooksPeca(looksFiltrados);
}

function obterIdsLooksPecaSelecionadosValidos(looks) {
    const idsValidos = new Set((looks || []).map(look => look.id));
    return [...new Set(app.looksPecaSelecionados || [])].filter(id => idsValidos.has(id));
}

function criarAcoesLoteLooksPeca(looksFiltrados, modo = 'existentes') {
    const totalSelecionados = (app.looksPecaSelecionados || []).length;
    const idsFiltrados = (looksFiltrados || []).map(look => look.id);
    const totalFiltrados = idsFiltrados.length;
    const todosFiltradosSelecionados = totalFiltrados > 0 && idsFiltrados.every(id => app.looksPecaSelecionados.includes(id));
    const ehModoSugeridos = modo === 'sugeridos';

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
            ${ehModoSugeridos ? `<button type="button" class="btn-secundario" onclick="removerPecaDasSugestoesLooksSelecionados()" ${totalSelecionados ? '' : 'disabled'}>Remover das sugestões</button>` : ''}
            <button type="button" class="btn-principal" data-editar-lote-looks>Editar selecionados</button>
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
    const looksBase = modal?.dataset.modo === 'sugeridos' ? obterLooksSugeridosDaPeca(pecaId) : obterLooksDaPeca(pecaId);
    const looksFiltrados = filtrarLooksExistentesPeca(looksBase);
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

function removerPecaDasSugestoesLooksSelecionados() {
    const modal = document.getElementById('modal-looks-peca');
    const pecaId = String(modal?.dataset.pecaId || app.pecaEmDetalhes || '').trim().toUpperCase();
    const idsSelecionados = obterIdsLooksSelecionadosParaEdicaoLote();
    if (!pecaId || !idsSelecionados.length) return;

    const looksComSugestao = idsSelecionados
        .map(id => obterLookPorId(id))
        .filter(look => lookTemPecaSugerida(look, pecaId));

    if (!looksComSugestao.length) {
        alert('Nenhum look selecionado tem essa peça como sugestão.');
        return;
    }

    if (!confirm(`Remover ${pecaId} das sugestões de ${looksComSugestao.length} look${looksComSugestao.length === 1 ? '' : 's'} selecionado${looksComSugestao.length === 1 ? '' : 's'}?`)) {
        return;
    }

    const editadoEm = new Date().toISOString();
    looksComSugestao.forEach(look => {
        const pecasSugeridas = (look.pecas_sugeridas || [])
            .filter(item => String(item?.id || item || '').trim().toUpperCase() !== pecaId)
            .map(item => typeof item === 'string'
                ? { id: item.toUpperCase(), grupo: app.pecas?.[item]?.tipo || '' }
                : item);

        app.looksFavoritos[look.id] = {
            ...look,
            pecas_sugeridas: pecasSugeridas,
            editadoLocalmente: true,
            editadoEm,
            substituiLookBase: Boolean(app.looks[look.id] || look.substituiLookBase) || undefined,
            id_original: undefined,
        };
    });

    salvarDados();
    preencherSelectLooks();
    preencherFiltrosOcasiao();
    if (document.getElementById('looks')?.style.display !== 'none') {
        renderLooks(obterTodosLooks().filter(lookPassaNosFiltros));
    }
    app.looksPecaSelecionados = app.looksPecaSelecionados.filter(id => !looksComSugestao.some(look => look.id === id));
    renderLooksExistentesPeca();
    alert(`${pecaId} removida das sugestões de ${looksComSugestao.length} look${looksComSugestao.length === 1 ? '' : 's'}.`);
}

function filtrarLooksExistentesPeca(looks) {
    const filtros = app.filtrosLooksPeca || {};
    return looks.filter(look => {
        if (filtros.htt !== 'todos' && String(lookEhHTT(look)) !== filtros.htt) return false;
        if (filtros.utilizacao && normalizarTexto(obterUtilizacaoLook(look)) !== normalizarTexto(filtros.utilizacao)) return false;
        if (filtros.categoria && normalizarTexto(obterCategoriaLook(look)) !== normalizarTexto(filtros.categoria)) return false;
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
                <option value="false" ${filtros.htt === 'false' ? 'selected' : ''}>Não HTT</option>
            </select>
        </label>
        ${criarFiltroValorLookExistente(looks, 'utilizacao', 'Utilização', obterUtilizacaoLook)}
        ${criarFiltroValorLookExistente(looks, 'categoria', 'Categoria', obterCategoriaLook)}
        ${[0, 1, 2].map(indice => criarFiltroPecaLookExistente(looks, indice)).join('')}
    `;
}

function obterUtilizacaoLook(look) {
    const calculados = obterCalculadosAtuaisLook(look);
    return calculados?.utilizacao_calc || look?.utilizacao_calc || look?.utilizacao || look?.basicos?.['Utilização'] || look?.basicos?.utilizacao || '';
}

function obterCalculadosAtuaisLook(look) {
    const pecas = [0, 1, 2]
        .map(indice => obterPecaLookPorIndice(look, indice))
        .map(id => String(id || '').trim().toUpperCase())
        .filter(Boolean);

    if (pecas.length === 0 || !pecas.some(id => app.pecas?.[id])) return null;
    return calcularDadosLookPorPecas(pecas);
}

function obterCategoriaLook(look) {
    return look?.categoria || obterCategoriaIndicadorLook(obterIndicadorLook(look, look?.id)) || look?.basicos?.Categoria || '';
}

function criarFiltroValorLookExistente(looks, campo, rotulo, obterValor) {
    const filtros = app.filtrosLooksPeca || {};
    const selecionado = filtros[campo] || '';
    const opcoes = [...new Set((looks || []).map(obterValor).filter(valorVisivel))]
        .sort((a, b) => String(a).localeCompare(String(b), 'pt-BR', { numeric: true, sensitivity: 'base' }));

    return `
        <label class="looks-peca-filtro-htt">
            <span>${escapeHtml(rotulo)}</span>
            <select onchange="alterarFiltroLooksPeca('${campo}', this.value)">
                <option value="" ${selecionado ? '' : 'selected'}>Todas</option>
                ${opcoes.map(valor => `<option value="${escapeHtml(valor)}" ${String(valor) === String(selecionado) ? 'selected' : ''}>${escapeHtml(valor)}</option>`).join('')}
            </select>
        </label>
    `;
}

function criarFiltroPecaLookExistente(looks, indice) {
    const campo = `peca${indice + 1}`;
    const selecionado = app.filtrosLooksPeca?.[campo] || '';
    const opcoes = obterOpcoesPecaPorPosicaoLooks(looks, indice);
    const rotulo = `Peça ${indice + 1}`;
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
                <small>${escapeHtml([peca.tipo, peca.subtipo].filter(valorVisivel).join(' - ') || 'Peça')}</small>
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
        const situacao = obterSituacaoLook(look) || 'Sem situação';
        mapa[situacao] = mapa[situacao] || [];
        mapa[situacao].push(look);
        return mapa;
    }, {});

    return Object.entries(grupos)
        .sort(([a], [b]) => a.localeCompare(b, 'pt-BR', { numeric: true, sensitivity: 'base' }))
        .map(([situacao, itens], indice) => {
            const idsGrupo = itens.map(look => look.id);
            const selecionados = new Set(app.looksPecaSelecionados || []);
            const todosSelecionados = idsGrupo.length > 0 && idsGrupo.every(id => selecionados.has(id));
            const algunsSelecionados = idsGrupo.some(id => selecionados.has(id));
            return `
            <section class="looks-peca-grupo looks-peca-grupo-cor-${indice % 6}">
                <div class="looks-peca-grupo-topo">
                    <label class="looks-peca-grupo-check">
                        <input type="checkbox"
                               ${todosSelecionados ? 'checked' : ''}
                               ${algunsSelecionados && !todosSelecionados ? 'data-parcial="true"' : ''}
                               onchange="alternarSelecaoGrupoLooksPeca('${escapeHtml(idsGrupo.join(','))}')">
                        <span>Selecionar grupo</span>
                    </label>
                    <h3>${escapeHtml(situacao)}</h3>
                    <span>${itens.length}</span>
                </div>
                <div class="looks-peca-grid">
                    ${itens.map(criarCardLookExistentePeca).join('')}
                </div>
            </section>
        `;
        })
        .join('');
}

function alternarSelecaoGrupoLooksPeca(idsTexto) {
    const idsGrupo = String(idsTexto || '').split(',').map(id => id.trim()).filter(Boolean);
    if (!idsGrupo.length) return;

    const selecionados = new Set(app.looksPecaSelecionados || []);
    const todosSelecionados = idsGrupo.every(id => selecionados.has(id));
    idsGrupo.forEach(id => {
        if (todosSelecionados) {
            selecionados.delete(id);
        } else {
            selecionados.add(id);
        }
    });

    app.looksPecaSelecionados = [...selecionados];
    renderLooksExistentesPeca();
}

function obterSituacaoLook(look) {
    return look?.situacao || look?.basicos?.['situação'] || look?.basicos?.['situação'] || '';
}

function criarCardLookExistentePeca(look) {
    const pecasTexto = (look.pecas || []).join(' / ');
    const selecionado = (app.looksPecaSelecionados || []).includes(look.id);
    const utilizacao = obterUtilizacaoLook(look);
    return `
        <div class="looks-peca-card ${selecionado ? 'selecionado' : ''}" data-look-id="${escapeHtml(look.id)}">
            <label class="looks-peca-check">
                <input type="checkbox" value="${escapeHtml(look.id)}" ${selecionado ? 'checked' : ''} onchange="alternarSelecaoLookPeca('${escapeHtml(look.id)}')">
                <span>Selecionar</span>
            </label>
            <img src="${escapeHtml(getCaminhoFotoLook(look.id))}" alt="${escapeHtml(look.id)}" onerror="${onErrorImagem()}">
            <strong>${escapeHtml(look.id)}${valorVisivel(utilizacao) ? ` <em>${escapeHtml(utilizacao)}</em>` : ''}</strong>
            <small>${escapeHtml(pecasTexto)}</small>
            ${lookEhHTT(look) ? '<div class="looks-peca-tags"><span>HTT</span></div>' : ''}
            <button type="button" class="btn-secundario looks-peca-ficha" onclick="mostrarDetalhesLook('${escapeHtml(look.id)}')">Ficha</button>
        </div>
    `;
}

function abrirEdicaoLoteLooksPeca() {
    const idsSelecionados = obterIdsLooksSelecionadosParaEdicaoLote();
    app.looksPecaSelecionados = idsSelecionados;
    if (!idsSelecionados.length) {
        alert('Selecione pelo menos um look para editar.');
        return;
    }

    const modal = document.getElementById('modal-edicao-lote-looks');
    const resumo = document.getElementById('edicao-lote-looks-resumo');
    const form = document.getElementById('form-edicao-lote-looks');
    if (!modal || !form) return;

    resumo.textContent = `${idsSelecionados.length} look${idsSelecionados.length === 1 ? '' : 's'} selecionado${idsSelecionados.length === 1 ? '' : 's'}: ${idsSelecionados.join(', ')}`;
    try {
        form.innerHTML = criarFormularioEdicaoLoteLooks();
    } catch (erro) {
        console.error('Erro ao abrir edição em lote dos looks:', erro);
        alert('Não consegui abrir a edição em lote. Veja o console para detalhes.');
        return;
    }

    setTimeout(() => {
        renderControleVisualMultiploEdicaoLook('edit-lote-look-ocasioes', 'Pesquisar ocasiao');
        renderSugestoesLookComFotos('edit-lote-look-sugestoes');
    }, 0);

    abrirModalEmpilhado(modal);
}

function fecharModalEdicaoLoteLooks() {
    const modal = document.getElementById('modal-edicao-lote-looks');
    fecharModalEspecifico(modal);
}

function obterIdsLooksSelecionadosParaEdicaoLote() {
    const marcadosNoModal = [...document.querySelectorAll('#modal-looks-peca .looks-peca-check input:checked')]
        .map(input => input.value || input.closest('.looks-peca-card')?.dataset.lookId)
        .filter(Boolean);
    const ids = marcadosNoModal.length ? marcadosNoModal : (app.looksPecaSelecionados || []);
    return [...new Set(ids)]
        .filter(id => Boolean(obterLookPorId(id)));
}

function criarFormularioEdicaoLoteLooks() {
    const opcoesSituacao = criarOptionsSituacaoLook('');
    const opcoesHtt = criarOptionsHttLook('false');
    const opcoesPecas = criarOptionsPecasLook('');
    const opcoesOcasioes = criarOptionsOcasioesLook([]);
    const opcoesSugestoes = criarOptionsSugestoesLook([]);

    return `
        <div class="form-edicao-look form-edicao-lote-looks">
            ${criarCampoAplicarEdicaoLote('situacao', `
                <label class="campo-edicao-look">
                    <span>Situação</span>
                    <select id="edit-lote-look-situacao">${opcoesSituacao}</select>
                </label>
            `)}
            ${criarCampoAplicarEdicaoLote('htt', `
                <label class="campo-edicao-look">
                    <span>HTT</span>
                    <select id="edit-lote-look-htt">${opcoesHtt}</select>
                </label>
            `)}
            ${[1, 2, 3].map(numero => criarCampoAplicarEdicaoLote(`peca${numero}`, `
                <label class="campo-edicao-look">
                    <span>Peça ${numero}</span>
                    <select id="edit-lote-look-peca${numero}">
                        <option value="">Sem peça</option>
                        ${opcoesPecas}
                    </select>
                </label>
            `)).join('')}
            ${criarCampoAplicarEdicaoLote('ocasioes', `
                <label class="campo-edicao-look campo-edicao-look-largo">
                    <span>Ocasiões</span>
                    <select id="edit-lote-look-ocasioes" multiple size="8">${opcoesOcasioes}</select>
                </label>
            `)}
            ${criarCampoAplicarEdicaoLote('sugestoes', `
                <label class="campo-edicao-look campo-edicao-look-largo">
                    <span>Acessórios e calçados sugeridos</span>
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

function criarOptionsPecasLook(valorAtual) {
    const atualNormalizado = normalizarTexto(valorAtual);
    return Object.values(app.pecas || {})
        .filter(peca => peca?.id)
        .sort((a, b) => String(a.id).localeCompare(String(b.id), 'pt-BR', { numeric: true }))
        .map(peca => {
            const label = `${peca.id} - ${[peca.tipo, peca.subtipo, peca.cor_detalhe].filter(valorVisivel).join(' / ') || 'Peça'}`;
            const selecionado = normalizarTexto(peca.id) === atualNormalizado ? 'selected' : '';
            return `<option value="${escapeHtml(peca.id)}" ${selecionado}>${escapeHtml(label)}</option>`;
        })
        .join('');
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
    const aplicarPeca1 = campoLoteDeveAplicar('peca1');
    const aplicarPeca2 = campoLoteDeveAplicar('peca2');
    const aplicarPeca3 = campoLoteDeveAplicar('peca3');
    const aplicarOcasioes = campoLoteDeveAplicar('ocasioes');
    const aplicarSugestoes = campoLoteDeveAplicar('sugestoes');
    const aplicarPecas = aplicarPeca1 || aplicarPeca2 || aplicarPeca3;

    if (!aplicarSituacao && !aplicarHtt && !aplicarPecas && !aplicarOcasioes && !aplicarSugestoes) {
        alert('Marque pelo menos um campo para aplicar aos looks selecionados.');
        return;
    }

    const situacao = document.getElementById('edit-lote-look-situacao')?.value.trim() || '';
    const htt = document.getElementById('edit-lote-look-htt')?.value.trim() || '';
    const pecasLote = [
        document.getElementById('edit-lote-look-peca1')?.value.trim().toUpperCase() || '',
        document.getElementById('edit-lote-look-peca2')?.value.trim().toUpperCase() || '',
        document.getElementById('edit-lote-look-peca3')?.value.trim().toUpperCase() || '',
    ];
    const ocasioes = parseOcasioesEdicaoLook(obterValoresSelectMultiplo('edit-lote-look-ocasioes'));
    const sugestoes = obterSugestoesSelectMultiplo('edit-lote-look-sugestoes');
    const editadoEm = new Date().toISOString();

    idsSelecionados.forEach(lookId => {
        const lookOriginal = obterLookPorId(lookId);
        if (!lookOriginal) return;

        const basicos = { ...(lookOriginal.basicos || {}) };
        if (aplicarSituacao) basicos['situação'] = situacao;
        if (aplicarSituacao) basicos.situacao = situacao;
        if (aplicarHtt) basicos.HTT = htt;
        const pecasAtualizadas = [...(lookOriginal.pecas || [])];
        if (aplicarPeca1) pecasAtualizadas[0] = pecasLote[0];
        if (aplicarPeca2) pecasAtualizadas[1] = pecasLote[1];
        if (aplicarPeca3) pecasAtualizadas[2] = pecasLote[2];
        const pecasNormalizadas = pecasAtualizadas.map(id => String(id || '').trim().toUpperCase()).filter(Boolean);

        const lookBaseEditado = {
            ...lookOriginal,
            id: lookId,
            ...(aplicarSituacao ? { situacao } : {}),
            ...(aplicarHtt ? { HTT: htt, htt } : {}),
            ...(aplicarPecas ? { pecas: pecasNormalizadas } : {}),
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
        const lookEditado = aplicarPecas
            ? atualizarCalculadosLook(lookBaseEditado, pecasNormalizadas, editadoEm)
            : lookBaseEditado;

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

function modalEstaAberto(modal) {
    return Boolean(modal && modal.style.display !== 'none');
}

function abrirModalEmpilhado(modal) {
    if (!modal) return;

    const modaisAbertos = [...document.querySelectorAll('.modal')]
        .filter(item => item !== modal && modalEstaAberto(item));
    const zIndex = MODAL_Z_INDEX_BASE + (modaisAbertos.length * MODAL_Z_INDEX_STEP);

    modal.classList.toggle('modal-em-pilha', modaisAbertos.length > 0);
    modal.style.zIndex = String(zIndex);
    modal.style.display = 'flex';
    modal.scrollTop = 0;
}

function fecharModalEspecifico(modal) {
    if (!modal) return;
    modal.classList.remove('modal-em-pilha');
    modal.style.zIndex = '';
    modal.style.display = 'none';
}

function fecharModal() {
    // Esconde todos os modais
    document.querySelectorAll('.modal').forEach(modal => {
        fecharModalEspecifico(modal);
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

function configurarEventosRegistro() {
    const eventos = [
        ['calendario-registro-mes-anterior', () => navegarMesCalendarioRegistro(-1)],
        ['calendario-registro-mes-proximo', () => navegarMesCalendarioRegistro(1)],
        ['data-registro-uso', evento => atualizarMesCalendarioRegistroPorData(evento.target.value), 'change'],
    ];

    eventos.forEach(([id, acao, evento = 'click']) => {
        const botao = document.getElementById(id);
        if (!botao || botao.dataset.eventoConfigurado === 'true') return;

        botao.addEventListener(evento, acao);
        botao.dataset.eventoConfigurado = 'true';
    });
}

function atualizarMesCalendarioRegistroPorData(dataISO) {
    if (!dataISO) return;
    app.mesCalendarioRegistro = dataISO.slice(0, 7);
    renderCalendarioRegistro();
}

function renderCalendarioRegistro() {
    const container = document.getElementById('calendario-registro');
    const label = document.getElementById('calendario-registro-mes-label');
    if (!container || !label) return;

    if (!app.mesCalendarioRegistro) {
        const campoData = document.getElementById('data-registro-uso')?.value;
        const referencia = campoData
            ? new Date(`${campoData}T12:00:00`)
            : (obterDataReferenciaHistorico() || new Date());
        app.mesCalendarioRegistro = formatarMesInput(referencia);
    }

    const [ano, mes] = app.mesCalendarioRegistro.split('-').map(Number);
    const primeiroDia = new Date(ano, mes - 1, 1);
    const diasNoMes = new Date(ano, mes, 0).getDate();
    const inicioSemana = primeiroDia.getDay();
    const registrosPorDia = agruparRegistrosPorDia(obterRegistrosHistoricoAtivos(app.historico));
    const nomesDias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    label.textContent = primeiroDia.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    container.innerHTML = nomesDias.map(dia => `<div class="calendario-dia-semana">${dia}</div>`).join('');

    for (let i = 0; i < inicioSemana; i++) {
        container.insertAdjacentHTML('beforeend', '<div class="calendario-dia vazio"></div>');
    }

    for (let dia = 1; dia <= diasNoMes; dia++) {
        const dataISO = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
        const registros = registrosPorDia[dataISO] || [];
        const temUsoReal = registros.some(registro => !registroEhAgendamento(registro));
        const temAgendamento = registros.some(registro => registroEhAgendamento(registro));
        const fotos = obterFotosResumoDiaRegistro(registros).slice(0, 3).map(item => `
            <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt)}"
                 onerror="this.style.display='none'">
        `).join('');

        container.insertAdjacentHTML('beforeend', `
            <button type="button"
                    class="calendario-dia ${registros.length ? 'tem-uso' : ''} ${temAgendamento && !temUsoReal ? 'tem-agendamento' : ''}"
                    data-data="${dataISO}"
                    ${registros.length ? '' : 'disabled'}>
                <span>${dia}</span>
                <div class="calendario-miniaturas">${fotos}</div>
                ${registros.length ? `<small>${resumirItensDiaRegistro(registros)}</small>` : ''}
            </button>
        `);
    }

    container.querySelectorAll('.calendario-dia.tem-uso').forEach(botao => {
        botao.addEventListener('click', () => abrirModalDiaRegistro(botao.dataset.data));
    });
}

function navegarMesCalendarioRegistro(delta) {
    const referencia = app.mesCalendarioRegistro
        ? new Date(`${app.mesCalendarioRegistro}-01T12:00:00`)
        : (obterDataReferenciaHistorico() || new Date());

    referencia.setMonth(referencia.getMonth() + delta);
    app.mesCalendarioRegistro = formatarMesInput(referencia);
    renderCalendarioRegistro();
}

function obterFotosResumoDiaRegistro(registros) {
    const itens = [];
    const vistos = new Set();

    obterLooksDiaRegistro(registros).forEach(item => {
        const chave = `look:${item.id}`;
        if (vistos.has(chave)) return;
        vistos.add(chave);
        itens.push({ tipo: 'look', id: item.id, src: getCaminhoFotoLook(item.id), alt: `Look ${item.id}` });
    });

    obterPecasDiaRegistro(registros).forEach(id => {
        const chave = `peca:${id}`;
        if (vistos.has(chave)) return;
        vistos.add(chave);
        itens.push({ tipo: 'peca', id, src: getCaminhoFoto(id), alt: `Peça ${id}` });
    });

    return itens;
}

function resumirItensDiaRegistro(registros) {
    const looks = obterLooksDiaRegistro(registros).length;
    const pecas = obterPecasDiaRegistro(registros).length;
    const temAgendamento = registros.some(registroEhAgendamento);
    const partes = [];

    if (looks) partes.push(`${looks} look${looks === 1 ? '' : 's'}`);
    if (pecas) partes.push(`${pecas} peça${pecas === 1 ? '' : 's'}`);
    return `${partes.join(' + ') || `${registros.length} registro${registros.length === 1 ? '' : 's'}`}${temAgendamento ? ' ag.' : ''}`;
}

function obterLooksDiaRegistro(registros) {
    const vistos = new Set();
    const looks = [];

    (registros || []).forEach(registro => {
        obterLooksRegistroComOrigem(registro).forEach(item => {
            const chave = normalizarTexto(item.id);
            if (!chave || vistos.has(chave) || !obterLookPorId(item.id)) return;
            vistos.add(chave);
            looks.push({
                id: item.id,
                origem: registroEhAgendamento(registro) ? 'agendado' : item.origem,
            });
        });
    });

    return looks.sort((a, b) => String(a.id).localeCompare(String(b.id), 'pt-BR', { numeric: true }));
}

function obterPecasDiaRegistro(registros) {
    const vistos = new Set();

    (registros || []).forEach(registro => {
        (registro.pecas || []).forEach(id => {
            const chave = normalizarTexto(id);
            if (chave && app.pecas[id]) vistos.add(id);
        });
    });

    return [...vistos].sort((a, b) => String(a).localeCompare(String(b), 'pt-BR', { numeric: true }));
}

function abrirModalDiaRegistro(dataISO) {
    const registros = obterRegistrosHistoricoEntre(dataISO, dataISO);
    if (!registros.length) return;

    const modal = document.getElementById('modal-dia-registro');
    const titulo = document.getElementById('titulo-dia-registro');
    const galeria = document.getElementById('galeria-dia-registro');
    if (!modal || !titulo || !galeria) return;

    titulo.textContent = formatarDataBR(dataISO);
    galeria.innerHTML = criarGaleriaDiaRegistro(registros);
    abrirModalEmpilhado(modal);
}

function fecharModalDiaRegistro() {
    fecharModalEspecifico(document.getElementById('modal-dia-registro'));
}

function criarGaleriaDiaRegistro(registros) {
    const looks = obterLooksDiaRegistro(registros);
    const pecas = obterPecasDiaRegistro(registros);
    const blocos = [];

    if (looks.length) {
        blocos.push(`
            <section class="galeria-dia-registro-bloco">
                <div class="galeria-dia-registro-grid galeria-dia-registro-looks">
                    ${looks.map(criarCardLookDiaRegistro).join('')}
                </div>
            </section>
        `);
    }

    if (pecas.length) {
        blocos.push(`
            <section class="galeria-dia-registro-bloco">
                <div class="galeria-dia-registro-grid">
                    ${pecas.map(criarCardPecaDiaRegistro).join('')}
                </div>
            </section>
        `);
    }

    return blocos.join('') || '<p class="texto-ajuda">Nenhum item neste dia.</p>';
}

function criarCardLookDiaRegistro(item) {
    const look = obterLookPorId(item.id);
    const origem = item.origem === 'agendado' ? 'agendado' : 'look';
    return `
        <button type="button" class="galeria-dia-registro-item" onclick="mostrarDetalhesLook('${escapeHtml(item.id)}')">
            <img src="${escapeHtml(getCaminhoFotoLook(item.id))}" alt="${escapeHtml(look?.nome || item.id)}" onerror="${onErrorImagem()}">
            <span>${escapeHtml(item.id)}</span>
            <small>${escapeHtml(origem)}</small>
        </button>
    `;
}

function criarCardPecaDiaRegistro(id) {
    const peca = app.pecas[id] || {};
    return `
        <button type="button" class="galeria-dia-registro-item" onclick="mostrarDetalhesPeca('${escapeHtml(id)}')">
            <img src="${escapeHtml(getCaminhoFoto(id))}" alt="${escapeHtml(peca.tipo || id)}" onerror="${onErrorImagem()}">
            <span>${escapeHtml(id)}</span>
        </button>
    `;
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

function camposDetalhesGerenciadosPeca() {
    return new Set(['formalidade', 'tendencia', 'alocacao', 'situacao', 'conservacao', 'repor', 'reposicao']);
}

function obterDetalhesEditaveisPeca(detalhes) {
    const camposGerenciados = camposDetalhesGerenciadosPeca();
    return (detalhes || [])
        .filter(item => !camposGerenciados.has(normalizarTexto(item?.campo)))
        .filter(item => valorVisivel(item?.campo) || valorVisivel(item?.valor));
}

function criarLinhaDetalhePeca(item = {}) {
    const classeGrupo = obterClasseGrupoFichaPecaPorLabel(item.campo || '');
    return `
        <div class="detalhe-peca-linha ${classeGrupo}">
            <input type="text" data-detalhe-peca-campo value="${escapeHtml(item.campo || '')}" placeholder="Campo">
            <textarea data-detalhe-peca-valor rows="2" placeholder="Valor">${escapeHtml(item.valor || '')}</textarea>
            <button class="btn-remover-detalhe" type="button" onclick="removerDetalhePeca(this)" title="Remover informação" aria-label="Remover informação">x</button>
        </div>
    `;
}

function criarEditorDetalhesPeca(detalhes) {
    const itens = obterDetalhesEditaveisPeca(detalhes);
    const linhas = itens.length ? itens : [{ campo: '', valor: '' }];

    return `
        <div class="detalhes-peca-editor">
            <div id="edit-peca-detalhes-lista" class="detalhes-peca-lista">
                ${linhas.map(criarLinhaDetalhePeca).join('')}
            </div>
            <button class="btn-secundario btn-adicionar-detalhe" type="button" onclick="adicionarDetalhePeca()">Adicionar informação</button>
        </div>
    `;
}

function adicionarDetalhePeca() {
    const lista = document.getElementById('edit-peca-detalhes-lista');
    if (!lista) return;

    lista.insertAdjacentHTML('beforeend', criarLinhaDetalhePeca());
    lista.querySelector('.detalhe-peca-linha:last-child [data-detalhe-peca-campo]')?.focus();
}

function removerDetalhePeca(botao) {
    const lista = document.getElementById('edit-peca-detalhes-lista');
    const linha = botao?.closest('.detalhe-peca-linha');
    if (!lista || !linha) return;

    if (lista.querySelectorAll('.detalhe-peca-linha').length === 1) {
        linha.querySelector('[data-detalhe-peca-campo]').value = '';
        linha.querySelector('[data-detalhe-peca-valor]').value = '';
        return;
    }

    linha.remove();
}

function lerDetalhesPecaFormulario() {
    const detalhesEmCampos = [...document.querySelectorAll('[data-detalhe-peca-campo-fixo]')]
        .map(input => ({
            campo: input.dataset.detalhePecaCampoFixo || '',
            valor: input.value.trim(),
            tinhaValorOriginal: input.dataset.detalhePecaOriginal === '1',
        }))
        .filter(item => valorVisivel(item.valor) || item.tinhaValorOriginal)
        .map(({ campo, valor }) => ({ campo, valor }));

    const detalhesEmLista = [...document.querySelectorAll('#edit-peca-detalhes-lista .detalhe-peca-linha')]
        .map(linha => ({
            campo: linha.querySelector('[data-detalhe-peca-campo]')?.value.trim() || '',
            valor: linha.querySelector('[data-detalhe-peca-valor]')?.value.trim() || '',
        }))
        .filter(item => valorVisivel(item.campo) || valorVisivel(item.valor));

    return [...detalhesEmCampos, ...detalhesEmLista];
}

function formatarIdsRelacionados(itens, campo) {
    return (itens || []).map(item => item?.[campo] || '').filter(Boolean).join(', ');
}

function obterTipoCompatibilidadePeca(peca) {
    const tipo = normalizarTexto(peca?.tipo);
    const aliases = {
        blusa: 'blusa',
        blusas: 'blusa',
        calcado: 'calcado',
        calcados: 'calcado',
        casaco: 'casaco',
        casacos: 'casaco',
        inteiro: 'inteiro',
        inteiros: 'inteiro',
        meia: 'meia',
        meias: 'meia',
        propescoco: 'pro-pescoco',
        pescoco: 'pro-pescoco',
        segunda: 'segunda-pele',
        segundapele: 'segunda-pele',
        sutien: 'sutien',
        sutiens: 'sutien',
        sutia: 'sutien',
        sutias: 'sutien',
        top: 'top',
        tops: 'top',
    };
    return aliases[tipo] || tipo;
}

function pecaTemFuncaoTreino(peca) {
    return normalizarTexto(peca?.funcao) === 'treino';
}

function pecaEstaExcluida(peca) {
    return ['excluida', 'excluido'].includes(normalizarTexto(peca?.situacao));
}

function relacionamentoDiretoPermitido(origem, candidata) {
    const tipoOrigem = obterTipoCompatibilidadePeca(origem);
    const tipoCandidata = obterTipoCompatibilidadePeca(candidata);
    const funcaoTreino = pecaTemFuncaoTreino(origem);

    if (tipoOrigem === 'blusa') {
        return funcaoTreino
            ? tipoCandidata === 'top'
            : ['segunda-pele', 'pro-pescoco'].includes(tipoCandidata);
    }
    if (tipoOrigem === 'calcado') return tipoCandidata === 'meia';
    if (tipoOrigem === 'casaco') return ['top', 'segunda-pele', 'pro-pescoco'].includes(tipoCandidata);
    if (tipoOrigem === 'inteiro') return ['segunda-pele', 'pro-pescoco'].includes(tipoCandidata);
    if (tipoOrigem === 'meia') return tipoCandidata === 'calcado';
    if (tipoOrigem === 'pro-pescoco') return ['blusa', 'casaco', 'inteiro'].includes(tipoCandidata);
    if (tipoOrigem === 'segunda-pele') return ['blusa', 'casaco', 'inteiro'].includes(tipoCandidata);
    if (tipoOrigem === 'sutien') return funcaoTreino && tipoCandidata === 'top';
    if (tipoOrigem === 'top') {
        return (tipoCandidata === 'blusa' && pecaTemFuncaoTreino(candidata))
            || tipoCandidata === 'casaco'
            || (tipoCandidata === 'sutien' && pecaTemFuncaoTreino(candidata));
    }

    return false;
}

function pecasPodemSerRelacionadas(origem, candidata) {
    if (!origem || !candidata) return false;
    return relacionamentoDiretoPermitido(origem, candidata) || relacionamentoDiretoPermitido(candidata, origem);
}

function obterDescricaoResumoPeca(peca) {
    return [peca?.subtipo, peca?.cor].filter(valorVisivel).join(' · ') || peca?.tipo || '';
}

function obterNomePeca(peca) {
    return peca?.nome || peca?.descricao || [peca?.tipo, peca?.subtipo, peca?.cor].filter(valorVisivel).join(' · ') || peca?.id || '';
}

function criarItemAcessorio(id) {
    const peca = app.pecas[id];
    return { id, grupo: peca?.tipo || '', descricao: obterDescricaoResumoPeca(peca) || id };
}

function criarItemRestricao(id) {
    const combinacao = obterCombinacaoNaoPermitidaPorCodigo(id);
    return { codigo: id, descricao: combinacao?.tipo || id, grupo: combinacao?.grupo || '' };
}

function obterIdsAcessoriosPeca(peca) {
    return [...new Set(normalizarListaPeca(peca?.acessorios)
        .map(item => String(item?.id || item || '').trim().toUpperCase())
        .filter(Boolean))];
}

function obterIdsRestricoesPeca(peca) {
    return [...new Set(normalizarListaPeca(peca?.combinacoes_nao_permitidas)
        .map(item => String(item?.codigo || item?.id || item || '').trim().toUpperCase())
        .filter(Boolean))];
}

function obterOpcoesPecasRelacionadas(pecaBase, idAtual) {
    return Object.values(app.pecas || {})
        .filter(peca => peca?.id && normalizarTexto(peca.id) !== normalizarTexto(idAtual))
        .filter(peca => !pecaEstaExcluida(peca))
        .filter(peca => pecasPodemSerRelacionadas(pecaBase, peca))
        .sort((a, b) => String(a.id).localeCompare(String(b.id), 'pt-BR', { numeric: true }));
}

function obterCombinacaoNaoPermitidaPorCodigo(codigo) {
    const alvo = normalizarTexto(codigo);
    return (app.dimensoes?.tipos_combinacao || []).find(item => normalizarTexto(item.codigo) === alvo);
}

function obterOpcoesCombinacoesNaoPermitidas() {
    return (app.dimensoes?.tipos_combinacao || [])
        .filter(item => item?.codigo)
        .sort((a, b) => String(a.codigo).localeCompare(String(b.codigo), 'pt-BR', { numeric: true }));
}

function criarSeletorPecasRelacionadas(peca, idAtual) {
    const selecionados = new Set(obterIdsAcessoriosPeca(peca));
    const opcoes = obterOpcoesPecasRelacionadas(peca, idAtual);

    if (!opcoes.length) {
        return '<p class="texto-ajuda">Nenhuma peça compatível disponível para este tipo/função.</p>';
    }

    return `
        <div class="pecas-relacionadas-lista">
            ${opcoes.map(opcao => {
                const selecionado = selecionados.has(String(opcao.id).toUpperCase());
                const descricao = obterDescricaoResumoPeca(opcao);
                return `
                    <label class="peca-relacionada-opcao ${selecionado ? 'selecionada' : ''}">
                        <input type="checkbox" name="edit-peca-acessorios" value="${escapeHtml(opcao.id)}" ${selecionado ? 'checked' : ''}>
                        ${criarImagem(getCaminhoFoto(opcao.id), opcao.id)}
                        <span>
                            <strong>${escapeHtml(opcao.id)}</strong>
                            <small>${escapeHtml(descricao)}</small>
                        </span>
                    </label>
                `;
            }).join('')}
        </div>
    `;
}

function criarSeletorPecasNaoCombinam(peca, idAtual) {
    const selecionados = new Set(obterIdsRestricoesPeca(peca));
    const opcoes = obterOpcoesCombinacoesNaoPermitidas();

    if (!opcoes.length) {
        return '<p class="texto-ajuda">Nenhuma combinação importada disponível.</p>';
    }

    return `
        <div class="pecas-relacionadas-lista">
            ${opcoes.map(opcao => {
                const codigo = String(opcao.codigo || '').toUpperCase();
                const selecionado = selecionados.has(codigo);
                const nome = [opcao.tipo, opcao.grupo].filter(valorVisivel).join(' · ') || codigo;
                return `
                    <label class="peca-relacionada-opcao ${selecionado ? 'selecionada' : ''}">
                        <input type="checkbox" name="edit-peca-restricoes" value="${escapeHtml(codigo)}" ${selecionado ? 'checked' : ''}>
                        ${criarImagem(`fotos/combinacoes/${codigo}.webp`, codigo)}
                        <span>
                            <strong>${escapeHtml(codigo)}</strong>
                            <small>${escapeHtml(nome)}</small>
                        </span>
                    </label>
                `;
            }).join('')}
        </div>
    `;
}

function atualizarOpcoesPecasRelacionadasFormulario() {
    const container = document.getElementById('edit-peca-acessorios-opcoes');
    if (!container) return;

    const formulario = document.getElementById('form-peca');
    const campos = {};
    formulario?.querySelectorAll('[data-campo-peca]').forEach(input => {
        campos[input.dataset.campoPeca] = input.value.trim();
    });

    const idAtual = String(document.getElementById('edit-peca-id')?.value || app.pecaEmDetalhes || '').trim().toUpperCase();
    const pecaAtual = {
        ...(app.pecas?.[app.pecaEmDetalhes] || {}),
        ...campos,
        id: idAtual,
        acessorios: lerIdsPecasRelacionadasFormulario().map(criarItemAcessorio),
    };

    container.innerHTML = criarSeletorPecasRelacionadas(pecaAtual, idAtual);
    configurarSelecaoPecasRelacionadas();
}

function configurarSelecaoPecasRelacionadas() {
    document.querySelectorAll('.peca-relacionada-opcao input[type="checkbox"]').forEach(input => {
        input.addEventListener('change', () => {
            input.closest('.peca-relacionada-opcao')?.classList.toggle('selecionada', input.checked);
        });
    });
}

function lerIdsPecasRelacionadasFormulario() {
    return [...document.querySelectorAll('input[name="edit-peca-acessorios"]:checked')]
        .map(input => String(input.value || '').trim().toUpperCase())
        .filter(Boolean);
}

function lerIdsPecasNaoCombinamFormulario() {
    return [...document.querySelectorAll('input[name="edit-peca-restricoes"]:checked')]
        .map(input => String(input.value || '').trim().toUpperCase())
        .filter(Boolean);
}

function sincronizarPecasRelacionadas(id, idsAnteriores, idsNovos) {
    const anteriores = new Set((idsAnteriores || []).map(item => String(item).toUpperCase()));
    const novos = new Set((idsNovos || []).map(item => String(item).toUpperCase()));
    const afetados = new Set([id]);

    anteriores.forEach(relacionadoId => {
        if (novos.has(relacionadoId) || !app.pecas[relacionadoId]) return;
        const pecaRelacionada = app.pecas[relacionadoId];
        const acessorios = normalizarListaPeca(pecaRelacionada.acessorios)
            .filter(item => String(item?.id || item || '').toUpperCase() !== id);
        app.pecas[relacionadoId] = {
            ...pecaRelacionada,
            acessorios,
            editadaLocalmente: true,
        };
        app.pecasPersonalizadas[relacionadoId] = app.pecas[relacionadoId];
        afetados.add(relacionadoId);
    });

    novos.forEach(relacionadoId => {
        const pecaRelacionada = app.pecas[relacionadoId];
        if (!pecaRelacionada) return;
        const idsRelacionados = new Set(obterIdsAcessoriosPeca(pecaRelacionada));
        if (!idsRelacionados.has(id)) {
            idsRelacionados.add(id);
        }
        app.pecas[relacionadoId] = {
            ...pecaRelacionada,
            acessorios: [...idsRelacionados].map(criarItemAcessorio),
            editadaLocalmente: true,
        };
        app.pecasPersonalizadas[relacionadoId] = app.pecas[relacionadoId];
        afetados.add(relacionadoId);
    });

    return [...afetados];
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

function criarCampoDetalhePeca(campo, valorAtual, tipo = '') {
    const tipoInput = tipo === 'data' ? 'date' : 'text';
    const valor = tipo === 'data' ? formatarDataInputDetalhePeca(valorAtual) : valorAtual;

    return `<input type="${tipoInput}" data-detalhe-peca-campo-fixo="${escapeHtml(campo)}" data-detalhe-peca-original="${valorVisivel(valorAtual) ? '1' : ''}" value="${escapeHtml(valor || '')}">`;
}

function formatarDataInputDetalhePeca(valor) {
    const dataNormalizada = normalizarDataHistorico(valor);
    return dataNormalizada ? dataNormalizada.slice(0, 10) : '';
}

function obterValorDetalheEdicaoPeca(peca, definicao) {
    const aliases = [definicao.campo, definicao.label, definicao.prop, ...(definicao.aliases || [])].filter(Boolean);
    return (definicao.prop ? peca?.[definicao.prop] : '')
        || obterCampoPorNomes(peca, aliases)
        || obterCampoPorNomes(detalhesParaObjeto(peca?.detalhes), aliases)
        || '';
}

function obterDetalhesExtrasEdicaoPeca(peca, definicoes) {
    const camposUsados = new Set();
    GRUPOS_FICHA_PECA.forEach(grupo => {
        grupo.campos.forEach(campo => {
            camposUsados.add(normalizarTexto(campo.label));
            camposUsados.add(normalizarTexto(campo.prop));
            (campo.aliases || []).forEach(alias => camposUsados.add(normalizarTexto(alias)));
        });
    });
    definicoes.forEach(definicao => {
        camposUsados.add(normalizarTexto(definicao.campo));
        camposUsados.add(normalizarTexto(definicao.label));
    });

    return obterDetalhesEditaveisPeca(peca?.detalhes)
        .filter(item => !camposUsados.has(normalizarTexto(item?.campo)))
        .map(item => ({
            campo: item.campo,
            label: formatarLabelCampo(item.campo),
            tipoEdicao: 'detalhe',
            classe: obterClasseGrupoFichaPecaPorLabel(item.campo || ''),
            valor: item.valor || '',
        }));
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
        atualizarOpcoesPecasRelacionadasFormulario();
    });

    document.querySelector('[data-campo-peca="funcao"]')?.addEventListener('change', atualizarOpcoesPecasRelacionadasFormulario);

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
    const campos = obterDefinicoesCamposEdicaoPeca();
    const camposFormulario = [...campos, ...obterDetalhesExtrasEdicaoPeca(peca, campos)];
    const dataAtualizacao = obterDataAtualizacaoPeca(peca);

    document.getElementById('titulo-modal').textContent = nova ? 'Adicionar nova peça' : `Editar ${peca.id}`;
    atualizarFotoModalPeca(getCaminhoFoto(peca.id));
    document.querySelector('#modal-peca .ficha-peca').innerHTML = `
        <form id="form-peca" class="form-edicao-peca" onsubmit="event.preventDefault(); salvarPeca();">
            <label class="campo-edicao-peca ${obterClasseGrupoFichaPecaPorLabel('ID')}">
                <span>ID *</span>
                <input id="edit-peca-id" type="text" value="${escapeHtml(peca.id)}" ${nova ? '' : 'disabled'} required>
            </label>
            <label class="campo-edicao-peca ${obterClasseGrupoFichaPecaPorLabel('Data de atualização')}">
                <span>Data de atualização</span>
                <input type="text" value="${escapeHtml(dataAtualizacao ? formatarDataHoraFicha(dataAtualizacao) : '-')}" disabled>
            </label>
            ${camposFormulario.map(({ campo, label, obrigatorio, classe, tipoEdicao, tipo, valor, prop, aliases }) => `
                <label class="campo-edicao-peca ${classe}">
                    <span>${label}${obrigatorio ? ' *' : ''}</span>
                    ${tipoEdicao === 'detalhe'
                        ? criarCampoDetalhePeca(campo, valor ?? obterValorDetalheEdicaoPeca(peca, { campo, label, prop, aliases }), tipo)
                        : criarCampoListaPeca(campo, label, peca[campo] || '', Boolean(obrigatorio))}
                </label>
            `).join('')}
            <label class="campo-edicao-peca campo-edicao-peca-largo">
                <span>ID peças relacionadas</span>
                <div id="edit-peca-acessorios-opcoes">
                    ${criarSeletorPecasRelacionadas(peca, peca.id)}
                </div>
            </label>
            <label class="campo-edicao-peca campo-edicao-peca-largo">
                <span>Combinações que não combinam</span>
                <div id="edit-peca-restricoes-opcoes">
                    ${criarSeletorPecasNaoCombinam(peca, peca.id)}
                </div>
            </label>
            <label class="campo-edicao-peca campo-edicao-peca-largo">
                <span>URL da foto</span>
                <input id="edit-peca-foto" type="text" value="${escapeHtml(peca.foto || '')}" placeholder="https://...">
            </label>
            <label class="campo-edicao-peca campo-edicao-peca-largo">
                <span>Enviar nova foto</span>
                <input id="edit-peca-foto-arquivo" type="file" accept="image/*">
            </label>
            <button type="submit" class="submit-oculto" aria-hidden="true" tabindex="-1"></button>
        </form>
    `;

    document.getElementById('editar-peca-modal').style.display = 'none';
    document.getElementById('looks-existentes-peca-modal').style.display = 'none';
    document.getElementById('looks-sugeridos-peca-modal').style.display = 'none';
    configurarDependenciasFormularioPeca();
    configurarSelecaoPecasRelacionadas();
    document.getElementById('cancelar-edicao-peca-modal').style.display = '';
    document.getElementById('salvar-peca-modal').style.display = '';
    document.getElementById('registrar-peca-modal').style.display = 'none';
    abrirModalEmpilhado(document.getElementById('modal-peca'));
}

function lerFotoPeca() {
    const arquivo = document.getElementById('edit-peca-foto-arquivo')?.files?.[0];
    if (!arquivo) return Promise.resolve('');
    return new Promise((resolve, reject) => {
        const leitor = new FileReader();
        leitor.onload = () => resolve(String(leitor.result || ''));
        leitor.onerror = () => reject(new Error('Não foi possível ler a foto selecionada.'));
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
        alert(`Já existe uma peça com o ID ${id}.`);
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
        const idsAcessoriosAnteriores = obterIdsAcessoriosPeca(original);
        const idsAcessoriosNovos = lerIdsPecasRelacionadasFormulario();
        const acessorios = idsAcessoriosNovos.map(criarItemAcessorio);
        const idsRestricoesNovos = lerIdsPecasNaoCombinamFormulario();
        const combinacoes = idsRestricoesNovos.map(criarItemRestricao);
        const detalhes = preservarDetalhesImportadosPeca(
            original,
            lerDetalhesPecaFormulario()
        );

        const peca = {
            ...original,
            ...campos,
            id,
            foto: fotoArquivo || fotoUrl || original.foto || '',
            detalhes,
            acessorios,
            combinacoes_nao_permitidas: combinacoes,
            editadaLocalmente: true,
            editadaEm: new Date().toISOString(),
        };
        CAMPOS_IMPORTADOS_PECA.forEach(definicao => {
            const detalheEditado = obterDetalhePorAliases(detalhes, definicao.aliases);
            if (detalheEditado) {
                if (valorVisivel(detalheEditado.valor)) {
                    peca[definicao.prop] = detalheEditado.valor;
                } else {
                    delete peca[definicao.prop];
                }
                return;
            }

            const valorEditado = obterValorCampoImportadoPeca({ detalhes }, definicao);
            const valorPreservado = obterValorCampoImportadoPeca({ ...original, detalhes }, definicao);
            const valor = valorEditado || valorPreservado;
            if (valorVisivel(valor)) peca[definicao.prop] = valor;
        });

        app.pecas[id] = peca;
        app.pecasPersonalizadas[id] = peca;
        const idsRelacionadosAfetados = sincronizarPecasRelacionadas(id, idsAcessoriosAnteriores, idsAcessoriosNovos);
        const totalLooksAtualizados = recalcularLooksAfetadosPorPeca([editandoId, ...idsRelacionadosAfetados], { idAntigo: editandoId, idNovo: id });
        app.pecaEmDetalhes = id;
        salvarDados({ incluirLooks: totalLooksAtualizados > 0 });
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
            console.log(`🔄 ${totalLooksAtualizados} look(s) recalculado(s) após atualizar a peça ${id}.`);
        }
    } catch (erro) {
        console.error('Erro ao salvar peça:', erro);
        alert(erro.message || 'Não foi possível salvar a peça.');
    }
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
                <span>${escapeHtml(corrigirTextoMojibake(peca.tipo || ''))}</span>
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
        const todasPecasGrupo = Object.entries(app.pecas)
            .filter(([, peca]) => pecaPertenceAoGrupoRegistro(peca, grupo));
        const pecasBaseGrupo = todasPecasGrupo
            .filter(([, peca]) => pecaPassaNosFiltros(peca, app.filtrosHoje));
        const pecasFiltradas = pecasBaseGrupo
            .filter(([, peca]) => pecaPassaNosFiltros(peca, filtrosGrupo));

        if (todasPecasGrupo.length === 0) return;

        const secao = document.createElement('section');
        secao.className = 'grupo-registro';

        const topo = document.createElement('div');
        topo.className = 'grupo-registro-topo';
        topo.innerHTML = `
            <h4>${escapeHtml(grupo.titulo)}</h4>
            <span>${pecasFiltradas.length} de ${todasPecasGrupo.length}</span>
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
                <strong>${escapeHtml(corrigirTextoMojibake(peca.tipo || id))}</strong><br>
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
        ? 'Looks sugeridos para a peça inteira selecionada'
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
    salvarRegistroHoje('uso');
}

function agendarUsoHoje() {
    salvarRegistroHoje(TIPO_REGISTRO_AGENDAMENTO);
}

function salvarRegistroHoje(tipo = 'uso') {
    if (app.pecasSelecionadasHoje.length === 0) {
        alert('Selecione pelo menos uma peça!');
        return;
    }

    const dataRegistro = document.getElementById('data-registro-uso').value;
    if (!dataRegistro) {
        alert('Selecione a data do registro!');
        return;
    }

    if (tipo === TIPO_REGISTRO_AGENDAMENTO && dataRegistro < obterHojeISO()) {
        alert('Agendamentos precisam ser para hoje ou para uma data futura.');
        return;
    }

    // Verificar se usar um look favorito

    // Criar registro no histórico
    const registro = {
        data: new Date(`${dataRegistro}T12:00:00`).toISOString(),
        pecas: [...app.pecasSelecionadasHoje],
        lookId: app.looksSelecionadosHoje[0] || null,
        lookIds: [...app.looksSelecionadosHoje],
        tipo: tipo === TIPO_REGISTRO_AGENDAMENTO ? TIPO_REGISTRO_AGENDAMENTO : 'uso',
        alteradoEm: new Date().toISOString(),
    };

    app.historico.push(registro);
    salvarDados();

    // Feedback visual
    alert(tipo === TIPO_REGISTRO_AGENDAMENTO ? 'Agendamento salvo com sucesso!' : 'Uso registrado com sucesso!');

    // Limpar
    app.pecasSelecionadasHoje = [];
    app.looksSelecionadosHoje = [];
    atualizarPecasSelecionadasHoje();
    renderCalendarioRegistro();
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

    CAMPOS_FILTROS_LOOKS.forEach(campo => {
        if (campo === 'lookId') {
            criarFiltroIdLook(container);
            return;
        }
        if (campo === 'pecas') {
            criarFiltroPecasLooks(container);
            return;
        }
        const valores = obterValoresFiltroLooks(campo);
        if (valores.length > 0) {
            criarFiltroMultiplo(container, campo, valores, app.filtrosLooks[campo], novosValores => {
                filtrarLooks(campo, novosValores);
            }, { classeGrupo: obterClasseGrupoFiltroLook(campo) });
        }
    });

    const btnLimpar = document.createElement('button');
    btnLimpar.className = 'btn-secundario';
    btnLimpar.type = 'button';
    btnLimpar.textContent = 'Limpar filtros';
    btnLimpar.onclick = limparFiltrosLooks;
    container.appendChild(btnLimpar);
}

function criarFiltroIdLook(container) {
    const wrapper = document.createElement('label');
    wrapper.className = `filtro-pecas-looks ${obterClasseGrupoFiltroLook('indicador')}`;
    wrapper.innerHTML = `
        <span>ID do look</span>
        <input type="search" id="filtro-look-id" placeholder="AL0001, BL0123" autocomplete="off" value="${escapeHtml((app.filtrosLooks.lookId || []).join(', '))}">
        <small>Use um ou mais IDs</small>
    `;

    const input = wrapper.querySelector('input');
    input.addEventListener('input', evento => {
        app.filtrosLooks.lookId = normalizarFiltroIdsLooks(evento.target.value);
        salvarEstadoFiltros();
        window.clearTimeout(app.timeoutFiltroPecasLooks);
        app.timeoutFiltroPecasLooks = window.setTimeout(() => {
            renderLooks(obterTodosLooks().filter(lookPassaNosFiltros));
        }, 180);
    });
    input.addEventListener('change', () => {
        input.value = (app.filtrosLooks.lookId || []).join(', ');
    });

    container.appendChild(wrapper);
}

function criarFiltroPecasLooks(container) {
    const wrapper = document.createElement('label');
    wrapper.className = `filtro-pecas-looks ${obterClasseGrupoFiltroLook('pecas')}`;
    wrapper.innerHTML = `
        <span>IDs das peças</span>
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

function normalizarFiltroIdsLooks(valor) {
    return [...new Set(String(valor || '')
        .toUpperCase()
        .split(/[\s,;]+/)
        .map(item => item.trim())
        .filter(Boolean))];
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
            return [look.situacao || basicos['situação'] || basicos.situacao];
        case 'utilizacao':
            return [obterUtilizacaoLook(look)];
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
    const filtroLookId = document.getElementById('filtro-look-id');
    if (filtroLookId) filtroLookId.value = '';

    salvarEstadoFiltros();
    renderLooks(obterTodosLooks());
}

function lookPassaNosFiltros(look) {
    for (let campo in app.filtrosLooks) {
        const selecionados = app.filtrosLooks[campo];
        if (!Array.isArray(selecionados) || selecionados.length === 0) continue;

        if (campo === 'lookId') {
            const idLook = normalizarTexto(look.id);
            const passouId = selecionados.some(idFiltro => idLook.includes(normalizarTexto(idFiltro)));
            if (!passouId) return false;
            continue;
        }

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

function criarResumoUsoLook(id, dia = '') {
    return {
        id,
        registrados: 0,
        inferidos: 0,
        total: 0,
        primeiro: dia,
        ultimo: dia,
    };
}

function incrementarUsoLookDetalhado(mapa, lookId, origem, dia) {
    const id = String(lookId || '').trim();
    const chave = normalizarTexto(id);
    if (!chave) return;

    const atual = mapa.get(chave) || criarResumoUsoLook(id, dia);
    if (origem === 'registrado') {
        atual.registrados += 1;
    } else {
        atual.inferidos += 1;
    }
    atual.total = atual.registrados + atual.inferidos;
    if (dia && (!atual.primeiro || dia < atual.primeiro)) atual.primeiro = dia;
    if (dia && (!atual.ultimo || dia > atual.ultimo)) atual.ultimo = dia;
    mapa.set(chave, atual);
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
    const ignorados = obterIdsLooksIgnoradosRegistro(registro);
    const inferidos = inferirLookIdsPelasPecas(registro?.pecas || [])
        .filter(id => !ignorados.has(normalizarTexto(id)));
    return [...new Set([...explicitos, ...inferidos])];
}

function obterLooksRegistroComOrigem(registro) {
    const origemExplicita = registroEhAgendamento(registro) ? 'agendado' : 'registrado';
    const origemInferida = registroEhAgendamento(registro) ? 'agendado' : 'inferido';
    const explicitos = new Map();
    obterLookIdsRegistro(registro).forEach(id => {
        const chave = normalizarTexto(id);
        if (chave && !explicitos.has(chave)) explicitos.set(chave, id);
    });
    const inferidos = new Map();
    const ignorados = obterIdsLooksIgnoradosRegistro(registro);
    inferirLookIdsPelasPecas(registro?.pecas || []).forEach(id => {
        const chave = normalizarTexto(id);
        if (chave && !ignorados.has(chave) && !explicitos.has(chave) && !inferidos.has(chave)) inferidos.set(chave, id);
    });
    const itens = [
        ...[...explicitos.values()].map(id => ({ id, origem: origemExplicita })),
        ...[...inferidos.values()].map(id => ({ id, origem: origemInferida })),
    ];

    return itens;
}

function obterUsosLooksAgrupadosPorDia(registros) {
    const grupos = agruparRegistrosPorDia(registros || []);

    return Object.entries(grupos).map(([dia, registrosDia]) => {
        const registrados = new Map();
        const inferidos = new Map();

        registrosDia.forEach(registro => {
            obterLookIdsRegistro(registro).forEach(id => {
                const chave = normalizarTexto(id);
                if (chave && !registrados.has(chave)) registrados.set(chave, id);
            });
        });

        registrosDia.forEach(registro => {
            const ignorados = obterIdsLooksIgnoradosRegistro(registro);
            inferirLookIdsPelasPecas(registro?.pecas || []).forEach(id => {
                const chave = normalizarTexto(id);
                if (!chave || ignorados.has(chave) || registrados.has(chave) || inferidos.has(chave)) return;
                inferidos.set(chave, id);
            });
        });

        return {
            dia,
            registrados: [...registrados.values()],
            inferidos: [...inferidos.values()],
        };
    });
}

function calcularMapaUsosLooks() {
    const mapa = new Map();

    obterUsosLooksAgrupadosPorDia(obterRegistrosUso(app.historico)).forEach(({ dia, registrados, inferidos }) => {
        registrados.forEach(id => incrementarUsoLookDetalhado(mapa, id, 'registrado', dia));
        inferidos.forEach(id => incrementarUsoLookDetalhado(mapa, id, 'inferido', dia));
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
    return obterMapaUsosLooksAtual().get(normalizarTexto(lookId)) || criarResumoUsoLook(lookId);
}

function formatarTotalUsosLook(usos) {
    if (typeof usos === 'number') return `${usos} ${usos === 1 ? 'uso' : 'usos'}`;
    const registrados = Number(usos?.registrados || 0);
    const inferidos = Number(usos?.inferidos || 0);
    return `${registrados}(${inferidos}) usos`;
}

function formatarUsosLookCompacto(registrados, inferidos) {
    return `${Number(registrados || 0)}(${Number(inferidos || 0)})`;
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
        .join(' · ');
    const tags = normalizarOcasioesLook(look).slice(0, 4).map(ocasiao => `<span>${escapeHtml(ocasiao.descricao)}</span>`).join('');
    const lookId = look.id || look.nome || '';
    const utilizacao = obterUtilizacaoLook(look);
    const totalUsos = contarUsosLook(look.id);

    card.innerHTML = `
        <div class="look-card-foto-wrap">
            <img src="${getCaminhoFotoLook(look.id)}" alt="${escapeHtml(lookId)}" class="look-card-foto" loading="lazy" decoding="async"
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 120 120%22><rect fill=%22%23eee%22 width=%22120%22 height=%22120%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22>sem foto</text></svg>'">
            <span class="look-card-id-badge">${escapeHtml(lookId)}</span>
        </div>
        <div class="look-card-usos">${formatarTotalUsosLook(totalUsos)}</div>
        <div class="look-card-info">
            <h3>${escapeHtml(lookId)}${valorVisivel(utilizacao) ? ` <em>${escapeHtml(utilizacao)}</em>` : ''}</h3>
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
    modal.dataset.lookId = lookId;
    modal.dataset.editando = editando ? 'true' : 'false';

    document.getElementById('titulo-look-modal').textContent = look.nome || look.id;
    document.getElementById('foto-look-modal').src = getCaminhoFotoLook(look.id);
    document.getElementById('usar-look-modal').onclick = () => usarLookHoje(look.id);
    document.getElementById('datas-uso-look-modal').onclick = () => abrirDatasUsoLook(look.id);
    document.getElementById('editar-look-modal').onclick = () => mostrarDetalhesLook(lookId, true);
    document.getElementById('cancelar-edicao-look-modal').onclick = () => mostrarDetalhesLook(lookId, false);
    document.getElementById('salvar-look-modal').onclick = salvarEdicaoLook;
    document.getElementById('editar-look-modal').style.display = editando ? 'none' : '';
    document.getElementById('cancelar-edicao-look-modal').style.display = editando ? '' : 'none';
    document.getElementById('salvar-look-modal').style.display = editando ? '' : 'none';
    document.getElementById('usar-look-modal').style.display = editando ? 'none' : '';
    document.getElementById('datas-uso-look-modal').style.display = editando ? 'none' : '';
    document.getElementById('secao-sugestoes-look-modal').style.display = editando ? 'none' : '';

    const tags = document.getElementById('tags-look-modal');
    const ocasioesNormalizadas = normalizarOcasioesLook(look);
    tags.innerHTML = ocasioesNormalizadas.length
        ? ocasioesNormalizadas.map(ocasiao => `<span title="${escapeHtml(ocasiao.codigo)}">${escapeHtml(ocasiao.descricao)}</span>`).join('')
        : '<span>Sem ocasião definida</span>';

    const ficha = document.getElementById('ficha-look-modal');
    if (editando) {
        ficha.innerHTML = criarFormularioEdicaoLook(look);
    } else {
        renderFichaLookLeitura(look, ficha);
    }

    document.getElementById('pecas-look-modal').innerHTML = (look.pecas || [])
        .filter(id => app.pecas[id])
        .map(id => criarCardPecaHistorico(id, { semSeletor: true, compacto: true }))
        .join('') || '<p class="texto-ajuda">Nenhuma peça cadastrada.</p>';

    document.getElementById('sugestoes-look-modal').innerHTML = ordenarSugestoesLookPorGrupo(look.pecas_sugeridas || [])
        .filter(item => app.pecas[item.id])
        .map(item => criarCardPecaLookSugerida(item))
        .join('') || '<p class="texto-ajuda">Nenhuma sugestão cadastrada.</p>';

    abrirModalEmpilhado(modal);
}

function renderFichaLookLeitura(look, ficha) {
    ficha.innerHTML = `
        <div class="campos-modal-peca campos-modal-look">
            ${criarCamposLookHtml(look)}
        </div>
    `;
}

function criarCamposLookHtml(look) {
    const calculados = obterCalculadosAtuaisLook(look) || {};
    const lookAtual = {
        ...look,
        ...calculados,
        local: calculados.local_calc || look.local,
        utilizacao: calculados.utilizacao_calc || look.utilizacao,
    };
    const campos = [
        ['ID', lookAtual.id, 'ficha-grupo-azul'],
        ['Data de atualização', formatarDataHoraFicha(obterDataAtualizacaoLook(lookAtual)), 'ficha-grupo-azul'],
        ['Peça 1', obterPecaLookPorIndice(lookAtual, 0), 'ficha-grupo-laranja'],
        ['Peça 2', obterPecaLookPorIndice(lookAtual, 1), 'ficha-grupo-laranja'],
        ['Peça 3', obterPecaLookPorIndice(lookAtual, 2), 'ficha-grupo-laranja'],
        ['Categoria', obterCategoriaLook(lookAtual), 'ficha-grupo-vermelho'],
        ['Indicador', obterIndicadorLook(lookAtual, lookAtual.id), 'ficha-grupo-vermelho'],
        ['Local', lookAtual.local_calc || lookAtual.local || obterCampoLookPorNomes(lookAtual, ['Local', 'local']), 'ficha-grupo-roxo'],
        ['Situação', obterSituacaoLook(lookAtual), 'ficha-grupo-verde'],
        ['Utilização', obterUtilizacaoLook(lookAtual), 'ficha-grupo-amarelo'],
        ['Clima', formatarClimaLook(lookAtual), 'ficha-grupo-amarelo'],
        ['Data criação', formatarDataLookFicha(obterDataCriacaoLook(lookAtual)), 'ficha-grupo-azul-claro'],
        ['Data última alteração', formatarDataLookFicha(obterDataUltimaAlteracaoLook(lookAtual)), 'ficha-grupo-azul-claro'],
        ['HTT', obterHttLook(lookAtual), 'ficha-grupo-rosa'],
        ['Data criação HTT', formatarDataLookFicha(obterCampoLookPorNomes(lookAtual, ['Data criação HTT', 'Data criacao HTT', 'Data HTT'])), 'ficha-grupo-rosa'],
        ['Data revisão HTT', formatarDataLookFicha(obterCampoLookPorNomes(lookAtual, ['Data revisão HTT', 'Data revisao HTT', 'Revisão HTT', 'Revisao HTT'])), 'ficha-grupo-rosa'],
        ['Local peças', formatarListaCampoLook(lookAtual.locais_pecas), 'ficha-grupo-laranja'],
        ['Utilização peças', formatarListaCampoLook(lookAtual.utilizacoes_pecas), 'ficha-grupo-laranja'],
        ['Nível aquecimento peças', formatarListaCampoLook(lookAtual.aquecimentos), 'ficha-grupo-laranja'],
    ];

    return campos
        .map(([label, valor, classe]) => criarCampoFichaHtml(label, valorVisivel(valor) ? valor : '-', classe))
        .join('');
}

function obterCampoLookPorNomes(look, nomes) {
    return obterCampoPorNomes(look, nomes)
        || obterCampoPorNomes(look?.basicos, nomes)
        || '';
}

function obterPecaLookPorIndice(look, indice) {
    return look?.pecas?.[indice]
        || obterCampoLookPorNomes(look, [`ID${indice + 1}`, `Peça ${indice + 1}`, `Peca ${indice + 1}`])
        || '';
}

function obterDataUltimaAlteracaoLook(look) {
    return obterCampoLookPorNomes(look, ['Data última alteração', 'Data ultima alteracao', 'Data ult alt', 'Última alteração', 'Ultima alteracao'])
        || look?.dataUltimaAlteracao
        || look?.data_ultima_alteracao
        || '';
}

function obterHttLook(look) {
    const valor = look?.HTT ?? look?.htt ?? look?.basicos?.HTT ?? '';
    return valor === true ? 'true' : String(valor || '');
}

function formatarListaCampoLook(valores) {
    if (!Array.isArray(valores)) return valores || '';
    return valores.map(valor => valorVisivel(valor) ? valor : '-').join(' · ');
}

function formatarDataLookFicha(valor) {
    if (!valor && valor !== 0) return '';
    const data = normalizarDataHistorico(valor);
    if (data) return formatarDataBR(data.slice(0, 10));
    return String(valor);
}

function criarOptionsSituacaoLook(valorAtual) {
    const valores = [...new Set([
        ...(app.dimensoes?.situacoes_look || []).map(item => item.valor),
        ...obterTodosLooks().map(look => look.situacao || look.basicos?.['situação'] || look.basicos?.['situação']).filter(valorVisivel),
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

function normalizarGrupoSugestaoLook(tipo) {
    const normalizado = normalizarTexto(tipo);
    if (normalizado === 'calcado' || normalizado === 'calcados') return 'calcado';
    if (normalizado === 'bolsa' || normalizado === 'bolsas') return 'bolsa';
    if (normalizado === 'cinto' || normalizado === 'cintos') return 'cinto';
    return normalizado;
}

function ordenarSugestoesLookPorGrupo(sugestoes) {
    const ordem = { calcado: 0, bolsa: 1, cinto: 2 };
    return [...(sugestoes || [])].sort((a, b) => {
        const grupoA = normalizarGrupoSugestaoLook(app.pecas[a.id]?.tipo || a.grupo);
        const grupoB = normalizarGrupoSugestaoLook(app.pecas[b.id]?.tipo || b.grupo);
        return (ordem[grupoA] ?? 99) - (ordem[grupoB] ?? 99)
            || String(a.id || '').localeCompare(String(b.id || ''), 'pt-BR', { numeric: true });
    });
}

function rotuloGrupoSugestaoLook(grupo) {
    return {
        calcado: 'Calçados',
        bolsa: 'Bolsas',
        cinto: 'Cintos',
    }[grupo] || formatarLabelCampo(grupo);
}

function criarCardSugestaoLook(option, nomeInput = 'edit-look-sugestoes-card') {
    const id = String(option.value || '').toUpperCase();
    const peca = app.pecas[id] || {};
    const selecionada = option.selected;
    const descricao = [obterNomePeca(peca), peca.cor].filter(valorVisivel).join(' · ') || option.textContent;

    return `
        <label class="look-sugestao-opcao ${selecionada ? 'selecionada' : ''}">
            <input type="checkbox" name="${escapeHtml(nomeInput)}" value="${escapeHtml(id)}" ${selecionada ? 'checked' : ''}>
            ${criarImagem(getCaminhoFoto(id), id)}
            <span>
                <strong>${escapeHtml(id)}</strong>
                <small>${escapeHtml(descricao)}</small>
            </span>
        </label>
    `;
}

function renderSugestoesLookComFotos(selectId = 'edit-look-sugestoes') {
    const select = document.getElementById(selectId);
    if (!select) return;

    select.classList.add('select-nativo-oculto');
    const nomeInput = `${selectId}-card`;

    let container = select.parentElement.querySelector('.look-sugestoes-foto-select');
    if (!container) {
        container = document.createElement('div');
        container.className = 'look-sugestoes-foto-select';
        select.insertAdjacentElement('afterend', container);
    }

    const opcoes = [...select.options];
    const selecionadas = opcoes.filter(option => option.selected).length;
    const grupos = [
        ['calcado', opcoes.filter(option => normalizarGrupoSugestaoLook(app.pecas[option.value]?.tipo || option.dataset.grupo) === 'calcado')],
        ['bolsa', opcoes.filter(option => normalizarGrupoSugestaoLook(app.pecas[option.value]?.tipo || option.dataset.grupo) === 'bolsa')],
        ['cinto', opcoes.filter(option => normalizarGrupoSugestaoLook(app.pecas[option.value]?.tipo || option.dataset.grupo) === 'cinto')],
    ].filter(([, itens]) => itens.length > 0);

    container.innerHTML = `
        <div class="look-sugestoes-topo">
            <span>${selecionadas} selecionada${selecionadas === 1 ? '' : 's'}</span>
        </div>
        <div class="look-sugestoes-grupos">
            ${grupos.map(([grupo, itens]) => `
                <section class="look-sugestoes-grupo">
                    <h4>${rotuloGrupoSugestaoLook(grupo)}</h4>
                    <div class="look-sugestoes-grid">
                        ${itens.map(option => criarCardSugestaoLook(option, nomeInput)).join('')}
                    </div>
                </section>
            `).join('') || '<p class="texto-ajuda">Nenhuma peça disponível.</p>'}
        </div>
    `;

    container.querySelectorAll(`input[name="${nomeInput}"]`).forEach(input => {
        input.addEventListener('change', () => {
            const option = opcoes.find(item => String(item.value).toUpperCase() === String(input.value).toUpperCase());
            if (option) option.selected = input.checked;
            input.closest('.look-sugestao-opcao')?.classList.toggle('selecionada', input.checked);
            renderSugestoesLookComFotos(selectId);
        });
    });
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
    renderSugestoesLookComFotos();
}

function renderControleVisualMultiploEdicaoLook(selectId, placeholder, opcoesRender = {}) {
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

    const listaAnterior = container.querySelector('.edicao-chip-lista');
    const scrollAnterior = listaAnterior?.scrollTop || 0;
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
    inputBusca.addEventListener('input', () => renderControleVisualMultiploEdicaoLook(selectId, placeholder, { preservarScroll: false }));

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

    if (scrollAnterior && opcoesRender.preservarScroll !== false) {
        lista.scrollTop = scrollAnterior;
    }
}

function campoBasicoEditavelLook(campo) {
    const camposGerenciados = new Set([
        'id',
        'id1',
        'id2',
        'id3',
        'situacao',
        'indicador',
        'htt',
        'categoria',
        'local',
        'utilizacao',
        'clima',
        'data criacao',
        'data criação',
        'data ultima alteracao',
        'data última alteração',
        'ultima alteracao',
        'última alteração',
        'data criacao htt',
        'data criação htt',
        'data revisao htt',
        'data revisão htt',
        'col_5',
    ]);
    return !camposGerenciados.has(normalizarTexto(campo));
}

function criarFormularioEdicaoLook(look) {
    const basicos = look.basicos || {};
    const situacaoAtual = look.situacao || basicos['situação'] || basicos['situação'] || '';
    const httAtual = String(look.HTT || look.htt || basicos.HTT || '');
    const opcoesSituacao = criarOptionsSituacaoLook(situacaoAtual);
    const opcoesIndicador = criarOptionsIndicadorLook(obterIndicadorLook(look, look.id));
    const opcoesHtt = criarOptionsHttLook(httAtual);
    const opcoesOcasioes = criarOptionsOcasioesLook(look.ocasioes || []);
    const opcoesSugestoes = criarOptionsSugestoesLook(look.pecas_sugeridas || []);
    const opcoesPecas = criarOptionsPecasLook('');
    setTimeout(() => {
        configurarRecalculoEdicaoLook();
        configurarControlesVisuaisEdicaoLook();
    }, 0);

    return `
        <div id="form-edicao-look" class="form-edicao-look">
            <label class="campo-edicao-look ficha-grupo-azul">
                <span>ID do look</span>
                <input type="text" id="edit-look-id" value="${escapeHtml(look.id || '')}" disabled>
            </label>
            <label class="campo-edicao-look ficha-grupo-azul">
                <span>Data de atualização</span>
                <input type="text" value="${escapeHtml(formatarDataHoraFicha(obterDataAtualizacaoLook(look)) || '-')}" disabled>
            </label>
            ${[0, 1, 2].map(indice => `
                <label class="campo-edicao-look ficha-grupo-laranja">
                    <span>Peça ${indice + 1}</span>
                    <select id="edit-look-peca${indice + 1}">
                        <option value="">Sem peça</option>
                        ${criarOptionsPecasLook(obterPecaLookPorIndice(look, indice))}
                    </select>
                </label>
            `).join('')}
            <label class="campo-edicao-look ficha-grupo-vermelho">
                <span>Categoria</span>
                <input type="text" id="edit-look-categoria-calc" value="${escapeHtml(obterCategoriaLook(look) || '-')}" disabled>
            </label>
            <label class="campo-edicao-look ficha-grupo-vermelho">
                <span>Indicador</span>
                <select id="edit-look-indicador">${opcoesIndicador}</select>
            </label>
            <label class="campo-edicao-look ficha-grupo-roxo">
                <span>Local</span>
                <input type="text" id="edit-look-local-calc" value="${escapeHtml(look.local_calc || look.local || '')}" disabled>
            </label>
            <label class="campo-edicao-look ficha-grupo-verde">
                <span>Situação</span>
                <select id="edit-look-situacao">${opcoesSituacao}</select>
            </label>
            <label class="campo-edicao-look ficha-grupo-amarelo">
                <span>Utilização</span>
                <input type="text" id="edit-look-utilizacao-calc" value="${escapeHtml(look.utilizacao_calc || look.utilizacao || '')}" disabled>
            </label>
            <label class="campo-edicao-look ficha-grupo-amarelo">
                <span>Clima</span>
                <input type="text" id="edit-look-clima-calc" value="${escapeHtml(look.clima_calc || look.clima || '')}" disabled>
            </label>
            <label class="campo-edicao-look ficha-grupo-azul-claro">
                <span>Data criação</span>
                <input type="date" data-basico="Data criação" value="${escapeHtml(formatarDataInputDetalhePeca(obterDataCriacaoLook(look)))}">
            </label>
            <label class="campo-edicao-look ficha-grupo-azul-claro">
                <span>Data última alteração</span>
                <input type="date" data-basico="Data última alteração" value="${escapeHtml(formatarDataInputDetalhePeca(obterDataUltimaAlteracaoLook(look)))}">
            </label>
            <label class="campo-edicao-look ficha-grupo-rosa">
                <span>HTT</span>
                <select id="edit-look-htt">${opcoesHtt}</select>
            </label>
            <label class="campo-edicao-look ficha-grupo-rosa">
                <span>Data criação HTT</span>
                <input type="date" data-basico="Data criação HTT" value="${escapeHtml(formatarDataInputDetalhePeca(obterCampoLookPorNomes(look, ['Data criação HTT', 'Data criacao HTT', 'Data HTT'])))}">
            </label>
            <label class="campo-edicao-look ficha-grupo-rosa">
                <span>Data revisão HTT</span>
                <input type="date" data-basico="Data revisão HTT" value="${escapeHtml(formatarDataInputDetalhePeca(obterCampoLookPorNomes(look, ['Data revisão HTT', 'Data revisao HTT', 'Revisão HTT', 'Revisao HTT'])))}">
            </label>
            <label class="campo-edicao-look ficha-grupo-outros">
                <span>Nome</span>
                <input type="text" id="edit-look-nome" value="${escapeHtml(look.nome || look.id || '')}">
            </label>
            <label class="campo-edicao-look ficha-grupo-outros">
                <span>Foto URL</span>
                <input type="text" id="edit-look-foto" value="${escapeHtml(look.foto || '')}">
            </label>
            <label class="campo-edicao-look campo-edicao-look-largo ficha-grupo-outros">
                <span>Nova foto</span>
                <input type="file" id="edit-look-foto-arquivo" accept="image/*">
            </label>
            <label class="campo-edicao-look campo-edicao-look-largo ficha-grupo-azul-claro">
                <span>Ocasiões</span>
                <select id="edit-look-ocasioes" multiple size="8">${opcoesOcasioes}</select>
            </label>
            <label class="campo-edicao-look campo-edicao-look-largo ficha-grupo-outros">
                <span>Acessórios e calçados sugeridos</span>
                <select id="edit-look-sugestoes" multiple size="10">${opcoesSugestoes}</select>
            </label>
        </div>
    `;
}

function configurarRecalculoEdicaoLook() {
    const camposPecas = [1, 2, 3]
        .map(numero => document.getElementById(`edit-look-peca${numero}`))
        .filter(Boolean);

    const atualizar = () => {
        const calculados = calcularDadosLookPorPecas(obterPecasSelecionadasEdicaoLook());
        const clima = document.getElementById('edit-look-clima-calc');
        const local = document.getElementById('edit-look-local-calc');
        const utilizacao = document.getElementById('edit-look-utilizacao-calc');
        const aquecimentos = document.getElementById('edit-look-aquecimentos');
        const locais = document.getElementById('edit-look-locais-pecas');
        const utilizacoes = document.getElementById('edit-look-utilizacoes-pecas');
        const categoria = document.getElementById('edit-look-categoria-calc');
        const indicador = document.getElementById('edit-look-indicador')?.value || '';
        if (clima) clima.value = calculados.clima_calc || '';
        if (local) local.value = calculados.local_calc || '';
        if (utilizacao) utilizacao.value = calculados.utilizacao_calc || '';
        if (aquecimentos) aquecimentos.value = formatarListaCampoLook(calculados.aquecimentos);
        if (locais) locais.value = formatarListaCampoLook(calculados.locais_pecas);
        if (utilizacoes) utilizacoes.value = formatarListaCampoLook(calculados.utilizacoes_pecas);
        if (categoria) categoria.value = obterCategoriaIndicadorLook(indicador) || '-';
    };

    camposPecas.forEach(campo => campo.addEventListener('change', atualizar));
    document.getElementById('edit-look-indicador')?.addEventListener('change', atualizar);
    atualizar();
}

function obterPecasSelecionadasEdicaoLook() {
    const camposIndividuais = [1, 2, 3]
        .map(numero => document.getElementById(`edit-look-peca${numero}`))
        .filter(Boolean);
    if (camposIndividuais.length) {
        return camposIndividuais
            .map(campo => String(campo.value || '').trim().toUpperCase())
            .filter(Boolean);
    }

    const pecasFixas = document.getElementById('edit-look-pecas-fixas')?.value || '';
    if (pecasFixas) {
        return parseListaIdsEdicaoLook(pecasFixas).map(id => id.toUpperCase());
    }

    return parseListaIdsEdicaoLook(document.getElementById('edit-look-pecas')?.value || '')
        .map(id => id.toUpperCase());
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
        utilizacao_calc: calcularUtilizacaoLookPorPecas(utilizacoesValidas, locaisValidos),
        utilizacoes_pecas: preencherAteTres(utilizacoes),
    };
}

function atualizarCalculadosLook(look, pecas, dataAtualizacao, opcoes = {}) {
    const calculados = calcularDadosLookPorPecas(pecas);
    const basicos = {
        ...(look.basicos || {}),
        ID: look.id,
        ID1: pecas[0] || '',
        ID2: pecas[1] || '',
        ID3: pecas[2] || '',
    };
    const atualizacoes = opcoes.preservarDataAtualizacao
        ? (valorVisivel(look.editadoEm) ? { editadoEm: look.editadoEm } : {})
        : { editadoEm: dataAtualizacao };

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
        ...atualizacoes,
        substituiLookBase: Boolean(app.looks[look.id] || look.substituiLookBase) || undefined,
        id_original: undefined,
    };
}

function recalcularLooksAfetadosPorPeca(pecaIds, opcoes = {}) {
    const idsAfetados = new Set((pecaIds || []).map(id => String(id || '').trim().toUpperCase()).filter(Boolean));
    if (idsAfetados.size === 0) return 0;

    const idAntigo = String(opcoes.idAntigo || '').trim().toUpperCase();
    const idNovo = String(opcoes.idNovo || '').trim().toUpperCase();
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

        const lookLocal = Boolean(app.looksFavoritos?.[look.id]);
        const devePersistir = lookLocal || trocouId;
        if (!devePersistir) return;

        const pecasUnicas = [...new Set(pecas.filter(Boolean))];
        const lookAtualizado = atualizarCalculadosLook(look, pecasUnicas, null, { preservarDataAtualizacao: true });
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

function calcularUtilizacaoLookPorPecas(utilizacoes, locais) {
    const usos = (utilizacoes || []).filter(Boolean);
    const locaisUnicos = [...new Set((locais || []).filter(Boolean).map(valor => normalizarTexto(valor)))];
    if (locaisUnicos.length > 1) return 'mix';
    if (usos.length === 0) return '';

    const usosNormalizados = usos.map(valor => normalizarTexto(valor));
    const usosUnicos = [...new Set(usosNormalizados)];
    if (usosUnicos.length === 1) {
        if (usosUnicos[0] === 'sair') return 'produzido';
        if (usosUnicos[0] === 'mista') return 'simples';
        return usos[0];
    }

    const total = usosNormalizados.length;
    const totalCasa = usosNormalizados.filter(valor => valor === 'casa').length;
    const totalMista = usosNormalizados.filter(valor => valor === 'mista').length;
    const totalSair = usosNormalizados.filter(valor => valor === 'sair').length;

    if (totalCasa === 1 && totalCasa < total) return 'desleixado';
    if (totalCasa === 2 && totalMista === 1 && total === 3) return 'caseiro';
    if (totalCasa === 2 && totalSair === 1 && total === 3) return 'conforto';
    if ([1, 2].includes(totalMista) && totalMista + totalSair === total) return 'simples';

    return '';
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
    const pecas = obterPecasSelecionadasEdicaoLook();
    const ocasioes = parseOcasioesEdicaoLook(obterOcasioesSelecionadasEdicaoLook());
    const calculados = calcularDadosLookPorPecas(pecas);

    basicos.ID = lookId;
    basicos.ID1 = pecas[0] || '';
    basicos.ID2 = pecas[1] || '';
    basicos.ID3 = pecas[2] || '';
    basicos.Indicador = indicador;
    basicos['situação'] = situacao;
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
        reader.onerror = () => reject(new Error('Não consegui ler a foto do look.'));
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

/* ==================== PÁGINA HISTÓRICO ====================
   Mostra estatísticas de uso */

/* ==================== PAGINA OCASIOES ==================== */

function inicializarPaginaOcasioes() {
    if (!document.getElementById('ocasioes')) return;

    preencherFiltrosPaginaOcasioes();
    renderPaginaOcasioes();
}

function obterOcasioesOrdenadas() {
    return Object.entries(app.mapaOcasioes || {})
        .map(([codigo, info]) => ({
            ...info,
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
            <span class="ocasioes-dropdown-seta">⌄</span>
        </button>
        <div class="ocasioes-dropdown-painel">
            <div class="ocasioes-dropdown-acoes">
                <button type="button" data-acao="todos">Selecionar todos</button>
                <button type="button" data-acao="limpar">Limpar</button>
            </div>
            <div class="ocasioes-dropdown-lista">
                ${opcoes.map(option => `
                    <button type="button" class="ocasioes-dropdown-opcao ${selecionados.includes(option.value) ? 'ativo' : ''}" data-valor="${escapeHtml(option.value)}">
                        <span class="ocasioes-dropdown-check">${selecionados.includes(option.value) ? '✓' : ''}</span>
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

function selecionarGrupoGraficoOcasioes(tipo, valor) {
    const campo = tipo === 'ocasiao' ? 'ocasiao' : 'clima';
    const valorNormalizado = String(valor || '');
    if (!valorNormalizado) return;

    const selecionados = app.filtrosOcasioes[campo] || [];
    app.filtrosOcasioes[campo] = selecionados.length === 1 && selecionados[0] === valorNormalizado
        ? []
        : [valorNormalizado];
    app.filtrosOcasioes.lookId = '';
    salvarEstadoFiltros();
    preencherFiltrosPaginaOcasioes();
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

    renderFichaOcasiao(codigosSelecionados, looks);
    renderLooksSimplesPaginaOcasioes(looks);
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
    const valores = obterValoresOcasiaoLook(look).map(valor => normalizarTexto(valor));

    if ((look.ocasioes || []).some(item => normalizarTexto(item.codigo) === alvo || normalizarTexto(item.descricao) === descricao)) {
        return true;
    }

    if (descricao && valores.some(valor => valor === descricao)) return true;
    return valores.some(valor => valor.includes(alvo));
}

function lookEhHTT(look) {
    return normalizarTexto(look?.HTT || look?.htt || look?.basicos?.HTT) === 'true';
}

function contarUsosLooksOcasiao(lookIds) {
    if (!lookIds.size) return 0;

    return obterRegistrosUso(app.historico).reduce((total, registro) => {
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

function renderLooksSimplesPaginaOcasioes(looks) {
    const container = document.getElementById('ocasioes-lista-looks-simples');
    const contador = document.getElementById('ocasioes-looks-simples-contagem');
    if (!container) return;

    if (contador) contador.textContent = looks.length;
    container.innerHTML = looks.length
        ? looks.map(look => criarMiniCardLookSimplesOcasioes(look)).join('')
        : '<p class="texto-ajuda">Nenhum look encontrado para essa ocasiao.</p>';
}

function criarMiniCardLookSimplesOcasioes(look) {
    const selecionado = app.filtrosOcasioes.lookId === look.id;
    return `
        <div class="ocasioes-mini-card ocasioes-mini-card-look-simples ${selecionado ? 'selecionado' : ''}"
             role="button"
             tabindex="0"
             onclick="selecionarLookOcasioes('${escapeHtml(look.id)}')"
             onkeydown="if(event.key === 'Enter' || event.key === ' '){event.preventDefault(); selecionarLookOcasioes('${escapeHtml(look.id)}');}"
             title="Filtrar sugestoes por este look">
            <img src="${getCaminhoFotoLook(look.id)}" alt="${escapeHtml(look.id)}"
                 onerror="this.src='${imagemFallback()}';">
            <strong>${escapeHtml(look.id)}</strong>
            <div class="ocasioes-mini-acoes ocasioes-mini-acoes-simples">
                <button type="button" onclick="event.stopPropagation(); mostrarDetalhesLook('${escapeHtml(look.id)}')">Ficha</button>
            </div>
        </div>
    `;
}

function renderLooksPaginaOcasioes(looks) {
    const container = document.getElementById('ocasioes-lista-looks');
    const contador = document.getElementById('ocasioes-looks-contagem');
    if (!container) return;

    renderAcoesLooksOcasioes(looks);
    if (contador) contador.textContent = looks.length;
    container.innerHTML = looks.length
        ? looks.map(look => criarMiniCardLookOcasioes(look)).join('')
        : '<p class="texto-ajuda">Nenhum look encontrado para essa ocasiao.</p>';
}

function renderAcoesLooksOcasioes(looks) {
    const container = document.getElementById('ocasioes-looks-acoes');
    if (!container) return;

    const idsDisponiveis = new Set(looks.map(look => look.id));
    app.looksOcasioesSelecionados = (app.looksOcasioesSelecionados || []).filter(id => idsDisponiveis.has(id));
    const selecionados = app.looksOcasioesSelecionados.length;
    const opcoesOcasioes = criarOptionsOcasioesLook([]);
    const opcoesSugestoes = criarOptionsSugestoesLook([]);

    container.innerHTML = `
        <div class="ocasioes-looks-selecao">
            <button type="button" class="btn-secundario" onclick="selecionarTodosLooksOcasioes()">Selecionar todos</button>
            <button type="button" class="btn-secundario" onclick="limparSelecaoLooksOcasioes()">Limpar</button>
            <span>${selecionados} selecionado${selecionados === 1 ? '' : 's'}</span>
        </div>
        <div class="ocasioes-lote">
            <label>
                <span>Acessório/calçado</span>
                <select id="ocasioes-lote-acessorio">
                    <option value="">Selecione</option>
                    ${opcoesSugestoes}
                </select>
            </label>
            <button type="button" class="btn-secundario" onclick="aplicarAcessorioLooksOcasioes('adicionar')">Adicionar</button>
            <button type="button" class="btn-secundario" onclick="aplicarAcessorioLooksOcasioes('remover')">Remover</button>
            <label>
                <span>Ocasião</span>
                <select id="ocasioes-lote-ocasiao">
                    <option value="">Selecione</option>
                    ${opcoesOcasioes}
                </select>
            </label>
            <button type="button" class="btn-secundario" onclick="aplicarOcasiaoLooksOcasioes('adicionar')">Adicionar</button>
            <button type="button" class="btn-secundario" onclick="aplicarOcasiaoLooksOcasioes('remover')">Remover</button>
        </div>
    `;
}

function criarMiniCardLookOcasioes(look) {
    const selecionado = app.filtrosOcasioes.lookId === look.id;
    const marcado = (app.looksOcasioesSelecionados || []).includes(look.id);
    return `
        <div class="ocasioes-mini-card ocasioes-mini-card-look ${selecionado ? 'selecionado' : ''} ${marcado ? 'marcado' : ''}">
            <label class="ocasioes-mini-check">
                <input type="checkbox" ${marcado ? 'checked' : ''} onchange="alternarSelecaoLookOcasioes('${escapeHtml(look.id)}')">
                <span>Selecionar</span>
            </label>
            <img src="${getCaminhoFotoLook(look.id)}" alt="${escapeHtml(look.id)}"
                 onerror="this.src='${imagemFallback()}';">
            <strong>${escapeHtml(look.id)}</strong>
            <div class="ocasioes-mini-acoes">
                <button type="button" class="btn-secundario" onclick="mostrarDetalhesLook('${escapeHtml(look.id)}')">Ficha</button>
                <button type="button" class="btn-secundario" onclick="selecionarLookOcasioes('${escapeHtml(look.id)}')" title="Filtrar acessórios por este look">Filtrar</button>
            </div>
        </div>
    `;
}

function alternarSelecaoLookOcasioes(lookId) {
    const selecionados = new Set(app.looksOcasioesSelecionados || []);
    if (selecionados.has(lookId)) {
        selecionados.delete(lookId);
    } else {
        selecionados.add(lookId);
    }
    app.looksOcasioesSelecionados = [...selecionados];
    renderPaginaOcasioes();
}

function selecionarTodosLooksOcasioes() {
    app.looksOcasioesSelecionados = obterLooksPaginaOcasioes(app.filtrosOcasioes.ocasiao || []).map(look => look.id);
    renderPaginaOcasioes();
}

function limparSelecaoLooksOcasioes() {
    app.looksOcasioesSelecionados = [];
    renderPaginaOcasioes();
}

function obterIdsLooksSelecionadosOcasioes() {
    return [...new Set(app.looksOcasioesSelecionados || [])].filter(id => Boolean(obterLookPorId(id)));
}

function aplicarAcessorioLooksOcasioes(acao) {
    const ids = obterIdsLooksSelecionadosOcasioes();
    const pecaId = String(document.getElementById('ocasioes-lote-acessorio')?.value || '').trim().toUpperCase();
    if (!ids.length) {
        alert('Selecione pelo menos um look.');
        return;
    }
    if (!pecaId || !app.pecas[pecaId]) {
        alert('Selecione um acessório ou calçado válido.');
        return;
    }

    if (acao === 'remover') {
        removerAcessorioDosLooks(ids, pecaId);
    } else {
        adicionarAcessorioAosLooks(ids, pecaId);
    }
}

function aplicarOcasiaoLooksOcasioes(acao) {
    const ids = obterIdsLooksSelecionadosOcasioes();
    const codigo = String(document.getElementById('ocasioes-lote-ocasiao')?.value || '').trim();
    if (!ids.length) {
        alert('Selecione pelo menos um look.');
        return;
    }
    if (!codigo || !app.mapaOcasioes[codigo]) {
        alert('Selecione uma ocasião válida.');
        return;
    }

    if (acao === 'remover') {
        removerOcasioesDosLooks(ids, [codigo]);
    } else {
        adicionarOcasioesAosLooks(ids, [codigo]);
    }
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
        <button type="button"
                class="ocasioes-barra-clima ${grupo.selecionado ? 'selecionado' : ''}"
                onclick="selecionarGrupoGraficoOcasioes('${grupo.tipo}', '${escapeHtml(grupo.valor)}')"
                title="Filtrar looks e acessorios por ${escapeHtml(grupo.label)}">
            <div class="ocasioes-barras">
                <span class="barra-serie">
                    <strong>${grupo.atual}</strong>
                    <span class="barra-atual" style="height:${Math.max(4, (grupo.atual / maximo) * 96)}px" title="${grupo.atual} HTT atuais"></span>
                </span>
                <span class="barra-serie">
                    <strong>${grupo.necessario}</strong>
                    <span class="barra-htt" style="height:${Math.max(4, (grupo.necessario / maximo) * 96)}px" title="${grupo.necessario} necessários"></span>
                </span>
            </div>
            <small>${escapeHtml(grupo.label)}</small>
        </button>
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
            total + obterQuantidadeNecessariaOcasiao(app.mapaOcasioes?.[codigo], clima.codigo), 0);
        const valor = String(clima.codigo);
        return {
            label: clima.descricao || clima.codigo,
            valor,
            tipo: 'clima',
            selecionado: (app.filtrosOcasioes.clima || []).includes(valor),
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
            ? climas.reduce((total, clima) => total + obterQuantidadeNecessariaOcasiao(ocasiao, clima), 0)
            : obterTotalNecessarioOcasiao(ocasiao);
        return {
            label: `${ocasiao.codigo} ${ocasiao.descricao}`,
            valor: ocasiao.codigo,
            tipo: 'ocasiao',
            selecionado: (app.filtrosOcasioes.ocasiao || []).includes(ocasiao.codigo),
            atual: looks.filter(lookEhHTT).length,
            necessario,
        };
    });
}

function renderFichaOcasiao(codigosSelecionados, looks) {
    const container = document.getElementById('ocasioes-ficha-conteudo');
    const botaoEditar = document.getElementById('ocasioes-editar-ficha');
    const botaoSalvar = document.getElementById('ocasioes-salvar-ficha');
    const botaoCancelar = document.getElementById('ocasioes-cancelar-ficha');
    if (!container) return;

    const codigo = codigosSelecionados.length === 1 ? codigosSelecionados[0] : '';
    const ocasiao = codigo ? app.mapaOcasioes?.[codigo] || {} : null;
    const podeEditar = Boolean(codigo && ocasiao);
    if (botaoEditar) botaoEditar.style.display = podeEditar && !app.editandoOcasiao ? '' : 'none';
    if (botaoSalvar) botaoSalvar.style.display = podeEditar && app.editandoOcasiao ? '' : 'none';
    if (botaoCancelar) botaoCancelar.style.display = podeEditar && app.editandoOcasiao ? '' : 'none';

    if (!podeEditar) {
        app.editandoOcasiao = false;
        container.innerHTML = '<p class="texto-ajuda">Selecione uma única ocasião para ver e editar a ficha.</p>';
        return;
    }

    const looksCount = looks.length;
    const climasNecessarios = obterClimasEditaveisOcasioes();
    const quantidadesNecessarias = obterQuantidadesNecessariasOcasiao(ocasiao);
    if (app.editandoOcasiao) {
        const tipos = [...new Set([
            ...Object.values(app.mapaOcasioes || {}).map(item => item.tipo).filter(Boolean),
            ...(app.ocasioes || []),
        ])].sort((a, b) => a.localeCompare(b, 'pt-BR'));
        container.innerHTML = `
            <div class="ocasioes-ficha-form">
                <label>
                    <span>Código</span>
                    <input id="ocasiao-edit-codigo" type="text" value="${escapeHtml(codigo)}">
                </label>
                <label>
                    <span>Nome</span>
                    <input id="ocasiao-edit-nome" type="text" value="${escapeHtml(ocasiao.descricao || '')}">
                </label>
                <label>
                    <span>Tipo</span>
                    <input id="ocasiao-edit-tipo" type="text" list="ocasioes-tipos-lista" value="${escapeHtml(ocasiao.tipo || '')}">
                    <datalist id="ocasioes-tipos-lista">
                        ${tipos.map(tipo => `<option value="${escapeHtml(tipo)}"></option>`).join('')}
                    </datalist>
                </label>
                <label>
                    <span>Data de revisão</span>
                    <input id="ocasiao-edit-data-revisao" type="date" value="${escapeHtml(ocasiao.data_revisao || '')}">
                </label>
                <label>
                    <span>Looks</span>
                    <input type="text" value="${looksCount}" disabled>
                </label>
                <div class="ocasioes-necessarios-edicao">
                    <span>Quantidade necessária por clima</span>
                    <div class="ocasioes-necessarios-grid">
                        ${climasNecessarios.map(clima => `
                            <label>
                                <span>${escapeHtml(clima.descricao || clima.codigo)}</span>
                                <input class="ocasiao-edit-necessario"
                                       type="number"
                                       min="0"
                                       step="1"
                                       inputmode="numeric"
                                       data-clima="${escapeHtml(clima.codigo)}"
                                       value="${escapeHtml(Number(quantidadesNecessarias[String(clima.codigo)] || quantidadesNecessarias[clima.codigo] || 0))}">
                            </label>
                        `).join('')}
                    </div>
                </div>
                <div class="ocasioes-adicionar-look">
                    <label>
                        <span>Pesquisar look para adicionar</span>
                        <input id="ocasiao-look-busca" type="search" list="ocasioes-looks-disponiveis" placeholder="Ex.: AL0001">
                        <datalist id="ocasioes-looks-disponiveis">
                            ${obterTodosLooks().map(look => `<option value="${escapeHtml(look.id)}">${escapeHtml(look.id)}</option>`).join('')}
                        </datalist>
                    </label>
                    <button type="button" class="btn-secundario" onclick="adicionarLookPesquisadoNaOcasiao()">Adicionar</button>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="ficha-peca ocasioes-ficha-propriedades">
            ${criarCampoFichaHtml('Código', codigo, 'ficha-grupo-azul')}
            ${criarCampoFichaHtml('Nome', ocasiao.descricao || codigo, 'ficha-grupo-vermelho')}
            ${criarCampoFichaHtml('Tipo', ocasiao.tipo || '-', 'ficha-grupo-roxo')}
            ${criarCampoFichaHtml('Data revisão', ocasiao.data_revisao ? formatarDataBR(ocasiao.data_revisao) : '-', 'ficha-grupo-azul-claro')}
            ${criarCampoFichaHtml('Looks', looksCount, 'ficha-grupo-verde')}
        </div>
        <div class="ocasioes-necessarios-resumo">
            <h4>Quantidade necessária por clima</h4>
            <div class="ocasioes-necessarios-grid">
                ${climasNecessarios.map(clima => `
                    <div class="ocasioes-necessario-card">
                        <span>${escapeHtml(clima.descricao || clima.codigo)}</span>
                        <strong>${escapeHtml(Number(quantidadesNecessarias[String(clima.codigo)] || quantidadesNecessarias[clima.codigo] || 0))}</strong>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function editarFichaOcasiao() {
    if ((app.filtrosOcasioes.ocasiao || []).length !== 1) {
        alert('Selecione uma única ocasião para editar.');
        return;
    }
    app.editandoOcasiao = true;
    renderPaginaOcasioes();
}

function cancelarEdicaoFichaOcasiao() {
    app.editandoOcasiao = false;
    renderPaginaOcasioes();
}

function salvarFichaOcasiao() {
    const codigoAtual = (app.filtrosOcasioes.ocasiao || [])[0];
    if (!codigoAtual) return;

    const codigoNovo = String(document.getElementById('ocasiao-edit-codigo')?.value || '').trim().toUpperCase();
    const descricao = String(document.getElementById('ocasiao-edit-nome')?.value || '').trim();
    const tipo = String(document.getElementById('ocasiao-edit-tipo')?.value || '').trim();
    const dataRevisao = String(document.getElementById('ocasiao-edit-data-revisao')?.value || '').trim();
    const quantidadesNecessarias = {};
    document.querySelectorAll('.ocasiao-edit-necessario').forEach(input => {
        const clima = String(input.dataset.clima || '').trim();
        if (!clima) return;
        quantidadesNecessarias[clima] = Math.max(0, Number.parseInt(input.value, 10) || 0);
    });
    if (!codigoNovo || !descricao) {
        alert('Preencha pelo menos código e nome da ocasião.');
        return;
    }
    if (codigoNovo !== codigoAtual && app.mapaOcasioes[codigoNovo]) {
        alert('Já existe uma ocasião com esse código. Escolha outro código.');
        return;
    }

    const editadaEm = new Date().toISOString();
    const ocasiaoOriginal = app.mapaOcasioes?.[codigoAtual] || {};
    const ocasiaoEditada = {
        ...ocasiaoOriginal,
        codigo: codigoNovo,
        descricao,
        tipo,
        data_revisao: dataRevisao,
        quantidades_necessarias: quantidadesNecessarias,
        total_necessario: Object.values(quantidadesNecessarias).reduce((soma, valor) => soma + valor, 0),
        editadaEm,
    };

    if (codigoNovo !== codigoAtual) {
        app.ocasioesPersonalizadas[codigoAtual] = {
            ...(app.mapaOcasioes?.[codigoAtual] || {}),
            removida: true,
            editadaEm,
        };
        substituirCodigoOcasiaoNosLooks(codigoAtual, codigoNovo, ocasiaoEditada);
    }

    app.ocasioesPersonalizadas[codigoNovo] = ocasiaoEditada;
    aplicarOcasioesPersonalizadas();
    app.filtrosOcasioes.ocasiao = [codigoNovo];
    app.editandoOcasiao = false;
    salvarDados();
    preencherFiltrosPaginaOcasioes();
    renderPaginaOcasioes();
}

function substituirCodigoOcasiaoNosLooks(codigoAtual, codigoNovo, ocasiaoNova) {
    obterTodosLooks()
        .filter(look => lookTemOcasiao(look, codigoAtual))
        .forEach(look => {
            const editado = obterLookEditavelParaOcasioes(look.id);
            editado.ocasioes = normalizarOcasioesLook(editado)
                .filter(item => normalizarTexto(item.codigo) !== normalizarTexto(codigoAtual))
                .concat([criarOcasiaoLook(codigoNovo, ocasiaoNova)]);
            editado.ocasiao = editado.ocasioes.map(item => item.descricao).join(', ');
            salvarLookEditadoPorOcasioes(editado);
        });
}

function adicionarLookPesquisadoNaOcasiao() {
    const codigo = (app.filtrosOcasioes.ocasiao || [])[0];
    const lookId = String(document.getElementById('ocasiao-look-busca')?.value || '').trim().toUpperCase();
    if (!codigo || !lookId) return;
    if (!obterLookPorId(lookId)) {
        alert('Look não encontrado.');
        return;
    }
    adicionarOcasioesAosLooks([lookId], [codigo]);
    const input = document.getElementById('ocasiao-look-busca');
    if (input) input.value = '';
}

function obterLookEditavelParaOcasioes(lookId) {
    const lookOriginal = obterLookPorId(lookId);
    if (!lookOriginal) return null;
    return {
        ...lookOriginal,
        id: lookId,
        pecas: [...(lookOriginal.pecas || [])],
        pecas_sugeridas: [...(lookOriginal.pecas_sugeridas || [])],
        ocasioes: normalizarOcasioesLook(lookOriginal),
        basicos: {
            ...(lookOriginal.basicos || {}),
            ID: lookId,
        },
        editadoLocalmente: true,
        editadoEm: new Date().toISOString(),
        substituiLookBase: Boolean(app.looks[lookId] || lookOriginal.substituiLookBase) || undefined,
        id_original: undefined,
    };
}

function salvarLookEditadoPorOcasioes(lookEditado) {
    if (!lookEditado?.id) return;
    app.looksFavoritos[lookEditado.id] = {
        ...lookEditado,
        ocasiao: normalizarOcasioesLook(lookEditado).map(item => item.descricao).join(', '),
    };
}

function normalizarOcasioesLook(look) {
    const mapa = new Map();
    const adicionar = item => {
        if (!item) return;
        const codigoInformado = String(item.codigo || '').trim();
        const descricao = String(item.descricao || item.nome || '').trim();
        const codigoPorDescricao = obterCodigoOcasiaoPorDescricao(descricao);
        const codigo = app.mapaOcasioes?.[codigoInformado] ? codigoInformado : (codigoPorDescricao || codigoInformado);
        const info = codigo ? app.mapaOcasioes?.[codigo] : null;
        const descricaoFinal = descricao || info?.descricao || codigo;
        const chave = normalizarTexto(codigo || descricaoFinal);
        if (!chave) return;
        mapa.set(chave, {
            codigo,
            descricao: descricaoFinal,
            tipo: item.tipo || info?.tipo || '',
        });
    };

    (look?.ocasioes || []).forEach(adicionar);
    if (look?.ocasiao) {
        String(look.ocasiao).split(',').map(item => item.trim()).filter(Boolean).forEach(descricao => adicionar({ descricao }));
    }

    return [...mapa.values()];
}

function obterCodigoOcasiaoPorDescricao(descricao) {
    const alvo = normalizarTexto(descricao);
    if (!alvo) return '';
    return Object.entries(app.mapaOcasioes || {}).find(([, info]) => normalizarTexto(info?.descricao) === alvo)?.[0] || '';
}

function criarOcasiaoLook(codigo, info = app.mapaOcasioes?.[codigo]) {
    return {
        codigo,
        descricao: info?.descricao || codigo,
        tipo: info?.tipo || '',
    };
}

function adicionarOcasioesAosLooks(lookIds, codigos) {
    const validos = (codigos || []).filter(codigo => app.mapaOcasioes?.[codigo]);
    if (!validos.length) return;
    lookIds.forEach(lookId => {
        const lookEditado = obterLookEditavelParaOcasioes(lookId);
        if (!lookEditado) return;
        const mapa = new Map(normalizarOcasioesLook(lookEditado).map(item => [normalizarTexto(item.codigo || item.descricao), item]));
        validos.forEach(codigo => {
            mapa.set(normalizarTexto(codigo), criarOcasiaoLook(codigo));
        });
        lookEditado.ocasioes = [...mapa.values()];
        salvarLookEditadoPorOcasioes(lookEditado);
    });
    finalizarEdicaoLooksOcasioes();
}

function removerOcasioesDosLooks(lookIds, codigos) {
    const remover = new Set((codigos || []).map(normalizarTexto));
    if (!remover.size) return;
    lookIds.forEach(lookId => {
        const lookEditado = obterLookEditavelParaOcasioes(lookId);
        if (!lookEditado) return;
        lookEditado.ocasioes = normalizarOcasioesLook(lookEditado)
            .filter(item => !remover.has(normalizarTexto(item.codigo || item.descricao)));
        salvarLookEditadoPorOcasioes(lookEditado);
    });
    finalizarEdicaoLooksOcasioes();
}

function criarSugestaoLookPorPeca(pecaId) {
    return {
        id: pecaId,
        grupo: app.pecas?.[pecaId]?.tipo || '',
    };
}

function adicionarAcessorioAosLooks(lookIds, pecaId) {
    lookIds.forEach(lookId => {
        const lookEditado = obterLookEditavelParaOcasioes(lookId);
        if (!lookEditado) return;
        const mapa = new Map((lookEditado.pecas_sugeridas || []).filter(item => item?.id).map(item => [normalizarTexto(item.id), item]));
        mapa.set(normalizarTexto(pecaId), criarSugestaoLookPorPeca(pecaId));
        lookEditado.pecas_sugeridas = [...mapa.values()];
        salvarLookEditadoPorOcasioes(lookEditado);
    });
    finalizarEdicaoLooksOcasioes();
}

function removerAcessorioDosLooks(lookIds, pecaId) {
    const alvo = normalizarTexto(pecaId);
    lookIds.forEach(lookId => {
        const lookEditado = obterLookEditavelParaOcasioes(lookId);
        if (!lookEditado) return;
        lookEditado.pecas_sugeridas = (lookEditado.pecas_sugeridas || []).filter(item => normalizarTexto(item?.id) !== alvo);
        salvarLookEditadoPorOcasioes(lookEditado);
    });
    finalizarEdicaoLooksOcasioes();
}

function finalizarEdicaoLooksOcasioes() {
    salvarDados();
    preencherSelectLooks();
    preencherFiltrosOcasiao();
    preencherFiltrosPaginaOcasioes();
    renderPaginaOcasioes();
}

function obterQuantidadeNecessariaOcasiao(ocasiao, climaCodigo) {
    if (!ocasiao) return 0;
    const quantidades = ocasiao.quantidades_necessarias || ocasiao.quantidadesNecessarias || {};
    const chave = String(climaCodigo || '');
    const valor = quantidades[chave] ?? quantidades[Number(chave)] ?? quantidades[normalizarTexto(chave)];
    return Number(valor || 0);
}

function obterTotalNecessarioOcasiao(ocasiao) {
    if (!ocasiao) return 0;
    const total = ocasiao.total_necessario ?? ocasiao.totalNecessario;
    if (total !== undefined && total !== null && total !== '') return Number(total || 0);
    const quantidades = ocasiao.quantidades_necessarias || ocasiao.quantidadesNecessarias || {};
    return Object.values(quantidades).reduce((soma, valor) => soma + Number(valor || 0), 0);
}

function obterClimasEditaveisOcasioes() {
    return Object.values(app.climas || {})
        .filter(clima => clima.codigo && String(clima.codigo) !== '0')
        .sort((a, b) => String(a.codigo).localeCompare(String(b.codigo), 'pt-BR', { numeric: true }));
}

function obterQuantidadesNecessariasOcasiao(ocasiao) {
    return {
        ...(ocasiao?.quantidadesNecessarias || {}),
        ...(ocasiao?.quantidades_necessarias || {}),
    };
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
    const bolsas = sugestoes.filter(item => normalizarTexto(app.pecas[item.id]?.tipo) === 'bolsa');
    const cintos = sugestoes.filter(item => normalizarTexto(app.pecas[item.id]?.tipo) === 'cinto');

    renderPecasSugestaoOcasioes('ocasioes-calcados', 'ocasioes-calcados-contagem', calcados);
    renderPecasSugestaoOcasioes('ocasioes-bolsas', 'ocasioes-bolsas-contagem', bolsas);
    renderPecasSugestaoOcasioes('ocasioes-cintos', 'ocasioes-cintos-contagem', cintos);
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
        alert('A data inicial precisa ser anterior ou igual à data final.');
        return;
    }

    renderHistorico(obterRegistrosHistoricoEntre(inicio, fim), inicio, fim);
    app.filtroHistoricoAtivo = { tipo: 'intervalo', inicio, fim };
    salvarEstadoFiltros();
    marcarFiltroPeriodoHistorico(null);
}

function renderHistorico(registrosPeriodo, inicio, fim) {
    registrosPeriodo = registrosPeriodo.filter(reg => Array.isArray(reg.pecas) && reg.pecas.length > 0);
    const registrosUsoPeriodo = obterRegistrosUso(registrosPeriodo);
    app.registrosHistoricoPeriodo = registrosPeriodo;

    atualizarResumoPeriodo(registrosPeriodo, inicio, fim);
    renderResumoItensPeriodo(registrosUsoPeriodo);
    renderTabelaPecasMaisUsadas(registrosUsoPeriodo);
    renderDetalheHistorico(registrosPeriodo);
    atualizarStatsHistorico(registrosUsoPeriodo);
    renderCalendarioHistorico(inicio, fim);
    renderPecasSemUso();

    console.log(`Histórico atualizado: ${registrosPeriodo.length} registros`);
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
    const registrosPorDia = agruparRegistrosPorDia(obterRegistrosHistoricoAtivos(app.historico));
    const nomesDias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    label.textContent = primeiroDia.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    container.innerHTML = nomesDias.map(dia => `<div class="calendario-dia-semana">${dia}</div>`).join('');

    for (let i = 0; i < inicioSemana; i++) {
        container.insertAdjacentHTML('beforeend', '<div class="calendario-dia vazio"></div>');
    }

    for (let dia = 1; dia <= diasNoMes; dia++) {
        const dataISO = `${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
        const registros = registrosPorDia[dataISO] || [];
        const temUsoReal = registros.some(registro => !registroEhAgendamento(registro));
        const temAgendamento = registros.some(registro => registroEhAgendamento(registro));
        const pecas = [...new Set(registros.flatMap(reg => reg.pecas || []))].filter(id => app.pecas[id]);
        const selecionado = inicioSelecionado && fimSelecionado && dataISO >= inicioSelecionado && dataISO <= fimSelecionado;
        const fotos = pecas.slice(0, 3).map(id => `
            <img src="${getCaminhoFoto(id)}" alt="${id}"
                 onerror="this.style.display='none'">
        `).join('');

        container.insertAdjacentHTML('beforeend', `
            <button type="button"
                    class="calendario-dia ${registros.length ? 'tem-uso' : ''} ${temAgendamento && !temUsoReal ? 'tem-agendamento' : ''} ${selecionado ? 'selecionado' : ''}"
                    data-data="${dataISO}">
                <span>${dia}</span>
                <div class="calendario-miniaturas">${fotos}</div>
                ${registros.length ? `<small>${pecas.length} peças${temAgendamento && !temUsoReal ? ' agendadas' : ''}</small>` : ''}
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

    obterRegistrosUso(app.historico).forEach(reg => {
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
    app.resumoHistoricoTipo = 'looks';
    renderResumoItensPeriodo(app.registrosHistoricoPeriodo || []);
}

function renderResumoItensPeriodo(registrosPeriodo) {
    const container = document.getElementById('historico-resumo-itens');
    const filtrosContainer = document.getElementById('historico-resumo-filtros');
    if (!container) return;

    app.resumoHistoricoTipo = 'looks';
    const resumoCompleto = calcularResumoUsoHistorico(registrosPeriodo, 'looks')
        .map(criarItemResumoLookHistorico)
        .filter(item => item.look);

    if (filtrosContainer) {
        filtrosContainer.innerHTML = criarFiltrosResumoHistorico(resumoCompleto);
    }

    const resumo = ordenarResumoHistorico(filtrarResumoHistorico(resumoCompleto));
    if (resumo.length === 0) {
        container.innerHTML = '<p class="texto-ajuda">Nenhum look usado neste periodo com esses filtros.</p>';
        return;
    }

    container.innerHTML = `
        <div class="historico-resumo-cabecalho">
            ${COLUNAS_RESUMO_HISTORICO_LOOKS.map(criarCabecalhoResumoHistorico).join('')}
        </div>
        ${resumo.map(criarLinhaResumoHistoricoLook).join('')}
    `;
}

const COLUNAS_RESUMO_HISTORICO_LOOKS = [
    { campo: 'id', titulo: 'Foto e ID', classe: 'historico-resumo-id' },
    { campo: 'htt', titulo: 'HTT' },
    { campo: 'dataRevisaoHtt', titulo: 'Data revisão HTT' },
    { campo: 'periodo', titulo: 'Usos período' },
    { campo: 'total', titulo: 'Usos total' },
    { campo: 'primeiro', titulo: 'Primeiro uso' },
    { campo: 'ultimo', titulo: 'Último uso' },
    { campo: 'dataCriacao', titulo: 'Data criação' },
    { campo: 'dataUltimaAlteracao', titulo: 'Data últ. alteração' },
    { campo: 'dataAtualizacao', titulo: 'Data atualização' },
];

function criarCabecalhoResumoHistorico(coluna) {
    const ordenacao = app.ordenacaoResumoHistorico || {};
    const ativo = ordenacao.campo === coluna.campo;
    const indicador = ativo ? (ordenacao.direcao === 'desc' ? '↓' : '↑') : '';
    return `
        <button type="button" class="historico-resumo-ordenar ${coluna.classe || ''} ${ativo ? 'ativo' : ''}" onclick="ordenarResumoHistoricoPor('${coluna.campo}')">
            <span>${escapeHtml(coluna.titulo)}</span>
            <small aria-hidden="true">${indicador}</small>
        </button>
    `;
}

function criarItemResumoLookHistorico(item) {
    const look = obterLookPorId(item.id);
    const dataRevisaoHtt = obterCampoLookPorNomes(look, ['Data revisão HTT', 'Data revisao HTT', 'Revisão HTT', 'Revisao HTT']);
    const dataCriacao = obterDataCriacaoLook(look);
    const dataUltimaAlteracao = obterDataUltimaAlteracaoLook(look);
    const dataAtualizacao = obterDataAtualizacaoLook(look);
    return {
        ...item,
        look,
        periodo: item.total,
        usosPeriodoTexto: formatarUsosLookCompacto(item.registrados, item.inferidos),
        usosTotalTexto: formatarUsosLookCompacto(item.totalRegistrados, item.totalInferidos),
        htt: obterHttLook(look),
        dataRevisaoHtt,
        dataCriacao,
        dataUltimaAlteracao,
        dataAtualizacao,
        categoria: obterCategoriaLook(look),
        utilizacao: obterUtilizacaoLook(look),
    };
}

function criarFiltrosResumoHistorico(resumo) {
    const filtros = app.filtrosResumoHistorico || {};
    return `
        ${criarFiltroResumoHistorico('categoria', 'Categoria', resumo.map(item => item.categoria), filtros.categoria)}
        ${criarFiltroResumoHistorico('utilizacao', 'Utilização', resumo.map(item => item.utilizacao), filtros.utilizacao)}
    `;
}

function criarFiltroResumoHistorico(campo, rotulo, valores, selecionado = '') {
    const opcoes = [...new Set((valores || []).filter(valorVisivel))]
        .sort((a, b) => String(a).localeCompare(String(b), 'pt-BR', { numeric: true, sensitivity: 'base' }));
    return `
        <label>
            <span>${escapeHtml(rotulo)}</span>
            <select onchange="alterarFiltroResumoHistorico('${campo}', this.value)">
                <option value="" ${selecionado ? '' : 'selected'}>Todas</option>
                ${opcoes.map(valor => `<option value="${escapeHtml(valor)}" ${String(valor) === String(selecionado) ? 'selected' : ''}>${escapeHtml(valor)}</option>`).join('')}
            </select>
        </label>
    `;
}

function alterarFiltroResumoHistorico(campo, valor) {
    app.filtrosResumoHistorico = {
        ...(app.filtrosResumoHistorico || {}),
        [campo]: valor,
    };
    salvarEstadoFiltros();
    renderResumoItensPeriodo(app.registrosHistoricoPeriodo || []);
}

function filtrarResumoHistorico(resumo) {
    const filtros = app.filtrosResumoHistorico || {};
    return (resumo || []).filter(item => {
        if (filtros.categoria && normalizarTexto(item.categoria) !== normalizarTexto(filtros.categoria)) return false;
        if (filtros.utilizacao && normalizarTexto(item.utilizacao) !== normalizarTexto(filtros.utilizacao)) return false;
        return true;
    });
}

function ordenarResumoHistoricoPor(campo) {
    const atual = app.ordenacaoResumoHistorico || {};
    const direcao = atual.campo === campo && atual.direcao === 'asc' ? 'desc' : 'asc';
    app.ordenacaoResumoHistorico = { campo, direcao };
    salvarEstadoFiltros();
    renderResumoItensPeriodo(app.registrosHistoricoPeriodo || []);
}

function ordenarResumoHistorico(resumo) {
    const { campo = 'periodo', direcao = 'desc' } = app.ordenacaoResumoHistorico || {};
    const multiplicador = direcao === 'desc' ? -1 : 1;
    return [...(resumo || [])].sort((a, b) =>
        compararValoresResumoHistorico(obterValorResumoHistorico(a, campo), obterValorResumoHistorico(b, campo)) * multiplicador
        || String(a.id).localeCompare(String(b.id), 'pt-BR', { numeric: true })
    );
}

function obterValorResumoHistorico(item, campo) {
    if (campo === 'id') return item.id;
    if (campo === 'periodo') return item.total;
    if (campo === 'total') return item.totalGeral;
    return item[campo] ?? '';
}

function compararValoresResumoHistorico(valorA, valorB) {
    const vazioA = !valorVisivel(valorA);
    const vazioB = !valorVisivel(valorB);
    if (vazioA && vazioB) return 0;
    if (vazioA) return 1;
    if (vazioB) return -1;

    const numeroA = Number(String(valorA).replace(',', '.'));
    const numeroB = Number(String(valorB).replace(',', '.'));
    if (Number.isFinite(numeroA) && Number.isFinite(numeroB)) return numeroA - numeroB;

    const dataA = normalizarDataHistorico(valorA);
    const dataB = normalizarDataHistorico(valorB);
    if (dataA && dataB) return dataA.localeCompare(dataB);

    return String(valorA).localeCompare(String(valorB), 'pt-BR', { numeric: true, sensitivity: 'base' });
}

function calcularResumoUsoHistorico(registrosPeriodo, tipo) {
    const contagemPeriodo = contarUsosHistorico(registrosPeriodo, tipo);
    const contagemTotal = contarUsosHistorico(obterRegistrosUso(app.historico), tipo);

    return [...contagemPeriodo.values()]
        .map(itemPeriodo => {
            const itemTotal = contagemTotal.get(normalizarTexto(itemPeriodo.id)) || itemPeriodo;
            return {
                ...itemPeriodo,
                totalRegistrados: itemTotal.registrados || 0,
                totalInferidos: itemTotal.inferidos || 0,
                totalGeral: itemTotal.total || itemPeriodo.total,
                primeiro: itemTotal.primeiro || itemPeriodo.primeiro,
                ultimo: itemTotal.ultimo || itemPeriodo.ultimo,
            };
        })
        .sort((a, b) => b.total - a.total || String(a.id).localeCompare(String(b.id), 'pt-BR', { numeric: true }));
}

function contarUsosHistorico(registros, tipo) {
    const mapa = new Map();
    registros = obterRegistrosUso(registros);

    if (tipo === 'looks') {
        obterUsosLooksAgrupadosPorDia(registros).forEach(({ dia, registrados, inferidos }) => {
            registrados.forEach(id => incrementarUsoLookDetalhado(mapa, id, 'registrado', dia));
            inferidos.forEach(id => incrementarUsoLookDetalhado(mapa, id, 'inferido', dia));
        });
        return mapa;
    }

    (registros || []).forEach(registro => {
        const dia = obterDiaRegistro(registro);
        if (!dia) return;

        const ids = [...new Set(registro.pecas || [])].filter(Boolean);

        ids.forEach(id => {
            const atual = mapa.get(id) || { id, registrados: 0, inferidos: 0, total: 0, primeiro: dia, ultimo: dia };
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

function criarLinhaResumoHistoricoLook(item) {
    const look = item.look;
    const detalhe = look?.nome || 'Look';
    const foto = getCaminhoFotoLook(item.id);

    return `
        <button type="button" class="historico-resumo-linha" onclick="mostrarDetalhesLook('${escapeHtml(item.id)}')">
            <span class="historico-resumo-id">
                <img src="${escapeHtml(foto)}" alt="${escapeHtml(item.id)}"
                     onerror="this.src='${imagemFallback()}'">
                <span>
                    <strong>${escapeHtml(item.id)}</strong>
                    <small>${escapeHtml(detalhe)}</small>
                </span>
            </span>
            <span>${escapeHtml(valorTabelaPeca(item.htt))}</span>
            <span>${escapeHtml(formatarDataResumoHistorico(item.dataRevisaoHtt))}</span>
            <span>${escapeHtml(item.usosPeriodoTexto)}</span>
            <span>${escapeHtml(item.usosTotalTexto)}</span>
            <span>${escapeHtml(formatarDataResumoHistorico(item.primeiro))}</span>
            <span>${escapeHtml(formatarDataResumoHistorico(item.ultimo))}</span>
            <span>${escapeHtml(formatarDataResumoHistorico(item.dataCriacao))}</span>
            <span>${escapeHtml(formatarDataResumoHistorico(item.dataUltimaAlteracao))}</span>
            <span>${escapeHtml(formatarDataResumoHistorico(item.dataAtualizacao))}</span>
        </button>
    `;
}

function formatarDataResumoHistorico(valor) {
    if (!valor && valor !== 0) return '-';
    const data = normalizarDataHistorico(valor);
    if (data) return formatarDataBR(data.slice(0, 10));
    return String(valor);
}

function renderTabelaPecasMaisUsadas(registrosPeriodo) {
    const contagem = {};
    registrosPeriodo = obterRegistrosUso(registrosPeriodo);
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
        obterLookIdsRegistroOuInferidos(reg).forEach(id => looksUsados.add(id));
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
            const pecasDiaMap = new Map();
            registros.forEach(registro => {
                (registro.pecas || []).forEach(id => {
                    if (!app.pecas[id]) return;
                    const atual = pecasDiaMap.get(id);
                    const origem = !registroEhAgendamento(registro) || atual?.origem === 'registrado' ? 'registrado' : 'agendado';
                    pecasDiaMap.set(id, { id, origem });
                });
            });
            const pecasDia = [...pecasDiaMap.values()];
            const looksDiaMap = new Map();
            registros.flatMap(reg => obterLooksRegistroComOrigem(reg)).forEach(item => {
                if (!obterLookPorId(item.id)) return;
                const atual = looksDiaMap.get(item.id);
                const origem = escolherOrigemHistorico(atual?.origem, item.origem);
                looksDiaMap.set(item.id, { id: item.id, origem });
            });
            const looksDia = [...looksDiaMap.values()];

            const grupo = document.createElement('div');
            grupo.className = 'historico-dia';
            grupo.dataset.dia = dia;

            const looksHtml = looksDia.length > 0
                ? looksDia.map(item => criarCardLookHistorico(item.id, item.origem, { dia, removivel: true })).join('')
                : '<p class="texto-ajuda">Nenhum look identificado nesse dia.</p>';

            const pecasHtml = pecasDia.length > 0
                ? pecasDia.map(item => criarCardPecaHistorico(item.id, { dia, removivel: true, agendado: item.origem === 'agendado' })).join('')
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

function escolherOrigemHistorico(origemAtual, origemNova) {
    const pesos = { registrado: 3, agendado: 2, inferido: 1 };
    return (pesos[origemNova] || 0) > (pesos[origemAtual] || 0) ? origemNova : (origemAtual || origemNova || 'inferido');
}

function criarCardLookHistorico(id, origem = 'registrado', opcoes = {}) {
    const look = obterLookPorId(id);
    const pecas = (look?.pecas || []).filter(pid => app.pecas[pid]);
    const nome = look?.nome || look?.id || id;
    const origemNormalizada = ['inferido', 'agendado'].includes(origem) ? origem : 'registrado';
    const origemLabel = origemNormalizada === 'inferido'
        ? 'Inferido pelas peças'
        : (origemNormalizada === 'agendado' ? 'Agendado' : 'Registrado no histórico');
    const idJs = escapeHtml(JSON.stringify(String(id)));
    const diaJs = escapeHtml(JSON.stringify(String(opcoes.dia || '')));
    const acaoRemover = opcoes.removivel && opcoes.dia
        ? `<button type="button" class="historico-look-remover" onclick="event.stopPropagation(); removerLookDoHistoricoDia(${diaJs}, ${idJs})">Remover</button>`
        : '';

    return `
        <div class="historico-look-card historico-look-${origemNormalizada}" onclick="mostrarDetalhesLook(${idJs})">
            <img src="${getCaminhoFotoLook(id)}" alt="${escapeHtml(nome)}" class="historico-look-foto"
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23eee%22 width=%22100%22 height=%22100%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22>sem foto</text></svg>'">
            <strong>${escapeHtml(nome)}</strong>
            <small>${pecas.length} peças</small>
            <span class="historico-look-origem">${origemLabel}</span>
            ${acaoRemover}
        </div>
    `;
}

function criarCardPecaHistorico(id, opcoes = {}) {
    const peca = app.pecas[id];
    if (!peca) return '';
    const semSeletor = Boolean(opcoes.semSeletor);
    const classeAgendada = opcoes.agendado ? 'historico-peca-agendada' : '';

    const acaoRemover = opcoes.removivel && opcoes.dia
        ? `<button type="button" class="historico-peca-remover" onclick="removerPecaDoHistoricoDia('${opcoes.dia}', '${id}')">Remover</button>`
        : '';

    return `
        <div class="historico-peca-card ${classeAgendada} ${semSeletor ? 'historico-peca-sem-seletor' : 'historico-peca-selecionavel'} ${opcoes.compacto ? 'historico-peca-compacto' : ''}" ${semSeletor ? '' : 'onclick="alternarCardPecaLookHistorico(event, this)"'}>
            ${semSeletor ? '' : `<label class="historico-peca-check" title="Selecionar para criar look">
                <input type="checkbox" value="${id}" onchange="alternarPecaLookHistorico(this)">
                <span></span>
            </label>`}
            <img src="${getCaminhoFoto(id)}" alt="${peca.tipo}" data-id="${id}"
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23eee%22 width=%22100%22 height=%22100%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22>sem foto</text></svg>'">
            <span>${peca.tipo}</span>
            <small>${id}</small>
            ${opcoes.agendado ? '<small class="historico-peca-origem">Agendada</small>' : ''}
            <button type="button" class="historico-peca-detalhes" onclick="mostrarDetalhesPeca('${id}')">Ficha</button>
            ${acaoRemover}
        </div>
    `;
}

function removerPecaDoHistoricoDia(dia, pecaId) {
    const peca = app.pecas[pecaId];
    const nome = peca?.tipo || pecaId;
    const confirmado = confirm(`Remover ${nome} (${pecaId}) do histórico de ${formatarDataBR(dia)}?`);
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

function removerLookDoHistoricoDia(dia, lookId) {
    const look = obterLookPorId(lookId);
    const nome = look?.nome || look?.id || lookId;
    const confirmado = confirm(`Remover ${nome} do histórico de ${formatarDataBR(dia)}?`);
    if (!confirmado) return;

    const alvo = normalizarTexto(lookId);
    let alterou = false;

    app.historico = app.historico.map(registro => {
        if (obterDiaRegistro(registro) !== dia) return registro;

        const registrados = [registro.lookId, ...(registro.lookIds || [])].filter(Boolean);
        const inferidos = inferirLookIdsPelasPecas(registro.pecas || []);
        const apareceNoRegistro = [...registrados, ...inferidos].some(id => normalizarTexto(id) === alvo);

        if (!apareceNoRegistro) return registro;

        alterou = true;
        const lookIdsAtualizados = registrados.filter(id => normalizarTexto(id) !== alvo);
        const ignorados = obterIdsLooksIgnoradosRegistro(registro);
        ignorados.add(alvo);

        return {
            ...registro,
            lookId: lookIdsAtualizados[0] || null,
            lookIds: [...new Set(lookIdsAtualizados)],
            looksIgnorados: [...ignorados],
            alteradoEm: new Date().toISOString(),
        };
    });

    if (!alterou) return;

    app.mapaUsosLooksAtual = null;
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
    const looks = obterLooksCompativeis(pecas, { incluirExcluidos: true });

    if (looks.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = `
        <strong>Estas peças já fazem parte de look cadastrado</strong>
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

    abrirModalEmpilhado(document.getElementById('modal-criar-look-historico'));
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
    alvo.looksIgnorados = [...obterIdsLooksIgnoradosRegistro(alvo)]
        .filter(id => normalizarTexto(id) !== normalizarTexto(lookId));
    alvo.alteradoEm = new Date().toISOString();
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
    const ignorados = obterIdsLooksIgnoradosRegistro(registro);
    return [...new Set([registro.lookId, ...(registro.lookIds || [])]
        .filter(Boolean)
        .filter(id => !ignorados.has(normalizarTexto(id))))];
}

function obterIdsLooksIgnoradosRegistro(registro) {
    return new Set([
        ...(Array.isArray(registro?.looksIgnorados) ? registro.looksIgnorados : []),
        ...(Array.isArray(registro?.looks_ignorados) ? registro.looks_ignorados : []),
    ].map(id => normalizarTexto(id)).filter(Boolean));
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
    return obterRegistrosHistoricoAtivos(app.historico).filter(reg => {
        const dia = obterDiaRegistro(reg);
        return dia && dia >= inicio && dia <= fim;
    });
}

function obterDiaRegistro(registro) {
    return normalizarDataHistorico(registro.data)?.slice(0, 10) || null;
}

function obterDataReferenciaHistorico() {
    const dias = obterRegistrosHistoricoAtivos(app.historico)
        .map(obterDiaRegistro)
        .filter(Boolean)
        .sort();

    if (dias.length === 0) return null;

    const ultimoDia = dias[dias.length - 1];
    return new Date(`${ultimoDia}T12:00:00`);
}

function obterIntervaloCompletoHistorico() {
    const dias = obterRegistrosHistoricoAtivos(app.historico)
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

    const totalUsos = obterRegistrosUso(registros).length;
    const totalAgendamentos = registros.filter(registroEhAgendamento).length;
    const complementoAgendamentos = totalAgendamentos ? ` e ${totalAgendamentos} agendamento(s)` : '';
    resumo.textContent = `${totalUsos} uso(s)${complementoAgendamentos} entre ${formatarDataBR(inicio)} e ${formatarDataBR(fim)}.`;
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

