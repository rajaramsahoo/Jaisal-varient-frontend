import { useState } from "react";
import { Media, Modal, ModalHeader, ModalBody, Row, Col } from "reactstrap";
import MasterProductDetail from "./master-product-detail";
import { useCartlistContext } from "../../helpers/cart/AddCartContext";
import { useAuthContext } from "../../helpers/auth/authContext";
import { useWishlistContext } from "../../helpers/wishlist/WishlistContext";

const ProductBox4 = ({ product }) => {
  const { addToWishlist } = useWishlistContext();
  const { isLogin, handleRedirect } = useAuthContext();
  const { addToCart, quantity, navigate, addCartLoading } =
    useCartlistContext();
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const clickProductDetail = () => {
    navigate(`/product-details/${product?._id}`);
  };

  return (
    <>
      <div className="product-box product-wrap">
        <div className="img-wrapper">
          <div className="front" onClick={clickProductDetail}>
            <Media src={product?.images[0]} className="img-fluid" alt="" />
          </div>
          <div className="cart-info cart-wrap">
            <button
              onClick={
                !isLogin ? handleRedirect : () => addToWishlist(product._id)
              }
            >
              <i className="fa fa-heart" aria-hidden="true"></i>
            </button>
            <a
              href={null}
              data-toggle="modal"
              data-target="#quick-view"
              title="Quick View"
              onClick={toggle}
            >
              <i className="fa fa-search" aria-hidden="true"></i>
            </a>
          </div>
          <button
            className="add-button add_cart"
            title="Add to cart"
            onClick={
              !isLogin ? handleRedirect : () => addToCart(product._id, quantity)
            }
          >
            {addCartLoading ? "Adding..." : "Add to cart"}
          </button>
        </div>
        {/* product footer  */}
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
                <Media src={product.images[0]} alt="" className="img-fluid" />
              </div>
            </Col>
            <Col lg="6" className="rtl-text">
              <div className="product-right">
                <h2> {product.itemName} </h2>
                <h4>
                    ₹
                    {product?.offer_price ||
                      product?.sale_price ||
                      product?.price}
                    {product?.sale_price !== 0 && (
                      <del>
                        <span className="money">
                          ₹{" "}
                          {product?.mark_as_sell
                            ? product?.sale_price
                            : product?.price}
                        </span>
                      </del>
                    )}
                  </h4>

                <div className="border-product">
                  <h6 className="product-title">product details</h6>
                  <p>{product.description}</p>
                </div>
                <div className="product-buttons">
                  <button
                    className="btn btn-solid"
                    onClick={
                      !isLogin
                        ? handleRedirect
                        : () => addToCart(product._id, quantity)
                    }
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

export default ProductBox4;
