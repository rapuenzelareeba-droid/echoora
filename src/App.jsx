import { Routes, Route, Navigate } from 'react-router-dom';
import CustomerLayout from './layouts/CustomerLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import Home from './pages/customer/Home.jsx';
import OurStory from './pages/customer/OurStory.jsx';
import Menu from './pages/customer/Menu.jsx';
import FoodDetails from './pages/customer/FoodDetails.jsx';
import Cart from './pages/customer/Cart.jsx';
import Checkout from './pages/customer/Checkout.jsx';
import Reservations from './pages/customer/Reservations.jsx';
import MyReservations from './pages/customer/MyReservations.jsx';
import Reviews from './pages/customer/Reviews.jsx';
import AiFeedback from './pages/customer/AiFeedback.jsx';
import Contact from './pages/customer/Contact.jsx';
import NotFound from './pages/customer/NotFound.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import AdminMenu from './pages/admin/AdminMenu.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import AdminReservations from './pages/admin/AdminReservations.jsx';
import AdminReviews from './pages/admin/AdminReviews.jsx';
import AdminAnalytics from './pages/admin/AdminAnalytics.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/our-story" element={<OurStory />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/:id" element={<FoodDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/my-reservations" element={<MyReservations />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/ai-feedback" element={<AiFeedback />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="menu" element={<AdminMenu />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="reservations" element={<AdminReservations />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>
    </Routes>
  );
}
