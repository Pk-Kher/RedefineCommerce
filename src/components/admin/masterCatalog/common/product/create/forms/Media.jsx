/*Component Name: Media
Component Functional Details: User can create or update Media master details from here.
Created By: <Your Name>
Created Date: <Creation Date>
Modified By: chandan
Modified Date: 06/08/2022 */

import React, { useState } from "react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import File from "components/common/formComponent/File";
import { blobFolder } from "global/Enum";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { useDispatch, useSelector } from "react-redux";

const Media = ({ readOnly }) => {

  const dispatch = useDispatch();

  const [initialValue, setinitialValue] = useState([
    // "http://ystore.us/HTML/RedefineCommerce/Admin/images/stonewash.jpg",
    // "http://ystore.us/HTML/RedefineCommerce/Admin/images/stonewash2.jpg",
    // "http://ystore.us/HTML/RedefineCommerce/Admin/images/stonewash1.jpg",
    // "http://ystore.us/HTML/RedefineCommerce/Admin/images/stonewash3.jpg",
  ]);
  const CompanyId = useSelector((store) => store?.CompanyConfiguration.id)
  const FolderPath = `/${blobFolder}/${CompanyId}/${blobFolder}`
  const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

  function submitHandler(values, { resetForm }) {
    // if (isAddMode) {
    // createBrand(values, resetForm);
    // } else {
    //   updateBrand(values, resetForm);
    // }
  }

  const schema = Yup.object().shape({
    // mainImage: Yup.string().required("mainImage is required"),
  });

  const uploadCurrentFile = (value) => {
    dispatch(setAddLoading(true))

    let tempArray = [...initialValue];

    var index = tempArray.indexOf("");

    if (~index) {
      tempArray[index] = value;
    } else {
      tempArray.push(value);
    }
    setinitialValue(tempArray);
  };

  const handleDelete = (index) => {
    let tempArray = [...initialValue];
    tempArray[index] = "";
    setinitialValue(tempArray);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initialValue}
        onSubmit={submitHandler}
        validationSchema={schema}
      >
        {({ errors, setFieldValue, values }) => {
          return (
            <FormikForm>
              <div
                x-show="activeTab === 04"
                className="panel-04 tab-content p-6"
              >
                {/* MEDIA start */}
                <div className="grid grid-cols-12 gap-6 pt-6">

                  {/* this is our main (large) image */}

                  {initialValue.length > 0 && <div className={`col-span-full lg:col-span-6 border-2 border-neutral-200 rounded-md shadow relative ${values.length > 4 && "md:h-[788px]"} `}>
                    <img
                      src={values[0]}
                      alt=""
                      className="rounded-lg h-auto align-middle border-none"
                    />

                    <div className="absolute top-0 right-0 text-sm p-1 text-center items-center">
                      {(values[0] && !readOnly) && (
                        <span
                          className="inline-block w-6 h-6 text-rose-500 cursor-pointer"
                          onClick={() => handleDelete(0)}
                        >
                          <span className="material-icons-outlined">
                            delete
                          </span>
                        </span>
                      )}
                      <input
                        type="file"
                        className="sr-only"
                        id="color_logo"
                      />
                    </div>
                  </div>}

                  <div className="col-span-full lg:col-span-6">
                    <div className="grid grid-cols-12 gap-6">
                      {/* need a loop for the media array  */}

                      {values.map(
                        (url, index) =>
                          index !== 0 && (
                            // <div className="col-span-full lg:col-span-6 border-2 border-neutral-200 rounded-md shadow relative flex justify-center items-center " key={index}>
                            // <img
                            //   src={url}
                            //   alt=""
                            //   className="rounded-lg h-auto align-middle border-none"
                            // />
                            // <div className="absolute top-0 right-0 text-sm p-1 text-center items-center">
                            //   {(url && !readOnly) && (
                            //     <span
                            //       className="inline-block w-6 h-6 text-rose-500 cursor-pointer"
                            //       onClick={() => handleDelete(index)}
                            //     >
                            //       <span className="material-icons-outlined">
                            //         delete
                            //       </span>
                            //     </span>
                            //   )}

                            //   <input
                            //     type="file"
                            //     className="sr-only"
                            //     id="color_logo"
                            //   />
                            // </div>
                            // </div>
                            <div className={`flex relative justify-center col-span-full lg:col-span-6 border-2 border-dashed border-neutral-200 rounded-md shadow h-[302px] text-center`}>
                              <img
                                src={url}
                                alt=""
                                className="rounded-lg align-middle border-none object-fill  h-[302px]"
                              />
                              <div className="absolute top-0 right-0 text-sm p-1 text-center items-center">
                                {(url && !readOnly) && (
                                  <span
                                    className="inline-block w-6 h-6 text-rose-500 cursor-pointer"
                                    onClick={() => handleDelete(index)}
                                  >
                                    <span className="material-icons-outlined">
                                      delete
                                    </span>
                                  </span>
                                )}

                                <input
                                  type="file"
                                  className="sr-only"
                                  id="color_logo"
                                />
                              </div>
                            </div>
                          )
                      )}

                      {/* this should be kept forever for adding a new image */}
                      {!readOnly &&
                        <div className={`col-span-full lg:col-span-6 border-2 border-dashed border-neutral-200 rounded-md shadow h-[302px] ${values.length > 4 && " md:h-[380px]"} `}>
                          <label
                            // htmlFor="add-product-img"
                            className="w-full flex flex-wrap h-full items-center cursor-pointer"
                            onClick={() => dispatch(setAddLoading(false))}
                          >
                            <div className="w-full justify-center inset-0">
                              <div className="text-center">
                                {!GlobalLoading && (
                                  <div className="btn bg-indigo-500 text-white justify-center">
                                    Add
                                  </div>
                                )}
                                <File
                                  type="file"
                                  className="sr-only hidden"
                                  name="add-product-img"
                                  id="add-product-img"
                                  onChange={(value) => {
                                    uploadCurrentFile(value);
                                  }}
                                  folderpath={`${FolderPath}`}
                                />
                              </div>
                            </div>
                          </label>
                        </div>}
                    </div>
                  </div>
                </div>

                {/* MEDIA end */}
              </div>
            </FormikForm>
          );
        }}
      </Formik>
    </>
  );
};

export default Media;
