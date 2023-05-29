import React from 'react';
import { useSelector } from 'react-redux';

function CheckBoxAction({ selectedFlatRows, setOpenCloneModal, setOpenAttributeCloneModal }) {
    const permission = useSelector(store => store.permission);
    const handleonClick = () => {
        setOpenCloneModal(prev => !prev);
    }

    const attributeClone = () => {
        setOpenAttributeCloneModal(true);
        // setProductId(selectedFlatRows[0].original.id);
    }
    return (
        <>
            {(permission?.isEdit || permission?.isDelete) && <div className="flex items-center border border-r-0 border-indigo-300 pl-7 rounded">
                {(selectedFlatRows.length === 1) &&
                    <button className="px-3 py-2 h-8 text-xs btn-xs bg-white rounded-none border-y-0 border-indigo-300 text-indigo-500 hover:text-indigo-600" data-modal-toggle="cloneattribute" onClick={attributeClone}>Create Listing / Clone</button>
                }
                {selectedFlatRows.length > 0 && <button className="px-3 py-2 h-8 text-xs btn-xs bg-white rounded-none border-y-0 border-indigo-300 text-indigo-500 hover:text-indigo-600" data-modal-toggle="clonemultibox" onClick={handleonClick}>Clone Multiple</button>}
            </div>}
        </>
    )
}

export default CheckBoxAction;