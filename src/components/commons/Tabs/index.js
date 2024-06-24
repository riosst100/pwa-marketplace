import React from 'react';
import cn from 'classnames';

const Tabs = (props) => {
    const {
        data = [],
        onChange = () => { },
        hasContent = false,
        rootClassName = '',
        tabTitleClassName = '',
        tabContentContainerClassName = '',
        tabContentWrapperClassName = '',
        tabActiveClassName = '',
        tabWrapperClassName = '',
    } = props

    const [activeTabs, setActiveTabs] = React.useState(0);
    const rootClass = cn('mb-4 border-b border-gray-100', rootClassName);
    const tabTitleClass = cn('inline-block p-[10px] rounded-t-lg text-[14px] font-semibold', tabTitleClassName);
    const tabContainerClass = cn('tab-content-container', tabContentContainerClassName);
    const tabContentWrapperClass = cn('tab-content-wrapper', tabContentWrapperClassName);
    const tabActiveClass = cn('border-solid border-b-2', tabActiveClassName);
    const tabWrapperClass = cn('flex flex-wrap -mb-px text-base font-medium text-center gap-4', tabWrapperClassName);

    const handleSwicthTab = (index) => {
        setActiveTabs(index);
    }

    return (
        <>
            <div className={rootClass}>
                <ul className={tabWrapperClass} role='tablist'>
                    {data.map((item, index) => (
                        <li className='me-2' role='presentation'>
                            <button
                                className={cn(tabTitleClass, index === activeTabs ? tabActiveClass : '')}
                                id={item.id}
                                role='tab'
                                aria-controls={`${item.id}-tab`}
                                aria-selected='false'
                                onClick={(e) => {
                                    hasContent ? handleSwicthTab(index) : onChange(index, e);
                                    e.preventDefault();
                                }}
                            >
                                {item.title}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            {hasContent ? (
                <div className={tabContainerClass}>
                    {data.map((item, index) => (
                        <div className={cn(index !== activeTabs ? 'hidden' : '', tabContentWrapperClass)} role='tabpanel' aria-labelledby={`${item.id}-tab`}>
                            {item.content}
                        </div>
                    ))}
                </div>
            ) : null}
        </>
    )
}

export default Tabs