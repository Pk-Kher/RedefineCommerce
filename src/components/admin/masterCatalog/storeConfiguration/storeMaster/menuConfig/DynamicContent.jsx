/*Component Name: DynamicContent
Component Functional Details: User can create or update DynamicContent master details from here.
Created By: Happy
Created Date: <Creation Date>
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { Form as FormikForm, Formik } from "formik";
import CKEditor from "components/common/formComponent/CKEditor";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import CMSConfiguration from "services/admin/cmsConfiguration/CMSConfiguration";
import { MenuType } from "global/Enum";
import Dropdown from "components/common/formComponent/Dropdown";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const DynamicContent = ({
  tab,
  activeTab,
  setFormSubmit,
  index,
  menuConfig,
}) => {
  const formRef = useRef();
  const { storeId } = useParams();
  const dispatch = useDispatch();
  const [menu, setMenu] = useState([]);
  useEffect(() => {
    if (activeTab == index) {
      setFormSubmit(formRef.current);
    }
  }, [formRef, setFormSubmit, activeTab]);

  useEffect(() => {
    setMenu(tab);
  }, [menuConfig]);

  const HandleSubmit = (fields) => {
    updateConfiguration(fields);
  };

  const updateConfiguration = (fields) => {
    dispatch(setAddLoading(true))

    let menuConfigObj = {
      store_Id: storeId,
      data: [fields],
    };

    CMSConfiguration.updateMenuConfigData(menuConfigObj)
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              view: true,
              type: "success",
              message: "Menu updated successfully",
            })
          );
          dispatch(setAddLoading(false))

        }
      })
      .catch(() => {
        dispatch(setAddLoading(false))

      });
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={menu}
        onSubmit={HandleSubmit}
        innerRef={formRef}
        validateOnChange={true}
        validateOnBlur={false}
      >
        {({ values, setFieldValue }) => {
          return (
            <FormikForm>
              <div className="m-1.5 ml-0 flex items-center">
                <label className="w-48 mr-10 p-6">{`Menu Type`}</label>
                <Dropdown
                  name={`type`}
                  options={MenuType}
                  defaultValue={values?.type}
                  className="focus:ring-neutral-300 focus:shadow-lg w-96 py-1"
                  onChange={(data) => {
                    if (data) {
                      setFieldValue(`type`, data.value);
                    } else {
                      setFieldValue(`type`, "");
                    }
                  }}
                />
              </div>
              {values.type == "custom" && (
                <div className="w-full mb-6 p-6 last:mb-0">
                  <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                    Content
                  </label>
                  <CKEditor
                    type="simple"
                    name={`menu_Info`}
                    id={`menu_Info`}
                    defaultValue={values?.menu_Info}
                    onChange={(value) => {
                      setFieldValue(`menu_Info`, value);
                    }}
                    config={{
                      toolbar: [
                          ['Source'],
                          ['Styles'],
                          ['Bold', 'Italic', 'Underline'],
                          ['NumberedList','BulletedList'],
                          ['List', 'Indent', 'Blocks', 'Align']
                      ],
                      extraPlugins: [/* 'wordcount'  */],
                      removePlugins: ['image'],
                      extraAllowedContent: 'div(*)',
                      allowedContent: true
                  }}
                    loading={menu.menu_Info}
                  />
                </div>
              )}
            </FormikForm>
          );
        }}
      </Formik>
    </>
  );
};

export default DynamicContent;
