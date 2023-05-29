/*Component Name: ProductAttributeClone
Component Functional Details: User can create or update ProductAttributeClone master details from here.
Created By: Happy
Created Date: <Creation Date>
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React from 'react';
import { Form as FormikForm, Formik, useFormikContext } from "formik";
import Transition from 'utils/Transition';
import { useState } from 'react';
import * as Yup from "yup";
import { useCallback } from 'react';
import ProductService from 'services/admin/masterCatalog/masterCatalog/products/ProductService';
import { useEffect } from 'react';
import Checkbox from '../formComponent/Checkbox';
import { Fragment } from 'react';
import ProductCloneModal from './ProductCloneModal';
import { defaultImage, paginationDetails } from 'global/Enum';
import Image from '../formComponent/Image';
import CheckBox from '../table/CheckBox';
import ReactTable from '../table/ReactTableServerSide';
import Messages from "components/common/alerts/messages/Index";
import { useDispatch } from 'react-redux';
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";


const ProductAttributeClone = ({ openAttributeCloneModal, setOpenAttributeCloneModal, proId = [], getProductData }) => {
    const [Data, setData] = useState([]);
    const [FieldsData, setFieldsData] = useState([]);
    const [openCloneModal, setOpenCloneModal] = useState(false);
    const [initialValues, setInitialValues] = useState({});
    const dispatch = useDispatch();

    const getAllData = useCallback(() => {
        if (openAttributeCloneModal && proId && proId.length > 0) {
            dispatch(setAddLoading(true))

            ProductService.getAttributeList(proId).then((res) => {
                setData(res.data.data);
                let temp = [];
                res.data.data?.map((value) => {
                    temp = {
                        ...temp, [value.id]: {
                            attributeOptionId: 0,
                            attributeOptions: []
                        }
                    }
                })
                setInitialValues({ attributeList: temp });
                dispatch(setAddLoading(false))

            }).catch((err) => {
                dispatch(setAddLoading(false))

            });
        }
    }, [proId, openAttributeCloneModal])

    useEffect(() => {
        getAllData();
    }, [proId, openAttributeCloneModal]);

    const handleClone = (fields, { resetForm }) => {
        let attributeList = [];
        let attributeOptions = [];
        Object.keys(fields.attributeList).map((value, key) => {
            if (fields.attributeList[value].attributeOptions.length > 0) {

                attributeList = [
                    ...attributeList,
                    {
                        attributeOptionId: value,
                        attributeOptions: fields.attributeList[value].attributeOptions
                    }
                ]
                attributeOptions = [...attributeOptions, ...fields.attributeList[value].attributeOptions];
            }
        });
        if (attributeOptions.length > 0) {
            setFieldsData(attributeList);
            setOpenAttributeCloneModal(false);
            setOpenCloneModal(true);
            resetForm({});
        } else {
            dispatch(
                setAlertMessage({
                    type: "danger",
                    message: "Please select attribute to clone.",
                })
            );
        }
    }

    const [paginationData, setPaginationData] = useState({
        paginationDetails
    });

    const [sortingOptions, setSortingOptions] = useState([
        {
            field: "firstname",
            direction: 0,
            priority: 0,
        },
    ]);

    const [selectedRows, setSelectedRows] = useState([]);
    const [filteringOptions, setColumnFilteringOptions] = useState([]);
    const setSortingOptionHandler = (column, direction) => {
        setSortingOptions([
            {
                field: column,
                direction: direction,
                priority: 0,
            },
        ]);
    };
    const setPaginationDataFunc = (key, value) => {
        setPaginationData((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const handleSort = (sortValue) => { };

    const COLUMNS = [
        {
            id: "id",
            Header: ({ data, getToggleAllRowsSelectedProps }) => {
                return (
                    <div className="flex items-center relative">
                        <span className="inline-flex leading-none w-4 h-4">
                            <CheckAll getToggleAllRowsSelectedProps={getToggleAllRowsSelectedProps} data={data} selectedRows={selectedRows} />
                        </span>
                    </div>
                );
            },
            accessor: "id",
            column_name: "id",
            disableSortBy: true,
            Cell: ({ value, row }) => {
                return (
                    <VariantCheckbox value={value} row={row} />
                );
            }
        },
        {
            id: "variantImagePath",
            Header: "Color Image",
            accessor: "imagePath",
            Footer: "",
            Cell: ({ row, value }) => {
                return value && value !== "" ? (
                    <>
                    <div className="h-14 w-14 flex items-center justify-center overflow-hidden box-content border bg-white">
                        <Image className="max-h-full" containerheight={""} src={value} alt="" />
                    </div>
                    </>
                ) :
                    <>
                    <div className="h-14 w-14 flex items-center justify-center overflow-hidden  box-content border bg-white">
                        <Image src={defaultImage} className="max-h-full" />
                    </div>
                    </>
            },
            disableSortBy: true,
            disableShowHide: true,
        },
        {
            id: "colorName",
            Header: "Color Name",
            accessor: "colorName",
            Cell: ({ row, value }) => {
                return (
                    <>
                        <div className="font-semibold"> {value}</div>
                    </>
                );
            },
        },
        {
            id: "sku",
            Header: "SKU",
            accessor: "sku",
            Footer: "sku",
            Cell: ({ row, value }) => {
                return (
                    <>
                        <div className="font-semibold"> {value}</div>
                    </>
                )
            },
        },
        {
            id: "subRows",
            Header: "Select Option",
            accessor: "subRows",
            Cell: ({ row, value }) => {
                return (
                    <TR row={row} value={value} selectedRows={selectedRows} />
                )
            },
        },
    ]
    const statusChangedHandler = (data) => {
        // setOpenBasicModal(false);
    };

    if (initialValues && initialValues === null) {
        return ""
    }

    return (
        <>
            <Transition
                className="fixed inset-0 bg-slate-900 bg-opacity-95 z-40 transition-opacity"
                show={openAttributeCloneModal}
                tag="div"
                enter="transition ease-out duration-200 transform"
                enterStart="opacity-0 -translate-y-2"
                enterEnd="opacity-100 translate-y-0"
                leave="transition ease-out duration-200"
                leaveStart="opacity-100"
                leaveEnd="opacity-0"
                onClick={() => setOpenAttributeCloneModal(false)}
            ></Transition>
            <Transition
                className="fixed inset-0 z-40 overflow-hidden flex items-center my-4 justify-center transform px-4 sm:px-6"
                show={openAttributeCloneModal}
                tag="div"
                id="clone-modal"
                enter="transition ease-out duration-200 transform"
                enterStart="opacity-0 -translate-y-2"
                enterEnd="opacity-100 translate-y-0"
                leave="transition ease-out duration-200"
                leaveStart="opacity-100"
                leaveEnd="opacity-0"
            >
                <Formik
                    enableReinitialize={true}
                    initialValues={initialValues}
                    onSubmit={handleClone}
                >
                    {({ setFieldValue, resetForm, values }) => {
                        return (
                            <FormikForm>
                                <div className="relative px-4 w-screen max-w-6xl max-h-screen">
                                    <div className="relative bg-white rounded-md shadow overflow-auto max-w-6xl w-full max-h-screen">
                                        <div className="flex justify-between items-start p-5 rounded-t border-b sticky top-0 bg-white z-10">
                                            <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl"> Select Color  </h3>
                                            <button
                                                className="text-gray hover:text-gray-400"
                                                type="button"

                                                onClick={() => { resetForm(); setOpenAttributeCloneModal(false); }}
                                            >
                                                <div className="sr-only">Close</div>
                                                <svg className="w-4 h-4 fill-current">
                                                    <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z"></path>
                                                </svg>
                                            </button>
                                        </div>
                                        <Messages />
                                        <div className=" max-h-screen border-t border-neutral-200">

                                            <ReactTable
                                                COLUMNS={COLUMNS}
                                                DATA={Data}
                                                hasNextPage={paginationData.hasNextPage}
                                                hasPreviousPage={paginationData.hasPreviousPage}
                                                pageIndex={paginationData.pageIndex}
                                                setPageIndex={(value) =>
                                                    setPaginationDataFunc("pageIndex", value)
                                                }
                                                pageSize={25}
                                                setTablePageSize={(value) =>
                                                    setPaginationDataFunc("pageSize", value)
                                                }
                                                totalCount={paginationData.totalCount}
                                                fetchData={getAllData}
                                                sortingOptions={sortingOptions}
                                                setSortingOptions={setSortingOptionHandler}
                                                hiddenColumns={["rowSelection"]}
                                                handleSort={handleSort}
                                                filteringOptions={filteringOptions}
                                                setColumnFilteringOptions={setColumnFilteringOptions}
                                                selectedRows={selectedRows}
                                                setSelectedRows={setSelectedRows}
                                            />
                                        </div>
                                        <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200">
                                            <button data-modal-toggle="clone-modal" type="button" className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700" onClick={() => { setOpenAttributeCloneModal(false); resetForm() }}>Cancel</button>
                                            <button data-modal-toggle="clone-modal" type="submit" className="btn bg-indigo-500 hover:bg-indigo-600 text-white">Save</button>
                                        </div>
                                    </div>
                                </div>
                            </FormikForm>
                        );
                    }}
                </Formik>
            </Transition>
            {openCloneModal && <ProductCloneModal
                data={FieldsData}
                attributeClone={true}
                openCloneModal={openCloneModal}
                setOpenCloneModal={setOpenCloneModal}
                proId={proId}
                getProductData={getProductData}
            />}
        </>
    );
};

export default ProductAttributeClone;

const TR = ({ value, row, selectedRows }) => {
    const { values, setFieldValue } = useFormikContext();
    // useEffect(() => {
    //     let selectedRowsId = [];
    //     selectedRows.map((value) => {
    //         selectedRowsId = [...selectedRowsId, value.original.id];
    //         return "";
    //     });
    //     if (selectedRowsId.includes(row.original.id)) {
    //         let variantId = [];
    //         value.map((data) => {
    //             variantId = [...variantId, data.id];
    //         });
    //         // console.log(variantId, selectedRows, selectedRowsId);
    //         setFieldValue(`attributeList[${row.values.id}].attributeOptions`, variantId);
    //     } else {
    //         // console.log('else');
    //         setFieldValue(`attributeList[${row.values.id}].attributeOptions`, []);
    //     }
    // }, [selectedRows]);

    const onChangeHandler = (e) => {
        let optionsIds = values.attributeList[row.original.id].attributeOptions;
        if (e.target.checked) {
            return [...optionsIds, parseInt(e.target.value)];
        } else {
            var index = optionsIds.indexOf(parseInt(e.target.value));
            if (index > -1) {
                optionsIds.splice(index, 1); // 2nd parameter means remove one item only
            }
            return [...optionsIds];
        }
    }
    return (
        <div className="flex flex-wrap items-center max-w-xs">
            {value && value.map((option, index) => {
                return (
                    <Fragment key={index}>
                        <div className="relative mr-3">
                            <Checkbox
                                name={`attributeList[${row.values.id}].attributeOptions`}
                                onChange={(e) => {
                                    setFieldValue(
                                        `attributeList[${row.values.id}].attributeOptions`, onChangeHandler(e)
                                        // setOptionsValue(values?.attributeList[row.values.id].attributeOptions, e)
                                    );
                                    // console.log(values?.attributeList[row.values.id]?.attributeOptions, values?.attributeList[row.values.id]?.attributeOptions.length, value.length);
                                    let selecteAttributeLength = e.target.checked ? values?.attributeList[row.values.id]?.attributeOptions.length + 1 : values?.attributeList[row.values.id]?.attributeOptions.length - 1;
                                    if (values?.attributeList && selecteAttributeLength === value.length) {
                                        setFieldValue(`attributeList[${row.values.id}].attributeOptionId`, row.values.id);
                                    } else {
                                        setFieldValue(`attributeList[${row.values.id}].attributeOptionId`, 0);
                                    }
                                }}
                                value={option.id}
                                type={"checkbox"}
                                className={"form-checkbox"}
                                checked={values?.attributeList ? values?.attributeList[row.values.id]?.attributeOptions.includes(option.id) : false}
                            // disabled={values?.attributeList[row.values.id].attributeOptionId > 0 ? false : true}
                            />
                            <span key={index}>
                                {option.name}
                            </span>
                        </div>
                    </Fragment>
                );
            })}
        </div>
    );
}

const CheckAll = ({ data, selectedRows, getToggleAllRowsSelectedProps }) => {
    const { values, setFieldValue } = useFormikContext();
    const [indeterminate, setIndeterminate] = useState(false);
    const [checked, setChecked] = useState(false);
    useEffect(() => {
        if (values?.attributeList) {
            let selectedAllAttributes = [];
            Object.keys(values?.attributeList).map((value) => {
                if (values?.attributeList[value].attributeOptionId !== 0) {
                    selectedAllAttributes = [...selectedAllAttributes, values?.attributeList[value].attributeOptionId]
                }
            });
            if (selectedAllAttributes.length > 0 && selectedAllAttributes.length !== data.length) {
                setIndeterminate(true);
            } else {
                setIndeterminate(false);
            }
            if (selectedAllAttributes.length === data.length) {
                setChecked(true);
            } else {
                setChecked(false);
            }
        }
    }, [values.attributeList]);
    const checkboxHandler = useCallback((e) => {
        data.map((value) => {
            if (e.target.checked) {
                let variantId = [];
                value.subRows.map((data) => {
                    variantId = [...variantId, data.id];
                });
                setFieldValue(`attributeList[${value.id}].attributeOptions`, variantId);
                setFieldValue(`attributeList[${value.id}].attributeOptionId`, value.id);
            } else {
                setFieldValue(`attributeList[${value.id}].attributeOptions`, []);
                setFieldValue(`attributeList[${value.id}].attributeOptionId`, 0);
            }
        })

    }, [selectedRows])
    return (
        <CheckBox {...getToggleAllRowsSelectedProps()} onClick={checkboxHandler} indeterminate={indeterminate} checked={checked} />
    )
}

const VariantCheckbox = ({ value, row }) => {
    const { values, setFieldValue } = useFormikContext();
    const [indeterminate, setIndeterminate] = useState(false);
    const [checked, setChecked] = useState(false);
    useEffect(() => {
        if (values?.attributeList && values?.attributeList[value]?.attributeOptions.length > 0 && values?.attributeList[value]?.attributeOptions.length !== row.subRows.length) {
            setIndeterminate(true);
        } else {
            setIndeterminate(false);
        }
        if (values?.attributeList && values?.attributeList[value]?.attributeOptions.length === row.subRows.length) {
            setChecked(true);
        } else {
            setChecked(false);
        }
    }, [values.attributeList]);
    return (
        <CheckBox {...row.getToggleRowSelectedProps()} onClick={(e) => {
            if (e.target.checked) {
                let variantId = [];
                row.original.subRows.map((data) => {
                    variantId = [...variantId, data.id];
                });
                setFieldValue(`attributeList[${value}].attributeOptions`, variantId);
                setFieldValue(`attributeList[${value}].attributeOptionId`, value);

            } else {
                setFieldValue(`attributeList[${value}].attributeOptionId`, 0);
                setFieldValue(`attributeList[${value}].attributeOptions`, []);
            }

        }} checked={checked} indeterminate={indeterminate} />
    );
}
