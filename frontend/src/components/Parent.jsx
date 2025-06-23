import React from "react";
import HeaderComponent from "./HeaderComponent";
import FooterComponent from "./FooterComponent";
import MainComponent from "./MainComponent";

const Parent = () => {
  return (
    <>
      <HeaderComponent />
      <MainComponent />
      <FooterComponent />
    </>
  );
};

export default Parent;
