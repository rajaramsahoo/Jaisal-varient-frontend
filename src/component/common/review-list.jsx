import React from "react";
import { Container, Row, Col, Spinner, Card, CardBody } from "reactstrap";
import "./ReviewList.css";
import { FaCircleUser } from "react-icons/fa6";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";

const ReviewList = ({ reviewList, item, loading }) => {

  // console.log(reviewList)
  // console.log(item)
  const activeReviews = Array.isArray(reviewList)
    ? reviewList.filter((r) => r.status === "Active")
    : [];

  const activeRatings = activeReviews.reduce((sum, r) => sum + (r.rating || 0), 0);
  const averageRating =
    activeReviews.length > 0
      ? (activeRatings / activeReviews.length).toFixed(1)
      : 0;

  return loading ? (
    <section className="review-page">
      <Container>
        <Row>
          <Col sm="12">
            {/* Skeleton for Overall Rating Summary */}
            <div className="rating-summary">
              <h5>Ratings & Reviews</h5>
              <div className="summary-header">
                <Skeleton circle width={50} height={50} />
                <div>
                  <Skeleton width={120} height={20} />
                  <Skeleton width={180} height={15} />
                </div>
              </div>
            </div>

            {/* Skeleton for Review Cards */}
            {[...Array(3)].map((_, i) => (
              <Card className="review-card" key={i}>
                <CardBody>
                  <div className="review-header d-flex gap-3">
                    <Skeleton circle width={40} height={40} />
                    <div>
                      <Skeleton width={100} height={18} />
                      <Skeleton width={150} height={14} />
                    </div>
                  </div>

                  <Skeleton count={2} height={15} style={{ marginTop: "10px" }} />

                  <div className="review-images d-flex gap-2 mt-2">
                    <Skeleton width={100} height={80} />
                    <Skeleton width={100} height={80} />
                  </div>
                </CardBody>
              </Card>
            ))}
          </Col>
        </Row>
      </Container>
    </section>
  ) : (
    <section className="review-page">
      <Container>
        <Row>
          <Col sm="12">
            {/* Overall Rating Summary */}
            <div className="rating-summary">
              <h5>Ratings & Reviews</h5>
              <div className="summary-header">
                <div className="summary-score">{averageRating}</div>
                <div>
                  <div className="summary-rating">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`fa ${i < item?.ratings ? "fa-star" : "fa-star-half-o"
                          }`}
                      ></i>
                    ))}
                  </div>
                  <small>
                    {activeReviews.length} Ratings & {activeReviews.length} Reviews
                  </small>

                </div>
              </div>
            </div>
            {Array.isArray(reviewList) && reviewList.length > 0 ? (
              reviewList
                .filter((review) => review.status === "Active")
                .map((review, i) => {
                  const {
                    user_name = "Anonymous",
                    createdAt = "Unknown date",
                    user_image = "",
                    rating = 0,
                    review: reviewText = "No review text provided.",
                    attachments = [],
                  } = review;

                  return (
                    <Card className="review-card" key={i}>
                      <CardBody>
                        <div className="review-header">
                          {user_image ? (
                            <img
                              src={user_image}
                              alt="User"
                              className="user-image"
                            />
                          ) : (
                            <FaCircleUser className="user-image" />
                          )}

                          <div>
                            <div className="d-flex gap-3">
                              <h6>{user_name}</h6>
                              <div className="review-rating">
                                {[...Array(5)].map((_, i) => (
                                  <i
                                    key={i}
                                    className={`fa ${i < rating ? "fa-star" : "fa-star-o"
                                      }`}
                                  ></i>
                                ))}
                              </div>
                            </div>
                            <small className="d-flex">
                              {new Date(createdAt).toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </small>
                          </div>
                        </div>

                        <p className="review-text">{reviewText}</p>
                        {attachments && attachments.length > 0 && (
                          <div className="review-images">
                            {attachments.map((img, index) => (
                              <img
                                key={index}
                                src={img}
                                height={100}
                                alt={`Review Image ${index + 1}`}
                                className="review-attachment"
                              />
                            ))}
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  );
                })
            ) : (
              <p className="no-reviews">
                No reviews available for this product.
              </p>
            )}

          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ReviewList;
