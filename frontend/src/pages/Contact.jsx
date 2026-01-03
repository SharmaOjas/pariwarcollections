import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div>
      
      <div className='text-center text-2xl pt-10 border-t'>
          <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <div className='text-gray-700 text-sm'>
            <p><span className='font-medium'>Business Name:</span> Pariwar Collection</p>
            <p><span className='font-medium'>Owner:</span> Varsha Mangesh Diwale</p>
            <p><span className='font-medium'>Phone:</span> 9819506672</p>
            <p><span className='font-medium'>Email:</span> pariwarcollection.jewellery@gmail.com</p>
          </div>
          <div className='text-gray-600 text-sm'>
            <p className='font-medium'>Instagram Bio</p>
            <p>Pariwar Collection</p>
            <p>Imitation Jewellery | Traditional Ornaments</p>
            <p>Where Jewellery Becomes Family 💍</p>
            <p>Offline Exhibitions | Since 2023</p>
            <p>9819506672</p>
          </div>
        </div>
      </div>

      
    </div>
  )
}

export default Contact
