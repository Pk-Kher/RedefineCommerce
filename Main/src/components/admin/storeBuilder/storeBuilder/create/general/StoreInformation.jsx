import React, { useState, useEffect } from "react";
import { Formik, useFormikContext, Form as FormikForm } from "formik";
import Input from "components/common/formComponent/Input";
import Dropdown from "components/common/formComponent/Dropdown";
import DatePicker from "components/common/formComponent/DatePicker";
import { blobFolder, RecStatusValuebyName } from "global/Enum";
import ImageFile from "components/common/formComponent/FileUploadDnD";
import { useSelector } from "react-redux";
import { storeBuildernavlocationcodeOptions } from "dummy/Dummy";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import StoreBuilderService from "services/admin/storeBuilder/StoreBuilderService";
const StoreInformation = ({
  organizationOption,
  sportOption,
  salesPersonOption,
  getOrganizationOptions,
  getSportsOptions,
}) => {
  const CompanyId = useSelector((store) => store?.CompanyConfiguration.id);

  const { setFieldValue, values } = useFormikContext();
  const FolderPath = `/${blobFolder.temp}/${CompanyId}/${blobFolder.store}`;
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [openBusinessModal, setOpenBusinessModal] = useState(false);

  const handleShowBusinessModal = () => {
    setOpenBusinessModal((prev) => !prev);
  };

  const handleShowCategoryModal = () => {
    setOpenCategoryModal((prev) => !prev);
  };

  return (
    <>
      <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 mb-6 p-6">
        <div className="block uppercase tracking-wide text-gray-500 text-lg font-bold mb-6">
          Store Information
        </div>
        <div>
          <div className="grid grid-cols-12 gap-6">
            {/* Bussness Dropdown */}
            <div className="col-span-12 flex flex-wrap sm:auto-cols-max justify-between gap-2 other-show">
              <label className="w-full block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                Business Name
                <span className="text-rose-500 text-xl leading-none">*</span>
              </label>
              <div className="relative grow">
                <Dropdown
                  label={""}
                  name={"organizationId"}
                  options={organizationOption}
                  defaultValue={values?.organizationId}
                  isSearchable={false}
                />
              </div>
              <button
                type="button"
                onClick={handleShowBusinessModal}
                className="flex flex-wrap items-center text-sm px-3 py-2 bg-white border border-neutral-200 text-gray-500 hover:text-gray-700 rounded-md shadow-sm"
              >
                <span className="ml-1">Add Business</span>
              </button>
            </div>

            {/* Category/Sports Dropdown */}
            <div className="col-span-12 flex flex-wrap sm:auto-cols-max justify-between gap-2 other-show">
              <label className="w-full block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                Category
                <span className="text-rose-500 text-xl leading-none">*</span>
              </label>
              <div className="relative grow">
                <Dropdown
                  label={""}
                  name={"sportId"}
                  options={sportOption}
                  defaultValue={values?.sportId}
                  isSearchable={false}
                />
              </div>
              <button
                type="button"
                onClick={handleShowCategoryModal}
                className="flex flex-wrap items-center text-sm px-3 py-2 bg-white border border-neutral-200 text-gray-500 hover:text-gray-700 rounded-md shadow-sm"
              >
                <span className="ml-1">Add Category</span>
              </button>
            </div>

            <div className="col-span-12 lg:col-span-6">
              <label className="w-full block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                Store Name
                <span className="text-rose-500 text-xl leading-none">*</span>
              </label>
              <Input name={"name"} />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <label className="w-full block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                Store Code
                <span className="text-rose-500 text-xl leading-none">*</span>
              </label>
              <Input name={"code"} />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <label className="w-full block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                sales person
                <span className="text-rose-500 text-xl leading-none">*</span>
              </label>
              <Dropdown
                label={""}
                name={"salesPersonId"}
                options={salesPersonOption}
                defaultValue={values?.salesPersonId}
                isSearchable={false}
              />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <label className="w-full block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                sale code
                <span className="text-rose-500 text-xl leading-none">*</span>
              </label>
              <Input name={"salesCode"} />
            </div>

            {/* Direct Access URL */}
            <div className="col-span-12 w-full flex flex-wrap sm:auto-cols-max justify-between gap-2">
              <label className="w-full block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                Direct access URL
                <span className="text-rose-500 text-xl leading-none">*</span>
              </label>
              <div className="relative grow">
                <Input name={"directAccessURL"} />
              </div>
              <div className="relative inline-flex">
                <button className="flex flex-wrap items-center text-sm px-3 py-2 text-gray-500 hover:text-gray-700">
                  <span>.</span> <span x-text="domain_ref">corporategear</span>
                  <span>.store</span>
                </button>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-6">
              <label className="w-full block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                NAV Customer ID
                <span className="text-rose-500 text-xl leading-none">*</span>
              </label>
              <Input name={"navCustomerId"} />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <label className="w-full block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                NAV Location Code
                <span className="text-rose-500 text-xl leading-none">*</span>
              </label>
              <Dropdown
                label={""}
                name={"navLocationCode"}
                options={storeBuildernavlocationcodeOptions}
                defaultValue={values?.navLocationCode}
                isSearchable={false}
              />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <label className="w-full block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                Estimate Ship date
                <span className="text-rose-500 text-xl leading-none">*</span>
              </label>
              <DatePicker
                name={"estimateShipDate"}
                defaultValue={values.estimateShipDate}
              />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <label className="w-full block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                Follow up date
                <span className="text-rose-500 text-xl leading-none">*</span>
              </label>
              <DatePicker
                name={"followUpdate"}
                defaultValue={values.followUpdate}
              />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <label className="w-full block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                Team name
                <span className="text-rose-500 text-xl leading-none">*</span>
              </label>
              <Input name={"teamName"} />
            </div>

            <div className="col-span-12 lg:col-span-6">
              <label className="w-full block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                Contact Email
                <span className="text-rose-500 text-xl leading-none">*</span>
              </label>
              <Input name={"email"} />
            </div>

            <div className="col-span-12">
              <label className="w-full block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                Store Logo
                <span className="text-rose-500 text-xl leading-none">*</span>
              </label>
              {/* <Input name={"logourl"} /> */}
              <ImageFile
                type="file"
                className="sr-only w-1/2 h-40"
                name="logourl"
                id="logourl"
                uprdivclass="w-1/2"
                buttonName="Add"
                onChange={(value) => {
                  setFieldValue("logourl", value);
                }}
                folderpath={FolderPath}
                url={values?.logourl}
              />
            </div>
          </div>
        </div>
      </div>

      {openBusinessModal && (
        <AddBusinessAndCategoryModal
          title={"Product Type Details"}
          buttonLabel={"Business:"}
          handleShowModal={handleShowBusinessModal}
          api={StoreBuilderService.createOrganization}
          dropdownAPI={getOrganizationOptions}
          modal={"Business"}
        />
      )}
      {openCategoryModal && (
        <AddBusinessAndCategoryModal
          title={"Category Type Details"}
          buttonLabel={"Category:"}
          handleShowModal={handleShowCategoryModal}
          api={StoreBuilderService.createSports}
          dropdownAPI={getSportsOptions}
          modal={"Category"}
        />
      )}
    </>
  );
};

