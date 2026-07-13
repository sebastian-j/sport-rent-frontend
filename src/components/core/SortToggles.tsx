import { ArrowUp } from 'lucide-react';
import { motion } from 'motion/react';
import ButtonCore from './ButtonCore.tsx';
import ComboBox, { type ComboBoxOption } from './ComboBox.tsx';

export type SortDirection = 'ascending' | 'descending';

type SortTogglesProps = {
  value: string;
  options: readonly ComboBoxOption[];
  direction: SortDirection;
  onValueChange: (value: string) => void;
  onDirectionChange: (direction: SortDirection) => void;
};

export default function SortToggles({
  value,
  options,
  direction,
  onValueChange,
  onDirectionChange,
}: SortTogglesProps) {
  const isAscending = direction === 'ascending';

  return (
    <div className="flex items-center gap-2">
      <ComboBox
        value={value}
        options={options}
        onChange={onValueChange}
        ariaLabel="Sortuj produkty"
        className="h-10 w-auto rounded-lg border border-app-border px-3 text-left text-base"
      />

      <ButtonCore
        onClick={() => onDirectionChange(isAscending ? 'descending' : 'ascending')}
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
