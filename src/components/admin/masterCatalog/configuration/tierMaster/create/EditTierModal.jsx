/*Component Name: EditTierModal
Component Functional Details: User can update Tier master details from here.
Created By: Ankit
Created Date: 22/09/2022
Modified By: Ankit
Modified Date: 22/09/2022 */

import React, { useState, useEffect } from "react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import Input from "components/common/formComponent/Input";
import TierService from "services/admin/tier/TierService";
import { RecStatusValuebyName } from "global/Enum";
import { useDispatch, useSelector } from "react-redux";
import { ValidationMsgs } from "global/ValidationMessages";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import Messages from "components/common/alerts/messages/Index";
import { serverError } from "services/common/helper/Helper";
import InputNumber from "components/common/formComponent/InputNumber";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const EditTierModal = (props) => {
  const permission = useSelector(store => store.permission);
  const handleShowModal = props.handleShowModal;
  const [tierData, setTierData] = useState([]);
  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);
  const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

  useEffect(() => {
    const tierRow = props.tierRow;
    TierService.getTierById(tierRow.original.id)
      .then((response) => {
        setTierData(response.data.data);
      })
  }, []);

  const initialValues = {
    id: tierData?.id || 0,
    storeId: tierData?.storeId || 0,
    tierName: tierData?.tierName || "",
    tierValue: tierData?.tierValue || 0,
    recStatus: tierData?.recStatus || RecStatusValuebyName.Active,
    rowVersion: tierData?.rowVersion || "",
  };

  const validationSchema = Yup.object({
    tierName: Yup.string().required(ValidationMsgs.tier.nameRequired),
    tierValue: Yup.number().required(ValidationMsgs.tier.tierValueRequired)
  });

  function updateTier(fields, resetForm) {
    dispatch(setAddLoading(true))

    TierService.updateTier({
      tierMasterModel: { ...fields, ...location },
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.tier.tierUpdated,
            })
          );
          handleShowModal((prev) => !prev);
          resetForm({});
          props.childRef.current.callGetStoreTiersDataFromParent();
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
            message: ValidationMsgs.tier.tierNotUpdated,
          })
        );
        dispatch(setAddLoading(false))

      });
  }

  const onSubmit = (fields, { resetForm }) => {
    updateTier(fields, resetForm);
  };

  return (
    <>
      <title>Edit Tier</title>
      <div id="editTierModal" className="overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-4 z-50 justify-center items-center h-modal md:h-full md:inset-0">
        <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative px-4 w-full max-w-2xl h-full md:h-auto">
            <div className="relative bg-white rounded-lg shadow max-h-screen overflow-y-auto">
              <div className="flex justify-between items-start p-5 rounded-t border-b sticky top-0 left-0 bg-white">
                <div className="text-xl font-semibold text-gray-900 lg:text-2xl">Edit Tier</div>
                <button type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  onClick={handleShowModal}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd">
                    </path>
                  </svg>
                </button>
              </div>
              <Formik
                enableReinitialize={true}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({ setFieldValue, errors, values }) => {
                  return (
                    <FormikForm>
                      <Messages />
                      <div className="p-6">
                        <div className="mb-4 last:mb-0">
                          <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="">Tier Name :</label>
                          <Input type="text" name="tierName" defaultValue={tierData.tierName} maxLength={200} />
                        </div>
                        <div className="mb-4 last:mb-0">
                          <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="">Tier :</label>
                          <InputNumber
                            displayError={true}
                            name="tierValue"
                            defaultValue={tierData.tierValue}
                            value={tierData.tierValue}
                            onChange={(e) => {
                              setFieldValue(e.target.name, e.target.value);
                            }}
                            maxLength={5}
                            allowNegative={false}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200">
                        <button
                          type="button"
                          className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
                          onClick={handleShowModal}
                        >
                          Cancel
                        </button>
                        {(permission.isEdit || permission?.isDelete) && <button
                          disabled={GlobalLoading}
                          type="submit"
                          className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(GlobalLoading) ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}>
                          <div className={`w-full flex justify-center align-middle `}>
                            {GlobalLoading && (
                              <span className="spinner-border spinner-border-sm mr-2"></span>
                            )}
                            Save
                          </div>
                        </button>}
                      </div>
                    </FormikForm>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditTierModal;
