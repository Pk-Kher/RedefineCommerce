import React, { useState, useEffect } from 'react'
import * as Yup from "yup";

import { ValidationMsgs } from "global/ValidationMessages";
import {
    Formik,
    Form as FormikForm,
} from "formik";
import PageEditMainHeader from '../PageEditMainHeader';
import PageEditTabHeader from '../PageEditTabHeader';
import RadioButtonGroup from 'components/common/formComponent/RadioButtonGroup';
import DatePicker from "components/common/formComponent/DatePicker";
import Input from 'components/common/formComponent/Input';
import Checkbox from 'components/common/formComponent/Checkbox';
import { useCallback } from 'react';
import TopicsDetailsServices from 'services/admin/topics/TopicsDetailsServices';
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { serverError } from "services/common/helper/Helper";
import Messages from "components/common/alerts/messages/Index";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";


const PublishOptions = () => {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const dispatch = useDispatch();
    const schema = Yup.object().shape({
        name: Yup.string().required(ValidationMsgs.pageEditSetting.general.name),
    });
    const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

    const radioOption = [
        { label: "Publish now", value: "N" },
        { label: "Change publish date", value: "C" },
    ];

    const getTopicPublishOptionsData = useCallback(() => {
        TopicsDetailsServices.getTopicDetails(id)
            .then((res) => {
                setData(res.data.data);
            })
            .catch((err) => {
                //console.log(err);
            });
    })

    useEffect(() => {
        getTopicPublishOptionsData();
    }, []);

    const publishPage = () => {
        dispatch(setAddLoading(true))
    
        let topicObj = {
          "id": id,
          "title": "string",
          "pageType": "string",
          "passRequired": "string",
          "password": "string",
          "pass_expiry_period": "string",
          "author": "string",
          "preview_As": "string",
          "store_Id": 4,
          "slug": "string",
          "topic_Title": "string",
          "meta_Description": "string",
          "meta_Keywords": "string",
          "template_Id": 0,
          "head_Html": "string",
          "footer_Html": "string",
          "canonical_Url": "string",
          "publish_Duration": "string",
          "publish_Date": null,
          "publish_Time": null,
          "unpublish_Date": null,
          "unpublish_Time": null,
          "schedule_Unpublish": "string",
          "redirect_Page_Id": "string",
          "created_By": "string",
          "updated_By": "string",
          "status": "string",
          "created_At": null,
          "updated_At": null,
          "isHomePage": "string",
          "page_Id": id,
          "menu_Type": "string"
        };
        TopicsDetailsServices.publishPage(topicObj)
        .then((res) => {
          alert(ValidationMsgs.topic.publishSuccess);
          dispatch(setAddLoading(false));
  
        }).catch((error) => {
          alert(ValidationMsgs.topic.publishError);
          dispatch(setAddLoading(false));
  
        });
    }

    const handleSubmitHandler = (fields, resetForm) => {
        dispatch(setAddLoading(true))
        
        fields.id = id;
        fields.title = data.title;
        fields.pageType = data.pageType;
        fields.passRequired = data.passRequired;
        fields.password = data.password;
        fields.passExpiryPeriod = data.passExpiryPeriod;
        fields.tag = data.tag;
        fields.author = data.author;
        fields.previewAs = data.previewAs;
        fields.storeId = data.storeId;
        fields.slug = data.slug;
        fields.topicTitle = data.topicTitle;
        fields.metaDescription = data.metaDescription;
        fields.metaKeywords = data.metaKeywords;
        fields.templateId = data.templateId;
        fields.headHtml = data.headHtml;
        fields.footerhtml = data.footerhtml;
        fields.canonicalurl = data.canonicalurl;
        fields.publishDuration = data.publishDuration;
        fields.redirectPageId = data.redirectPageId;
        fields.createdBy = data.createdBy;
        fields.updatedBy = data.updatedBy;
        fields.status = "P";
        fields.createdAt = data.createdAt;
        fields.updatedAT = data.updatedAT;
        fields.isHomePage = data.isHomePage;
        fields.publish_status = data.publish_status;
        fields.menuType = data.mnuType;
        fields.oldId = data.oldId;


        TopicsDetailsServices.updateTopic(id, { ...fields }).then((response) => {
            if (response.data.success && response.data.data) {
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
        }).catch((err) => {
            //console.log(err, "Update Response");
            dispatch(setAlertMessage({ type: "danger", message: ValidationMsgs.pageEditSetting.topic.topicNotUpdated }));
            dispatch(setAddLoading(false))
        });

        if(fields.publish_duration === "N")
        {
            publishPage();
        }
    }
    return (
        <div className="bg-white h-screen">
            <Formik
                enableReinitialize={true}
                initialValues={{
                    publish_duration: data?.publish_duration,
                    publish_date: data?.publish_date,
                    publish_time: data?.publish_time,
                    schedule_unpublish: data?.schedule_unpublish,
                    unpublish_date: data?.unpublish_date,
                    unpublish_time: data?.unpublish_time,
                    store_id: data?.store_id,
                    title: data?.title,
                }}
                // validationSchema={schema}
                onSubmit={handleSubmitHandler}
            >
                {
                    ({ values, setFieldValue }) => {
                        return (
                            <FormikForm>
                                <PageEditMainHeader loading={GlobalLoading} />
                                <PageEditTabHeader activeTab={4}>
                                    <div className="w-full">
                                        <Messages />
                                        <div className="mb-7 flex flex-wrap justify-start items-center">
                                            <div className="text-2xl text-gray-800 font-bold">
                                                Publishing Options
                                                {data?.status == 'P'
                                                    ?
                                                    <div className="text-xs inline-flex font-medium border border-green-300 bg-green-100 text-green-600 rounded-full text-center px-4 py-1 ml-3">
                                                        Published
                                                    </div> : ""
                                                }

                                            </div>
                                        </div>
                                        <div className="mb-6 w-full">
                                            <div className="mb-6">
                                                <RadioButtonGroup
                                                    name="publish_duration"
                                                    align="horizontal"
                                                    options={radioOption}
                                                />
                                            </div>

                                            <div className={`mb-6 ${values.publish_duration == 'N' ? '' : 'hidden'}`}>Your landing page will be updated immediately. </div>
                                            <div className={`mb-6 ${values.publish_duration == 'C' ? '' : 'hidden'}`}>
                                                <div className="mb-6">
                                                    You can change the publish date after publishing only if it is set to a date in the past. To set it in the future, first unpublish this landing page.
                                                </div>
                                                <div className="mb-2 text-xl font-bold">When would you like to release your page?</div>
                                                <div className="grid grid-cols-2 mb-6 gap-2">
                                                    <div >
                                                        <div className="w-full md:mr-2">
                                                            <DatePicker className={"mr-2"} name={"publish_date"} defaultValue={values.publish_date} placeholder="Select Date" />
                                                        </div>
                                                    </div>
                                                    <div >
                                                        <div className="w-full md:mr-2">
                                                            <Input type="time" name={"publish_time"} defaultValue={values.publish_time} placeholder="Select Time" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <div className="mb-2 text-xl font-bold">Scheduled unpublish</div>
                                            <div className="mb-6">
                                                <label className="flex items-center font-medium text-sm">
                                                    <Checkbox
                                                        name="schedule_unpublish"

                                                        label="Unpublish page on a specific date"
                                                        checked={(values?.schedule_unpublish == 'Y') ? true : false}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setFieldValue("schedule_unpublish", 'Y');
                                                            } else {
                                                                setFieldValue("schedule_unpublish", 'N');
                                                            }
                                                        }}
                                                    />
                                                </label>
                                            </div>
                                            <div className={`grid grid-cols-2 mb-6 gap-2 ${values.schedule_unpublish == 'Y' ? '' : 'hidden'}`}>
                                                <div className="w-full">
                                                    <label className="tracking-wide text-gray-700 text-sm font-bold mb-2 flex items-center"> Unpublish date </label>
                                                    <DatePicker className={"mr-2"} name={"unpublish_date"} defaultValue={values.unpublish_date} placeholder="Select Date" />
                                                </div>
                                                <div className="w-full">
                                                    <label className="tracking-wide text-gray-700 text-sm font-bold mb-2 flex items-center"> Unpublish Time </label>
                                                    <Input type="time" name={"unpublish_time"} defaultValue={values.unpublish_time} placeholder="Select Time" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </PageEditTabHeader>
                            </FormikForm>
                        )
                    }
                }
            </Formik>
        </div>
    )
}

export default PublishOptions