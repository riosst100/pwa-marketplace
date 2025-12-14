import React, { useCallback, useState } from 'react';
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
import { useToasts } from '@magento/peregrine/lib/Toasts/useToasts';
import { useRFQ } from '@riosst100/pwa-marketplace/src/talons/RFQ/useRFQ';

import "react-datepicker/dist/react-datepicker.css";

const RFQModalForm = (props) => {

    const { productId, open = false, setOpen = () => { } } = props;

    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();
    const { handleCreateQuickRfq, createState } = useRFQ();

    const [startDate, setStartDate] = useState(new Date());

    // Upload File with remove capability
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const onDrop = useCallback((accepted) => {
        setUploadedFiles(prev => [...prev, ...accepted]);
    }, []);

    const {
        getRootProps,
        getInputProps,
        isDragActive
    } = useDropzone({ onDrop });

    const handleRemoveFile = useCallback((index) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    }, []);

    const files = uploadedFiles.map((file, idx) => (
        <div key={(file.path || file.name) + idx} className='flex items-center justify-between gap-2 mb-1'>
            <span className='block font-medium'>
                {(file.path || file.name)} - {Math.round(file.size / 1000)} kB
            </span>
            <button
                type='button'
                className='text-red-600 text-sm underline'
                onClick={() => handleRemoveFile(idx)}
            >
                Remove
            </button>
        </div>
    ));

    const handleSubmit = useCallback(async values => {
        console.log('[RFQ] submit values', values);
        const input = {
            product_id: productId,
            quantity: values.quote_qty ? Number(values.quote_qty) : undefined,
            comment: values.quote_comment,
            customer_phone: values.phone_number,
            price_per_product: values.quote_price_per_unit
                ? Number(values.quote_price_per_unit)
                : undefined,
            date_need_quote: startDate ? startDate.toISOString() : undefined,
            files: uploadedFiles.length
                ? uploadedFiles.map(file => ({
                    file_name: (file && (file.name || file.path)) || '',
                    // Browsers do not expose real file system paths; use name as a stable placeholder
                    file_path: (file && (file.path || file.name)) || '',
                    // Ensure a valid MIME string; default if missing
                    file_type: (file && file.type) ? file.type : 'application/octet-stream'
                }))
                : undefined
        };

            console.log('[RFQ] input payload', input);

        Object.keys(input).forEach(key => input[key] === undefined && delete input[key]);

        try {
            const result = await handleCreateQuickRfq(input);
            console.log('[RFQ] mutation result', result);
            addToast({
                type: 'success',
                message: formatMessage({
                    id: 'productFullDetail.rfqSuccess',
                    defaultMessage: 'Quote request sent successfully.'
                }),
                timeout: 3000
            });
            setOpen(false);
        } catch (error) {
            console.error('[RFQ] createQuickRfq failed', error);
            addToast({
                type: 'error',
                message: formatMessage({
                    id: 'productFullDetail.rfqFailed',
                    defaultMessage: 'Unable to send quote request. Please try again.'
                }),
                timeout: 4000
            });
        }
    }, [uploadedFiles, addToast, formatMessage, handleCreateQuickRfq, setOpen, startDate]);

    return (
        <>
            <Modal
                open={open}
                className='!p-[20px] md_min-w-[550px] modal_bid'
            >
                <div className='modal_bid-content'>
                    <div className='header_title-modal flex justify-between mb-4'>
                        <div className='text-lg text-black font-medium'>
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

                    <div className='flex flex-col gap-y-[8px]'>
                        <Form
                            data-cy="form_bid"
                            className="flex flex-col gap-y-2"
                            initialValues={{}}
                            onSubmit={handleSubmit}
                            onChange={values => {
                                console.log('[RFQ] form change', values);
                            }}
                            onSubmitFailure={(errors, values) => {
                                console.warn('[RFQ] form submit failed', { errors, values });
                            }}
                        >
                        {({ formApi }) => (
                            <>
                            <div className="flex flex-col md_flex-row gap-2">
                                <div className="md_flex-1">
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
                                </div>
                                <div className="md_flex-1">
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
                                </div>
                            </div>

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
                                    placeholder={'(123) 456-7890'}
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
                                    className='border border-blue-600 rounded-md border-dashed flex flex-col justify-center items-center py-3'
                                >
                                    <input {...getInputProps()} />
                                    <DocumentUpload
                                        size="32"
                                        color="#f76b1c"
                                    />
                                    <div className='mt-2 text-blue-600'>Drop files or click here to upload</div>
                                </div>
                                {files && files.length > 0 && (
                                    <div className="wfp--dropzone__file-list mt-4">
                                        <ul>{files}</ul>
                                    </div>
                                )}
                            </section>


                            <div className='actions flex justify-end gap-x-2.5 mt-4'>
                                <Button
                                    priority='low'
                                    classes={{
                                        content: 'capitalize text-[16px] font-medium'
                                    }}
                                    type="button"
                                    onClick={() => {
                                        console.log('[RFQ] Cancel clicked, closing modal');
                                        setOpen(false);
                                    }}
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
                                        content: 'capitalize text-[16px] font-medium'
                                    }}
                                    type="button"
                                    onPress={() => {
                                        console.log('[RFQ] Submit pressed, calling formApi.submitForm()');
                                        formApi.submitForm();
                                    }}
                                    disabled={createState?.loading}
                                    data-cy="rfq-submit"
                                >
                                    {createState?.loading
                                        ? formatMessage({
                                            id: 'productFullDetail.SendingRequest',
                                            defaultMessage: 'Sending...'
                                        })
                                        : formatMessage({
                                            id: 'productFullDetail.SendRequest',
                                            defaultMessage: 'Send Request'
                                        })}
                                </Button>
                            </div>
                            </>
                        )}
                        </Form>
                    </div>
                </div>
            </Modal>
            <style jsx="true">
                {`
                    /* Modal container adjustments to prevent clipping */
                    .modal_bid-content {
                        max-height: 90vh;
                        overflow-y: auto;
                    }
                    @media (min-width: 768px) {
                        .md_min-w-[550px] {
                            min-width: 550px;
                        }
                    }
                    /* Ensure inner form sections don't overflow */
                    .wfp--dropzone {
                        max-width: 100%;
                    }
                    .react-datepicker__input-container>input:focus-visible,
                    .react-datepicker__input-container>input:focus, 
                    .react-datepicker__input-container>input:active {
                        outline: none;
                    }
                    .react-datepicker-popper[data-placement^=bottom] .react-datepicker__triangle::after {
                        left: 25px;
                    }
                    /* Keep datepicker within viewport */
                    .react-datepicker-popper {
                        z-index: 1000;
                    }
                `}
            </style>
        </>
    )
}

export default RFQModalForm;