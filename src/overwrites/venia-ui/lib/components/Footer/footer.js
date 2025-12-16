import React, { useState, Fragment } from 'react';
import { Facebook, Instagram, Twitter, Linkedin } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { shape, string } from 'prop-types';
import { useFooter } from '@magento/peregrine/lib/talons/Footer/useFooter';
import { useLocation } from 'react-router-dom';
import LiveChat from '@riosst100/pwa-marketplace/src/components/LiveChat';
import Logo from '@magento/venia-ui/lib/components/Logo';
import Newsletter from '@magento/venia-ui/lib/components/Newsletter';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './footer.module.css';
import { DEFAULT_LINKS, LOREM_IPSUM } from './sampleData';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import cn from 'classnames';
import Divider from '@riosst100/pwa-marketplace/src/components/Divider';
import Button from '@magento/venia-ui/lib/components/Button';
const Footer = props => {
    const { links } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = useFooter();

    const [openChat, setOpenChat] = useState(false);
    const toggleChat = () => {
        setOpenChat(!openChat);
    }

    const location = useLocation();
    const isCheckoutPage = location.pathname === '/checkout';

    const { copyrightText } = talonProps;
    const { formatMessage } = useIntl();
    const title = formatMessage({ id: 'logo.title', defaultMessage: 'Venia' });

    const linkGroups = Array.from(links, ([groupKey, linkProps]) => {
        const linkElements = Array.from(linkProps, ([text, pathInfo]) => {
            let path = pathInfo;
            let url = null;
            let Component = Fragment;
            if (pathInfo && typeof pathInfo === 'object') {
                url = pathInfo.url;
                if (pathInfo.Component) {
                    Component = pathInfo.Component;
                }

                if (pathInfo.path) {
                    path = pathInfo.path;
                }
            }

            const itemKey = `text: ${text} path:${path}`;
            const child = url ? (
                <a data-cy="Footer-link" className={classes.link} href={url}>
                    <FormattedMessage id={text} defaultMessage={text} />
                </a>
            ) : path ? (
                <Link data-cy="Footer-link" className={classes.link} to={path}>
                    <FormattedMessage id={text} defaultMessage={text} />
                </Link>
            ) : (
                <span data-cy="Footer-label" className={classes.label}>
                    <FormattedMessage id={text} defaultMessage={text} />
                </span>
            );

            return (
                <Component key={itemKey}>
                    <li className={classes.linkItem}>{child}</li>
                </Component>
            );
        });

        return (
            <ul key={groupKey} className={classes.linkGroup}>
                {linkElements}
            </ul>
        );
    });

    return (
        <footer
            data-cy="Footer-root"
            className={cn(
                classes.root,
                // '!pt-[50px] !px-6 lg_!px-4'
            )}
            style={
                {
                    "zIndex": 1,
                    "position": "relative"
                }
            }
        >
            <LiveChat
                open={openChat}
                setOpen={setOpenChat}
            />
            {!isCheckoutPage && <div className={classes.links} style={{"display":"flex"}}>
                {linkGroups}
                {/* <div>
                    <Newsletter />
                </div> */}
                {/* <div className={classes.callout}>
                    <span
                        data-cy="Footer-calloutHeading"
                        className={classes.calloutHeading}
                    >
                        Connect with Us
                    </span>
                    <ul className={classes.socialLinks}>
                        <li>
                            <Link to="" className="bg-darkblue-900 rounded-full flex justify-center items-center w-[34px] h-[34px]">
                                <Facebook size={15} color='#FFFFFF' />
                            </Link>
                        </li>
                        <li>
                            <Link to="" className="bg-darkblue-900 rounded-full flex justify-center items-center w-[34px] h-[34px]">
                                <Twitter size={15} color='#FFFFFF' />
                            </Link>
                        </li>
                        <li>
                            <Link to="" className="bg-darkblue-900 rounded-full flex justify-center items-center w-[34px] h-[34px]">
                                <Instagram size={15} color='#FFFFFF' />
                            </Link>
                        </li>
                    </ul>
                </div> */}
            </div>}
            <div className={"flex flex-row justify-between py-4 border-t border-gray-100 w-full py-[15px] mx-[auto] flex justify-between items-center" + (isCheckoutPage ? " max-w-[1000px]" : " max-w-[1300px]")}>
                <p className="text-colorDefault">{copyrightText || null}</p>
                <ul className="flex flex-row gap-x-2.5">
                    <li data-cy="Footer-terms" className={classes.terms}>
                        <Link to="/" className="text-colorDefault underline">
                            <FormattedMessage
                                id={'footer.termsText'}
                                defaultMessage={'Terms of Use'}
                            />
                        </Link>
                    </li>
                    <Divider className="w-[1px] !h-[20px]" />
                    <li data-cy="Footer-privacy" className={classes.privacy}>
                        <Link to="/" className="text-colorDefault underline">
                            <FormattedMessage
                                id={'footer.privacyText'}
                                defaultMessage={'Privacy Policy'}
                            />
                        </Link>
                    </li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;

Footer.defaultProps = {
    links: DEFAULT_LINKS
};

Footer.propTypes = {
    classes: shape({
        root: string
    })
};
