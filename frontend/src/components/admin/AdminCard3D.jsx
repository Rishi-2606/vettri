import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * A 3D tilt card that:
 *  - follows the mouse in 3D
 *  - shows a radial gold spotlight under the cursor
 *  - returns smoothly to rest on mouse leave
 */
export default function AdminCard3D({
  children,
  className = "",
  intensity = 8,
  glow = true,
  style = {},
  ...rest
}) {
  const ref = useRef(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [intensity, -intensity]), {
    stiffness: 220,
    damping: 20,
  });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-intensity, intensity]), {
    stiffness: 220,
    damping: 20,
  });

  function onMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mx.set(x - 0.5);
    my.set(y - 0.5);

    if (glow) {
      el.style.setProperty("--mx", `${x * 100}%`);
      el.style.setProperty("--my", `${y * 100}%`);
    }
  }

  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div className="admin-3d-wrap" style={{ width: "100%" }}>
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{
          rotateX: rotX,
          rotateY: rotY,
          transformPerspective: 1000,
          ...style,
        }}
        className={`admin-3d-card ${className}`}
        {...rest}
      >
        {children}
      </motion.div>
    </div>
  );
}