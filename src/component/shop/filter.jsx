import { Col, Media } from "reactstrap";
import Price from "./price";
import PackagingFilter from "./packageing_filter";
import { useCommonContext } from "../../helpers/common/CommonContext";
import { useEffect, useState } from "react";

const FilterPage = ({ sm, sidebarView, closeSidebar, categoryDetail }) => {
  const { BannerData, getStoreBanners } = useCommonContext();
  const { FeatureSection, getFeatureSections } = useCommonContext();
  const [newArrivalProducts, setNewArrivalProducts] = useState([]);
  const [sliderData, setSliderData] = useState([]);

  // useEffect(() => {
  //   if (!BannerData?.data || BannerData?.data?.length === 0) {
  //     getStoreBanners();
  //   }
  //   if (BannerData?.data?.length > 0) {
  //     const src = BannerData?.data?.filter((item) => item?.type === "parallax");
  //     if (src?.length > 0) {
  //       setSliderData(src[0] || null);
  //     }
  //   }
  // }, [BannerData?.data]);
  // // console.log(sliderData);

  // useEffect(() => {
  //   if (!FeatureSection?.data || FeatureSection?.data?.length === 0) {
  //     getFeatureSections();
  //   }
  //   Array.isArray(FeatureSection?.data) &&
  //     FeatureSection?.data?.forEach((item) => {
  //       if (item?.title === "New Arrival") {
  //         setNewArrivalProducts(item?.products);
  //       }
  //     });
  // }, [FeatureSection?.data]);
  return (
    <>
      <Col
        sm={sm}
        className="collection-filter"
        style={sidebarView ? { left: "0px" } : {}}
      >
        {/* <!-- side-bar colleps block stat --> */}
        <div className="collection-filter-block sticky-top stickySidebar">
          {/* <!-- brand filter start --> */}
          <div
            className="collection-mobile-back"
            onClick={() => closeSidebar()}
          >
            <span className="filter-back">
              <i className="fa fa-angle-left" aria-hidden="true"></i> back
            </span>
          </div>
          <PackagingFilter categoryDetail={categoryDetail} />
          <Price />
        </div>
      </Col>
    </>
  );
};

export default FilterPage;
