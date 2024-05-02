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

export const useSubCategory = props => {
    const { children } = props;

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
        if (children) {
            return (
                children.length &&
                children
                    .map(category => ({
                        text: category?.name || '',
                        path: getPath(
                            category.url_path,
                            categoryUrlSuffix
                        )
                    }))
            );
        }
    }, [categoryUrlSuffix, children]);

    return {
        normalizedData: normalizedData || []
    };
};
