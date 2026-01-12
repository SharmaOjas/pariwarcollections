import Title from '../components/Title'

const TermsAndConditions = () => {
  return (
    <div className='border-t pt-8'>
      <div className='text-center text-2xl'>
        <Title text1={'TERMS &'} text2={'CONDITIONS'} />
      </div>
      <div className='max-w-[800px] mx-auto mt-8 bg-white border rounded-md p-6 text-gray-700'>
        <p className="mb-4 text-sm text-gray-500">Last Updated: January 2026</p>
        
        <section className="mb-6">
            <h3 className='text-lg font-medium mb-2'>1. Acceptance of Terms</h3>
            <p className="text-sm leading-relaxed">By accessing and using the Pariwar Collection website, you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website.</p>
        </section>

        <section className="mb-6">
            <h3 className='text-lg font-medium mb-2'>2. Product Information</h3>
            <p className="text-sm leading-relaxed">We strive to display our products as accurately as possible. However, due to monitor discrepancies and photography lighting, we cannot guarantee that the color you see on your screen will be an exact match to the product. All sizes and measurements are approximate.</p>
        </section>

        <section className="mb-6">
            <h3 className='text-lg font-medium mb-2'>3. Pricing and Payments</h3>
            <ul className='list-disc pl-5 space-y-2 text-sm'>
                <li>All prices are listed in Indian Rupees (INR) and are subject to change without notice.</li>
                <li>We reserve the right to cancel any order if the product is out of stock or if there was a pricing error.</li>
                <li>Payments must be made via the secure payment gateways provided on the website. We do not accept Cash on Delivery (COD).</li>
            </ul>
        </section>

        <section className="mb-6">
            <h3 className='text-lg font-medium mb-2'>4. Use of Content</h3>
            <p className="text-sm leading-relaxed">All content on this site, including text, graphics, logos, images, and software, is the property of Pariwar Collection and is protected by copyright laws. You may not reproduce, distribute, or display any part of this site without our prior written permission.</p>
        </section>

        <section className="mb-6">
            <h3 className='text-lg font-medium mb-2'>5. Liability</h3>
            <p className="text-sm leading-relaxed">Pariwar Collection shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our products or website.</p>
        </section>

        <section className="mb-6">
            <h3 className='text-lg font-medium mb-2'>6. Governing Law</h3>
            <p className="text-sm leading-relaxed">These terms are governed by the laws of India. Any disputes are subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.</p>
        </section>

        <section className="mb-6">
            <h3 className='text-lg font-medium mb-2'>7. Contact Information</h3>
            <p className="text-sm leading-relaxed">For any questions regarding these Terms and Conditions, please contact us at pariwarcollection.jewellery@gmail.com.</p>
        </section>

      </div>
    </div>
  )
}

export default TermsAndConditions
