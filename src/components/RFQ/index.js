import React, { useState } from 'react';
import Button from '@magento/venia-ui/lib/components/Button';
import { useIntl } from 'react-intl';
import ModalRFQ from './modalRfq';

const AuctionDetail = (props) => {

    const [open, setOpen] = useState(false);
    const { formatMessage } = useIntl();

    return (
        <>
            <ModalRFQ
                open={open}
                setOpen={setOpen}
            />

            <Button
                data-cy="ProductFullDetail-RFQ"
                classes={{
                    content: 'normal-case font-semibold text-[16px]'
                }}
                priority="low"
                type="submit"
                onClick={() => { setOpen(true) }}
            >
                {
                    formatMessage({
                        id: 'productFullDetail.RequestQuote',
                        defaultMessage:
                            'Request a Quote'
                    })
                }
            </Button>
        </>
    )
}

export default AuctionDetail;