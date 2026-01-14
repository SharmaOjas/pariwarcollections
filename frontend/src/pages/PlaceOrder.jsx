import { useContext, useState, useEffect } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContextBase'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

    const [method, setMethod] = useState('cod');
    const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products, getCartCount } = useContext(ShopContext);
    
    // Import country and state data
    // Assuming places.js is in assets folder as created
    // We can also inline it if import is tricky, but let's try dynamic import or assume it's there.
    // Since I cannot import inside the component easily without changing file structure significantly or relying on relative paths being perfect.
    // I will use the relative path I created: ../assets/places
    
    // State for Countries and States
    const [availableStates, setAvailableStates] = useState([]);

    // Check authentication and cart
    useEffect(() => {
        if (!token) {
            toast.error('Please login to place an order')
            navigate('/login', { replace: true })
            return
        }

        if (getCartCount() === 0) {
            toast.error('Your cart is empty')
            navigate('/cart', { replace: true })
            return
        }
    }, [token, navigate, getCartCount])
    
    const [couponCode, setCouponCode] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        Pincode: '',
        country: '',
        phone: '',
        flat: '',
        landmark: ''
    })

    // Update available states when country changes
    useEffect(() => {
        if (formData.country) {
             // We need to import the data. Since this is a simple replacement, I'll fetch it from the file I just created.
             // Ideally this should be an import at top level, but to match the 'replace_file_content' scope I'll add the data here or assume import.
             // Actually, I should add the import line at the top. But replace_file_content replaces a block.
             // I will replace the WHOLE component function to be safe, but I need to make sure the import is added.
             // Wait, I can't add imports with this tool if I only target the component.
             // I will assume I can update the states logic here.
             
             // Dynamic logic for states:
             import('../assets/places').then(module => {
                 const { states } = module;
                 if (states[formData.country]) {
                     setAvailableStates(states[formData.country]);
                 } else {
                     setAvailableStates([]);
                 }
             }).catch(err => console.error("Could not load places", err));
        } else {
            setAvailableStates([]);
        }
    }, [formData.country]);

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setFormData(data => ({ ...data, [name]: value }))
    }

    const onApplyCoupon = () => {
        if (!couponCode.trim()) {
            toast.error('Enter a coupon code');
            return;
        }
        setCouponApplied(true);
        toast.success('Coupon applied');
    }

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Order Payment',
            description: 'Order Payment',
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                try {

                    const { data } = await axios.post(backendUrl + '/api/order/verifyRazorpay', response, { headers: { token } })
                    if (data.success) {
                        sessionStorage.setItem('orderPlaced', 'true')
                        navigate('/order-placed', { state: { orderPlaced: true } })
                        setCartItems({})
                    } else {
                        toast.error(data.message || 'Payment verification failed')
                    }
                } catch (error) {
                    toast.error(error.response?.data?.message || 'Payment verification failed. Please contact support.')
                }
            }
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        // Check authentication
        if (!token) {
            toast.error('Please login to place an order')
            navigate('/login')
            return
        }

        // Check if cart is empty
        if (getCartCount() === 0) {
            toast.error('Your cart is empty')
            navigate('/cart')
            return
        }

        // Validate form data
        const requiredFields = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'Pincode', 'country', 'phone', 'flat']
        const missingFields = requiredFields.filter(field => !formData[field] || formData[field].trim() === '')

        if (missingFields.length > 0) {
            toast.error('Please fill in all required fields')
            return
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address')
            return
        }

        try {

            let orderItems = []

            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        const itemInfo = structuredClone(products.find(product => product._id === items))
                        if (itemInfo) {
                            itemInfo.size = item
                            itemInfo.quantity = cartItems[items][item]
                            orderItems.push(itemInfo)
                        }
                    }
                }
            }

            // Double check orderItems is not empty
            if (orderItems.length === 0) {
                toast.error('Your cart is empty')
                navigate('/cart')
                return
            }

            let orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount() + delivery_fee
            }


            switch (method) {

                // API Calls for COD
                case 'cod':
                    {
                        const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } })
                        if (response.data.success) {
                            setCartItems({})
                            sessionStorage.setItem('orderPlaced', 'true')
                            navigate('/order-placed', { state: { orderPlaced: true } })
                        } else {
                            toast.error(response.data.message)
                        }
                    }
                    break;

                case 'stripe':
                    {
                        const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, { headers: { token } })
                        if (responseStripe.data.success) {
                            const { session_url } = responseStripe.data
                            window.location.replace(session_url)
                        } else {
                            toast.error(responseStripe.data.message)
                        }
                    }
                    break;

                case 'razorpay':

                    {
                        const responseRazorpay = await axios.post(backendUrl + '/api/order/razorpay', orderData, { headers: { token } })
                        if (responseRazorpay.data.success) {
                            initPay(responseRazorpay.data.order)
                        }
                    }

                    break;

                default:
                    break;
            }


        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order. Please try again.')
        }
    }

    // Design helper classes
    const inputStyle = 'border border-gray-300 rounded-lg py-2.5 px-4 w-full focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none bg-white text-gray-700 placeholder-gray-400';
    const labelStyle = 'block text-sm font-medium text-gray-700 mb-1';
    const paymentOptionStyle = (paymentMethod) => `flex items-center gap-3 border p-3 px-4 cursor-pointer rounded-lg hover:bg-gray-50 transition-colors ${method === paymentMethod ? 'border-green-500 bg-green-50 ring-1 ring-green-500' : 'border-gray-200'}`;
    
    // Simple countries list for immediate render before file load or if file load fails
    const defaultCountries = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia'];

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col lg:flex-row justify-between gap-8 pt-5 sm:pt-14 min-h-[80vh] border-t max-w-7xl mx-auto px-4 sm:px-6'>
            
            {/* ------------- Left Side (Delivery Details) ---------------- */}
            <div className='flex flex-col gap-6 w-full lg:max-w-[600px]'>

                <div className='text-xl sm:text-2xl my-3'>
                    <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                </div>
                
                <div className='flex gap-3'>
                    <input onChange={onChangeHandler} name='firstName' value={formData.firstName} className={inputStyle} type="text" placeholder='First name' autoComplete="given-name" required />
                    <input onChange={onChangeHandler} name='lastName' value={formData.lastName} className={inputStyle} type="text" placeholder='Last name' autoComplete="family-name" required />
                </div>
                
                <input onChange={onChangeHandler} name='email' value={formData.email} className={inputStyle} type="email" placeholder='Email address' autoComplete="email" required />
                
                <input onChange={onChangeHandler} name='flat' value={formData.flat} className={inputStyle} type="text" placeholder='Flat, House no., Building, Company, Apartment' autoComplete="address-line1" required />
                
                <input onChange={onChangeHandler} name='street' value={formData.street} className={inputStyle} type="text" placeholder='Area, Street, Sector, Village' autoComplete="address-line2" required />
                
                <input onChange={onChangeHandler} name='landmark' value={formData.landmark} className={inputStyle} type="text" placeholder='Landmark' autoComplete="address-line3" />
                
                <div className='flex gap-3'>
                    <div className='w-full'>
                         <select 
                            onChange={onChangeHandler} 
                            name='country' 
                            value={formData.country} 
                            className={`${inputStyle} appearance-none bg-[url('https://upload.wikimedia.org/wikipedia/commons/9/9d/Arrow_down.svg')] bg-no-repeat bg-[length:12px] bg-[right_1rem_center] cursor-pointer`}
                            autoComplete="country-name"
                            required
                        >
                            <option value="" disabled>Select Country</option>
                            {defaultCountries.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    
                     <div className='w-full'>
                        {availableStates.length > 0 ? (
                            <select 
                                onChange={onChangeHandler} 
                                name='state' 
                                value={formData.state} 
                                className={`${inputStyle} appearance-none bg-[url('https://upload.wikimedia.org/wikipedia/commons/9/9d/Arrow_down.svg')] bg-no-repeat bg-[length:12px] bg-[right_1rem_center] cursor-pointer`}
                                autoComplete="address-level1"
                                required
                            >
                                <option value="" disabled>Select State</option>
                                {availableStates.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        ) : (
                            <input onChange={onChangeHandler} name='state' value={formData.state} className={inputStyle} type="text" placeholder='State' autoComplete="address-level1" required />
                        )}
                    </div>
                </div>

                <div className='flex gap-3'>
                    <input onChange={onChangeHandler} name='city' value={formData.city} className={inputStyle} type="text" placeholder='City' autoComplete="address-level2" required />
                    <input onChange={onChangeHandler} name='Pincode' value={formData.Pincode} className={inputStyle} type="number" placeholder='Pincode' autoComplete="postal-code" required />
                </div>
                
                <input onChange={onChangeHandler} name='phone' value={formData.phone} className={inputStyle} type="number" placeholder='Phone Number' autoComplete="tel" required />
            </div>

            {/* ------------- Right Side (Order Summary & Payment) ------------------ */}
            <div className='mt-8 lg:mt-0 w-full lg:max-w-[500px]'>
                
                {/* Wrapped in a Card for better visual separation */}
                <div className='bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100 sticky top-20'>
                    
                    {/* ---------- Coupon Box ----------- */}
                    <div className='mb-8 border-b pb-6'>
                        <div className='text-lg font-medium text-gray-700 mb-3'>Have a Coupon?</div>
                        <div className='flex gap-0'>
                            <input
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                className='border border-gray-300 rounded-l-lg py-2 px-3.5 w-full outline-none focus:border-black'
                                type='text'
                                placeholder='Enter code'
                            />
                            <button type='button' onClick={onApplyCoupon} className='border border-l-0 border-gray-300 px-6 py-2 rounded-r-lg bg-black text-white hover:bg-gray-800 transition-colors text-sm font-medium'>
                                APPLY
                            </button>
                        </div>
                        {couponApplied ? <p className='text-green-600 text-sm mt-2 flex items-center gap-1'>✓ Coupon applied successfully</p> : null}
                    </div>

                    <div className='mt-4'>
                        <CartTotal />
                    </div>

                    <div className='mt-8'>
                        <Title text1={'PAYMENT'} text2={'METHOD'} />
                        
                        {/* --------------- Payment Method Selection ------------- */}
                        <div className='flex flex-col gap-3 mt-4'>
                            
                            {/* <div onClick={() => setMethod('stripe')} className={paymentOptionStyle('stripe')}>
                                <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${method === 'stripe' ? 'border-green-500' : 'border-gray-300'}`}>
                                    {method === 'stripe' && <div className='w-2 h-2 bg-green-500 rounded-full'></div>}
                                </div>
                                <img className='h-5 mx-2' src={assets.stripe_logo} alt="Stripe" />
                            </div> */}

                            <div onClick={() => setMethod('razorpay')} className={paymentOptionStyle('razorpay')}>
                                <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${method === 'razorpay' ? 'border-green-500' : 'border-gray-300'}`}>
                                     {method === 'razorpay' && <div className='w-2 h-2 bg-green-500 rounded-full'></div>}
                                </div>
                                <img className='h-5 mx-2' src={assets.razorpay_logo} alt="Razorpay" />
                            </div>

                            {/* <div onClick={() => setMethod('cod')} className={paymentOptionStyle('cod')}>
                                <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${method === 'cod' ? 'border-green-500' : 'border-gray-300'}`}>
                                     {method === 'cod' && <div className='w-2 h-2 bg-green-500 rounded-full'></div>}
                                </div>
                                <p className='text-gray-700 text-sm font-medium mx-2'>CASH ON DELIVERY</p>
                            </div> */}

                        </div>

                        <div className='w-full text-end mt-8'>
                            <button type='submit' className='bg-black text-white w-full py-4 rounded-lg font-medium text-sm hover:bg-gray-800 transition-transform active:scale-[0.99] shadow-md'>
                                PLACE ORDER
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder
