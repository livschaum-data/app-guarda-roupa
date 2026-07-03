# 👗 Aplicação de Guarda-roupa Inteligente

Uma app web para gerenciar seu guarda-roupa, registrar usos diários, criar looks favoritos e acompanhar histórico - **100% offline e sem dependências externas**.

---

## ⚡ Quick Start (5 minutos)

### 1. Preparar pasta do projeto:

```
meu-guarda-roupa/
├── index.html
├── manifest.json
├── dados_guarda_roupa.json
├── css/
│   └── style.css
├── js/
│   └── app.js
└── fotos/
    ├── ID0001.jpg
    ├── ID0002.jpg
    └── ...
```

### 2. Abrir terminal na pasta e rodar:

```bash
# Windows
python -m http.server 8000

# Mac/Linux
python3 -m http.server 8000
```

### 3. Abrir navegador:
```
http://localhost:8000
```

Pronto! Sua app está rodando! 🚀

---

## 📋 Recursos

### ✅ Funcionalidades Implementadas

- **👗 Galeria de Peças**: Visualize todas as suas roupas em cards com fotos
- **✏️ Cadastro de Peças**: Adicione novas peças e edite fotos e informações diretamente na galeria
- **🔍 Busca e Filtro**: Encontre peças por tipo, cor, ID
- **✨ Usar Hoje**: Registre quais peças você usou em cada dia
- **💄 Criar Looks**: Combine peças e salve como looks favoritos
- **🏷️ Ocasiões**: Organize looks por categoria (trabalho, festa, etc)
- **📊 Histórico**: Veja estatísticas de uso dos últimos 7/14/30 dias
- **📈 Gráficos**: Peças mais usadas em tabela
- **💾 Armazenamento**: Dados salvos em localStorage (offline)
- **📱 PWA**: Instale como app nativo no celular
- **🎯 Responsivo**: Funciona em qualquer tamanho de tela

---

## 📚 Documentação

### Para Começar:
1. **`00_GUIA_COMPLETO.md`** - Conceitos e estrutura da app
2. **`01_GUIA_PRATICO.md`** - Passo a passo de implementação

### Arquivos Principais:
- **`index.html`** - Estrutura da página (com comentários)
- **`css/style.css`** - Design responsivo (com comentários)
- **`js/app.js`** - Lógica da app (com comentários)

### Dados:
- **`dados_guarda_roupa.json`** - Peças e looks extraídos do Excel
- **`manifest.json`** - Configuração PWA

---

## 🛠️ Tecnologia

- **HTML5** - Estrutura
- **CSS3** - Design responsivo (mobile-first)
- **JavaScript (ES6)** - Lógica e interatividade
- **LocalStorage API** - Persistência de dados
- **Fetch API** - Carregamento de dados
- **PWA Manifest** - Funcionalidade de app instalável

### Sem dependências externas!
Nenhuma biblioteca ou framework - código puro e leve.

---

## 📱 Como Usar

### Página Inicial (Home)
- Vê todas as peças em cards
- Busca por nome/cor/ID
- Clica em um card para ver detalhes

### Usar Hoje (✨)
- Seleciona peças que usou hoje
- Pode marcar como um look favorito
- Clica em "Registrar Uso"

### Looks (💄)
- Vê looks do Excel
- Pode criar novos looks (mínimo 2 peças)
- Filtra por ocasião
- Pode usar um look inteiro

### Histórico (📊)
- Vê peças mais usadas
- Escolhe período (7/14/30 dias)
- Estatísticas em tempo real

---

## 🎨 Customização

### Mudar Cores:
Edite `css/style.css`:
```css
:root {
    --cor-primaria: #6c63ff;  /* Mude aqui */
    --cor-secundaria: #ff6b9d;
    --cor-sucesso: #2ecc71;
}
```

### Mudar Ocasiões:
Edite `js/app.js`:
```javascript
ocasioes: ['Trabalho', 'Casual', 'Festa', 'Treino', 'Casa', 'Sair'],
// Mude para suas ocasiões
```

### Adicionar Peças:
1. Atualize o Excel
2. Rode o script Python para gerar novo JSON
3. Adicione as fotos em `fotos/`

---

## 📸 Fotos das Peças

