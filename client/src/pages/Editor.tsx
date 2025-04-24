import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import FormBuilder from '../components/FormBuilder';
import LayoutProposal from '../components/LayoutProposal';
import { Proposal, CompanyInfo } from '../types/proposal';

// Importar a proposta de exemplo diretamente
import sampleProposalData from '../data/prop1.json';

import '../styles/theme.css';

// Função auxiliar para verificar se o storage está disponível de forma segura
const isStorageAvailable = (type: 'localStorage' | 'sessionStorage') => {
  if (typeof window === 'undefined') return false;
  
  try {
    // Try using a test item
    const storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    // Handle any possible exceptions:
    // - SecurityError: The user has disabled storage
    // - QuotaExceededError: Storage is full
    // - Any other error
    console.warn(`${type} não está disponível:`, e);
    return false;
  }
};

// Wrapper seguro para operações de localStorage
const safeStorage = {
  getItem: (key: string, defaultValue: any = null): any => {
    if (!isStorageAvailable('localStorage')) return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (e) {
      console.warn(`Erro ao ler ${key} do localStorage:`, e);
      return defaultValue;
    }
  },
  
  setItem: (key: string, value: any): boolean => {
    if (!isStorageAvailable('localStorage')) return false;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn(`Erro ao salvar ${key} no localStorage:`, e);
      return false;
    }
  }
};

const Editor: React.FC = () => {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  // Carregar os dados da empresa ao iniciar
  useEffect(() => {
    const loadCompanyInfo = async () => {
      try {
        const response = await axios.get('/api/company-info');
        setCompanyInfo(response.data);
        
        // Salvar no localStorage de forma segura
        safeStorage.setItem('companyInfo', response.data);
      } catch (error) {
        console.error('Erro ao carregar informações da empresa:', error);
        
        // Tentar recuperar do localStorage
        const storedInfo = safeStorage.getItem('companyInfo');
        if (storedInfo) {
          setCompanyInfo(storedInfo);
          return;
        }
        
        // Caso não consiga carregar do servidor nem do localStorage, usar dados fictícios
        setCompanyInfo({
          name: 'Autha Engenharia e Mapeamento',
          cnpj: '38.489.344/0001-89',
          address: {
            street: 'Av. Fernando Machado',
            number: '203',
            room: 'Sala 01',
            city: 'Chapecó',
            state: 'SC'
          },
          contact: {
            phones: ['(49) 99971-9388', '(49) 98891-7779'],
            email: 'engenharia@autha.com.br',
            website: 'www.autha.com.br'
          }
        });
      }
    };

    // Carregar ou definir uma proposta de exemplo para iniciar
    const loadSampleProposal = async () => {
      try {
        // Tentar recuperar do localStorage primeiro
        const storedProposal = safeStorage.getItem('lastProposal');
        if (storedProposal) {
          setProposal(storedProposal);
          return;
        }

        // Usar proposta de exemplo pré-carregada
        setProposal(sampleProposalData as Proposal);
        
        // Salvar no localStorage
        safeStorage.setItem('lastProposal', sampleProposalData);
      } catch (error) {
        console.error('Erro ao carregar proposta de exemplo:', error);
        // Definir uma proposta vazia
        setProposal({
          title: 'PROPOSTA DE SOLUÇÃO ESTRATÉGICA PERSONALIZADA',
          header: {
            service: 'Insira o serviço principal',
            client: 'Nome do Cliente'
          },
          sections: []
        });
      }
    };

    loadCompanyInfo();
    loadSampleProposal();
  }, []);

  // Função chamada quando o formulário é enviado
  const handleFormSubmit = async (data: Proposal) => {
    setIsLoading(true);
    setProposal(data); // Atualiza o preview com os dados do formulário
    
    // Salvar no localStorage de forma segura
    safeStorage.setItem('lastProposal', data);

    try {
      // Enviar dados para o servidor para gerar o PDF
      console.log('Enviando dados para geração do PDF:', data);
      const response = await axios.post('/api/proposal', data, {
        responseType: 'blob', // Importante para receber o PDF como blob
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Verificar se a resposta é um PDF
      if (response.headers['content-type'] !== 'application/pdf') {
        throw new Error('Resposta do servidor não é um PDF válido');
      }

      // Criar um link para download do PDF
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `proposta-${data.header.client.replace(/\s+/g, '-').toLowerCase()}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Limpar recursos
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        link.remove();
      }, 100);

      toast.success('PDF gerado com sucesso!');
    } catch (error: any) {
      console.error('Erro detalhado ao gerar o PDF:', error);
      
      // Tentar extrair mensagem de erro mais detalhada
      let errorMessage = 'Erro ao gerar o PDF. Tente novamente.';
      if (error.response) {
        // Se o servidor retornou um erro
        if (error.response.data instanceof Blob) {
          // Se a resposta é um Blob, tentar ler como texto
          const text = await error.response.data.text();
          try {
            const errorData = JSON.parse(text);
            errorMessage = errorData.details || errorData.error || errorMessage;
          } catch (e) {
            errorMessage = text || errorMessage;
          }
        } else {
          errorMessage = error.response.data?.details || error.response.data?.error || errorMessage;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Se os dados ainda não foram carregados
  if (!proposal || !companyInfo) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="editor-container">
      <div className="editor-header">
        <div className="logo-container">
          <img 
            src="/assets/logomarca-autha.png" 
            alt="Autha Engenharia e Mapeamento" 
            className="logo"
            onError={(e) => {
              // Fallback para caso a imagem não seja encontrada
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="50"><rect width="200" height="50" fill="%2338d972"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="20" fill="white">AUTHA</text></svg>';
            }}
          />
        </div>
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => setActiveTab('form')}
          >
            Editor de Formulário
          </button>
          <button 
            className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            Pré-visualização
          </button>
        </div>
      </div>

      <div className="editor-content">
        {activeTab === 'form' ? (
          <div className="form-tab">
            <FormBuilder 
              initialData={proposal} 
              onFormSubmit={handleFormSubmit} 
            />
          </div>
        ) : (
          <div className="preview-tab">
            <div className="preview-actions">
              <button 
                className="generate-button"
                onClick={() => handleFormSubmit(proposal)}
                disabled={isLoading}
              >
                {isLoading ? 'Gerando PDF...' : 'Gerar PDF'}
              </button>
            </div>
            <LayoutProposal proposal={proposal} companyInfo={companyInfo} />
          </div>
        )}
      </div>

      <ToastContainer position="bottom-right" />

      <style>{`
        .editor-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background-color: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .logo-container {
          flex: 1;
        }
        
        .logo {
          height: 40px;
        }
        
        .tabs {
          display: flex;
          gap: 10px;
        }
        
        .tab {
          padding: 10px 20px;
          border: none;
          background: none;
          cursor: pointer;
          font-family: var(--font-family-display);
          font-weight: 500;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }
        
        .tab.active {
          border-bottom: 2px solid var(--color-primary);
          color: var(--color-primary);
        }
        
        .editor-content {
          flex: 1;
          display: flex;
          background-color: #f5f5f5;
        }
        
        .form-tab, .preview-tab {
          flex: 1;
          overflow: auto;
          padding: 20px;
        }
        
        .preview-actions {
          text-align: right;
          margin-bottom: 20px;
        }
        
        .generate-button {
          padding: 10px 20px;
          background-color: var(--color-primary);
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .generate-button:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        
        .generate-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
          transform: none;
        }
        
        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          font-family: var(--font-family-display);
          font-size: 20px;
          color: var(--color-secondary);
        }
      `}</style>
    </div>
  );
}

export default Editor; 