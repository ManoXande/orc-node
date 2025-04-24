import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';
import puppeteer from 'puppeteer';

// Importar a função para geração de PDF
import { generatePDF } from './puppeteer';

// Registrar helpers do Handlebars
Handlebars.registerHelper('if_eq', function(this: any, a: any, b: any, opts: Handlebars.HelperOptions) {
  if (a === b) {
    return opts.fn(this);
  }
  return opts.inverse(this);
});

Handlebars.registerHelper('if_not_eq', function(this: any, a: any, b: any, opts: Handlebars.HelperOptions) {
  if (a !== b) {
    return opts.fn(this);
  }
  return opts.inverse(this);
});

Handlebars.registerHelper('formatDate', function(this: any, date: Date | string | number, opts: Handlebars.HelperOptions) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR');
});

Handlebars.registerHelper('formatCurrency', function(this: any, value: number, opts: Handlebars.HelperOptions) {
  if (!value) return 'R$ 0,00';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
});

Handlebars.registerHelper('formatNumber', function(this: any, value: number, opts: Handlebars.HelperOptions) {
  if (!value) return '0';
  return value.toLocaleString('pt-BR');
});

// Inicializar o servidor Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para logging de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middleware para aumentar o limite de payload
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Outros Middleware
app.use(cors());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, '../client/dist')));

// Rota para fornecer informações da empresa
app.get('/api/company-info', (req, res) => {
  try {
    const companyInfoPath = path.join(__dirname, '../dados-autha.json');
    const companyInfo = JSON.parse(fs.readFileSync(companyInfoPath, 'utf8'));
    res.json(companyInfo.company);
  } catch (error) {
    console.error('Erro ao ler informações da empresa:', error);
    res.status(500).json({ error: 'Erro ao ler informações da empresa' });
  }
});

// Rota para fornecer uma proposta de exemplo
app.get('/api/sample-proposal', (req, res) => {
  try {
    const proposalPath = path.join(__dirname, '../prop-generico.json');
    const proposal = JSON.parse(fs.readFileSync(proposalPath, 'utf8'));
    res.json(proposal);
  } catch (error) {
    console.error('Erro ao ler proposta de exemplo:', error);
    res.status(500).json({ error: 'Erro ao ler proposta de exemplo' });
  }
});

// Middleware de erro global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    details: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Rota principal para receber os dados e gerar o PDF
app.post('/api/proposal', async (req, res) => {
  try {
    console.log('=== Iniciando geração de PDF ===');
    const proposalData = req.body;
    console.log('Dados recebidos:', JSON.stringify(proposalData, null, 2));
    
    // Validar dados da proposta
    if (!proposalData || !proposalData.header || !proposalData.header.client) {
      throw new Error('Dados da proposta inválidos ou incompletos');
    }
    
    // Carregar as informações da empresa
    const companyInfoPath = path.join(__dirname, '../dados-autha.json');
    console.log('Carregando informações da empresa de:', companyInfoPath);
    
    if (!fs.existsSync(companyInfoPath)) {
      throw new Error(`Arquivo de dados da empresa não encontrado: ${companyInfoPath}`);
    }
    
    const companyInfo = JSON.parse(fs.readFileSync(companyInfoPath, 'utf8')).company;
    console.log('Informações da empresa carregadas com sucesso');
    
    // Carregar e compilar o template
    const templatePath = path.join(__dirname, './templates/proposal.html');
    console.log('Carregando template de:', templatePath);
    
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template HTML não encontrado: ${templatePath}`);
    }
    
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(templateSource);
    console.log('Template compilado com sucesso');
    
    // Verificar caminhos das imagens
    const logoPath = path.join(__dirname, '../logomarca-autha.png');
    const iconPath = path.join(__dirname, '../icone-autha.png');
    
    if (!fs.existsSync(logoPath)) {
      console.warn('Arquivo de logo não encontrado:', logoPath);
    }
    if (!fs.existsSync(iconPath)) {
      console.warn('Arquivo de ícone não encontrado:', iconPath);
    }
    
    // Renderizar o HTML com os dados da proposta e da empresa
    console.log('Renderizando HTML com os dados');
    const html = template({
      proposal: proposalData,
      company: companyInfo,
      logoPath,
      iconPath
    });
    console.log('HTML renderizado com sucesso');
    
    // Gerar o PDF usando Puppeteer
    console.log('Iniciando geração do PDF com Puppeteer');
    const pdfBuffer = await generatePDF(html);
    console.log('PDF gerado com sucesso');
    
    // Enviar o PDF como resposta
    res.contentType('application/pdf');
    res.send(pdfBuffer);
    console.log('=== PDF enviado com sucesso ===');
  } catch (error: any) {
    console.error('=== ERRO NA GERAÇÃO DO PDF ===');
    console.error('Detalhes do erro:', {
      message: error.message,
      stack: error.stack,
      type: error.constructor.name
    });
    
    // Enviar resposta de erro mais detalhada
    res.status(500).json({ 
      error: 'Erro ao gerar PDF',
      details: error.message || 'Erro desconhecido',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      type: error.constructor.name
    });
  }
});

// Rota para servir o cliente React em produção
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 