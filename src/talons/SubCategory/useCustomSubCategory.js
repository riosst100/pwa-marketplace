import { useMemo } from 'react';
import { useQuery } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './subCategory.gql';

const getPath = (path, suffix) => {
    if (path) {
        return `/${path}${suffix || ''}`;
    }

    // If there is no path this is just a dead link.
    return '#';
};

export const useCustomSubCategory = props => {
    const { customSubCategory } = props;

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

    const normalizedData = useMemo(() => {
        if (customSubCategory) {
            return (
                customSubCategory.length &&
                customSubCategory
                    .map(category => ({
                        text: category.name,
                        path: `/${category.path}`
                    }))
            );
        }
    }, [categoryUrlSuffix, customSubCategory]);

    return {
        normalizedData: normalizedData || []
    };
};
