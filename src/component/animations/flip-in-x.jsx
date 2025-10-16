// FlipInX.jsx
import { motion } from "motion/react";

const FlipInX = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, rotateX: -90 }}
      whileInView={{ opacity: 1, rotateX: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
    >
      {children}
    </motion.div>
  );
};

export default FlipInX;
