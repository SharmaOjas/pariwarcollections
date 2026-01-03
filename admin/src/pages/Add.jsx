import { useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Add = () => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  
  const images = [image1, image2, image3, image4];
  const imageSetters = [setImage1, setImage2, setImage3, setImage4];

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Anklet');
  const [bestseller, setBestseller] = useState(false);
  const [allowCustomSize, setAllowCustomSize] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [currSize, setCurrSize] = useState('');

  const addSize = () => {
    if (currSize && !sizes.includes(currSize)) {
      setSizes(prev => [...prev, currSize]);
      setCurrSize('');
    }
  };

  const removeSize = (sizeToRemove) => {
    setSizes(prev => prev.filter(size => size !== sizeToRemove));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('bestseller', bestseller ? 'true' : 'false');
      formData.append('allowCustomSize', allowCustomSize ? 'true' : 'false');
      formData.append('sizes', JSON.stringify(sizes));

      image1 && formData.append('image1', image1);
      image2 && formData.append('image2', image2);
      image3 && formData.append('image3', image3);
      image4 && formData.append('image4', image4);

      const response = await axios.post(backendUrl + '/api/product/add', formData, { headers: { token: localStorage.getItem('token') || '' } });

      if (response.data.success) {
        toast.success(response.data.message);
        setName('');
        setDescription('');
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice('');
        setAllowCustomSize(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2">
          {images.map((img, index) => (
            <label key={index} htmlFor={`image${index + 1}`}>
              <img className="w-20" src={!img ? assets.upload_area : URL.createObjectURL(img)} alt="" />
              <input onChange={(e) => imageSetters[index](e.target.files[0])} type="file" id={`image${index + 1}`} hidden />
            </label>
          ))}
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Product name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className="w-full max-w-[500px] px-3 py-2" type="text" placeholder="Type here" required />
      </div>

      <div className="w-full">
        <p className="mb-2">Product description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className="w-full max-w-[500px] px-3 py-2" type="text" placeholder="Write content here" required />
      </div>

      <div className="w-full">
        <p className="mb-2">Product category</p>
        <select onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2">
          {[ 
            'Hair Accessories',
            'Neck Accessories',
            'Ear Accessories',
            'Finger Accessories',
            'Nose Accessories',
            'Foot Accessories',
            'Jewellery Sets',
            'Traditional Jewellery',
            'Hand Accessories',
            'Waist Accessories',
            'Other accessories'
          ].map((sub) => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>
      </div>

      <div>
        <p className="mb-2">Product Price</p>
        <input onChange={(e) => setPrice(e.target.value)} value={price} className="w-full px-3 py-2 sm:w-[120px]" type="Number" min="0" placeholder="25" />
      </div>

      <div>
        <p className="mb-2">Product Sizes</p>
        <div className="flex gap-2">
          <input 
            onChange={(e) => setCurrSize(e.target.value)} 
            value={currSize} 
            className="w-full px-3 py-2 sm:w-[120px]" 
            type="text" 
            placeholder="Size" 
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSize();
              }
            }}
          />
          <button type="button" onClick={addSize} className="bg-black text-white px-3 py-2">Add</button>
        </div>
        <div className="flex gap-3 flex-wrap mt-2">
          {sizes.map((size) => (
            <div key={size} onClick={() => removeSize(size)}>
              <p className="bg-pink-100 px-3 py-1 cursor-pointer">{size} X</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <input onChange={() => setBestseller((prev) => !prev)} checked={bestseller} type="checkbox" id="bestseller" />
        <label className="cursor-pointer" htmlFor="bestseller">Add to bestseller</label>
      </div>
      
      <div className="flex gap-2 mt-2">
        <input onChange={() => setAllowCustomSize((prev) => !prev)} checked={allowCustomSize} type="checkbox" id="allowCustomSize" />
        <label className="cursor-pointer" htmlFor="allowCustomSize">Allow custom size</label>
      </div>

      <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">ADD</button>
    </form>
  );
};

export default Add;
