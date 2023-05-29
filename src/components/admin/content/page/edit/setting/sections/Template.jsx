import Dropdown from 'components/common/formComponent/Dropdown';
import React, { useCallback, useEffect, useState } from 'react'
import { useFormikContext } from "formik";

import TemplateService from 'services/admin/template/TemplateService';
import axios from "axios";
import {
    contentTabs
} from 'global/Enum';
import Input from 'components/common/formComponent/Input';

const Template = ({dropDownOption, templateDataKeyByID}) => {
    const [show, setShow] = useState(false);
    const { setFieldValue, values } = useFormikContext();
    

    // const fetchTemplateList = useCallback(()=>{
    //     let TemplateOptionList = [];
    //     let TemplateListById = {};
    //     TemplateService.getTemplates(0)
    //         .then((res)=>{
    //             res.data.data.map((value, index)=>{
    //                 TemplateOptionList = [...TemplateOptionList, {"value": value.id, "label" : value.title}]
    //                 TemplateListById = {...TemplateListById, [value.id]:{"title":value.title, "image":value.image_src}}
    //             })
    //             setdropDownOption(TemplateOptionList);
    //             setTemplateDataKeyByID(TemplateListById);
    //             console.log(templateDataKeyByID?.[values.template_id]?.image, "templateDataKeyByID");
    //             console.log(dropDownOption, "dropDownOption", values.template_id);
    //             setFieldValue("template_preview_image", templateDataKeyByID?.[values.template_id]?.image || "");
    //         }).catch((error)=>{
    //             console.log(error, "Template ERrror");
    //         });
    // },[]);

    // useEffect(()=>{
    //     fetchTemplateList();
    // },[]);

    const handleOnChange = useCallback((currentValue) => {
        setFieldValue("template_preview_image", templateDataKeyByID?.[currentValue.value]?.image);
        setFieldValue("template_id", currentValue.value);
    });

    

    return (
        <div className="px-5 py-4 bg-white mb-6">
            <button className="flex items-center justify-between w-full group mb-1" type='button' onClick={() => setShow(!show)}>
                <div className="text-lg text-gray-800 font-bold">Template</div>
                <svg className={`w-8 h-8 shrink-0 fill-current text-gray-400 group-hover:text-gray-500 ml-3 ${show ? "rotate-180" : ""}`} viewBox="0 0 32 32">
                    <path d="M16 20l-5.4-5.4 1.4-1.4 4 4 4-4 1.4 1.4z"></path>
                </svg>
            </button>
            <div className={`${show ? "" : "hidden"}`}>
                <div className=''>
                    <div className="mb-2 text-md font-bold">Template used on this page</div>

                    <div className="flex mb-6">
                        <div className="w-1/2 md:mr-2">
                            <Dropdown
                                isMulti={false}
                                isClearable={false}
                                defaultValue={values.template_id}
                                name="template_id"
                                className={`w-full`}
                                options={dropDownOption}
                                onChange={(e) => handleOnChange(e)}
                            />
                        </div>
                        <div className="w-1/2 md:mr-2"></div>
                    </div>

                    <div className="mb-2 text-md font-bold">Template preview</div>
                    <Input type="hidden" name="template_preview_image"/>
                    <div className="mb-6 max-w-xs border border-solid border-neutral-200">
                        <img src={values?.template_preview_image} alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Template