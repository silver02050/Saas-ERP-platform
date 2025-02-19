import React from 'react'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const Loading = ({size, classes}) => {
  return (
    <div className='w-full h-full z-50'>
        <FontAwesomeIcon className={`${classes} absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`} icon={faSpinner} size={size} color='#0460eb' spin />
    </div>
  )
}

export default Loading