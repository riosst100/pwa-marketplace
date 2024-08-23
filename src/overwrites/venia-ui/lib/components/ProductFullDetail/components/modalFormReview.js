import React, { useState } from 'react';
import Modal from '@riosst100/pwa-marketplace/src/components/Modal';
import { X } from 'react-feather';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import Button from '@magento/venia-ui/lib/components/Button';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import { Form } from 'informed';
import StarRating from './starInput';

import { primary900 } from '@riosst100/pwa-marketplace/src/theme/vars';

const modalFormReview = (props) => {

    const { open, setOpen } = props;
    const [currentRating, setCurrentRating] = useState(0);

    const handleRatingChange = (newRating) => {
        setCurrentRating(newRating);
    };


    return (
        <>
            <Modal
                open={open}
                className="modal_form_review !p-[30px] md_min-w-[650px]"
            >
                <div className='form_review-container'>
                    <div className='header_title-modal flex justify-between mb-10'>
                        <div className='text-lg text-black font-medium'>
                            Write Review
                        </div>
                        <button onClick={() => { setOpen(!open) }} >
                            <X size={24} color={primary900} />
                        </button>
                    </div>

                    <Form
                        data-cy="form_review"
                        className="flex flex-col gap-y-6"
                        initialValues={{}}
                        onSubmit={() => { }}
                        onChange={() => { }}
                    >
                        <Field
                            id="nickname_field"
                            label={'Nickname'}
                        >
                            <TextInput
                                id="nickname"
                                field="nickname"
                                validate={isRequired}
                                validateOnBlur
                                mask={value => value && value.trim()}
                                maskOnBlur={true}
                                data-cy="nickname"
                                aria-label={'nickname'}
                                placeholder={'e.g John Doe'}
                            />
                        </Field>

                        <Field
                            id="rating_field"
                            label={'Rating'}
                        >
                            <StarRating rating={currentRating} onRatingChange={handleRatingChange} />
                        </Field>

                        <Field
                            id="summary_field"
                            label={'Summary'}
                        >
                            <TextInput
                                id="summary"
                                field="summary"
                                validate={isRequired}
                                validateOnBlur
                                mask={value => value && value.trim()}
                                maskOnBlur={true}
                                data-cy="summary"
                                aria-label={'summary'}
                                placeholder={'Summary of your rating'}
                            />
                        </Field>

                        <Field
                            id="review_field"
                            label={'Review'}
                        >
                            <TextInput
                                id="review"
                                field="review"
                                validate={isRequired}
                                validateOnBlur
                                mask={value => value && value.trim()}
                                maskOnBlur={true}
                                data-cy="review"
                                aria-label={'review'}
                                placeholder={'Let us know your thougts'}
                            />
                        </Field>

                        <Field
                            id="like_reason_field"
                            label={'I like about'}
                        >
                            <TextInput
                                id="like_reason"
                                field="like_reason"
                                validate={isRequired}
                                validateOnBlur
                                mask={value => value && value.trim()}
                                maskOnBlur={true}
                                data-cy="like_reason"
                                aria-label={'like_reason'}
                                placeholder={'Summary of your rating'}
                            />
                        </Field>

                        <Field
                            id="dont_like_reason_field"
                            label={"I dont't like about"}
                        >
                            <TextInput
                                id="dont_like_reason"
                                field="dont_like_reason"
                                validate={isRequired}
                                validateOnBlur
                                mask={value => value && value.trim()}
                                maskOnBlur={true}
                                data-cy="dont_like_reason"
                                aria-label={'dont_like_reason'}
                                placeholder={'Summary of your rating'}
                            />
                        </Field>

                        <div className='actions flex justify-end gap-x-2.5 mt-4'>
                            <Button
                                priority='low'
                                classes={{
                                    content: 'capitalize text-[16px] font-medium'
                                }}
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                priority='high'
                                classes={{
                                    content: 'capitalize text-[16px] font-medium'
                                }}
                            >
                                Submit Review
                            </Button>
                        </div>
                    </Form>
                </div>
            </Modal>
        </>
    )
}

export default modalFormReview