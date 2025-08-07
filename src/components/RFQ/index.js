import React, { useState } from 'react';
import Button from '@magento/venia-ui/lib/components/Button';
import { useIntl } from 'react-intl';
import ModalRFQ from './modalRfq';

const RFQ = (props) => {

    const { disabled } = props;

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
                disabled={disabled}
                classes={{
                    content: 'normal-case font-medium text-[16px]'
                }}
                priority="low"
                type="submit"
                onClick={() => { setOpen(true) }}
            >
                {
                    formatMessage({
                        id: 'productFullDetail.RequestQuote',
                        defaultMessage:
                            'Make An Offer'
                    })
                }
            </Button>
        </>
    )
}

export default RFQ;