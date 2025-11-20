import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '@magento/venia-ui/lib/components/Button';
import { Message } from '@magento/venia-ui/lib/components/Field';
import { useDeleteAccount } from '@riosst100/pwa-marketplace/src/talons/AccountInformationPage/useDeleteAccount';

const DeleteAccount = () => {
    const [confirm, setConfirm] = useState(false);
    const [agreement, setAgreement] = useState(false);

    const { loading, error, success, handleDeleteAccount } = useDeleteAccount();

    const handleChange = (event) => {
        setAgreement(event.target.checked);
    }

    return (
        <div style={{ marginTop: 32, border: '1px solid #f87171', padding: 24, borderRadius: 8, background: '#fef2f2' }}>
            <div style={{ color: '#b91c1c', fontWeight: 600, marginBottom: 8 }}>
                <FormattedMessage
                    id="deleteAccount.title"
                    defaultMessage="Delete Account"
                />
            </div>
            <div style={{ color: '#b91c1c', marginBottom: 16 }}>
                <FormattedMessage
                    id="deleteAccount.warning"
                    defaultMessage="Warning: This action cannot be undone. All your data will be permanently deleted."
                />
            </div>
            {error && (
                <Message type="error">
                    {error}
                </Message>
            )}
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
                <input
                    type="checkbox"
                    id="agreement"
                    checked={agreement}
                    onChange={handleChange}
                    style={{ marginRight: 8 }}
                />
                <label htmlFor="agreement" style={{ fontWeight: 'normal', fontSize: 14 }}>
                    <FormattedMessage
                        id="deleteAccount.agreementLabel"
                        defaultMessage="I understand and agree to delete my account permanently."
                    />
                </label>
            </div>
            {confirm ? (
                <div>
                    <div style={{ marginBottom: 16 }}>
                        <FormattedMessage
                            id="deleteAccount.confirm"
                            defaultMessage="Are you sure you want to delete your account? This action is irreversible."
                        />
                    </div>
                    <Button
                        priority="high"
                        disabled={loading || !agreement}
                        onClick={handleDeleteAccount}
                        style={{ marginRight: 8, textTransform: 'none' }}
                    >
                        <FormattedMessage
                            id="deleteAccount.confirmButton"
                            defaultMessage="Yes, Delete My Account"
                        />
                    </Button>
                    <Button
                        priority="normal"
                        disabled={loading}
                        onClick={() => setConfirm(false)}
                        style={{ textTransform: 'none' }}
                    >
                        <FormattedMessage
                            id="deleteAccount.cancelButton"
                            defaultMessage="Cancel"
                        />
                    </Button>
                </div>
            ) : (
                <Button
                    priority="high"
                    disabled={loading || !agreement}
                    onClick={() => setConfirm(true)}
                    style={{ textTransform: 'none' }}
                >
                    <FormattedMessage
                        id="deleteAccount.deleteButton"
                        defaultMessage="Delete My Account"
                    />
                </Button>
            )}
        </div>
    );
};

export default DeleteAccount;
