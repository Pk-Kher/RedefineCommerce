/*Component Name: StepThree
Component Functional Details:  StepThree .
Created By: PK Kher
Created Date: 7-19-2022
Modified By: PK Kher
Modified Date: 7-19-2022 */

import React, { useState, useCallback } from 'react';
import { paginationDetails } from 'global/Enum';
import ReactTableServerSide from 'components/common/table/ReactTableServerSide';
import { DateTimeFormat } from 'services/common/helper/Helper';
import { importData as DATA } from 'dummy/Dummy'
import Select from 'components/common/formComponent/Select';

const StepThree = ({ currentStep, stepLength, index, goToStep }) => {
    const COLUMNS = [
        {
            id: "title",
            Header: "Title",
            accessor: "title",
            column_name: "title",
        },
        {
            id: "field",
            Header: "FIELD",
            accessor: "field",
            column_name: "field",
            Cell: ({ value, row }) => {
                let options = [];
                value && value.map((field, index) => {
                    options = [...options, { value: field, label: field }]
                    return '';
                });
                return value ? (
                    <>
                        <Select options={options} defaultValue={row.original.title} />
                    </>
                ) : (
                    "-"
                );
            },

        },
        {
            id: "sample_data",
            Header: "Sample data",
            accessor: "sample_data",
            column_name: "sample_data",
        },
        {
            id: "updated_date",
            Header: "updated Date",
            accessor: "updated_date",
            column_name: "updated_date",
            Cell: ({ value }) => {
                return value ? (
                    <>
                        <div >{DateTimeFormat(value).date} </div>
                        <div className="text-[#707070] text-xs font-normal">
                            {DateTimeFormat(value).time}
                        </div>
                    </>
                ) : (
                    "-"
                );
            },
        },
        {
            id: "updated_by",
            Header: "updated By",
            accessor: "UpdatedByName",
            column_name: "updatedByName",
        },
    ];
    const [loading/* , setLoading */] = useState(false);
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
    const getImportHistoryData = useCallback(
        (pageIndex) => {
            setData(DATA)
        },
        [
            /* filteringOptions,
            paginationData.pageSize,
            sortingOptions,
            paginationData.pageIndex, */
        ]
    );
    return (
        <>
            <div className={`import-step import-step-2 ${currentStep !== 3 ? 'hidden' : 'visible'}`}>
                <div className="p-4 uppercase tracking-wide text-lg font-bold border-b-2 border-neutral-200">Import CSV document (Step {index + 1} of {stepLength})</div>
                <div className='p-4'>
                    <>
                        <ReactTableServerSide
                            COLUMNS={COLUMNS}
                            DATA={Data}
                            {...paginationData}
                            setTablePageSize={(value) =>
                                setPaginationDataFunc("pageSize", value)
                            }
                            fetchData={getImportHistoryData}
                            sortingOptions={sortingOptions}
                            setSortingOptions={setSortingOptionHandler}
                            loading={loading}
                            hiddenColumns={['rowSelection']}
                            tablePadding={'px-4 pb-4'}

                        />
                    </>
                </div>
                <div className="p-4 flex items-center justify-end space-x-2 border-t-2 border-neutral-200">
                    <span className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700 cursor-pointer" onClick={goToStep.bind(null, 1)}>Cancel</span>
                    <span className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700 cursor-pointer" onClick={goToStep.bind(null, currentStep - 1)}>Previous Step</span>
                    <span className="btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer" onClick={goToStep.bind(null, currentStep + 1)}>Finish</span>
                </div>
            </div>
        </>
    );
};

export default StepThree;
