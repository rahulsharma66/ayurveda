import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Categories from "./pages/Categories";
import Products from "./pages/Product"; 
import Orders from "./pages/Orders";
import Ingredients from "./pages/Ingredients"; // 👈 Added the import here!
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Protected Categories Route */}
        <Route 
          path="/categories" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Categories />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Product Route */}
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Products />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected Orders Route */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Orders />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* 👇 Protected Ingredients Route (Safely inside the Routes block) 👇 */}
        <Route
          path="/ingredients"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Ingredients />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;