import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true; // for cookies
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);

    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState({});

    // fetch seller status
    const fetchSellerStatus = async () => {
        try {
            const { data } = await axios.get('/api/seller/is-auth');
            if (data.success) {
                setIsSeller(true);
            } else {
                setIsSeller(false);
            }
        } catch (error) {
            setIsSeller(false);
            console.log("Error fetching seller status:", error.message);
        }
    }

    // fetch user auth status
    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/user/is-auth')
            if (data.success) {
                setUser(data.user)
                setCartItems(data.user.cartItems)
            }
        } catch (error) {
            setUser(null)
        }
    }

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/product/list');
            if (data.success) {
                setProducts(data.products);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching products:", error.message);
            toast.error(error.message);
        }
    }

    const addToCart = (itemId) => {
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        toast.success('Item added to cart');
    }

    const updateCartItem = (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData);
        toast.success('Cart updated successfully');
    }

    const removeFromCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] -= 1;
            if (cartData[itemId] === 0) {
                delete cartData[itemId];
            }
        }
        setCartItems(cartData);
        toast.success('Item removed from cart');
    }

    // get cart item count
    const getCartCount = () => {
        let totalCount = 0;
        for (const item in cartItems) {
            totalCount += cartItems[item];
        }
        return totalCount;
    }

    //get cart total amount
    const getCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            const itemInfo = products.find(product => product._id === item);
            if (itemInfo && cartItems[item] > 0) {
                totalAmount += itemInfo.offerPrice * cartItems[item];
            } else if (!itemInfo){
                console.log(`Product with productId ${item} not found in products list`);
            }
        }
        return Math.floor(totalAmount * 100) / 100; // round to 2 decimal places
    }


    useEffect(() => {
        fetchUser();
        fetchProducts();
        fetchSellerStatus();
    }, []);

    //update db cart items
    useEffect(() => {
        const updateCart = async () => {
            if (!user) return;
            try {
                const { data } = await axios.post('/api/cart/update', { cartItems });
                if (!data.success) {
                    toast.error(data.message);
                }
            } catch (error) {
                console.log(error)
                toast.error(error.message);
            }
        };

        updateCart();
    }, [cartItems, user]);

    const value = { navigate, user, setUser, isSeller, setIsSeller, showUserLogin, setShowUserLogin, products, currency, addToCart, updateCartItem, removeFromCart, cartItems, searchQuery, setSearchQuery, getCartAmount, getCartCount, setCartItems, axios, fetchProducts };

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = () => {
    return useContext(AppContext)
}