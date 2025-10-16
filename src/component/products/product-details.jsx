import { useState, useEffect, } from "react";
import Slider from "react-slick";
import { Container, Row, Col, Media, Spinner } from "reactstrap";
import { useLocation } from "react-router-dom";
import DetailsWithPrice from "./right-side-detail";
import ProductTab from "./product.-tab";
import { useProductContext } from "../../helpers/products/ProductContext";
import { useCartlistContext } from "../../helpers/cart/AddCartContext";
import { useCommonContext } from "../../helpers/common/CommonContext";
import ImageMagnifier from "./ImageMagnifier";

const ProductDetails = ({ pathId }) => {
  const { setQuantity, setStock, setAvailability } = useCartlistContext();
  const {
    productDetail,
    getProductDetail,
    newArrivalProducts,
    setNewArrivalProducts,
  } = useProductContext();
  const { FeatureSection, getFeatureSections } = useCommonContext();
  useEffect(() => {
    if (pathId) {
      getProductDetail(pathId);
      setQuantity(1);
      setStock("");
      setAvailability({ loading: false, message: "", status: false });
    }
  }, [pathId]);

  useEffect(() => {
    if (!FeatureSection?.data || FeatureSection?.data?.length === 0) {
      getFeatureSections();
    }
    Array.isArray(FeatureSection?.data) &&
      FeatureSection?.data?.forEach((item) => {
        if (item?.title === "New Arrival") {
          setNewArrivalProducts(item?.products);
        }
      });
  }, [FeatureSection?.data]);
  var products = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    arrows: true,
    fade: true,
  };

  const sliderNav = {
    slidesToShow: productDetail?.data?.images?.length || 1,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    adaptiveHeight: true,
    focusOnSelect: true,
  };

  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const [slider1, setSlider1] = useState(null);
  const [slider2, setSlider2] = useState(null);

  useEffect(() => {
    setNav1(slider1);
    setNav2(slider2);
  }, [slider1, slider2]);

  const changeColorVar = (img_id) => {
    slider2.current?.slickGoTo(img_id);
  };

  return (
    <section className="">
      <div className="collection-wrapper">
        <Container>

          <Row>
            {/* Conditional Rendering: Show loader if productDetail is loading */}
            {productDetail?.loading ? (
              <Col className="text-center">
                <Spinner color="danger" />
                <p>Loading product details...</p>
              </Col>
            ) : (
              <>
                <Col
                  md="5" sm="6" xs="12"
                  className="product-thumbnail dtlSlider"
                  style={{ overflow: "hidden" }}
                >
                  <Slider
                    {...products}
                    asNavFor={nav2}
                    ref={(slider) => setSlider1(slider)}
                    className="product-slick bigImg"
                  >
                    {productDetail?.data?.images?.map((vari, index) => (
                      <div key={index}>
                        <ImageMagnifier imgUrl={vari} />
                      </div>
                    ))}
                  </Slider>

                  {productDetail?.data?.images?.length > 1 && (
                    <Slider
                      className="slider-nav"
                      {...sliderNav}
                      asNavFor={nav1}
                      ref={(slider) => setSlider2(slider)}
                    >
                      {productDetail?.data?.images?.map((item, i) => (
                        <div key={i}>
                          <Media
                            src={item}
                            key={i}
                            alt={item.alt || "Product image"}
                            className="img-fluid"
                          />
                        </div>
                      ))}
                    </Slider>
                  )}
                </Col>

                <Col md="7" sm="6" xs="12" className="rtl-text product-ps">
                  <DetailsWithPrice
                    item={productDetail?.data}
                    changeColorVar={changeColorVar}
                  />
                </Col>
              </>
            )}
          </Row>

          {!productDetail?.loading && (
            <ProductTab item={productDetail?.data} />
          )}
        </Container>
      </div>
    </section>
  );
};

export default ProductDetails;
