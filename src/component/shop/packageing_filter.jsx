import React, { useEffect, useState } from "react";
import { Collapse, Input } from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useProductContext } from "../../helpers/products/ProductContext";
import { h1 } from "motion/react-client";

const PackagingFilter = (categoryDetail) => {
  const { getPackagingSize, packageList, data } = useProductContext();
  let total = ""
  total = data.productList?.length

  const [isOpen, setIsOpen] = useState(true);
  const [selectedPackages, setSelectedPackages] = useState([]);

  const toggle = () => setIsOpen(!isOpen);

  const location = useLocation();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (packageList.data?.length === 0) getPackagingSize(categoryDetail?.categoryDetail._id);
  // }, [packageList.data, getPackagingSize, categoryDetail?.categoryDetail._id]);


  const handleSelectionChange = (id) => {
    setSelectedPackages((prev) =>
      prev.includes(id) ? prev.filter((pkg) => pkg !== id) : [...prev, id]
    );
  };

  // Sync URL when selectedPackages changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (selectedPackages.length > 0) {
      searchParams.set("packages", selectedPackages.join(","));
    } else {
      searchParams.delete("packages");
    }
    navigate({ search: searchParams.toString() });
  }, [selectedPackages, navigate, location.search]);


  return (
    <div className="collection-collapse-block open">
      <h3 className="collapse-block-title" onClick={toggle}>
        Packaging Size
      </h3>
      <Collapse isOpen={isOpen}>
        <div className="collection-collapse-block-content">
          <div className="color-selector collection-brand-filter">
            {Array.isArray(packageList.data) && packageList.data.length > 0 ? (
              packageList.data.map(({ _id, title, unit_name }) => (
                <div
                  className="form-check custom-checkbox collection-filter-checkbox"
                  key={_id}
                >
                  <Input
                    type="checkbox"
                    className="custom-control-input"
                    id={_id}
                    checked={selectedPackages.includes(_id)}
                    onChange={() => handleSelectionChange(_id)}
                  />
                  <label className="custom-control-label" htmlFor={_id}>
                    {`${title} ${unit_name}`}
                  </label>
                </div>
              ))
            ) : (
              <div className="">No pack sizes found</div>
            )}
          </div>
        </div>
      </Collapse>

    </div>
  );
};

export default PackagingFilter;
