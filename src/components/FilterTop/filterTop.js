import React from 'react';
import CustomFilters from './CustomFilters';

const FilterTop = props => {
    const { category } = props;
    return (
        <CustomFilters
            category={category}
        />
    );
};

export default FilterTop;
