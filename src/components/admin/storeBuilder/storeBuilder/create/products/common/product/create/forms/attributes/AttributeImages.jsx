/*Component Name: AttributeImages
Component Functional Details: User can create or update AttributeImages master details from here.
Created By: Ankit Sharma
Created Date: 11/16/2022
Modified By: Ankit Sharma
Modified Date: 11/16/2022 */

import Input from "components/common/formComponent/Input";
import React, { useState, useEffect } from "react";
import { Formik, Form as FormikForm, useFormikContext } from "formik";
import ImageFile from "components/common/formComponent/ImageFile";
import ColorService from "services/admin/color/ColorService";
import * as Yup from "yup";
import axios from "axios";
import Checkbox from "components/common/formComponent/Checkbox";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { useDispatch, useSelector } from "react-redux";
import { serverError } from "services/common/helper/Helper"
import { Fragment } from "react";
import { blobFolder, RecStatusValuebyName, ProductStatusValuebyName } from "global/Enum";
import { productType } from "dummy/Dummy";
import { ValidationMsgs } from "global/ValidationMessages";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const AttributeImages = ({ CombinationData, getCombinationData, valueByID, readOnly, ImageAPI, type, productId, moduleName }) => {
    const [ImageData, setImageData] = useState(CombinationData);
    const [initialValues, setInitialValues] = useState(null);
    const dispatch = useDispatch();
    const location = useSelector((store) => store?.location);
    const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);
    readOnly = (type === productType.EcommerceStore) ? true : false;

    useEffect(() => {
        setImageData(CombinationData);
    }, [CombinationData]);


    useEffect(() => {
        let productAttributeImageModel = {}
        if (CombinationData?.length > 0) {
            CombinationData?.map((Combination, index) => {
                let subRows = []
                if (Combination.subRows && Combination?.subRows.length > 0) {
                    {
                        Combination?.subRows?.map((item, i) => {
                            subRows = [
                                ...subRows,
                                {
                                    id: item.id || 0,
                                    imagePath: item.imagePath || "",
                                    altTag: item.altTag || `${valueByID.name} ${Combination.colorName}`,
                                    rowVersion: (type == productType.Bundle ? "" : type !== productType.Bundle ? item.rowVersion : null),
                                    displayOrder: 0,
                                    recStatus: item.recStatus || RecStatusValuebyName.Active
                                }
                            ]
                        })
                    }
                }
                productAttributeImageModel = {
                    ...productAttributeImageModel, [Combination.attributeOptionId]: {
                        // id: Combination.id || 0,
                        attributeOptionId: Combination.attributeOptionId || 0,
                        swatch: Combination.swatch || "",
                        facetColorId: Combination.facetColorId || [],
                        rowVersion: (type == productType.Bundle ? "" : type !== productType.Bundle ? Combination.rowVersion : null),
                        subRows: subRows
                    }
                }
            })
            setInitialValues({ productAttributeImageModel: productAttributeImageModel });
        }
    }, [CombinationData])

    const schema = Yup.object().shape({
        productAttributeImageModel: Yup.object().shape({
            ...(() => {
                var validations = {};
                var validationData = initialValues?.productAttributeImageModel
                    ? Object.keys(initialValues?.productAttributeImageModel)
                    : [];
                validationData.map((v, i) => {
                    validations = {
                        ...validations,
                        [v]: Yup.object().shape({
                            subRows: Yup.array().of(
                                Yup.object().shape({
                                    'altTag': Yup.string().when('recStatus', {
                                        is: (recStatus) => recStatus === ProductStatusValuebyName.Active,
                                        then: Yup.string().required(ValidationMsgs.masterCatalog.attributes.altTagRequired),
                                        otherwise: Yup.string(),
                                    }),
                                })
                            ),
                        }),
                    };
                });
                return validations;
            })(),
        }),
    });

    const handleImageData = (fields) => {
        let Obj = []
        Object.keys(fields.productAttributeImageModel).map((value, key) => {
            if (fields.productAttributeImageModel[value]?.subRows && fields.productAttributeImageModel[value]?.subRows?.length > 0) {
                let subRows = [];
                let ActiveRow = [];
                let ArchivedRow = [];
                ActiveRow = fields.productAttributeImageModel[value]?.subRows.filter((A, index) => {
                    return A.recStatus === RecStatusValuebyName.Active
                })
                ArchivedRow = fields.productAttributeImageModel[value]?.subRows.filter((AR, index) => {
                    return AR.recStatus === RecStatusValuebyName.Archived
                })

                if (ActiveRow.length > 0) {
                    ActiveRow.map((row, index) => {
                        if (typeof row.id === 'string') {
                            if (row.id.includes("_new")) {
                                subRows = [...subRows, { ...row, id: 0, displayOrder: index + 1 }];
                            }
                        }
                        else {
                            subRows = [...subRows, { ...row, displayOrder: index + 1 }]
                        }
                    })
                }
                if (ArchivedRow.length > 0) {
                    ArchivedRow.map((Archrow, index) => {
                        if (typeof Archrow.id === 'string') {
                            if (Archrow.id.includes("_new")) {
                                subRows = [...subRows, { ...Archrow, id: 0 }];
                            }
                        }
                        else {

                            subRows = [...subRows, { ...Archrow }]
                        }
                    })
                }
                Obj = [...Obj, { ...fields.productAttributeImageModel[value], subRows: subRows }];
            }
            else {
                Obj = [...Obj, { ...fields.productAttributeImageModel[value] }];
            }
        })
        dispatch(setAddLoading(true))
        ImageAPI.createAttributeImages({ productAttributeImageModel: Obj, productId: productId, ...location, recStatus: RecStatusValuebyName.Active, }).then((response) => {
            if (response.data.success) {
                dispatch(
                    setAlertMessage({
                        type: "success",
                        message: ValidationMsgs.masterCatalog.attributes.imageUpdated,
                    })
                );
                getCombinationData()
            } else {
                dispatch(setAlertMessage({ type: "danger", message: serverError(response) }));
            }
            dispatch(setAddLoading(false))
        })
            .catch((errors) => {
                dispatch(
                    setAlertMessage({
                        type: "danger",
                        message: ValidationMsgs.masterCatalog.attributes.imageUpdated,
                    })
                );
                dispatch(setAddLoading(false))
                getCombinationData()
            });
    };

    if (initialValues === null) {
        return "";
    }
    return (
        <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={handleImageData}
        >
            {({ setFieldValue, errors, values }) => {
                return (
                    <FormikForm>
                        <>
                            <title>Attributes</title>
                            <div className="mt-10 border-t-2 border-neutral-200">
                                <div className="w-full p-6 pb-0 flex flex-wrap items-center justify-between mb-2">
                                    <div className="block uppercase tracking-wide text-gray-500 text-lg font-bold">
                                        Attribute Images
                                    </div>
                                    {type !== productType.EcommerceStore &&
                                        <>
                                            {GlobalLoading ?
                                                <span className="spinner-border spinner-border-sm mr-2"></span> :
                                                <button type="submit" className={`btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white`}>
                                                    Save
                                                </button>
                                            }
                                        </>
                                    }

                                </div>
                            </div>
                            <div className="overflow-x-auto max-h-screen border-t border-neutral-200">
                                <table className="table-auto w-full text-sm text-[#191919] font-semibold overflow-scroll">
                                    <thead className="text-sm font-bold uppercase text-[#b3b3b3] border-b border-neutral-200">
                                        <tr>
                                            <th className="h-full">
                                                <div className="flex items-center h-full px-2 py-3 border-neutral-200">
                                                    {" "}
                                                </div>
                                            </th>
                                            {type !== productType.Bundle &&
                                                <th className="px-2 first:pl-5 py-4">
                                                    <div className="font-semibold text-left flex w-48 items-center h-full px-2 py-3 border-neutral-200">
                                                        <span>Color</span>
                                                    </div>
                                                </th>
                                            }
                                            <th className="px-2 first:pl-5 py-4">
                                                <div className="font-semibold text-left w-40 max-w-sm flex items-center">
                                                    <span>Media</span>
                                                </div>
                                            </th>
                                            {type !== productType.Bundle &&
                                                <th className="px-2 first:pl-5 py-4">
                                                    <div className="font-semibold text-left flex w-40 items-center h-full px-2 py-3 border-neutral-200"> <span>Swatch</span>
                                                    </div>
                                                </th>
                                            }
                                            <th className="px-2 first:pl-5 py-4">
                                                <div className="font-semibold text-left flex w-40 max-w-xs px-2 py-3 items-center border-neutral-200">
                                                    <span>Facet Color</span>
                                                </div>
                                            </th>
                                            <th className="px-2 first:pl-5 py-4">
                                                <div className="font-semibold text-left flex w-40 max-w-xs px-2 py-3 items-center border-neutral-200">
                                                    <span>SKU</span>
                                                </div>
                                            </th>

                                        </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-slate-200">

                                        {ImageData.map((imageData, index) => {
                                            return (
                                                <TR
                                                    imageData={imageData}
                                                    values={values}
                                                    valueByID={valueByID}
                                                    index={index}
                                                    key={index}
                                                    type={type}
                                                    readOnly={readOnly}
                                                    productId={productId}
                                                    moduleName={moduleName}
                                                />
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    </FormikForm>
                );
            }}
        </Formik>
    );
};

export default AttributeImages;

const TR = ({
    imageData,
    valueByID,
    readOnly,
    index,
    productId,
    moduleName,
    type
}) => {
    const CompanyId = useSelector((store) => store?.CompanyConfiguration.id)
    const FolderPath = `/${blobFolder.temp}/${CompanyId}/${blobFolder[moduleName]}${!productId ? "/0" : `/${productId}`}/${blobFolder.attribute}`


    const [showChild, setShowChild] = useState(false);
    const { values, setFieldValue } = useFormikContext();
    const [colors, setColors] = useState([]);
    const [MultiImages, setMultiImages] = useState([]);
    const [MediaImages, setMediaImages] = useState({});
    let unmounted = false;
    let source = axios.CancelToken.source();
    useEffect(() => {
        let temp = []
        ColorService.getColors({
            args: {
                pageIndex: 0,
                pageSize: 0,
                pagingStrategy: 0,
                sortingOptions: [
                    {
                        field: "string",
                        direction: 0,
                        priority: 0,
                    },
                ],
                filteringOptions: [
                    {
                        field: "string",
                        operator: 0,
                        value: "string",
                    },
                ],
            },
        }).then((color) => {
            temp = color.data.data.items.filter((A, index) => {
                return A.recStatus === RecStatusValuebyName.Active
            })
            setColors(temp)
        }).catch((error) => { });
        return () => {
            unmounted = true;
            source.cancel("Cancelling in cleanup");
        };
    }, []);

    const setColorChange = (colors, e) => {
        if (e.target.checked) {
            return [...colors, parseInt(e.target.value)];
        } else {
            var index = colors.indexOf(parseInt(e.target.value));
            if (index > -1) {
                colors.splice(index, 1); // 2nd parameter means remove one item only
            }
            return colors;
        }
    }

    useEffect(() => {
        if (values?.productAttributeImageModel[imageData.attributeOptionId].subRows) {
            setMultiImages(values?.productAttributeImageModel[imageData.attributeOptionId].subRows);
        } else {
            setMultiImages([]);
        }
        setMediaImages(values?.productAttributeImageModel[imageData.attributeOptionId].subRows.filter(row => row.recStatus !== RecStatusValuebyName.Archived));
    }, [values])

    const setMultiImagesArray = (value, e) => {
        if (e === "") {
            return MultiImages.map((x) => {
                if (x.id === value.id) {
                    return { ...x, displayOrder: 0, recStatus: RecStatusValuebyName.Archived }
                } else
                    return x;
            })
        } else {
            return MultiImages;
        }
    }

    return (
        <Fragment key={index}>
            <tr role={`row`}>
                <td className="px-2 first:pl-5 py-3 w-px relative">
                    <div className="">
                        <div
                            className="leading-none w-6 h-6 cursor-pointer transition-all variant-arrow"
                            onClick={() => {
                                setShowChild((prev) => !prev);
                            }}
                        >
                            <span className="material-icons-outlined select-none">
                                {showChild ? "remove" : "add"}
                            </span>
                        </div>
                    </div>
                </td>
                {type !== productType.Bundle &&
                    <td className="px-2 first:pl-5 py-3 w-px relative">
                        <div className="">
                            {imageData.colorName}
                        </div>
                    </td>
                }
                <td className="px-2 first:pl-5 py-3 w-px relative">
                    <div className="">
                        {
                            MediaImages !== undefined && MediaImages[0] !== undefined ? (

                                <div className="flex -space-x-9 items-center relative">
                                    <img
                                        className="w-20 h-20 rounded-full box-content"
                                        src={`${process.env.REACT_APP_API_BLOB}${MediaImages[0].imagePath}`}
                                        alt={MediaImages[0].altTag}
                                    />
                                    {MediaImages.length - 1 > 0 && (
                                        <span className="w-14 h-14 rounded-full box-content bg-neutral-200 inline-flex items-center justify-center">
                                            +{MediaImages.length - 1}
                                        </span>
                                    )}
                                </div>
                            ) : (
                                ""
                            )
                        }
                    </div>
                </td>
                {type !== productType.Bundle &&
                    <td className="px-2 first:pl-5 py-3 w-px relative">
                        <>
                            <ImageFile
                                id={`productAttributeImageModel.${imageData.attributeOptionId}.swatch`}
                                type={`file`}
                                folderpath={`${FolderPath}`}
                                className="sr-only"
                                divClass={
                                    "w-full flex flex-wrap items-center h-16 bg-center bg-no-repeat bg-contain"
                                }
                                uprdivclass={`w-52`}
                                buttonName="Add"
                                name={`productAttributeImageModel.${imageData.attributeOptionId}.swatch`}
                                onChange={(value) =>
                                    setFieldValue(`productAttributeImageModel.${imageData.attributeOptionId}.swatch`, value)
                                }
                                url={
                                    values.productAttributeImageModel[imageData.attributeOptionId] !== undefined
                                        ? values.productAttributeImageModel[imageData.attributeOptionId].swatch
                                        : ""
                                }
                                disabled={readOnly}
                            />
                        </>
                    </td>}
                <td className="px-2 first:pl-5 py-3 w-px relative">
                    <div className="flex flex-wrap items-center max-w-xs">
                        {colors.map((color, index) => {
                            return (
                                <>
                                    <div className="relative" key={index}>
                                        <Checkbox
                                            id={`tell[${color.id}].${imageData.attributeOptionId}.facetColorId`}
                                            key={index}
                                            name={`productAttributeImageModel.${imageData.attributeOptionId}.facetColorId`}
                                            className={
                                                "form-checkbox inline-flex items-center justify-center mr-2 mb-2 rounded-full border-click w-6 h-6 border-2"
                                            }
                                            style={{
                                                backgroundColor: color.hexCode,
                                                borderColor: color.borderColor,
                                            }}
                                            value={color.id}
                                            defaultChecked={values.productAttributeImageModel[imageData.attributeOptionId].facetColorId.includes(color.id)}
                                            onChange={(e) => {
                                                setFieldValue(
                                                    `productAttributeImageModel.${imageData.attributeOptionId}.facetColorId`,
                                                    setColorChange(values.productAttributeImageModel[imageData.attributeOptionId].facetColorId, e)
                                                );

                                            }}
                                            type="checkbox"
                                            disabled={readOnly}
                                        />

                                        <label className="absolute inset-0 h-6 w-6" htmlFor={`tell[${color.id}].${imageData.attributeOptionId}.facetColorId`}>
                                            <svg className={`h-6 w-6 ${values.productAttributeImageModel[imageData.attributeOptionId].facetColorId.includes(
                                                color.id) ? "" : "hidden"}`} viewBox="0 0 16 16" fill={color.textColor} xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z"></path>
                                            </svg>
                                        </label>
                                    </div>
                                </>
                            );
                        })}
                    </div>
                </td>
                <td className="px-2 first:pl-5 py-3 w-px relative">
                    <div className=""></div>
                </td>
            </tr>
            {showChild && (
                <>
                    <tr role="row">
                        <td colSpan={6}>
                            <div className="w-full py-2 px-4">
                                <div className="grid grid-cols-12 gap-3">
                                    {MultiImages.map(
                                        (value, i) => (
                                            value.recStatus !== RecStatusValuebyName.Archived && <div className="col-span-full lg:col-span-2 relative " key={value.id}>
                                                <ImageFile
                                                    id={`productAttributeImageModel.${imageData.attributeOptionId}.subRows[${value.id}].imagePath`}
                                                    type={`file`}
                                                    folderpath={`${FolderPath}`}
                                                    className="sr-only"
                                                    divClass={"w-full flex flex-wrap items-center h-52 bg-center bg-no-repeat bg-contain relative"}
                                                    onChange={(e) => {
                                                        setFieldValue(
                                                            `productAttributeImageModel.${imageData.attributeOptionId}.subRows`, setMultiImagesArray(/* values.productAttributeImageModel[imageData.attributeOptionId].subRows,  */value, e)
                                                        )
                                                    }}
                                                    buttonName="Add"
                                                    name={`productAttributeImageModel.${imageData.attributeOptionId}.subRows[${value.id}].imagePath`}
                                                    url={value.imagePath}
                                                    disabled={type === productType.EcommerceStore ? readOnly : ""}
                                                />

                                                <div className="mt-1">
                                                    <Input
                                                        className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md"
                                                        name={`productAttributeImageModel.${imageData.attributeOptionId}.subRows[${i}].altTag`}
                                                        placeholder="Alt Tag"
                                                        disabled={type === productType.EcommerceStore ? readOnly : ""}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    )}
                                    {!readOnly &&
                                        <div className="col-span-full lg:col-span-2 ">
                                            <ImageFile
                                                id={`multiImage${imageData.attributeOptionId}`}
                                                type={`file`}
                                                folderpath={`${FolderPath}`}
                                                className="sr-only"
                                                divClass={
                                                    "w-auto flex flex-wrap items-center h-52 bg-center bg-no-repeat bg-contain"
                                                }
                                                buttonName="Add"
                                                name={`multiImage${imageData.attributeOptionId}`}
                                                onChange={(value) => {
                                                    setFieldValue(`productAttributeImageModel.${imageData.attributeOptionId}.subRows`, [
                                                        ...MultiImages,
                                                        { id: MultiImages.length + '_new', imagePath: value, altTag: `${valueByID.name} ${imageData.colorName}`, rowVersion: null, recStatus: RecStatusValuebyName.Active },
                                                    ]);
                                                }}
                                                url={values.multiImage}
                                            />

                                            <div className="mt-1">
                                                <Input
                                                    className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md"
                                                    name={`productAttributeImageModel.${imageData.attributeOptionId}.subRows.altTag`}
                                                    placeholder="Alt Tag"
                                                />
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </td>
                    </tr>
                </>
            )

            }
        </Fragment>
    );
};
