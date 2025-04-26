"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const puppeteer_1 = require("./puppeteer");
// Registrar helpers do Handlebars
handlebars_1.default.registerHelper('if_eq', function (a, b, opts) {
    return a === b ? opts.fn(this) : opts.inverse(this);
});
handlebars_1.default.registerHelper('if_not_eq', function (a, b, opts) {
    return a !== b ? opts.fn(this) : opts.inverse(this);
});
handlebars_1.default.registerHelper('formatDate', function (date) {
    if (!date)
        return '';
    return new Date(date).toLocaleDateString('pt-BR');
});
handlebars_1.default.registerHelper('formatCurrency', function (value) {
    if (!value)
        return 'R$ 0,00';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
});
handlebars_1.default.registerHelper('formatNumber', function (value) {
    if (!value)
        return '0';
    return value.toLocaleString('pt-BR');
});
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
app.use((0, cors_1.default)());
app.use((0, express_fileupload_1.default)());
app.use(express_1.default.static(path_1.default.resolve(__dirname, '../client/dist')));
// Rota para informações da empresa
app.get('/api/company-info', (req, res) => {
    try {
        const companyInfoPath = path_1.default.resolve(process.cwd(), 'dados-autha.json');
        const data = fs_1.default.readFileSync(companyInfoPath, 'utf8');
        const companyInfo = JSON.parse(data).company;
        res.json(companyInfo);
    }
    catch (err) {
        console.error('Erro ao ler informações da empresa:', err);
        res.status(500).json({ error: 'Erro ao ler informações da empresa' });
    }
});
// Rota para exemplo de proposta
app.get('/api/sample-proposal', (req, res) => {
    try {
        const samplePath = path_1.default.resolve(process.cwd(), 'prop-generico.json');
        const data = fs_1.default.readFileSync(samplePath, 'utf8');
        res.json(JSON.parse(data));
    }
    catch (err) {
        console.error('Erro ao ler proposta de exemplo:', err);
        res.status(500).json({ error: 'Erro ao ler proposta de exemplo' });
    }
});
// Geração de PDF
app.post('/api/proposal', async (req, res) => {
    try {
        const proposalData = req.body;
        if (!proposalData?.header?.client) {
            throw new Error('Dados da proposta inválidos ou incompletos');
        }
        // Carregar company info
        const companyInfoPath = path_1.default.resolve(process.cwd(), 'dados-autha.json');
        if (!fs_1.default.existsSync(companyInfoPath)) {
            throw new Error(`Arquivo de dados da empresa não encontrado: ${companyInfoPath}`);
        }
        const companyInfo = JSON.parse(fs_1.default.readFileSync(companyInfoPath, 'utf8')).company;
        // Carregar template
        const templatePath = path_1.default.resolve(process.cwd(), 'server/templates/proposal.html');
        if (!fs_1.default.existsSync(templatePath)) {
            throw new Error(`Template não encontrado: ${templatePath}`);
        }
        const templateSource = fs_1.default.readFileSync(templatePath, 'utf8');
        const template = handlebars_1.default.compile(templateSource);
        // Paths de imagens
        const logoPath = path_1.default.resolve(process.cwd(), 'logomarca-autha.png');
        const iconPath = path_1.default.resolve(process.cwd(), 'icone-autha.png');
        const html = template({ proposal: proposalData, company: companyInfo, logoPath, iconPath });
        const pdfBuffer = await (0, puppeteer_1.generatePDF)(html);
        res.contentType('application/pdf').send(pdfBuffer);
    }
    catch (err) {
        console.error('Erro ao gerar PDF:', err);
        res.status(500).json({ error: 'Erro ao gerar PDF', details: err.message });
    }
});
// Servir React em produção
app.get('*', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, '../client/dist/index.html'));
});
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
//# sourceMappingURL=index.js.map