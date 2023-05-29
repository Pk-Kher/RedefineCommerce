/*Component Name: RangeValues
Component Functional Details: User can create or update ProductReadinessDetail master details from here.
Created By: Shrey Patel
Created Date: 08/05/2022
Modified By: chandan
Modified Date: 26-08-2022 */

import React, { useState } from "react";
import Input from "components/common/formComponent/Input";
import { RecStatusValuebyName } from "global/Enum";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";
import { Fragment } from "react";
import InputNumber from "components/common/formComponent/InputNumber";
import { ValidationMsgs } from "global/ValidationMessages";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { useDispatch } from "react-redux";
import { serverError } from "services/common/helper/Helper";
import StoreService from "services/admin/store/StoreService";

const RangeValues = ({ shippingChargesModel = [{}], handleDeleteShippingData, isAddMode }) => {
  const { values, setFieldValue, validateForm, errors } = useFormikContext();
  const [rangeErrorMessage, setRangeErrorMessage] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);
  const addShippingData = () => {

    var shippingChargesObj = [
      {
        id: 0,
        charge: "",
        storeId: 0,
        orderTotalMax: "",
        orderTotalMin: "",
        recStatus: RecStatusValuebyName.Active,
        rowVersion: "",
        ...location
      },
      ...values.shippingChargesModel,
    ];

    var orderTotalMin = parseInt(values.shippingChargesModel[0].orderTotalMin);
    var orderTotalMax = parseInt(values.shippingChargesModel[0].orderTotalMax);
    var orderCharge = parseInt(values.shippingChargesModel[0].charge);

    var condition_1 = (orderTotalMin > 0);
    var condition_2 = (orderTotalMax > 0);
    var condition_3 = (orderCharge > 0);
    var condition_4 = (orderTotalMax > orderTotalMin);
    var condition_5 = (orderTotalMin < orderTotalMax);
    var condition_6 = (orderTotalMin > 0 && orderTotalMax > 0 && orderCharge > 0);

    switch (true) {
      case !condition_1:
        setRangeErrorMessage(true);
        return setErrorMessage('Minimum amount Must be greater than Zero.')

      case !condition_2:
        setRangeErrorMessage(true);
        return setErrorMessage('Maximum amount Must be greater than Zero.')

      case !condition_3:
        setRangeErrorMessage(true);
        return setErrorMessage('Total Charges Must be greater than Zero.')

      case !condition_4:
        setRangeErrorMessage(true);
        return setErrorMessage('Maximum amount must be greater than minimum amount.')

      case !condition_5:
        setRangeErrorMessage(true);
        return setErrorMessage('Minimum amount should not be less than maximum amount.')

      case !condition_6:
        setRangeErrorMessage(true);
        return setErrorMessage('All fields are required.')
    }

    if (condition_1 && condition_2 && condition_3 && condition_4 && condition_5 && condition_6) {
      setRangeErrorMessage(false);
      setFieldValue("shippingChargesModel", shippingChargesObj);
    } else {
      setRangeErrorMessage(true);
    }
  };

  return (
    <>
      {values.shippingChargesModel.map((value, index) => {
        if (value.recStatus === RecStatusValuebyName.Active) {
          return (
            <Fragment key={index}>
              <div className="flex">
                <div className="py-4 w-full">
                  <div className="relative">
                    <InputNumber
                      id="min"
                      className={`form-input w-full rounded-md border-neutral-200 hover:border-neutral-300 focus:border-neutral-500 focus:ring-neutral-300 focus:shadow-lg pl-8 ${index > 0 ? " bg-gray-200" : ""} `}
                      type="text"
                      name={`shippingChargesModel.[${index}].orderTotalMin`}
                      defaultValue={shippingChargesModel.orderTotalMin}
                      placeholder={"Minimum Amt"}
                      disabled={index > 0}
                      displayError={true}
                      value={values.shippingChargesModel[index].orderTotalMin}
                      onChange={(e) => {
                        setFieldValue(e.target.name, e.target.value);
                      }}
                      allowNegative={false}
                      maxLength={10}
                    />
                    <div className="absolute w-10 h-10 left-0 top-0 flex items-center justify-center">
                      <span className="material-icons-outlined">
                        attach_money
                      </span>
                    </div>
                  </div>
                </div>
                <span className="flex pt-4 pl-2 pr-2 text-2xl md:text-3xl text-gray-800">
                  -
                </span>

                <div className="py-4 w-full">
                  <div className="relative">
                    <InputNumber
                      className={`form-input w-full rounded-md border-neutral-200 hover:border-neutral-300 focus:border-neutral-500 focus:ring-neutral-300 focus:shadow-lg pl-8 ${index > 0 ? " bg-gray-200" : ""}`}
                      type="text"
                      name={`shippingChargesModel.[${index}].orderTotalMax`}
                      defaultValue={shippingChargesModel.orderTotalMax}
                      placeholder={"Maximum Amt"}
                      disabled={index > 0}
                      displayError={true}
                      value={values.shippingChargesModel[index].orderTotalMax}
                      onChange={(e) => {
                        setFieldValue(e.target.name, e.target.value);
                      }}
                      maxLength={10}
                      allowNegative={false}
                    />
                    <div className="absolute w-10 h-10 left-0 top-0 flex items-center justify-center">
                      <span className="material-icons-outlined">
                        attach_money
                      </span>
                    </div>
                  </div>
                </div>
                <span className=" flex pt-4 pl-2 pr-2 text-2xl md:text-3xl text-gray-800">
                  =
                </span>

                <div className="py-4 w-full">
                  <div className="relative">
                    <InputNumber
                      className={`form-input w-full rounded-md border-neutral-200 hover:border-neutral-300 focus:border-neutral-500 focus:ring-neutral-300 focus:shadow-lg pl-8 ${index > 0 ? " bg-gray-200" : ""} `}
                      type="text"
                      name={`shippingChargesModel.[${index}].charge`}
                      defaultValue={shippingChargesModel.charge}
                      placeholder={"Total Charges"}
                      disabled={index > 0}
                      displayError={true}
                      value={values.shippingChargesModel[index].charge}
                      onChange={(e) => {
                        setFieldValue(e.target.name, e.target.value);
                      }}
                      maxLength={10}
                      allowNegative={false}
                    />
                    <div className="absolute w-10 h-10 left-0 top-0 flex items-center justify-center">
                      <span className="material-icons-outlined">
                        attach_money
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-2 first:pl-5 py-3">
                  <div className="relative gap-2 pt-2 text-right">
                    {index === 0 ? (
                      <button
                        type="button"
                        className={`btn btn-sm bg-indigo-500 hover:bg-indigo-600 w-12 h-6 text-white`}
                        onClick={addShippingData}
                      >
                        Add
                      </button>
                    ) : (
                      <>
                        {(index === 1 || values.shippingChargesModel.length - 1 === index) ? (
                          <button
                            type="button"
                            className={`w-6 h-6 text-rose-500`}
                            onClick={() => {
                              if (value.id !== 0) {
                                handleDeleteShippingData(value)
                              } else {
                                setFieldValue(...values.shippingChargesModel, values.shippingChargesModel.splice(index, 1)); // 2nd parameter means remove one item only
                              }
                            }}
                          >
                            <span className="material-icons-outlined cursor-pointer">
                              delete
                            </span>
                          </button>
                        ) :
                          <span className="ml-6"></span>
                        }
                      </>
                    )}
                  </div>
                </div>
                <div className="px-2 first:pl-5 py-3">
                  <div className="relative gap-2 text-right"></div>
                </div>
              </div>
              {(rangeErrorMessage && index === 0) ? (<div className={"text-rose-500 pb-5"}>{ErrorMessage}</div>) : ("")}

            </Fragment>
          );
        }
        return "";
      })}
    </>
  );
};

export default RangeValues;
