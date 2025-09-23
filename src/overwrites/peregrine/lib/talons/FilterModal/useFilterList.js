import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppContext } from '@magento/peregrine/lib/context/app';

export const useFilterList = props => {
    const { filterState, items, itemCountToShow } = props;

    const [{ overlay }, { toggleDrawer }] = useAppContext();

    const hasSelected = useMemo(
        () =>
            items.some((item, index) => {
                return (
                    filterState && filterState.has(item) && index >= itemCountToShow
                );
            }),
        [filterState, itemCountToShow, items]
    );

    // const hasSelected2 = useMemo(
    //     () =>
    //         items.some((item, index) => {
    //             return (
    //                 filterState &&
    //                 filterState.has(item)
    //             );
    //         }),
    //     [filterState, items]
    // );

    const [isListExpanded, setExpanded] = useState(hasSelected);
    const [activeFilter, setActiveFilter] = useState(false);
    // const [isShowAllOptions, setShowAllOptions] = useState(hasSelected);

    const handleListToggle = useCallback(() => {
        setExpanded(value => !value);
    }, [setExpanded]);

    const handleShowMore = useCallback(() => {
        setActiveFilter(true);
        toggleDrawer('filterOptionModal.show');
    }, [setActiveFilter, toggleDrawer]);

    useEffect(() => {
        if (!overlay) {
            setActiveFilter(false)
        }
    }, [overlay]);

    // const handleShowMore = useCallback(() => {
    //     handleShowAllOptions();
    // }, [handleShowAllOptions]);

    return {
        setActiveFilter,
        activeFilter,
        handleShowMore,
        handleListToggle,
        isListExpanded
    };
};
