import React from 'react';
import Content from './share';
import { useToasts } from '@magento/peregrine';
import { Info } from 'react-feather';
import Icon from '@magento/venia-ui/lib/components/Icon';

const index = (props) => {

    const [, { addToast }] = useToasts();

    const InfoIcon = <Icon size={20} src={Info} />;

    const location = window.location.href;
    const encodedUrl = encodeURIComponent(location);
    const subject = "Check out this awesome product!";
    const messageCopyContent = "Link has been copied.";

    const loginToastProps = {
        type: 'info',
        message: messageCopyContent,
        timeout: 5000
    }

    const handleShareLink = (type) => {
        switch (type) {
            case 'wa':
                window.open(`https://wa.me/?text=${encodedUrl}`);
                break;
            case 'fb':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(encodedUrl)}`);
                break;
            case 'email':
                window.open(`mailto:?subject=${subject}&body=${encodedUrl}`);
                break;
            case 'link':
                navigator.clipboard.writeText(location).then(() => {
                    addToast({ ...loginToastProps, icon: InfoIcon });
                }, (err) => {
                    console.error('Failed to copy content:', err);
                });
                break;
            default:
                break;
        }
    }
    return (
        <Content handleShareLink={handleShareLink} {...props} />
    )
}

export default index