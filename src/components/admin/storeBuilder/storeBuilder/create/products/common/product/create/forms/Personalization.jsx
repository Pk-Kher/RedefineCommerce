/*Component Name: Personalization
Component Functional Details: User can create or update Personalization master details from here.
Created By: Vikas Patel
Created Date: -
Modified By: chandan 
Modified Date: 02-09-2022 */

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { Formik } from "formik";

import Image from "components/common/formComponent/Image";
import ReactTable from "components/common/table/ReactTableServerSide";
import Actions from "components/common/others/admin/Action";
import ToggleButton from "components/common/formComponent/ToggleButton";
import Dropdown from "components/common/formComponent/Dropdown";
import { productType } from "dummy/Dummy";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { paginationDetails, defaultImage, RecStatusValuebyName } from "global/Enum";
import BasicModal from "components/common/modals/Basic";
import MasterProductService from "services/admin/masterCatalog/masterCatalog/products/ProductService";
import StoreProductService from "services/admin/masterCatalog/store/product/ProductService";
import { ValidationMsgs } from "global/ValidationMessages";
import MasterLocation from "services/admin/masterCatalog/masterCatalog/products/LocationService"
import StoreLocation from "services/admin/masterCatalog/store/product/LocationService"
import { serverError } from "services/common/helper/Helper";
import LogoLocationService from "services/admin/logolocation/LogoLocationService";
import Status from "components/common/displayStatus/Status";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { useMemo } from "react";

