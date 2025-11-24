import { useCallback, useState, useMemo } from 'react';
import { useToasts } from '@magento/peregrine/lib';
import { useIntl } from 'react-intl';
import { useMutation, useQuery } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useUserContext } from '@magento/peregrine/lib/context/user';

import { useHistory } from 'react-router-dom';

import { appendOptionsToPayload } from '@magento/peregrine/lib/util/appendOptionsToPayload';
import { findMatchingVariant } from '@magento/peregrine/lib/util/findMatchingProductVariant';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';
import { isSupportedProductType as isSupported } from '@magento/peregrine/lib/util/isSupportedProductType';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import defaultOperations from '@magento/peregrine/lib/talons/ProductFullDetail/productFullDetail.gql';
import productReviewOperations from './productReview.gql';
import { useEventingContext } from '@magento/peregrine/lib/context/eventing';
import { getOutOfStockVariants } from '@magento/peregrine/lib/util/getOutOfStockVariants';

const INITIAL_OPTION_CODES = new Map();
const INITIAL_OPTION_SELECTIONS = new Map();
const OUT_OF_STOCK_CODE = 'OUT_OF_STOCK';
const IN_STOCK_CODE = 'IN_STOCK';

const deriveOptionCodesFromProduct = product => {
    // If this is a simple product it has no option codes.
    if (!isProductConfigurable(product)) {
        return INITIAL_OPTION_CODES;
    }

    // Initialize optionCodes based on the options of the product.
    const initialOptionCodes = new Map();
    for (const {
        attribute_id,
        attribute_code
    } of product.configurable_options) {
        initialOptionCodes.set(attribute_id, attribute_code);
    }

    return initialOptionCodes;
};

// Similar to deriving the initial codes for each option.
const deriveOptionSelectionsFromProduct = product => {
    if (!isProductConfigurable(product)) {
        return INITIAL_OPTION_SELECTIONS;
    }

    const initialOptionSelections = new Map();
    for (const { attribute_id } of product.configurable_options) {
        initialOptionSelections.set(attribute_id, undefined);
    }

    return initialOptionSelections;
};

const getIsMissingOptions = (product, optionSelections) => {
    // Non-configurable products can't be missing options.
    if (!isProductConfigurable(product)) {
        return false;
    }

    // Configurable products are missing options if we have fewer
    // option selections than the product has options.
    const { configurable_options } = product;
    const numProductOptions = configurable_options.length;
    const numProductSelections = Array.from(optionSelections.values()).filter(
        value => !!value
    ).length;

    return numProductSelections < numProductOptions;
};

const getIsOutOfStock = (product, optionCodes, optionSelections) => {
    const { stock_status, variants } = product;
    const isConfigurable = isProductConfigurable(product);
    const optionsSelected =
        Array.from(optionSelections.values()).filter(value => !!value).length >
        0;

    if (isConfigurable && optionsSelected) {
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });
        const stockStatus = item?.product?.stock_status;

        return stockStatus === OUT_OF_STOCK_CODE || !stockStatus;
    }
    return stock_status === OUT_OF_STOCK_CODE;
};
const getIsAllOutOfStock = product => {
    const { stock_status, variants } = product;
    const isConfigurable = isProductConfigurable(product);

    if (isConfigurable) {
        const inStockItem = variants.find(item => {
            return item.product.stock_status === IN_STOCK_CODE;
        });
        return !inStockItem;
    }

    return stock_status === OUT_OF_STOCK_CODE;
};

const getMediaGalleryEntries = (product, optionCodes, optionSelections) => {
    let value = [];

    const { media_gallery_entries, variants } = product;
    const isConfigurable = isProductConfigurable(product);

    let variantGallery = variants && variants.length ? variants.flatMap(variant => variant.product.media_gallery_entries || []) : [];
    if (variantGallery) {
        // variantGallery = variantGallery.sort((a, b) => a.uid - b.uid);
    }

    value = isConfigurable && variants && variants.length > 0
    ? [
        ...media_gallery_entries,
        ...variantGallery
    ]
    : media_gallery_entries;

    return value;
};

