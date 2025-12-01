import React, { useMemo, useState, useEffect } from 'react';
import Modal from '@riosst100/pwa-marketplace/src/components/Modal';
import { X } from 'react-feather';
import { Text } from 'informed';

import Field from '@magento/venia-ui/lib/components/Field';
// import TextInput from '@magento/venia-ui/lib/components/TextInput';
import Button from '@magento/venia-ui/lib/components/Button';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import StarRating from './starInput';

import { primary900 } from '@riosst100/pwa-marketplace/src/theme/vars';
import { useReviewModal } from '@riosst100/pwa-marketplace/src/talons/ReviewModal/useReviewModal';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from '../orderRow.module.css';
import cn from 'classnames';

import { arrayOf, number, shape, string } from 'prop-types';
import { ChevronDown, ChevronUp } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';
import Price from '@magento/venia-ui/lib/components/Price';

import Icon from '@magento/venia-ui/lib/components/Icon';
import CollapsedImageGallery from '../collapsedImageGallery';
import OrderProgressBar from '../orderProgressBar';
import OrderDetails from '../OrderDetails';
import { Verify, Shop, ConvertCard } from 'iconsax-react';
import PlaceholderImage from '@magento/venia-ui/lib/components/Image/placeholderImage';
import { Link, useHistory } from 'react-router-dom';

