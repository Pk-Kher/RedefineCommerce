
import { Form as FormikForm, Formik, ErrorMessage, useFormikContext } from "formik";
import React, { useEffect, useState, Fragment } from "react";
import * as Yup from "yup";
import Input from "components/common/formComponent/Input";
import { useParams } from "react-router-dom";
import { blobFolder, RecStatusValuebyName } from "global/Enum";
import StoreService from "services/admin/store/StoreService";
import ImageFile from "components/common/formComponent/ImageFile";
import DropdownService from "services/common/dropdown/DropdownService";
import Messages from "components/common/alerts/messages/Index";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import ToggleButton from "components/common/formComponent/ToggleButton";
import { serverError } from "services/common/helper/Helper";
import { useCallback } from "react";
import Dropdown from "components/common/formComponent/Dropdown";
import InputNumber from "components/common/formComponent/InputNumber";
import { ValidationMsgs } from "global/ValidationMessages";
import CreateFileHeader from "components/common/CreateFileHeader";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import RadioButton from "components/common/formComponent/RadioButton";
import RangeValues from "./RangeValues"
import FormErrorMessage from "components/common/alerts/FormErrorMessage";
import CKEditor from "components/common/formComponent/CKEditor";
import Checkbox from "components/common/formComponent/Checkbox";

