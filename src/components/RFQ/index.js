import React, { useState } from 'react';
import Button from '@magento/venia-ui/lib/components/Button';
import { useIntl } from 'react-intl';
import ModalRFQ from './modalRfq';
import cn from 'classnames';

const RFQ = ({ productId, disabled, classes: customClasses = {} }) => {

  const [open, setOpen] = useState(false);
  const { formatMessage } = useIntl();

  return (
    <>
      <ModalRFQ open={open} setOpen={setOpen} productId={productId} />

      <Button
        data-cy="ProductFullDetail-RFQ"
        disabled={disabled}
        classes={{
          rootClass: cn(customClasses.rfqButton),
          content: cn('normal-case font-medium text-[16px]', customClasses.content)
        }}
        priority="low"
        onClick={() => setOpen(true)}
      >
        {formatMessage({
          id: 'productFullDetail.RequestQuote',
          defaultMessage: 'Make An Offer'
        })}
      </Button>
    </>
  );
};

export default RFQ;
