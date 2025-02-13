import React from "react";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-5 text-center border-b-4 border-blue-700 shadow-md">
      <h1 className="m-0 text-3xl font-bold tracking-widest uppercase">
        Fantasy Football Draft
      </h1>
      <p className="mt-1 text-lg text-gray-200 italic">
        Customize your drafting experience!
      </p>
    </header>
  );
};

export default Header;
