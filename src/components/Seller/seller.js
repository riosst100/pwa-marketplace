import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSeller } from '@riosst100/pwa-marketplace/src/talons/Seller/useSeller';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { StoreTitle, Meta } from '@magento/venia-ui/lib/components/Head';
import mapSeller from '@riosst100/pwa-marketplace/src/util/mapSeller';
import Slider from '@riosst100/pwa-marketplace/src/components/commons/Slider';
import Tabs from '@riosst100/pwa-marketplace/src/components/commons/Tabs';
import SellerProducts from '../SellerProducts';
import SellerInformation from '../SellerInformation';
import Reviews from '../SellerReview';
import {
    Verify,
    Sms,
    Message,
    Heart,
    Share,
    BoxTick,
    Star1,
    Shop,
} from 'iconsax-react';
import SellerDetail from '@riosst100/pwa-marketplace/src/components/SellerDetail/sellerDetail';

const Seller = props => {
    const talonProps = useSeller({
        mapSeller
    });

    const { error, loading, seller } = talonProps;

    if (loading && !seller)
        return '';
    // return <SellerShimmer />;
    if (error && !seller) return <ErrorView />;
    if (!seller) {
        return (
            <h1>
                <FormattedMessage
                    id={'seller.notFound'}
                    defaultMessage={
                        'Seller Not Found.'
                    }
                />
            </h1>
        );
    }

    return (
        <Fragment>
            <StoreTitle>{seller.name}</StoreTitle>
            <Meta name="description" content={seller.description} />
            {seller && <SellerDetail seller={seller} />}
        </Fragment>
    );
};

export default Seller;
