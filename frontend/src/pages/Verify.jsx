import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import {toast} from 'react-toastify'
import axios from 'axios'

const Verify = () => {

    const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext)
    const [searchParams] = useSearchParams()
    
    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')

    const verifyPayment = async () => {
        try {

            if (!token) {
                toast.error('Please login to verify payment')
                navigate('/login', { replace: true })
                return
            }

            const response = await axios.post(backendUrl + '/api/order/verifyStripe', { success, orderId }, { headers: { token } })

            if (response.data.success) {
                setCartItems({})
                sessionStorage.setItem('orderPlaced', 'true')
                navigate('/order-placed', { state: { orderPlaced: true } })
            } else {
                navigate('/payment-failed')
            }

        } catch (error) {
            toast.error(error.response?.data?.message || 'Payment verification failed. Please contact support.')
        }
    }

    useEffect(() => {
        verifyPayment()
    }, [token, success, orderId])

    return (
        <div>

        </div>
    )
}

export default Verify
