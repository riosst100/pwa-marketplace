import React from 'react';
import ReactDOM from 'react-dom';
import modalClasses from './ageVerificationModal.module.css';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { AlertTriangle } from 'react-feather';


// Simple portal root fallback
const getPortalRoot = () => {
    let root = document.getElementById('age-verification-portal');
    if (!root) {
        root = document.createElement('div');
        root.id = 'age-verification-portal';
        document.body.appendChild(root);
    }
    return root;
};

const AgeVerificationModal = props => {

    const {
        setMonth,
        setDay,
        setYear,
        handleOverAge,
        handleUnderAge,
        ageVerificationErrorMessage,
        modalOpen,
        months
    } = props;

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    const modal = modalOpen ? (
        <div className={modalClasses.overlay} role="dialog" aria-modal="true" aria-label="Modal">
            <div className={modalClasses.backdrop} />
            <div className={modalClasses.dialog}>
                <div className={modalClasses.body}>
                    <div><Icon src={AlertTriangle} attrs={{ width: 20 }} /></div>
                    <h2 className={modalClasses.title}>Are you over 18 years old?</h2>
                    <p>You must be at least 18 years old to access this page. Please verify your age.</p>
                    <label>Your Birthday</label>
                    <div className={modalClasses.birthday}>
                        {/* Month */}
                        <select onChange={(e) => setMonth(e.target.value)}>
                        <option value="">Month</option>
                        {months.map((m) => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                        </select>

                        {/* Day */}
                        <select onChange={(e) => setDay(e.target.value)}>
                        <option value="">Day</option>
                        {days.map((d) => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                        </select>

                        {/* Year */}
                        <select onChange={(e) => setYear(e.target.value)}>
                        <option value="">Year</option>
                        {years.map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                        </select>
                    </div>
                    {ageVerificationErrorMessage && <div>{ageVerificationErrorMessage}</div>}
                    <div className={modalClasses.actions}>
                        <button className={modalClasses.btnUnder} onClick={handleUnderAge}>I'm under 18 years old</button>
                        <button className={modalClasses.btnOver} onClick={handleOverAge}>I'm 18 years old</button>
                    </div>
                </div>
            </div>
        </div>
    ) : null;

    return <>{modalOpen ? ReactDOM.createPortal(modal, getPortalRoot()) : null}</>;
};

export default AgeVerificationModal;
