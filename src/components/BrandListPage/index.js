import React, { useState } from 'react';
import Content from './brandList';

const index = () => {

    const [active, setActive] = useState('all')
    const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(i + 65));

    const brands = [
        { id: 1, name: "Bandai" },
        { id: 2, name: "Hasbro" },
        { id: 3, name: "Mattel" },
        { id: 4, name: "NECA" },
        { id: 5, name: "Beast Kingdom" },
        { id: 5, name: "Beast Kingdom" },
        { id: 5, name: "Beast Kingdom" },
        { id: 5, name: "Beast Kingdom" },
        { id: 5, name: "Beast Kingdom" },
        { id: 5, name: "Beast Kingdom" },
        { id: 5, name: "Beast Kingdom" },
        { id: 5, name: "Beast Kingdom" },
        { id: 5, name: "Beast Kingdom" },
        { id: 6, name: "McFarlane Toys" },
        { id: 7, name: "Good Smile Company" },
        { id: 8, name: "Evolution Toy" },
    ];

    const groupBrandsByFirstLetter = (brands) => {
        return brands.reduce((acc, brand) => {
            const firstLetter = brand.name.charAt(0).toUpperCase();
            acc[firstLetter] = acc[firstLetter] || [];
            acc[firstLetter].push(brand);
            return acc;
        }, {});
    }

    const groupedBrands = groupBrandsByFirstLetter(brands);
    const availableLetter = Object.keys(groupedBrands).sort();

    const handleActive = (val) => {
        setActive(val);
    }

    const contentProps = {
        letters,
        groupedBrands,
        availableLetter,
        active,
        handleActive,
    };

    return (
        <Content {...contentProps} />
    )
}

export default index