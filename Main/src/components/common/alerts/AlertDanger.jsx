import React from 'react'

export const AlertDanger = ({ message }) => {
  return (
    <div className="form-group text-red-800 bg-red-100 rounded-lg gap-2 sticky top-0 pb-2 pt-2 sticky-header z-30">
      <span className={'appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 sm:text-sm'}>
        {message}
      </span>
    </div>
  )
}
