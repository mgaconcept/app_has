import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { CategorySection } from '@/components/CategorySection';
import { FloatingButton } from '@/components/FloatingButton';
import { useProducts, useSelection, useCategoryTags } from '@/hooks/useProducts';
import { CATEGORY_CONFIGS } from '@/types/product';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

export default function CaseSelection() {
  const navigate = useNavigate();
  const { products, isLoading } = useProducts();
  const { selection, toggleTag, clearCategory, clearAll, totalSelected } = useSelection();
  const categoryTags = useCategoryTags(products);

  const handleViewRanking = () => {
    // Serialize selection to URL params
    const params = new URLSearchParams();
    for (const [key, tags] of Object.entries(selection)) {
      if (tags.size > 0) {
        params.set(key, Array.from(tags).join(','));
      }
    }
    navigate(`/ranking?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Guia de Produto" subtitle="Carregando..." />
        <main className="container max-w-2xl mx-auto px-4 py-6 space-y-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-6 w-32" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map(j => (
                  <Skeleton key={j} className="h-8 w-24 rounded-full" />
                ))}
              </div>
            </div>
          ))}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header 
        title="Guia de Produto" 
        subtitle="Selecione o seu caso"
      />
      
      <main className="container max-w-2xl mx-auto px-4 py-6">
        {/* Actions */}
        {totalSelected > 0 && (
          <div className="flex items-center justify-between mb-6 animate-fade-in">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-primary">{totalSelected}</span> critério{totalSelected > 1 ? 's' : ''} selecionado{totalSelected > 1 ? 's' : ''}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-muted-foreground hover:text-destructive"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Limpar tudo
            </Button>
          </div>
        )}

        {/* Categories */}
        <div className="space-y-8">
          {CATEGORY_CONFIGS.map((config, index) => (
            <div 
              key={config.key}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CategorySection
                config={config}
                tags={categoryTags[config.key]}
                selectedTags={selection[config.key]}
                onToggleTag={toggleTag}
                onClearCategory={clearCategory}
              />
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border/50 animate-fade-in">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">💡 Dica:</span> Selecione os critérios que descrevem seu caso. 
            Quanto mais específico, melhor será o ranking de produtos recomendados.
          </p>
        </div>
      </main>

      <FloatingButton 
        onClick={handleViewRanking}
        count={totalSelected}
      />
    </div>
  );
}
