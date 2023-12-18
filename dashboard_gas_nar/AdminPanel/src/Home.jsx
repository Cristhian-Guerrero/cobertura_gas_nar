import React, { useState, useEffect } from "react";
import { BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import { FaMapMarkerAlt, FaMoneyBillAlt } from "react-icons/fa";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";

import Narmap from './Narmap';

const COLORS = [
  '#b6edc8', // Verde muy claro
  '#99d8c9', // Verde agua claro
  '#66c2a4', // Verde agua
  '#41ae76', // Verde medio
  '#238b45', // Verde oscuro
  '#006d2c', // Verde muy oscuro
  '#00441b', // Verde intenso
  '#f0e442', // Amarillo claro
  '#fee08b', // Amarillo anaranjado claro
  '#fdae61', // Naranja claro
  '#f46d43', // Naranja medio
  '#d53e4f', // Rojo anaranjado
  '#9e0142'  // Rojo intenso
];



const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{
        backgroundColor: '#f4f4f4', // Color de fondo claro
        padding: '10px',
        border: '1px solid #ddd', // Borde ligeramente definido
        borderRadius: '5px', // Bordes redondeados
        boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.2)', // Sombra ligera
        fontFamily: 'Arial, sans-serif', // Fuente Arial
        fontSize: '0.9rem', // Tamaño de letra
        color: 'black', // Color de letra
        textAlign: 'center', // Alineación del texto
      }}>
        <p>{`${payload[0].payload.name}: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};



function Home({ showMap, showBarChart, showPieChart, showBarChart2 }) {
  const [municipiosData, setMunicipiosData] = useState([]);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [totalMunicipios, setTotalMunicipios] = useState(0);
  const [calificacionesData, setCalificacionesData] = useState([]);
  const [datosResumen, setDatosResumen] = useState([]);





  useEffect(() => {
    fetch("http://127.0.0.1:8000/datos")
      .then((response) => response.json())
      .then((data) => {
        const transformedData = Object.entries(data).map(([name, uv]) => ({ name, uv }));
        // Ordenar los datos de mayor a menor basado en uv
        transformedData.sort((a, b) => b.uv - a.uv);
        setMunicipiosData(transformedData);
      })
      .catch((error) => console.error("Error al obtener datos:", error));


    fetch("http://127.0.0.1:8000/estadisticas")
      .then((response) => response.json())
      .then((data) => {
        setTotalRegistros(data.total_registros);
        setTotalMunicipios(data.numero_municipios);
      })
      .catch((error) => console.error("Error al obtener estadísticas:", error));

    fetch("http://127.0.0.1:8000/calificaciones")
      .then((response) => response.json())
      .then((data) => {
        // Transformar el objeto en un array de objetos
        const transformedData = Object.entries(data).map(([nivel, valor]) => ({
          name: nivel,
          value: valor
        }));
        setCalificacionesData(transformedData);
      })
      .catch((error) => console.error("Error al obtener calificaciones:", error));

    fetch("http://127.0.0.1:8000/resumen_ahorro_conformidad")
      .then(response => response.json())
      .then(data => {
        setDatosResumen([
          { name: 'Ahorro con gas Domiciliario', 'Sí': data.ahorro['Sí'], 'No': data.ahorro['No'] },
          { name: 'Conformidad con Instalación', 'Conforme': data.conformidad['Conforme'], 'No Conforme': data.conformidad['No Conforme'] }
        ]);
      })
      .catch(error => console.error("Error al obtener datos de ahorro y conformidad:", error));
  }, []);



  return (
    <main className="main-container">


      <div className="main-cards">
        <div className="card">
          <div className="card-inner">
            <h3>MUNICIPIOS</h3>
            <FaMapMarkerAlt className="card_icon" />
          </div>
          <h1>{totalMunicipios}</h1>
        </div>

        <div className="card">
          <div className="card-inner">
            <h3>POBLACIÓN</h3>
            <BsPeopleFill className="card_icon" />
          </div>
          <h1>{totalRegistros}</h1>
        </div>

        <div className="card">
          <div className="card-inner">
            <h3>PRESUPUESTO</h3>
            <FaMoneyBillAlt className="card_icon" />
          </div>
          <h1>$81.000 millones</h1>
        </div>

        <div className="card">
          <div className="card-inner">
            <h3>% EJECUCIÓN</h3>
            <BsFillBellFill className="card_icon" />
          </div>
          <h1>98%</h1>
        </div>
      </div>

      <div className="charts">
        {showMap && (

          <div className="chart-item">
            <div className="main-title">
              <h3>Cobertura Municipal</h3>
            </div>
            <div class="mapadiv">
              <Narmap />
            </div>
          </div>
        )}


        {showBarChart && (
          <ResponsiveContainer width="100%" height={900}>
            <div style={{ textAlign: 'center' }}>
              <h3>Municipios con mayor cobertura</h3>
            </div>
            <BarChart
              layout="vertical"
              data={municipiosData}
              margin={{ top: 3, right: 10, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={70} />
              <Tooltip content={<CustomTooltip />} />

              <Bar dataKey="uv" label={{ position: 'top', visibility: 'hidden' }}>
                {municipiosData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {showPieChart && (
          <ResponsiveContainer width="100%" height={400}>
            <div style={{ textAlign: 'center' }}>
              <h3>Nivel de Satisfacción</h3>
            </div>
            <PieChart>
              <Pie
                data={calificacionesData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
              >
                {calificacionesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}

        {showBarChart2 && (
          <ResponsiveContainer width="100%" height={400}>
            <div style={{ textAlign: 'center' }}>
              <h3>Ahorro Frente a Cilindros  - Que tan satisfecho esta con la Instalación</h3>
            </div>
            <BarChart
              data={datosResumen}
              margin={{
                top: 20, right: 30, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Sí" fill="#8884d8" />
              <Bar dataKey="No" fill="#82ca9d" />
              <Bar dataKey="Conforme" fill="#ffc658" />
              <Bar dataKey="No Conforme" fill="#ff8042" />
            </BarChart>
          </ResponsiveContainer>
        )}

        <ResponsiveContainer width="100%" height={400}>
          <div style={{ textAlign: 'center' }}>
            <h3>Municipios de Nariño</h3>
          </div>
          <PieChart>
            <Pie
              data={municipiosData}
              dataKey="uv"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150} // Aumentado para un círculo más grande
              fill="#8884d8"
            // label={false} // Desactivado para no mostrar las cantidades
            >
              {municipiosData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>


      </div>
    </main>
  );
}

export default Home;