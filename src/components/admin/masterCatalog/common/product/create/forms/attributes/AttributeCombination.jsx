/*Component Name: AttributeCombination
Component Functional Details: User can create or update AttributeCombination master details from here.
Created By: Happy
Created Date: <Creation Date>
Modified By: chandan
Modified Date: <Modified Date> */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Input from 'components/common/formComponent/Input';
import { Formik, Form as FormikForm, useFormikContext } from "formik";
import ReactTable from "components/common/table/ReactTableServerSide";
import BasicModal from "components/common/modals/Basic";
import { defaultImage, paginationDetails, RecStatusValuebyName } from "global/Enum";
import Actions from 'components/common/others/admin/Action';
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { useDispatch, useSelector } from "react-redux";
import { serverError } from "services/common/helper/Helper"
import Image from 'components/common/formComponent/Image';
import { ValidationMsgs } from "global/ValidationMessages";
import InputNumber from 'components/common/formComponent/InputNumber';
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import UnsavedFormHandler from "../UnsavedFormHandler";
import ErrorHandler from "../ErrorHandler";

const AttributeCombination = ({ CombinationData, type, getCombinationData, setIsError, readOnly, CombinationAPI, productId, getProductReadinessData, checkProductStatus,
    setWishedToChangeTab, setsaveUnSavedFields, clearCacheForBrandCategory }) => {

    const permission = useSelector(store => store.permission);
    const [initialValues, setInitialValues] = useState({});
    const [combinationId, setCombinationId] = useState("");
    const [placeholderText, setPlaceholderText] = useState('');
    const dispatch = useDispatch();
    const location = useSelector((store) => store?.location);
    const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);


    useEffect(() => {
        let temp = {}
        let subRows = {}
        if (CombinationData && CombinationData.length > 0) {
            CombinationData?.map((Combination, index) => {
                temp = { ...temp, [Combination.varientId]: { ...Combination, id: Combination.id || 0, price: Combination.price || 0, minQuantity: Combination.minQuantity || 0, multipleQuantity: Combination.multipleQuantity || 0 } }
                if (Object.keys(temp).length > 0 && Combination.subRows) {
                    {
                        Object.keys(Combination?.subRows)?.map((item, i) => {
                            subRows = { ...subRows, [Combination.subRows[item].varientId]: Combination.subRows[item] }
                        })
                    }
                }
            })
            if (Object.keys(subRows).length > 0) {
                setInitialValues({ productAttributeCombinationModel: { ...temp, ...subRows } });
            }
            else {
                setInitialValues({ productAttributeCombinationModel: { ...temp } });
            }
        }

    }, [CombinationData])
    const [ModelInfo, setModalInfo] = useState({});
    const [openBasicModal, setOpenBasicModal] = useState(false);

    const COLUMNS = useMemo(
        () => [
            {
                id: "varientImagePath",
                Header: "",
                accessor: "varientImagePath",
                disableSortBy: true,
                Cell: ({ row, value }) => {
                    return value && value !== "" ? (
                        <>
                            <div className="h-14 w-14 flex items-center justify-center overflow-hidden  box-content border bg-white">
                                <Image src={value} containerheight={""} className="max-h-full" />
                            </div>
                        </>
                    ) :
                        <>
                            <div className="h-14 w-14 flex items-center justify-center overflow-hidden  box-content border bg-white">
                                <Image src={defaultImage} className={"max-h-full"} />
                            </div>
                        </>
                },
                disableSortBy: true,
                disableShowHide: true,
                expanded: true
            },
            {
                id: "name",
                Header: "Variant",
                accessor: "varientName",
                disableSortBy: true,
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
                Header: "sku",
                accessor: "sku",
                disableSortBy: true,
                Cell: ({ row, value }) => {
                    return (
                        <>
                            <div className="font-semibold"> {value}</div>
                        </>
                    )
                },
            },
            {
                id: "price",
                Header: "Additional price",
                accessor: "price",
                disableSortBy: true,
                Cell: ({ row, value }) => {
                    return row.original.subRows !== undefined ? (
                        ""
                    ) : (
                        readOnly ?
                            <div className="font-semibold"> {value}</div>
                            :
                            <Price value={value} row={row} />
                    );
                },
            },
            {
                id: "min Quantity",
                Header: "min quantity",
                accessor: "minQuantity",
                disableSortBy: true,
                Cell: ({ value, row }) => {
                    return row.original.subRows === undefined ? (
                        ""
                    ) : (
                        readOnly ?
                            <div className="font-semibold"> {value}</div>
                            :
                            <MinQuantity value={value} row={row} />
                    );
                },

            },
            {
                id: "multiple Quantity",
                Header: "multiple quantity",
                accessor: "multipleQuantity",
                disableSortBy: true,
                Cell: ({ value, row }) => {
                    return row.original.subRows === undefined ? (
                        ""
                    ) : (
                        readOnly ?
                            <div className="font-semibold"> {value}</div>
                            :
                            <MultipleQuantity value={value} row={row} />
                    );
                },
            },
            {
                id: "upC_GTIN",
                Header: "UPC/GTIN",
                accessor: "upC_GTIN",
                disableSortBy: true,
                Cell: ({ row, value }) => {
                    return row.original.subRows !== undefined ? (
                        ""
                    ) : (
                        readOnly ?
                            <div className="font-semibold"> {value}</div>
                            :
                            <Input name={`productAttributeCombinationModel.${row.original.varientId}.upC_GTIN`} maxLength={14} className={`w-24`} />
                    );
                },
            },

            {
                id: "action",
                Header: "",
                accessor: "id",
                Cell: ({ value, row }) => {
                    return (
                        readOnly ?
                            ""
                            :
                            <Actions
                                id={value}
                                row={row}
                                moduleName="Combination"
                                setCombinationId={setCombinationId}
                                setModalInfo={setModalInfo}
                                setOpenBasicModal={setOpenBasicModal}
                                hideAction={["delete"]}
                            />
                    );
                },
                disableSortBy: true,
                disableShowHide: true,
            },
        ],
        []
    );

    const [paginationData, setPaginationData] = useState({
        paginationDetails,
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

    const handleAttributeCombination = (fields, resetForm) => {
        let rowObj = []
        let Obj = []
        Object.keys(fields.productAttributeCombinationModel).map((value, key) => {
            if (fields.productAttributeCombinationModel[value]?.subRows) {
                rowObj = delete (fields.productAttributeCombinationModel[value].subRows)
            }
            Obj = (
                fields.productAttributeCombinationModel[value].id === 0 ?
                    [
                        ...Obj,
                        {
                            ...fields.productAttributeCombinationModel[value],
                            id: (fields.productAttributeCombinationModel[value]?.id || 0),
                            price: (fields.productAttributeCombinationModel[value]?.price || 0),
                            minQuantity: (fields.productAttributeCombinationModel[value]?.minQuantity || 0),
                            multipleQuantity: (fields.productAttributeCombinationModel[value]?.multipleQuantity || 0),
                            varientId: (fields.productAttributeCombinationModel[value]?.varientId ? fields.productAttributeCombinationModel[value]?.varientId?.split(',') : []),
                            recStatus: RecStatusValuebyName.Active,
                            ...location
                        }
                    ] :
                    [
                        ...Obj,
                        {
                            ...fields.productAttributeCombinationModel[value],
                            id: (fields.productAttributeCombinationModel[value]?.id || 0),
                            price: (fields.productAttributeCombinationModel[value]?.price || 0),
                            minQuantity: (fields.productAttributeCombinationModel[value]?.minQuantity || 0),
                            multipleQuantity: (fields.productAttributeCombinationModel[value]?.multipleQuantity || 0),
                            varientId: (fields.productAttributeCombinationModel[value]?.varientId ? fields.productAttributeCombinationModel[value]?.varientId?.split(',') : []),
                            ...location
                        }]
            );
        });
        dispatch(setAddLoading(true));
        CombinationAPI.createAttributeCombination({ productAttributeCombinationModel: Obj }).then((response) => {
            if (response.data.success) {
                dispatch(
                    setAlertMessage({
                        type: "success",
                        message: ValidationMsgs.masterCatalog.attributes.combinationCreated,
                    })
                );
                getProductReadinessData();
                clearCacheForBrandCategory();
            } else {
                dispatch(setAlertMessage({ type: "danger", message: serverError(response) }));
                dispatch(setAddLoading(false))
            }
            getCombinationData();
        })
            .catch((errors) => {
                dispatch(
                    setAlertMessage({
                        type: "danger",
                        message: ValidationMsgs.masterCatalog.attributes.combinationNotCreated,
                    })
                );
                dispatch(setAddLoading(false))
                getCombinationData();
            });
    }

    const handleSort = (sortValue) => { };

    const statusChangedHandler = (data) => {
        setOpenBasicModal(true);

        const object = {
            id: data.id,
            status: data.changeStatus,
            rowVersion: data.rowVersion,
        };
        CombinationAPI.updateAttributeCombinationStatus({
            args: {
                ...object,
                ...location,
            },
        })
            .then((response) => {
                if (response.data.success) {
                    dispatch(
                        setAlertMessage({
                            view: true,
                            type: "success",
                            message: ValidationMsgs.masterCatalog.attributes.combinationStatusUpdated,
                        })
                    );
                    getCombinationData();
                    setOpenBasicModal(false);
                } else {
                    dispatch(
                        setAlertMessage({
                            view: true,
                            type: "danger",
                            message: serverError(response),
                        })
                    );
                    setOpenBasicModal(false);
                }
            })
            .catch((errors) => {
                dispatch(
                    setAlertMessage({
                        view: true,
                        type: "danger",
                        message: ValidationMsgs.masterCatalog.attributes.combinationStatusNotUpdated,
                    })
                );
                setOpenBasicModal(false);
            });
    };

    useEffect(() => {
        setWishedToChangeTab(false)
    }, []);
    const expandedRows = useMemo(() => true, []);
    if (initialValues === undefined) {
        return "";
    }
    return (
        <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={handleAttributeCombination}
        >
            {({ setFieldValue, errors, values }) => {
                return (
                    <FormikForm>
                        <UnsavedFormHandler values={values} setsaveUnSavedFields={setsaveUnSavedFields} InitialData={initialValues} />

                        <>
                            <title>Attributes</title>
                            <div className="mt-10 border-t-2 border-neutral-200">
                                <div className="w-full p-6 pb-0 flex flex-wrap items-center justify-between mb-2">
                                    <div className="block uppercase tracking-wide text-gray-500 text-lg font-bold">
                                        Attribute Combination
                                    </div>
                                    {/*  {![productType.EcommerceStore, productType.CorporateStore].includes(type) && <button type="submit" className={`btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white`}>
                                        Save
                                    </button>} */}
                                    {(permission?.isEdit || permission?.isDelete) && !readOnly && CombinationData.length > 0 &&
                                        <>
                                            {GlobalLoading ?
                                                <span className="spinner-border spinner-border-sm mr-2"></span> :
                                                <button
                                                    disabled={GlobalLoading}
                                                    type="submit" className={`btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white`}>
                                                    Save
                                                </button>
                                            }
                                        </>
                                    }

                                </div>
                            </div>
                            <div className=" w-full ">
                                <div className="overflow-x-auto border-t border-neutral-200 pb-20">
                                    <ReactTable
                                        COLUMNS={COLUMNS}
                                        DATA={CombinationData}
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
                                        fetchData={getCombinationData}
                                        sortingOptions={sortingOptions}
                                        setSortingOptions={setSortingOptionHandler}
                                        hiddenColumns={["rowSelection"]}
                                        handleSort={handleSort}
                                        filteringOptions={filteringOptions}
                                        setColumnFilteringOptions={setColumnFilteringOptions}
                                        selectedRows={selectedRows}
                                        setSelectedRows={setSelectedRows}
                                        expandedRows={expandedRows}
                                        placeholderText={placeholderText}
                                        actionRelativeCl={false}
                                        displaySearch={false}
                                        defaultExpandedAll={true}
                                    />
                                </div>
                            </div>

                            <BasicModal
                                handleConfirmation={statusChangedHandler}
                                openModal={openBasicModal}
                                setOpenModal={setOpenBasicModal}
                                {...ModelInfo}
                            />
                        </>
                    </FormikForm>
                );
            }}
        </Formik>
    );
};

export default AttributeCombination;

const Price = ({ value, row }) => {
    const { values, setFieldValue } = useFormikContext();

    return (
        <InputNumber
            displayError={true}
            name={`productAttributeCombinationModel.${row.original.varientId}.price`}
            defaultValue={value}
            value={value}
            className={`block w-24 bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}
            onChange={(e) => {
                setFieldValue(e.target.name, e.target.value);
            }}
            maxLength={5}
            allowNegative={false}
        />
    )
}

const MinQuantity = ({ value, row }) => {
    const { setFieldValue } = useFormikContext();

    return (
        <InputNumber
            displayError={true}
            name={`productAttributeCombinationModel.${row.original.varientId}.minQuantity`}
            defaultValue={value}
            value={value}
            className={`block w-24 bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}
            onChange={(e) => {
                setFieldValue(e.target.name, e.target.value);
            }}
            maxLength={10}
            allowNegative={false}
        />
    )
}

const MultipleQuantity = ({ value, row }) => {
    const { setFieldValue } = useFormikContext();

    return (
        <InputNumber
            displayError={true}
            name={`productAttributeCombinationModel.${row.original.varientId}.multipleQuantity`}
            defaultValue={value}
            value={value}
            className={`block w-24 bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}
            onChange={(e) => {
                setFieldValue(e.target.name, e.target.value);
            }}
            maxLength={10}
            allowNegative={false}
        />
    )
}
