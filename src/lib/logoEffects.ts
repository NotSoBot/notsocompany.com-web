import { useEffect, useRef, useState, type PointerEvent } from 'react';


// same as notsobot.com's navbar logo (notsobot.com-web) and nsb.gg's (nsb.gg-web/src/lib/logoEffects.ts)

// the logo run through every media iv effect that keeps its transparency (see assets/logos/effects/README.md)
const LOGO_EFFECTS = Object.values(import.meta.glob<string>('../assets/logos/effects/*.webp', {
  eager: true,
  import: 'default',
  query: '?no-inline',
}));

// effects go out in a shuffled order so every one is shown before any repeats, then it reshuffles
let logoEffectQueue: Array<string> = [];

export function peekLogoEffect(previous?: string): string {
  if (!logoEffectQueue.length) {
    logoEffectQueue = [...LOGO_EFFECTS];
    for (let i = logoEffectQueue.length - 1; 0 < i; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ logoEffectQueue[i], logoEffectQueue[j] ] = [ logoEffectQueue[j], logoEffectQueue[i] ];
    }
    // don't show the same effect twice in a row across a reshuffle
    if (1 < logoEffectQueue.length && logoEffectQueue[0] === previous) {
      logoEffectQueue.push(logoEffectQueue.shift()!);
    }
  }
  return logoEffectQueue[0];
}

export function takeLogoEffect(previous?: string): string {
  const effect = peekLogoEffect(previous);
  logoEffectQueue.shift();
  return effect;
}


// the logo swaps to the next effect while hovered (touch doesn't hover, it keeps the plain logo)
// `effect` is the one being shown, null while not hovered. spread `handlers` on the element that's hovered
export function useLogoEffect() {
  const [ effect, setEffect ] = useState<string | null>(null);
  const lastEffect = useRef<string | undefined>(undefined);

  // load the upcoming effect ahead of time so the hover swap doesn't flash empty
  useEffect(() => {
    new Image().src = peekLogoEffect(lastEffect.current);
  }, [effect]);

  const handlers = {
    onPointerEnter: (event: PointerEvent) => {
      if (event.pointerType !== 'touch') {
        lastEffect.current = takeLogoEffect(lastEffect.current);
        setEffect(lastEffect.current);
      }
    },
    onPointerLeave: () => setEffect(null),
  };
  return { effect, handlers };
}
