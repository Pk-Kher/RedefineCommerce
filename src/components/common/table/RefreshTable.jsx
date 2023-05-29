import React from 'react'

const RefreshTable = ({refreshTableFunction}) => {

  return (
    <>
        <div className="relative inline-flex"> 
            <button onClick={()=>{refreshTableFunction()}} className="flex flex-wrap items-center text-sm px-3 py-2 bg-white border border-neutral-200 hover:border-neutral-300 text-gray-500 hover:text-gray-600"> 
                <span className="material-icons-outlined">autorenew</span> 
            </button> 
        </div>
    </>
  )
}

export default RefreshTable;