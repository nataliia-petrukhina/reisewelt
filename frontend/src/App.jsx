import "./App.css";
import HeaderComponent from "./components/HeaderComponent.jsx";
import MainComponent from "./components/MainComponent.jsx";
import FooterComponent from "./components/FooterComponent.jsx";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import OfferComponent from "./components/OfferComponent.jsx";

function App() {
  return (
    <>
      <HeaderComponent />
      <Routes>
        <Route path="/" element={<MainComponent />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/hotel/:hotelId" element={<OfferComponent />} />
      </Routes>
      <FooterComponent />
    </>
  );
}

export default App;
