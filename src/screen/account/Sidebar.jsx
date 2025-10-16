import React from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../helpers/auth/authContext";
import { AiOutlineUser, AiOutlineShoppingCart, AiOutlineHeart, AiOutlineHome, AiOutlineLogout } from "react-icons/ai";

const Sidebar = () => {
  const { handleLogout } = useAuthContext();

  return (
    <ul className="sidebar">
      <li>
        <Link to="/account/my-profile">
          <AiOutlineUser className="icon" /> My Account
        </Link>
      </li>
      <li>
        <Link to="/account/my-order">
          <AiOutlineShoppingCart className="icon" /> My Order
        </Link>
      </li>
      <li>
        <Link to="/account/wishlist">
          <AiOutlineHeart className="icon" /> Wishlist
        </Link>
      </li>
      <li>
        <Link to="/account/saved-address">
          <AiOutlineHome className="icon" /> Saved Address
        </Link>
      </li>
      <li className="last">
        <button className="btn" onClick={handleLogout}>
          <AiOutlineLogout className="icon" /> Log Out
        </button>
      </li>
    </ul>
  );
};

export default Sidebar;
