import { useMemo } from 'react';
import { useQuery } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './shopByCategory.gql';

const getPath = (path, suffix) => {
    if (path) {
        return `/${path}${suffix || ''}`;
    }

    // If there is no path this is just a dead link.
    return '#';
};

export const useShopByCategory = props => {
    const { children, parent } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getStoreConfigQuery } = operations;

    const { data: storeConfigData } = useQuery(getStoreConfigQuery, {
        fetchPolicy: 'cache-and-network' 
    });

    const categoryUrlSuffix = useMemo(() => {
        if (storeConfigData) {
            return storeConfigData.storeConfig.category_url_suffix;
        }
    }, [storeConfigData]);

    const childrenNormalizedData = useMemo(() => {
        if (children) {
            return (
                children.length &&
                children
                    .map(category => ({
                        text: category.name,
                        path: getPath(
                            category.url_path,
                            categoryUrlSuffix
                        )
                    }))
            );
        }
    }, [categoryUrlSuffix, children]);

    const parentNormalizedData = useMemo(() => {
        if (parent) {
            return (
                parent.length &&
                parent
                    .map(category => ({
                        text: category.name,
                        path: getPath(
                            category.url_path,
                            categoryUrlSuffix
                        )
                    }))
            );
        }
    }, [categoryUrlSuffix, parent]);

    return {
        childrenNormalizedData: childrenNormalizedData || [],
        parentNormalizedData: parentNormalizedData || []
    };
};
