import React from 'react';
import { FormattedMessage } from 'react-intl';
import { object, shape, string } from 'prop-types';
import { X as CloseIcon } from 'react-feather';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { Portal } from '@magento/venia-ui/lib/components/Portal';
import defaultClasses from './FilterOptionModal.module.css';
import { useFilterOptionModal } from '@riosst100/pwa-marketplace/src/talons/FilterOption/useFilterOptionModal';

const FilterOptionModal = props => {
    const { classes: propClasses, groupingItemElements, setActiveFilter } = props;
    const talonProps = useFilterOptionModal({ setActiveFilter });
    const { handleClose, isOpen } = talonProps;

    const classes = useStyle(defaultClasses, propClasses);
    const rootClass = isOpen ? classes.root_open : classes.root;

    // Unmount the form to force a reset back to original values on close
    const bodyElement = isOpen ? (
        groupingItemElements
    ) : null;

    return (
        <Portal>
            <aside className={rootClass}>
                {/* <div className={classes.header}>
                    <span className={classes.headerText}>
                        <FormattedMessage
                            id={'checkoutPage.editShippingInfo'}
                            defaultMessage={'Edit Shipping Information'}
                        />
                    </span>
                    <button
                        className={classes.closeButton}
                        onClick={handleClose}
                    >
                        <Icon src={CloseIcon} />
                    </button>
                </div> */}
                <div className={classes.body}>{bodyElement}</div>
            </aside>
        </Portal>
    );
};

export default FilterOptionModal;