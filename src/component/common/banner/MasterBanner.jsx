import { Link } from "react-router-dom";

const MasterBanner = ({ img, }) => {
  // console.log(link)
  return (
    <Link to="shop/basmati-rice">
      <div align="cente">
        <img src={img} alt="" className="mobile-responsive-banner" style={{ width: '100%' }} />
      </div>
    </Link>

    /**********new banner part start**********/
    // <>
    //   <div className="maniBanner">
    //     <div><img src="./assets/images/banner.jpg" alt="" /></div>
    //     <div className="bannerDivider"><img src="./assets/images/banner-divider.svg" alt="" /></div>
    //   </div>
    // </>
    /**********new banner part end**********/

  );
};

export default MasterBanner;