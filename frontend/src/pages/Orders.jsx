import { useContext, useEffect, useState, useCallback } from 'react'
import { ShopContext } from '../context/ShopContextBase'
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';

const Orders = () => {

  const { backendUrl, token , currency, navigate} = useContext(ShopContext);

  const [orderData,setorderData] = useState([])
  const [orders, setOrders] = useState([])
  const [showReceipt, setShowReceipt] = useState(false)
  const [receiptOrder, setReceiptOrder] = useState(null)

  // Check authentication on mount
  useEffect(() => {
    if (!token) {
      toast.error('Please login to view your orders')
      navigate('/login', { replace: true })
      return
    }
  }, [token, navigate])

  const loadOrderData = useCallback(async () => {
    try {
      if (!token) {
        return null
      }

      const response = await axios.post(backendUrl + '/api/order/userorders',{},{headers:{token}})
      if (response.data.success) {
        setOrders(response.data.orders)
        let allOrdersItem = []
        response.data.orders.map((order)=>{
          order.items.map((item)=>{
            const newItem = {
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
              orderId: order._id,
              orderAmount: order.amount,
              address: order.address
            }
            allOrdersItem.push(newItem)
          })
        })
        setorderData(allOrdersItem.reverse())
      }
      
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      }
    }
  }, [backendUrl, token])

  useEffect(()=>{
    loadOrderData()
  },[loadOrderData])

  return (
    <div className='border-t pt-16'>

        <div className='text-2xl'>
            <Title text1={'MY'} text2={'ORDERS'}/>
        </div>

        <div>
            {
              orderData.map((item,index) => (
                <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                    <div className='flex items-start gap-6 text-sm'>
                        <img className='w-16 sm:w-20' src={item.image[0]} alt="" />
                        <div>
                          <p className='sm:text-base font-medium'>{item.name}</p>
                          <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                            <p>{currency}{item.price}</p>
                            <p>Quantity: {item.quantity}</p>
                            <p>Size: {item.size}</p>
                          </div>
                          <p className='mt-1'>Date: <span className=' text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                          <p className='mt-1'>Payment: <span className=' text-gray-400'>{item.paymentMethod}</span></p>
                        </div>
                    </div>
                    <div className='md:w-1/2 flex justify-between'>
                        <div className='flex items-center gap-2'>
                            <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                            <p className='text-sm md:text-base'>{item.status}</p>
                        </div>
                        <div className='flex gap-2'>
                          <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm'>Refresh Order Status</button>
                          <button
                            onClick={() => {
                              const ord = orders.find(o => o._id === item.orderId)
                              setReceiptOrder(ord || null)
                              setShowReceipt(!!ord)
                            }}
                            className='border px-4 py-2 text-sm font-medium rounded-sm'
                          >
                            View Receipt
                          </button>
                        </div>
                    </div>
                </div>
              ))
            }
        </div>
        {showReceipt && receiptOrder && (
          <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-white w-full max-w-[720px] rounded-md p-6'>
              <div className='flex items-center justify-between mb-4'>
                <p className='text-xl font-medium'>Order Receipt</p>
                <button className='px-3 py-1 border rounded' onClick={() => { setShowReceipt(false); setReceiptOrder(null) }}>Close</button>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                <div>
                  <p className='text-gray-700'>Order ID</p>
                  <p className='text-gray-900'>{receiptOrder._id}</p>
                </div>
                <div>
                  <p className='text-gray-700'>Date</p>
                  <p className='text-gray-900'>{new Date(receiptOrder.date).toLocaleString()}</p>
                </div>
                <div>
                  <p className='text-gray-700'>Status</p>
                  <p className='text-gray-900'>{receiptOrder.status}</p>
                </div>
                <div>
                  <p className='text-gray-700'>Payment Method</p>
                  <p className='text-gray-900'>{receiptOrder.paymentMethod}</p>
                </div>
                <div>
                  <p className='text-gray-700'>Total Amount</p>
                  <p className='text-gray-900'>{currency}{receiptOrder.amount}</p>
                </div>
              </div>
              <div className='mt-6'>
                <p className='text-base font-medium mb-2'>Ship To</p>
                <div className='text-sm text-gray-800'>
                  <p>{receiptOrder.address.firstName} {receiptOrder.address.lastName}</p>
                  <p>{receiptOrder.address.street}</p>
                  <p>{receiptOrder.address.city}, {receiptOrder.address.state} {receiptOrder.address.zipcode}</p>
                  <p>{receiptOrder.address.country}</p>
                  <p>Phone: {receiptOrder.address.phone}</p>
                </div>
              </div>
              <div className='mt-6'>
                <p className='text-base font-medium mb-2'>Items</p>
                <div className='divide-y'>
                  {receiptOrder.items.map((it, idx) => (
                    <div key={idx} className='py-3 flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <img src={it.image?.[0]} alt='' className='w-12 h-12 object-cover rounded' />
                        <div>
                          <p className='text-sm font-medium text-gray-900'>{it.name}</p>
                          <p className='text-xs text-gray-600'>Size: {it.size} • Qty: {it.quantity}</p>
                        </div>
                      </div>
                      <div className='text-sm text-gray-900'>
                        <p>{currency}{it.price}</p>
                        <p className='text-gray-600'>{currency}{(it.price || 0) * (it.quantity || 0)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

export default Orders
