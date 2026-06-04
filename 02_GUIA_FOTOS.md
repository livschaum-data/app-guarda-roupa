# 📸 Guia Completo: Adicionar Fotos das Peças

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Estrutura de Pastas](#estrutura-de-pastas)
3. [Nomeação de Arquivos](#nomeação-de-arquivos)
4. [Formatos Recomendados](#formatos-recomendados)
5. [Tamanho e Otimização](#tamanho-e-otimização)
6. [Como Importar as Fotos](#como-importar-as-fotos)
7. [O que Acontece Sem Foto](#o-que-acontece-sem-foto)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

A app precisa de uma foto para cada peça de roupa. As fotos:
- Devem estar em uma pasta chamada `fotos/`
- Precisam ser nomeadas com o ID da peça
- Podem estar em vários formatos
- Serão mostradas em cards na galeria

---

## 📁 Estrutura de Pastas

Seu projeto deve ficar assim:

```
meu-guarda-roupa/
│
├── index.html
├── manifest.json
├── dados_guarda_roupa.json
├── css/
│   └── style.css
├── js/
│   └── app.js
│
└── fotos/                    ← Pasta de FOTOS
    ├── ID0001.jpg           ← Uma foto por peça
    ├── ID0002.jpg
    ├── ID0003.jpg
    ├── ID0004.jpg
    ├── ID0005.jpg
    ├── ID0127.jpg
    ├── ID0183.jpg
    ├── ID0249.jpg
    └── ... (e assim por diante)
```

### Como criar a pasta:

**Windows:**
1. Abra a pasta do projeto
2. Clique direito → Nova pasta
3. Digite: `fotos`
4. Pronto!

**Mac/Linux:**
```bash
cd meu-guarda-roupa
mkdir fotos
```

---

## 🏷️ Nomeação de Arquivos

### ⚠️ REGRA MAIS IMPORTANTE

Cada foto deve ser nomeada **exatamente** como o ID da peça no seu Excel:

```
Excel: ID0001  →  Foto: ID0001.jpg ✅
Excel: ID0127  →  Foto: ID0127.jpg ✅
Excel: ID0183  →  Foto: ID0183.jpg ✅
```

### Exemplos CORRETOS:
- ✅ `ID0001.jpg`
- ✅ `ID0002.jpg`
- ✅ `ID0127.jpg`
- ✅ `ID0183.jpg`
- ✅ `ID0249.png`
- ✅ `ID0446.webp`

### Exemplos ERRADOS:
- ❌ `ID 0001.jpg` (espaço no meio)
- ❌ `id0001.jpg` (letra minúscula - em Mac/Linux é case-sensitive!)
- ❌ `0001.jpg` (falta o "ID")
- ❌ `Pijama.jpg` (não é o ID)
- ❌ `ID0001` (falta a extensão)

### Case Sensitivity ⚠️

**Windows:** Não importa se é maiúscula ou minúscula
- `ID0001.jpg` = `id0001.jpg` = `Id0001.jpg`

**Mac/Linux:** Importa MUITO!
- `ID0001.jpg` ✅ (funciona)
- `id0001.jpg` ❌ (não funciona)
- `Id0001.jpg` ❌ (não funciona)

**Dica:** Sempre use exatamente como no seu Excel (geralmente com letras maiúsculas).

---

## 📸 Formatos Recomendados

### 1️⃣ JPG (RECOMENDADO ⭐)

**Vantagens:**
- ✅ Compatível com tudo
- ✅ Tamanho pequeno
- ✅ Carrega rápido
- ✅ Qualidade boa

**Desvantagens:**
- Perde qualidade se comprimido muito

**Quando usar:** Sempre! Exceto em casos especiais.

**Exemplos:**
- `ID0001.jpg` ← Use isso!
- `ID0002.JPG` (também funciona)
- `ID0003.jpeg` (variação, evite)

---

### 2️⃣ PNG

**Vantagens:**
- ✅ Sem perda de qualidade
- ✅ Suporta transparência
- ✅ Bom para logos/ícones

**Desvantagens:**
- ❌ Arquivo maior que JPG
- ❌ Carrega mais lento
- ❌ Usa mais dados

**Quando usar:** Só se não tiver JPG disponível.

**Exemplo:**
- `ID0001.png`

---

### 3️⃣ WebP

**Vantagens:**
- ✅ Muito menor que JPG
- ✅ Qualidade excelente
- ✅ Moderno

**Desvantagens:**
- ❌ Navegadores antigos não suportam
- ❌ Browsers antigos não abrem

**Quando usar:** Se todos seus usuários têm navegador recente (2020+).

**Exemplo:**
- `ID0001.webp`

---

## 📏 Tamanho e Otimização

### Dimensões Ideais

```
Largura:  300 - 500 pixels
Altura:   400 - 600 pixels
Proporção: Retrato (altura > largura)
```

### Peso do Arquivo

```
Pequeno:  50 - 100 KB   ← Ideal
Normal:   100 - 200 KB  ← Aceitável
Grande:   > 200 KB      ← Comprima!
```

### Por quê importa?

- **Menor arquivo** = Carrega mais rápido
- **No celular** = Usa menos dados/bateria
- **Melhor experiência** = Menos espera

### Como Comprimir

#### Opção 1: TinyJPG (Online - Fácil!)

1. Acesse: https://tinyjpg.com
2. Arraste suas fotos
3. Download das fotos comprimidas
4. Use essas fotos na app

#### Opção 2: ImageMagick (Linha de comando)

```bash
# Windows
# Instale: https://imagemagick.org/script/download.php-windows.php
convert ID0001.jpg -resize 400x600 -quality 85 ID0001.jpg

# Mac
brew install imagemagick
convert ID0001.jpg -resize 400x600 -quality 85 ID0001.jpg

# Linux
sudo apt-get install imagemagick
convert ID0001.jpg -resize 400x600 -quality 85 ID0001.jpg
```

#### Opção 3: Ao Tirar a Foto

- Máquina digital/celular: qualidade média (não máxima)
- Celular: modo de foto otimizada
- Câmera: tamanho 2-3 MP é o suficiente

---

## 🔄 Como Importar as Fotos

### Cenário 1: Você JÁ tem as fotos nomeadas

1. Crie a pasta `fotos/` no projeto
2. Coloque todas as fotos lá
3. Pronto! A app encontra automaticamente

**Linha de comando (rápido):**

```bash
# Windows (PowerShell)
Copy-Item "C:\caminho\fotos\*" ".\fotos\" -Recurse

# Mac/Linux
cp ~/Documentos/fotos/* ./fotos/
```

---

### Cenário 2: Você PRECISA renomear

Você tem fotos mas estão nomeadas como:
- `Pijama 1.jpg`
- `Blusa vermelha.jpg`
- `Calça preta.jpg`

Precisa virar:
- `ID0001.jpg`
- `ID0002.jpg`
- `ID0003.jpg`

#### Opção A: Renomear Manualmente (Se poucas fotos)

1. Abra a pasta `fotos/`
2. Clique direito em uma foto
3. Clique em "Renomear"
4. Digite: `ID0001.jpg`
5. Pressione Enter
6. Repita para cada foto

---

#### Opção B: Usar um Programa (Se muitas fotos)

**Windows:**
1. Baixe: Bulk Rename Utility (https://www.bulkrenameutility.co.uk/)
2. Abra a pasta de fotos
3. Selecione todas (Ctrl+A)
4. Clique direito → Abrir com Bulk Rename
5. Configure para `ID` + número sequencial
6. Aplica

**Mac:**
Use o app "Rename" ou via Terminal:
```bash
# Renomear em lote (requer mais conhecimento)
for i in *.jpg; do mv "$i" "ID${i%.*}.jpg"; done
```

---

#### Opção C: Python Script (Automático)

Crie um arquivo `renomear_fotos.py` na pasta de fotos:

```python
#!/usr/bin/env python3
import os
import sys

def renomear_fotos_sequencial(pasta='.'):
    """Renomeia fotos como ID0001.jpg, ID0002.jpg, etc."""
    
    # Extensões aceitas
    extensoes = {'.jpg', '.jpeg', '.png', '.webp'}
    
    # Listar arquivos
    arquivos = [f for f in os.listdir(pasta) 
                if os.path.isfile(f) and 
                os.path.splitext(f)[1].lower() in extensoes]
    
    # Ordenar (opcional)
    arquivos.sort()
    
    print(f"Encontrados {len(arquivos)} arquivos de imagem")
    
    for idx, arquivo in enumerate(arquivos, start=1):
        # Novo nome
        extensao = os.path.splitext(arquivo)[1]
        novo_nome = f"ID{idx:04d}{extensao}"
        
        # Renomear
        caminho_antigo = os.path.join(pasta, arquivo)
        caminho_novo = os.path.join(pasta, novo_nome)
        
        try:
            os.rename(caminho_antigo, caminho_novo)
            print(f"✅ {arquivo} → {novo_nome}")
        except Exception as e:
            print(f"❌ Erro ao renomear {arquivo}: {e}")
    
    print("\n✅ Pronto! Fotos renomeadas.")

if __name__ == '__main__':
    print("Renomeando fotos como ID0001, ID0002, etc...")
    renomear_fotos_sequencial()
```

Depois rode:
```bash
python renomear_fotos.py
```

---

### Cenário 3: Fotos estão em diferentes pastas

Você tem:
```
Downloads/
├── roupas_2020/
│   ├── foto1.jpg
│   └── foto2.jpg
├── roupas_2021/
│   ├── foto3.jpg
│   └── foto4.jpg
└── roupas_recentes/
    └── foto5.jpg
```

Precisa juntar tudo em `meu-guarda-roupa/fotos/`

**Windows (PowerShell):**
```powershell
# Copiar de todas as pastas
Copy-Item "C:\Downloads\roupas_*\*.jpg" ".\fotos\" -Recurse
```

**Mac/Linux:**
```bash
# Copiar de todas as subpastas
find ~/Downloads/roupas* -name "*.jpg" -exec cp {} ./fotos/ \;
```

---

## 🎨 O que Acontece Sem Foto

Se uma peça **NÃO TEM FOTO**:

1. Na galeria, mostra um ícone ❌
2. A app continua funcionando normalmente
3. Você ainda consegue:
   - ✅ Ver detalhes da peça
   - ✅ Usar a peça no dia
   - ✅ Criar looks com ela
   - ✅ Ver no histórico

4. Você pode adicionar foto depois
   - Basta colocar a foto em `fotos/`
   - Recarregar a página (Ctrl+F5)
   - Pronto!

**Exemplo:**
```
Situação: ID0001 não tem foto
- Mostra: ❌ (ícone de erro)
- Mas: ID0001 fica selecionável na app
- Depois: Coloca ID0001.jpg na pasta
- Resultado: Foto aparece, ❌ some
```

---

## 🔍 Troubleshooting

### Problema: Foto não aparece

**Checklist:**
- [ ] Arquivo está em `fotos/`?
- [ ] Nome está exatamente certo? (case-sensitive em Mac/Linux)
- [ ] Extensão está correta? (.jpg, .png, .webp)
- [ ] Arquivo não está corrompido?
- [ ] DevTools mostra erro 404?

**Solução:**
1. Abra DevTools (F12)
2. Vá em "Network"
3. Recarregue a página (Ctrl+F5)
4. Procure por `fotos/ID0001.jpg` (vermelho = erro)
5. Clique nela para ver detalhes
6. Verifique se o arquivo realmente existe

---

### Problema: Algumas fotos não carregam, outras sim

**Possíveis causas:**
1. Fotos com nomes errados
2. Arquivo corrompido
3. Formato não suportado

**Solução:**
1. Verifique nomes novamente
2. Tente re-tirar a foto ou reconverter
3. Mude para JPG se for outro formato

---

### Problema: "Fotos muito grandes, app lenta"

**Solução:**
1. Comprima as fotos (TinyJPG)
2. Redimensione para ~400x600px
3. Use JPG em vez de PNG

---

### Problema: Arquivo de foto é PNG mas precisa de JPG

**Convertendo:**

**Online (fácil):**
1. Acesse: https://convertio.co/png-jpg/
2. Selecione arquivo PNG
3. Download em JPG

**Linha de comando:**
```bash
# Instale ImageMagick antes
convert imagem.png imagem.jpg
```

---

## ✅ Checklist Final

Antes de considerar pronto:

- [ ] Pasta `fotos/` existe?
- [ ] Todas as fotos estão em `fotos/`?
- [ ] Nomes estão exatamente como ID no Excel?
- [ ] Extensões estão corretas (.jpg, .png, .webp)?
- [ ] Fotos foram comprimidas (< 200KB cada)?
- [ ] Dimensões são apropriadas (300-500px largura)?
- [ ] Testou no celular - fotos carregam rápido?
- [ ] Sem fotos ainda? Tudo bem, app funciona mesmo assim!

---

## 🚀 Próximos Passos

Depois de adicionar as fotos:

1. ✅ Coloque as fotos em `fotos/`
2. ✅ Recarregue a página (Ctrl+F5 = força recarregar)
3. ✅ As fotos devem aparecer nos cards
4. ✅ Clique em uma foto para ver detalhes
5. ✅ Teste no celular (Wi-Fi)
6. ✅ Pronto para usar!

---

## 💡 Dicas Extras

### Foto boa para app:
- 📸 Foto bem iluminada
- 📐 Peça bem enquadrada
- 🎯 Sem pessoas (só a roupa)
- 📦 Fundo simples (parede branca/neutra)
- 📱 Foto vertical (altura > largura)

### Se não tiver foto da peça:
1. Tire agora mesmo! 📸
2. Coloque na pasta `fotos/`
3. Use a app como normalmente

### Backup das fotos:
```bash
# Fazer backup antes de apagar original
cp -r fotos fotos_backup
```

---

## 📞 Suporte

**Problema que não saiu daqui?**

1. Abre DevTools (F12)
2. Console → procura mensagens vermelhas
3. Procura pelo ID da peça que está problema
4. Verifique se arquivo existe

---

**Pronto!** 🎉 Suas fotos devem estar funcionando. Bom uso! 👗✨
