import React, { useCallback, useState, useEffect } from "react";
import { Formik, Form as FormikForm } from "formik";
import Input from "components/common/formComponent/Input";
import Checkbox from "components/common/formComponent/Checkbox";
import { useParams } from "react-router-dom";
import StoreBuilderService from "services/admin/storeBuilder/StoreBuilderService";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { RecStatusValuebyName } from "global/Enum";

const CustomFieldForm = () => {
  const dispatch = useDispatch();

  const { id } = useParams();
  const [customFieldList, setcustomFieldList] = useState([]);
  const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);
  const location = useSelector((store) => store?.location);

  const submitHandler = (fields, { resetForm }) => {
    createCustomField(fields, resetForm);
  };

  const getCustomFieldList = useCallback(() => {
    if (id) {
      dispatch(setAddLoading(true))
      StoreBuilderService.getStoreCustomFieldById(id)
        .then((res) => {
          setcustomFieldList(res.data.data);
          dispatch(setAddLoading(false))
        })
        .catch(() => {
          dispatch(setAddLoading(false))
        });
    }
  }, []);

  const createCustomField = (fields, resetForm) => {
    dispatch(setAddLoading(true))
    StoreBuilderService.createStoreCustomField({ customeFieldModel: { ...fields, ...location } })
      .then((res) => {
        if (res.data.success) {
          getCustomFieldList();
        }
        dispatch(setAddLoading(false))
        resetForm();
      })
      .catch(() => {
        dispatch(setAddLoading(false))
      });
  };

  const deleteCustomField = useCallback((customFieldId) => {
    StoreBuilderService.deleteStoreCustomField({ id: customFieldId })
      .then((res) => {
          getCustomFieldList();
      })
      .catch(() => {
      });
  }, []);

  useEffect(() => {
    getCustomFieldList();
  }, []);

  const schema = Yup.object().shape({
    name: Yup.string().required("Custom name is required."),
  });
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        name: "",
        isRequired: false,
        storeId: id || 0,
        type: "string",
        rowVersion: "",
        recStatus: RecStatusValuebyName.Active
      }}
      onSubmit={submitHandler}
      validationSchema={schema}
    >
      {({ values, setFieldValue }) => {
        return (
          <>
            <FormikForm>
              <div className="col-span-12 lg:col-span-6">
                <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 mb-6 p-6">
                  <div className="flex justify-between items-center">
                    <div className="block uppercase tracking-wide text-gray-500 text-lg font-bold mb-6">
                      manage custom fields
                    </div>
                    <div >
                      <button
                        className="btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white"
                        type="submit"
                      >
                        {GlobalLoading && (
                          <span className="spinner-border spinner-border-sm mr-2"></span>
                        )}
                        Save
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="grid grid-cols-12 gap-6">
                      <div className="col-span-12">
                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                          Field Name{" "}
                          <span className="text-rose-500 text-xl leading-none">
                            *
                          </span>
                        </label>
                        <Input name={"name"} />
                      </div>
                      <div className="col-span-12">
                        <label className="text-gray-500 inline-flex items-center">
                          <Checkbox
                            name="isRequired"
                            label="is required"
                            id="isRequired"
                            checked={values?.isRequired}
                            onChange={(e) => {
                              setFieldValue("isRequired", e.target.checked);
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto max-h-screen border-t border-neutral-200 mt-5">
                    <table className="table-auto w-full text-sm text-[#191919] font-semibold overflow-scroll">
                      <thead className="text-sm font-bold uppercase text-[#b3b3b3] border-b border-neutral-200">
                        <tr>
                          <th className="px-2 first:pl-5 py-4">
                            <div className="font-semibold text-left w-44 max-w-sm flex items-center">
                              <span>Name</span>
                            </div>
                          </th>
                          <th className="px-2 first:pl-5 py-4">
                            <div className="font-semibold text-left w-44 max-w-sm flex items-center">
                              <span>is Required</span>
                            </div>
                          </th>
                          <th className="px-2 first:pl-5 py-4">
                            <div className="font-semibold text-left w-44 max-w-sm flex items-center">
                              <span>Action</span>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {customFieldList && customFieldList.length ? (
                          customFieldList.map((val, index) => {
                            return (
                              <tr key={index}>
                                <td className="px-2 first:pl-5 py-4">
                                  <div>{val.name}</div>
                                </td>
                                <td className="px-2 first:pl-5 py-4">
                                  <div>{val.isRequired ? "Y" : "N"}</div>
                                </td>
                                <td className="px-2 first:pl-5 py-4">
                                  <button
                                    type="button"
                                    className="inline-block w-6 h-6 text-rose-500 cursor-pointer"
                                    onClick={() => deleteCustomField(val.id)}
                                  >
                                    <span className="material-icons-outlined">
                                      delete
                                    </span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td
                              className="py-4 text-rose-500 text-center"
                              colSpan={3}
                            >
                              <p>No Record Found.</p>
                            </td>
                          </tr>
                        )}
                        { }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </FormikForm>
            {/* <ConfirmDelete
              handleDelete={handleDelete}
              data={topic}
              message="Deleting this Page will permanently remove this record from your account. This can't be undone"
              title={"Delete"}
              openDeleteModal={openDeleteModal}
              setOpenDeleteModal={setOpenDeleteModal}
            /> */}
          </>
        );
      }}
    </Formik>
  );
};

export default CustomFieldForm;
