import React, { useState, useEffect } from 'react'
import { assets, categories } from '../../assets/assets'
import toast from 'react-hot-toast'
import { useAppContext } from '../../context/AppContext'

const AddProduct = () => {
  const [files, setFiles] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [offerPrice, setOfferPrice] = useState('')
  const [loading, setLoading] = useState(false)

  const { axios } = useAppContext()

  // cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file?.preview) URL.revokeObjectURL(file.preview)
      })
    }
  }, [files])

  const handleFileChange = (e, index) => {
    const file = e.target.files[0]
    if (!file) return

    const uploadedFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    })

    const updatedFiles = [...files]
    updatedFiles[index] = uploadedFile
    setFiles(updatedFiles)
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    // 🚨 client-side validations
    if (!files[0]) return toast.error("Please upload at least one image")
    if (!category) return toast.error("Please select a category")
    if (Number(offerPrice) > Number(price)) return toast.error("Offer price can't be greater than product price")

    try {
      setLoading(true)

      const productData = {
        name,
        description: description.split('\n'),
        category,
        price,
        offerPrice,
      }

      const formData = new FormData()
      formData.append('productData', JSON.stringify(productData))
      files.forEach(file => {
        if (file) formData.append('images', file)
      })

      const { data } = await axios.post('/api/product/add', formData)

      if (data.success) {
        toast.success(data.message)
        setName('')
        setDescription('')
        setCategory('')
        setPrice('')
        setOfferPrice('')
        setFiles([])
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Error adding product:", error)
      toast.error("Failed to add product. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
      <form onSubmit={onSubmitHandler} className="md:p-10 p-4 space-y-5 max-w-lg">

        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {Array(4).fill('').map((_, index) => (
              <label key={index} htmlFor={`image${index}`}>
                <input
                  accept="image/*"
                  type="file"
                  id={`image${index}`}
                  hidden
                  onChange={(e) => handleFileChange(e, index)}
                />
                <img
                  className="max-w-24 cursor-pointer border rounded"
                  src={files[index]?.preview || assets.upload_area}
                  alt="upload"
                  width={100}
                  height={100}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">Product Name</label>
          <input
            id="product-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-description">Product Description</label>
          <textarea
            id="product-description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
          ></textarea>
        </div>

        <div className="w-full flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
          >
            <option value="">Select Category</option>
            {categories.map((item, i) => (
              <option key={i} value={item.path}>{item.path}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">Product Price</label>
            <input
              id="product-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">Offer Price</label>
            <input
              id="offer-price"
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-8 py-2.5 bg-primary text-white font-medium rounded cursor-pointer disabled:opacity-50"
        >
          {loading ? "Adding..." : "ADD"}
        </button>
      </form>
    </div>
  )
}

export default AddProduct