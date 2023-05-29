/*Component Name: SaveFilter
Component Functional Details:  SaveFilter .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setAddLoading } from 'redux/globalLoader/GlobalLoaderAction';
import MoreFilterService from 'services/admin/moreFilter/MoreFilterService';

const SaveFilter = ({ saveFilterOptionsHandler }) => {

    return (
        <>
            <div className="relative inline-flex mr-1">
                <button className={`flex flex-wrap items-center text-sm px-3 py-2 bg-white border border-neutral-200 text-gray-500 hover:text-gray-700 rounded-md shadow-sm `}
                    onClick={saveFilterOptionsHandler}>
                    <span className="material-icons">grade</span>
                    <span className="ml-1">{'Save'}
                    </span>
                    <wbr />
                </button>
            </div>
        </>
    );
};

export default React.memo(SaveFilter);
