import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useCartlistContext } from "../../../helpers/cart/AddCartContext";
import { FaPlus } from "react-icons/fa";
import { FiMinus } from "react-icons/fi";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "../../../helpers/axios";
import { useAuthContext } from "../../../helpers/auth/authContext";
import { useCommonContext } from "../../../helpers/common/CommonContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Offcanvas from "react-bootstrap/Offcanvas";
import CodModal from "../../checkout/CodModal";

const MySwal = withReactContent(Swal);

const CartItem = React.memo(function CartItem({
  item,
  quantity,
  loadingItem,
  minusQty,
  plusQty,
  handleRemove,
  limitMessage,
  hideOutOfStock,
  outOfStock,
}) {
  const { product, variant, quantity: qty } = item;
  const itemId = variant._id;
  const itemQty = quantity[itemId] || qty;
  const unitPrice = variant.sale_price || variant.offer_price || variant.price;
  const originalPrice = variant.price;

  const isOutOfStock = variant.stock <= 0 || outOfStock[itemId];

  return (
    <div className="cartItem" key={itemId}>
      <div className="row align-items-top">
        <div className="col-3" align="center">
          <img src={product.image} alt={product.itemName} />
        </div>

        <div className="col-9">
          <h5>
            {variant.packsize_title} {product.itemName} package
          </h5>

          <div className="cart">
            {isOutOfStock ? (
              <div className="text-danger fw-bold p-2">Out of stock</div>
            ) : (
              <div className="cartNumber">
                <button
                  onClick={() => minusQty(item)}
                  disabled={item.offer_slug !== null || loadingItem === itemId}
                >
                  {loadingItem === itemId ? (
                    <div className="loader-circle" />
                  ) : (
                    <FiMinus />
                  )}
                </button>

                <input
                  type="number"
                  className="form-control input-number"
                  value={itemQty}
                  readOnly
                  style={{
                    width: "50px",
                    textAlign: "center",
                  }}
                />

                <button
                  onClick={() => plusQty(item)}
                  disabled={item.offer_slug !== null || loadingItem === itemId}
                >
                  {loadingItem === itemId ? (
                    <div className="loader-circle" />
                  ) : (
                    <FaPlus />
                  )}
                </button>
              </div>
            )}

            <button
              className="text-muted btn btn-link p-0"
              type="button"
              onClick={() => handleRemove(item)}
              disabled={loadingItem === variant._id}
            >
              Remove
            </button>
          </div>

          {limitMessage[itemId] && !hideOutOfStock[itemId] && (
            <span style={{ color: "red" }}>{limitMessage[itemId]}</span>
          )}

          <h6>
            <span>₹ {unitPrice * itemQty}</span>{" "}
            {originalPrice > unitPrice && <s>₹ {originalPrice * itemQty}</s>}
          </h6>
        </div>
      </div>

      <div className="lower">
        Size: {variant.packsize_title} {variant.unit || ""}
      </div>
    </div>
  );
});


