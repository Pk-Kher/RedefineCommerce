/*Component Name: Create
Component Functional Details: User can create or update customer master details from here.
Created By: Happy
Created Date: 08/08/2022
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useState, useEffect } from "react";
import { FieldArray, Form as FormikForm, Formik } from "formik";
import { Link, useParams } from "react-router-dom";
import * as Yup from "yup";
import Input from "components/common/formComponent/Input";
import Dropdown from "components/common/formComponent/Dropdown";
import Checkbox from "components/common/formComponent/Checkbox";
import { RecStatusValuebyName } from "global/Enum";
import DropdownService from "services/common/dropdown/DropdownService";
import Messages from "components/common/alerts/messages/Index";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { ValidationMsgs } from "global/ValidationMessages";
import { useDispatch, useSelector } from "react-redux";
import { serverError } from "services/common/helper/Helper";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import CommonFields from "./CommonFields";
import CustomerService from "services/admin/customer/CustomerService";
import TierService from "services/admin/tier/TierService";

const Create = () => {
    const permission = useSelector(store => store.permission);
    const { id } = useParams();
    const isAddMode = !id;
    const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);
    const [stores, setStores] = useState({});
    const [tier, setTier] = useState([]);
    const [shippingSameBilling, setShippingSameBilling] = useState(false);
    const dispatch = useDispatch();
    const location = useSelector((store) => store?.location);
    useEffect(() => {
        DropdownService.getDropdownValues(
            "store"
        ).then((res) => {
            if (res.data.success) {
                setStores(() => {
                    return res.data.data;
                });
            }
        });
    }, [id, isAddMode, setStores]);

    const getTier = (storeId) => {
        TierService.getTiersByStoreID(storeId).then(response => {
            if (response.data.data) {
                setTier(() => {
                    return response.data.data.map((value, index) => {
                        return {
                            label: value?.tierName,
                            value: value?.id
                        }
                    })
                })
            }
        }).catch(error => {

        })
    }

    const validationSchema = Yup.object({
        storeId: Yup.string().required(ValidationMsgs.common.storeIdRequired),
        firstname: Yup.string().required(ValidationMsgs.common.firstNameRequired),
        lastName: Yup.string().required(ValidationMsgs.common.lastNameRequired),
        email: Yup.string().email(ValidationMsgs.common.Email),
        tierId: Yup.string().required(ValidationMsgs.customer.tierRequired),
        companyName: Yup.string().required(ValidationMsgs.customer.companyNameRequired),
        recStatus: Yup.string().required(ValidationMsgs.common.recStatusRequired),

        password: Yup.string().required(ValidationMsgs.customer.password).min(8, ValidationMsgs.profile.myAccount.newPasswordMin),
        confirm_password: Yup.string().required(ValidationMsgs.customer.confirm_password).when("password", {
            is: (val) => (val && val.length > 0 ? true : false),
            then: Yup.string().oneOf(
                [Yup.ref("password")],
                ValidationMsgs.customer.confirm_passwordMatches
            ),
        }),
        customerAddress: Yup.array()
            .of(
                Yup.object().shape({
                    // firstname: Yup.string().required(ValidationMsgs.common.firstNameRequired),
                    // lastName: Yup.string().required(ValidationMsgs.common.lastNameRequired),
                    // email: Yup.string().email(ValidationMsgs.common.Email).required(ValidationMsgs.user.emailRequired),
                    // phone: Yup.string().required(ValidationMsgs.common.phoneRequired).matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, ValidationMsgs.common.phoneMatches),

                    address1: Yup.string().when('addressType', (addressType, schema) => (addressType !== 'S' || !shippingSameBilling) ? Yup.string().required(ValidationMsgs.common.addressRequired) : Yup.string()),
                    firstname: Yup.string().when('addressType', (addressType, schema) => (addressType !== 'S' || !shippingSameBilling) ? Yup.string().required(ValidationMsgs.common.firstNameRequired) : Yup.string()),
                    lastName: Yup.string().when('addressType', (addressType, schema) => (addressType !== 'S' || !shippingSameBilling) ? Yup.string().required(ValidationMsgs.common.lastNameRequired) : Yup.string()),

                    email: Yup.string().when('addressType', (addressType, schema) => (addressType !== 'S' || !shippingSameBilling) ? Yup.string().email(ValidationMsgs.common.Email).required(ValidationMsgs.user.emailRequired) : Yup.string()),

                    phone: Yup.string().when('addressType', (addressType, schema) => (addressType !== 'S' || !shippingSameBilling) ? Yup.string().required(ValidationMsgs.common.phoneRequired).matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, ValidationMsgs.common.phoneMatches) : Yup.string()),

                    city: Yup.string().when('addressType', (addressType, schema) => (addressType !== 'S' || !shippingSameBilling) ? Yup.string().required(ValidationMsgs.common.cityRequired) : Yup.string()),
                    state: Yup.string().when('addressType', (addressType, schema) => (addressType !== 'S' || !shippingSameBilling) ? Yup.string().required(ValidationMsgs.common.stateRequired) : Yup.string()),
                    countryName: Yup.string().when('addressType', (addressType, schema) => (addressType !== 'S' || !shippingSameBilling) ? Yup.string().required(ValidationMsgs.common.countryRequired) : Yup.string()),

                    postalCode: Yup.string().when('addressType', (addressType, schema) => (addressType !== 'S' || !shippingSameBilling) ? Yup.string().required(ValidationMsgs.common.postalCodeRequired) : Yup.string()),
                    fax: Yup.string().when('addressType', (addressType, schema) => (addressType !== 'S' || !shippingSameBilling) ? Yup.string().nullable().max(15, ValidationMsgs.common.faxLength) : Yup.string()),
                    countryCode: Yup.string().when('addressType', (addressType, schema) => (addressType !== 'S' || !shippingSameBilling) ? Yup.string().nullable().max(3, ValidationMsgs.common.countryCodeLength) : Yup.string())
                })
            )
    });

    function onSubmit(fields, { resetForm }) {
        dispatch(setAddLoading(true))

        // console.log(fields);
        CustomerService.createCustomer({
            customerModel: {
                ...fields,
                customerAddress: (shippingSameBilling ? [fields.customerAddress[0], { ...fields.customerAddress[0], addressType: "S", }] : fields.customerAddress),
                ...location

            }
        }).then((response) => {
            if (response.data.success && response.data.data) {
                dispatch(
                    setAlertMessage({
                        type: "success",
                        message: ValidationMsgs.customer.created,
                    })
                );
                resetForm({})
            } else {
                dispatch(
                    setAlertMessage({ type: "danger", message: serverError(response) })
                );
            }
            dispatch(setAddLoading(false))
        }).catch((errors) => {
            dispatch(
                setAlertMessage({ type: "danger", message: ValidationMsgs.customer.notCreated })
            );
            dispatch(setAddLoading(false))
        })
    }

    return (
        <>
            <title>{"Create Customer"}</title>

            <Formik
                initialValues={{
                    id: 0,
                    storeId: "",
                    firstname: "",
                    lastName: "",
                    email: "",
                    companyName: "",
                    tierId: "",
                    isRegistered: true,
                    sharedCustomerId: 0,
                    isLocked: false,
                    navCustomerId: "",
                    customerType: "credit",
                    isTaxableuser: false,
                    recStatus: RecStatusValuebyName.Active,
                    rowVersion: "",
                    password: '',
                    confirm_password: '',
                    // shippingSameBilling:  false,

                    customerAddress: [
                        {
                            id: 0,
                            firstname: "",
                            lastName: "",
                            email: "",
                            address1: "",
                            address2: "",
                            suite: "",
                            city: "",
                            state: "",
                            postalCode: "",
                            fax: "",
                            phone: "",
                            countryName: "",
                            countryCode: "",
                            addressType: "B",
                            isDefault: true,
                            recStatus: RecStatusValuebyName.Active,
                            rowVersion: "",
                            ...location
                        },
                        {
                            id: 0,
                            firstname: "",
                            lastName: "",
                            email: "",
                            address1: "",
                            address2: "",
                            suite: "",
                            city: "",
                            state: "",
                            postalCode: "",
                            fax: "",
                            phone: "",
                            countryName: "",
                            countryCode: "",
                            addressType: "S",
                            isDefault: true,
                            recStatus: RecStatusValuebyName.Active,
                            rowVersion: "",
                            ...location

                        },
                    ]
                }}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
                validateOnMount={true}
            >
                {({ setFieldValue, errors, values, setValues }) => {
                    return (
                        <FormikForm>
                            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
                                <div className="flex mb-8 justify-between">
                                    <div className="flex items-center">
                                        <Link
                                            to={"/admin/Customer/customer"}
                                            className="btn border-neutral-200 hover:border-neutral-400 text-gray-500 hover:text-gray-700 flex items-center mr-2"
                                        >
                                            <span className="material-icons-outlined">west</span>
                                        </Link>
                                        <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
                                            Create Customer
                                        </h1>
                                    </div>
                                    {(permission?.isEdit || permission?.isDelete) && <div className="flex flex-wrap space-x-2">
                                        <Link
                                            className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
                                            to={"/admin/Customer/customer"}
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            disabled={GlobalLoading}
                                            type="submit"
                                            className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(GlobalLoading) ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}
                                        >
                                            <div className={`w-full flex justify-center align-middle `}>
                                                {GlobalLoading && (
                                                    <span className="spinner-border spinner-border-sm mr-2"></span>
                                                )}
                                                Save
                                            </div>
                                        </button>
                                    </div>}
                                </div>
                                <Messages />

                                <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                                    <div className="block uppercase tracking-wide text-gray-500 text-lg font-bold mb-4"> Customer Information </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div >
                                            {"Store"}
                                            <span className="text-rose-500 text-2xl leading-none">
                                                *
                                            </span>

                                            <Dropdown
                                                defaultValue={values.storeId}
                                                name={"storeId"}
                                                options={stores}
                                                onChange={(data) => {
                                                    setFieldValue("storeId", data.value);
                                                    getTier(data.value);
                                                }}
                                            />
                                        </div>
                                        <div >
                                            {"First Name"}
                                            <span className="text-rose-500 text-2xl leading-none">
                                                *
                                            </span>

                                            <Input type="text" name="firstname" />
                                        </div>
                                        <div >
                                            {"Last Name"}
                                            <span className="text-rose-500 text-2xl leading-none">
                                                *
                                            </span>

                                            <Input type="text" name="lastName" />
                                        </div>
                                        <div >
                                            {"Email"}
                                            <Input type="text" name="email" />
                                        </div>
                                        <div >
                                            {"Company Name"}
                                            <span className="text-rose-500 text-2xl leading-none">
                                                *
                                            </span>

                                            <Input type="text" name="companyName" />
                                        </div>
                                        <div >
                                            {"Select Tier"}
                                            <span className="text-rose-500 text-2xl leading-none">
                                                *
                                            </span>

                                            <Dropdown
                                                defaultValue={values.tierId}
                                                name={"tierId"}
                                                options={tier}
                                                onChange={(data) => {
                                                    setFieldValue("tierId", data.value);
                                                }}
                                            />
                                        </div>
                                        <div >
                                            {"Password"}
                                            <span className="text-rose-500 text-2xl leading-none">
                                                *
                                            </span>
                                            <Input type="password" name="password" />
                                        </div>
                                        <div >
                                            {"Re-enter Password"}
                                            <span className="text-rose-500 text-2xl leading-none">
                                                *
                                            </span>

                                            <Input type="password" name="confirm_password" />
                                        </div>

                                    </div>
                                </div>
                                <FieldArray
                                    name="customerAddress"
                                    render={(fieldArrayProps) => {
                                        const { form } = fieldArrayProps;
                                        return (
                                            <>
                                                {form.values.customerAddress.map((value, i) => {
                                                    return (
                                                        <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6" key={i}>
                                                            <div className="block uppercase tracking-wide text-gray-500 text-lg font-bold mb-4">{value.addressType === 'B' ? ' Billing Information' : 'Shipping Address'}  </div>
                                                            {value.addressType === 'S' && <div className="mb-4 flex items-center">
                                                                <label className={"flex items-center"}>
                                                                    <Checkbox
                                                                        name={"same_ship"}
                                                                        onChange={(e) => {
                                                                            setShippingSameBilling(e.target.checked);
                                                                        }}
                                                                        checked={shippingSameBilling}
                                                                        className={"form-checkbox ml-2"}
                                                                    />
                                                                    <span className={"text-sm font-medium"}>{"Shipping address same as Billing address"}</span>
                                                                </label>
                                                            </div>}
                                                            {(value.addressType !== 'S' || !shippingSameBilling) && <CommonFields
                                                                fieldArrayProps={fieldArrayProps}
                                                                key={i}
                                                                index={i}
                                                            />}
                                                        </div>
                                                    );
                                                })}
                                            </>
                                        )
                                    }}
                                />

                                {/* <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                                    <div className="block uppercase tracking-wide text-gray-500 text-lg font-bold mb-4"> Shipping Information  </div>
                                    <div className="mb-4 flex items-center">
                                        <label className={"flex items-center"}>
                                            <Checkbox
                                                name={"same_ship"}
                                                onChange={(e) => {
                                                    setFieldValue(`same_ship`, e.target.checked);
                                                }}
                                                checked={values.same_ship}
                                                value={values.same_ship}
                                                className={"form-checkbox ml-2"}
                                            />
                                            <span className={"text-sm font-medium"}>{"Shipping address same as Billing address"}</span>
                                        </label>
                                    </div>
                                    {!values.same_ship &&
                                        <CommonFields commonName={'shipping'} />
                                    }

                                </div> */}
                            </div>

                        </FormikForm>
                    );
                }}
            </Formik>
        </>
    );
};

export default Create;
