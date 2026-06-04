# Guia passo a passo: sincronizacao com Supabase

Este guia serve para fazer o app guardar o historico de uso e os looks criados na nuvem, para voce conseguir usar no desktop e no celular com a mesma conta.

Voce vai fazer 4 coisas:

1. Criar um projeto no Supabase.
2. Criar uma tabela para salvar seus dados.
3. Colocar as chaves do Supabase no app.
4. Testar a sincronizacao no desktop e no celular.

Nao use a chave `service_role` no app. Use somente a chave `anon public`.

## Antes de comecar

Voce precisa ter:

- Uma conta no Supabase.
- Esta pasta do app aberta no computador.
- O arquivo `supabase_schema.sql`, que ja esta nesta pasta.
- O arquivo `js/supabase-config.js`, que tambem ja esta nesta pasta.

## 1. Criar uma conta no Supabase

1. Acesse `https://supabase.com`.
2. Clique em `Start your project` ou `Sign in`.
3. Entre com uma conta Google/GitHub ou crie uma conta com email e senha.
4. Depois de entrar, voce vai cair no painel do Supabase.

## 2. Criar o projeto

1. No painel do Supabase, clique em `New project`.
2. Escolha uma organizacao. Se aparecer apenas uma opcao, use ela.
3. Preencha:
   - `Name`: pode ser `guarda-roupa`.
   - `Database Password`: crie uma senha forte e guarde em local seguro.
   - `Region`: escolha a regiao mais proxima, se tiver duvida pode deixar a sugerida.
4. Clique em `Create new project`.
5. Aguarde alguns minutos ate o Supabase terminar de criar o projeto.

Quando terminar, voce estara dentro do painel do projeto.

## 3. Criar a tabela do app

Agora voce vai executar o script que cria o lugar onde o app salva os dados.

1. No menu lateral esquerdo do Supabase, clique em `SQL Editor`.
2. Clique em `New query`.
3. Volte para esta pasta do app e abra o arquivo:

```text
supabase_schema.sql
```

4. Copie todo o conteudo desse arquivo.
5. Cole no editor SQL do Supabase.
6. Clique em `Run`.

Se tudo deu certo, o Supabase deve mostrar uma mensagem de sucesso. Esse script cria a tabela `wardrobe_sync` e configura regras para cada usuario acessar somente os proprios dados.

## 4. Conferir se a tabela foi criada

1. No menu lateral esquerdo, clique em `Table Editor`.
2. Procure a tabela `wardrobe_sync`.
3. Se ela aparecer, esta parte esta pronta.

No inicio a tabela pode estar vazia. Isso e normal. Ela so recebe dados depois que voce entrar pelo app e sincronizar.

## 5. Pegar a URL e a chave anon public

1. No menu lateral esquerdo do Supabase, clique em `Project Settings`.
2. Clique em `API`.
3. Procure o campo `Project URL`.
4. Copie essa URL.
5. Procure a chave chamada `anon public` ou `anon key`.
6. Copie essa chave.

Importante: nao copie a chave `service_role`. Ela e secreta e nao deve ficar dentro de app web.

A URL correta termina em `.supabase.co`. Nao use enderecos com partes extras no final, por exemplo:

```text
https://SEU-PROJETO.supabase.co/rest/v1/
https://SEU-PROJETO.supabase.co/auth/v1/
```

Use somente:

```text
https://SEU-PROJETO.supabase.co
```

## 6. Colocar as chaves no app

Abra este arquivo:

```text
js/supabase-config.js
```

Hoje ele esta assim:

```js
window.SUPABASE_CONFIG = {
    url: '',
    anonKey: '',
};
```

Troque pelos dados do seu projeto:

```js
window.SUPABASE_CONFIG = {
    url: 'https://SEU-PROJETO.supabase.co',
    anonKey: 'SUA_CHAVE_ANON_PUBLIC',
};
```

Exemplo do formato:

```js
window.SUPABASE_CONFIG = {
    url: 'https://abcdefghijk.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
};
```

Salve o arquivo.

Se aparecer o erro `Invalid path specified in request URL`, confira se o `url` nao foi preenchido com `/rest/v1/` no final. Esse erro normalmente significa que a URL do projeto foi colada no formato errado.

## 7. Abrir o app no desktop

O jeito mais seguro e abrir o app por um servidor local.

No terminal, dentro desta pasta do app, rode:

```bash
python -m http.server 8000
```

Depois abra no navegador:

```text
http://localhost:8000
```

Se a porta 8000 ja estiver ocupada, voce pode usar outra, por exemplo:

```bash
python -m http.server 8001
```

E abrir:

```text
http://localhost:8001
```

