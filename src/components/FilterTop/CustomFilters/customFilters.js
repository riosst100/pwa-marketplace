import React, { useMemo } from 'react';
import { func, shape, string } from 'prop-types';
import { useIntl } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import CustomFilter from './customFilter';
import defaultClasses from './customFilters.module.css';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { Link } from 'react-router-dom';
import { useCustomFilters } from '@riosst100/pwa-marketplace/src/talons/CustomFilters/useCustomFilters';

const CustomFilters = props => {
    const { filterState, onRemove, clearAll, category } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const talonProps = useCustomFilters();

    const { customFiltersData, categoryUrlSuffix, search, pathname } = talonProps;

    // console.log(category.url_path)
    // console.log(categoryUrlSuffix)

    const params = search ? JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}') : {};

    

    // console.log(params)

    // create elements and params at the same time for efficiency
    const filterElements = useMemo(() => {
        const elements = [];
        customFiltersData.map((filter, index) => {
            const { label, attribute_code, options } = filter || {};

            if (options.length) {
                const items = [];
                options.map(({ label, value }, index) => {
                    // const path = '/';

                    // const path = resourceUrl(
                    //     `/${category.url_path}${categoryUrlSuffix || ''}?${attribute_code}[filter]=${label},${value}`
                    // );
                    // const keyAttr = `${attribute_code}[filter]`;

                    Object.keys(params).forEach(function(key, index) {
                        if (index > 1) {
                            delete params[key];
                        }
                    });

                    if (value == "all") {
                        params[`${attribute_code}[filter]`] = `${label},${value}`;
                    }

                    const finalParams = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');

                    // console.log(params)

                    // console.log(finalParams);

                    const path = pathname + finalParams;

                    items.push(
                        <li>
                            <Link
                                key={index}
                                to={path}
                            >
                                <li className={classes.item}>{label}</li>
                            </Link>
                        </li>
                    )
                });

                elements.push(
                    <ul className={classes.root}>{items}</ul>
                );
            }
        })

        return elements;
    }, [customFiltersData]);

    return (
        <>{filterElements}</>
    );
};

CustomFilters.defaultProps = {
    onRemove: null
};

CustomFilters.propTypes = {
    classes: shape({
        root: string,
        item: string,
        button: string,
        icon: string
    }),
    onRemove: func
};

export default CustomFilters;
