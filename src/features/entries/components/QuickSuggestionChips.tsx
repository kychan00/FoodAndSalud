import { Star } from "lucide-react";

import "./QuickSuggestionChips.css";

export interface QuickSuggestionChip {
  id: string;

  label: string;

  meta?: string | null;

  favorite?: boolean;
}

interface QuickSuggestionChipsProps {
  label: string;

  hint?: string;

  items: QuickSuggestionChip[];

  onSelect: (id: string) => void;
}

export function QuickSuggestionChips({
  label,
  hint,
  items,
  onSelect,
}: QuickSuggestionChipsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="quick-suggestions">
      <div className="quick-suggestions__header">
        <strong>{label}</strong>

        {hint ? <span>{hint}</span> : null}
      </div>

      <div className="quick-suggestions__scroller">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="quick-suggestion"
            data-favorite={Boolean(item.favorite)}
            onClick={() => onSelect(item.id)}
          >
            {item.favorite ? (
              <Star size={13} fill="currentColor" aria-hidden="true" />
            ) : null}

            <span>{item.label}</span>

            {item.meta ? <small>{item.meta}</small> : null}
          </button>
        ))}
      </div>
    </section>
  );
}
