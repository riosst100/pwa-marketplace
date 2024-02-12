import React from 'react';
import cx from 'classnames';

const Slider = (props) => {
    const { rootClassname = '' } = props
    const rootClass = cx('slider-container', rootClassname)
    return (
        <div className={rootClass}>
            <img src="https://cdn.animaapp.com/projects/65c70e0e1dd7109c524e43af/releases/65c70e2bc3e635b310da0a17/img/rectangle-87.png" />
        </div>
    )
}

export default Slider