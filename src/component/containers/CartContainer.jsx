// import { Fragment } from "react";
// import { Link } from "react-router-dom";
// import CartHeader from "../common/cart/cart-header";
// import { useCartlistContext } from "../../helpers/cart/AddCartContext";

// const CartContainer = ({ icon }) => {
//   const { cartlistData } = useCartlistContext();

//   return (
//     <Fragment>
//       <li className="onhover-div mobile-cart cart-ui-fix">

//         {cartlistData.loading ? (
//           <div className="cart-qty-cls">
//             <div className="spinner-border text-primary" role="status">
//               <span className="sr-only">Loading...</span>
//             </div>
//           </div>
//         ) : (
//           <Link to="/account/cart" className="py-0 position-absolute">
//             {/*<div className="cart-qty-cls" style={{ top: "-8px"}}> 
//               {cartlistData?.data?.items?.length || 0}
//             </div>*/}
//           </Link>
//         )}

//         <Link to="/account/cart" className="cartLink" ><img src="/assets/images/icon/cart-icon.svg" alt="" />Cart</Link>
//         <ul className="show-div shopping-cart">
//           {Array.isArray(cartlistData?.data?.items) &&
//             cartlistData?.data?.items?.map((item, index) => (
//               <CartHeader key={index} item={item} />
//             ))}
//           {cartlistData?.data?.items?.length > 0 ? (
//             <div>
//               <li className="d-flex justify-content-end px-3 m-0">
//                 <div className="total d-flex justify-content-between py-2" style={{width: "100%"}}>
//                   <span>Sub Total :</span>
//                   <span>₹ {cartlistData?.data?.total_cart_price}</span>
//                 </div>
//               </li>
//               <li className="p-3" style={{ width: "100%" }}>
//                 <div className="d-flex justify-content-between align-items-center" style={{ width: "100%" }}>
//                   <Link to={`/account/cart`} className="btn" style={{ fontWeight: "600" }}>View cart</Link>
//                   <Link to={`/page/account/checkout`} className="checkout btn" style={{ fontWeight: "600" }}>
//                     Checkout
//                   </Link>
//                 </div>
//               </li>
//             </div>
//           ) : (
//             <li>
//               <h5>Your cart is currently empty.</h5>
//             </li>
//           )}
//         </ul>

//       </li>
//     </Fragment>
//   );
// };

// export default CartContainer;
import { Fragment } from "react";
import { Link } from "react-router-dom";
import CartHeader from "../common/cart/cart-header";
import { useCartlistContext } from "../../helpers/cart/AddCartContext";

const CartContainer = ({ icon, cartLength }) => {
  const { cartlistData } = useCartlistContext();

  return (
    <Fragment>
      <li
        className={`mobile-cart cart-ui-fix ${
          cartLength > 0 ? "onhover-div" : ""
        }`}
        style={{ position: "relative" }} // Ensure container is positioned
      >
        {/* Spinner while loading */}
        {cartlistData.loading ? (
          <div className="cart-qty-cls">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          // Cart icon link
          <Link to="/account/cart" className="py-0 position-absolute">
            {/* Cart count badge */}
            {cartLength > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-44px",
                  backgroundColor: "#74b72c",
                  color: "white",
                  fontSize: "12px",
                  padding: "2px 6px",
                  borderRadius: "50%",
                  zIndex: 10,
                  fontWeight: "bold",
                }}
              >
                {cartLength}
              </div>
            )}
          </Link>
        )}

        {/* Cart icon & text */}
        <Link to="/account/cart" className="cartLink" style={{ position: "relative" }}>
          <img src="/assets/images/icon/cart-icon.svg" alt="Cart Icon" />
          {/* Cart */}
        </Link>

        {/* Hover dropdown: only shown when cart has items */}
        {cartLength > 0 ? (
          <ul className="show-div shopping-cart">
            {cartlistData?.data?.items?.map((item, index) => (
              <CartHeader key={index} item={item} />
            ))}

            <li className="d-flex justify-content-end px-3 m-0">
              <div
                className="total d-flex justify-content-between py-2"
                style={{ width: "100%" }}
              >
                <span>Sub Total :</span>
                <span>₹ {cartlistData?.data?.total_cart_price}</span>
              </div>
            </li>

            <li className="p-3" style={{ width: "100%" }}>
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ width: "100%" }}
              >
                <Link
                  to={`/account/cart`}
                  className="btn"
                  style={{ fontWeight: "600" }}
                >
                  View cart
                </Link>
                <Link
                  to={`/page/account/checkout`}
                  className="checkout btn"
                  style={{ fontWeight: "600" }}
                >
                  Checkout
                </Link>
              </div>
            </li>
          </ul>
        ) : null}
      </li>
    </Fragment>
  );
};

export default CartContainer;
