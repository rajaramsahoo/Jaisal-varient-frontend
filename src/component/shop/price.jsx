import { useState, useEffect, useRef } from "react";
import { Range, getTrackBackground } from "react-range";
import { useLocation, useNavigate } from "react-router-dom";
import { Collapse } from "reactstrap";
import { useProductContext } from "../../helpers/products/ProductContext";

const Price = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [values, setValues] = useState([0, 5000]);
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = useProductContext();
  const hasUserChanged = useRef(false);

  // Load prices initially
  useEffect(() => {
    if (data?.productList?.length && !hasUserChanged.current) {
      setMinPrice(data?.minPrice);
      setMaxPrice(data?.maxPrice);

      const searchParams = new URLSearchParams(location.search);
      const urlMin = Number(searchParams.get("minPrice"));
      const urlMax = Number(searchParams.get("maxPrice"));
      if (urlMin && urlMax) {
        setValues([urlMin, urlMax]);
      } else {
        setValues([data?.minPrice, data?.maxPrice]);
      }
    }
  }, [data]);

  // Sync from URL
  useEffect(() => {
    if (!hasUserChanged.current) {
      const searchParams = new URLSearchParams(location.search);
      const urlMin = Number(searchParams.get("minPrice"));
      const urlMax = Number(searchParams.get("maxPrice"));
      if (urlMin && urlMax) {
        setValues([urlMin, urlMax]);
      }
    }
  }, [location.search]);

  const toggle = () => setIsOpen(!isOpen);

  const priceHandle = (value) => {
    if (!hasUserChanged.current) hasUserChanged.current = true;
    setValues(value);
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("minPrice", value[0]);
    searchParams.set("maxPrice", value[1]);
    navigate({ search: searchParams.toString() });
  };

  return (
    <div className="collection-collapse-block border-0 open">
      <h3 className="collapse-block-title" onClick={toggle}>
        Price
      </h3>

      <Collapse isOpen={isOpen}>
        <div className="collection-collapse-block-content">
          <div className="price-range-wrapper">
            <Range
              values={values}
              step={10}
              min={minPrice}
              max={maxPrice}
              onChange={priceHandle}
              renderTrack={({ props, children }) => (
                <div
                  onMouseDown={props.onMouseDown}
                  onTouchStart={props.onTouchStart}
                  style={{
                    height: "40px",
                    display: "flex",
                    width: "100%",
                  }}
                >
                  <div
                    ref={props.ref}
                    style={{
                      height: "6px",
                      width: "100%",
                      borderRadius: "4px",
                      background: getTrackBackground({
                        values,
                        colors: ["#ccc", "#0e8a33", "#ccc"],
                        min: minPrice,
                        max: maxPrice,
                      }),
                      alignSelf: "center",
                    }}
                  >
                    {children}
                  </div>
                </div>
              )}
              renderThumb={({ props }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: "20px",
                    width: "20px",
                    borderRadius: "50%",
                    backgroundColor: "#0e8a33",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
                    border: "2px solid white",
                  }}
                />
              )}
            />

            <div className="price-labels">
              <span>₹{values[0]}</span>
              <span>₹{values[1]}</span>
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default Price;
