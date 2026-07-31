import { ArrowUp } from 'lucide-react';
import { motion } from 'motion/react';

import type { SortDirection } from '../../types/search.ts';
import ButtonCore from './ButtonCore.tsx';
import Select, { type SelectOption } from './Select.tsx';

type SortTogglesProps<Value extends string> = {
  value: Value;
  options: readonly SelectOption<Value>[];
  direction: SortDirection;
  onValueChange: (value: Value) => void;
  onDirectionChange: (direction: SortDirection) => void;
};

export default function SortToggles<Value extends string>({
  value,
  options,
  direction,
  onValueChange,
  onDirectionChange,
}: SortTogglesProps<Value>) {
  const isAscending = direction === 'asc';

  return (
    <div className="flex items-center gap-2">
      <Select
        value={value}
        options={options}
        onChange={onValueChange}
        ariaLabel="Sortuj produkty"
        className="h-10 w-auto rounded-lg border border-app-border px-3 text-left text-base"
      />

      <ButtonCore
        onClick={() => onDirectionChange(isAscending ? 'desc' : 'asc')}
        ariaLabel={isAscending ? 'Sortowanie rosnące' : 'Sortowanie malejące'}
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-app-surfaceStrong"
      >
        <motion.span
          animate={{ rotate: isAscending ? 45 : 135 }}
          transition={{ duration: 0.2 }}
          className="flex"
        >
          <ArrowUp size={20} className="text-white" />
        </motion.span>
      </ButtonCore>
    </div>
  );
}
