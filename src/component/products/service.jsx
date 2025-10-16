import React from "react";

import {
  svgFreeShipping,
  svgservice,
  svgoffer,
  svgpayment,
} from "../../service/service";

import MasterServiceContent from "../common/service-content";
const Data = [
  {
    link: svgFreeShipping,
    title: "Complimentary Shipping",
    service: "Enjoy free shipping on all premium rice products.",
  },
  {
    link: svgservice,
    title: "24/7 Expert Support",
    service: "Get personalized assistance from our rice experts anytime.",
  },
  {
    link: svgoffer,
    title: "Exclusive Harvest Offers",
    service: "Limited-time offers on our hand-picked premium rice varieties.",
  },
];

const Service = () => {
  return (
    <div className="collection-filter-block" style={{padding:'0px 15px'}}>
      <div className="product-service" style={{padding:'15px 0'}}>
        {Data.map((data, index) => {
          return (
            <MasterServiceContent
              key={index}
              link={data.link}
              title={data.title}
              service={data.service}
              lastChild={data.lastChild}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Service;
