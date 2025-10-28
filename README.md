# Pitang Booster 2025.1

Repositório para metas estabelecidas no Pitang Booster. Projeto NestJS com funcionalidades de calculadora, bubble sort e sistema de retorno.

## Pré-requisitos

- Node.js
- Redis (para filas)
- npm ou yarn

## Instalação

```bash
npm install
```

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev          # Inicia em modo desenvolvimento com watch
npm run start:debug        # Inicia em modo debug com watch

# Build e Produção
npm run build              # Gera build do projeto

# Formatação
npm run format             # Formata código com Prettier

# Commit padronizado
npm run commit             # Inicia assistente de commit
```

## Funcionalidades

- **Calculator**: Operações matemáticas básicas
- **Bubble Sort**: Algoritmo de ordenação
- **Return System**: Sistema de processamento com filas Redis

## APIs e Formatos de Entrada

### Calculadora API

**Endpoint**: `POST /calculator`

**Formato de entrada**:
```json
{
  "expression": "10 + 5 * 2 - 3 / 1"
}
```

### Bubble Sort API

**Endpoint**: `POST /bubble-sort`

**Formato de entrada**:
```json
{
  "array": [64, 34, 25, 12, 22, 11, 90]
}
```

### Sistema de Retorno API

**Endpoint**: `POST /return-system`

**Formato de entrada**:
```json
{
  "start": 1,
  "end": 1000000,
  "operation": "sum",
  "chunkSize": 10000
}
```

**Parâmetros**:
- `start`: Número inicial do intervalo (≥ 0)
- `end`: Número final do intervalo (≥ 0)
- `operation`: Operação a ser realizada (`sum`, `pair-numbers`, `odd-numbers`, `average`.)
- `chunkSize`: Tamanho do chunk (opcional, entre 1000 e 1.000.000)

**Outros endpoints**:
- `GET /return-system/status/:jobId` - Status do job
- `GET /return-system/result/:jobId` - Resultado final
- `GET /return-system/streaming/:jobId` - Resultado em streaming
- `DELETE /return-system/streaming/:jobId` - Limpar resultado da memória

## Comandos Git

### Comandos Básicos

```bash
# Clone do repositório
git clone https://github.com/matheus-soares23/PitangBooster-2025.1.git

# Commit (usar npm run commit para padronização)
git commit -m "mensagem do commit"

# Push
git push origin nome-da-branch
git push origin main

# Pull
git pull origin main
git pull origin nome-da-branch
```

### Branches

```bash
# Criar nova branch
git branch nome-da-branch
git checkout -b nome-da-branch

# Listar branches
git branch
git branch -a

# Trocar de branch
git checkout nome-da-branch
git switch nome-da-branch

# Deletar branch
git branch -d nome-da-branch
git push origin --delete nome-da-branch
```

### Merge e Rebase

```bash
# Merge
git checkout main
git merge nome-da-branch

# Rebase
git checkout nome-da-branch
git rebase main

## Padronização de Commits

Este projeto usa Commitlint para padronização.

### Tipos de Commit Permitidos

- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Documentação
- **style**: Formatação (sem mudança de código)
- **refactor**: Refatoração de código
- **test**: Testes
- **chore**: Tarefas de build/configuração
- **perf**: Melhoria de performance
- **ci**: Integração contínua
- **build**: Sistema de build
- **revert**: Reverter commit

### Padrão de Branches

```bash
# Features
feat/nome-da-feature
feat/adicionar-calculadora

# Bugfixes
fix/nome-do-bug
fix/corrigir-ordenacao

# Documentação
docs/atualizar-readme


### Controle de Changelog

```bash
npm run release

# Verificar commits desde última tag
git log --oneline $(git describe --tags --abbrev=0)..HEAD
```
## Estrutura do Projeto

```
src/
├── app.module.ts                 # Módulo principal
├── main.ts                       # Ponto de entrada
├── bubbleSorter/                 # Funcionalidade de ordenação
├── calculator/                   # Funcionalidade de calculadora
└── returnSystem/                 # Sistema de retorno com filas
```
