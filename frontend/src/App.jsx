import "./App.css";
import HeaderComponent from "./components/HeaderComponent.jsx";
import MainComponent from "./components/MainComponent.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import FooterComponent from "./components/FooterComponent.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LastMinuteDeals from "./pages/LastMinutesDeals.jsx";
import FivehundredEuroDeals from "./pages/FivehundredEuroDeals.jsx";

//
function App() {
  return (
    <BrowserRouter>
      <HeaderComponent />
      <Routes>
        <Route path="/" element={<MainComponent />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/lastminute-deals" element={<LastMinuteDeals />} />
        <Route
          path="/fivehundredeuro-deals"
          element={<FivehundredEuroDeals />}
        />
      </Routes>
      <FooterComponent />
    </BrowserRouter>
  );
}

export default App;
