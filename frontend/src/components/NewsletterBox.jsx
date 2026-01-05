import React from 'react'
import { motion } from 'framer-motion'

const NewsletterBox = () => {

    const onSubmitHandler = (event) => {
        event.preventDefault();
    }

  return (
    <motion.div 
      className=' text-center'
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <motion.p 
        className='text-2xl font-medium text-gray-800'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        Subscribe now & get 20% off
      </motion.p>
      <motion.p 
        className='text-gray-400 mt-3'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
      >
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
      </motion.p>
      <motion.form 
        onSubmit={onSubmitHandler} 
        className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
      >
        <input className='w-full sm:flex-1 outline-none' type="email" placeholder='Enter your email' required/>
        <button type='submit' className='bg-black text-white text-xs px-10 py-4'>SUBSCRIBE</button>
      </motion.form>
    </motion.div>
  )
}

export default NewsletterBox
