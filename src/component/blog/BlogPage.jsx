import { div, section } from "motion/react-client";
import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCommonContext } from "../../helpers/common/CommonContext";
import CommonLayout from "../shop/common-layout";
const BlogPage = () => {
  const { blogs, getBlogs } = useCommonContext();
  useEffect(() => {
    getBlogs();
  }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = blogs?.data?.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(blogs?.data?.length / itemsPerPage);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  // console.log(currentItems.length)
  return (
    <>
      <CommonLayout parent="home" title="Blogs" >
        {/* <section className="bg-light blogBx"> */}
        <section className="blogBx pt-0">
          <div className="container mt-5 mb-5">
            {/* blog list part start */}
            <div className="row">
              {/* item start */}
              {currentItems?.map((blog, index) => (
                <div className="col-md-4 col-sm-6 col-12 mb-4" key={index}>
                  <Link to={`/blog/${blog?.slug}`} className="card blogItem">
                    <img
                      src={blog?.images[0]}
                      className="card-img-top"
                      alt="Card image"
                      style={{ height: "200px", objectFit: "cover" }}
                    />

                    <div className="card-body">
                      <h5 className="text-success mb-0" align="left">
                        <i className="fa fa-calendar text-success"></i>
                        <b>
                          {" "}
                          Date: {new Date(blog?.createdAt).toLocaleDateString()}
                        </b>
                      </h5>
                      <h4 className="card-title line-clamp-title">
                        {blog?.title.length > 30
                          ? blog?.title.substring(0, 30) + "..."
                          : blog?.title}
                      </h4>
                      <p className="card-text line-clamp-description " >
                        {blog?.sortDescription.length > 100
                          ? blog?.sortDescription.substring(0, 100) + "..."
                          : blog?.sortDescription}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}


            </div>

            {
              currentItems?.length > itemsPerPage && <div align="center">
                <nav className="d-inline-block">
                  <ul className="pagination">

                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => handleClick(currentPage - 1)} aria-label="Previous">
                        <span aria-hidden="true">«</span>
                      </button>
                    </li>

                    {totalPages > 1 && [...Array(totalPages)].map((_, index) => (
                      <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                        <button className="page-link" onClick={() => handleClick(index + 1)}>
                          {index + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => handleClick(currentPage + 1)} aria-label="Next">
                        <span aria-hidden="true">»</span>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            }

            {/* pagination end here */}

            <div>
              <br />
              <br />
              <br />
            </div>
          </div>
        </section>
      </CommonLayout>

    </>
  );
};

export default BlogPage;
