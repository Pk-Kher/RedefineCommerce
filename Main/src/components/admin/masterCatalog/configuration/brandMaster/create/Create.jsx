import { Formik, Form as FormikForm } from "formik";
import React, { useState, useEffect, useCallback } from "react";
import * as Yup from "yup";
import BrandService from "services/admin/brand/BrandService";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Input from "components/common/formComponent/Input";
import Dropdown from "components/common/formComponent/Dropdown";
import DropdownService from "services/common/dropdown/DropdownService";
import ImageFile from "components/common/formComponent/ImageFile";
import CKEditor from "components/common/formComponent/CKEditor";
import Catalog from "./Catalog";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import Messages from "components/common/alerts/messages/Index";
import { useNavigate } from "react-router-dom";
import { RecStatusValue, RecStatusValuebyName, blobFolder } from "global/Enum";
import { useDispatch, useSelector } from "react-redux";
import { ValidationMsgs } from "global/ValidationMessages";
import { serverError } from "services/common/helper/Helper";
import SidebarStoreList from "components/common/others/admin/Store/SidebarStoreList";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const Create = () => {
  const permission = useSelector(store => store.permission);
  const { id } = useParams();
  const isAddMode = !id;
  const [vendors, setVendors] = useState([]);
  const [initialVendors, setInitialVendor] = useState([]);
  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);
  const CompanyId = useSelector((store) => store?.CompanyConfiguration.id)
  const FolderPath = `/${blobFolder.temp}/${CompanyId}/${blobFolder.brand}`
  const [data, setData] = useState({});
  const [activeUPC, setActiveUPC] = useState(10);
  const [missingUPC, setMissingUPC] = useState(20);
  const [totalProduct, setTotalProduct] = useState(30);
  const [storeType, setStoreType] = useState([]);
  const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

  const navigate = useNavigate();

  const getVendorDropdownData = useCallback(() => {
    DropdownService.getDropdownValues(
      "vendor").then((res) => {
        if (res.data.success) {
          setVendors(() => {
            return res.data.data;
            // return Object.keys(res.data.data).map((value, key) => {
            //   return { label: res.data.data[value], value: value }
            // })
          });
        }
      });
  }, []);

  const getBrandData = useCallback(() => {
    if (id) {
      dispatch(setAddLoading(true))

      BrandService.getBrandById(id)
        .then((res) => {
          var response = res.data;
          if (response.success) {
            setInitialVendor(response.data.vendorList);
            setData({
              id: response.data.id,
              name: response.data.name,
              colorLogoUrl: response.data.colorLogoUrl,
              bandWLogoUrl: response.data.bandWLogoUrl,
              notes: response.data.notes,
              vendorId: (
                response.data.vendorList ? response.data.vendorList.map((value, key) => {
                  return value.vendorId
                }) : []),
              recStatus: response.data.recStatus,
              rowVersion: response.data.rowVersion,
            });
          } else {
            dispatch(setAlertMessage({
              type: 'danger',
              message: ValidationMsgs.brand.notFound
            }));
            navigate('/admin/MasterCatalog/Configuration/brand');
          }
          dispatch(setAddLoading(false))
        })
        .catch((err) => {
          dispatch(setAddLoading(false));
        });
    }
  }, [id]);

  const getStatisticsData = useCallback(() => {
    dispatch(setAddLoading(true))

    BrandService.getactiveinactivecount(id).then((res) => {
      if (res?.data?.success) {
        setActiveUPC(res?.data?.data?.activeUPC);
        setMissingUPC(res?.data?.data?.missingUPC);
        setTotalProduct(res?.data?.data?.totalProduct);
      }
      dispatch(setAddLoading(false))

    }).catch(() => {
      dispatch(setAddLoading(false))
    })
  })

  const getsaleschannelstoresId = useCallback(() => {
    dispatch(setAddLoading(true))

    BrandService.getsaleschannelstoresId(id).then((res) => {
      if (res?.data?.success) {
        setStoreType(res?.data?.data);
      }
      dispatch(setAddLoading(false))

    }).catch(() => {
      dispatch(setAddLoading(false))

    })
  })

  useEffect(() => {
    getVendorDropdownData();
    getBrandData();
    getStatisticsData();
    getsaleschannelstoresId();
  }, [id, isAddMode, getVendorDropdownData, getBrandData]);

  // this useEffect is for getting catalog data based on id

  const schema = Yup.object().shape({
    name: Yup.string().required(ValidationMsgs.brand.nameRequired),
    recStatus: Yup.string().required(ValidationMsgs.common.recStatusRequired),
    vendorId: Yup.array().min(1, ValidationMsgs.common.vendorIdRequired),
  });
  function submitHandler(values, { resetForm }) {
    if (isAddMode) {
      createBrand(values, resetForm);
    } else {
      updateBrand(values, resetForm);
    }
  }
  const createBrand = (values, resetForm) => {
    dispatch(setAddLoading(true))

    BrandService.createBrand({ brandModel: { ...values, ...location } })
      .then((response) => {
        if (response.data.success && response.data.data) {
          // store vendor Information
          const vendors = values.vendorId.map((value, i) => {
            return {
              vendorId: value,
              status: "A"
            }
          })
          BrandService.createUpdateBrandVendors({
            brandVendorListModel: {
              id: response.data.data.id,
              ...location,
              brandVendorXLists: vendors
            }
          }).then((VendorResponse) => {
            if (VendorResponse.data.success && VendorResponse.data.data) {
              dispatch(
                setAlertMessage({
                  type: "success",
                  message: ValidationMsgs.brand.brandCreated,
                })
              );
              return navigate(
                "/admin/MasterCatalog/Configuration/brand/edit/" +
                response.data.data.id
              );
            } else {
              dispatch(
                setAlertMessage({ type: "danger", message: serverError(response) })
              );
            }
            dispatch(setAddLoading(false))

          }).catch(err => {
            dispatch(setAlertMessage({ type: "danger", message: ValidationMsgs.brand.vendorNotStored }));

          });
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
        }
        dispatch(setAddLoading(false))

      })
      .catch((errors) => {
        dispatch(setAlertMessage({ type: "danger", message: ValidationMsgs.brand.brandNotCreated }));
        dispatch(setAddLoading(false))

      });
  };
  const updateBrand = (values) => {
    dispatch(setAddLoading(true))

    const brandNotUpdated = ValidationMsgs.brand.brandNotUpdated;
    let vendors = [...initialVendors];
    const vendorId = values.vendorId.map((vendor) => {
      const existVendor = initialVendors.find((value) => value.vendorId.toString() === vendor.toString());
      if (!existVendor) {
        vendors = [...vendors, { vendorId: vendor, status: 'A' }]
      }
      return vendor.toString();
    })

    vendors = vendors.map((vendor) => {
      if (vendorId.includes(vendor.vendorId.toString())) {
        return { ...vendor, status: 'A' };
      } else {
        return { ...vendor, status: 'R' };
      }
    });
    // update brand details
    BrandService.updateBrand({ brandModel: { ...values, ...location } })
      .then((response) => {
        if (response.data.success) {
          // update vendor details
          BrandService.createUpdateBrandVendors({
            brandVendorListModel: {
              id: id,
              ...location,
              brandVendorXLists: vendors
            }
          }).then((response) => {
            if (response.data.success) {
              dispatch(
                setAlertMessage({
                  message: ValidationMsgs.brand.brandUpdated,
                  type: "success",
                })
              );
              getBrandData();
            } else {
              dispatch(
                setAlertMessage({ type: "danger", message: serverError(response) })
              );
            }
          }).catch((errors) => {
            if (errors?.response?.data?.Errors?.Error) {
              dispatch(
                setAlertMessage({
                  message: errors.response.data.Errors.Error,
                  type: "danger",
                })
              );
            } else {
              dispatch(
                setAlertMessage({ message: brandNotUpdated, type: "danger" })
              );
            }
            dispatch(setAddLoading(false))

          });

        } else {
          serverError(response);
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
        }
        dispatch(setAddLoading(false));
      })
      .catch((errors) => {
        if (errors?.response?.data?.Errors?.Error) {
          dispatch(
            setAlertMessage({
              message: errors.response.data.Errors.Error,
              type: "danger",
            })
          );
        } else {
          dispatch(
            setAlertMessage({ message: brandNotUpdated, type: "danger" })
          );
        }
        dispatch(setAddLoading(false))
      });

  };

  return (
    <>
      <title>{isAddMode ? "Add Brand" : "Edit Brand"}</title>

      <Formik
        enableReinitialize={true}
        initialValues={{
          id: data?.id || 0,
          name: data?.name || "",
          colorLogoUrl: data?.colorLogoUrl || "",
          bandWLogoUrl: data?.bandWLogoUrl || "",
          notes: data?.notes || "",
          vendorId: data?.vendorId || [],
          recStatus: data?.recStatus || RecStatusValuebyName.Active,
          rowVersion: data?.rowVersion || null,
        }}
        onSubmit={submitHandler}
        validationSchema={schema}
        validateOnMount={true}
      >
        {({ errors, setFieldValue, values }) => {
          return (
            <FormikForm>
              <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="flex mb-8 justify-between">
                  <div className="flex items-center">
                    <NavLink
                      to={"/admin/MasterCatalog/Configuration/brand"}
                      className="btn border-neutral-200 hover:border-neutral-400 text-gray-500 hover:text-gray-700 flex items-center mr-2"
                    >
                      <span className="material-icons-outlined">west</span>
                    </NavLink>
                    <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
                      {isAddMode ? "Add Brand" : "Edit Brand"}
                    </h1>
                  </div>
                  {(permission?.isEdit || permission?.isDelete) && <div className="flex flex-wrap space-x-2">
                    <NavLink
                      to={"/admin/MasterCatalog/Configuration/brand/"}
                      className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </NavLink>
                    <button onClick={() => {
                      dispatch(setAlertMessage({ type: "danger", message: serverError({ data: { errors: errors } }) }));
                    }}
                      disabled={GlobalLoading} className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(GlobalLoading) ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}
                    >
                      <div className={`w-full flex justify-center align-middle `}>
                        {GlobalLoading && (
                          <span className="spinner-border spinner-border-sm mr-2"></span>
                        )}
                        Save
                      </div>
                    </button>
                  </div>}
                </div>
                <Messages />
                <div className="grid grid-cols-12 gap-6 pt-5">
                  <div className="col-span-full xl:col-span-9">
                    <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                      <div className="w-full mb-6 last:mb-0">
                        <label
                          htmlFor="name"
                          className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                        >
                          Name
                          <span className="text-rose-500 text-2xl leading-none">
                            *
                          </span>
                        </label>
                        <Input name="name" id="name" type="text" maxLength={60} />
                      </div>
                      <div className="w-full mb-6 last:mb-0">
                        <div className="grid grid-cols-12 gap-6">
                          <div className="col-span-full lg:col-span-6">
                            <label
                              className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                              htmlFor="colorLogoUrl"
                            >
                              Color Logo
                            </label>
                            <div className="grid grid-cols-12 gap-6 w-full">
                              <ImageFile
                                type="file"
                                className="sr-only"
                                name="colorLogoUrl"
                                id="colorLogoUrl"
                                buttonName="Add"
                                onChange={(value) => {
                                  setFieldValue("colorLogoUrl", value);
                                }}
                                folderpath={`${FolderPath}`}
                                url={values.colorLogoUrl}
                              />
                            </div>
                          </div>
                          <div className="col-span-full lg:col-span-6">
                            <label
                              className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                              htmlFor="bandWLogoUrl"
                            >
                              Black & White Logo
                            </label>
                            <div className="grid grid-cols-12 gap-6 w-full">
                              <ImageFile
                                type="file"
                                className="sr-only"
                                name="bandWLogoUrl"
                                id="bandWLogoUrl"
                                buttonName="Add"
                                onChange={(value) => {
                                  setFieldValue("bandWLogoUrl", value);
                                }}
                                folderpath={`${FolderPath}`}
                                url={values.bandWLogoUrl}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="text-sm mt-2">
                          Recommended size for brand logo is 350 x 250 pixel and
                          it's mandatory for user to compress logo via
                          <a
                            href="https://tinypng.com/"
                            rel="noreferrer"
                            title="www.tinypng.com"
                            className="text-indigo-500 ml-1 mr-1"
                            target="_blank"
                          >
                            www.tinypng.com
                          </a>
                          and then upload.
                        </div>
                      </div>
                      <div className="w-full mb-6 last:mb-0">
                        <label
                          className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                          htmlFor="grid-first-name"
                        >
                          Select Vendor
                          <span className="text-rose-500 text-2xl leading-none">
                            *
                          </span>
                        </label>
                        <Dropdown
                          isMulti={true}
                          hidecheckbox={false}
                          defaultValue={values.vendorId}
                          name={"vendorId"}
                          options={
                            vendors
                          } /* options={[{ label: 'Active', value: 1 }, { label: 'Inactive', value: 2 }, { label: 'Draft', value: 3 }]} */
                        />
                      </div>
                    </div>

                    <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                      <div className="w-full mb-6 last:mb-0">
                        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                          Notes
                        </label>
                        <CKEditor
                          type="simple"
                          name={"notes"}
                          id="notes"
                          maxLength={350}
                          defaultValue={values.notes}
                          loading={data.notes}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col col-span-full xl:col-span-3">
                    <div className="w-full bg-white shadow-xxl rounded-md p-6 mb-6">
                      <div >
                        <div className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2">

                          Brand Status
                          <span className="text-rose-500 text-2xl leading-none">
                            *
                          </span>
                        </div>
                        <Dropdown
                          hidecheckbox={false}
                          isMulti={false}
                          defaultValue={values.recStatus}
                          name={"recStatus"}
                          optionStyle={{ padding: "1px" }}
                          options={RecStatusValue}
                        />
                      </div>
                    </div>
                    {!isAddMode && (
                      <>
                        <div className="w-full bg-white shadow-xxl rounded-md p-6 mb-6">
                          <div className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2">
                            Statistics
                          </div>
                          <div >
                            <div className="flex flex-wrap items-center justify-between border-b last:border-b-0 border-neutral-200 pb-2 last:pb-0 mb-2 last:mb-0">
                              <div >Active UPC</div>
                              <div >{activeUPC}</div>
                            </div>
                            <div className="flex flex-wrap items-center justify-between border-b last:border-b-0 border-neutral-200 pb-2 last:pb-0 mb-2 last:mb-0">
                              <div >Missing UPC</div>
                              <div >{missingUPC}</div>
                            </div>
                            <div className="flex flex-wrap items-center justify-between border-b last:border-b-0 border-neutral-200 pb-2 last:pb-0 mb-2 last:mb-0">
                              <div >Total Products</div>
                              <div >{totalProduct}</div>
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-white shadow-xxl rounded-md p-6 mb-6">
                          <SidebarStoreList storeType={storeType}>
                            {/* Card Title  */}
                            <div className="w-full flex justify-between border-b-2 border-solid border-neutral-200 pb-4">
                              <div className="text-md py-1 text-gray-500">
                                Sales Channels and Stores
                              </div>
                            </div>
                          </SidebarStoreList>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </FormikForm>
          );
        }}
      </Formik>

      <Catalog
        isAddMode={isAddMode}
        id={id}
        brandId={data.id}
        vendors={vendors}
        vendorId={
          data.vendorId ? data.vendorId.map((value) => value.toString()) : []
        }
      />
    </>
  );
};

export default Create;
