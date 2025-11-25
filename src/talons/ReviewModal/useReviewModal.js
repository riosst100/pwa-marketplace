import { useCallback, useMemo } from 'react';
import { useToasts } from '@magento/peregrine/lib';
import { useMutation, useQuery } from '@apollo/client';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useHistory } from 'react-router-dom';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import defaultOperations from '@magento/peregrine/lib/talons/ProductFullDetail/productFullDetail.gql';
import productReviewOperations from './reviewModal.gql';

export const useReviewModal = props => {
    const { reviewOrder, setSubmitting } = props;

    const history = useHistory();

    const handleToastAction = useCallback(
        (removeToast) => {
            history.push('/cart');
            removeToast();
        },
        [history]
    );

    const [, { addToast }] = useToasts();

    const operations = mergeOperations(defaultOperations, props.operations);

    // Query for ratings metadata
    const { data: ratingsMetadata, loading: loadingRatingsMetadata } = useQuery(
        productReviewOperations.getProductReviewRatingsMetadata,
        { fetchPolicy: 'network-only' }
    );
    
    // Mutation for creating review (allow partial data with errors)
    const [createProductReview, { loading: loadingCreateReview, error: errorCreateReview }] = useMutation(
        productReviewOperations.createProductReview,
        { errorPolicy: 'all' }
    );

    // Handler for submitting review with robust toast handling
    const handleSubmitReview = async (formValues) => {
        try {
            setSubmitting(true)
            
            const result = await createProductReview({
                variables: { input: formValues },
                errorPolicy: 'all'
            });

            const gqlErrors = result?.errors || [];
            const review = result?.data?.createProductReview?.review;

            if (gqlErrors.length > 0 || !review) {
                const message = gqlErrors[0]?.message || 'Failed to submit review!';
                addToast({ type: 'error', message });
                return { success: false, error: gqlErrors };
            }

            addToast({ type: 'success', message: 'Review submitted successfully!' });
            return { success: true };
        } catch (e) {
            addToast({ type: 'error', message: e?.message || 'Failed to submit review!' });
            return { success: false, error: e };
        }
    };

    const [{ currentUser }] = useUserContext();

    const defaultNickname = useMemo(() => {
        if (!currentUser) return '';
        const first = currentUser.firstname || '';
        const last = currentUser.lastname || '';
        const full = `${first} ${last}`.trim();
        if (full) return full;
        const email = currentUser.email || '';
        return email ? email.split('@')[0] : '';
    }, [currentUser]);

    return {
        ratingsMetadata: ratingsMetadata?.productReviewRatingsMetadata?.items[0] || null,
        loadingRatingsMetadata,
        handleSubmitReview,
        loadingCreateReview,
        errorCreateReview,
        defaultNickname,
        handleToastAction
    };
};
