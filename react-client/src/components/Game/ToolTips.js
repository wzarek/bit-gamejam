import React from 'react'

const ToolTips = (props) => {

    return (
        <div className='absolute bottom-[2px] left-[2px] min-h-[150px] max-h-[250px] w-[960px] bg-black/70 text-white p-10 z-50'>
            {props.message}
        </div>
    )
}

export default ToolTips
