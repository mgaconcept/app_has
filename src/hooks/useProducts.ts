import { useState, useEffect, useMemo, useCallback } from 'react';
import { Product, UserSelection, CategoryKey, RankedProduct } from '@/types/product';
import { transformProducts } from '@/lib/productTransformer';
import { rankProducts, getUniqueTags } from '@/lib/rankingEngine';
import produtosData from '@/data/produtos.json';

const rawProducts = (produtosData as { sheets: { produtos: unknown[] } }).sheets.produtos;

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula um pequeno delay para UX
    const timer = setTimeout(() => {
      const transformed = transformProducts(rawProducts as never[]);
      setProducts(transformed);
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return { products, isLoading };
}

export function useSelection() {
  const [selection, setSelection] = useState<UserSelection>({
    problema: new Set(),
    area: new Set(),
    material: new Set(),
    etapa: new Set(),
    intensidade: new Set(),
  });

  const toggleTag = useCallback((category: CategoryKey, tag: string) => {
    setSelection(prev => {
      const newSet = new Set(prev[category]);
      if (newSet.has(tag)) {
        newSet.delete(tag);
      } else {
        newSet.add(tag);
      }
      return { ...prev, [category]: newSet };
    });
  }, []);

  const clearCategory = useCallback((category: CategoryKey) => {
    setSelection(prev => ({
      ...prev,
      [category]: new Set(),
    }));
  }, []);

  const clearAll = useCallback(() => {
    setSelection({
      problema: new Set(),
      area: new Set(),
      material: new Set(),
      etapa: new Set(),
      intensidade: new Set(),
    });
  }, []);

  const totalSelected = useMemo(() => {
    return Object.values(selection).reduce((acc, set) => acc + set.size, 0);
  }, [selection]);

  return {
    selection,
    toggleTag,
    clearCategory,
    clearAll,
    totalSelected,
  };
}

export function useRanking(products: Product[], selection: UserSelection) {
  const result = useMemo(() => {
    return rankProducts(products, selection);
  }, [products, selection]);

  return result;
}

export function useCategoryTags(products: Product[]) {
  const categoryTags = useMemo(() => {
    return {
      problema: getUniqueTags(products, 'problema'),
      area: getUniqueTags(products, 'area'),
      material: getUniqueTags(products, 'material'),
      etapa: getUniqueTags(products, 'etapa'),
      intensidade: getUniqueTags(products, 'intensidade'),
    };
  }, [products]);

  return categoryTags;
}
