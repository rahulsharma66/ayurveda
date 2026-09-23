import { useEffect, useState } from "react";
import api from "../services/api";
import ProductModal from "../components/ProductModal";
import Toast from "../components/Toast";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [toast, setToast] = useState({});
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState(null);

  // Load products from the backend
  const load = async () => {
    try {
      const res = await api.get("/api/admin/products");
      setProducts(res.data);
    } catch {
      setToast({ message: "Failed to load products", type: "error" });
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Delete a product
  const del = async (id) => {
    if (!confirm("Delete product?")) return;
    try {
      await api.delete(`/api/admin/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      setToast({ message: "Product deleted", type: "success" });
    } catch {
      setToast({ message: "Delete failed", type: "error" });
    }
  };

  // Toggle availability (active/inactive on the website)
  const toggleActive = async (p) => {
    try {
      const updated = await api.put(`/api/admin/products/${p._id}`, { isActive: !p.isActive });
      setProducts(products.map((x) => (x._id === p._id ? updated.data : x)));
      setToast({
        message: updated.data.isActive ? `"${p.name}" is now visible on the site` : `"${p.name}" is now hidden`,
        type: "success",
      });
    } catch {
      setToast({ message: "Failed to update availability", type: "error" });
    }
  };

  return (
    <>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold text-green-700">Products</h1>
        <button
          onClick={() => {
            setSelected(null); // Clear selection for "Add New"
            setModal(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Product
        </button>
      </div>

      <div className="bg-white border border-green-200 rounded overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-green-50 border-b border-green-200">
            <tr>
              <th className="p-4 font-semibold text-green-800">Name</th>
              <th className="p-4 font-semibold text-green-800">Category</th>
              <th className="p-4 font-semibold text-green-800">Price</th>
              <th className="p-4 font-semibold text-green-800">Stock</th>
              <th className="p-4 font-semibold text-green-800">Featured</th>
              <th className="p-4 font-semibold text-green-800">Platform Links</th>
              <th className="p-4 font-semibold text-green-800">Availability</th>
              <th className="p-4 font-semibold text-green-800">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-8 text-center text-gray-500">
                  No products found. Click "Add Product" to create one.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="p-4">{p.category}</td>
                  <td className="p-4">₹{p.price}</td>
                  <td className="p-4">{p.stock}</td>
                  <td className="p-4">
                    {p.featured ? (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Featured</span>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    {p.platformLinks && p.platformLinks.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 max-w-xs">
                        {p.platformLinks.map((link, i) => (
                          link.url && (
                            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-rose-600 hover:text-rose-800 font-medium underline">
                              {link.platform || `Link ${i + 1}`}
                            </a>
                          )
                        ))}
                      </div>
                    ) : p.meeshoLink ? (
                      <a href={p.meeshoLink} target="_blank" rel="noopener noreferrer" className="text-rose-600 hover:text-rose-800 font-medium text-sm underline">
                        Meesho
                      </a>
                    ) : (
                      <span className="text-red-500 text-sm font-medium">Missing</span>
                    )}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleActive(p)}
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold border transition-colors ${
                        p.isActive !== false
                          ? "bg-green-100 text-green-800 border-green-200 hover:bg-red-100 hover:text-red-700 hover:border-red-200"
                          : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-green-100 hover:text-green-700 hover:border-green-200"
                      }`}
                      title={p.isActive !== false ? "Click to hide from website" : "Click to show on website"}
                    >
                      <span className={`w-2 h-2 rounded-full ${p.isActive !== false ? "bg-green-600" : "bg-gray-400"}`} />
                      {p.isActive !== false ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="p-4 space-x-3">
                    <button
                      className="text-blue-600 hover:text-blue-800 font-medium"
                      onClick={() => {
                        setSelected(p);
                        setModal(true);
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      className="text-red-500 hover:text-red-700 font-medium" 
                      onClick={() => del(p._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ProductModal
        isOpen={modal}
        product={selected}
        onClose={() => setModal(false)}
        onSuccess={load}
      />

      <Toast {...toast} onClose={() => setToast({})} />
    </>
  );
};

export default Products;