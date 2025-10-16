const MasterProductDetail = ({ product }) => {
  let RatingStars = [];
  const maxRating = 5;

  for (let i = 0; i < maxRating; i++) {
    RatingStars.push(
      <i
        className={`fa ${i < product.ratings ? "fa-star" : "fa-star-o"}`}
        key={i}
        style={{ color: i < product.ratings ? "#FFD700" : "#ddd" }}
      ></i>
    );
  }

  // Find first variant that has stock > 0
  const activeVariant = product?.variants?.find((v) => v.stock > 0)
    || product?.variants?.[0]; // fallback to first variant if none in stock

  const originalPrice = activeVariant?.price || 0;
  const salePrice = activeVariant?.sale_price || 0;
  const offerPrice = salePrice || activeVariant?.offer_price || originalPrice;

  // Calculate discount
  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - offerPrice) / originalPrice) * 100)
    : 0;

  return (
    <div className="product-detail">
      <div>
        <div className="rating">{RatingStars}</div>
        <h6>{product.itemName}</h6>
        {activeVariant ? (
          <h4>
            ₹{offerPrice}
            {originalPrice > offerPrice && (
              <del>
                <span className="money">₹{originalPrice}</span>
              </del>
            )}
            {discountPercentage > 0 && (
              <span
                style={{ color: "green", marginLeft: "8px", fontSize: "14px" }}
              >
                {discountPercentage}% off
              </span>
            )}
            <span style={{ marginLeft: "10px", fontSize: "12px", color: "#555" }}>
              {activeVariant.packsize_title}
            </span>
          </h4>
        ) : (
          <h4 style={{ color: "red" }}>Out of Stock</h4>
        )}
      </div>
    </div>
  );
};

export default MasterProductDetail;
