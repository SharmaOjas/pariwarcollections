import axios from 'axios'
import { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const List = () => {

  const [list, setList] = useState([])

  const fetchList = async () => {
    try {

      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products.reverse());
      }
      else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    try {

      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token: localStorage.getItem('token') || '' } })

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList();
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>

        {/* ------- List Table Title ---------- */}

        <div className='hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Status</b>
          <b>Qty</b>
          <b className='text-center'>Action</b>
        </div>

        {/* ------ Product List ------ */}

        {
          list.map((item, index) => (
            <div className='grid grid-cols-[1fr_2fr_1fr] md:grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={index}>
              <img className='w-12' src={item.image[0]} alt="" />
              <p className='flex items-center gap-2'>
                <span>{item.name}</span>
                {item.featuredHero ? <span className='px-2 py-0.5 text-xs rounded bg-pink-200'>Hero</span> : null}
              </p>
              <p>{item.category}</p>
              <p>{currency}{item.price}</p>
              <p>{item.inventoryStatus || 'Coming Soon'}</p>
              <div className='flex items-center gap-2'>
                <input type='number' min='0' defaultValue={item.inventoryQuantity || 0} className='border px-2 py-1 w-20' id={`qty-${item._id}`} />
                <select defaultValue={item.inventoryStatus || 'Coming Soon'} className='border px-2 py-1' id={`status-${item._id}`}>
                  <option>In Stock</option>
                  <option>Out of Stock</option>
                  <option>Coming Soon</option>
                </select>
                <button onClick={async ()=>{
                  try {
                    const quantity = Number(document.getElementById(`qty-${item._id}`).value || 0);
                    const status = document.getElementById(`status-${item._id}`).value;
                    if (quantity < 0) {
                      toast.error('Quantity cannot be negative');
                      return;
                    }
                    const response = await axios.post(backendUrl + '/api/product/inventory/update', { id: item._id, quantity, status }, { headers: { token: localStorage.getItem('token') || '' } })
                    if (response.data.success) {
                      toast.success('Inventory Updated');
                      await fetchList();
                    } else {
                      toast.error(response.data.message);
                    }
                  } catch (error) {
                    console.log(error);
                    toast.error(error.message);
                  }
                }} className='border px-3 py-1 bg-gray-100'>Update</button>
                <button onClick={async ()=>{
                  try {
                    const response = await axios.post(backendUrl + '/api/product/hero/set', { id: item._id }, { headers: { token: localStorage.getItem('token') || '' } })
                    if (response.data.success) {
                      toast.success('Hero Product Set');
                      await fetchList();
                    } else {
                      toast.error(response.data.message);
                    }
                  } catch (error) {
                    console.log(error);
                    toast.error(error.message);
                  }
                }} className='border px-3 py-1 bg-pink-100'>Set as Hero</button>
              </div>
              <p onClick={()=>removeProduct(item._id)} className='text-right md:text-center cursor-pointer text-lg'>X</p>
            </div>
          ))
        }

      </div>
    </>
  )
}

export default List