## 8. Criar seu usuario dentro do app

1. Abra o app.
2. Entre na aba `Historico`.
3. Va ate a parte `Sincronizacao`.
4. Digite um email e uma senha.
5. Clique em `Criar conta`.

Se o Supabase pedir confirmacao de email, abra seu email e confirme antes de tentar entrar de novo.

Depois:

1. Volte ao app.
2. Digite o mesmo email e senha.
3. Clique em `Entrar`.
4. Clique em `Sincronizar`.

## 9. Testar se salvou na nuvem

1. No app, registre um uso ou crie um look a partir do historico.
2. Aguarde alguns segundos.
3. No Supabase, abra `Table Editor`.
4. Clique na tabela `wardrobe_sync`.
5. Deve aparecer uma linha com seu `user_id`.

Essa linha guarda:

- `historico`: registros de uso.
- `looks_favoritos`: looks criados dentro do app.
- `updated_at`: ultima atualizacao.

## 10. Usar no celular

Para usar no celular, voce precisa abrir a mesma versao do app com internet.

Pode ser por um site publicado, como GitHub Pages, Netlify ou Vercel. Se voce estiver testando so na sua rede local, o celular precisa estar no mesmo Wi-Fi e acessar o endereco do computador.

No celular:

1. Abra o app.
2. Va em `Historico`.
3. Na area `Sincronizacao`, entre com o mesmo email e senha.
4. Clique em `Entrar`.
5. Clique em `Baixar da nuvem` ou `Sincronizar`.

Depois disso, desktop e celular passam a compartilhar os mesmos historicos e looks criados no app.

## Como a sincronizacao protege seus dados

- Antes de enviar dados, o app baixa a versao atual da nuvem e mescla com o que existe no aparelho.
- Historicos do mesmo dia com as mesmas pecas nao duplicam.
- Se dois registros iguais tiverem looks vinculados diferentes, os IDs dos looks sao unidos.
- Looks criados dentro do app ficam em `looks_favoritos`, separados dos looks extraidos da planilha.
- Se voce atualizar `dados_guarda_roupa.json` a partir do Excel, os looks criados no app continuam salvos no navegador e no Supabase.
- Se a planilha atualizada trouxer um look com o mesmo ID de um look criado no app, o app preserva o look local renomeando para o proximo ID livre do mesmo indicador e atualiza o historico.

## Quando atualizar a planilha do Excel

Quando voce atualizar o Excel e gerar um novo `dados_guarda_roupa.json`:

1. Substitua o arquivo `dados_guarda_roupa.json` na pasta do app.
2. Mantenha os arquivos `js/supabase-config.js` e `supabase_schema.sql`.
3. Abra o app de novo.
4. Entre na sua conta, se ainda nao estiver conectada.
5. Clique em `Sincronizar`.

O catalogo de pecas e looks vem do JSON atualizado. O historico de uso e os looks criados no app continuam vindo do navegador e do Supabase.

## Problemas comuns

### Cliquei em Sincronizar, mas a tabela `wardrobe_sync` continua vazia

Confira nesta ordem:

1. Veja se voce entrou no app com email e senha. Criar conta nao e sempre a mesma coisa que entrar.
2. Se o Supabase enviou email de confirmacao, confirme o email primeiro.
3. Depois volte ao app, clique em `Entrar` e entao clique em `Sincronizar`.
4. No Supabase, confira se voce esta olhando o mesmo projeto que esta no arquivo `js/supabase-config.js`.
5. No Supabase, va em `Table Editor` e confirme se a tabela `wardrobe_sync` existe.
6. Se a tabela nao existir, rode novamente o arquivo `supabase_schema.sql` no `SQL Editor`.

Mesmo que o historico ainda esteja vazio, a sincronizacao deve criar uma linha na tabela com `historico` como `[]` e `looks_favoritos` como `{}`.

### A area de sincronizacao diz para configurar o Supabase

Confira se `js/supabase-config.js` esta preenchido com `url` e `anonKey`.

### Login nao funciona

Confira:

- Email e senha digitados corretamente.
- Se o Supabase pediu confirmacao de email.
- Se o projeto do Supabase ainda esta ativo.

### A tabela nao aparece

Volte no `SQL Editor`, cole novamente o conteudo de `supabase_schema.sql` e clique em `Run`.

### Nada aparece no celular

Entre com o mesmo email usado no desktop e clique em `Baixar da nuvem` ou `Sincronizar`.

### Tenho medo de perder dados

Use `Sincronizar` antes e depois de fazer mudancas importantes. O app foi ajustado para mesclar dados antes de enviar, reduzindo o risco de um aparelho sobrescrever o outro.