const getSelectedMedia = (product, optionCodes, optionSelections) => {
    let valueSelected = [];

    const { media_gallery_entries, variants } = product;
    const isConfigurable = isProductConfigurable(product);

    // Selections are initialized to "code => undefined". Once we select a value, like color, the selections change. This filters out unselected options.
    const optionsSelected =
        Array.from(optionSelections.values()).filter(value => !!value).length >
        0;

    if (isConfigurable && optionsSelected) {
        // If any of the possible variants matches the selection add that
        // variant's image to the media gallery. NOTE: This _can_, and does,
        // include variants such as size. If Magento is configured to display
        // an image for a size attribute, it will render that image.
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        valueSelected = item
            ? item.product.media_gallery_entries
            : media_gallery_entries;
    }

    return valueSelected;
};

// We only want to display breadcrumbs for one category on a PDP even if a
// product has multiple related categories. This function filters and selects
// one category id for that purpose.
const getBreadcrumbCategoryId = categories => {
    // Exit if there are no categories for this product.
    if (!categories || !categories.length) {
        return;
    }
    const breadcrumbSet = new Set();
    categories.forEach(({ breadcrumbs }) => {
        // breadcrumbs can be `null`...
        (breadcrumbs || []).forEach(({ category_id }) =>
            breadcrumbSet.add(category_id)
        );
    });

    // Until we can get the single canonical breadcrumb path to a product we
    // will just return the first category id of the potential leaf categories.
    const leafCategory = categories.find(
        category => !breadcrumbSet.has(category.uid)
    );

    // If we couldn't find a leaf category then just use the first category
    // in the list for this product.
    return leafCategory.uid || categories[0].uid;
};

const getConfigPrice = (product, optionCodes, optionSelections) => {
    let value;

    const { variants } = product;
    const isConfigurable = isProductConfigurable(product);

    const optionsSelected =
        Array.from(optionSelections.values()).filter(value => !!value).length >
        0;

    if (!isConfigurable) {
        value = product.price_range?.maximum_price;
    } else {
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        const minPrice = product.price_range?.minimum_price.final_price.value;
        const maxPrice = product.price_range?.maximum_price.final_price.value;

        let val = minPrice;
        if (minPrice != maxPrice) {
            val = minPrice + ' - ' + maxPrice;
        }

        const priceRange = {
            final_price: {
                value: val,
                currency: product.price_range?.minimum_price.final_price.currency
            }
        };

        value = optionsSelected && item
            ? item.product.price_range?.maximum_price
            : priceRange;
    }

    return value;
};

const getConfigName = (product, optionCodes, optionSelections) => {
    let value;

    const { variants } = product;
    const isConfigurable = isProductConfigurable(product);

    const optionsSelected =
        Array.from(optionSelections.values()).filter(value => !!value).length >
        0;

    if (!isConfigurable) {
        value = product.name;
    } else {
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        value = optionsSelected && item
            ? item.product.name
            : product.name;
    }

    return value;
};

const getConfigSku = (product, optionCodes, optionSelections) => {
    let value;

    const { variants } = product;
    const isConfigurable = isProductConfigurable(product);

    const optionsSelected =
        Array.from(optionSelections.values()).filter(value => !!value).length >
        0;

    if (!isConfigurable) {
        value = product.name;
    } else {
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        value = optionsSelected && item
            ? item.product.sku
            : product.sku;
    }

    return value;
};

const attributeLabelCompare = (attribute1, attribute2) => {
    const label1 = attribute1['attribute_metadata']['label'].toLowerCase();
    const label2 = attribute2['attribute_metadata']['label'].toLowerCase();
    if (label1 < label2) return -1;
    else if (label1 > label2) return 1;
    else return 0;
};

const getCustomAttributes = (product, optionCodes, optionSelections) => {
    const { custom_attributes, variants } = product;
    const isConfigurable = isProductConfigurable(product);
    const optionsSelected =
        Array.from(optionSelections.values()).filter(value => !!value).length >
        0;

    if (isConfigurable && optionsSelected) {
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        return item && item.product
            ? [...item.product.custom_attributes].sort(attributeLabelCompare)
            : [];
    }

    return custom_attributes
        ? [...custom_attributes].sort(attributeLabelCompare)
        : [];
};

