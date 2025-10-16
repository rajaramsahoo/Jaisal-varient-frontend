import React from "react";

const MasterServiceContent = ({
  link,
  title,
  service,
  homepage
}) => {
  return (
    <div
        className={`${homepage == "yes" ? "media serviceItem" : "dtlServiceItem"} `}
    >
      <div className="icon" dangerouslySetInnerHTML={{ __html: link }} />
      <div className="media-body">
        <h4>{title}</h4>
        <p>{service}</p>
      </div>
    </div>
  );
};

export default MasterServiceContent;