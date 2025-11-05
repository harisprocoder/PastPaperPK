
export interface Paper {
  id: string;
  name: string;
  class: string;
  board: string;
  subject: string;
  year: string;
  path: string;
  url?: string;
}

export interface SearchFilters {
  class: string;
  board: string;
  subject: string;
  year: string;
}
