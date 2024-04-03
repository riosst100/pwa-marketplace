import React, { useEffect, useState, useRef } from 'react';
import cn from 'classnames';
import { ArrowDown2 } from 'iconsax-react';

const Dropdown = (props) => {
    const {
        placeholder, options, onSelect, rootClassName, className,
        optionsClassName, optionItemClassName,
    } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState('');
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleClick = (option) => {
        onSelect(option);
        setSelected(option.label)
        setIsOpen(false);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        const listener = document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div className={cn('dropdown relative', rootClassName)} ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className={cn(
                    'text-base text-gray-400 flex justify-between items-center gap-x-4 border',
                    'border-gray-100 border-solid rounded-md min-w-max px-2.5 py-2',
                    className
                )}
            >
                {selected ? selected : placeholder}
                <ArrowDown2
                    size={14}
                    className={cn(
                        ' text-gray-400 transition-all',
                        isOpen ? 'rotate-180' : 'rotate-0',
                    )}
                />
            </button>
            {isOpen && (
                <ul
                    className={cn(
                        'absolute rounded-md bg-white w-full p-2.5 mt-2 border border-gray-100',
                        optionsClassName,
                    )}
                >
                    {options.map((option) => (
                        <li
                            className={cn(
                                'cursor-pointer px-3 py-1.5 hover_bg-gray-100 rounded-md',
                                optionItemClassName
                            )}
                            key={option.value}
                            onClick={() => handleClick(option)}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dropdown;