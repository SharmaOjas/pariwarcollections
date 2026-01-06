import Title from '../components/Title'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>
          <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12 items-center max-w-6xl mx-auto px-4'>
          <img className='w-full md:w-1/2 lg:w-2/5 rounded-lg shadow-lg' src={assets.about_img} alt="About Pariwar Collection" />
          <div className='flex flex-col justify-center gap-6 md:w-1/2 lg:w-3/5'>
              <p className='text-lg text-gray-700 leading-relaxed'>Pariwar Collection is an imitation jewellery brand founded in October 2023 by Varsha Mangesh Diwale, inspired by the belief that jewellery is not just an ornament, but a part of family traditions, celebrations, and cherished memories.</p>
              <p className='text-lg text-gray-700 leading-relaxed'>Built through years of offline experience at exhibitions and curated stalls, Pariwar Collection is rooted in trust, personal connections, and a deep understanding of customer preferences. Every piece is carefully researched and thoughtfully selected using quality materials to ensure elegance, durability, and a premium finish.</p>
              <p className='text-lg text-gray-700 leading-relaxed'>Specializing in traditional ornaments, our collections reflect grace, heritage, and timeless luxury. Designed for everyday elegance as well as festive and special occasions, our jewellery is created to be worn with pride, gifted with love, and treasured across generations.</p>
              <p className='text-xl font-semibold text-[#53131f]'>At Pariwar Collection, jewellery is more than fashion, it becomes part of the family.</p>
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
