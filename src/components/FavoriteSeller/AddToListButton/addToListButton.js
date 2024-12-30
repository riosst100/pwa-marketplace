import React, { useRef } from 'react';
import { element, func, shape, string } from 'prop-types';
import { Heart } from 'react-feather';
import { useAddToFavoriteListButton } from '@riosst100/pwa-marketplace/src/talons/FavoriteSeller/AddToListButton/useAddToFavoriteListButton';
import { useButton } from 'react-aria';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import defaultClasses from './addToListButton.module.css';
import { useCommonToasts } from '@magento/venia-ui/lib/components/Wishlist/AddToListButton/useCommonToasts';

const HeartIcon = <Heart color='#f76b1c' size={14} variant="Outline" className='stroke-[#f76b1c]' />;

const AddToFavoriteListButton = props => {
    const talonProps = useAddToFavoriteListButton(props);
    const buttonRef = useRef();

    const {
        buttonProps,
        buttonText,
        errorToastProps,
        isSelected,
        loginToastProps,
        successToastProps
    } = talonProps;

    useCommonToasts({ errorToastProps, loginToastProps, successToastProps });
    const { buttonProps: ariaButtonProps } = useButton(buttonProps, buttonRef);

    const classes = useStyle(defaultClasses, props.classes);
    const buttonClass = isSelected ? classes.root_selected : classes.root;

    return (
        <button ref={buttonRef} className={buttonClass} {...ariaButtonProps}>
            {props.icon}
        </button>
    );
};

export default AddToFavoriteListButton;

AddToFavoriteListButton.defaultProps = {
    icon: HeartIcon
};

AddToFavoriteListButton.propTypes = {
    afterAdd: func,
    beforeAdd: func,
    classes: shape({
        root: string,
        root_selected: string
    }),
    icon: element
};
