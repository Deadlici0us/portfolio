import { useEffect, useState, useRef } from "react";

function useOnScreen(threshold = 0.1) {
  const [isIntersecting, setIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentRef = ref.current; // Store ref value in a variable
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { threshold }
    );

    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef); // Use the stable variable here
    };
  }, [threshold]);

  return { isIntersecting, ref };
}

export default useOnScreen;
