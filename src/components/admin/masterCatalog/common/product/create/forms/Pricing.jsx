/*Component Name: Pricing
Component Functional Details: User can create or update Pricing master details from here.
Created By: vikash Patel
Created Date: -
Modified By:chandan
Modified Date: 06/07/2022 */

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import { useParams, useNavigate } from "react-router-dom";
import Input from "components/common/formComponent/Input";
import { RecStatusValuebyName } from "global/Enum";
import Checkbox from "components/common/formComponent/Checkbox";
import DropdownService from "services/common/dropdown/DropdownService";
import Dropdown from "components/common/formComponent/Dropdown";
import DiscountDetailsService from "services/admin/quantityDiscount/DiscountDetailsService";
import { useDispatch, useSelector } from "react-redux";
import { serverError } from "services/common/helper/Helper";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { productType } from "dummy/Dummy";
import MasterProductService from "services/admin/masterCatalog/masterCatalog/products/ProductService";
import GrandMasterProductService from "services/admin/masterCatalog/grandMaster/products/ProductService";
import StoreProductService from "services/admin/masterCatalog/store/product/ProductService";
import BundleProductService from "services/admin/masterCatalog/store/bundle/ProductService";
import InputNumber from "components/common/formComponent/InputNumber";
import OptionConfirmationModal from "../forms/attributes/OptionConfirmationModal";
import { ValidationMsgs } from "global/ValidationMessages";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import UnsavedFormHandler from "./UnsavedFormHandler";
import ErrorHandler from "./ErrorHandler";

