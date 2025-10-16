import { Link, useNavigate } from "react-router-dom";
import { Button, FormGroup, Input, Spinner } from "reactstrap";
import { useCartlistContext } from "../../helpers/cart/AddCartContext";
import { useAuthContext } from "../../helpers/auth/authContext";
import { useEffect, useState } from "react";
import { useCommonContext } from "../../helpers/common/CommonContext";
import { FaStar } from "react-icons/fa6";
import CountdownComponent from "../common/coun-down";

const DetailsWithPrice = ({ item, stickyClass }) => {
  const { getreviewsList, reviewList } = useCommonContext();
  const { isLogin } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    getreviewsList(item?._id);
  }, [item?._id]);

  const activeReviews = Array.isArray(reviewList?.data)
    ? reviewList?.data.filter((r) => r.status?.toLowerCase() === "active")
    : [];

  const activeRatings = activeReviews.reduce(
    (sum, r) => sum + (r.rating || 0),
    0
  );
  const averageRating =
    activeReviews.length > 0
      ? parseFloat((activeRatings / activeReviews.length).toFixed(1))
      : 0;

  const {
    addToCart,
    minusQty,
    plusQty,
    quantity,
    setQuantity,
    addCartLoading,
    setCartModalShow,
    checkAvailability,
    availability,
  } = useCartlistContext();

  const product = item;

  //  Auto-select first in-stock variant
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [pincode, setPincode] = useState("");
  useEffect(() => {
    if (product?.variants?.length) {
      const firstAvailable = product.variants.find(v => v.stock > 0);
      if (firstAvailable) setSelectedVariant(firstAvailable);
    }
  }, [product]);



  const getPrices = (variant) => {
    const original = variant?.price || 0;
    const sale = variant?.sale_price || 0;
    const offer = sale || variant?.offer_price || original;
    const discount =
      original > 0 ? Math.round(((original - offer) / original) * 100) : 0;

    return { original, offer, discount };
  };

  const { original, offer, discount } = getPrices(selectedVariant || {});
  const handleAddtoCart = () => {
    if (!selectedVariant) return;
    addToCart(item._id, quantity, selectedVariant.variant_id);
    setQuantity(1);
    setCartModalShow(true);
  };

  const sharePost = async () => {
    const shareData = {
      title: "Jaisal Originals",
      url: window.location.href,
    };

    try {
      await navigator.share(shareData);
    } catch (err) {
      console.log("Error sharing the post:", err.message);
    }
  };

  const handlePincodeCheck = async () => {
    if (pincode.length === 6) {
      await checkAvailability(pincode);
    }
  };
  return (
    <div className={`product-right ${stickyClass}`}>
      <h2>{item?.itemName}</h2>
      <Button color="link" onClick={sharePost} className="pull-right">
        <i className="fa fa-share-alt fa-lg"></i>
      </Button>

      {item?.ratings !== 0 && (
        <div className="rating-section pb-3 d-flex align-items-center">
          <div className="rating-value d-flex align-items-center bg-success text-white px-2 py-1 rounded me-2">
            <span className="me-1">{averageRating}</span>
            <FaStar />
          </div>
          <div className="rating-details">
            <span className="fw-bold">{activeReviews.length}</span> Ratings &{" "}
            <span className="fw-bold">{activeReviews.length}</span> Reviews
          </div>
        </div>
      )}

      {/* Variant List */}
      {product?.variants?.length > 0 && (
        <div className="variant-selector mb-3 ">
          <h6 className="fw-bold mb-2">Available Variants:</h6>

          <div className="">
            <div className="variantsBx">
              {product.variants.map((variant, index) => {
                const { original: vOriginal, offer: vOffer, discount: vDiscount } = getPrices(variant);
                const isOutOfStock = variant.stock <= 0;
                const isSelected = selectedVariant?.variant_id === variant.variant_id;

                return (
                  <div
                    key={variant.variant_id
                      || index}
                    onClick={() => !isOutOfStock && setSelectedVariant(variant)}
                    className={`item ${isSelected ? "selected-border" : "default-border"}`}
                    style={{
                      cursor: isOutOfStock ? "not-allowed" : "pointer",
                      minWidth: "150px",
                      opacity: isOutOfStock ? 0.6 : 1,
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div className="fw-bold">{variant.packsize_title}</div>

                    {!isOutOfStock ? (
                      <>
                        <div style={{ fontSize: "14px" }}>
                          <span>
                            ₹{vOffer} for {variant.packsize_title} pocket
                          </span>
                          {vOriginal > vOffer && (
                            <del className="ms-2 text-muted">₹{vOriginal}</del>
                          )}
                        </div>

                        {vDiscount > 0 && (
                          <small className="text-success">{vDiscount}% off</small>
                        )}
                      </>
                    ) : (
                      <small className="text-danger">Out of Stock</small>
                    )}
                  </div>
                );
              })}
            </div>
          </div>


        </div>
      )}




      {/*  Selected Price */}
      {selectedVariant ? (
        <>
          <h3 className="mt-2">
            ₹{offer * quantity}
            {original > offer && (
              <del>
                <span className="money"> ₹{original * quantity}</span>
              </del>
            )}
            {discount > 0 && (
              <span
                style={{ color: "green", marginLeft: "8px", fontSize: "18px" }}
              >
                {discount}% off
              </span>
            )}
          </h3>
          <span className="ms-2 text-muted">
            {item?.itemName} {selectedVariant.packsize_title} package
          </span>
        </>
      ) : (
        <h4 style={{ color: "red" }}>Out of Stock</h4>
      )}

      {/* Quantity + Cart */}
      <div className="product-description border-product mt-3">
        <div className="qty-box">
          <div className="input-group">
            <span className="input-group-prepend">
              <button
                type="button"
                className="btn quantity-left-minus"
                onClick={minusQty}
              >
                <i className="fa fa-angle-left"></i>
              </button>
            </span>
            <Input
              type="text"
              value={quantity}
              readOnly
              className="form-control input-number"
            />
            <span className="input-group-prepend">
              <button
                type="button"
                className="btn quantity-right-plus"
                onClick={() => plusQty(item, selectedVariant)}
                disabled={quantity >= 10}
              >
                <i className="fa fa-angle-right"></i>
              </button>
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="product-buttons mt-3">
        <button className="btn btn-solid" onClick={handleAddtoCart}>
          {addCartLoading ? "Adding..." : "Add to cart"}
        </button>
        <button className="btn btn-solid ms-2">Buy Now</button>
      </div>

      {/* Pincode Checker */}
      <div className="pincode-checker border-product">
        <h6 className="product-title">Check Delivery Availability</h6>
        <div className="pincode-form">
          <FormGroup className="d-flex align-items-center">
            <Input
              type="text"
              placeholder="Enter Pincode"
              value={pincode}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 6 && /^[0-9]*$/.test(value)) {
                  setPincode(value);
                }
              }}
              className="pincode-input me-2"
            />
            <Button
              color="primary"
              onClick={handlePincodeCheck}
              disabled={availability.loading || !pincode}
              className="pincode-button"
            >
              {availability.loading ? <Spinner size="sm" /> : "Check"}
            </Button>
          </FormGroup>
        </div>
        {availability.message && (
          <div
            className={`pincode-message ${availability.status ? "true" : "false"
              } mt-2`}
            style={{
              color: availability.status ? "green" : "red",
            }}
          >
            {availability.message}
          </div>
        )}
      </div>

      <div className="border-product">
        <h6 className="product-title">Short Description</h6>
        <p>{product.short_description}</p>
      </div>

      {selectedVariant?.mark_as_sell &&
        selectedVariant?.offer_end_date &&
        new Date(selectedVariant.offer_end_date) > new Date() && (
          <div className="border-product">
            <h6 className="product-title">Sale Ends In</h6>
            <CountdownComponent time={selectedVariant.offer_end_date} />
          </div>
        )}
    </div>
  );
};

export default DetailsWithPrice;