export default StoreInformation;

const AddBusinessAndCategoryModal = ({
  handleShowModal,
  title,
  buttonLabel,
  api,
  dropdownAPI,
  modal,
}) => {
  const location = useSelector((store) => store?.location);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const submitHandler = () => {
    if (modal === "Business") {
      if (!name == "") {
        dispatch(setAddLoading(true));
        api({
          businessModel: {
            name: name || "",
            storeId: id,
            ...location,
          },
        }).then((res) => {
          if (res.data.success) {
            handleShowModal((prev) => !prev);
            dropdownAPI();
          }
          dispatch(setAddLoading(false));
        });
      } else {
        dispatch(setAddLoading(false));
        if (name === "") {
          setError(
            <div className="text-rose-500">
              Please enter {modal === "Business" ? " Business" : " Category"}
            </div>
          );
        }
      }
    } else {
      if (!name == "") {
        dispatch(setAddLoading(true));
        api({
          sbCategoryModel: {
            name: name || "",
            storeId: id,
            ...location,
          },
        }).then((res) => {
          if (res.data.success) {
            handleShowModal((prev) => !prev);
            dropdownAPI();
          }
          dispatch(setAddLoading(false));
        });
      } else {
        dispatch(setAddLoading(false));
        if (name === "") {
          setError(
            <div className="text-rose-500">
              Please enter {modal === "Business" ? " Business" : " Category"}
            </div>
          );
        }
      }
    }
  };
  return (
    <>
      <div className="overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-4 justify-center items-center h-modal md:h-full md:inset-0 z-30">
        <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative px-4 w-full max-w-2xl h-full md:h-auto">
            <div className="relative flex px-5 py-3 bg-white rounded-t-md shadow max-h-screen overflow-y-auto">
              <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl">
                {title}
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-cente"
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
            <div className="p-6 bg-white rounded-b-md">
              <div className="w-full mb-4 last:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  {buttonLabel}
                  <span className="text-rose-500 text-2xl leading-none">*</span>
                </label>
                <input
                  className="w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md"
                  type={"text"}
                  onChange={(e) => {
                    if (!e.target.value) {
                      setError(
                        <div className="text-rose-500">
                          Please enter
                          {modal === "Business" ? " Business" : " Category"}
                        </div>
                      );
                    } else {
                      setError("");
                    }
                    setName(e.target.value);
                  }}
                  name="name"
                  maxLength={500}
                />
                {error}
              </div>
              <div className="flex items-center justify-end space-x-2 rounded-b">
                <button
                  // data-modal-toggle="actionModal"
                  type="button"
                  className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
                  onClick={handleShowModal}
                >
                  Close
                </button>
                <button
                  // disabled={GlobalLoading}
                  type="button"
                  onClick={submitHandler}
                  className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white`}
                >
                  <div className={`w-full flex justify-center align-middle `}>
                    {/* {GlobalLoading && (
                              <span className="spinner-border spinner-border-sm mr-2"></span>
                            )} */}
                    Add
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
