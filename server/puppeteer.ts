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
    await page.addStyleTag({
      content: `
        @page {
          size: A4;
          margin: 0;  /* Remove todas as margens */
          @top-left { content: none; }
          @top-center { content: none; }
          @top-right { content: none; }
          @bottom-left { content: none; }
          @bottom-center { content: none; }
          @bottom-right { content: none; }
        }
        
        body {
          width: 210mm;
          height: 297mm;
          margin: 0;
          padding: 0;
        }

        /* Remove qualquer header/footer fixo */
        header, footer, 
        [role="header"], [role="footer"],
        .header, .footer {
          display: none !important;
          position: static !important;
        }

        /* Garante que elementos não sejam tratados como header/footer */
        * {
          position: relative !important;
          page-break-inside: auto;
        }
      `
    });
    console.log('Estilos configurados com sucesso');

    console.log('Gerando PDF...');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0',
        bottom: '0',
        left: '0',
        right: '0'
      },
      displayHeaderFooter: false,
      headerTemplate: '',
      footerTemplate: '',
      preferCSSPageSize: true,  /* Usa as margens do CSS @page */
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
