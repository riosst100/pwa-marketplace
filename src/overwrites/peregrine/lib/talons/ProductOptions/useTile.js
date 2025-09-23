import { useCallback, useMemo } from 'react';

export const useTile = props => {
    const { onClick, value_index, itemVariant, setHoveredMedia } = props;

    const handleClick = useCallback(() => {
        onClick(value_index);
    }, [value_index, onClick]);
    
    const handleMouseEnter = useCallback(() => {
        var variantMedia = itemVariant
        ? itemVariant[0].product.media_gallery_entries
        : null;

        setHoveredMedia(variantMedia);
    }, [setHoveredMedia, itemVariant, value_index]);

    const handleMouseLeave = useCallback(() => {
        setHoveredMedia(null);
    }, [setHoveredMedia]);

    const variantImg = useMemo(() => {
        let variantImg = '';
        if (itemVariant) {
            if (itemVariant.length > 0) {
                const firstVariant = itemVariant[0];
            
                // Accessing media_gallery_entries
                const mediaGalleryEntries = firstVariant.product.media_gallery_entries;
            
                // Extracting file paths
                const mediaFiles = mediaGalleryEntries.map(entry => entry.file);
                variantImg = mediaFiles[0];
            }
        }
        return variantImg;
    }, [itemVariant]);

    // const variantImg = "https://down-sg.img.susercontent.com/file/sg-11134207-7rbk0-lkkqr1dahoah2c";

    return {
        handleClick,
        handleMouseEnter,
        handleMouseLeave,
        variantImg
    };
};
