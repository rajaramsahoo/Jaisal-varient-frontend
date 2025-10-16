import { Link, useNavigate } from "react-router-dom";
import FadeInLeft from "../animations/fade-in-left";
import FadeInRight from "../animations/fade-in-right";
import { Swiper, SwiperSlide } from "swiper/react";
import axios from "../../helpers/axios";
import { toast } from "react-toastify";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import './styles.css';

// import required modules
import { Autoplay, FreeMode, Pagination, Navigation } from "swiper/modules";
import { useCommonContext } from "../../helpers/common/CommonContext";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../helpers/auth/authContext";
import { useCartlistContext } from "../../helpers/cart/AddCartContext";
export const MidBanner = () => {
  const {
    getAllComboOfferProduct,
    comboOfferList,
  } = useCommonContext();

  const { token, isLogin } = useAuthContext();
  const { offerProductAddedTocart } = useCartlistContext();
  const navigate = useNavigate();
  // useEffect(() => {
  //   getAllComboOfferProduct();
  // }, []);

  const handleClick = async (slug) => {
    await offerProductAddedTocart(slug);
  };
  return (
    <>
      <Swiper
        spaceBetween={30}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        loop={comboOfferList?.data?.length > 1}
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
        {comboOfferList?.data?.length === 0 ? (
          <SwiperSlide>
            <div className="bigProductPart" onClick={() => toast.warning(" Combo Products coming soon ")}>
              <div className="imgBx">
                <img src="https://res.cloudinary.com/dshkgcwoh/image/upload/v1755343157/fubkjyahf6bm5mg0wymw.jpg" alt="No combo available" loading="lazy" />
              </div>
            </div>
          </SwiperSlide>
        ) : (
          comboOfferList?.data?.map((item, index) => (
            <SwiperSlide key={`${item._id}-${index}`}>
              <div
                className="bigProductPart"
              // onClick={() => handleClick(item?.slug)}
              >

                <Link className="btnShopNow" to="" onClick={() => handleClick(item?.slug)}>Shop Now</Link>

                <div className="imgBx">
                  <img src={item?.image_url} alt={item?.name} loading="lazy" />
                </div>
              </div>
            </SwiperSlide>
          ))
        )}

      </Swiper>
    </>
  );
};
