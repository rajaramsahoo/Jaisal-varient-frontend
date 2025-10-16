import React, { useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, FreeMode, Pagination, Navigation } from "swiper/modules";
import { useProductContext } from "../../helpers/products/ProductContext";
import { useCartlistContext } from "../../helpers/cart/AddCartContext";
import { useNavigate } from "react-router-dom";
const Bestseller = () => {
  const { categoryList, setCurrentCategorySlug, products, } = useProductContext();
  const {
    addToCart,
    quantity,
    setQuantity,
    setCartModalShow,
  } = useCartlistContext();

  const navigate = useNavigate();
  const [target, setTarget] = React.useState(null);
  const handleTabClick = (target) => {
    setTarget(target);
  };

  const defaultCategoryKey =
    categoryList?.data?.length > 0 ? categoryList.data[0].slug : "";
  const handleAddtoCart = (id, product) => {
    addToCart(id, quantity);
    setQuantity(1);
    setCartModalShow(true);
  };
  const handleClick = (e, id, product) => {
    e.preventDefault();
    navigate(`/product-details/${id}`,
      {
        state: {
          itemName: product?.itemName,
          category_name: product?.category_name
        }
      }
    );
  };

  return (
    <div className="bestSeller">
      <div className="mainBx">
        <h2 align="cente">
          <span>best sellers</span>
        </h2>

        {/* tab work start */}
        <Tabs
          defaultActiveKey={defaultCategoryKey}
          id="product-category-tabs"
          className="mb-3"
          onSelect={(selectedKey) => {
            setTarget(selectedKey);

            if (selectedKey === "" || selectedKey === "All") {
              setCurrentCategorySlug(""); // reset slug for "All"
            } else {
              setCurrentCategorySlug(selectedKey); // set selected category slug
            }
          }}
        >
          {/* Static "All" Tab */}
          <Tab eventKey="" title="All" >
            {!products.data || products.data === 0 ? (
              <h4 className="mt-3" align="center">
                <img
                  src="/assets/images/seller/tin-patti-left.svg"
                  alt=""
                  style={{ width: "42px" }}
                  loading="lazy"
                />{" "}
                Coming Soon{" "}
                <img
                  src="/assets/images/seller/tin-patti-right.svg"
                  alt=""
                  style={{ width: "42px" }}
                  loading="lazy"
                />
              </h4>
            ) : (
              <Swiper
                freeMode={false}
                navigation={false}
                loop={products.data.length > 3}
                pagination={{ clickable: true }}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                breakpoints={{
                  640: { slidesPerView: Math.min(2, products.data.length), spaceBetween: 15 },
                  768: { slidesPerView: Math.min(3, products.data.length), spaceBetween: 15 },
                  1024: { slidesPerView: Math.min(3, products.data.length), spaceBetween: 15 },
                }}

                modules={[Autoplay, FreeMode, Pagination, Navigation]}
                style={{
                  "--swiper-navigation-color": "#fff",
                  "--swiper-pagination-color": "#fff",
                }}
                className="mySwiper"
              >
                {products.data.map((item, index) => (
                  <SwiperSlide key={index}>
                    <div align="center">
                      <div
                        className="bestProductItem position-relative"
                        onClick={(e) => handleClick(e, item?._id, item)}
                      >
                        <a>
                          <img src={item.image} alt={item.itemName} loading="lazy" />
                        </a>
                        <div
                          className="productThumb position-absolute justify-content-center align-items-center text-white"
                          style={{
                            backgroundImage:
                              'url("/assets/images/price_tag.png")',
                          }}
                        >
                          ₹
                          {item.sale_price && item.sale_price > 0
                            ? item.sale_price
                            : item.offer_price && item.offer_price > 0
                              ? item.offer_price
                              : item.price}
                          <div><s>₹{item.price}</s></div>

                        </div>
                      </div>
                      <a
                        className="btn"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault(); // Prevent page jump
                          handleAddtoCart(item._id, item);
                        }}
                      >
                        Add to Cart&nbsp;
                        <img
                          src="/assets/images/cart-icon-white.svg"
                          style={{ width: "22px" }}
                          alt=""
                          loading="lazy"
                        />
                      </a>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </Tab>

          {/* Dynamic Category Tabs */}
          {categoryList?.data?.map((category) => {

            return (
              <Tab
                eventKey={category.slug}
                title={category.title}
                key={category.slug}
                onClick={() => setCurrentCategorySlug(category.slug)}
              >
                {products.data.length === 0 ? (
                  <h4 className="mt-3" align="center">
                    <img
                      src="/assets/images/seller/tin-patti-left.svg"
                      alt=""
                      style={{ width: "42px" }}
                      loading="lazy"
                    />{" "}
                    Coming Soon{" "}
                    <img
                      src="/assets/images/seller/tin-patti-right.svg"
                      alt=""
                      style={{ width: "42px" }}
                      loading="lazy"
                    />
                  </h4>
                ) : (
                  <Swiper
                    freeMode={true}
                    navigation={false}
                    loop={true}
                    // loop={products.data.length > 3}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 2500, disableOnInteraction: false }}
                    breakpoints={{
                      640: { slidesPerView: Math.min(2, products.data.length), spaceBetween: 15 },
                      768: { slidesPerView: Math.min(3, products.data.length), spaceBetween: 15 },
                      1024: { slidesPerView: Math.min(3, products.data.length), spaceBetween: 15 },
                    }}
                    modules={[Autoplay, FreeMode, Pagination, Navigation]}
                    className="mySwiper"
                  >
                    {products.data.map((item, index) => (
                      <SwiperSlide key={index}>
                        <div align="center">
                          <div
                            className="bestProductItem position-relative"
                            onClick={(e) => handleClick(e, item._id, item)}
                          >
                            <a>
                              <img src={item.image} alt={item._id} loading="lazy" />
                            </a>

                            <div
                              className="productThumb position-absolute justify-content-center align-items-center text-white"
                              style={{
                                backgroundImage:
                                  'url("/assets/images/price_tag.png")',
                              }}
                            >
                              ₹
                              {item.sale_price && item.sale_price > 0
                                ? item.sale_price
                                : item.offer_price && item.offer_price > 0
                                  ? item.offer_price
                                  : item.price}
                              <div><s>₹{item.price}</s></div>

                            </div>
                          </div>

                          <a
                            className="btn"
                            href="#"
                            onClick={(e) => {
                              e.preventDefault(); // Prevent page jump
                              handleAddtoCart(item._id, item);
                            }}
                          >
                            &nbsp;Add to Cart&nbsp;
                            <img
                              src="/assets/images/cart-icon-white.svg"
                              style={{ width: "22px" }}
                              alt="Cart Icon"
                              loading="lazy"
                            />
                          </a>


                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </Tab>
            );
          })}
        </Tabs>

        {/* tab work end */}
        <h4 className="mt-3" align="center">
          <img
            src="/assets/images/seller/tin-patti-left.svg"
            alt="tin-patti-left"
            style={{ width: "42px" }}
            loading="lazy"
          />{" "}
          100% Natural & Pure | Extra Long Grains | Aromatic & Fluffy{" "}
          <img
            src="/assets/images/seller/tin-patti-right.svg"
            alt="tin-patti-right"
            style={{ width: "42px" }}
            loading="lazy"
          />
        </h4>
      </div>
      {/* ecommarce link part start */}
      <div className="ecommarceLink">
        <ul>
          <li>
            <a>
              <img src="/assets/images/seller/amazon.png" alt="amazon" loading="lazy" />
            </a>
          </li>
          <li>
            <a>
              <img src="/assets/images/seller/flipkart.png" alt="flipkart" loading="lazy" />
            </a>
          </li>
          <li>
            <a>
              <img src="/assets/images/seller/blinkit.png" alt="blinkit" loading="lazy" />
            </a>
          </li>
          {/* <li><a><img src="/assets/images/seller/mesho.png" alt="" /></a></li> */}
        </ul>
      </div>
      {/* ecommarce link part end */}
    </div>
  );
};

export default Bestseller;

