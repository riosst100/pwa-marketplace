import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSeller } from '@riosst100/pwa-marketplace/src/talons/Seller/useSeller';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { StoreTitle, Meta } from '@magento/venia-ui/lib/components/Head';
import { useCollectibleGameSets } from '@riosst100/pwa-marketplace/src/talons/CollectibleGameSets/useCollectibleGameSets';
import { Link } from 'react-router-dom';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import defaultClasses from './collectibleGameSets.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';

const CollectibleGameSets = props => {

    const { product_type } = props;

    const talonProps = useCollectibleGameSets({ product_type });

    const { error, loading, collectibleGameSets, categoryUrlSuffix, categoryUrlKey, productType } = talonProps;

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

    const setsLengthArr = [];

    const setRelases = collectibleGameSets.map((setRelease, index) => {
        const { release_type, sets } = setRelease;

        const setsResult = [];

        setsLengthArr[release_type] = sets.length

        if (sets.length) {
            sets.map((set, index) => {
                const { set_name, option_id, set_abbreviation } = set;

                const categoryUrl = resourceUrl(
                    `/games/collectible-game/${categoryUrlKey}${categoryUrlSuffix || ''}?card_set[filter]=${set_name},${option_id}`
                );

                setsResult.push(
                    <li>
                        <Link to={categoryUrl}>{set_name} <small style={{"color":"grey"}}>{set_abbreviation}</small></Link>
                    </li>
                );
            });
        }

        return (
            <>
                <div id={"#tab_list_"+release_type.toLowerCase()}>
                    <div className='text-[16px] pb-2'><b>{release_type}</b></div>
                    <hr />
                    <ul className='pt-2'>{setsResult}</ul>
                </div>
            </>
        );
    });

    const alpha = ['#', 'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

    return (
        <>
            {/* <StoreTitle>{"Magic: The Gathering" + " | " + (productType == "sealed-products" ? "Expansion Sets" : "All Sets")}</StoreTitle> */}
            <div className='text-[20px] pb-4 pt-5' id={productType == "sealed-products" ? 'expansion-sets' : 'all-sets'}><b>{productType == "sealed-products" ? "Expansion Sets" : "All Sets"}</b></div>
            {productType != "sealed-products" ? (
                <>
                    <div className='flex flex-wrap mb-3'>
                        {alpha.map((val, index) => 
                            setsLengthArr[val] > 0 ? (
                            <a className="py-2 px-3 font-bold mr-1 border" href={"#tab_list_"+val.toLowerCase()}>{val}</a>
                            ) : (<span className="py-2 px-3 font-bold mr-1 border" style={{"color":"grey"}}>{val}</span>)
                        )}
                    </div>
                </>
            ) : ''}
            <div className='flex flex-wrap gap-[30px]'>{setRelases}</div>
        </>
    );
};

export default CollectibleGameSets;
