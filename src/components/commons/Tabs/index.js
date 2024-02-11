import React from 'react';
import cx from 'classnames';

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
    } = props

    const [activeTabs, setActiveTabs] = React.useState(0);
    const rootClass = cx('mb-4 border-b border-gray-200 dark:border-gray-700', rootClassName);
    const tabTitleClass = cx('inline-block p-4 rounded-t-lg', tabTitleClassName);
    const tabContainerClass = cx('tab-content-container', tabContentContainerClassName);
    const tabContentWrapperClass = cx('tab-content-wrapper', tabContentWrapperClassName);
    const tabActiveClass = cx('border-solid border-b-2', tabActiveClassName)

    const handleSwicthTab = (index) => {
        setActiveTabs(index);
    }

    return (
        <>
            <div className={rootClass}>
                <ul className='flex flex-wrap -mb-px text-sm font-medium text-center' role='tablist'>
                    {data.map((item, index) => (
                        <li className='me-2' role='presentation'>
                            <button
                                className={cx(tabTitleClass, index === activeTabs ? tabActiveClass : '')}
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
                        <div className={cx(index !== activeTabs ? 'hidden' : '', tabContentWrapperClass)} role='tabpanel' aria-labelledby={`${item.id}-tab`}>
                            {item.content}
                        </div>
                    ))}
                </div>
            ) : null}
        </>
    )
}

export default Tabs