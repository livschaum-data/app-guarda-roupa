#!/usr/bin/env python3
"""
Script para extrair peças e looks do Excel e gerar JSON para a app.

USE ESTE SCRIPT QUANDO:
- Adicionar novas peças ao Excel
- Atualizar dados das peças existentes
- Criar novos looks

COMO USAR:
1. Coloque este arquivo na mesma pasta que seu Excel
2. Abra terminal/cmd na pasta
3. Digite: python extrair_dados.py
4. Ele gera um novo dados_guarda_roupa.json
5. Coloque esse JSON na pasta da app
6. Recarregue a página da app
"""

import openpyxl
import json
from datetime import datetime
import sys
import os
import re

def valor_texto(valor):
    if valor is None:
        return ''
    if isinstance(valor, datetime):
        return valor.date().isoformat()
    return str(valor).strip()

def normalizar_id(valor):
    texto = valor_texto(valor).upper()
    return texto if re.fullmatch(r'[A-Z]{1,4}\d{4}', texto) and texto != 'ID0000' else ''

def nome_campo(header, col_idx):
    return valor_texto(header) or f'col_{col_idx + 1}'

def campo_valido(valor):
    texto = valor_texto(valor)
    return bool(texto and texto.lower() != 'na')

def extrair_campos_linha(row, headers, indices):
    campos = []
    for col_idx in indices:
        if col_idx >= len(row):
            continue
        valor = valor_texto(row[col_idx])
        if not campo_valido(valor):
            continue
        campos.append({
            'campo': nome_campo(headers[col_idx] if col_idx < len(headers) else '', col_idx),
            'valor': valor,
            'coluna': col_idx + 1,
        })
    return campos

def extrair_ids_linha(row, headers, indices):
    itens = []
    for col_idx in indices:
        if col_idx >= len(row):
            continue
        peca_id = normalizar_id(row[col_idx])
        if not peca_id:
            continue
        itens.append({
            'grupo': nome_campo(headers[col_idx] if col_idx < len(headers) else '', col_idx),
            'id': peca_id,
            'foto': f'fotos/{peca_id}.webp',
        })
    return itens

def extrair_mapa_combinacoes_nao_permitidas(wb):
    """
    Lê a aba Categorias e retorna descrições para códigos CD0001...
    Na planilha, esse bloco fica nas colunas AY:BA.
    """
    try:
        ws = wb['Categorias']
    except KeyError:
        return {}

    mapa = {}
    for row in ws.iter_rows(min_row=2, max_row=ws.max_row, min_col=51, max_col=53, values_only=True):
        codigo = valor_texto(row[0]).upper()
        if not codigo:
            continue

        mapa[codigo] = {
            'codigo': codigo,
            'descricao': valor_texto(row[1]) or codigo,
            'grupo': valor_texto(row[2]),
            'foto': f'fotos/categorias/{codigo}.webp',
        }

    return mapa

def buscar_combinacao_nao_permitida(mapa, valor):
    texto = valor_texto(valor).upper()
    if not texto:
        return {}

    if texto in mapa:
        return mapa[texto]

    for info in mapa.values():
        if valor_texto(info.get('descricao')).upper() == texto:
            return info

    return {}

def extrair_mapa_ocasiões(wb):
    """
    Lê a aba Categorias e retorna descrições para os códigos de ocasião.
    Na planilha, esse bloco fica nas colunas E:I.
    """
    try:
        ws = wb['Categorias']
    except KeyError:
        return {}

    mapa = {}
    for row in ws.iter_rows(min_row=2, max_row=ws.max_row, min_col=5, max_col=9, values_only=True):
        codigo = valor_texto(row[0])
        if not codigo:
            continue

        mapa[codigo] = {
            'codigo': codigo,
            'descricao': valor_texto(row[1]) or codigo,
            'local': valor_texto(row[2]),
            'tipo': valor_texto(row[3]),
            'data_revisao': valor_texto(row[4]),
        }

    return mapa

