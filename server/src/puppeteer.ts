import * as puppeteer from 'puppeteer';

/**
 * Gera um PDF a partir de um conteúdo HTML
 * @param html - Conteúdo HTML para gerar o PDF
 * @returns Promise que resolve para um Buffer contendo o PDF
 */
export async function generatePDF(html: string): Promise<Buffer> {
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
    // Enable request interception and logging
    await page.setRequestInterception(true);
    
    // Log all requests and their status
    page.on('request', request => {
      console.log('Request:', request.url());
      request.continue();
    });
    
    page.on('requestfailed', request => {
      console.error('Failed request:', {
        url: request.url(),
        errorText: request.failure()?.errorText,
        resourceType: request.resourceType()
      });
    });

    // Log console messages from the page
    page.on('console', msg => {
      console.log('Browser console:', msg.text());
    });

    await page.setContent(html, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    console.log('Conteúdo HTML definido com sucesso');

    // Log all image elements and their src attributes
    const imageData = await page.evaluate(() => {
      const images = document.getElementsByTagName('img');
      return Array.from(images).map(img => ({
        src: img.src,
        alt: img.alt,
        visible: img.offsetParent !== null
      }));
    });
    console.log('Images in document:', imageData);

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
      headerTemplate: '<div></div>',  // Empty but required when displayHeaderFooter is true
      footerTemplate: '<div></div>',  // Empty but required when displayHeaderFooter is true
      preferCSSPageSize: true,
      timeout: 30000
    });
    console.log('PDF gerado com sucesso');

    console.log('Convertendo para Buffer...');
    return Buffer.from(pdfBuffer);
  } catch (error: any) {
    console.error('Erro detalhado na geração do PDF:', {
      message: error.message,
      stack: error.stack,
      phase: error.phase || 'Desconhecida',
      type: error.constructor.name
    });
    throw error;
  } finally {
    if (browser) {
      console.log('Fechando o navegador...');
      try {
        await browser.close();
        console.log('Navegador fechado com sucesso');
      } catch (error) {
        console.error('Erro ao fechar o navegador:', error);
      }
    }
  }
}