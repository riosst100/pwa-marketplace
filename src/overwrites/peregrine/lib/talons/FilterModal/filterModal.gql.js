import { gql } from '@apollo/client';

export const GET_FILTER_INPUTS = gql`
    query GetFilterInputsForModal {
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

export const GET_SUB_FILTERS = gql`
    query GetSubFilters {
        subFilters {
            attribute_code
            options {
                option_label
                sub_option_labels
            }
        }
    }
`;

export default {
    getFilterInputsQuery: GET_FILTER_INPUTS,
    getSubFiltersQuery: GET_SUB_FILTERS
};
