import React from "react";
import {
  BsBarChartLine, // Suponiendo que este ícono está disponible
  BsSearch,
  BsJustify,
  BsPersonCircle,
} from "react-icons/bs";

function Header({ OpenSidebar }) {
  return (
    <header className="header">
      <div className="menu-icon">
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>
      <div className="header-center">
        <h2>Gas domiciliario, un cambio para la vida</h2> {/* Ejemplo de título */}
      </div>
      <div className="header-right">
        <BsBarChartLine className="icon" />
        <BsSearch className="icon" />
        <BsPersonCircle className="icon" />
      </div>
    </header>
  );
}

export default Header;