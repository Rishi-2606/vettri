import { useEffect, useRef, useState } from "react";
import { useMotionValue, animate } from "framer-motion";

/**
 * Animated number that counts from 0 → value.
 * Re-runs whenever `value` changes.
 */
export default function AnimatedCounter({
  value,
  duration = 1.2,
  suffix = "",
  prefix = "",
  format = (n) => Math.round(n).toLocaleString("en-IN"),
}) {
  const numeric = typeof value === "number" ? value : parseFloat(value) || 0;
  const [display, setDisplay] = useState(() => format(0));
  const mv = useMotionValue(0);
  const prev = useRef(0);

  useEffect(() => {
    const controls = animate(mv, numeric, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(format(latest)),
    });
    prev.current = numeric;
    return () => controls.stop();
  }, [numeric, duration, mv, format]);

  return (
    <span>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}