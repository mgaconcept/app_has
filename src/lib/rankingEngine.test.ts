import { describe, it, expect } from 'vitest';
import {
  calculateRawScore,
  calculateMaxPossibleScore,
  normalizeScore,
  rankProducts,
  formatTagLabel,
} from './rankingEngine';
import { Product, UserSelection } from '@/types/product';

// Produtos de teste
const createTestProduct = (overrides: Partial<Product> = {}): Product => ({
  id: '1',
  nome: 'Produto Teste',
  marca: 'Marca Teste',
  descricaoCurta: 'Descrição curta',
  tags: ['sujeira_leve', 'externo', 'pintura_verniz', 'lavagem', 'leve'],
  categoriaTags: {
    problema: ['sujeira_leve'],
    area: ['externo'],
    material: ['pintura_verniz'],
    etapa: ['lavagem'],
    intensidade: ['leve'],
  },
  ...overrides,
});

const createEmptySelection = (): UserSelection => ({
  problema: new Set(),
  area: new Set(),
  material: new Set(),
  etapa: new Set(),
  intensidade: new Set(),
});

describe('RankingEngine', () => {
  describe('calculateRawScore', () => {
    it('deve retornar score 0 quando não há seleções', () => {
      const product = createTestProduct();
      const selections = createEmptySelection();
      
      const result = calculateRawScore(product, selections);
      
      expect(result.score).toBe(0);
      expect(result.matches).toHaveLength(0);
    });

    it('deve calcular score corretamente com pesos', () => {
      const product = createTestProduct();
      const selections = createEmptySelection();
      selections.problema.add('sujeira_leve'); // peso 5
      selections.area.add('externo'); // peso 3
      
      const result = calculateRawScore(product, selections);
      
      expect(result.score).toBe(8); // 5 + 3
      expect(result.matches).toHaveLength(2);
    });

    it('deve incluir todas as matches encontradas', () => {
      const product = createTestProduct({
        categoriaTags: {
          problema: ['sujeira_leve', 'sujeira_pesada'],
          area: ['externo'],
          material: ['pintura_verniz'],
          etapa: ['lavagem'],
          intensidade: ['leve'],
        },
      });
      const selections = createEmptySelection();
      selections.problema.add('sujeira_leve');
      selections.problema.add('sujeira_pesada');
      
      const result = calculateRawScore(product, selections);
      
      expect(result.score).toBe(10); // 5 + 5
      expect(result.matches).toHaveLength(2);
    });
  });

  describe('calculateMaxPossibleScore', () => {
    it('deve retornar 0 quando não há seleções', () => {
      const selections = createEmptySelection();
      expect(calculateMaxPossibleScore(selections)).toBe(0);
    });

    it('deve calcular score máximo corretamente', () => {
      const selections = createEmptySelection();
      selections.problema.add('sujeira_leve'); // 1 * 5 = 5
      selections.problema.add('sujeira_pesada'); // 1 * 5 = 5
      selections.area.add('externo'); // 1 * 3 = 3
      
      expect(calculateMaxPossibleScore(selections)).toBe(13);
    });
  });

  describe('normalizeScore', () => {
    it('deve retornar 0 quando maxPossible é 0', () => {
      expect(normalizeScore(10, 0)).toBe(0);
    });

    it('deve normalizar para 100 quando score é igual ao máximo', () => {
      expect(normalizeScore(10, 10)).toBe(100);
    });

    it('deve normalizar corretamente para valores intermediários', () => {
      expect(normalizeScore(5, 10)).toBe(50);
      expect(normalizeScore(3, 10)).toBe(30);
    });
  });

  describe('rankProducts', () => {
    it('deve ordenar por score descendente', () => {
      const products: Product[] = [
        createTestProduct({ id: '1', nome: 'Produto A', categoriaTags: { ...createTestProduct().categoriaTags, problema: ['sujeira_leve'] } }),
        createTestProduct({ id: '2', nome: 'Produto B', categoriaTags: { ...createTestProduct().categoriaTags, problema: ['sujeira_leve', 'sujeira_pesada'] } }),
      ];
      
      const selections = createEmptySelection();
      selections.problema.add('sujeira_leve');
      selections.problema.add('sujeira_pesada');
      
      const result = rankProducts(products, selections);
      
      expect(result.products[0].id).toBe('2'); // Produto B tem mais matches
    });

    it('deve desempatar por nome A-Z quando scores são iguais', () => {
      const products: Product[] = [
        createTestProduct({ id: '1', nome: 'Zebra' }),
        createTestProduct({ id: '2', nome: 'Alfa' }),
      ];
      
      const selections = createEmptySelection();
      selections.problema.add('sujeira_leve');
      
      const result = rankProducts(products, selections);
      
      expect(result.products[0].nome).toBe('Alfa');
      expect(result.products[1].nome).toBe('Zebra');
    });

    it('deve retornar apenas top 3 razões', () => {
      const product = createTestProduct({
        categoriaTags: {
          problema: ['sujeira_leve'],
          area: ['externo'],
          material: ['pintura_verniz'],
          etapa: ['lavagem'],
          intensidade: ['leve'],
        },
      });
      
      const selections = createEmptySelection();
      selections.problema.add('sujeira_leve');
      selections.area.add('externo');
      selections.material.add('pintura_verniz');
      selections.etapa.add('lavagem');
      selections.intensidade.add('leve');
      
      const result = rankProducts([product], selections);
      
      expect(result.products[0].matchReasons.length).toBeLessThanOrEqual(3);
    });
  });

  describe('formatTagLabel', () => {
    it('deve converter underscores para espaços', () => {
      expect(formatTagLabel('sujeira_leve')).toBe('Sujeira Leve');
    });

    it('deve capitalizar cada palavra', () => {
      expect(formatTagLabel('pintura_verniz')).toBe('Pintura Verniz');
    });
  });
});
