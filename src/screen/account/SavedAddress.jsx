import React, { useEffect, useState } from "react";
import CommonLayout from "../../component/shop/common-layout";
import Sidebar from "./Sidebar";
import AddressModal from "./AddressModal";
import { useAuthContext } from "../../helpers/auth/authContext";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const SavedAddress = () => {
  const { userAddressList, addressList, userAddressDelete } = useAuthContext();
  const [removingItem, setRemovingItem] = useState(null);

  const handleDelete = async (itemId) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this Address?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setRemovingItem(itemId);
        userAddressDelete(itemId).finally(() => {
          setRemovingItem(null);
          MySwal.fire(
            "Removed!",
            "The Address has been removed from your cart.",
            "success"
          );
        });
      }
    });
  };

  useEffect(() => {
    if (Object.keys(addressList.data || {}).length === 0) {
      userAddressList();
    }
  }, []);

  return (
    <CommonLayout parent="home" title="saved address">
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
                    <div className="page-title">
                      <h2>Saved Address</h2>
                    </div>
                    <hr />
                    {/* Check if loading */}
                    {addressList?.loading ? (
                      <div className="col-md-12 d-flex justify-content-center">
                        <div
                          className="spinner-grow text-info my-4"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        {Array.isArray(addressList?.data?.billing_address) ? (
                          <>
                            {addressList?.data?.billing_address.length > 0 && (
                              <>
                                <h3>Billing Address</h3>
                                {Array.isArray(
                                  addressList?.data?.billing_address
                                ) &&
                                  addressList?.data?.billing_address?.map(
                                    (item, i) => (
                                      <div
                                        className="p-3 rounded bg-secondary bg-opacity-10 mb-3 d-flex justify-content-between align-items-center"
                                        key={i}
                                      >
                                        <div>
                                          <h4>
                                            <b>{`${item.first_name} ${item.last_name}`}</b>
                                          </h4>
                                          <p>
                                            {`${item.address_line_1}, ${item.state}, ${item.city}, ${item.postal_code}`}
                                          </p>
                                          <p>{`${item.address_line_2}, ${item.state}`}</p>
                                        </div>

                                        {/* Edit and Delete Icons */}
                                        <div className="d-flex align-items-center">
                                          <AddressModal
                                            edit="true"
                                            data={item || {}}
                                            addresstype="billing_address"
                                          />
                                          <button
                                            className="btn btn-outline-danger btn-sm d-flex align-items-center"
                                            onClick={() =>
                                              handleDelete(item?._id)
                                            }
                                          >
                                            <FaTrash className="me-1" />
                                            {removingItem === item?._id ? (
                                              <span className="spinner-border spinner-border-sm me-2" />
                                            ) : (
                                              "Delete"
                                            )}
                                          </button>
                                        </div>
                                      </div>
                                    )
                                  )}
                              </>
                            )}
                            {addressList?.data?.shipping_address.length > 0 && (
                              <>
                                <h3>Shipping Address</h3>
                                {Array.isArray(
                                  addressList?.data?.shipping_address
                                ) &&
                                  addressList?.data?.shipping_address?.map(
                                    (item, i) => (
                                      <div
                                        className="p-3 rounded bg-secondary bg-opacity-10 mb-3 d-flex justify-content-between align-items-center"
                                        key={i}
                                      >
                                        <div>
                                          <h4>
                                            <b>{`${item.first_name} ${item.last_name}`}</b>
                                          </h4>
                                          <p>
                                            {`${item.address_line_1}, ${item.state}, ${item.city}, ${item.postal_code}`}
                                          </p>
                                          <p>
                                            {`${item.address_line_2}, ${item.state}`}
                                          </p>
                                        </div>
                                        <div className="d-flex align-items-center">
                                          <AddressModal
                                            edit="true"
                                            data={item || {}}
                                            addresstype="shipping_address"
                                          />
                                          <button
                                            className="btn btn-outline-danger btn-sm d-flex align-items-center"
                                            onClick={() =>
                                              handleDelete(item?._id)
                                            }
                                          >
                                            <FaTrash className="me-1" />
                                            Delete
                                          </button>
                                        </div>
                                      </div>
                                    )
                                  )}
                              </>
                            )}
                          </>
                        ) : (
                          <div className="text-center">
                            <h3>No addresses found.</h3>
                          </div>
                        )}
                      </>
                    )}
                    <div className="mt-4">
                      <AddressModal />
                    </div>
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

export default SavedAddress;
