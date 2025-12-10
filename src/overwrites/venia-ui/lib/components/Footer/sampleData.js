import { ContactLink } from '@magento/venia-ui/lib/components/ContactPage';

const { location } = globalThis;
const origin = location.origin;

const accountLinks = new Map()
    .set('Let Us Help You', null)
    .set('Your Account', '/account-information')
    .set('Your Orders', '/order-history')
    .set('Help', '/help-center')

const socialMediaLinks = new Map()
    .set('Connect With Us', null)
    .set('Facebook', '/')
    .set('Twitter', '/')
    .set('Instagram', '/');

const brandLinks = new Map()
    .set('Protect and Build Your Brand', null)
    .set('Sell on TCG Collective', '/')
    .set('Partners/Affiliates', '/');

const getToKnowUsLinks = new Map()
    .set('Get to Know Us', null)
    .set('About Us', '/about-us')
    .set('Careers', '/career')
    .set('Contact Us', '/contact-us');

const sitesLinks = new Map()
    .set('Our Stores (Country/Region)', null)
    .set('Global', {
        url: origin + '/'
    })
    .set('Singapore', {
        url: origin + '/sg'
    })
    .set('Indonesia', {
        url: origin + '/id'
    })
    .set('Malaysia', {
        url: origin + '/my'
    })

export const DEFAULT_LINKS = new Map()
    .set('us', getToKnowUsLinks)
    .set('social-media', socialMediaLinks)
    .set('brand', brandLinks)
    .set('account', accountLinks)
    .set('sites', sitesLinks);

export const LOREM_IPSUM =
    'Lorem ipsum dolor sit amet, consectetur adipsicing elit, sed do eiusmod tempor incididunt ut labore et dolore.';
