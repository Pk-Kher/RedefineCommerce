/*Component Name: StoreSyncModal
Component Functional Details:StoreSyncModal\.
Created By: Ankit Sharma
Created Date: 11/16/2022
Modified By: Ankit Sharma
Modified Date: 11/16/2022 */

import React, { Fragment, useState } from "react";
import { Form as FormikForm, Formik } from "formik";
import { defaultImage } from "global/Enum";
import Checkbox from "components/common/formComponent/Checkbox";
import AttributesService from "services/admin/masterCatalog/store/product/attribute/AttributesService";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { useDispatch } from "react-redux";
import { serverError } from "services/common/helper/Helper";
import { ValidationMsgs } from "global/ValidationMessages";

const StoreSyncModal = ({ setOpenStoreModal, SyncModalObject }) => {

    const dispatch = useDispatch();

    const setAtrributeValue = (attributes, e) => {
        if (e.target.checked) {
            return [...attributes, parseInt(e.target.value)];
        } else {
            var index = attributes.indexOf(parseInt(e.target.value));
            if (index > -1) {
                attributes.splice(index, 1); // 2nd parameter means remove one item only
            }
            return attributes;
        }
    };
    const submitHandler = (fields) => {

        AttributesService.syncWithStore({ productAttributeLink: { ...fields } }).then((response) => {
            if (response.data.success) {

                dispatch(
                    setAlertMessage({
                        type: "success",
                        message: ValidationMsgs.masterCatalog.attributes.attributeSynced,
                    })
                );
                setOpenStoreModal(false)
            } else {
                dispatch(setAlertMessage({ type: "danger", message: serverError(response) }));
            }
        })
            .catch((errors) => {
                dispatch(
                    setAlertMessage({
                        type: "danger",
                        message: ValidationMsgs.masterCatalog.attributes.attributeNotSynced,
                    })
                );
                setOpenStoreModal(false)
            });

    }

    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={{ productAttributeid: SyncModalObject.attributeId, attributeOption: [SyncModalObject.attributeOptions], storeList: [] }}
                onSubmit={submitHandler}
            >
                {({ errors, touched, setFieldValue, values }) => {
                    return (
                        <FormikForm>
                            <div
                                id="syncStoreModal"
                                className="overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-4 z-50 justify-center items-center h-modal md:h-full md:inset-0"
                            >
                                <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                                    <div className="relative px-4 w-full max-w-2xl h-full md:h-auto">
                                        <div className="relative bg-white rounded-lg shadow  max-h-screen overflow-y-auto">
                                            <div className="px-5 py-3 border-b border-neutral-200">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="font-semibold text-gray-800">
                                                        Sync Attribute on Store
                                                    </h3>
                                                    <button
                                                        onClick={() => setOpenStoreModal((prev) => !prev)}
                                                        type="button"
                                                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                                                        data-modal-toggle="storeSync"
                                                    >
                                                        <svg
                                                            className="w-5 h-5"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            ></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="px-5 pt-4 pb-1">
                                                <div className="overflow-x-auto border-t border-neutral-200">
                                                    {SyncModalObject?.storeList !== undefined ?
                                                        (

                                                            <table className="table-auto w-full text-sm text-[#191919] font-semibold">
                                                                <thead className="text-sm font-bold uppercase text-[#b3b3b3] border-b border-neutral-200">
                                                                    <tr>
                                                                        <th className={"px-2 first:pl-5 py-3 text-center relative"}>
                                                                            <>
                                                                                {/* <ToggleAllCheckbox Stores={Stores} values={values} setFieldValue={setFieldValue} /> */}
                                                                            </>

                                                                        </th>
                                                                        <th className="px-2 first:pl-5 py-4">
                                                                            <div className="font-semibold text-left w-20 max-w-sm flex items-center">
                                                                                <span>Link</span>
                                                                            </div>
                                                                        </th>
                                                                        <th className="px-2 first:pl-5 py-4">
                                                                            <div className="font-semibold text-left w-28 max-w-sm flex items-center">
                                                                                <span>Channel</span>
                                                                            </div>
                                                                        </th>

                                                                    </tr>
                                                                </thead>
                                                                <tbody className="text-sm divide-y divide-slate-200 border-b border-neutral-200">
                                                                    {/* {values?.storeList !== undefined ? */}
                                                                    {/* ( */}
                                                                    <>
                                                                        {SyncModalObject?.storeList.map((data, index) => {
                                                                            return (
                                                                                <StoreList
                                                                                    key={index}
                                                                                    index={index}
                                                                                    data={data}
                                                                                    values={values}
                                                                                    setFieldValue={setFieldValue}
                                                                                />
                                                                            )
                                                                        })}
                                                                    </>

                                                                </tbody>
                                                            </table>) : (
                                                            <>
                                                                <tr>
                                                                    No Store Linked with this Product.
                                                                </tr>
                                                            </>
                                                        )
                                                    }

                                                </div>
                                            </div>
                                            <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200 ">
                                                <button
                                                    data-modal-toggle="syncStoreModal"
                                                    type="button"
                                                    className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
                                                    onClick={() => setOpenStoreModal((prev) => !prev)}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    data-modal-toggle="syncStoreModal"
                                                    type="submit"
                                                    className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                                                >
                                                    Save
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FormikForm>
                    );
                }}
            </Formik>
        </>
    );
};

