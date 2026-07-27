import { motion, useReducedMotion } from 'motion/react';

const PLACEHOLDER_PULSE_DURATION_SECONDS = 2.4;

type PlaceholderBlockProps = {
  className: string;
  reducedMotion: boolean | null;
};

function PlaceholderBlock({ className, reducedMotion }: PlaceholderBlockProps) {
  return (
    <div className={`relative overflow-hidden bg-app-borderSoft ${className}`}>
      <motion.div
        className="absolute inset-0 bg-app-surfaceSoft"
        initial={{ opacity: 0 }}
        animate={reducedMotion ? undefined : { opacity: [0, 1, 0] }}
        transition={{
          duration: PLACEHOLDER_PULSE_DURATION_SECONDS,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      />
    </div>
  );
}

export default function SearchProductCardPlaceholder() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <article
      aria-hidden="true"
      className="relative flex w-full select-none overflow-hidden rounded-xl border border-app-borderSoft bg-app-surfaceSoft md:h-48"
    >
      <PlaceholderBlock
        reducedMotion={prefersReducedMotion}
        className="w-32 shrink-0 sm:w-52 md:w-60"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-2 bg-app-surface p-3 sm:p-4 md:flex-row md:items-stretch md:gap-5">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <PlaceholderBlock reducedMotion={prefersReducedMotion} className="h-6 w-2/3 rounded-md" />
          <div className="flex flex-col gap-2">
            <PlaceholderBlock reducedMotion={prefersReducedMotion} className="h-4 w-full rounded" />
            <PlaceholderBlock reducedMotion={prefersReducedMotion} className="h-4 w-4/5 rounded" />
          </div>
          <div className="mt-auto flex gap-2">
            <PlaceholderBlock
              reducedMotion={prefersReducedMotion}
              className="h-6 w-10 rounded-md"
            />
            <PlaceholderBlock
              reducedMotion={prefersReducedMotion}
              className="h-6 w-10 rounded-md"
            />
            <PlaceholderBlock
              reducedMotion={prefersReducedMotion}
              className="h-6 w-10 rounded-md"
            />
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-stretch justify-end gap-3 border-t border-app-borderSoft pt-3 md:w-48 md:border-l md:border-t-0 md:pl-6 md:pt-0">
          <PlaceholderBlock
            reducedMotion={prefersReducedMotion}
            className="mx-auto h-6 w-28 rounded-md"
          />
          <PlaceholderBlock
            reducedMotion={prefersReducedMotion}
            className="h-12 w-full rounded-lg"
          />
        </div>
      </div>

      <div className="absolute right-5 top-5">
        <PlaceholderBlock reducedMotion={prefersReducedMotion} className="size-6 rounded-full" />
      </div>
    </article>
  );
}
