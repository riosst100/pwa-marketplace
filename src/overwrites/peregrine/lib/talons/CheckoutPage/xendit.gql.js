import { gql } from '@apollo/client';

export const XENDIT_CREATE_INVOICE = gql`
    mutation xenditCreateInvoice($orderId: String!) {
        xenditCreateInvoice(input: { order_id: $orderId }) {
            invoice_url
            mode
            xendit_qrcode_external_id
        }
    }
`;

export default {
    XENDIT_CREATE_INVOICE
};
