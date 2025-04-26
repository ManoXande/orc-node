import React from 'react';
import { Section } from '../../types/proposal';
import { InvestmentOption } from './InvestmentOption';
import { ComparisonTable } from './ComparisonTable';
import '../../styles/components/proposal-section.css';

interface ProposalSectionProps {
  section: Section;
  index: number;
}

export const ProposalSection: React.FC<ProposalSectionProps> = React.memo(({ section, index }) => {
  const renderContentItem = (item: any) => {
    switch (item.type) {
      case 'text':
        return <p className="text-content">{item.content}</p>;
      
      case 'placeholder':
        return (
          <div className="placeholder-content">
            <img src={item.image} alt={item.description} className="placeholder-image" />
            <p>{item.description}</p>
          </div>
        );
      
      case 'items':
        return (
          <ul className="section-items">
            {item.items.map((listItem: string, idx: number) => (
              <li key={idx} className="section-item">{listItem}</li>
            ))}
          </ul>
        );
      
      case 'comparison':
        return <ComparisonTable headers={item.headers} rows={item.rows} />;
      
      case 'investment':
        return (
          <div className="investment-options">
            {item.options.map((option: any, idx: number) => (
              <InvestmentOption key={idx} option={option} />
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div id={`section-${index}`} className="proposal-section" data-testid="proposal-section">
      <h2 className="section-title">
        {index + 1}. {section.title}
      </h2>
      
      <div className="section-content">
        {section.content.map((item, idx) => (
          <div key={idx} className="content-item">
            {renderContentItem(item)}
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .proposal-section {
          margin-bottom: var(--spacing-xl);
          page-break-before: always;
        }
        
        .proposal-section:first-child {
          page-break-before: avoid;
        }
        
        .section-title {
          font-family: var(--font-family-display);
          font-size: var(--font-size-xl);
          color: var(--color-primary);
          margin-bottom: var(--spacing-lg);
          padding-bottom: var(--spacing-sm);
          border-bottom: 2px solid var(--color-primary);
        }
        
        .section-content {
          margin-bottom: var(--spacing-lg);
        }
        
        .content-item {
          margin-bottom: var(--spacing-md);
        }
        
        .text-content {
          font-family: var(--font-family-text);
          font-size: var(--font-size-md);
          line-height: 1.6;
          color: var(--color-text);
          text-align: justify;
          margin-bottom: var(--spacing-md);
        }
        
        .placeholder-content {
          background-color: var(--color-background-light);
          padding: var(--spacing-lg);
          text-align: center;
          margin: var(--spacing-md) 0;
          border-radius: var(--border-radius-md);
        }
        
        .placeholder-image {
          max-width: 100%;
          height: auto;
          margin-bottom: var(--spacing-md);
        }
        
        .section-items {
          list-style-type: disc;
          margin-left: var(--spacing-xl);
          margin-bottom: var(--spacing-lg);
        }
        
        .section-item {
          margin-bottom: var(--spacing-sm);
          color: var(--color-text);
          font-size: var(--font-size-md);
        }
        
        .investment-options {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }
        
        @media print {
          .proposal-section {
            break-before: always;
          }
          
          .proposal-section:first-child {
            break-before: avoid;
          }
          
          .section-content {
            break-inside: auto;
          }
          
          .content-item {
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}); 