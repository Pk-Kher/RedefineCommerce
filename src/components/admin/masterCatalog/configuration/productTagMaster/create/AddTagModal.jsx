/*Component Name: AddTagModal
Component Functional Details: User can create or update AddTagModal master details from here.
Created By: Divyesh
Created Date: <Creation Date>
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useState, useCallback, useEffect } from "react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import Input from "components/common/formComponent/Input";
import Dropdown from "components/common/formComponent/Dropdown";
import DropdownService from "services/common/dropdown/DropdownService";
import ProductTag from "services/admin/productTagMaster/ProductTagMaster";
import ToggleButton from "components/common/formComponent/ToggleButton";
import { blobFolder, RecStatusValuebyName } from "global/Enum";
import { useDispatch, useSelector } from "react-redux";
import ImageFile from "components/common/formComponent/ImageFile";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import Messages from "components/common/alerts/messages/Index";
import { ValidationMsgs } from "global/ValidationMessages";
import { serverError } from "services/common/helper/Helper";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const AddTagModal = ({ handleShowModal, idson, getProductTag }) => {
  const permission = useSelector(store => store.permission);
  const [data, setData] = useState([]);
  const [stores, setStores] = useState([]);
  const [productTagTypeID, setProductTagTypeID] = useState([]);
  const [position, setPosition] = useState([]);
  const isAddMode = idson ? false : true;
  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);
  const CompanyId = useSelector((store) => store?.CompanyConfiguration.id)
  const FolderPath = `/${blobFolder.temp}/${CompanyId}/${blobFolder.productTag}`
  const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

  // const navigate =useNavigate();
  const getStoreDropdownData = useCallback(() => {
    DropdownService.getDropdownValues(
      "store"
    ).then((res) => {
      if (res.data.success) {
        setStores(() => {
          return res.data.data;
        });
      }
    });
  }, []);

  useEffect(() => {
    DropdownService.getDropdownValues(
      "productTagPosition"
    ).then((res) => {
      if (res.data.success) {
        setPosition(() => {
          return res.data.data;
        });
      }
    });
  }, [])

  // const navigate =useNavigate();
  const getProductTypeIdDropdownData = useCallback(() => {
    DropdownService.getDropdownValues(
      "productstatus"
    ).then((res) => {
      if (res.data.success) {
        setProductTagTypeID(() => {
          return res.data.data;
        });
      }
    });
  }, []);

  // const [toggler, setToggler] = useState({
  //   recStatus: true,
  // });
  // const [toggler, setToggler] = useState({
  //   recStatus: false,
  // });
  const initialValues = {
    id: data?.id || 0,
    name: data?.name || "",
    tagPositionId: data?.tagPositionId || "",
    imageName: data?.imageName || "",
    storeId: data?.storeId || "",
    productTagTypeID: data?.productTagTypeID || "",
    recStatus: data?.recStatus || RecStatusValuebyName.Active,
    rowVersion: data?.rowVersion || "",
  };

  useEffect(() => {
    getStoreDropdownData();
    getProductTypeIdDropdownData()
  }, [getStoreDropdownData, getProductTypeIdDropdownData]);

  const validationSchema = Yup.object({
    name: Yup.string().required(ValidationMsgs.productTagMaster.nameRequired),
    imageName: Yup.string().required(
      ValidationMsgs.productTagMaster.imageRequired
    ),
    tagPositionId: Yup.string().required(
      ValidationMsgs.productTagMaster.tagPositionId
    ),
    storeId: Yup.string().required(ValidationMsgs.productTagMaster.storeId),
    productTagTypeID: Yup.string().required(ValidationMsgs.productTagMaster.productTagTypeID),
    recStatus: Yup.string().required(ValidationMsgs.common.recStatusRequired),
  });

  // const handleToggle = (field) => {
  //   setToggler((prevData) => ({
  //     ...prevData,
  //     [field]: !toggler[field],
  //   }));
  // };

  function createProductTag(fields, resetForm) {
    dispatch(setAddLoading(true))

    ProductTag.createProductTag({
      producttagModel: {
        name: fields.name,
        tagPositionId: fields.tagPositionId,
        imageName: fields.imageName,
        recStatus: fields.recStatus,
        storeId: fields.storeId,
        productTagTypeID: fields.productTagTypeID,
        rowVersion: fields.rowVersion,
        ...location,
      },
    }).then((response) => {
      if (response.data.success) {
        dispatch(
          setAlertMessage({
            type: "success",
            message: ValidationMsgs.productTagMaster.productTagMasterCreated,
          })
        );
        resetForm({});
        handleShowModal((prev) => !prev);
        getProductTag();
      } else {
        dispatch(
          setAlertMessage({ type: "danger", message: serverError(response) })
        );
        dispatch(setAddLoading(false))
      }
    }).catch((errors) => {
      dispatch(
        setAlertMessage({
          type: "danger",
          message: ValidationMsgs.productTagMaster.productTagMasterNotCreated,
        })
      );
      dispatch(setAddLoading(false))

    });
  }

  function updateProductTag(fields, resetForm) {
    dispatch(setAddLoading(true))

    ProductTag.updateProductTag({
      producttagModel: { ...fields, ...location },
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.productTagMaster.productTagMasterUpdated,
            })
          );
          handleShowModal((prev) => !prev);
          resetForm({});
          getProductTag();
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
            message: ValidationMsgs.productTagMaster.productTagMasterNotUpdated,
          })
        );
        dispatch(setAddLoading(false))
      });
  }

  useEffect(() => {
    if (idson) {
      dispatch(setAddLoading(true))

      ProductTag.getProductTagByID(idson)
        .then((res) => {
          var response = res.data;
          if (response.success) {
            setData({ ...response.data });
          }
          dispatch(setAddLoading(false))

        })
        .catch((err) => {
          dispatch(setAddLoading(false))

        });
    }
  }, [idson]);
  // function openModel(fields) {
  // }
  const onSubmit = (fields, { resetForm }) => {
    if (idson) {
      updateProductTag(fields, resetForm);
    } else {
      createProductTag(fields, resetForm);
    }
  };

  return (
    <>
      <title>{isAddMode === true ? "Add Product Tag" : "Product Tag"}</title>
      <div
        id="TagModal"
        className="overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-4 justify-center items-center h-modal md:h-full md:inset-0"
      >
        <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative px-4 w-full max-w-2xl h-full md:h-auto">
            <div className="relative bg-white rounded-lg shadow max-h-screen overflow-y-auto">
              <div className="flex justify-between items-start p-5 rounded-t border-b sticky top-0 left-0 bg-white">
                <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl">
                  {isAddMode === true ? "Add Product Tag" : "Edit Product Tag"}
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  data-modal-toggle="actionModal"
                  onClick={handleShowModal}
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
              <Formik
                enableReinitialize={true}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({ setFieldValue, errors, values }) => {
                  return (
                    <FormikForm>
                      <Messages />
                      <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <label
                              className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                              htmlFor="grid-first-name"
                            >
                              {"Name"}

                              <span className="text-rose-500 text-2xl leading-none">
                                *
                              </span>
                            </label>
                            <Input type={""} name="name"
                              maxLength={500}
                            />
                          </div>
                          <div>
                            <label
                              className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                              htmlFor="grid-first-name"
                            >
                              {"Store Name"}

                              <span className="text-rose-500 text-2xl leading-none">
                                *
                              </span>
                            </label>
                            <Dropdown
                              label="Store"
                              name={"storeId"}
                              options={stores}
                              isMulti={false}
                              defaultValue={values.storeId}
                              placeholder="Select Store"
                            />
                          </div>

                          <div>
                            <label
                              className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                              htmlFor="grid-first-name"
                            >
                              {"Tag Type"}
                              <span className="text-rose-500 text-2xl leading-none">
                                *
                              </span>
                            </label>
                            <Dropdown
                              label="Store"
                              name={"productTagTypeID"}
                              options={productTagTypeID}
                              isMulti={false}
                              defaultValue={values.productTagTypeID}
                              placeholder="Select Tag Master"
                            />
                          </div>

                          <div className="col-span-1 lg:col-span-2">
                            <div className="grid grid-cols-12 gap-6">
                              <div className="col-span-full lg:col-span-6">
                                <label
                                  className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                                  htmlFor="grid-first-name"
                                >
                                  {"Image"}

                                  <span className="text-rose-500 text-2xl leading-none">
                                    *
                                  </span>
                                </label>
                                <div className="grid grid-cols-12 gap-6 w-full">
                                  <ImageFile
                                    type="file"
                                    className="sr-only"
                                    name="imageName"
                                    id="imageName"
                                    buttonName="Add"
                                    onChange={(value) => {
                                      setFieldValue("imageName", value);
                                    }}
                                    folderpath={`${FolderPath}`}
                                    url={values.imageName}
                                  />
                                  <br />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="w-full mb-4 last:mb-0">
                            <label
                              className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                              htmlFor="grid-first-name"
                            >
                              {"Position"}

                              <span className="text-rose-500 text-2xl leading-none">
                                *
                              </span>
                            </label>
                            <Dropdown
                              label="tagPositionId"
                              name="tagPositionId"
                              isMulti={false}
                              options={position}
                              defaultValue={values.tagPositionId}
                            />
                          </div>
                          <div className="w-full flex mb-4">
                            <div className="w-full px-2 py-2">
                              <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                                Status
                                <span className="text-rose-500 text-2xl leading-none">
                                  *
                                </span>
                              </label>
                              <div className="col-span-full w-full sm:col-span-6 xl:col-span-8">
                                <div >
                                  <ToggleButton
                                    name="recStatus"
                                    id="recStatus"
                                    size="m"
                                    on="Active"
                                    off="Inactive"
                                    onChange={(e) =>
                                      setFieldValue(
                                        "recStatus",
                                        e.target.checked
                                          ? RecStatusValuebyName.Active
                                          : RecStatusValuebyName.Inactive
                                      )
                                    }
                                    defaultValue={
                                      values.recStatus ===
                                        RecStatusValuebyName.Active
                                        ? true
                                        : false
                                    }
                                  // onChange={handleToggle}
                                  // defaultValue={values.recStatus}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200">
                        <button
                          // data-modal-toggle="actionModal"
                          type="button"
                          className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
                          onClick={handleShowModal}
                        >
                          Cancel
                        </button>
                        {(permission?.isEdit || permission?.isDelete) && <button
                          // data-modal-toggle="actionModal"
                          disabled={GlobalLoading}
                          type="Submit"
                          className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(GlobalLoading) ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}
                        >
                          <div className={`w-full flex justify-center align-middle `}>
                            {GlobalLoading && (
                              <span className="spinner-border spinner-border-sm mr-2"></span>
                            )}
                            Save
                          </div>
                        </button>}
                      </div>
                    </FormikForm>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddTagModal;
