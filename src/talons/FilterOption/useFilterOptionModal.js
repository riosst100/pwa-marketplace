import { useAppContext } from '@magento/peregrine/lib/context/app';

export const useFilterOptionModal = () => {
    const [{ drawer }, { closeDrawer }] = useAppContext();
    const isOpen = drawer === 'filterOptionModal.show';

    return {
        handleClose: closeDrawer,
        isOpen
    };
};
