import { useEffect, useState } from "react";
// 👇 Make sure you added getIngredients to your api.js file! 👇
import api, { getCategories, getIngredients } from "../services/api"; 
import Toast from "./Toast";
import { uploadImagesToCloudinary } from "../services/cloudinary";

const ProductModal = ({ isOpen, onClose, onSuccess, product }) => {
  const isEdit = Boolean(product);

  const [form, setForm] = useState({
    name: "",
    description: "",
    longDescription: "",
    category: "",
    stock: "",
    featured: false,
    isActive: true,
  });

  // Buy links for any platform (Meesho, Flipkart, Amazon, etc.)
  const [platformLinks, setPlatformLinks] = useState([{ platform: "Meesho", url: "" }]);

  const [variants, setVariants] = useState([{ size: "", mrp: "", salePrice: "" }]);
  const [benefits, setBenefits] = useState([""]); 
  
  const [ingredients, setIngredients] = useState([]); // User selected ingredients
  const [usage, setUsage] = useState([""]);

  // Split Image States
  const [existingCover, setExistingCover] = useState(null);
  const [newCover, setNewCover] = useState(null);
  const [existingGallery, setExistingGallery] = useState([]);
  const [newGallery, setNewGallery] = useState([]);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({});
  const [categories, setCategories] = useState([]);
  const [dbIngredients, setDbIngredients] = useState([]); // All ingredients from DB

  useEffect(() => {
    if (isOpen) {
      // Fetch both Categories AND Ingredients when modal opens
      const fetchData = async () => {
        try {
          // Fetch concurrently for speed
          const [catData, ingData] = await Promise.all([
            getCategories(),
            getIngredients()
          ]);
          
          setCategories(catData);
          setDbIngredients(ingData);

          if (!isEdit && catData.length > 0 && !form.category) {
            setForm((prev) => ({ ...prev, category: catData[0].name }));
          }
        } catch (error) {
          console.error("Failed to load data", error);
        }
      };
      fetchData();
    }

    if (product && isOpen) {
      setForm({
        name: product.name,
        description: product.description,
        longDescription: product.longDescription || "",
        category: product.category,
        stock: product.stock,
        featured: product.featured || false,
        isActive: product.isActive !== false,
      });

      setPlatformLinks(
        product.platformLinks?.length > 0
          ? product.platformLinks.map((l) => ({ platform: l.platform, url: l.url }))
          : [{ platform: "Meesho", url: product.meeshoLink || "" }]
      );
      
      setVariants(product.variants?.length > 0 ? product.variants : [{ size: "", mrp: "", salePrice: "" }]);
      setBenefits(product.benefits?.length > 0 ? product.benefits : [""]);
      setIngredients(product.ingredients?.length > 0 ? product.ingredients : []); // Start as empty array if none
      setUsage(product.usage?.length > 0 ? product.usage : [""]);
      
      const imgs = product.images || [];
      setExistingCover(imgs.length > 0 ? imgs[0] : null);
      setExistingGallery(imgs.length > 1 ? imgs.slice(1) : []);
    } else if (!product && isOpen) {
      setForm((prev) => ({ name: "", description: "", longDescription: "", category: prev.category, stock: "", featured: false, isActive: true }));
      setPlatformLinks([{ platform: "Meesho", url: "" }]);
      setVariants([{ size: "", mrp: "", salePrice: "" }]);
      setBenefits([""]);
      setIngredients([]);
      setUsage([""]);
      setExistingCover(null);
      setExistingGallery([]);
      setNewCover(null);
      setNewGallery([]);
    }
  }, [product, isOpen, isEdit]);

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  // Dynamic Handlers
  const handleVariantChange = (index, field, value) => { const updated = [...variants]; updated[index][field] = value; setVariants(updated); };
  const addVariant = () => setVariants([...variants, { size: "", mrp: "", salePrice: "" }]);
  const removeVariant = (index) => setVariants(variants.filter((_, i) => i !== index));

  const handleDynamicChange = (list, setList, index, value) => { const updated = [...list]; updated[index] = value; setList(updated); };
  const addDynamicItem = (list, setList) => setList([...list, ""]);
  const removeDynamicItem = (list, setList, index) => setList(list.filter((_, i) => i !== index));

  // Platform link handlers (dynamic add/remove)
  const handlePlatformLinkChange = (index, field, value) => { const updated = [...platformLinks]; updated[index][field] = value; setPlatformLinks(updated); };
  const addPlatformLink = () => setPlatformLinks([...platformLinks, { platform: "", url: "" }]);
  const removePlatformLink = (index) => setPlatformLinks(platformLinks.filter((_, i) => i !== index));

  const coverPreview = newCover ? URL.createObjectURL(newCover) : existingCover;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validPlatformLinks = platformLinks.filter(l => l.platform?.trim() && l.url?.trim());

      if (validPlatformLinks.length === 0) {
        setToast({ message: "Please add at least one platform link (e.g. Meesho, Flipkart, Amazon)", type: "error" });
        setLoading(false);
        return;
      }

      // Keep meeshoLink in sync for backward compatibility
      const meeshoMatch = validPlatformLinks.find(l => l.platform.trim().toLowerCase() === "meesho");
      const meeshoLink = meeshoMatch ? meeshoMatch.url : validPlatformLinks[0].url;

      let finalCoverUrl = existingCover;
      if (newCover) {
        const coverRes = await uploadImagesToCloudinary([newCover]);
        finalCoverUrl = coverRes[0];
      }

      let finalGalleryUrls = [...existingGallery];
      if (newGallery.length > 0) {
        const galleryRes = await uploadImagesToCloudinary(newGallery);
        finalGalleryUrls = [...finalGalleryUrls, ...galleryRes];
      }

      const finalImagesArray = [];
      if (finalCoverUrl) finalImagesArray.push(finalCoverUrl);
      finalImagesArray.push(...finalGalleryUrls);

      const validVariants = variants.filter(v => v.size && v.salePrice);
      const mainPrice = validVariants.length > 0 ? Number(validVariants[0].salePrice) : 0;

      const payload = {
        ...form,
        stock: Number(form.stock),
        price: mainPrice, 
        meeshoLink,
        platformLinks: validPlatformLinks.map(l => ({ platform: l.platform.trim(), url: l.url.trim() })),
        variants: validVariants.map(v => ({ ...v, mrp: Number(v.mrp), salePrice: Number(v.salePrice) })),
        benefits: benefits.filter(b => b.trim() !== ""),
        ingredients: ingredients.filter(i => i.trim() !== ""), // Safely filter out blanks
        usage: usage.filter(u => u.trim() !== ""),
        images: finalImagesArray, 
      };

      if (isEdit) {
        await api.put(`/api/admin/products/${product._id}`, payload);
      } else {
        await api.post("/api/admin/products", payload);
      }

      setToast({ message: "Product saved successfully", type: "success" });
      onSuccess(); 
      onClose();   
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to save product", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
        <h2 className="text-2xl font-bold text-green-800 mb-6 border-b pb-2">
          {isEdit ? "Edit Product" : "Add New Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block font-medium text-gray-700">Basic Details</label>
              <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none" />
              <select name="category" value={form.category} onChange={handleChange} required className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none bg-white">
                <option value="" disabled>Select a Category</option>
                {categories.map((cat) => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
              </select>
              <input name="stock" type="number" placeholder="Total Stock Quantity" value={form.stock} onChange={handleChange} required className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none" />

              {/* Platform Buy Links */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <label className="block font-medium text-gray-700">Platform Links</label>
                  <button type="button" onClick={addPlatformLink} className="text-sm bg-blue-50 text-blue-600 px-2 py-1 rounded">+ Add Platform</button>
                </div>
                <div className="space-y-2">
                  {platformLinks.map((link, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        placeholder="Platform (e.g. Meesho, Flipkart, Amazon)"
                        value={link.platform}
                        onChange={(e) => handlePlatformLinkChange(index, "platform", e.target.value)}
                        className="w-1/3 border p-1.5 rounded"
                      />
                      <input
                        type="url"
                        placeholder="https://.../product-link"
                        value={link.url}
                        onChange={(e) => handlePlatformLinkChange(index, "url", e.target.value)}
                        className="flex-1 border p-1.5 rounded"
                      />
                      {platformLinks.length > 1 && <button type="button" onClick={() => removePlatformLink(index)} className="text-red-500 font-bold px-1">✕</button>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2 bg-rose-50 p-2 rounded border border-rose-100">
                <input type="checkbox" name="isActive" id="isActive" checked={form.isActive} onChange={handleChange} className="w-4 h-4 text-green-600 rounded" />
                <label htmlFor="isActive" className="text-gray-700 font-medium">Active on website (uncheck to hide if out of stock on platforms)</label>
              </div>
              <div className="flex items-center gap-2 mt-2 bg-yellow-50 p-2 rounded border border-yellow-100">
                <input type="checkbox" name="featured" id="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 text-green-600 rounded" />
                <label htmlFor="featured" className="text-gray-700 font-medium">Mark as Featured Product</label>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block font-medium text-gray-700">Descriptions</label>
              <textarea name="description" placeholder="Short Description (for card view)" value={form.description} onChange={handleChange} required rows={2} className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none" />
              <textarea name="longDescription" placeholder="Long Description (detailed view)" value={form.longDescription} onChange={handleChange} rows={3} className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Dynamic Lists Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Variants */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <label className="block font-medium text-gray-700">Sizes & Prices</label>
                <button type="button" onClick={addVariant} className="text-sm bg-blue-50 text-blue-600 px-2 py-1 rounded">+ Add Size</button>
              </div>
              <div className="space-y-2">
                {variants.map((variant, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input placeholder="Size" value={variant.size} onChange={(e) => handleVariantChange(index, "size", e.target.value)} required className="w-1/3 border p-1.5 rounded" />
                    <input type="number" placeholder="MRP" value={variant.mrp} onChange={(e) => handleVariantChange(index, "mrp", e.target.value)} required className="w-1/3 border p-1.5 rounded" />
                    <input type="number" placeholder="Sale" value={variant.salePrice} onChange={(e) => handleVariantChange(index, "salePrice", e.target.value)} required className="w-1/3 border p-1.5 rounded" />
                    {variants.length > 1 && <button type="button" onClick={() => removeVariant(index)} className="text-red-500 font-bold px-1">✕</button>}
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <label className="block font-medium text-gray-700">Benefits</label>
                <button type="button" onClick={() => addDynamicItem(benefits, setBenefits)} className="text-sm bg-blue-50 text-blue-600 px-2 py-1 rounded">+ Add</button>
              </div>
              <div className="space-y-2">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input placeholder="Benefit..." value={benefit} onChange={(e) => handleDynamicChange(benefits, setBenefits, index, e.target.value)} className="flex-1 border p-1.5 rounded" />
                    {benefits.length > 1 && <button type="button" onClick={() => removeDynamicItem(benefits, setBenefits, index)} className="text-red-500 font-bold px-1">✕</button>}
                  </div>
                ))}
              </div>
            </div>

            {/* 👇 UPGRADED Ingredients Dropdown System 👇 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <label className="block font-medium text-gray-700">Ingredients</label>
              </div>
              
              {/* Dropdown Select */}
              <select 
                className="w-full border p-2 rounded mb-3 outline-none cursor-pointer bg-white focus:ring-2 focus:ring-green-500"
                onChange={(e) => {
                  const selected = e.target.value;
                  if (selected && !ingredients.includes(selected)) {
                    setIngredients([...ingredients, selected]);
                  }
                  e.target.value = ""; // Reset dropdown after selection
                }}
              >
                <option value="">+ Select an Ingredient from Database...</option>
                {dbIngredients.map(ing => (
                  <option key={ing._id} value={ing.name}>{ing.name}</option>
                ))}
              </select>

              {/* Tag Display */}
              <div className="flex flex-wrap gap-2">
                {ingredients.map((item, index) => (
                  <span key={index} className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium border border-green-200 shadow-sm">
                    🌿 {item}
                    <button type="button" onClick={() => removeDynamicItem(ingredients, setIngredients, index)} className="text-red-500 font-bold hover:scale-110 transition-transform">
                      ✕
                    </button>
                  </span>
                ))}
                {ingredients.length === 0 && <span className="text-sm text-gray-400 italic">No ingredients added yet.</span>}
              </div>
            </div>

            {/* Usage */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <label className="block font-medium text-gray-700">How to Use (Steps)</label>
                <button type="button" onClick={() => addDynamicItem(usage, setUsage)} className="text-sm bg-blue-50 text-blue-600 px-2 py-1 rounded">+ Add</button>
              </div>
              <div className="space-y-2">
                {usage.map((item, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input placeholder={`Step ${index + 1}...`} value={item} onChange={(e) => handleDynamicChange(usage, setUsage, index, e.target.value)} className="flex-1 border p-1.5 rounded" />
                    {usage.length > 1 && <button type="button" onClick={() => removeDynamicItem(usage, setUsage, index)} className="text-red-500 font-bold px-1">✕</button>}
                  </div>
                ))}
              </div>
            </div>

          </div>

          <hr className="border-gray-100" />

          {/* IMAGE UPLOAD SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-lg border border-gray-200 shadow-sm bg-white">
            
            <div className="col-span-1 border-r border-gray-200 pr-6">
              <label className="block font-bold text-gray-800 mb-2">1. Cover Image</label>
              <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-green-400 rounded-xl cursor-pointer bg-green-50 hover:bg-green-100 transition relative overflow-hidden">
                {coverPreview ? (
                  <img src={coverPreview} className="w-full h-full object-cover" alt="Cover" />
                ) : (
                  <div className="text-center p-2">
                    <span className="text-green-700 font-bold block">+ Upload Cover</span>
                    <span className="text-xs text-gray-500">Required: Primary Photo</span>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  if(e.target.files && e.target.files[0]) setNewCover(e.target.files[0]);
                }} />
              </label>
            </div>

            <div className="col-span-2">
              <label className="block font-bold text-gray-800 mb-2">2. Details Gallery (Multiple Photos)</label>
              <label className="flex flex-col items-center justify-center w-full h-16 border-2 border-dashed border-blue-400 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition">
                <span className="text-blue-700 font-bold">+ Add Multiple Photos</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => {
                  if(e.target.files) {
                    const filesArray = Array.from(e.target.files);
                    setNewGallery((prev) => [...prev, ...filesArray]); 
                  }
                }} />
              </label>

              <div className="flex flex-wrap gap-3 mt-4">
                {existingGallery.map((imgUrl, idx) => (
                  <div key={`exist-${idx}`} className="relative group w-20 h-20">
                    <img src={imgUrl} className="w-full h-full object-cover rounded-lg border shadow-sm" alt="gallery" />
                    <button type="button" onClick={() => setExistingGallery(existingGallery.filter((_, i) => i !== idx))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition shadow">✕</button>
                  </div>
                ))}
                {newGallery.map((file, idx) => (
                  <div key={`new-${idx}`} className="relative group w-20 h-20">
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover rounded-lg border-2 border-blue-400 shadow-sm" alt="gallery-new" />
                    <button type="button" onClick={() => setNewGallery(newGallery.filter((_, i) => i !== idx))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition shadow">✕</button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <button type="button" onClick={onClose} className="px-5 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-700">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2 bg-green-700 text-white rounded font-bold hover:bg-green-800 disabled:opacity-50">
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
      <Toast {...toast} onClose={() => setToast({})} />
    </div>
  );
};

export default ProductModal;