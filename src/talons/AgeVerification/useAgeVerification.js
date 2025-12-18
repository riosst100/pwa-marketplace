import { useQuery, useLazyQuery } from '@apollo/client';
import { useMemo, useEffect } from 'react';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './ageVerification.gql';

export const useAgeVerification = props => {
    const { pageType, product } = props;
    
    const operations = mergeOperations(DEFAULT_OPERATIONS, null);
    const { getAgeVerificationConfigQuery, getMenuTopFiltersAttributesConfigDataQuery } = operations;

    const { location } = globalThis;

    const { data: storeConfigData } = useQuery(getMenuTopFiltersAttributesConfigDataQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const activeMenuTopFilterAttribute = useMemo(() => {
        if (storeConfigData) {

            const menuTopFiltersAttributes = storeConfigData.storeConfig.marketplace_menu_topfilters_attributes;
            if (!menuTopFiltersAttributes) {
                return null;
            }

            const menuTopFiltersAttributeCodes = Object.values(JSON.parse(menuTopFiltersAttributes)).map(
                item => item.attribute_code
            );

            if (!menuTopFiltersAttributeCodes) {
                return null;
            }

            let result = null;
            
            if (pageType == "CATEGORY") {
                const params = new URLSearchParams(location.search);
                if (!params.size) {
                    return null;
                }
                
                params.forEach((value, param) => {
                    const attrCode = param.replace("[filter]", "");
                    if (attrCode && menuTopFiltersAttributeCodes.includes(attrCode)) {
                        const attrOptionLabel = value.split(",")[0];
                        result = {
                            attributeCode: attrCode,
                            attributeOption: attrOptionLabel
                        };
                        
                        return true;
                    }
                });
            }

            if (pageType == "PRODUCT" && product) {
                product.custom_attributes.map(attr => {
                    const attrCode = attr.attribute_metadata?.code;
                    if (attrCode && menuTopFiltersAttributeCodes.includes(attrCode)) {
                        let label = null;

                        // SELECT / MULTISELECT
                        if (attr?.selected_attribute_options?.attribute_option?.length) {
                            label = attr.selected_attribute_options.attribute_option.length ?
                            attr.selected_attribute_options.attribute_option.map(o => o.label)[0] : '';
                            // label = labelArr?.attributeOption?.[0] ?? "";
                        }

                        // TEXT / NUMBER
                        if (attr?.entered_attribute_value?.value) {
                            label = attr.entered_attribute_value.value;
                        }

                        result = {
                            attributeCode: attrCode,
                            attributeOption: label
                        };
                    }
                });
            }

            return result;
        }
    }, [storeConfigData, pageType, product]);
    
    const [getAgeVerificationConfig, { data, error, loading }] = useLazyQuery(
        getAgeVerificationConfigQuery,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first'
        }
    );

    
   useEffect(() => {
        if (activeMenuTopFilterAttribute) {
            getAgeVerificationConfig({
                variables: {
                    attributeCode: activeMenuTopFilterAttribute.attributeCode,
                    attributeOption: activeMenuTopFilterAttribute.attributeOption
                }
            });
        }
    }, [activeMenuTopFilterAttribute, getAgeVerificationConfig]);

    const ageVerificationConfig = useMemo(() => {
        if (!data) {
            return null;
        }
        
        const getAgeVerificationConfig = data.getAgeVerificationConfig;
        if (!getAgeVerificationConfig) {
            return null;
        }

        return getAgeVerificationConfig;
    }, [data]);

    return {
        error,
        loading,
        ageVerificationConfig
    };
};
