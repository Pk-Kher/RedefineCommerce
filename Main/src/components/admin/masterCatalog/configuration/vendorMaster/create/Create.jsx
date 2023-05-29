/*Component Name: Vendor create
Component Functional Details: Here we are creating Vendor create data .
Created By: chandan 
Created Date: -
Modified By:chandan
Modified Date: 06/10/2022 */

import React, { useState, useEffect } from "react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";
import DropDownComponent from "components/common/formComponent/Dropdown";
import { Link, useNavigate, useParams } from "react-router-dom";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import ToggleButton from "components/common/formComponent/ToggleButton";
import Input from "components/common/formComponent/Input";
import VendorServices from "services/admin/vendor/VendorService";
import CatalogService from "services/admin/catalog/CatalogService";
import Messages from "components/common/alerts/messages/Index";
import ToolTipComponent from "components/common/ToolTips";
import { ErrorMessage } from "formik";
import FormErrorMessage from "components/common/alerts/FormErrorMessage";
import CKEditor from "components/common/formComponent/CKEditor";
import AddCatalogModal from "./AddCatalogModal";
import ConfirmDelete from "components/common/modals/ConfirmDelete";
import { RecStatusValueForForm, RecStatusValuebyName } from "global/Enum";
import { ValidationMsgs } from "global/ValidationMessages";
import { useDispatch, useSelector } from "react-redux";
import { serverError } from "services/common/helper/Helper";
import { useCallback } from "react";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { ToolTipsMessages } from "global/ToolTipsMessages";

