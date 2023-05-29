/*Component Name: ProductStatus
Component Functional Details: User can create or update ProductStatus master details from here.
Created By: Ankit Sharma
Created Date: 12/07/2022
Modified By: Ankit Sharma
Modified Date: 12/07/2022 */

import React, { useState, useEffect } from "react";
import { Formik, Form as FormikForm } from "formik";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import ToggleButton from "components/common/formComponent/ToggleButton";
import { ProductStatusData, BundleProductStatusData, productType } from "dummy/Dummy";
import { useDispatch } from "react-redux";
import { serverError } from "services/common/helper/Helper";
import { ValidationMsgs } from "global/ValidationMessages";

const ProductStatus = ({ data, updateStatus, type }) => {
  const id = data.id;
  const dispatch = useDispatch();
  const [StatusData, setStatusData] = useState(ProductStatusData);

  useEffect(() => {
    if (type == productType.Bundle) {
      setStatusData(BundleProductStatusData)
    }
  }, []);

  const handleProductStatusToggle = (data) => {
    const obj = [
      {
        path: `/${data.target.name}`,
        op: "Replace",
        value: data.target.checked
      }
    ]
    updateStatus(id, obj).then((response) => {
      if (response.data.success) {
        dispatch(
          setAlertMessage({
            type: "success",
            message: ValidationMsgs.product.statusUpdated,
          })
        );
      } else {
        dispatch(
          setAlertMessage({ type: "danger", message: serverError(response) })
        );
      }
    })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.product.statusNotUpdated,
          })
        );
      });

  };

  return (
    <>
      <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 mb-6">
        <Formik>
          {({ setFieldValue, errors, values }) => {
            return (
              <FormikForm>
                <div className="p-6">
                  <div className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2">
                    Product Status
                  </div>

                  <div className="">
                    <div className="overflow-auto max-h-screen">
                      {StatusData.map((productStatus, index) => (
                        <div
                          className="grid grid-cols-12 gap-4 mb-4 last:mb-0"
                          key={index}
                        >
                          <div className="col-span-full sm:col-span-8 xl:col-span-8">
                            <label className="text-gray-500">
                              {productStatus.name}
                            </label>
                          </div>
                          <div className="col-span-full sm:col-span-4 xl:col-span-4">
                            <div className="flex items-center">
                              <ToggleButton
                                id={`productStatus${index}`}
                                onChange={handleProductStatusToggle}
                                defaultValue={data[productStatus.dbfield]}
                                name={productStatus.dbfield}
                                on={"Yes"}
                                off={"No"}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FormikForm>
            );
          }}
        </Formik>
      </div>
    </>
  );
};

export default ProductStatus;
