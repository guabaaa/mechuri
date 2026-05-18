import { useCallback, useState } from 'react';
import { ApiError } from '../api/client';
import type { DeliveryCategory } from '../api/types';

export type MenuRevealResult = {
  menu: string;
  message: string;
  situationTitle?: string;
  situationId?: string;
  deliveryCategory?: DeliveryCategory;
};

type Phase = 'idle' | 'loading' | 'reveal';

export function useMenuReveal() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<MenuRevealResult | null>(null);

  const run = useCallback(
    async (
      fetcher: () => Promise<MenuRevealResult>,
      options?: { skipReveal?: boolean },
    ) => {
      setPhase('loading');
      setError(null);
      try {
        const result = await fetcher();
        if (options?.skipReveal) {
          setPhase('idle');
          return result;
        }
        setPending(result);
        setPhase('reveal');
        return result;
      } catch (e) {
        setPhase('idle');
        setError(
          e instanceof ApiError
            ? e.message
            : '서버에 연결할 수 없어요. yarn server 를 실행해 주세요.',
        );
        return null;
      }
    },
    [],
  );

  const finishReveal = useCallback(
    (onDone: (result: MenuRevealResult) => void) => {
      if (!pending) {
        setPhase('idle');
        return;
      }
      onDone(pending);
      setPending(null);
      setPhase('idle');
    },
    [pending],
  );

  const reset = useCallback(() => {
    setPhase('idle');
    setError(null);
    setPending(null);
  }, []);

  return {
    phase,
    error,
    pending,
    run,
    finishReveal,
    reset,
    isBusy: phase !== 'idle',
  };
}
