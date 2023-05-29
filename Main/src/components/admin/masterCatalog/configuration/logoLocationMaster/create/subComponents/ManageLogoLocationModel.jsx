
import React, { useEffect, useState } from "react";
import { Formik, Form as FormikForm } from "formik";
import BrandsList from "./BrandsList";
import LogoLocationServices from "services/admin/logolocation/LogoLocationService";
import { useDispatch, useSelector } from "react-redux";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const ManageLogoLocation = ({ setHandleLogoLocationModal, logoLocationDetailsId, CreateAndUpdateLogoLocationBrandField, setOldBrands }) => {
  const permission = useSelector(store => store.permission);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

  useEffect(() => {
    if (logoLocationDetailsId) {
      dispatch(setAddLoading(true))

      LogoLocationServices.getLogoLocationDetailsByID(logoLocationDetailsId)
        .then((res) => {
          var response = res.data;
          if (response.success) {
            setData({ ...response.data });
            setOldBrands(response.data.brands);
          }
          dispatch(setAddLoading(false))
        })
        .catch((err) => {
          console.log("error while fetching particular vendor", err);
          dispatch(setAddLoading(false))
        });
    }
  }, [logoLocationDetailsId]);


  const initialValues = {
    brandId: data?.brands || [],
  };

  const onSubmit = (fields, { resetForm }) => {
    CreateAndUpdateLogoLocationBrandField(fields, resetForm)
    setHandleLogoLocationModal(false)
  }

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        // validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue, errors, values }) => {
          return (
            <FormikForm>
              <div
                id="ManageLocationModal"
                className=" overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center h-modal max-h-screen"
              >
                <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="relative w-full max-w-2xl">
                    <div className="relative bg-white rounded-lg shadow">
                      <div className="flex justify-between items-start p-5 rounded-t border-b">
                        <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl">
                          Manage Logo Location
                        </h3>
                        <button
                          type="button"
                          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                          data-modal-toggle="managestoreModal"
                          onClick={() => setHandleLogoLocationModal(false)}
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

                      <BrandsList logoLocationDetailsId={logoLocationDetailsId} />
                      {(permission?.isEdit || permission?.isDelete) && <>
                        <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200 ">
                          <button
                            data-modal-toggle="ManageLocationModal"
                            type="button"
                            className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
                            onClick={() => setHandleLogoLocationModal(false)}
                          >
                            Cancel
                          </button>
                          <button
                            data-modal-toggle="ManageLocationModal"
                            disabled={GlobalLoading}
                            type="submit"
                            className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(GlobalLoading) ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}
                          >
                            <div className={`w-full flex justify-center align-middle `}>
                              {GlobalLoading && (
                                <span className="spinner-border spinner-border-sm mr-2"></span>
                              )}
                              Save
                            </div>
                          </button>
                        </div>
                      </>}
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

export default ManageLogoLocation;
