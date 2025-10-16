import { Row, Col, Table } from "reactstrap";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useWishlistContext } from "../../../helpers/wishlist/WishlistContext";
import { useCartlistContext } from "../../../helpers/cart/AddCartContext";

const WishListDetail = () => {
  const { getWishlist, wishlistData, removeFromWishlist } =
    useWishlistContext();
  const { addToCart } = useCartlistContext();

  const handleCartList = (item) => {
    addToCart(item?._id, 1);
  };

  useEffect(() => {
    getWishlist();
  }, []);
  // console.log(wishlistData.data.length > 0);

  return (
    <>
      <Row>
        <Col sm="12">
          {wishlistData?.loading ? (
            <div className="col-md-12 d-flex justify-content-center ">
              <div className="spinner-grow text-info my-4" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {Array.isArray(wishlistData?.data) &&
              wishlistData.data.length > 0 ? (
                <div className="table-responsive cartTabBx">
                  <Table className="table table-bordered">
                    <thead>
                      <tr className="table-head">
                        <th scope="col">Image</th>
                        <th scope="col">Product Name</th>
                        <th scope="col">Price</th>
                        <th scope="col">Availability</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wishlistData?.data.map((item, i) => (
                        <tr key={i}>
                          <td>
                            <Link to={`/product/${item._id}`}>
                              <img
                                src={item.images[0]}
                                alt={item.itemName}
                                style={{ width: "100px" }}
                              />
                            </Link>
                          </td>
                          <td style={{ width: "auto" }}>
                            <Link to={`/product/${item._id}`}>
                              {item.itemName}
                            </Link>
                          </td>
                          <td>
                            <h3 className="text-dark">
                              <b>₹&nbsp;{item.price}</b>
                            </h3>
                          </td>
                          <td>
                            <p>
                              {item.stock > 0 ? "In Stock" : "Out of Stock"}
                            </p>
                          </td>
                          <td>
                            <span
                              className="btn btn-danger"
                              onClick={() => removeFromWishlist(item?._id)}
                            >
                              <i className="fa fa-times"></i>
                            </span>
                            &nbsp;
                            <span
                              className="btn btn-dark"
                              onClick={() => handleCartList(item)}
                            >
                              <i className="fa fa-shopping-cart"></i>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center">
                  <h3>Your wishlist is empty!</h3>
                  <Link to="/shop/basmati-rice" className="btn btn-solid">
                    Continue Shopping
                  </Link>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </>
  );
};

export default WishListDetail;
