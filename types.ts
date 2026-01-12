
export type SectionType = 'hero' | 'features' | 'pricing' | 'testimonials' | 'stats' | 'faq' | 'cta' | 'footer' | 'navbar';

export interface WebsiteSection {
  id: string;
  type: SectionType;
  title: string;
  content: any;
  html: string;
}

export interface WebsiteMetadata {
  title: string;
  description: string;
  primaryColor: string;
  fontFamily: string;
}

export interface WebsiteState {
  _id?: string;
  metadata: WebsiteMetadata;
  sections: WebsiteSection[];
  createdAt?: string;
}

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';
