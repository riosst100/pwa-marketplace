import React, { useCallback } from 'react';
import { Check } from 'react-feather';
import { bool, func, shape, string } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon/icon';
import defaultClasses from './websiteSwitcherItem.module.css';

const WebsiteSwitcherItem = props => {
    const { active, onClick, option, option2, children } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const { location } = globalThis;
    const href = location.href;

    let match = location && location.pathname.split("/")[1];
    
    const websiteCode = option2 != "base" ? option2 : '';
    if (option2 == "base") {
        match = match + "/";
    }
    const url = href.replace(match, websiteCode);

    // const handleClick = useCallback(() => {
    //     onClick(option, option2);
    // }, [option, option2, onClick]);

    const activeIcon = active ? (
        <Icon data-cy="WebsiteSwitcherItem-activeIcon" size={20} src={Check} />
    ) : null;

    return (
        <a
            data-cy="WebsiteSwitcherItem-button"
            className={classes.root}
            href={url}
        >
            <span className={classes.content}>
                <span className={classes.text}>{children}</span>
                {activeIcon}
            </span>
        </a>
    );
};

WebsiteSwitcherItem.propTypes = {
    active: bool,
    classes: shape({
        content: string,
        root: string,
        text: string
    }),
    onClick: func,
    option: string
};

export default WebsiteSwitcherItem;
