import React from 'react';
import { Proposal, Section, ContentItem, CompanyInfo } from '../types/proposal';

interface LayoutProposalProps {
  proposal: Proposal;
  companyInfo: CompanyInfo;
}

// Função para formatar data no padrão brasileiro
const formatDate = (date: Date = new Date()): string => {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const LayoutProposal: React.FC<LayoutProposalProps> = ({ proposal, companyInfo }) => {
  // Renderiza itens de conteúdo com base no tipo
  const renderContentItem = (item: ContentItem) => {
    switch (item.type) {
      case 'text':
        return <p className="text-content">{item.content}</p>;
      
      case 'placeholder':
        return (
          <div className="placeholder-content">
            <img 
              src="/placeholder-image.png" 
              alt="Placeholder" 
              className="placeholder-image"
            />
            <p className="placeholder-text">{item.content}</p>
          </div>
        );
      
      case 'item':
        return (
          <div className="item-content">
            <p className="item-text">• {item.content}</p>
            {item.subitems && (
              <ul className="subitems-list">
                {item.subitems.map((subitem, idx) => (
                  <li key={idx} className="subitem">{subitem}</li>
                ))}
              </ul>
            )}
          </div>
        );
      
      case 'date':
        return <p className="date-content">{item.content}</p>;
      
      case 'signature':
        return (
          <div className="signature-content">
            <div className="signature-line"></div>
            <p className="signature-text">{item.content}</p>
          </div>
        );
      
      case 'company_info':
        return (
          <div className="company-info-content">
            <p className="company-info-text">{item.content}</p>
          </div>
        );
      
      case 'validity':
        return <p className="validity-content">{item.content}</p>;
      
      case 'slogan':
        return <p className="slogan-content">{item.content}</p>;
      
      default:
        return <p>{item.content}</p>;
    }
  };

  // Renderiza uma seção da proposta
  const renderSection = (section: Section) => {
    return (
      <div className="proposal-section" key={`section-${section.id}`}>
        <h2 className="section-title">{section.title}</h2>
        
        {section.content && (
          <div className="section-content">
            {section.content.map((item, idx) => (
              <div key={`content-${idx}`} className="content-item">
                {renderContentItem(item)}
              </div>
            ))}
          </div>
        )}
        
        {section.items && (
          <ul className="section-items">
            {section.items.map((item, idx) => (
              <li key={`item-${idx}`} className="section-item">{item}</li>
            ))}
          </ul>
        )}
        
        {section.testimonials && (
          <div className="testimonials">
            {section.testimonials.map((testimonial, idx) => (
              <div key={`testimonial-${idx}`} className="testimonial">
                <blockquote className="testimonial-quote">"{testimonial.quote}"</blockquote>
                <p className="testimonial-author">— {testimonial.author}</p>
              </div>
            ))}
          </div>
        )}
        
        {section.comparison_table && (
          <div className="comparison-table-container">
            <table className="comparison-table">
              <thead>
                <tr>
                  {section.comparison_table.headers.map((header, idx) => (
                    <th key={`header-${idx}`}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.comparison_table.rows.map((row, rowIdx) => (
                  <tr key={`row-${rowIdx}`}>
                    {row.map((cell, cellIdx) => (
                      <td key={`cell-${rowIdx}-${cellIdx}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {section.investment_options && (
          <div className="investment-options">
            {section.investment_options.map((option) => (
              <div key={`option-${option.id}`} className="investment-option">
                <h3 className="option-title">{option.title}</h3>
                <p className="option-description">{option.description}</p>
                {option.includes && <p className="option-includes"><strong>Inclui:</strong> {option.includes}</p>}
                
                {option.plans && (
                  <div className="option-plans">
                    {option.plans.map((plan, planIdx) => (
                      <div key={`plan-${planIdx}`} className="option-plan">
                        <h4 className="plan-name">{plan.name}</h4>
                        <p className="plan-total"><strong>Total:</strong> {plan.total}</p>
                        <p className="plan-conditions">{plan.conditions}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {section.subsections && (
          <div className="subsections">
            {section.subsections.map((subsection) => (
              <div key={`subsection-${subsection.id}`} className="subsection">
                <h3 className="subsection-title">{subsection.title}</h3>
                
                {subsection.content && (
                  <div className="subsection-content">
                    {subsection.content.map((item, idx) => (
                      <div key={`subcontent-${idx}`}>
                        {renderContentItem(item)}
                      </div>
                    ))}
                  </div>
                )}
                
                {subsection.services && (
                  <div className="subsection-services">
                    {subsection.services.map((service, idx) => (
                      <div key={`service-${idx}`} className="service">
                        <h4 className="service-name">{service.name}</h4>
                        {service.what_we_will_do && (
                          <p className="service-description"><strong>O que faremos:</strong> {service.what_we_will_do}</p>
                        )}
                        {service.your_benefit && (
                          <p className="service-benefit"><strong>Seu benefício:</strong> {service.your_benefit}</p>
                        )}
                        {service.what_you_will_receive && (
                          <p className="service-delivery"><strong>O que você receberá:</strong> {service.what_you_will_receive}</p>
                        )}
                        {service.why_consider && (
                          <p className="service-consider"><strong>Por que considerar:</strong> {service.why_consider}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {subsection.note && (
                  <p className="subsection-note">{subsection.note}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="proposal-preview">
      <div className="proposal-container">
        {/* Cabeçalho */}
        <header className="proposal-header">
          <div className="header-logo">
            <img 
              src="/assets/logomarca-autha.png" 
              alt={companyInfo.name} 
              className="company-logo"
              onError={(e) => {
                // Fallback caso a imagem não seja encontrada
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="50"><rect width="200" height="50" fill="%2338d972"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="20" fill="white">AUTHA</text></svg>';
              }}
            />
          </div>
          <div className="header-title">
            <h3>PROPOSTA ORÇAMENTÁRIA</h3>
            <p className="client-header">{proposal.header.client}</p>
          </div>
        </header>
        
        <div className="header-decoration"></div>
        
        {/* Título principal */}
        <h1 className="proposal-title">{proposal.title}</h1>
        
        {/* Subheader com serviço e cliente */}
        <div className="proposal-subheader">
          <div className="service-type">
            <strong>Serviço:</strong> {proposal.header.service}
          </div>
          <div className="client-name">
            <strong>Cliente:</strong> {proposal.header.client}
          </div>
          <div className="proposal-date">
            <strong>Data:</strong> {formatDate()}
          </div>
        </div>
        
        {/* Conteúdo principal - seções */}
        <main className="proposal-content">
          {proposal.sections.map((section) => renderSection(section))}
        </main>
        
        {/* Rodapé */}
        <footer className="proposal-footer">
          <div className="footer-logo">
            <img 
              src="/assets/icone-autha.png" 
              alt={companyInfo.name} 
              className="footer-icon"
              onError={(e) => {
                // Fallback caso a imagem não seja encontrada
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"><circle cx="15" cy="15" r="15" fill="%2338d972"/></svg>';
              }}
            />
          </div>
          <div className="company-details">
            <p className="company-name">{companyInfo.name} | CNPJ: {companyInfo.cnpj}</p>
            <p className="company-address">
              {companyInfo.address.street}, {companyInfo.address.number}, {companyInfo.address.room}, {' '}
              {companyInfo.address.city}-{companyInfo.address.state}
            </p>
            <p className="company-contact">
              {companyInfo.contact.phones.join(' | ')} | {companyInfo.contact.email} | {companyInfo.contact.website}
            </p>
          </div>
          <div className="page-number">
            <span className="current-page"></span>
          </div>
        </footer>
      </div>
      
      <style>{`
        /* Estilos para pré-visualização do PDF */
        .proposal-preview {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 20px;
          background-color: #f0f0f0;
        }
        
        .proposal-container {
          width: var(--page-width);
          min-height: var(--page-height);
          padding: var(--margin-page);
          background-color: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          position: relative;
        }
        
        /* Cabeçalho */
        .proposal-header {
          height: var(--header-height);
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 2px solid var(--color-primary);
          padding-bottom: 10px;
        }
        
        .header-decoration {
          height: 5px;
          background: var(--color-primary);
          background: linear-gradient(90deg, var(--color-primary) 0%, transparent 100%);
          margin-bottom: 25px;
          position: relative;
        }
        
        .header-decoration:after {
          content: '';
          position: absolute;
          right: 0;
          top: 0;
          height: 5px;
          width: 40%;
          background: linear-gradient(90deg, transparent 0%, var(--color-primary) 100%);
        }
        
        .company-logo {
          height: 12mm;
          max-width: 100%;
        }
        
        .header-title {
          font-family: var(--font-family-display);
          color: var(--color-secondary);
          text-align: right;
        }
        
        .header-title h3 {
          font-size: 18px;
          margin-bottom: 5px;
          color: var(--color-primary);
        }
        
        .client-header {
          font-size: 14px;
          font-weight: bold;
          color: var(--color-secondary);
        }
        
        /* Título e subheader */
        .proposal-title {
          font-family: var(--font-family-display);
          font-size: 24px;
          text-align: center;
          margin-bottom: 25px;
          color: var(--color-primary);
          text-transform: uppercase;
          letter-spacing: 1px;
          position: relative;
          padding-bottom: 15px;
        }
        
        .proposal-title:after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: 0;
          width: 80px;
          height: 3px;
          background-color: var(--color-primary);
          transform: translateX(-50%);
        }
        
        .proposal-subheader {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          padding: 12px;
          border-radius: 6px;
          background-color: #f5f5f5;
          font-size: 14px;
        }
        
        .proposal-date {
          text-align: right;
        }
        
        /* Seções */
        .proposal-section {
          margin-bottom: 30px;
        }
        
        .section-title {
          font-family: var(--font-family-display);
          font-size: 18px;
          color: var(--color-primary);
          margin-bottom: 15px;
          padding-bottom: 5px;
          border-bottom: 1px solid var(--color-primary);
        }
        
        .section-content {
          margin-bottom: 20px;
        }
        
        .content-item {
          margin-bottom: 10px;
        }
        
        .text-content {
          font-family: var(--font-family-text);
          text-align: justify;
          margin-bottom: 10px;
        }
        
        /* Placeholder de imagem */
        .placeholder-content {
          background-color: var(--color-neutral-light);
          padding: 20px;
          text-align: center;
          margin: 15px 0;
          border-radius: 4px;
        }
        
        .placeholder-image {
          max-width: 100%;
          height: auto;
          margin-bottom: 10px;
        }
        
        /* Itens com bullet points */
        .section-items {
          list-style-type: disc;
          margin-left: 20px;
          margin-bottom: 20px;
        }
        
        .section-item {
          margin-bottom: 8px;
        }
        
        /* Tabela comparativa */
        .comparison-table-container {
          margin: 20px 0;
          overflow-x: auto;
        }
        
        .comparison-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        
        .comparison-table th,
        .comparison-table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        
        .comparison-table th {
          background-color: var(--color-primary);
          color: white;
          font-weight: bold;
        }
        
        .comparison-table tr:nth-child(even) {
          background-color: #f5f5f5;
        }
        
        /* Opções de investimento */
        .investment-options {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .investment-option {
          flex: 1;
          min-width: 250px;
          padding: 15px;
          border: 1px solid var(--color-neutral-light);
          border-radius: 8px;
          background-color: #fafafa;
        }
        
        .option-title {
          color: var(--color-primary);
          margin-bottom: 10px;
          font-size: 16px;
        }
        
        .option-plans {
          margin-top: 15px;
        }
        
        .option-plan {
          padding: 10px;
          background-color: white;
          border-radius: 4px;
          margin-bottom: 10px;
        }
        
        /* Testimonials */
        .testimonials {
          margin: 20px 0;
        }
        
        .testimonial {
          padding: 15px;
          margin-bottom: 15px;
          background-color: #f5f5f5;
          border-left: 4px solid var(--color-primary);
          font-style: italic;
        }
        
        .testimonial-author {
          font-weight: bold;
          text-align: right;
          margin-top: 10px;
          font-style: normal;
        }
        
        /* Subseções */
        .subsection {
          margin: 15px 0;
          padding: 15px;
          background-color: #fafafa;
          border-radius: 4px;
          border-left: 3px solid var(--color-primary);
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }
        
        .subsection-title {
          color: var(--color-secondary);
          font-size: 16px;
          margin-bottom: 15px;
          padding-bottom: 5px;
          border-bottom: 1px dashed #e0e0e0;
        }
        
        .service {
          margin: 15px 0;
          padding: 15px;
          background-color: white;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease;
        }
        
        .service:hover {
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
        }
        
        .service-name {
          color: var(--color-primary);
          margin-bottom: 12px;
          font-size: 15px;
          display: flex;
          align-items: center;
        }
        
        .service-name:before {
          content: '';
          display: inline-block;
          width: 8px;
          height: 8px;
          background-color: var(--color-primary);
          border-radius: 50%;
          margin-right: 8px;
        }
        
        .service-description, 
        .service-benefit, 
        .service-delivery, 
        .service-consider {
          font-size: 13px;
          margin-bottom: 8px;
          padding-left: 16px;
        }
        
        /* Rodapé */
        .proposal-footer {
          height: var(--footer-height);
          position: absolute;
          bottom: var(--margin-page);
          left: var(--margin-page);
          right: var(--margin-page);
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 2px solid var(--color-primary);
          padding-top: 10px;
          font-size: 10px;
        }
        
        .footer-icon {
          height: 8mm;
          margin-right: 10px;
        }
        
        .company-details {
          flex: 1;
          text-align: center;
        }
        
        .company-name, 
        .company-address, 
        .company-contact {
          margin: 2px 0;
          line-height: 1.4;
        }
        
        .company-name {
          font-weight: bold;
        }
        
        .page-number {
          text-align: right;
          font-weight: bold;
        }
        
        /* Estilo para numeração de páginas dinâmica durante impressão */
        @media print {
          .current-page:after {
            content: counter(page);
          }
          
          .current-page:before {
            content: "Página ";
          }
        }
        
        /* Elementos de assinatura */
        .signature-content {
          margin: 30px 0;
          text-align: center;
        }
        
        .signature-line {
          width: 60%;
          height: 1px;
          background-color: var(--color-secondary);
          margin: 0 auto 10px;
        }
      `}</style>
    </div>
  );
};

export default LayoutProposal; 