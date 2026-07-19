export interface Page { id: string; title?: string | null; slug?: string | null; blocks?: any[] | null; meta?: { title?: string | null; description?: string | null } | null; requiresAuth?: boolean | null; updatedAt?: string | null; }
export interface Post { id: string; slug?: string | null; updatedAt?: string | null; }
export interface Portfolio { id: string; slug?: string | null; updatedAt?: string | null; }
export interface Media { id: string; url?: string | null; alt?: string | null; width?: number | null; height?: number | null; }
export interface SeoDefault { fallbackTitle?: string | null; fallbackDescription?: string | null; defaultOgImage?: Media | string | null; }
export interface SiteSetting { enableCookieBanner?: boolean | null; cookieBannerText?: string | null; cookiePolicyUrl?: string | null; umamiWebsiteId?: string | null; umamiScriptUrl?: string | null; maintenanceMode?: boolean | null; siteName?: string | null; logo?: Media | string | null; }
export interface Analytic { gaId?: string | null; gtmId?: string | null; }
export interface Footer {
  id: string;
  copyrightText?: string | null;
  columns?: {
    id?: string;
    title?: string;
    links?: {
      id?: string;
      link: {
        type: 'reference' | 'custom';
        label: string;
        reference?: { relationTo: 'pages'; value: string | Page } | null;
        url?: string | null;
        openInNewTab?: boolean | null;
      };
    }[] | null;
  }[] | null;
}
export interface Navigation {
  id: string;
  links?: {
    id?: string;
    link: {
      type: 'reference' | 'custom';
      label: string;
      reference?: { relationTo: 'pages'; value: string | Page } | null;
      url?: string | null;
      openInNewTab?: boolean | null;
    };
  }[] | null;
}
export interface SocialLinks { id: string; links?: { id?: string; url: string; platform: string }[] | null; }
