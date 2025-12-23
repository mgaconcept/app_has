import { RankedProduct } from '@/types/product';
import { formatTagLabel } from '@/lib/rankingEngine';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: RankedProduct;
  index: number;
}

function getScoreClass(score: number): string {
  if (score >= 70) return 'score-high';
  if (score >= 40) return 'score-medium';
  return 'score-low';
}

function getScoreLabel(score: number): string {
  if (score >= 70) return 'Alta compatibilidade';
  if (score >= 40) return 'Média compatibilidade';
  return 'Baixa compatibilidade';
}

export function ProductCard({ product, index }: ProductCardProps) {
  const scoreClass = getScoreClass(product.score);

  return (
    <Card 
      className={cn(
        'overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 animate-slide-up',
        'border-border/50 hover:border-primary/30'
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs font-medium shrink-0">
                {product.marca}
              </Badge>
            </div>
            <h3 className="font-display font-semibold text-foreground leading-tight mb-1 line-clamp-2">
              {product.nome}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {product.descricaoCurta}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className={cn(scoreClass, 'text-base')}>
              {product.score}%
            </div>
            <span className="text-[10px] text-muted-foreground text-right">
              {getScoreLabel(product.score)}
            </span>
          </div>
        </div>

        {product.matchReasons.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2">Por que apareceu:</p>
            <div className="flex flex-wrap gap-1.5">
              {product.matchReasons.map((reason, idx) => (
                <span
                  key={`${reason.categoria}-${reason.tag}-${idx}`}
                  className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                >
                  <span className="font-medium">{reason.categoria}:</span>
                  <span>{formatTagLabel(reason.tag)}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
