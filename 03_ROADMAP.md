# 🎓 Roadmap de Aprendizado - App de Guarda-roupa

## 🎯 Objetivo Final
Você vai ter uma **app profissional, funcional e customizada** que pode usar no celular, compartilhar com amigas, ou até colocar na internet.

---

## 📚 Roteiro Completo (6 Etapas)

### **ETAPA 1: Entender o Projeto** (30 min)
**Objetivo:** Saber como tudo funciona sem mexer em nada

#### O que fazer:
1. ✅ Leia `README.md` - Visão geral rápida
2. ✅ Leia `00_GUIA_COMPLETO.md` - Conceitos e estrutura
3. ✅ Abra `index.html` no notepad/editor - Veja a estrutura HTML
4. ✅ Procure por comentários no código (tudo explicado!)

#### Conceitos a aprender:
- [ ] Single Page Application (SPA)
- [ ] Estrutura HTML / CSS / JavaScript
- [ ] LocalStorage e persistência de dados
- [ ] JSON e como dados trafegam

**Tempo:** 30 minutos
**Dificuldade:** ⭐ Fácil

---

### **ETAPA 2: Montar o Projeto Localmente** (20 min)
**Objetivo:** Ter a app rodando no seu PC

#### O que fazer:
1. ✅ Crie pasta `meu-guarda-roupa/` com subpastas (css/, js/, fotos/)
2. ✅ Coloque todos os arquivos nos lugares certos
3. ✅ Leia `01_GUIA_PRATICO.md` - Passo a passo
4. ✅ Abra terminal e rode: `python -m http.server 8000`
5. ✅ Acesse: `http://localhost:8000`

#### Checklist:
- [ ] Pasta estrutura correta?
- [ ] Todos os arquivos no lugar?
- [ ] Servidor rodando?
- [ ] Página carrega no navegador?
- [ ] Console do DevTools não mostra erros?

**Tempo:** 20 minutos
**Dificuldade:** ⭐⭐ Médio

---

### **ETAPA 3: Adicionar as Fotos** (30 min - 1h)
**Objetivo:** Ver suas peças com fotos na app

#### O que fazer:
1. ✅ Leia `02_GUIA_FOTOS.md` - Tudo sobre fotos
2. ✅ Crie pasta `fotos/` no projeto
3. ✅ Coloque as fotos das peças nomeadas como `IDxxxx.jpg`
4. ✅ Recarregue a página (Ctrl+F5)
5. ✅ Veja as fotos aparecendo nos cards!

#### Dicas:
- Comece com 10-20 fotos para testar
- Comprima as fotos em TinyJPG
- Não precisa de todas logo - pode adicionar depois

#### Checklist:
- [ ] Pasta `fotos/` existe?
- [ ] Pelo menos 3-5 fotos lá?
- [ ] Nomes estão corretos (ID0001.jpg, etc)?
- [ ] Fotos aparecem na app?

**Tempo:** 30 min - 1h (depende se já tem fotos prontas)
**Dificuldade:** ⭐⭐ Médio

---

### **ETAPA 4: Testar Todas as Funcionalidades** (20 min)
**Objetivo:** Garantir que tudo está funcionando

#### O que testar:
- [ ] Home: Galeria mostra todas as peças
- [ ] Home: Busca filtra por tipo
- [ ] Home: Clique em card abre detalhes
- [ ] Usar Hoje: Consegue selecionar peças
- [ ] Usar Hoje: Consegue registrar uso
- [ ] Looks: Lista todos os looks do Excel
- [ ] Looks: Consegue criar um novo look
- [ ] Looks: Consegue usar um look inteiro
- [ ] Histórico: Mostra peças usadas
- [ ] Histórico: Botões 7/14/30 dias funcionam
- [ ] Dados salvam (fechar aba e abrir novamente)

