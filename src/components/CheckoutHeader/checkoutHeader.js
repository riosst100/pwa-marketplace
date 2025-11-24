import React, { Fragment, Suspense } from 'react';
import { shape, string } from 'prop-types';
import { Link, Route } from 'react-router-dom';
import Icon from '@magento/venia-ui/lib/components/Icon';

import AccountTrigger from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/components/Header/accountTrigger';

import CartTrigger from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/components/Header/cartTrigger';
import { Lock } from 'react-feather';
import WishlistTrigger from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/components/Header/wishlistTrigger';
import NavTrigger from '@magento/venia-ui/lib/components/Header/navTrigger';
import SearchTrigger from '@magento/venia-ui/lib/components/Header/searchTrigger';
import OnlineIndicator from '@magento/venia-ui/lib/components/Header/onlineIndicator';
import { useHeader } from '@magento/peregrine/lib/talons/Header/useHeader';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './checkoutHeader.module.css';
import StoreSwitcher from '@magento/venia-ui/lib/components/Header/storeSwitcher';
import WebsiteSwitcher from '@riosst100/pwa-marketplace/src/components/WebsiteSwitcher/websiteSwitcher';
// import CurrencySwitcher from '@magento/venia-ui/lib/components/Header/currencySwitcher';
import CurrencySwitcher from '@riosst100/pwa-marketplace/src/components/CurrencySwitcher';
import BecomeSellerLink from '@riosst100/pwa-marketplace/src/components/BecomeSellerLink/becomeSellerLink';
import MegaMenu from '@magento/venia-ui/lib/components/MegaMenu';
import PageLoadingIndicator from '@magento/venia-ui/lib/components/PageLoadingIndicator';
import { useIntl } from 'react-intl';
import cn from 'classnames';
// const SearchBar = React.lazy(() => import('@magento/venia-ui/lib/components/SearchBar'));
const SearchBar = React.lazy(() => import('@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/components/SearchBar'));
import { SearchNormal } from 'iconsax-react';

import { useLogo } from '@riosst100/pwa-marketplace/src/talons/Header/useLogo';
import Image from '@magento/venia-ui/lib/components/Image';

const CheckoutHeader = props => {
    const {
        handleSearchTriggerClick,
        hasBeenOffline,
        isOnline,
        isSearchOpen,
        searchRef,
        searchTriggerRef
    } = useHeader();

    const talonPropsLogo = useLogo();
    const { data } = talonPropsLogo
    const baseUrl = data?.storeConfig?.base_media_url;
    const imageSource = data?.storeConfig?.header_logo_src;
    const LogoImageSource = `${baseUrl}/logo/${imageSource}`;
    const IMAGE_HEIGHT = data?.storeConfig?.logo_width || 28;
    const IMAGE_WIDTH = data?.storeConfig?.logo_height || 190;
    const IMAGE_ALT = data?.storeConfig?.logo_alt || 'TCG Collective';

    const classes = useStyle(defaultClasses, props.classes);
    const rootClass = isSearchOpen ? classes.open : classes.closed;

    const searchBarFallback = (
        <div className={classes.searchFallback} ref={searchRef}>
            <div className={classes.input}>
                <div className={classes.loader}>
                    <div className={classes.loaderBefore} />
                    <div className={classes.loaderAfter} />
                </div>
            </div>
        </div>
    );
    // const searchBar = isSearchOpen ? (
    //     <Suspense fallback={searchBarFallback}>
    //         <Route>
    //             <SearchBar isOpen={true} ref={searchRef} />
    //         </Route>
    //     </Suspense>
    // ) : null;

    const { formatMessage } = useIntl();
    const title = formatMessage({ id: 'logo.title', defaultMessage: 'Venia' });

    return (
        <Fragment>
            <PageLoadingIndicator absolute />
            <header className={cn(rootClass, '!flex flex-col !px-0 border-gray-100 ')} data-cy="Header-root">
                <div className={cn('middle-header border-b border-gray-100')}>
                    <div className={cn('w-full max-w-[1000px] px-[0px] py-[15px] mx-[auto] flex justify-between items-center')}>
                        <div className='flex items-center'>
                            <NavTrigger />

                            <Link
                                aria-label={title}
                                to={resourceUrl('/')}
                                className={''}
                                data-cy="Header-logoContainer"
                            >
                                {imageSource ? (
                                    <Image
                                        alt={IMAGE_ALT}
                                        height={IMAGE_HEIGHT}
                                        src={LogoImageSource}
                                        width={IMAGE_WIDTH}
                                        classes={{
                                            container: 'logo-wrapper relative'
                                        }}
                                    />
                                ) : (
                                    <>
                                        <div className='text-[14px]'><b>TCG Collective</b></div>
                                        <small>Bringing Collectors Together</small>
                                    </>
                                )}

                            </Link>
                        </div>
                        <div className='flex flex-auto max-w-[700px]'>
                            <div className='flex w-full' style={{
                                    "alignItems": "center",
                                    "fontSize": "14px",
                                    "fontWeight": "500",
                                    "justifyContent": "center"
                            }}>
                                <Icon src={Lock} attrs={{ width: 16 }} /><span style={{
                                    "paddingLeft": "5px"
                                }}>Secure Checkout</span>
                            </div>
                        </div>
                        <div className={cn(classes.secondaryActions, 'lg_gap-x-5 pl-5')}>
                            {/* <SearchTrigger
                                onClick={handleSearchTriggerClick}
                                ref={searchTriggerRef}
                            /> */}
                            <CartTrigger />
                        </div>
                    </div>
                </div>
            </header>
            <OnlineIndicator
                hasBeenOffline={hasBeenOffline}
                isOnline={isOnline}
            />
            <style jsx="true">
                {`
                    .logo-wrapper>img:first-child {
                        height: ${IMAGE_HEIGHT}px;
                    }
                `}
            </style>
        </Fragment>
    );
};

CheckoutHeader.propTypes = {
    classes: shape({
        closed: string,
        logo: string,
        open: string,
        primaryActions: string,
        secondaryActions: string,
        toolbar: string,
        switchers: string,
        switchersContainer: string
    })
};

export default CheckoutHeader;
