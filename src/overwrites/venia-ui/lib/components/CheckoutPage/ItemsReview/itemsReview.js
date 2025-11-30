import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useItemsReview } from '@magento/peregrine/lib/talons/CheckoutPage/ItemsReview/useItemsReview';

import Item from './item';
import ShowAllButton from './showAllButton';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './itemsReview.module.css';

/**
 * Renders a list of items in an order.
 * @param {Object} props.data an optional static data object to render instead of making a query for data.
 */
const ItemsReview = props => {
    const { classes: propClasses, isPreorder, preOrderDeposit, preOrderPaymentType, releaseDate } = props;
    
    const classes = useStyle(defaultClasses, propClasses);

    const talonProps = useItemsReview({
        data: props.data
    });

    const {
        items: itemsInCart,
        totalQuantity,
        showAllItems,
        setShowAllItems,
        isLoading,
        configurableThumbnailSource
    } = talonProps;

    const items = itemsInCart.map((item, index) => (
        <Item
            key={item.uid}
            {...item}
            isHidden={!showAllItems && index >= 2}
            configurableThumbnailSource={configurableThumbnailSource}
            // Forward explicit preorder values from parent if provided
            is_preorder={typeof isPreorder !== 'undefined' ? isPreorder : item.is_preorder}
            pre_order_payment_type={typeof preOrderPaymentType !== 'undefined' ? preOrderPaymentType : item.pre_order_payment_type}
            pre_order_deposit={typeof preOrderDeposit !== 'undefined' ? preOrderDeposit : item.pre_order_deposit}
            // release_date may come from parent or item.product
            release_date={typeof releaseDate !== 'undefined' ? releaseDate : (item?.product?.release_date)}
        />
    ));

    const showAllItemsFooter = !showAllItems ? (
        <ShowAllButton onClick={setShowAllItems} />
    ) : null;

    if (isLoading) {
        return (
            <LoadingIndicator>
                <FormattedMessage
                    id={'checkoutPage.fetchingItemsInYourOrder'}
                    defaultMessage={'Fetching Items in your Order'}
                />
            </LoadingIndicator>
        );
    }

    return (
        <div
            className={classes.items_review_container}
            data-cy="ItemsReview-container"
        >
            <div className={classes.items_container}>
                <div
                    data-cy="ItemsReview-totalQuantity"
                    className={classes.total_quantity}
                >
                    <span className={classes.total_quantity_amount}>
                        {totalQuantity}
                    </span>
                    <FormattedMessage
                        id={'checkoutPage.itemsInYourOrder'}
                        defaultMessage={' items in your order'}
                    />
                </div>
                {items}
            </div>
            {showAllItemsFooter}
        </div>
    );
};

export default ItemsReview;
