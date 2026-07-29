import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const SUBSITES = ['RENT', 'SERWIS', 'BOOT-FITTING'] as const;

type Subsite = (typeof SUBSITES)[number];

export default function SubsiteSelector() {
  const [selectedSubsite, setSelectedSubsite] = useState<Subsite>('RENT');
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!selectorRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div ref={selectorRef} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls="subsite-selector-options"
        onClick={() => setIsOpen((previous) => !previous)}
        className="group flex h-8 items-center gap-1 border-b border-app-border/35 px-1 text-sm font-black tracking-[0.08em] text-app-text transition-colors hover:border-app-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-border/40 sm:text-base"
      >
        <span>{selectedSubsite}</span>
        <ChevronDown
          aria-hidden="true"
          size={15}
          strokeWidth={1.75}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          id="subsite-selector-options"
          role="listbox"
          aria-label="Wybierz część serwisu"
          className="absolute left-0 top-full z-50 mt-2 min-w-44 overflow-hidden rounded-lg border border-app-border/20 bg-app-surfaceElevated py-1 shadow-lg"
        >
          {SUBSITES.map((subsite) => {
            const isSelected = subsite === selectedSubsite;

            return (
              <button
                key={subsite}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  setSelectedSubsite(subsite);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-4 px-4 py-2.5 text-left text-sm font-black tracking-[0.07em] transition-colors ${
                  isSelected
                    ? 'bg-app-surfaceSoft text-app-textStrong'
                    : 'text-app-text hover:bg-app-surfaceSoft'
                }`}
              >
                <span>{subsite}</span>
                {isSelected && <Check aria-hidden="true" size={16} strokeWidth={2} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
