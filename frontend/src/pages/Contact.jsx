import Title from '../components/Title'

const Contact = () => {
  return (
    <div>
      
      <div className='text-center text-2xl pt-10 border-t'>
          <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col items-center justify-center gap-8 max-w-2xl mx-auto px-4 mb-28'>
        <div className='text-center'>
          <div className='text-gray-700 text-lg mb-6'>
            <p className='mb-2'><span className='font-semibold text-[#53131f]'>Business Name:</span> Pariwar Collection</p>
            <p className='mb-2'><span className='font-semibold text-[#53131f]'>Owner:</span> Varsha Mangesh Diwale</p>
            <p className='mb-2'><span className='font-semibold text-[#53131f]'>Phone:</span> 9819506672</p>
            <p className='mb-4'><span className='font-semibold text-[#53131f]'>Email:</span> pariwarcollection.jewellery@gmail.com</p>
          </div>
        </div>
      </div>

      
    </div>
  )
}

export default Contact
