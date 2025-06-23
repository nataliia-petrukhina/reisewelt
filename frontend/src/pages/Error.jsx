import React from "react";

import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Error = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(20);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => navigate("/"), 20000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="relative h-auto w-fit flex sm:flex-wrap md:flex-wrap lg:flex-row gap-8 ">
      {/* Error 404 */}
      <h1 className="absolute -top-[280px] left-0 tracking-widest font-extrabold text-6xl mt-14">
        Error 404
      </h1>
      <h2 className="absolute -top-[70px] left-0 text-3xl">
        Sorry, this page is not found!
      </h2>
      <section className="w1/2 h-10 pt-5 pb-16">
        <p>Redirecting to "Home" in {count} seconds....</p>
      </section>
    </div>
  );
};

export default Error;
