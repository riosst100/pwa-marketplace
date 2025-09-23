import React, { useMemo } from 'react';
import { func, shape, string } from 'prop-types';
import { useIntl } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import CurrentTopFilter from './currentTopFilter';
import defaultClasses from '../FilterBlockList/filterTopItem.module.css';

const CurrentTopFilters = props => {
    const { filterApi, filterState, onRemove, currentGroup } = props;
    const { removeItem } = filterApi;
    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, props.classes);

    // create elements and params at the same time for efficiency
    const filterElements = useMemo(() => {
        const elements = [];
        for (const [group, items] of filterState) {
            for (const item of items) {
                const { title, value } = item || {};
                const key = `${group}::${title}_${value}`;

                const customAttributeLandingPage = ['card_game','card_set', 'bricks_categories', 'sc_sports_categories'];

                if (group === currentGroup && !customAttributeLandingPage.includes(group)) {
                    elements.push(
                        <CurrentTopFilter
                            group={group}
                            item={item}
                            removeItem={removeItem}
                            onRemove={onRemove}
                        />
                    );
                }
            }
        }

        return elements;
    }, [filterState, removeItem, onRemove]);

    const currentFiltersAriaLabel = formatMessage({
        id: 'filterModal.currentFilters.ariaLabel',
        defaultMessage: 'Current Filters'
    });

    return filterElements && filterElements.length ? filterElements : <span className={classes.item}><b>All</b></span>
};

export default CurrentTopFilters;
