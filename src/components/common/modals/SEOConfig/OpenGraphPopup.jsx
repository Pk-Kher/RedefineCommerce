/*Component Name: OpenGraphPopup
Component Functional Details: User can create or update OpenGraphPopup master details from here.
Created By: Happy
Created Date: <Creation Date>
Modified By: Chandan
Modified Date: 25-08-2022 */

import React, { useEffect, useState } from "react";
import Transition from "utils/Transition";
import ImageFile from "components/common/formComponent/ImageFile";
import Input from "components/common/formComponent/Input";
import Textarea from "components/common/formComponent/Textarea";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";
import { blobFolder } from "global/Enum";

const OpenGraphPopup = ({ setOpenModal, openModal, name, fields, displayFieldElement }) => {
    const { values, setValues } = useFormikContext();
    const CompanyId = useSelector((store) => store?.CompanyConfiguration.id);
    const FolderPath = `/${blobFolder.temp}/${CompanyId}/${blobFolder.openGraph}`

    const [data, setData] = useState({
        image: '',
        title: '',
        description: '',
    });
    useEffect(() => {
        setData({
            image: values[`${name}ImagePath`],
            title: values[`${name}OpenGraphTitle`],
            description: values[`${name}OpenGraphDescription`]
        });
    }, [values, name])

    const saveHandler = () => {
        setValues(prev => {
            return {
                ...prev,
                [`${name}ImagePath`]: data.image,
                [`${name}OpenGraphTitle`]: data.title,
                [`${name}OpenGraphDescription`]: data.description
            }
        })
        setOpenModal(false);
    }

    return (
        <>
            <Transition
                className="fixed inset-0 bg-slate-900 bg-opacity-30 z-50 transition-opacity"
                show={openModal}
                tag="div"
                enter="transition ease-out duration-200 transform"
                enterStart="opacity-0 -translate-y-2"
                enterEnd="opacity-100 translate-y-0"
                leave="transition ease-out duration-200"
                leaveStart="opacity-100"
                leaveEnd="opacity-0"
            ></Transition>
            <Transition
                className="fixed inset-0 z-50 overflow-hidden flex items-center my-4 justify-center transform px-4 sm:px-6"
                show={openModal}
                tag="div"
                id="basic-modal"
                enter="transition ease-out duration-200 transform"
                enterStart="opacity-0 -translate-y-2"
                enterEnd="opacity-100 translate-y-0"
                leave="transition ease-out duration-200"
                leaveStart="opacity-100"
                leaveEnd="opacity-0"
            >
                <div className="bg-white rounded shadow-lg overflow-auto max-w-4xl w-full max-h-full">
                    <div className="px-5 py-3 border-b border-neutral-200">
                        <div className="flex justify-between items-center">
                            <div className="font-semibold text-gray-800">
                                {name ? name.replaceAll('_', ' ').toUpperCase() : ''}
                            </div>
                            <button
                                className="text-gray-400 hover:text-gray-500"
                                type="button"
                                onClick={() => {
                                    setOpenModal(false);
                                }}
                            >
                                <div className="sr-only">Close</div>
                                <svg className="w-4 h-4 fill-current">
                                    <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="px-5 pt-4 pb-1">
                        <div className="mt-6">
                            <div className="flex flex-wrap -mx-4 -mb-4 md:mb-0">

                                <div className="w-full md:w-1/2 px-4 mb-4">
                                    <ImageFile
                                        type="file"
                                        className="sr-only"
                                        name={`modal${name}image`}
                                        id={`modal${name}image`}
                                        buttonName="Add"
                                        folderpath={`${FolderPath}`}
                                        url={data.image}
                                        onChange={(url) => {
                                            setData(prev => { return { ...prev, image: url } })
                                        }}
                                    />
                                    <div className="mb-3 text-base bg-gray-200 px-4 py-4 rounded-b-lg">
                                        <div className="text-md font-bold text-black mb-2">{data.title}</div>
                                        <div className="text-sm text-gray-500 mb-2">{data.description}</div>
                                    </div>
                                    <label className="tracking-wide text-gray-700 text-sm mb-3 flex items-center" htmlFor="">We recommend 1,200px by 628px.</label>
                                </div>


                                <div className="w-full md:w-1/2 px-4 mb-4">
                                    {displayFieldElement(fields, `${name}OpenGraphTitle`) && (<div className='mt-6'>
                                        <div className='flex items-center justify-between'>
                                            <label className='tracking-wide text-gray-700 text-sm font-bold mb-2 flex items-center'>
                                                Open Graph Title
                                            </label>
                                            <span className="text-xs">{data.title ? data.title.length : 0}/ <span>60</span> Character</span>
                                        </div>
                                        <Input
                                            type={"text"}
                                            name={`title`}
                                            maxLength="60"
                                            value={data.title || ''}
                                            className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}
                                            onChange={(e) => {
                                                setData(prev => { return { ...prev, title: e.target.value } })
                                            }}
                                        />

                                    </div>)}
                                    {displayFieldElement(fields, `${name}OpenGraphDescription`) && (<div className='mt-6'>
                                        <div className='flex items-center justify-between'>
                                            <label className='tracking-wide text-gray-700 text-sm font-bold mb-2 flex items-center'>
                                                Open Graph Description
                                            </label>
                                            <span className="text-xs"><span>{data.description ? data.description.length : 0}</span> / <span>60</span> Character</span>
                                        </div>
                                        <Textarea
                                            maxLength="60"
                                            rows="4"
                                            className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}
                                            name={`description`}
                                            value={data.description}
                                            onChange={(e) => {
                                                setData(prev => { return { ...prev, description: e.target.value } })
                                            }}
                                        />
                                    </div>)}
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="px-5 py-4">
                        <div className="flex flex-wrap justify-end space-x-2">
                            <button
                                className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
                                type="button"
                                onClick={() => {
                                    setOpenModal(false);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                                type="button"
                                onClick={saveHandler}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </>
    );
};

export default OpenGraphPopup;
