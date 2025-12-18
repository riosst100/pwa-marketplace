import React, { useMemo, useState, useEffect, useCallback } from 'react';
import AgeVerificationModal from '@riosst100/pwa-marketplace/src/components/AgeVerificationModal';
import { useHistory, useLocation } from 'react-router-dom';
import { useToasts } from '@magento/peregrine/lib/Toasts';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
import { useAgeVerification } from '@riosst100/pwa-marketplace/src/talons/AgeVerification/useAgeVerification'

const storage = new BrowserPersistence();

const AgeVerification = (props) => {
    const { pageType, product } = props;
    
    const [modalOpen, setModalOpen] = useState(false);

    const [month, setMonth] = useState("");
    const [day, setDay] = useState("");
    const [year, setYear] = useState("");
    const [ageVerificationErrorMessage, setAgeVerificationErrorMessage] = useState("");

    const history = useHistory();
    const location = useLocation();

    const [, { addToast }] = useToasts();

    const handleClose = () => setModalOpen(false);

    const {
        error,
        loading,
        ageVerificationConfig
     } = useAgeVerification({ pageType, product });

    const months = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    ];

    const savedAge = storage.getItem('age');
    
    useEffect(() => {
        if (ageVerificationConfig && ageVerificationConfig.status) {
            if (savedAge && savedAge > 18) {
                setModalOpen(false);
            } else {
                setModalOpen(true);
            }
        }
    }, [loading, setModalOpen, savedAge, ageVerificationConfig]);

    const redirectUser = () => {
        const currentPathname = location.pathname;
        let historyPathname = history.location.pathname;
        if (historyPathname == currentPathname) {
            historyPathname = '/';
        }

        addToast({
            type: 'error',
            message: 'Access is restricted because you are under 18 years old.',
            dismissable: true,
            timeout: 5000
        });

        history.push(historyPathname)
    };

    const handleUnderAge = useCallback(() => {
        redirectUser();
    }, [])

    const handleOverAge = useCallback(() => {
        if (!day || !month || !year) {
            setAgeVerificationErrorMessage('Please enter your birthday!');
            return false;
        }

        const birthDate = new Date(
            year,
            months.indexOf(month),
            day
        );
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const isBirthdayPassed =
        today >= new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());

        if (age > 18 || (age === 18 && isBirthdayPassed)) {
            storage.setItem('age', age);

            addToast({
                type: 'success',
                message: 'Thank you for confirming your age. Your birthday has been saved. You may now continue.',
                dismissable: true,
                timeout: 5000
            });
            
            handleClose();
            return true;
        }
        
        redirectUser();
        return;
    }, [day, month, year])

    

    return modalOpen ? (
        <AgeVerificationModal
            ageVerificationErrorMessage={ageVerificationErrorMessage}
            modalOpen={modalOpen}
            months={months}
            setMonth={setMonth}
            setDay={setDay}
            setYear={setYear}
            handleOverAge={handleOverAge}
            handleUnderAge={handleUnderAge}
        />
    ) : ''
};

export default AgeVerification;