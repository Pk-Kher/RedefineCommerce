import React, { useEffect, useRef, useState } from "react";
import { Formik, Form as FormikForm } from "formik";
import Textarea from "components/common/formComponent/Textarea";
import StoreBuilderService from "services/admin/storeBuilder/StoreBuilderService";
import { useCallback } from "react";

import { useDispatch } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { serverError } from "services/common/helper/Helper";
import Messages from "components/common/alerts/messages/Index";
import { ValidationMsgs } from "global/ValidationMessages";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Message = ({
  id,
  isAddMode,
  setFormSubmit,
  index,
  activeTab,
  generalTabData,
  setactiveTab,
  mode,
}) => {
  const dispatch = useDispatch();
  const [data, setdata] = useState({});
  const params = useParams();
  const formRef = useRef();
  const location = useSelector((store) => store?.location);

  useEffect(() => {
    getMessagesData();
  }, []);

  const getMessagesData = () => {
    StoreBuilderService.getMessages(params.id)
      .then((res) => {
        if (res?.data?.success && res?.data?.data) {
          setdata(res.data.data);
        }
      })
      .catch();
  };

  useEffect(() => {
    if (activeTab == index) {
      setFormSubmit(formRef.current);
    }
  }, [formRef, setFormSubmit, activeTab]);

  const submitHandler = (fields) => {
    if (fields.id) {
      updateMessages(fields);
    } else {
      createMessage(fields);
    }
  };

  const createMessage = useCallback((fields) => {
    dispatch(setAddLoading(true));

    StoreBuilderService.createMessages({
      sbStoreMessagesModel: {
        id: data?.id || 0,
        storeId: params.id,
        headerMessage: fields.headerMessage,
        checkOutMessage: fields.checkOutMessage,
        orderSuccessMessage: fields.orderSuccessMessage,
        receiptHeaderNote: fields.receiptHeaderNote,
        salesExpiredMessage: fields.salesExpiredMessage,
        rowVersion: data?.rowVersion || "",
        ...location,
      },
    })
      .then((response) => {
        if (response.data.success) {
          if (mode == "create") setactiveTab((prev) => prev + 1);
          dispatch(
            setAlertMessage({
              view: true,
              type: "success",
              message: ValidationMsgs.storeBuilder.messages.updated,
            })
          );
          getMessagesData();
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
  }, []);

  const updateMessages = useCallback((fields) => {
    dispatch(setAddLoading(true));

    StoreBuilderService.updateMessages({
      sbStoreMessagesModel: { ...fields, ...location },
    })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.storeBuilder.messages.updated,
            })
          );
          getMessagesData();
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
        }
        dispatch(setAddLoading(false));
      })
      .catch((errors) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.storeBuilder.messages.notUpdated,
          })
        );
        dispatch(setAddLoading(false));
      });
  }, []);


  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        id: data?.id || 0,
        headerMessage: (data?.headerMessage || "").trim(),
        checkOutMessage: (data?.checkOutMessage || "").trim(),
        orderSuccessMessage: (data?.orderSuccessMessage || "").trim(),
        receiptHeaderNote: (data?.receiptHeaderNote || "").trim(),
        salesExpiredMessage: (data?.salesExpiredMessage || "").trim(),
        storeId: params.id || "",
        rowVersion: data?.rowVersion || "",
        ...location,
      }}
      onSubmit={submitHandler}
      innerRef={formRef}
    >
      {({ setFieldValue, values, errors }) => {
        return (
          <FormikForm>
            <Messages />
            <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 mb-6 p-6">
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12">
                  <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                    Header Message
                  </label>
                  <Textarea
                    rows={3}
                    name={"headerMessage"}
                    className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md"
                  />
                </div>
                <div className="col-span-12">
                  <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                    Checkout Message
                  </label>
                  <Textarea
                    rows={3}
                    name={"checkOutMessage"}
                    className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md"
                  />
                </div>
                <div className="col-span-12">
                  <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                    Order Success Message
                  </label>
                  <Textarea
                    rows={3}
                    name={"orderSuccessMessage"}
                    className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md"
                  />
                </div>
                <div className="col-span-12">
                  <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                    Receipt Header Note
                  </label>
                  <Textarea
                    rows={3}
                    name={"receiptHeaderNote"}
                    className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md"
                  />
                </div>
                <div className="col-span-12">
                  <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
                    Sale Expired Message
                  </label>
                  <Textarea
                    rows={3}
                    name={"salesExpiredMessage"}
                    className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md"
                  />
                </div>
              </div>
            </div>
          </FormikForm>
        );
      }}
    </Formik>
  );
};

export default Message;
