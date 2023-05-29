import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import GiftCardService from "services/admin/masterCatalog/store/giftCard/GiftCardService";
import ToggleButton from "components/common/formComponent/Toggle";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import Input from "components/common/formComponent/Input";
import ImageFile from "components/common/formComponent/ImageFile";
import DatePicker from "components/common/formComponent/DatePicker";
import { blobFolder, RecStatusValuebyName } from "global/Enum";
import { ValidationMsgs } from "global/ValidationMessages";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { serverError } from "services/common/helper/Helper";
import Messages from "components/common/alerts/messages/Index";
const AddGiftCardModal = ({ handleShowModal, getGiftCardData, idson }) => {
  const [data, setData] = useState([]);
  const location = useSelector((store) => store?.location);
  const CompanyId = useSelector((store) => store?.CompanyConfiguration.id);
  const isAddMode = idson ? false : true;
  const dispatch = useDispatch();
  const { storeID } = useParams();
  const FolderPath = `/${blobFolder.temp}/${CompanyId}/${blobFolder.giftCard}`;

  const GlobalLoading = useSelector(
    (store) => store?.GlobalLoaderReducer?.toLoad
  );

  const initialValues = {
    id: data?.id || 0,
    storeId: storeID || 0,
    name: data?.name || "",
    imageName: data?.imageName || "",
    ourSKU: data?.ourSKU || "",
    description: data?.description || "",
    shortDescription: data?.shortDescription || "",
    price: data?.price || data?.salePrice || "",
    rowVersion: data?.rowVersion || "",
    location: data?.location || "",
    recStatus: data?.recStatus || RecStatusValuebyName.Active,
    ipAddress: location?.ipAddress || "",
    macAddress: location?.macAddress || "",
    giftCardEnddate: data?.giftCardEnddate || "",
  };

  function createGiftCard(fields, resetForm) {
    dispatch(setAddLoading(true));
    GiftCardService.createGiftCard({
      giftCardProductModel: {
        storeId: fields.storeId,
        name: fields.name,
        imageName: fields.imageName,
        ourSKU: fields.ourSKU,
        description: fields.description,
        shortDescription: fields.shortDescription,
        price: fields.price,
        rowVersion: fields.rowVersion,
        recStatus: fields.recStatus,
        ipAddress: fields.ipAddress,
        macAddress: fields.macAddress,
        giftCardEnddate: fields.giftCardEnddate,
      },
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.giftCard.giftCardCreated,
            })
          );
          resetForm({});
          handleShowModal((prev) => !prev);
          getGiftCardData();
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
          dispatch(setAddLoading(false));
        }
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.giftCard.giftCardNotCreated,
          })
        );
        dispatch(setAddLoading(false));
      });
  }

  function updateGiftCard(fields, resetForm) {
    dispatch(setAddLoading(true));

    GiftCardService.updateGiftCard({
      giftCardProductModel: { ...fields, ...location },
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.giftCard.giftCardUpdated,
            })
          );
          handleShowModal((prev) => !prev);
          resetForm({});
          getGiftCardData();
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
          dispatch(setAddLoading(false));
        }
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.giftCard.giftCardNotUpdated,
          })
        );
        dispatch(setAddLoading(false));
      });
  }

  useEffect(() => {
    if (idson) {
      dispatch(setAddLoading(true));
      GiftCardService.getGiftCardById(idson)
        .then((res) => {
          var response = res.data;
          if (response.success) {
            setData({ ...response.data });
          }
          dispatch(setAddLoading(false));
        })
        .catch((err) => {
          dispatch(setAddLoading(false));
        });
    }
  }, [idson]);

  const onsubmit = (fields, { resetForm }) => {
    if (idson) {
      updateGiftCard(fields, resetForm);
    } else {
      createGiftCard(fields, resetForm);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(ValidationMsgs.giftCard.nameRequired),
    imageName: Yup.string().required(ValidationMsgs.giftCard.imageRequired),
    price: Yup.number().required(ValidationMsgs.giftCard.priceRequired),
    ourSKU: Yup.string().required(ValidationMsgs.giftCard.ourSKURequired),
    giftCardEnddate: Yup.string().required(
      ValidationMsgs.giftCard.giftCardEnddate
    ),
  });

  return (
    <>
      <title>{isAddMode === true ? "Add Gift Card" : "Edit Gift Card"}</title>
      <div
        id="GiftModal"
        className="overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-4 justify-center items-center h-modal md:h-full md:inset-0"
      >
        <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative px-4 w-full max-w-2xl h-full md:h-auto">
            <div className="relative bg-white rounded-lg shadow  max-h-screen overflow-y-auto">
              <div className="flex justify-between items-start p-5 rounded-t border-b  sticky top-0 left-0 bg-white">
                <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl">
                  {isAddMode === true ? "Add Gift Card" : "Edit Gift Card"}
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
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
                onSubmit={onsubmit}
                validationSchema={validationSchema}
              >
                {({ setFieldValue, errors, values }) => {
                  return (
                    <FormikForm>
                      <Messages />
                      <div className="p-6">
                        <div className="w-full mb-4 last:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                            htmlFor="grid-first-name"
                          >
                            {"Name"}

                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </label>
                          <Input type={""} name="name" maxLength={500} />
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
                                  url={values.imageName}
                                  folderpath={`${FolderPath}`}
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
                            {"SKU"}

                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </label>
                          <Input type={""} name="ourSKU" maxLength={500} />
                        </div>
                        <div className="w-full mb-4 last:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                            htmlFor="grid-first-name"
                          >
                            {"End Date"}

                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </label>
                          <DatePicker
                            name={"giftCardEnddate"}
                            defaultValue={values?.giftCardEnddate}
                          />
                        </div>
                        <div className="w-full mb-4 last:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                            htmlFor="grid-first-name"
                          >
                            {"Price"}

                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </label>
                          <div className="relative grow">
                            <div className="absolute w-10 h-10 mt-0 left-0 top-0 flex items-center justify-center">
                              <span className="material-icons-outlined">
                                attach_money
                              </span>
                            </div>
                            <Input
                              className={
                                "block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md pl-10"
                              }
                              type={""}
                              name="price"
                              maxLength={500}
                              placeholder="00.00"
                            />
                          </div>
                        </div>
                        <div className="col-span-full w-full sm:col-span-6 xl:col-span-8">
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
                              values.recStatus === RecStatusValuebyName.Active
                                ? true
                                : false
                            }
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200 ">
                        <button
                          // data-modal-toggle="actionModal"
                          type="button"
                          className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
                          onClick={handleShowModal}
                        >
                          Cancel
                        </button>
                        <button
                          disabled={GlobalLoading}
                          type="Submit"
                          className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white`}
                        >
                          <div
                            className={`w-full flex justify-center align-middle `}
                          >
                            {GlobalLoading && (
                              <span className="spinner-border spinner-border-sm mr-2"></span>
                            )}
                            Save
                          </div>
                        </button>
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
export default AddGiftCardModal;
