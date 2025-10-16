
import { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useMutation, useQuery } from '@apollo/client';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import defaultOperations from './addToListButton.gql';
import favoriteSellerListGqls from '@riosst100/pwa-marketplace/src/talons/FavoriteSeller/FavoriteSellerList/favoriteSellerList.gql';


export const useAddToFavoriteListButton = props => {
    const unfollowedRef = useRef(false);
    const { afterAdd, beforeAdd, item } = props;
    const operations = mergeOperations(defaultOperations, props.operations);

    // Mutation for add
    const [
        addToFavoriteSeller,
        {
            data: addSellerData,
            error: errorAddingProduct,
            loading: isAddingToList
        }
    ] = useMutation(operations.addToFavoriteSellerMutation);

    // Mutation for remove
    const [removeSeller, { loading: isRemoving }] = useMutation(
        favoriteSellerListGqls.removeSellerFromFavoriteListMutation
    );

    // Query to get current favorite sellers
    const { data: favoriteListData, refetch: refetchFavoriteList } = useQuery(
        favoriteSellerListGqls.getFavoriteSellerListQuery,
        {
            variables: { pageSize: 100, currentPage: 1 },
            fetchPolicy: 'cache-and-network',
        }
    );

    // Determine if this seller is already in favorite list
    const isSelected = useMemo(() => {
        const items = favoriteListData?.favoritelist?.items || [];
        return items.some(i => i.seller?.seller_id == item.seller_id);
    }, [favoriteListData, item.seller_id]);

    const [showLoginToast, setShowLoginToast] = useState(0);
    const [showUnfollowToast, setShowUnfollowToast] = useState(0);
    const [showFollowToast, setShowFollowToast] = useState(false);

    const { formatMessage } = useIntl();
    const [{ isSignedIn }] = useUserContext();

    const handleClick = useCallback(async () => {
        if (!isSignedIn) {
            setShowLoginToast(current => ++current);
        } else {
            try {
                if (beforeAdd) {
                    await beforeAdd();
                }
                const wasSelected = isSelected;
                unfollowedRef.current = false;
                if (isSelected) {
                    // Unfollow
                    unfollowedRef.current = true;
                    await removeSeller({ variables: { sellerIds: [item.seller_id] } });
                } else {
                    // Follow
                    await addToFavoriteSeller({ variables: { sellerId: item.seller_id } });
                }
                await refetchFavoriteList();
                if (unfollowedRef.current) {
                    setShowUnfollowToast(current => current + 1);
                    unfollowedRef.current = false;
                }
                if (afterAdd) afterAdd(wasSelected);
            } catch (error) {
                console.error(error);
            }
        }
    }, [
        addToFavoriteSeller,
        removeSeller,
        afterAdd,
        beforeAdd,
        isSignedIn,
        item,
        isSelected,
        refetchFavoriteList
    ]);

    const loginToastProps = useMemo(() => {
        if (showLoginToast) {
            return {
                type: 'info',
                message: formatMessage({
                    id: 'favoriteSeller.galleryButton.loginMessage',
                    defaultMessage:
                        'Please sign-in to your Account to save seller for later.'
                }),
                timeout: 3000
            };
        }

        return null;
    }, [formatMessage, showLoginToast]);

    const successToastProps = useMemo(() => {
        if (showFollowToast) {
            return {
                type: 'success',
                message: formatMessage({
                    id: 'favoriteSeller.galleryButton.successMessageGeneral',
                    defaultMessage:
                        'Seller successfully added to your favorites list.'
                }),
                timeout: 3000
            };
        }
        if (showUnfollowToast) {
            return {
                type: 'success',
                message: formatMessage({
                    id: 'favoriteSeller.galleryButton.unfollowSuccessMessage',
                    defaultMessage: 'Seller removed from your favorites list.'
                }),
                timeout: 3000
            };
        }
        return null;
    }, [formatMessage, showFollowToast, showUnfollowToast]);

    useEffect(() => {
        let timeout;
        if (addSellerData && isSelected) {
            setShowFollowToast(true);
            timeout = setTimeout(() => {
                setShowFollowToast(false);
            }, 3100);
        }
        if (showUnfollowToast) {
            timeout = setTimeout(() => {
                setShowUnfollowToast(0);
            }, 3100);
        }
        return () => clearTimeout(timeout);
    }, [addSellerData, showUnfollowToast, isSelected]);

    const errorToastProps = useMemo(() => {
        if (errorAddingProduct) {
            return {
                type: 'error',
                message: formatMessage({
                    id: 'favoriteSeller.galleryButton.addError',
                    defaultMessage:
                        'Something went wrong adding the product to your favorite seller list.'
                }),
                timeout: 3000
            };
        }

        return null;
    }, [errorAddingProduct, formatMessage]);

    const buttonProps = useMemo(
        () => ({
            'aria-label': isSelected
                ? formatMessage({
                    id: 'favoriteSellerButton.unfollowText',
                    defaultMessage: 'Unfollow Seller'
                })
                : formatMessage({
                    id: 'favoriteSellerButton.addText',
                    defaultMessage: 'Follow Seller'
                }),
            isDisabled: isAddingToList || isRemoving,
            onPress: handleClick,
            type: 'button'
        }),
        [formatMessage, handleClick, isSelected, isAddingToList, isRemoving]
    );

    return {
        buttonProps,
        buttonText:
            typeof props.buttonText === 'function'
                ? props.buttonText(isSelected)
                : (isSelected ? 'Unfollow Seller' : 'Follow Seller'),
        errorToastProps,
        handleClick,
        isSelected,
        loginToastProps,
        successToastProps,
        isLoading: isAddingToList || isRemoving
    };
};
