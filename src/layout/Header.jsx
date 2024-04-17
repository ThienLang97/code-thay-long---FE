import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom"
import { getCart, saveCart } from '../redux/slices/cart';

const Header = () => {

    const cart = useSelector(state => state.cart.data)
    const userLogin = JSON.parse(localStorage.getItem("account_user")) || {}
    const categories = useSelector(state => state.category.data);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(saveCart(null))
        localStorage.removeItem("account_user")
        navigate("/")
    }

    useEffect(() => {
        if (userLogin.id) {
            dispatch(getCart(userLogin.id))
        }
    }, [])

    return (
        <header>
            {/* Begin Header Middle Area */}
            <div className="header-middle pl-sm-0 pr-sm-0 pl-xs-0 pr-xs-0">
                <div className="container">
                    <div className="row">
                        {/* Begin Header Logo Area */}
                        <div className="col-lg-3">
                            <div className="logo pb-sm-30 pb-xs-30" onClick={() => navigate("/")}>
                                <a>
                                    <img src="images/menu/logo/1.jpg" alt="" />
                                </a>
                            </div>
                        </div>
                        {/* Header Logo Area End Here */}
                        {/* Begin Header Middle Right Area */}
                        <div className="col-lg-9 pl-0 ml-sm-15 ml-xs-15">
                            {/* Begin Header Middle Searchbox Area */}
                            <form action="#" className="hm-searchbox" style={{ minWidth: "500px !important" }}>
                                <select className="nice-select select-search-category">
                                    <option value={0}>All</option>
                                    {categories?.map((c) => (
                                        <option key={c.id} value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                                <input type="text" placeholder="Enter your search key ..." />
                                <button className="li-btn" type="submit">
                                    <i className="fa fa-search" />
                                </button>
                            </form>
                            {/* Header Middle Searchbox Area End Here */}
                            {/* Begin Header Middle Right Area */}
                            <div className="header-middle-right">
                                <ul className="hm-menu">
                                    {/* Begin Header Middle Wishlist Area */}

                                    <li className="hm-wishlist">
                                        <a href="wishlist.html">
                                            <span className="cart-item-count wishlist-item-count">0</span>
                                            <i className="fa fa-heart-o" />
                                        </a>
                                    </li>

                                    {/* Header Middle Wishlist Area End Here */}
                                    {/* Begin Header Mini Cart Area */}
                                    <li className="hm-minicart" onClick={() => navigate("/cart")}>
                                        <div className="hm-minicart-trigger">
                                            <span className="item-icon" />
                                            <span className="item-text">
                                                Cart
                                                <span className="cart-item-count">{cart ? cart?.length : 0}</span>
                                            </span>
                                        </div>
                                    </li>

                                    <li style={{ marginTop: 10 }}>
                                        <span style={{ border: "1px solid pink", padding: "5px 10px", cursor: "pointer" }}>
                                            {
                                                userLogin?.name ?
                                                    <span className='dra-menu' style={{ position: "relative" }}>
                                                        <span>{userLogin.name}</span>
                                                        <span style={{
                                                            margin: "0 10px",
                                                            borderRadius: 4,
                                                            backgroundColor: "#e80f0f",
                                                            padding: "3px 5px",
                                                            color: "white"
                                                        }}
                                                            onClick={handleLogout}
                                                        >
                                                            Logout
                                                        </span>
                                                        <ul className='dra-menu-ul' >
                                                            <li className='dra-menu-li'>Account</li>
                                                            <li className='dra-menu-li' onClick={() => navigate('/order')}>Order</li>
                                                        </ul>
                                                    </span>
                                                    :
                                                    <span onClick={() => navigate("/login")}>Login / Register</span>
                                            }
                                        </span>
                                    </li>

                                    {/* Header Mini Cart Area End Here */}
                                </ul>
                            </div>
                            {/* Header Middle Right Area End Here */}
                        </div>
                        {/* Header Middle Right Area End Here */}
                    </div>
                </div>
            </div>
            {/* Header Middle Area End Here */}
            {/* Begin Header Bottom Area */}
            <div className="header-bottom header-sticky d-none d-lg-block d-xl-block">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            {/* Begin Header Bottom Menu Area */}
                            <div className="hb-menu">
                                <nav>
                                    <ul>
                                        <li className="megamenu-holder">
                                            <a href="#">Category</a>

                                            <ul className="megamenu hb-megamenu">
                                                {categories?.map((c) => (
                                                    <li key={c.id}>
                                                        <a href="#">{c.name}</a>
                                                        <ul>
                                                            {c.brands.map((b) => (
                                                                <li key={b.id}>
                                                                    <img width={50} src={b.logo} alt="logo" />
                                                                    <a onClick={() => navigate("/category")} style={{ display: "inline-block", marginLeft: 8 }}>{b.name}</a>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                        {/* none */}
                                        <li className="megamenu-static-holder">
                                            <a href="index.html">Pages</a>
                                            <ul className="megamenu hb-megamenu">
                                                <li>
                                                    <a href="#">Pages</a>
                                                    <ul>
                                                        <li>
                                                            <a href="#">Home</a>
                                                        </li>
                                                        <li>
                                                            <a href="#">Category</a>
                                                        </li>
                                                        <li>
                                                            <a href="#">Cart</a>
                                                        </li>
                                                        <li>
                                                            <a href="#">Order</a>
                                                        </li>
                                                    </ul>
                                                </li>


                                            </ul>
                                        </li>
                                        <li>
                                            <a href="about-us.html">About Us</a>
                                        </li>
                                        <li>
                                            <a href="contact.html">Contact</a>
                                        </li>

                                    </ul>
                                </nav>
                            </div>
                            {/* Header Bottom Menu Area End Here */}
                        </div>
                    </div>
                </div>
            </div>
            {/* Header Bottom Area End Here */}
            {/* Begin Mobile Menu Area */}
            <div className="mobile-menu-area d-lg-none d-xl-none col-12">
                <div className="container" >
                    <div className="row">
                        <div className="mobile-menu"></div>
                    </div>
                </div>
            </div>
            {/* Mobile Menu Area End Here */}
        </header>

    )
}

export default Header