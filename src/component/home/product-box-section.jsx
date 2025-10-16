import { Link } from "react-router-dom"
import { useProductContext } from "../../helpers/products/ProductContext"
import { Swiper, SwiperSlide } from "swiper/react"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

// Import Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "swiper/css/navigation"

// Import required modules
import { Autoplay, FreeMode, Pagination, Navigation } from "swiper/modules"

export const ProductBoxs = () => {
    const { categoryList } = useProductContext()
    // Skeleton placeholders (same structure as category cards)
    const skeletonItems = Array.from({ length: 4 })

    return (
        <div className="categoryPart">
            <div className="container">
                <div className="blackTitle text-center">
                    <h5>Flavourful finds</h5>
                    <h2>
                        <span>Shop By Category</span>
                    </h2>
                </div>
            </div>

            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        {categoryList?.loading ? (
                            //  Skeleton Loader while categories load
                            <div className="d-flex gap-4 justify-content-center flex-wrap">
                                {skeletonItems.map((_, i) => (
                                    <div
                                        key={i}
                                        className="categoryItem text-center"
                                        aria-hidden="true"
                                    >
                                        <Skeleton height={200} width={200} borderRadius={12} />
                                        <Skeleton width={140} height={24} className="mt-3" />
                                        <Skeleton width={100} height={36} className="mt-2" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            //  Swiper once categories are ready
                            <Swiper
                                freeMode={false}
                                navigation={false}
                                loop={true}
                                slidesPerView={1}
                                spaceBetween={20}
                                pagination={{ clickable: true }}
                                autoplay={{ delay: 2500, disableOnInteraction: false }}
                                breakpoints={{
                                    640: { slidesPerView: 2, spaceBetween: 25 },
                                    768: { slidesPerView: 3, spaceBetween: 20 },
                                    1024: { slidesPerView: 3, spaceBetween: 25 },
                                }}
                                style={{
                                    "--swiper-navigation-color": "#043b37",
                                    "--swiper-pagination-color": "#043b37",
                                }}
                                modules={[Autoplay, FreeMode, Pagination, Navigation]}
                                className="mySwiper pb-4"
                            >
                                {categoryList?.data?.map((item, index) => (
                                    <SwiperSlide key={index}>
                                        <Link
                                            to={`/shop/${item.slug}`}
                                            className="categoryItem"
                                        >
                                            <h4>{item.title}</h4>
                                            <div className="imgBx">
                                                <img
                                                    src={item.image[0]}
                                                    alt={item.title}
                                                    width="300"
                                                    height="300"
                                                    loading={index === 0 ? "eager" : "lazy"}
                                                />
                                                <button>
                                                    {item.total_products > 0
                                                        ? "SHOP NOW "
                                                        : "COMING SOON"}
                                                    <img
                                                        src="/assets/images/cart-icon-white.svg"
                                                        alt=""
                                                        width="20"
                                                        height="20"
                                                        loading="lazy"
                                                    />
                                                </button>
                                            </div>
                                        </Link>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </div>
                </div>

                <h3
                    className="mt-5 text-dark text-center"
                    style={{ fontSize: "30px" }}
                >
                    From Indian soil to global kitchens,
                    <br />
                    Jaisal carries the aroma of heritage and purity.
                </h3>
            </div>
        </div>
    )
}
