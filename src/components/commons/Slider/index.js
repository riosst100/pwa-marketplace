import React from 'react';
import cx from 'classnames';

const Slider = (props) => {
    const { rootClassname = '', seller } = props
    const rootClass = cx('slider-container', rootClassname)
    return (
        <div className={rootClass}>
            <img src={seller ? seller.image : ''} />
        </div>
    )
}

export default Slider