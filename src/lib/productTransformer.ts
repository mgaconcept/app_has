import { RawProduct, Product } from '@/types/product';

function parseMultiValue(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split('|')
    .map(v => v.trim().toLowerCase())
    .filter(v => v.length > 0);
}

function splitDescricao(descricao?: string | null) {
  const d = (typeof descricao === "string" ? descricao : "").trim();
  if (!d) return { nome: "", marca: "Genérico" };

  const sep = " - ";
  const idx = d.lastIndexOf(sep);

  // se não tiver " - " no fim, não dá pra inferir marca com segurança
  if (idx === -1) return { nome: d, marca: "Genérico" };

  const nome = d.slice(0, idx).trim();
  const marca = d.slice(idx + sep.length).trim() || "Genérico";
  return { nome, marca };
}

export function extractMarca(descricao?: string | null): string {
  return splitDescricao(descricao).marca;
}

export function formatNome(descricao?: string | null): string {
  return splitDescricao(descricao).nome;
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
    nome: formatNome(raw.descricao ?? ''),
    marca: extractMarca(raw.descricao ?? ''),
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
