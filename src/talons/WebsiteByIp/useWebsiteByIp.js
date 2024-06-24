import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';

export const useWebsiteByIp = websiteCodeInUrl => {
    const [websiteByUserIpData, setWebsiteByUserIpData] = useState(null);

    useEffect(() => {
        if (!websiteCodeInUrl) {
            const fetchData = async () => {
                axios.get('https://extreme-ip-lookup.com/json/?key=NqwiAPsYZXoA3jwsnP7B').then((response) => {
                    let data = response.data;
                    if (data) {
                        setWebsiteByUserIpData(data)
                    }
                }).catch((error) => {
                });
            };
        
            fetchData();
        }
    }, [websiteCodeInUrl]);

    const getWebsiteByUserIp = useMemo(() => {
        if (websiteByUserIpData) {
            return websiteByUserIpData;
        } else {
            return null;
        }
    }, [websiteByUserIpData]);

    return {
        getWebsiteByUserIp
    };
};
