/*Component Name: AttributeCombination
Component Functional Details: User can create or update AttributeCombination master details from here.
Created By: Ankit Sharma
Created Date: 11/16/2022
Modified By: Ankit Sharma
Modified Date: 11/16/2022 */

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
import { productType } from 'dummy/Dummy';
import Image from 'components/common/formComponent/Image';
import { ValidationMsgs } from "global/ValidationMessages";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const AttributeCombination = ({ CombinationData, type, getCombinationData, readOnly, CombinationAPI, productId }) => {

    const [initialValues, setInitialValues] = useState({});
    const [combinationId, setCombinationId] = useState("");
    const [placeholderText, setPlaceholderText] = useState('');
    const [saveLoading, setSaveLoading] = useState(false);
    const dispatch = useDispatch();
    const location = useSelector((store) => store?.location);

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
                Footer: "",
                Cell: ({ row, value }) => {
                    return value && value !== "" ? (
                        <>
                            <img className="h-10 w-10 mr-4" src={`${process.env.REACT_APP_API_BLOB}${value}`} alt="" />
                        </>
                    ) :
                        <>
                            <Image src={defaultImage} className="h-16 w-20" />
                        </>
                },
                disableSortBy: true,
                disableShowHide: true,
            },
            {
                id: "name",
                Header: "Variant",
                accessor: "varientName",
                Footer: "name",
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
                id: "price",
                Header: "Additional price",
                accessor: "price",
                Footer: "price",
                Cell: ({ row, value }) => {

                    return row.original.subRows !== undefined ? (
                        ""
                    ) : (
                        <Input name={`productAttributeCombinationModel.${row.original.varientId}.price`} />
                    );
                },
            },
            {
                id: "min Quantity",
                Header: "min quantity",
                accessor: "minQuantity",
                Footer: "min quantity",
                Cell: ({ row }) => {
                    return row.original.subRows === undefined ? (
                        ""
                    ) : (
                        <Input name={`productAttributeCombinationModel.${row.original.varientId}.minQuantity`} />
                    );
                },

            },
            {
                id: "multiple Quantity",
                Header: "multiple quantity",
                accessor: "multipleQuantity",
                Footer: "multiple quantity",
                Cell: ({ row }) => {
                    return row.original.subRows === undefined ? (
                        ""
                    ) : (
                        <Input name={`productAttributeCombinationModel.${row.original.varientId}.multipleQuantity`} />
                    );
                },
            },
            {
                id: "upC_GTIN",
                Header: "UPC/GTIN",
                accessor: "upC_GTIN",
                Footer: "GTIN",
                Cell: ({ row }) => {
                    return row.original.subRows !== undefined ? (
                        ""
                    ) : (
                        <Input name={`productAttributeCombinationModel.${row.original.varientId}.upC_GTIN`} />
                    );
                },
            },

            {
                id: "action",
                Header: "",
                accessor: "id",
                Cell: ({ value, row }) => {
                    return (

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

    const [loading, setLoading] = useState(false);

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
        let Obj = []
        Object.keys(fields.productAttributeCombinationModel).map((value, key) => {
            Obj = (
                fields.productAttributeCombinationModel[value].id === 0 ?
                    [
                        ...Obj,
                        {
                            ...fields.productAttributeCombinationModel[value],
                            varientId: (fields.productAttributeCombinationModel[value]?.varientId ? fields.productAttributeCombinationModel[value]?.varientId?.split(',') : []),
                            recStatus: RecStatusValuebyName.Active,
                            ...location
                        }
                    ] :
                    [
                        ...Obj,
                        {
                            ...fields.productAttributeCombinationModel[value],
                            varientId: (fields.productAttributeCombinationModel[value]?.varientId ? fields.productAttributeCombinationModel[value]?.varientId?.split(',') : []),
                            ...location
                        }
                    ]);
        })
        dispatch(setAddLoading(true))
        CombinationAPI.createAttributeCombination({ productAttributeCombinationModel: Obj }).then((response) => {
            if (response.data.success) {
                dispatch(
                    setAlertMessage({
                        type: "success",
                        message: ValidationMsgs.masterCatalog.attributes.combinationCreated,
                    })
                );

            } else {
                dispatch(setAlertMessage({ type: "danger", message: serverError(response) }));
            }
            dispatch(setAddLoading(false))
        })
            .catch((errors) => {
                dispatch(
                    setAlertMessage({
                        type: "danger",
                        message: ValidationMsgs.masterCatalog.attributes.combinationNotCreated,
                    })
                );
                dispatch(setAddLoading(false))
            });
    }

    const handleSort = (sortValue) => { };

    const statusChangedHandler = (data) => {
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
                        <>
                            <title>Attributes</title>
                            <div className="mt-10 border-t-2 border-neutral-200">
                                <div className="w-full p-6 pb-0 flex flex-wrap items-center justify-between mb-2">
                                    <div className="block uppercase tracking-wide text-gray-500 text-lg font-bold">
                                        Attribute Combination
                                    </div>
                                    {/* {type !== productType.store.product && <button type="submit" className={`btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white`}>
                                        Save
                                    </button>} */}
                                    {type !== productType.storeBuilder &&
                                        <>
                                            {saveLoading ?
                                                <span className="spinner-border spinner-border-sm mr-2"></span> :
                                                <button type="submit" className={`btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white`}>
                                                    Save
                                                </button>
                                            }
                                        </>
                                    }

                                </div>
                            </div>
                            <div className=" w-full ">
                                <div className=" max-h-screen border-t border-neutral-200">
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
                                        loading={loading}
                                        handleSort={handleSort}
                                        filteringOptions={filteringOptions}
                                        setColumnFilteringOptions={setColumnFilteringOptions}
                                        selectedRows={selectedRows}
                                        setSelectedRows={setSelectedRows}
                                        expandedRows={(() => true, [])}
                                        placeholderText={placeholderText}
                                        actionRelativeCl={false}
                                        displaySearch={false}
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