/*Component Name: AttributeDetails
Component Functional Details: User can create or update AttributeDetails master details from here.
Created By: Ankit Sharma
Created Date: 11/16/2022
Modified By: Ankit Sharma
Modified Date: 11/16/2022 */

import React, { useState, useEffect, Fragment } from "react";
import Input from "components/common/formComponent/Input";
import { FieldArray, Formik, Form, useFormikContext, setNestedObjectValues, FormikTouched, FormikValues } from "formik";
import Checkbox from "components/common/formComponent/Checkbox";
import Dropdown from "components/common/formComponent/Dropdown";
import DropdownService from "services/common/dropdown/DropdownService"
import SizeDetailsService from "services/admin/sizeDetails/SizeDetailsService";
import OptionConfirmationModal from "./OptionConfirmationModal";
import StoreSyncModal from "./StoreSync/StoreSyncModal";
import { useCallback } from "react";
import ReactTooltip from "react-tooltip";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { useDispatch } from "react-redux";
import { ValidationMsgs } from "global/ValidationMessages";
const AttributeDetails = ({
    readOnly,
    attribute,
    values,
    index,
    handleAttribute,
    saveLoading,
    setSaveLoading,
    setStoreSync,
    errors,
    setIsEditDisable,
    IsEditDisable,
    setSyncModalObject,
    resetForm,
    validateForm,
    setFieldValue,
    setAttributesOption,
    AttributesOption
}) => {
    const dispatch = useDispatch();
    const [FirstAttribute, setFirstAttribute] = useState()
    const [FirstAttrReady, setFirstAttrReady] = useState(false)
    const [SecondAttribute, setSecondAttribute] = useState()
    const [showEditOrDone, setShowEditOrDone] = useState(false);
    const [basicModalInfo, setModalInfo] = useState({});
    const [OpenConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [productTypeOptions, setProductTypeOptions] = useState([])
    const [ProductSizeOption, setProductSizeOption] = useState([]);
    let templateName = ""
    let sizeProdTypeId = attribute.productType
    let AttributeId = attribute.atributeId
    const [selectedAttrOption, setSelectedAttrOption] = useState([]);
    let Validate = []
    useEffect(() => {

        sizeProdTypeId = attribute.productType
        let selectedAttributeOption = [];
        values?.productAttributeModel?.map((option, index) => {
            if (option.atributeId.toString() !== attribute.atributeId.toString()) {
                selectedAttributeOption = [...selectedAttributeOption, option.atributeId.toString()];
            }
        });
        if (AttributesOption && AttributesOption !== undefined) {
            setSelectedAttrOption(() => {
                return AttributesOption?.filter((item, i) => {
                    return !selectedAttributeOption.includes(item.value.toString());
                })
            })
        }

        DropdownService.getDropdownValues(
            "attributes"
        ).then((response) => {
            if (response.data && response.data.data !== null) {
                setAttributesOption(() => {
                    return response.data.data;
                });
                if (response.data.data[0] !== undefined && index === 0) {
                    setFirstAttribute(response.data.data[0]);
                }
                else if (index === 1) {
                    setSecondAttribute(response.data.data[1]);
                    templateName = response.data.data[1].label
                    DropdownService.getDropdownValues(templateName).then((response) => {
                        setProductTypeOptions(() => {
                            return response.data.data;
                        });
                    });
                }
            }
        });
    }, [values?.productAttributeModel, attribute, FirstAttrReady])

    useEffect(() => {
        if (FirstAttribute && FirstAttribute !== undefined) {
            setFirstAttrReady(true)
        }
        let temp = [];
        if (sizeProdTypeId && sizeProdTypeId !== "") {
            SizeDetailsService.getProductSizeById(sizeProdTypeId)
                .then((response) => {
                    let options = []
                    const res = response.data.data;
                    if (res && res.length > 0) {
                        res.map((data, index) => {
                            options = [...options, { label: data.size, value: data.size }]
                        })
                    }
                    setProductSizeOption(options);
                    temp = [
                        {
                            id: 0,
                            rowVersion: null,
                            productAtributeId: 0,
                            value: "",
                            suffix: "",
                            storeIdList: [],
                            productName: "",
                        }
                    ];
                    return attribute.productAttributeOptionsList = temp;
                })
            setShowEditOrDone(true)

            Validate.length > 0 && setOpenConfirmationModal(true)
        }
    }, [sizeProdTypeId, FirstAttribute]);
    const handleVariantOption = (data) => {
        let temp = [];
        if (SecondAttribute !== "") {
            if ((sizeProdTypeId && sizeProdTypeId !== "") && (ProductSizeOption && ProductSizeOption.length != 0)) {
                temp = [
                    {
                        id: 0,
                        rowVersion: null,
                        productAtributeId: 0,
                        value: "",
                        suffix: "",
                        storeIdList: [],
                        productName: "",
                    }
                ];
                setOpenConfirmationModal(false)
                return attribute.productAttributeOptionsList = temp;
            }
        }
    }
    return (
        <>
            <li className="sm:flex sm:items-center sm:justify-between border-b border-neutral-200 py-4 option-item" key={index}>
                <div className="sm:grow flex">
                    {attribute.productAttributeOptionsList && attribute.productAttributeOptionsList?.length > 0 && (
                        <div className={`mx-2 grow  ${showEditOrDone ? "hidden" : ""}`}>
                            {AttributesOption?.map((attropt, index1) => {
                                return (
                                    <Fragment key={index1}>
                                        {attropt.value == AttributeId ? attropt.label : ""}
                                    </Fragment>
                                )
                            })
                            }
                            <ul className="flex-wrap items-center whitespace-nowrap flex">
                                {attribute.productAttributeOptionsList.map((attrValue, index2) => {
                                    return (
                                        <Fragment key={index2}>
                                            <li className="m-1.5 ml-0 flex items-center" key={index2}>
                                                <div className={`inline-flex font-medium border border-neutral-200 bg-slate-200 text-gray-500 rounded-full text-center px-2.5 py-1`}>
                                                    {attrValue.value}
                                                </div>
                                            </li>
                                        </Fragment>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                    <div
                        className={`mx-2 grow ${showEditOrDone || attribute.productAttributeOptionsList.length === 0
                            ? ""
                            : "hidden"
                            } `}
                    >
                        <div className="option-title font-medium text-gray-800">
                            <div className="mb-1">Attribute name</div>
                            <Dropdown
                                label={`Attribute name`}
                                name={`productAttributeModel.[${index}].atributeId`}
                                options={selectedAttrOption}
                                defaultValue={!readOnly ? (FirstAttribute ? FirstAttribute.value : SecondAttribute ? SecondAttribute.value : attribute.atributeId) : attribute.atributeId}
                                className="focus:ring-neutral-300 focus:shadow-lg py-1 max-w-xs w-full"
                                onChange={(data) => {
                                    if (data) {
                                        setFieldValue(
                                            `productAttributeModel.[${index}].atributeId`,
                                            parseInt(data.value)
                                        );
                                    } else {
                                        setFieldValue(`productAttributeModel.[${index}].atributeId`, "");
                                    }
                                }}

                                isDisabled={(readOnly || [0, 1].includes(index))}
                            />
                        </div>
                        {(SecondAttribute && SecondAttribute !== "") &&
                            <div className="option-title font-medium text-gray-800">
                                <div className="mb-1">Variant Name</div>
                                <Dropdown
                                    label={`Variant Name`}
                                    name={`productAttributeModel.[${index}].productType`}
                                    options={productTypeOptions}
                                    defaultValue={attribute.productType}
                                    className="focus:ring-neutral-300 focus:shadow-lg py-1 max-w-xs "
                                    onChange={(data) => {
                                        if (data) {
                                            setFieldValue(
                                                `productAttributeModel.[${index}].productType`,
                                                data.value
                                            )
                                        } else {
                                            setFieldValue(`productAttributeModel.[${index}].productType`, "");
                                        }
                                    }}
                                    isDisabled={readOnly}
                                />
                            </div>
                        }

                        <div className="swatch-option"></div>
                        <div className="my-2 control_type">
                            <div className="mb-4">
                                <Checkbox
                                    name={`productAttributeModel.[${index}].attributeFlag`}
                                    checked={attribute.attributeRequired}
                                    // defalutValue={attribute.attributeRequired}
                                    className={"table-item form-checkbox"}
                                    onChange={(e) => {
                                        setFieldValue(
                                            `productAttributeModel.[${index}].attributeFlag`,
                                            e.target.checked
                                        );
                                    }}
                                    disabled={readOnly}
                                />
                                Attribute Required
                            </div>
                        </div>
                        <div className="mt-4 font-medium text-gray-800">Attribute Options</div>
                        {
                            <>
                                <ul className="flex-wrap items-center whitespace-nowrap">
                                    <FieldArray
                                        name={`productAttributeModel.[${index}].productAttributeOptionsList`}
                                        render={(fieldArrayProps) => {
                                            const { form } = fieldArrayProps;


                                            return (
                                                <Fragment key={index}>
                                                    {form.values.productAttributeModel[index].productAttributeOptionsList &&
                                                        form.values.productAttributeModel[index].productAttributeOptionsList.map(
                                                            (value, i) => {
                                                                return (
                                                                    <div
                                                                        className="m-1.5 ml-0 flex items-center"
                                                                        key={i}
                                                                    >
                                                                        {ProductSizeOption && ProductSizeOption.length > 0 ?

                                                                            < SizeAttributeValues variation={value} attribute={attribute} fieldArrayProps={fieldArrayProps} i={i} index={index} setFieldValue={setFieldValue} readOnly={readOnly} ProductSizeOption={ProductSizeOption} />

                                                                            :
                                                                            <>
                                                                                <Input
                                                                                    type="text"
                                                                                    className={`focus:ring-neutral-300 focus:shadow-lg px-2 py-1 ml-1 w-48`}
                                                                                    name={`productAttributeModel.[${index}].productAttributeOptionsList.[${i}].value`}
                                                                                    placeholder="value"

                                                                                />


                                                                                <Input
                                                                                    type="text"
                                                                                    className={`focus:ring-neutral-300 focus:shadow-lg px-2 py-1 ml-1 w-28`}
                                                                                    name={`productAttributeModel.[${index}].productAttributeOptionsList.[${i}].suffix`}
                                                                                    placeholder="Suffix"

                                                                                />
                                                                                {value.readyForSync &&
                                                                                    <div className="add-new">
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => {
                                                                                                setStoreSync(value.readyForSync);
                                                                                                setSyncModalObject(
                                                                                                    {
                                                                                                        attributeId: attribute.id,
                                                                                                        attributeOptions: value.id,
                                                                                                        storeList: value.storeIdList
                                                                                                    }
                                                                                                );
                                                                                            }}
                                                                                            className="btn border-indigo-300 hover:border-indigo-400 text-indigo-500 ml-5">
                                                                                            Sync
                                                                                        </button>
                                                                                    </div>
                                                                                }
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={fieldArrayProps.remove.bind(
                                                                                        null,
                                                                                        i
                                                                                    )}
                                                                                >
                                                                                    <span className="delete material-icons-outlined text-rose-500 ml-1">
                                                                                        remove_circle
                                                                                    </span>
                                                                                </button>

                                                                            </>
                                                                        }
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                    {!readOnly &&
                                                        <div className="add-new">
                                                            <button
                                                                type="button"
                                                                className="btn border-indigo-300 hover:border-indigo-400 text-indigo-500"
                                                                onClick={() => {
                                                                    fieldArrayProps.push({
                                                                        id: 0,
                                                                        rowVersion: null,
                                                                        productAtributeId: 0,
                                                                        value: "",
                                                                        storeIdList: [],
                                                                        // suffix: "sting",
                                                                        productName: "",

                                                                    });
                                                                    setShowEditOrDone(true);
                                                                }}
                                                            >
                                                                Add New
                                                            </button>
                                                        </div>
                                                    }
                                                </Fragment>
                                            );
                                        }}
                                    />
                                </ul>
                            </>
                        }
                    </div>
                    {attribute.productAttributeOptionsList.length > 0 && showEditOrDone && (
                        <div className="my-2 ml-3">
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (Object.keys(errors?.productAttributeModel?.[index] ? errors.productAttributeModel[index] : []).length === 0) {
                                            Validate = attribute.productAttributeOptionsList.filter((value) => {
                                                return (value.value === "" || value.suffix === "")
                                            })
                                            if (Validate.length <= 0) {

                                                handleAttribute(
                                                    { ...attribute, atributeId: FirstAttribute ? parseInt(FirstAttribute.value) : SecondAttribute ? parseInt(SecondAttribute.value) : attribute.atributeId }, resetForm)
                                                setShowEditOrDone(false);
                                                setIsEditDisable(false)
                                            }
                                            else {
                                                validateForm().then(() =>
                                                    dispatch(
                                                        setAlertMessage({
                                                            type: "danger",
                                                            message: "Attribute name, option value and suffix must not be empty.",
                                                        })

                                                    ));
                                            }
                                        }
                                        else {
                                            validateForm().then(() =>
                                                dispatch(
                                                    setAlertMessage({
                                                        type: "danger",
                                                        message: "Attribute name, option value and suffix must not be empty.",
                                                    })

                                                ));
                                        }

                                    }}
                                    className={`btn border-indigo-300 hover:border-indigo-400 text-indigo-500`}
                                >
                                    Save
                                </button>
                            </>
                        </div>
                    )}
                    {attribute.productAttributeOptionsList.length > 0 && !showEditOrDone && (
                        <>
                            {saveLoading === index ?
                                <span className="spinner-border spinner-border-sm mr-2"></span> :
                                <div className="my-2 ml-3">
                                    <button
                                        type="button"
                                        className={`btn border-indigo-300 hover:border-indigo-400 text-indigo-500`}
                                        onClick={() => { setShowEditOrDone(true); setIsEditDisable(true) }}
                                        disabled={IsEditDisable}
                                    >
                                        {IsEditDisable &&
                                            <>
                                                <span data-tip data-for='edit-tip' className="material-icons-outlined mr-2  text-sm">info</span>
                                                <ReactTooltip id='edit-tip' type='dark' effect="solid">
                                                    <span>Save pending changes to add or edit other attribute.</span>
                                                </ReactTooltip>
                                            </>
                                        }
                                        Edit
                                    </button>
                                </div>
                            }
                        </>

                    )}
                </div>
            </li>
            {
                OptionConfirmationModal &&
                <OptionConfirmationModal
                    handleConfirmation={handleVariantOption}
                    setOpenModal={setOpenConfirmationModal}
                    openModal={OpenConfirmationModal}
                    message={ProductSizeOption.length > 0 ? ValidationMsgs.masterCatalog.attributes.attributeDetailsMsg : ValidationMsgs.masterCatalog.attributes.elseAttributeDetailMsg}
                    displayOkButton={ProductSizeOption.length > 0 ? true : false}
                    {...basicModalInfo}
                />
            }

        </>
    );
};

export default AttributeDetails;

const SizeAttributeValues = ({ attribute, fieldArrayProps, i, index, setFieldValue, readOnly, ProductSizeOption, variation }) => {
    const [selectedValues, setSelectedValues] = useState([]);
    const { values } = useFormikContext();
    useEffect(() => {
        let selectedAttributeValues = [];
        attribute?.productAttributeOptionsList?.map((option, index) => {
            if (option.value !== variation.value) {
                selectedAttributeValues = [...selectedAttributeValues, option.value];
            }
        });
        setSelectedValues(() => {
            return ProductSizeOption.filter((value, i) => {
                return !selectedAttributeValues.includes(value.value);
            })
        })
    }, [attribute?.productAttributeOptionsList])

    return (
        <div
            className="m-1.5 ml-0 flex items-center"
            key={i}
        >
            <Dropdown

                name={`productAttributeModel.[${index}].productAttributeOptionsList.[${i}].value`}
                options={selectedValues}
                defaultValue={attribute.productAttributeOptionsList[i].value}
                className="focus:ring-neutral-300 focus:shadow-lg py-1 max-w-xs w-full"
                onChange={(data) => {
                    if (data) {
                        setFieldValue(
                            `productAttributeModel.[${index}].productAttributeOptionsList.[${i}].value`,
                            data.value
                        );
                    } else {
                        setFieldValue(`productAttributeModel.[${index}].productAttributeOptionsList.[${i}].value`, "");
                    }
                }}
                isDisabled={readOnly}
            />


            <Input
                type="text"
                className={`focus:ring-neutral-300 focus:shadow-lg px-2 py-1 ml-1 w-28`}
                name={`productAttributeModel.[${index}].productAttributeOptionsList.[${i}].suffix`}
                placeholder="Suffix"
                disabled={readOnly}
            />
            {!readOnly &&
                <button
                    type="button"
                    onClick={fieldArrayProps.remove.bind(
                        null,
                        i
                    )}
                >
                    <span className="delete material-icons-outlined text-rose-500 ml-1">
                        remove_circle
                    </span>
                </button>
            }
        </div>
    )
}
