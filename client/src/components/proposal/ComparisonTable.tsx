import React from 'react';
import '../../styles/components/comparison-table.css';

interface ComparisonTableProps {
  headers: string[];
  rows: string[][];
}

export const ComparisonTable: React.FC<ComparisonTableProps> = React.memo(({ headers, rows }) => {
  return (
    <div className="comparison-table-container" data-testid="comparison-table">
      <table className="comparison-table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      <style jsx>{`
        .comparison-table-container {
          margin: var(--spacing-lg) 0;
          overflow-x: auto;
          page-break-inside: avoid;
        }
        
        .comparison-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: var(--spacing-lg);
          font-family: var(--font-family-text);
        }
        
        .comparison-table th,
        .comparison-table td {
          border: 1px solid var(--color-border);
          padding: var(--spacing-md);
          text-align: left;
        }
        
        .comparison-table th {
          background-color: var(--color-primary);
          color: var(--color-background);
          font-weight: bold;
          font-size: var(--font-size-sm);
        }
        
        .comparison-table tr:nth-child(even) {
          background-color: var(--color-background-light);
        }
        
        .comparison-table td {
          font-size: var(--font-size-sm);
          color: var(--color-text);
        }
        
        @media print {
          .comparison-table-container {
            break-inside: avoid;
            margin: var(--spacing-lg) 0;
          }
          
          .comparison-table th {
            background-color: var(--color-primary) !important;
            color: var(--color-background) !important;
            -webkit-print-color-adjust: exact;
          }
          
          .comparison-table tr:nth-child(even) {
            background-color: var(--color-background-light) !important;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}); 