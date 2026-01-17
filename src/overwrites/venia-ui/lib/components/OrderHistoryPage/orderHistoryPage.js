import React, { useMemo, useEffect, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import {
    Search as SearchIcon,
    AlertCircle as AlertCircleIcon,
    ArrowRight as SubmitIcon
} from 'react-feather';
import { shape, string } from 'prop-types';
import { Form } from 'informed';

import { useToasts } from '@magento/peregrine/lib/Toasts';
import OrderHistoryContextProvider from '@magento/peregrine/lib/talons/OrderHistoryPage/orderHistoryContext';
import { useOrderHistoryPage } from '@riosst100/pwa-marketplace/src/talons/OrderHistoryPage/useOrderHistoryPage';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import TextInput from '@magento/venia-ui/lib/components/TextInput';

import defaultClasses from './orderHistoryPage.module.css';
import OrderRow from './orderRow';
import ResetButton from './resetButton';
import { SearchNormal } from 'iconsax-react';
import cn from 'classnames';
import Pagination from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/components/Pagination';
import { ReviewModal } from './Reviews'

const errorIcon = (
    <Icon
        src={AlertCircleIcon}
        attrs={{
            width: 18
        }}
    />
);
const searchIcon = <Icon src={SearchIcon} size={24} />;

const OrderHistoryPage = props => {
    const talonProps = useOrderHistoryPage();
    const {
        errorMessage,
        loadMoreOrders,
        handleReset,
        handleSubmit,
        isBackgroundLoading,
        isLoadingWithoutData,
        orders,
        pageInfo,
        searchText,
        pageControl,
        setStatusFilter,
        statusFilter,
        tabCounts
    } = talonProps;
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const [reviewOrder, setReviewOrder] = useState(null);

    const PAGE_TITLE = formatMessage({
        id: 'orderHistoryPage.pageTitleText',
        defaultMessage: 'My Orders'
    });
    const SEARCH_PLACE_HOLDER = formatMessage({
        id: 'orderHistoryPage.search',
        defaultMessage: 'Search by Order Number'
    });

    const ordersCountMessage = formatMessage(
        {
            id: 'orderHistoryPage.ordersCount',
            defaultMessage: 'You have {count} orders in your history.'
        },
        { count: orders.length }
    );

    const classes = useStyle(defaultClasses, props.classes);

    const orderRows = useMemo(() => {
        return orders.map(order => {
            return <OrderRow setReviewOrder={setReviewOrder} key={order.id} order={order} />;
        });
    }, [orders]);

    const pageContents = useMemo(() => {
        // Block list rendering while any background load/aggregation is happening
        // to avoid flicker and partial lists after navigation.
        if (isLoadingWithoutData || isBackgroundLoading) {
            return <LoadingIndicator />;
        } else if (!isBackgroundLoading && searchText && !orders.length) {
            return (
                <h3 className={classes.emptyHistoryMessage}>
                    <FormattedMessage
                        id={'orderHistoryPage.invalidOrderNumber'}
                        defaultMessage={`Order "${searchText}" was not found.`}
                        values={{
                            number: searchText
                        }}
                    />
                </h3>
            );
        } else if (!isBackgroundLoading && !orders.length) {
            return (
                <h3 className={classes.emptyHistoryMessage}>
                    <FormattedMessage
                        id={'orderHistoryPage.emptyDataMessage'}
                        defaultMessage={"You don't have any orders yet."}
                    />
                </h3>
            );
        } else {
            return (
                <ul
                    className={classes.orderHistoryTable}
                    data-cy="OrderHistoryPage-orderHistoryTable"
                >
                    {orderRows}
                </ul>
            );
        }
    }, [
        classes.emptyHistoryMessage,
        classes.orderHistoryTable,
        isBackgroundLoading,
        isLoadingWithoutData,
        orderRows,
        orders.length,
        searchText
    ]);

    const resetButtonElement = searchText ? (
        <ResetButton onReset={handleReset} />
    ) : null;

    const submitIcon = (
        <SearchNormal size="18" color="#1b1b1b" className='mt-[4px]' />
    );

    const pageInfoLabel = pageInfo ? (
        <FormattedMessage
            defaultMessage={'Showing {current} of {total}'}
            id={'orderHistoryPage.pageInfo'}
            values={pageInfo}
        />
    ) : null;

    const loadMoreButton = loadMoreOrders ? (
        <Button
            classes={{ root_lowPriority: classes.loadMoreButton }}
            disabled={isBackgroundLoading || isLoadingWithoutData}
            onClick={loadMoreOrders}
            priority="low"
        >
            <FormattedMessage
                id={'orderHistoryPage.loadMore'}
                defaultMessage={'Load More'}
            />
        </Button>
    ) : null;

    useEffect(() => {
        if (errorMessage) {
            addToast({
                type: 'error',
                icon: errorIcon,
                message: errorMessage,
                dismissable: true,
                timeout: 10000
            });
        }
    }, [addToast, errorMessage]);

    return (
        <OrderHistoryContextProvider>
            <ReviewModal
                // open={open}
                setReviewOrder={setReviewOrder}
                reviewOrder={reviewOrder}
                // defaultNickname={defaultNickname}
                // ratingsMetadata={ratingsMetadataData?.productReviewRatingsMetadata?.items || []}
                // loadingRatingsMetadata={loadingRatingsMetadata}
                // onSubmit={async (formValues) => {
                //     setSubmitting(true);
                //     const input = {
                //         nickname: formValues.nickname,
                //         summary: formValues.summary,
                //         text: formValues.review,
                //         sku: product?.sku,
                //         ratings: formValues.ratings
                //     };
                //     const result = await handleSubmitReview(input);
                //     setSubmitting(false);
                //     if (result.success) setOpen(false);
                // }}
                // submitting={submitting}
            />
            <div className={classes.root}>
                <StoreTitle>{PAGE_TITLE}</StoreTitle>
                <div aria-live="polite" className="text-xl font-medium text-left">
                    {PAGE_TITLE}
                </div>
                {/* <div>
                    <div aria-live="polite" aria-label={ordersCountMessage} />
                </div> */}

                <div className={classes.filterRow}>
                    <Form className={cn(classes.search, 'border border-gray-100 rounded-full mt-5 mb-5 px-[15px]')} onSubmit={handleSubmit}>
                        <TextInput
                            // after={resetButtonElement}
                            // before={searchIcon}
                            field="search"
                            id={classes.search}
                            placeholder={SEARCH_PLACE_HOLDER}
                            classes={{
                                input: 'focus-visible_outline-none border-none w-full'
                            }}
                        />
                        {searchText ? (
                            <>
                                {resetButtonElement}
                            </>
                        ) : (
                            <Button
                                className="focus-visible_outline-none"
                                disabled={
                                    isBackgroundLoading || isLoadingWithoutData
                                }
                                priority={'high'}
                                type="submit"
                                aria-label="submit"
                            >
                                {submitIcon}
                            </Button>
                        )}
                    </Form>
                    <span className={classes.pageInfo}>{pageInfoLabel}</span>
                </div>
                {/* Status Tabs - placed below search bar */}
                <div className="mb-0">
                    <nav aria-label="Order status filters" className={classes.tabsContainer}>
                        {[
                            { label: 'All', value: 'ALL' },
                            { label: 'Processing', value: 'Processing' },
                            { label: 'Shipped', value: 'Shipped' },
                            { label: 'Complete', value: 'Complete' },
                            { label: 'Canceled', value: 'Canceled' }
                        ].map(tab => (
                            <button
                                key={tab.value}
                                onClick={() => {
                                    if (tab.value === 'ALL') {
                                        // All tab resets filters and shows full dataset
                                        handleReset();
                                    } else {
                                        setStatusFilter(tab.value);
                                        pageControl?.setPage?.(1);
                                    }
                                }}
                                className={cn(classes.tab, statusFilter === tab.value && classes.tabActive)}
                                disabled={isBackgroundLoading}
                                type="button"
                            >
                                {tab.label}
                                <span className={cn('ml-2 text-xs rounded-full px-2 py-0.5', statusFilter === tab.value ? classes.badgeActive : classes.badge)}>
                                    {(
                                        tabCounts && typeof tabCounts[tab.value] !== 'undefined'
                                            ? tabCounts[tab.value]
                                            : (tab.value === 'ALL'
                                                ? (pageInfo && pageInfo.total ? pageInfo.total : 0)
                                                : 0)
                                    )}
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>
                {pageContents}
                <div className="mt-4">
                    <Pagination pageControl={pageControl} />
                </div>
                {loadMoreButton}
            </div>
        </OrderHistoryContextProvider >
    );
};

export default OrderHistoryPage;

OrderHistoryPage.propTypes = {
    classes: shape({
        root: string,
        heading: string,
        emptyHistoryMessage: string,
        orderHistoryTable: string,
        search: string,
        searchButton: string,
        submitIcon: string,
        loadMoreButton: string
    })
};
