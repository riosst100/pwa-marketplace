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
    const origin = location.origin;

    const websiteCodes = [];

    AVAILABLE_WEBSITES.forEach(store => {
        websiteCodes.push(store.website_code);
    });

    const pathname = location.pathname;
    const search = location.search;
    const match = location && location.pathname.split("/")[1];
    let websiteCodeInUrl = websiteCodes.find((str) => str === match);

    const websiteCode = option2 != "base" ? option2 : '';

    let url = href + websiteCode;
    
    
    if (websiteCodeInUrl && option2 == "base") {
        websiteCodeInUrl = websiteCodeInUrl + "/";
    }

    if (websiteCodeInUrl) {
        url = href.replace(websiteCodeInUrl, websiteCode);
    }

    if (!websiteCodeInUrl) {
        if (websiteCode) {
            url = origin + '/' + websiteCode + pathname + search;
        }
    }

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
