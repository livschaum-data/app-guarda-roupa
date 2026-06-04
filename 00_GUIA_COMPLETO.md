# 👗 Aplicação de Guarda-roupa - Guia Educativo Completo

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Estrutura de Pastas](#estrutura-de-pastas)
3. [Passo 1: Preparar os Dados](#passo-1-preparar-os-dados)
4. [Passo 2: Estrutura do HTML](#passo-2-estrutura-do-html)
5. [Passo 3: Estilos CSS](#passo-3-estilos-css)
6. [Passo 4: Lógica JavaScript](#passo-4-lógica-javascript)
7. [Passo 5: Armazenamento Local](#passo-5-armazenamento-local)
8. [Como Rodar Localmente](#como-rodar-localmente)

---

## Visão Geral

A aplicação funciona **100% offline** no seu celular usando:
- **HTML**: Estrutura das páginas
- **CSS**: Design responsivo
- **JavaScript**: Lógica e interatividade
- **LocalStorage**: Salvamento de dados no celular

### Fluxo de Dados:
```
Excel (dados_guarda_roupa.json)
    ↓
Aplicação carrega na memória
    ↓
Usuário interage (seleciona peças, cria looks)
    ↓
Dados salvos em localStorage (persistem entre usos)
```

---

## Estrutura de Pastas

```
meu-guarda-roupa/
├── index.html              # Página principal (COMEÇA AQUI)
├── dados_guarda_roupa.json # Dados das peças e looks
├── css/
│   └── style.css           # Todos os estilos
├── js/
│   └── app.js              # Toda a lógica
└── fotos/                  # Pasta com suas fotos das peças
    ├── ID0001.jpg
    ├── ID0002.jpg
    └── ... (uma foto por peça)
```

**Importante**: Os nomes dos arquivos de foto devem ser `ID0001.jpg`, `ID0002.jpg`, etc. (correspondendo aos IDs do seu Excel)

---

## Passo 1: Preparar os Dados

### ✅ O que você precisa fazer:

1. **Copiar o arquivo `dados_guarda_roupa.json`** que foi criado
   - Este arquivo contém todas as peças e looks do seu Excel
   - Já está pronto para usar!

2. **Criar a pasta `fotos/`** dentro do projeto:
   ```
   fotos/
   ├── ID0001.jpg
   ├── ID0002.jpg
   └── ...
   ```

3. **Exportar as fotos do seu Excel** (se estão lá):
   - Ou copiar as fotos que você já tem nomeadas como `IDxxxx.jpg`

### 📝 Estrutura do JSON:
```json
{
  "pecas": {
    "ID0001": {
      "id": "ID0001",
      "tipo": "sutien",
      "funcao": "básico",
      "cor": "branco",
      "situacao": "ok"
    }
  },
  "looks": {
    "AL0001": {
      "id": "AL0001",
      "pecas": ["ID0430", "ID0446"],
      "ocasiao": "sair",
      "situacao": "em uso"
    }
  }
}
```

---

## Passo 2: Estrutura do HTML

### 🎯 Conceitos principais:

**HTML é a estrutura** - Define o que aparece na tela. Ele usa:
- `<div id="app">` - Container principal onde tudo acontece
- `<button onclick="funcao()">` - Botões que chamam funções JavaScript
- `<img src="fotos/ID0001.jpg">` - Mostra as fotos

### Exemplo simplificado:
```html
<!-- Página 1: Galeria de peças -->
<div id="home">
  <h1>Minhas Peças</h1>
  <div id="galeria">
    <!-- Aqui aparecem as peças dinamicamente -->
  </div>
</div>

<!-- Página 2: Usar peça hoje -->
<div id="usar-hoje">
  <h2>Usar Hoje</h2>
  <button onclick="salvarUsoHoje()">Salvar Uso</button>
</div>

<!-- Página 3: Ver Histórico -->
<div id="historico">
  <h2>Últimos 7 dias</h2>
  <div id="lista-historico"></div>
</div>
```

### Navegação:
A app funciona com **"Single Page Application"** (SPA):
- Uma página HTML
- JavaScript muda o que é visível dinamicamente
- `mostrarPagina('home')` mostra a página "home"
- `mostrarPagina('usar-hoje')` mostra outra página

---

## Passo 3: Estilos CSS

### 🎨 Design Mobile-First:

Começamos com mobile e adaptamos para desktop.

```css
/* Variáveis de cores */
:root {
  --cor-primaria: #6c63ff;
  --cor-sucesso: #2ecc71;
  --cor-fundo: #f8f9fa;
  --cor-borda: #e0e0e0;
}

/* Grid responsivo para galeria */
.galeria {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  padding: 12px;
}

/* Cards das peças */
.card-peca {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
}

.card-peca:hover {
  transform: scale(1.05);
}

/* Responsivo */
@media (max-width: 600px) {
  .galeria {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### 📱 Dica importante:
Use `max-width: 600px` para elementos que só queremos em mobile, e acima desse valor para desktop.

---

## Passo 4: Lógica JavaScript

### 💡 Conceitos principais:

1. **Carregar dados**:
   ```javascript
   // Busca o JSON
   fetch('dados_guarda_roupa.json')
     .then(response => response.json())
     .then(data => {
       app.pecas = data.pecas;
       app.looks = data.looks;
     });
   ```

2. **Salvamento em localStorage**:
   ```javascript
   // Salvar
   localStorage.setItem('historico', JSON.stringify(app.historico));
   
   // Carregar
   app.historico = JSON.parse(localStorage.getItem('historico')) || [];
   ```

3. **Mostrar/Esconder páginas**:
   ```javascript
   function mostrarPagina(nome) {
     // Esconde todas
     document.querySelectorAll('.pagina').forEach(p => {
       p.style.display = 'none';
     });
     
     // Mostra a selecionada
     document.getElementById(nome).style.display = 'block';
   }
   ```

4. **Gerar galeria dinamicamente**:
   ```javascript
   function renderGaleria() {
     const galeria = document.getElementById('galeria');
     galeria.innerHTML = '';
     
     Object.values(app.pecas).forEach(peca => {
       const card = document.createElement('div');
       card.className = 'card-peca';
       card.innerHTML = `
         <img src="fotos/${peca.id}.jpg" 
              onclick="verDetalhesPeca('${peca.id}')">
         <p>${peca.tipo}</p>
       `;
       galeria.appendChild(card);
     });
   }
   ```

---

## Passo 5: Armazenamento Local

### 💾 Como funciona:

**LocalStorage** é como um "banco de dados do navegador" - os dados ficam salvos no celular entre um acesso e outro.

```javascript
// Objeto principal da app
const app = {
  pecas: {},           // Carregado do JSON
  looks: {},           // Carregado do JSON
  historico: [],       // Salvo em localStorage
  looksFavoritos: {}, // Customizado pelo usuário
};

// Salvar histórico quando mudar
app.historico.push({
  data: new Date().toISOString(),
  pecas: ['ID0001', 'ID0002'],
  look: 'AL0001' // opcional, se for um look criado
});

// Persistir
salvarDados();

function salvarDados() {
  localStorage.setItem('app_historico', JSON.stringify(app.historico));
  localStorage.setItem('app_looks_favs', JSON.stringify(app.looksFavoritos));
}

function carregarDados() {
  app.historico = JSON.parse(localStorage.getItem('app_historico')) || [];
  app.looksFavoritos = JSON.parse(localStorage.getItem('app_looks_favs')) || {};
}
```

---

## Como Rodar Localmente

### 🚀 Opção 1: Servidor Python (Recomendado)

```bash
# Na pasta do projeto
python -m http.server 8000

# Depois acesse no navegador:
# http://localhost:8000
```

### 🚀 Opção 2: Servidor Node.js

```bash
npm install -g http-server
http-server

# Acessa: http://localhost:8080
```

### 🚀 Opção 3: No celular (via Rede Local)

Se ambos (PC e celular) estão na mesma rede Wi-Fi:

1. No PC: `python -m http.server 8000`
2. No celular: Acesse `http://SEU_IP_PC:8000`
   - Encontre seu IP: `ipconfig` (Windows) ou `ifconfig` (Mac/Linux)
   - Procure por "IPv4 Address" (algo como `192.168.1.100`)

### 📱 PWA (Instalar no Celular):

A app é uma PWA, então você pode:
1. Abrir no navegador mobile
2. Menu → "Adicionar à tela inicial"
3. Fica como um app nativo no seu celular!

---

## Próximos Passos

Agora que você entende a estrutura, siga assim:

1. ✅ **Leia este guia** - entenda cada conceito
2. 📄 **Abra o arquivo `index.html`** - veja como funciona
3. 🎨 **Estude o `style.css`** - entenda o design
4. ⚙️ **Explore o `app.js`** - veja a lógica
5. 🔧 **Customize** - mude cores, adicione funcionalidades

---

## Dúvidas Comuns

### P: Por que minha foto não aparece?
**R**: Verifique:
- O arquivo está em `fotos/ID0001.jpg`?
- O ID está exatamente igual ao do Excel?
- A extensão é `.jpg`? (não `.png`, `.JPG`)

### P: Como adiciono uma nova peça?
**R**: 
1. Adicione em `dados_guarda_roupa.json`
2. Coloque a foto em `fotos/IDxxxx.jpg`
3. Recarregue a página

### P: Os dados somem quando fecho a app?
**R**: Dados do JSON (peças e looks) nunca somem. Seu histórico de uso fica em localStorage. Se deletar cache do navegador, apaga o histórico.

---

## Estrutura Completa do JavaScript

A app tem estas funções principais:

| Função | O que faz |
|--------|-----------|
| `inicializar()` | Carrega dados e monta a interface |
| `mostrarPagina(nome)` | Muda de página |
| `renderGaleria()` | Desenha a galeria de peças |
| `verDetalhesPeca(id)` | Mostra ficha completa da peça |
| `selecionarPecaHoje(id)` | Marca peça para usar hoje |
| `salvarUsoHoje()` | Registra no histórico |
| `criarLookFavorito()` | Salva combinação de peças |
| `filtrarPorOcasiao(ocasiao)` | Busca looks por ocasião |
| `mostrarHistorico(dias)` | Gera gráfico dos últimos dias |
| `salvarDados()` | Persiste dados em localStorage |

---

## Resumo do Aprendizado

```
┌─────────────────────────────┐
│   COMO A APP FUNCIONA       │
├─────────────────────────────┤
│ 1. Usuario abre index.html  │
│ 2. JS carrega dados JSON    │
│ 3. CSS renderiza interface  │
│ 4. HTML define estrutura    │
│ 5. Cliques disparam funções │
│ 6. Dados salvos em storage  │
└─────────────────────────────┘
```

Você está pronto! 🚀

**Próximo arquivo**: Abra `01_index.html`
