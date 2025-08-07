import React, { useMemo, useEffect } from 'react';
import {
    arrayOf,
    func,
    number,
    oneOfType,
    shape,
    string,
    instanceOf
} from 'prop-types';
import setValidator from '@magento/peregrine/lib/validators/set';
import RadioGroup from '@magento/venia-ui/lib/components/RadioGroup';
import FilterItemRadio from './filterItemRadio';
import { useFieldApi } from 'informed';
import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';
import FilterBlock from '@riosst100/pwa-marketplace/src/overwrites/venia-ui/lib/components/FilterModal/filterBlock';

const FilterItemRadioGroup = props => {
    const { filterApi, subFilterItems, allowedSubFilters, subFilter, filterState, group, isSubFilter, items, onApply, labels,isListExpanded = true, itemCountToShow = 5 } = props;
    const radioItems = useMemo(() => {
        return items.map((item,index) => {
            if (index >= itemCountToShow) {
                return null;
            }

            const code = `item-${group}-${item.value}`;

            // if (allowedSubFilters.length && !allowedSubFilters.includes(item.title)) {
            //     return '';
            // }

            // let newAllowedSubFilters = [];
            
            // if (subFilter && subFilterItems) {
            //     const result = subFilterItems.find(item => item.attribute_code === "card_release" || item.attribute_code === "sc_release");

            //     // Ambil options jika ditemukan
            //     const options = result ? result.options : [];
            //     const option = options ? options.find(option => option.option_label === item.title) : [];
            //     if (option) {
            //         newAllowedSubFilters = option.sub_option_labels;
            //     }

            //     // console.log(newAllowedSubFilters)
            // }
            
            return (
                <>
                    <FilterItemRadio
                        key={code}
                        filterApi={filterApi}
                        filterState={filterState}
                        group={group}
                        item={item}
                        onApply={onApply}
                        labels={labels}
                    />
                    {/* {subFilter && <FilterBlock
                        key={subFilter.key}
                        filterApi={subFilter.filterApi}
                        filterState={subFilter.filterState}
                        filterFrontendInput={subFilter.filterFrontendInput}
                        group={subFilter.group}
                        allowedSubFilters={newAllowedSubFilters}
                        subFilterItems={subFilterItems}
                        isSubFilter={true}
                        items={subFilter.items}
                        name={''}
                        onApply={subFilter.onApply}
                        initialOpen={true}
                    />} */}
                    {/* {subFilterBlock} */}
                </>
            );
        });
    }, [filterApi, allowedSubFilters, subFilter, filterState, group, items, labels, onApply,isListExpanded,itemCountToShow]);

    const fieldValue = useMemo(() => {
        if (filterState) {
            for (const item of items) {
                if (filterState.has(item)) {
                    return item.value;
                }
            }
        }

        return null;
    }, [filterState, items]);
    const field = `item-${group}`;
    const fieldApi = useFieldApi(field);
    const fieldState = useFieldState(field);
    useEffect(() => {
        if (field && fieldValue === null) {
            fieldApi.reset();
        } else if (field && fieldValue !== fieldState.value) {
            fieldApi.setValue(fieldValue);
        }
    }, [field, fieldApi, fieldState.value, fieldValue]);

    return (
        <RadioGroup isSubFilter={isSubFilter} field={field} data-cy="FilterDefault-radioGroup">
            {radioItems}
        </RadioGroup>
    );
};

FilterItemRadioGroup.defaultProps = {
    onApply: null
};

FilterItemRadioGroup.propTypes = {
    filterApi: shape({
        toggleItem: func.isRequired
    }).isRequired,
    filterState: setValidator,
    group: string.isRequired,
    items: arrayOf(
        shape({
            title: string.isRequired,
            value: oneOfType([number, string]).isRequired,
            path: string
        })
    ).isRequired,
    onApply: func,
    labels: instanceOf(Map).isRequired
};

export default FilterItemRadioGroup;
