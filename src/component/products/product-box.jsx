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

  const handleAddToCart = async (productId, quantity, device_id) => {
    setLoadingProductId(productId);
    await addToCart(productId, quantity);

    setAddedProductId(productId);
    setLoadingProductId(null);
  };

  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
    setQuantity(1);
  };

  // const clickProductDetail = () => {
  //   if (!product?._id) return;

  //   if (product?.stock > 0) {
  //     navigate(`/product-details/${product?._id}`,
  //       {
  //         state: {
  //           itemName: product?.itemName,
  //           category_name: product?.category_name
  //         }
  //       }
  //     );
  //   }
  // };


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
                className="add-button add_cart rounded-5    "
                title="Add to cart"

                onClick={() => {
                  handleAddToCart(product._id, quantity);
                  setCartModalShow(true);
                }}
                disabled={
                  loadingProductId === product._id ||
                  addedProductId === product._id
                }
              >
                {loadingProductId === product._id ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : addedProductId === product._id ? (
                  "Added"
                ) : (
                  "Add to cart"
                )}
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
                <Media src={product?.images[0]} alt="" className="img-fluid" />
              </div>
            </Col>
            <Col lg="6" className="rtl-text">
              <div className="product-right">
                <h2> {product?.itemName} </h2>

                <h3>
                  ₹{offerPrice}
                  {originalPrice > offerPrice && (
                    <del>
                      <span className="money">₹{originalPrice}</span>
                    </del>
                  )}
                  {discountPercentage < 0 && (
                    <span
                      style={{
                        color: "green",
                        marginLeft: "8px",
                        fontSize: "10px",
                      }}
                    >
                      {discountPercentage}% off
                    </span>
                  )}
                </h3>
                <div className="border-product">
                  <h6 className="product-title">Short Description</h6>
                  <p>{product?.short_description}</p>
                </div>
                <div className="product-description border-product">
                  <span className="instock-cls">{stock}</span>
                  <h6 className="product-title">quantity</h6>
                  <div className="qty-box">
                    <div className="input-group">
                      <span className="input-group-prepend">
                        <button
                          type="button"
                          className="btn quantity-left-minus"
                          onClick={minusQty}
                          data-type="minus"
                          data-field=""
                        >
                          <i className="fa fa-angle-left"></i>
                        </button>
                      </span>
                      <Input
                        type="text"
                        name="quantity"
                        value={quantity}
                        className="form-control input-number"
                      />
                      <span className="input-group-prepend">
                        <button
                          type="button"
                          className="btn quantity-right-plus"
                          onClick={() => plusQty(product)}
                          data-type="plus"
                          data-field=""
                        >
                          <i className="fa fa-angle-right"></i>
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="product-buttons">
                  <button
                    className="btn btn-solid"
                    onClick={
                      !isLogin
                        ? () => setShow(true)
                        : () => addToCart(product._id, quantity)
                    }
                    disabled={addCartLoading}
                  >
                    {addCartLoading ? "Adding..." : "Add to cart"}
                  </button>
                  <button
                    className="btn btn-solid"
                    onClick={clickProductDetail}
                  >
                    View detail
                  </button>
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
