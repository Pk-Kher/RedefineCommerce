import React, { useState, useEffect } from "react";
import { Formik, Form as FormikForm } from "formik";
import { useSelector, useDispatch } from "react-redux";
import Input from "components/common/formComponent/Input";
import { RecStatusValuebyName } from "global/Enum";
import ToggleButton from "components/common/formComponent/Toggle";
import * as Yup from "yup";
import { ValidationMsgs } from "global/ValidationMessages";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { serverError } from "services/common/helper/Helper";
import Messages from "components/common/alerts/messages/Index";
import Dropdown from "components/common/formComponent/Dropdown";
import AppConfigService from "services/admin/appConfig/AppConfigService";

const Create = ({
    setOpenCreateModal,
    getPaymentOptions,
    id,
    getAppConfigData,
    stores,
    ...rest
}) => {
    const permission = useSelector(store => store?.permission)
    const [data, setData] = useState(rest?.data);
    const isAddMode = rest?.data?.id ? false : true;
    const dispatch = useDispatch();
    const location = useSelector(store => store?.location);

    const onsubmit = (fields, { resetForm }) => {
        dispatch(setAddLoading(true));
        AppConfigService.createUpdateAppConfig({ ...fields, storeId: (fields?.storeId || 0), ...location }).then((response) => {
            if (response?.data?.success && response?.data?.data) {
                dispatch(setAlertMessage({
                    type: 'success',
                    message: (isAddMode ? ValidationMsgs?.appConfig?.create : ValidationMsgs?.appConfig?.update)
                }));
                setData({});
                getAppConfigData();
                setOpenCreateModal(false);
            } else {
                dispatch(setAlertMessage({
                    type: 'danger',
                    message: serverError(response)
                }));
            }
            dispatch(setAddLoading(false));
        }).catch(() => {
            dispatch(setAlertMessage({
                type: 'danger',
                message: (isAddMode ? ValidationMsgs?.appConfig?.NotCreate : ValidationMsgs?.appConfig?.NotUpdate)
            }));
            dispatch(setAddLoading(false));
        })
    };

    const validationSchema = Yup.object({
        name: Yup.string().required(ValidationMsgs.appConfig?.name),
        value: Yup.string().required(ValidationMsgs.appConfig?.value),
        storeId: Yup.string().required(ValidationMsgs.appConfig?.store),
        description: Yup.string().required(ValidationMsgs.appConfig?.description),
    });
    return (
        <>
            <title> Add App Config</title>
            <div className="fixed inset-0 bg-slate-900 bg-opacity-95 z-30 transition-opacity" />
            <div id="paymentModal" className="overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-4 justify-center items-center h-modal md:h-full md:inset-0 z-30">
                <div className="w-full h-full flex items-center justify-center">
                    <div className="relative px-4 w-full max-w-2xl h-full md:h-auto">
                        <div className="relative bg-white rounded-lg shadow  max-h-screen overflow-y-auto">
                            <Formik
                                enableReinitialize={true}
                                initialValues={{
                                    id: data?.id || 0,
                                    name: data?.name || "",
                                    value: data?.value || "",
                                    storeId: data?.storeId || '',
                                    description: data?.description || "",
                                    rowVersion: data?.rowVersion || "",
                                    recStatus: data?.recStatus || RecStatusValuebyName.Active,
                                }}
                                onSubmit={onsubmit}
                                validationSchema={validationSchema}
                            >
                                {({ setFieldValue, errors, values, resetForm }) => {
                                    return (
                                        <FormikForm>
                                            <div className="flex justify-between items-start p-5 rounded-t border-b sticky top-0 left-0 bg-white">
                                                <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl">
                                                    {isAddMode === true
                                                        ? "Add App Config"
                                                        : "Edit App Config"}
                                                </h3>
                                                <button
                                                    type="button"
                                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                                                    data-modal-toggle="actionModal"
                                                    onClick={() => { setOpenCreateModal(prev => !prev); }}
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
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                            <Messages />
                                            <div className="p-6 bg-white">
                                                <div className="w-full mb-4 last:mb-0">
                                                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name" >
                                                        {"Name"}
                                                        <span className="text-rose-500 text-2xl leading-none">*</span>
                                                    </label>
                                                    <Input type={"text"} name="name" maxLength={500} />
                                                </div>
                                                <div className="w-full mb-4 last:mb-0">
                                                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name" >
                                                        {"Value"}
                                                        <span className="text-rose-500 text-2xl leading-none">*</span>
                                                    </label>
                                                    <Input type={"text"} name="value" maxLength={500} />
                                                </div>

                                                <div className="w-full mb-4 last:mb-0">
                                                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                                        {"Select Store"}
                                                        <span className="text-rose-500 text-2xl leading-none">
                                                            *
                                                        </span>
                                                        <Dropdown
                                                            options={stores}
                                                            defaultValue={values?.storeId}
                                                            name="storeId"
                                                        />
                                                    </label>
                                                </div>
                                                <div className="w-full mb-4 last:mb-0">
                                                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name" >
                                                        {"Description"}
                                                        <span className="text-rose-500 text-2xl leading-none">
                                                            *
                                                        </span>
                                                    </label>
                                                    <Input as={'textarea'} name="description" maxLength={500} style={{ resize: 'none' }} className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`} />
                                                </div>
                                                <div className="w-full flex mb-4">
                                                    <div className="w-full">
                                                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                                                            Status
                                                            <span className="text-rose-500 text-2xl leading-none">
                                                                *
                                                            </span>
                                                        </label>
                                                        <div className="col-span-full w-full sm:col-span-6 xl:col-span-8">
                                                            <div>
                                                                <ToggleButton
                                                                    name="recStatus"
                                                                    id="recStatus"
                                                                    size="m"
                                                                    on="Active"
                                                                    off="Inactive"
                                                                    onChange={(e) =>
                                                                        setFieldValue(
                                                                            "recStatus",
                                                                            e.target.checked
                                                                                ? RecStatusValuebyName.Active
                                                                                : RecStatusValuebyName.Inactive
                                                                        )
                                                                    }
                                                                    defaultValue={
                                                                        values.recStatus ===
                                                                            RecStatusValuebyName.Active
                                                                            ? true
                                                                            : false
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {(permission?.isEdit || permission?.isDelete) && <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200 bg-white">
                                                <button type="button" className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700" onClick={() => { setOpenCreateModal(prev => !prev); }}>
                                                    Cancel
                                                </button>
                                                <button type="Submit" className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white`}>
                                                    <div className={`w-full flex justify-center align-middle `}>
                                                        Save
                                                    </div>
                                                </button>
                                            </div>}
                                        </FormikForm>
                                    );
                                }}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Create;
