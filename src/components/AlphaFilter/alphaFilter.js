import React, { Fragment, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useSeller } from '@riosst100/pwa-marketplace/src/talons/Seller/useSeller';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { StoreTitle, Meta } from '@magento/venia-ui/lib/components/Head';
import { useCollectibleGameSets } from '@riosst100/pwa-marketplace/src/talons/CollectibleGameSets/useCollectibleGameSets';
import { Link } from 'react-router-dom';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import defaultClasses from './alphaFilter.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import cn from 'classnames';
import Divider from '@riosst100/pwa-marketplace/src/components/Divider';
import { CollectibleGameSetsShimmer } from '@riosst100/pwa-marketplace/src/components/CollectibleGameSets';
import ProductSort from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/components/ProductSort';
import CustomSortBy from '@riosst100/pwa-marketplace/src/components/CustomSortBy';

const AlphaFilter = props => {
    const {items, handleActiveLetter, activeLetter, isSingles } = props;

    const groupSinglesFirstLetter = (data) => {
        return data.reduce((acc, item) => {
            if (item) {
                const { custom_attributes } = item;
                if (custom_attributes) {
                    let cardName = '';
                    custom_attributes.some((attribute, index) => {
                        const { attribute_metadata, entered_attribute_value, selected_attribute_options } = attribute
                        if (attribute_metadata.code == "card_name") {
                            cardName = selected_attribute_options.attribute_option[0].label;

                            return true;
                        }

                        return false;
                    });

                    if (cardName) {
                        const firstLetter = cardName.charAt(0).toUpperCase();
                        acc[firstLetter] = acc[firstLetter] || [];
                        acc[firstLetter].push(item);
                    }
                }
            }

            return acc;
        }, {});
    }

    const groupedSingles = items ? groupSinglesFirstLetter(items) : null;
    const availableLetter = groupedSingles ? Object.keys(groupedSingles).sort() : [];
    
    const alpha = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

    return isSingles && <>
        <section className='single_list-indexing-container relative m-auto py-1'>
            <ul className='flex gap-2 justify-center flex-wrap'>
                {alpha.map((letter, index) => (
                    <li key={index}>
                        {activeLetter == letter ? <button
                            className={cn(
                                'rounded-md border border-solid border-gray-100 p-2 min-w-[28px]',
                                'leading-4 font-medium text-base ',
                                availableLetter.includes(letter) ? 'hover_bg-gray-50' : 'bg-gray-100 text-gray-400',
                            )}><b>{letter}</b></button> :
                        <button
                            className={cn(
                                'rounded-md border border-solid border-gray-100 p-2 min-w-[28px]',
                                'leading-4 font-medium text-base ',
                                availableLetter.includes(letter) ? 'hover_bg-gray-50' : 'bg-gray-100 text-gray-400',
                            )}
                            onClick={() => {
                                handleActiveLetter(letter)
                            }}
                            disabled={availableLetter.includes(letter) > 0 ? false : true}
                        >
                            {letter}
                        </button>}
                    </li>
                ))}
                <li>
                    {activeLetter == 'all' ? <button
                            className={cn(
                                'rounded-md border border-solid border-gray-100 p-2 min-w-[28px]',
                                'leading-4 font-medium text-base hover_bg-gray-50',
                            )}><b>All</b></button> :
                    <button
                        className={cn(
                            'rounded-md border border-solid border-gray-100 p-2 min-w-[28px]',
                            'leading-4 font-medium text-base hover_bg-gray-50'
                        )}
                        onClick={() => {
                            handleActiveLetter('all')
                        }}
                    >
                        All
                    </button>}
                </li>
            </ul>
        </section>
    </>
}

export default AlphaFilter;
