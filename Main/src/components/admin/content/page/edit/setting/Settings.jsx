import React, { useState, useEffect, useCallback } from "react";
import AdvanceOptions from "./sections/AdvanceOptions";
import General from "./sections/General";
import MetaData from "./sections/MetaData";
import Template from "./sections/Template";

import * as Yup from "yup";

import { ValidationMsgs } from "global/ValidationMessages";

import {
  Formik,
  Form as FormikForm,
} from "formik";
import PageEditTabHeader from "../PageEditTabHeader";
import PageEditMainHeader from "../PageEditMainHeader";
import TopicsDetailsServices from "services/admin/topics/TopicsDetailsServices";
import StoreService from "services/admin/store/StoreService";
import { useParams } from "react-router-dom";
import TemplateService from "services/admin/template/TemplateService";
import { useDispatch } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { serverError } from "services/common/helper/Helper";
import Messages from "components/common/alerts/messages/Index";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const Settings = () => {
  const [data, setData] = useState([]);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [storeName, setStoreName] = useState('');
  const [storeUrl, setStoreUrl] = useState('');
  const [dropDownOption, setdropDownOption] = useState([]);
  const [templateDataKeyByID, setTemplateDataKeyByID] = useState([]);

  const handleSubmitHandler = (fields, { resetForm }) => {

    fields.pageType = data.pageType;
    fields.storeId = data.storeId;
    fields.publishDuration = data.publishDuration;

    fields.publishDate = data.publishDate;
    fields.publishTime =  data.publishTime;
    fields.unpublishDate =  data.unpublishDate;
    fields.unpublishTime =  data.unpublishTime;
    fields.scheduleUnpublish =  data.scheduleUnpublish;
    fields.redirectPageId =  data.redirectPageId;
    fields.createdBy =  data.createdBy;
    fields.updatedBy =  data.updatedBy;
    fields.status =  data.status;
    fields.createdAt =  data.createdAt;
    fields.updatedAT =  data.updatedAT;
    fields.publish_status =  data.publish_status;
    fields.menuType =  data.menuType;
    fields.oldId =  data.oldId;
    //   },
    //   "errors": {},
    //   "otherData": null
    // }


    updateTopic(fields, resetForm);
  };

  const updateTopic = (values, resetForm) => {
    dispatch(setAddLoading(true))

    TopicsDetailsServices.updateTopic(id, { ...values })
      .then((response) => {
        if (response.data.success && response.data.data) {
          // setData(response.data);
          dispatch(
            setAlertMessage({
              type: "success",
              message: ValidationMsgs.pageEditSetting.topic.topicUpdated,
            })
          );
        } else {
          dispatch(
            setAlertMessage({ type: "danger", message: serverError(response) })
          );
        }
        dispatch(setAddLoading(false))
      })
      .catch((err) => {
        dispatch(
          setAlertMessage({
            type: "danger",
            message: ValidationMsgs.pageEditSetting.topic.topicNotUpdated,
          })
        );
        dispatch(setAddLoading(false))
      });
  };

  const schema = Yup.object().shape({
    title: Yup.string().required(ValidationMsgs.pageEditSetting.general.title),
    //passRequired: Yup.string(),

    // password: Yup.string().when("passRequired", (passRequired) => {
    //   if (passRequired === "Y") {
    //     return Yup.string().required(
    //       ValidationMsgs.pageEditSetting.general.password
    //     );
    //   } else {
    //     return Yup.string();
    //   }
    // }),

    // tag: Yup.string().required(ValidationMsgs.pageEditSetting.general.tag),
    // author: Yup.string().required(
    //   ValidationMsgs.pageEditSetting.general.author
    // ),

    slug: Yup.string().required(ValidationMsgs.pageEditSetting.metaData.slug),
    topicTitle: Yup.string().required(
      ValidationMsgs.pageEditSetting.metaData.topicTitle
    ),
    metaDescription: Yup.string().required(
      ValidationMsgs.pageEditSetting.metaData.metaDescription
    ),
    // metaKeywords: Yup.string().required(
    //   ValidationMsgs.pageEditSetting.metaData.metaKeywords
    // ),
  });

  const [openGraphInfo, setOpenGraphInfo] = useState({
    image: data.opengraphimage ?? "",
    title: data.opengraphtitle ?? "",
    description: data.opengraphdescription ?? "",
  });
  const [fbOpenGraphInfo, setFBOpenGraphInfo] = useState({
    image: data.fbopengraphimage ?? "",
    title: data.fbopengraphtitle ?? "",
    description: data.fbopengraphdescription ?? "",
    imagediff: false,
    titlediff: false,
    descdiff: false,
  });
  const [lnkOpenGraphInfo, setLnkOpenGraphInfo] = useState({
    image: data.lnkopengraphimage ?? "",
    title: data.lnkopengraphtitle ?? "",
    description: data.lnkopengraphdescription ?? "",
    imagediff: false,
    titlediff: false,
    descdiff: false,
  });
  const [twtOpenGraphInfo, setTwtOpenGraphInfo] = useState({
    image: data.twtopengraphimage ?? "",
    title: data.twtopengraphtitle ?? "",
    description: data.twtopengraphdescription ?? "",
    imagediff: false,
    titlediff: false,
    descdiff: false,
  });
  const [pintOpenGraphInfo, setPintOpenGraphInfo] = useState({
    image: data.pintopengraphimage ?? "",
    title: data.pintopengraphtitle ?? "",
    description: data.pintopengraphdescription ?? "",
    imagediff: false,
    titlediff: false,
    descdiff: false,
  });

  const getTopicSettingData = useCallback(() => {
    TopicsDetailsServices.getTopicDetails(id)
      .then((res) => {
        setData(res.data.data);
        StoreService.getStoreById(res.data.data?.storeId)
          .then((res) => {
            var response = res.data;

            if (response.success) {

              setStoreName(response.data.name);
              setStoreUrl("https://" + response.data.url);
            }
          })
          .catch((err) => { });

      })
      .catch((err) => {
        //console.log(err);
      });
  }, []);

  const fetchTemplateList = useCallback(() => {
    let TemplateOptionList = [];
    let TemplateListById = {};
    TemplateService.getTemplates(0)
      .then((res) => {
        res.data.data.map((value, index) => {
          TemplateOptionList = [
            ...TemplateOptionList,
            { value: value.id, label: value.title },
          ];
          TemplateListById = {
            ...TemplateListById,
            [value.id]: { title: value.title, image: value.image_src },
          };
        });
        setdropDownOption(TemplateOptionList);
        setTemplateDataKeyByID(TemplateListById);
      })
      .catch((error) => {
        //console.log(error, "Template ERrror");
      });
  }, []);

  useEffect(() => {
    getTopicSettingData();
    fetchTemplateList();
    if (openGraphInfo.image != "") {
      if (fbOpenGraphInfo.image == "")
        setFBOpenGraphInfo((prev) => ({ ...prev, image: openGraphInfo.image }));
      else {
        if (
          fbOpenGraphInfo.image != "" &&
          fbOpenGraphInfo.image != openGraphInfo.image
        ) {
          setFBOpenGraphInfo((prev) => ({ ...prev, imagediff: true }));
        }
      }
      if (twtOpenGraphInfo.image == "")
        setTwtOpenGraphInfo(openGraphInfo.image);
      else {
        if (
          twtOpenGraphInfo.image != "" &&
          twtOpenGraphInfo.image != openGraphInfo.image
        ) {
          setTwtOpenGraphInfo((prev) => ({ ...prev, imagediff: true }));
        }
      }
      if (lnkOpenGraphInfo.image == "")
        setLnkOpenGraphInfo(openGraphInfo.image);
      else {
        if (
          lnkOpenGraphInfo.image != "" &&
          lnkOpenGraphInfo.image != openGraphInfo.image
        ) {
          setLnkOpenGraphInfo((prev) => ({ ...prev, imagediff: true }));
        }
      }
    }
  }, []);

  return (
    <div className="bg-white">
      <Formik
        enableReinitialize={true}
        initialValues={{
          id: id,
          title: data.title || "",
          passRequired: data?.passRequired,
          password: data?.password || "",
          passExpiryPeriod: data?.passExpiryPeriod || "",
          tag: data?.tag || "",
          author: data?.author || "",
          isHomePage: data?.isHomePage,

          previewAs: data?.previewAs || "",
          slug: data?.slug || "",
          topicTitle: data?.topicTitle || "",
          metaDescription: data?.metaDescription || "",
          metaKeywords: data.metaKeywords || "",

          opengraphimage: openGraphInfo?.image,
          opengraphtitle: openGraphInfo?.title,
          opengraphdescription: openGraphInfo?.description,
          fbopengraphimage: fbOpenGraphInfo?.image,
          fbopengraphtitle: fbOpenGraphInfo?.title,
          fbopengraphdescription: fbOpenGraphInfo?.description,
          twtopengraphimage: twtOpenGraphInfo?.image,
          twtopengraphtitle: twtOpenGraphInfo?.title,
          twtopengraphdescription: twtOpenGraphInfo?.description,
          lnkopengraphimage: lnkOpenGraphInfo?.image,
          lnkopengraphtitle: lnkOpenGraphInfo?.title,
          lnkopengraphdescription: lnkOpenGraphInfo?.description,
          pintopengraphimage: pintOpenGraphInfo?.image,
          pintopengraphtitle: pintOpenGraphInfo?.title,
          pintopengraphdescription: pintOpenGraphInfo?.description,

          templateId: data?.templateId || "0",
          storeId: data?.storeId || "",

          headHtml: data?.headHtml || "",
          canonicalurl: data?.canonicalurl || "",
          footerhtml: data?.footerhtml || "",
          template_preview_image: data?.template?.image_src || "",
        }}
        validationSchema={schema}
        onSubmit={handleSubmitHandler}
      >
        {() => {
          return (
            <FormikForm>
              <PageEditMainHeader storeName={storeName} />
              <PageEditTabHeader activeTab={2}>
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-2xl md:text-3xl text-gray-800 font-bold mb-6">
                    Settings
                  </h1>
                  <Messages />
                  <General />
                  <MetaData storeUrl={storeUrl} storeName={storeName} />
                  {/* <SocialSetting 
                                            setOpenGraphInfo={setOpenGraphInfo}
                                            setFBOpenGraphInfo={setFBOpenGraphInfo}
                                            setLnkOpenGraphInfo={setLnkOpenGraphInfo}
                                            setTwtOpenGraphInfo={setTwtOpenGraphInfo}
                                            setPintOpenGraphInfo={setPintOpenGraphInfo}
                                            openGraphInfo={openGraphInfo}
                                            fbOpenGraphInfo={fbOpenGraphInfo}
                                            twtOpenGraphInfo={twtOpenGraphInfo}
                                            pintOpenGraphInfo={pintOpenGraphInfo}
                                            lnkOpenGraphInfo={lnkOpenGraphInfo}
                                        /> */}

                  <Template
                    dropDownOption={dropDownOption}
                    templateDataKeyByID={templateDataKeyByID}
                  />
                  <AdvanceOptions />
                </div>
              </PageEditTabHeader>
            </FormikForm>
          );
        }}
      </Formik>
    </div>
  );
};

export default Settings;
