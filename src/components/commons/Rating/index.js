import React from 'react';
import { Star1 } from 'iconsax-react';

const Rating = ({ percentage = 0, starSize = 16 }) => {
    const totalStars = 5;
    const filledStars = Math.round((percentage / 100) * totalStars);

    const stars = [];
    for (let i = 0; i < totalStars; i++) {
        if (i < filledStars) {
            stars.push(
                <Star1
                    key={`star-filled-${i}`}
                    color="#F7C317"
                    size={starSize}
                    className="fill-[#F7C317]"
                />
            );
        } else {
            stars.push(
                <Star1
                    key={`star-empty-${i}`}
                    color="#D9D9D9"
                    size={starSize}
                    className="fill-[#D9D9D9]"
                />
            );
        }
    }

    return <div className="flex items-center">{stars}</div>;
};

export default Rating;
