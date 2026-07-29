import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SUBSITES = [
  { label: 'RENT', path: '/rent' },
  { label: 'SERWIS', path: '/service' },
  { label: 'BOOT-FITTING', path: '/boot-fitting' },
] as const;

type Subsite = (typeof SUBSITES)[number];

export default function SubsiteSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const selectedSubsite = SUBSITES.find(
    ({ path }) => location.pathname === path || location.pathname.startsWith(`${path}/`)
  );

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

  if (!selectedSubsite) return null;

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
        <span>{selectedSubsite.label}</span>
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
          {SUBSITES.map((subsite: Subsite) => {
            const isSelected = subsite.path === selectedSubsite.path;

            return (
              <button
                key={subsite.path}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  setIsOpen(false);
                  navigate(subsite.path);
                }}
                className={`flex w-full items-center justify-between gap-4 px-4 py-2.5 text-left text-sm font-black tracking-[0.07em] transition-colors ${
                  isSelected
                    ? 'bg-app-surfaceSoft text-app-textStrong'
                    : 'text-app-text hover:bg-app-surfaceSoft'
                }`}
              >
                <span>{subsite.label}</span>
                {isSelected && <Check aria-hidden="true" size={16} strokeWidth={2} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
