import React from 'react';
import {
    BsGraphUp, BsMap, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill,
    BsListCheck, BsMenuButtonWideFill, BsFillGearFill
} from 'react-icons/bs';

function Sidebar({ openSidebarToggle, OpenSidebar, toggleMap, toggleBarChart, togglePieChart, toggleBarChart2 }) {
    return (
        <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
            <div className='sidebar-title'>
                <div className='sidebar-brand'>
                    <BsMap className='icon_header' /> GeoData
                </div>
                <span className='icon close_icon' onClick={OpenSidebar}>X</span>
            </div>

            <ul className='sidebar-list'>
                <li className='sidebar-list-item'>
                    <BsGraphUp className='icon' /> Analítica
                </li>
                <li className='sidebar-list-item'>
                    <label>
                        <input type="checkbox" onChange={toggleMap} /> Mapa
                    </label>
                </li>
                <li className='sidebar-list-item'>
                    <label>
                        <input type="checkbox" onChange={toggleBarChart} /> Mayor Cobertura
                    </label>
                </li>

                <li className='sidebar-list-item'>
                    <label>
                        <input type="checkbox" onChange={togglePieChart} /> Nivel Satisfacción
                    </label>
                </li>

                <li className='sidebar-list-item'>
                    <label>
                        <input type="checkbox" onChange={toggleBarChart2} /> Ahorro - Conformidad
                    </label>
                </li>
                {/* ... otros elementos ... */}
            </ul>
        </aside>
    );
}

export default Sidebar;