def extrair_mapa_climas(wb):
    """
    Lê a aba Categorias e retorna descrições para os códigos de clima.
    Na planilha, esse bloco fica nas colunas A:C.
    """
    try:
        ws = wb['Categorias']
    except KeyError:
        return {}

    mapa = {}
    for row in ws.iter_rows(min_row=2, max_row=ws.max_row, min_col=1, max_col=3, values_only=True):
        codigo = valor_texto(row[0])
        if not codigo:
            continue

        mapa[codigo] = {
            'codigo': codigo,
            'descricao': valor_texto(row[1]) or codigo,
            'temperatura': valor_texto(row[2]),
        }

    return mapa

def aquecimento_peca(pecas, peca_id):
    valor = pecas.get(peca_id, {}).get('nivel_aquecimento')
    texto = valor_texto(valor)
    return texto if texto and texto != 'na' else None

def local_peca(pecas, peca_id):
    valor = pecas.get(peca_id, {}).get('local')
    texto = valor_texto(valor)
    return texto if texto and texto != 'na' else None

def utilizacao_peca(pecas, peca_id):
    valor = pecas.get(peca_id, {}).get('utilizacao')
    texto = valor_texto(valor)
    return texto if texto and texto != 'na' else None

def em(valor, opcoes):
    return valor in opcoes

def calcular_local_look(situacao, loc1, loc2, loc3):
    situacao = valor_texto(situacao)
    locs = [valor_texto(loc) or None for loc in [loc1, loc2, loc3]]

    if 'virtual' in locs or situacao == 'excluído':
        return 'virtual'

    if locs[0] and (locs[0] == locs[1] or locs[1] is None) and (locs[0] == locs[2] or locs[2] is None):
        return locs[0]

    return 'misto'

def calcular_utilizacao_look(indicador, util1, util2, util3):
    indicador = valor_texto(indicador)
    u1, u2, u3 = [valor_texto(util) or None for util in [util1, util2, util3]]

    if indicador in ['LL', 'PL']:
        return 'under'

    if u1 == 'casa' and em(u2, ['casa', None]) and em(u3, ['casa', None]):
        return 'casa'

    if u1 == 'sair' and em(u2, ['sair', None]) and em(u3, ['sair', None]):
        return 'sair'

    if u1 == 'sair' and ((u2 is not None and u2 != 'sair') or (u3 is not None and u3 != 'sair')):
        return 'mix'

    if u1 == 'casa' and ((u2 is not None and u2 != 'casa') or (u3 is not None and u3 != 'casa')):
        return 'mix'

    return None

