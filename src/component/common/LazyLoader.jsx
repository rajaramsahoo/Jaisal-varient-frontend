// import React, { useEffect, useRef, useState } from "react";

// const LazyLoader = ({ children }) => {
//     const ref = useRef(null);
//     const [isVisible, setIsVisible] = useState(false);

//     useEffect(() => {
//         const observer = new IntersectionObserver(
//             (entries) => {
//                 entries.forEach((entry) => {
//                     if (entry.isIntersecting) {
//                         setIsVisible(true);
//                         observer.disconnect(); // stop once visible
//                     }
//                 });
//             },
//             { threshold: 0.2 } // 20% visible
//         );

//         if (ref.current) observer.observe(ref.current);
//         return () => observer.disconnect();
//     }, []);

//     return <div ref={ref}>{isVisible ? children : null}</div>;
// };

// export default LazyLoader;
