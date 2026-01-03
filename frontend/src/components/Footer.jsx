import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        <div>
            <img src={assets.logo} className='mb-5 w-32' alt="" />
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <Link to='/'><li>Home</li></Link>
                <Link to='/about'><li>About us</li></Link>
                <Link to='/delivery'><li>Delivery & Exchange Policy</li></Link>
                <Link to='/privacy-policy'><li>Privacy policy</li></Link>
            </ul>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>+91 98195 06672</li>
                <li>pariwarcollection.jewellery@gmail.com</li>
            </ul>
        </div>

      </div>

        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2024@ Pariwar Collection Jewellery - All Right Reserved.</p>
        </div>

    </div>
  )
}

export default Footer
