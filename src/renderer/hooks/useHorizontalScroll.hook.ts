import { useEffect } from 'react';

export default function useHorizontalScroll(elementId: string) {
  useEffect(() => {
    // eslint-disable-next-line compat/compat
    const scrollContainer = document.querySelector(`#${elementId}`);

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      scrollContainer!.scrollLeft += e.deltaY;
    };

    if (scrollContainer) {
      scrollContainer.addEventListener('wheel', handleWheel, {
        passive: false,
      });
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);
}
