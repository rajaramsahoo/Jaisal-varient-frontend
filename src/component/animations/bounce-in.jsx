// BounceIn.jsx
import { motion } from "motion/react";

const bounceInVariants = {
    hidden: {
        opacity: 0.4,
        scale: 0.3,
    },
    visible: {
        opacity: 1,
        scale: [1.1, 0.9, 1.03, 0.97, 1],
        transition: {
            duration: 0.8,
            ease: "easeOut",
            times: [0, 0.3, 0.5, 0.7, 1],
        },
    },
};

const BounceIn = ({ children }) => {
    return (
        <motion.div
            variants={bounceInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
        >
            {children}
        </motion.div>
    );
};

export default BounceIn;
