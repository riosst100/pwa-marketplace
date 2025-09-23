import React from 'react';
import { shape, string } from 'prop-types';
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    FastForward as FastForwardIcon,
    Rewind as RewindIcon
} from 'react-feather';
import cn from 'classnames';
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react';
import { blue } from '@riosst100/pwa-marketplace/src/theme/vars';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import defaultClasses from '@magento/venia-ui/lib/components/Pagination/navButton.module.css';

const icons = new Map()
    .set('ChevronLeft', ChevronLeftIcon)
    .set('ChevronRight', ChevronRightIcon)
    .set('FastForward', FastForwardIcon)
    .set('Rewind', RewindIcon);

const NavButton = props => {
    const { active, buttonLabel, name, onClick } = props;
    const iconSrc = icons.get(name);
    const classes = useStyle(defaultClasses, props.classes);

    const iconClass = active ? classes.icon : classes.icon_disabled;

    return (
        <button
            aria-label={buttonLabel}
            className={cn(
                classes.root,
                'border-[1px] border-gray-100 rounded-[5px] !min-h-auto h-fit min-w-[40px] px-[10px] py-[7px]'
            )}
            disabled={!active}
            onClick={onClick}
        >
            {name === 'ChevronLeft' && (
                <ArrowLeft2 size={14} color={blue} className={cn(`stroke-[${blue}]`)} variant="Outline" />
            )}
            {name === 'ChevronRight' && (
                <ArrowRight2 size={14} color={blue} className={cn(`stroke-[${blue}]`)} variant="Outline" />
            )}
            {name !== 'ChevronRight' && name !== 'ChevronLeft' && (
                <Icon className={iconClass} size={20} src={iconSrc} />
            )}
        </button>
    );
};

export default NavButton;

NavButton.propTypes = {
    classes: shape({
        icon: string,
        icon_disabled: string,
        root: string
    })
};

NavButton.defaultProps = {
    buttonLabel: 'move to another page'
};
