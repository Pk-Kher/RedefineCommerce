import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from "react-redux";

const PageEditMainHeader = ({ storeName }) => {
    const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

    return (
        <div className="flex py-3 p-4 justify-between items-center bg-slate-800 sticky inset-0 bottom-auto z-50">
            <div className="flex items-center flex-wrap">
                <div className="relative inline-flex">
                    <Link
                        to={`/admin/Content/Page`}
                        className="flex flex-wrap btn-sm px-4 py-[5px] bg-white hover:bg-indigo-500 text-indigo-500 hover:text-white mr-2">
                        <span >Exit</span>
                    </Link>
                    <button className={`px-4 py-[5px] btn-sm bg-indigo-500 hover:bg-indigo-600 text-white mr-2 ${(GlobalLoading)
                        ? "bg-indigo-200 hover:bg-indigo-200"
                        : "cursor-pointer"
                        }`} type='submit'>
                        {GlobalLoading && (
                            <span className="spinner-border spinner-border-sm mr-2"></span>
                        )}
                        Save
                    </button>
                </div>
            </div>
            <div className="text-white flex items-center text-sm justify-between font-normal">{storeName}</div>
            <div >
                {/* <span className="px-4 py-[5px] btn-sm bg-rose-500 hover:bg-rose-600 text-white ml-2">Unpublish</span>
                <span className="px-4 py-[5px] btn-sm bg-indigo-500 hover:bg-indigo-600 text-white ml-2">Update</span> */}
            </div>
        </div>
    )
}

export default PageEditMainHeader