### Nomeação Obrigatória:
As fotos devem ser nomeadas como:
- `ID0001.jpg`
- `ID0002.jpg`
- `ID0127.jpg`

(Use o ID da peça do seu Excel)

### Recomendações:
- Formato: JPG (mais leve), PNG ou WebP
- Tamanho: 300-500px de largura
- Peso: 50-200KB (comprima em TinyJPG)
- Se não tiver foto, mostra ❌ mas funciona normal

---

## 💾 Dados e Privacidade

- **Dados não saem do seu celular** - Tudo em localStorage
- **100% offline** - Funciona sem internet (após primeira carga)
- **Ninguém tem acesso** - Nem você em outro dispositivo
- **Fácil backup** - Exporte localStorage como JSON

### Exportar dados:
No DevTools → Application → Local Storage → Copie os valores

---

## 🚀 Deploy (Colocar na Nuvem)

Opções fáceis:

### GitHub Pages (Grátis)
1. Crie repo no GitHub
2. Coloque os arquivos
3. Ativa Pages nas settings
4. Acessa `seu-usuario.github.io/repo-name`

### Vercel (Grátis)
1. Conecta seu GitHub
2. Deploy automático
3. URL público

### Netlify (Grátis)
1. Drag & drop da pasta
2. Deploy instantâneo

---

## 🐛 Troubleshooting

### Foto não aparece?
- Verifique se `fotos/ID0001.jpg` existe
- Verifique o nome está correto (case-sensitive em Mac/Linux)
- Recarregue a página (Ctrl+F5)

### Dados não salvam?
- localStorage pode estar cheio
- Tente em modo anônimo (sem extensions)
- Limpe cache do navegador

### App não carrega?
- Abra DevTools (F12)
- Vá em Console
- Procure mensagens de erro
- Verifique se todos os arquivos estão na pasta certa

---

## 📈 Possíveis Melhorias Futuras

- [ ] Sincronizar com Google Drive
- [ ] Sugestões de looks baseadas em clima
- [ ] Notificações de peças pouco usadas
- [ ] Compartilhar looks com amigas
- [ ] Categorias de tamanho/marca
- [ ] Calendario visual de uso
- [ ] Integração com previsão do tempo
- [ ] Dark mode automático

---

## 📞 Suporte

### Se tiver dúvidas:
1. Leia `00_GUIA_COMPLETO.md` (conceitos)
2. Leia `01_GUIA_PRATICO.md` (passo a passo)
3. Veja comentários nos arquivos `.js`, `.css`, `.html`
4. Use DevTools (F12) para debugar

### Encontrou um bug?
- Abra DevTools (F12)
- Tire screenshot do erro
- Verifique se os arquivos estão no lugar certo

---

## 🎯 Estrutura de Aprendizado

Se você quer **entender o código**:

1. **Comece aqui**: `00_GUIA_COMPLETO.md`
   - Entenda como tudo funciona
   - Aprenda os conceitos básicos

2. **Depois**: Abra `index.html`
   - Leia os comentários
   - Entenda a estrutura HTML

3. **Depois**: Abra `css/style.css`
   - Veja como o design é organizado
   - Entenda Flexbox e Grid

4. **Depois**: Abra `js/app.js`
   - Leia os comentários
   - Entenda a lógica JavaScript

5. **Finalmente**: `01_GUIA_PRATICO.md`
   - Implemente suas customizações
   - Teste e brinque com a app!

---

## 🎓 Conceitos que Você Vai Aprender

Estudando este projeto, você vai aprender:

- ✅ HTML5 semântico
- ✅ CSS3 responsivo (Flexbox, Grid)
- ✅ JavaScript moderno (ES6)
- ✅ LocalStorage API
- ✅ Fetch API
- ✅ Manipulação do DOM
- ✅ Eventos JavaScript
- ✅ JSON
- ✅ Single Page Applications (SPA)
- ✅ PWA (Progressive Web Apps)

---

## 📄 Licença

Livre para usar, modificar e compartilhar!

---

## ✨ Créditos

Desenvolvido com ❤️ como app educativa para gerenciar guarda-roupa.

---

**Pronto para começar?** 🚀

1. Siga o **Quick Start** acima
2. Leia os guias
3. Customize conforme quiser
4. Aproveite sua app!

**Bom uso!** 👗✨