const CartModal = ({ onClose, ...props }) => {
  const { cartModalShow, setCartModalShow } = useCartlistContext();
  const { setCodModalShow, codModalShow } = useCommonContext();
  const { token } = useAuthContext();
  const navigate = useNavigate();
  const device_id = localStorage.getItem("guest_device_id");

  const {
    cartlistData,
    removeFromCartlist,
    verifyPromo,
    promo,
    setPromo,
    amount,
    setAmount,
    promoMessage,
    setPromoMessage,
    promo_code,
    setPromoCode,
    handlePromoremove,
  } = useCartlistContext();

  const cartItems = cartlistData?.data?.items || [];
  const [quantity, setQuantity] = useState({});
  const [outOfStock, setOutOfStock] = useState({});
  const [quantityTimeouts, setQuantityTimeouts] = useState({});
  const [limitMessage, setLimitMessage] = useState({});
  const [hideOutOfStock, setHideOutOfStock] = useState({});
  const [loadingItem, setLoadingItem] = useState(null);
  const MAX_QTY = 10;

  const cartHandleClose = () => (onClose ? onClose() : setCartModalShow(false));
  const handleOpenCodModal = () => setCodModalShow(true);
  const handleCloseCodModal = () => setCodModalShow(false);

  //  Remove promo whenever quantity changes
  useEffect(() => {
    handlePromoremove();
  }, [quantity]);

  //  Update backend cart when quantity changes
  const updateItemQuantity = useCallback(
    async (item, qty) => {
      try {
        setLoadingItem(item.variant._id);
        const payload = {
          product_id: item.product._id,
          variant_id: item.variant._id,
          quantity: qty,
          device_id,
        };

        await axios.post("/api/user/product/cart/quantity", payload, {
          headers: token ? { Authorization: token } : {},
        });

        toast.success("Cart updated");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to update cart");
      } finally {
        setLoadingItem(null);
      }
    },
    [token, device_id]
  );

  //  Debounced quantity update
  const handleQtyUpdate = useCallback(
    (item, qty) => {
      const variantId = item.variant._id;
      const numQty = parseInt(qty, 10);

      setQuantity((prev) => ({ ...prev, [variantId]: numQty }));

      if (quantityTimeouts[variantId]) clearTimeout(quantityTimeouts[variantId]);

      const timeoutId = setTimeout(() => {
        if (numQty > 0) updateItemQuantity(item, numQty);
      }, 400);

      setQuantityTimeouts((prev) => ({ ...prev, [variantId]: timeoutId }));
    },
    [quantityTimeouts, updateItemQuantity]
  );

  //  Increment
  const plusQty = useCallback(
    (item) => {
      const variantId = item.variant._id;
      const currentQty = quantity[variantId] || item.quantity;
      const newQty = currentQty + 1;
      const maxAllowed = Math.min(item.variant.stock, MAX_QTY);

      if (newQty <= maxAllowed) {
        handleQtyUpdate(item, newQty);
        setLimitMessage((prev) => ({ ...prev, [variantId]: "" }));
        setHideOutOfStock((prev) => ({ ...prev, [variantId]: true }));
      } else {
        const message =
          item.variant.stock <= currentQty
            ? "Out of Stock"
            : "Max 10 quantity allowed";

        setLimitMessage((prev) => ({ ...prev, [variantId]: message }));
        setHideOutOfStock((prev) => ({ ...prev, [variantId]: false }));

        setTimeout(() => {
          setHideOutOfStock((prev) => ({ ...prev, [variantId]: true }));
          setLimitMessage((prev) => ({ ...prev, [variantId]: "" }));
        }, 2000);
      }
    },
    [quantity, handleQtyUpdate]
  );

  // ✅ Decrement
  const minusQty = useCallback(
    (item) => {
      const variantId = item.variant._id;
      const currentQty = quantity[variantId] || item.quantity;
      const newQty = currentQty - 1;
      if (newQty >= 1) handleQtyUpdate(item, newQty);
    },
    [quantity, handleQtyUpdate]
  );

  // ✅ Remove item
  const handleRemove = useCallback(
    (item) => {
      MySwal.fire({
        title: "Are you sure?",
        text: "Remove this item from your cart?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, remove it!",
      }).then((result) => {
        if (result.isConfirmed) {
          removeFromCartlist(item).then(() =>
            MySwal.fire("Removed!", "Item removed from cart.", "success")
          );
        }
      });
    },
    [removeFromCartlist]
  );

  //  Compute updated cart items with recalculated totals
  const computedCartItems = useMemo(() => {
    return cartItems.map((item) => {
      const qty = quantity[item.variant._id] || item.quantity;

      const basePrice = item.variant.price || 0;
      const salePrice = item.variant.sale_price || basePrice;
      const offerPrice = item.variant.offer_price || salePrice;

      return {
        ...item,
        quantity: qty,
        total_price: basePrice * qty,
        total_sell_price: salePrice * qty,
        total_offer_price: offerPrice * qty,
      };
    });
  }, [cartItems, quantity]);

  // Calculate overall totals from updated item data
  const cartTotalPrice = useMemo(() => {
    return computedCartItems.reduce((acc, item) => acc + item.total_offer_price, 0);
  }, [computedCartItems]);

  //  Sync amount with promo
  useEffect(() => {
    if (!promoMessage.status) setAmount(cartTotalPrice);
  }, [promoMessage.status, cartTotalPrice]);

  //  Apply promo
  const handlePromoCode = () => {
    if (promo_code.trim()) verifyPromo({ promo_code, amount: cartTotalPrice });
  };
  return (
    <Offcanvas show={cartModalShow} onHide={cartHandleClose} {...props}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Cart: {cartItems.length} Items</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="pt-0">
        {cartItems.length > 0 ? (
          <div className="canvasBx">
            <div className="cartBx">
              <div className="cartBodyBx">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.variant._id}
                    item={item}
                    quantity={quantity}
                    loadingItem={loadingItem}
                    minusQty={minusQty}
                    plusQty={plusQty}
                    handleRemove={handleRemove}
                    limitMessage={limitMessage}
                    hideOutOfStock={hideOutOfStock}
                    outOfStock={outOfStock}
                  />
                ))}

                {/*  Promo Section */}
                <div className="pincode-checker border-product">
                  <h6 className="product-title">Apply Coupon Code</h6>
                  <div className="pincode-form">
                    <div className="d-flex align-items-center">
                      <input
                        placeholder="Enter your promo code"
                        type="text"
                        className="me-2 form-control rounded-1"
                        value={promo_code}
                        onChange={(e) => {
                          setPromoCode(e.target.value);
                          setPromo({ ...promo, message: "" });
                          setPromoMessage({ ...promoMessage, message: "" });
                        }}
                        disabled={amount && promoMessage.status}
                      />
                      <button
                        type="button"
                        className="pincode-button btn btn-primary"
                        onClick={handlePromoCode}
                        disabled={(amount && promoMessage.status) || !promo_code.trim()}
                      >
                        {promo.loading
                          ? "Applying..."
                          : amount && promoMessage.status
                            ? "Applied"
                            : "Apply"}
                      </button>
                      {amount && promoMessage.status && (
                        <button
                          className="pincode-button btn btn-danger"
                          onClick={handlePromoremove}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p
                      className={promoMessage.status ? "text-success" : "text-danger"}
                      style={{ marginTop: "0.5rem" }}
                    >
                      {promo.message || promoMessage.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="cartFooterBx">
              <div className="row">
                <div className="col-6">
                  <b>SUBTOTAL</b>
                </div>
                <div className="col-6 fs-6 text-end">
                  <b>₹ {cartTotalPrice}</b>
                </div>

                {amount && promoMessage.status && (
                  <>
                    <div className="col-6 text-success">
                      Promo Applied ({promo_code})
                    </div>
                    <div className="col-6 text-success text-end">
                      - ₹ {promo?.data?.discount}
                    </div>
                    <div className="col-6 fw-bold">Final Amount</div>
                    <div className="col-6 text-end fw-bold">
                      ₹ {amount}
                    </div>
                  </>
                )}
              </div>

              <div className="d-flex mt-2">
                <button className="btn w-100" onClick={() => toast("Pay")}>
                  Pay Online
                </button>
                &nbsp;&nbsp;
                <button className="btn w-100" onClick={handleOpenCodModal}>
                  COD
                </button>

                {/* COD Modal always gets latest values */}
                <CodModal
                  show={codModalShow}
                  onHide={handleCloseCodModal}
                  items={computedCartItems} // now includes updated total_* fields
                  original_amount={cartTotalPrice}
                  discount={amount && promoMessage.status ? cartTotalPrice - amount : 0}
                  final_amount={amount && promoMessage.status ? amount : cartTotalPrice}
                  ActualOriginalPriceOfAllItems={cartTotalPrice}
                  promocode_id={
                    promoMessage?.status && promo?.data?._id ? promo.data._id : ""
                  }
                />

              </div>

              <div className="pt-2" align="center">
                <a variant="secondary" onClick={cartHandleClose}>
                  Continue Shopping
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="emptyBx">
            <img src="/assets/images/empty-cart.svg" alt="" />
            <h3>Your Shopping Bag is Empty</h3>
            <p>This feels too light! Go on, add all your favourites</p>
            <a
              className="btn btnLightGreen rounded-2 mt-0 fw-normal"
              variant="secondary"
              onClick={cartHandleClose}
            >
              Continue Shopping
            </a>
          </div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default CartModal;
