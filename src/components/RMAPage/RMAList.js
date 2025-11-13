import React, { useMemo, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import {
    AlertCircle as AlertCircleIcon,
} from 'react-feather';
import { shape, string } from 'prop-types';
import { Form } from 'informed';

import { useToasts } from '@magento/peregrine/lib/Toasts';
// import OrderHistoryContextProvider from '@magento/peregrine/lib/talons/OrderHistoryPage/orderHistoryContext';
import { useRmaPage } from '@riosst100/pwa-marketplace/src/talons/RMAPage/useRmaPage';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import Pagination from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/components/Pagination';
import defaultClasses from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/components/OrderHistoryPage/orderHistoryPage.module.css';
import RmaRow from './orderRow';
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
    const talonProps = useRmaPage();
    const {
        errorMessage,
        loadMoreRmas,
        handleReset,
        handleSubmit,
        isBackgroundLoading,
        isLoadingWithoutData,
        rmas,
        pageInfo,
        searchText,
        pageControl,
        rmaDetailData,
        rmaDetailLoading,
        rmaDetailError
    } = talonProps;
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const PAGE_TITLE = formatMessage({
        id: 'RMA.pageTitleText',
        defaultMessage: 'My Return Request'
    });
    const SEARCH_PLACE_HOLDER = formatMessage({
        id: 'RMA.search',
        defaultMessage: 'Search by Order Number'
    });

    const history = useHistory();

    const classes = useStyle(defaultClasses, props.classes);

    const rmaRows = useMemo(() => {
        return rmas.map(rma => {
            return <RmaRow key={rma.rma_id} rma={rma} />;
        });
    }, [rmas]);

    const pageContents = useMemo(() => {
        if (isLoadingWithoutData) {
            return <LoadingIndicator />;
        } else if (!isBackgroundLoading && searchText && !rmas.length) {
            return (
                <h3 className={classes.emptyHistoryMessage}>
                    <FormattedMessage
                        id={'rmaPage.invalidOrderNumber'}
                        defaultMessage={`RMA for Order "${searchText}" was not found.`}
                        values={{
                            number: searchText
                        }}
                    />
                </h3>
            );
        } else if (!isBackgroundLoading && !rmas.length) {
            return (
                <h3 className={classes.emptyHistoryMessage}>
                    <FormattedMessage
                        id={'rmaPage.emptyDataMessage'}
                        defaultMessage={"You don't have any RMA requests yet."}
                    />
                </h3>
            );
        } else {
            return (
                <ul
                    className={classes.orderHistoryTable}
                    data-cy="RMAPage-rmaTable"
                >
                    {rmaRows}
                </ul>
            );
        }
    }, [
        classes.emptyHistoryMessage,
        classes.orderHistoryTable,
        isBackgroundLoading,
        isLoadingWithoutData,
        rmaRows,
        rmas.length,
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

    const loadMoreButton = loadMoreRmas ? (
        <Button
            classes={{ root_lowPriority: classes.loadMoreButton }}
            disabled={isBackgroundLoading || isLoadingWithoutData}
            onClick={loadMoreRmas}
            priority="low"
        >
            <FormattedMessage
                id={'rmaPage.loadMore'}
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
                {pageContents}
                <div className="mt-4">
                    {pageControl?.totalPages > 1 ? (
                        <Pagination pageControl={pageControl} />
                    ) : null}
                </div>
                {loadMoreButton}
			</div>
		);
}

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
