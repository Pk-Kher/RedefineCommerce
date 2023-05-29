/*Component Name: Create
Component Functional Details: User can create or update Create master details from here.
Created By: Shrey Patel
Created Date: 07/18/2022
Modified By: chandan
Modified Date: 26-08-2022 */

import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import Messages from "components/common/alerts/messages/Index";
import { Form as FormikForm, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { v4 as uuid } from "uuid";
import { ValidationMsgs } from "global/ValidationMessages";
import RangeValues from "./RangeValues"
import Input from "components/common/formComponent/Input";
import { RecStatusValuebyName } from "global/Enum";
import Checkbox from "components/common/formComponent/Checkbox";
import Dropdown from "components/common/formComponent/Dropdown";
import DropdownService from "services/common/dropdown/DropdownService";
import SalesDiscountReport from "./SalesDiscountReport";
import DatePicker from "components/common/formComponent/DatePicker";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { serverError } from "services/common/helper/Helper";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import PromotionsService from "services/admin/promotions/PromotionsService";
import RadioButton from "components/common/formComponent/RadioButton";

import Status from "components/common/displayStatus/Status";
import InputNumber from "components/common/formComponent/InputNumber";
import CategoryMasterService from "services/admin/masterCatalog/store/categoryMaster/CategoryMasterService";
import FormErrorMessage from "components/common/alerts/FormErrorMessage";
import CreateFileHeader from "components/common/CreateFileHeader";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const Create = () => {
    const permission = useSelector(store => store.permission);
    const { id } = useParams();
    const isAddMode = !id;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useSelector((store) => store?.location);

    const [data, setData] = useState({});
    const [applyId, setApplyId] = useState({
        brand: { ids: [], object: [] },
        category: { ids: [], object: [] },
        product: { ids: [], object: [] },
        customer: { ids: [], object: [] },
    });

    const [Brands, setBrands] = useState([]);
    const [category, setCategory] = useState([]);
    const [specificCustomersList, setSpecificCustomersList] = useState([]);
    const [products, setProducts] = useState([]);
    const [stores, setStores] = useState([]);
    const [OpenDiscountReport, setOpenDiscountReport] = useState(false);

    const GenerateCode = () => {
        let randomId = uuid();
        let myDiscountCouponCode = randomId.slice(0, 6);
        return myDiscountCouponCode;
    };
    const getPromotionDataById = useCallback(() => {
        if (id) {
            dispatch(setAddLoading(true))

            PromotionsService.getPromotionByID(id)
                .then((res) => {
                    var response = res.data;
                    if (response.success && response.data) {
                        setData(response.data);
                    } else {
                        dispatch(setAlertMessage({
                            type: "danger",
                            message: ValidationMsgs.promotions.promotionNotFound,
                        }));
                        navigate('/admin/promotions/couponCodes/', { replace: true });
                    }
                })
                .catch((err) => { });
            PromotionsService.getpromotiondetailbyparentid(id)
                .then((res) => {
                    var response = res.data;
                    if (response.success) {
                        let brandIDs = [];
                        let brandObject = [];
                        let categoryIDs = [];
                        let categoryObject = [];
                        let productIDs = [];
                        let productObject = [];
                        let customerIDs = [];
                        let customerObject = [];
                        response.data.promotionsdetailmodellist.map((value, index) => {
                            if (value.type === 1) {
                                brandIDs = [...brandIDs, value.applyId]
                                brandObject = [...brandObject, value]
                            }
                            if (value.type === 2) {
                                categoryIDs = [...categoryIDs, value.applyId]
                                categoryObject = [...categoryObject, value]
                            }
                            if (value.type === 3) {
                                productIDs = [...productIDs, value.applyId]
                                productObject = [...productObject, value]
                            }
                            if (value.type === 4) {
                                customerIDs = [...customerIDs, value.applyId]
                                customerObject = [...customerObject, value]
                            }
                            return;
                        });
                        setApplyId({
                            brand: { ids: brandIDs, object: brandObject },
                            category: { ids: categoryIDs, object: categoryObject },
                            product: { ids: productIDs, object: productObject },
                            customer: { ids: customerIDs, object: customerObject }
                        });
                    }
                    dispatch(setAddLoading(false))

                })
                .catch((err) => {
                    dispatch(setAddLoading(false))
                });
        }
    }, [id]);

    const getDropdownData = useCallback((storeId) => {
        DropdownService.getDropdownValues("storebrand", false, storeId).then((res) => {
            if (res.data.success) {
                setBrands(() => {
                    return res.data.data;
                });
            }
        });
        DropdownService.getDropdownValues("storeproduct", false, storeId).then((res) => {
            if (res.data.success) {
                setProducts(() => {
                    return res.data.data;
                });
            }
        });
        CategoryMasterService.getCategoryDropdownOptions(-1, storeId).then((res) => {
            if (res.data.success) {
                setCategory(res.data.data);
            }
        });
        DropdownService.getDropdownValues("customer", false, storeId).then((res) => {
            if (res.data.success) {
                setSpecificCustomersList(() => {
                    return res.data.data;
                });

            }
        });
    }, []);

    useEffect(() => {
        if (data?.storeId) {
            getDropdownData(data?.storeId)
        }
    }, [data?.storeId]);
    useEffect(() => {
        DropdownService.getDropdownValues("store").then((res) => {
            if (res.data.success) {
                setStores(() => {
                    return res.data.data;
                });
            }
        });
        getPromotionDataById();
    }, []);

    const validationSchema = Yup.object({
        name: Yup.string().required(ValidationMsgs.promotions.namerequired),
        storeId: Yup.string().required(ValidationMsgs.promotions.storeIdRequired),
        discountCode: Yup.string().required(ValidationMsgs.promotions.discountcodeRequired),
        status: Yup.string().required(ValidationMsgs.promotions.statusRequired),
        startDate: Yup.string().required(ValidationMsgs.promotions.startDateRequired),
        startTime: Yup.string().required(ValidationMsgs.promotions.startTimeRequired),

        endDate: Yup.string().required(ValidationMsgs.promotions.endDateRequired),
        endTime: Yup.string().required(ValidationMsgs.promotions.endTimeRequired),

        discountValue: Yup.number().when(['isPercentage',], {
            is: (isPercentage) => isPercentage,
            then: Yup.number().required(ValidationMsgs.promotions.discountValueRequired).max(100, ValidationMsgs.common.maxpercentage),
        }).when(['isFixedAmount'], {
            is: (isFixedAmount) => isFixedAmount,
            then: Yup.number().required(ValidationMsgs.promotions.discountValueRequired),
        }),
        recStatus: Yup.string().required(ValidationMsgs.promotions.recStatusRequired),
        IsAmountMinimumValue: Yup.number().when('isAmountMinimum', {
            is: true,
            then: Yup.number().required(ValidationMsgs.promotions.minAmount).min(1, ValidationMsgs.promotions.minAmount),
        }),
        isQuantityMinimumValue: Yup.number().when('isQuantityMinimum', {
            is: true,
            then: Yup.number().required(ValidationMsgs.promotions.minAmount).min(1, ValidationMsgs.promotions.minAmount),
        }),
        isLimitNoOfTimesValue: Yup.string().when('isLimitNoOfTimes', {
            is: true,
            then: Yup.string().required(ValidationMsgs.promotions.isLimitNoOfTimesValue),
        }),

        applyId: Yup.array().when('isBrand', {
            is: true,
            then: Yup.array().required(ValidationMsgs.promotions.isBrand).min(1, ValidationMsgs.promotions.isBrand),
        }).when('isCategory', {
            is: true,
            then: Yup.array().required(ValidationMsgs.promotions.isCategory).min(1, ValidationMsgs.promotions.isCategory),
        }).when('isSpecificProduct', {
            is: true,
            then: Yup.array().required(ValidationMsgs.promotions.specificProduct).min(1, ValidationMsgs.promotions.specificProduct),
        }),

        // RangeDetails: Yup.array()
        //     .of(
        //         Yup.object().shape({
        //             rangeFrom: Yup.number().required(ValidationMsgs.promotions.rangeFrom),
        //             rangeTo: Yup.number().when('rangeFrom', {
        //                 is: (value) => value !== "",
        //                 then: (rangeFrom) => Yup.number().min(rangeFrom, "Range To is must be grater than Range From"),
        //                 otherwise: Yup.number().required(ValidationMsgs.promotions.rangeTo)
        //             }),
        //             discountValue: Yup.number().required(ValidationMsgs.promotions.DiscountValue),
        //             valuePercentage: Yup.number().required(ValidationMsgs.promotions.DiscountValue)
        //         })
        //     )

        RangeDetails: Yup.array().when('isRange', {
            is: true,
            then: Yup.array().min(2, ValidationMsgs.promotions.rangeMin)
        })
    });

    const Create = (fields, resetForm) => {
        dispatch(setAddLoading(true))

        let promotionsNotCreated = ValidationMsgs.promotions.PromotionsNotCreated;
        PromotionsService.createPromotions({ promotionsModel: { ...fields, ...location } })
            .then((response) => {
                if (response.data.success) {
                    dispatch(
                        setAlertMessage({
                            type: "success",
                            message: ValidationMsgs.promotions.PromotionsCreated,
                        })
                    );
                    resetForm({});
                    CreateUpdatePromotionDetails(fields, response, resetForm);
                    if (fields.isRange) {
                        CreateAndUpdatePromotionRange(fields.RangeDetails, response, resetForm);
                    }
                    // return navigate("/admin/promotions/couponCodes");
                } else {
                    dispatch(
                        setAlertMessage({ type: "danger", message: serverError(response) })
                    )
                }

                dispatch(setAddLoading(false))

            })
            .catch((errors) => {
                dispatch(
                    setAlertMessage({ type: "danger", message: promotionsNotCreated })
                )

                dispatch(setAddLoading(false))

            });

    };

    const Update = (fields, resetForm) => {

        dispatch(setAddLoading(true))

        const promotionsNotUpdated = ValidationMsgs.promotions.PromotionsNotUpdated;
        PromotionsService.updatePromotion({ promotionsModel: { ...fields, ...location } })
            .then((response) => {
                if (response.data.success) {
                    dispatch(
                        setAlertMessage({
                            type: "success",
                            message: "",
                        })
                    );
                    getPromotionDataById();
                    if (fields.isRange) {
                        CreateAndUpdatePromotionRange(fields.RangeDetails, response, resetForm);
                    }
                    CreateUpdatePromotionDetails(fields, response, resetForm);
                } else {
                    // serverError(response);
                    dispatch(
                        setAlertMessage({ type: "danger", message: serverError(response) })
                    )
                    dispatch(setAddLoading(false))
                }

            })
            .catch((errors) => {
                if (errors.response.data.Errors.Error) {
                    dispatch(
                        setAlertMessage({
                            message: errors.response.data.Errors.Error,
                            type: "danger",
                        })
                    )
                } else {
                    dispatch(
                        setAlertMessage({ message: promotionsNotUpdated, type: "danger" })
                    )
                }

                dispatch(setAddLoading(false))

            });
    };

    const CreateAndUpdatePromotionRange = (values, PromotionData, resetForm) => {

        // dispatch(setAddLoading(true))

        values.splice(0, 1)
        PromotionsService.CreateAndUpdatePromotionRange(
            {
                args: {
                    id: PromotionData.data.data.id,
                    promotionsrangemodellist: values,
                    ...location,
                }
            }
        ).then((response) => {
            if (response.data.success) {
                dispatch(
                    setAlertMessage({
                        type: "success",
                        message: ValidationMsgs.promotions.PromotionsUpdated
                    })
                );
                resetForm({});
                getPromotionDataById()
            } else {
                console.log("check", response);
                dispatch(setAlertMessage({ type: "warning", message: serverError(response) }));
                dispatch(setAddLoading(false))

            }

        }).catch((errors) => {
            dispatch(setAddLoading(false))

            dispatch(setAlertMessage({ type: "danger", message: "Errors from Range API" }));
        });
    }

    const CreateUpdatePromotionDetails = (values, response) => {

        // dispatch(setAddLoading(true))

        // apply To
        let applyDetails = applyId[(values.isBrand ? 'brand' : (values.isCategory ? 'category' : 'product'))].object;
        const applyIds = values.applyId.map((vendor) => {
            const existVendor = applyId[(values.isBrand ? 'brand' : (values.isCategory ? 'category' : 'product'))].object.find((value) => value.applyId.toString() === vendor.toString());
            if (!existVendor) {
                applyDetails = [...applyDetails, { type: (values.isBrand ? 1 : (values.isCategory ? 2 : 3)), applyId: vendor, recStatus: 'A', rowVersion: '' }]
            }
            return vendor.toString();
        })

        applyDetails = applyDetails.map((vendor) => {
            if (applyIds.includes(vendor.applyId.toString())) {
                return { ...vendor, recStatus: 'A', applyId: [vendor.applyId] };
            } else {
                return { ...vendor, recStatus: 'R', applyId: [vendor.applyId] };
            }
        });
        // Customer eligibility
        let specificCustomers = applyId['customer'].object;
        const customerIds = values.specificCoustomerId.map((vendor) => {
            const existVendor = applyId['customer'].object.find((value) => value.applyId.toString() === vendor.toString());
            if (!existVendor) {
                specificCustomers = [...specificCustomers, { type: 4, applyId: vendor, recStatus: 'A', rowVersion: '' }]
            }
            return vendor.toString();
        })

        specificCustomers = specificCustomers.map((vendor) => {
            if (customerIds.includes(vendor.applyId.toString())) {
                return { ...vendor, recStatus: 'A', applyId: [vendor.applyId] };
            } else {
                return { ...vendor, recStatus: 'R', applyId: [vendor.applyId] };
            }
        });
        let promotionsDetailModelList = [
            ...applyDetails,
            ...specificCustomers
        ];

        PromotionsService.createAndUpdatePromotionDetail({
            args: {
                id: response.data.data.id,
                promotionsdetailmodellist: promotionsDetailModelList,
                ...location,
            }
        }).then(response => {
            if (response.data.success) {
                dispatch(
                    setAlertMessage({
                        type: "success",
                        message: ValidationMsgs.promotions.PromotionsUpdated,
                    })
                );
            } else {
                dispatch(
                    setAlertMessage({ type: "danger", message: serverError(response) })
                )
                dispatch(setAddLoading(false))
            }

        }).catch(error => {
            dispatch(setAddLoading(false))

        })
    }

    const onSubmit = (fields, { resetForm }) => {
        if (isAddMode) {
            Create(fields, resetForm);
        } else {
            Update(fields, resetForm);
        }
        return;
        var startDt = new Date(fields.startDate);
        var endDt = new Date(fields.endDate);

        var startDate = new Date(`${startDt.getFullYear()}-${startDt.getMonth() + 1}-${startDt.getDate()} ${fields.startTime}`).getTime();
        var endDate = new Date(`${endDt.getFullYear()}-${endDt.getMonth() + 1}-${endDt.getDate()} ${fields.endTime}`).getTime();

        if (endDate >= startDate) {
            if (isAddMode) {
                Create(fields, resetForm);
            } else {
                Update(fields, resetForm);
            }
        } else {
            dispatch(
                setAlertMessage({
                    type: "danger",
                    message: "Start date time must be less than End date time",
                })
            );
        }
    };

    // const checkIsEndDateChecked = (values) => {
    //     if (!isAddMode && values?.setEndDate && values?.endDate) {
    //         return true
    //     } else if (values.setEndDate) {
    //         return true
    //     }
    // }

    return (
        <>
            <title>{isAddMode ? "Add Promotions" : "Edit Promotions"}</title>

            <Formik
                enableReinitialize={true}
                initialValues={{
                    id: data?.id || 0,
                    name: data?.name || "",
                    storeId: data?.storeId || "",
                    status: data?.status || "A",
                    isPercentage: data.isPercentage || (!data?.isFixedAmount && !data?.isFreeShipping && !data?.isFreeShippingisRange && !data?.isRange),
                    isFixedAmount: data.isFixedAmount || false,
                    isFreeShipping: data.isFreeShipping || false,
                    isRange: data.isRange || false,
                    discountValue: data?.discountValue || 0,
                    discountCode: data?.discountCode || "",

                    isAllProduct: data?.isAllProduct || (!data?.isSpecificProduct && !data?.isCategory && !data?.isBrand),
                    isSpecificProduct: data?.isSpecificProduct || false,
                    isCategory: data?.isCategory || false,
                    isBrand: data?.isBrand || false,
                    applyId: (data?.isBrand ? applyId.brand.ids : (
                        data?.isCategory ? applyId.category.ids : (
                            data?.isSpecificProduct ? applyId.product.ids : []))),
                    isNoneMinimum: data?.isNoneMinimum || (!data?.isAmountMinimum && !data?.isQuantityMinimum && !data?.isAmountMinimumValue),
                    isAmountMinimum: data?.isAmountMinimum || false,
                    isQuantityMinimum: data?.isQuantityMinimum || false,
                    IsAmountMinimumValue: data?.isAmountMinimumValue || 0,
                    isQuantityMinimumValue: data?.isQuantityMinimumValue || 0,
                    isEveryone: (data?.isEveryone === undefined ? true : data?.isEveryone) || false,
                    specificCoustomerId: applyId?.customer.ids || [],

                    startDate: data?.startDate || "",
                    endDate: data?.endDate || "",
                    setEndDate: (data?.endDate ? true : false) || false,
                    startTime: data?.startTime || "",
                    endTime: data?.endTime || "",
                    isLimitNoOfTimes: data?.isLimitNoOfTimes || false,
                    isLimitNoOfTimesValue: data?.isLimitNoOfTimesValue || 0,
                    isLimitOneUser: data?.isLimitOneUser || false,
                    recStatus: data?.recStatus || RecStatusValuebyName.Active,
                    rowVersion: data?.rowVersion || "",
                    RangeDetails: [{
                        id: 0,
                        promotionsId: 0,
                        rangeFrom: "",
                        rangeTo: "",
                        discountValue: "",
                        valuePercentage: "",
                        recStatus: RecStatusValuebyName.Active,
                        rowVersion: ""
                    }, ...(data?.promotionsrangemodellist ? [...data?.promotionsrangemodellist] : [])],
                }}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                validateOnMount={true}
                validateOnBlur={true}
            >
                {({ setFieldValue, errors, values, setValues, setFieldError, validateForm }) => {
                    return (

                        <FormikForm>
                            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto">
                                {/* <div className="w-full flex justify-between mb-8">
                                    <h1 className="flex items-center">
                                        <Link to={"/admin/promotions/couponCodes"} className="btn border-neutral-200 hover:border-neutral-400 text-gray-500 hover:text-gray-700 flex items-center mr-2">
                                            <span className="material-icons-outlined">west</span>
                                        </Link>
                                        <span className="text-2xl md:text-3xl text-gray-800 font-bold">{isAddMode ? "Add Promotions" : "Edit Promotions"}</span>
                                    </h1>
                                    <div className="flex flex-wrap space-x-2">
                                        <Link className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700" to={"/admin/promotions/couponCodes"}>
                                            Discard
                                        </Link>
                                        <button disabled={saveLoading} className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(saveLoading) ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`} type="submit">
                                            <div className={`w-full flex justify-center align-middle `}>
                                                {saveLoading && (
                                                    <span className="spinner-border spinner-border-sm mr-2"></span>
                                                )}
                                                Save
                                            </div>
                                        </button>
                                    </div>
                                </div> */}
                                <CreateFileHeader url="/admin/promotions/couponCodes" module={isAddMode ? "Add Promotions" : "Edit Promotions"} errors={errors} validateForm={validateForm} />
                                <Messages />
                                {/* Start */}
                                <div className="grid grid-cols-12 gap-6 pt-5">
                                    <div className={`col-span-full ${!isAddMode && 'xl:col-span-9'}`}>
                                        <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                                            <div className="w-full mb-6 last:mb-0">
                                                <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                                                    Discount Name
                                                    <span className="text-rose-500 text-2xl leading-none">*</span>
                                                </label>
                                                <Input name="name" id="name" type="text" />
                                            </div>
                                            <div className="w-full mb-6 last:mb-0">
                                                <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                                                    Store
                                                    <span className="text-rose-500 text-2xl leading-none">*</span>
                                                </label>
                                                <Dropdown
                                                    defaultValue={values.storeId}
                                                    name={"storeId"}
                                                    options={stores}
                                                    onChange={(data) => {
                                                        getDropdownData(data.value);
                                                        setFieldValue("storeId", data.value);
                                                    }}
                                                    isClearable={false}
                                                />
                                            </div>
                                        </div>

                                        {/* DISCOUNT CODE */}
                                        <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                                            <div className="w-full flex justify-between pb-4">
                                                <label className="block text-left uppercase tracking-wide text-gray-500 text-s font-bold mb-2">Discount Code</label>
                                                {(permission?.isEdit || permission?.isDelete) && <button className="text-right tracking-wide text-blue-600 text-s font-bold" type="button" onClick={() => setFieldValue("discountCode", GenerateCode())}>
                                                    Generate Code
                                                </button>}
                                            </div>
                                            <Input name="discountCode" id="name" type="text" maxLength={20} />
                                            <label className="mt-2">Customers will enter this discount code at checkout.</label>
                                        </div>

                                        {/* Type */}
                                        <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                                            <div className="w-full pb-2">
                                                <label className="block text-left uppercase tracking-wide text-gray-500 text-s font-bold mb-2">Type</label>
                                            </div>
                                            <div className="w-full flex pb-2">
                                                <RadioButton
                                                    type="radio"
                                                    name="promotionType"
                                                    value="isPercentage"
                                                    id={'isPercentage'}
                                                    onChange={(e) => {
                                                        setValues((prev) => {
                                                            return { ...prev, isPercentage: e.target.checked, isFixedAmount: false, isFreeShipping: false, isRange: false, }
                                                        });
                                                    }}
                                                    checked={values.isPercentage}
                                                    label={'Percentage'}
                                                />

                                            </div>

                                            <div className="w-full flex pb-2">
                                                <RadioButton
                                                    type="radio"
                                                    name="promotionType"
                                                    value="isFixedAmount"

                                                    id={'isFixedAmount'}
                                                    onChange={(e) => {
                                                        // setFieldValue('promotionType', e.target.value);
                                                        setValues((prev) => {
                                                            return { ...prev, isPercentage: false, isFixedAmount: e.target.checked, isFreeShipping: false, isRange: false, }
                                                        });
                                                    }}
                                                    checked={values.isFixedAmount}
                                                    label={'Fixed Amount'}
                                                />
                                            </div>

                                            <div className="w-full flex pb-2">
                                                <RadioButton
                                                    type="radio"
                                                    name="promotionType"
                                                    value="isFreeShipping"

                                                    id={'isFreeShipping'}
                                                    onChange={(e) => {
                                                        // setFieldValue('promotionType', e.target.value);
                                                        setValues((prev) => {
                                                            return { ...prev, isPercentage: false, isFixedAmount: false, isFreeShipping: e.target.checked, isRange: false, }
                                                        });
                                                    }}
                                                    checked={values.isFreeShipping}
                                                    label={'Free Shipping'}
                                                />
                                            </div>

                                            <div className="w-full flex pb-2">
                                                <RadioButton
                                                    type="radio"
                                                    name="promotionType"
                                                    value="isRange"
                                                    id={'isRange'}
                                                    onChange={(e) => {
                                                        // setFieldValue('promotionType', e.target.value);
                                                        setValues((prev) => {
                                                            return { ...prev, isPercentage: false, isFixedAmount: false, isFreeShipping: false, isRange: e.target.checked, }
                                                        });
                                                    }}
                                                    checked={values.isRange}
                                                    label={'Range'}
                                                />
                                            </div>
                                        </div>

                                        {/* VALUES & APPLIES TO */}
                                        <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                                            <div className="w-full">
                                                {(values?.isPercentage || values?.isFixedAmount) && (
                                                    <>
                                                        <div className="w-full border-b border-neutral-300 last:mb-0 mb-4 pb-4">
                                                            <div className="w-full flex justify-between pb-2">
                                                                <label className="block text-left uppercase tracking-wide text-gray-500 text-s font-bold mb-2">Values</label>
                                                            </div>
                                                            <div className="w-1/2 relative pr-7">
                                                                {values?.isPercentage &&
                                                                    <>
                                                                        <label className="block text-sm font-medium mb-1">Discount value</label>
                                                                        <span className="material-icons-outlined w-9 h-9  text-gray-500 text-xl absolute right-6">%</span>
                                                                    </>}
                                                                {values?.isFixedAmount &&
                                                                    <>
                                                                        <label className="block text-sm font-medium mb-1">Discount value</label>
                                                                        <div className="absolute mt-6 w-9 h-9 left-0 top-0 flex items-center justify-center">
                                                                            <span className="material-icons-outlined">
                                                                                attach_money
                                                                            </span>
                                                                        </div>
                                                                    </>}
                                                                <InputNumber
                                                                    className={`${values.isFixedAmount ? 'pl-8' : ''} border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 p-2.5`}
                                                                    id="discountValue"
                                                                    name="discountValue"
                                                                    defaultValue={values?.discountValue}
                                                                    value={values?.discountValue}
                                                                    onChange={(e) => {
                                                                        setFieldValue(e.target.name, e.target.value || 0);
                                                                        // if (e.target.value >= 0 && e.target.value <= 100) {
                                                                        // } else {
                                                                        //     setFieldValue(e.target.name, e.target.value.slice(0, -1));
                                                                        // }
                                                                    }}
                                                                    displayError={true}
                                                                    maxLength={values.isFixedAmount ? 10 : 3}
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                                {values?.isRange && (
                                                    <>
                                                        <div className=" w-full border-b border-neutral-300 last:mb-0 mb-4 ">
                                                            <div className="w-full flex justify-between">
                                                                <label className="block text-left uppercase tracking-wide text-gray-500 text-s font-bold ">Values</label>
                                                            </div>
                                                            <ErrorMessage name={'RangeDetails'} component={FormErrorMessage} />
                                                            <RangeValues />
                                                        </div>
                                                    </>
                                                )}
                                                <div className="w-full flex justify-between pb-2">
                                                    <label className="block text-left uppercase tracking-wide text-gray-500 text-s font-bold mb-2">Applies To</label>
                                                </div>
                                                <div className="w-full flex pb-2">
                                                    <RadioButton
                                                        type="radio"
                                                        name="appliesTo"
                                                        value="isAllProduct"
                                                        id={'isAllProduct'}
                                                        onChange={(e) => {
                                                            setValues((prev) => {
                                                                return { ...prev, isBrand: false, isCategory: false, isAllProduct: e.target.checked, isSpecificProduct: false, applyId: [] }
                                                            });
                                                        }}
                                                        checked={values.isAllProduct}
                                                        label={'All Products'}
                                                    />
                                                </div>

                                                <div className="w-full flex pb-1">
                                                    <RadioButton
                                                        type="radio"
                                                        name="appliesTo"
                                                        value="isBrand"
                                                        id={'isBrand'}
                                                        onChange={(e) => {
                                                            setValues((prev) => {
                                                                return { ...prev, isBrand: e.target.checked, isCategory: false, isAllProduct: false, isSpecificProduct: false, applyId: [] }
                                                            });
                                                        }}
                                                        checked={values.isBrand}
                                                        label={'Brands'}
                                                    />
                                                </div>
                                                {values.isBrand && <Dropdown isMulti={true} hidecheckbox={false} name={"applyId"} defaultValue={values.applyId} options={Brands} />}

                                                <div className="w-full flex pb-1 pt-3">
                                                    <RadioButton
                                                        type="radio"
                                                        name="appliesTo"
                                                        value="isCategory"
                                                        id={'isCategory'}
                                                        onChange={(e) => {
                                                            setValues((prev) => {
                                                                return { ...prev, isBrand: false, isCategory: e.target.checked, isAllProduct: false, isSpecificProduct: false, applyId: [] }
                                                            });
                                                        }}
                                                        checked={values.isCategory}
                                                        label={'Category'}
                                                    />
                                                </div>
                                                {values.isCategory && <Dropdown isMulti={true} hidecheckbox={false} name={"applyId"} defaultValue={values.applyId} options={category} />}

                                                <div className="w-full flex pb-1 pt-3">
                                                    <RadioButton
                                                        type="radio"
                                                        name="appliesTo"
                                                        value="isSpecificProduct"
                                                        id={'isSpecificProduct'}
                                                        onChange={(e) => {
                                                            setValues((prev) => {
                                                                return { ...prev, isBrand: false, isCategory: false, isAllProduct: false, isSpecificProduct: e.target.checked, applyId: [] }
                                                            });
                                                        }}
                                                        checked={values.isSpecificProduct}
                                                        label={'Specific Products'}
                                                    />
                                                </div>
                                                {values.isSpecificProduct && <Dropdown isMulti={true} hidecheckbox={false} name={"applyId"} defaultValue={values.applyId} options={products} />}
                                            </div>
                                        </div>

                                        {/* MINIMUM REQUIREMENTS */}
                                        <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                                            <div className="w-full flex justify-between pb-4">
                                                <label className="block text-left uppercase tracking-wide text-gray-500 text-s font-bold mb-2">Minimum requirements</label>
                                            </div>
                                            <div className="w-full flex pb-2">
                                                <RadioButton
                                                    type="radio"
                                                    name="MinimumRequirements"
                                                    value="isNoneMinimum"
                                                    id={'isNoneMinimum'}
                                                    onChange={(e) => {
                                                        setValues((prev) => {
                                                            return { ...prev, isNoneMinimum: e.target.checked, isAmountMinimum: false, isQuantityMinimum: false }
                                                        });
                                                    }}
                                                    checked={values.isNoneMinimum}
                                                    label={'None'}
                                                />
                                            </div>

                                            <div className="w-full flex pb-2">
                                                <RadioButton
                                                    type="radio"
                                                    name="MinimumRequirements"
                                                    value="isAmountMinimum"
                                                    id={'isAmountMinimum'}
                                                    onChange={(e) => {
                                                        setValues((prev) => {
                                                            return { ...prev, isNoneMinimum: false, isAmountMinimum: e.target.checked, isQuantityMinimum: false }
                                                        });
                                                    }}
                                                    checked={values.isAmountMinimum}
                                                    label={'Minimum purchase amount($)'}
                                                />
                                            </div>
                                            {values.isAmountMinimum && (
                                                <div className="w-full">
                                                    <div className="relative w-1/2 inset-y-0 left-0 items-center mt-1">
                                                        <span className="material-icons-outlined text-gray-500 text-xl absolute ml-3">$</span>
                                                        <InputNumber
                                                            displayError={true}
                                                            value={values.IsAmountMinimumValue}
                                                            onChange={(e) => {
                                                                setFieldValue(e.target.name, (e.target.value === '' ? 0 : e.target.value));
                                                            }}
                                                            maxLength={10}
                                                            allowNegative={false}
                                                            name={"IsAmountMinimumValue"}
                                                            className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5" />
                                                    </div>
                                                    <label className="block text-sm font-medium mb-2 ml-7">Applies to all products</label>
                                                </div>
                                            )}

                                            <div className="w-full flex pb-2">
                                                <RadioButton
                                                    type="radio"
                                                    name="MinimumRequirements"
                                                    value="isQuantityMinimum"
                                                    id={'isQuantityMinimum'}
                                                    onChange={(e) => {
                                                        setValues((prev) => {
                                                            return { ...prev, isNoneMinimum: false, isAmountMinimum: false, isQuantityMinimum: e.target.checked }
                                                        });
                                                    }}
                                                    checked={values.isQuantityMinimum}
                                                    label={'Minimum quantity of items'}
                                                />
                                            </div>
                                            {values.isQuantityMinimum && (
                                                <div className="w-full">
                                                    <div className="relative w-1/2 inset-y-0 left-0 items-center mt-2">
                                                        <InputNumber
                                                            displayError={true}
                                                            value={values.isQuantityMinimumValue}
                                                            onChange={(e) => {
                                                                setFieldValue(e.target.name, (e.target.value === '' ? 0 : e.target.value));
                                                            }}
                                                            maxLength={10}
                                                            allowNegative={false}
                                                            decimalScale={0}
                                                            name={"isQuantityMinimumValue"}
                                                            className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                        />
                                                    </div>
                                                    <label className="block text-sm font-medium mb-2 ml-7">Applies to all products</label>
                                                </div>
                                            )}
                                        </div>

                                        {/* Customer eligibility */}
                                        <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                                            <div className="w-full flex justify-between pb-2">
                                                <label className="block text-left uppercase tracking-wide text-gray-500 text-s font-bold mb-2">Customer eligibility</label>
                                            </div>
                                            <div className="w-full flex pb-2">
                                                <RadioButton
                                                    type="radio"
                                                    name="CustomerEligibility"
                                                    value="isEveryone"
                                                    id={'isEveryone'}
                                                    onChange={(e) => {
                                                        setValues(prev => {
                                                            return { ...prev, isEveryone: e.target.checked }
                                                        })
                                                    }}
                                                    checked={values.isEveryone}
                                                    label={'Everyone'}
                                                />
                                            </div>

                                            <div className="w-full flex pb-2">
                                                <RadioButton
                                                    type="radio"
                                                    name="CustomerEligibility"
                                                    value="SpecificCustomers"
                                                    id={'SpecificCustomers'}
                                                    onChange={(e) => {
                                                        setValues(prev => {
                                                            return { ...prev, isEveryone: !e.target.checked }
                                                        })
                                                    }}
                                                    checked={!values.isEveryone}
                                                    label={'Specific Customers'}
                                                />
                                            </div>
                                            {!values.isEveryone && (
                                                <>
                                                    <Dropdown isMulti={true} hidecheckbox={false} defaultValue={values.specificCoustomerId} name={"specificCoustomerId"} options={specificCustomersList} />
                                                </>
                                            )}
                                        </div>

                                        {/* USAGE LIMITS */}
                                        <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                                            <div className="w-full flex justify-between pb-2">
                                                <label className="block text-left uppercase tracking-wide text-gray-500 text-s font-bold mb-2">Usage limits</label>
                                            </div>
                                            <div className="mb-2">
                                                <Checkbox
                                                    name="isLimitNoOfTimes"
                                                    id="isLimitNoOfTimes"
                                                    onChange={(e) => {
                                                        setFieldValue(`isLimitNoOfTimes`, e.target.checked);
                                                    }}
                                                    checked={values.isLimitNoOfTimes}
                                                    className={"form-checkbox"}
                                                    label={"Limit number of times this discount can be used in total"}
                                                />
                                            </div>
                                            {values.isLimitNoOfTimes && (
                                                <div className="w-full">
                                                    <div className="relative w-1/2 inset-y-0 left-0 items-center mt-2">
                                                        <InputNumber
                                                            displayError={true}
                                                            value={values.isLimitNoOfTimesValue}
                                                            onChange={(e) => {
                                                                setFieldValue(e.target.name, e.target.value);
                                                            }}
                                                            maxLength={10}
                                                            allowNegative={false}
                                                            decimalScale={0} name={"isLimitNoOfTimesValue"} className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full" />
                                                    </div>
                                                    <label className="block text-sm font-medium mb-2">Applies to all products</label>
                                                </div>
                                            )}
                                            <div>
                                                <Checkbox
                                                    name="isLimitOneUser"
                                                    id="isLimitOneUser"
                                                    onChange={(e) => {
                                                        setFieldValue(`isLimitOneUser`, e.target.checked);
                                                    }}
                                                    className={"form-checkbox"}
                                                    checked={values.isLimitOneUser}
                                                    label={"Limit to one use per customer"}
                                                />
                                            </div>
                                        </div>

                                        {/* Active Dates */}
                                        <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                                            <div >
                                                <div className="text-md text-gray-500 font-bold pb-6">Active dates</div>
                                                <div className="w-full flex flex-wrap mb-6">
                                                    <div className="w-1/2">
                                                        <div className="w-full">
                                                            <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                                                                Start Date
                                                                <span className="text-rose-500 text-2xl leading-none">*</span>
                                                            </label>
                                                            <div className="relative md:mr-2">
                                                                <DatePicker name="startDate" defaultValue={values.startDate} maxDate={new Date(values.endDate)}
                                                                    onChange={(e) => {
                                                                        setFieldValue("startDate", e)
                                                                    }}
                                                                />
                                                                {
                                                                    errors["startDate1"] ? <span className="text-rose-500">{errors["startDate1"]}</span> : ""
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="w-1/2">
                                                        <div className="w-full">
                                                            <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                                                                Start Time (EST)
                                                                <span className="text-rose-500 text-2xl leading-none">*</span>
                                                            </label>
                                                            <div className="relative md:ml-2">
                                                                <Input type="time" name={"startTime"} className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Select Time"
                                                                    onChange={(e) => {
                                                                        setFieldValue("startTime", e.target.value)
                                                                    }}
                                                                />
                                                                {
                                                                    errors["startTime1"] ? <span className="text-rose-500">{errors["startTime1"]}</span> : ""
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <div>
                                                    <div label={'Set End Date'} id={'setEndDate'} name={"setEndDate"} onChange={(e) => setFieldValue("setEndDate", e.target.checked)} checked={values.setEndDate} />
                                                </div> */}
                                                {/* Checkbox Set End Date */}
                                                <div className="w-full py-2">
                                                    {/* {checkIsEndDateChecked(values) && ( */}
                                                    <div >
                                                        <div className="w-full flex flex-wrap mb-6">
                                                            <div className="w-1/2">
                                                                <div className="w-full">
                                                                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                                                                        End Date
                                                                        <span className="text-rose-500 text-2xl leading-none">*</span>
                                                                    </label>
                                                                    <div className="relative md:mr-2">
                                                                        <DatePicker name={"endDate"} defaultValue={values.endDate} minDate={new Date(values.startDate).setDate(new Date(values.startDate).getDate())}
                                                                            onChange={(e) => {
                                                                                setFieldValue("endDate", e)
                                                                            }}
                                                                        />
                                                                        {
                                                                            errors["endDate1"] ? <span className="text-rose-500">{errors["endDate1"]}</span> : ""
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="w-1/2">
                                                                <div className="w-full">
                                                                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                                                                        End Time (EST)
                                                                        <span className="text-rose-500 text-2xl leading-none">*</span>
                                                                    </label>
                                                                    <div className="relative md:ml-2">
                                                                        <Input type="time" name={"endTime"} min={(new Date(values.startDate) > new Date(values.endDate)) ? values.startTime : 0} className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Select Time"

                                                                            onChange={(e) => {
                                                                                setFieldValue("endTime", e.target.value)
                                                                            }}
                                                                        />

                                                                        {
                                                                            errors["endTime1"] ? <span className="text-rose-500">{errors["endTime1"]}</span> : ""
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* )} */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right side Contents */}
                                    {!isAddMode &&
                                        <div className="flex flex-col col-span-full xl:col-span-3">
                                            <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 mb-6">
                                                <div className="border-b-2 border-neutral-200 p-6">
                                                    <div className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2"> Summary </div>
                                                    <div className="w-full flex justify-between mb-2">
                                                        <div className="flex">
                                                            <span className="text-sm text-gray-800 font-bold">Add Promotions</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            {<Status type={data.status} />}
                                                        </div>
                                                    </div>
                                                    <ul className="list-disc ml-4">
                                                        {values.isPercentage &&
                                                            <li className="text-gray-800"><span className="text-gray-800 font-bold" >{data?.discountValue} %</span> off on all Selected Products </li>
                                                        }
                                                        {values.isFixedAmount &&
                                                            <li className="text-gray-800">$ <span className="text-gray-800 font-bold" >{data?.discountValue}</span> off on all Selected Products </li>
                                                        }
                                                        {values.isFreeShipping &&
                                                            <li>Free Shipping</li>
                                                        }
                                                        {values.isAmountMinimum &&
                                                            <li className="text-gray-800"> Minimum Purchase Of<span className="text-gray-800 font-bold" > $ {data?.isAmountMinimumValue}</span></li>
                                                        }
                                                        {values.isQuantityMinimum &&
                                                            <li className="text-gray-800">Minimum quantity <span className="text-sm text-gray-800 font-bold" >{data?.isQuantityMinimumValue}</span> </li>
                                                        }
                                                        {values.isEveryone &&
                                                            <li>Available For everyone</li>
                                                        }
                                                        {/* <li className="text-gray-800">Duration From <span className="text-s text-gray-800 font-bold" >{getStartDate} -- {data?.startTime}.</span></li>
                                                                <li className="text-gray-800">Duration  <span className="text-s text-gray-800 font-bold" >{getEndDate} -- {data?.endTime}.</span></li> */}
                                                        {data?.isLimitOneUser &&
                                                            <li>Limited to one use per customer</li>
                                                        }
                                                        {data?.isLimitNoOfTimes &&
                                                            <li>{data?.isLimitNoOfTimesValue} times code can be used.</li>
                                                        }
                                                    </ul>
                                                </div>
                                                <div className="p-6">
                                                    <div className="w-full flex justify-between mb-2">
                                                        <div className="flex">
                                                            <span className="text-sm text-gray-800 font-bold">Performance</span>
                                                        </div>
                                                    </div>
                                                    <ul className="list-disc ml-4">
                                                        <li>{data?.totalDiscountCodesUsed} used</li>
                                                    </ul>
                                                    <span className="text-indigo-500 mt-2 cursor-pointer" onClick={() => setOpenDiscountReport(true)}>View the sales by discount report</span>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                                {/* end */}
                            </div>
                        </FormikForm>
                    );
                }}
            </Formik>
            {(!isAddMode && OpenDiscountReport) && <SalesDiscountReport OpenDiscountReport={OpenDiscountReport} setOpenDiscountReport={setOpenDiscountReport} id={id} />}
        </>
    );
};
export default Create;
