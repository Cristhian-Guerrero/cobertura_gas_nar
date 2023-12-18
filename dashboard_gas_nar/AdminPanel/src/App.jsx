import { useState } from 'react'
import './App.css'
import Header from './Header'
import Sidebar from './Sidebar'
import Home from './Home'

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [showMap, setShowMap] = useState(false); // Estado para la visibilidad del mapa
  const [showBarChart, setShowBarChart] = useState(false); // Estado para la visibilidad del gráfico de barras
  const [showPieChart, setShowPieChart] = useState(false);
  const [showBarChart2, setShowBarChart2] = useState(false);



  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  const toggleMapVisibility = () => {
    setIsMapVisible(!isMapVisible); // Cambia la visibilidad del mapa
  }

  return (
    <div className='grid-container'>
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
        toggleMap={() => setShowMap(!showMap)}
        toggleBarChart={() => setShowBarChart(!showBarChart)}
        togglePieChart={() => setShowPieChart(!showPieChart)}
        toggleBarChart2={() => setShowBarChart2(!showBarChart2)}

      />
      <Home showMap={showMap} showBarChart={showBarChart} showPieChart={showPieChart} showBarChart2={showBarChart2} />
    </div>
  );
}

export default App;