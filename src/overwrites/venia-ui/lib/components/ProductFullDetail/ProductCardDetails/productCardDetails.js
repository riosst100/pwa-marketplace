import React, { useMemo } from 'react';
import { array, shape, string } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './productCardDetails.module.css';
import cn from 'classnames';

export const IS_VISIBLE_ON_FRONT = 'PRODUCT_DETAILS_PAGE';

const ProductCardDetails = props => {
    const { customAttributes, showLabels } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const getAttributeValue = (currentAttribute, key, useSuffix = false) => {
        if (!currentAttribute) return "";

        if (currentAttribute.selected_attribute_options?.attribute_option?.length) {
            return currentAttribute.selected_attribute_options.attribute_option
                .map(opt => opt.label)
                .join(", ");
        }
        return currentAttribute.entered_attribute_value?.value || "";
    };

    const list = useMemo(
        () =>
            customAttributes.reduce((previousAttribute, currentAttribute) => {
                const attrCode = currentAttribute.attribute_metadata?.code;
                const usedInComponents =
                    currentAttribute.attribute_metadata?.used_in_components ||
                    [];
                // Visible on front attributes only
                if (usedInComponents.includes(IS_VISIBLE_ON_FRONT)) {
                    const attributeContent = (
                        <p key={currentAttribute.attribute_metadata.uid}><strong>{currentAttribute.attribute_metadata.label}:</strong> {getAttributeValue(currentAttribute)}</p>
                    );

                    previousAttribute.push(attributeContent);
                }

                return previousAttribute;
            }, []),
        [classes, customAttributes, showLabels]
    );

    if (list.length === 0) {
        return null;
    }

    return list;
};

ProductCardDetails.propTypes = {
    classes: shape({
        root: string,
        title: string,
        list: string,
        listItem: string
    }),
    customAttributes: array.isRequired
};

export default ProductCardDetails;
