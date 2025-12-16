import { useCallback, useMemo, useState } from 'react';

export const useSellerMegaMenuItem = props => {
    const { category, activeCategoryId, sellerSubMenuState, disableFocus } = props;

    const [isFocused, setIsFocused] = useState(false);
    const isActive = category.uid === activeCategoryId;

    const handleMenuItemFocus = useCallback(() => {
        setIsFocused(true);
    }, [setIsFocused]);

    const handleCloseSellerSubMenu = useCallback(() => {
        setIsFocused(false);
    }, [setIsFocused]);

    const isMenuActive = useMemo(() => {
        if (!isFocused) {
            return false;
        }
        if (sellerSubMenuState) {
            return true;
        } else if (disableFocus) {
            setIsFocused(false);
        }
        return false;
    }, [isFocused, sellerSubMenuState, disableFocus]);

    const handleKeyDown = useCallback(
        event => {
            const { key: pressedKey, shiftKey } = event;

            // checking down arrow and spacebar
            if (pressedKey === 'ArrowDown' || pressedKey === ' ') {
                event.preventDefault();
                if (category.children.length || category.name == "Lego") {
                    setIsFocused(true);
                } else {
                    setIsFocused(false);
                }

                return;
            }

            //checking up arrow or escape
            if (pressedKey === 'ArrowUp' || pressedKey === 'Escape') {
                setIsFocused(false);
            }

            //checking Tab with Shift
            if (shiftKey && pressedKey === 'Tab') {
                setIsFocused(false);
            }
        },
        [category.children.length, category.name]
    );

    return {
        isFocused,
        isActive,
        handleMenuItemFocus,
        handleCloseSellerSubMenu,
        isMenuActive,
        handleKeyDown
    };
};
