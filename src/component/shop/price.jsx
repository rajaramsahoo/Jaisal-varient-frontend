import { useState, useEffect, useRef } from "react";
import { Range, getTrackBackground } from "react-range";
import { useLocation, useNavigate } from "react-router-dom";
import { Collapse } from "reactstrap";
import { useProductContext } from "../../helpers/products/ProductContext";

const Price = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [values, setValues] = useState([0, 5000]);

  const location = useLocation();
  const navigate = useNavigate();
  const { data, getProductList } = useProductContext();

  const hasUserChanged = useRef(false); // lock flag
  // 1. Load products


  // 2. Set min/max from productList on first load
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

  // 3. Only apply URL changes if user hasn’t touched the slider
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
    if (!hasUserChanged.current) {
      hasUserChanged.current = true; // Lock future updates
    }
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
          <div className="wrapper mt-3">
            <div className="range-slider">
              <Range
                values={values}
                step={10}
                min={minPrice}
                max={maxPrice}
                onChange={priceHandle}
                renderTrack={({ props, children }) => {
                  const { key, ...restProps } = props; // remove key from spread
                  return (
                    <div
                      key={key}   // pass key directly
                      {...restProps}
                      onMouseDown={props.onMouseDown}
                      onTouchStart={props.onTouchStart}
                      style={{
                        ...restProps.style,
                        height: "36px",
                        display: "flex",
                        width: "100%",
                      }}
                    >
                      <output style={{ marginTop: "30px" }}>{values[0]}</output>
                      <div
                        ref={props.ref}
                        style={{
                          height: "5px",
                          width: "100%",
                          borderRadius: "4px",
                          background: getTrackBackground({
                            values,
                            colors: ["#ccccccff", "#104e2fff", "#146d23ff"],
                            min: minPrice,
                            max: maxPrice,
                          }),
                          alignSelf: "center",
                        }}
                      >
                        {children}
                      </div>
                      <output style={{ marginTop: "30px" }}>{values[1]}</output>
                    </div>
                  );
                }}
                renderThumb={({ props }) => {
                  const { key, ...restProps } = props; // remove key from spread
                  return (
                    <div
                      key={key} // pass key directly
                      {...restProps}
                      style={{
                        ...restProps.style,
                        height: "16px",
                        width: "16px",
                        borderRadius: "60px",
                        backgroundColor: "#3cf83cff",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow: "0px 2px 6px #AAA",
                      }}
                    />
                  );
                }}
              />
            </div>

          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default Price;
