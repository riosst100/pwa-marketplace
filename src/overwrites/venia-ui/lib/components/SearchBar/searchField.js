import React from 'react';
import { func } from 'prop-types';
import { useSearchField } from '@magento/peregrine/lib/talons/SearchBar';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import Trigger from '@magento/venia-ui/lib/components/Trigger';
import { SearchNormal } from 'iconsax-react';
import cn from 'classnames';

const SearchField = props => {
    const { isSearchOpen, onChange, onFocus, addLabel } = props;
    const { inputRef, resetForm, value } = useSearchField({ isSearchOpen });

    const handleSearch = () => {
    }
    const searchButton =
        <Trigger
            action={handleSearch}
            addLabel={addLabel}
            classes={{
                root: 'bg-transparent'
            }}
            style={{
                "paddingRight":"1rem"
            }}
        >
            <SearchNormal size="18" color="#280135" variant="Outline" />
        </Trigger>

    return (
        <TextInput
            id="search_query"
            after={searchButton}
            field="search_query"
            data-cy="SearchField-textInput"
            onFocus={onFocus}
            onValueChange={onChange}
            forwardedRef={inputRef}
            className={{
                inputClassName: cn('border-none bg-transparent rounded-r-full')
            }}
            placeholder="Search..."
        />
    );
};

export default SearchField;

SearchField.propTypes = {
    onChange: func,
    onFocus: func
};
