import { cn } from '@/lib/utils';
import { formatTagLabel } from '@/lib/rankingEngine';

interface SelectableChipProps {
  tag: string;
  selected: boolean;
  onToggle: () => void;
  className?: string;
}

export function SelectableChip({ 
  tag, 
  selected, 
  onToggle,
  className 
}: SelectableChipProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-full border transition-all duration-200 cursor-pointer select-none',
        selected 
          ? 'bg-primary text-primary-foreground border-primary shadow-md scale-[1.02]' 
          : 'bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80 hover:scale-[1.01]',
        className
      )}
      aria-pressed={selected}
    >
      {formatTagLabel(tag)}
    </button>
  );
}
