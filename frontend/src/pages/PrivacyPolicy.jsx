import React from 'react'
import Title from '../components/Title'

const PrivacyPolicy = () => {
  return (
    <div className='border-t pt-8'>
      <div className='text-center text-2xl'>
        <Title text1={'PRIVACY'} text2={'POLICY'} />
      </div>
      <div className='max-w-[800px] mx-auto mt-8 bg-white border rounded-md p-6 text-gray-700'>
        <p className='mb-4'>Pariwar Collection respects your privacy and is committed to protecting your personal information.</p>
        <ul className='list-disc pl-5 space-y-2 mb-6'>
          <li>Customer details are collected only for order processing, delivery, and communication.</li>
          <li>Personal information is never sold, shared, or rented to third parties.</li>
          <li>Payments are processed securely through trusted payment gateways.</li>
          <li>Contact details may be used for order updates or promotional communication (optional).</li>
        </ul>
        <p className='mb-8'>By using our website, you agree to our privacy practices.</p>

        <h3 className='text-lg font-medium mb-3'>Contact Details</h3>
        <div className='space-y-1 text-sm'>
          <p><span className='font-medium'>Business Name:</span> Pariwar Collection</p>
          <p><span className='font-medium'>Owner:</span> Varsha Mangesh Diwale</p>
          <p><span className='font-medium'>Phone:</span> 9819506672</p>
          <p><span className='font-medium'>Email:</span> pariwarcollection.jewellery@gmail.com</p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
