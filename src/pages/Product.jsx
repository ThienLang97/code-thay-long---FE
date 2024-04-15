import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { linkBackend } from '../constants/url';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"
import { getCart } from '../redux/slices/cart';

const Product = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const product = JSON.parse(localStorage.getItem("choose_product")) || {};
    const account = JSON.parse(localStorage.getItem("account_user")) || {};
    const [productReal, setProductReal] = useState(product);
    const [imageMain, setImageMain] = useState(product.defaultImage)
    const [tabSelect, setTabSelect] = useState('specifications');
    const [variationSelect, setVariationSelect] = useState({});
    const [err, setErr] = useState({ open: false, message: "", color: "red" });

    const [quantity, setQuantity] = useState(1);

    const handleChangeQuantity = (status) => {
        switch (status) {
            case -1:
                if (quantity > 1) {
                    setQuantity(quantity - 1);
                }
                break;
            case 1:
                if (quantity < 3) {
                    setQuantity(quantity + 1);
                }
                break;
        }
    }

    const getProduct = async () => {
        const result = await axios.get(`${linkBackend}/products/${product.id}`)
        setProductReal(result.data.data);
        setVariationSelect(result.data.data.variations[0]);
    }

    const handleClickAddToCart = async () => {

        const user = JSON.parse(localStorage.getItem("account_user")) || {};

        if (!user?.id) {
            navigate("/login")
            return
        }

        if (quantity > product.stock) {
            setErr({ open: true, message: "The number is not sufficient" })
            setTimeout(() => {
                setErr({ open: false, message: "" })
            }, 2000)
            return
        }

        const data = {
            account_id: user.id,
            variation_id: variationSelect.id,
            quantity
        }

        try {
            const result = await axios.post(`${linkBackend}/carts/create`, data);
            if (result.data.statusCode === 201) {

                dispatch(getCart(account.id));

                setErr({ open: true, message: "Has added the product to the cart", color: "green" })
                setTimeout(() => {
                    setErr({ open: false, message: "", color: "red" })
                }, 2000)
            }
        } catch (error) {
            setErr({ open: true, message: error.response.data.message, color: "red" })
            setTimeout(() => {
                setErr({ open: false, message: "", color: "red" })
            }, 2000)
            return
        }
    }

    useEffect(() => {
        getProduct()
    }, [])

    return (
        <>
            <div className="breadcrumb-area">

                <div className="container">
                    <div className="breadcrumb-content">
                        <ul>
                            <li>
                                <a style={{ cursor: "pointer" }} onClick={() => navigate("/")}>Home</a>
                            </li>
                            <li className="active">Product</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="content-wraper">
                <div className="container">
                    <div className="row single-product-area">
                        <div className="col-lg-5 col-md-6">
                            {/* Product Details Left */}

                            <div classname="product-details-images slider-navigation-1">
                                <div classname="lg-image" style={{ marginBottom: 12 }}>
                                    <img width={450} src={imageMain} alt="product image" />
                                </div>
                                <div style={{ display: "flex", gap: 12, width: 'fit-content' }}>
                                    <div style={{ display: 'inline-block' }} onClick={() => setImageMain(product.defaultImage)} >
                                        <img width={100} src={product.defaultImage} alt="product image" />
                                    </div>
                                    {productReal.images.map((image) => (
                                        <div key={image.id} style={{ display: 'inline-block' }} onClick={() => setImageMain(image.image_path)} >
                                            <img width={100} src={image.image_path} alt="product image" />
                                        </div>
                                    ))}
                                </div>

                            </div>
                            {/*// Product Details Left */}
                        </div>
                        <div className="col-lg-7 col-md-6">
                            <div className="product-details-view-content sp-normal-content pt-60">
                                <div className="product-info">
                                    <h2>{product.name}</h2>
                                    {/* <span className="product-details-ref">Reference: demo_15</span> */}
                                    <div className="rating-box pt-20">
                                        <ul className="rating rating-with-review-item">
                                            {Array(parseInt(productReal.averageRating)).fill().map((_, i) => (
                                                <li key={i}>
                                                    <i className="fa fa-star-o" />
                                                </li>
                                            ))}
                                            {Array(5 - parseInt(productReal.averageRating)).fill().map((_, i) => (
                                                <li key={i} className="no-star">
                                                    <i className="fa fa-star-o" />
                                                </li>
                                            ))}
                                            {/* <li className="review-item">
                                                <a href="#">Read Review</a>
                                            </li>
                                            <li className="review-item">
                                                <a href="#">Write Review</a>
                                            </li> */}
                                        </ul>
                                        <div style={{ paddingTop: "10px", display: "flex" }}>
                                            {
                                                productReal?.variations.map((variation => (
                                                    <div
                                                        key={variation.id}
                                                        style={{
                                                            margin: "5px 10px 5px 0",
                                                            border: `1px solid ${variationSelect.id === variation.id ? "red" : "black"}`,
                                                            padding: "5px 10px",
                                                            display: 'flex',
                                                            gap: 12,
                                                            alignItems: 'center',
                                                            width: 'fit-content',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => {
                                                            setVariationSelect(variation)
                                                            setImageMain(variation.image)
                                                            setQuantity(1)
                                                        }}
                                                    >
                                                        <img width={30} src={variation.image} alt="img" />
                                                        <span style={{ borderRadius: 4, padding: 4, backgroundColor: `${variation.color}`, color: "white" }}>{variation.color}</span>
                                                        <span>${variation.price}</span>
                                                        <span>{variation.stock}</span>
                                                    </div>
                                                )))
                                            }
                                        </div>
                                    </div>
                                    <div className="price-box pt-20">
                                        <span>Sale: </span>
                                        <span className="new-price new-price-2">{productReal.discountPercentage}%</span>
                                        {/* <span className="new-price new-price-2" style={{ color: "green" }}>${(productReal.price * (100 - productReal.discountPercentage) / 100).toFixed(2)}</span> */}
                                    </div>
                                    <div className="product-desc">
                                        <p>
                                            <span>
                                                {productReal.description}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="single-add-to-cart">
                                        <form className="cart-quantity">
                                            <div className="quantity">
                                                <label>Quantity</label>
                                                <div className="cart-plus-minus">
                                                    <input
                                                        className="cart-plus-minus-box"
                                                        defaultValue={1}
                                                        type="text"
                                                        value={quantity}
                                                    />
                                                    <div className="dec qtybutton" onClick={() => handleChangeQuantity(-1)}>
                                                        <i className="fa fa-angle-down" />
                                                    </div>
                                                    <div className="inc qtybutton" onClick={() => handleChangeQuantity(1)}>
                                                        <i className="fa fa-angle-up" />
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="add-to-cart" type='button'
                                                onClick={() => handleClickAddToCart()}
                                            >
                                                Add to cart
                                            </button>
                                            {err.open && <p style={{ color: `${err.color}` }}>{err.message}</p>}
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            <div className="product-area pt-40">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="li-product-tab">
                                <ul className="nav li-product-menu">
                                    <li onClick={() => setTabSelect('specifications')}>
                                        <a data-toggle="tab">
                                            <span>Product Details</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a data-toggle="tab">
                                            <span>Reviews</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            {/* Begin Li's Tab Menu Content Area */}
                        </div>
                    </div>
                    <div className="tab-content">
                        <div id="description" className="tab-pane active show" role="tabpanel">
                            <div className="product-description">
                                <span>
                                    <pre style={{ whiteSpace: "pre-line" }}>
                                        {product[tabSelect]}
                                    </pre>
                                </span>
                            </div>
                        </div>
                        <div id="reviews" className="tab-pane" role="tabpanel">
                            <div className="product-reviews">
                                <div className="product-details-comment-block">
                                    <div className="comment-review">
                                        <span>Grade</span>
                                        <ul className="rating">
                                            <li>
                                                <i className="fa fa-star-o" />
                                            </li>
                                            <li>
                                                <i className="fa fa-star-o" />
                                            </li>
                                            <li>
                                                <i className="fa fa-star-o" />
                                            </li>
                                            <li className="no-star">
                                                <i className="fa fa-star-o" />
                                            </li>
                                            <li className="no-star">
                                                <i className="fa fa-star-o" />
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="comment-author-infos pt-25">
                                        <span>HTML 5</span>
                                        <em>01-12-18</em>
                                    </div>
                                    <div className="comment-details">
                                        <h4 className="title-block">Demo</h4>
                                        <p>Plaza</p>
                                    </div>
                                    <div className="review-btn">
                                        <a
                                            className="review-links"
                                            href="#"
                                            data-toggle="modal"
                                            data-target="#mymodal"
                                        >
                                            Write Your Review!
                                        </a>
                                    </div>
                                    {/* Begin Quick View | Modal Area */}
                                    <div className="modal fade modal-wrapper" id="mymodal">
                                        <div
                                            className="modal-dialog modal-dialog-centered"
                                            role="document"
                                        >
                                            <div className="modal-content">
                                                <div className="modal-body">
                                                    <h3 className="review-page-title">Write Your Review</h3>
                                                    <div className="modal-inner-area row">
                                                        <div className="col-lg-6">
                                                            <div className="li-review-product">
                                                                <img
                                                                    src="images/product/large-size/3.jpg"
                                                                    alt="Li's Product"
                                                                />
                                                                <div className="li-review-product-desc">
                                                                    <p className="li-product-name">
                                                                        Today is a good day Framed poster
                                                                    </p>
                                                                    <p>
                                                                        <span>
                                                                            Beach Camera Exclusive Bundle - Includes Two
                                                                            Samsung Radiant 360 R3 Wi-Fi Bluetooth Speakers.
                                                                            Fill The Entire Room With Exquisite Sound via
                                                                            Ring Radiator Technology. Stream And Control R3
                                                                            Speakers Wirelessly With Your Smartphone.
                                                                            Sophisticated, Modern Design{" "}
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <div className="li-review-content">
                                                                {/* Begin Feedback Area */}
                                                                <div className="feedback-area">
                                                                    <div className="feedback">
                                                                        <h3 className="feedback-title">Our Feedback</h3>
                                                                        <form action="#">
                                                                            <p className="your-opinion">
                                                                                <label>Your Rating</label>
                                                                                <span>
                                                                                    <select className="star-rating">
                                                                                        <option value={1}>1</option>
                                                                                        <option value={2}>2</option>
                                                                                        <option value={3}>3</option>
                                                                                        <option value={4}>4</option>
                                                                                        <option value={5}>5</option>
                                                                                    </select>
                                                                                </span>
                                                                            </p>
                                                                            <p className="feedback-form">
                                                                                <label htmlFor="feedback">Your Review</label>
                                                                                <textarea
                                                                                    id="feedback"
                                                                                    name="comment"
                                                                                    cols={45}
                                                                                    rows={8}
                                                                                    aria-required="true"
                                                                                    defaultValue={""}
                                                                                />
                                                                            </p>
                                                                            <div className="feedback-input">
                                                                                <p className="feedback-form-author">
                                                                                    <label htmlFor="author">
                                                                                        Name<span className="required">*</span>
                                                                                    </label>
                                                                                    <input
                                                                                        id="author"
                                                                                        name="author"
                                                                                        defaultValue=""
                                                                                        size={30}
                                                                                        aria-required="true"
                                                                                        type="text"
                                                                                    />
                                                                                </p>
                                                                                <p className="feedback-form-author feedback-form-email">
                                                                                    <label htmlFor="email">
                                                                                        Email<span className="required">*</span>
                                                                                    </label>
                                                                                    <input
                                                                                        id="email"
                                                                                        name="email"
                                                                                        defaultValue=""
                                                                                        size={30}
                                                                                        aria-required="true"
                                                                                        type="text"
                                                                                    />
                                                                                    <span className="required">
                                                                                        <sub>*</sub>
                                                                                        Required fields
                                                                                    </span>
                                                                                </p>
                                                                                <div className="feedback-btn pb-15">
                                                                                    <a
                                                                                        href="#"
                                                                                        className="close"
                                                                                        data-dismiss="modal"
                                                                                        aria-label="Close"
                                                                                    >
                                                                                        Close
                                                                                    </a>
                                                                                    <a href="#">Submit</a>
                                                                                </div>
                                                                            </div>
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                                {/* Feedback Area End Here */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Quick View | Modal Area End Here */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Product