/**
 * @param {GraphQLDocument} props.addConfigurableProductToCartMutation - configurable product mutation
 * @param {GraphQLDocument} props.addSimpleProductToCartMutation - configurable product mutation
 * @param {Object.<string, GraphQLDocument>} props.operations - collection of operation overrides merged into defaults
 * @param {Object} props.product - the product, see RootComponents/Product
 *
 * @returns {{
 *  breadcrumbCategoryId: string|undefined,
 *  errorMessage: string|undefined,
 *  handleAddToCart: func,
 *  handleSelectionChange: func,
 *  handleSetQuantity: func,
 *  isAddToCartDisabled: boolean,
 *  isSupportedProductType: boolean,
 *  mediaGalleryEntries: array,
 *  productDetails: object,
 *  quantity: number
 * }}
 */
export const useProductFullDetail = props => {
    const {
        addConfigurableProductToCartMutation,
        addSimpleProductToCartMutation,
        product,
        isPreview
    } = props;

    const history = useHistory();

    const handleToastAction = useCallback(
        (removeToast) => {
            history.push('/cart');
            removeToast();
        },
        [history]
    );

    const [, { addToast }] = useToasts();

    const { data: productReviewData, loading: loadingProductReview, error: errorProductReview, refetch: refetchProductReviews } = useQuery(
        productReviewOperations.getProductReviews,
        {
            variables: { url_key: product?.url_key },
            skip: !product?.url_key,
            fetchPolicy: 'network-only'
        }
    );

    // Query for ratings metadata
    const { data: ratingsMetadataData, loading: loadingRatingsMetadata } = useQuery(
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

            await refetchProductReviews();
            addToast({ type: 'success', message: 'Review submitted successfully!' });
            return { success: true };
        } catch (e) {
            addToast({ type: 'error', message: e?.message || 'Failed to submit review!' });
            return { success: false, error: e };
        }
    };

    const [, { dispatch }] = useEventingContext();

    const hasDeprecatedOperationProp = !!(
        addConfigurableProductToCartMutation || addSimpleProductToCartMutation
    );
    const operations = mergeOperations(defaultOperations, props.operations);

    const productType = product.__typename;

    const isSupportedProductType = isSupported(productType);

    const [{ cartId }] = useCartContext();
    const [{ isSignedIn, currentUser }] = useUserContext();
    const { formatMessage } = useIntl();

    const { data: storeConfigData } = useQuery(
        operations.getWishlistConfigQuery,
        {
            fetchPolicy: 'cache-and-network'
        }
    );

    const [
        addConfigurableProductToCart,
        {
            error: errorAddingConfigurableProduct,
            loading: isAddConfigurableLoading
        }
    ] = useMutation(
        addConfigurableProductToCartMutation ||
            operations.addConfigurableProductToCartMutation
    );

    const [
        addSimpleProductToCart,
        { error: errorAddingSimpleProduct, loading: isAddSimpleLoading }
    ] = useMutation(
        addSimpleProductToCartMutation ||
            operations.addSimpleProductToCartMutation
    );

    const [
        addProductToCart,
        {
            data: addToCartResponseData,
            error: errorAddingProductToCart,
            loading: isAddProductLoading
        }
    ] = useMutation(operations.addProductToCartMutation);

    const breadcrumbCategoryId = useMemo(
        () => getBreadcrumbCategoryId(product.categories),
        [product.categories]
    );

    const derivedOptionSelections = useMemo(
        () => deriveOptionSelectionsFromProduct(product),
        [product]
    );

    const [optionSelections, setOptionSelections] = useState(
        derivedOptionSelections
    );

    const [singleOptionSelection, setSingleOptionSelection] = useState();

    const derivedOptionCodes = useMemo(
        () => deriveOptionCodesFromProduct(product),
        [product]
    );
    const [optionCodes] = useState(derivedOptionCodes);

    const isMissingOptions = useMemo(
        () => getIsMissingOptions(product, optionSelections),
        [product, optionSelections]
    );

    const isOutOfStock = useMemo(
        () => getIsOutOfStock(product, optionCodes, optionSelections),
        [product, optionCodes, optionSelections]
    );

    // Check if display out of stock products option is selected in the Admin Dashboard
    const isOutOfStockProductDisplayed = useMemo(() => {
        let totalVariants = 1;
        const isConfigurable = isProductConfigurable(product);
        if (product.configurable_options && isConfigurable) {
            for (const option of product.configurable_options) {
                const length = option.values.length;
                totalVariants = totalVariants * length;
            }
            return product.variants.length === totalVariants;
        }
    }, [product]);

    const isEverythingOutOfStock = useMemo(() => getIsAllOutOfStock(product), [
        product
    ]);

    const outOfStockVariants = useMemo(
        () =>
            getOutOfStockVariants(
                product,
                optionCodes,
                singleOptionSelection,
                optionSelections,
                isOutOfStockProductDisplayed
            ),
        [
            product,
            optionCodes,
            singleOptionSelection,
            optionSelections,
            isOutOfStockProductDisplayed
        ]
    );

    const mediaGalleryEntries = useMemo(
        () => getMediaGalleryEntries(product, optionCodes, optionSelections),
        [product, optionCodes, optionSelections]
    );

    const selectedMedia = useMemo(
        () => getSelectedMedia(product, optionCodes, optionSelections),
        [product, optionCodes, optionSelections]
    );

    const customAttributes = useMemo(
        () => getCustomAttributes(product, optionCodes, optionSelections),
        [product, optionCodes, optionSelections]
    );

    const productPrice = useMemo(
        () => getConfigPrice(product, optionCodes, optionSelections),
        [product, optionCodes, optionSelections]
    );

    const productName = useMemo(
        () => getConfigName(product, optionCodes, optionSelections),
        [product, optionCodes, optionSelections]
    );

    const productSku = useMemo(
        () => getConfigSku(product, optionCodes, optionSelections),
        [product, optionCodes, optionSelections]
    );

    // The map of ids to values (and their uids)
    // For example:
    // { "179" => [{ uid: "abc", value_index: 1 }, { uid: "def", value_index: 2 }]}
    const attributeIdToValuesMap = useMemo(() => {
        const map = new Map();
        // For simple items, this will be an empty map.
        const options = product.configurable_options || [];
        for (const { attribute_id, values } of options) {
            map.set(attribute_id, values);
        }
        return map;
    }, [product.configurable_options]);

    // An array of selected option uids. Useful for passing to mutations.
    // For example:
    // ["abc", "def"]
    const selectedOptionsArray = useMemo(() => {
        const selectedOptions = [];

        optionSelections.forEach((value, key) => {
            const values = attributeIdToValuesMap.get(key);

            const selectedValue = values?.find(
                item => item.value_index === value
            );

            if (selectedValue) {
                selectedOptions.push(selectedValue.uid);
            }
        });
        return selectedOptions;
    }, [attributeIdToValuesMap, optionSelections]);

    const handleAddToCart = useCallback(
        async formValues => {
            const { quantity } = formValues;

            /*
                @deprecated in favor of general addProductsToCart mutation. Will support until the next MAJOR.
             */
            if (hasDeprecatedOperationProp) {
                const payload = {
                    item: product,
                    productType,
                    quantity
                };

                if (isProductConfigurable(product)) {
                    appendOptionsToPayload(
                        payload,
                        optionSelections,
                        optionCodes
                    );
                }

                if (isSupportedProductType) {
                    const variables = {
                        cartId,
                        parentSku: payload.parentSku,
                        product: payload.item,
                        quantity: payload.quantity,
                        sku: payload.item.sku
                    };
                    // Use the proper mutation for the type.
                    if (productType === 'SimpleProduct') {
                        try {
                            await addSimpleProductToCart({
                                variables
                            });
                        } catch {
                            return;
                        }
                    } else if (productType === 'ConfigurableProduct') {
                        try {
                            await addConfigurableProductToCart({
                                variables
                            });
                        } catch {
                            return;
                        }
                    }
                } else {
                    console.error(
                        'Unsupported product type. Cannot add to cart.'
                    );
                }
            } else {
                const variables = {
                    cartId,
                    product: {
                        sku: product.sku,
                        quantity
                    },
                    entered_options: [
                        {
                            uid: product.uid,
                            value: product.name
                        }
                    ]
                };

                if (selectedOptionsArray.length) {
                    variables.product.selected_options = selectedOptionsArray;
                }

                try {
                    await addProductToCart({ variables });

                    const selectedOptionsLabels =
                        selectedOptionsArray?.map((uid, i) => ({
                            attribute: product.configurable_options[i].label,
                            value:
                                product.configurable_options[i].values.findLast(
                                    x => x.uid === uid
                                )?.label || null
                        })) || null;

                    dispatch({
                        type: 'CART_ADD_ITEM',
                        payload: {
                            cartId,
                            sku: product.sku,
                            name: product.name,
                            pricing: product.price,
                            priceTotal: productPrice.final_price.value,
                            currencyCode: productPrice.final_price.currency,
                            discountAmount: productPrice.discount.amount_off,
                            selectedOptions: selectedOptionsLabels,
                            quantity
                        }
                    });
                } catch {
                    return;
                }
            }
        },
        [
            addConfigurableProductToCart,
            addProductToCart,
            addSimpleProductToCart,
            cartId,
            dispatch,
            hasDeprecatedOperationProp,
            isSupportedProductType,
            optionCodes,
            optionSelections,
            product,
            productPrice,
            productType,
            selectedOptionsArray
        ]
    );

    const handleSelectionChange = useCallback(
        (optionId, selection) => {
            // We must create a new Map here so that React knows that the value
            // of optionSelections has changed.
            const nextOptionSelections = new Map([...optionSelections]);
            nextOptionSelections.set(optionId, selection);
            setOptionSelections(nextOptionSelections);
            // Create a new Map to keep track of single selections with key as String
            const nextSingleOptionSelection = new Map();
            nextSingleOptionSelection.set(optionId, selection);
            setSingleOptionSelection(nextSingleOptionSelection);
        },
        [optionSelections]
    );

    // Normalization object for product details we need for rendering.
    const productDetails = {
        description: product.description,
        shortDescription: product.short_description,
        name: productName,
        price: productPrice?.final_price,
        price_range: product?.price_range,
        sku: productSku,
        publish_status: product.publish_status,
        term_and_conditions: product.term_and_conditions,
        link_to_other_stores: product.link_to_other_stores,
        shipping_policy: product.shipping_policy,
        return_policy: product.return_policy,
        preorder: product.preorder,
        auction_data: product.auction_data
    };

    const sellerDetails = {
        name: product.seller?.name,
        url_key: product.seller?.url_key,
        city: product.seller?.city,
        country: product.seller?.country
    };

    const derivedErrorMessage = useMemo(
        () =>
            deriveErrorMessage([
                errorAddingSimpleProduct,
                errorAddingConfigurableProduct,
                errorAddingProductToCart,
                ...(addToCartResponseData?.addProductsToCart?.user_errors || [])
            ]),
        [
            errorAddingConfigurableProduct,
            errorAddingProductToCart,
            errorAddingSimpleProduct,
            addToCartResponseData
        ]
    );

    const wishlistItemOptions = useMemo(() => {
        const options = {
            quantity: 1,
            sku: product.sku
        };

        if (productType === 'ConfigurableProduct') {
            options.selected_options = selectedOptionsArray;
        }

        return options;
    }, [product, productType, selectedOptionsArray]);

    const wishlistButtonProps = {
        buttonText: isSelected =>
            isSelected
                ? formatMessage({
                      id: 'wishlistButton.addedText',
                      defaultMessage: 'Added to Favorites'
                  })
                : formatMessage({
                      id: 'wishlistButton.addText',
                      defaultMessage: 'Add to Favorites'
                  }),
        item: wishlistItemOptions,
        storeConfig: storeConfigData ? storeConfigData.storeConfig : {}
    };

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
        addToCartResponseData,
        errorAddingProductToCart,
        isAddProductLoading,
        breadcrumbCategoryId,
        errorMessage: derivedErrorMessage,
        handleAddToCart,
        handleSelectionChange,
        isOutOfStock,
        isEverythingOutOfStock,
        outOfStockVariants,
        isAddToCartDisabled:
            isPreview || isOutOfStock ||
            isEverythingOutOfStock ||
            isMissingOptions ||
            isAddConfigurableLoading ||
            isAddSimpleLoading ||
            isAddProductLoading,
        isSupportedProductType,
        mediaGalleryEntries,
        selectedMedia,
        shouldShowWishlistButton:
            isSignedIn &&
            storeConfigData &&
            !!storeConfigData.storeConfig.magento_wishlist_general_is_enabled,
        productDetails,
        customAttributes,
        wishlistButtonProps,
        wishlistItemOptions,
        sellerDetails,
        productReviewData,
        loadingProductReview,
        errorProductReview,
        ratingsMetadataData,
        loadingRatingsMetadata,
        handleSubmitReview,
        loadingCreateReview,
        errorCreateReview,
        defaultNickname,
        handleToastAction
    };
};
