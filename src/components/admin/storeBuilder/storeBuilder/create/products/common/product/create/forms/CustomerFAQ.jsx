/*Component Name: CustomerFAQ
Component Functional Details: User can create or update CustomerFAQ master details from here.
Created By: Happy
Created Date: 06/23/22
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useState, useCallback } from "react";
import ReactTable from "components/common/table/ReactTableServerSide";
import BasicModal from "components/common/modals/Basic";
import Actions from "components/common/others/admin/Action";
import { paginationDetails, RecStatusValuebyName } from "global/Enum";
import { DateTimeFormat } from "services/common/helper/Helper";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import { productType } from "dummy/Dummy";
import Input from "components/common/formComponent/Input";
import { ValidationMsgs } from "global/ValidationMessages";
import Textarea from "components/common/formComponent/Textarea";
import StoreCustomerFaqsService from "services/admin/masterCatalog/store/product/CustomerFaqsService";
import { useDispatch, useSelector } from "react-redux";
import { serverError } from "services/common/helper/Helper";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import BundleCustomerFaqsService from "services/admin/masterCatalog/store/bundle/CustomerFaqsService";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { useMemo } from "react";

const CustomerFAQ = ({ values, readOnly, isAddMode, type, productId }) => {
  const API = (type == productType.store.product ? StoreCustomerFaqsService : BundleCustomerFaqsService)
  const [CustomerFaq, setDeleteData] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [ModalInfo, setModalInfo] = useState({});
  const [openBasicModal, setOpenBasicModal] = useState(false);
  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);
  const COLUMNS = [
    {
      id: "Questions",
      Header: "Questions",
      accessor: "question",
      Footer: "Questions",
      column_name: "questions",
    },
    {
      id: "Answers",
      Header: "Answers",
      accessor: "answer",
      Footer: "Answers",
      column_name: "answers",
    },
    {
      id: "createdDate",
      Header: "CREATED Date",
      accessor: "createdDate",
      Footer: "CREATED",
      column_name: "createdDate",
      Cell: ({ value }) => {
        return value ? (
          <>
            <div className="">{DateTimeFormat(value).date} </div>
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
      id: "createdBy",
      Header: "Created BY",
      accessor: "createdByName",
      Footer: "Created BY",
      column_name: "createdBy",

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
            setDeleteData={setDeleteData}
            moduleName="Customer Faq"
            openDeleteModal={openDeleteModal}
            setOpenDeleteModal={setOpenDeleteModal}
            setModalInfo={setModalInfo}
            setOpenBasicModal={setOpenBasicModal}
          />
        );
      },
      disableSortBy: true,
      disableShowHide: true,
    },
  ]

  const [loading, setLoading] = useState(false);
  const [Data, setData] = useState([]);
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

  const getCustomerFaqsData = useCallback(
    (pageIndex = 1) => {
      setLoading(true);
      API.getCustomerFaqs({
        args: {
          pageSize: paginationData.pageSize,
          pageIndex: paginationData.pageIndex,
          sortingOptions,
          filteringOptions,
        },
        productId: productId
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
        setLoading(false);
      });
    },
    [filteringOptions, paginationData.pageSize, sortingOptions]
  );
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

  const handleDelete = (CustomerFaq) => {
    var ids = [];
    if (Array.isArray(CustomerFaq)) {
      ids = CustomerFaq.map((value) => {
        return { item1: value.id, item2: value.rowVersion };
      });
    } else {
      ids = [{ item1: CustomerFaq.id, item2: CustomerFaq.rowVersion }];
    }
    API.updateStatus({
      args: {
        idsRowVersion: ids,
        status: RecStatusValuebyName.Archived,
        ...location,
      },
    })
      .then((response) => {
        if (response.data.data) {
          dispatch(
            setAlertMessage({
              view: true,
              type: "success",
              message: ValidationMsgs.masterCatalog.customerFaqs.deleted,
            })
          );
          getCustomerFaqsData();
        } else {
          dispatch(
            setAlertMessage({
              view: true,
              type: "danger",
              message: serverError(response),
            })
          );
        }
      })
      .catch((errors) => {
        if (errors.response.data.Errors.Error) {
          dispatch(
            setAlertMessage({
              message: errors.response.data.Errors.Error,
              type: "danger",
            })
          );
        } else {
          dispatch(
            setAlertMessage({ message: ValidationMsgs.masterCatalog.customerFaqs.notDeleted, type: "danger" })
          );
        }
      });
    setOpenDeleteModal(false);
  };
  // Need to change the Brand SErvice as per the Page API
  const statusChangedHandler = (data) => {
    var ids = [];
    ids = [{ item1: data.id, item2: data.rowVersion }];
    API.updateStatus({
      args: {
        idsRowVersion: ids,
        status: data.changeStatus,
        ...location,
      },
    })
      .then((response) => {
        if (response.data.data) {
          dispatch(
            setAlertMessage({
              view: true,
              type: "success",
              message: ValidationMsgs.masterCatalog.customerFaqs.statusUpdated,
            })
          );
          getCustomerFaqsData();
        } else {
          dispatch(
            setAlertMessage({
              view: true,
              type: "danger",
              message: serverError(response),
            })
          );
        }
      })
      .catch((errors) => {
        if (errors.response.data.Errors.Error) {
          dispatch(
            setAlertMessage({
              message: errors.response.data.Errors.Error,
              type: "danger",
            })
          );
        } else {
          dispatch(
            setAlertMessage({ message: ValidationMsgs.masterCatalog.customerFaqs.statusNotUpdated, type: "danger" })
          );
        }
      });
    setOpenBasicModal(false);
  };
  return (
    <>
      <title>Customer FAQs</title>
      {/* <Messages /> */}
      <div className=" w-full ">
        <div className="max-h-screen border-t border-neutral-200">
          <ReactTable
            COLUMNS={COLUMNS}
            DATA={Data}
            hasNextPage={paginationData.hasNextPage}
            hasPreviousPage={paginationData.hasPreviousPage}
            pageIndex={paginationData.pageIndex}
            setPageIndex={(value) => setPaginationDataFunc("pageIndex", value)}
            pageSize={paginationData.paginationDetails.pageSize}
            setTablePageSize={(value) =>
              setPaginationDataFunc("pageSize", value)
            }
            totalCount={paginationData.totalCount}
            fetchData={getCustomerFaqsData}
            sortingOptions={sortingOptions}
            setSortingOptions={setSortingOptionHandler}
            hiddenColumns={["rowSelection", (readOnly ? 'action' : '')]}
            loading={loading}
            handleSort={handleSort}
            filteringOptions={filteringOptions}
            setColumnFilteringOptions={setColumnFilteringOptions}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            extraFilter={readOnly ? [] : [{ Component: AddButton, isAddMode, type, productId, getCustomerFaqsData, API }]}

          />
        </div>
      </div>

      <ConfirmDelete
        handleDelete={handleDelete}
        message={ValidationMsgs.masterCatalog.customerFaqs.deletePermanently}
        title={"Delete"}
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
        data={CustomerFaq}
      />
      <BasicModal
        handleConfirmation={statusChangedHandler}
        openModal={openBasicModal}
        setOpenModal={setOpenBasicModal}
        {...ModalInfo}
      />
    </>
  );
};
export default CustomerFAQ;

