import Title from '../components/Title'

const Delivery = () => {
  return (
    <div className='border-t pt-8'>
      <div className='text-center text-2xl'>
        <Title text1={'DELIVERY & EXCHANGE'} text2={'POLICY'} />
      </div>
      <div className='max-w-[800px] mx-auto mt-8 bg-white border rounded-md p-6 text-gray-700'>
        <h3 className='text-lg font-medium mb-4'>Delivery Policy</h3>
        <ul className='list-disc pl-5 space-y-2 mb-6'>
          <li>Orders are typically processed within 24-48 hours of payment confirmation.</li>
          <li>Standard delivery time is 0–7 working days within India. Remote locations may take longer.</li>
          <li>Cash on Delivery (COD) is strictly not available.</li>
          <li>We use reputed courier partners to ensure safe delivery. Tracking details will be shared via email/SMS once shipped.</li>
          <li>Delivery timelines may be affected by public holidays, festivals, natural calamities, or force majeure events.</li>
          <li>In case of a missed delivery, our courier partner will attempt to deliver again. Please ensure your contact number is active.</li>
        </ul>

        <h3 className='text-lg font-medium mb-4'>Shipping Charges</h3>
        <p className="mb-6 text-sm">Shipping charges are calculated at checkout based on the total weight of the package and the delivery location. Free shipping may differ based on cart value.</p>

        <h3 className='text-lg font-medium mb-4'>Exchange Policy</h3>
        <ul className='list-disc pl-5 space-y-2 mb-6'>
          <li><strong>Mandatory Unboxing Video:</strong> Customers must record a clear, 360-degree unboxing video without cuts/edits starting from showing the sealed package label.</li>
          <li><strong>Eligibility:</strong> Exchange is only applicable for products with manufacturing defects or damage during transit clearly visible in the unboxing video.</li>
          <li><strong>Reporting Window:</strong> Issues must be reported within 48 hours of delivery via email/WhatsApp with the video proof.</li>
          <li><strong>Condition:</strong> Products must be unused, unworn, and in their original packaging with tags intact.</li>
          <li><strong>No Refunds:</strong> We do not offer monetary refunds. Only exchanges or credit notes (at our discretion) are provided.</li>
        </ul>
        
        <h3 className='text-lg font-medium mb-4'>Non-Exchangeable Items</h3>
        <ul className='list-disc pl-5 space-y-2 mb-6'>
           <li>Customized or personalized jewellery.</li>
           <li>Items purchased during clearance sales or special promotions.</li>
           <li>Minor color variations due to photography/lighting.</li>
        </ul>

        <h3 className='text-lg font-medium mb-4'>Important Notes</h3>
        <ul className='list-disc pl-5 space-y-2'>
          <li>Exchange requests without a proper unboxing video will be summarily rejected.</li>
          <li>We are not responsible for damage caused by mishandling after delivery.</li>
        </ul>
      </div>
    </div>
  )
}

export default Delivery