function Create() {
  const { id } = useParams();
  const isAddMode = !id;
  const navigate = useNavigate();
  const [storeTypeOptions, setStoreTypeOptions] = useState([]);
  const [attributesOptions, setAttributesOptions] = useState([]);
  const [showPayment, setShowPayment] = useState(true);
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [BrandOptions, setBrandOptions] = useState([]);
  const [StoreOptions, setStoreOptions] = useState([]);
  const [initialPayOptions, setInitialPayOptions] = useState([]);
  const [paymentOptionForCheckbox, setpaymentOptionForCheckbox] = useState({});
  const [payBy, setPayBy] = useState([]);
  const [data, setData] = useState({});
  const [ShippingChargesData, setShippingChargesData] = useState([]);
  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);
  const CompanyId = useSelector((store) => store?.CompanyConfiguration.id)
  const [StoreTypeId, setStoreTypeId] = useState(data?.storeTypeId);
  const [ParentStoreId, setParentStoreId] = useState(data?.parentstoreid);
  const [initialBrands, setInitialBrand] = useState([]);
  const [ChildStoreBrands, setChildStoreBrands] = useState([]);
  const [ShippingServicesOptions, setShippingServicesOptions] = useState([]);
  const [ShippingMethodTypes, setShippingMethodTypes] = useState([]);
  const [ShippingServiceId, setShippingServiceId] = useState([]);

  const FolderPath = `/${blobFolder.temp}/${CompanyId}/${blobFolder.store}`

  useEffect(() => {
    DropdownService.getDropdownValues("storetype").then((res) => {
      if (res.data.success) {
        setStoreTypeOptions(() => {
          return res.data.data;
        });
      }
    });
    DropdownService.getDropdownValues("attributes").then((res) => {
      if (res.data.success) {
        setAttributesOptions(() => {
          return res.data.data;
        });
      }
    });
    setStoreTypeId(data.storeTypeId);
  }, [data.storeTypeId]);

  useEffect(() => {
    DropdownService.getDropdownValues("storebrand", false, ParentStoreId || data?.parentstoreid).then((res) => {
      if (res.data.success) {
        setBrandOptions(() => {
          return res.data.data;
        });
      }
    });
  }, [ParentStoreId, data?.parentstoreid]);

  useEffect(() => {
    if (!isAddMode) {
      getStoreData();
    }
  }, [id]);

  useEffect(() => {
    StoreService.getPaymentOptions()
      .then((res) => {
        var PaymentResponse = res.data;
        if (PaymentResponse.success) {
          setPayBy(res.data.data);
        }
      })
      .catch((err) => {
        dispatch(setAddLoading(false))
      });
  }, []);

  const getStoreData = useCallback(() => {
    if (id) {
      dispatch(setAddLoading(true))
      StoreService.getPaymentOptions()
        .then((res) => {
          var PaymentResponse = res.data;
          if (PaymentResponse?.success) {
            setPayBy(res?.data?.data);

            StoreService.getStoreById(id)
              .then((res) => {
                var response = res.data;
                if (response.success && response.data) {
                  setData(res?.data?.data);
                  setInitialBrand(response?.data?.storeParentBrandList);
                  setChildStoreBrands(response?.data?.childStoreParentBrandViewModels);

                  // this setter function helps to prefill payment option
                  if (res.data.data.storeXPaymetnOptionListViewModels.length > 0) {
                    PaymentResponse.data.map((ourPayBy) => {
                      res.data.data.storeXPaymetnOptionListViewModels.map((PaymentOption) => {
                        if (PaymentOption?.paymentOptionId) {
                          setpaymentOptionForCheckbox((prevVal) => ({
                            ...prevVal,
                            [ourPayBy.name]: { valBool: false, value: ourPayBy.id }
                          }))
                        }
                      })
                      res.data.data.storeXPaymetnOptionListViewModels.map((PaymentOption) => {
                        if (PaymentOption?.paymentOptionId == ourPayBy.id) {
                          setpaymentOptionForCheckbox((prevVal) => ({
                            ...prevVal,
                            [ourPayBy.name]: { valBool: true, value: PaymentOption.paymentOptionId }
                          }))
                        }
                      })
                    })
                  }
                  setInitialPayOptions(res?.data?.data?.storeXPaymetnOptionListViewModels);

                  StoreService.getShippingChargesById(id)
                    .then((res) => {
                      var response = res?.data;
                      if (response.success && response.data) {
                        setShippingChargesData(res?.data?.data);
                      } else {
                        dispatch(
                          setAlertMessage({
                            type: "danger",
                            message: "Shipping Data Not Found",
                          })
                        );
                        // navigate("/admin/MasterCatalog/Store")
                      }
                      dispatch(setAddLoading(false))
                    })
                    .catch((err) => {
                      dispatch(setAddLoading(false))
                    });

                } else {
                  dispatch(
                    setAlertMessage({
                      type: "danger",
                      message: "Store Not Found",
                    })
                  );
                  navigate("/admin/MasterCatalog/Store")
                }
                dispatch(setAddLoading(false))

              })
              .catch((err) => {
                dispatch(setAddLoading(false))
              });
          }
        })
        .catch((err) => {
          dispatch(setAddLoading(false))
        });
    }
  }, [id])

  const getStoreListByStoreTypeId = () => {
    StoreService.getStoreListByStoreTypeId(0, StoreTypeId)
      .then((res) => {
        var response = res?.data;
        if (response.success && response.data) {
          const arr = res?.data?.data;
          arr.forEach(object => {
            if (object.label === data.name) {
              object.isDisabled = true;
            }
          });
          setStoreOptions(arr);
        }
        dispatch(setAddLoading(false))
      })
      .catch((err) => {
        dispatch(setAddLoading(false))
      });
  }

  useEffect(() => {
    getStoreListByStoreTypeId()
  }, [StoreTypeId])


  useEffect(() => {
    DropdownService.getDropdownValues("shippingServices").then((res) => {
      if (res.data.success) {
        setShippingServicesOptions(() => {
          return res.data.data;
        });
      }
    });
  }, [])

  useEffect(() => {
    if (ShippingServiceId !== []) {
      StoreService.getShippingMethodByShippingServiceId({
        shippingServiceId: ShippingServiceId,
        storeId: id || 0
      })
        .then((res) => {
          var response = res?.data;
          var UpdatedDropDownData = response?.data.map((UpdateDropData) => ({ value: UpdateDropData.id, label: UpdateDropData.name }))
          if (response.success) {
            setShippingMethodTypes(UpdatedDropDownData);
          }
        })
        .catch((err) => { });
    }
  }, [ShippingServiceId, id])

  const validationSchema = Yup.object({
    name: Yup.string().required(ValidationMsgs.store.nameRequired),
    storeTypeId: Yup.number().required(ValidationMsgs.store.storeTypeIdRequired),
    prefix: Yup.string().required(ValidationMsgs.store.prefixRequired),
    navCode: Yup.string().required(ValidationMsgs.store.navCodeRequired),
    attributeid: Yup.string().when('isAttributeSaparateProduct', {
      is: true,
      then: Yup.string().required(ValidationMsgs.store.attributeidRequired),
    }),
    firstLineCharges: Yup.string().when('isLinepersonalization', {
      is: true,
      then: Yup.string().required(ValidationMsgs.store.firstLineCharges),
    }),
    secondLineCharges: Yup.string().when('isLinepersonalization', {
      is: true,
      then: Yup.string().required(ValidationMsgs.store.secondLineCharges),
    }),
    smallRunLimit: Yup.string().when('isSmallRun', {
      is: true,
      then: Yup.string().required(ValidationMsgs.store.smallRunLimit),
    }),
    smallRunFeesCharges: Yup.string().when('isSmallRun', {
      is: true,
      then: Yup.string().required(ValidationMsgs.store.smallRunFeesCharges),
    }),
    logoSetupCharges: Yup.string().when('isLogoSetupCharges', {
      is: true,
      then: Yup.string().required(ValidationMsgs.store.logoSetupCharges),
    }),
    // brandId: Yup.array().min(ParentStoreId !== 0, "Brand is Required"),
    brandId: Yup.array().when('parentstoreid', {
      is: (parentstoreid) =>
        parentstoreid !== 0,
      then: Yup.array().min(1, "Brand is Required").required("Brand is Require"),
      otherwise: Yup.array()
    }),
    url: Yup.string()
      .matches(
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
        'Enter valid url'
      ).required("Please enter store url"),
    generalAmount: Yup.number().when("isFreeShipping", {
      is: (isFreeShipping) => isFreeShipping == true,
      then: Yup.number().required("Please enter minimum free shipping amount"),
    }),
    shippingServiceId: Yup.array().when("shippingChargeType", {
      is: (shippingChargeType) => shippingChargeType == 3,
      then: Yup.array().min(1, "Shipping Service is Required").required("Shipping Service is Required")
    }),
    shippingMethod: Yup.array().when("shippingChargeType", {
      is: (shippingChargeType) => shippingChargeType == 3,
      then: Yup.array().min(1, "Shipping Method is Required").required("Shipping Method is Required"),
    }),
  })

  const onSubmit = (fields, { resetForm }) => {
    if (isAddMode) {
      createStore(fields, resetForm);
    } else {
      updateStore(fields, resetForm);
    }
  }

  function createStore(fields, resetForm) {
    dispatch(setAddLoading(true))
    StoreService.createStore({
      storeModel: {
        ...fields,
        attributeid: (fields.attributeid && fields.attributeid !== '' ? fields.attributeid : 0),
        ...location
      },
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: "",
            })
          );

          // Shipping Charges API
          // if (fields?.isFreeShipping) {
          //   CreateShippingCharges(fields?.shippingChargesModel, response.data.data.id, resetForm);
          // }

          //Child Store API
          if (fields?.brandId.length > 0) {
            const brand = fields.brandId.map((value, i) => {
              return {
                id: 0,
                rowVersion: "",
                storeId: response?.data?.data?.id,
                brandId: value,
                recStatus: "A",
                ...location
              }
            })

            StoreService.CreateUpdateChildStore({ storeParentBrandModel: brand }).then((response) => {
              if (response.data.success) {
                dispatch(
                  setAlertMessage({
                    type: "success",
                    message: ValidationMsgs.store.storeCreated
                  })
                );
              } else {
                dispatch(setAlertMessage({ type: "Warning", message: serverError(response) }));
                dispatch(setAddLoading(false))
              }
            }).catch((errors) => {
              dispatch(setAddLoading(false))
              dispatch(setAlertMessage({ type: "danger", message: "Brand not added successfully" }));
            });
          }

          // Payment API
          if (showPayment) {

            let ourSelectedPaymentOption = [];

            Object.values(paymentOptions).map((payOptionData) => {
              if (payOptionData.valBool) {
                ourSelectedPaymentOption.push(
                  {
                    paymentOptionId: payOptionData.value,
                    rowVersion: "",
                    status: RecStatusValuebyName.Active,
                  }
                )
              }
            })

            StoreService.CreateAndUpdateStorePaymentOption({
              storeXPaymentOptionModel: {
                id: response.data.data.id,
                ...location,
                storexpaymentoptionlist: ourSelectedPaymentOption,
              },
            })
              .then((response) => {
                if (response.data.success) {
                  dispatch(
                    setAlertMessage({
                      type: "success",
                      message: ValidationMsgs.store.storeCreated,
                    })
                  );
                  resetForm({});
                } else {
                  dispatch(
                    setAlertMessage({
                      type: "danger",
                      message: serverError(response),
                    })
                  );
                }
                dispatch(setAddLoading(false))
              })
              .catch((errors) => {
                dispatch(
                  setAlertMessage({
                    type: "danger",
                    message: ValidationMsgs.store.storeNotCreated,
                  })
                );
                dispatch(setAddLoading(false))
              });
          }
          navigate(`/admin/MasterCatalog/Store/edit/${response?.data?.data?.id}`)
          resetForm({});
        } else {
          dispatch(
            setAlertMessage({
              type: "danger",
              message: serverError(response),
            })
          );
          dispatch(setAddLoading(false))
        }
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.store.storeNotCreated,
          })
        );
        dispatch(setAddLoading(false))
      });
  }

  function updateStore(fields) {
    dispatch(setAddLoading(true))
    StoreService.updateStore({
      storeModel: {
        ...fields,
        attributeid: (fields.attributeid && fields.attributeid !== '' ? fields.attributeid : 0),
        ...location
      },
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: "",
            })
          );

          // Shipping Charges API
          // if (fields?.isFreeShipping) {
          //   CreateShippingCharges(fields?.shippingChargesModel, id);
          // }

          //Child Store API
          if (fields?.brandId) {
            CreateUpdateChildStore(fields)
          }

          // Payment API
          if (showPayment) {
            const previouslyAddedPayOptionsFromDb = [...initialPayOptions];
            const finallySelectedPaymentOptionForDb = []

            // initialPayOptions data is from our API (from where we are getting our previously added payment options )
            Object.entries(paymentOptions).map((vendor) => {
              if (vendor[1].valBool === true) {
                const existPayId = previouslyAddedPayOptionsFromDb.find((value) => value.paymentOptionId == vendor[1].value);

                if (existPayId) {
                  finallySelectedPaymentOptionForDb.push({ ...existPayId, paymentOptionId: vendor[1].value, rowVersion: vendor.rowVersion || "", status: 'A' })
                }
                else {
                  finallySelectedPaymentOptionForDb.push({ paymentOptionId: vendor[1].value, rowVersion: vendor.rowVersion || "", status: 'A' })
                }
              }
            })

            previouslyAddedPayOptionsFromDb.map((oldPromotionData) => {
              const foundSameApplyIdAsNewArrayContain = finallySelectedPaymentOptionForDb.some((newPromotionApplyId) => (newPromotionApplyId.paymentOptionId == oldPromotionData.paymentOptionId));

              if (!foundSameApplyIdAsNewArrayContain) {
                finallySelectedPaymentOptionForDb.push({
                  paymentOptionId: oldPromotionData.paymentOptionId,
                  rowVersion: oldPromotionData.rowVersion,
                  recStatus: RecStatusValuebyName?.Archived,
                })
              }
            });

            // console.log("checkPayment", finallySelectedPaymentOptionForDb, paymentOptions, paymentOptionForCheckbox);
            StoreService.CreateAndUpdateStorePaymentOption({
              storeXPaymentOptionModel: {
                id: id,
                ...location,
                storexpaymentoptionlist: finallySelectedPaymentOptionForDb,
              },
            })
              .then((response) => {
                if (response.data.success) {
                  dispatch(
                    setAlertMessage({
                      type: "success",
                      message: ValidationMsgs.store.storeUpdated,
                    })
                  );
                  getStoreData();
                  dispatch(setAddLoading(false))
                } else {
                  dispatch(
                    setAlertMessage({
                      type: "danger",
                      message: serverError(response),
                    })
                  );
                  dispatch(setAddLoading(false))
                }
              })
              .catch((errors) => {
                dispatch(
                  setAlertMessage({
                    type: "danger",
                    message: ValidationMsgs.store.storeNotUpdated,
                  })
                );
                dispatch(setAddLoading(false))
              });
          }
        } else {
          dispatch(
            setAlertMessage({
              type: "danger",
              message: serverError(response),
            })
          );
          dispatch(setAddLoading(false))
        }
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.store.storeNotUpdated,
          })
        );
        dispatch(setAddLoading(false))
      });
  }

  const CreateUpdateChildStore = (fields, resetForm) => {
    // dispatch(setAddLoading(true))
    let brands = [...initialBrands];
    const brand = fields.brandId.map((vendor) => {
      const existBrand = initialBrands.find((value) => value.brandId.toString() === vendor.toString());
      if (!existBrand) {
        brands.push({
          id: 0,
          rowVersion: "",
          storeId: id,
          brandId: vendor,
          recStatus: "A",
        })
      }
      return vendor.toString();
    })

    brands = brands.map((brandValue) => {
      brandValue["location"] = location.location;
      brandValue["ipAddress"] = location.ipAddress;
      brandValue["macAddress"] = location.macAddress;
      brandValue["storeId"] = id;
      delete brandValue["brandName"]
      if (brand.includes(brandValue.brandId.toString())) {
        return { ...brandValue, recStatus: 'A' };
      } else {
        return { ...brandValue, recStatus: 'R' };
      }
    });

    StoreService.CreateUpdateChildStore({ storeParentBrandModel: brands }).then((response) => {
      if (response.data.success) {
        dispatch(
          setAlertMessage({
            type: "success",
            message: ValidationMsgs.store.storeUpdated
          })
        );
      } else {
        dispatch(setAlertMessage({ type: "danger", message: serverError(response) }));
        dispatch(setAddLoading(false))
      }
    }).catch((errors) => {
      dispatch(setAddLoading(false))
      dispatch(setAlertMessage({ type: "danger", message: "Brand not Updated" }));
    });
  }

  const handleDeleteShippingData = (value) => {
    dispatch(setAddLoading(true))
    var ids = [];
    if (Array.isArray(value)) {
      ids = value.map((value) => {
        return { item1: value.id, item2: value.rowVersion };
      });
    } else {
      ids = [{ item1: value.id, item2: value.rowVersion }];
    }
    if (!isAddMode && value.id !== 0) {
      StoreService.UpdateShippingStatus({
        args: {
          idsRowVersion: [
            {
              item1: value.id,
              item2: value.rowVersion
            }
          ],
          status: RecStatusValuebyName.Archived,
          ...location,
        },
      })
        .then((response) => {
          if (response.data.data) {
            dispatch(
              setAlertMessage({
                view: true,
                type: "success",
                message: ValidationMsgs.store.shippingDeleted,
              })
            );
            getStoreData();
            dispatch(setAddLoading(false))
          } else {
            dispatch(
              setAlertMessage({
                view: true,
                type: "danger",
                message: serverError(response),
              })
            );
            dispatch(setAddLoading(false))
          }

        })
        .catch((errors) => {
          if (errors.response.data.Errors.Error) {
            dispatch(
              setAlertMessage({
                message: errors.response.data.Errors.Error,
                type: "danger",
              })
            );
          } else {
            dispatch(
              setAlertMessage({ message: ValidationMsgs.store.shippingNotDeleted, type: "danger" })
            );
          }
          dispatch(setAddLoading(false))

        });
    }
  };

  const handleChange = (e, setFieldValue, name) => {
    setFieldValue(name, (e ? e.value : ''))
    if (name == "parentstoreid") {
      setParentStoreId(e.value);
    }
    if (name === "storeTypeId") {
      setStoreTypeId(e.value)
      if (StoreTypeId !== e.value) {
        setFieldValue("brandId", [])
        setFieldValue("parentstoreid", 0)
      }
    }
  };

  const handleChangePaymentOption = (e, setFieldValue, values, paybydata) => {
    // const { id } = paybydata;

    const checkOtherPayOptions = e.target.name.substring(
      e.target.name.indexOf("[") + 1,
      e.target.name.lastIndexOf("]")
    );

    const CurrentPaymentVal = (values.paymentOption && values.paymentOption[checkOtherPayOptions]) ? { valBool: !values.paymentOption[checkOtherPayOptions]["valBool"], value: paybydata.id } : { valBool: true, value: paybydata.id };

    setFieldValue(`${e.target.name}`, CurrentPaymentVal);

    // console.log("checkHandleClickValue", checkOtherPayOptions, CurrentPaymentVal, e.target.name, paybydata, payBy);
    if (!paybydata.isMultipleSelect) {
      let MultiPaymentWithFalse = payBy.filter((paybydata) => !paybydata.isMultipleSelect)
      MultiPaymentWithFalse.map((SingleMultiPaymentWithFalse) => {
        if (SingleMultiPaymentWithFalse.name !== checkOtherPayOptions) {
          setFieldValue(`paymentOption[${SingleMultiPaymentWithFalse.name}]`, { valBool: false, value: SingleMultiPaymentWithFalse.id });
        }
      })
    }
    if (checkOtherPayOptions === "None") {
      payBy.map((SingleMultiPaymentWithFalse) => {
        if (SingleMultiPaymentWithFalse.name !== "None") {
          setFieldValue(`paymentOption[${SingleMultiPaymentWithFalse.name}]`, { valBool: false, value: SingleMultiPaymentWithFalse.id });
        }
      })
    } else if (paybydata.isMultipleSelect) {
      let GetNoneId = payBy.find((abcd) => abcd.name == "None")
      setFieldValue(`paymentOption["None"]`, {
        valBool: false, value: GetNoneId.id
      });
    }

  };

  // this is for prefilled payment option
  useEffect(() => {
    if (initialPayOptions.length > 0) {
      payBy.map((ourPayBy) => {
        Object.values(paymentOptionForCheckbox).map((PaymentOption) => {
          if (PaymentOption.paymentOptionId == ourPayBy.id) {
            setpaymentOptionForCheckbox((prevVal) => ({
              ...prevVal,
              [ourPayBy.name]: { valBool: true, value: PaymentOption.paymentOptionId }
            }))
          }
        })
      })
    }
  }, [initialPayOptions, payBy])

  // if (!isAddMode && Object.keys(data).length <= 0) {
  //   return "";
  // }
  const handleShippingChargeType = (e, setFieldValue) => {
    setFieldValue("shippingChargeType", e.target.value);
  }
  return (
    <>
      <title>{isAddMode === true ? "Add Store" : "Edit Store"}</title>
      <Formik
        enableReinitialize={true}
        initialValues={{
          id: data?.id || 0,
          name: data?.name || "",
          code: data?.code || "",
          parentstoreid: data?.parentstoreid || 0,
          brandId: data?.storeParentBrandList?.map((brands) => brands.brandId) || [],
          storeTypeId: data?.storeTypeId || 0,
          shippingServiceId: data?.shippingServices || [],
          shippingMethod: data?.shippingMethod || [],
          url: data?.url || "",
          navCode: data?.navCode || "",
          prefix: data?.prefix || "",
          paymentOptionId: data?.paymentOptionId || "",
          recStatus: data?.recStatus || RecStatusValuebyName.Active,
          logoUrl: data?.logoUrl || "",
          isLandingPage: data?.isLandingPage || false,
          isBlogPage: data?.isBlogPage || false,
          isReviewMaster: data?.isReviewMaster || false,
          isSeoMarketing: data?.isSeoMarketing || false,
          isAttributeSaparateProduct: data?.isAttributeSaparateProduct || false,
          isLinepersonalization: data?.isLinepersonalization || false,
          firstLineCharges: data?.firstLineCharges || 0,
          secondLineCharges: data?.secondLineCharges || 0,
          isSmallRun: data?.isSmallRun || false,
          smallRunLimit: data?.smallRunLimit || 0,
          smallRunFeesCharges: data?.smallRunFeesCharges || 0,
          isLogoSetupCharges: data?.isLogoSetupCharges || false,
          logoSetupCharges: data?.logoSetupCharges || 0,
          isProductReadinessAllow: data?.isProductReadinessAllow || false,
          isSeoReadinessAllow: data?.isSeoReadinessAllow || false,
          isQuantityDiscount: data?.isQuantityDiscount || false,
          isFirstLogoFree: data?.isFirstLogoFree || false,
          attributeid: data?.attributeid || "",
          rowVersion: data?.rowVersion || "",
          paymentOption: paymentOptionForCheckbox,
          isShippingCharge: data.isShippingCharge || false,
          isFreeShipping: data.isFreeShipping || false,
          isGeneral: data?.isGeneral || data?.isFreeShipping == true ? false : true,
          generalAmount: data?.generalAmount || 0,
          checkOutRequiredThirdPartyLogin: data?.checkOutRequiredThirdPartyLogin || false,
          generalLogin: data?.generalLogin || (data?.thirdPartyLogin || data?.bothLogin || data?.onlyGuestLogin == true ? false : true),
          thirdPartyLogin: data?.thirdPartyLogin || false,
          bothLogin: data?.bothLogin || false,
          onlyGuestLogin: data?.onlyGuestLogin || false,
          domainBasedLogin: data?.domainBasedLogin || false,
          domainBasedLoginDesc: data?.domainBasedLoginDesc || "",
          punchoutMessage: data?.punchoutMessage || "",
          billToCustomer: data?.billToCustomer || "",
          favicon: data?.favicon || "",
          // shippingChargesModel: [{
          //   id: 0,
          //   charge: "",
          //   orderTotalMax: "",
          //   storeId: id || 0,
          //   orderTotalMin: "",
          //   recStatus: RecStatusValuebyName.Active,
          //   rowVersion: "",
          //   ...location
          // }, ...(ShippingChargesData.length > 0 ? [...ShippingChargesData] : [])],
          shippingChargeType: data?.shippingChargeType || 0,
        }}
        validationSchema={validationSchema}
        validateOnMount={true}
        validateOnBlur={true}
        onSubmit={onSubmit}
      >
        {({ setFieldValue, errors, values, setValues, validateForm }) => {
          if (Object.keys(values.paymentOption).length > 0) {
            setPaymentOptions(values.paymentOption)
          }
          setShippingServiceId(values.shippingServiceId)
          if (values.parentstoreid === "") {
            setFieldValue("parentstoreid", 0)
            setParentStoreId(0)
            if (values.parentstoreid == 0) {
              setFieldValue("brandId", [])
            }
          }
          if (values.parentstoreid == 0) {
            setParentStoreId(0)
          }

          return (
            <FormikForm>
              <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">

                <CreateFileHeader url="/admin/MasterCatalog/Store/" module={isAddMode === true ? "Add Store" : "Edit Store"} errors={errors} validateForm={validateForm} />
                <Messages />
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-full">
                    <div className="bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                      <div className="block uppercase tracking-wide text-gray-500 text-lg font-bold mb-6"> Store Information </div>

                      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="w-full">
                          <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            Store Type
                            <span className="text-rose-500 text-2xl leading-none">*</span>
                          </label>
                          <Dropdown
                            label="Store Type"
                            name="storeTypeId"
                            options={storeTypeOptions}
                            defaultValue={values.storeTypeId}
                            onChange={(e) => handleChange(e, setFieldValue, "storeTypeId")}
                          >
                            <option value={0} disabled >Select Store Type</option>
                          </Dropdown>
                        </div>
                        <div className="w-full">
                          <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            Store Name
                            <span className="text-rose-500 text-2xl leading-none">*</span>
                          </label>
                          <Input type={"text"} name="name" maxLength={60} />
                        </div>
                        <div className="w-full">
                          <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">Store Code</label>
                          <Input type={"text"} name="code" maxLength={30} />
                        </div>

                        <div className="w-full">
                          <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">Store URL
                            <span className="text-rose-500 text-2xl leading-none">*</span>
                          </label>
                          <Input type={"text"} name="url" maxLength={255} />
                        </div>

                        <div className="w-full">
                          <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">Store NAV Code
                            <span className="text-rose-500 text-2xl leading-none">*</span>
                          </label>
                          <Input value={values.navCode} onChange={(e) => { setFieldValue('navCode', e.target.value) }} type={"text"} name="navCode" displayError={true} maxLength={30} />
                        </div>
                        <div className="w-full">
                          <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">Store Prefix
                            <span className="text-rose-500 text-2xl leading-none">*</span>
                          </label>
                          <Input type={"text"} name="prefix" value={values.prefix} onChange={(e) => { setFieldValue('prefix', e.target.value) }} displayError={true} maxLength={30} />
                        </div>
                        <div className="w-full">
                          <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">Parent Store</label>
                          <Dropdown
                            label="parentstoreid"
                            name="parentstoreid"
                            options={StoreOptions}
                            defaultValue={values.parentstoreid}
                            onChange={(e) => handleChange(e, setFieldValue, "parentstoreid")}
                          />
                        </div>
                        <div className="w-full">
                          <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">Bill To Customer
                            {/* <span className="text-rose-500 text-2xl leading-none">*</span> */}
                          </label>
                          <Input type={"text"} name="billToCustomer" value={values.billToCustomer} onChange={(e) => { setFieldValue('billToCustomer', e.target.value) }} displayError={true} maxLength={10} />
                        </div>
                        {/* {values.parentstoreid !== 0 && */}
                        <div className="w-full">
                          <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">Brand</label>
                          <Dropdown
                            isMulti={true}
                            hidecheckbox={false}
                            defaultValue={values.brandId}
                            name={"brandId"}
                            options={BrandOptions}
                            isDisabled={values.parentstoreid == 0 ? true : false}
                          />
                        </div>
                        {/* } */}
                        <div className="w-full"></div>
                        <div className="w-full">
                          <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">Store Logo</label>
                          <ImageFile
                            type="file"
                            className="sr-only w-1/2 h-40"
                            name="logoUrl"
                            id="logoUrl"
                            uprdivclass="w-1/2"
                            buttonName="Add"
                            onChange={(value) => {
                              setFieldValue("logoUrl", value);
                            }}
                            folderpath={FolderPath}
                            url={values.logoUrl}
                          />
                          <div className="w-full">
                            <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mt-4 mb-2">Fav Icon</label>
                            <ImageFile
                              type="file"
                              className="sr-only w-1/2 h-40"
                              name="favicon"
                              id="favicon"
                              uprdivclass="w-1/2"
                              buttonName="Add"
                              onChange={(value) => {
                                setFieldValue("favicon", value);
                              }}
                              folderpath={FolderPath + "/favicon"}
                              url={values.favicon}
                            />
                          </div>
                        </div>
                        <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-4">
                          {/* <div className="w-full grid grid-cols-2 gap-4" > */}
                          <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold"> Login Type: </label>
                          <div className={`flex items-center justify-between grid-cols-1 xl:grid-cols-2 gap-4`}>
                            {/* General Login */}
                            <div className="w-1/6 relative grow">
                              <RadioButton
                                type="radio"
                                name="generalLogin"
                                value="generalLogin"
                                id={'generalLogin'}
                                onChange={(e) => {
                                  setValues((prev) => {
                                    return { ...prev, generalLogin: e.target.checked, thirdPartyLogin: false, bothLogin: false, onlyGuestLogin: false }
                                  });
                                }}
                                checked={values.generalLogin}
                                label={'General'}
                              />
                            </div>

                            {/* Third Party */}
                            <div className="w-1/6 relative grow">
                              <RadioButton
                                type="radio"
                                name="thirdPartyLogin"
                                value="thirdPartyLogin"
                                id={'thirdPartyLogin'}
                                onChange={(e) => {
                                  setValues((prev) => {
                                    return { ...prev, generalLogin: false, thirdPartyLogin: e.target.checked, bothLogin: false, onlyGuestLogin: false }
                                  });
                                }}
                                checked={values.thirdPartyLogin}
                                label={'3rd Party'}
                              />
                            </div>

                            {/* Both */}
                            <div className="w-1/6 relative grow">
                              <RadioButton
                                type="radio"
                                name="bothLogin"
                                value="bothLogin"
                                id={'bothLogin'}
                                onChange={(e) => {
                                  setValues((prev) => {
                                    return { ...prev, generalLogin: false, thirdPartyLogin: false, bothLogin: e.target.checked, onlyGuestLogin: false }
                                  });
                                }}
                                checked={values.bothLogin}
                                label={'Both'}
                              />
                            </div>

                            {/* Only Guest */}
                            <div className="w-1/6 relative grow">
                              <RadioButton
                                type="radio"
                                name="onlyGuestLogin"
                                value="onlyGuestLogin"
                                id={'onlyGuestLogin'}
                                onChange={(e) => {
                                  setValues((prev) => {
                                    return { ...prev, generalLogin: false, thirdPartyLogin: false, bothLogin: false, onlyGuestLogin: e.target.checked }
                                  });
                                }}
                                checked={values.onlyGuestLogin}
                                label={'Only Guest'}
                              />
                            </div>
                          </div>
                          {/* </div> */}
                          {/* Landing Page */}

                          <div className="flex items-center justify-between">
                            <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold"> Landing Page</label>
                            <div className="flex items-center">
                              <div className="w-20 relative">
                                <ToggleButton name="isLandingPage" id="isLandingPage" size="m" on="Active" off="Inactive" onChange={(e) => setFieldValue("isLandingPage", e.target.checked)} defaultValue={values.isLandingPage} />
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            {values?.storeTypeId == 2 && (
                              <>
                                <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold"> SEO / Marketing </label>
                                <div className="flex items-center">
                                  <div className="w-20 relative">
                                    <ToggleButton name="isSeoMarketing" id="isSeoMarketing" size="m" on="Active" off="Inactive" onChange={(e) => setFieldValue("isSeoMarketing", e.target.checked)} defaultValue={values.isSeoMarketing} />
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                          {/* Blog Page */}
                          <div className="flex items-center justify-between">
                            <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold"> Blog Page</label>
                            <div className="flex items-center">
                              <div className="w-20 relative">
                                <ToggleButton name="isBlogPage" id="isBlogPage" size="m" on="Active" off="Inactive" onChange={(e) => setFieldValue("isBlogPage", e.target.checked)} defaultValue={values.isBlogPage} />
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold"> Review Master</label>
                            <div className="flex items-center">
                              <div className="w-20 relative">
                                <ToggleButton name="isReviewMaster" id="isReviewMaster" size="m" on="Active" off="Inactive" onChange={(e) => setFieldValue("isReviewMaster", e.target.checked)} defaultValue={values.isReviewMaster} />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold"> Quantity Discount</label>
                            <div className="flex items-center">
                              <div className="w-20 relative">
                                <ToggleButton name="isQuantityDiscount" id="isQuantityDiscount" size="m" on="Active" off="Inactive" onChange={(e) => setFieldValue("isQuantityDiscount", e.target.checked)} defaultValue={values.isQuantityDiscount} />
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold"> First Logo Free ?</label>
                            <div className="flex items-center">
                              <div className="w-20 relative">
                                <ToggleButton name="isFirstLogoFree " id="isFirstLogoFree" size="m" on="Active" off="Inactive" onChange={(e) => { setFieldValue("isFirstLogoFree", e.target.checked); }} defaultValue={values.isFirstLogoFree} />
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold"> Allow Product Readiness </label>
                            <div className="flex items-center">
                              <div className="w-20 relative">
                                <ToggleButton name="isProductReadinessAllow " id="isProductReadinessAllow" size="m" on="Active" off="Inactive" onChange={(e) => { setFieldValue("isProductReadinessAllow", e.target.checked); }} defaultValue={values.isProductReadinessAllow} />
                              </div>
                            </div>
                          </div>
                          {/* {values?.storeTypeId == 2 && ( */}
                          <div className="flex items-center justify-between">
                            <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold"> Allow SEO Readiness </label>
                            <div className="flex items-center">
                              <div className="w-20 relative">
                                <ToggleButton name="isSeoReadinessAllow " id="isSeoReadinessAllow" size="m" on="Active" off="Inactive" onChange={(e) => { setFieldValue("isSeoReadinessAllow", e.target.checked); }} defaultValue={values.isSeoReadinessAllow} />
                              </div>
                            </div>
                          </div>
                          {/* )} */}
                          <div className="flex items-center justify-between">
                            <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold"> Required Third Party Login For CheckOut</label>
                            <div className="flex items-center">
                              <div className="w-20 relative">
                                <ToggleButton name="checkOutRequiredThirdPartyLogin" id="checkOutRequiredThirdPartyLogin" size="m" on="Active" off="Inactive" onChange={(e) => setFieldValue("checkOutRequiredThirdPartyLogin", e.target.checked)} defaultValue={values.checkOutRequiredThirdPartyLogin} />
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between"></div>

                          <div className="flex items-center justify-between">
                            <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold"> Domain Based Login </label>
                            <div className="flex items-center">
                              <div className="w-20 relative">
                                <ToggleButton name="domainBasedLogin" id="domainBasedLogin " size="m" on="Active" off="Inactive" onChange={(e) => setFieldValue("domainBasedLogin", e.target.checked)} defaultValue={values.domainBasedLogin} />
                              </div>
                            </div>
                          </div>
                          <div className={`flex items-center justify-between grid-cols-1 xl:grid-cols-2 gap-4`}>
                            <div className="w-full relative grow">
                              {values.domainBasedLogin && (
                                <>
                                  {/* <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold"> Logo Set-Up Charges
                                    <span className="text-rose-500 text-2xl leading-none">*</span>
                                  </label> */}
                                  <Input
                                    className="appearance-none block w-full text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white pl-4" placeholder="ex. gmail.com"
                                    label="domainBasedLoginDesc" name="domainBasedLoginDesc" defaultValue={values.domainBasedLoginDesc} displayError={true} onChange={(e) => setFieldValue(e.target.name, e.target.value)} />
                                </>
                              )}
                            </div >
                          </div >
                          <div className="flex items-center justify-between">
                            <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold"> Attribute as Separate Product ?</label>
                            <div className="flex items-center">
                              <div className="w-20 relative">
                                <ToggleButton name="isAttributeSaparateProduct" id="isAttributeSaparateProduct" size="m" on="Active" off="Inactive" onChange={(e) => setFieldValue("isAttributeSaparateProduct", e.target.checked)} defaultValue={values.isAttributeSaparateProduct} />
                              </div>
                            </div>
                          </div>
                          <div className={`flex items-center justify-between`}>
                            <div className="w-full">
                              {values?.isAttributeSaparateProduct && (
                                <Dropdown label="attributeid" name="attributeid" options={attributesOptions} defaultValue={values.attributeid} /* onChange={(e) => handleChange(e, setFieldValue, "attributeid")} */ />
                              )}
                            </div >
                          </div >
                          <div className="flex items-center justify-between">
                            <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold"> Apply Logo Set-Up Charges </label>
                            <div className="flex items-center">
                              <div className="w-20 relative">
                                <ToggleButton name="isLogoSetupCharges" id="isLogoSetupCharges " size="m" on="Active" off="Inactive" onChange={(e) => setFieldValue("isLogoSetupCharges", e.target.checked)} defaultValue={values.isLogoSetupCharges} />
                              </div>
                            </div>
                          </div>
                          <div className={`flex items-center justify-between grid-cols-1 xl:grid-cols-2 gap-4`}>
                            <div className="w-full relative grow">
                              {values.isLogoSetupCharges && (
                                <>
                                  <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold"> Logo Set-Up Charges
                                    <span className="text-rose-500 text-2xl leading-none">*</span>
                                  </label>
                                  <div className="absolute w-10 h-10 mt-7 left-0 top-0 flex items-center justify-center">
                                    <span className="material-icons-outlined">
                                      attach_money
                                    </span>
                                  </div>
                                  <InputNumber
                                    className="appearance-none block w-full text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white pl-8"
                                    label="logoSetupCharges" name="logoSetupCharges" defaultValue={values.logoSetupCharges} displayError={true} onChange={(e) => setFieldValue(e.target.name, e.target.value)} />
                                </>
                              )}
                            </div >
                          </div >
                          <div className="flex items-center justify-between">
                            <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold"> Line Personalization </label>
                            <div className="flex items-center">
                              <div className="w-20 relative">
                                <ToggleButton name="isLinepersonalization " id="isLinepersonalization " size="m" on="Active" off="Inactive" onChange={(e) => setFieldValue("isLinepersonalization", e.target.checked)} defaultValue={values?.isLinepersonalization} />
                              </div>
                            </div>
                          </div>
                          <div className={`flex items-center justify-between grid-cols-1 xl:grid-cols-2 gap-4`}>
                            {values?.isLinepersonalization && (
                              <>
                                <div className="w-1/2 relative grow">
                                  <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold"> First Line Charges
                                    <span className="text-rose-500 text-2xl leading-none">*</span>
                                  </label>
                                  <div className="absolute w-10 h-10 mt-7 left-0 top-0 flex items-center justify-center">
                                    <span className="material-icons-outlined">
                                      attach_money
                                    </span>
                                  </div>
                                  <InputNumber
                                    className="appearance-none block w-full text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white pl-8"
                                    label="firstLineCharges" name={"firstLineCharges"} defaultValue={values?.firstLineCharges} displayError={true} onChange={(e) => setFieldValue(e.target.name, e.target.value)} />
                                </div >
                                <div className="w-1/2 relative grow">
                                  <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold"> Second Line Charges
                                    <span className="text-rose-500 text-2xl leading-none">*</span>
                                  </label>
                                  <div className="absolute w-10 h-10 mt-7 left-0 top-0 flex items-center justify-center">
                                    <span className="material-icons-outlined">
                                      attach_money
                                    </span>
                                  </div>
                                  <InputNumber
                                    className="appearance-none block w-full text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white pl-8"
                                    label="secondLineCharges" name={"secondLineCharges"} defaultValue={values?.secondLineCharges} displayError={true} onChange={(e) => setFieldValue(e.target.name, e.target.value)} />
                                </div >
                              </>
                            )}
                          </div >
                          <div className="flex items-center justify-between">
                            <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold"> Small RUN </label>
                            <div className="flex items-center">
                              <div className="w-20 relative">
                                <ToggleButton name="isSmallRun " id="isSmallRun " size="m" on="Active" off="Inactive" onChange={(e) => setFieldValue("isSmallRun", e.target.checked)} defaultValue={values?.isSmallRun} />
                              </div>
                            </div>
                          </div>
                          <div className={`flex items-center justify-between grid-cols-1 xl:grid-cols-2 gap-4`}>
                            {values?.isSmallRun && (
                              <>
                                <div className="w-1/2 relative grow">
                                  <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold"> Small Run Limit
                                    <span className="text-rose-500 text-2xl leading-none">*</span>
                                  </label>
                                  <div className="absolute w-10 h-10 mt-7 left-0 top-0 flex items-center justify-center">
                                    <span className="material-icons-outlined">
                                      attach_money
                                    </span>
                                  </div>
                                  <InputNumber
                                    className="appearance-none block w-full text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white pl-8"
                                    label="smallRunLimit" name={"smallRunLimit"} defaultValue={values?.smallRunLimit} displayError={true} onChange={(e) => setFieldValue(e.target.name, e.target.value)} maxLength={10}
                                    allowNegative={false} />
                                </div>
                                <div className="w-1/2 relative grow">
                                  <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold"> Small Run Fees Charges
                                    <span className="text-rose-500 text-2xl leading-none">*</span>
                                  </label>
                                  <div className="absolute w-10 h-10 mt-7 left-0 top-0 flex items-center justify-center">
                                    <span className="material-icons-outlined">
                                      attach_money
                                    </span>
                                  </div>
                                  <InputNumber
                                    className="appearance-none block w-full text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white pl-8"
                                    label="smallRunFeesCharges" name={"smallRunFeesCharges"} defaultValue={values?.smallRunFeesCharges} displayError={true} onChange={(e) => setFieldValue(e.target.name, e.target.value)} />
                                </div >
                              </>
                            )}
                          </div >
                          {/* <div className="flex items-center justify-between">
                            <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold"> Shipping Charges </label>
                            <div className="flex items-center">
                              <div className="w-20 relative">
                                <ToggleButton name="isShippingCharge " id="isShippingCharge " size="m" on="Active" off="Inactive" onChange={(e) => setFieldValue("isShippingCharge", e.target.checked)} defaultValue={values?.isShippingCharge} />
                              </div>
                            </div>
                          </div> */}
                          {/* {values?.isShippingCharge && (
                            <>
                              <div className="w-full grid grid-cols-2 gap-4" >
                                <div className={`flex items-center justify-between grid-cols-1 xl:grid-cols-3 gap-4`}>
                                  <RadioButton
                                    type="radio"
                                    name="GeneralType"
                                    value="isGeneral"
                                    id={'isGeneral'}
                                    onChange={(e) => {
                                      setValues((prev) => {
                                        return { ...prev, isGeneral: true, isFreeShipping: false, }
                                      });
                                    }}
                                    checked={values.isGeneral}
                                    label={'General'}
                                  />

                                  <RadioButton
                                    type="radio"
                                    name="isFreeShipping"
                                    value="isFreeShipping"
                                    id={'isFreeShipping'}
                                    onChange={(e) => {
                                      setValues((prev) => {
                                        return { ...prev, isGeneral: false, isFreeShipping: e.target.checked, }
                                      });
                                    }}
                                    checked={values.isFreeShipping}
                                    label={'Free Shipping'}
                                  />
                                </div>
                              </div>
                              <div className={`flex items-center justify-between grid-cols-1 xl:grid-cols-2 gap-4`}></div>
                              {values?.isShippingCharge && (
                                <div className={`flex items-center justify-between grid-cols-1 xl:grid-cols-2 gap-4`}>
                                  <div className="w-1/2 relative grow">
                                    {values?.isGeneral && (
                                      <div className={`flex items-center justify-between grid-cols-1 xl:grid-cols-2 gap-4`}>
                                        <div className="w-full relative grow">
                                          <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold">Free Shipping Amount</label>
                                          <div className="absolute w-10 h-10 mt-5 left-0 top-0 flex items-center justify-center">
                                            <span className="material-icons-outlined">
                                              attach_money
                                            </span>
                                          </div>
                                          <InputNumber
                                            className="appearance-none block w-full text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white pl-8"
                                            label="generalAmount" name={"generalAmount"} defaultValue={values?.generalAmount} displayError={true} onChange={(e) => setFieldValue(e.target.name, e.target.value)} maxLength={10}
                                            allowNegative={false} />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </>
                          )} */}
                        </div>
                      </div>
                    </div>

                    {/* Shipping Charges */}
                    <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                      <div className="block uppercase tracking-wide text-gray-500 text-lg font-bold mb-6">Shipping Charges Type</div>
                      <div className={`flex items-center justify-between gap-4`}>
                        <div className="w-full last:mb-0 mb-4 ">
                          <div class="grid grid-cols-2 gap-6 ">
                            <div class="w-full mb-2">
                              <div class="">
                                <RadioButton
                                  type="radio"
                                  name="shippingChargeType"
                                  value="0"
                                  id={'0'}
                                  onClick={(e) => {
                                    handleShippingChargeType(e, setFieldValue)
                                  }}
                                  checked={values.shippingChargeType == 0}
                                  label={'None'}
                                />
                                <RadioButton
                                  type="radio"
                                  name="shippingChargeType"
                                  value="1"
                                  id={'1'}
                                  onClick={(e) => {
                                    handleShippingChargeType(e, setFieldValue)
                                  }}
                                  checked={values.shippingChargeType == 1}
                                  label={'Range'}
                                />
                                <RadioButton
                                  type="radio"
                                  name="shippingChargeType"
                                  value="2"
                                  id={'2'}
                                  onClick={(e) => {
                                    handleShippingChargeType(e, setFieldValue)
                                  }}
                                  checked={values.shippingChargeType == 2}
                                  label={'Fix Charges'}
                                />
                                <RadioButton
                                  type="radio"
                                  name="shippingChargeType"
                                  value="3"
                                  id={'3'}
                                  onClick={(e) => {
                                    handleShippingChargeType(e, setFieldValue)
                                  }}
                                  checked={values.shippingChargeType == 3}
                                  label={'Runtime Charges'}
                                />
                              </div>
                              {values.shippingChargeType == 3 &&
                                <>
                                  <div className="w-full mt-4">
                                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">Shipping Services
                                      <span className="text-rose-500 text-2xl leading-none">*</span>
                                    </label>
                                    <Dropdown
                                      isMulti={true}
                                      hidecheckbox={false}
                                      defaultValue={values.shippingServiceId}
                                      name={"shippingServiceId"}
                                      options={ShippingServicesOptions}
                                    />
                                  </div>
                                  <div className="w-full mt-4">
                                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">Shipping Method Type
                                      <span className="text-rose-500 text-2xl leading-none">*</span>
                                    </label>
                                    <Dropdown
                                      isMulti={true}
                                      hidecheckbox={false}
                                      defaultValue={values.shippingMethod}
                                      name={"shippingMethod"}
                                      options={ShippingMethodTypes}
                                    // onChange={(ShippingObj) => handleShippingMethodChange(ShippingObj, setFieldValue, values)}
                                    />
                                  </div>
                                </>
                              }
                            </div>
                            <div class="w-full">
                              <label class="flex items-center leading-none">
                                <Checkbox
                                  className="mt-1"
                                  name="isFreeShipping"
                                  id="isFreeShipping"
                                  checked={values?.isFreeShipping}
                                  onChange={(e) =>
                                    setFieldValue(
                                      "isFreeShipping",
                                      e.target.checked
                                    )
                                  }
                                />
                                <span class="ml-1 mt-1">Free Shipping</span>
                              </label>
                              {values.isFreeShipping ?
                                <div className={`flex items-center justify-between grid-cols-1 xl:grid-cols-2 gap-4 mt-4`}>
                                  <div className="w-full relative grow">
                                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold">Free Shipping Minimum Amount
                                      <span className="text-rose-500 text-2xl leading-none">*</span>
                                    </label>
                                    <div className="absolute w-10 h-10 mt-7 left-0 top-0 flex items-center justify-center">
                                      <span className="material-icons-outlined">
                                        attach_money
                                      </span>
                                    </div>
                                    <InputNumber
                                      className="appearance-none block w-full text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white pl-8"
                                      label="generalAmount" name={"generalAmount"} defaultValue={values?.generalAmount} displayError={true} onChange={(e) => setFieldValue(e.target.name, e.target.value)} maxLength={10}
                                      allowNegative={false} />
                                  </div>
                                </div>
                                : ""
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Options */}
                    <div id="payby">
                      <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 mb-6 p-6">
                        <div className="block uppercase tracking-wide text-gray-500 text-lg font-bold mb-6">Pay By</div>
                        <div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {payBy.map((paybydata, index) => {
                              return (
                                <Fragment key={index}>
                                  <Input className="sr-only peer" type={`${"checkbox"}`} name={`paymentOption[${paybydata.name}]`}
                                    id={`paymentOption[${paybydata.name}]`}
                                    onChange={(e) => handleChangePaymentOption(e, setFieldValue, values, paybydata)}
                                    defaultValue={initialPayOptions && initialPayOptions[paybydata.id] && initialPayOptions[paybydata.id]}
                                  />
                                  <label htmlFor={`paymentOption[${paybydata.name}]`} className={` cursor-pointer block bg-white shadow-lg rounded-md border border-neutral-200 p-6 ${values?.paymentOption && values?.paymentOption[paybydata.name] && values?.paymentOption[paybydata.name]["valBool"] && "peer-checked:border-green-500"}`}>
                                    <div>
                                      <div className="font-semibold">{paybydata.name}</div>
                                    </div>
                                  </label>
                                </Fragment>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Child Store */}
                    {(ChildStoreBrands?.length > 0 && !isAddMode) &&
                      <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                        <div className="block uppercase tracking-wide text-gray-500 text-lg font-bold mb-6">Child Store Brands</div>
                        <div className={`flex items-center justify-between gap-4`}>
                          <div className="w-full last:mb-0 mb-4 ">
                            <div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {ChildStoreBrands?.length > 0 && ChildStoreBrands.map((StoreData, index) => {
                                  return (
                                    <label htmlFor={`${StoreData?.storeName}`} className={`block bg-white shadow-lg rounded-md border border-neutral-200 p-6`}>
                                      <div>
                                        <div className="font-semibold">Store Name : {StoreData?.storeName}</div>
                                        Brand Name :
                                        {StoreData?.storeParentBrandViewModel?.length > 0 && StoreData?.storeParentBrandViewModel.map((BrandsData, index) => {
                                          return (
                                            <label htmlFor={`${BrandsData?.brandName}`} className={`block bg-white shadow-lg rounded-md border border-neutral-200 p-2 `}>
                                              <div>
                                                <div className="font-semibold">{BrandsData?.brandName}</div>
                                              </div>
                                            </label>
                                          );
                                        })}
                                      </div>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    }

                    {/* Punchout Message */}
                    <div id="punchoutMessage">
                      <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                        <div className="w-full mb-6 last:mb-0">
                          <label className="block uppercase tracking-wide text-gray-500 text-lg font-bold mb-6">
                            Punchout Message
                          </label>
                          <CKEditor
                            name={"punchoutMessage"}
                            id="punchoutMessage"
                            maxLength={350}
                            defaultValue={values.punchoutMessage}
                            loading={data.punchoutMessage}
                          />
                        </div>
                      </div>
                    </div>
                  </div >
                </div >
              </div >
            </FormikForm >
          );
        }}
      </Formik >
    </>
  );
}

export default Create;