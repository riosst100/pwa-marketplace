import React, { useMemo, useEffect } from 'react';
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
import { useOrderHistoryPage } from '@magento/peregrine/lib/talons/OrderHistoryPage/useOrderHistoryPage';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import TextInput from '@magento/venia-ui/lib/components/TextInput';

import defaultClasses from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/components/OrderHistoryPage/orderHistoryPage.module.css';
import OrderRow from './orderRow';
import ResetButton from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/components/OrderHistoryPage/resetButton';
import { SearchNormal } from 'iconsax-react';
import cn from 'classnames';

const errorIcon = (
    <Icon
        src={AlertCircleIcon}
        attrs={{
            width: 18
        }}
    />
);
const searchIcon = <Icon src={SearchIcon} size={24} />;

const QuoteList = props => {
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
        searchText
    } = talonProps;
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const PAGE_TITLE = formatMessage({
        id: 'Quotes.pageTitleText',
        defaultMessage: 'Quotes'
    });
    const SEARCH_PLACE_HOLDER = formatMessage({
        id: 'Quotes.search',
        defaultMessage: 'Search by Quote Number'
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
            return <OrderRow key={order.id} order={order} />;
        });
    }, [orders]);

    const pageContents = useMemo(() => {
        if (isLoadingWithoutData) {
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
            <div className="grid gap-y-md">
                <StoreTitle>{PAGE_TITLE}</StoreTitle>
                <div aria-live="polite" className="text-xl font-medium text-left">
                    {PAGE_TITLE}
                </div>
                {/* <div>
                    <div aria-live="polite" aria-label={ordersCountMessage} />
                </div> */}

                <div className={classes.filterRow}>
                    <Form className="flex gap-x-1 border border-gray-100 rounded-full px-[15px] w-[calc(100%-120px)] max-w-[450px]" onSubmit={handleSubmit}>
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
                {pageContents}
                {loadMoreButton}
            </div>
        </OrderHistoryContextProvider >
    );
};

export default QuoteList;

QuoteList.propTypes = {
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
