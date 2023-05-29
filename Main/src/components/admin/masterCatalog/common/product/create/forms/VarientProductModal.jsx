import React, { useEffect, useState } from "react";
import Transition from "utils/Transition";
import ReactTableServerSide from "components/common/table/ReactTableServerSide";
import { paginationDetails } from "global/Enum";

const DiscontinuedModel = ({ title, openModal, setOpenModal, COLUMNS, DATA, setdataForVarientProducts }) => {
    const [paginationData, setPaginationData] = useState({
        ...paginationDetails,
    });

    const setPaginationDataFunc = (key, value) => {
        setPaginationData((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const [sortingOptions, setSortingOptions] = useState([
        {
            field: "orderNo",
            direction: 0,
            priority: 0,
        },
    ]);

    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (!openModal.toShow || keyCode !== 27) return;
            setOpenModal((prevData) => ({
                ...prevData,
                name: "",
                ourSku: "",
                toShow: false
            }));
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });

    return (
        <>
            <Transition
                className="fixed inset-0 bg-slate-600 bg-opacity-95 z-40 transition-opacity"
                show={openModal.toShow}
                tag="div"
                enter="transition ease-out duration-200 transform"
                enterStart="opacity-0 -translate-y-2"
                enterEnd="opacity-100 translate-y-0"
                leave="transition ease-out duration-200"
                leaveStart="opacity-100"
                leaveEnd="opacity-0"
                onClick={() => {
                    setdataForVarientProducts([])
                    setOpenModal((prevData) => ({
                        ...prevData,
                        name: "",
                        ourSku: "",
                        toShow: false
                    }))
                }}
            ></Transition><Transition
                className="fixed inset-0 z-40 overflow-hidden flex items-center justify-center transform px-4 sm:px-6"
                show={openModal.toShow}
                tag="div"
                id="basic-modal"
                enter="transition ease-out duration-200 transform"
                enterStart="opacity-0 -translate-y-2"
                enterEnd="opacity-100 translate-y-0"
                leave="transition ease-out duration-200"
                leaveStart="opacity-100"
                leaveEnd="opacity-0"
            >
                <>
                    <div className="bg-white rounded shadow-lg overflow-auto max-h-[calc(100%-4rem)] w-full lg:max-w-[80vw]">
                        <div className="px-5 py-3 border-b border-neutral-200 sticky top-0 left-0 right-0 z-10 bg-white">
                            <div className="flex justify-between items-center">
                                <div className="font-bold text-black">
                                    {title ? title : "Confirmation"}
                                </div>
                                <button type="button"
                                    className="text-black hover:text-gray-400"
                                    onClick={() => {
                                        setOpenModal((prevData) => ({
                                            ...prevData,
                                            name: "",
                                            ourSku: "",
                                            toShow: false
                                        }));
                                        setdataForVarientProducts([])
                                    }}
                                >
                                    <div className="sr-only">Close</div>
                                    <svg className="w-4 h-4 fill-current">
                                        <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div>
                            <ReactTableServerSide
                                COLUMNS={COLUMNS}
                                DATA={DATA}
                                {...paginationData}
                                setTablePageSize={(value) =>
                                    setPaginationDataFunc("pageSize", value)
                                }
                                sortingOptions={sortingOptions}
                                fetchData={() => { }}
                                displaySearch={false}
                                hiddenColumns={["rowSelection"]}
                                tablePadding={true}
                                filters={false}
                            />
                        </div>

                    </div>
                </>
            </Transition>
        </>
    );
};

export default DiscontinuedModel;