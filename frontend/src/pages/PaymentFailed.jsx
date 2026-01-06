import { Link } from 'react-router-dom'

const PaymentFailed = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] text-center px-4'>
      <div className='bg-red-100 p-6 rounded-full mb-6'>
        <p className='text-4xl'>❌</p>
      </div>
      <h2 className='text-3xl font-medium text-gray-800 mb-4'>Payment Failed</h2>
      <p className='text-gray-600 mb-8'>Something went wrong with your transaction. Please try again.</p>
      
      <div className='flex gap-4'>
        <Link to='/cart' className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>
          TRY AGAIN
        </Link>
        <Link to='/contact' className='border border-black px-8 py-3 text-sm hover:bg-black hover:text-white transition-all'>
          CONTACT SUPPORT
        </Link>
      </div>
    </div>
  )
}

export default PaymentFailed
