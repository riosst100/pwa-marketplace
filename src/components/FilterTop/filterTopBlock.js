import React from 'react';
import { arrayOf, shape, string, func, bool } from 'prop-types';
import { useIntl } from 'react-intl';
import { ChevronDown as ArrowDown, ChevronUp as ArrowUp } from 'react-feather';
import { Form } from 'informed';

import { useFilterBlock } from '@magento/peregrine/lib/talons/FilterModal';
import setValidator from '@magento/peregrine/lib/validators/set';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import FilterBlockList from './FilterBlockList';
import { ArrowUp2 } from 'iconsax-react';
import cn from 'classnames';

const FilterTopBlock = props => {
    const {
        filterApi,
        filterState,
        filterFrontendInput,
        group,
        items,
        name,
        onApply,
        filterNames,
        initialOpen,
        originalFilterState,
        search,
        setFilterBy,
        filterBy
    } = props;

    const { formatMessage } = useIntl();
    const talonProps = useFilterBlock({
        filterState,
        items,
        initialOpen
    });

    const list = <Form>
        <FilterBlockList
            setFilterBy={setFilterBy}
            filterBy={filterBy}
            filterApi={filterApi}
            filterState={filterState}
            originalFilterState={originalFilterState}
            name={name}
            filterFrontendInput={filterFrontendInput}
            group={group}
            search={search}
            items={items}
            filterNames={filterNames}
            onApply={onApply}
        />
    </Form>

    return list;
};

export default FilterTopBlock;
