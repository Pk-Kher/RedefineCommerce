import React from 'react';

function CheckBoxAction({ selectedFlatRows, setStores }) {
    const handleonClick = () => {
        setStores(() => {
            return selectedFlatRows.map((row) => row.original);
        });
    }
    return (
        <>
            <div className="flex">
                <button className="text-xs btn-xs mx-1 bg-white border-indigo-300 hover:border-indigo-400 text-indigo-500 flex items-center" onClick={handleonClick}>Sync</button>
                {/*<button className="text-xs btn-xs mx-1 bg-white border-indigo-300 hover:border-indigo-400 text-indigo-500 flex items-center">Inactive</button> */}
                {/* <button className="text-xs btn-xs mx-1 bg-white border-rose-300 hover:border-rose-400 text-rose-500 flex items-center" >Sync</button> */}
            </div>

        </>
    )
}

export default CheckBoxAction;