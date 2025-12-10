import { useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useQuery, useLazyQuery } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './helpCenter.gql';
import { usePagination } from '@magento/peregrine/lib/hooks/usePagination';

export const useHelpCenter = (props) => {
    const { formatMessage } = useIntl();

    const { searchQuery, pageSize = 10 } = props;

    const [paginationValues, paginationApi] = usePagination();
    const { currentPage = 1, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const {
        faqCategoriesQuery,
        faqQuestionsQuery,
        faqTagsQuery
    } = operations;

    const {
        data: categoriesData,
        loading: categoriesLoading,
        error: categoriesError
    } = useQuery(faqCategoriesQuery, {
        fetchPolicy: 'cache-and-network'
    });

    // const {
    //     data: questionsData,
    //     loading: questionsLoading,
    //     error: questionsError
    // } = useQuery(faqQuestionsQuery, {
    //     fetchPolicy: 'cache-and-network',
    //     nextFetchPolicy: 'cache-first',
    //     variables: {
    //         search: searchQuery,
    //         pageSize: 20,
    //         currentPage: 1
    //     },
    // });

    console.log('searchQuery',searchQuery)

    const [runQuery, {
        data: questionsData,
        loading: questionsLoading,
        error: questionsError
    }] = useLazyQuery(faqQuestionsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    
    useEffect(() => {
        runQuery({
            variables: {
                pageSize: pageSize,
                currentPage: currentPage,
                search: searchQuery
            }
        });
    }, [
        runQuery,
        pageSize,
        currentPage,
        searchQuery
    ]);

    const {
        data: tagsData,
        loading: tagsLoading,
        error: tagsError
    } = useQuery(faqTagsQuery, {
        fetchPolicy: 'cache-and-network'
    });

    const loading = categoriesLoading || questionsLoading || tagsLoading;
    const error = categoriesError || questionsError || tagsError || null;

    const data = useMemo(() => ({
        categories: categoriesData?.faqCategories || [],
        questions: questionsData?.faqQuestions.items || [],
        tags: tagsData?.faqTags || []
    }), [categoriesData, questionsData, tagsData]);

    const totalPagesFromData = questionsData
        ? questionsData.faqQuestions?.page_info?.total_pages
        : null;

    useEffect(() => {
        setTotalPages(totalPagesFromData);
        return () => {
            setTotalPages(null);
        };
    }, [setTotalPages, totalPagesFromData]);

    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    console.log('pageControl',pageControl)

    return {
        loading,
        error,
        data,
        totalPagesFromData,
        pageControl,
        formatMessage
    };
};

export default useHelpCenter;