def calcular_clima_look(indicador, aquece1, aquece2, aquece3):
    indicador = valor_texto(indicador)
    a1 = valor_texto(aquece1) or None
    a2 = valor_texto(aquece2) or None
    a3 = valor_texto(aquece3) or None

    if a1 == "1" and em(a2, ["1", None]) and a3 is None:
        return "1"

    if a1 == "2" and em(a2, ["1", None]) and a3 is None:
        return "2"
    if indicador != "TL" and em(a1, ["1", "2"]) and a2 == "2" and a3 is None:
        return "2"
    if indicador != "TL" and em(a1, ["1", "2"]) and em(a2, ["1", "2", None]) and a3 == "2":
        return "2"
    if indicador == "TL" and a1 == "1" and a2 == "2" and a3 is None:
        return "2"

    if indicador != "TL" and em(a1, ["1", "2"]) and em(a2, ["1", "2", None]) and a3 == "3":
        return "3"
    if indicador == "TL" and a1 == "1" and em(a2, ["1", "2"]) and a3 == "3":
        return "3"
    if indicador == "TL" and a1 == "2" and a2 == "2" and a3 is None:
        return "3"

    if a1 == "3" and em(a2, ["1", "2"]) and em(a3, ["3", None]):
        return "4"
    if indicador != "TL" and em(a1, ["1", "2"]) and em(a2, ["1", "2", None]) and a3 == "4":
        return "4"
    if indicador == "TL" and a1 == "2" and em(a2, ["1", "2"]) and a3 == "3":
        return "4"

    if a1 == "4" and em(a2, ["2", "1"]) and em(a3, [None, "2", "3"]):
        return "5"
    if indicador != "TL" and em(a1, ["1", "2"]) and em(a2, ["1", "2", None]) and a3 == "5":
        return "5"
    if indicador != "TL" and a1 == "3" and em(a2, ["1", "2", None]) and a3 == "4":
        return "5"
    if a1 == "3" and a2 == "5" and a3 is None:
        return "5"
    if indicador == "TL" and em(a1, ["1", "2"]) and a2 == "2" and a3 == "4":
        return "5"

    if indicador != "TL" and a1 == "5" and em(a2, ["1", "2"]) and em(a3, [None, "2", "3"]):
        return "6"
    if indicador != "TL" and a1 == "3" and a2 == "2" and a3 == "5":
        return "6"
    if indicador != "TL" and em(a1, ["1", "2"]) and a2 == "2" and a3 == "6":
        return "6"
    if indicador != "TL" and em(a1, ["4", "5"]) and a2 == "2" and a3 == "4":
        return "6"
    if indicador != "TL" and a1 == "4" and a2 == "5" and em(a3, [None, "2"]):
        return "6"
    if indicador == "TL" and em(a1, ["1", "2", "3"]) and a2 == "2" and a3 == "5":
        return "6"
    if indicador == "TL" and a1 == "5" and a2 == "2" and a3 is None:
        return "6"
    if indicador == "TL" and a1 == "2" and a2 == "5" and em(a3, ["3", None]):
        return "6"

    if a1 == "6" and a2 == "2" and em(a3, [None, "2"]):
        return "7"
    if indicador != "TL" and a1 == "3" and a2 == "2" and a3 == "6":
        return "7"
    if indicador != "TL" and em(a1, ["4", "5"]) and em(a2, ["2", "5"]) and a3 == "5":
        return "7"
    if indicador != "TL" and a1 == "5" and a2 == "5" and em(a3, [None, "2"]):
        return "7"
    if indicador != "TL" and a1 == "3" and a2 == "5" and a3 == "5":
        return "7"
    if indicador == "TL" and a1 == "2" and a2 == "5" and a3 == "4":
        return "7"
    if indicador == "TL" and em(a1, ["3", "4"]) and a2 == "5" and a3 is None:
        return "7"

    if indicador != "TL" and em(a1, ["4", "5"]) and em(a2, ["2", "5"]) and a3 == "6":
        return "8"
    if indicador != "TL" and a1 == "6" and a2 == "5" and em(a3, [None, "2"]):
        return "8"
    if indicador != "TL" and a1 == "3" and a2 == "5" and a3 == "6":
        return "8"
    if indicador == "TL" and a1 == "2" and a2 == "5" and em(a3, ["5", "6"]):
        return "8"
    if indicador == "TL" and em(a1, ["5", "6"]) and a2 == "5" and a3 is None:
        return "8"

    if indicador == "PRL" and a1 == "0" and em(a2, ["0", "1", None]) and em(a3, ["1", "2", None]):
        return "1"

    return None

