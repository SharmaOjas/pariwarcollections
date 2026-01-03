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
          <li>Orders are delivered within 0–7 working days from order confirmation.</li>
          <li>Cash on Delivery (COD) is not available.</li>
          <li>Delivery timelines may vary due to location, festivals, exhibitions, or unforeseen circumstances.</li>
          <li>Customers must ensure accurate shipping and contact details while placing the order.</li>
        </ul>
        <h3 className='text-lg font-medium mb-4'>Exchange Policy</h3>
        <ul className='list-disc pl-5 space-y-2 mb-6'>
          <li>Customers must record a clear video while opening the parcel.</li>
          <li>If any manufacturing defect or damage is found, it must be reported within 48 hours of delivery along with the unboxing video.</li>
          <li>Only exchange is allowed. Refunds are not provided under any circumstances.</li>
          <li>Products must be unused and returned in original packaging for exchange approval.</li>
        </ul>
        <h3 className='text-lg font-medium mb-4'>Important Notes</h3>
        <ul className='list-disc pl-5 space-y-2'>
          <li>Exchange requests without an unboxing video will not be accepted.</li>
          <li>Damage caused due to mishandling after delivery is not eligible for exchange.</li>
        </ul>
      </div>
    </div>
  )
}

export default Delivery
