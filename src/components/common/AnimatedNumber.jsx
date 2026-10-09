import React, { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

export default function AnimatedNumber({ value = 0, duration = 1.1, className = "" }) {
  const ref = useRef(null);
  const previous = useRef(0);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [display, setDisplay] = useState(0);
  const visibleValue = inView ? display : Number(value) || 0;

  useEffect(() => {
    if (!inView) return undefined;
    const target = Number(value) || 0;
    const from = previous.current;
    previous.current = target;
    const controls = animate(from, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {Math.round(visibleValue).toLocaleString()}
    </span>
  );
}