def extrair_dados(arquivo_excel):
    """
    Extrai dados do Excel e gera JSON para a app.
    
    Argumentos:
        arquivo_excel (str): Caminho do arquivo .xlsx ou .xlsm
    
    Retorna:
        dict: Dicionário com pecas, looks e ocasioes
    """
    
    print(f"📖 Abrindo arquivo: {arquivo_excel}")
    print("-" * 50)
    
    try:
        # Abrir o Excel
        wb = openpyxl.load_workbook(arquivo_excel)
    except FileNotFoundError:
        print(f"❌ Erro: Arquivo '{arquivo_excel}' não encontrado!")
        print(f"Coloque o arquivo .xlsx/.xlsm na pasta do script.")
        return None
    except Exception as e:
        print(f"❌ Erro ao abrir arquivo: {e}")
        return None

    # ==================== EXTRAIR PEÇAS ====================
    print("\n🔄 Extraindo peças...")
    
    try:
        ws_pecas = wb['BD peças']
    except KeyError:
        print("❌ Erro: Aba 'BD peças' não encontrada!")
        return None
    
    pecas = {}
    headers_pecas = [valor_texto(cell.value) for cell in ws_pecas[1]]
    campos_extra_idx = [11, 12, 13, 15, 16, 17, 18, 20, 21, 22, 23, 24, 27, 28]
    acessorios_idx = range(37, 61) # AL:BI
    combinacoes_nao_permitidas_idx = range(61, 69) # BJ:BQ
    mapa_combinacoes_nao_permitidas = extrair_mapa_combinacoes_nao_permitidas(wb)
    
    # Estrutura esperada (confira com seu Excel):
    # Coluna A: ID
    # Coluna D: Tipo
    # Coluna E: Função
    # Coluna F: Subtipo
    # coluna G: nivel_aquecimento
    # Coluna H: Padronagem
    # Coluna I: Cor detalhe
    # Coluna J: Tom
    # Coluna K: Utilização
    # Coluna O: Local
    # Coluna Q: Situação
    
    for row_idx, row in enumerate(ws_pecas.iter_rows(min_row=2, max_row=ws_pecas.max_row, values_only=True), start=2):
        try:
            id_peca = row[0]  # Coluna A
            
            # Pular linhas vazias ou cabeçalho repetido
            if not id_peca or id_peca == 'ID' or not isinstance(id_peca, str):
                continue
            
            tipo = str(row[3]) if row[3] else 'na'  # Coluna D
            funcao = str(row[4]) if row[4] else 'na'      # Coluna E
            subtipo = str(row[5]) if row[5] else 'na'  # Coluna F
            nivel_aquecimento = str(row[6]) if row[6] else 'na'  # Coluna G
            padronagem = str(row[7]) if row[7] else 'na'  # Coluna H
            cor_detalhe = str(row[8]) if row[8] else 'na'  # Coluna I
            tom = str(row[9]) if row[9] else 'na'  # Coluna J
            utilizacao = str(row[10]) if row[10] else 'na'  # Coluna K
            local = str(row[14]) if row[14] else 'na'  # Coluna O
            situacao = str(row[16]) if row[16] else 'na'  # Coluna Q
            detalhes = extrair_campos_linha(row, headers_pecas, campos_extra_idx)
            acessorios = extrair_ids_linha(row, headers_pecas, acessorios_idx)
            combinacoes_nao_permitidas = []

            for col_idx in combinacoes_nao_permitidas_idx:
                if col_idx >= len(row):
                    continue

                valor_restricao = valor_texto(row[col_idx])
                if not campo_valido(valor_restricao):
                    continue

                info = buscar_combinacao_nao_permitida(mapa_combinacoes_nao_permitidas, valor_restricao)
                codigo = info.get('codigo', valor_restricao.upper())
                combinacoes_nao_permitidas.append({
                    'grupo': nome_campo(headers_pecas[col_idx] if col_idx < len(headers_pecas) else '', col_idx),
                    'codigo': codigo,
                    'descricao': info.get('descricao', codigo),
                    'categoria': info.get('grupo', ''),
                    'foto': info.get('foto', f'fotos/categorias/{codigo}.webp'),
                })

            pecas[id_peca] = {
                'id': id_peca,
                'tipo': tipo.strip(),
                'funcao': funcao.strip(),
                'subtipo': subtipo.strip(),
                'nivel_aquecimento': nivel_aquecimento.strip(),
                'padronagem': padronagem.strip(),
                'cor_detalhe': cor_detalhe.strip(),
                'tom': tom.strip(),
                'utilizacao': utilizacao.strip(),
                'local': local.strip(),
                'situacao': situacao.strip(),
                'detalhes': detalhes,
                'acessorios': acessorios,
                'combinacoes_nao_permitidas': combinacoes_nao_permitidas
            }
        
        except (IndexError, TypeError) as e:
            # Pular erros de linha mal formatada
            continue
    
    print(f"✅ {len(pecas)} peças extraídas com sucesso!")
    
    # ==================== EXTRAIR LOOKS ====================
    print("\n🔄 Extraindo looks...")
    
    try:
        ws_looks = wb['BD looks']
    except KeyError:
        print("⚠️  Aviso: Aba 'BD looks' não encontrada. Continuando sem looks...")
        ws_looks = None
    
    looks = {}
    mapa_ocasiões = extrair_mapa_ocasiões(wb)
    mapa_climas = extrair_mapa_climas(wb)
    
    if ws_looks:
        headers = [valor_texto(cell.value) for cell in ws_looks[1]]
        campos_basicos_idx = range(0, 16)   # A:P
        pecas_sugeridas_idx = range(16, 35) # Q:AI
        ocasioes_idx = range(35, 76)        # AJ:BX
        
        for row_idx, row in enumerate(ws_looks.iter_rows(min_row=2, max_row=ws_looks.max_row, values_only=True), start=2):
            try:
                id_look = normalizar_id(row[0])  # Coluna A
                
                if not id_look:
                    continue
                
                situacao = valor_texto(row[6]) or 'ativo'  # Coluna G
                
                pecas_look = []
                for col_idx in [1, 2, 3]:
                    peca_id = normalizar_id(row[col_idx] if col_idx < len(row) else None)
                    if peca_id:
                        pecas_look.append(peca_id)

                basicos = {}
                for col_idx in campos_basicos_idx:
                    if col_idx >= len(row):
                        continue
                    header = headers[col_idx] or f'col_{col_idx + 1}'
                    basicos[header] = valor_texto(row[col_idx])

                pecas_sugeridas = []
                for col_idx in pecas_sugeridas_idx:
                    if col_idx >= len(row):
                        continue
                    peca_id = normalizar_id(row[col_idx])
                    if peca_id:
                        pecas_sugeridas.append({
                            'grupo': headers[col_idx] or f'col_{col_idx + 1}',
                            'id': peca_id,
                        })

                ocasioes = []
                for col_idx in ocasioes_idx:
                    if col_idx >= len(row) or not row[col_idx]:
                        continue
                    codigo = headers[col_idx]
                    if not codigo:
                        continue
                    info = mapa_ocasiões.get(codigo, {})
                    ocasioes.append({
                        'codigo': codigo,
                        'descricao': info.get('descricao', codigo),
                        'local': info.get('local', ''),
                        'tipo': info.get('tipo', ''),
                    })

                clima = valor_texto(row[76]) if len(row) > 76 else ''
                utilizacao = valor_texto(row[77]) if len(row) > 77 else ''
                local = valor_texto(row[78]) if len(row) > 78 else ''
                aquecimentos = [
                    aquecimento_peca(pecas, pecas_look[0]) if len(pecas_look) > 0 else None,
                    aquecimento_peca(pecas, pecas_look[1]) if len(pecas_look) > 1 else None,
                    aquecimento_peca(pecas, pecas_look[2]) if len(pecas_look) > 2 else None,
                ]
                locais_pecas = [
                    local_peca(pecas, pecas_look[0]) if len(pecas_look) > 0 else None,
                    local_peca(pecas, pecas_look[1]) if len(pecas_look) > 1 else None,
                    local_peca(pecas, pecas_look[2]) if len(pecas_look) > 2 else None,
                ]
                utilizacoes_pecas = [
                    utilizacao_peca(pecas, pecas_look[0]) if len(pecas_look) > 0 else None,
                    utilizacao_peca(pecas, pecas_look[1]) if len(pecas_look) > 1 else None,
                    utilizacao_peca(pecas, pecas_look[2]) if len(pecas_look) > 2 else None,
                ]
                clima_calc = calcular_clima_look(valor_texto(row[10]), *aquecimentos)
                clima_final = clima_calc or clima
                clima_info = mapa_climas.get(clima_final, {'codigo': clima_final, 'descricao': clima_final, 'temperatura': ''}) if clima_final else {}
                local_calc = calcular_local_look(situacao, *locais_pecas)
                utilizacao_calc = calcular_utilizacao_look(valor_texto(row[10]), *utilizacoes_pecas)
                
                if pecas_look:
                    looks[id_look] = {
                        'id': id_look,
                        'pecas': pecas_look,
                        'pecas_sugeridas': pecas_sugeridas,
                        'ocasioes': ocasioes,
                        'ocasiao': ', '.join([o['descricao'] for o in ocasioes]) or 'não especificada',
                        'situacao': situacao.strip(),
                        'indicador': valor_texto(row[10]) if len(row) > 10 else '',
                        'clima': clima_final,
                        'clima_planilha': clima,
                        'clima_calc': clima_calc or '',
                        'clima_info': clima_info,
                        'aquecimentos': aquecimentos,
                        'local_calc': local_calc,
                        'locais_pecas': locais_pecas,
                        'utilizacao_calc': utilizacao_calc or '',
                        'utilizacoes_pecas': utilizacoes_pecas,
                        'utilizacao': utilizacao,
                        'local': local,
                        'basicos': basicos,
                        'foto': f"fotos/{id_look.rstrip('0123456789')}/{id_look}.webp",
                    }
            
            except (IndexError, TypeError) as e:
                continue
        
        print(f"✅ {len(looks)} looks extraídos com sucesso!")
    
    # ==================== RETORNAR DADOS ====================
    
    dados = {
        'pecas': pecas,
        'looks': looks,
        'ocasioes': mapa_ocasiões,
        'climas': mapa_climas,
        'combinacoes_nao_permitidas': mapa_combinacoes_nao_permitidas,
        'ultima_atualizacao': datetime.now().isoformat(),
        'total_pecas': len(pecas),
        'total_looks': len(looks),
    }
    
    return dados


