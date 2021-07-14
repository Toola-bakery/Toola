import { EffectCallback, useEffect, useState } from "react";

export function useOnMountedEffect(effect: EffectCallback): void {
  const [isMounted, setMounded] = useState(false);
  useEffect(() => {
    if (!isMounted) {
      setMounded(true);
      return effect();
    }
  }, [effect, isMounted]);
}
