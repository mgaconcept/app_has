export interface RawProduct {
  descricao: string;
  codigo: number;
  problema: string;
  area_macro: string;
  componente: string;
  subcomponente: string;
  material_superficie: string;
  tipo_produto: string;
  etapa: string;
  intensidade: string;
}

export interface Product {
  id: string;
  nome: string;
  marca: string;
  descricaoCurta: string;
  tags: string[];
  categoriaTags: {
    problema: string[];
    area: string[];
    material: string[];
    etapa: string[];
    intensidade: string[];
  };
}

export interface RankedProduct extends Product {
  score: number;
  matchReasons: MatchReason[];
}

export interface MatchReason {
  categoria: string;
  tag: string;
  peso: number;
}

export type CategoryKey = 'problema' | 'area' | 'material' | 'etapa' | 'intensidade';

export interface CategoryConfig {
  key: CategoryKey;
  label: string;
  peso: number;
  icon: string;
}

export const CATEGORY_CONFIGS: CategoryConfig[] = [
  { key: 'problema', label: 'Problema', peso: 5, icon: '🔧' },
  { key: 'area', label: 'Área', peso: 3, icon: '📍' },
  { key: 'material', label: 'Material', peso: 2, icon: '🧱' },
  { key: 'etapa', label: 'Etapa', peso: 2, icon: '📋' },
  { key: 'intensidade', label: 'Intensidade', peso: 1, icon: '⚡' },
];

export interface UserSelection {
  problema: Set<string>;
  area: Set<string>;
  material: Set<string>;
  etapa: Set<string>;
  intensidade: Set<string>;
}