#### Se alguma coisa não funcionar:
1. Abra DevTools (F12)
2. Vá em Console
3. Procure por erro (vermelho)
4. Leia a mensagem com atenção
5. Tente entender o problema

**Tempo:** 20 minutos
**Dificuldade:** ⭐ Fácil

---

### **ETAPA 5: Customizar a App** (1-2 horas)
**Objetivo:** Fazer a app com sua cara

#### Mudanças fáceis:

**A) Mudar cores:**
- Abra `css/style.css`
- Procure por `:root {`
- Mude `--cor-primaria`, etc
- Salve e veja as cores mudarem!

**B) Mudar ocasiões:**
- Abra `js/app.js`
- Procure por `ocasioes: [`
- Mude para suas ocasiões
- Salve e recarregue

**C) Mudar título:**
- Abra `index.html`
- Procure por `<title>`
- Mude o texto
- Abra novamente

**D) Mudar ícone do app:**
- Edite `manifest.json`
- Mude os URLs do icon

#### Mudanças intermediárias:

**E) Adicionar mais filtros:**
- Edite `js/app.js`
- Adicione funções novas

**F) Mudar layout da página:**
- Edite `index.html`
- Adicione/remova elementos

#### Desafios para aprender:
1. [ ] Mude a cor primária para sua cor preferida
2. [ ] Mude as ocasiões para as suas
3. [ ] Mude o título e ícone
4. [ ] Adicione uma nova seção
5. [ ] Customize o header

**Tempo:** 1-2 horas
**Dificuldade:** ⭐⭐⭐ Difícil

---

### **ETAPA 6: Usar no Celular** (15 min)
**Objetivo:** Usar a app no seu smartphone

#### A. Teste local (mesma rede Wi-Fi):

1. Abra terminal/cmd na pasta do projeto
2. Rode: `python -m http.server 8000`
3. Pegue seu IP:
   - Windows: `ipconfig` (procure IPv4)
   - Mac/Linux: `ifconfig`
4. No celular (mesma Wi-Fi):
   - Abra navegador
   - Acesse: `http://SEU_IP:8000`
5. Teste tudo no celular

#### B. Instalar como app (PWA):

**Chrome (Android):**
1. Acesse a app no celular
2. Menu (⋮) → "Instalar app"
3. Aparece na tela inicial 📱

**Safari (iPhone):**
1. Acesse a app no celular
2. Botão compartilhar → "Adicionar à tela inicial"
3. Aparece como app nativo 📱

#### Checklist:
- [ ] Consegue acessar do celular?
- [ ] Fotos carregam rápido?
- [ ] Consegue registrar uso?
- [ ] Consegue criar looks?
- [ ] Dados salvam?
- [ ] Consegue instalar como app?

**Tempo:** 15 minutos
**Dificuldade:** ⭐⭐ Médio

---

## 🚀 Passos Adicionais (Bônus)

### Se quiser ir além:

#### **ETAPA 7: Colocar na Internet** (1-2h)
Coloque sua app em um URL fixo para usar sempre

**Opções:**
- **GitHub Pages** (grátis, fácil)
- **Vercel** (grátis, mais rápido)
- **Netlify** (grátis, interface bonita)

Procure tutoriais para cada uma.

---

#### **ETAPA 8: Adicionar Mais Funcionalidades** (variável)

Ideias de features:
- [ ] Integrar com Google Drive (backup automático)
- [ ] Sugestões de looks baseadas em clima
- [ ] Notificações de peças pouco usadas
- [ ] Compartilhar looks com amigas
- [ ] Categorias por estação
- [ ] Modo escuro automático
- [ ] Gráficos melhores (Chart.js)
- [ ] Contador de "custo por uso"

Cada uma é um projeto de aprendizado!

---

## 📊 Progresso

Marque conforme avança:

```
ETAPA 1: Entender           [████████] ✅
ETAPA 2: Montar Projeto     [        ] ⬜
ETAPA 3: Adicionar Fotos    [        ] ⬜
ETAPA 4: Testar Tudo        [        ] ⬜
ETAPA 5: Customizar         [        ] ⬜
ETAPA 6: Usar no Celular    [        ] ⬜
```