const Create = () => {
  const permission = useSelector(store => store.permission);
  const compName = "Vendor";
  let navigate = useNavigate();
  const { id } = useParams();
  const isAddMode = !id;
  const dispatch = useDispatch();
  const location = useSelector((store) => store?.location);
  const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

  const [data, setData] = useState({});

  const [toggler, setToggler] = useState({
    inventoryAvailable: false,
    isAPIAvailable: false,
    isFTPAvailable: false,
  });

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [VendorId, setVendorId] = useState(null);
  const [CatalogData, setCatalogData] = useState([]);
  const [openAddCatalogModal, setopenAddCatalogModal] = useState({
    show: false,
    data: null,
  });
  const [isDesabledAddCatalog, setisDesabledAddCatalog] = useState("");
  const [refresh, setrefresh] = useState("");
  const [BrandData, setBrandData] = useState([]);
  const [CatalogRowVersion, setCatalogRowVersion] = useState("");
  const [brandSearchData, setBrandSearchData] = useState("");

  const HandleCancel = () => {
    navigate("/admin/MasterCatalog/Configuration/vendor");
  };

  const handleToggle = (field) => {
    field = field.target.name;
    setToggler((prevData) => ({
      ...prevData,
      [field]: !toggler[field],
    }));
  };


  const regexForURL =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

  const validationSchema = Yup.object({
    name: Yup.string().required(ValidationMsgs.vendor.nameRequired),
    navId: Yup.string().required(ValidationMsgs.vendor.navIdRequired),
    contactEmail: Yup.string().email(ValidationMsgs.vendor.contactEmail),
    contactPhone: Yup.string().matches(
      /^(\+\d{1,3}[- ]?)?\d{10}$/,
      ValidationMsgs.vendor.contactPhoneMatches
    ),
    webSite: Yup.string().matches(
      regexForURL,
      ValidationMsgs.vendor.websiteMatches
    ),
    imagePortalWebsite: Yup.string().matches(
      regexForURL,
      ValidationMsgs.vendor.imagePortalWebsiteMatches
    ),
    imagePortalLogin: Yup.string().matches(
      regexForURL,
      ValidationMsgs.vendor.imagePortalLoginMatches
    ),
    apiUrl:
      toggler.isAPIAvailable &&
      Yup.string()
        .required(ValidationMsgs.vendor.apiUrlRequired)
        .matches(regexForURL, ValidationMsgs.vendor.apiUrlMatches),
    apiUsername:
      toggler.isAPIAvailable &&
      Yup.string().required(ValidationMsgs.vendor.apiUsernameRequired),
    apiPassword:
      toggler.isAPIAvailable &&
      Yup.string().required(ValidationMsgs.vendor.apiPasswordRequired),
    ftpUrl:
      toggler.isFTPAvailable &&
      Yup.string()
        .required(ValidationMsgs.vendor.ftpUrlRequired)
        .matches(regexForURL, ValidationMsgs.vendor.ftpUrlMatches),
    ftpUsername:
      toggler.isFTPAvailable &&
      Yup.string().required(ValidationMsgs.vendor.ftpUsernameRequired),
    ftpPassword:
      toggler.isFTPAvailable &&
      Yup.string().required(ValidationMsgs.vendor.ftpPasswordRequired),
    recStatus: Yup.string().required(ValidationMsgs.common.recStatusRequired),
  });

  useEffect(() => {
    VendorServices.GetBrandData(id).then((BrandData) => {
      if (BrandData.data.success) {
        setBrandData(BrandData.data.data);
      }
    })
      .catch((error) => { });
  }, [])

  const createVendor = (fields, resetForm) => {
    dispatch(setAddLoading(true))

    VendorServices.createVendor({ ...fields, ...location })
      .then((response) => {
        if (response.data.success) {
          setisDesabledAddCatalog(response.data.data.id);
          navigate(
            `/admin/MasterCatalog/Configuration/vendor/edit/${response.data.data.id}`
          );
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.vendor.vendorCreated,
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
            message: ValidationMsgs.vendor.vendorNotCreated,
          })
        );
        dispatch(setAddLoading(false))

      });
  };

  const updateVendor = (fields) => {
    dispatch(setAddLoading(true))

    fields.id = Number(id);
    VendorServices.updateVendor({ ...fields, ...location })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.vendor.vendorUpdated
            })
          );

          getVendorData();
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
            message: ValidationMsgs.vendor.vendorNotUpdated,
          })
        );
        dispatch(setAddLoading(false))

      });
  };

  const onSubmit = (fields, { resetForm }) => {
    if (isAddMode) {
      createVendor(fields, resetForm);
    } else {
      updateVendor(fields, resetForm);
    }
  };

  const handleUpdateCatalog = async () => {
    dispatch(setAddLoading(true))

    const { id, changeStatus } = data;
    CatalogService.updateStatus({
      id: VendorId,
      Status: RecStatusValuebyName.Archived,
      rowVersion: CatalogRowVersion,
      ...location,
    })
      .then((response) => {
        if (response.data.success) {
          setrefresh(Math.random());
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.catalog.catalogDeleted,
            })
          );
          // navigate("/admin/MasterCatalog/Configuration/store");
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
            message: ValidationMsgs.catalog.catalogUpdated,
          })
        );
        dispatch(setAddLoading(false))

      });
  };

  const handleShowModel = (data) => {
    // setopenAddCatalogModal(!openAddCatalogModal);
    setopenAddCatalogModal((prevState) => ({
      ...prevState,
      show: !prevState.show,
      data: data?.id,
    }));
  };

  useEffect(() => {
    if (id) {
      setisDesabledAddCatalog(id);
      getVendorData();
    }
  }, [id]);

  const getVendorData = useCallback(() => {
    dispatch(setAddLoading(true))

    VendorServices.getVendorByID(id)
      .then((res) => {
        var response = res.data;
        if (response.success) {
          setData({ ...response.data });
          setToggler({
            inventoryAvailable: response.data.isInventoryAvailable,
            isAPIAvailable: response.data.isAPIAvailable,
            isFTPAvailable: response.data.isFTPAvailable,
          });
        }
        dispatch(setAddLoading(false))

      })
      .catch((err) => {
        dispatch(setAddLoading(false))

      });
  });

  // this useEffect is for getting catalog data based on id
  useEffect(() => {
    if (id) {
      getCataLogData();
      setopenAddCatalogModal((prevState) => ({
        ...prevState,
        show: false,
      }));
    }
  }, [id, refresh]);
  const getCataLogData = useCallback(() => {
    CatalogService.getCatalog(id, false, {
      pageIndex: 0,
      pageSize: 0,
      pagingStrategy: 0,
      sortingOptions: [
        {
          field: "sltring",
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
      .then((res) => {
        let response = res.data;
        if (response.success) {
          setCatalogData(response.data.items);
        }
      })
      .catch((err) => { });
  }, [id])

  return (
    <>
      <title>{isAddMode === true ? "Add Vendor" : "Edit Vendor"}</title>

      <Formik
        enableReinitialize={true}
        initialValues={{
          id: data.id || 0,
          name: data?.name || "",
          navId: data?.navId || "",
          contactName: data?.contactName || "",
          contactPhone: data?.contactPhone || "",
          contactEmail: data?.contactEmail || "",
          address: data?.address || "",
          webSite: data?.webSite || "",
          loginName: data?.loginName || "",
          password: data?.password || "",
          imagePortalWebsite: data?.imagePortalWebsite || "",
          imagePortalLogin: data?.imagePortalLogin || "",
          imagePortalPassword: data?.imagePortalPassword || "",
          apiUrl: data?.apiUrl || "",
          apiUsername: data?.apiUsername || "",
          apiPassword: data?.apiPassword || "",
          ftpUrl: data?.ftpUrl || "",
          ftpUsername: data?.ftpUsername || "",
          ftpPassword: data?.ftpPassword || "",
          recStatus: data?.recStatus || RecStatusValuebyName.Active,
          notes: data?.notes || "",
          isInventoryAvailable: data?.isInventoryAvailable || false,
          isAPIAvailable: data?.isAPIAvailable || false,
          isFTPAvailable: data?.isFTPAvailable || false,
          rowVersion: data?.rowVersion || null,
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        validateOnMount={true}
      >
        {({ setFieldValue, errors, values }) => {
          if (!toggler.isAPIAvailable) {
            values.apiUrl = "";
            values.apiUsername = "";
            values.apiPassword = "";
          } else if (!toggler.isFTPAvailable) {
            values.ftpUsername = "";
            values.ftpPassword = "";
            values.ftpUrl = "";
          }
          return (
            <main className="responsive">
              <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Page header */}
                <FormikForm>
                  <div className="flex mb-8 justify-between">
                    <div className="flex items-center">
                      <Link
                        to="/admin/MasterCatalog/Configuration/vendor"
                        className="btn border-neutral-200 hover:border-neutral-400 text-gray-500 hover:text-gray-700 flex items-center mr-2"
                      >
                        <span className="material-icons-outlined">west</span>
                      </Link>

                      <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
                        {isAddMode === true ? "Add Vendor" : "Edit Vendor"}
                      </h1>
                    </div>
                    {(permission?.isEdit || permission?.isDelete) && <div className="flex flex-wrap space-x-2">
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
                      </button>
                    </div>}
                  </div>

                  <Messages />

                  <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-full xl:col-span-9">
                      {/* <VendorNameId /> */}
                      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                        <div className="w-full last:mb-0">
                          <label className="uppercase tracking-wide text-gray-500 text-xs font-bold mb-2 flex flex-wrap">
                            <span >
                              Vendor Name
                              <span className="text-rose-500 text-2xl leading-none">
                                *
                              </span>
                            </span>
                          </label>
                          <Input type="text" name="name" maxLength={100} />
                        </div>
                        <div className="w-full last:mb-0">
                          <div className="flex items-center">
                            <label className="uppercase tracking-wide text-gray-500 text-xs font-bold mb-2 flex flex-wrap">
                              <span >
                                Vendor NAV ID
                                <span className="text-rose-500 text-2xl leading-none">
                                  *
                                </span>
                              </span>
                            </label>
                            <ToolTipComponent
                                id=" VendorNavId"
                                message={ToolTipsMessages.VendorTooltips.VendorNavId}
                              />
                          </div>
                          <Input type="text" name="navId" maxLength={30} />
                        </div>
                      </div>

                      {!isAddMode && (
                        <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 mb-6">
                          <div className="w-full p-6">
                            <div className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2">
                              Brands
                            </div>
                          </div>
                          {(BrandData && BrandData.length > 0) ? (
                            <>
                              <div className="px-6 w-full flex flex-wrap sm:auto-cols-max justify-between gap-2 mb-6">
                                <div className="relative grow">
                                  <div className="absolute h-10 mt-0 left-0 top-0 flex items-center">
                                    <svg
                                      className="h-4 pl-4 fill-current text-gray-600"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                                    </svg>
                                  </div>
                                  <input
                                    type="search"
                                    placeholder="search"
                                    className="block w-full bg-[#f7f7fa] border-neutral-200 hover:border-neutral-300 focus:border-neutral-100 focus:ring-neutral-300 focus:shadow-lg pl-10 pr-2 py-2 rounded-md"
                                    value={brandSearchData}
                                    onChange={(e) => {
                                      setBrandSearchData(e.target.value);
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="overflow-x-auto max-h-screen border-t border-neutral-200 py-6">
                                <div className="w-full grid grid-cols-2 text-sm text-[#191919] font-semibold">
                                  {BrandData.map((BrandData, index) => {
                                    if (brandSearchData === "" || (BrandData.brandname.toLowerCase()).includes(brandSearchData.toLowerCase())) {
                                      return (
                                        <div
                                          key={index}
                                          className="px-4 first:pl-5 py-3 border-b border-neutral-200 mx-6"
                                        >
                                          <div className="flex items-center justify-between">
                                            <div className="mr-2">
                                              {BrandData.brandname}
                                            </div>
                                            <div >
                                              {BrandData.productCount}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    }

                                  })}

                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex flex-wrap uppercase font-bold text-sm mt-2 mb-1 ml-8 text-rose-500">
                                <span className="text-rose-500 text-2xl mr-2 ">
                                  *
                                </span>
                                This Vendor is not associated with any Product
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* <VendorContacts /> */}

                      <div className="w-full grid grid-cols-2 gap-6 bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                        <div className="w-full last:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            Contact Name
                          </label>
                          <Input type="text" name="contactName" maxLength={100} />
                        </div>
                        <div className="w-full last:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            Contact Phone
                          </label>
                          <Input type="text" name="contactPhone" maxLength={15} />
                        </div>
                        <div className="w-full last:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            Contact Email
                          </label>
                          <Input
                            type="text"
                            name="contactEmail"
                            maxLength={100}
                          />
                        </div>
                        <div className="w-full last:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" >
                            Address
                          </label>
                          <Input
                            type="text"
                            name="address"
                            maxLength={250}
                          />
                        </div>
                        <div className="w-full last:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            Website
                          </label>

                          <Input
                            type="text"
                            name="webSite"
                            maxLength={255}
                          />
                        </div>
                        <div className="w-full last:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            Login Name
                          </label>
                          <Input
                            type="text"
                            name="loginName"
                            maxLength={60}
                          />
                        </div>
                        <div className="w-full last:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                            Password
                          </label>

                          <Input
                            type="password"
                            name="password"
                            maxLength={20}
                          />
                        </div>
                        <div className="w-full last:mb-0">
                          <div className="flex items-center">
                            <label className="uppercase tracking-wide text-gray-500 text-xs font-bold mb-2 flex flex-wrap">
                              <span>
                                Image Portal Webiste
                              </span>
                            </label>
                            <ToolTipComponent
                                id="ImagePortalWebiste"
                                message={ToolTipsMessages.VendorTooltips.ImagePortalWebiste}
                              />
                            {/* End */}
                          </div>

                          <Input
                            type="text"
                            name="imagePortalWebsite"
                            maxLength={55}
                          />
                        </div>
                        <div className="w-full last:mb-0">
                          <div className="flex items-center">
                            <label
                              className="flex flex-wrap uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" >
                              Image Portal Login
                            </label>
                            <ToolTipComponent
                                id="ImagePortalLogins"
                                message={ToolTipsMessages.VendorTooltips.ImagePortalLogins}
                              />
                            {/* End */}
                          </div>

                          <Input
                            type="text"
                            name="imagePortalLogin"
                            maxLength={60}
                          />
                        </div>
                        <div className="w-full last:mb-0">
                          <div className="flex items-center">
                            <label
                              className="flex flex-wrap uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                              Image Portal Password
                            </label>
                            <ToolTipComponent
                                  id="ImagePortalPasswords"
                                  message={ToolTipsMessages.VendorTooltips.ImagePortalPasswords}
                                />
                            {/* End */}
                          </div>
                          <Input
                            type="password"
                            name="imagePortalPassword"
                            maxLength={20}
                          />
                        </div>
                      </div>

                      <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                        <div className="w-full mb-6 last:mb-0">
                          <label
                            className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
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

                      <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 mb-6">
                        <div className="w-full mb-6 last:mb-0">
                          <div className="flex items-center justify-between p-6">
                           <div className="flex align-center justify-left">
                                <label className="flex flex-wrap uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                                  Catalog Changes
                                </label>
                                <ToolTipComponent
                                  id="CatalogChanges"
                                  message={ToolTipsMessages.VendorTooltips.CatalogChanges}
                                />
                              </div>
                              {/* Start */}

                            {(permission?.isEdit || permission?.isDelete) && <div>
                              <button
                                onClick={handleShowModel}
                                type="button"
                                title=""
                                data-modal-toggle="addcatalogModal"
                                className="btn bg-indigo-500 hover:bg-indigo-600 text-white disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-gray-500"
                                disabled={!isDesabledAddCatalog}
                              >
                                <span className="material-icons-outlined">
                                  add_circle_outline
                                </span>
                                <span className="ml-1">Add Catalog</span>
                              </button>
                            </div>}

                            {/* <button
                              onClick={handleShowModel}
                              disabled={!isDesabledAddCatalog}
                            >
                              <span className="material-icons-outlined text-indigo-500 ">
                                add_circle_outline
                              </span>
                            </button> */}
                          </div>
                          <div>
                            <table className="table-auto w-full text-sm text-[#191919] font-semibold">
                              {CatalogData.length > 0 ? (
                                <thead className="text-sm font-bold uppercase text-[#b3b3b3] border-b border-neutral-200 border-t">
                                  <tr>
                                    <th className="px-2 first:pl-5 py-4 whitespace-nowrap">
                                      <div className="font-semibold text-left max-w-max flex items-center">
                                        <span>Catalog Name</span>
                                      </div>
                                    </th>
                                    <th className="px-2 first:pl-5 py-4 whitespace-nowrap">
                                      <div className="font-semibold text-left flex items-center">
                                        <span>Start Date</span>
                                      </div>
                                    </th>
                                    <th className="px-2 first:pl-5 py-4 whitespace-nowrap">
                                      <div className="font-semibold text-left flex items-center">
                                        <span>End Date</span>
                                      </div>
                                    </th>

                                    <th className="px-2 first:pl-5 py-4 whitespace-nowrap">
                                      <div className="font-semibold text-left flex items-center">
                                        <span>Release Date</span>
                                      </div>
                                    </th>
                                    <th className="px-2 first:pl-5 py-4 whitespace-nowrap">
                                      <div className="font-semibold text-left flex items-center">
                                        <span>Upload Catalog</span>
                                      </div>
                                    </th>
                                    <th className="px-2 first:pl-5 py-4">
                                      Action
                                    </th>
                                  </tr>
                                </thead>
                              ) : !isDesabledAddCatalog ? (
                                <thead>
                                  <div className="flex flex-wrap uppercase font-bold text-sm mt-2 mb-1 ml-8 text-rose-500">
                                    <span className="text-rose-500 text-2xl mr-2 ">
                                      *
                                    </span>
                                    Add Vendor First To Add Catalog Data
                                  </div>
                                </thead>
                              ) : (
                                CatalogData.length < 1 && (
                                  <tbody className="flex flex-wrap uppercase font-bold text-sm mb-4 ml-8 text-red-500 ">
                                    <div className="flex flex-wrap uppercase font-bold text-sm mt-2 mb-1 ml-8 text-rose-500">
                                      <span className="text-rose-500 text-2xl mr-2 ">
                                        *
                                      </span>
                                      No Data yet , please add some !
                                    </div>
                                  </tbody>
                                )
                              )}

                              <tbody className="divide-y divide-slate-200 text-sm">
                                {CatalogData.map((data, index) => {
                                  let catalogFileUrl = data.uploadCatalogURL.split('/')

                                  return (
                                    <tr key={index}>
                                      <td className="px-2 first:pl-5 py-3">
                                        <div >
                                          {data.catalogName}
                                        </div>
                                      </td>
                                      <td className="px-2 first:pl-5 py-3">
                                        <div >
                                          {format(
                                            new Date(data.startDate),
                                            "MM-dd-yyyy"
                                          )}
                                        </div>
                                      </td>
                                      <td className="px-2 first:pl-5 py-3">
                                        <div >
                                          {format(
                                            new Date(data.endDate),
                                            "MM-dd-yyyy"
                                          )}
                                        </div>
                                      </td>
                                      <td className="px-2 first:pl-5 py-3">
                                        <div >
                                          {format(
                                            new Date(data.releasedDate),
                                            "MM-dd-yyyy"
                                          )}
                                        </div>
                                      </td>
                                      <td className="px-2 first:pl-5 py-3 truncate ">
                                        <div
                                          className="truncate text-ellipsis w-32 text-indigo-500 hover:text-indigo-600"
                                          title={data.uploadCatalogURL}
                                        >
                                          {/* {data.uploadCatalogURL.includes(
                                            "https://"
                                          ) ? ( */}
                                          <a
                                            href={`${process.env.REACT_APP_API_BLOB}/${data.uploadCatalogURL}`}
                                            target="_blank"
                                            rel="noreferrer"
                                          >
                                            {catalogFileUrl ? catalogFileUrl[catalogFileUrl.length - 1] : ""}
                                          </a>
                                          {/* ) : (
                                            <span>{catalogFileUrl ? catalogFileUrl[catalogFileUrl.length - 1] : ""}</span> */}
                                          {/* )} */}
                                        </div>
                                      </td>
                                      <td className="px-2 first:pl-5 py-3 text-center">
                                        {(permission?.isEdit || permission?.isDelete) && <div>
                                          <button
                                            className="text-indigo-500"
                                            data-modal-toggle="editcatalogModal"
                                            type="button"
                                            onClick={() => {
                                              handleShowModel(data);
                                            }}
                                          >
                                            <span className="material-icons-outlined">
                                              edit
                                            </span>
                                          </button>

                                          <button
                                            type="button"
                                            className="text-rose-500 text-2xl font-semibold"
                                            onClick={() => {
                                              setCatalogRowVersion(data.rowVersion);
                                              setVendorId(data.id);
                                              setOpenDeleteModal(true);
                                            }}
                                          >
                                            <span className="material-icons-outlined">
                                              close
                                            </span>
                                          </button>
                                        </div>}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                            <ErrorMessage
                              name={"catalogChanges"}
                              component={FormErrorMessage}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col col-span-full xl:col-span-3">
                      <div className="w-full bg-white shadow-xxl rounded-md">
                        <div className="border-b-2 border-neutral-200 p-6">
                          <div
                            className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2"
                            
                          >
                            Vendor Status
                            <span className="text-rose-500 text-2xl leading-none">
                              *
                            </span>
                          </div>

                          <DropDownComponent
                            label="Vendor Status"
                            options={RecStatusValueForForm}
                            isMulti={false}
                            name={"recStatus"}
                            className="bg-white border hover:border-neutral-300"
                            defaultValue={values.recStatus}
                          />
                        </div>
                        <div className="border-b-2 border-neutral-200 p-6 gap-6">
                          <div className="w-full flex justify-between py-2">
                            {/* Title */}
                            <div
                              className="text-md py-1 text-gray-500">
                              Inventory Available
                            </div>
                            <div>
                              <div className="flex items-center">
                                <ToggleButton
                                  id="isInventoryAvailable"
                                  onChange={(e) => { setFieldValue('isInventoryAvailable', e.target.checked); handleToggle(e) }}
                                  defaultValue={toggler.inventoryAvailable}
                                  name="isInventoryAvailable"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="w-full" x-data="{ checked: false }">
                            {/* Title */}
                            <div className="w-full flex justify-between py-2">
                              <div
                                className="text-md py-1 text-gray-500">
                                Is API Available
                              </div>
                              <div className="flex items-center">
                                <ToggleButton
                                  id="isAPIAvailable"
                                  defaultValue={toggler.isAPIAvailable}
                                  onChange={(e) => { setFieldValue('isAPIAvailable', e.target.checked); handleToggle(e) }}
                                  name="isAPIAvailable"
                                />
                              </div>
                            </div>
                            {toggler.isAPIAvailable && (
                              <div className="pb-3 w-full">
                                <div className="mt-3 mb-3">
                                  <label
                                    className="tracking-wide text-gray-500 text-xs font-bold mb-2 flex flex-wrap">
                                    API URL
                                    <span className="text-rose-500 text-2xl leading-none">
                                      *
                                    </span>
                                  </label>

                                  <Input
                                    type="text"
                                    name="apiUrl"
                                    maxLength={55}
                                  />
                                </div>
                                <div className="mt-3 mb-3">
                                  <label
                                    className="tracking-wide text-gray-500 text-xs font-bold mb-2 flex flex-wrap">
                                    API Username
                                    <span className="text-rose-500 text-2xl leading-none">
                                      *
                                    </span>
                                  </label>

                                  <Input type="text" name="apiUsername" maxLength={20} />
                                </div>
                                <div className="mt-3 mb-3">
                                  <label
                                    className="tracking-wide text-gray-500 text-xs font-bold mb-2 flex flex-wrap" >
                                    API Password
                                    <span className="text-rose-500 text-2xl leading-none">
                                      *
                                    </span>
                                  </label>

                                  <Input
                                    type="password"
                                    name="apiPassword"
                                    maxLength={20}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="w-full" x-data="{ checked: false }">
                            {/* Title */}
                            <div className="w-full flex justify-between py-2">
                              <div
                                className="text-md py-1 text-gray-500">
                                Is FTP Feed Available
                              </div>
                              <div className="flex items-center">
                                <ToggleButton
                                  id="isFTPAvailable"
                                  defaultValue={toggler.isFTPAvailable}
                                  onChange={(e) => { setFieldValue('isFTPAvailable', e.target.checked); handleToggle(e) }}
                                  name="isFTPAvailable"
                                />
                              </div>
                            </div>

                            {toggler.isFTPAvailable && (
                              <div className="pb-3 w-full">
                                <div className="mt-3 mb-3">
                                  <label
                                    className="tracking-wide text-gray-500 text-xs font-bold mb-2 flex flex-wrap">
                                    FTP URL
                                    <span className="text-rose-500 text-2xl leading-none">
                                      *
                                    </span>
                                  </label>

                                  <Input
                                    type="text"
                                    name="ftpUrl"
                                    maxLength={55}
                                  />
                                </div>
                                <div className="mt-3 mb-3">
                                  <label
                                    className="tracking-wide text-gray-500 text-xs font-bold mb-2 flex flex-wrap">
                                    FTP Username
                                    <span className="text-rose-500 text-2xl leading-none">
                                      *
                                    </span>
                                  </label>

                                  <Input
                                    type="text"
                                    name="ftpUsername"
                                    maxLength={20}
                                  />
                                </div>
                                <div className="mt-3 mb-3">
                                  <label
                                    className="tracking-wide text-gray-500 text-xs font-bold mb-2 flex flex-wrap">
                                    FTP Password
                                    <span className="text-rose-500 text-2xl leading-none">
                                      *
                                    </span>
                                  </label>

                                  <Input
                                    type="password"
                                    name="ftpPassword"
                                    maxLength={20}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </FormikForm>
              </div>
            </main>
          );
        }}
      </Formik >

      <ConfirmDelete
        handleDelete={handleUpdateCatalog}
        id={VendorId}
        data={data}
        message="Deleting these vendor will permanently remove this record from your account. This can't be undone"
        title={"Delete"}
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
      />

      {
        openAddCatalogModal.show && (
          <AddCatalogModal
            handleShowModel={handleShowModel}
            CatalogData={CatalogData}
            setCatalogData={setCatalogData}
            catalogId={openAddCatalogModal?.data}
            vendorId={isDesabledAddCatalog}
            setrefresh={setrefresh}
            id={id}
          />
        )
      }
    </>
  );
};

export default Create;