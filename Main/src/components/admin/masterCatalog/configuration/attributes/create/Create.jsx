/*Component Name: Create
Component Functional Details: User can create or update Create master details from here.
Created By: Happy
Created Date: 30/5/22
Modified By: Divyesh
Modified Date: 21/07/22 */

import { Form as FormikForm, Formik } from "formik";
import React, { useEffect, useState, useCallback } from "react";
import * as Yup from "yup";
import Input from "components/common/formComponent/Input";
import Dropdown from "components/common/formComponent/Dropdown";
import { Link, useParams } from "react-router-dom";
import { RecStatusValue, RecStatusValuebyName } from "global/Enum";
import AttributesService from "services/admin/attributes/AttributesService";
import DropdownService from "services/common/dropdown/DropdownService";
import Messages from "components/common/alerts/messages/Index";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
// import { formatRFC7231 } from "date-fns/esm";
import { ValidationMsgs } from "global/ValidationMessages";
// import Attributes from "components/admin/masterCatalog/masterCatalog/create/forms/Attributes";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { serverError } from "services/common/helper/Helper";
import CreateFileHeader from "components/common/CreateFileHeader";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const Create = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isAddMode = !id;
  const [controlTypeOptions, setControlTypeOptions] = useState([]);
  const [SelectTypeOptions, setSelectTypeOptions] = useState([]);
  const [data, setData] = useState({});
  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);

  useEffect(() => {
    DropdownService.getDropdownValues("ControlType").then((res) => {
      if (res.data.success) {
        setControlTypeOptions(() => {
          return res.data.data;
        });
      }
    });
  }, []);

  useEffect(() => {
    DropdownService.getDropdownValues("ConfigurationMasterTemplate").then((res) => {
      if (res.data.success) {
        setSelectTypeOptions(() => {
          return res.data.data;
        });
      }
    });
  }, []);

  useEffect(() => {
    getAttributeDetails();
  }, [id]);

  const getAttributeDetails = useCallback(() => {
    dispatch(setAddLoading(true))

    AttributesService.getAttributesByID(id)
      .then((res) => {
        var response = res.data;
        if (response.success) {
          setData({
            id: response.data.id,
            name: response.data.name,
            controlTypeId: response.data.controlTypeId,
            textprompt: response.data.textPrompt,
            displayOrder: response.data.displayOrder,
            templateId: response.data.templateId,
            recStatus: response.data.recStatus,
            rowVersion: response.data.rowVersion,
          });
        }
        dispatch(setAddLoading(false))

      })
      .catch((err) => {
        dispatch(setAddLoading(false))
      });
  }, [id])

  const validationSchema = Yup.object({
    name: Yup.string().required(ValidationMsgs.attributes.nameRequired),
    controlTypeId: Yup.number()
      .typeError(ValidationMsgs.attributes.controlTypeIdTypeError)
      .required(ValidationMsgs.attributes.controlTypeIdRequired),
    textprompt: Yup.string().required(
      ValidationMsgs.attributes.textpromptRequired
    ),
    displayOrder: Yup.number()
      .typeError(ValidationMsgs.attributes.displayOrderTypeError)
      .required(ValidationMsgs.attributes.displayOrderRequired),
    recStatus: Yup.string().required(ValidationMsgs.common.recStatusRequired),
  });

  function onSubmit(fields, { resetForm }) {
    if (isAddMode) {
      createAttributes(fields, resetForm);
    } else {
      updateAttributes(fields, resetForm);
    }
  }

  function createAttributes(fields, resetForm) {
    dispatch(setAddLoading(true))
    AttributesService.createAttributes({
      attributesModel: { ...fields, templateId: ((fields.templateId && fields.templateId !== '') ? fields.templateId : 0), ...location },
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.attributes.attributeCreated,
            })
          );
          navigate(`/admin/MasterCatalog/Configuration/Attributes`);
          resetForm({});

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
            type: "danger",
            message: ValidationMsgs.attributes.attributeNotCreated,
          })
        );
        dispatch(setAddLoading(false))
      });
  }

  function updateAttributes(fields) {
    dispatch(setAddLoading(true))
    AttributesService.updateAttributes({
      attributesModel: { ...fields, templateId: ((fields.templateId && fields.templateId !== '') ? fields.templateId : 0), ...location },
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.attributes.attributeUpdated,
            })
          );
          getAttributeDetails();
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
            values: "0",
            type: "danger",
            message: ValidationMsgs.attributes.attributeNotUpdated,
          })
        );
        dispatch(setAddLoading(false))
      });
  }

  return (
    <>
      <title>{isAddMode === true ? "Add Attribute" : "Edit Attribute"}</title>
      <Formik
        enableReinitialize={true}
        initialValues={{
          id: data?.id || 0,
          name: data?.name || "",
          controlTypeId: data?.controlTypeId || "",
          textprompt: data?.textprompt || "",
          displayOrder: data?.displayOrder || "",
          templateId: data?.templateId || 0,
          recStatus: data?.recStatus || RecStatusValuebyName.Active,
          rowVersion: data?.rowVersion || null,
        }}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        validateOnMount={true}
      >
        {({ setFieldValue, errors, values, validateForm }) => {
          return (
            <FormikForm>
              <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">

                <CreateFileHeader url="/admin/MasterCatalog/Configuration/Attributes" module={`${isAddMode ? 'Create' : 'Edit'} Attribute`} errors={errors} validateForm={validateForm} />
                <Messages />
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-full xl:col-span-9">
                    <div className="w-full grid grid-cols-2 gap-6 bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                      <div className="w-full last:mb-0">
                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                          {"Attribute Name "}
                          <span className="text-rose-500 text-2xl leading-none">
                            *
                          </span>
                        </label>
                        <Input type={"text"} name="name" maxLength={200} />
                      </div>
                      <div className="w-full last:mb-0">
                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                          {"Control Type"}
                          <span className="text-rose-500 text-2xl leading-none">
                            *
                          </span>
                        </label>
                        <Dropdown
                          label="Control Type"
                          isMulti={false}
                          name="controlTypeId"
                          options={controlTypeOptions}
                          defaultValue={values.controlTypeId}
                        />
                      </div>

                      <div className="w-full last:mb-0">
                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                          Text Prompt
                          <span className="text-rose-500 text-2xl leading-none">
                            *
                          </span>
                        </label>
                        <Input type={"text"} name="textprompt" maxLength={200} />
                      </div>

                      <div className="w-full last:mb-0">
                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                          Display Order
                          <span className="text-rose-500 text-2xl leading-none">
                            *
                          </span>
                        </label>
                        <Input
                          type={"number"}
                          maxLength={4}
                          name="displayOrder"
                          onKeyPress={(event) => {
                            if (!/^\d*$/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                        />
                      </div>
                      <div className="w-full last:mb-0">
                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                          {" Select Template"}
                        </label>
                        <Dropdown
                          label="Select Template"
                          isMulti={false}
                          name="templateId"
                          options={SelectTypeOptions}
                          defaultValue={values.templateId}
                        />

                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col col-span-full xl:col-span-3">
                    <div className="w-full bg-white shadow-xxl rounded-md">
                      <div className="p-6">
                        <div className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2">
                          Attribute Status
                          <span className="text-rose-500 text-2xl leading-none">
                            *
                          </span>
                        </div>
                        <Dropdown
                          label="Attribute Status"
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
