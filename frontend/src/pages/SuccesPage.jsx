import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { FaCheckCircle } from "react-icons/fa";

const SuccessPage = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 ${
        isDark ? "bg-[#242424] text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      <div
        className={`rounded-xl shadow-lg p-8 w-full max-w-md text-center ${
          isDark ? "bg-[#232323]" : "bg-white"
        }`}
      >
        <FaCheckCircle className="mx-auto mb-4 text-5xl text-green-400" />
        <h1
          className={`text-3xl font-bold mb-2 ${
            isDark ? "text-green-400" : "text-green-600"
          }`}
        >
          Vielen Dank!
        </h1>
        <p
          className={`text-lg mb-2 ${
            isDark ? "text-gray-200" : "text-gray-700"
          }`}
        >
          Ihre Zahlung war erfolgreich.
        </p>
        <p
          className={`text-sm mb-6 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Sie haben eine E-Mail mit allen Details zur erfolgreichen Zahlung
          erhalten.
        </p>
        <button
          onClick={() => navigate("/")}
          className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-400 transition-colors font-medium shadow-md hover:shadow-lg text-lg"
        >
          Zurück zur Startseite
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
