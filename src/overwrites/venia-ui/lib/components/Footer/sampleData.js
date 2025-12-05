import { ContactLink } from '@magento/venia-ui/lib/components/ContactPage';

const accountLinks = new Map()
    .set('Account', null)
    .set('Sign In', '/')
    .set('Register', '/')
    .set('Tracking Order', '/')

const getToKnowUsLinks = new Map()
    .set('About TCG Collective', null)
    .set('Career', '/')
    .set('Contact Us', '/')
    .set('Help Center', '/help-center')
    .set('Intelectual Property Claims', '/');

const aboutLinks = new Map()
    .set('About Us', '/about-us')
    .set('Our Story', null)
    .set('Email Signup', null)
    .set('Give Back', null);

const sitesLinks = new Map()
    .set('Sites', null)
    .set('International', '/')
    .set('Singapore', '/')
    .set('Malaysia', '/')
    .set('Indonesia', '/')
    .set('Thailand', '/')
    .set('Philippines', '/')
    .set('Vietnam', '/')

const helpLinks = new Map()
    .set('Help', null)
    .set('Customer Service', '/customer-service')
    .set('Contact Us', {
        path: '/contact-us',
        Component: ContactLink
    })
    .set('Order Status', null)
    .set('Returns', null);

export const DEFAULT_LINKS = new Map()
    .set('us', getToKnowUsLinks)
    .set('account', accountLinks)
    .set('sites', sitesLinks);

export const LOREM_IPSUM =
    'Lorem ipsum dolor sit amet, consectetur adipsicing elit, sed do eiusmod tempor incididunt ut labore et dolore.';
