import React, { Fragment } from 'react';
import { Facebook, Instagram, Twitter, Linkedin } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { shape, string } from 'prop-types';
import { useFooter } from '@magento/peregrine/lib/talons/Footer/useFooter';

import Logo from '@magento/venia-ui/lib/components/Logo';
import Newsletter from '@magento/venia-ui/lib/components/Newsletter';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './footer.module.css';
import { DEFAULT_LINKS, LOREM_IPSUM } from './sampleData';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import cn from 'classnames';
import Divider from '@riosst100/pwa-marketplace/src/components/Divider';

const Footer = props => {
    const { links } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = useFooter();

    const { copyrightText } = talonProps;
    const { formatMessage } = useIntl();
    const title = formatMessage({ id: 'logo.title', defaultMessage: 'Venia' });

    const linkGroups = Array.from(links, ([groupKey, linkProps]) => {
        const linkElements = Array.from(linkProps, ([text, pathInfo]) => {
            let path = pathInfo;
            let Component = Fragment;
            if (pathInfo && typeof pathInfo === 'object') {
                path = pathInfo.path;
                Component = pathInfo.Component;
            }

            const itemKey = `text: ${text} path:${path}`;
            const child = path ? (
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
                '!pt-[50px] !px-6 lg_!px-4'
            )}
        >
            <div className={classes.links}>
                {linkGroups}
                <div>
                    <Newsletter />
                </div>
                <div className={classes.callout}>
                    <span
                        data-cy="Footer-calloutHeading"
                        className={classes.calloutHeading}
                    >
                        Follow Us
                    </span>
                    <ul className={classes.socialLinks}>
                        <li>
                            <Link to="" className="bg-darkblue-900 rounded-full flex justify-center items-center w-[34px] h-[34px]">
                                <Instagram size={15} color='#FFFFFF' />
                            </Link>
                        </li>
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
                                <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.9311 4.27218C12.8573 4.19836 12.7835 4.19836 12.6358 4.19836C12.4144 4.19836 12.2667 4.19836 12.0453 4.12454C10.7903 3.82925 9.90442 2.86957 9.8306 1.61459V1.31931C9.8306 1.09784 9.68295 0.950195 9.46148 0.950195H7.173C6.95154 0.950195 6.80389 1.09784 6.80389 1.31931V10.5471C6.80389 11.4329 6.06567 12.0973 5.25363 12.0973C4.73688 12.0973 4.29395 11.8758 3.99866 11.5067C3.4819 10.8423 3.62955 9.80883 4.29395 9.29208C4.58923 9.07061 4.88452 9.07061 5.4751 9.07061C5.54892 9.07061 5.69656 9.07061 5.77039 8.99679C5.84421 8.92297 5.91803 8.84915 5.91803 8.7015V6.26538C5.91803 6.11773 5.77039 5.89627 5.62274 5.89627C4.44159 5.74862 3.26044 6.04391 2.37457 6.78213C1.56253 7.52035 0.971956 8.55386 0.824312 9.80883C0.602846 11.2115 1.1196 12.6879 2.07929 13.6476C2.96515 14.6073 4.22012 15.0502 5.40128 15.0502C6.58243 15.0502 7.76358 14.6073 8.64944 13.7214C9.53531 12.8355 10.0521 11.6544 10.0521 10.3994V6.3392C10.9379 6.78213 11.8976 7.07742 12.8573 7.07742C13.0788 7.07742 13.2264 6.92978 13.2264 6.70831V4.49365C13.0788 4.41983 13.0049 4.34601 12.9311 4.27218Z" fill="white" />
                                </svg>
                            </Link>
                        </li>
                        <li>
                            <Link to="" className="bg-darkblue-900 rounded-full flex justify-center items-center w-[34px] h-[34px]">
                                <Linkedin size={15} color='#FFFFFF' />
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="flex flex-row justify-between py-2 border-t border-gray-100">
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
