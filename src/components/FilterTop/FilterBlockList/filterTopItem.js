import React, { useCallback } from 'react';
import defaultClasses from './filterTopItem.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { Link } from 'react-router-dom';

const FilterTopItem = props => {
    const { pathname, category, selectedOption, setFilterBy, filterBy, filterApi, group, item, onApply, labels, activeFilters, search } = props;
    const { removeGroup, toggleItem, clear } = filterApi;
    const { title, value, count } = item;

    const classes = useStyle(defaultClasses, props.classes);

    const label = item.label ? item.label : item.title;

    const handleOnchange = useCallback(
        e => {
            if (group != "category_uid") {
                removeGroup({ group });
                // clear();
                if (e === item.value) {
                    toggleItem({ group, item });
                }
            }
            setFilterBy('')
            if (typeof onApply === 'function') {
                onApply(group, item);
            }
        },
        [filterApi, group, item, onApply, removeGroup, toggleItem]
    );

    let filterSearchArr = search ? search.split('&') : [];
    let categoryIdFilters = [];
    let shopbyFilters = [];
    if (filterSearchArr) {
        categoryIdFilters = filterSearchArr.filter(function(data) {
            return data && data.includes('cat_id');
        });

        shopbyFilters = filterSearchArr.filter(function(data) {
            return data && data.includes('shopby');
        });
    }

    const defaultTopFilter = category.default_top_filter;
    const defaultTopFilterAttrCode = defaultTopFilter.attribute_code;

    let newfilterSearchArr = search ? search.split('&') : [];
    newfilterSearchArr = newfilterSearchArr.filter(function(data) {
        return data.includes(defaultTopFilterAttrCode);
    });
    
    let filterSearch = newfilterSearchArr.join('&')

    if (!filterSearch.includes('?')) {
        filterSearch = '?'+filterSearch;
    }

    const element = group == "filterby" ? (
        filterBy == value ? (
            <span className={classes.item}><b>{title}</b></span>
        ) : (
            <span className={classes.item} onClick={() => setFilterBy(value)}>{title}</span>
        )
    ) : group == "category" ? (
        selectedOption == value ? <span className={classes.item}><b>{title}</b></span> : (
            count > 0 ? <Link className={classes.item} to={'/'+value}>{title}</Link> : <span style={{"opacity":"0.5"}} className={classes.item}>{title}</span>
        )
    ) : value == "shopby_all" ? (
        <Link className={classes.item} to={search ? filterSearch + '&show_more=' + group : '?show_more=' + group}>{title}</Link>
    ) : group == "shopby" || group == "shopby_with_all" ? (
        <Link className={classes.item} to={search ? filterSearch + '&shopby=' + value : '?shopby=' + value}>{title}</Link>
    ) : group == "cat_id" ? (
        value == "all" && !categoryIdFilters.length || categoryIdFilters.length && categoryIdFilters[0].includes('cat_id='+value) ? (
            <span className={classes.item}><b>{title}</b></span>
        ) : (
            value == "all" ? <Link className={classes.item} to={'#'}>{title}</Link> : 
            <Link className={classes.item} to={'?cat_id=' + value + (shopbyFilters.length ? '&' + shopbyFilters[0] : '')}>{title}</Link>
        )
    ) : (
        activeFilters && activeFilters.includes(value) ? (
            <span className={classes.item}><b>{title}</b></span>
        ) : (
            count > 0 ? <Link className={classes.item} to={pathname + '?' + group + '[filter]=' + title + ',' + value}>{title}</Link> : <span style={{"opacity":"0.5"}} className={classes.item}>{title}</span>
        )
    )

    labels.set(element, label);

    return element;
};

export default FilterTopItem;
