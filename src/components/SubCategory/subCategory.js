import { useSubCategory } from '@riosst100/pwa-marketplace/src/talons/SubCategory/useSubCategory';
import React from 'react';
import { Link } from 'react-router-dom';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

const SubCategory = props => {
    const { children } = props;

    const talonProps = useSubCategory({ children });

    const {
        normalizedData
    } = talonProps;
    
    const subCategory = [];
    
    normalizedData && normalizedData.map(({ text, path }, index) => {
        subCategory.push(
            <Link
                key={index}
                to={resourceUrl(path)}
            >
                <span className="filterModalOpenButton-filterButton-qRo button-root_lowPriority-Qoh button-root-MFn border-2 border-solid cursor-pointer font-bold inline-flex items-center justify-center leading-tight max-w-full min-w-[10rem] outline-none pointer-events-auto px-sm rounded-full text-center text-sm uppercase disabled_bg-gray-400 disabled_border-gray-400 disabled_opacity-50 disabled_pointer-events-none disabled_text-white focus_shadow-inputFocus bg-transparent border-gray-700 text-gray-700 active_border-gray-800 active_text-gray-800 hover_border-gray-800 hover_text-gray-800 min-w-[6.25rem]" style={{"margin":"10px"}}>{text}</span>
            </Link>
        )
    });

    return subCategory;
};

export default SubCategory;