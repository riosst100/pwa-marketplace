import React, { useState, useEffect } from 'react';
import Modal from '@riosst100/pwa-marketplace/src/components/Modal';
import { X } from 'react-feather';
import Field from '@magento/venia-ui/lib/components/Field';
// import TextInput from '@magento/venia-ui/lib/components/TextInput';
import Button from '@magento/venia-ui/lib/components/Button';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import StarRating from './starInput';

import { primary900 } from '@riosst100/pwa-marketplace/src/theme/vars';

const ModalFormReview = (props) => {
    const { reviewOrder, setReviewOrder, ratingsMetadata = [], loadingRatingsMetadata, onSubmit, submitting, defaultNickname } = props;

    const [formState, setFormState] = useState({ nickname: defaultNickname || '' });

    useEffect(() => {
        if (reviewOrder && defaultNickname && !formState.nickname) {
            setFormState(prev => ({ ...prev, nickname: defaultNickname }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reviewOrder, defaultNickname]);

    // ratings: [{ id, value_id }]
    const [ratings, setRatings] = useState([]);

    const handleRatingChange = (id, value_id) => {
        setRatings(prev => {
            const filtered = prev.filter(r => r.id !== id);
            return [...filtered, { id, value_id }];
        });
    };

    const handleChange = (field, value) => {
        setFormState(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit({ ...formState, ratings });
        }
    };

    return (
        <>
            <Modal
                reviewOrder={reviewOrder}
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
                    <form className="flex flex-col gap-y-3" onSubmit={handleSubmit}>
                        <Field id="nickname_field" label={'Nickname'}>
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
                        </Field>
                        {/* Ratings breakdown from metadata */}
                        <div className="flex flex-col gap-y-3">
                        {loadingRatingsMetadata ? (
                            <div>Loading ratings...</div>
                        ) : ratingsMetadata.length > 0 ? (
                            ratingsMetadata.map(rating => {
                                const selected = ratings.find(r => r.id === rating.id)?.value_id || '';
                                // Find value (1-5) for selected value_id
                                const selectedValue = rating.values.find(v => v.value_id === selected)?.value || '';
                                return (
                                    <div key={rating.id} className="mb-2">
                                        <label className="block mb-1 font-bold text-gray-700">{rating.name}</label>
                                        <div className="flex items-center gap-1">
                                            {[1,2,3,4,5].map(star => {
                                                const valObj = rating.values.find(v => v.value === String(star));
                                                if (!valObj) return null;
                                                return (
                                                    <button
                                                        key={valObj.value_id}
                                                        type="button"
                                                        aria-label={`${star} star${star > 1 ? 's' : ''}`}
                                                        className={`focus:outline-none ${selectedValue == star ? 'text-yellow-400' : 'text-gray-300'}`}
                                                        onClick={() => handleRatingChange(rating.id, valObj.value_id)}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill={selectedValue >= star ? '#F7C317' : '#D9D9D9'} viewBox="0 0 20 20" width="15" height="15">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                                                        </svg>
                                                    </button>
                                                );
                                            })}
                                            {/* <span className="ml-2 text-sm text-gray-600">{selectedValue || ''}</span> */}
                                        </div>
                                    </div>
                                );
                            })
                        ) : null}
                        </div>
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
                            <Button
                                priority='low'
                                classes={{
                                    content: 'capitalize text-[16px] font-medium'
                                }}
                                onClick={() => setReviewOrder(false)}
                                type="button"
                            >
                                Cancel
                            </Button>
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
                </div>
            </Modal>
        </>
    );
};

export default ModalFormReview;