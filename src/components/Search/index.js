import React from 'react';
import { SearchNormal } from 'iconsax-react';

const Search = () => {
    return (
        <>
            <div class="flex w-[600px] items-center gap-[20px] px-[15px] py-[12px] relative bg-white rounded-[30px] border border-solid border-[#e6e9ea]">
                <div class="flex items-center gap-[10px] relative flex-1 self-stretch grow">
                    <input className='flex-1 leading-[18px]' placeholder='Search...' />
                </div>
                <SearchNormal color="#280135" size={18} variant="Outline" />
            </div>
        </>
    )
}

export default Search;