const Personalization = ({
  setIsError,
  requiredFields,
  setFormSubmit,
  activeTab,
  index,
  fields,
  displayFieldElement,
  checkProductStatus,
  productstatusVal,
  fetchFieldProperty,
  values,
  type,
  readOnly,
  getProductData,
  setSaveLoading
}) => {
  const API = (type == productType.MC ? MasterProductService : StoreProductService);
  const Location = (type == productType.MC ? MasterLocation : StoreLocation);
  const formRef = useRef();
  const { id: productId } = useParams();
  const dispatch = useDispatch();

  const [ModalInfo, setModalInfo] = useState({});
  const [openBasicModal, setOpenBasicModal] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(values.personalizedCategoryId || "");

  const [loading, setLoading] = useState(false);
  const [Data, setData] = useState([]);
  const location = useSelector((store) => store?.location);

  const [checkerror, setCheckError] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filteringOptions, setColumnFilteringOptions] = useState([]);
  const [paginationData, setPaginationData] = useState({
    paginationDetails,
  });

  const COLUMNS = [
    {
      id: "name",
      Header: "Name",
      accessor: "name",
      Footer: "name",
      column_name: "name",
    },
    {
      id: "imageUrl",
      Header: "Location Image",
      accessor: "imageUrl",
      column_name: "imageUrl",
      Cell: ({ value, row }) => {
        return <>
          <div className="px-2 first:pl-5 py-3">
            <div className="flex items-center">
              <Image
                src={value ? value : defaultImage}
                className="rounded-lg h-20 w-20 align-middle border-none"
                alt={"logoLocationImage"}
              />
            </div>
          </div>
        </>
      },
    },
    {
      id: "threeDImageURL",
      Header: "3D Image",
      accessor: "threeDImageURL",
      Footer: "3DImage",
      column_name: "threeDImageURL",
      Cell: ({ value, row }) => {
        return <div className="px-2 first:pl-5 py-3">
          <div className="flex items-center">
            <Image
              src={
                value
                  ? value
                  : defaultImage
              }
              className="rounded-lg align-middle border-none h-20 w-20"
              alt={"threeDImage"}
            />
          </div>
        </div>
      },
    },
    {
      id: "logolocationclass",
      Header: "Logo-location Class",
      accessor: "threeDLogoLocationClass",
      Footer: "Logo-location Class",
      column_name: "logolocationclass",

    },
    {
      id: "ourcost",
      Header: "Our Cost($)",
      accessor: "cost",
      Footer: "Our Cost($)",
      column_name: "ourcost",
    },
    {
      id: "ourprice",
      Header: "Our Price ($)",
      accessor: "price",
      Footer: "Our Price ($)",
      column_name: "ourprice",

    },
    {
      id: "brandguidelines",
      Header: "Brand Guidelines",
      accessor: "brandGuidelines",
      Footer: "Brand Guidelines",
      column_name: "brandguidelines",
      Cell: ({ value }) => {
        return value ? (
          <>
            {value.brandGuidelines && <div className="">{`${value.brandGuidelines}`}</div>}
          </>
        ) : (
          "-"
        );
      },
    },
    {
      id: "status",
      Header: "Status",
      accessor: "recStatus",
      Footer: "Brand Guidelines",
      column_name: "status",
      Cell: ({ value }) => {
        return <Status type={value} />;
      },
    },

    {
      id: "action",
      Header: "",
      accessor: "id",
      column_name: "action",
      Cell: ({ value, row }) => {
        // console.log(selectedCategoryId === values.categoryId, selectedCategoryId, values.categoryId);
        return (
          selectedCategoryId === values?.personalizedCategoryId ? <Actions
            id={value}
            row={row}
            moduleName="Personalization"
            setModalInfo={setModalInfo}
            setOpenBasicModal={setOpenBasicModal}
            hideAction={["delete"]}
          /> : ''
        );
      },
      disableSortBy: true,
      disableShowHide: true,
    },
  ]
  const setSortingOptionHandler = (column, direction) => {
    setSortingOptions([
      {
        field: column,
        direction: direction,
        priority: 0,
      },
    ]);
  };

  const setPaginationDataFunc = (key, value) => {
    setPaginationData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };
  useEffect(() => {
    if (activeTab == index) {
      setFormSubmit(formRef.current);
    }
  }, [formRef, setFormSubmit, activeTab]);

  const schema = Yup.object({
    personalizedCategoryId:
      displayFieldElement(fields, "personalization") &&
        requiredFields.indexOf("personalization") > -1
        ? Yup.string().required(ValidationMsgs.masterCatalog.personalization.personalizationRequired)
        : null,
    isEnableLogolocation: Yup.string().required(ValidationMsgs.common.productstatus),
  });

  //Dropdown for Get SizeChart Id and Values
  useEffect(() => {
    API.getCategoryByBrand(values.brandId).then((response) => {
      if (response?.data?.data) {
        setCategoryOptions(() => {
          return response.data.data.map((value, key) => {
            return { label: value.name, value: value.id };
          })
        })
      }
    }).catch((response) => {
      console.log(response);
    })

  }, []);

  useEffect(() => {
    setIsError(checkerror);
  }, [checkerror]);


  const submitHandler = (values, { resetForm }) => {
    let ourCurrentModuleName = (type == productType.MC ? MasterProductService : StoreProductService)
    const ourReqObj = [
      {
        "path": "/isEnableLogolocation",
        "op": "Replace",
        "from": "",
        "value": values.isEnableLogolocation
      },
      {
        "path": "/personalizedCategoryId",
        "op": "Replace",
        "from": "",
        "value": values.personalizedCategoryId
      }
    ]
    dispatch(setAddLoading(true))
    ourCurrentModuleName.updateProductOtherFields(productId, ourReqObj)
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.masterCatalog.personalization.updated,
            })
          );
          getProductData();
          resetForm({});
          dispatch(setAddLoading(false))
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
            message: ValidationMsgs.masterCatalog.personalization.notUpdated,
          })
        );
        dispatch(setAddLoading(false))
      });
  };

  const [sortingOptions, setSortingOptions] = useState([
    {
      field: "firstname",
      direction: 0,
      priority: 0,
    },
  ]);

  const getPersonalizationData = useCallback(() => {
    if (selectedCategoryId) {
      Location.getLogoLocations({
        productId: values.id,
        categoryId: selectedCategoryId,
        brandId: values.brandId,
        args: {
          pageIndex: 0,
          pageSize: 0,
          pagingStrategy: 0,
        }
      })
        .then((res) => {
          var response = res?.data;
          if (response?.success) {
            setData(response.data);
          }
        })
        .catch((err) => { });
    }
  }, [selectedCategoryId]);
  useEffect(() => {
    getPersonalizationData();
  }, [selectedCategoryId]);


  const handleSort = (sortValue) => { };

  // Need to change the Brand Service as per the Page API
  const statusChangedHandler = (data) => {
    dispatch(setAddLoading(true))
    if (!data.id) {
      Location.create({
        productLocationModel: {
          id: 0,
          rowVersion: "",
          recStatus: data.changeStatus,
          productId: values.id,
          categoryId: selectedCategoryId,
          brandId: values.brandId,
          locationdetailId: data.logoLocationDetailId,
          ...location
        }
      }).then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.logoLocationDetails.logoLocationStatusUpdated,
            })
          );
          setOpenBasicModal(false);
          dispatch(setAddLoading(false))
          getPersonalizationData()
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
        }
      }).catch((error) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.logoLocationDetails.logoLocationStatusNotUpdated,
          })
        );
        dispatch(setAddLoading(false))
      })
    } else {
      Location.update({
        productLocationModel: {
          id: data.id,
          rowVersion: data.rowVersion,
          recStatus: data.changeStatus,
          productId: values.id,
          categoryId: selectedCategoryId,
          brandId: values.brandId,
          locationdetailId: data.logoLocationDetailId,
          ...location
        }
      }).then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.logoLocationDetails.logoLocationStatusUpdated,
            })
          );
          dispatch(setAddLoading(false))
          getPersonalizationData()
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
        }
      }).catch((error) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.logoLocationDetails.logoLocationStatusNotUpdated,
          })
        );
        dispatch(setAddLoading(false))
      })
    }
    setOpenBasicModal(false);
    const { browser, ...allLocationObj } = location;
    const object = {
      id: data.id,
      status: data.recStatus === RecStatusValuebyName.Active ? RecStatusValuebyName.Inactive : data.recStatus === RecStatusValuebyName.Inactive ? RecStatusValuebyName.Active : RecStatusValuebyName.Inactive,
      rowVersion: data.rowVersion,
    };
    LogoLocationService.updateLogoLocationDetailStatus({
      ...object,
      ...allLocationObj,
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.logoLocationDetails.logoLocationStatusUpdated,
            })
          );
          setOpenBasicModal(false);
          getPersonalizationData()
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
            message: ValidationMsgs.logoLocationDetails.logoLocationStatusNotUpdate,
          })
        );
        setOpenBasicModal(false);
      });
    setOpenBasicModal(false);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          personalizedCategoryId: values?.personalizedCategoryId || 0,
          isEnableLogolocation: values?.isEnableLogolocation || false,
        }}
        validationSchema={schema}
        onSubmit={submitHandler}
        innerRef={formRef}
      >
        {({ setFieldValue, errors, values }) => {
          setCheckError(Object.keys(errors).length ? true : false);
          checkProductStatus(errors);
          return (
            <>
              <title>Personalization</title>
              <div className=" w-full ">
                <div className="w-full">
                  {/* Title */}
                  <div className="flex flex-wrap p-6 pb-5 pt-5 gap-4 items-center">
                    <div className="flex items-center">
                      DO YOU WANT ENABLE LOGO LOCATION FOR THIS PRODUCT?
                    </div>
                    <div className="flex items-center">
                      <ToggleButton
                        onChange={(e) => setFieldValue('isEnableLogolocation', e.target.checked)}
                        id="isEnableLogolocation"
                        defaultValue={values.isEnableLogolocation}
                        name="isEnableLogolocation"
                        disabled={readOnly}
                      />
                    </div>
                  </div>

                  {values.isEnableLogolocation && (
                    <div>
                      {displayFieldElement(fields, "personalization") && (
                        <>
                          <div className="p-6 pt-1 gap-4 items-center">
                            <div className="mb-3">
                              SELECT CATEGORY
                              {requiredFields.indexOf("personalization") >= 0 && (
                                <>
                                  <span className="text-rose-500 text-2xl leading-none">
                                    *
                                  </span>
                                </>
                              )}
                            </div>
                            <Dropdown
                              label="personalization"
                              isMulti={false}
                              name={fetchFieldProperty(
                                "dbfield",
                                "personalization"
                              )}
                              options={categoryOptions}
                              isSearchable={true}
                              defaultValue={values.personalizedCategoryId}
                              onChange={(data) => {
                                if (data) {
                                  setSelectedCategoryId(data?.value);
                                  setFieldValue("personalizedCategoryId", data.value);
                                } else {
                                  setSelectedCategoryId("");
                                  setFieldValue("personalizedCategoryId", "");
                                }
                              }}
                              diDisabled={readOnly}
                            />
                            <ReactTable
                              COLUMNS={COLUMNS}
                              DATA={Data}
                              hasNextPage={paginationData.hasNextPage}
                              hasPreviousPage={paginationData.hasPreviousPage}
                              pageIndex={paginationData.pageIndex}
                              // setPageIndex={(value) =>
                              //   setPaginationDataFunc("pageIndex", value)
                              // }
                              pageSize={25}
                              // setTablePageSize={(value) =>
                              //   setPaginationDataFunc("pageSize", value)
                              // }
                              totalCount={paginationData.totalCount}
                              fetchData={getPersonalizationData}
                              sortingOptions={sortingOptions}
                              setSortingOptions={setSortingOptionHandler}
                              hiddenColumns={["rowSelection"]}
                              loading={loading}
                              handleSort={handleSort}
                              filteringOptions={filteringOptions}
                              setColumnFilteringOptions={
                                setColumnFilteringOptions
                              }
                              selectedRows={selectedRows}
                              displaySearch={false}

                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

            </>
          );
        }}
      </Formik>

      <BasicModal
        handleConfirmation={statusChangedHandler}
        openModal={openBasicModal}
        setOpenModal={setOpenBasicModal}
        {...ModalInfo}
      />
    </>
  );
};

export default Personalization;
