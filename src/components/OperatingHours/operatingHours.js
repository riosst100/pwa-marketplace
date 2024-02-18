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
    <>
        <tr>
            <td>{value.day}</td>
            <td>
                {value.status == "open" && value.time ? <Time times={value.time} /> : <tr><td>Closed</td></tr>}
            </td>
        </tr>
    </>)
}

const Time = ({ times }) => {
    return times ? times.map((value, index) => 
    <>
        <tr>
            <td>{value.opening_time} - {value.closing_time}</td>
        </tr>
    </>) : ''
}

export default OperatingHours;