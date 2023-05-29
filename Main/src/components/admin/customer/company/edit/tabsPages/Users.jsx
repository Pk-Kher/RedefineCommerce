/*Component Name: Users
Component Functional Details: User can create or update Users master details from here.
Created By: chandan
Created Date: <Creation Date>
Modified By: chandan
Modified Date: <Modified Date> */

import React, { useState, useCallback, useEffect } from 'react';
import { NavLink, useParams } from "react-router-dom";
import { paginationDetails, RecStatusValueForForm } from 'global/Enum';
import { DateTimeFormat } from 'services/common/helper/Helper';
import ReactTable from "components/common/table/ReactTableServerSide";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import CustomerService from 'services/admin/customer/CustomerService';
import Actions from "./Actions"
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { useDispatch, useSelector } from "react-redux";
import DropdownService from "services/common/dropdown/DropdownService";
import CustomerTagService from 'services/admin/customerTag/CustomerTagService';
import CompanyInformationServices from 'services/admin/companyInformation/CompanyInformationServices';

const Users = ({ PageName }) => {
    const dispatch = useDispatch();
    const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);
    const permission = useSelector(store => store?.permission)
    const [Data, setData] = useState([]);
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [filteringOptions, setColumnFilteringOptions] = useState([]);
    const [company, setCompany] = useState(null);
    const [userNameValues, setUserNameValues] = useState([]);
    const { id } = useParams();
    const [CompanyData, setCompanyData] = useState([]);
    const [CustomerData, setCustomerData] = useState([]);

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

    const statusChange = () => {
    };

    const COLUMNS = [
        {
            id: "customerName",
            Header: "CUSTOMER NAME",
            accessor: "customerName",
            column_name: "CUSTOMER NAME",
            isVisible: false,
            disableShowHide: true,
            Cell: ({ value, row }) => {
                return row ? (
                    <>
                        <div
                            className="w-full flex justify-start items-center group"
                            style={{ width: "200px" }}
                        >
                            <div >
                                <NavLink
                                    to={
                                        "/admin/Customer/customer/edit/" +
                                        row.original.id
                                    }
                                >
                                    <div className="font-semibold">{value}</div>
                                </NavLink>
                            </div>
                        </div>
                    </>
                ) : (
                    ""
                );
            },
        },
        {
            id: "storeLogo",
            Header: "storeLogo",
            accessor: "storeLogo",
            column_name: "storeLogo",
            Cell: ({ value }) => {
                if (!value) {
                    return "";
                } else {
                    return <div className='w-20 h-20 border border-slate-200 p-1'>
                        <img src={`${process.env.REACT_APP_API_BLOB}${value}`} alt="" />
                    </div>
                }
            },
        },
        {
            id: "isRegistered",
            Header: "REGISTERED",
            accessor: "isRegistered",
            column_name: "isRegistered",
            Cell: ({ value }) => {
                return value ? "Yes" : "No";
            },
        },
        {
            id: "customerType",
            Header: "CUSTOMER TYPE",
            accessor: "customerType",
            column_name: "customerType",
            Cell: ({ value }) => {
                return value
            },
        },
        {
            id: "email",
            Header: "CUSTOMER EMAIL",
            accessor: "email",
            column_name: "email",
            Cell: ({ value }) => {
                if (!value) {
                    return "";
                } else {
                    return value;
                }
            },
        },
        {
            id: "tags",
            Header: "TAGS",
            accessor: "tags",
            column_name: "tags",
            Cell: ({ value }) => {
                return value
            },
        },
        {
            id: "revenue",
            Header: "REVENUE",
            accessor: "revenue",
            column_name: "revenue",
            Cell: ({ value }) => {
                return value;
            },
        },
        {
            id: "orders",
            Header: "ORDERS",
            accessor: "orders",
            column_name: "orders",
            // Cell: ({ value }) => {
            //     if (value !== undefined) {
            //         return <Status type={value} />;
            //     } else {
            //         return "";
            //     }
            // },
            Cell: ({ value }) => {
                return value
            }
        },
        {
            id: "sessions",
            Header: "SESSIONS",
            accessor: "sessions",
            column_name: "sessions",
            Cell: ({ value }) => {
                return value
            }
        },
        {
            id: "lastactive",
            Header: "LAST ACTIVE",
            accessor: "lastactive",
            column_name: "lastactive",
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
            }
        },
        {
            id: "action",
            Header: "",
            accessor: "id",
            column_name: "action",
            Cell: ({ value, row }) => {
                return (
                    <Actions
                        id={value}
                        row={row}
                        openDeleteModal={openDeleteModal}
                        setOpenDeleteModal={setOpenDeleteModal}
                        setDeleteData={setCompany}
                    />
                );
            },
            disableSortBy: true,
            disableShowHide: true,
        },
    ];

    const getCustomerDataBasedOnCompanyIdData = useCallback(
        (pageIndex = 1) => {
            dispatch(setAddLoading(true))

            CustomerService.getCustomerByCompanyId({
                args: {
                    pageSize: paginationData.pageSize,
                    pageIndex: pageIndex ? pageIndex : paginationData.pageIndex,
                    sortingOptions,
                    filteringOptions,
                },
                companyId: id,
            }).then((response) => {
                setData(response.data.data.items);

                setPaginationData((prevState) => ({
                    ...prevState,
                    pageIndex: response.data.data.pageIndex,
                    pageSize: response.data.data.pageSize,
                    totalCount: response.data.data.totalCount,
                    totalPages: response.data.data.totalPages,
                    hasPreviousPage: response.data.data.hasPreviousPage,
                    hasNextPage: response.data.data.hasNextPage,
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

    const getCustomerTagByCompanyId = useCallback(
        () => {
            dispatch(setAddLoading(true))

            CustomerTagService.getCustomerTagByCompanyId(id).then((response) => {
                let responseData = response.data.data;
                setCompanyData(() => {
                    return responseData.map((customerValue, key) => {
                        return { label: customerValue.tags, value: customerValue.customerId }
                    })
                });
                dispatch(setAddLoading(false))
            }).catch(() => {
                dispatch(setAddLoading(false))
            })

            CompanyInformationServices.getCustomerDropDown(id).then((response) => {
                setCustomerData(response.data.data);
            }).catch(() => { })
        }, [id]);

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

    const [customerOption, setcustomerOption] = useState([]);

    useEffect(() => {
        DropdownService.getDropdownValues("adminuser").then((response) => {
            setUserNameValues(response.data.data);
        });

        DropdownService.getDropdownValues("customer").then((response) => {
            setcustomerOption(() => {
                return response.data.data;
            });
        });

        // abc

        getCustomerTagByCompanyId();
    }, [id]);



    const moreFilterOptions = [
        {
            name: "Name",
            options: CustomerData,
            columnName: "id",
            type: "checkbox",
            conditionalSearch: true,
        },
        {
            name: "Last Active Date",
            columnName: "lastactive",
            options: [],
            type: "date",
        },
    ]

    return (
        <>
            <div className="col-span-full w-full flex justify-between items-center">
                <h2 className="text-2xl text-gray-800 font-bold my-6">{PageName}</h2>
                {(permission?.isEdit || permission?.isDelete) &&
                    <div className="flex flex-wrap sm:auto-cols-max gap-2">
                        <NavLink to={"/admin/Customer/customer/create"} className="btn bg-indigo-500 hover:bg-indigo-600 text-white" >
                            <span className="ml-1">Add User</span>
                        </NavLink>
                    </div>
                }
            </div>
            <ReactTable
                COLUMNS={COLUMNS}
                DATA={Data}
                {...paginationData}
                setTablePageSize={(value) =>
                    setPaginationDataFunc("pageSize", value)
                }
                filteringOptions={filteringOptions}
                setColumnFilteringOptions={setColumnFilteringOptions}
                fetchData={getCustomerDataBasedOnCompanyIdData}
                sortingOptions={sortingOptions}
                setSortingOptions={setSortingOptionHandler}
                loading={GlobalLoading}
                hiddenColumns={['rowSelection']}
                tablePadding={'px-4 pb-4'}
                editColumnFilter={true}
                morefilter={true}
                moreFilterOption={moreFilterOptions}
                checkBoxFilterOptions={[
                    {
                        columnName: "id",
                        name: "Tags",
                        options: CompanyData,
                        icon: 'expand_more',
                        iconPosition: 'right',
                    },

                ]}
            />
            <ConfirmDelete
                handleDelete={statusChange}
                data={company}
                message="Deleting this Brand will permanently remove this record from your account. This can't be undone"
                openDeleteModal={openDeleteModal}
                setOpenDeleteModal={setOpenDeleteModal}
                title={"Delete"}
            />
        </>
    );
};

export default Users;