---

## 💡 Dicas de Aprendizado

### Máxima 1: Leia os Comentários
Todo arquivo tem comentários explicando cada parte. Leia com atenção!

### Máxima 2: Mude Uma Coisa por Vez
Não mude tudo de uma vez. Mude algo pequeno, teste, aprenda.

### Máxima 3: Use DevTools
`F12` é seu amigo! Console mostra erros que você não vê.

### Máxima 4: Google é Seu Amigo
Não sabe algo? Google + Stack Overflow resolvem quase tudo.

### Máxima 5: Aprenda Vendo Código
Leia muito código. Escrever código vem depois.

---

## 🎯 Conceitos que Você Vai Dominar

Após completar todas as etapas, você entenderá:

```
✅ HTML5 semântico
✅ CSS3 (Flexbox, Grid, Media Queries)
✅ JavaScript (ES6+, async/await, Arrow functions)
✅ DOM Manipulation
✅ Event Handling
✅ localStorage API
✅ Fetch API
✅ JSON
✅ Single Page Applications
✅ Progressive Web Apps (PWA)
✅ Responsive Design
✅ Developer Tools
```

Isso é conteúdo de um **curso profissional de front-end** de 2-3 meses!

---

## 📚 Recursos Extras para Aprender

Se quiser se aprofundar:

### HTML/CSS:
- MDN Web Docs (https://developer.mozilla.org)
- CSS-Tricks (https://css-tricks.com)

### JavaScript:
- JavaScript.info (https://javascript.info)
- You Don't Know JS (livro grátis)

### Geral:
- freeCodeCamp (YouTube)
- Codecademy (cursos interativos)
- Udemy (cursos pagos mas bons)

---

## 🎓 Próximos Projetos (Depois dessa app)

Quando terminar essa app, tente:

1. **To-do List** - Lista de tarefas com localStorage
2. **Calculadora** - Calculadora com interface bonita
3. **Weather App** - App de tempo (com API)
4. **Pomodoro Timer** - Timer para produtividade
5. **Chat Simples** - App de mensagens em tempo real
6. **Blog Pessoal** - Seu próprio blog com GitHub Pages

Cada um ensina conceitos novos!

---

## 🏆 Checklist Final

Quando terminar TUDO:

- [ ] Entendi o projeto completo
- [ ] App rodando localmente
- [ ] Fotos das peças adicionadas
- [ ] Todas funcionalidades testadas
- [ ] App customizada com minhas cores
- [ ] Funciona no meu celular
- [ ] Consegui adicionar/modificar código
- [ ] Entendo como HTML/CSS/JS trabalham juntos
- [ ] Sei como debugar problemas
- [ ] Consigo explicar para alguém como funciona

Se tudo acima está marcado, **parabéns!** 🎉

Você:
- ✅ Sabe programar
- ✅ Entende front-end
- ✅ Consegue criar web apps
- ✅ Está pronto para projetos reais

---

## 🚀 E agora?

**Opções:**

1. **Compartilhe com amigas** - Elas usam sua app
2. **Coloque na internet** - URL fixa para sempre
3. **Continue aprendendo** - Adicione mais features
4. **Comece um novo projeto** - Use o que aprendeu
5. **Procure emprego** - Seus porfolio agora é real

---

## 📝 Notas Finais

- Programação é **praticar muito**
- Erros são normais (até profissional erra!)
- Cada erro é uma **oportunidade de aprender**
- Google existe para isso
- Stack Overflow tem respostas para quase tudo
- A melhor forma de aprender é **fazendo**

**Boa sorte na jornada!** 👗✨

---

**Dúvidas?** Releia os guias ou procure ajuda!

**Pronto?** Comece pela ETAPA 1! 🚀
