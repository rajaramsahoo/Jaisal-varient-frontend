import { useEffect, useState } from "react";
import Slider from "react-slick";
import ProductItem from "../products/product-box";
import { Row, Col, Container } from "reactstrap";
import PostLoader from "../common/post-loader";


import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, FreeMode, Pagination, Navigation } from "swiper/modules";
const TopCollection = ({
  productList,
  title,
  subtitle,
  designClass,
  noSlider,
  productSlider,
  titleClass,
  inner,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  // console.log(productList)
  const slidesToShow = Array.isArray(productList) && productList.length < 3
    ? [...productList, ...productList] // duplicate if less than 3
    : productList || []; // fallback to empty array


  return (
    <>
      <section className={designClass}>
        {noSlider ? (
          <Container>
            <Row>
              <Col>
                <div className={titleClass}>
                  <h2 className={inner}>{title}</h2>
                  <div className="line">
                    <span></span>
                  </div>
                </div>
                {loading ? (
                  <div className="row mx-0 margin-default">
                    <div className="col-xl-3 col-lg-4 col-6">
                      <PostLoader />
                    </div>
                    <div className="col-xl-3 col-lg-4 col-6">
                      <PostLoader />
                    </div>
                    <div className="col-xl-3 col-lg-4 col-6">
                      <PostLoader />
                    </div>
                    <div className="col-xl-3 col-lg-4 col-6">
                      <PostLoader />
                    </div>
                  </div>
                ) : (


                  /*******swiper slaider start*******/
                  <div className="relatedProSlide">
                    <Swiper
                      freeMode={false}
                      navigation={false}
                      loop={slidesToShow.length > 3} pagination={{ clickable: true }}
                      breakpoints={{
                        360: { slidesPerView: Math.min(2, slidesToShow.length), spaceBetween: 15 },
                        480: { slidesPerView: Math.min(2, slidesToShow.length), spaceBetween: 15 },
                        640: { slidesPerView: Math.min(3, slidesToShow.length), spaceBetween: 15 },
                        768: { slidesPerView: Math.min(4, slidesToShow.length), spaceBetween: 15 },
                        1024: { slidesPerView: Math.min(5, slidesToShow.length), spaceBetween: 15 },
                      }}
                      modules={[Autoplay, FreeMode, Pagination, Navigation]}
                      style={{
                        "--swiper-navigation-color": "#043b37",
                        "--swiper-pagination-color": "#043b37",
                      }}
                      className="mySwiper"
                    >

                      {/* item start here */}
                      {slidesToShow.map((product, index) => (
                        <SwiperSlide key={product._id}>
                          <div key={index}>
                            <ProductItem
                              product={product}
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                      {/* item end here */}
                    </Swiper>
                  </div>
                  /*******swiper slaider end*******/
                )}
              </Col>
            </Row>
          </Container>
        ) : (
          <>
            <div className="title1 title-gradient  section-t-space">
              {subtitle ? <h4>{subtitle}</h4> : ""}
              <h2 className="title-inner1">{title}</h2>
              <hr role="tournament6" />
            </div>
            <Container>
              <Row>
                {productList?.slice(0, 8).map((product) => (
                  <Col xl="3" sm="6" key={product._id || product.id}>
                    <ProductItem product={product} />
                  </Col>
                ))}

              </Row>
            </Container>
          </>
        )}
      </section>
    </>
  );
};

export default TopCollection;