const ReviewModal = (props) => {
    const { reviewOrder, setReviewOrder } = props;

    const [submitting, setSubmitting] = useState(false)

    const classes = useStyle(defaultClasses, props.classes);

    const talonProps = useReviewModal({ reviewOrder, setSubmitting });

    const { 
        ratingsMetadata,
        loadingRatingsMetadata,
        handleSubmitReview,
        loadingCreateReview,
        errorCreateReview,
        defaultNickname,
        handleToastAction
     } = talonProps;

    const [formState, setFormState] = useState({ nickname: defaultNickname || '' });

    useEffect(() => {
        if (reviewOrder && defaultNickname && !formState.nickname) {
            setFormState(prev => ({ ...prev, nickname: defaultNickname }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reviewOrder, defaultNickname]);

    // ratings: [{ id, value_id }]
    const [ratings, setRatings] = useState(null);

    const handleRatingChange = (id, value_id) => {
        // setRatings(prev => {
        //     const filtered = prev.filter(r => r.id !== id);
        //     return [...filtered, { id, value_id }];
        // });
        setRatings(value_id)
    };

    const handleChange = (field, value) => {
        setFormState(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if (onSubmit) {
        //     onSubmit({ ...formState, ratings });
        // }
        setSubmitting(true);
        const input = {
            nickname: formState.nickname,
            summary: formState.summary,
            text: formState.review,
            sku: e.target.sku.value,
            ratings: [{
                id: ratingsMetadata.id,
                value_id: ratings
            }]
        };
        const result = await handleSubmitReview(input);
        setSubmitting(false);
        if (result.success) setReviewOrder(null);
    };

    // Helper to resolve a product image by SKU with graceful fallback, now prefers product_image_url from order.items
    const getThumbnailForSku = (sku, fallbackLabel, idx) => {
        let url = null;
        let label = fallbackLabel;
        // Prefer product_image_url from order.items if present and is a non-empty string
        if (reviewOrder && reviewOrder.items && reviewOrder.items[idx] && typeof reviewOrder.items[idx].product_image_url === 'string' && reviewOrder.items[idx].product_image_url.trim() !== '') {
            url = reviewOrder.items[idx].product_image_url;
        } else if (imagesData && typeof imagesData === 'object') {
            const byKey = sku && imagesData[sku];
            const byValue = !byKey && sku
                ? Object.values(imagesData).find(entry => entry?.sku === sku)
                : null;
            const chosen = byKey || byValue;
            if (chosen?.thumbnail?.url && typeof chosen.thumbnail.url === 'string' && chosen.thumbnail.url.trim() !== '') {
                url = chosen.thumbnail.url;
                label = chosen.thumbnail.label || label;
            }
        }
        // If url is not a non-empty string, fallback to null (will trigger placeholder)
        if (typeof url !== 'string' || url.trim() === '') {
            url = null;
        }
        return { url, label };
    };

    const ratingStars = useMemo(() => {
        if (!ratingsMetadata) {
            return '';
        }

        // Find value (1-5) for selected value_id
        const selectedValue = ratings && ratingsMetadata.values.find(v => v.value_id === ratings) || '';

        let starButtons = [];

        [1,2,3,4,5].map(star => {
            const valObj = ratingsMetadata.values.find(v => v.value === String(star));
            if (valObj) {
                starButtons.push(
                    <button
                        key={valObj.value_id}
                        type="button"
                        aria-label={`${star} star${star > 1 ? 's' : ''}`}
                        className={`focus:outline-none ${selectedValue.value == star ? 'text-yellow-400' : 'text-gray-300'}`}
                        onClick={() => handleRatingChange(ratingsMetadata.id, valObj.value_id)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill={selectedValue.value >= star ? '#F7C317' : '#D9D9D9'} viewBox="0 0 20 20" width="25" height="25">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                        </svg>
                    </button>
                );
            }
        });

        return (
            <div className="mb-2">
                <label className="block mb-1 font-bold text-gray-700">{ratingsMetadata.name}</label>
                <div className="flex items-center gap-1">
                    {starButtons}
                </div>
            </div>
        );
    }, [ratingsMetadata, ratings]);

    return (
        <>
            <Modal
                open={reviewOrder}
                className="modal_form_review !p-[30px] md_min-w-[650px]"
            >
                <div className='form_review-container'>
                    <div className='header_title-modal flex justify-between mb-5'>
                        <div className='text-lg text-black font-medium'>
                            Write Review
                        </div>
                        <button onClick={() => { setReviewOrder(!reviewOrder) }} >
                            <X size={24} color={primary900} />
                        </button>
                    </div>
                    
                        {/* <Field id="nickname_field" label={'Nickname'}>
                            <input
                                id="nickname"
                                name="nickname"
                                type="text"
                                required
                                readOnly
                                value={formState.nickname || ''}
                                onChange={e => handleChange('nickname', e.target.value)}
                                data-cy="nickname"
                                aria-label={'nickname'}
                                placeholder={'e.g John Doe'}
                                className="border border-gray-100 rounded px-3 py-2 bg-gray-50 cursor-not-allowed"
                                aria-readonly="true"
                            />
                        </Field> */}
                        {/* Ratings breakdown from metadata */}
                        {reviewOrder && reviewOrder.items && reviewOrder.items.length > 0 && reviewOrder.items.map((it, idx) => {
                            const { url, label } = getThumbnailForSku(it.product_sku, it.product_name, idx);
                            return (
                                <>
                                <form className="flex flex-col gap-y-3" onSubmit={handleSubmit}>
                                <div key={it.id || idx} className='flex flex-row gap-4 mb-1 justify-between' style={{
                                    "borderBottom": "1px solid #e6e9ea",
                                    "paddingBottom": "10px"
                                }}>
                                    <div className={classes.productImage}>
                                        {url ? (
                                            <img
                                                src={url}
                                                alt={label}
                                                width={80}
                                                className={classes.thumbnail}
                                            />
                                        ) : (
                                            <PlaceholderImage alt={it.product_name} classes={{ root: classes.thumbnail }} width={60} />
                                        )}
                                    </div>
                                    <div className='flex flex-col gap-1 pb-2 last_pb-0 max-w-[375px]'>
                                        <div className={cn(classes.productName, 'text-[14px] font-medium')}>
                                            <span>{it.product_name}</span>
                                        </div>
                                        <div className="text-[12px]">
                                            <span>x{`${it.quantity_ordered}`}</span>
                                        </div>
                                    </div>
                                    <div class="flex flex-col gap-1 pb-2 last_pb-0 justify-center">
                                        <div class="text-[14px] text-blue-700">
                                            <span><Price currencyCode={it?.product_sale_price?.currency} value={it?.product_sale_price?.value} /></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-y-3">
                                    {loadingRatingsMetadata ? (
                                        <div>Loading ratings...</div>
                                    ) : ratingStars}
                                </div>
                                <input type="hidden" id="sku" name="sku" value={it.product_sku} />
                                {/* <Field id="summary_field" label={'Summary'}>
                                    <input
                                        id="summary"
                                        name="summary"
                                        type="text"
                                        required
                                        value={formState.summary || ''}
                                        onChange={e => handleChange('summary', e.target.value)}
                                        data-cy="summary"
                                        aria-label={'summary'}
                                        placeholder={'Summary of your rating'}
                                        className="border border-gray-100 rounded px-3 py-2"
                                    />
                                </Field> */}
                                <Field id="summary_field" label={'Summary'}>
                                    <input
                                        id="summary"
                                        name="summary"
                                        type="text"
                                        required
                                        value={formState.summary || ''}
                                        onChange={e => handleChange('summary', e.target.value)}
                                        data-cy="summary"
                                        aria-label={'summary'}
                                        placeholder={'Summary of your rating'}
                                        className="border border-gray-100 rounded px-3 py-2"
                                    />
                                </Field>
                                <Field id="review_field" label={'Review'}>
                                    <textarea
                                        id="review"
                                        name="review"
                                        required
                                        value={formState.review || ''}
                                        onChange={e => handleChange('review', e.target.value)}
                                        data-cy="review"
                                        aria-label={'review'}
                                        placeholder={'Let us know your thoughts'}
                                        className="border border-gray-100 rounded px-3 py-2"
                                        rows={3}
                                    />
                                </Field>
                                <div className='actions flex justify-end gap-x-2.5 mt-4'>
                            {/* <Button
                                priority='low'
                                classes={{
                                    content: 'capitalize text-[16px] font-medium'
                                }}
                                onClick={() => setReviewOrder(false)}
                                type="button"
                            >
                                Cancel
                            </Button> */}
                            <Button
                                priority='high'
                                classes={{
                                    content: 'capitalize text-[16px] font-medium'
                                }}
                                type="submit"
                                disabled={submitting}
                            >
                                {submitting ? 'Submitting...' : 'Submit Review'}
                            </Button>
                        </div>
                    </form>
                                </>
                            );
                        })}
                        
                </div>
            </Modal>
        </>
    );
};

export default ReviewModal;