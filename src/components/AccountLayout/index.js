import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import defaultClasses from './accountlayout.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { ArrowDown2 } from 'iconsax-react';
import { useWindowSize } from '@magento/peregrine';
import cn from 'classnames';

const AccountLayout = (props) => {
    const { children } = props;
    const [isOpen, setIsOpen] = React.useState(false);
    const toggleDropdown = () => setIsOpen(!isOpen);
    const windowSize = useWindowSize();
    const isTablet = windowSize.innerWidth <= 1023;

    const classes = useStyle(defaultClasses, props.classes);
    return (
        <>
            <div className='flex flex-col lg_flex-row lg_justify-between gap-[30px] mt-8 relative'>
                {isTablet ? (
                    <button
                        onClick={toggleDropdown}
                        className={cn(
                            'text-[14px] font-medium flex justify-between items-center gap-x-4 border',
                            'border-gray-100 border-solid rounded-md min-w-max px-2.5 py-3',
                        )}
                    >
                        <span>My Account</span>
                        <ArrowDown2
                            size={14}
                            className={cn(
                                'text-colorDefault transition-all',
                                isOpen ? 'rotate-180' : 'rotate-0',
                            )}
                        />
                    </button>
                ) : null}

                <div
                    className={cn(
                        classes.menu,
                        'hidden lg_block',
                        isTablet && isOpen ? 'absolute !block bg-white w-full top-14' : '',
                    )}
                >
                    <div
                        className={cn(
                            'flex flex-col border border-gray-100 rounded-lg px-2.5 py-5'
                        )}
                    >
                        <li className="list-none">
                            <Link
                                to="/order-history"
                                className="text-[14px] font-medium p-2.5 block w-full hover_bg-gray-150 rounded-md"
                            >
                                <FormattedMessage
                                    id={'myaccount.orderHistory'}
                                    defaultMessage={'Order History'}
                                />

                            </Link>
                        </li>
                        <li className="list-none">
                            <Link
                                to="/wishlist"
                                className="text-[14px] font-medium p-2.5 block w-full hover_bg-gray-150 rounded-md"
                            >
                                <FormattedMessage
                                    id={'myaccount.wishlist'}
                                    defaultMessage={'Wishlist'}
                                />

                            </Link>
                        </li>
                        <li className="list-none">
                            <Link
                                to="#"
                                className="text-[14px] font-medium p-2.5 block w-full hover_bg-gray-150 rounded-md"
                            >
                                <FormattedMessage
                                    id={'myaccount.favoriteSeller'}
                                    defaultMessage={'Favorite Seller'}
                                />

                            </Link>
                        </li>
                        <li className="list-none">
                            <Link
                                to="/address-book"
                                className="text-[14px] font-medium p-2.5 block w-full hover_bg-gray-150 rounded-md"
                            >
                                <FormattedMessage
                                    id={'myaccount.addressBook'}
                                    defaultMessage={'Address Book'}
                                />

                            </Link>
                        </li>
                        <li className="list-none">
                            <Link
                                to="/saved-payments"
                                className="text-[14px] font-medium p-2.5 block w-full hover_bg-gray-150 rounded-md"
                            >
                                <FormattedMessage
                                    id={'myaccount.payments'}
                                    defaultMessage={'Payments'}
                                />

                            </Link>
                        </li>
                        <li className="list-none">
                            <Link
                                to="/communications#"
                                className="text-[14px] font-medium p-2.5 block w-full hover_bg-gray-150 rounded-md"
                            >
                                <FormattedMessage
                                    id={'myaccount.newsletter'}
                                    defaultMessage={'Newsletter'}
                                />

                            </Link>
                        </li>
                        <li className="list-none">
                            <Link
                                to="/account-information"
                                className="text-[14px] font-medium p-2.5 block w-full hover_bg-gray-150 rounded-md"
                            >
                                <FormattedMessage
                                    id={'myaccount.accountInformation'}
                                    defaultMessage={'Account Information'}
                                />

                            </Link>
                        </li>

                    </div>
                </div>
                <div className='block w-full'>
                    {children}
                </div>
            </div >
        </>
    )
}

export default AccountLayout