import puppeteer from 'puppeteer';

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
    await page.setContent(html, { 
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    console.log('Conteúdo HTML definido com sucesso');

    console.log('Configurando estilos para impressão...');
    // Definir medidas unificadas para margens e alturas
    const marginPage = '9mm';
    const headerHeight = '17mm';
    const footerHeight = '17mm';
    const pageWidth = '210mm';
    const pageHeight = '297mm';

    // Gerar CSS dinâmico para impressão com variáveis
    const printCSS = `
      :root {
        --margin-page: ${marginPage};
        --header-height: ${headerHeight};
        --footer-height: ${footerHeight};
        --page-width: ${pageWidth};
        --page-height: ${pageHeight};
      }
      @page {
        size: A4;
        margin: 0;
      }
      body {
        width: ${pageWidth};
        height: ${pageHeight};
      }
      .proposal-header {
        position: fixed;
        top: calc(9mm - var(--header-height) / 2);
        left: 0;
        right: 0;
        height: var(--header-height);
        background-color: white;
        z-index: 100;
      }
      .proposal-footer {
        position: fixed;
        bottom: calc(9mm - var(--footer-height) / 2);
        left: 0;
        right: 0;
        height: var(--footer-height);
        background-color: white;
        z-index: 100;
      }
      .proposal-content {
        margin-top: calc(var(--header-height) + var(--margin-page));
        margin-bottom: calc(var(--footer-height) + var(--margin-page));
      }
    `;

    await page.addStyleTag({
      content: printCSS
    });
    console.log('Estilos configurados com sucesso');

    console.log('Gerando PDF...');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0mm',
        bottom: '0mm',
        left: '0mm',
        right: '0mm'
      },
      displayHeaderFooter: false,
      headerTemplate: '',
      footerTemplate: '',
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
