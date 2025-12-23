import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { SearchInput } from '@/components/SearchInput';
import { ScoreFilter } from '@/components/ScoreFilter';
import { useProducts, useRanking } from '@/hooks/useProducts';
import { UserSelection, CategoryKey } from '@/types/product';
import { Skeleton } from '@/components/ui/skeleton';
import { Package } from 'lucide-react';

function parseSelectionFromParams(searchParams: URLSearchParams): UserSelection {
  const categories: CategoryKey[] = ['problema', 'area', 'material', 'etapa', 'intensidade'];
  const selection: UserSelection = {
    problema: new Set(),
    area: new Set(),
    material: new Set(),
    etapa: new Set(),
    intensidade: new Set(),
  };

  for (const key of categories) {
    const value = searchParams.get(key);
    if (value) {
      const tags = value.split(',').filter(t => t.trim());
      selection[key] = new Set(tags);
    }
  }

  return selection;
}

export default function Ranking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { products, isLoading } = useProducts();
  
  const selection = useMemo(() => parseSelectionFromParams(searchParams), [searchParams]);
  const { products: rankedProducts } = useRanking(products, selection);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showHighScoreOnly, setShowHighScoreOnly] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = rankedProducts;

    // Filter by score
    if (showHighScoreOnly) {
      filtered = filtered.filter(p => p.score > 70);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.nome.toLowerCase().includes(query) ||
        p.marca.toLowerCase().includes(query) ||
        p.descricaoCurta.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [rankedProducts, searchQuery, showHighScoreOnly]);

  const totalSelected = Object.values(selection).reduce((acc, set) => acc + set.size, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Ranking" showBack onBack={() => navigate('/')} />
        <main className="container max-w-2xl mx-auto px-4 py-6 space-y-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Ranking de Produtos" 
        subtitle={`${filteredProducts.length} produto${filteredProducts.length !== 1 ? 's' : ''} encontrado${filteredProducts.length !== 1 ? 's' : ''}`}
        showBack
        onBack={() => navigate('/')}
      />
      
      <main className="container max-w-2xl mx-auto px-4 py-4">
        {/* Search and filters */}
        <div className="sticky top-[73px] z-30 bg-background/95 backdrop-blur-lg -mx-4 px-4 py-3 border-b border-border/50 space-y-3">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar por nome ou marca..."
          />
          <div className="flex items-center gap-2">
            <ScoreFilter
              showHighScoreOnly={showHighScoreOnly}
              onToggle={() => setShowHighScoreOnly(!showHighScoreOnly)}
            />
            <span className="text-xs text-muted-foreground">
              {totalSelected} critério{totalSelected !== 1 ? 's' : ''} aplicado{totalSelected !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Results */}
        <div className="py-4 space-y-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                {searchQuery 
                  ? 'Tente ajustar sua busca ou remover o filtro de score.'
                  : 'Tente selecionar outros critérios na tela anterior.'}
              </p>
            </div>
          ) : (
            filteredProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                index={index}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
