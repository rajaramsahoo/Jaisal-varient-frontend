import React, { Fragment, useEffect, useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import ReactPlayer from "react-player";
import { useCommonContext } from "../helpers/common/CommonContext";
import JaisalLoader from "../component/common/JaisalLoader";
// ----------------------
// Lazy Components (safe default exports)
// ----------------------
const HeaderOne = lazy(() =>
  import("../component/Header/Header").then((m) => ({ default: m.default || m.HeaderOne }))
);
const Banner = lazy(() =>
  import("../component/common/banner/banner").then((m) => ({ default: m.default || m.Banner }))
);
const MidBanner = lazy(() =>
  import("../component/home/min-banner").then((m) => ({ default: m.default || m.MidBanner }))
);
const ProductBoxs = lazy(() =>
  import("../component/home/product-box-section").then((m) => ({ default: m.default || m.ProductBoxs }))
);
const Bestseller = lazy(() =>
  import("../component/home/Bestseller").then((m) => ({ default: m.default || m.Bestseller }))
);
const NewFooter = lazy(() =>
  import("../component/footer/NewFooter").then((m) => ({ default: m.default || m.NewFooter }))
);

// ----------------------
// Loader Component
// ----------------------
const Loader = () => (
  <div className="d-flex justify-content-center align-items-center p-5">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

function HomePage() {
  const {
    eventList,
    getEventsList,
    recipes,
    getRecipes,
    getHomeScreenReview,
    homeScreenReview,
    getAllComboOfferProduct,
    comboOfferList,
  } = useCommonContext();

  const [show, setShow] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [des, setDes] = useState("");
  const [itemName, setItemName] = useState("");

  const handleClose = () => {
    setShow(false);
    setVideoUrl("");
  };
  const handleShow = (url, dess, itemName) => {
    setShow(true);
    setVideoUrl(url);
    setDes(dess);
    setItemName(itemName);
  };

  // ----------------------
  // API calls
  // ----------------------
  // useEffect(() => {
  //   if (eventList?.loading === true) {
  //     getEventsList();
  //   }
  // }, [eventList.loading]);

  useEffect(() => {
    getRecipes();
    getHomeScreenReview();
    getAllComboOfferProduct();
  }, []);

  return (
    <Fragment>
      {/* ---------------------- 
          Header + Banner
      ---------------------- */}
      <Suspense fallback={<JaisalLoader />}>
        <HeaderOne topClass="top-header" />
        <Banner />
        <MidBanner />
      </Suspense>

      {/* ---------------------- 
          News Marquee
      ---------------------- */}
      <div className="newsPart">
        <div className="newsBx">
          <div className="container-fluid pe-0 ps-0">
            {comboOfferList?.data?.length > 0 ? (
              <marquee>
                <ul>
                  {[...Array(3)].map((_, loopIndex) =>
                    comboOfferList.data.map((item, index) => (
                      <React.Fragment key={`${loopIndex}-${index}`}>
                        <li>
                          <a>FREE</a>
                        </li>
                        <li>
                          <a>{item.name}</a>
                        </li>
                      </React.Fragment>
                    ))
                  )}
                </ul>
              </marquee>
            ) : (
              <marquee>
                <ul>
                  {[...Array(3)].map((_, index) => (
                    <React.Fragment key={index}>
                      <li>
                        <a>JAISAL ORGANIC ESSENCE OF EVERY HOME</a>
                      </li>
                      <li>
                        <a>JAISAL ORGANIC ESSENCE OF EVERY HOME</a>
                      </li>
                      <li>
                        <a>JAISAL ORGANIC ESSENCE OF EVERY HOME</a>
                      </li>
                    </React.Fragment>
                  ))}
                </ul>
              </marquee>
            )}
          </div>
        </div>
      </div>

      {/* ---------------------- 
          Product Sections
      ---------------------- */}
      <Suspense fallback={<JaisalLoader />}>
        <ProductBoxs />
        <Bestseller />
      </Suspense>

      {/* ---------------------- 
          Recipes Section
      ---------------------- */}
      <div className="categoryPart recipePart">
        <div className="container">
          <div className="blackTitle" align="center">
            <h2 align="center">
              <span>FEAST SPECIAL RECIPES</span>
            </h2>
            <Link className="btn" to="/recipes">
              SEE ALL RECIPES <i className="fa fa-chevron-right"></i>
            </Link>
          </div>
        </div>
        <div className="container">
          <div className="row">
            {recipes?.data?.slice(0, 4).map((item, index) => (
              <div key={index} className="col-md-3 col-sm-6 col-6">
                <div className="recipeItem">
                  <div className="imgBx">
                    <img src={item?.images[0]} alt="" loading="lazy" />
                  </div>
                </div>
                <h6>{item?.title}</h6>

                <button
                  className="btn btnMore"
                  onClick={() =>
                    handleShow(item.videoLink, item.description, item.title)
                  }
                >
                  READ MORE
                </button>
              </div>
            ))}

            <Modal
              className="recipeModal"
              size="lg"
              show={show}
              onHide={handleClose}
            >
              <Modal.Header closeButton>
                <Modal.Title>{itemName}</Modal.Title>
              </Modal.Header>
              <Modal.Body style={{ overflow: "hidden" }}>
                {videoUrl ? (
                  <ReactPlayer height="400px" width="100%" url={videoUrl} />
                ) : (
                  <p>{des}</p>
                )}
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </div>

      {/* ---------------------- 
          Testimonials + Footer
      ---------------------- */}
      <div className="testimonialsSection">
        <div className="container">
          <div className="blackTitle" align="center">
            <h2 align="center">
              <span>Why people love JAISAL</span>
            </h2>
          </div>
        </div>
        <div className="container">
          <div className="row">
            {homeScreenReview?.data?.map((item, index) => (
              <div key={index} className="col-md-4 item">
                <div className="innerBx">
                  <p>{item.review}</p>
                  <h5>{item.user_name}</h5>
                  <div className="starBx">
                    {[...Array(item.rating)].map((_, i) => (
                      <i key={i} className="fa fa-star"></i>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="certificatBx container">
          <h4>We are Certified With</h4>
          <ul>
            {Array.from({ length: 8 }, (_, i) => (
              <li key={i}>
                <img
                  src={`/assets/images/certificat/certificat-${i + 1}.png`}
                  alt=""
                  loading="lazy"
                />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <img
            src="/assets/images/upper-footer-bg.webp"
            alt="upeer-footer-bg"
            style={{ width: "100%" }}
            loading="lazy"
          />
        </div>
      </div>

      <Suspense fallback={<JaisalLoader />}>
        <NewFooter />
      </Suspense>
    </Fragment>
  );
}

export default HomePage;
