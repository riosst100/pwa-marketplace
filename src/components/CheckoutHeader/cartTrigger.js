import React, { Fragment, Suspense } from 'react';
import { shape, string } from 'prop-types';
import { ShoppingBag as ShoppingCartIcon } from 'react-feather';
import { useIntl } from 'react-intl';

import { useCartTrigger } from '@magento/peregrine/lib/talons/Header/useCartTrigger';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import defaultClasses from './cartTrigger.module.css';
import { GET_ITEM_COUNT_QUERY } from '@magento/venia-ui/lib/components/Header/cartTrigger.gql';
import cn from 'classnames';
import { ShoppingCart } from 'react-feather';
import { darkBlue } from '@riosst100/pwa-marketplace/src/theme/vars';
import { Link } from 'react-router-dom';

const CartTrigger = props => {
    const {
        handleLinkClick,
        handleTriggerClick,
        itemCount,
        miniCartRef,
        miniCartIsOpen,
        hideCartTrigger,
        setMiniCartIsOpen,
        miniCartTriggerRef
    } = useCartTrigger({
        queries: {
            getItemCountQuery: GET_ITEM_COUNT_QUERY
        }
    });

    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const buttonAriaLabel = formatMessage(
        {
            id: 'cartTrigger.ariaLabel',
            defaultMessage:
                'Toggle mini cart. You have {count} items in your cart.'
        },
        { count: itemCount }
    );
    const itemCountDisplay = itemCount > 99 ? '99+' : itemCount;
    const triggerClassName = miniCartIsOpen
        ? classes.triggerContainer_open
        : classes.triggerContainer;

    const maybeItemCounter = itemCount ? (
        <span
            className={cn(
                classes.counter,
                'bg-[#f76b1c] min-w-[18px] min-h-[18px] text-[10px] font-regular leading-[18px] top-[-5px]',
                '!left-auto right-[-4px] absolute p-0 bg'
            )}
            data-cy="CartTrigger-counter"
        >
            {itemCountDisplay}
        </span>
    ) : null;

    // const ShoppingCartIcon = <Icon src={ShoppingCart} attrs={{ width: 20 }} />;

    const cartTrigger = hideCartTrigger ? null : (
        // Because this button behaves differently on desktop and mobile
        // we render two buttons that differ only in their click handler
        // and control which one displays via CSS.
        <Fragment>
            <div className={cn(triggerClassName, '!h-auto')} ref={miniCartTriggerRef}>
                <Link
                    className={cn(
                        classes.trigger,
                        'gap-[5px] !min-h-[30px] !h-auto !min-w-[35px] !w-fit',
                    )}
                    to='/cart'
                >
                    <span>
                        {/* <Icon src={ShoppingCartIcon} /> */}
                        {/* <ShoppingCart size="20" color={darkBlue} className={cn('stroke-0')} variant="Outline" /> */}
                        <Icon src={ShoppingCart} attrs={{ width: 20 }} />
                        {maybeItemCounter}
                    </span>
                </Link>
            </div>
            <button
                aria-expanded={miniCartIsOpen}
                aria-label={buttonAriaLabel}
                className={classes.link}
                onClick={handleLinkClick}
            >
                <Icon src={ShoppingCart} attrs={{ width: 20 }} />
                {maybeItemCounter}
            </button>
        </Fragment>
    );

    return cartTrigger;
};

export default CartTrigger;

CartTrigger.propTypes = {
    classes: shape({
        counter: string,
        link: string,
        openIndicator: string,
        root: string,
        trigger: string,
        triggerContainer: string
    })
};
