import { AnimatePresence, animate, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

import { getLoyaltyHistory, type LoyaltyHistoryItem } from '../../api/loyalty.ts';
import PointsCard from './loyalty/PointsCard.tsx';

const LOADING_CARD_IDS = ['loading-card-1', 'loading-card-2', 'loading-card-3'];
const PLACEHOLDER_REVEAL_DURATION_SECONDS = 0.24;
const PLACEHOLDER_REVEAL_GAP_SECONDS = 0.02;
const PLACEHOLDER_FADE_DELAY_SECONDS = 0.08;
const PLACEHOLDER_FADE_DURATION_SECONDS = 0.14;
const PLACEHOLDER_PULSE_DURATION_SECONDS = 2.4;

export default function LoyaltySection() {
  const [items, setItems] = useState<LoyaltyHistoryItem[]>([]);
  const [balance, setBalance] = useState(0);
  const [displayedBalance, setDisplayedBalance] = useState(0);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    let active = true;

    async function loadHistory() {
      try {
        const { data, error } = await getLoyaltyHistory();

        if (!active) return;

        if (error) {
          console.error(error);
          setHasLoadError(true);
          return;
        }
        setItems(data.items.toSorted((a, b) => b.created_at.localeCompare(a.created_at)));
        setBalance(data.balance);
      } catch (error) {
        if (!active) return;

        console.error(error);
        setHasLoadError(true);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadHistory();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (isLoading || hasLoadError) return;

    if (prefersReducedMotion) {
      setDisplayedBalance(balance);
      return;
    }

    const balanceAnimation = animate(0, balance, {
      duration: 0.8,
      ease: 'easeOut',
      onUpdate: (value) => setDisplayedBalance(Math.round(value)),
    });

    return () => balanceAnimation.stop();
  }, [balance, hasLoadError, isLoading, prefersReducedMotion]);

  return (
    <section className="flex w-full flex-col items-center justify-center pt-6 text-app-text [container-type:inline-size] lg:pt-12">
      <p className="w-full text-center text-[clamp(1.875rem,8cqi,3rem)] leading-tight">
        Program lojalnościowy
      </p>
      {!hasLoadError && (
        <p
          className="mt-4 w-full text-center text-[clamp(1.25rem,5cqi,1.875rem)] leading-tight"
          aria-live="polite"
        >
          {isLoading ? (
            <>
              <span className="sr-only">Ładowanie salda punktów…</span>
              <span aria-hidden="true">
                Posiadasz{' '}
                <span className="relative inline-block h-[0.8em] w-[2.5em] overflow-hidden rounded bg-app-surfaceStrong align-middle">
                  <motion.span
                    className="absolute inset-0 bg-app-cartCard"
                    initial={{ opacity: 0 }}
                    animate={prefersReducedMotion ? undefined : { opacity: [0, 1, 0] }}
                    transition={{
                      duration: PLACEHOLDER_PULSE_DURATION_SECONDS,
                      ease: 'easeInOut',
                      repeat: Infinity,
                    }}
                  />
                </span>{' '}
                punktów
              </span>
            </>
          ) : (
            <>
              Posiadasz <span className="font-semibold">{displayedBalance}</span> punktów
            </>
          )}
        </p>
      )}
      <motion.div
        layout={isLoading ? false : 'size'}
        className="mx-auto my-6 w-full overflow-hidden rounded-xl border border-app-border lg:my-12 lg:w-[calc(100%-6rem)]"
        aria-busy={isLoading}
        aria-live="polite"
        style={{ transformOrigin: 'top' }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { layout: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
        }
      >
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <motion.div
              key="loading"
              exit={prefersReducedMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <span className="sr-only">Ładowanie historii punktów…</span>
              <div aria-hidden="true" className="divide-y divide-app-borderSoft">
                {LOADING_CARD_IDS.map((id, index) => {
                  const revealDelay =
                    index * (PLACEHOLDER_REVEAL_DURATION_SECONDS + PLACEHOLDER_REVEAL_GAP_SECONDS);
                  const pulseDelay = Math.round(
                    (revealDelay + PLACEHOLDER_REVEAL_DURATION_SECONDS) * 1000
                  );

                  return (
                    <motion.div
                      key={id}
                      className="overflow-hidden"
                      initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      transition={{
                        height: {
                          duration: PLACEHOLDER_REVEAL_DURATION_SECONDS,
                          delay: revealDelay,
                          ease: 'linear',
                        },
                        opacity: {
                          duration: PLACEHOLDER_FADE_DURATION_SECONDS,
                          delay: revealDelay + PLACEHOLDER_FADE_DELAY_SECONDS,
                          ease: 'easeOut',
                        },
                      }}
                    >
                      <div className="relative min-h-16 w-full overflow-hidden bg-app-surfaceStrong lg:min-h-24">
                        <motion.div
                          className="absolute inset-0 bg-app-cartCard"
                          initial={{ opacity: 0 }}
                          animate={prefersReducedMotion ? undefined : { opacity: [0, 1, 0] }}
                          transition={{
                            duration: PLACEHOLDER_PULSE_DURATION_SECONDS,
                            delay: pulseDelay / 1000,
                            ease: 'easeInOut',
                            repeat: Infinity,
                          }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : hasLoadError ? (
            <motion.div
              key="error"
              role="alert"
              className="flex min-h-16 w-full items-center justify-center bg-app-dangerSoft p-4 text-center text-app-danger lg:min-h-24"
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              Nie udało się załadować punktów. Spróbuj ponownie później.
            </motion.div>
          ) : (
            <motion.div
              key="history"
              className="flex flex-col divide-y divide-app-borderSoft"
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              {items.map((acquisition, index) => (
                <motion.div
                  key={acquisition.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <PointsCard
                    date={new Date(acquisition.created_at).getTime()}
                    amount={acquisition.amount}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
