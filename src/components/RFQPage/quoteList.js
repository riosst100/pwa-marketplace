import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { AlertCircle as AlertCircleIcon } from 'react-feather';
import { shape, string } from 'prop-types';
import { Form } from 'informed';

import { useToasts } from '@magento/peregrine/lib/Toasts';
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
import { useRFQ } from '@riosst100/pwa-marketplace/src/talons/RFQ/useRFQ';

const errorIcon = (
    <Icon
        src={AlertCircleIcon}
        attrs={{
            width: 18
        }}
    />
);
// no search icon needed

const QuoteList = props => {
    const { loadRfqList, rfqListState } = useRFQ();
    const { data: rfqListData, loading: rfqLoading, error: rfqError } = rfqListState || {};
    const [searchText, setSearchText] = useState('');
    const [submittedSearch, setSubmittedSearch] = useState('');
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const PAGE_TITLE = formatMessage({
        id: 'Quotes.pageTitleText',
        defaultMessage: 'My Offers'
    });
    const SEARCH_PLACE_HOLDER = formatMessage({
        id: 'Quotes.search',
        defaultMessage: 'Search by Quote Number'
    });

    // derive items
    const rfqItems = rfqListData?.quickrfqList?.items || [];
    const totalCount = rfqListData?.quickrfqList?.total_count || 0;
    const pageInfo = rfqListData?.quickrfqList?.page_info || null;

    const classes = useStyle(defaultClasses, props.classes);

    const orderRows = useMemo(() => {
        return rfqItems.map(item => {
            const key = `${item.quickrfq_id}-${item.update_date || item.create_date}`;
            return <OrderRow key={key} rfq={item} />;
        });
    }, [rfqItems]);

    const pageContents = useMemo(() => {
        if (rfqLoading && !rfqItems.length) {
            return <LoadingIndicator />;
        } else if (!rfqLoading && submittedSearch && !rfqItems.length) {
            return (
                <h3 className={classes.emptyHistoryMessage}>
                    <FormattedMessage
                        id={'quotesPage.invalidQuoteNumber'}
                        defaultMessage={`Quote "${submittedSearch}" was not found.`}
                        values={{
                            number: submittedSearch
                        }}
                    />
                </h3>
            );
        } else if (!rfqLoading && !rfqItems.length) {
            return (
                <h3 className={classes.emptyHistoryMessage}>
                    <FormattedMessage
                        id={'quotesPage.emptyDataMessage'}
                        defaultMessage={"You don't have any quotes yet."}
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
        rfqLoading,
        orderRows,
        rfqItems.length,
        submittedSearch
    ]);

    const handleReset = useCallback(() => {
        setSearchText('');
        setSubmittedSearch('');
        loadRfqList({
            variables: {
                currentPage: 1,
                pageSize: 20,
                filters: {}
            }
        });
    }, [loadRfqList]);

    const resetButtonElement = searchText ? (
        <ResetButton onReset={handleReset} />
    ) : null;

    const submitIcon = (
        <SearchNormal size="18" color="#1b1b1b" className='mt-[4px]' />
    );

    const pageInfoLabel = pageInfo ? (
        (() => {
            const currentPage = pageInfo.current_page || 1;
            const pageSize = pageInfo.page_size || 20;
            const total = totalCount || 0;
            const current = Math.min(currentPage * pageSize, total);
            return (
                <FormattedMessage
                    defaultMessage={'Showing {current} of {total}'}
                    id={'rfqList.pageInfo'}
                    values={{ current, total }}
                />
            );
        })()
    ) : null;

    const loadMoreButton = pageInfo && pageInfo.current_page < Math.ceil((totalCount || 0) / (pageInfo.page_size || 20)) ? (
        <Button
            classes={{ root_lowPriority: classes.loadMoreButton }}
            disabled={rfqLoading}
            onClick={() =>
                loadRfqList({
                    variables: {
                        currentPage: (pageInfo.current_page || 1) + 1,
                        pageSize: pageInfo.page_size || 20,
                        filters: submittedSearch
                            ? { quickrfq_id: { eq: submittedSearch } }
                            : {}
                    }
                })
            }
            priority="low"
        >
            <FormattedMessage
                id={'orderHistoryPage.loadMore'}
                defaultMessage={'Load More'}
            />
        </Button>
    ) : null;

    useEffect(() => {
        // initial load
        loadRfqList({
            variables: { currentPage: 1, pageSize: 20, filters: {} }
        });
    }, [loadRfqList]);

    useEffect(() => {
        if (rfqError?.message) {
            addToast({
                type: 'error',
                icon: errorIcon,
                message: rfqError.message,
                dismissable: true,
                timeout: 10000
            });
        }
    }, [addToast, rfqError]);

    const handleSubmit = useCallback(({ values }) => {
        const search = values?.search?.trim() || '';
        setSearchText(search);
        setSubmittedSearch(search);
        const filters = search ? { quickrfq_id: { eq: search } } : {};
        loadRfqList({ variables: { currentPage: 1, pageSize: 20, filters } });
    }, [loadRfqList]);

    return (
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
                                disabled={rfqLoading}
                                priority={'high'}
                                type="button"
                                aria-label="submit"
                                onPress={(_evt, formApi) => formApi.submitForm()}
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
