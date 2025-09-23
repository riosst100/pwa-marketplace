import React, { useMemo, useCallback } from 'react';
import { ChevronDown as ArrowDown } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';
import { array, arrayOf, shape, string } from 'prop-types';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';

import { useStyle } from '@magento/venia-ui/lib/classify';
import SortItem from './customSortItem';
import defaultClasses from './customSortBy.module.css';
import Button from '@magento/venia-ui/lib/components/Button';
// import Icon from '@magento/venia-ui/lib/components/Icon';
import { ArrowUp2 } from 'iconsax-react';
import cn from 'classnames';

const CustomSortBy = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { availableSortMethods, sortProps } = props;
    const [currentSort, setSort] = sortProps;
    const { elementRef, expanded, setExpanded } = useDropdown();
    const { formatMessage, locale } = useIntl();

    const orderSortingList = useCallback(
        list => {
            return list.sort((a, b) => {
                return a.text.localeCompare(b.text, locale, {
                    sensitivity: 'base'
                });
            });
        },
        [locale]
    );

    const sortMethodsFromConfig = availableSortMethods
        ? availableSortMethods
            .map(method => {
                const { value, label } = method;
                if (value !== 'price' && value !== 'position') {
                    return {
                        id: `sortItem.${value}`,
                        text: label,
                        attribute: value,
                        sortDirection: 'ASC'
                    };
                }
            })
            .filter(method => !!method)
        : null;

    // click event for menu items
    const handleItemClick = useCallback(
        sortAttribute => {
            setSort(prevSort => {
                return {
                    sortText: sortAttribute.text,
                    value: sortAttribute.attribute,
                };
            });
            setExpanded(false);
        },
        [setExpanded, setSort]
    );

    const sortElements = useMemo(() => {
        // should be not render item in collapsed mode.
        if (!expanded) {
            return null;
        }

        const defaultSortMethods = [
            {
                id: 'sortItem.relevance',
                text: formatMessage({
                    id: 'sortItem.relevance',
                    defaultMessage: 'Best Match'
                }),
                attribute: 'relevance',
                sortDirection: 'DESC'
            },
            {
                id: 'sortItem.priceDesc',
                text: formatMessage({
                    id: 'sortItem.priceDesc',
                    defaultMessage: 'Price: High to Low'
                }),
                attribute: 'price',
                sortDirection: 'DESC'
            },
            {
                id: 'sortItem.priceAsc',
                text: formatMessage({
                    id: 'sortItem.priceAsc',
                    defaultMessage: 'Price: Low to High'
                }),
                attribute: 'price',
                sortDirection: 'ASC'
            }
        ];

        const allSortingMethods = sortMethodsFromConfig
            ? sortMethodsFromConfig
            : defaultSortMethods;

        const itemElements = Array.from(allSortingMethods, sortItem => {
            const { attribute, sortDirection } = sortItem;
            const isActive =
                currentSort.value === attribute;

            const key = `${attribute}--${sortDirection}`;
            return (
                <li key={key} className={classes.menuItem}>
                    <SortItem
                        sortItem={sortItem}
                        active={isActive}
                        onClick={handleItemClick}
                    />
                </li>
            );
        });

        return (
            <div className={classes.menu}>
                <ul className='flex flex-col gap-2'>{itemElements}</ul>
            </div>
        );
    }, [
        classes.menu,
        classes.menuItem,
        currentSort.sortAttribute,
        currentSort.sortDirection,
        currentSort.sortFromSearch,
        expanded,
        formatMessage,
        handleItemClick,
        orderSortingList,
        sortMethodsFromConfig
    ]);

    // expand or collapse on click
    const handleSortClick = () => {
        setExpanded(!expanded);
    };

    const handleKeypress = e => {
        if (e.code == 'Enter') {
            setExpanded(expanded);
        }
    };
    const result = expanded
        ? formatMessage({
            id: 'productSort.sortButtonExpanded',
            defaultMessage: 'Sort Button Expanded'
        })
        : formatMessage({
            id: 'productSort.sortButtonCollapsed',
            defaultMessage: 'Sort Button Collapsed'
        });

    return (
        // <div
        //     ref={elementRef}
        //     className={classes.root}
        //     data-cy="CustomSortBy-root"
        //     aria-busy="false"
        // >
        <>
            <Button
                priority={'low'}
                classes={{
                    root_lowPriority: classes.sortButton
                }}
                onClick={handleSortClick}
                data-cy="CustomSortBy-sortButton"
                onKeyDown={handleKeypress}
                aria-label={result}
                className='border border-gray-100 border-solid rounded-[5px] p-2.5 flex gap-x-[15px]'
            >
                <span className={classes.mobileText}>
                    <FormattedMessage
                        id={'productSort.sortButton'}
                        defaultMessage={'Sort'}
                    />
                </span>
                <span className={cn(classes.desktopText, 'flex items-center gap-[15px]')}>
                    <span className={classes.sortText}>
                        &nbsp;{currentSort.sortText}
                    </span>
                    <ArrowUp2 size={15} className={cn('text-gray-900 transition-all stroke-[#292D32]', expanded ? 'rotate-0' : 'rotate-180')} />
                </span>
            </Button>
            {sortElements}
        </>
        // </div>
    );
};

export default CustomSortBy;
