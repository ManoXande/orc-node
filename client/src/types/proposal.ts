export interface ProposalHeader {
  service: string;
  client: string;
}

export interface ContentItem {
  type: string;
  content: string;
  subitems?: string[];
}

export interface Service {
  name: string;
  what_we_will_do?: string;
  your_benefit?: string;
  what_you_will_receive?: string;
  why_consider?: string;
}

export interface Subsection {
  id: string;
  title: string;
  content?: ContentItem[];
  services?: Service[];
  note?: string;
}

export interface ComparisonTable {
  headers: string[];
  rows: string[][];
}

export interface Plan {
  name: string;
  total: string;
  conditions: string;
}

export interface InvestmentOption {
  id: number;
  title: string;
  description: string;
  includes?: string;
  plans?: Plan[];
}

export interface Testimonial {
  author: string;
  quote: string;
}

export interface Section {
  id: number;
  title: string;
  content?: ContentItem[];
  subsections?: Subsection[];
  comparison_table?: ComparisonTable;
  investment_options?: InvestmentOption[];
  testimonials?: Testimonial[];
  items?: string[];
  note?: string;
}

export interface Proposal {
  title: string;
  header: ProposalHeader;
  sections: Section[];
}

export interface CompanyInfo {
  name: string;
  cnpj: string;
  address: {
    street: string;
    number: string;
    room: string;
    city: string;
    state: string;
  };
  contact: {
    phones: string[];
    email: string;
    website: string;
  };
} 