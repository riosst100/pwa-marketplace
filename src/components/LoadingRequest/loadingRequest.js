import React from 'react';
import ReactDOM from 'react-dom';
import modalClasses from './loadingRequest.module.css';

// Simple portal root fallback
const getPortalRoot = () => {
    let root = document.getElementById('loading-request-portal');
    if (!root) {
        root = document.createElement('div');
        root.id = 'loading-request-portal';
        document.body.appendChild(root);
    }
    return root;
};

const LoadingRequest = props => {

    const {
        isLoading
    } = props;

    const modal = isLoading ? (
        <div className={modalClasses.overlay} role="dialog" aria-modal="true" aria-label="Modal">
            <div className={modalClasses.backdrop} />
            <div className={modalClasses.dialog}>
                <div className={modalClasses.body}>
                    <img src={process.env.MAGENTO_BACKEND_URL + "/media/images/spinner2.gif"} style={{"width":"15%"}} />
                    <div style={{
                        "marginTop": "10px",
                        "color": "white"
                    }}>Please wait...</div>
                </div>
            </div>
        </div>
    ) : null;

    return <>{isLoading ? ReactDOM.createPortal(modal, getPortalRoot()) : null}</>;
};

export default LoadingRequest;
