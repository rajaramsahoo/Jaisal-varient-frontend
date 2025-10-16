// import { Fragment } from "react";
// import Slider from "react-slick";
// import { useCommonContext } from "../../../helpers/common/CommonContext";
// import { Link } from "react-router-dom";

// const Banner = () => {
//   const { BannerData } = useCommonContext();

//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000, // slower transition for UX
//   };

//   const banners = BannerData?.data || [];
//   const isLoading = BannerData?.loading;

//   return (
//     <Fragment>
//       <div className="mainBanner">
//         {/* Loading state */}
//         {isLoading && (
//           <div style={{ minHeight: 200 }} className="d-flex align-items-center justify-content-center">
//             <img
//               src="./assets/images/banner-placeholder.svg"
//               alt="loading banner"
//               width="300"
//               height="120"
//               loading="lazy"
//             />
//           </div>
//         )}

//         {/* Multiple banners → slider */}
//         {!isLoading && banners.length > 1 && (
//           <Slider {...settings} className="slide-1 home-slider">
//             {banners.map((data, i) => (
//               <Link to={data?.link || "/shop/basmati-rice"} key={i}>
//                 <div align="center">
//                   <img
//                     src={data.image}
//                     alt={`banner-${i}`}
//                     className="mobile-responsive-banner"
//                     style={{ width: "100%" }}
//                     loading={i === 0 ? "eager" : "lazy"} // only first eager
//                   />
//                 </div>
//               </Link>
//             ))}
//           </Slider>
//         )}

//         {/* Single banner */}
//         {!isLoading && banners.length === 1 && (
//           <Link to={banners[0]?.link || "/shop/basmati-rice"}>
//             <div align="center">
//               <img
//                 src={banners[0].image}
//                 alt="banner"
//                 className="mobile-responsive-banner"
//                 style={{ width: "100%" }}
//                 loading="eager"
//               />
//             </div>
//           </Link>
//         )}

//         {/* Empty fallback */}
//         {!isLoading && banners.length === 0 && (
//           <div style={{ minHeight: 200 }} className="d-flex align-items-center justify-content-center">
//             <img
//               src="./assets/images/banner-fallback.svg"
//               alt="no banner"
//               width="300"
//               height="120"
//               loading="lazy"
//             />
//           </div>
//         )}

//         {/* Divider only once */}
//         <div className="bannerDivider">
//           <img src="./assets/images/banner-divider.svg" alt="divider" loading="lazy" />
//         </div>
//       </div>
//     </Fragment>
//   );
// };

// export default Banner;
import { Fragment, useMemo } from "react";
import { Link } from "react-router-dom"; // Assuming Link is from react-router-dom
import Slider from "react-slick";
import { useCommonContext } from "../../../helpers/common/CommonContext";

const Banner = () => {
  const { BannerData } = useCommonContext();
  const bannerData = useMemo(() => BannerData?.data || [], [BannerData]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    lazyLoad: "ondemand", // Maintain lazy loading for slider images
  };

  return (
    <div className={bannerData.length === 0 ? "maniBanner" : "mainBanner"}>
      {bannerData.length > 1 ? (
        <Slider {...settings} className="slide-1 home-slider">
          {bannerData.map((data, i) => (
            <Link key={i} to="shop/basmati-rice">
              <div align="center">
                <img
                  src={data.image}
                  alt=""
                  className="mobile-responsive-banner"
                  style={{ width: "100%" }}
                  loading="lazy" // Lazy load for slider images
                  fetchpriority="low" // Lower priority for non-visible slider images
                />
              </div>
            </Link>
          ))}
        </Slider>
      ) : bannerData.length === 1 ? (
        <Link to="shop/basmati-rice">
          <div align="center">
            <img
              src={bannerData[0].image}
              alt=""
              className="mobile-responsive-banner"
              style={{ width: "100%" }}
              loading="eager" // Eager loading for single banner
              fetchpriority="high" // High priority for LCP
            />
          </div>
        </Link>
      ) : (
        <div style={{ minHeight: 100 }}></div>
      )}
      <div className="bannerDivider">
        <img
          src="./assets/images/banner-divider.svg"
          alt=""
          loading="lazy"
          fetchpriority="low" // Low priority for divider image
        />
      </div>
    </div>
  );
};

export default Banner;