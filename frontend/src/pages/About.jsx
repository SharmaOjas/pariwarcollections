import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>
          <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
          <img className='w-[90%] sm:w-[80%] md:max-w-[360px]' src={assets.about_img} alt="About Priwar Collection" />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
              <p>Pariwar Collection is an imitation jewellery brand founded in October 2023 by Varsha Mangesh Diwale, inspired by the belief that jewellery is not just an ornament, but a part of family traditions, celebrations, and cherished memories.</p>
              <p>Built through years of offline experience at exhibitions and curated stalls, Pariwar Collection is rooted in trust, personal connections, and a deep understanding of customer preferences. Every piece is carefully researched and thoughtfully selected using quality materials to ensure elegance, durability, and a premium finish.</p>
              <p>Specializing in traditional ornaments, our collections reflect grace, heritage, and timeless luxury. Designed for everyday elegance as well as festive and special occasions, our jewellery is created to be worn with pride, gifted with love, and treasured across generations.</p>
              <p>At Pariwar Collection, jewellery is more than fashion, it becomes part of the family.</p>
              <div className='mt-4'>
                <p className='text-gray-800 font-medium'>Instagram Bio</p>
                <p>Pariwar Collection</p>
                <p>Imitation Jewellery | Traditional Ornaments</p>
                <p>Where Jewellery Becomes Family 💍</p>
                <p>Offline Exhibitions | Since 2023</p>
                <p>9819506672</p>
              </div>
              {/* <b className='text-gray-800'>Our Craftsmanship</b>
              <p>Our collections are a testament to the skill of our master artisans. Each piece is meticulously handcrafted, blending contemporary design sensibilities with traditional techniques passed down through generations. Whether it's the intricate detailing of a Polki necklace or the sleek lines of a diamond ring, our jewelry embodies a perfect harmony of art and precision.</p>
           */}
          </div>
      </div>

      {/* <div className=' text-xl py-4'>
          <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Authenticity & Quality:</b>
            <p className=' text-gray-600'>We stand by the purity and authenticity of our products. Every piece undergoes rigorous quality checks and comes with necessary certifications to ensure you receive nothing but the best.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Exquisite Design:</b>
            <p className=' text-gray-600'>Our in-house designers create exclusive collections that set trends while retaining a classic charm. We offer a diverse range of styles to suit every occasion and personality.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Customer Commitment:</b>
            <p className=' text-gray-600'>Your satisfaction is our jewel. From personalized consultations to seamless after-sales support, we are dedicated to providing a luxurious and trustworthy shopping experience.</p>
          </div>
      </div> */}

      
      
    </div>
  )
}

export default About
