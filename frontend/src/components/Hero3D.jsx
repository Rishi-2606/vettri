import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

export default function Hero3D() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useTransform(mx, [-1, 1], [-12, 12]);
  const rotX = useTransform(my, [-1, 1], [10, -10]);

  useEffect(() => {
    function onMove(e) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mx.set((e.clientX / w) * 2 - 1);
      my.set((e.clientY / h) * 2 - 1);
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <div className="hero-3d" aria-hidden="true">
      <motion.div
        className="hero-3d-inner"
        style={{ rotateX: rotX, rotateY: rotY }}
        transition={{ type: "spring", stiffness: 40, damping: 15 }}
      >
        <div className="tier tier-1" />
        <div className="tier tier-2" />
        <div className="tier tier-3" />
        <div className="tier tier-4" />
        <div className="glow" />
      </motion.div>
    </div>
  );
}