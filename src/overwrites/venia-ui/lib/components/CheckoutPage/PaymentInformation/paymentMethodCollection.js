/**
 * Delegate to Venia's canonical payment method collection so build-target
 * augmentation (checkoutPagePaymentTypes) from third-party integrations works.
 *
 * Note: Keeping a local empty object here prevents integrations like
 * Stripe/MultiSafepay from registering their UI components, resulting in
 * "There was an error loading payments" on checkout.
 */
export { default } from '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/paymentMethodCollection';