export default StoreSyncModal

const ToggleAllCheckbox = ({ Stores, values, setFieldValue }) => {

    const [toggleCheckbox, setToggleCheckbox] = useState(false);

    const toggleModulesAllCheckbox = (e) => {
        setToggleCheckbox((prev) => !prev);
        const storeId = values.storeId;
        let checkAll = [];

        if (!toggleCheckbox) {
            Stores.length > 0 && Stores.map((data, index) => {
                if (!storeId.includes(data.id)) {
                    checkAll = [...checkAll, data.id];
                }
            });
            setFieldValue("storeId", [...storeId, ...checkAll]);
        } else {
            Stores.length > 0 && Stores.map((data, index) => {
                checkAll = [...checkAll, data.id];
            });
            setFieldValue(
                "storeId",
                storeId.filter((value) => !checkAll.includes(value))
            );
        }
    };
    return (
        <>
            <Checkbox
                name={"storeId"}
                onChange={(e) => {
                    toggleModulesAllCheckbox(e);
                }}
                type={"checkbox"}
                className={"form-checkbox"}
            />
        </>
    )
}

const StoreList = ({ index, data, values, setFieldValue }) => {

    const setStoresValue = (stores, e) => {
        if (e.target.checked) {
            return [...stores, parseInt(e.target.value)];
        } else {
            var index = stores.indexOf(parseInt(e.target.value));
            if (index > -1) {
                stores.splice(index, 1); // 2nd parameter means remove one item only
            }
            return stores;
        }
    }

    return (
        <Fragment key={index}>

            <tr className="main-parent" key={index}>
                <td className="px-2 first:pl-5 py-3 whitespace-nowrap w-px">
                    <div className="flex items-center">
                        <label className="inline-flex leading-none w-4 h-4">
                            <span className="sr-only">Select</span>
                            <Checkbox
                                name={"storeList"}
                                onChange={(e) => {
                                    setFieldValue(
                                        `storeList`,
                                        setStoresValue(values.storeList, e)
                                    );
                                }}
                                value={data.id}
                                type={"checkbox"}
                                className={"form-checkbox"}
                                // defaultChecked={true}
                                defaultChecked={values.storeList.includes(data.id)}
                            />
                        </label>
                    </div>
                </td>
                <td className="px-2 first:pl-5 py-3">
                    <div className="w-24 h-24 border border-neutral-200 p-2 rounded-md"><img className="max-h-full" src={data.logoUrl ?? defaultImage} alt="" /></div>
                </td>
                <td className="px-2 first:pl-5 py-3">
                    <div className="">{data.storeName}</div>
                </td>
            </tr>
        </Fragment>
    );
}
