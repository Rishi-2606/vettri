import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import TopBar from "./components/TopBar.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import Home from "./pages/Home.jsx";
import Schemes from "./pages/Schemes.jsx";
import SchemeDetails from "./pages/SchemeDetails.jsx";
import Recommendations from "./pages/Recommendations.jsx";
import Profile from "./pages/Profile.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Affordability from "./pages/Affordability.jsx";
import Checklist from "./pages/Checklist.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";
import Cookies from "./pages/Cookies.jsx";
import DataDeletion from "./pages/DataDeletion.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminSchemes from "./pages/admin/AdminSchemes.jsx";
import AdminSchemeForm from "./pages/admin/AdminSchemeForm.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";

export default function App() {
  return (
    <AuthProvider>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <TopBar />
      <Navbar />

      <main id="main-content" style={{ minHeight: "60vh" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/schemes/:slug" element={<SchemeDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Legal */}
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/data-deletion" element={<DataDeletion />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recommendations"
            element={
              <ProtectedRoute>
                <Recommendations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/affordability"
            element={
              <ProtectedRoute>
                <Affordability />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checklist/:slug"
            element={
              <ProtectedRoute>
                <Checklist />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="schemes" element={<AdminSchemes />} />
            <Route path="schemes/new" element={<AdminSchemeForm />} />
            <Route path="schemes/:id" element={<AdminSchemeForm />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>

          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />
    </AuthProvider>
  );
}