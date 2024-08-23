import React, { useMemo, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import {
    AlertCircle as AlertCircleIcon,
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
import { useHistory } from "react-router-dom";

const errorIcon = (
    <Icon
        src={AlertCircleIcon}
        attrs={{
            width: 18
        }}
    />
);

const RMAList = props => {
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
        id: 'RMA.pageTitleText',
        defaultMessage: 'Quotes'
    });
    const SEARCH_PLACE_HOLDER = formatMessage({
        id: 'RMA.search',
        defaultMessage: 'Search by Order Number'
    });

    const history = useHistory();

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

    const gotoSelectRMA = () => {
        history.push('/return/select')
    }

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

                <div className={classes.filterRow}>

                    <Form className="flex gap-x-1 border border-gray-100 rounded-full px-[15px] w-[calc(100%-120px)] max-w-[450px]" onSubmit={handleSubmit}>
                        <TextInput
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
                <div className='flex justify-end w-full'>
                    <Button
                        priority='high'
                        classes={{
                            content: "flex justify-center gap-x-2.5 items-center text-[14px] font-medium capitalize"
                        }}
                        className={cn(
                            "bg-blue-600 px-6 py-2 rounded-md text-white border ",
                            "border-blue-600 hover_bg-blue-700 hover_border-blue-700 focus-visible_outline-none"
                        )}
                        onClick={gotoSelectRMA}
                    >
                        <span className='flex gap-x-3 justify-center'>
                            {
                                formatMessage({
                                    id: 'RMA.newReturn',
                                    defaultMessage: 'New Return'
                                })
                            }
                        </span>
                    </Button>
                </div>
                {pageContents}
                {loadMoreButton}
            </div>
        </OrderHistoryContextProvider >
    );
};

export default RMAList;

RMAList.propTypes = {
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
