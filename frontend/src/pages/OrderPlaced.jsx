import React from 'react'
import { Link } from 'react-router-dom'

const OrderPlaced = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] text-center px-4'>
      <div className='bg-green-100 p-6 rounded-full mb-6'>
        <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h2 className='text-3xl font-medium text-gray-800 mb-4'>Order Placed Successfully!</h2>
      <p className='text-gray-600 mb-8'>Thank you for your purchase. Your order has been confirmed.</p>
      
      <div className='flex gap-4'>
        <Link to='/orders' className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>
          VIEW ORDERS
        </Link>
        <Link to='/' className='border border-black px-8 py-3 text-sm hover:bg-black hover:text-white transition-all'>
          CONTINUE SHOPPING
        </Link>
      </div>
    </div>
  )
}

export default OrderPlaced
