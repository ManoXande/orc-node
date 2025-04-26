"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePDF = generatePDF;
const puppeteer = __importStar(require("puppeteer"));
/**
 * Gera um PDF a partir de um conteúdo HTML
 * @param html - Conteúdo HTML para gerar o PDF
 * @returns Promise que resolve para um Buffer contendo o PDF
 */
async function generatePDF(html) {
    let browser;
    try {
        console.log('Iniciando o navegador Puppeteer...');
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ]
        });
        console.log('Navegador iniciado com sucesso');
        console.log('Criando nova página...');
        const page = await browser.newPage();
        console.log('Página criada com sucesso');
        console.log('Definindo conteúdo HTML...');
        await page.setContent(html, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        console.log('Conteúdo HTML definido com sucesso');
        console.log('Configurando estilos para impressão...');
        await page.addStyleTag({
            content: `
        @page {
          size: A4;
          margin: 0;
        }
        
        body {
          width: 210mm;
          height: 297mm;
          margin: 0;
          padding: 0;
        }

        /* Ensure proper spacing for header and footer */
        .content {
          margin-top: 16mm;
          margin-bottom: 16mm;
        }

        /* Keep header and footer visible on every page */
        .header, .footer {
          position: fixed !important;
          z-index: 1000;
        }
      `
        });
        console.log('Estilos configurados com sucesso');
        console.log('Gerando PDF...');
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '16mm',
                bottom: '16mm',
                left: '0',
                right: '0'
            },
            displayHeaderFooter: true,
            headerTemplate: '<div></div>', // Empty but required when displayHeaderFooter is true
            footerTemplate: '<div></div>', // Empty but required when displayHeaderFooter is true
            preferCSSPageSize: true,
            timeout: 30000
        });
        console.log('PDF gerado com sucesso');
        console.log('Convertendo para Buffer...');
        return Buffer.from(pdfBuffer);
    }
    catch (error) {
        console.error('Erro detalhado na geração do PDF:', {
            message: error.message,
            stack: error.stack,
            phase: error.phase || 'Desconhecida',
            type: error.constructor.name
        });
        throw error;
    }
    finally {
        if (browser) {
            console.log('Fechando o navegador...');
            try {
                await browser.close();
                console.log('Navegador fechado com sucesso');
            }
            catch (error) {
                console.error('Erro ao fechar o navegador:', error);
            }
        }
    }
}
//# sourceMappingURL=puppeteer.js.map