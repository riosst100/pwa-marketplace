import { gql } from '@apollo/client';

import { CategoryFragment, ProductsFragment } from './categoryFragments.gql';

export const GET_PRODUCTS = gql`
    query GetProductsBySellerId(
        $sellerId: Int!,
        $filter: ProductAttributeFilterInput,
        $pageSize: Int,
        $currentPage: Int,
        $sort: ProductAttributeSortInput
    ) {
        productsBySellerId(
            seller_id: $sellerId,
            pageSize: $pageSize,
            currentPage: $currentPage,
            filter: $filter,
            sort: $sort
        ) {
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            ...ProductsFragment
        }
    }
    ${ProductsFragment}
`;

export const GET_FILTER_INPUTS = gql`
    query GetFilterInputsForCategory {
        __type(name: "ProductAttributeFilterInput") {
            inputFields {
                name
                type {
                    name
                }
            }
        }
    }
`;

export const GET_CATEGORIES_DATA = gql`
    query GetCategories (
        $filters: CategoryFilterInput,
        $pageSize: Int,
        $currentPage: Int
    ) {
        categories(
            filters: $filters,
            pageSize: $pageSize,
            currentPage: $currentPage
        ) {
            total_count
            items {
                uid
            }
        }
    }
`;

export const RESOLVE_URL = gql`
    query ResolveURL($url: String!, $product_preview_token: String) {
        route(url: $url, product_preview_token: $product_preview_token) {
            relative_url
            redirect_code
            type
            ... on CmsPage {
                identifier
            }
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            ... on ProductInterface {
                uid
                __typename
            }
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            ... on CategoryInterface {
                uid
            }
        }
    }
`;

export default {
    getProductsQuery: GET_PRODUCTS,
    getFilterInputsQuery: GET_FILTER_INPUTS,
    getCategoryDataQuery: GET_CATEGORIES_DATA,
    resolveUrlQuery: RESOLVE_URL
};
