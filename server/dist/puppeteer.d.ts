/**
 * Gera um PDF a partir de um conteúdo HTML
 * @param html - Conteúdo HTML para gerar o PDF
 * @returns Promise que resolve para um Buffer contendo o PDF
 */
export declare function generatePDF(html: string): Promise<Buffer>;
