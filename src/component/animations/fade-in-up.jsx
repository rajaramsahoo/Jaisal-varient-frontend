// FadeInUp.jsx
import { motion } from "motion/react";

const FadeInUp = ({ children, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      className={className || ""}
    >
      {children}
    </motion.div>
  );
};

export default FadeInUp;
