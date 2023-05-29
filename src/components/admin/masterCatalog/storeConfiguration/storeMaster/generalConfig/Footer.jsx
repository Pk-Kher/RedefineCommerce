/*Component Name: Footer
Component Functional Details: User can create or update Footer master details from here.
Created By: Happy
Created Date: <Creation Date>
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import CKEditor from "components/common/formComponent/CKEditor";
import { Form as FormikForm, Formik } from "formik";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import CMSConfiguration from "services/admin/cmsConfiguration/CMSConfiguration";

const Footer = ({ setFormSubmit }) => {
  const formRef = useRef();
  const { storeId } = useParams();
  const dispatch = useDispatch();
  const [initialValues, setinitialValues] = useState({ content: "" });
  const [id, setId] = useState(0);

  useEffect(() => {
    setFormSubmit(formRef.current);
  }, [formRef, setFormSubmit]);

  const getConfiguration = useCallback(() => {
    
    CMSConfiguration.getConfiguration(storeId, "footer").then((response) => {
      if (response.data.success) {
        setinitialValues({content: response.data.data.config_value });
        setId(response.data.data.id);
      }
    });
  }, []);
  useEffect(() => {
    getConfiguration();
  }, []);

  const HandleSubmit = (fields) => {
    updateConfiguration(fields);
  };

  const updateConfiguration = (fields) => {
    /*let menuConfigObj = {
      store_id: storeId,
      config_name: `footer`,
      config_value: fields.content,
      status: "Y",
    };
    CMSConfiguration.updateConfiguration(menuConfigObj).then((response) => {
      if (response.data.success) {
        getConfiguration();

        dispatch(
          setAlertMessage({
            view: true,
            type: "success",
            message: response.data.message,
          })
        );
      }
    });*/
        CMSConfiguration.getConfiguration(storeId, "footer").then((response) => {
          console.log(response);
          if (response.data.success) {
              let menuConfigObj = {
                id: response.data?.data?.id ?? 0,
                store_id: storeId,
                config_name: `footer`,
                config_value: fields.content,
                status: "Y",
              };
              console.log(menuConfigObj);
              CMSConfiguration.updateConfiguration(menuConfigObj)
                  .then((res) => {
                      if (res.data.success) {
                          dispatch(
                              setAlertMessage({
                                  view: true,
                                  type: "success",
                                  message: "Configuration updated successfully",
                              })
                          );
                      }
                      getConfiguration()
                  })
                  .catch(() => { });
        }
      });
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={HandleSubmit}
        innerRef={formRef}
        validateOnChange={true}
        validateOnBlur={false}
      >
        {({ values, setFieldValue }) => {
          return (
            <FormikForm>
              <div className="w-full mb-6 p-6 last:mb-0">
                <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                  Content
                </label>
                <CKEditor
                  type="simple"
                  name={`content`}
                  id={`content`}
                  defaultValue={values.content}
                  onChange={(value) => {
                    setFieldValue(`content`, value);
                  }}
                  loading={initialValues.content}
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
                />
              </div>
            </FormikForm>
          );
        }}
      </Formik>
    </>
  );
};

export default Footer;
