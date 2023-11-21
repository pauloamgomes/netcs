import { Maybe } from "~generated/graphql";

export interface INavLink {
  id: string;
  label: string;
  href: string;
  icon?: string;
}

export interface IImage {
  id: string;
  title: string;
  description: string;
  url?: Maybe<string>;
  width?: number;
  height?: number;
}

export interface IRichText {
  document?: any;
  links?: any;
  blocks?: Record<string, any>;
}
