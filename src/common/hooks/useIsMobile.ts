import * as React from 'react';

export function useIsMobile(breakpoint = 640) {
  const [is, setIs] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const on = () => setIs(mq.matches);
    on();
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, [breakpoint]);
  return is;
}
