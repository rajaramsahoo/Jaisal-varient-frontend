import React, { useEffect, useState } from "react";
import CommonLayout from "../shop/common-layout";
import { Container, Row, Col, Media } from "reactstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useCommonContext } from "../../helpers/common/CommonContext";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "react-bootstrap";
import { useCartlistContext } from "../../helpers/cart/AddCartContext";
import { set } from "mongoose";

const Comboproducts = () => {
    const { getAllComboOfferProductDeatils, comboOfferProductDeatils } = useCommonContext();
    const { offerProductAddedTocart } = useCartlistContext();
    const [showModal, setShowModal] = useState(false);
    const [selectProduct, setSelectProduct] = useState(null);
    const onCloseModal = () => setShowModal(false);
    const onOpenModal = (product) => {
        setSelectProduct(product);
        setShowModal(true);
    };

    useEffect(() => {
        getAllComboOfferProductDeatils();
    }, []);

    //  Helper function to calculate prices
    const calculatePrices = (offer) => {
        // Main products: offer_price → sale_price → price
        const mainTotal = offer.main_products?.reduce((sum, product) => {
            const v = product.variant_info || {};
            const price =
                v.sale_price > 0
                    ? v.sale_price
                    : v.offer_price > 0
                        ? v.offer_price
                        : v.price || 0;
            return sum + price * (product.quantity || 1);
        }, 0);

        // Free products: always use original price
        const freeTotal = offer.free_products?.reduce((sum, product) => {
            const v = product.variant_info || {};
            const price = v.price || 0;
            return sum + price * (product.quantity || 1);
        }, 0);

        const totalOriginal = mainTotal + freeTotal;
        const discount = totalOriginal > 0 ? Math.round(((totalOriginal - mainTotal) / totalOriginal) * 100) : 0;

        return { mainTotal, freeTotal, totalOriginal, discount };
    };

    const handleClick = async (slug) => {
        await offerProductAddedTocart(slug);
    };
    const handleClick1 = async (slug) => {
        await offerProductAddedTocart(slug);
        setShowModal(false);
    };

    // console.log(comboOfferProductDeatils?.data, "comboOfferProductDeatils?.data")
    return (
        <CommonLayout title="Combo Offers" parent="home">
            {/* ===== Product List Section ===== */}
            <section className="section-b-space">

                {/********* new product part start *********/}
                <Container>
                    <Row>
                        {/* item start */}
                        <Col md="3" sm="4" xs="12">
                            <div className="productItemBx">
                                <div className="imgBx">
                                    <span className="tagBx">Combo</span>
                                    <div className="addView">
                                        <button><i className="fa fa-search"></i> View</button>
                                        <button><i className="fa fa-plus"></i> Add</button>
                                    </div>
                                    <img src="https://res.cloudinary.com/dshkgcwoh/image/upload/v1761889584/izdnwg07cslmmiwcs0zj.webp" alt="" />
                                </div>
                                <div className="textBx">
                                    <h4>Jaisal Extra Long Rice Jaisal Extra Long Rice</h4>
                                    <h5 className="fw-bold text-dark mb-1">
                                        ₹23,800<del className="text-muted ms-2">₹24,300</del>
                                        <span style={{ color: "green", marginLeft: 8, fontSize: 14 }}>2% off</span>
                                    </h5>

                                    <p>Experience premium quality long-grain rice with rich aroma and perfect fluffiness in every bite.</p>
                                </div>
                            </div>
                        </Col>
                        {/* item end */}
                    </Row>
                </Container>
                {/********* new product part end *********/}


                <Container>
                    <Row>
                        {comboOfferProductDeatils.loading ? (
                            <p className="text-center">Loading...</p>
                        ) : comboOfferProductDeatils?.data?.length > 0 ? (
                            comboOfferProductDeatils.data.map((offer, i) => {
                                const { mainTotal, freeTotal, totalOriginal, discount } = calculatePrices(offer);

                                return (
                                    <Col lg="3" md="4" sm="6" xs="12" key={offer._id || i} className="mb-4">
                                        <div
                                            className="product-box p-3 shadow-sm rounded-4"
                                            style={{ cursor: "pointer" }}
                                        >
                                            <div className="img-wrapper position-relative">
                                                <span
                                                    className="badge bg-success position-absolute top-0 start-0 m-2"
                                                    style={{ zIndex: 2 }}
                                                >
                                                    Combo
                                                </span>

                                                <div className="front">
                                                    <Media
                                                        src={offer?.image_url}
                                                        className="img-fluid rounded-3"
                                                        alt={offer?.name}
                                                    />
                                                </div>

                                                <div className="addtocart_btn mt-3 d-flex justify-content-between">
                                                    <button
                                                        className="btn btn-outline-primary btn-sm rounded-5 px-3"
                                                        onClick={() => onOpenModal(offer)}
                                                    >
                                                        View
                                                    </button>

                                                    <button className="btn btn-primary btn-sm rounded-5 px-3"
                                                        onClick={() => handleClick(offer?.slug)}>
                                                        Add
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="product-detail mt-3 text-center">
                                                <h6 className="fw-bold">{offer?.name}</h6>

                                                <h5 className="fw-bold text-dark">
                                                    ₹{mainTotal.toLocaleString("en-IN")}
                                                    <del className="text-muted ms-2">
                                                        ₹{totalOriginal.toLocaleString("en-IN")}
                                                    </del>
                                                    {discount > 0 && (
                                                        <span
                                                            style={{
                                                                color: "green",
                                                                marginLeft: "8px",
                                                                fontSize: "14px",
                                                            }}
                                                        >
                                                            {discount}% off
                                                        </span>
                                                    )}
                                                </h5>

                                                <p className="text-muted mb-0" style={{ fontSize: "12px" }}>
                                                    Includes ₹{freeTotal.toLocaleString("en-IN")} worth of free products
                                                </p>
                                            </div>
                                        </div>
                                    </Col>
                                );
                            })
                        ) : (
                            <Col xs="12" className="text-center">
                                <h3>
                                    <strong>No Products Found</strong>
                                </h3>
                                <h5>Try adjusting your filters.</h5>
                            </Col>
                        )}
                    </Row>
                </Container>
            </section>
            {/* ===== Product Detail Modal ===== */}
            <Modal show={showModal} onHide={onCloseModal} centered size="lg">
                {/* <ModalHeader closeButton className="py-2">
                    <h6 className="mb-0">{selectProduct?.name || "Combo Details"}</h6>
                </ModalHeader> */}

                <ModalBody style={{ padding: "1rem 1.25rem" }}>
                    {selectProduct ? (
                        <div>
                            {/* ==== Top Section (Banner Left + Details Right) ==== */}
                            <Row className="align-items-center mb-3">
                                <Col md="5" className="text-center">
                                    <img
                                        src={selectProduct?.image_url}
                                        alt={selectProduct?.name}
                                        className="img-fluid rounded-4 shadow-sm"
                                        style={{
                                            maxHeight: "180px",
                                            objectFit: "contain",
                                            width: "100%",
                                        }}
                                    />
                                </Col>

                                <Col md="7">
                                    <h5 className="fw-bold mb-1">{selectProduct?.name}</h5>

                                    {(() => {
                                        const { mainTotal, freeTotal, totalOriginal, discount } =
                                            calculatePrices(selectProduct);
                                        return (
                                            <div>
                                                <h6 className="fw-bold text-dark mb-1">
                                                    ₹{mainTotal.toLocaleString("en-IN")}
                                                    <del className="text-muted ms-2 small">
                                                        ₹{totalOriginal.toLocaleString("en-IN")}
                                                    </del>
                                                    {discount > 0 && (
                                                        <span
                                                            style={{
                                                                color: "green",
                                                                marginLeft: "6px",
                                                                fontSize: "13px",
                                                            }}
                                                        >
                                                            {discount}% off
                                                        </span>
                                                    )}
                                                </h6>

                                                <p className="text-muted mb-1" style={{ fontSize: "12px" }}>
                                                    Includes ₹
                                                    {selectProduct?.free_products
                                                        ?.reduce(
                                                            (sum, f) =>
                                                                sum +
                                                                (f.variant_info?.price || 0) * (f.quantity || 1),
                                                            0
                                                        )
                                                        .toLocaleString("en-IN")}{" "}
                                                    worth of free products
                                                </p>

                                                <p className="small text-secondary mb-0">
                                                    Get amazing savings on bundled items and freebies!
                                                </p>
                                            </div>
                                        );
                                    })()}
                                </Col>
                            </Row>
                            {/******** static part start here ********/}
                            <h6 className="mb-1"><b>Main Products</b></h6>
                            <Row>
                                {/* item start */}
                                <Col md="4" sm="6" xs="12">
                                    <div className="productItemBx">
                                        <div className="imgBx">
                                            <img src="https://res.cloudinary.com/dshkgcwoh/image/upload/v1761889584/izdnwg07cslmmiwcs0zj.webp" alt="" />
                                        </div>
                                        <div className="textBx">
                                            <h4>Jaisal Extra Long Rice Jaisal Extra Long Rice</h4>
                                            <h5 className="fw-bold mb-1">
                                                ₹12,50<small className="text-muted ms-2" style={{fontSize:'13px'}}><i class="fa fa-balance-scale"></i>12Kg</small>&nbsp;&nbsp;<span className="text-muted" style={{fontSize:'13px'}}><i class="fa fa-cubes"></i>Qty:2</span>
                                            </h5>
                                        </div>
                                    </div>
                                </Col>
                                {/* item end */}
                            </Row>
                            <h6 className="mb-1"><b>Free Products</b></h6>
                            <Row>
                                {/* item start */}
                                <Col md="4" sm="6" xs="12">
                                    <div className="productItemBx">
                                        <div className="imgBx">
                                            <span class="tagBx">Free</span>
                                            <img src="https://res.cloudinary.com/dshkgcwoh/image/upload/v1761889584/izdnwg07cslmmiwcs0zj.webp" alt="" />
                                        </div>
                                        <div className="textBx">
                                            <h4>Jaisal Extra Long Rice Jaisal Extra Long Rice</h4>
                                            <h5 className="fw-bold mb-1">
                                                ₹12,50<small className="text-muted ms-2" style={{fontSize:'13px'}}><i class="fa fa-balance-scale"></i>12Kg</small>&nbsp;&nbsp;<span className="text-muted" style={{fontSize:'13px'}}><i class="fa fa-cubes"></i>Qty:2</span>
                                            </h5>
                                        </div>
                                    </div>
                                </Col>
                                {/* item end */}
                            </Row>
                            {/******** static part end here ********/}


                            {/* ==== Main Products ==== */}
                            <h6 className="fw-bold mb-2 text-uppercase small">Main Products</h6>
                            <Row className="justify-content-center">
                                {selectProduct?.main_products?.map((p, idx) => (
                                    <Col md="6" sm="6" xs="12" key={p?._id} className="d-flex justify-content-center mb-2">
                                        <div
                                            className="border rounded-4 p-2 shadow-sm text-center"
                                            style={{
                                                width: "100%",
                                                maxWidth: "220px",
                                                backgroundColor: "#fff",
                                            }}
                                        >
                                            <img
                                                src={p?.images?.[0]}
                                                alt={p?.itemName}
                                                className="img-fluid rounded-3 mb-2"
                                                style={{
                                                    height: "100px",
                                                    width: "100%",
                                                    objectFit: "contain",
                                                }}
                                            />
                                            <p className="mb-1 fw-semibold text-truncate" title={p?.itemName}>
                                                {p?.itemName}
                                            </p>

                                            <p className="text-muted mb-0" style={{ fontSize: "12px" }}>
                                                ₹
                                                {p?.variant_info?.sale_price ||
                                                    p?.variant_info?.offer_price ||
                                                    p?.variant_info?.price}{" "}
                                                / {p?.variant_info?.variant_title}
                                            </p>
                                            <p className="mb-0 text-secondary" style={{ fontSize: "12px" }}>
                                                Qty: {p.quantity}
                                            </p>
                                        </div>
                                    </Col>
                                ))}
                            </Row>

                            {/* ==== Free Products ==== */}
                            {selectProduct?.free_products?.length > 0 && (
                                <>
                                    <h6 className="fw-bold mt-3 mb-2 text-uppercase small">Free Products</h6>
                                    <Row className="justify-content-center">
                                        {selectProduct?.free_products?.map((p, idx) => (
                                            <Col
                                                md="6"
                                                sm="6"
                                                xs="12"
                                                key={p?._id}
                                                className="d-flex justify-content-center mb-2"
                                            >
                                                <div
                                                    className="border rounded-4 p-2 shadow-sm text-center position-relative"
                                                    style={{
                                                        width: "100%",
                                                        maxWidth: "220px",
                                                        backgroundColor: "#f7fff6",
                                                    }}
                                                >
                                                    <span
                                                        className="badge bg-success position-absolute top-0 end-0 m-1"
                                                        style={{ fontSize: "10px" }}
                                                    >
                                                        FREE
                                                    </span>

                                                    <img
                                                        src={p?.images?.[0]}
                                                        alt={p?.itemName}
                                                        className="img-fluid rounded-3 mb-2"
                                                        style={{
                                                            height: "100px",
                                                            width: "100%",
                                                            objectFit: "contain",
                                                        }}
                                                    />
                                                    <p className="mb-1 fw-semibold text-truncate" title={p?.itemName}>
                                                        {p?.itemName}
                                                    </p>

                                                    <p className="text-success mb-0" style={{ fontSize: "12px" }}>
                                                        Free
                                                    </p>
                                                    <p className="mb-0 text-secondary" style={{ fontSize: "12px" }}>
                                                        Qty: {p.quantity}
                                                    </p>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                </>
                            )}
                        </div>
                    ) : (
                        <p className="text-center small">Loading product details...</p>
                    )}
                </ModalBody>

                <ModalFooter className="d-flex justify-content-between py-2">
                    <button className="btn btn-outline-primary btn-sm rounded-5 px-3" onClick={onCloseModal}>
                        Close
                    </button>
                    <button className="btn btn-primary btn-sm rounded-5 px-3" onClick={() => handleClick1(selectProduct?.slug)}>Add Combo</button>
                </ModalFooter>
            </Modal>



        </CommonLayout>
    );
};

export default Comboproducts;
