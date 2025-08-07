import React from 'react';
import CustomFilters from './CustomFilters';

const FilterTop = props => {
    const { category, filters } = props;
    return (
        <CustomFilters
            category={category}
            filters={filters}
        />
    );
};

export default FilterTop;
