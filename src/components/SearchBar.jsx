import React, { useRef, useState, useEffect } from "react";

const SearchBar = () => {
  const [inputDepartureValue, setInputDepartureValue] = useState("");
  const [inputArrivalValue, setInputArrivalValue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const dropdownRef = useRef(null);

  const handleDepartureChange = (e) => setInputDepartureValue(e.target.value);
  const handleArrivalChange = (e) => setInputArrivalValue(e.target.value);

  // Schließt das Dropdown, wenn außerhalb geklickt wird
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="mb-6 mt-6 bg-gray-500 p-6 rounded w-4xl">
      {/* Column-Container */}
      <div className="flex flex-wrap border-2 border-amber-400">
        <div className="w-1/3">
          <label className="bg-amber-700 al" htmlFor="placeOfDeparture">
            Von wo?
          </label>
          <input
            id="placeOfDeparture"
            type="text"
            name="placeOfDeparture"
            value={inputDepartureValue}
            onChange={handleDepartureChange}
            className="px-3 py-2 mb-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 block"
          />
        </div>
        <div className="w-1/3">
          <label htmlFor="placeOfArrival">Reiseziel?</label>
          <input
            id="placeOfArrival"
            type="text"
            name="placeOfArrival"
            value={inputArrivalValue}
            placeholder="test"
            onChange={handleArrivalChange}
            className="px-3 py-2 mb-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 block"
          />
        </div>
        <div>
          <label className="text-gray-500" htmlFor="placeOfArrival">
            Flug
          </label>
          <input
            id="placeOfArrival"
            type="text"
            name="placeOfArrival"
            value=""
            placeholder="+ Flug hinzufügen"
            onChange={handleArrivalChange}
            className="px-3 py-2 mb-2 border-2 border-red-600 border-dashed rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 block"
          />
        </div>
        <div>
          <label>Wie viele Personen reisen?</label>
          <div className="relative w-1/3" ref={dropdownRef}>
            <button
              className="w-max bg-blue-200"
              type="button"
              onClick={() => setDropdownOpen((open) => !open)}
            >
              {adults} Erwachsene, {children} Kinder
              <span className="ml-3">&#9662;</span>
            </button>
            {dropdownOpen && (
              <div className="absolute left-0 right-0 mt-2 w-max bg-white border border-red-300 rounded shadow-lg z-10 p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className=" text-black px-2">Erwachsene</span>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="px-2 py-1 bg-gray-200 rounded-l hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="px-3">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(adults + 1)}
                      className="px-2 py-1 bg-gray-200 rounded-r hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className=" text-black px-2">Kinder</span>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="px-2 py-1 bg-gray-200 rounded-l hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="px-3">{children}</span>
                    <button
                      type="button"
                      onClick={() => setChildren(children + 1)}
                      className="px-2 py-1 bg-gray-200 rounded-r hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
