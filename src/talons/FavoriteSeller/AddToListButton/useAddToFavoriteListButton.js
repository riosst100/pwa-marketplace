import { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useMutation, useQuery } from '@apollo/client';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import defaultOperations from './addToListButton.gql';

export const useAddToFavoriteListButton = props => {
    const { afterAdd, beforeAdd, item } = props;

    const operations = mergeOperations(defaultOperations, props.operations);

    const [
        addToFavoriteSeller,
        {
            data: addSellerData,
            error: errorAddingProduct,
            loading: isAddingToList
        }
    ] = useMutation(operations.addToFavoriteSellerMutation);

    // const {
    //     client,
    //     data: { customerFavoriteSellers }
    // } = useQuery(operations.getSellerInFavoriteListsQuery);

    // const isSelected = useMemo(() => {
    //     return (
    //         customerFavoriteSellers.includes(item.seller_id) || isAddingToList
    //     );
    // }, [customerFavoriteSellers, isAddingToList, item.seller_id]);
    const isSelected = false;

    const [showLoginToast, setShowLoginToast] = useState(0);

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

                await addToFavoriteSeller({
                    variables: { sellerId: item.seller_id }
                });

                // client.writeQuery({
                //     query: operations.getSellerInFavoriteListsQuery,
                //     data: {
                //         customerFavoriteSellers: [
                //             ...customerFavoriteSellers,
                //             item.seller_id
                //         ]
                //     }
                // });

                // if (afterAdd) {
                //     afterAdd();
                // }
            } catch (error) {
                console.error(error);
            }
        }
    }, [
        addToFavoriteSeller,
        afterAdd,
        beforeAdd,
        // client,
        // customerFavoriteSellers,
        isSignedIn,
        item,
        // operations.getSellerInFavoriteListsQuery
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
                timeout: 5000
            };
        }

        return null;
    }, [formatMessage, showLoginToast]);

    const successToastProps = useMemo(() => {
        if (addSellerData) {
            return {
                type: 'success',
                message: formatMessage({
                    id: 'favoriteSeller.galleryButton.successMessageGeneral',
                    defaultMessage:
                        'Seller successfully added to your favorites list.'
                }),
                timeout: 5000
            };
        }

        return null;
    }, [addSellerData, formatMessage]);

    const errorToastProps = useMemo(() => {
        if (errorAddingProduct) {
            return {
                type: 'error',
                message: formatMessage({
                    id: 'favoriteSeller.galleryButton.addError',
                    defaultMessage:
                        'Something went wrong adding the product to your favorite seller list.'
                }),
                timeout: 5000
            };
        }

        return null;
    }, [errorAddingProduct, formatMessage]);

    const buttonProps = useMemo(
        () => ({
            'aria-label': formatMessage({
                id: 'favoriteSellerButton.addText',
                defaultMessage: 'Add to Favorites'
            }),
            isDisabled: false,
            onPress: handleClick,
            type: 'button'
        }),
        [formatMessage, handleClick]
    );

    return {
        buttonProps,
        buttonText: props.buttonText && props.buttonText(isSelected),
        // customerFavoriteSellers,
        errorToastProps,
        handleClick,
        isSelected,
        loginToastProps,
        successToastProps
    };
};
