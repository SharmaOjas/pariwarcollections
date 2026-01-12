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
          <li><strong>Information Collection:</strong> We collect personal details such as name, address, email, and phone number when you place an order or sign up. We do not store payment card details directly; they are processed by our secure payment partners.</li>
          <li><strong>Use of Information:</strong> Your data is used for order processing, shipping, customer support, and improving our services. We may send you promotional emails if you opt-in.</li>
          <li><strong>Data Protection:</strong> We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, or disclosure.</li>
          <li><strong>Third Parties:</strong> We do not sell or rent your personal data. We share necessary details only with trusted logistics and payment partners to fulfill your order.</li>
          <li><strong>Cookies:</strong> Our website uses cookies to enhance your browsing experience, remember your preferences, and analyze site traffic.</li>
        </ul>
        
        <h3 className='text-lg font-medium mb-4'>Your Rights</h3>
        <p className="mb-6 text-sm">You have the right to request access to the personal data we hold about you or ask for corrections. You may also unsubscribe from marketing communications at any time.</p>
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
