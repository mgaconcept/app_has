import { cn } from '@/lib/utils';

interface ScoreFilterProps {
  showHighScoreOnly: boolean;
  onToggle: () => void;
  threshold?: number;
  className?: string;
}

export function ScoreFilter({ 
  showHighScoreOnly, 
  onToggle,
  threshold = 70,
  className 
}: ScoreFilterProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full border transition-all duration-200',
        showHighScoreOnly
          ? 'bg-score-high text-primary-foreground border-transparent shadow-md'
          : 'bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80',
        className
      )}
    >
      <span className="text-xs">✓</span>
      Score {'>'} {threshold}
    </button>
  );
}
