import React from 'react';
import { Proposal, CompanyInfo } from '../types/proposal';
import { ProposalSection } from './proposal/ProposalSection';
import '../styles/variables.css';
import '../styles/global.css';

interface LayoutProposalProps {
  proposal: Proposal;
  companyInfo: CompanyInfo;
}

const formatDate = (date: Date = new Date()): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

const LayoutProposal: React.FC<LayoutProposalProps> = ({ proposal, companyInfo }) => {
  return (
    <div className="proposal-preview" data-testid="proposal-document">
      <div className="proposal-container">
        {/* Título principal */}
        <h1 className="proposal-title">{proposal.title}</h1>
        
        {/* Data da proposta */}
        <div className="proposal-date">
          <strong>Data:</strong> {formatDate()}
        </div>
        
        {/* Conteúdo principal - seções */}
        <main className="proposal-content">
          {proposal.sections.map((section, index) => (
            <ProposalSection key={index} section={section} index={index} />
          ))}
        </main>
        
        {/* Informações da empresa e assinatura */}
        <footer className="proposal-footer">
          <div className="company-info">
            <h3>{companyInfo.name}</h3>
            <p>
              {companyInfo.address.street}, {companyInfo.address.number}
              {companyInfo.address.room && `, ${companyInfo.address.room}`}<br />
              {companyInfo.address.city} - {companyInfo.address.state}
            </p>
            <p>
              {companyInfo.contact.phones.join(' / ')}<br />
              {companyInfo.contact.email}<br />
              {companyInfo.contact.website}
            </p>
          </div>
          
          <div className="signature-area">
            <div className="signature-line"></div>
            <p className="signature-name">{companyInfo.signerName}</p>
            <p className="signature-role">{companyInfo.signerRole}</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LayoutProposal;
