import React, { Fragment, useMemo, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { string } from 'prop-types';
import { Link } from 'react-router-dom';

import { useBreadcrumbs } from '@magento/peregrine/lib/talons/Breadcrumbs/useBreadcrumbs';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/components/Breadcrumbs/breadcrumbs.shimmer';
import defaultClasses from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/components/Breadcrumbs/breadcrumbs.module.css';
import { ArrowRight2 } from 'iconsax-react';
import cn from 'classnames';
import { getFiltersFromSearch } from '@magento/peregrine/lib/talons/FilterModal/helpers';
import { useLocation } from 'react-router-dom';

/**
 * Breadcrumbs! Generates a sorted display of category links.
 *
 * @param {String} props.categoryId the uid of the category for which to generate breadcrumbs
 * @param {String} props.currentProduct the name of the product we're currently on, if any.
 */
const Breadcrumbs = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const { categoryId, currentProduct, customPage, currentFilter, currentProductCustomTableMetadata, customAttributesDetails } = props;

    const talonProps = useBreadcrumbs({ categoryId });

    const location = useLocation(); // ✅ dipindah ke atas sebelum conditional return

    const DELIMITER = <ArrowRight2 size={13} className='inline-flex text-gray-200' />;

    const {
        currentCategory,
        currentCategoryPath,
        hasError,
        isLoading,
        normalizedData,
        handleClick
    } = talonProps;

    // For all links generate a fragment like "/ Text"
    const links = useMemo(() => {
        return normalizedData.map(({ text, path }, index) => {
            if (text == "dCollectible Card Games") {
                return '';
            }

            console.log('index', index);

            return (
                <Fragment key={index}>
                    <span className={classes.divider}>{DELIMITER}</span>
                    <Link
                        className={classes.link}
                        to={resourceUrl(path)}
                        onClick={handleClick}
                    >
                        {text}
                    </Link>
                </Fragment>
            );
        });
    }, [classes.divider, classes.link, handleClick, normalizedData]);

    if (isLoading) {
        return <Shimmer />;
    }

    // Don't display anything but the empty, static height div when there's an error.
    if (hasError) {
        return (
            <div
                className={classes.root}
                aria-live="polite"
                aria-busy="false"
            />
        );
    }

    let filterBreadcrumbsElement = []; // ✅ pakai let agar bisa di-push

    const lastIndex = currentFilter ? currentFilter.length - 1 : 0;

    const { search } = location;

    const removeShopbyParam = (url) => {
        const urlParts = url.split("?"); // Pisahkan URL sebelum dan sesudah tanda tanya
        if (urlParts.length < 2) return url; // Jika tidak ada query string, kembalikan URL asli

        const baseUrl = urlParts[0]; // Bagian URL sebelum query string
        const queryString = urlParts[1]; // Bagian query string

        // Pisahkan parameter menjadi array
        const params = queryString.split("&").filter(param => !param.startsWith("shopby="));

        // Gabungkan kembali parameter tanpa "shopby"
        const newQueryString = params.join("&");

        // Gabungkan URL dasar dengan query string yang telah dimodifikasi
        return newQueryString ? `${baseUrl}?${newQueryString}` : baseUrl;
    };

    const params = removeShopbyParam(search);

    if (currentProductCustomTableMetadata) {
        const mainAttrCode = currentProductCustomTableMetadata.mainAttrCode;
        const mainAttrVal = currentProductCustomTableMetadata.mainAttrVal;
        const mainAttrLabel = currentProductCustomTableMetadata.mainAttrLabel;

        filterBreadcrumbsElement.push(
            <Fragment>
                <span className={classes.divider}>{DELIMITER}</span>
                <Link
                    className={classes.link}
                    to={resourceUrl('/' + currentCategoryPath + '?' + mainAttrCode + '[filter]=' + mainAttrLabel + ',' + mainAttrVal)}
                    onClick={handleClick}
                >
                    {mainAttrLabel}
                </Link>
            </Fragment>
        )
    }

    currentFilter && currentFilter.length && currentFilter.map((filter, index) => {
        currentProduct ? (
            filterBreadcrumbsElement.push(
                <Fragment key={index}>
                    <span className={classes.divider}>{DELIMITER}</span>
                    <Link
                        className={classes.link}
                        to={resourceUrl('/' + currentCategoryPath)}
                        onClick={handleClick}
                    >
                        {filter.label}
                    </Link>
                </Fragment>
            )
        ) : (
            customPage ? (
                filterBreadcrumbsElement.push(
                    <Fragment key={index}>
                        <span className={classes.divider}>{DELIMITER}</span>
                        <Link
                            className={classes.link}
                            to={resourceUrl('/' + currentCategoryPath + params)}
                            onClick={handleClick}
                        >
                            {filter.label}
                        </Link>
                    </Fragment>
                )
            ) : filterBreadcrumbsElement.push(
                index == lastIndex ?
                    <Fragment key={index}>
                        <span className={classes.divider}>{DELIMITER}</span>
                        <span className={cn(classes.currentCategory, 'text-blue-700 font-medium')}>{filter.label}</span>
                    </Fragment> : <Fragment key={index}>
                        <span className={classes.divider}>{DELIMITER}</span>
                        <Link
                            className={classes.link}
                            to={resourceUrl('/' + currentCategoryPath + params)}
                            onClick={handleClick}
                        >
                            {filter.label}
                        </Link>
                    </Fragment>
            )
        );
    });

    const currentCategoryLink = currentCategory == "dCollectible Card Games" ? '' : (customPage || currentProduct || currentFilter && currentFilter.length ? (
        <Fragment>
            <span className={classes.divider}>{DELIMITER}</span>
            <Link
                className={classes.link}
                to={'/' + resourceUrl(currentCategoryPath)}
                onClick={handleClick}
            >
                {currentCategory}
            </Link>
        </Fragment>
    ) : (
        <Fragment>
            <span className={classes.divider}>{DELIMITER}</span>
            <span className={cn(classes.currentCategory, 'text-blue-700 font-medium')}>{currentCategory}</span>
        </Fragment>
    ));

    const currentProductNode = currentProduct ? (
        <Fragment>
            <span className={classes.divider}>{DELIMITER}</span>
            <span className={classes.text}>{currentProduct}</span>
        </Fragment>
    ) : null;

    const customPageNode = customPage ? (
        <Fragment>
            <span className={classes.divider}>{DELIMITER}</span>
            <span className={classes.text}>{customPage}</span>
        </Fragment>
    ) : null;

    return (
        <div className={classes.root} aria-live="polite" aria-busy="false">
            <Link className={classes.link} to="/">
                <FormattedMessage id={'global.home'} defaultMessage={'Home'} />
            </Link>
            {links}
            {currentCategoryLink}
            {filterBreadcrumbsElement}
            {currentProductNode}
            {customPageNode}
        </div>
    );
};

export default Breadcrumbs;

Breadcrumbs.propTypes = {
    categoryId: string.isRequired,
    currentProduct: string
};
