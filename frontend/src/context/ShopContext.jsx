import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { ShopContext } from './ShopContextBase'
import PropTypes from 'prop-types'

const ShopContextProvider = (props) => {

    const currency = '₹';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('')
    const navigate = useNavigate();
    const [loadingCount, setLoadingCount] = useState(0)


    const addToCart = async (itemId, size) => {

        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        try {
            const stockRes = await axios.get(backendUrl + `/api/product/stock/${itemId}`)
            if (!stockRes.data.success || stockRes.data.status !== 'In Stock') {
                toast.error('Out of Stock')
                return;
            }
        } catch (error) {
            toast.error('Unable to check stock')
            return;
        }

        setCartItems(cartData);
        
        const productData = products.find((product) => product._id === itemId);

        toast.success(
            <div className="flex items-center gap-3 min-w-[200px]">
                <img className="w-10 h-10 object-cover rounded" src={productData.image[0]} alt="" />
                <div className="flex flex-col">
                    <p className="font-medium text-sm text-gray-800 truncate w-32">{productData.name}</p>
                    <p className="text-xs text-gray-500">Size: {size}</p>
                </div>
            </div>,
            {
                icon: false,
                style: { padding: '10px' }
            }
        )

        if (token) {
            try {

                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })

            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }

    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {
                    void 0
                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {

        let cartData = structuredClone(cartItems);

        cartData[itemId][size] = quantity;

        setCartItems(cartData)

        if (token) {
            try {

                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })

            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }

    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {
                    void 0
                }
            }
        }
        return totalAmount;
    }

    const getProductsData = useCallback(async () => {
        try {

            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.success) {
                setProducts(response.data.products.reverse())
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }, [backendUrl])

    const getUserCart = useCallback(async ( token ) => {
        try {
            
            const response = await axios.post(backendUrl + '/api/cart/get',{},{headers:{token}})
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }, [backendUrl])

    useEffect(() => {
        getProductsData()
    }, [getProductsData])

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
        }
        if (token) {
            getUserCart(token)
        }
    }, [token, getUserCart])

    useEffect(() => {
        const reqInterceptor = axios.interceptors.request.use((config) => {
            setLoadingCount(c => c + 1)
            return config
        }, (error) => {
            setLoadingCount(c => Math.max(0, c - 1))
            return Promise.reject(error)
        })
        const resInterceptor = axios.interceptors.response.use((response) => {
            setLoadingCount(c => Math.max(0, c - 1))
            return response
        }, (error) => {
            setLoadingCount(c => Math.max(0, c - 1))
            return Promise.reject(error)
        })
        return () => {
            axios.interceptors.request.eject(reqInterceptor)
            axios.interceptors.response.eject(resInterceptor)
        }
    }, [])

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart,setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token,
        isLoading: loadingCount > 0
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )

}

ShopContextProvider.propTypes = {
    children: PropTypes.node
}

export default ShopContextProvider;
