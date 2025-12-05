import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './helpCenter.gql';

export const useHelpCenter = (props = {}) => {
    const { formatMessage } = useIntl();

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

    const {
        data: questionsData,
        loading: questionsLoading,
        error: questionsError
    } = useQuery(faqQuestionsQuery, {
        fetchPolicy: 'cache-and-network'
    });

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
        questions: questionsData?.faqQuestions || [],
        tags: tagsData?.faqTags || []
    }), [categoriesData, questionsData, tagsData]);

    return {
        loading,
        error,
        data,
        formatMessage
    };
};

export default useHelpCenter;