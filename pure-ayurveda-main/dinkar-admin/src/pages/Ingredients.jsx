import { useState, useEffect } from "react";
import api, { getIngredients } from "../services/api";

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchIngredients = async () => {
    const data = await getIngredients();
    setIngredients(data);
  };

  useEffect(() => { fetchIngredients(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/ingredients", { name, description });
      setName("");
      setDescription("");
      fetchIngredients();
    } catch (error) { alert("Failed to add ingredient"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this ingredient?")) {
      await api.delete(`/api/ingredients/${id}`);
      fetchIngredients();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Ingredients</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Add New Form */}
        <div className="bg-white p-4 rounded-lg shadow border col-span-1 h-fit">
          <h2 className="font-bold mb-4">Add New Ingredient</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <input placeholder="Ingredient Name (e.g. Ashwagandha)" value={name} onChange={(e) => setName(e.target.value)} required className="w-full border p-2 rounded" />
            <textarea placeholder="Full Description / Benefits..." value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="w-full border p-2 rounded" />
            <button type="submit" className="w-full bg-green-700 text-white py-2 rounded font-bold hover:bg-green-800">Add Ingredient</button>
          </form>
        </div>

        {/* List of Ingredients */}
        <div className="col-span-2 bg-white p-4 rounded-lg shadow border">
          <h2 className="font-bold mb-4">Saved Ingredients</h2>
          <div className="space-y-3">
            {ingredients.map(ing => (
              <div key={ing._id} className="p-3 border rounded bg-gray-50 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-green-800">{ing.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{ing.description}</p>
                </div>
                <button onClick={() => handleDelete(ing._id)} className="text-red-500 font-bold ml-4 hover:underline">Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ingredients;   