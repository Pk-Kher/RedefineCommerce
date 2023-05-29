/*Component Name: Inventory
Component Functional Details:  Inventory .
Created By: PK Kher
Created Date: 6-24-2022
Modified By: chandan
Modified Date: 6-24-2022 */

import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  Fragment,
} from "react";
import Input from "components/common/formComponent/Input";
import { Formik, Form, useFormikContext } from "formik";
import DatePicker from "components/common/formComponent/DatePicker";
import { productType } from "dummy/Dummy";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { useDispatch, useSelector } from "react-redux";
import { serverError } from "services/common/helper/Helper"
import * as Yup from "yup";
import { DateTimeFormat } from "services/common/helper/Helper";
import StoreInventoryService from "services/admin/masterCatalog/store/product/InventoryService";
import MasterInventoryService from "services/admin/masterCatalog/masterCatalog/products/InventoryService";
import MasterVendorSKUMappingService from "services/admin/masterCatalog/masterCatalog/VendorSKUMappingService";
import StoreVendorSKUMappingService from "services/admin/masterCatalog/store/product/VendorSKUMapping";
import { defaultImage, RecStatusValuebyName } from "global/Enum";
import SingleFieldUpdateService from "services/admin/masterCatalog/masterCatalog/products/SingleFieldUpdateService";
import Dropdown from "components/common/formComponent/Dropdown";
import TableLoading from "components/common/table/TableLoading";
import { ValidationMsgs } from "global/ValidationMessages";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const Inventory = ({
  displayFieldElement,
  fetchFieldProperty,
  fields,
  values,
  setFormSubmit,
  setIsError,
  activeTab,
  index,
  type,
  productId,
  setModalInfo,
  setOpenBasicModal,
  requiredFields,
  checkProductStatus,
  productstatusVal,
  readOnly, setSaveLoading
}) => {
  const formRef = useRef();
  const [SelectedVendor, setSelectedVendor] = useState("0");
  const [APIData, setAPIData] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  const API = (type == productType.MC ? MasterInventoryService : StoreInventoryService);
  const [loading, setLoading] = useState(false);

  const location = useSelector((store) => store?.location);
  const dispatch = useDispatch();
  const getInventoryData = useCallback(() => {
    setLoading(true);
    API.getInventory(productId, SelectedVendor)
      .then((res) => {
        var response = res.data;
        setAPIData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });

  }, [productId, SelectedVendor,]);

  useEffect(() => {
    getInventoryData();
  }, [productId, SelectedVendor]);

  const convertSingleArray = useCallback((value) => {
    let temp = {};
    let temp1 = {};
    value.map((data) => {
      temp1 = { ...temp1, id: data.id == null ? 0 : data.id, attributeCombinationId: data.attributeCombinationId, image: data?.image, varientName: data?.varientName, sku: data?.sku, quantity: data?.quantity == null ? 0 : data.quantity, recStatus: data?.recStatus || RecStatusValuebyName.Active, rowVersion: data?.rowVersion || null, subRows: value?.subRows, futureInventoryList: data.futureInventoryList || [] };

      if (data.subRows) {
        temp = {
          ...temp,
          [data.attributeCombinationId]: temp1,
          ...convertSingleArray(data.subRows),
        };
      } else {
        temp = { ...temp, [data.attributeCombinationId]: temp1 };
      }
      return "";
    });
    return temp;
  }, []);
  useEffect(() => {
    setInitialValues(() => {
      let temp = {};
      let main = {};
      APIData?.map((value) => {
        main = { ...main, id: value.id == null ? 0 : value.id, attributeCombinationId: value.attributeCombinationId, quantity: value?.quantity == null ? 0 : value.quantity, recStatus: value?.recStatus || RecStatusValuebyName.Active, rowVersion: value?.rowVersion || null, subRows: value?.subRows, futureInventoryList: value.futureInventoryList || [] };
        if (value.subRows) {
          var rows = { ...main };
          delete rows.subRows;
          temp = {
            ...temp,
            [value.attributeCombinationId]: rows,
            ...convertSingleArray(main.subRows),
          };
        } else {
          temp = { ...temp, [value.attributeCombinationId]: main };
        }
        return "";
      });
      return { productfutureinventorymodel: temp };
    });
  }, [APIData]);

  const [FutureInventoryLength, setFutureInventoryLength] = useState([]);
  useEffect(() => {
    setFutureInventoryLength(() => {
      var temp = [];
      APIData?.map((value) => {
        value.subRows.map((subRow) => {
          if (temp.length < subRow.futureInventoryList.length) {
            temp = subRow.futureInventoryList;
          }
        });
        return temp;
      });
      return temp.length > 0 ? temp : [1];
    });
  }, [APIData]);

  // form related
  const [checkerror, setCheckError] = useState(false);

  useEffect(() => {
    setIsError(checkerror);
  }, [checkerror]);

  useEffect(() => {
    if (activeTab == index) {
      setFormSubmit(formRef.current);
    }
  }, [formRef, setFormSubmit, activeTab]);

  const submitHandler = (fields, { resetForm }) => {
    let Obj = []
    let temp = {}
    let finalObj = {}
    Object.keys(fields.productfutureinventorymodel).map((value, key) => {
      if (fields.productfutureinventorymodel[value]?.futureInventoryList && fields.productfutureinventorymodel[value]?.futureInventoryList?.length > 0) {
        let futureInventoryList = [];
        fields.productfutureinventorymodel[value]?.futureInventoryList.map((row, index) => {
          if (row.id === undefined) {
            futureInventoryList = [...futureInventoryList, { ...row, id: 0, rowVersion: null }];
          }
          else {
            futureInventoryList = [...futureInventoryList, { ...row }]
          }
        })
        Obj = [...Obj, { ...fields.productfutureinventorymodel[value], ...location, futureInventoryList: futureInventoryList }];
      }
      else {
        Obj = [...Obj, { ...fields.productfutureinventorymodel[value], ...location }];
      }
    })
    finalObj = { productId: productId, vendorId: SelectedVendor, productfutureinventorymodel: Obj }

    dispatch(setAddLoading(true))
    API.addUpdateInventory(finalObj).then((response) => {
      if (response.data.success) {
        dispatch(
          setAlertMessage({
            type: "success",
            message: ValidationMsgs.masterCatalog.inventory.created,
          })
        );
        dispatch(setAddLoading(false))
        const obj = [
          {
            path: `/ecomSafetyQty`,
            op: "Replace",
            value: fields.ecomSafetyQty || 0
          }
        ]

        getInventoryData()
        SingleFieldUpdateService.updateSingleField(productId, obj).then((response) => {
          if (response.data.success) {
            dispatch(
              setAlertMessage({
                type: "success",
                message: ValidationMsgs.masterCatalog.inventory.Updated,
              })
            );
            dispatch(setAddLoading(false))
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
                message: ValidationMsgs.masterCatalog.inventory.NotUpdated,
              })
            );
            dispatch(setAddLoading(false))
          });
      } else {
        dispatch(setAlertMessage({ type: "danger", message: serverError(response) }));
        dispatch(setAddLoading(false))
      }
    })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.masterCatalog.inventory.notCreated,
          })
        );
        dispatch(setAddLoading(false))
        getInventoryData()
      });

    // resetForm({});
  };
  const schema = Yup.object().shape({
    productfutureinventorymodel: Yup.object().shape({
      ...(() => {
        var validations = {};
        var validationData = initialValues.productfutureinventorymodel
          ? Object.keys(initialValues.productfutureinventorymodel)
          : [];
        validationData.map((v, i) => {
          validations = {
            ...validations,
            [v]: Yup.object().shape({
              [fetchFieldProperty("dbfield", "sku")]:
                displayFieldElement(fields, "sku") && null,
            }),
          };
        });
        return validations;
      })(),
    }),
  });
  return (
    <>
      <div className="w-full px-6 pt-6 flex flex-wrap items-center justify-between">
        <div className="grow uppercase tracking-wide text-gray-500 text-lg font-bold">
          Inventory
        </div>
      </div>

      <div className="pb-5">
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...initialValues,
            productstatus: productstatusVal,
            ecomSafetyQty: values.ecomSafetyQty || 0,
          }}
          innerRef={formRef}
          onSubmit={submitHandler}
          validationSchema={schema}
        >
          {({ errors, setFieldValue, values }) => {
            setCheckError(Object.keys(errors).length ? true : false);
            checkProductStatus(errors);
            return (
              <Form>
                <Input type="hidden" name="productstatus" id="productstatus" />
                <div className="px-6 pt-6">
                  <div className="w-full mb-6 last:mb-0">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                      Ecomm Safety Qty
                      <span className="text-rose-500 text-2xl leading-none"></span>
                    </label>
                    <Input type="text" name="ecomSafetyQty" defaultValue={values.ecomSafetyQty}
                      disabled={readOnly} />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 p-6">
                  <div className="grow relative">
                    {" "}
                    <div className="absolute h-10 mt-0 left-0 top-0 flex items-center">
                      {/* <svg
                        className="h-4 pl-4 fill-current text-gray-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z">
                          {" "}
                        </path>
                      </svg> */}
                    </div>
                    {/* <input
                      id="search-toggle"
                      type="search"
                      placeholder="search"
                      className="block w-full bg-[#f7f7fa] border-neutral-200 hover:border-neutral-300 focus:border-neutral-100 focus:ring-neutral-300 focus:shadow-lg pl-10 pr-2 py-2 rounded-md"
                    /> */}
                  </div>
                  <div className="">
                    <VendorDropdown productId={productId} setSelectedVendor={setSelectedVendor} SelectedVendor={SelectedVendor} type={type} />
                  </div>
                </div>
                <div className=" max-h-screen border-t border-neutral-200">
                  <table className="table-auto w-full text-sm text-[#191919] font-semibold h-px justify-between">
                    <thead className="text-sm font-bold uppercase text-[#b3b3b3] border-b border-neutral-200">
                      <tr className="relative">
                        <th className="h-full">
                          <div className="flex items-center h-full px-2 py-3 border-r border-neutral-200">
                            {" "}
                          </div>
                        </th>

                        <th className=" h-full px-2 py-3 border-r border-neutral-200" colSpan="2">
                          <div className="font-semibold text-left flex w-48 items-center">
                            <span>Variants</span>
                          </div>
                        </th>
                        <th className=" h-full px-2 py-3 border-r border-neutral-200">
                          <div className="font-semibold text-left flex w-48 items-center">
                            <span>SKU</span>
                          </div>
                        </th>
                        <th className="h-full px-2 py-3 border-r border-neutral-200 relative">
                          <div className="font-semibold text-left flex w-48 max-w-md items-center ">
                            {(!readOnly && SelectedVendor > 0) && <span
                              onClick={() =>
                                setFutureInventoryLength((prev) => [
                                  1,
                                  ...prev,
                                ])
                              }
                              className="cursor-pointer absolute -right-2.5 top-0 bg-indigo-500 rounded-md text-white w-5 h-5 inline-flex items-center justify-center"
                            >
                              <span className="material-icons-outlined text-sm">
                                add
                              </span>
                            </span>}
                            <span>QUantity</span>
                          </div>
                        </th>
                        {FutureInventoryLength.map((value, index) => {
                          return (
                            <Fragment key={index}>
                              <th className="h-full px-2 py-3 border-r border-neutral-200">
                                <div className="font-semibold text-left flex w-72 max-w-md items-center ">
                                  <span>Future Inventory Date</span>
                                </div>
                              </th>
                              <th className="h-full px-2 py-3 border-r border-neutral-200">
                                <div className="font-semibold text-left flex w-56 max-w-md items-center relative ">
                                  <span>Future Inventory</span>
                                </div>
                              </th>
                            </Fragment>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? <tr>
                        <td colSpan={7} className={`px-2 first:pl-5 py-3 w-px`}>
                          <TableLoading />
                        </td>
                      </tr> : APIData?.map((inventory, index) => {
                        return (
                          <TR
                            displayFieldElement={displayFieldElement}
                            fields={fields}
                            inventory={inventory}
                            SelectedVendor={SelectedVendor}
                            index={index}
                            key={index}
                            FutureInventoryLength={FutureInventoryLength}
                            readOnly={readOnly}
                          />
                        );
                      })}
                    </tbody>
                  </table>
                  {(!loading && APIData && APIData.length <= 0) && <p className="flex justify-center items-center p-5 rounded-t border-b sticky top-0 left-0 text-red-600 bg-white">No data found as of now.</p>}
                  {/* {loading ? <TableLoading /> : ''} */}
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </>
  );
};

export default Inventory;

const TR = ({
  inventory,
  index,
  FutureInventoryLength,
  displayFieldElement,
  fields,
  SelectedVendor,
  readOnly
}) => {
  const [showChild, setShowChild] = useState(false);
  const { values, setFieldValue } = useFormikContext();
  return (
    <>
      <tr role={`row`}>
        <td className="px-2 first:pl-5 py-3">
          <div className="">
            <div
              className="leading-none w-6 h-6 cursor-pointer transition-all variant-arrow"
              onClick={() => {
                setShowChild((prev) => !prev);
              }}
            >
              <span className="material-icons-outlined select-none">
                {showChild ? "remove" : "add"}
              </span>
            </div>
          </div>
        </td>
        <td className="px-2 first:pl-5 py-3">
          <div className="">
            <img
              className="h-10 w-10 mr-4"
              src={`${process.env.REACT_APP_API_BLOB}${inventory.varientImage}`}
            />
          </div>
        </td>
        <td className="px-2 first:pl-5 py-3">
          <div className="">
            <a href="mc-add-options.html" className="font-medium leading-10">
              {inventory.varientName}
            </a>
          </div>
        </td>

        <td className="px-2 first:pl-5 py-3">
          <div className="">
            {inventory.sku}
          </div>
        </td>
        <td className="px-2 first:pl-5 py-3">
          <div className=""></div>
        </td>
        <td className="px-2 first:pl-5 py-3">
          <div className=""></div>
        </td>
        <td className="px-2 first:pl-5 py-3">
          <div className=""></div>
        </td>
      </tr>
      {showChild && (
        <>
          {inventory.subRows.map((value, index) => {
            return (
              <>
                <tr key={index}>
                  <td className="px-2 first:pl-5 py-3">
                    {" "}
                    <div className=""> </div>{" "}
                  </td>
                  <td className="px-2 first:pl-5 py-3">
                    <div className="">
                      <img
                        className="h-10 w-10 mr-4"
                        src={value.varientImage ? `${process.env.REACT_APP_API_BLOB}${value.varientImage}` : { defaultImage }}
                      />
                    </div>
                  </td>
                  <td className="px-2 first:pl-5 py-3">
                    <div className="">
                      <span className="font-medium leading-10">
                        {values.productfutureinventorymodel[value.attributeCombinationId].varientName}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 first:pl-5 py-3">
                    <span className="font-semibold leading-10">
                      {values.productfutureinventorymodel[value.attributeCombinationId].sku}
                    </span>
                  </td>
                  <td className="px-2 first:pl-5 py-3">
                    <div className="">
                      {readOnly || SelectedVendor == 0 ? (values?.productfutureinventorymodel ? values?.productfutureinventorymodel[value.attributeCombinationId]?.quantity : '') :
                        <Input
                          type="text"
                          defaultValue={values.quantity}
                          name={`productfutureinventorymodel.${value.attributeCombinationId}.quantity`}
                          onBlur={(e) => {
                            setFieldValue(
                              `productfutureinventorymodel[${value.attributeCombinationId}].quantity`,
                              e.target.value === "" ? "0" : e.target.value
                            );
                          }}
                          value={values?.productfutureinventorymodel ? values?.productfutureinventorymodel[value.attributeCombinationId]?.quantity : ''} onChange={(e) => { setFieldValue(`productfutureinventorymodel.${value.attributeCombinationId}.quantity`, e.target.value) }}
                        />}
                    </div>
                  </td>
                  {FutureInventoryLength.map((v, index) => {
                    return (
                      <Fragment key={index}>
                        <>
                          <td className="px-2 first:pl-5 py-3">
                            <Input type="hidden" name={`productfutureinventorymodel[${value.attributeCombinationId}].futureInventoryList.${index}.id`} value={values.productfutureinventorymodel[value.attributeCombinationId]?.futureInventoryList[index] ? values.productfutureinventorymodel[value.attributeCombinationId]?.futureInventoryList[index].id : 0} />
                            <Input type="hidden" name={`productfutureinventorymodel[${value.attributeCombinationId
                              }].futureInventoryList.${index}.rowVersion`} value={values.productfutureinventorymodel[value.attributeCombinationId]?.futureInventoryList[index] ? values.productfutureinventorymodel[value.attributeCombinationId]?.futureInventoryList[index].rowVersion : null} />

                            <div className="">
                              {readOnly || SelectedVendor == 0 ? (values.productfutureinventorymodel[value.attributeCombinationId].futureInventoryList[index] ?
                                DateTimeFormat(values.productfutureinventorymodel[value.attributeCombinationId].futureInventoryList[index].futureInventryDate) : '').date :
                                <DatePicker
                                  defaultValue={
                                    values.productfutureinventorymodel[value.attributeCombinationId].futureInventoryList[index] ? values.productfutureinventorymodel[value.attributeCombinationId].futureInventoryList[index].futureInventryDate
                                      : ""
                                  }
                                  name={`productfutureinventorymodel[${value.attributeCombinationId
                                    }].futureInventoryList.${index
                                    }.futureInventryDate`}
                                  minDate={new Date()}
                                />
                              }
                            </div>
                          </td>
                          <td className="px-2 first:pl-5 py-3">
                            <div className="">
                              {readOnly || SelectedVendor == 0 ? (values.productfutureinventorymodel[value.attributeCombinationId].futureInventoryList[index] ?
                                (values.productfutureinventorymodel[value.attributeCombinationId].futureInventoryList[index].futureInventryQty) : '') :
                                <Input
                                  defaultValue={
                                    values.productfutureinventorymodel[value.attributeCombinationId].futureInventoryList[index] ? values.productfutureinventorymodel[value.attributeCombinationId]?.futureInventoryList[index].futureInventryQty
                                      : ""
                                  }
                                  name={`productfutureinventorymodel[${value.attributeCombinationId
                                    }].futureInventoryList.${index
                                    }.futureInventryQty`}
                                />
                              }
                            </div>
                          </td>

                        </>
                      </Fragment>
                    );
                  })}
                </tr>
              </>
            );
          })}
        </>
      )}
    </>
  );
};

const VendorDropdown = React.memo(({ productId, SelectedVendor, setSelectedVendor, type }) => {

  const VendorAPI = (type == productType.MC ? MasterVendorSKUMappingService : StoreVendorSKUMappingService)
  const [vendors, setVendors] = useState([]);
  const getVendorDropdownData = useCallback(() => {
    VendorAPI.getVendorListByProductId(productId).then((res) => {
      if (res.data.success) {
        setVendors((prev) => {
          return [
            { label: "All Vendors", value: "0" }, ...res.data.data.map((value, key) => {
              return { label: value.vendorName, value: value.id }
            })
          ];
        })
      }
    });
  }, []);
  useEffect(() => {
    getVendorDropdownData();
  }, [getVendorDropdownData]);
  return (
    <div className="">
      <Dropdown options={vendors}
        onChange={(e) => {
          if (e) {
            setSelectedVendor(
              e.value
            );
          }
          else {
            setSelectedVendor(0);
          }
        }}
        defaultValue={SelectedVendor}
        isClearable={false}
        classNames={'w-48'}
      />
    </div>
  );
});
