import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Proposal, Section, ContentItem } from '../types/proposal';

interface FormBuilderProps {
  initialData?: Proposal;
  onFormSubmit: (data: Proposal) => void;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ initialData, onFormSubmit }) => {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const { control, handleSubmit, setValue, reset } = useForm<Proposal>();
  const [jsonInput, setJsonInput] = useState<string>('');

  // Estado para controlar se está carregando arquivo
  const [isLoading, setIsLoading] = useState(false);
  
  // Efeito para carregar dados iniciais se fornecidos
  useEffect(() => {
    if (initialData) {
      setProposal(initialData);
      reset(initialData);
    } else {
      // Estrutura básica de uma proposta vazia
      const emptyProposal: Proposal = {
        title: '',
        header: {
          service: '',
          client: ''
        },
        sections: []
      };
      setProposal(emptyProposal);
      reset(emptyProposal);
    }
  }, [initialData, reset]);

  // Função para carregar JSON do arquivo
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          setProposal(json);
          reset(json);
          setIsLoading(false);
        } catch (error) {
          console.error('Erro ao processar o arquivo JSON:', error);
          alert('Erro ao processar o arquivo. Verifique se é um JSON válido.');
          setIsLoading(false);
        }
      };
      reader.readAsText(file);
    }
  };

  // Função para processar o JSON colado
  const handleJsonPaste = () => {
    if (!jsonInput.trim()) {
      alert('Por favor, cole um JSON válido no campo de texto.');
      return;
    }

    try {
      setIsLoading(true);
      const json = JSON.parse(jsonInput);
      setProposal(json);
      reset(json);
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao processar o JSON colado:', error);
      alert('Erro ao processar o JSON. Verifique se é um formato válido.');
      setIsLoading(false);
    }
  };

  // Função para renderizar campos de conteúdo baseados no tipo
  const renderContentField = (
    content: ContentItem,
    sectionIndex: number,
    contentIndex: number
  ) => {
    const fieldName = `sections.${sectionIndex}.content.${contentIndex}.content`;
    
    switch (content.type) {
      case 'placeholder':
        return (
          <div className="form-field">
            <label>Imagem/Placeholder:</label>
            <Controller
              name={fieldName}
              control={control}
              defaultValue={content.content}
              render={({ field }) => (
                <div className="file-upload-field">
                  <textarea
                    {...field}
                    rows={3}
                    placeholder="Descrição do placeholder ou caminho da imagem"
                  />
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const base64Data = event.target?.result as string;
                          field.onChange(base64Data);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              )}
            />
          </div>
        );
      
      case 'text':
      default:
        return (
          <div className="form-field">
            <label>Texto:</label>
            <Controller
              name={fieldName}
              control={control}
              defaultValue={content.content}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={5}
                  placeholder="Digite o conteúdo textual"
                />
              )}
            />
          </div>
        );
    }
  };

  // Função para renderizar seção
  const renderSectionFields = (section: Section, index: number) => {
    return (
      <div key={`section-${index}`} className="section-form">
        <h3>
          <Controller
            name={`sections.${index}.title`}
            control={control}
            defaultValue={section.title}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Título da Seção"
                className="section-title-input"
              />
            )}
          />
        </h3>

        {section.content && (
          <div className="content-fields">
            <h4>Conteúdo</h4>
            {section.content.map((contentItem, contentIndex) => (
              <div key={`content-${index}-${contentIndex}`} className="content-item">
                {renderContentField(contentItem, index, contentIndex)}
              </div>
            ))}
          </div>
        )}

        {/* Renderizar outros tipos de dados da seção (subsections, tabelas, etc) */}
        {section.subsections && (
          <div className="subsections">
            <h4>Subseções</h4>
            {section.subsections.map((subsection, subIndex) => (
              <div key={`subsection-${index}-${subIndex}`} className="subsection-item">
                <h5>
                  <Controller
                    name={`sections.${index}.subsections.${subIndex}.title`}
                    control={control}
                    defaultValue={subsection.title}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="Título da Subseção"
                        className="subsection-title-input"
                      />
                    )}
                  />
                </h5>
                
                {/* Renderizar serviços e conteúdo da subseção conforme necessário */}
                {/* Por brevidade, não estou implementando todos os detalhes aqui */}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Se não houver proposta carregada ainda
  if (!proposal) {
    return (
      <div className="form-loader">
        <h2>Carregue ou cole um JSON de proposta</h2>
        
        <div className="json-input-container">
          <textarea 
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Cole o conteúdo JSON aqui..."
            rows={10}
            className="json-input"
          />
          <button 
            onClick={handleJsonPaste}
            disabled={isLoading}
            className="json-paste-button"
          >
            Processar JSON
          </button>
        </div>
        
        <div className="or-divider">OU</div>
        
        <input 
          type="file" 
          accept=".json" 
          onChange={handleFileUpload}
          disabled={isLoading}
          id="file-upload-initial"
        />
        <label htmlFor="file-upload-initial" className="file-upload-label">
          Selecionar arquivo JSON
        </label>
        
        {isLoading && <p>Carregando...</p>}
      </div>
    );
  }

  // Garantir que proposal.header existe
  const header = proposal.header || { service: '', client: '' };

  return (
    <div className="form-builder">
      <div className="form-header">
        <h2>Editor de Proposta</h2>
        <div className="form-actions">
          <input 
            type="file" 
            accept=".json" 
            onChange={handleFileUpload}
            id="json-upload"
            className="file-input"
          />
          <label htmlFor="json-upload" className="file-label">
            Carregar JSON
          </label>
          <button 
            onClick={handleSubmit(onFormSubmit)}
            className="submit-button"
          >
            Gerar PDF
          </button>
        </div>
      </div>

      <div className="form-container">
        <div className="proposal-header">
          <div className="form-field">
            <label>Título da Proposta:</label>
            <Controller
              name="title"
              control={control}
              defaultValue={proposal.title || ''}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="Título da Proposta"
                />
              )}
            />
          </div>

          <div className="header-fields">
            <div className="form-field">
              <label>Serviço Principal:</label>
              <Controller
                name="header.service"
                control={control}
                defaultValue={header.service || ''}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Nome do Serviço"
                  />
                )}
              />
            </div>
            <div className="form-field">
              <label>Cliente:</label>
              <Controller
                name="header.client"
                control={control}
                defaultValue={header.client || ''}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Nome do Cliente"
                  />
                )}
              />
            </div>
          </div>
        </div>

        <div className="sections">
          {proposal.sections && proposal.sections.map((section, index) => renderSectionFields(section, index))}
        </div>
      </div>

      <style>{`
        .form-builder {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .form-actions {
          display: flex;
          gap: 10px;
        }
        
        .file-input {
          display: none;
        }
        
        .file-label {
          display: inline-block;
          padding: 8px 16px;
          background-color: #f0f0f0;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .file-label:hover {
          background-color: #e0e0e0;
        }
        
        .submit-button {
          background: linear-gradient(135deg, #30b86c, #38d972);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .section-form {
          margin-bottom: 30px;
          padding: 20px;
          border-radius: 8px;
          background-color: #f9f9f9;
        }
        
        .section-title-input {
          width: 100%;
          font-size: 1.2em;
          padding: 8px;
          margin-bottom: 15px;
        }
        
        .content-fields {
          margin-top: 15px;
        }
        
        .content-item {
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          background-color: white;
        }
        
        .form-field {
          margin-bottom: 15px;
        }
        
        .form-field label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        
        .header-fields {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        
        .file-upload-field {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .form-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 500px;
          border: 2px dashed #e0e0e0;
          border-radius: 8px;
          gap: 20px;
          padding: 20px;
        }
        
        .json-input-container {
          width: 100%;
          max-width: 800px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .json-input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-family: monospace;
          resize: vertical;
        }
        
        .json-paste-button {
          background-color: #38d972;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        
        .or-divider {
          margin: 15px 0;
          font-weight: bold;
          color: #777;
          position: relative;
          text-align: center;
          width: 100%;
        }
        
        .or-divider:before,
        .or-divider:after {
          content: "";
          position: absolute;
          top: 50%;
          width: 40%;
          height: 1px;
          background-color: #e0e0e0;
        }
        
        .or-divider:before {
          left: 0;
        }
        
        .or-divider:after {
          right: 0;
        }
        
        #file-upload-initial {
          display: none;
        }
        
        .file-upload-label {
          display: inline-block;
          padding: 10px 20px;
          background-color: #f0f0f0;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .file-upload-label:hover {
          background-color: #e0e0e0;
        }
      `}</style>
    </div>
  );
};

export default FormBuilder; 