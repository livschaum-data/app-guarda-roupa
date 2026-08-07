# Encoding

Este projeto deve ser mantido em UTF-8.

## Regra

- `index.html` declara `<meta charset="UTF-8">`; por isso o arquivo precisa ser salvo em UTF-8.
- Arquivos de texto do projeto (`.html`, `.css`, `.js`, `.json`, `.md`, `.sql`, `.py`) devem continuar em UTF-8.
- Nao salvar arquivos como ANSI/Windows-1252.

## PowerShell

Evite gravar arquivos com `System.Text.Encoding.Default`, porque no Windows isso usa ANSI/Windows-1252 e quebra acentos no navegador.

Para regravar UTF-8 sem BOM:

```powershell
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($path, $content, $utf8NoBom)
```

## Validacao

Antes de commitar mudancas em arquivos de texto, valide a decodificacao:

```powershell
python -c "from pathlib import Path; [p.read_bytes().decode('utf-8') for p in Path('.').rglob('*') if p.is_file() and p.suffix.lower() in {'.html','.css','.js','.json','.md','.sql','.py'}]"
```
