/*Component Name: CustomLogo
Component Functional Details:  CustomLogo .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: Shrey Patel
Modified Date: 12/23/2022 */

import React, { useState, useCallback } from 'react';
import { paginationDetails } from 'global/Enum';
import ReactTableServerSide from 'components/common/table/ReactTableServerSide';
import { DateTimeFormat } from 'services/common/helper/Helper';
import Status from 'components/common/displayStatus/Status';
import Image from "components/common/formComponent/Image";
import { useDispatch, useSelector } from 'react-redux';
import { setAddLoading } from 'redux/globalLoader/GlobalLoaderAction';
import CustomerLogoService from 'services/admin/customerLogo/CustomerLogoService';
import EditcustomLogo from './EditCustomLogo';
import CustomLogoAction from './CustomLogoActions';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const CustomLogo = ({ CustomerId, CompanyId }) => {

    const dispatch = useDispatch();
    const [EditCustomLogo, setEditCustomLogo] = useState(false);
    const [CustomLogoId, setCustomLogoId] = useState(0);
    const permission = useSelector(store => store?.permission);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        let id = parseInt(searchParams.get('logoId'));
        searchParams.delete('logoId');
        setSearchParams(searchParams);
        setCustomLogoId(() => {
            return (!isNaN(id)) ? id : 0;
        });
        setEditCustomLogo((!isNaN(id)) ? true : false);
    }, []);
    const COLUMNS = [
        {
            id: "logo",
            Header: "Logo",
            accessor: "logo",
            disableSortBy: true,
            column_name: "logo",
            Cell: ({ value, row }) => {
                return <div className="flex items-center">
                    <Image src={value} className="w-20" containerheight={"h-20"} />
                </div>
            }
        },
        {
            id: "logoName",
            Header: "Logo Name",
            accessor: "logoName",
            column_name: "logoName",
            Cell: ({ value, row }) => {
                if (value) {
                    return (<label className='inline-block text-black-500 cursor-pointer' onClick={() => { setEditCustomLogo(true); setCustomLogoId(row.original.customerLogoId); }}>{value} </label>
                    )
                } else {
                    return ""
                }
            },
        },
        {
            id: "logoNumber",
            Header: "Logo Number",
            accessor: "logoNumber",
            column_name: "logoNumber",
            Cell: ({ value, row }) => {
                return <div className="text-center">{value}</div>
            }
        },
        {
            id: "logoSize",
            Header: "Logo Size",
            accessor: "logoSize",
            column_name: "logoSize",
        },
        {
            id: "productType",
            Header: "Product Type",
            accessor: "productType",
            column_name: "productType",
            disableSortBy: true,
            Cell: ({ value, row }) => {
                return <div className="flex items-center">
                    <Image src={value} className="w-20" containerheight={"h-20"} />
                </div>
            }
        },
        {
            id: "locationName",
            Header: "Logo Location",
            accessor: "logoLocationImage",
            column_name: "locationName",
            disableSortBy: true,
            Cell: ({ value, row }) => {
                return <div className="flex items-center">
                    <Image src={value} className="w-20" containerheight={"h-20"} />
                </div>
            }
        },
        {
            id: "uploadedDate",
            Header: "Upload Date",
            accessor: "uploadDate",
            column_name: "uploadedDate",
            Cell: ({ value }) => {
                return value ? (
                    <>
                        <div >{DateTimeFormat(value).date} </div>
                        <div className="text-[#707070] text-xs font-normal">
                            {DateTimeFormat(value).time}
                        </div>
                    </>
                ) : (
                    ""
                );
            },
        },
        {
            id: "approvedDate",
            Header: "Approved Date",
            accessor: "approvedDate",
            column_name: "approvedDate",
            Cell: ({ value }) => {
                return value ? (
                    <>
                        <div >{DateTimeFormat(value).date} </div>
                        <div className="text-[#707070] text-xs font-normal">
                            {DateTimeFormat(value).time}
                        </div>
                    </>
                ) : (
                    ""
                );
            },
        },
        {
            id: "status",
            Header: "Status",
            accessor: "status",
            column_name: "status",
            Cell: ({ value, row }) => {
                if (value === "Approved") {
                    // return (
                    //     <div className="text-green-500">{value}</div>
                    // );
                    return <Status type={value} />;
                }
                else {
                    return (<> {(permission?.isEdit || permission?.isDelete) &&
                        <button className='inline-block text-indigo-500' onClick={() => { setEditCustomLogo(true); setCustomLogoId(row.original.customerLogoId); }}>{value} </button>}
                    </>
                    )
                }
            },
        },
        {
            id: "action",
            column_name: "action",
            disableSortBy: true,
            Cell: ({ row, value }) => {
                return <CustomLogoAction
                    row={row}
                    setEditCustomLogo={setEditCustomLogo}
                // openDeleteModal={openDeleteModal}
                // setOpenDeleteModal={setOpenDeleteModal}
                // setDeleteData={setCustomer}
                // setModalInfo={setCustomer}
                // setOpenBasicModal={setOpenBasicModal}
                // editUrl={`/admin/Customer/customer/edit/${row.original.id}`}
                // moduleName={'Customer'}
                // setViewHistoryModal={setViewHistoryModal}
                // setRecordId={setCustomer}
                />
                // return <button className='inline-block text-indigo-500 text-xs' onClick={() => { setEditCustomLogo(true) }}> Action</button>
            },
        },
    ];

    const [loading/* , setLoading */] = useState(false);
    const [filteringOptions, setColumnFilteringOptions] = useState([]);
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

    const getCustomLogoData = useCallback(
        (pageIndex = 1) => {
            dispatch(setAddLoading(true))
            CustomerLogoService.getCustomerLogoList({
                args: {
                    pageSize: paginationData.pageSize,
                    pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
                    sortingOptions,
                    filteringOptions,
                },
                customerId: CustomerId || 0,
                companyId: CompanyId || 0
            }).then((response) => {
                let CustomLogoData = response.data.data;
                setData(CustomLogoData.items);
                setPaginationData((prevState) => ({
                    ...prevState,
                    pageIndex: CustomLogoData.pageIndex,
                    pageSize: CustomLogoData.pageSize,
                    totalCount: CustomLogoData.totalCount,
                    totalPages: CustomLogoData.totalPages,
                    hasPreviousPage: CustomLogoData.hasPreviousPage,
                    hasNextPage: CustomLogoData.hasNextPage,
                }));
                dispatch(setAddLoading(false))
            }).catch(() => {
                dispatch(setAddLoading(false))
            })
        },
        [filteringOptions,
            paginationData.pageSize,
            sortingOptions,
            paginationData.pageIndex]
    );

    return (
        <div className='grow'>
            <div className='py-6 space-y-6'>
                {!EditCustomLogo ?
                    <ReactTableServerSide
                        COLUMNS={COLUMNS}
                        DATA={Data}
                        {...paginationData}
                        setTablePageSize={(value) =>
                            setPaginationDataFunc("pageSize", value)
                        }
                        fetchData={getCustomLogoData}
                        sortingOptions={sortingOptions}
                        setSortingOptions={setSortingOptionHandler}
                        setColumnFilteringOptions={setColumnFilteringOptions}
                        loading={loading}
                        hiddenColumns={['rowSelection']}
                        tablePadding={'px-4 pb-4'}
                    />
                    :
                    <EditcustomLogo setEditCustomLogo={setEditCustomLogo} Data={Data} CustomLogoId={CustomLogoId} />
                }
            </div>
        </div>
    );
};

export default CustomLogo;
