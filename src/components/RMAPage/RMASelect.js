import React from 'react';
import { useIntl } from 'react-intl';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import RMAList from './components/rmaList';

const RMASelect = () => {
    const { formatMessage } = useIntl();
    const PAGE_TITLE = formatMessage({
        id: 'Quotes.pageTitleTextSelectOrder',
        defaultMessage: 'Select Order'
    });

    return (
        <div className='relative grid gap-y-md'>
            <StoreTitle>{PAGE_TITLE}</StoreTitle>
            <div aria-live="polite" className="text-xl font-medium text-left">
                {PAGE_TITLE}
            </div>

            <div class="block block-order-details-view">
                <div aria-live="polite" className="text-lg font-medium text-left mb-4 block-title">
                    {
                        formatMessage({
                            id: 'rma.selectOrderToReturn',
                            defaultMessage: 'Select an order to return'
                        })
                    }
                </div>

                <RMAList />
            </div>
        </div>
    )
}

export default RMASelect;