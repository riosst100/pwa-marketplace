import { gql } from '@apollo/client';

// Align fields closely with core to ensure compatibility, while keeping extra image fields safe to use.
const GET_PRODUCT_THUMBNAILS = gql`
    query getProductThumbnails($urlKeys: [String!]!) {
        products(filter: { url_key: { in: $urlKeys } }) {
            items {
                uid
                sku
                name
                url_key
                thumbnail {
                    label
                    url
                }
                small_image { url }
                media_gallery { url label }
                ... on ConfigurableProduct {
                    variants {
                        product {
                            sku
                            uid
                            name
                            thumbnail { label url }
                            small_image { url }
                        }
                    }
                }
            }
        }
    }
`;

const GET_CONFIGURABLE_THUMBNAIL_SOURCE = gql`
    query getConfigurableThumbnailSource {
        storeConfig {
            store_code
            configurable_thumbnail_source
        }
    }
`;

export default {
    getProductThumbnailsQuery: GET_PRODUCT_THUMBNAILS,
    getConfigurableThumbnailSource: GET_CONFIGURABLE_THUMBNAIL_SOURCE
};
