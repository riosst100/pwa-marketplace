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

const SubFilterItemRadioGroup = props => {
    const { filterApi, filterState, group, items, onApply, labels,isListExpanded = true, itemCountToShow = 5 } = props;

    const radioItems = useMemo(() => {
        return items.map((item,index) => {
            if (!isListExpanded && index >= itemCountToShow) {
                return null;
            }

            const code = `item-${group}-${item.value}`;
            return (
                <FilterItemRadio
                    key={code}
                    filterApi={filterApi}
                    filterState={filterState}
                    group={group}
                    item={item}
                    onApply={onApply}
                    labels={labels}
                />
            );
        });
    }, [filterApi, filterState, group, items, labels, onApply,isListExpanded,itemCountToShow]);

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
        <RadioGroup isSubFilter={true} field={field} data-cy="FilterDefault-radioGroup">
            {radioItems}
        </RadioGroup>
    );
};

SubFilterItemRadioGroup.defaultProps = {
    onApply: null
};

SubFilterItemRadioGroup.propTypes = {
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

export default SubFilterItemRadioGroup;
