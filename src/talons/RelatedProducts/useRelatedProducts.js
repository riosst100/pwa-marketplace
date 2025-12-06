import { useQuery } from '@apollo/client';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useIntl } from 'react-intl';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './relatedProducts.gql';

export const useRelatedProducts = props => {
    const { mapSeller } = props;

    const { formatMessage } = useIntl();

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getStoreConfigData, getSellerDetailQuery, getCouponCodeQuery } = operations;
    const { pathname } = useLocation();
    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();

    const { data: storeConfigData } = useQuery(getStoreConfigData, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const slug = pathname.split('/')[2];
    const productUrlSuffix = storeConfigData?.storeConfig?.product_url_suffix;
    const urlKey = productUrlSuffix ? slug.replace(productUrlSuffix, '') : slug;

    const getOtherInfo = true;
    const getProducts = true;

    const { error, loading, data } = useQuery(getSellerDetailQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !storeConfigData,
        variables: {
            urlKey,
            getOtherInfo,
            getProducts
        }
    });

    const {
        data: couponData,
        error: couponError,
        loading: couponLoading
    } = useQuery(getCouponCodeQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            sellerUrl: urlKey,
            pageSize: 20,
            currentPage: 1,
            filters: {
                is_public: {
                    eq: '1'
                }
            }
        },
        skip: !urlKey
    });

    const isBackgroundLoading = !!data && loading;

    const seller = useMemo(() => {
        if (!data) {
            return null;
        }
        
        const seller = data.sellerByUrl;

        if (!seller) {
            return null;
        }

        return mapSeller(seller);
    }, [data, mapSeller, urlKey]);

    // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(isBackgroundLoading);
    }, [isBackgroundLoading, setPageLoading]);

    const favoriteSellerOptions = useMemo(() => {
        const options = {
            seller_id: seller?.seller_id
        };

        return options;
    }, [seller]);

    const favoriteSellerButtonProps = {
        buttonText: '',
        item: favoriteSellerOptions,
        storeConfig: storeConfigData ? storeConfigData.storeConfig : {}
    };

    return {
        error,
        loading,
        seller,
        favoriteSellerButtonProps,
        couponData,
        couponError,
        couponLoading
    };
};
