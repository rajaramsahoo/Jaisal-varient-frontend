// FadeInRight.jsx
import { motion } from "motion/react";

const FadeIn = ({ children, className }) => {
    return (
        <motion.div
            initial={{ opacity: 0}}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: "ease" }}
            viewport={{ once: true, amount: 0.3 }}
            className={className || ""}
        >
            {children}
        </motion.div>
    );
};

export default FadeIn;
