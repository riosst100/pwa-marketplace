import React from 'react';

const OperatingHours = ({ values }) => {
    return <>
        <table>
            {values ? <Hours values={values} /> : ''}
        </table>
    </>
}

const Hours = ({ values }) => {
    return values && values.map((value, index) => 
        <span key={index}>
            <tr>
                <td style={{"verticalAlign":"top"}}>{value.day}</td>
                <td style={{"paddingLeft":"20px"}}>{value.status == "open" && value.time ? <Time times={value.time} /> : 'Closed'}</td>
            </tr>
            <br />
        </span>
    )
}

const Time = ({ times }) => {
    return times ? times.map((value, index) => 
        <tr key={index}>
            <td style={{"paddingBottom": times.length > 1 && index != times.length ? "10px" : "0px"}}>
                {value.opening_time} - {value.closing_time}
            </td>
        </tr>
    ) : ''
}

export default OperatingHours;