import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer
      style={{
        backgroundImage: "url('/footer-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      className="mt-40"
    >
      {/* Overlay */}
      <div className="bg-[#231911]/55 text-[#F4D9B5] px-6 sm:px-16">

        {/* Top Section */}
        <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 py-16 text-sm">

          {/* Logo */}
          <div>
            <img src={assets.logo} className="mb-5 w-40" alt="Pariwar Collection" />
          </div>

          {/* Company */}
          <div>
            <p className="text-2xl font-medium mb-5 text-[#EDC483]">COMPANY</p>
            <ul className="flex flex-col gap-2">
              <Link to="/"><li className="hover:text-white transition">Home</li></Link>
              <Link to="/about"><li className="hover:text-white transition">About us</li></Link>
              <Link to="/delivery"><li className="hover:text-white transition">Delivery & Exchange Policy</li></Link>
              <Link to="/privacy-policy"><li className="hover:text-white transition">Privacy policy</li></Link>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-2xl font-medium mb-5 text-[#EDC483]">GET IN TOUCH</p>
            <ul className="flex flex-col gap-2">
              <li>+91 98195 06672</li>
              <li>pariwarcollection.jewellery@gmail.com</li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <hr className="border-[#EDC483]/30" />

        {/* Bottom */}
        <p className="py-6 text-sm text-center text-[#EDC483]">
          © 2024 Pariwar Collection Jewellery — All Rights Reserved
        </p>

      </div>
    </footer>
  )
}

export default Footer
  
