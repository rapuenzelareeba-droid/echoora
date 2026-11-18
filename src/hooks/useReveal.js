import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

/** Fades/slides in every [data-reveal] child of the returned ref when scrolled into view. */
export default function useReveal(deps = []) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, { y: 36, opacity: 0, duration: 0.9, ease: 'power3.out', delay: parseFloat(el.dataset.delay || 0),
          scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      });
    }, ref);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}
