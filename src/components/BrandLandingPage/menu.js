import React from 'react';
import { Link } from "react-router-dom";

const menu = () => {

    const menu = ['Action Figures', 'Anime', 'Nendoroid']
    return (
        <>
            <div className="menu_brand-container border border-gray-100 rounded-lg flex flex-wrap gap-x-10 gap-y-5 px-10">
                {menu.map((item, index) => (
                    <Link to="/" key={index} className="text-base font-medium my-3">
                        {item}
                    </Link>
                ))}
            </div>
        </>
    )
}

export default menu