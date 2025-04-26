## Resumo

A geração de PDFs A4 a partir de aplicações React usando Puppeteer envolve a combinação das opções nativas de `page.pdf()` com templates de cabeçalho e rodapé (via `headerTemplate` e `footerTemplate`), ajustes de CSS de impressão e técnicas para garantir que todo o conteúdo (inclusive webfonts e elementos dinâmicos) seja carregado antes da captura. Exemplos reais de repositórios como **PrincAm/react-puppeteer-pdf**  ([PrincAm/react-puppeteer-pdf: Basic creation of PDF by Puppeteer](https://github.com/PrincAm/react-puppeteer-pdf?utm_source=chatgpt.com)), **studiojms/nodejs-react-puppeteer-pdf-example**  ([nodejs-react-puppeteer-pdf-example/README.md at main - GitHub](https://github.com/studiojms/nodejs-react-puppeteer-pdf-example/blob/main/README.md?utm_source=chatgpt.com)) e **brianzinn/crapdf**  ([brianzinn/crapdf: react pdf render puppeteer node - GitHub](https://github.com/brianzinn/crapdf?utm_source=chatgpt.com)) mostram abordagens práticas. Os problemas mais comuns incluem estilos de cabeçalho/rodapé não aplicados, espaços em branco indesejados, quebras de página incorretas e falta de carregamento completo de conteúdo; as soluções passam por CSS inline específico, configuração de margens, uso de `waitUntil: 'networkidle2'` e regras de página CSS como `page-break-inside: avoid`  ([How to get Puppeteer PDF generation to match HTML document ...](https://stackoverflow.com/questions/65545690/how-to-get-puppeteer-pdf-generation-to-match-html-document-exactly-in-regards-t?utm_source=chatgpt.com)).

---

## 1. Introdução

Puppeteer é uma biblioteca Node.js que controla o Chrome/Chromium via DevTools Protocol, permitindo a geração de PDFs de páginas web renderizadas, inclusive SPAs em React  ([Puppeteer | Puppeteer](https://pptr.dev/?utm_source=chatgpt.com)). Para orçamentos e relatórios em A4 com cabeçalhos e rodapés fixos, usa-se `page.pdf()` com:

- `format: 'A4'`  
- `displayHeaderFooter: true`  
- `headerTemplate` e `footerTemplate` para HTML personalizado  
- `margin` para reservar espaço para esses elementos  ([PDFOptions interface - Puppeteer](https://pptr.dev/api/puppeteer.pdfoptions?utm_source=chatgpt.com)).

---

## 2. Pré-requisitos

1. **Node.js** ≥ 14.x  
2. **npm** ou **yarn**  
3. **Puppeteer** (recomenda-se a versão estável mais recente)  
4. Projeto React rodando em server-side (por exemplo, com Express) ou build estático disponível para o Puppeteer acessar 

---

## 3. Instalação

```bash
# No diretório do seu projeto
npm install puppeteer
# ou
yarn add puppeteer
```
Em projetos fullstack, instale também as dependências do servidor (Express, etc.).

---

## 4. Estrutura Básica de um Script de Geração

```javascript
const puppeteer = require('puppeteer');

async function generatePdf(url, outputPath) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Emula mídia de tela para respeitar estilos
  await page.emulateMediaType('screen');

  // Navega e aguarda carregamento completo
  await page.goto(url, { waitUntil: 'networkidle2' }); // garante carregamento de scripts e fontes  ([7 Tips for Generating PDFs with Puppeteer - APITemplate.io](https://apitemplate.io/blog/tips-for-generating-pdfs-with-puppeteer/?utm_source=chatgpt.com))

  // Gera PDF com opções A4 e cabeçalho/rodapé fixos
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `<div style="font-size:10px; width:100%; text-align:center;">
                       Meu Cabeçalho Fixo — <span class="title"></span>
                     </div>`,
    footerTemplate: `<div style="font-size:10px; width:100%; text-align:center;">
                       Página <span class="pageNumber"></span> de <span class="totalPages"></span>
                     </div>`,
    margin: { top: '60px', bottom: '60px', left: '20mm', right: '20mm' }, // reserva espaço para header/footer  ([headerTemplate and footerTemplate doesn't work in pdf export #1822](https://github.com/puppeteer/puppeteer/issues/1822?utm_source=chatgpt.com))
    preferCSSPageSize: true
  });

  await browser.close();
}
```

---

## 5. Exemplos de Repositórios Reais

- **PrincAm/react-puppeteer-pdf**: Demonstração básica de PDF via Puppeteer em app React/Express  ([PrincAm/react-puppeteer-pdf: Basic creation of PDF by Puppeteer](https://github.com/PrincAm/react-puppeteer-pdf?utm_source=chatgpt.com))  
- **studiojms/nodejs-react-puppeteer-pdf-example**: Exemplo completo de geração, incluindo build do React e script de PDF  ([nodejs-react-puppeteer-pdf-example/README.md at main - GitHub](https://github.com/studiojms/nodejs-react-puppeteer-pdf-example/blob/main/README.md?utm_source=chatgpt.com))  
- **brianzinn/crapdf**: Usa ReactDOMServer e Puppeteer para gerar PDFs reusando componentes React existentes  ([brianzinn/crapdf: react pdf render puppeteer node - GitHub](https://github.com/brianzinn/crapdf?utm_source=chatgpt.com))  

---

## 6. Opções de PDF e Templates

### 6.1 PDFOptions Principais

- `format: 'A4'` — define tamanho A4  
- `printBackground: true` — mantém cores de fundo  
- `displayHeaderFooter: true` — habilita templates  
- `headerTemplate` e `footerTemplate` — HTML customizado  
- `margin` — reservatório de espaço; evita sobrepor conteúdo  
- `preferCSSPageSize: true` — respeita regra `@page` no CSS  
- `pageRanges` — selecionar páginas específicas  ([PDFOptions interface - Puppeteer](https://pptr.dev/api/puppeteer.pdfoptions?utm_source=chatgpt.com))  

### 6.2 CSS para Impressão

```css
@page {
  margin: 17mm; /* define margens físicas */
}
header, footer {
  -webkit-print-color-adjust: exact; /* garante cores exatas */
}
.my-box {
  page-break-inside: avoid; /* evita quebra interna */
}
```

---

## 7. Trabalhando com Múltiplas Páginas

- **Quebras de página**: use CSS `page-break-inside: avoid;` em elementos críticos  ([How to get Puppeteer PDF generation to match HTML document ...](https://stackoverflow.com/questions/65545690/how-to-get-puppeteer-pdf-generation-to-match-html-document-exactly-in-regards-t?utm_source=chatgpt.com))  
- **Conteúdo dinâmico**: após `page.goto()`, execute:
  ```js
  await page.evaluate(async () => {
    window.scrollBy(0, document.body.scrollHeight);
    await new Promise(r => setTimeout(r, 500));
  });
  ```
- **Limites de página**: `pageRanges: '1-5'` para exportar apenas páginas 1 a 5  ([PDFOptions interface - Puppeteer](https://pptr.dev/api/puppeteer.pdfoptions?utm_source=chatgpt.com))

---

## 8. Problemas Comuns e Soluções

| Problema                                                      | Solução                                                                                             | Fonte                           |
|---------------------------------------------------------------|----------------------------------------------------------------------------------------------------|---------------------------------|
| **Estilos não aplicados em header/footer**                    | Defina TODO estilo inline no template; o header/footer não herda CSS do body  ([footerTemplate and headerTemplate don't use body styles #1853](https://github.com/puppeteer/puppeteer/issues/1853?utm_source=chatgpt.com))    | GitHub Issue #1853              |
| **Espaços em branco extras**                                  | Ajuste `margin.top`/`margin.bottom`; verifique margens nativas do Chromium  ([Extra whitespace above the header and below the footer. #4132](https://github.com/puppeteer/puppeteer/issues/4132?utm_source=chatgpt.com))      | GitHub Issue #4132              |
| **Conteúdo não carregado (webfonts, AJAX)**                   | Use `waitUntil: 'networkidle2'` e role a página para forçar carregamento  ([7 Tips for Generating PDFs with Puppeteer - APITemplate.io](https://apitemplate.io/blog/tips-for-generating-pdfs-with-puppeteer/?utm_source=chatgpt.com))      | APITemplate.io Tipos            |
| **Quebras de página inadequadas**                             | Aplique CSS `page-break-inside: avoid;` em caixas/tabelas críticas  ([How to get Puppeteer PDF generation to match HTML document ...](https://stackoverflow.com/questions/65545690/how-to-get-puppeteer-pdf-generation-to-match-html-document-exactly-in-regards-t?utm_source=chatgpt.com))            | StackOverflow                   |
| **Tamanho de arquivo grande / performance lenta**             | Inicie Puppeteer com flags como `--disable-dev-shm-usage`; compacte com Ghostscript pós-geração  ([7 Tips for Generating PDFs with Puppeteer - APITemplate.io](https://apitemplate.io/blog/tips-for-generating-pdfs-with-puppeteer/?utm_source=chatgpt.com)) | APITemplate.io                  |
| **Problemas de timing com webfonts**                          | Aguarde carregamento de fontes com `networkidle2`, ou use `page.waitForTimeout()` antes do PDF  ([Rendering PDF with webfonts · Issue #422 · puppeteer ... - GitHub](https://github.com/puppeteer/puppeteer/issues/422?utm_source=chatgpt.com)) | GitHub Issue #422               |
| **Customização de primeira página diferente das demais**      | Gere múltiplos PDFs por faixa ou ajustando `pageRanges` por comando separado  ([Ability to prevent header/footer on certain pages #2089 - GitHub](https://github.com/puppeteer/puppeteer/issues/2089?utm_source=chatgpt.com))  | GitHub Issue #2089               |

---

## 9. Otimização de Desempenho

Baseado em “7 Tips for Generating PDFs with Puppeteer”  ([7 Tips for Generating PDFs with Puppeteer - APITemplate.io](https://apitemplate.io/blog/tips-for-generating-pdfs-with-puppeteer/?utm_source=chatgpt.com), [blog - APITemplate.io](https://apitemplate.io/blog/3/?utm_source=chatgpt.com)):

1. **Reutilize instância de navegador** para múltiplos PDFs.  
2. **Desative recursos não essenciais** (`--disable-gpu`, `--no-sandbox`).  
3. **Use `preferCSSPageSize`** em vez de definir manualmente width/height.  
4. **Pré-carregue fontes** ou use fonts self-hosted para evitar falhas.  
5. **Compactação pós-processamento** com Ghostscript.  
6. **Limite `viewport`** para apenas a área que interessa.  
7. **Agrupe geração** em lotes para melhorar paralelismo.

---

## 10. Conclusão

Este guia reúne as melhores práticas, exemplos de repositórios reais e soluções para os principais desafios na geração de PDFs A4 multipágina com cabeçalhos e rodapés fixos usando Puppeteer em projetos React. Com ele, você terá documentação completa para iniciar, diagnosticar problemas e otimizar seu fluxo de exportação de orçamentos, relatórios ou propostas comerciais.

> **Próximos passos**: adapte os templates `headerTemplate`/`footerTemplate` às suas necessidades visuais e incorpore estas técnicas no seu processo de build para automação total.