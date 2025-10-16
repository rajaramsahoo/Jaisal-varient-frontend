// FadeInRight.jsx
import { motion } from "motion/react";

const FadeInRight = ({ children, className }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className={className || ""}
        >
            {children}
        </motion.div>
    );
};

export default FadeInRight;
