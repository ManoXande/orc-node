import React from 'react';
import { InvestmentOption as InvestmentOptionType } from '../../types/proposal';
import '../../styles/components/investment-option.css';

interface InvestmentOptionProps {
  option: InvestmentOptionType;
}

export const InvestmentOption: React.FC<InvestmentOptionProps> = React.memo(({ option }) => {
  return (
    <div className="investment-option" data-testid="investment-option">
      <h3 className="option-title">{option.title}</h3>
      <div className="option-description">{option.description}</div>
      
      {option.plans && (
        <div className="option-plans">
          {option.plans.map((plan, index) => (
            <div key={index} className="option-plan">
              <strong>{plan.name}</strong>
              <p>{plan.description}</p>
              {plan.total && <div className="plan-price">{plan.total}</div>}
            </div>
          ))}
        </div>
      )}
      
      <style jsx>{`
        .investment-option {
          flex: 1;
          min-width: 250px;
          padding: var(--spacing-lg);
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-md);
          background-color: var(--color-background);
          transition: var(--transition-normal);
          page-break-inside: avoid;
        }
        
        .option-title {
          color: var(--color-primary);
          margin-bottom: var(--spacing-md);
          font-size: var(--font-size-lg);
          font-family: var(--font-family-display);
        }
        
        .option-description {
          color: var(--color-text);
          margin-bottom: var(--spacing-lg);
          font-size: var(--font-size-md);
        }
        
        .option-plans {
          margin-top: var(--spacing-lg);
        }
        
        .option-plan {
          padding: var(--spacing-md);
          background-color: var(--color-background-light);
          border-radius: var(--border-radius-sm);
          margin-bottom: var(--spacing-sm);
        }
        
        .plan-price {
          margin-top: var(--spacing-sm);
          color: var(--color-primary);
          font-weight: bold;
          font-size: var(--font-size-lg);
        }
        
        @media print {
          .investment-option {
            break-inside: avoid;
            border: 1px solid var(--color-border);
            box-shadow: none;
          }
        }
      `}</style>
    </div>
  );
}); 