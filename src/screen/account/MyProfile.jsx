import React from "react";
import "./myProfile.css";
import CommonLayout from "../../component/shop/common-layout";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../helpers/auth/authContext";

const MyProfile = () => {
  const { userData } = useAuthContext();

  // console.log(userData)
  return (
    <CommonLayout parent="home" title="My Account">
      {/* page body part start */}
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
              <div className="dashboard-right">
                <div className="dashboard">
                  <div className="welcome-msg">
                    {userData?.name && (
                      <p>
                        <b>Hello, {userData?.name} </b>
                      </p>
                    )}
                    <p>Welcome To Jaisal : Har Ghar ka Saar</p>
                    <br />
                    <div className="page-title">
                      <h2>My Account</h2>
                    </div>
                    <div className="table-responsive">
                      <table className="table table-bordered mb-0">
                        <tbody>
                          <tr>
                            <td>Name</td>
                            <td>{userData?.name}</td>
                          </tr>
                          <tr>
                            <td>Email</td>
                            <td>{userData?.email}</td>
                          </tr>
                          <tr>
                            <td>Mobile</td>
                            <td>{userData?.mobile}</td>
                          </tr>
                          {userData?.address_line_1 && (
                            <tr>
                              <td>Address</td>
                              <td>
                                {userData?.address_line_1}, {userData?.city},{" "}
                                {userData?.state}, {userData?.postal_code}
                              </td>
                              <td>{userData?.address_line_2}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <br />
                    <Link
                      className="btn btn-solid btn btn-secondary"
                      to="/account/update/my-profile"
                    >
                      Edit My Account
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* page body part end */}
    </CommonLayout>
  );
};

export default MyProfile;