const AddButton = ({ isAddMode, type, productId, getCustomerFaqsData, API }) => {
  const [openAddModal, setopenAddModal] = useState(false);
  return (
    <>
      <div className="">
        <button
          type="button"
          onClick={() => setopenAddModal((prev) => !prev)}
          className="btn inline-flex bg-indigo-500 hover:bg-indigo-600 text-white"
          data-modal-toggle="addfaqModal"
        >
          <span className="material-icons-outlined">add</span>
          <span className="ml-1">Add Question</span>
        </button>
      </div>
      {openAddModal && (
        <AddFaqModal
          openAddModal={openAddModal}
          setopenAddModal={setopenAddModal}
          isAddMode={isAddMode}
          getCustomerFaqsData={getCustomerFaqsData}
          productId={productId}
          type={type}
          API={API}
        />
      )}
    </>
  );
};

const AddFaqModal = ({ openAddModal, setopenAddModal, getCustomerFaqsData, productId, type, API }) => {
  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);
  const [saveLoading, setSaveLoading] = useState(false);

  const validationSchema = Yup.object({
    question: Yup.string().required(
      ValidationMsgs.masterCatalog.customerFaqs.questionRequired
    ),
    answer: Yup.string().required(
      ValidationMsgs.masterCatalog.customerFaqs.answerRequired
    ),
  });

  const onSubmit = (fields, { resetForm }) => {
    dispatch(setAddLoading(true))

    API.createCustomerFaqs({
      productCustomerFAQModel: { ...fields, ...location }
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.masterCatalog.customerFaqs.created,
            })
          );
          dispatch(setAddLoading(false))

          getCustomerFaqsData()
          resetForm({});
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
          dispatch(setAddLoading(false))

        }
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.masterCatalog.customerFaqs.notCreated,
          })
        );
        dispatch(setAddLoading(false))

      });
    setopenAddModal(false)
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          id: 0,
          productId: productId,
          question: "",
          answer: "",
          rowVersion: "",
          recStatus: RecStatusValuebyName.Active,
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        validateOnChange={true}
        validateOnBlur={false}
      >
        {({ setFieldValue, errors, values }) => {
          return (
            <FormikForm>
              <div
                id="addfaqmodal"
                className="overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-4 z-50 justify-center items-center h-modal md:h-full md:inset-0"
              >
                <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="relative px-4 w-full max-w-2xl h-full md:h-auto">
                    <div className="relative bg-white rounded-lg shadow  max-h-screen overflow-y-auto">
                      <div className="flex justify-between items-start p-5 rounded-t border-b  sticky top-0 left-0 bg-white">
                        <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl ">
                          Add Customer Faqs
                        </h3>
                        <button
                          type="button"
                          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
                          data-modal-toggle="addfaqmodal"
                          onClick={() => setopenAddModal((prev) => !prev)}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="p-6">
                        <div className="mb-4">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                            htmlFor=""
                          >
                            Question
                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </label>

                          <Input type={"text"} name="question" />
                        </div>

                        <div className="mb-4">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                            htmlFor=""
                          >
                            Answer
                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </label>

                          <Textarea type={"text"} name="answer" />
                        </div>
                      </div>
                      <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200 ">
                        <button
                          data-modal-toggle="addfaqmodal"
                          type="button"
                          className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
                          onClick={() => setopenAddModal((prev) => !prev)}
                        >
                          Cancel
                        </button>
                        <button
                          data-modal-toggle="addfaqmodal"
                          type="submit"
                          className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(saveLoading) ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}
                        >
                          <div className={`w-full flex justify-center align-middle `}>
                            {saveLoading && (
                              <span className="spinner-border spinner-border-sm mr-2"></span>
                            )}
                            Save
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FormikForm>
          );
        }}
      </Formik>
    </>
  );
};
