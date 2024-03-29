import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSeller } from '@riosst100/pwa-marketplace/src/talons/Seller/useSeller';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { StoreTitle, Meta } from '@magento/venia-ui/lib/components/Head';
import { useCollectibleGameSets } from '@riosst100/pwa-marketplace/src/talons/CollectibleGameSets/useCollectibleGameSets';

const CollectibleGameSets = props => {
    const talonProps = useCollectibleGameSets();

    const { error, loading, collectibleGameSets } = talonProps;

    if (loading && !collectibleGameSets)
        return '';
    // return <SellerShimmer />;
    if (error && !collectibleGameSets) return <ErrorView />;

    if (!collectibleGameSets) {
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

    // console.log('SIPPPPPPPPPPPPPPPPPPP')
    // console.log(collectibleGameSets)

    const sets = collectibleGameSets.map((set, index) => {
        const { card_set } = set;
        return (
            <>
                <div><b>{card_set}</b></div>
            </>
        );
    });


    return (
        <Fragment>
            <StoreTitle>Magic: The Gathering | All Sets</StoreTitle>
            <div>{sets}</div>
        </Fragment>
    );
};

export default CollectibleGameSets;
