import React from 'react';
import { bool, func, number, oneOfType, shape, string } from 'prop-types';
import { useIntl } from 'react-intl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './tile.module.css';
import { useTile } from '@magento/peregrine/lib/talons/ProductOptions/useTile';
import Image from '@magento/venia-ui/lib/components/Image';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

const getClassName = (
    name,
    isSelected,
    hasFocus,
    isOptionOutOfStock,
    isEverythingOutOfStock
) =>
    `${name}${isSelected ? '_selected' : ''}${hasFocus ? '_focused' : ''}${
        isEverythingOutOfStock || isOptionOutOfStock ? '_outOfStock' : ''
    }`;

const Tile = props => {
    const {
        hasFocus,
        isSelected,
        item: { label, value_index },
        onClick,
        isEverythingOutOfStock,
        isOptionOutOfStock,
        setHoveredMedia,
        itemVariant
    } = props;

    const talonProps = useTile({
        onClick,
        itemVariant,
        setHoveredMedia,
        value_index
    });

    const { handleMouseLeave, handleMouseEnter, handleClick, variantImg } = talonProps;
    const classes = useStyle(defaultClasses, props.classes);
    const className =
        classes[
            getClassName(
                'root',
                isSelected,
                hasFocus,
                isOptionOutOfStock,
                isEverythingOutOfStock
            )
        ];
    const { formatMessage } = useIntl();
    const ariaLabelView = formatMessage(
        {
            id: 'ProductOptions.productSize',
            defaultMessage: 'Fashion size {label}'
        },
        { label: label }
    );

    const ariaLabelSelected = formatMessage(
        {
            id: 'productOptions.selectedSize',
            defaultMessage: 'Fashion size {label} button Selected'
        },
        { label: label }
    );

    const result = isSelected ? ariaLabelSelected : ariaLabelView;

    // variantImg
    let image = (
        <Image
            alt=''
            classes={{
                root: classes.variantImageSwatch
            }}
            resource={variantImg}
            width={24}
        />
    );

    return (
        <button
            className={className}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onFocus={handleMouseEnter}
            onTouchStart={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            title={label}
            type="button"
            data-cy="Tile-button"
            aria-label={result}
            disabled={isEverythingOutOfStock || isOptionOutOfStock}
        >
            {image}
            <span className={classes.label}>{label}</span>
        </button>
    );
};

export default Tile;

Tile.propTypes = {
    hasFocus: bool,
    isSelected: bool,
    item: shape({
        label: string.isRequired,
        value_index: oneOfType([number, string]).isRequired
    }).isRequired,
    onClick: func.isRequired
};

Tile.defaultProps = {
    hasFocus: false,
    isSelected: false
};
