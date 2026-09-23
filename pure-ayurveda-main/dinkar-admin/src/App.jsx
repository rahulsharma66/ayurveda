import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Categories from "./pages/Categories";
import Products from "./pages/Product";
import Ingredients from "./pages/Ingredients";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

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

        {/* Protected Ingredients Route */}
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