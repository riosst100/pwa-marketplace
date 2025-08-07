import React, { useCallback } from 'react';
import { bool, shape, string } from 'prop-types';
import { Form } from 'informed';
import { useIntl } from 'react-intl';
import { useSearchBar } from '@magento/peregrine/lib/talons/SearchBar';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Autocomplete from '@magento/venia-ui/lib/components/SearchBar/autocomplete';
import defaultClasses from './arraySearchInput.module.css';
import Dropdown from '@riosst100/pwa-marketplace/src/components/Dropdown';
import cn from 'classnames';
import SearchField from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/components/SearchBar/searchField';
import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';
import { useArraySearchInput } from '@riosst100/pwa-marketplace/src/talons/ArraySearchInput/useArraySearchInput';

const ArraySearchInput = React.forwardRef((props, ref) => {
    const { isOpen, placeholder, setSearchQuery, active, setActive } = props;
    const talonProps = useArraySearchInput({ active });
    // const fieldState = useFieldState('search_query');
    const {
        containerRef,
        // handleChange,
        handleFocus,
        // handleSubmit,
        initialValues,
        isAutoCompleteOpen,
        setIsAutoCompleteOpen,
        valid
    } = talonProps;

    const handleSubmit = useCallback(
        ({ search_query }) => {
            return false;
        },
        []
    );

    const handleChange = useCallback(
        value => {
            // const hasValue = !!value;
            // const isValid = hasValue && value.length > 2;

            setSearchQuery(value)

            

            // setValid(isValid);
            // setIsAutoCompleteOpen(hasValue);
        },
        [setSearchQuery]
    );

    const classes = useStyle(defaultClasses, props.classes);
    const rootClassName = isOpen ? classes.root_open : classes.root;
    const { formatMessage } = useIntl();

    return (
        <div className={rootClassName} data-cy="ArraySearchInput-root" ref={ref}>
            <div ref={containerRef} className={classes.container}>
                <Form
                    autoComplete="off"
                    className={classes.form}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                >
                    <div
                        className={cn(
                            classes.search,
                            'flex flex-row relative border border-gray-100 rounded-full'
                        )}
                    >
                        <SearchField
                            addLabel={formatMessage({
                                id: 'global.clearText',
                                defaultMessage: 'Clear Text'
                            })}
                            isSearchOpen={isAutoCompleteOpen}
                            onChange={handleChange}
                            onFocus={handleFocus}
                        />
                    </div>
                </Form>
            </div>
        </div>
    );
});

export default ArraySearchInput;

ArraySearchInput.propTypes = {
    classes: shape({
        autocomplete: string,
        container: string,
        form: string,
        root: string,
        root_open: string,
        search: string
    }),
    isOpen: bool
};
