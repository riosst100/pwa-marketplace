import React from 'react';
import Content from './relatedProduct';
import data from './sample.json';

const index = () => {

    const contetnProps = {
        data
    }

    return (
        <Content {...contetnProps} />
    )
}

export default index