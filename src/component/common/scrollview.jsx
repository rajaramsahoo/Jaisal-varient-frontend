import { useInView } from "react-intersection-observer";

export const ScrollView = ({ children, className }) => {
    const { ref, inView } = useInView({
        /* Optional options */
        threshold: 0.4,
    });
    return (
        <div className={`${inView ? className : ""}`} ref={ref}>
            {children({inView})}
        </div>
    )
}