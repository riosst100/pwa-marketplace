import React, { useCallback, useMemo } from 'react';
import { func, shape, string } from 'prop-types';
import { useIntl } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import CustomFilter from './customFilter';
import defaultClasses from './customFilters.module.css';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { Link } from 'react-router-dom';
import { useCustomFilters } from '@riosst100/pwa-marketplace/src/talons/CustomFilters/useCustomFilters';

const CustomFilters = props => {
    const { onRemove, clearAll, category, filters } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const talonProps = useCustomFilters({ filters });

    const { 
        customFiltersData, 
        categoryUrlSuffix, 
        search, 
        pathname,
        filterApi,
        // filterItems,
        // filterNames,
        // filterFrontendInput,
        filterState
     } = talonProps;

    const params = search ? JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}') : {};

    const { removeItem } = filterApi;

    const activeFilters = useMemo(() => {
        const elements = [];
        for (const [group, items] of filterState) {
            for (const item of items) {
                elements.push(
                    {
                        group: group,
                        item: item,
                        removeItem: removeItem
                    }
                );
            }
        }

        return elements;
    }, [filterState, removeItem]);


    // const handleClick = useCallback(() => {
    //     removeItem({ group, item });
    // }, [group, item, removeItem]);

    // create elements and params at the same time for efficiency
    const filterElements = useMemo(() => {
        const elements = [];
        customFiltersData && customFiltersData.map((filter, index) => {
            const { label, attribute_code, options } = filter || {};

            const group = attribute_code;

            // const handleClick = useCallback(() => {
            //     removeItem({ group, item });
            //     if (typeof onRemove === 'function') {
            //         onRemove(group, item);
            //     }
            // }, [group, item, removeItem, onRemove]);

            if (options.length) {
                const items = [];
                options.map((item, index) => {
                    const { label, value } = item
                    // const path = '/';

                    // const path = resourceUrl(
                    //     `/${category.url_path}${categoryUrlSuffix || ''}?${attribute_code}[filter]=${label},${value}`
                    // );
                    // const keyAttr = `${attribute_code}[filter]`;

                    if (params) {
                        Object.keys(params).forEach(function(key, index) {
                            if (index > 1) {
                                delete params[key];
                            }
                        });
                    }

                    if (value != "all") {
                        params[`${attribute_code}[filter]`] = `${label},${value}`;
                    }

                    const finalParams = params ? Object.keys(params).map(key => `${key}=${params[key]}`).join('&') : '';
                    const path = pathname + finalParams;

                    if (value != "all") {
                        items.push(
                            <li key={index}>
                                <Link
                                    to={path}
                                >
                                    <span className={classes.item}>{label}</span>
                                </Link>
                            </li>
                        )
                    } else {
                        items.push(
                            <li key={index}>
                                <span className={classes.item} onClick={removeItem({ group, item })}>{label}</span>
                            </li>
                        )
                    }
                });

                elements.push(
                    <ul key={index} className={classes.root}>{items}</ul>
                );
            }
        })

        return elements;
    }, [customFiltersData]);

    return (
        <>{filterElements}</>
    );
};

export default CustomFilters;
