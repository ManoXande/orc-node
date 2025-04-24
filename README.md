# Autha Proposal Generator

Gerador de propostas orçamentárias para Autha Engenharia e Mapeamento.

![Autha Logo](./logomarca-autha.png)

## Descrição

Esta aplicação permite criar, editar e gerar PDFs de propostas orçamentárias para a Autha Engenharia e Mapeamento. O sistema utiliza um formato JSON padronizado para armazenar e processar os dados das propostas, e gera arquivos PDF de alta qualidade com o layout corporativo da Autha.

## Tecnologias Utilizadas

### Frontend
- React + TypeScript
- React Router
- React Hook Form
- Styled Components
- Axios

### Backend
- Node.js + Express
- TypeScript
- Handlebars (para templates)
- Puppeteer (para geração de PDF)

## Estrutura do Projeto

```
autha-proposal-generator/
├── client/                  # Frontend (React)
│   ├── src/
│   │   ├── assets/          # Imagens e fontes
│   │   ├── components/      # Componentes React
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── styles/          # Estilos CSS
│   │   ├── types/           # Definições de tipos TypeScript
│   │   └── App.tsx          # Componente principal
│   └── package.json
├── server/                  # Backend (Node.js/Express)
│   ├── templates/           # Templates HTML para PDFs
│   ├── index.ts             # Arquivo principal do servidor
│   ├── puppeteer.ts         # Lógica de geração de PDF
│   └── package.json
├── logomarca-autha.png      # Logo da empresa
├── icone-autha.png          # Ícone da empresa
├── dados-autha.json         # Dados da empresa
└── README.md                # Este arquivo
```

## Requisitos

- Node.js (v14 ou superior)
- NPM ou Yarn
- Um navegador moderno (Chrome, Firefox, Edge, etc.)

## Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd autha-proposal-generator
```

### 2. Instale as dependências do cliente e do servidor
```bash
# Instalar dependências do cliente
cd client
npm install
cd ..

# Instalar dependências do servidor
cd server
npm install
cd ..
```

### 3. Configure os arquivos de dados
- Verifique se os arquivos `logomarca-autha.png`, `icone-autha.png` e `dados-autha.json` estão presentes na raiz do projeto
- Ajuste os dados em `dados-autha.json` conforme necessário

## Execução

### Desenvolvimento

#### Iniciar o cliente (frontend)
```bash
cd client
npm run dev
```

#### Iniciar o servidor (backend)
```bash
cd server
npm run dev
```

### Produção

#### Construir o cliente
```bash
cd client
npm run build
```

#### Iniciar o servidor (que também servirá o cliente)
```bash
cd server
npm start
```

## Uso

1. Acesse a aplicação pelo navegador (por padrão em `http://localhost:5173` em desenvolvimento ou `http://localhost:5000` em produção)
2. Carregue um arquivo JSON de proposta existente ou comece com um modelo em branco
3. Edite os campos da proposta conforme necessário
4. Clique em "Gerar PDF" para criar e baixar a proposta em formato PDF

## Formato JSON de Proposta

A aplicação utiliza um formato JSON específico para as propostas. Veja o exemplo em `prop-generico.json` para entender a estrutura completa.

## Contribuição

Para contribuir com este projeto:

1. Crie um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto é proprietário e de uso exclusivo da Autha Engenharia e Mapeamento. 