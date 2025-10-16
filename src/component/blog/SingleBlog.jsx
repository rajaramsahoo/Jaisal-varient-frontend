import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCommonContext } from "../../helpers/common/CommonContext";
import CommonLayout from "../shop/common-layout";
const SingleBlog = () => {
  const params = useParams();
  console.log(params.id);
  const { blogDetail, getBlogDetail, blogs, getBlogs } = useCommonContext();
  useEffect(() => {
    if (params.id) {
      getBlogDetail(params.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);
  const removePTags = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "");
  };

  useEffect(() => {
    getBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = blogs?.data?.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(blogs?.data?.length / itemsPerPage);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  console.log(blogs)
  return (
    <>
      <CommonLayout parent="home" title="Blogs" subTitle={blogDetail?.data?.title}>

        <section className="pt-0">
          <img src={blogDetail?.data?.images[0]} className="card-img-top" alt="Card image" style={{ height: "400px", objectFit: "cover" }} />
        </section>

        <section className="bg-light blogBx">
          <div className="container mt-1 mb-5">
            {/* blog details part start */}
            <div className="row">
              {/* item start */}
              <div className="col-md-12 col-sm-12 col-12 mb-4">
                <div className="blogItem shadow-none">

                  <div className="">
                    <h5 className="text-success mb-0" align="left">
                      <i className="fa fa-calendar text-success"></i>
                      <b>
                        {" "}
                        Date:{" "}
                        {new Date(
                          blogDetail?.data?.createdAt
                        ).toLocaleDateString()}
                      </b>{" "}
                    </h5>
                    <h3 className="card-title mt-2 mb-2">{blogDetail?.data?.title} </h3>

                    {/* <h3 className="text-danger" align="left">
                    <b>head</b>
                  </h3> */}

                    <p className="card-text">
                      {removePTags(blogDetail?.data?.description)}
                    </p>
                  </div>
                </div>
              </div>
              {/* item end */}
            </div>
            {/* blog details part end */}

            {/* blog list part start */}
            <div className="row">
              {/* item start */}
              <h3 className="mt-3" style={{ fontWeight: "bold", color: "black" }}>You May Also Like :-</h3>

              {currentItems?.map((blog, index) => (
                <div className="col-md-3 col-sm-6 col-12 mb-4" key={index}>
                  <Link
                    to={`/blog/${blog?.slug}`}
                    className="card h-100 d-flex flex-column blogItem text-decoration-none"
                  >
                    <img
                      src={blog?.images[0]}
                      className="card-img-top"
                      alt="Card image"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="text-success mb-0" align="left">
                        <i className="fa fa-calendar text-success"></i>
                        <b>
                          {" "}
                          Date: {new Date(blog?.createdAt).toLocaleDateString()}
                        </b>
                      </h5>
                      <h4
                        className="card-title line-clamp-title"
                        title={blog?.title} // show full on hover
                      >
                        {blog?.title}
                      </h4>

                      <p
                        className="card-text mt-auto line-clamp-description"
                        title={blog?.sortDescription} // show full on hover
                      >
                        {blog?.sortDescription}
                      </p>

                    </div>
                  </Link>
                </div>
              ))}
            </div>
            {/* blog list part end */}

            {/* pagination start here */}
            {
              currentItems.length > itemsPerPage && <div align="center">
                <nav className="d-inline-block">
                  <ul className="pagination">
                    <li
                      className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handleClick(currentPage - 1)}
                        aria-label="Previous"
                      >
                        <span aria-hidden="true">«</span>
                      </button>
                    </li>
                    {[...Array(totalPages)].map((_, index) => (
                      <li
                        key={index}
                        className={`page-item ${currentPage === index + 1 ? "active" : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handleClick(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${currentPage === totalPages ? "disabled" : ""
                        }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handleClick(currentPage + 1)}
                        aria-label="Next"
                      >
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
            </div>
          </div>
        </section>
      </CommonLayout>
    </>
  );
};

export default SingleBlog;