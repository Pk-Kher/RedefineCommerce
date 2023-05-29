/*Component Name: MainMenu
Component Functional Details: User can create or update MainMenu master details from here.
Created By: Happy
Created Date: <Creation Date>
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { FieldArray, Form as FormikForm, Formik } from "formik";
import Dropdown from "components/common/formComponent/Dropdown";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import CMSConfiguration from "services/admin/cmsConfiguration/CMSConfiguration";
import React, {
  useEffect,
  useRef,
  useState,
  Fragment,
  useCallback,
} from "react";
import TopicsDetailsServices from "services/admin/topics/TopicsDetailsServices";
import { menuConfigCategoryType } from "global/Enum";
import CategoryService from "services/admin/masterCatalog/store/categoryMaster/CategoryMasterService";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const MainMenu = ({
  activeTab,
  setFormSubmit,
  getMenuConfigData,
  menuConfig,
}) => {
  const formRef = useRef();
  const { storeId } = useParams();
  const [PageList, setPageList] = useState([]);
  const [CategoryList, setCategoryList] = useState([]);
  const dispatch = useDispatch();
  const [initialValues, setInitialValues] = useState([]);

  useEffect(() => {
    setInitialValues(menuConfig);
    getPageData();
  }, [menuConfig]);

  useEffect(() => {
    if (activeTab == 0) {
      setFormSubmit(formRef.current);
    }
  }, [formRef, setFormSubmit, activeTab]);

  useEffect(() => {
    CategoryService.getCategoryDropdownOptions(-1, storeId).then((response) => {
      setCategoryList(() => {
        return response.data.data;
      });
    });
  }, []);

  const HandleSubmit = (fields) => {
    updateConfiguration(fields);
  };
  const updateConfiguration = useCallback((fields) => {
    dispatch(setAddLoading(true))

    let menuConfigObj = {
      store_Id: storeId,
      main_Menu: true,
      data: [...fields.MenuModel],
    };
    CMSConfiguration.updateMenuConfigData(menuConfigObj)
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              view: true,
              type: "success",
              message: "Menu Updated successfully",
            })
          );
          getMenuConfigData();
          dispatch(setAddLoading(false))
        } else {
          dispatch(setAddLoading(false))
        }
      })
      .catch(() => {
        dispatch(setAddLoading(false))
      });
  }, []);

  const getPageData = useCallback(() => {
    TopicsDetailsServices.getPublishTopics(storeId)
      .then((response) => {
        let options = [];
        const res = response.data.data;
        if (res && res.length > 0) {
          res.map((data, index) => {
            options = [...options, { label: data.label, value: data.value }];
          });
        }
        setPageList(options);
      })
      .catch();
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ MenuModel: initialValues }}
        onSubmit={HandleSubmit}
        innerRef={formRef}
        validateOnChange={true}
        validateOnBlur={false}
      >
        {({ values, setFieldValue }) => {
          return (
            <FormikForm>
              <div className="p-6 sm:px-6 lg:px-8 w-full">
                <div className="overflow-x-auto max-h-screen">
                  <>
                    <ul className="flex-wrap items-center whitespace-nowrap">
                      <FieldArray
                        name={`MenuModel`}
                        render={(fieldArrayProps) => {
                          const { form } = fieldArrayProps;
                          return (
                            <Fragment>
                              {form?.values?.MenuModel &&
                                form.values.MenuModel.map((value, i) => {
                                  return (
                                    <>
                                      <div
                                        className="m-1.5 ml-0 flex items-center"
                                        Key={i}
                                      >
                                        <label className="w-1/3 ml-10">{`Menu ${i + 1
                                          }`}</label>
                                        <Dropdown
                                          name={`MenuModel[${i}].category`}
                                          options={menuConfigCategoryType}
                                          defaultValue={value.category}
                                          className="focus:ring-neutral-300 focus:shadow-lg py-1 w-2/3"
                                          onChange={(data) => {
                                            if (data) {
                                              setFieldValue(
                                                `MenuModel[${i}].category`,
                                                data.value
                                              );
                                            } else {
                                              setFieldValue(
                                                `MenuModel[${i}].category`,
                                                ""
                                              );
                                            }
                                          }}
                                        />

                                        <button
                                          type="button"
                                          onClick={fieldArrayProps.remove.bind(
                                            null,
                                            i
                                          )}
                                        >
                                          <span className="delete material-icons-outlined text-rose-500 ml-10">
                                            remove_circle
                                          </span>
                                        </button>
                                      </div>
                                      <div className="flex items-center">
                                        <label className="w-1/3"></label>
                                        {value.category === "topic" && (
                                          <Dropdown
                                            name={`MenuModel[${i}].topic_Id`}
                                            options={PageList}
                                            defaultValue={value.topic_Id}
                                            className="focus:ring-neutral-300 focus:shadow-lg py-1 w-1/3"
                                            onChange={(data) => {
                                              if (data) {
                                                setFieldValue(
                                                  `MenuModel[${i}].topic_Id`,
                                                  data.value
                                                );
                                              } else {
                                                setFieldValue(
                                                  `MenuModel[${i}].topic_Id`,
                                                  ""
                                                );
                                              }
                                            }}
                                          />
                                        )}
                                        {value.category === "category" && (
                                          <Dropdown
                                            name={`MenuModel[${i}].topic_Id`}
                                            options={CategoryList}
                                            defaultValue={value.topic_Id}
                                            className="focus:ring-neutral-300 focus:shadow-lg py-1 w-1/3"
                                            onChange={(data) => {
                                              if (data) {
                                                setFieldValue(
                                                  `MenuModel[${i}].topic_Id`,
                                                  data.value
                                                );
                                              } else {
                                                setFieldValue(
                                                  `MenuModel[${i}].topic_Id`,
                                                  ""
                                                );
                                              }
                                            }}
                                          />
                                        )}
                                      </div>
                                    </>
                                  );
                                })}
                              <div className="add-new">
                                <button
                                  type="button"
                                  className="btn border-indigo-300 hover:border-indigo-400 text-indigo-500 m-8"
                                  onClick={() => {
                                    fieldArrayProps.push({
                                      id: 0,
                                      topic_Id: 0,
                                      type: "",
                                      store_Id: storeId,
                                      menu_Info: "",
                                      category: "",
                                      se_Name: "",
                                      open_In_New_Tab: "",
                                      created_By: "",
                                      created_Date: "",
                                      modified_By: "",
                                      modified_Date: "",
                                    });
                                  }}
                                >
                                  Add New
                                </button>
                              </div>
                            </Fragment>
                          );
                        }}
                      />
                    </ul>
                  </>
                </div>
              </div>
            </FormikForm>
          );
        }}
      </Formik>
    </>
  );
};

export default MainMenu;
