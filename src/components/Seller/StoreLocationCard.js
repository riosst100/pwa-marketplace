import React from 'react';
import { Location, Clock } from 'iconsax-react';
import OperatingHours from '@riosst100/pwa-marketplace/src/components/OperatingHours';

const StoreLocationCard = ({ store }) => {
    if (!store) {
        return null;
    }

    const { name, address_line_1, region, country, operating_hours } = store;

    const address = [address_line_1, region, country].filter(Boolean).join(', ');

    return (
        <div className="border border-[#E6E9EA] rounded-lg p-4 flex flex-col gap-2">
            <h3 className="font-bold text-base">{name}</h3>
            <div className="flex items-start gap-2">
                <Location size="18" color="#666" />
                <span className="text-sm text-gray-600">{address}</span>
            </div>
            <div className="flex flex-row gap-1">
                <Clock size="18" color="#666" />
                <OperatingHours values={operating_hours} simple={true} />
            </div>
        </div>
    );
};

export default StoreLocationCard;
