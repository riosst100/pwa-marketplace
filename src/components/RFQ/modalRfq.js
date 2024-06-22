import React, { useState, useC } from 'react';
import Button from '@magento/venia-ui/lib/components/Button';
import Modal from '@riosst100/pwa-marketplace/src/components/Modal';
import { X } from 'react-feather';
import { primary900 } from '@riosst100/pwa-marketplace/src/theme/vars';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import TextArea from '@magento/venia-ui/lib/components/TextArea';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import DatePicker from "react-datepicker";
import { Form } from 'informed';
import { useIntl } from 'react-intl';
import { useDropzone } from "react-dropzone";
import { DocumentUpload } from 'iconsax-react';
import cn from 'classnames';

import "react-datepicker/dist/react-datepicker.css";

const RFQModalForm = (props) => {

    const { open = false, setOpen = () => { } } = props;
    const { formatMessage } = useIntl();

    const [startDate, setStartDate] = useState(new Date());

    // Upload FIle
    const {
        acceptedFiles,
        getRootProps,
        getInputProps,
        isDragActive
    } = useDropzone();

    const files = acceptedFiles.map((file) => (
        <div key={file.path} className='block font-medium mb-1'>
            {file.path} - {Math.round(file.size / 1000)} kB
        </div>
    ));

    return (
        <>
            <Modal
                open={open}
                className='!p-[30px] md_min-w-[550px] modal_bid'
            >
                <div className='modal_bid-content'>
                    <div className='header_title-modal flex justify-between mb-4'>
                        <div className='text-lg text-black font-semibold'>
                            {
                                formatMessage({
                                    id: 'productFullDetail.RequestQuote',
                                    defaultMessage:
                                        'Request a Quote'
                                })
                            }
                        </div>
                        <button onClick={() => { setOpen(!open) }} >
                            <X size={24} color={primary900} />
                        </button>
                    </div>

                    <div className='flex flex-col gap-y-[16px]'>
                        <Form
                            data-cy="form_bid"
                            className="flex flex-col gap-y-4"
                            initialValues={{}}
                            onSubmit={() => { }}
                            onChange={() => { }}
                        >
                            <Field
                                id="quote_price_per_unit_field"
                                label={
                                    formatMessage({
                                        id: 'productFullDetail.QuotePricePerUnit',
                                        defaultMessage:
                                            'Quote Price Per Unit'
                                    })
                                }
                            >
                                <TextInput
                                    id="quote_price_per_unit"
                                    field="quote_price_per_unit"
                                    validate={isRequired}
                                    validateOnBlur
                                    mask={value => value && value.trim()}
                                    maskOnBlur={true}
                                    data-cy="quote_price_per_unit"
                                    aria-label={'quote_price_per_unit'}
                                    placeholder={'10.00'}
                                />
                            </Field>

                            <Field
                                id="quote_qty_field"
                                label={
                                    formatMessage({
                                        id: 'productFullDetail.QuoteQuantity',
                                        defaultMessage:
                                            'Quote Quantity'
                                    })
                                }
                            >
                                <TextInput
                                    id="quote_qty"
                                    field="quote_qty"
                                    validate={isRequired}
                                    validateOnBlur
                                    mask={value => value && value.trim()}
                                    maskOnBlur={true}
                                    data-cy="quote_qty"
                                    aria-label={'quote_qty'}
                                    placeholder={'10'}
                                />
                            </Field>

                            <Field
                                id="date_need_quote_field"
                                label={
                                    formatMessage({
                                        id: 'productFullDetail.dateNeedQuote',
                                        defaultMessage:
                                            'Date Need Quote'
                                    })
                                }
                            >
                                <DatePicker
                                    className='w-full border border-gray-100 rounded-md px-[10px] py-[5px] min-h-[40px]'
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                />
                            </Field>

                            <Field
                                id="phone_number_field"
                                label={
                                    formatMessage({
                                        id: 'productFullDetail.phoneNumber',
                                        defaultMessage:
                                            'Phone Number'
                                    })
                                }
                            >
                                <TextInput
                                    id="phone_number"
                                    field="phone_number"
                                    validate={isRequired}
                                    validateOnBlur
                                    mask={value => value && value.trim()}
                                    maskOnBlur={true}
                                    data-cy="phone_number"
                                    aria-label={'phone_number'}
                                    placeholder={'10'}
                                />
                            </Field>

                            <Field
                                id="quote_comment_field"
                                label={
                                    formatMessage({
                                        id: 'productFullDetail.addYourComment',
                                        defaultMessage:
                                            'Add Your Comment'
                                    })
                                }
                            >
                                <TextArea
                                    id="quote_comment"
                                    field="quote_comment"
                                    validateOnBlur
                                    mask={value => value && value.trim()}
                                    maskOnBlur={true}
                                    data-cy="quote_comment"
                                    aria-label={'quote_comment'}
                                    placeholder={'Your Comment'}
                                />
                            </Field>

                            <section className="wfp--dropzone">
                                <div
                                    {...getRootProps({ isDragActive })}
                                    className='border border-blue-600 rounded-md border-dashed flex flex-col justify-center items-center py-6'
                                >
                                    <input {...getInputProps()} />
                                    <DocumentUpload
                                        size="32"
                                        color="#6243FA"
                                    />
                                    <div className='mt-2 text-blue-600'>Drop files or click here to upload</div>
                                </div>
                                {files && (
                                    <div className="wfp--dropzone__file-list mt-4">
                                        <ul>{files}</ul>
                                    </div>
                                )}
                            </section>


                            <div className='actions flex justify-end gap-x-2.5 mt-4'>
                                <Button
                                    priority='low'
                                    classes={{
                                        content: 'capitalize text-[16px] font-semibold'
                                    }}
                                    onClick={() => setOpen(false)}
                                >
                                    {
                                        formatMessage({
                                            id: 'productFullDetail.cancel',
                                            defaultMessage:
                                                'Cancel'
                                        })
                                    }
                                </Button>
                                <Button
                                    priority='high'
                                    classes={{
                                        content: 'capitalize text-[16px] font-semibold'
                                    }}
                                >
                                    {
                                        formatMessage({
                                            id: 'productFullDetail.SendRequest',
                                            defaultMessage:
                                                'Send Request'
                                        })
                                    }
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </Modal>
            <style jsx>
                {`
                    .react-datepicker__input-container>input:focus-visible,
                    .react-datepicker__input-container>input:focus, 
                    .react-datepicker__input-container>input:active {
                        outline: none;
                    }
                    .react-datepicker-popper[data-placement^=bottom] .react-datepicker__triangle::after {
                        left: 25px;
                    }
                `}
            </style>
        </>
    )
}

export default RFQModalForm;