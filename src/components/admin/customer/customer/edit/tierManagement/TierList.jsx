/*Component Name: TierList
Component Functional Details:  TierList .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */
import React, { useState, useCallback } from 'react';
import { paginationDetails } from 'global/Enum';
import ReactTableServerSide from 'components/common/table/ReactTableServerSide';
import { DateTimeFormat, serverError } from 'services/common/helper/Helper';
import CustomerTierService from 'services/admin/customerTier/CustomerTierService';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAlertMessage } from 'redux/alertMessage/AlertMessageReducers';
import BasicModal from "components/common/modals/Basic";
import { ValidationMsgs } from "global/ValidationMessages";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const TierList = ({ customerInfo, getTiers, setEditTierData, setCustomizeTier }) => {
    const [openBasicModal, setOpenBasicModal] = useState(false);
    const [tierInfo, setTierInfo] = useState()
    const dispatch = useDispatch();

    const getTierById = useCallback((id) => {
        dispatch(setAddLoading(true))

        CustomerTierService.getCustomerTierById(id).then(response => {
            setEditTierData({
                id: response.data.data.id,
                customerId: response.data.data.customerId,
                brandId: response.data.data.brandId,
                vendorId: response.data.data.vendorId,
                tierId: response.data.data.tierId,
                recStatus: "A",
                rowVersion: response.data.data.rowVersion,
            });
            dispatch(setAddLoading(false))
        }).catch(errors => {
            dispatch(setAddLoading(false))
        })
    });

    const deleteTier = useCallback((id) => {
        dispatch(setAddLoading(true))

        CustomerTierService.deleteCustomerTier({ id: id }).then((response) => {
            if (response.data.success) {
                dispatch(
                    setAlertMessage({
                        view: true,
                        type: "success",
                        message: ValidationMsgs.tier.tierDeleted,
                    })
                );
                getTierData();
            } else {
                dispatch(
                    setAlertMessage({
                        view: true,
                        type: "danger",
                        message: serverError(response),
                    })
                );
                dispatch(setAddLoading(false))
            }
        })
            .catch((errors) => {
                dispatch(
                    setAlertMessage({
                        view: true,
                        type: "danger",
                        message: ValidationMsgs.tier.tierNotDeleted,

                    })
                );
                dispatch(setAddLoading(false))
            });
        setOpenBasicModal(false);
    }, []);

    const COLUMNS = [
        {
            id: "brandName",
            Header: "Brand Name",
            accessor: "brandName",
            column_name: "brandName",

        },
        {
            id: "vendorName",
            Header: "Vendor Name",
            accessor: "vendorName",
            column_name: "vendorName",
        },
        {
            id: "tierName",
            Header: "Tier NAme",
            accessor: "tierName",
            column_name: "tierName",
        },
        {
            id: "operation",
            Header: "Operation",
            accessor: "operation",
            column_name: "operation",
        },
        {
            id: "action",
            Header: "Action",
            accessor: "id",
            column_name: "action",
            disableSortBy: true,
            disableShowHide: true,
            Cell: ({ value, row }) => {
                return (
                    <div >
                        <button type='button' className="cursor-pointer "><span className="material-icons-outlined w-6 h-6" onClick={() => { getTierById(row.original.id); }}>edit</span></button>
                        <button type='button' className="cursor-pointer text-rose-500"><span className="material-icons-outlined w-6 h-6" onClick={() => { setOpenBasicModal(true); setTierInfo(row.original.id) }}>delete</span></button>
                    </div>
                );
            },
        },
    ];
    const [Data, setData] = useState([]);
    const [sortingOptions, setSortingOptions] = useState([
        {
            field: "name",
            direction: 0,
            priority: 0,
        },
    ]);
    const [paginationData, setPaginationData] = useState({
        ...paginationDetails,
    });
    const setPaginationDataFunc = (key, value) => {
        setPaginationData((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };
    const setSortingOptionHandler = (column, direction) => {
        setSortingOptions([
            {
                field: column,
                direction: direction,
                priority: 0,
            },
        ]);
    };
    const getTierData = useCallback(
        (pageIndex) => {
            dispatch(setAddLoading(true))

            CustomerTierService.getCustomerTiers(customerInfo.id).then((response) => {
                let responseData = response.data.data;
                setData(responseData);
                setCustomizeTier(responseData.length > 0);
                setPaginationData((prevState) => ({
                    ...prevState,
                    pageIndex: responseData.pageIndex,
                    pageSize: responseData.pageSize,
                    totalCount: responseData.totalCount,
                    totalPages: responseData.totalPages,
                    hasPreviousPage: responseData.hasPreviousPage,
                    hasNextPage: responseData.hasNextPage,
                }));
                dispatch(setAddLoading(false))
            }).catch((errors) => {
                dispatch(setAddLoading(false))
            })
        },
        [paginationData.pageSize, sortingOptions, paginationData.pageIndex]
    );
    useEffect(() => {
        getTiers.current = getTierData;
    }, []);

    return (
        <div className='grow'>
            <ReactTableServerSide
                COLUMNS={COLUMNS}
                DATA={Data}
                {...paginationData}
                setTablePageSize={(value) =>
                    setPaginationDataFunc("pageSize", value)
                }
                fetchData={getTierData}
                sortingOptions={sortingOptions}
                setSortingOptions={setSortingOptionHandler}
                hiddenColumns={['rowSelection']}
                tablePadding={'px-4 pb-4'}

            />
            <BasicModal
                handleConfirmation={deleteTier}
                openModal={openBasicModal}
                setOpenModal={setOpenBasicModal}
                title={"Delete Tier"}
                message={ValidationMsgs.customer.deletePermanently}
                data={tierInfo}
                ButtonName={'Yes'}
            />
        </div>
    );
}
export default TierList;
