/*Component Name: Create
Component Functional Details: User can create or update Create master details from here.
Created By: Happy
Created Date: 31/5/22
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import { Formik, Form as FormikForm } from "formik";
import React, { useState, useEffect, useCallback } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import Dropdown from "components/common/formComponent/Dropdown";
import DropdownService from "services/common/dropdown/DropdownService";
import Messages from "components/common/alerts/messages/Index";
import { RecStatusValue, RecStatusValuebyName } from "global/Enum";
import Input from "components/common/formComponent/Input";
import DiscountDetail from "./DiscountDetail";
import QuantityDiscountService from "services/admin/quantityDiscount/QuantityDiscountService";
import { ValidationMsgs } from "global/ValidationMessages";
import { useDispatch, useSelector } from "react-redux";
import { serverError } from "services/common/helper/Helper";
import CreateFileHeader from "components/common/CreateFileHeader";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import VendorService from "services/admin/vendor/VendorService";
const Create = () => {
  const { id } = useParams();
  const isAddMode = !id;
  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [stores, setStores] = useState([]);
  const [brands, setBrands] = useState([]);
  const [data, setData] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  // const getVendorDropdownData = useCallback(() => {
  //   DropdownService.getDropdownValues(
  //     "vendor"
  //   ).then((res) => {
  //     if (res.data.success) {
  //       setVendors(() => {
  //         return res.data.data;
  //       });
  //     }
  //   });
  // }, []);
  const getVendorDropdownData = (brandId) => {
    VendorService.getVendorByBrand(brandId).then((res) => {
      if (res?.data?.data) {
        setVendors(() => {
          return res.data.data;
        });
      }
    });
  }
  useEffect(() => {
    if (data?.brandId) {
      getVendorDropdownData(data?.brandId);
    }
  }, [data?.brandId]);
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

  const getBrandDropdownData = useCallback(() => {
    DropdownService.getDropdownValues(
      "brand"
    ).then((res) => {
      if (res.data.success) {
        setBrands(() => {
          return res.data.data;
        });
      }
    });
  }, []);

  const getQuantityData = useCallback(() => {
    dispatch(setAddLoading(true))

    QuantityDiscountService.getQuantityDiscountById(id)
      .then((res) => {
        var response = res.data;
        if (response.success) {
          setData({
            id: response.data.id,
            brandId: response.data.brandId,
            storeId: response.data.storeId,
            vendorId: response.data.vendorId,
            name: response.data.name,
            recStatus: response.data.recStatus,
            rowVersion: response.data.rowVersion,
          });
        }
        dispatch(setAddLoading(false))

      })
      .catch((err) => {
        dispatch(setAddLoading(false))
      });
  }, [id]);

  useEffect(() => {
    getQuantityData();
    getStoreDropdownData();
    getBrandDropdownData();
  }, [id, isAddMode, getBrandDropdownData, getStoreDropdownData, getQuantityData]);

  const validationSchema = Yup.object({
    brandId: Yup.string()
      // .typeError(ValidationMsgs.common.brandIdTypeError)
      .required(ValidationMsgs.common.brandIdRequired),
    storeId: Yup.string()
      // .typeError(ValidationMsgs.quantityDiscount.storeIdTypeError)
      .required(ValidationMsgs.quantityDiscount.storeIdRequired),
    vendorId: Yup.string()
      // .typeError(ValidationMsgs.common.vendorIdTypeError)
      .required(ValidationMsgs.common.vendorIdRequired),
    name: Yup.string().required(ValidationMsgs.quantityDiscount.nameRequired),
    recStatus: Yup.string().required(ValidationMsgs.common.recStatusRequired),
  });

  function onSubmit(fields, { resetForm }) {
    if (isAddMode) {
      createQuantityDiscount(fields, resetForm);
    } else {
      updateQuantityDiscount(fields, resetForm);
    }
  }

  function createQuantityDiscount(fields, resetForm) {
    dispatch(setAddLoading(true))

    QuantityDiscountService.createQuantityDiscount({
      quantityDiscountModel: { ...fields, ...location },
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.quantityDiscount.quantityDiscountCreated,
            })
          );
          resetForm({});
          navigate(
            `/admin/MasterCatalog/Configuration/quantityDiscount/edit/${response.data.data.id}`
          );
          getQuantityData();
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
          dispatch(setAddLoading(false))

        }
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.quantityDiscount.quantityDiscountNotCreated,
          })
        );
        dispatch(setAddLoading(false))

      });
  }

  function updateQuantityDiscount(fields) {
    dispatch(setAddLoading(true))

    QuantityDiscountService.updateQuantityDiscount({
      quantityDiscountModel: { ...fields, ...location },
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.quantityDiscount.quantityDiscountUpdated,
            })
          );
          getQuantityData()
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
          dispatch(setAddLoading(false))

        }
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.quantityDiscount.quantityDiscountNotUpdated,
          })
        );
        dispatch(setAddLoading(false))

      });
  }

  const changeName = (brandId, vendorId) => {
    let brandName = brands.filter(value => value.value == brandId);
    let vendorName = vendors.filter(value => value.value == vendorId);
    return (brandName.length > 0 ? brandName[0]?.label + ' - ' : '') + (vendorName.length > 0 ? vendorName[0]?.label : '');
  }

  return (
    <>
      <title>
        {isAddMode ? "Add Quantity Discount" : "Edit Quantity Discount"}
      </title>
      <Formik
        enableReinitialize={true}
        initialValues={{
          id: data?.id || 0,
          storeId: data?.storeId || "",
          brandId: data?.brandId || "",
          vendorId: data?.vendorId || "",
          name: data?.name || "",
          recStatus: data?.recStatus || RecStatusValuebyName.Active,
          rowVersion: data?.rowVersion || null,
        }}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        validateOnMount={true}
      >
        {({ errors, setFieldValue, values, validateForm }) => {
          return (
            <FormikForm>
              <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
                <CreateFileHeader url="/admin/MasterCatalog/Configuration/quantityDiscount" module={`${isAddMode ? 'Create' : 'Edit'} Quantity Discount`} errors={errors} validateForm={validateForm} />
                {!showDetailModal && <Messages />}
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-full xl:col-span-9">
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                      <div className="w-full last:mb-0">
                        <label
                          className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                          htmlFor="grid-first-name"
                        >
                          {"Store"}

                          <span className="text-rose-500 text-2xl leading-none">
                            *
                          </span>
                        </label>
                        <Dropdown
                          defaultValue={values.storeId}
                          name={"storeId"}
                          options={stores}
                        />
                      </div>
                      <div></div>
                      <div className="w-full last:mb-0">
                        <label
                          className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                          htmlFor="grid-first-name"
                        >
                          {"Brand"}

                          <span className="text-rose-500 text-2xl leading-none">
                            *
                          </span>
                        </label>
                        <Dropdown
                          defaultValue={values.brandId}
                          name={"brandId"}
                          options={brands}
                          // onChange={(e) => {
                          //   setFieldValue('brandId', (e ? e?.value : ''));
                          //   setFieldValue('name', changeName(e?.value, values.vendorId))
                          // }}
                          onChange={(data) => {
                            setFieldValue('brandId', (data ? data.value : ''));
                            setFieldValue('name', changeName(data?.value, values.vendorId))
                            if (data && data?.value == data?.brandId) {
                              setFieldValue('vendorId', data?.vendorId);
                            } else {
                              setFieldValue('vendorId', '');
                            }
                            if (data?.value) {
                              getVendorDropdownData(data?.value);
                            } else {
                              setVendors([]);
                            }
                          }}
                        />
                      </div>
                      <div></div>
                      <div className="w-full last:mb-0">
                        <label
                          className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                          htmlFor="grid-first-name"
                        >
                          {"Vendor"}

                          <span className="text-rose-500 text-2xl leading-none">
                            *
                          </span>
                        </label>
                        <Dropdown
                          defaultValue={values.vendorId}
                          name={"vendorId"}
                          options={vendors}
                          onChange={(e) => {
                            setFieldValue('vendorId', (e ? e?.value : ''));
                            setFieldValue('name', changeName(values?.brandId, e?.value));
                          }}
                        />
                      </div>
                      <div></div>
                      <div className="w-full last:mb-0">
                        <label
                          className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                          htmlFor="grid-first-name"
                        >
                          {"Name"}
                          <span className="text-rose-500 text-2xl leading-none">
                            *
                          </span>
                        </label>
                        <Input name={"name"}
                          maxLength={200}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col col-span-full xl:col-span-3">
                    <div className="w-full bg-white shadow-xxl rounded-md">
                      <div className="border-b-2 border-neutral-200 p-6">
                        <div className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2">
                          {" Quantity Discount Status"}
                          <span className="text-rose-500 text-2xl leading-none">
                            *
                          </span>
                        </div>
                        <Dropdown
                          isMulti={false}
                          defaultValue={values.recStatus}
                          name={"recStatus"}
                          optionStyle={{ padding: "1px" }}
                          options={RecStatusValue}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FormikForm>
          );
        }}
      </Formik>
      <DiscountDetail quantityId={data.id} isAddMode={isAddMode} showDetailModal={showDetailModal} setShowDetailModal={setShowDetailModal} />
    </>
  );
};

export default Create;
