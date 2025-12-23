import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  className?: string;
}

export function Header({ 
  title, 
  subtitle, 
  showBack, 
  onBack,
  className 
}: HeaderProps) {
  return (
    <header className={cn(
      'sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border/50 px-4 py-4',
      className
    )}>
      <div className="container max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          {showBack && onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="shrink-0 -ml-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-xl text-foreground truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
