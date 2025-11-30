import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
// import { Heart } from 'react-feather';
import { gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { useProduct } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useProduct';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import Price from '@magento/venia-ui/lib/components/Price';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Image from '@magento/venia-ui/lib/components/Image';
import Kebab from '@magento/venia-ui/lib/components/LegacyMiniCart/kebab';
import ProductOptions from '@magento/venia-ui/lib/components/LegacyMiniCart/productOptions';
import Section from '@magento/venia-ui/lib/components/LegacyMiniCart/section';
import AddToListButton from '@magento/venia-ui/lib/components/Wishlist/AddToListButton';
import Quantity from './quantity';
import cn from 'classnames';
import Button from '@magento/venia-ui/lib/components/Button';
import { Trash, Heart } from 'iconsax-react';

import defaultClasses from './product.module.css';

import { CartPageFragment } from '@magento/peregrine/lib/talons/CartPage/cartPageFragments.gql.js';
import { AvailableShippingMethodsCartFragment } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/shippingMethodsFragments.gql.js';

const IMAGE_SIZE = 100;

const HeartIcon = <Heart size="16" color="#909090" />;

const Product = props => {
    const { item } = props;
    const { formatMessage } = useIntl();
    const talonProps = useProduct({
        operations: {
            removeItemMutation: REMOVE_ITEM_MUTATION,
            updateItemQuantityMutation: UPDATE_QUANTITY_MUTATION
        },
        ...props
    });

    const {
        addToWishlistProps,
        errorMessage,
        handleEditItem,
        handleRemoveFromCart,
        handleUpdateItemQuantity,
        isEditable,
        product,
        isProductUpdating
    } = talonProps;

    const { afterAdd, item: itemProduct, storeConfig } = addToWishlistProps;

    const {
        currency,
        image,
        name,
        options,
        quantity,
        stockStatus,
        unitPrice,
        urlKey,
        urlSuffix
    } = product;

    const classes = useStyle(defaultClasses, props.classes);

    const itemClassName = isProductUpdating
        ? classes.item_disabled
        : classes.item;

    const editItemSection = isEditable ? (
        <Section
            text={formatMessage({
                id: 'product.editItem',
                defaultMessage: 'Edit item'
            })}
            data-cy="Product-Section-editItem"
            onClick={handleEditItem}
            icon="Edit2"
            classes={{
                text: classes.sectionText
            }}
        />
    ) : null;

    const itemLink = useMemo(
        () => resourceUrl(`/${urlKey}${urlSuffix || ''}`),
        [urlKey, urlSuffix]
    );

    const stockStatusMessage =
        stockStatus === 'OUT_OF_STOCK'
            ? formatMessage({
                id: 'product.outOfStock',
                defaultMessage: 'Out-of-stock'
            })
            : '';

    return (
        <li className={cn(classes.root, 'border-b border-gray-100 p-[15px] last_border-none')} data-cy="Product-root">
            <span className={classes.errorText}>{errorMessage}</span>
            <div className="flex justify-between">
                <div className='flex gap-[15px]'>
                    <Link
                        to={itemLink}
                        className={classes.imageContainer}
                        data-cy="Product-imageContainer"
                    >
                        <Image
                            alt={name}
                            classes={{
                                root: classes.imageRoot,
                                image: cn(classes.image, '!h-[100px] w-full border-gray-100 !rounded-md !bg-transparent p-1')
                            }}
                            width={IMAGE_SIZE}
                            height={IMAGE_SIZE}
                            resource={image}
                            data-cy="Product-image"
                        />
                    </Link>
                    <div className='flex flex-col'>
                        <div className={cn(classes.name, 'text-[14px] font-normal max-w-[260px]')} data-cy="Product-name">
                            {item.is_preorder && (
                                <span className="inline-flex items-center gap-1 px-2 py-[2px] mb-3 rounded-full bg-blue-600 text-white border border-blue-700 text-[11px] font-medium">
                                    Preorder
                                </span>
                            )}
                            <br/>
                            <Link to={itemLink}>{name}</Link>
                        </div>
                        {item.is_preorder && (
                            <div className="mt-2 flex flex-col gap-1" aria-label="Preorder information">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-[11px] text-amber-800">
                                        Release: {(() => {
                                            const rd = item?.product?.release_date;
                                            if (!rd) return '-';
                                            const d = new Date(rd);
                                            if (isNaN(d.getTime())) return rd;
                                            const dd = String(d.getDate()).padStart(2, '0');
                                            const mm = String(d.getMonth() + 1).padStart(2, '0');
                                            const yyyy = d.getFullYear();
                                            return `${dd}/${mm}/${yyyy}`;
                                        })()}
                                    </span>
                                    {item.pre_order_payment_type === 'deposit' && item.pre_order_deposit != null && (
                                        <span className="text-[11px] text-amber-800">
                                            {(() => {
                                                const raw = item.pre_order_deposit;
                                                const n = typeof raw === 'number' ? raw : Number.parseFloat(String(raw).replace(/[^0-9.-]/g,''));
                                                if (!Number.isFinite(n)) {
                                                    return `Deposit: ${raw}`;
                                                }
                                                let str = n.toString();
                                                if (str.includes('.')) {
                                                    str = str.replace(/\.0+$/,'');
                                                    str = str.replace(/\.(\d*[1-9])0+$/,'.$1');
                                                }
                                                return `Deposit: ${str}%`;
                                            })()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                        <ProductOptions
                            options={options}
                            classes={{
                                options: classes.options,
                                optionLabel: classes.optionLabel
                            }}
                        />
                        <span className={classes.stockStatusMessage}>
                            {stockStatusMessage}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col">

                    <span className={cn(classes.price, 'text-[16px] font-medium text-right mb-5 text-blue-600')} data-cy="Product-price">
                        <Price currencyCode={currency} value={unitPrice} />
                        {/* <FormattedMessage
                            id={'product.price'}
                            defaultMessage={' ea.'}
                        /> */}
                    </span>
                    <div className={cn(classes.quantity, 'hidden sm_flex')}>
                        <Quantity
                            itemId={item.id}
                            initialValue={quantity}
                            onChange={handleUpdateItemQuantity}
                        />
                    </div>
                </div>
                {/* <Kebab
                    classes={{
                        root: classes.kebab
                    }}
                    disabled={true}
                >
                    {editItemSection}
                    <Section
                        text={formatMessage({
                            id: 'product.removeFromCart',
                            defaultMessage: 'Remove from cart'
                        })}
                        data-cy="Product-Section-removeFromCart"
                        onClick={handleRemoveFromCart}
                        icon="Trash"
                        classes={{
                            text: classes.sectionText
                        }}
                    />
                    <li>
                        <AddToListButton
                            {...addToWishlistProps}
                            classes={{
                                root: classes.addToListButton,
                                root_selected: classes.addToListButton_selected
                            }}
                            icon={HeartIcon}
                        />
                    </li>
                </Kebab> */}

            </div>
            <div className='flex justify-end gap-2.5 items-center mt-2 sm_mt-0'>
                <div className={cn(classes.quantity, 'flex-auto sm_hidden')}>
                    <Quantity
                        itemId={item.id}
                        initialValue={quantity}
                        onChange={handleUpdateItemQuantity}
                    />
                </div>
                {editItemSection}
                <span>
                    <AddToListButton
                        // {...addToWishlistProps}
                        afterAdd={afterAdd}
                        item={itemProduct}
                        storeConfig={storeConfig}
                        classes={{
                            root: cn(
                                classes.addToListButton,
                                'min-w-min border border-gray-200 rounded-full border-solid w-7 h-7 flex items-center justify-center !p-0 hover_border-gray-600'
                            ),
                            root_selected: classes.addToListButton_selected
                        }}
                        icon={HeartIcon}
                    />
                </span>
                {/* <Section
                    // text={formatMessage({
                    //     id: 'product.removeFromCart',
                    //     defaultMessage: 'Remove from cart'
                    // })}
                    data-cy="Product-Section-removeFromCart"
                    onClick={handleRemoveFromCart}
                    icon={"Trash"}
                    classes={{
                        text: classes.sectionText,
                        button: 'w-fitContent'
                    }}
                /> */}
                <Button
                    data-cy="Product-Section-removeFromCart"
                    onClick={handleRemoveFromCart}
                    className="min-w-min border border-gray-200 rounded-full border-solid w-7 h-7 flex items-center justify-center hover_border-gray-600"
                >
                    <Trash size="16" color="#999999" />
                </Button>
            </div>
        </li>
    );
};

export default Product;

export const REMOVE_ITEM_MUTATION = gql`
    mutation removeItem($cartId: String!, $itemId: ID!) {
        removeItemFromCart(
            input: { cart_id: $cartId, cart_item_uid: $itemId }
        ) {
            cart {
                id
                ...CartPageFragment
                ...AvailableShippingMethodsCartFragment
            }
        }
    }
    ${CartPageFragment}
    ${AvailableShippingMethodsCartFragment}
`;

export const UPDATE_QUANTITY_MUTATION = gql`
    mutation updateItemQuantity(
        $cartId: String!
        $itemId: ID!
        $quantity: Float!
    ) {
        updateCartItems(
            input: {
                cart_id: $cartId
                cart_items: [{ cart_item_uid: $itemId, quantity: $quantity }]
            }
        ) {
            cart {
                id
                ...CartPageFragment
                ...AvailableShippingMethodsCartFragment
            }
        }
    }
    ${CartPageFragment}
    ${AvailableShippingMethodsCartFragment}
`;
