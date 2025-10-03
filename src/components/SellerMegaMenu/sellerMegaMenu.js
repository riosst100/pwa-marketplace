import React, { useEffect, useRef, useState } from 'react';

import { useIsInViewport } from '@magento/peregrine/lib/hooks/useIsInViewport';
import { useSellerMegaMenu } from '@riosst100/pwa-marketplace/src/talons/SellerMegaMenu/useSellerMegaMenu';
// import { useMegaMenu } from '@riosst100/pwa-marketplace/src/overwrites/peregrine/lib/talons/MegaMenu/useMegaMenu';
import { useStyle } from '@magento/venia-ui/lib/classify';

import SellerMegaMenuItem from './sellerMegaMenuItem';
import defaultClasses from './sellerMegaMenu.module.css';
import cn from 'classnames';

/**
 * The SellerMegaMenu component displays menu with categories on desktop devices
 */
const SellerMegaMenu = (props) => {
    const { rootClassName, seller, sellerMegaMenuItemClassname, titleClassName } = props
    const mainNavRef = useRef(null);

    const classes = useStyle(defaultClasses, props.classes);
    // const rootClass = cn(classes.sellerMegaMenu, rootClassName);
    const rootClass = cn('flex items-end gap-[40px] px-[30px] py-0 rounded-[6px] border border-solid border-gray-100 xs_hidden xl_flex flex-grow justify-self-center', rootClassName);

    const {
        megaMenuData,
        activeCategoryId,
        sellerSubMenuState,
        disableFocus,
        handleSellerSubMenuFocus,
        categoryUrlSuffix,
        handleNavigate,
        handleClickOutside
    } = useSellerMegaMenu({ mainNavRef });
    
    const allowedCategoryUids = props.allowedCategoryUids || ['NTI=', 'NTA=', 'NTM=', 'MjY='];

    const filteredChildren = Array.isArray(megaMenuData?.children)
        ? megaMenuData.children.filter(c => allowedCategoryUids.includes(c.uid))
        : [];

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

    const items = filteredChildren.length
        ? filteredChildren.map(category => {
             return (
                 <SellerMegaMenuItem
                     category={category}
                     activeCategoryId={activeCategoryId}
                     categoryUrlSuffix={categoryUrlSuffix}
                     mainNavWidth={mainNavWidth}
                     onNavigate={handleNavigate}
                     key={category.uid}
                     seller={seller}
                    //  sellerSubMenuState={sellerSubMenuState}
                     disableFocus={disableFocus}
                     handleSellerSubMenuFocus={handleSellerSubMenuFocus}
                     handleClickOutside={handleClickOutside}
                     sellerMegaMenuItemClassname={sellerMegaMenuItemClassname}
                     titleClassName={titleClassName}
                 />
             );
         })
         : null;
    return (
        <nav
            ref={mainNavRef}
            className={rootClass}
            data-cy="SellerMegaMenu-sellerMegaMenu"
            role="navigation"
            onFocus={handleSellerSubMenuFocus}
        >
            {shouldRenderItems ? items : null}
        </nav>
    );
};

export default SellerMegaMenu;
