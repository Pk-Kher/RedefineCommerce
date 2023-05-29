import React, { useState, useEffect, useCallback } from "react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import DropDownComponent from "components/common/formComponent/Dropdown";
import { useNavigate, useParams } from "react-router-dom";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import Input from "components/common/formComponent/Input";
import SizeMasterService from "services/admin/sizeMaster/SizeMasterService";
import SizeDetailsService from "services/admin/sizeDetails/SizeDetailsService";
import Messages from "components/common/alerts/messages/Index";
import { ErrorMessage } from "formik";
import FormErrorMessage from "components/common/alerts/FormErrorMessage";
import AddSizeModel from "./AddSizeModel";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import { RecStatusValue, RecStatusValuebyName } from "global/Enum";
import { ValidationMsgs } from "global/ValidationMessages";
import { useDispatch, useSelector } from "react-redux";
import Status from "components/common/displayStatus/Status";
import { serverError } from "services/common/helper/Helper";
import CreateFileHeader from "components/common/CreateFileHeader";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const Create = () => {
  const permission = useSelector(store => store.permission);
  let navigate = useNavigate();
  const { id } = useParams();
  const isAddMode = !id;
  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);
  const [data, setData] = useState({});

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [Product, setProduct] = useState([]);
  const [ProductSizeData, setProductSizeData] = useState([]);
  const [openAddSizeModal, setopenAddSizeModal] = useState({
    show: false,
    data: null,
  });
  const [isDesabledAddProductSize, setisDesabledAddProductSize] = useState("");
  const [refresh, setrefresh] = useState("");

  const HandleCancel = () => {
    navigate("/admin/MasterCatalog/Configuration/sizeMaster");
  };

  const initialValues = {
    id: data.id || 0,
    productType: data?.productType || "",
    displayOrder: data?.displayOrder || "",
    recStatus: data?.recStatus || RecStatusValuebyName.Active,
    rowVersion: data?.rowVersion || null,
  };

  const validationSchema = Yup.object({
    productType: Yup.string().required(
      ValidationMsgs.sizeMaster.productTypeRequired
    ),
    displayOrder: Yup.number()
      .typeError(ValidationMsgs.sizeMaster.displayOrderTypeError)
      .required(ValidationMsgs.sizeMaster.displayOrderRequired),
    recStatus: Yup.string().required(ValidationMsgs.common.recStatusRequired),
  });

  const createSizeMaster = (fields, resetForm) => {
    dispatch(setAddLoading(true))

    SizeMasterService.createSizeMaster({ ...fields, ...location })
      .then((response) => {
        if (response.data.success) {
          setisDesabledAddProductSize(response.data.data.id);
          navigate(
            `/admin/MasterCatalog/Configuration/sizeMaster/edit/${response.data.data.id}`
          );
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.sizeMaster.sizeMasterCreated,
            })
          );

          resetForm({});
        } else {
          dispatch(setAlertMessage({ type: "danger", message: serverError(response) }));
        }
        dispatch(setAddLoading(false));
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.sizeMaster.sizeMasterNotCreated,
          })
        );
        dispatch(setAddLoading(false))
      });
  };

  const updateSizeMaster = (fields) => {
    dispatch(setAddLoading(true))

    fields.id = Number(id);
    SizeMasterService.updateSizeMaster({ ...fields, ...location })
      .then((response) => {
        if (response?.data?.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.sizeMaster.sizeMasterUpdated,
            })
          );
        } else {
          console.log(response.data.errors);
          dispatch(setAlertMessage({ type: "danger", message: serverError(response) }));
        }
        dispatch(setAddLoading(false));
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.sizeMaster.sizeMasterNotUpdated,
          })
        );
        dispatch(setAddLoading(false))

      });
  };

  const onSubmit = (fields, { resetForm }) => {
    if (isAddMode) {
      createSizeMaster(fields, resetForm);
    } else {
      updateSizeMaster(fields, resetForm);
    }
  };

  const handleDelete = (productSize) => {
    var ids = [];
    dispatch(setAddLoading(true))

    if (Array.isArray(productSize)) {
      ids = productSize.map((value) => {
        return { item1: value.id, item2: value.rowVersion };
      });
    } else {
      ids = [{ item1: productSize.id, item2: productSize.rowVersion }];
    }
    SizeDetailsService.updateMultipleStatus({
      idsRowVersion: ids,
      status: RecStatusValuebyName.Archived,
      ...location,
    })
      .then((response) => {
        if (response.data.data) {
          dispatch(
            setAlertMessage({
              view: true,
              type: "success",
              message: ValidationMsgs.sizeMaster.sizeMasterDeleted,
            })
          );
          setProductSizeDataBYId();
        } else {
          dispatch(
            setAlertMessage({
              view: true,
              type: "danger",
              message: ValidationMsgs.sizeMaster.sizeMasterNotDeleted,
            })
          );
          dispatch(setAddLoading(false))

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
            setAlertMessage({ message: ValidationMsgs.sizeMaster.sizeMasterNotDeleted, type: "danger" })
          );
        }
        dispatch(setAddLoading(false))

      });
    setOpenDeleteModal(false);
  };

  const handleShowModel = (data) => {
    setopenAddSizeModal((prevState) => ({
      ...prevState,
      show: !prevState.show,
      data: data?.id,
    }));
  };

  useEffect(() => {
    if (id) {
      setisDesabledAddProductSize(id);
      SizeMasterService.getSizeMasterByID(id)
        .then((res) => {
          var response = res.data;
          if (response.success) {
            setData({ ...response.data });
          }
        })
        .catch((err) => {
          console.log("error while fetching particular Size Detail", err);
        });
    }
  }, [id]);

  // this useEffect is for getting Product Size data based on id
  useEffect(() => {
    setProductSizeDataBYId();

  }, [id, refresh]);

  const setProductSizeDataBYId = useCallback(() => {
    if (id) {
      dispatch(setAddLoading(true))

      SizeDetailsService.getProductSizeById(id)
        .then((res) => {
          const response = res.data;
          if (response.success) {
            setProductSizeData(response.data);
          }
          dispatch(setAddLoading(false))

        })
        .catch((err) => {
          console.log("error while fetching particular Size", err);
          dispatch(setAddLoading(false))

        });
      setopenAddSizeModal((prevState) => ({
        ...prevState,
        show: false,
      }));
    }
  }, [id]);

  return (
    <>
      <title>
        {isAddMode === true ? "Add Size Master" : "Edit Size Master"}
      </title>

      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        validateOnMount={true}
      >
        {({ setFieldValue, errors, values, validateForm }) => {
          return (
            <main className="responsive">
              <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Page header */}
                <FormikForm>

                  <CreateFileHeader module={`${isAddMode ? 'Create' : 'Edit'} Size Master`} url="/admin/MasterCatalog/Configuration/sizeMaster" errors={errors} validateForm={validateForm} />
                  {!openAddSizeModal?.show && <Messages />}

                  <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-full xl:col-span-9">
                      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                        <div className="w-full last:mb-0">
                          <label
                            className="uppercase tracking-wide text-gray-500 text-xs font-bold mb-2 flex flex-wrap"
                            htmlFor="grid-first-name"
                          >
                            <span>
                              Product Type
                              <span className="text-rose-500 text-2xl leading-none">
                                *
                              </span>
                            </span>
                          </label>
                          <Input type="text" name={"productType"} />
                        </div>
                        <div className="w-full last:mb-0">
                          <div className="flex items-center">
                            <label className="uppercase tracking-wide text-gray-500 text-xs font-bold mb-2 flex flex-wrap">
                              <span>
                                Display Order
                                <span className="text-rose-500 text-2xl leading-none">
                                  *
                                </span>
                              </span>
                            </label>
                          </div>
                          <Input
                            type="text"
                            name="displayOrder"
                            maxLength={4}
                            onKeyPress={(event) => {
                              if (!/^\d*$/.test(event.key)) {
                                event.preventDefault();
                              }
                            }}
                          />
                        </div>
                      </div>

                      <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 mb-6">
                        <div className="w-full mb-6 last:mb-0">
                          <div className="flex items-center justify-between p-6">
                            <div className="flex align-center justify-left">
                              <div>
                                <label className="flex flex-wrap uppercase tracking-wide text-gray-500 text-x font-bold mb-2">
                                  Product Size
                                  <span className="text-rose-500 text-2xl leading-none">
                                    {" "}
                                    *{" "}
                                  </span>
                                </label>
                              </div>
                            </div>

                            {(permission?.isEdit || permission.isDelete) && <div>
                              <button
                                onClick={handleShowModel}
                                type="button"
                                title=""
                                data-modal-toggle="addsizeModal"
                                className="btn bg-indigo-500 hover:bg-indigo-600 text-white disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-gray-500"
                                disabled={!isDesabledAddProductSize}
                              >
                                <span className="material-icons-outlined">
                                  add_circle_outline
                                </span>
                                <span className="ml-1">Add Size</span>
                              </button>
                            </div>}
                          </div>

                          <div className="overflow-x-auto max-h-screen border-t border-neutral-200">
                            {isAddMode ? (
                              <div className="flex flex-wrap uppercase font-bold text-sm mt-2 mb-1 ml-8 text-rose-500">
                                <div rowSpan={5}>
                                  <span className="text-rose-500 text-2xl mr-2 ">
                                    *
                                  </span>
                                  Add Above Data First To Add Product Size Data
                                </div>
                              </div>
                            ) : <table className="table-auto w-full text-sm text-[#191919] font-semibold mb-3">
                              <thead className="text-sm font-bold uppercase text-[#b3b3b3] border-b border-neutral-200">
                                <tr>
                                  <th className="px-2 first:pl-5 py-4">
                                    <div className="font-semibold text-left w-10 flex items-center">
                                      <span>Sr.</span>
                                    </div>
                                  </th>
                                  <th className="px-2 first:pl-5 py-4">
                                    <div className="font-semibold text-left w-screen max-w-xs flex items-center">
                                      <span>Size Name</span>
                                    </div>
                                  </th>
                                  <th className="px-2 first:pl-5 py-3">
                                    <div className="font-semibold text-left w-screen max-w-xs flex items-center">
                                      <span>Display Order</span>
                                    </div>
                                  </th>
                                  <th className="px-2 first:pl-5 py-4">
                                    <span>Status</span>
                                  </th>
                                  <th className="px-2 first:pl-5 py-4">
                                    <span>Action</span>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {ProductSizeData.length >= 1 ? ProductSizeData.map((data, index) => {
                                  return (
                                    <tr key={index}>
                                      <td className="px-2 first:pl-5 py-3">
                                        <div >{index + 1}</div>
                                      </td>
                                      <td className="px-2 first:pl-5 py-3">
                                        <div >{data.size}</div>
                                      </td>
                                      <td className="px-2 first:pl-5 py-3">
                                        <div >
                                          {data.displayOrder}
                                        </div>
                                      </td>
                                      <td className="px-2 first:pl-5 py-3">
                                        <div >
                                          <Status type={data.recStatus} />
                                        </div>
                                      </td>
                                      <td className="px-2 first:pl-5 py-3 ">
                                        {(permission?.isEdit || permission?.isDelete) && <div className="flex text-center">
                                          <button
                                            className="text-indigo-500 material-icons-outlined "
                                            data-modal-toggle="editsizeModal"
                                            type="button"
                                            onClick={() => {
                                              handleShowModel(data);
                                            }}
                                          >
                                            <span className="material-icons-outlined">
                                              edit
                                            </span>
                                          </button>

                                          {permission.isDelete && <button
                                            type="button"
                                            className="text-rose-500 text-2xl font-semibold material-icons-outlined"
                                            onClick={() => {
                                              setProduct(data);
                                              setOpenDeleteModal(true);
                                            }}
                                          >
                                            <span className="material-icons-outlined">
                                              close
                                            </span>
                                          </button>}
                                        </div>}
                                      </td>
                                    </tr>
                                  );
                                }) :
                                  <tr className="text-rose-500 text-center">
                                    <td colSpan={6} className={`text-center`}>
                                      <span className="text-rose-500 text-2xl mr-2 ">
                                        *
                                      </span>
                                      No Data yet , please add some !
                                    </td>
                                  </tr>
                                }
                              </tbody>
                            </table>}

                            <ErrorMessage
                              name={"catalogChanges"}
                              component={FormErrorMessage}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col col-span-full xl:col-span-3">
                      <div className="w-full bg-white shadow-xxl rounded-md">
                        <div className="border-b-2 border-neutral-200 p-6">
                          <div className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2">
                            Size Master Status
                          </div>

                          <DropDownComponent
                            label="Size Master Status"
                            options={RecStatusValue}
                            isMulti={false}
                            name={"recStatus"}
                            className="bg-white border hover:border-neutral-300"
                            defaultValue={values.recStatus}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </FormikForm>
              </div>
            </main>
          );
        }}
      </Formik >

      <ConfirmDelete
        handleDelete={handleDelete}
        data={Product}
        message="Deleting these Size will permanently remove this record from your account. This can't be undone"
        title={"Delete"}
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
      />

      {
        openAddSizeModal.show && (
          <AddSizeModel
            handleShowModel={handleShowModel}
            sizeId={openAddSizeModal?.data}
            sizeMasterID={isDesabledAddProductSize}
            setrefresh={setrefresh}
            setProductSizeDataBYId={setProductSizeDataBYId}
          />
        )
      }
    </>
  );
};

export default Create;
