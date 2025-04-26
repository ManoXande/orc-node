export interface ContentItem {
  type: 'text' | 'placeholder' | 'item' | 'date' | 'signature' | 'company_info' | 'validity' | 'slogan';
  content: string;
  image?: string;
  description?: string;
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
  description: string;
  total?: string;
  conditions?: string;
}

export interface InvestmentOption {
  id: string;
  title: string;
  description: string;
  includes?: string;
  plans?: Plan[];
}

export interface Testimonial {
  quote: string;
  author: string;
}

export interface Section {
  id: string;
  title: string;
  content: ContentItem[];
  items?: string[];
  testimonials?: Testimonial[];
  comparison_table?: ComparisonTable;
  investment_options?: InvestmentOption[];
  subsections?: Subsection[];
}

export interface Proposal {
  title: string;
  sections: Section[];
}

export interface CompanyInfo {
  name: string;
  address: {
    street: string;
    number: string;
    room?: string;
    city: string;
    state: string;
  };
  contact: {
    phones: string[];
    email: string;
    website: string;
  };
  signerName: string;
  signerRole: string;
}
