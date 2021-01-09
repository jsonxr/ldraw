import { Category } from './Category';

export interface MetaData {
  file?: string;
  description?: string;
  author?: string;
  type?: string;
  license?: string;
  help?: string[];
  keywords?: string[];
  category?: Category;
  theme?: string;
  history?: string[];
  update?: string;
}
