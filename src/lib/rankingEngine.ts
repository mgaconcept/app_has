import { 
  Product, 
  RankedProduct, 
  MatchReason, 
  UserSelection, 
  CATEGORY_CONFIGS,
  CategoryKey 
} from '@/types/product';

export interface RankingResult {
  products: RankedProduct[];
  maxPossibleScore: number;
}

/**
 * Calcula o score raw de um produto baseado nas seleções do usuário
 */
export function calculateRawScore(
  product: Product,
  selections: UserSelection
): { score: number; matches: MatchReason[] } {
  let score = 0;
  const matches: MatchReason[] = [];

  for (const config of CATEGORY_CONFIGS) {
    const selectedTags = selections[config.key];
    const productTags = product.categoriaTags[config.key];

    for (const tag of productTags) {
      if (selectedTags.has(tag)) {
        score += config.peso;
        matches.push({
          categoria: config.label,
          tag,
          peso: config.peso,
        });
      }
    }
  }

  return { score, matches };
}

/**
 * Calcula o score máximo possível dado as seleções
 */
export function calculateMaxPossibleScore(selections: UserSelection): number {
  let maxScore = 0;

  for (const config of CATEGORY_CONFIGS) {
    const selectedCount = selections[config.key].size;
    maxScore += selectedCount * config.peso;
  }

  return maxScore;
}

/**
 * Normaliza o score para 0-100
 */
export function normalizeScore(rawScore: number, maxPossible: number): number {
  if (maxPossible === 0) return 0;
  return Math.round((rawScore / maxPossible) * 100);
}

/**
 * Função de comparação para ordenar produtos
 * Critérios: 1) Score descendente, 2) Número de matches descendente, 3) Nome A-Z
 */
function compareProducts(a: RankedProduct, b: RankedProduct): number {
  // Primeiro: score descendente
  if (b.score !== a.score) {
    return b.score - a.score;
  }
  
  // Segundo: número de matches descendente
  if (b.matchReasons.length !== a.matchReasons.length) {
    return b.matchReasons.length - a.matchReasons.length;
  }
  
  // Terceiro: nome A-Z
  return a.nome.localeCompare(b.nome, 'pt-BR');
}

/**
 * Ordena os match reasons por peso (descendente)
 */
function sortMatchReasons(matches: MatchReason[]): MatchReason[] {
  return [...matches].sort((a, b) => b.peso - a.peso);
}

/**
 * Motor de ranking principal
 */
export function rankProducts(
  products: Product[],
  selections: UserSelection
): RankingResult {
  const maxPossibleScore = calculateMaxPossibleScore(selections);
  
  // Se não há seleções, retorna todos com score 0
  if (maxPossibleScore === 0) {
    return {
      products: products.map(p => ({
        ...p,
        score: 0,
        matchReasons: [],
      })).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')),
      maxPossibleScore: 0,
    };
  }

  const rankedProducts: RankedProduct[] = products.map(product => {
    const { score: rawScore, matches } = calculateRawScore(product, selections);
    const normalizedScore = normalizeScore(rawScore, maxPossibleScore);
    
    return {
      ...product,
      score: normalizedScore,
      matchReasons: sortMatchReasons(matches).slice(0, 3), // Top 3 reasons
    };
  });

  // Filtrar apenas produtos com pelo menos 1 match e ordenar
  const filteredAndSorted = rankedProducts
    .filter(p => p.score > 0)
    .sort(compareProducts);

  return {
    products: filteredAndSorted,
    maxPossibleScore,
  };
}

/**
 * Obtém todas as tags únicas para uma categoria
 */
export function getUniqueTags(
  products: Product[],
  category: CategoryKey
): string[] {
  const tagsSet = new Set<string>();
  
  for (const product of products) {
    for (const tag of product.categoriaTags[category]) {
      tagsSet.add(tag);
    }
  }
  
  return Array.from(tagsSet).sort((a, b) => 
    a.localeCompare(b, 'pt-BR')
  );
}

/**
 * Formata uma tag para exibição
 */
export function formatTagLabel(tag: string): string {
  return tag
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