const Pricing = ({
  displayFieldElement,
  fetchFieldProperty,
  fields,
  values,
  setFormSubmit,
  setIsError,
  activeTab,
  type,
  index,
  setModalInfo,
  setOpenBasicModal,
  requiredFields,
  checkProductStatus,
  productstatusVal,
  isAddMode,
  getProductData,
  // getValidationForAllFilledFieldsFunc,
  readOnly,
  getProductReadinessData,
  setsaveUnSavedFields,
  setWishedToChangeTab,
  clearCacheForBrandCategory
}) => {
  const [quantityOptions, setQuantityOptions] = useState([])
  const [discountData, setDiscountData] = useState([])
  let [quantityId, setQuantityId] = useState(null);
  const ProductName = { values };
  const { id: CurrentId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const location = useSelector((store) => store?.location);
  const [OpenConfirmationModal, setOpenConfirmationModal] = useState(false)

  const schema = Yup.object().shape({
    ourCost: Yup.number().required(ValidationMsgs.masterCatalog.pricing.ourCostRequired).min(0, ValidationMsgs.masterCatalog.pricing.ourCostRequired).max(Yup.ref("msrp"), ValidationMsgs.masterCatalog.pricing.outCostlessThanMSRP),
    msrp: Yup.number().required(ValidationMsgs.masterCatalog.pricing.msrpRequired).min(0, ValidationMsgs.masterCatalog.pricing.msrpRequired),
    imap: Yup.number().when('isEnableMAP', {
      is: true, // alternatively: (val) => val == true
      then: Yup.number().required(ValidationMsgs.masterCatalog.pricing.imapRequired).min(0.1, ValidationMsgs.masterCatalog.pricing.imapRequired)
    }),
    salePrice: Yup.number().required(ValidationMsgs.masterCatalog.pricing.salePriceRequired).min(0, ValidationMsgs.masterCatalog.pricing.salePriceRequired).max(Yup.ref("msrp"), ValidationMsgs.masterCatalog.pricing.salesLassThenMSRP),
    giftWrapPrice: Yup.number().when('isGiftWrap', {
      is: true, // alternatively: (val) => val == true
      then: Yup.number().required(ValidationMsgs.masterCatalog.pricing.giftWrapRequired).min(0.1, ValidationMsgs.masterCatalog.pricing.giftWrapRequired)
    }),
  });
  const [checkerror, setCheckError] = useState(false);
  const formRef = useRef();
  const API = (type == productType.MC ? MasterProductService : type == productType.GMC ? GrandMasterProductService : [productType.CorporateStore, productType.EcommerceStore].includes(type) ? StoreProductService : BundleProductService)
  useEffect(() => {
    if (activeTab == index) {
      setFormSubmit(formRef.current);
    }
  }, [formRef, setFormSubmit, activeTab]);

  useEffect(() => {
    setQuantityId(values.quantityDiscountTemplate)
  }, [values]);

  const getDiscountsDetails = useCallback(() => {
    if (quantityId) {
      DiscountDetailsService.getDiscountsDetail(quantityId, {
        pageIndex: 0,
        pageSize: 100,
        pagingStrategy: 0,
        sortingOptions: [
          {
            field: "modifiedDate",
            direction: 0,
            priority: 0,
          },
        ],
        filteringOptions: [
          {
            field: "string",
            operator: 0,
            value: "string",
          },
        ],
      })
        .then((response) => {
          if (response.data.success) {

            setDiscountData(response.data.data.items);
          }
        })
        .catch((err) => { });
    } else {
      setDiscountData([]);
    }

  }, [quantityId]);

  useEffect(() => {
    getDiscountsDetails();
  }, [quantityId, getDiscountsDetails]);
  useEffect(() => {
    DropdownService.getDropdownValues("quantitydiscount").then((response) => {
      setQuantityOptions(() => {
        return response.data.data;
      });
    });
  }, []);

  function submitHandler(fields, { resetForm }) {
    dispatch(setAddLoading(true))

    const { quantityDiscountTemplate, ...allFields } = fields
    const { browser, ...AllLocation } = location
    API.updateProductPricing({
      productPriceModel: {
        id: Number(CurrentId),
        recStatus: values?.recStatus || productstatusVal, rowVersion: values?.rowVersion || "",
        ...allFields,
        quantityDiscountTemplate,
        ...AllLocation
      },
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.masterCatalog.pricing.updated,
            })
          );
          getProductData();
          getProductReadinessData();
          clearCacheForBrandCategory();
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
        }
        // getValidationForAllFilledFieldsFunc()
        dispatch(setAddLoading(false))
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.masterCatalog.pricing.notUpdated,
          })
        );
        dispatch(setAddLoading(false))
      });
  }

  const handleVariantOption = (data) => {
    navigate('/admin/MasterCatalog/Configuration/quantityDiscount/create');
    setOpenConfirmationModal(false);
  }

  const InitialData = {
    ourCost: values?.ourCost || 0,
    msrp: values?.msrp || 0,
    imap: values?.imap || 0,
    salePrice: values?.salePrice || 0,
    giftWrapPrice: values?.giftWrapPrice || 0,
    isGiftWrap: values?.isGiftWrap || false,
    callForPrice: values?.callForPrice || false,
    isEnableMAP: values?.isEnableMAP || false,
    quantityDiscountTemplate: values?.quantityDiscountTemplate || 0
  }

  useEffect(() => {
    setWishedToChangeTab(false)
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={InitialData}
        onSubmit={submitHandler}
        validationSchema={schema}
        innerRef={formRef}
        validateOnMount={true}
      >
        {({ errors, setFieldValue, values }) => {
          setCheckError(Object.keys(errors).length ? true : false);
          checkProductStatus(errors);
          return (
            <FormikForm>
              <ErrorHandler setIsError={setIsError} errors={errors} checkProductStatus={checkProductStatus} />
              <UnsavedFormHandler values={values} setsaveUnSavedFields={setsaveUnSavedFields} InitialData={InitialData} />

              <div
                x-show="activeTab === 02"
                className="panel-02 tab-content p-6"
              >
                {/* <!-- pricing start -->  */}
                <div className="pt-6">
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="w-full md:w-auto">
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                        MSRP
                        <span className="text-rose-500 text-2xl leading-none">
                          *
                        </span>
                      </div>
                      <div className="relative grow">
                        <div className="absolute w-10 h-10 mt-0 left-0 top-0 flex items-center justify-center">
                          <span className="material-icons-outlined">
                            attach_money
                          </span>
                        </div>
                        <InputNumber
                          displayError={false}
                          disabled={readOnly}
                          name="msrp"
                          defaultValue={values.msrp}
                          // value={values.msrp}
                          placeholder="00.00"
                          className="appearance-none block w-full text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white pl-10"
                          onChange={(e) => {
                            setFieldValue(e.target.name, e.target.value);
                          }}
                          maxLength={10}
                          allowNegative={false}
                        />
                        <div className="text-rose-600">
                          {errors.msrp}
                        </div>
                      </div>
                    </div>
                    <div className="w-full md:w-auto">
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                        Our Cost
                        <span className="text-rose-500 text-2xl leading-none">
                          *
                        </span>
                      </div>
                      <div className="relative grow">
                        <div className="absolute w-10 h-10 mt-0 left-0 top-0 flex items-center justify-center">
                          <span className="material-icons-outlined">
                            attach_money
                          </span>
                        </div>
                        <InputNumber
                          displayError={false}
                          type="text"
                          disabled={readOnly}
                          value={values.ourCost}
                          name="ourCost"
                          placeholder="00.00"
                          className="appearance-none block w-full text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white pl-10"
                          onChange={(e) => {
                            setFieldValue(e.target.name, e.target.value);
                          }}
                          maxLength={10}
                          allowNegative={false}
                        />
                        <div className="text-rose-600">
                          {errors.ourCost}
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-auto">
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                        IMAP
                        <span className="text-rose-500 text-2xl leading-none">
                          {/* * */}
                        </span>
                      </div>
                      <div className="relative grow">
                        <div className="absolute w-10 h-10 mt-0 left-0 top-0 flex items-center justify-center">
                          <span className="material-icons-outlined">
                            attach_money
                          </span>
                        </div>
                        <InputNumber
                          displayError={false}
                          disabled={readOnly}
                          name="imap"
                          defaultValue={values.imap}
                          // value={values.imap}
                          placeholder="00.00"
                          className="appearance-none block w-full text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white pl-10"
                          onChange={(e) => {
                            if (e.target.value) {
                              setFieldValue(e.target.name, e.target.value);
                            }
                            else {
                              setFieldValue(e.target.name, 0);
                            }

                          }}
                          maxLength={10}
                          allowNegative={false}
                        />
                        <div className="text-rose-600">
                          {errors.imap}
                        </div>
                      </div>
                    </div>
                    <div className="w-full md:w-auto">
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                        Sale Price
                        <span className="text-rose-500 text-2xl leading-none">
                          *
                        </span>
                      </div>
                      <div className="relative grow">
                        <div className="absolute w-10 h-10 mt-0 left-0 top-0 flex items-center justify-center">
                          <span className="material-icons-outlined">
                            attach_money
                          </span>
                        </div>
                        <InputNumber
                          displayError={false}
                          disabled={readOnly}
                          defaultValue={values.salePrice}
                          // value={values.salePrice}
                          name="salePrice"
                          placeholder="00.00"
                          className="appearance-none block w-full text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white pl-10"
                          onChange={(e) => {
                            setFieldValue('salePrice', e.target.value);
                          }}
                          maxLength={10}
                          allowNegative={false}
                        />
                        <div className="text-rose-600">
                          {errors.salePrice}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-6 last:mb-0" x-data="{ checked: true }">
                    <div >
                      <label className="text-gray-500 inline-flex items-center">
                        <Checkbox
                          name={"isGiftWrap"}
                          onChange={(e) => {
                            setFieldValue(`isGiftWrap`, e.target.checked);
                          }}
                          checked={values.isGiftWrap}
                          type={"checkbox"}
                          className={"form-checkbox"}
                          disabled={readOnly}
                        />

                        <span className="ml-2">Is Gift Wrap</span>
                      </label>
                    </div>
                    {values.isGiftWrap && (<div
                      className="w-full mb-6 last:mb-0"
                    >
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                        Gift Wrap Price
                        <span className="text-rose-500 text-2xl leading-none">
                          *
                        </span>
                      </label>
                      <InputNumber
                        displayError={true}
                        disabled={readOnly}
                        name="giftWrapPrice"
                        defaultValue={values.giftWrapPrice}
                        value={values.giftWrapPrice}
                        placeholder="00.00"
                        className="appearance-none block w-full text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white"
                        onChange={(e) => {
                          setFieldValue(e.target.name, e.target.value);
                        }}
                        maxLength={10}
                      />
                    </div>)}
                  </div>
                  <div className="mb-6 last:mb-0">
                    <label className="text-gray-500 inline-flex items-center">
                      <Checkbox
                        type="checkbox"
                        className="form-checkbox"
                        disabled={readOnly}
                        name={'callForPrice'}
                        checked={values.callForPrice}
                        onChange={(e) => {
                          setFieldValue(e.target.name, e.target.checked);
                        }}
                      />
                      <span className="ml-2">Call for Price</span>
                    </label>
                  </div>
                  <div className="mb-6 last:mb-0">
                    <label className="text-gray-500 inline-flex items-center">
                      <Checkbox
                        type="checkbox"
                        className="form-checkbox"
                        name={"isEnableMAP"}
                        disabled={readOnly}
                        checked={values.isEnableMAP}
                        onChange={(e) => {
                          setFieldValue(`isEnableMAP`, e.target.checked);
                        }}
                      />
                      <span className="ml-2">
                        Enable (MAP) Minimum Advertised Price
                      </span>
                    </label>
                  </div>
                  {displayFieldElement(fields, "quantityDiscountTemplate") && (
                    <>
                      <div className="w-full">
                        <div className="block text-xs font-semibold text-gray-500 uppercase">
                          {fetchFieldProperty("displayname", "quantityDiscountTemplate")}
                        </div>
                        <div className="flex pt-5">
                          <div className="flex grow">
                            <Dropdown
                              isMulti={false}
                              name={fetchFieldProperty("dbfield", "quantityDiscountTemplate")}
                              options={quantityOptions}
                              isSearchable={true}
                              defaultValue={values?.quantityDiscountTemplate}
                              onChange={(data) => {
                                setQuantityId(data?.value);
                                if (data) {
                                  setFieldValue("quantityDiscountTemplate", data.value);
                                } else {
                                  setFieldValue("quantityDiscountTemplate", 0);
                                }
                              }}
                              isDisabled={readOnly}
                              className="w-full pr-3"
                            />
                          </div>
                          <div >
                            {/* <AddButton data={values} name={ProductName} /> */}
                            <button type="button" className="btn border-indigo-300 hover:border-indigo-400 text-indigo-500" onClick={() => setOpenConfirmationModal(true)} ><span >Add Quantity Discount</span> </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5">
                        <div >
                          {discountData.length > 0 && (
                            <table className="table-auto w-full text-sm text-[#191919] font-semibold">
                              <thead className="text-sm font-bold uppercase text-[#b3b3b3] border-b border-neutral-200 border-t">
                                <tr>
                                  <th className="px-2 first:pl-5 py-4">
                                    <div className="font-semibold text-left max-w-max flex items-center">
                                      <span>Low Quantity</span>
                                    </div>
                                  </th>
                                  <th className="px-2 first:pl-5 py-4">
                                    <div className="font-semibold text-left max-w-max flex items-center">
                                      <span>High Quantity</span>
                                    </div>
                                  </th>
                                  <th className="px-2 first:pl-5 py-4">
                                    <div className="font-semibold text-left flex items-center">
                                      <span>Discount Percent</span>
                                    </div>
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200">
                                {discountData.map((values, index) => {
                                  return (
                                    <tr key={index}>
                                      <td className="px-2 first:pl-5 py-3">
                                        {values?.lowQuantity}
                                      </td>
                                      <td className="px-2 first:pl-5 py-3">
                                        {values?.highQuantity}
                                      </td>
                                      <td className="px-2 first:pl-5 py-3">
                                        {values?.discountPercent}%
                                      </td>

                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          )}

                        </div>
                      </div>
                    </>)
                  }

                </div>
              </div>
            </FormikForm>
          );
        }}
      </Formik>
      {
        OptionConfirmationModal &&
        <OptionConfirmationModal
          handleConfirmation={handleVariantOption}
          setOpenModal={setOpenConfirmationModal}
          openModal={OpenConfirmationModal}
          message={"This will Redirect to Add Quantity DIscount.Do you want to continue?"}
          displayOkButton={true}
        />
      }
    </>
  );
};

export default Pricing;
const AddButton = ({ isAddMode, type, productId, getCustomerFaqsData, API, data, name }) => {
  const [openAddModal, setopenAddModal] = useState(false);
  return (
    <>
      <div >
        <button
          type="button"
          onClick={() => setopenAddModal((prev) => !prev)}
          className="btn inline-flex bg-indigo-500 hover:bg-indigo-600 text-white"
          data-modal-toggle="addfaqModal"
        >
          <span className="ml-1">Add Quantity Discount</span>
        </button>
      </div>
      {openAddModal && (
        <AddFaqModal
          openAddModal={openAddModal}
          setopenAddModal={setopenAddModal}
          isAddMode={isAddMode}
          getCustomerFaqsData={getCustomerFaqsData}
          productId={productId}
          type={type}
          API={API}
          data={data}
          ProductName={name}
        />
      )}
    </>
  );
};

const AddFaqModal = ({ openAddModal, setopenAddModal, getCustomerFaqsData, productId, type, API, data, ProductName, readOnly }) => {
  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);

  // const validationSchema = Yup.object({
  //   question: Yup.string().required(
  //     ValidationMsgs.masterCatalog.customerFaqs.questionRequired
  //   ),
  //   answer: Yup.string().required(
  //     ValidationMsgs.masterCatalog.customerFaqs.answerRequired
  //   ),
  // });

  // const onSubmit = (fields, { resetForm }) => {
  //   API.createCustomerFaqs({
  //     productCustomerFAQModel: { ...fields, ...location }
  //   })
  //     .then((response) => {
  //       if (response.data.success) {
  //         dispatch(
  //           setAlertMessage({
  //             type: "success",
  //             message: ValidationMsgs.quantityDiscount.quantityDiscountCreated,
  //           })
  //         );
  //         getCustomerFaqsData()
  //         resetForm({});
  //       } else {
  //         dispatch(
  //           setAlertMessage({ type: "danger", message: serverError(response) })
  //         );
  //       }
  //     })
  //     .catch((errors) => {
  //       dispatch(
  //         setAlertMessage({
  //           type: "danger",
  //           message: ValidationMsgs.quantityDiscount.quantityDiscountNotCreated,
  //         })
  //       );
  //     });
  //   setopenAddModal(false)
  // };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          id: 0,
          productId: productId,
          question: "",
          answer: "",
          rowVersion: "",
          recStatus: RecStatusValuebyName.Active,
        }}
        // validationSchema={validationSchema}
        // onSubmit={onSubmit}
        validateOnChange={true}
        validateOnBlur={false}
      >
        {({ setFieldValue, errors, values }) => {
          return (
            <FormikForm>
              <div
                id="addfaqmodal"
                className="overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-4 z-50 justify-center items-center h-modal md:h-full md:inset-0"
              >
                <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="relative px-4 w-full max-w-2xl h-full md:h-auto">
                    <div className="relative bg-white rounded-lg shadow max-h-screen overflow-y-auto">
                      <div className="flex justify-between items-start p-5 rounded-t border-b sticky top-0 left-0 bg-white">
                        <h3 className="text-xl font-semibold text-gray-900 lg:text-2xl">
                          Add Customer Faqs
                        </h3>
                        <button
                          type="button"
                          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                          data-modal-toggle="addfaqmodal"
                          onClick={() => setopenAddModal((prev) => !prev)}
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
                      <div className="p-6">
                        <div className="mb-4">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                            htmlFor=""
                          >
                            NAME
                            <span className="text-rose-500 text-lg leading-none">
                              *
                            </span>
                          </label>

                          <Input type={"text"} name="name" defaultValue={ProductName?.values?.name} />
                        </div>

                        <div className="mb-4">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                            htmlFor=""
                          >
                            MSRP
                            <span className="text-rose-500 text-lg leading-none">
                              *
                            </span>
                          </label>
                          <Input type={"text"} name="msrp" readOnly={!readOnly} defaultValue={data?.msrp} />

                        </div>

                        <div className="mb-4">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                            htmlFor=""
                          >
                            Quantity Discount
                            <span className="text-rose-500 text-lg leading-none">
                              *
                            </span>
                          </label>
                          <div className="overflow-visible max-h-screen mt-7 border-t border-neutral-200">
                            <table className="table-auto w-full text-sm text-[#191919] font-semibold">
                              <thead className="text-sm font-bold uppercase text-[#b3b3b3] border-b border-neutral-200">
                                <tr>
                                  <th className="pt-2 py-2">
                                    <div className="font-semibold text-left max-w-sm text-xs flex items-center">
                                      <span className="first:pl-2">LOW QUANTITY</span>
                                    </div>
                                  </th>
                                  <th className="pt-2 py-2">
                                    <div className="font-semibold text-left max-w-sm text-xs flex items-center">
                                      <span className="first:pl-2">HIGH QUANTITY</span>
                                    </div>
                                  </th>
                                  <th className="pt-2 py-2">
                                    <div className="font-semibold text-left max-w-sm text-xs flex items-center">
                                      <span className="first:pl-2">DISCOUNT PERCENT</span>
                                    </div>
                                  </th>
                                  <th className="pt-2 py-2">
                                    <div className="font-semibold text-left max-w-sm text-xs flex items-center">
                                      <span className="first:pl-2">DISCOUNT PRICE</span>
                                    </div>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="px-2 py-3">
                                    <Input className={"w-32"} displayError={true} name={`attributename`} uniqueId={"dropDownElem_attributeName_unique"} defaultValue={values.attributename} onChange={(value) => { setFieldValue('attributename', value); }} />
                                  </td>
                                  <td className="px-2 py-3">
                                    <Input className={"w-32"} displayError={true} name={`attributevalue`} uniqueId={"dropDownElem_attributeValue_unique"} defaultValue={values.attributevalue} onChange={(value) => { setFieldValue('attributevalue', value); }} />
                                  </td>
                                  <td className="px-2 py-3">
                                    <Input className={"w-32"} displayError={true} name={`attributename`} uniqueId={"dropDownElem_attributeName_unique"} defaultValue={values.attributename} onChange={(value) => { setFieldValue('attributename', value); }} />
                                  </td>
                                  <td className="px-2 py-3">
                                    <Input className={"w-32"} displayError={true} name={`attributename`} uniqueId={"dropDownElem_attributeName_unique"} defaultValue={values.attributename} onChange={(value) => { setFieldValue('attributename', value); }} />
                                  </td>
                                  <td className="px-2 first:pl-5 py-3">
                                    <button
                                      type="button" className={`w-6 h-6 text-indigo-500`}>
                                      {/* {saveLoading ? */}
                                      {/*  <span className="spinner-border spinner-border-sm mr-2"></span> : */} <span className="material-icons-outlined">add</span>
                                      {/* } */}
                                    </button>
                                  </td>
                                </tr>
                                {/* {
                                  data.map((values, i) => {
                                    return (
                                      <tr key={i} >
                                        <td className="px-2 first:pl-5 py-3">
                                          <span className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-3 rounded-md font-normal py-3`}>{values.attributeName}</span>
                                        </td>
                                        <td className="px-2 first:pl-5 py-3">
                                          <span className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-3 py-3 rounded-md font-normal`}>{values.attributevalue}</span>
                                        </td>
                                        <td className="px-2 first:pl-5 py-3">
                                          <button
                                            type="button"
                                            className={`w-6 h-6 text-rose-500`}
                                            onClick={() => {
                                              statusChangedHandler(values);
                                            }}
                                          >
                                            {(deleteId === values.id) ?
                                              <span className="spinner-border spinner-border-sm mr-2"></span> : <span className="material-icons-outlined cursor-pointer">
                                                delete
                                              </span>
                                            }
                                          </button>
                                        </td>
                                      </tr>
                                    );
                                  })
                                } */}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200">
                        <button
                          data-modal-toggle="addfaqmodal"
                          type="button"
                          className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
                          onClick={() => setopenAddModal((prev) => !prev)}
                        >
                          Cancel
                        </button>
                        <button
                          data-modal-toggle="addfaqmodal"
                          type="submit"
                          className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                        >
                          Save Quantity Discount
                        </button>
                      </div>
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
