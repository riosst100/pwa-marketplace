import { useCallback, useMemo } from 'react';

export const useWebsiteSwitcher = (props = {}) => {
    const handleTriggerClick = useCallback(() => {
        // Toggle Stores Menu.
        // setStoreMenuIsOpen(isOpen => !isOpen);
        // globalThis.location.assign(`${newPath || ''}`);
    }, []);

    return {
        handleTriggerClick
    };
};
