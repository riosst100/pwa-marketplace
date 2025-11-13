import { useCallback, useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './orderRow.gql';

/**
 * Safe override of useOrderRow to guard against missing product data.
 * Fixes: TypeError Cannot read properties of undefined (reading 'variants').
 */
export const useOrderRow = props => {
    const { items = [], operations: ops } = props;
    const operations = mergeOperations(DEFAULT_OPERATIONS, ops);
    const { getProductThumbnailsQuery, getConfigurableThumbnailSource } = operations;

    const urlKeys = useMemo(() => {
        return items.map(item => item.product_url_key).filter(Boolean).sort();
    }, [items]);

    const { data, loading } = useQuery(getProductThumbnailsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: { urlKeys }
    });

    const { data: configurableThumbnailSourceData } = useQuery(
        getConfigurableThumbnailSource,
        { fetchPolicy: 'cache-and-network' }
    );

    const configurableThumbnailSource = useMemo(() => {
        if (configurableThumbnailSourceData && configurableThumbnailSourceData.storeConfig) {
            return configurableThumbnailSourceData.storeConfig.configurable_thumbnail_source;
        }
        return undefined;
    }, [configurableThumbnailSourceData]);

    const imagesData = useMemo(() => {
        const mappedImagesData = {};

        if (!data || !data.products || !Array.isArray(data.products.items)) {
            return mappedImagesData;
        }

        items.forEach(item => {
            if (!item) return;

            const product = data.products.items.find(
                element => item.product_url_key === element.url_key
            );

            if (!product) {
                // No matching product found for url_key; leave null to avoid crashes upstream.
                mappedImagesData[item.product_sku] = null;
                return;
            }

            // When using variant thumbnail, prefer the configured variant image if present.
            if (
                configurableThumbnailSource === 'itself' &&
                Array.isArray(product.variants) &&
                product.variants.length > 0
            ) {
                const foundVariant = product.variants.find(
                    variant => variant && variant.product && variant.product.sku === item.product_sku
                );
                mappedImagesData[item.product_sku] = (foundVariant && foundVariant.product) || product;
            } else {
                mappedImagesData[item.product_sku] = product;
            }
        });

        return mappedImagesData;
    }, [data, items, configurableThumbnailSource]);

    const [isOpen, setIsOpen] = useState(false);
    const handleContentToggle = useCallback(() => {
        setIsOpen(currentValue => !currentValue);
    }, []);

    return {
        loading,
        imagesData,
        isOpen,
        handleContentToggle
    };
};

/**
 * JSDoc type definitions
 */

/**
 * GraphQL operations for the Order Row Component
 *
 * @typedef {Object} OrderRowOperations
 *
 * @property {GraphQLAST} getProductThumbnailsQuery The query used to get product thumbnails of items in the Order.
 *
 * @see [`orderRow.gql.js`]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/OrderHistoryPage/orderRow.gql.js}
 * for queries used in Venia
 */

/**
 * Props data to use when rendering a collapsed image gallery
 *
 * @typedef {Object} OrderRowTalonProps
 *
 * @property {Object} imagesData Images data with thumbnail URLs to render.
 * @property {Boolean} isOpen Boolean which represents if a row is open or not
 * @property {Function} handleContentToggle Callback to toggle isOpen value
 */
