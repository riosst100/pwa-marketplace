import React from 'react';
import Divider from '@riosst100/pwa-marketplace/src/components/Divider';

const LinkToOtherStores = (props) => {

    const { productDetails } = props;

    const linkToOtherStores = productDetails?.link_to_other_stores;

    // Convert the JSON string to an array
    // const storesArray = JSON.parse(linkToOtherStores);
    const storesArray = [
        {
            'product_link': 'https://shopee.sg',
            'stores': 'Shopee'
        },
        {
            'product_link': 'https://tokopedia.com',
            'stores': 'Tokopedia'
        },
        {
            'product_link': 'https://lazada.sg',
            'stores': 'Lazada'
        }
    ];

    const getLogo = (stores) => {
        let img = '';
        if (stores == "Shopee") {
            img = 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee.svg';
        }
        if (stores == "Tokopedia") {
            img = 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Tokopedia.svg';
        }
        if (stores == "Lazada") {
            img = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Lazada_%282019%29.svg/1200px-Lazada_%282019%29.svg.png';
        }

        return img;
    }

    let finalLinkToOtherStores = [];

    if (storesArray && storesArray.length) {
        storesArray.forEach((store) => {
            if (store.product_link) {
                const logo = getLogo(store.stores);
                finalLinkToOtherStores.push(
                    <a href={store.product_link} className='platform_logo-wrapper rounded-md px-5 py-2.5 border border-gray-100 flex items-center' target="_blank">
                        {logo ? <img
                            alt={store.stores}
                            width={60}
                            height={30}
                            src={logo}
                        /> : store.stores   }
                    </a>
                )
            }
        })
    }

    return finalLinkToOtherStores && finalLinkToOtherStores.length ? <>
        <section className='product_from-other-platform py-xs'>
            <div className='title-section text-gray-400 text-sm flex mb-3 pl-[1rem]'>
                Also available in
            </div>
            <div className='content-section platform-container flex gap-x-2.5 pl-[1rem]'>
                {finalLinkToOtherStores}
            </div>
        </section>
    </> : '';
}

export default LinkToOtherStores;