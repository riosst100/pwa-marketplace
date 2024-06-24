import React from 'react';
import { shape, string } from 'prop-types';

import { useCurrencySwitcher } from '@magento/peregrine/lib/talons/Header/useCurrencySwitcher';

import { useStyle } from '@magento/venia-ui/lib/classify';
import CurrencySymbol from '@magento/venia-ui/lib/components/CurrencySymbol';
import defaultClasses from './currencySwitcher.module.css';
import SwitcherItem from './switcherItem';
import Shimmer from './currencySwitcher.himmer';
import cn from 'classnames';
import { ArrowUp2 } from 'iconsax-react';
import { darkBlue } from '@riosst100/pwa-marketplace/src/theme/vars';

const CurrencySwitcher = props => {
    const {
        handleSwitchCurrency,
        currentCurrencyCode,
        availableCurrencies,
        currencyMenuRef,
        currencyMenuTriggerRef,
        currencyMenuIsOpen,
        handleTriggerClick
    } = useCurrencySwitcher();

    const classes = useStyle(defaultClasses, props.classes);
    const menuClassName = currencyMenuIsOpen ? classes.menu_open : classes.menu;
    

    const currencySymbol = {
        currency: classes.symbol
    };

    if (!availableCurrencies) return <Shimmer />;

    const hasOnlyOneCurrency = availableCurrencies.length === 1;

    if (availableCurrencies.length === 1) return null;

    const currencies = availableCurrencies.map(code => {
        return (
            <li
                role="option"
                aria-selected={currentCurrencyCode}
                key={code}
                className={classes.menuItem}
            >
                <SwitcherItem
                    active={code === currentCurrencyCode}
                    onClick={handleSwitchCurrency}
                    option={code}
                >
                    <CurrencySymbol
                        classes={currencySymbol}
                        currencyCode={code}
                        currencyDisplay={'narrowSymbol'}
                    />
                    {code}
                </SwitcherItem>
            </li>
        );
    });

    return (
        <div data-cy="CurrencySwitcher-root" className={classes.root}>
            <button
                data-cy="CurrencySwitcher-triggerButton"
                className={classes.trigger}
                aria-label={currentCurrencyCode}
                onClick={handleTriggerClick}
                ref={currencyMenuTriggerRef}
                aria-expanded={currencyMenuIsOpen}
            >
                <span className={cn(classes.label, 'flex flex-row items-center text-base leading-[16px]')}>
                    <CurrencySymbol
                        classes={currencySymbol}
                        currencyCode={currentCurrencyCode}
                        currencyDisplay={'narrowSymbol'}
                    />
                    <span className='flex flex-row items-center gap-[5px]'>
                        {currentCurrencyCode || ''}
                        {!hasOnlyOneCurrency ? (
                            <ArrowUp2 size="12" color={darkBlue} className={cn(currencyMenuIsOpen ? 'rotate-0 ' : 'rotate-180', 'transition-all stroke-current')} variant="Outline" />
                        ) : null}
                    </span>
                </span>

            </button>
            <div ref={currencyMenuRef} className={menuClassName}>
                <ul role="listbox">{currencies}</ul>
            </div>
        </div>
    );
};

export default CurrencySwitcher;

CurrencySwitcher.propTypes = {
    classes: shape({
        root: string,
        trigger: string,
        menu: string,
        menu_open: string,
        menuItem: string,
        symbol: string
    })
};
