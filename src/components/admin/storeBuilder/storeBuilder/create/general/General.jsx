import React, { useCallback, useEffect, useRef, useState } from "react";
import { Formik, Form as FormikForm } from "formik";

import StoreBuilderService from "services/admin/storeBuilder/StoreBuilderService";
import DropdownService from "services/common/dropdown/DropdownService";

import CountryService from "services/admin/country/CountryService";

import BillingInformation from "./BillingInformation";
import ShippingInformation from "./ShippingInformation";
import StoreInformation from "./StoreInformation";
import StoreSetting from "./StoreSetting";
import Status from "./Status";
import * as Yup from "yup";
import { ValidationMsgs } from "global/ValidationMessages";

import { useDispatch } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { serverError } from "services/common/helper/Helper";
import Messages from "components/common/alerts/messages/Index";
import { RecStatusValuebyName } from "global/Enum";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { useParams } from "react-router-dom";

const General = ({
  id,
  isAddMode,
  setFormSubmit,
  index,
  activeTab,
  generalTabData,
  setactiveTab,
  user,
  mode,
}) => {
  const dispatch = useDispatch();
  const [organizationOption, setorganizationOption] = useState([]);
  const [sportOption, setsportOption] = useState([]);
  const [salesPersonOption, setsalesPersonOption] = useState([]);
  const [countries, setcountries] = useState([]);
  const formRef = useRef();
  const param = useParams();
  const submitHandler = (fields) => {
    // setactiveTab((prev) => prev + 1);

    udpateGeneral(fields);
  };

  const udpateGeneral = useCallback((fields) => {
    dispatch(setAddLoading(true));

    StoreBuilderService.udpateStoreGeneral({
      masterStoreInfoUpdateModel: fields,
    })
      .then((response) => {
        if (response.data.success) {
          if (mode == "create") setactiveTab((prev) => prev + 1);
          dispatch(
            setAlertMessage({
              view: true,
              type: "success",
              message: ValidationMsgs.storeBuilder.general.updated,
            })
          );
        } else {
          dispatch(
            setAlertMessage({
              type: "danger",
              message: serverError(response),
            })
          );
        }
        dispatch(setAddLoading(false));
      })
      .catch((error) => {
        dispatch(
          setAlertMessage({
            view: true,
            type: "danger",
            message: "Something went wrong.",
          })
        );
        dispatch(setAddLoading(false));
      });
  });

  const getOrganizationOptions = useCallback(() => {
    DropdownService.getDropdownValues("organization")
      .then((res) => {
        if (res?.data?.data && res?.data?.success) {
          setorganizationOption(res.data.data);
        }
      })
      .catch((err) => {});
  }, []);

  const getSportsOptions = useCallback(() => {
    DropdownService.getDropdownValues("sports")
      .then((res) => {
        if (res?.data?.data && res?.data?.success) {
          setsportOption(res.data.data);
        }
      })
      .catch((err) => {});
  }, []);

  const getSalesPersonOptions = useCallback(() => {
    StoreBuilderService.getSalesPerson()
      .then((res) => {
        if (res?.data?.data && res?.data?.success) {
          setsalesPersonOption(res.data.data);
        }
      })
      .catch((err) => {});
  }, []);

  const getCountriesOptions = useCallback(() => {
    CountryService.getCountry()
      .then((res) => {
        if (res.data.success) {
          setcountries(res.data.data);
        }
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    if (activeTab == index) {
      setFormSubmit(formRef.current);
    }
  }, [formRef, setFormSubmit, activeTab]);

  useEffect(() => {
    getOrganizationOptions();
    getSportsOptions();
    getSalesPersonOptions();
    getCountriesOptions();
  }, []);

  const schema = Yup.object().shape({
    organizationId: Yup.number().required(
      ValidationMsgs.storeBuilder.general.organizationId
    ),
    sportId: Yup.number().required(ValidationMsgs.storeBuilder.general.sportId),
    name: Yup.string().required(ValidationMsgs.storeBuilder.nameRequired),
    code: Yup.string().required(ValidationMsgs.storeBuilder.general.code),
    salesPersonId: Yup.number().required(
      ValidationMsgs.storeBuilder.general.salesPersonId
    ),
    directAccessURL: Yup.string().required(
      ValidationMsgs.storeBuilder.general.directAccessURL
    ),
    navCustomerId: Yup.string().required(
      ValidationMsgs.storeBuilder.general.navCustomerId
    ),
    estimateShipDate: Yup.string().required(
      ValidationMsgs.storeBuilder.general.estimateShipDate
    ),
    followUpdate: Yup.string().required(
      ValidationMsgs.storeBuilder.general.followUpdate
    ),
    teamName: Yup.string().required(
      ValidationMsgs.storeBuilder.general.teamName
    ),
    email: Yup.string().required(ValidationMsgs.storeBuilder.general.email),
    openStoreOn: Yup.string().required(
      ValidationMsgs.storeBuilder.general.openStoreOn
    ),
    closeStoreOn: Yup.string().required(
      ValidationMsgs.storeBuilder.general.closeStoreOn
    ),
    firstName: Yup.string().required(
      ValidationMsgs.storeBuilder.general.firstName
    ),
    lastName: Yup.string().required(
      ValidationMsgs.storeBuilder.general.lastName
    ),
  });

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        id: generalTabData?.id || 0,
        storeId: id,
        organizationId: generalTabData?.organizationId || "",
        sportId: generalTabData?.sportId || "",
        name: generalTabData?.name || generalTabData?.merchStore || "",
        code: generalTabData?.code || "",
        salesCode: generalTabData?.salesCode || "",
        directAccessURL: generalTabData?.directAccessURL || "",
        salesPersonId: generalTabData?.salesPersonId || "",
        navCustomerId: generalTabData?.navCustomerId || "",
        navLocationCode: generalTabData?.navLocationCode || "",
        estimateShipDate: generalTabData?.estimateShipDate || "",
        followUpdate: generalTabData?.followUpdate || "",
        teamName: generalTabData?.teamName || "",
        email: generalTabData?.email || "",
        recStatus: generalTabData?.recStatus || RecStatusValuebyName.Active,
        isLogo: generalTabData?.isLogo || false,
        isStoreName: generalTabData?.isStoreName || false,
        isCategoryMenu: generalTabData?.isCategoryMenu || false,
        openStoreOn: generalTabData?.openStoreOn || "",
        closeStoreOn: generalTabData?.closeStoreOn || "",
        userTerms: generalTabData?.userTerms || "",
        logourl: generalTabData?.logourl || "",

        firstName: generalTabData?.firstName || "",
        lastName: generalTabData?.lastName || "",
        address1: generalTabData?.address1 || "",
        suite: generalTabData?.suite || "",
        zipCode: generalTabData?.zipCode || "",
        city: generalTabData?.city || "",
        state: generalTabData?.state || "",
        country: generalTabData?.country || "",
        phone: generalTabData?.phone || "",
        shipSameasBilling: generalTabData?.shipSameasBilling || false,

        shipFirstName: generalTabData?.shipFirstName || "",
        shipLastName: generalTabData?.shipLastName || "",
        shipCity: generalTabData?.shipCity || "",
        shipAddress1: generalTabData?.shipAddress1 || "",
        shipState: generalTabData?.shipState || "",
        shipSuite: generalTabData?.shipSuite || "",
        shipZipcode: generalTabData?.shipZipcode || "",
        shipCountry: generalTabData?.shipCountry || "",
        shipPhone: generalTabData?.shipPhone || "",

        modifiedby: user.id || "",

        storeTypeId: generalTabData?.storeTypeId || "",
        parentstoreid: generalTabData?.parentstoreid || "",
      }}
      onSubmit={submitHandler}
      validationSchema={schema}
      innerRef={formRef}
    >
      {({ values, setFieldValue, submitForm }) => {
        return (
          <FormikForm>
            <Messages />
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-6">
                <StoreInformation
                  organizationOption={organizationOption}
                  sportOption={sportOption}
                  salesPersonOption={salesPersonOption}
                  getOrganizationOptions={getOrganizationOptions}
                  getSportsOptions={getSportsOptions}
                />
              </div>
              <div className="col-span-12 lg:col-span-6">
                <Status />
                <StoreSetting />
                <BillingInformation countries={countries} />
                <ShippingInformation countries={countries} />
              </div>
            </div>
          </FormikForm>
        );
      }}
    </Formik>
  );
};

export default General;
