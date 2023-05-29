/*Component Name: Attributes
Component Functional Details: User can create or update Attributes master details from here.
Created By: Ankit Sharma
Created Date: 11/16/2022
Modified By: Ankit Sharma
Modified Date: 11/16/2022  */

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Formik, Form as FormikForm, FieldArray } from "formik";
import * as Yup from "yup";
import { RecStatusValuebyName } from "global/Enum";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { useDispatch, useSelector } from "react-redux";
import { serverError } from "services/common/helper/Helper";
import AttributeImages from "./AttributeImages";
import AttributeDetails from "./AttributeDetails";
import MasterAttributesService from "services/admin/masterCatalog/masterCatalog/products/attribute/AttributesService";
import GrandMasterAttributesService from "services/admin/masterCatalog/grandMaster/products/attribute/AttributesService";
import StoreAttributesService from "services/admin/masterCatalog/store/product/attribute/AttributesService";
import StoreSyncModal from "./StoreSync/StoreSyncModal";
import { productType } from "dummy/Dummy";
import MasterAttributeImageService from "services/admin/masterCatalog/masterCatalog/products/attribute/AttributeImageService";
import GrandMasterAttributeImageService from "services/admin/masterCatalog/grandMaster/products/attribute/AttributeImageService";
import StoreAttributeImageService from "services/admin/masterCatalog/store/product/attribute/AttributeImageService";
import MasterAttributeCombinationService from "services/admin/masterCatalog/masterCatalog/products/attribute/AttributeCombinationService";
import GrandMasterAttributeCombinationService from "services/admin/masterCatalog/grandMaster/products/attribute/AttributeCombinationService";
import StoreAttributeCombinationService from "services/admin/masterCatalog/store/product/attribute/AttributeCombinationService";
import AttributeCombination from "./AttributeCombination";
import { ValidationMsgs } from "global/ValidationMessages";
import ReactTooltip from "react-tooltip";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const Attributes = ({ setFormSubmit, values, activeTab, index, setIsError, readOnly, type, isAddMode, productId, moduleName }) => {
    /*  const { id } = useParams();
     const isAddMode = !id */
    const valueByID = values;
    const formRef = useRef();
    const [checkerror, setCheckError] = useState(false);
    const [OpenStoreModal, setOpenStoreModal] = useState(false);
    const [ImageData, setImageData] = useState([]);
    const [CombinationData, setCombinationData] = useState([]);
    const [initialValues, setInitialValues] = useState(null);
    const [StoreSync, setStoreSync] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [IsEditDisable, setIsEditDisable] = useState(false);
    // const [parentId, setParentId] = useState(0);
    const dispatch = useDispatch();
    const location = useSelector((store) => store?.location);
    const [AttributesOption, setAttributesOption] = useState();
    const [SyncModalObject, setSyncModalObject] = useState(
        {
            attributeId: 0,
            attributeOptions: 0,
            storeList: []
        }
    );
    const API = (type == productType.MC ? MasterAttributesService : type == productType.GMC ? GrandMasterAttributesService : StoreAttributesService)
    const ImageAPI = (type == productType.MC ? MasterAttributeImageService : type == productType.GMC ? GrandMasterAttributeImageService : StoreAttributeImageService)
    const CombinationAPI = (type == productType.MC ? MasterAttributeCombinationService : type == productType.GMC ? GrandMasterAttributeCombinationService : StoreAttributeCombinationService)
    useEffect(() => {
        if (activeTab == index) {
            setFormSubmit(formRef.current);
        }
    }, [formRef, setFormSubmit, activeTab]);

    useEffect(() => {
        setIsError(checkerror);
    }, [checkerror]);

    const getAtrributeData = useCallback(() => {
        let temp = [];

        API.getAttributesByID(productId)
            .then((res) => {
                var response = res.data;

                if (response.success && response.data.length > 0) {
                    response.data.map((data, index) => {
                        temp = [...temp, { id: data.id, atributeId: data.atributeId, attributeFlag: data.attributeFlag, productId: data.productId, parentId: data.parentId, productName: data.productName, recStatus: data.recStatus, rowVersion: data.rowVersion, productAttributeOptionsList: data.productAttributeOptionsList }];
                    });
                }
                else {
                    temp = [...temp, { id: 0, atributeId: 0, attributeFlag: false, productId: productId, productName: "", parentId: parentID, recStatus: RecStatusValuebyName.Active, rowVersion: null, productAttributeOptionsList: [] }]
                }
                setInitialValues(temp);

            })
            .catch((err) => { });

    }, [productId, activeTab]);

    useEffect(() => {
        getAtrributeData();
    }, [productId]);

    useEffect(() => {
        if (SyncModalObject?.storeList?.length > 0 && SyncModalObject.storeList !== null && StoreSync) {
            handleStoreSyncModal()
        }
    }, [SyncModalObject]);

    const validationSchema = Yup.object().shape({
        productAttributeModel: Yup.array().of(
            Yup.object().shape({
                atributeId: Yup.number().required(ValidationMsgs.masterCatalog.attributes.optionNameRequired),
                productAttributeOptionsList: Yup.array().of(
                    Yup.object().shape({
                        value: Yup.string().required(ValidationMsgs.masterCatalog.attributes.optionValueRequired),
                        suffix: Yup.string().required(ValidationMsgs.masterCatalog.attributes.suffixRequired),
                    })
                ),
            })
        ),
    });
    let parentID = 0;
    const handleAttribute = (fields, resetForm) => {
        dispatch(setAddLoading(true))

        if (initialValues && initialValues !== undefined) {
            parentID = initialValues?.slice(-1)[0].id || 0;
        }

        if (fields?.id === 0) {
            API.createAttributes({
                productAttributeModel:
                    { ...fields, parentId: parentID, ...location }
            })
                .then((response) => {
                    if (response.data.success) {
                        dispatch(
                            setAlertMessage({
                                type: "success",
                                message: ValidationMsgs.attributes.attributeCreated,
                            })
                        );
                        getAtrributeData();
                        getCombinationData();
                    } else {
                        dispatch(setAlertMessage({ type: "danger", message: serverError(response) }));
                        getCombinationData();

                        dispatch(setAddLoading(false))
                    }
                })
                .catch((errors) => {
                    dispatch(
                        setAlertMessage({
                            type: "danger",
                            message: ValidationMsgs.attributes.attributeNotCreated,
                        })
                    );
                    getCombinationData();
                    dispatch(setAddLoading(false))
                });
        }
        else {
            API.updateAttributes({
                productAttributeModel:
                    { ...fields, ...location }
            })
                .then((response) => {
                    if (response.data.success) {
                        dispatch(
                            setAlertMessage({
                                type: "success",
                                message: ValidationMsgs.attributes.attributeUpdated,
                            })
                        );
                        getAtrributeData()
                        getCombinationData()
                    } else {
                        dispatch(setAlertMessage({ type: "danger", message: serverError(response) }));
                        getCombinationData();

                        dispatch(setAddLoading(false))
                    }
                })
                .catch((errors) => {
                    dispatch(
                        setAlertMessage({
                            type: "danger",
                            message: ValidationMsgs.attributes.attributeNotUpdated,
                        })
                    );
                    getCombinationData();
                    dispatch(setAddLoading(false))
                });
        }
    }
    useEffect(() => {
        getCombinationData()
    }, [])

    const getCombinationData = useCallback(() => {
        dispatch(setAddLoading(true))


        ImageAPI.getAttributeImagesByID({ productId: productId }).then((response) => {
            if (response.data.success) {
                setImageData(response.data.data)
            }

        }).catch((errors) => {
            dispatch(setAddLoading(false))
        });

        CombinationAPI.getAttributeCombinationByID(productId).then((response) => {
            if (response.data.success) {
                setCombinationData(response.data.data)
            }
            dispatch(setAddLoading(false))

        }).catch((errors) => {
            dispatch(setAddLoading(false))
        });
    }, [])
    const handleStoreSyncModal = () => {
        setOpenStoreModal(true)

    }
    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={{ productAttributeModel: initialValues }}
                validationSchema={validationSchema}
                onSubmit={handleAttribute}
            >
                {({ setFieldValue, errors, resetForm, values, setTouched, validateForm }) => {
                    return (
                        <FormikForm>
                            <div className="p-6">
                                <FieldArray
                                    name={`productAttributeModel`}
                                    render={(fieldArrayProps) => {
                                        const { form } = fieldArrayProps;

                                        return (
                                            <>
                                                {type !== productType.Bundle &&
                                                    <div className="option-list" key={index}>
                                                        <ul className="option-items">
                                                            {form.values.productAttributeModel?.map((attribute, index) => {
                                                                return (
                                                                    <AttributeDetails
                                                                        attribute={attribute}
                                                                        index={index}
                                                                        key={index}
                                                                        values={values}
                                                                        parentID={parentID}
                                                                        type={type}
                                                                        setAttributesOption={setAttributesOption}
                                                                        AttributesOption={AttributesOption}
                                                                        handleAttribute={handleAttribute}
                                                                        handleStoreSyncModal={handleStoreSyncModal}
                                                                        resetForm={resetForm}
                                                                        setFieldValue={setFieldValue}
                                                                        readOnly={readOnly}
                                                                        setStoreSync={setStoreSync}
                                                                        setSyncModalObject={setSyncModalObject}
                                                                        saveLoading={saveLoading}
                                                                        setSaveLoading={setSaveLoading}
                                                                        errors={errors}
                                                                        setIsEditDisable={setIsEditDisable}
                                                                        IsEditDisable={IsEditDisable}
                                                                        validateForm={validateForm}
                                                                    />
                                                                );
                                                            })}
                                                        </ul>
                                                        {(type !== productType.StoreBuilder && !valueByID.isCloned) &&
                                                            <>
                                                                <div className="mt-3 flex items-center justify-end gap-2">
                                                                    <button type="button" className={`btn border-indigo-300 hover:border-indigo-400 text-indigo-500`} onClick={() => {
                                                                        fieldArrayProps.push({
                                                                            id: 0,
                                                                            atributeId: 0,
                                                                            productId: productId,
                                                                            productType: "",
                                                                            attributeFlag: false,
                                                                            productAttributeOptionsList: [],
                                                                            recStatus: RecStatusValuebyName.Active,
                                                                            rowVersion: null,
                                                                        });
                                                                    }}
                                                                        disabled={IsEditDisable || form.dirty}
                                                                    >
                                                                        {(IsEditDisable || form.dirty) &&
                                                                            <>
                                                                                <span data-tip data-for='page-url-tip' className="material-icons-outlined mr-2 text-sm">info</span>
                                                                                <ReactTooltip id='page-url-tip' type='dark' effect="solid">
                                                                                    <span>Save pending changes to add other attribute.</span>
                                                                                </ReactTooltip>
                                                                            </>
                                                                        }

                                                                        {"Add Attribute"}
                                                                    </button>


                                                                </div>
                                                            </>
                                                        }
                                                    </div>
                                                }
                                            </>
                                        );
                                    }}
                                />
                            </div>
                        </FormikForm>
                    );
                }}
            </Formik>
            {ImageData.length > 0 &&
                <>
                    <AttributeImages CombinationData={ImageData} getCombinationData={getCombinationData} valueByID={valueByID} readOnly={readOnly} ImageAPI={ImageAPI} productId={productId} type={type} moduleName={moduleName} />
                </>
            }
            {type !== productType.Bundle &&
                <>
                    {
                        CombinationData.length > 0 &&
                        <>
                            <AttributeCombination AttributesOption={AttributesOption} CombinationData={CombinationData} getCombinationData={getCombinationData} readOnly={readOnly} CombinationAPI={CombinationAPI} productId={productId} type={type} />
                        </>
                    }
                    {OpenStoreModal &&
                        <StoreSyncModal setOpenStoreModal={setOpenStoreModal} OpenStoreModal={OpenStoreModal} SyncModalObject={SyncModalObject} />
                    }
                </>
            }
        </>
    );
};

export default Attributes;



