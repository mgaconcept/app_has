import { CategoryConfig, CategoryKey } from '@/types/product';
import { SelectableChip } from './SelectableChip';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface CategorySectionProps {
  config: CategoryConfig;
  tags: string[];
  selectedTags: Set<string>;
  onToggleTag: (category: CategoryKey, tag: string) => void;
  onClearCategory: (category: CategoryKey) => void;
}

export function CategorySection({
  config,
  tags,
  selectedTags,
  onToggleTag,
  onClearCategory,
}: CategorySectionProps) {
  const selectedCount = selectedTags.size;

  return (
    <section className="animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{config.icon}</span>
          <h3 className="font-display font-semibold text-foreground">
            {config.label}
          </h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            peso {config.peso}
          </span>
          {selectedCount > 0 && (
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {selectedCount} selecionado{selectedCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
        {selectedCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onClearCategory(config.key)}
            className="h-7 px-2 text-muted-foreground hover:text-destructive"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Limpar
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <SelectableChip
            key={tag}
            tag={tag}
            selected={selectedTags.has(tag)}
            onToggle={() => onToggleTag(config.key, tag)}
          />
        ))}
      </div>
    </section>
  );
}
