import { useCallback, useEffect } from 'react';
import { useCarousel } from '@magento/peregrine';
import { generateUrlFromContainerWidth } from '@magento/peregrine/lib/util/imageUtils';
import {
    MESSAGE_TYPES,
    VALID_SERVICE_WORKER_ENVIRONMENT,
    sendMessageToSW
} from '@magento/peregrine/lib/util/swUtils';

export const useProductImageCarousel = props => {
    const { images, hoveredMedia, selectedMedia, type, imageWidth } = props;
    const [carouselState, carouselApi] = useCarousel(images);
    const { activeItemIndex, sortedImages } = carouselState;
    const { handlePrevious, handleNext, setActiveItemIndex } = carouselApi;

    const handleThumbnailClick = useCallback(
        index => {
            setActiveItemIndex(index);
        },
        [setActiveItemIndex]
    );

    // Whenever the incoming images changes reset the active item to the first.
    useEffect(() => {
        if (hoveredMedia || selectedMedia && selectedMedia.length) {

            // Extract the uid from the first element of selectedMedia
            const selectedMediaUid = hoveredMedia ? hoveredMedia[0].uid : selectedMedia[0].uid; // Get the uid from selectedMedia

            // Find the index of the image with the matching uid
            const selectedMediaIndex = sortedImages.findIndex(image => {
                return image.uid === selectedMediaUid;
            });

            if (selectedMediaIndex) {
                setActiveItemIndex(selectedMediaIndex);
            } else {
                setActiveItemIndex(0);
            }
        } else {
            setActiveItemIndex(0);
        }
    }, [sortedImages, selectedMedia, hoveredMedia, setActiveItemIndex]);

    useEffect(() => {
        if (VALID_SERVICE_WORKER_ENVIRONMENT) {
            const urls = images.map(
                ({ file }) =>
                    new URL(
                        generateUrlFromContainerWidth(file, imageWidth, type),
                        location.origin
                    ).href
            );
            sendMessageToSW(MESSAGE_TYPES.PREFETCH_IMAGES, {
                urls
            }).catch(err => {
                console.error(
                    'Unable to send PREFETCH_IMAGES message to SW',
                    err
                );
            });
        }
    }, [images, imageWidth, type]);

    const currentImage = sortedImages[activeItemIndex] || {};
    const altText = currentImage.label || 'image-product';

    return {
        currentImage,
        activeItemIndex,
        altText,
        handleNext,
        handlePrevious,
        handleThumbnailClick,
        sortedImages
    };
};
