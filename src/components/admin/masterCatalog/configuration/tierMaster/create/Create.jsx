/*Component Name: Tier create
Component Functional Details: Here we are creating Tier create data.
Created By: Ankit 
Created Date: 22/09/2022
Modified By: chandan
Modified Date: 22/09/2022 */

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import Dropdown from "components/common/formComponent/Dropdown";
import DropdownService from "services/common/dropdown/DropdownService";
import { Link, useNavigate, useParams } from "react-router-dom";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import Input from "components/common/formComponent/Input";
import TierServices from "services/admin/tier/TierService";
import Messages from "components/common/alerts/messages/Index";
import { RecStatusValuebyName } from "global/Enum";
import { ValidationMsgs } from "global/ValidationMessages";
import { useDispatch, useSelector } from "react-redux";
import { serverError } from "services/common/helper/Helper";
import StoreTiersList from "../list/StoreTiersList";
import EditTierModal from "../create/EditTierModal";
import InputNumber from "components/common/formComponent/InputNumber";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const Create = () => {
  const permission = useSelector(store => store.permission);
  const compName = "Tier";
  const childRef = useRef(null);
  let navigate = useNavigate();
  const { storeId } = useParams();
  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);

  const [stores, setStores] = useState([]);
  const [tierRow, setTierRow] = useState(null);
  const [storeID, setStoreID] = useState(storeId);
  const [openEditTierModal, setOpenEditTierModal] = useState(false);
  const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

  const getStoreDropdownData = useCallback(() => {
    DropdownService.getDropdownValues(
      "store"
    ).then((res) => {
      if (res.data.success) {
        setStores(() => {
          return res.data.data;
        });
      }
    });
  }, []);

  const HandleCancel = () => {
    navigate("/admin/MasterCatalog/Configuration/tier");
  };

  const handleShowModal = (tierRow, getStoreTiersData) => {
    setTierRow(tierRow);
    setOpenEditTierModal((prev) => !prev);
  };

  useEffect(() => {
    getStoreDropdownData();
  }, [getStoreDropdownData]);

  const validationSchema = Yup.object({
    storeId: Yup.string().required(ValidationMsgs.tier.storeIdRequired),
    tierName: Yup.string().required(ValidationMsgs.tier.nameRequired),
    tierValue: Yup.number().required(ValidationMsgs.tier.tierValueRequired),
    recStatus: Yup.string().required(ValidationMsgs.common.recStatusRequired)
  });

  const createTier = (fields, resetForm) => {
    dispatch(setAddLoading(true))

    TierServices.createTier({ ...fields, ...location })
      .then((response) => {
        if (response.data.success) {
          if (!storeID) {
            navigate(
              `/admin/MasterCatalog/Configuration/tier/store/${response.data.data.storeId}`
            );
          } else {
            childRef.current.callGetStoreTiersDataFromParent();
          }
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.tier.tierCreated,
            })
          );
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
            message: ValidationMsgs.tier.tierNotCreated,
          })
        );
        dispatch(setAddLoading(false))

      });
  };

  const showStoreTiers = (event) => {
    setStoreID(event.value);
    if (storeID) {
      childRef.current.callGetStoreTiersDataFromParent();
    }
  };

  const onSubmit = (fields, { resetForm }) => {
    createTier(fields, resetForm);
  };

  return (
    <>
      <title>Tier</title>

      <Formik
        enableReinitialize={true}
        initialValues={{
          id: 0,
          storeId: storeID ? storeID : "",
          tierName: "",
          tierValue: "",
          recStatus: RecStatusValuebyName.Active,
          rowVersion: null,
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        validateOnMount={true}
      >
        {({ setFieldValue, errors, values }) => {
          return (
            <main className="responsive">
              <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Page header */}
                <FormikForm>
                  <div className="flex mb-8 justify-between">
                    <div className="flex items-center">
                      <Link
                        to="/admin/MasterCatalog/Configuration/tier"
                        className="btn border-neutral-200 hover:border-neutral-400 text-gray-500 hover:text-gray-700 flex items-center mr-2"
                      >
                        <span className="material-icons-outlined">west</span>
                      </Link>

                      <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
                        Tier
                      </h1>
                    </div>
                    <div className="flex flex-wrap space-x-2">
                      {(permission?.isEdit || permission?.isDelete) && <>
                        <button
                          className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
                          onClick={HandleCancel}
                        >
                          Cancel
                        </button>
                        <button
                          disabled={GlobalLoading}
                          className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(GlobalLoading) ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}
                          type="submit"
                          onClick={() => {
                            dispatch(setAlertMessage({ type: "danger", message: serverError({ data: { errors: errors } }) }));
                          }}
                        >
                          <div className={`w-full flex justify-center align-middle `}>
                            {GlobalLoading && (
                              <span className="spinner-border spinner-border-sm mr-2"></span>
                            )}
                            Save
                          </div>
                        </button></>}
                    </div>
                  </div>
                  <Messages />

                  <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-full">
                      {/* <TierNameId /> */}
                      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                        <div className="w-full last:mb-0">
                          <label className="uppercase tracking-wide text-gray-500 text-xs font-bold mb-2 flex flex-wrap">
                            <span >
                              Store Name
                              <span className="text-rose-500 text-2xl leading-none">
                                *
                              </span>
                            </span>
                          </label>
                          <Dropdown
                            label="Store"
                            name={"storeId"}
                            options={stores}
                            isMulti={false}
                            defaultValue={storeID}
                            onChange={showStoreTiers}
                          />
                        </div>
                        <div className="w-full last:mb-0">
                          <div className="flex items-center">
                            <label className="uppercase tracking-wide text-gray-500 text-xs font-bold mb-2 flex flex-wrap">
                              <span
                              >
                                Tier Name
                                <span className="text-rose-500 text-2xl leading-none">
                                  *
                                </span>
                              </span>
                            </label>
                          </div>
                          <Input type="text" name="tierName" maxLength={200} />
                        </div>
                        <div className="w-full last:mb-0">
                          <div className="flex items-center">
                            <label className="uppercase tracking-wide text-gray-500 text-xs font-bold mb-2 flex flex-wrap">
                              <span>
                                Tier
                                <span className="text-rose-500 text-2xl leading-none">
                                  *
                                </span>
                              </span>
                            </label>
                          </div>
                          {/* <Input type="number" name="tierValue" */}
                          <InputNumber
                            displayError={true}
                            name="tierValue"
                            defaultValue={values.tierValue}
                            value={values.tierValue}
                            onChange={(e) => {
                              setFieldValue(e.target.name, e.target.value);
                            }}
                            maxLength={5}
                            allowNegative={false}
                          />
                        </div>
                      </div>
                      {storeID && (
                        <StoreTiersList storeId={storeID} handleShowModal={handleShowModal} ref={childRef} />
                      )}
                    </div>

                  </div>
                </FormikForm>
              </div>
            </main>
          );
        }}
      </Formik>
      {openEditTierModal && (
        <EditTierModal handleShowModal={handleShowModal} tierRow={tierRow} childRef={childRef} />
      )}
    </>
  );
};

export default Create;