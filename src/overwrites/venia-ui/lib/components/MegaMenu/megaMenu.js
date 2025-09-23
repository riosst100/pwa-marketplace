import React, { useEffect, useRef, useState } from 'react';

import { useIsInViewport } from '@magento/peregrine/lib/hooks/useIsInViewport';
import { useMegaMenu } from '@magento/peregrine/lib/talons/MegaMenu/useMegaMenu';
// import { useMegaMenu } from '@riosst100/pwa-marketplace/src/overwrites/peregrine/lib/talons/MegaMenu/useMegaMenu';
import { useStyle } from '@magento/venia-ui/lib/classify';

import MegaMenuItem from './megaMenuItem';
import defaultClasses from './megaMenu.module.css';
import cn from 'classnames';

/**
 * The MegaMenu component displays menu with categories on desktop devices
 */
const MegaMenu = (props) => {
    const { rootClassName, megaMenuItemClassname, titleClassName } = props
    const mainNavRef = useRef(null);

    const classes = useStyle(defaultClasses, props.classes);
    // const rootClass = cn(classes.megaMenu, rootClassName);
    const rootClass = cn('xs_hidden xl_flex flex-grow justify-self-center', rootClassName);

    const {
        megaMenuData,
        activeCategoryId,
        subMenuState,
        disableFocus,
        handleSubMenuFocus,
        categoryUrlSuffix,
        handleNavigate,
        handleClickOutside
    } = useMegaMenu({ mainNavRef });

    const [mainNavWidth, setMainNavWidth] = useState(0);
    const shouldRenderItems = useIsInViewport({
        elementRef: mainNavRef
    });

    useEffect(() => {
        const handleResize = () => {
            const navWidth = mainNavRef.current
                ? mainNavRef.current.offsetWidth
                : null;

            setMainNavWidth(navWidth);
        };

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [setMainNavWidth]);

    const items = megaMenuData.children
        ? megaMenuData.children.map(category => {
            return (
                <MegaMenuItem
                    category={category}
                    activeCategoryId={activeCategoryId}
                    categoryUrlSuffix={categoryUrlSuffix}
                    mainNavWidth={mainNavWidth}
                    onNavigate={handleNavigate}
                    key={category.uid}
                    subMenuState={subMenuState}
                    disableFocus={disableFocus}
                    handleSubMenuFocus={handleSubMenuFocus}
                    handleClickOutside={handleClickOutside}
                    megaMenuItemClassname={megaMenuItemClassname}
                    titleClassName={titleClassName}
                />
            );
        })
        : null;

    return (
        <nav
            ref={mainNavRef}
            className={rootClass}
            data-cy="MegaMenu-megaMenu"
            role="navigation"
            onFocus={handleSubMenuFocus}
        >
            {shouldRenderItems ? items : null}
        </nav>
    );
};

export default MegaMenu;
