import React, { useEffect, useState } from "react";
import {
  Media,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Row,
  Col,
} from "reactstrap";
import { useWishlistContext } from "../../helpers/wishlist/WishlistContext";
import MasterProductDetail from "./master-product-detail";
import { useCartlistContext } from "../../helpers/cart/AddCartContext";
import { useAuthContext } from "../../helpers/auth/authContext";
import { useCommonContext } from "../../helpers/common/CommonContext";
import { nav } from "motion/react-client";
import { replace } from "react-router-dom";

const ProductBox = ({ product }) => {
  const { addToWishlist } = useWishlistContext();
  const { isLogin } = useAuthContext();
  const { setShow } = useCommonContext();
  const {
    addToCart,
    minusQty,
    plusQty,
    quantity,
    setQuantity,
    navigate,
    stock,
    addCartLoading,
    setCartModalShow,
  } = useCartlistContext();
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [addedProductId, setAddedProductId] = useState(null);

  // const handleAddToCart = async (productId, quantity, device_id) => {
  //   setLoadingProductId(productId);
  //   await addToCart(productId, quantity);

  //   setAddedProductId(productId);
  //   setLoadingProductId(null);
  // };

  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
    setQuantity(1);
  };




  const clickProductDetail = () => {
    if (!product?._id) return;

    // Check if at least one variant has stock > 0
    const hasStock = product?.variants?.some(variant => variant.stock > 0);

    if (hasStock) {
      navigate(`/product-details/${product?._id}`, {
        state: {
          itemName: product?.itemName,
          category_name: product?.category_name
        }
      });
    }
  };
  const hasStock = product?.variants?.some(variant => variant.stock > 0);


  const originalPrice = product?.price || 0;
  const salePrice = product?.sale_price || 0;
  const offerPrice = salePrice || product?.offer_price || originalPrice;

  // Calculate the discount percentage
  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - offerPrice) / originalPrice) * 100)
    : 0;
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Auto-select first in-stock variant whenever product changes
  useEffect(() => {
    if (product?.variants?.length) {
      const firstAvailable = product.variants.find(v => v.stock > 0);
      if (firstAvailable) setSelectedVariant(firstAvailable);
    }
  }, [product]);

  // Optional: reset quantity when modal opens
  useEffect(() => {
    if (modal) setQuantity(1);
  }, [modal]);

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
    addToCart(product._id, quantity, selectedVariant._id);
    setQuantity(1);
    setCartModalShow(true);
  };

  const [stockMessage, setStockMessage] = useState("");

  const handlePlusQty = () => {
    if (!selectedVariant) return;

    const maxAllowed = Math.min(10, selectedVariant.stock);

    if (quantity >= maxAllowed) {
      // If stock less than 10, we show "Out of Stock"
      if (selectedVariant.stock < 10) {
        setStockMessage("Out of Stock");
      } else {
        setStockMessage("Maximum 10 units allowed");
      }
      return;
    }

    // increment quantity
    plusQty(product, selectedVariant);
    setStockMessage(""); // clear message if incremented successfully
  };
  const handleMinusQty = () => {
    if (quantity > 1) {
      minusQty();
      setStockMessage(""); // clear message on decrease
    }
  };
  // console.log(stockMessage, "stock")
  // console.log(selectedVariant, "selectedVariant.stock")

  return (
    <>
      <div
        className={`product product-box product-wrap ${hasStock ? "" : "inActiveProduct"
          }`}
        style={{ cursor: "pointer" }}
      >        {/*inActiveProduct*/}
        <div className="img-wrapper">
          <div className="lable-block">
            {product.new === "true" ? <span className="lable3">new</span> : ""}

          </div>
          <div className="front" onClick={clickProductDetail}>
            <Media src={product?.images[0]} className="img-fluid" alt="" />
          </div>
          {
            hasStock ? (<div className="cart-info cart-wrap">
              {
                isLogin ? (<button
                  title="Add to Wishlist"
                  onClick={() => addToWishlist(product._id)}
                >
                  <i className="fa fa-heart" aria-hidden="true"></i>
                </button>) : ("")
              }

              <button
                href={null}
                data-toggle="modal"
                data-target="#quick-view"
                title="Quick View"
                onClick={toggle}
              >
                <i className="fa fa-search" aria-hidden="true"></i>
              </button>
            </div>) : ("")
          }

          {
            hasStock ? (<div className="addtocart_btn">
              <button
                className="add-button add_cart rounded-5 "
                title="view Product"

                // onClick={() => {
                //   handleAddToCart(product._id, quantity);
                //   setCartModalShow(true);
                // }}
                onClick={clickProductDetail}
                disabled={
                  loadingProductId === product._id ||
                  addedProductId === product._id
                }
              >
                {/* {loadingProductId === product._id ? (
                    <span className="spinner-border spinner-border-sm" />
                  ) : addedProductId === product._id ? (
                    "Added"
                  ) : (
                    "Add to cart"
                  )} */}
                View
              </button>
            </div>) : ("")
          }

        </div>
        {/* product footer section */}
        <MasterProductDetail product={product} />
      </div>

      {/* initial search detail modal */}
      <Modal
        isOpen={modal}
        toggle={toggle}
        className="modal-lg quickview-modal"
        centered
      >
        <ModalHeader toggle={toggle}> </ModalHeader>
        <ModalBody>
          <Row>
            <Col lg="6" xs="12">
              <div className="quick-view-img">
                <Media
                  src={product?.images[0]}
                  alt=""
                  className="img-fluid"
                  style={{ width: "300px", height: "300px", objectFit: "contain" }}
                />
              </div>
            </Col>

            <Col lg="6" className="rtl-text">
              <div className="product-right">
                <h2> {product?.itemName} </h2>
                {/* Variant List */}
                {product?.variants?.length > 0 && (
                  <div className="variant-selector">
                    <h6 className="fw-bold mb-2">Available Size:</h6>
                    <div className="">
                      <div className="variantsBx">
                        {product.variants.map((variant, index) => {
                          const { original: vOriginal, offer: vOffer, discount: vDiscount } = getPrices(variant);
                          const isOutOfStock = variant.stock <= 0;
                          const isSelected = selectedVariant?._id === variant._id;

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
                                    <small className="offerBx">{vDiscount}% off</small>
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
                    <div className="row align-items-center mb-3">
                      <div className="col-6">
                        <h3 className="mt-0 mb-0">
                          <b>₹{offer * quantity}</b>
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
                      </div>
                      <div className="col-6">
                        {/* CartQuantity start */}
                        <div className="">
                          <div className="qty-box">
                            <div className="input-group" style={{ justifyContent: "left", }}>
                              <span className="input-group-prepend">
                                <button
                                  type="button"
                                  className="btn quantity-left-minus"
                                  onClick={handleMinusQty}
                                >
                                  <i className="fa fa-minus"></i>
                                </button>
                              </span>
                              <Input
                                type="text"
                                value={quantity}
                                readOnly
                                className="form-control input-number"
                              />
                              <span className="input-group-prepend">
                                {/* <button
                                  type="button"
                                  className="btn quantity-right-plus"
                                  onClick={() => plusQty(product, selectedVariant)}
                                  disabled={quantity >= 10}
                                >
                                  <i className="fa fa-plus"></i>
                                </button> */}
                                <button
                                  type="button"
                                  className="btn quantity-right-plus"
                                  onClick={handlePlusQty}
                                // disabled={quantity >= Math.min(10, selectedVariant?.stock || 0)}
                                >
                                  <i className="fa fa-plus"></i>
                                </button>


                              </span>
                              {stockMessage && (
                                <div style={{ color: "red", fontSize: "13px", marginTop: "5px" }}>
                                  {stockMessage}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* CartQuantity end */}
                      </div>
                    </div>
                    <span className="text-muted">
                      {product?.itemName} - {selectedVariant.packsize_title} package
                    </span>
                  </>
                ) : (
                  <h4 style={{ color: "red" }}>Out of Stock</h4>
                )}
                {/* Action Buttons */}
                <div className="row mt-3">
                  <div className="col-6">
                    <button className="btn btn-solid" onClick={handleAddtoCart} style={{ width: '100%' }}>
                      {addCartLoading ? "Adding..." : "Add to cart"}
                    </button>
                  </div>
                  <div className="col-6">
                    <button className="btn btn-solid" style={{ width: '100%' }}>Buy Now</button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  );
};

export default ProductBox;
