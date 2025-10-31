import React, { useEffect } from "react";
import CommonLayout from "../shop/common-layout";
import { Container, Media, Row } from "reactstrap";
import { useCommonContext } from "../../helpers/common/CommonContext";

import { Swiper, SwiperSlide } from "swiper/react";


import "swiper/css";
import "swiper/css/pagination";


import { Autoplay, FreeMode, Pagination, Navigation } from "swiper/modules";
import { Col } from "react-bootstrap";
import PostLoader from "../common/post-loader";
const Comboproducts = () => {
  const { getAllComboOfferProductDeatils, comboOfferProductDeatils } = useCommonContext();
  useEffect(() => {
    getAllComboOfferProductDeatils();
  }, []);
  console.log(comboOfferProductDeatils, "comboOfferProductDeatils")
  const offerPrice = 0;
  const originalPrice = 0;
  const discountPercentage = 0;
  return (
    <CommonLayout title="Combo Offers" parent="home">
      <section className="section-b-space ratio_asos">
        <div className="collection-wrapper position-relative">
          <Container>
            <Row>
              <Swiper
                spaceBetween={30}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                loop={comboOfferProductDeatils?.data?.length > 1}
                pagination={{
                  clickable: true,
                }}
                modules={[Pagination, Autoplay]}
                style={{
                  "--swiper-navigation-color": "#74b72c",
                  "--swiper-pagination-color": "#74b72c",
                }}
                className="mySwiper"
                id="healthy-combos"
              >
                {comboOfferProductDeatils?.data?.length === 0 ? (
                  <SwiperSlide>
                    <div className="bigProductPart" onClick={() => toast.warning(" Combo Products coming soon ")}>
                      <div className="imgBx">
                        <img src="https://res.cloudinary.com/dshkgcwoh/image/upload/v1755343157/fubkjyahf6bm5mg0wymw.jpg" alt="No combo available" loading="lazy" />
                      </div>
                    </div>
                  </SwiperSlide>
                ) : (
                  comboOfferProductDeatils?.data?.map((item, index) => (
                    <SwiperSlide key={`${item._id}-${index}`}>
                      <div
                        className="bigProductPart"

                      >


                        <div className="imgBx" style={{ backgroundColor: "red", width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <img src={item?.image_url} alt={item?.name} loading="lazy"
                            style={{
                              height: '500px',
                              objectFit: 'contain'
                            }}
                          />
                        </div>
                      </div>
                    </SwiperSlide>
                  ))
                )}

              </Swiper>
            </Row>
          </Container>
        </div>
      </section>
      <Col className="collection-content">
        <div className="page-main-content">
          <Row>
            <Col sm="12">
              <div className="collection-product-wrapper">
                <div className={`product-wrapper-grid `}>

                  <Row>
                    {comboOfferProductDeatils?.loading ? (
                      <PostLoader />
                    ) : comboOfferProductDeatils?.data && comboOfferProductDeatils?.data.length > 0 ? (
                      comboOfferProductDeatils?.data.map((product, i) => (
                        <div className="" key={i}>
                          <div className="product addtocart_count">
                            <div
                              className={`product product-box product-wrapper-box`}
                              style={{ cursor: "pointer" }}
                            >        {/*inActiveProduct*/}
                              <div className="img-wrapper">
                                <div className="lable-block">
                                  {product.new === "true" ? <span className="lable3">new</span> : ""}

                                </div>
                                <div className="front" >
                                  <Media src={product?.image_url} className="img-fluid" alt="" />
                                </div>


                                <div className="addtocart_btn">
                                  <button
                                    className="add-button add_cart rounded-5    "
                                    title="Add to cart"

                                  >

                                    View
                                  </button>
                                  <button
                                    className="add-button add_cart rounded-5    "
                                    title="Add to cart"

                                  >

                                    Add
                                  </button>
                                </div>


                              </div>
                              {/* product footer section */}
                              <div className="product-detail">
                                <div>
                                  <h6>{product.name}</h6>

                                  {/* <h4>
                                                                        ₹{offerPrice}
                                                                        {originalPrice > offerPrice && (
                                                                            <del>
                                                                                <span className="money">₹{originalPrice}</span>
                                                                            </del>
                                                                        )}
                                                                        {discountPercentage > 0 && (
                                                                            <span
                                                                                style={{ color: "green", marginLeft: "8px", fontSize: "14px" }}
                                                                            >
                                                                                {discountPercentage}% off
                                                                            </span>
                                                                        )}
                                                                        <span style={{ marginLeft: "10px", fontSize: "12px", color: "#555" }}>
                                                                            {activeVariant.packsize_title}
                                                                        </span>
                                                                    </h4> */}

                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <Col xs="12" className="text-center">
                        <div className="empty-cart-cls">

                          <h3><strong>No Products Found</strong></h3>
                          <h4>Try adjusting your filters.</h4>
                        </div>
                      </Col>
                    )}
                  </Row>

                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Col>
    </CommonLayout>
  );
};

export default Comboproducts;
