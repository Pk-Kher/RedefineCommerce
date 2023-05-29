import { Form as FormikForm, Formik } from "formik";
import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import Input from "components/common/formComponent/Input";
import Dropdown from "components/common/formComponent/Dropdown";
import { RecStatusValue, RecStatusValuebyName } from "global/Enum";
import DimensionService from "services/admin/dimension/DimensionService";
import Messages from "components/common/alerts/messages/Index";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { ValidationMsgs } from "global/ValidationMessages";
import { useDispatch, useSelector } from "react-redux";
import { serverError } from "services/common/helper/Helper";
import CategoryService from "services/admin/category/CategoryService";
import CreateFileHeader from "components/common/CreateFileHeader";
import InputNumber from "components/common/formComponent/InputNumber";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const Create = () => {
  const { id } = useParams();
  const isAddMode = !id;
  const [categoryOptions, setcategoryOptions] = useState();
  const [data, setData] = useState({});
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);
  useEffect(() => {
    getDimensionData()
    CategoryService.getCategoryDropdownOptions(-1)
      .then((response) => {
        setcategoryOptions(() => {
          return response.data.data;
        });
      })
      .catch((err) => { });
  }, []);

  const getDimensionData = () => {
    dispatch(setAddLoading(true))

    DimensionService.getDimensionById(id)
      .then((res) => {
        var response = res.data;
        if (response.success) {
          setData({
            id: response.data.id,
            name: response.data.name,
            categoryId: response.data.categoryId,
            length: response.data.length,
            height: response.data.height,
            width: response.data.width,
            volume: response.data.volume,
            recStatus: response.data.recStatus,
            rowVersion: response.data.rowVersion,
          });
        }
        dispatch(setAddLoading(false))

      })

      .catch((err) => {
        dispatch(setAddLoading(false))

      });
  }
  const dimensionRegex = /^\d{0,3}(\.\d{1,2})?$/;

  const validationSchema = Yup.object({
    name: Yup.string().required(ValidationMsgs.dimension.nameRequired),
    categoryId: Yup.string().required(ValidationMsgs.common.categoryIdRequired),
    length: Yup.string()
      .matches(dimensionRegex, ValidationMsgs.dimension.lenghtMatches)
      .required(ValidationMsgs.dimension.lenghtRequired),
    width: Yup.string()
      .matches(dimensionRegex, ValidationMsgs.dimension.widthMatches)
      .required(ValidationMsgs.dimension.widthRequired),
    height: Yup.string()
      .matches(dimensionRegex, ValidationMsgs.dimension.heightMatches)
      .required(ValidationMsgs.dimension.heightRequired),
    recStatus: Yup.string().required(ValidationMsgs.common.recStatusRequired),
  });

  function onSubmit(fields, { resetForm }) {
    if (isAddMode) {
      createDimension(fields, resetForm);
    } else {
      updateDimension(fields, resetForm);
    }
  }

  function createDimension(fields, resetForm) {
    dispatch(setAddLoading(true))

    DimensionService.createDimension({
      dimensionModel: {
        name: fields.name,
        categoryId: fields.categoryId,
        description: fields.description,
        length: fields.length,
        height: fields.height,
        width: fields.width,
        volume:
          parseInt(fields.length) *
          parseInt(fields.height) *
          parseInt(fields.width),
        recStatus: fields.recStatus,
        rowVersion: fields.rowVersion,
        ...location,
      },
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              view: true,
              type: "success",
              message: ValidationMsgs.dimension.dimensionCreated,
            })
          );
          resetForm({});
          return navigate(
            "/admin/MasterCatalog/Configuration/dimension/"
          );
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
        }
        dispatch(setAddLoading(false))

      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            view: true,
            type: "danger",
            message: ValidationMsgs.dimension.dimensionNotCreated,
          })
        );
        dispatch(setAddLoading(false))

      });
  }

  function updateDimension(fields) {
    dispatch(setAddLoading(true))

    DimensionService.updateDimension({
      dimensionModel: {
        id: fields.id,
        name: fields.name,
        categoryId: fields.categoryId,
        description: fields.description,
        length: fields.length,
        height: fields.height,
        width: fields.width,
        volume:
          parseInt(fields.length) *
          parseInt(fields.height) *
          parseInt(fields.width),
        recStatus: fields.recStatus,
        rowVersion: fields.rowVersion, ...location
      },
    })
      .then((response) => {
        getDimensionData()
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              view: true,
              type: "success",
              message: ValidationMsgs.dimension.dimensionUpdated,
            })
          );
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
            view: true,
            type: "danger",
            message: ValidationMsgs.dimension.dimensionNotUpdated,
          })
        );
        dispatch(setAddLoading(false))

      });
    getDimensionData()
  }

  const initialValues = {
    id: data?.id || 0,
    name: data?.name || "",
    categoryId: data?.categoryId || "",
    length: data?.length || "",
    height: data?.height || "",
    width: data?.width || "",
    volume: data?.volume || "",
    recStatus: data?.recStatus || RecStatusValuebyName.Active,
    rowVersion: data?.rowVersion || null,
  };

  return (
    <>
      <title>{isAddMode ? "Add Dimension" : "Edit Dimension"}</title>

      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        validateOnChange={true}
        validateOnBlur={false}
        validateOnMount={true}
      >
        {({ setFieldValue, errors, values, validateForm }) => {
          return (
            <FormikForm>
              <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
                <CreateFileHeader url={"/admin/MasterCatalog/Configuration/dimension"} module={`${isAddMode ? 'Create' : 'Edit'} Dimension Master`} errors={errors} validateForm={validateForm} />
                <Messages />
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-full xl:col-span-9">
                    <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                      <div className="w-full mb-6 last:mb-0 relative">
                        <div className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                          {"Name"}
                          <span className="text-rose-500 text-2xl leading-none">
                            *
                          </span>
                        </div>
                        <div >
                          <Input type="text" name="name" maxLength={200} />
                        </div>
                      </div>
                      <div className="w-full mb-6 last:mb-0 relative">
                        <div className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                          {"Category"}
                          <span className="text-rose-500 text-2xl leading-none">
                            *
                          </span>
                        </div>
                        <div >
                          <Dropdown
                            label="Category"
                            isMulti={false}
                            name="categoryId"
                            options={categoryOptions}
                            defaultValue={values.categoryId}
                          />
                        </div>
                      </div>
                      <div className="w-full mb-6 last:mb-0 relative">
                        <div className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                          {"Dimension"}
                          <span className="text-rose-500 text-2xl leading-none">
                            *
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <div >
                            <InputNumber
                              displayError={true}
                              name="length"
                              defaultValue={values.length}
                              value={values.length}
                              placeholder="length"
                              className="appearance-none block w-full text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                              onChange={(e) => {
                                setFieldValue(e.target.name, e.target.value);
                              }}
                              maxLength={10}
                              allowNegative={false}
                            />
                          </div>
                          <div className="mt-3">X</div>
                          <div >
                            <InputNumber
                              displayError={true}
                              name="width"
                              defaultValue={values.width}
                              value={values.width}
                              placeholder="Width"
                              className="appearance-none block w-full text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                              onChange={(e) => {
                                setFieldValue(e.target.name, e.target.value);
                              }}
                              maxLength={10}
                              allowNegative={false}
                            />
                          </div>
                          <div className="mt-3">X</div>
                          <div >
                            <InputNumber
                              displayError={true}
                              name="height"
                              defaultValue={values.height}
                              value={values.height}
                              placeholder="Height"
                              className="appearance-none block w-full text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                              onChange={(e) => {
                                setFieldValue(e.target.name, e.target.value);
                              }}
                              maxLength={10}
                              allowNegative={false}
                            />
                          </div>
                          <div className="mt-3">=</div>
                          <div >
                            <Input
                              placeholder={"Volume"}
                              type="text"
                              name={`volume`}
                              value={
                                !(
                                  values.length &&
                                  values.height &&
                                  values.width
                                )
                                  ? 0
                                  : parseInt(values.length) *
                                  parseInt(values.height) *
                                  parseInt(values.width)
                              }
                              disabled={true}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col col-span-full xl:col-span-3">
                    <div className="w-full bg-white shadow-xxl rounded-md mb-6 p-6">
                      <div >
                        <div className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2">
                          {"Dimension Status"}
                          <span className="text-rose-500 text-2xl leading-none">
                            *
                          </span>
                        </div>
                        <Dropdown
                          label="Dimension Status"
                          isMulti={false}
                          name="recStatus"
                          options={RecStatusValue}
                          defaultValue={values.recStatus}
                        />
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

export default Create;
