import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import {
    useApolloClient,
    useLazyQuery,
    useMutation,
    useQuery
} from '@apollo/client';
import { useEventingContext } from '@magento/peregrine/lib/context/eventing';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { setCheckoutState} from '@magento/peregrine/lib/store/actions/cart';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from '@riosst100/pwa-marketplace/src/overwrites/peregrine/lib/talons/CheckoutPage/checkoutPage.extended.gql.js';

import CheckoutError from '@magento/peregrine/lib/talons/CheckoutPage/CheckoutError';
import { useGoogleReCaptcha } from '@magento/peregrine/lib/hooks/useGoogleReCaptcha';
import { XENDIT_CREATE_INVOICE } from '@riosst100/pwa-marketplace/src/overwrites/peregrine/lib/talons/CheckoutPage/xendit.gql';

// Lightweight UI helper: show a full-screen overlay when redirecting to Xendit
const XENDIT_OVERLAY_ID = 'xendit-redirect-overlay';
function showXenditRedirectOverlay() {
    if (typeof document === 'undefined') return;
    if (document.getElementById(XENDIT_OVERLAY_ID)) return;

    const style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = `@keyframes xendit-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.id = XENDIT_OVERLAY_ID;
    overlay.setAttribute('data-cy', 'xendit-redirect-overlay');
    overlay.style.cssText = [
        'position:fixed',
        'inset:0',
        'background:rgba(0,0,0,0.85)',
        'color:#fff',
        'display:flex',
        'flex-direction:column',
        'align-items:center',
        'justify-content:center',
        'z-index:2147483647',
        'text-align:center',
        'padding:24px'
    ].join(';');

    const spinner = document.createElement('div');
    spinner.style.cssText = [
        'width:48px',
        'height:48px',
        'border:4px solid #ffffff',
        'border-top-color:transparent',
        'border-radius:50%',
        'animation:xendit-spin 1s linear infinite',
        'margin-bottom:16px'
    ].join(';');

    const text = document.createElement('div');
    text.textContent = 'Redirecting you to Xendit payment page…';
    text.style.cssText = 'font-size:16px; opacity:0.33;';

    overlay.appendChild(spinner);
    overlay.appendChild(text);
    document.body.appendChild(overlay);
}

export const CHECKOUT_STEP = {
    SHIPPING_ADDRESS: 1,
    SHIPPING_METHOD: 2,
    PAYMENT: 3,
    REVIEW: 4
};

/**
 *
 * @param {DocumentNode} props.operations.getCheckoutDetailsQuery query to fetch checkout details
 * @param {DocumentNode} props.operations.getCustomerQuery query to fetch customer details
 * @param {DocumentNode} props.operations.getOrderDetailsQuery query to fetch order details
 * @param {DocumentNode} props.operations.createCartMutation mutation to create a new cart
 * @param {DocumentNode} props.operations.placeOrderMutation mutation to place order
 *
 * @returns {
 *  activeContent: String,
 *  availablePaymentMethods: Array,
 *  cartItems: Array,
 *  checkoutStep: Number,
 *  customer: Object,
 *  error: ApolloError,
 *  handlePlaceOrder: Function,
 *  handlePlaceOrderEnterKeyPress: Function,
 *  hasError: Boolean,
 *  isCartEmpty: Boolean,
 *  isGuestCheckout: Boolean,
 *  isLoading: Boolean,
 *  isUpdating: Boolean,
 *  orderDetailsData: Object,
 *  orderDetailsLoading: Boolean,
 *  orderNumber: String,
 *  placeOrderLoading: Boolean,
 *  setCheckoutStep: Function,
 *  setIsUpdating: Function,
 *  setShippingInformationDone: Function,
 *  setShippingMethodDone: Function,
 *  setPaymentInformationDone: Function,
 *  scrollShippingInformationIntoView: Function,
 *  shippingInformationRef: ReactRef,
 *  shippingMethodRef: ReactRef,
 *  scrollShippingMethodIntoView: Function,
 *  resetReviewOrderButtonClicked: Function,
 *  handleReviewOrder: Function,
 *  handleReviewOrderEnterKeyPress: Function,
 *  reviewOrderButtonClicked: Boolean,
 *  toggleAddressBookContent: Function,
 *  toggleSignInContent: Function,
 * }
 */
export const useCheckoutPage = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const {
        createCartMutation,
        getCheckoutDetailsQuery,
        getCustomerQuery,
        getOrderDetailsQuery,
        placeOrderMutation
    } = operations;

    const { generateReCaptchaData, recaptchaWidgetProps } = useGoogleReCaptcha({
        currentForm: 'PLACE_ORDER',
        formAction: 'placeOrder'
    });

    const [reviewOrderButtonClicked, setReviewOrderButtonClicked] = useState(
        false
    );

    const shippingInformationRef = useRef();
    const shippingMethodRef = useRef();

    const apolloClient = useApolloClient();
    const [isUpdating, setIsUpdating] = useState(false);
    const [placeOrderButtonClicked, setPlaceOrderButtonClicked] = useState(
        false
    );
    const [activeContent, setActiveContent] = useState('checkout');
    const [checkoutStep, setCheckoutStep] = useState(
        CHECKOUT_STEP.SHIPPING_ADDRESS
    );
    const [guestSignInUsername, setGuestSignInUsername] = useState('');

    const [{ isSignedIn }] = useUserContext();
    const [{ cartId }, { createCart, removeCart }] = useCartContext();

    const [fetchCartId] = useMutation(createCartMutation);
    const [
        placeOrder,
        {
            data: placeOrderData,
            error: placeOrderError,
            loading: placeOrderLoading
        }
    ] = useMutation(placeOrderMutation);

    // Xendit: create invoice after successful placeOrder
    const [
        xenditCreateInvoice,
        { data: xenditInvoiceData, loading: xenditInvoiceLoading, error: xenditInvoiceError }
    ] = useMutation(XENDIT_CREATE_INVOICE);

    const [
        getOrderDetails,
        { data: orderDetailsData, loading: orderDetailsLoading }
    ] = useLazyQuery(getOrderDetailsQuery, {
        // We use this query to fetch details _just_ before submission, so we
        // want to make sure it is fresh. We also don't want to cache this data
        // because it may contain PII.
        fetchPolicy: 'no-cache'
    });

    const { data: customerData, loading: customerLoading } = useQuery(
        getCustomerQuery,
        { skip: !isSignedIn }
    );

    const {
        data: checkoutData,
        networkStatus: checkoutQueryNetworkStatus
    } = useQuery(getCheckoutDetailsQuery, {
        /**
         * Skip fetching checkout details if the `cartId`
         * is a falsy value.
         */
        skip: !cartId,
        notifyOnNetworkStatusChange: true,
        variables: {
            cartId
        }
    });

    const cartItems = useMemo(() => {
        return (checkoutData && checkoutData?.cart?.items) || [];
    }, [checkoutData]);

    /**
     * For more info about network statues check this out
     *
     * https://www.apollographql.com/docs/react/data/queries/#inspecting-loading-states
     */
    const isLoading = useMemo(() => {
        const checkoutQueryInFlight = checkoutQueryNetworkStatus
            ? checkoutQueryNetworkStatus < 7
            : true;

        return checkoutQueryInFlight || customerLoading;
    }, [checkoutQueryNetworkStatus, customerLoading]);

    const customer = customerData && customerData.customer;

    const toggleAddressBookContent = useCallback(() => {
        setActiveContent(currentlyActive =>
            currentlyActive === 'checkout' ? 'addressBook' : 'checkout'
        );
    }, []);
    const toggleSignInContent = useCallback(() => {
        setActiveContent(currentlyActive =>
            currentlyActive === 'checkout' ? 'signIn' : 'checkout'
        );
    }, []);

    const checkoutError = useMemo(() => {
        if (placeOrderError) {
            return new CheckoutError(placeOrderError);
        }
    }, [placeOrderError]);

    const handleReviewOrder = useCallback(() => {
        setReviewOrderButtonClicked(true);
    }, []);

    const handleReviewOrderEnterKeyPress = useCallback(() => {
        event => {
            if (event.key === 'Enter') {
                handleReviewOrder();
            }
        };
    }, [handleReviewOrder]);

    const resetReviewOrderButtonClicked = useCallback(() => {
        setReviewOrderButtonClicked(false);
    }, []);

    const scrollShippingInformationIntoView = useCallback(() => {
        if (shippingInformationRef.current) {
            shippingInformationRef.current.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }, [shippingInformationRef]);

    const setShippingInformationDone = useCallback(() => {
        if (checkoutStep === CHECKOUT_STEP.SHIPPING_ADDRESS) {
            setCheckoutStep(CHECKOUT_STEP.SHIPPING_METHOD);
        }
    }, [checkoutStep]);

    const scrollShippingMethodIntoView = useCallback(() => {
        if (shippingMethodRef.current) {
            shippingMethodRef.current.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }, [shippingMethodRef]);

    const setShippingMethodDone = useCallback(() => {
        if (checkoutStep === CHECKOUT_STEP.SHIPPING_METHOD) {
            setCheckoutStep(CHECKOUT_STEP.PAYMENT);
        }
    }, [checkoutStep]);

    const setPaymentInformationDone = useCallback(() => {
        if (checkoutStep === CHECKOUT_STEP.PAYMENT) {
            globalThis.scrollTo({
                left: 0,
                top: 0,
                behavior: 'smooth'
            });
            setCheckoutStep(CHECKOUT_STEP.REVIEW);
        }
    }, [checkoutStep]);

    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    // When true, we intentionally hide the OrderConfirmationPage (orderNumber)
    // to allow external payment (Xendit) to complete first.
    const [suppressOrderConfirmation, setSuppressOrderConfirmation] = useState(false);

    const handlePlaceOrder = useCallback(async () => {
        // Fetch order details and then use an effect to actually place the
        // order. If/when Apollo returns promises for invokers from useLazyQuery
        // we can just await this function and then perform the rest of order
        // placement.
        await getOrderDetails({
            variables: {
                cartId
            }
        });
        setPlaceOrderButtonClicked(true);
        setIsPlacingOrder(true);
    }, [cartId, getOrderDetails]);

    const handlePlaceOrderEnterKeyPress = useCallback(() => {
        event => {
            if (event.key === 'Enter') {
                handlePlaceOrder();
            }
        };
    }, [handlePlaceOrder]);

    const [, { dispatch }] = useEventingContext();

    // Go back to checkout if shopper logs in
    useEffect(() => {
        if (isSignedIn) {
            setActiveContent('checkout');
        }
    }, [isSignedIn]);

    useEffect(() => {
        async function placeOrderAndCleanup() {
            try {
                const reCaptchaData = await generateReCaptchaData();
                // Execute placeOrder and get the order number directly from the response
                const placeOrderResult = await placeOrder({
                    variables: {
                        cartId
                    },
                    ...reCaptchaData
                });

                const orderNumber =
                    placeOrderResult?.data?.placeOrder?.order?.order_number;
                // If payment is Xendit, create invoice and redirect BEFORE cleaning up cart
                const selectedPayment = orderDetailsData?.cart?.selected_payment_method;
                const paymentCode = selectedPayment?.code;
                const paymentTitle = selectedPayment?.title;
                const isXendit =
                    (paymentCode && paymentCode.toLowerCase() === 'xendit') ||
                    (paymentTitle && paymentTitle.toLowerCase().includes('xendit'));
                if (isXendit && orderNumber) {
                    try {
                        // Prevent success page from rendering; we'll redirect to Xendit first
                        setSuppressOrderConfirmation(true);
                        const res = await xenditCreateInvoice({
                            variables: { orderId: orderNumber }
                        });
                        const payload = res?.data?.xenditCreateInvoice;
                        const url = payload?.invoice_url;
                        if (url) {
                            // Show overlay to inform user before redirecting
                            showXenditRedirectOverlay();
                            // Perform cart cleanup before redirecting away
                            try {
                                await removeCart();
                                await apolloClient.clearCacheData(apolloClient, 'cart');
                                await createCart({ fetchCartId });
                            } catch (cleanupErr) {
                                // eslint-disable-next-line no-console
                                console.warn('Cleanup before Xendit redirect failed', cleanupErr);
                            }
                            // Give the browser a brief moment to paint the overlay
                            setTimeout(() => {
                                // Redirect in the SAME TAB per requested flow
                                window.location.assign(url);
                            }, 2000);
                        } else {
                            // eslint-disable-next-line no-console
                            console.warn(
                                'Xendit: invoice_url missing in response'
                            );
                        }
                    } catch (err) {
                        // eslint-disable-next-line no-console
                        console.error(
                            'Xendit: failed to create invoice',
                            err
                        );
                    }
                } else {
                    // Non-Xendit: proceed with normal cleanup
                    await removeCart();
                    await apolloClient.clearCacheData(apolloClient, 'cart');
                    await createCart({ fetchCartId });
                }
            } catch (err) {
                console.error(
                    'An error occurred during when placing the order',
                    err
                );
                setPlaceOrderButtonClicked(false);
            }
        }

        if (orderDetailsData && isPlacingOrder) {
            setIsPlacingOrder(false);
            placeOrderAndCleanup();
        }
    }, [
        apolloClient,
        cartId,
        createCart,
        fetchCartId,
        generateReCaptchaData,
        orderDetailsData,
        placeOrder,
        removeCart,
        isPlacingOrder
    ]);

    useEffect(async () => {
        await setCheckoutState(false);
    }, [setCheckoutState]);

    useEffect(() => {
        if (
            checkoutStep === CHECKOUT_STEP.SHIPPING_ADDRESS &&
            cartItems.length
        ) {
            dispatch({
                type: 'CHECKOUT_PAGE_VIEW',
                payload: {
                    cart_id: cartId,
                    products: cartItems
                }
            });
        } else if (reviewOrderButtonClicked) {
            dispatch({
                type: 'CHECKOUT_REVIEW_BUTTON_CLICKED',
                payload: {
                    cart_id: cartId
                }
            });
        } else if (
            placeOrderButtonClicked &&
            orderDetailsData &&
            orderDetailsData.cart
        ) {
            const shipping =
                orderDetailsData.cart?.shipping_addresses &&
                orderDetailsData.cart.shipping_addresses.reduce(
                    (result, item) => {
                        return [
                            ...result,
                            {
                                ...item.selected_shipping_method
                            }
                        ];
                    },
                    []
                );
            const eventPayload = {
                cart_id: cartId,
                amount: orderDetailsData.cart.prices,
                shipping: shipping,
                payment: orderDetailsData.cart.selected_payment_method,
                products: orderDetailsData.cart.items
            };
            if (isPlacingOrder) {
                dispatch({
                    type: 'CHECKOUT_PLACE_ORDER_BUTTON_CLICKED',
                    payload: eventPayload
                });
            } else if (
                placeOrderData &&
                orderDetailsData?.cart.id === cartId &&
                !suppressOrderConfirmation
            ) {
                dispatch({
                    type: 'ORDER_CONFIRMATION_PAGE_VIEW',
                    payload: {
                        order_number:
                            placeOrderData.placeOrder.order.order_number,
                        ...eventPayload
                    }
                });
            }
        }
    }, [
        placeOrderButtonClicked,
        cartId,
        checkoutStep,
        orderDetailsData,
        cartItems,
        isLoading,
        dispatch,
        placeOrderData,
        isPlacingOrder,
        suppressOrderConfirmation,
        reviewOrderButtonClicked
    ]);

    return {
        activeContent,
        availablePaymentMethods: checkoutData
            ? checkoutData?.cart?.available_payment_methods
            : null,
        cartItems,
        checkoutStep,
        customer,
        error: checkoutError,
        guestSignInUsername,
        handlePlaceOrder,
        handlePlaceOrderEnterKeyPress,
        hasError: !!checkoutError,
        isCartEmpty: !(checkoutData && checkoutData?.cart?.total_quantity),
        isGuestCheckout: !isSignedIn,
        isLoading,
        isUpdating,
        orderDetailsData,
        orderDetailsLoading,
        orderNumber: suppressOrderConfirmation
            ? null
            : (placeOrderData && placeOrderData.placeOrder.order.order_number) || null,
        placeOrderLoading,
        placeOrderButtonClicked,
        setCheckoutStep,
        setGuestSignInUsername,
        setIsUpdating,
        setShippingInformationDone,
        setShippingMethodDone,
        setPaymentInformationDone,
        scrollShippingInformationIntoView,
        shippingInformationRef,
        shippingMethodRef,
        scrollShippingMethodIntoView,
        resetReviewOrderButtonClicked,
        handleReviewOrder,
        handleReviewOrderEnterKeyPress,
        reviewOrderButtonClicked,
        recaptchaWidgetProps,
        toggleAddressBookContent,
        toggleSignInContent
    };
};
