import React from "react";

// Import für LOGO
import Logo from "../assets/pictures/Logo-Reisewelt-Placeholder.png";
//

const HeaderComponent = () => {
  return (
    <header>
      <div className="logo">
        <img src={Logo} alt="Company Logo" width={100} />
      </div>
      <nav>
        <a href="#contact">Kontakt</a>
        <a href="#wishlist">Merkzettel</a>
        <a href="#language">Sprache</a>
        <a href="#money">Währung</a>
        <a href="#account">Sign_In</a>
      </nav>
    </header>
  );
};

export default HeaderComponent;
