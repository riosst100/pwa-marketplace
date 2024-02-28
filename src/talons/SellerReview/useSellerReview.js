import { useQuery } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './sellerReview.gql';
import { useMemo } from 'react';

export const useSellerReview = props => {
    const {
        sellerUrl
    } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getSellerReviewQuery } = operations;

    const filter = [];
    const pageSize = 10;

    const currentPage = 1;

    const sort = {rating_id: 'DESC'}

    const { data, error, loading } = useQuery(getSellerReviewQuery, {
        variables: {
            sellerUrl,
            filter,
            pageSize,
            currentPage,
            sort
        }
    });

    const reviews = useMemo(() => {
        if (!data) {
            return null;
        }
        
        const reviews = data.sellerRatings;

        if (!reviews) {
            return null;
        }

        return reviews;
    }, [data]);

    return {
        reviews,
        loading
    };
};
