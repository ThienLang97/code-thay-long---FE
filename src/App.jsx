import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './layout/Layout'
import './App.css'
import Home from './pages/Home'
import { useDispatch } from 'react-redux'
import { getProducts } from './redux/slices/product'
import { getCategories } from './redux/slices/category'
import { getBrands } from './redux/slices/brand'
import Category from './pages/Category'
import Product from './pages/Product'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Order from './pages/Order'
function App() {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCategories());
        dispatch(getBrands());
        dispatch(getProducts());
    }, [])

    return (
        <Routes>
            <Route path='/' element={<Layout />}>
                <Route index element={<Home />} />
                <Route path='/category' element={<Category />} />
                <Route path='/product' element={<Product />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/checkout' element={<Checkout />} />
                <Route path='/order' element={<Order />} />
            </Route>
            <Route path='/login' element={<Login />} />
            <Route path='*' element={<NotFound />} />
        </Routes>
    )
}

export default App
