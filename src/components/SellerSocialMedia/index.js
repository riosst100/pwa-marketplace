import React from 'react';

const SellerSocialMedia = (props) => {

    const { seller } = props;

    const { twitter_id, facebook_id, youtube_id, instagram_id, linkedin_id } = seller;

    const socialMediaLinks = [
        {
            code: 'X',
            link: twitter_id
        },
        {
            code: 'Facebook',
            link: facebook_id
        },
        {
            code: 'Youtube',
            link: youtube_id
        },
        {
            code: 'Instagram',
            link: instagram_id
        },
        {
            code: 'LinkedIn',
            link: linkedin_id
        }
    ];

    const getLogo = (code) => {
        let img = '';
        if (code == "X") {
            img = 'https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg';
        }
        if (code == "Facebook") {
            img = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/1280px-Facebook_f_logo_%282019%29.svg.png';
        }
        if (code == "Youtube") {
            img = 'https://cdn3.iconfinder.com/data/icons/social-network-30/512/social-06-512.png';
        }
        if (code == "Instagram") {
            img = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/768px-Instagram_logo_2022.svg.png';
        }
        if (code == "LinkedIn") {
            img = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/LinkedIn_icon.svg/1024px-LinkedIn_icon.svg.png';
        }

        return img;
    }

    let sellerSocialMediaResult = [];

    if (socialMediaLinks && socialMediaLinks.length) {
        socialMediaLinks.forEach((socialMedia) => {
            if (socialMedia.code && socialMedia.link) {
                const logo = getLogo(socialMedia.code);
                sellerSocialMediaResult.push(
                    <a href={socialMedia.link} className='platform_logo-wrapper rounded-md px-5 py-2.5 border border-gray-100 flex items-center' target="_blank">
                        {logo ? <img
                            alt={socialMedia.code}
                            // width="auto"
                            // height={30}
                            src={logo}
                            style={{
                                "height":"20px"
                            }}
                        /> : socialMedia.code}
                    </a>
                )
            }
        })
    }

    return sellerSocialMediaResult && sellerSocialMediaResult.length ? <>
        <div class="flex items-start relative self-stretch w-full flex-[0_0_auto]">
            <div class="flex flex-col items-start gap-[15px] relative flex-1 grow">
                <div class="relative w-fit mt-[-1.00px] [font-family:'Frederik-DemiBold',Helvetica] font-bold text-[14px] tracking-[0] leading-[normal] whitespace-nowrap">Social Media</div>
                <div class="inline-flex items-center justify-center gap-[10px] relative flex-[0_0_auto]">
                    <div class="flex flex-col items-start gap-[10px]" style={
                        {
                            "display": "flex",
                            "flex-direction": "row",
                            "align-items": "center"
                        }
                    }>
                        {sellerSocialMediaResult}
                    </div>
                </div>
            </div>
        </div>
    </> : '';
}

export default SellerSocialMedia;