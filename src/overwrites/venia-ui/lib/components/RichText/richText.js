import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './richText.module.css';
import cn from 'classnames';

const toHTML = str => ({ __html: str });

const RichText = (props) => {
    const { content, rootClassName } = props;
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div
            className={cn(classes.root, rootClassName)}
            dangerouslySetInnerHTML={toHTML(content)}
        />
    );
};

export default RichText;
