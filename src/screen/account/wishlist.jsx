import React from "react";
import CommonLayout from "../../component/shop/common-layout";
import WishListDetail from "./component/wishList-detail";
import Sidebar from "./Sidebar";
const WishlistPage = () => {
  return (
    <CommonLayout parent="home" title="wishlist">
      {/* page body part start */}
      {/* <section className="mb-5" style={{ minHeight: "350px" }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <WishListDetail />
            </div>
          </div>
        </div>
      </section> */}
    <section className="section-b-space">
<div className="container">
    <div className="row">
       <div className="col-lg-3 z-0">
              <div className="dashboard-left">
                <div className="collection-mobile-back">
                  <span className="filter-back">
                    <i className="fa fa-angle-left" aria-hidden="true" /> back
                  </span>
                </div>
                <div className="block-content">
                  <Sidebar />
                </div>
              </div>
            </div>
            <div className="col-lg-9">
              <WishListDetail />
            </div> 
    </div>
</div>
      </section>
      {/* page body part end */}
    </CommonLayout>
  );
};

export default WishlistPage;
