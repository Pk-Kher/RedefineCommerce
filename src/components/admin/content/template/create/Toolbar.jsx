/*Component Name: Toolbar
Component Functional Details: User can create or update Toolbar master details from here.
Created By: Vikas Patel 
Created Date: 07/06/2022
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React from 'react';

const Toolbar = ({property, uid, no}) => {
    return (
        <div class="absolute -top-8 -left-0.5" x-show="open">
            <div class="flex flex-wrap -space-x-px"> 
                <a onClick={() => property.setTabNumber(3)} class="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded-none border-l-indigo-400 first:rounded-l last:rounded-r first:border-r-transparent"><span class="material-icons-outlined text-sm">mode_edit</span> </a> 
                <a onClick={() => property.cloneComponent(uid)} href="javascipt:void(0);"  class="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded-none border-l-indigo-400 first:rounded-l last:rounded-r first:border-r-transparent"><span class="material-icons-outlined text-sm">content_copy</span> </a> 
                <a onClick={() => property.deleteComponent(uid)} href="javascipt:void(0);" class="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded-none border-l-indigo-400 first:rounded-l last:rounded-r first:border-r-transparent"><span class="material-icons-outlined text-sm">delete</span></a>
                <a onClick={() => property.changeVisibility(uid)} href="javascipt:void(0);" class="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded-none border-l-indigo-400 first:rounded-l last:rounded-r first:border-r-transparent"><span class="material-icons-outlined text-sm">visibility</span></a> 
                <button onClick={() => property.singleSaveData(uid, no)} class="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded-none border-l-indigo-400 first:rounded-l last:rounded-r first:border-r-transparent"><span class="material-icons-outlined text-sm">save</span> </button> 
            </div>
            </div>

    );
};

export default Toolbar;
