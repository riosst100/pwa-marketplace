import { gql } from '@apollo/client';
export const GET_STORE_CONFIG_DATA = gql`
    query GetStoreConfigForMegaMenu {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            category_url_suffix
        }
    }
`;

export const GET_MEGA_MENU = gql`
    query getSellerMegaMenu($sellerUrl: String!) {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        sellerCategories(sellerUrl: $sellerUrl) {
            uid
            name
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            children {
                uid
                include_in_menu
                name
                position
                url_path
                default_top_filter {
                    attribute_code
                    label
                    value
                }
                # eslint-disable-next-line @graphql-eslint/require-id-when-available
                children {
                    uid
                    include_in_menu
                    name
                    position
                    url_path
                    default_top_filter {
                        attribute_code
                        label
                        value
                    }
                    custom_submenu {
                        name
                        attribute {
                            code
                            value
                        }
                        path
                    }
                    shop_by {
                        name
                        items {
                            name
                            url_path
                        }
                    }
                    # eslint-disable-next-line @graphql-eslint/require-id-when-available
                    children {
                        uid
                        include_in_menu
                        name
                        position
                        url_path
                        custom_submenu {
                            name
                            attribute {
                                code
                                value
                            }
                            path
                        }
                        shop_by {
                            name
                            items {
                                name
                                url_path
                            }
                        }
                    }
                }
            }
            __typename
        }
    }
`;

export default {
    getSellerMegaMenuQuery: GET_MEGA_MENU,
    getStoreConfigQuery: GET_STORE_CONFIG_DATA
};
