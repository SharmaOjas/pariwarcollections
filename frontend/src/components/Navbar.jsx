import { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContextBase'

const Navbar = () => {

  const [visible, setVisible] = useState(false)

  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } =
    useContext(ShopContext)

  const logout = () => {
    navigate('/login')
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
  }

  return (
    <>
      {/* Navbar Background */}
      <div
        style={{
          backgroundImage: "url('/footer-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="bg-[#231911]/55">

          {/* Navbar */}
          <div className="flex items-center justify-between py-5 px-4 sm:px-12 font-medium">

            <Link to="/">
              <img src={assets.logo} className="w-36" alt="Logo" />
            </Link>

            {/* Desktop Menu */}
            <ul className="hidden sm:flex gap-6 text-2xl text-[#F4D9B5]">

              <NavLink to="/" className="flex flex-col items-center gap-1">
                <p>HOME</p>
                <hr className="w-2/4 border-none h-[1.5px] bg-[#EDC483] hidden" />
              </NavLink>

              <NavLink to="/collection" className="flex flex-col items-center gap-1">
                <p>COLLECTION</p>
                <hr className="w-2/4 border-none h-[1.5px] bg-[#EDC483] hidden" />
              </NavLink>

              <NavLink to="/about" className="flex flex-col items-center gap-1">
                <p>ABOUT</p>
                <hr className="w-2/4 border-none h-[1.5px] bg-[#EDC483] hidden" />
              </NavLink>

              <NavLink to="/contact" className="flex flex-col items-center gap-1">
                <p>CONTACT</p>
                <hr className="w-2/4 border-none h-[1.5px] bg-[#EDC483] hidden" />
              </NavLink>

            </ul>

            {/* Right Icons */}
            <div className="flex items-center gap-6">

              <img
                onClick={() => {
                  setShowSearch(true)
                  navigate('/collection')
                }}
                src={assets.search_icon}
                className="w-10 cursor-pointer"
                alt=""
              />

              {/* Profile */}
              <div className="group relative">
                <img
                  onClick={() => (token ? null : navigate('/login'))}
                  className="w-10 cursor-pointer"
                  src={assets.profile_icon}
                  alt=""
                />

                {token && (
                  <div className="group-hover:block hidden absolute right-0 pt-4 z-50">
                    <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-[#F4D9B5] text-[#231911] rounded shadow-lg">
                      <p className="font-semibold underline">My Profile</p>
                      <p
                        onClick={() => navigate('/orders')}
                        className="cursor-pointer hover:text-black"
                      >
                        Orders
                      </p>
                      <p
                        onClick={logout}
                        className="cursor-pointer hover:text-black"
                      >
                        Logout
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link to="/cart" className="relative">
                <img src={assets.cart_icon} className="w-10 min-w-5" alt="" />
                <p className="absolute right-[-5px] bottom-[-5px] w-5 text-center leading-5 bg-[#EDC483] text-[#231911] aspect-square rounded-full text-[18px] font-bold">
                  {getCartCount()}
                </p>
              </Link>

              {/* Mobile Menu */}
              <img
                onClick={() => setVisible(true)}
                src={assets.menu_icon}
                className="w-5 cursor-pointer sm:hidden"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 overflow-hidden bg-[#231911] text-[#F4D9B5] transition-all ${
          visible ? 'w-full' : 'w-0'
        }`}
      >
        <div className="flex flex-col">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-4 cursor-pointer border-b border-[#EDC483]/30"
          >
            <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="" />
            <p>Back</p>
          </div>

          <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b border-[#EDC483]/30" to="/">
            HOME
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b border-[#EDC483]/30" to="/collection">
            COLLECTION
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b border-[#EDC483]/30" to="/about">
            ABOUT
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b border-[#EDC483]/30" to="/contact">
            CONTACT
          </NavLink>
        </div>
      </div>
    </>
  )
}

export default Navbar
