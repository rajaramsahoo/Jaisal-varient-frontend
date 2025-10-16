import React, { useState, useEffect } from "react";
import CommonLayout from "../../component/shop/common-layout";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../helpers/auth/authContext";
import { useCartlistContext } from "../../helpers/cart/AddCartContext";

const EditMyProfile = () => {
  const { userData, updateUserProfile, updateLoading } = useAuthContext();
  const { getStateList, stateList } = useCartlistContext();

  // Use array destructuring for useState
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
  });

  // Update formData with userData on component mount
  useEffect(() => {
    if (userData) {
      setFormData({
        first_name: userData?.first_name || "",
        last_name: userData?.last_name || "",
        email: userData?.email || "",
        mobile: userData?.mobile || "",
        address_line_1: userData?.address_line_1 || "",
        address_line_2: userData?.address_line_2 || "",
        city: userData?.city || "",
        state: userData?.state || "",
        postal_code: userData?.postal_code || "",
      });
    }
  }, [userData]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
  };

  useEffect(() => {
    if (stateList?.data?.length === 0) {
      getStateList("India");
    }
  }, []);

  return (
    <CommonLayout parent="home" title="Update Profile">
      <section className="section-b-space">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <div className="dashboard-left">
                <div className="collection-mobile-back">
                  <Link to="/" className="filter-back">
                    <i className="fa fa-angle-left" aria-hidden="true" /> back
                  </Link>
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
                    <div className="page-title">
                      <h2>Update Profile</h2>
                    </div>
                    <hr />
                    <form onSubmit={handleSubmit} className="row g-3">
                      {/* First Name */}
                      <div className="col-md-6">
                        <label htmlFor="first_name" className="form-label">
                          First Name
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          placeholder="Enter your first name"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      {/* Last Name */}
                      <div className="col-md-6">
                        <label htmlFor="last_name" className="form-label">
                          Last Name
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          placeholder="Enter your last name"
                          onChange={handleChange}
                          disabled={!formData.first_name}
                          required
                        />
                      </div>
                      {/* Email */}
                      <div className="col-md-6">
                        <label htmlFor="email" className="form-label">
                          Email ID
                        </label>
                        <input
                          className="form-control"
                          type="email"
                          name="email"
                          value={formData.email}
                          placeholder="Enter your email"
                          onChange={handleChange}
                          required
                          disabled={!formData.last_name}
                        />
                      </div>
                      {/* Mobile */}
                      <div className="col-md-6">
                        <label htmlFor="mobile" className="form-label">
                          Mobile No.
                        </label>
                        <input
                          className="form-control"
                          type="number"
                          name="mobile"
                          value={formData.mobile}
                          placeholder="Enter your mobile number"
                          onChange={handleChange}
                          required
                          disabled
                        />
                      </div>
                      {/* State */}
                      <div className="col-md-6">
                        <label htmlFor="state" className="form-label">
                          State
                        </label>
                        <select
                          name="state"
                          id="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="form-control"
                          disabled={!formData.mobile}
                        >
                          <option value="">
                            {formData.state || "Select State"}
                          </option>
                          {stateList?.data?.map((state) => (
                            <option key={state._id} value={state.title}>
                              {state.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* City */}
                      <div className="col-md-6">
                        <label htmlFor="city" className="form-label">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          id="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="form-control"
                          disabled={!formData.state}
                          required
                        />
                      </div>
                      {/* Postal Code */}
                      <div className="col-md-6">
                        <label htmlFor="postal_code" className="form-label">
                          Postal Code
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          name="postal_code"
                          value={formData.postal_code}
                          placeholder="Enter postal code"
                          onChange={handleChange}
                          required
                          disabled={!formData.city}
                        />
                      </div>
                      {/* Address Line 1 */}
                      <div className="col-md-6">
                        <label htmlFor="address_line_1" className="form-label">
                          Address Line 1
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          name="address_line_1"
                          value={formData.address_line_1}
                          placeholder="Enter address line 1"
                          onChange={handleChange}
                          required
                          disabled={!formData.postal_code}
                        />
                      </div>
                      {/* Address Line 2 */}
                      <div className="col-md-6">
                        <label htmlFor="address_line_2" className="form-label">
                          Address Line 2
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          name="address_line_2"
                          value={formData.address_line_2}
                          placeholder="Enter address line 2"
                          onChange={handleChange}
                          disabled={!formData.address_line_1}
                        />
                      </div>
                      <div className="col-12">
                        <button
                          type="submit"
                          className="btn btn-solid btn-secondary mt-4"
                          disabled={updateLoading}
                        >
                          {updateLoading ? "Updating..." : "Update My Account"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </CommonLayout>
  );
};

export default EditMyProfile;
