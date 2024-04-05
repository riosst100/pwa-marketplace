import React, { Fragment, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSeller } from '@riosst100/pwa-marketplace/src/talons/Seller/useSeller';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { StoreTitle, Meta } from '@magento/venia-ui/lib/components/Head';
import { useCollectibleGameSets } from '@riosst100/pwa-marketplace/src/talons/CollectibleGameSets/useCollectibleGameSets';
import { Link } from 'react-router-dom';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import defaultClasses from './collectibleGameSets.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import cn from 'classnames';
import Divider from '@riosst100/pwa-marketplace/src/components/Divider';

const CollectibleGameSets = props => {

    const { product_type } = props;

    const [active, setActive] = useState('all');

    const classes = useStyle(defaultClasses);

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

        setsLengthArr[release_type] = sets.length

        const setsResult = [];

        if (sets.length) {
            sets.map((set, index) => {
                const { set_name, option_id, set_abbreviation } = set;

                const categoryUrl = resourceUrl(
                    `/games/collectible-game/${categoryUrlKey}${categoryUrlSuffix || ''}?card_set[filter]=${set_name},${option_id}`
                );

                setsResult.push(<li className='list-none'>
                    <Link to={categoryUrl} className="hover_bg-darkblue-900 hover_text-white w-full block text-[14px] py-[2px] px-2">
                        {set_name} <small style={{"color":"grey"}}>{set_abbreviation}</small>
                    </Link>
                </li>)
            })
        }
        
        return (
            <>
                {active == "all" || active == release_type ?
                <div id={"#tab_list_"+release_type.toLowerCase()} className='singles_group-wrapper mb-4 px-2 inline-block w-full'>
                    <div className='singles_item_group_letter text-xl font-semibold border-b border-gray-100 pb-1 mb-2' >
                        {release_type}
                    </div>
                    <div className={cn('singles_item-list flex flex-col')}>{setsResult}</div>
                </div> : ''}
            </>
        );
    });

    const handleActive = (val) => {
        setActive(val);
    }

    const alpha = ['#', 'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

    return (
        <>
            <h1 className='mx-auto relative block text-xl font-bold text-center pt-10 pb-4'>
                {productType == "sealed-products" ? "Expansion Sets" : "All Sets"}
            </h1>
            <div className='border border-gray-100 px-6'>
                {productType != "sealed-products" ? (
                    <>
                        <section className='single_list-indexing-container relative m-auto py-10'>
                            <ul className='flex gap-2 justify-center flex-wrap'>
                                <li>
                                    <button
                                        className={cn(
                                            'rounded-md border border-solid border-gray-100 p-2 min-w-[28px]',
                                            'leading-4 font-medium text-base hover_bg-gray-50'
                                        )}
                                        onClick={() => {
                                            handleActive('all')
                                        }}
                                    >
                                        All
                                    </button>
                                </li>
                                {alpha.map((letter, index) => (
                                    <li key={index}>
                                        <button
                                            className={cn(
                                                'rounded-md border border-solid border-gray-100 p-2 min-w-[28px]',
                                                'leading-4 font-medium text-base ',
                                                setsLengthArr[letter] > 0 ? 'hover_bg-gray-50' : 'bg-gray-100 text-gray-400',
                                            )}
                                            onClick={() => {
                                                handleActive(letter)
                                            }}
                                            disabled={setsLengthArr[letter] > 0 ? false : true}
                                        >
                                            {letter}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </>
                ) : ''}
                <Divider className="mb-5 px-4" />
                <section className='singles-container'>
                    <div className={cn('singles-wrapper block -mx-4', classes.singlesWrapper)}>
                        {setRelases}
                    </div>
                </section>
            </div>
        </>
    );
};

export default CollectibleGameSets;
