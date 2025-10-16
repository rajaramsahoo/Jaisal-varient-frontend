import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Media } from "reactstrap";
import { useCartlistContext } from "../../../helpers/cart/AddCartContext";
import { FaXmark } from "react-icons/fa6";

const CartHeader = ({ item }) => {
  const { removeFromCartlist, remove } = useCartlistContext();

  return (
    <Fragment>
      {!remove ? (
        <li className="position-relative px-2 pt-2">
          <div className="media">
            <Link to={`/product-details/${item?.item_details?._id}`} className="p-0">
              <Media
                alt=""
                className="me-3"
                src={`${item?.item_details.images[0]}`}
                width="50"
              />
            </Link>
            <div className="media-body">
              <Link to={`/product-details/${item?.item_details?._id}`} className="p-0">
                <h6 style={{fontSize: 14, lineHeight: '130%'}}>{item?.item_details?.itemName}</h6>
              </Link>
              <h4>
                <span style={{ fontSize: 16 }}>₹ {item?.item_details?.price}</span>
              </h4>
            </div>
          </div>
          <div
            type="button"
            onClick={() => removeFromCartlist(item?.item_details?._id)}
            style={{ right: 8, top: 8 }}
            className="close-circle position-absolute"
          >
            <FaXmark color="#808080" />
          </div>
        </li>
      ) : (
        <div className="col-md-12 d-flex justify-content-center ">
          <div className="spinner-grow text-info my-4" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default CartHeader;
