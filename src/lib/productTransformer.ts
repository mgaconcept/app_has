import { RawProduct, Product } from '@/types/product';

function parseMultiValue(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split('|')
    .map(v => v.trim().toLowerCase())
    .filter(v => v.length > 0);
}

function extractMarca(descricao: string): string {
  const marcaMatch = descricao.match(/\s-\s([A-Z]+)$/);
  return marcaMatch ? marcaMatch[1] : 'Genérico';
}

function formatNome(descricao: string): string {
  // Remove a marca do final e formata o nome
  const semMarca = descricao.replace(/\s-\s[A-Z]+$/, '');
  // Capitaliza primeira letra de cada palavra importante
  return semMarca
    .split(' ')
    .map(word => {
      if (word.length <= 2) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

function createShortDescription(product: RawProduct): string {
  const tipo = product.tipo_produto?.replace(/_/g, ' ') || '';
  const area = product.area_macro?.split('|')[0] || '';
  return `${tipo} para ${area}`.trim();
}

export function transformProduct(raw: RawProduct): Product {
  const allTags = [
    ...parseMultiValue(raw.problema),
    ...parseMultiValue(raw.area_macro),
    ...parseMultiValue(raw.material_superficie),
    ...parseMultiValue(raw.etapa),
    ...parseMultiValue(raw.intensidade),
  ];

  return {
    id: String(raw.codigo),
    nome: formatNome(raw.descricao),
    marca: extractMarca(raw.descricao),
    descricaoCurta: createShortDescription(raw),
    tags: [...new Set(allTags)],
    categoriaTags: {
      problema: parseMultiValue(raw.problema),
      area: parseMultiValue(raw.area_macro),
      material: parseMultiValue(raw.material_superficie),
      etapa: parseMultiValue(raw.etapa),
      intensidade: parseMultiValue(raw.intensidade),
    },
  };
}

export function transformProducts(rawProducts: RawProduct[]): Product[] {
  return rawProducts.map(transformProduct);
}
