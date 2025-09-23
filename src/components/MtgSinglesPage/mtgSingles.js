import React from 'react';
import Divider from '@riosst100/pwa-marketplace/src/components/Divider';
import cn from 'classnames';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './singles.module.css';
import { Link } from 'react-router-dom'

const mtgSingles = (props) => {
    const { letters, groupedSingles, active, handleActive, availableLetter } = props;

    const classes = useStyle(defaultClasses);

    return (
        <>
            <h1 className='mx-auto relative block text-xl font-bold text-center pt-10 pb-4'>
                MTG Singles
            </h1>
            <div className='border border-gray-100 px-6'>
                <section className='single_list-indexing-container relative m-auto py-10'>
                    <ul className='flex gap-2 justify-center flex-wrap'>
                        <li >
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
                        {letters.map((letter, index) => (
                            <li key={index}>
                                <button
                                    className={cn(
                                        'rounded-md border border-solid border-gray-100 p-2 min-w-[28px]',
                                        'leading-4 font-medium text-base ',
                                        !availableLetter.includes(letter) ? 'bg-gray-100 text-gray-400' : 'hover_bg-gray-50',
                                    )}
                                    onClick={() => {
                                        handleActive(letter)
                                    }}
                                    disabled={!availableLetter.includes(letter)}
                                >
                                    {letter}
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>
                <Divider className="mb-5 px-4" />
                <section className='singles-container'>
                    <div className={cn('singles-wrapper block -mx-4', classes.singlesWrapper)}>
                        {availableLetter.map((initialLetter, index) => (
                            <>
                                {active === 'all' || active === initialLetter ? (
                                    <div className='singles_group-wrapper mb-4 px-4 inline-block w-full' key={index}>
                                        <div className='singles_item_group_letter text-xl font-medium border-b border-gray-100 pb-1 mb-2' >
                                            {initialLetter}
                                        </div>
                                        <div
                                            className={cn(
                                                'singles_item-list flex flex-col'
                                            )}
                                        >
                                            {groupedSingles[initialLetter].map((item, index) => (
                                                <li key={index} className='list-none'>
                                                    <Link
                                                        to="/"
                                                        className="hover_bg-darkblue-900 hover_text-white w-full block text-[14px] py-[2px] px-2"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}
                            </>
                        ))}
                    </div>
                </section>
            </div>
        </>
    )
}

export default mtgSingles