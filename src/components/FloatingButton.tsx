import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingButtonProps {
  onClick: () => void;
  count: number;
  disabled?: boolean;
  className?: string;
}

export function FloatingButton({ 
  onClick, 
  count, 
  disabled,
  className 
}: FloatingButtonProps) {
  return (
    <div className={cn(
      'fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-background via-background to-transparent',
      className
    )}>
      <div className="container max-w-2xl mx-auto">
        <Button
          onClick={onClick}
          disabled={disabled || count === 0}
          className={cn(
            'w-full h-14 text-base font-semibold shadow-elevated transition-all duration-300',
            count > 0 
              ? 'gradient-hero hover:opacity-90' 
              : 'bg-muted text-muted-foreground'
          )}
        >
          <span className="flex items-center gap-2">
            Ver Ranking
            {count > 0 && (
              <span className="bg-primary-foreground/20 px-2 py-0.5 rounded-full text-sm">
                {count} selecionado{count > 1 ? 's' : ''}
              </span>
            )}
            <ChevronRight className="h-5 w-5" />
          </span>
        </Button>
      </div>
    </div>
  );
}