def salvar_json(dados, nome_arquivo='dados_guarda_roupa.json'):
    """
    Salva os dados em um arquivo JSON.
    
    Argumentos:
        dados (dict): Dados a salvar
        nome_arquivo (str): Nome do arquivo de saída
    """
    
    print(f"\n💾 Salvando em {nome_arquivo}...")
    
    try:
        with open(nome_arquivo, 'w', encoding='utf-8') as f:
            json.dump(dados, f, ensure_ascii=False, indent=2)
        
        # Calcular tamanho do arquivo
        tamanho_kb = os.path.getsize(nome_arquivo) / 1024
        
        print(f"✅ Arquivo '{nome_arquivo}' criado com sucesso!")
        print(f"   Tamanho: {tamanho_kb:.1f} KB")
    
    except Exception as e:
        print(f"❌ Erro ao salvar arquivo: {e}")


def mostrar_resumo(dados):
    """
    Mostra um resumo dos dados extraídos.
    
    Argumentos:
        dados (dict): Dados extraídos
    """
    
    print("\n" + "=" * 50)
    print("📊 RESUMO DOS DADOS EXTRAÍDOS")
    print("=" * 50)
    
    print(f"\n📍 Peças:")
    print(f"   Total: {dados['total_pecas']}")
    
    if dados['pecas']:
        # Mostrar alguns exemplos
        exemplos = list(dados['pecas'].items())[:3]
        for id_peca, peca in exemplos:
            print(f"   • {peca['id']}: {peca['tipo']} ({peca['cor_detalhe']})")
        
        if len(dados['pecas']) > 3:
            print(f"   ... e mais {len(dados['pecas']) - 3}")
    
    print(f"\n💄 Looks:")
    print(f"   Total: {dados['total_looks']}")
    
    if dados['looks']:
        # Mostrar alguns exemplos
        exemplos = list(dados['looks'].items())[:3]
        for id_look, look in exemplos:
            pecas_nomes = ', '.join([
                dados['pecas'][pid]['tipo'] if pid in dados['pecas'] else pid
                for pid in look['pecas']
            ])
            print(f"   • {look['id']}: {pecas_nomes}")
        
        if len(dados['looks']) > 3:
            print(f"   ... e mais {len(dados['looks']) - 3}")
    
    print(f"\n📅 Última atualização: {dados['ultima_atualizacao']}")
    print("\n" + "=" * 50)


def main():
    """
    Função principal - ponto de entrada do script.
    """
    
    print("\n" + "=" * 50)
    print("👗 EXTRATOR DE DADOS - GUARDA-ROUPA")
    print("=" * 50)
    
    # Caminho fixo do arquivo Excel
    arquivo_excel = r"C:\Users\livia\OneDrive\0 Organização e Planejamento\0001 Controles\0305_Vestuário.xlsm"
    
    print(f"\n📂 Usando arquivo: {arquivo_excel}\n")
    
    # Extrair dados
    dados = extrair_dados(arquivo_excel)
    
    if not dados:
        print("\n❌ Falha ao extrair dados!")
        return
    
    # Mostrar resumo
    mostrar_resumo(dados)
    
    # Salvar JSON
    salvar_json(dados)
    
    print("\n✅ Pronto! Agora:")
    print("   1. Copie 'dados_guarda_roupa.json' para a pasta da app")
    print("   2. Recarregue a página da app (Ctrl+F5)")
    print("   3. Seus dados estão atualizados!")
    
    print("\n" + "=" * 50 + "\n")


if __name__ == '__main__':
    main()
