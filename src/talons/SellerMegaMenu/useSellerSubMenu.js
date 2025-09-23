import { useKeyboard } from 'react-aria';

export const useSellerSubMenu = props => {
    const { isFocused, sellerSubMenuState, handleCloseSellerSubMenu } = props;

    const { keyboardProps } = useKeyboard({
        onKeyDown: e => {
            //checking for Tab without Shift
            if (!e.shiftKey && e.key === 'Tab') {
                e.target.addEventListener('blur', handleCloseSellerSubMenu);
            } else {
                e.target.removeEventListener('blur', handleCloseSellerSubMenu);
            }
        }
    });

    const isSellerSubMenuActive = isFocused && sellerSubMenuState;
    // const isSellerSubMenuActive = true;

    return { keyboardProps, isSellerSubMenuActive };
};
