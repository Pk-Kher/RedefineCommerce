
import RadioButton from 'components/common/formComponent/RadioButton';
import React, { useCallback, useEffect, useState } from 'react';
import TemplateService from 'services/admin/template/TemplateService';
import { useParams } from "react-router-dom";

const PageTemplate = () => {

    const [templateData, setTemplateData] = useState([]);
    const [templateID, setTemplateId] = useState();
    const { id } = useParams();

    const fetchTemplateList = useCallback(() => {
        TemplateService.getTemplates(0)
            .then((res) => {
                if (res.data.data.length > 0) {
                    setTemplateData(res.data.data);
                }
            }).catch((error) => {
                //console.log(error, "Template ERrror");
            });
    }, []);

    useEffect(() => {
        fetchTemplateList();
    }, []);

    const submitHandler = () => {
        //console.log('Page ID', id, 'Template ID', templateID);
    }

    return (
        <>
            <title>Content Template</title>
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="sm:flex sm:justify-between sm:items-center mb-8">
                    <div className="col-span-full w-full flex justify-between items-center">
                        <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
                            Choose a template
                        </h1>
                        <div className="relative inline-flex">
                            <button
                                type="button"
                                className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                                onClick={() => {
                                    submitHandler();
                                }}
                            >
                                <span className="ml-1">Select template</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-span-full w-full bg-white shadow-xxl rounded-md mb-8 p-4">
                    <div className="mb-5">
                        <div className="relative">
                            <label htmlFor="app-search" className="sr-only">Search</label>
                            <input id="app-search"
                                className="form-input w-full pl-9 py-3 focus:border-neutral-300" type="search"
                                placeholder="Search…" />
                            <button className="absolute inset-0 right-auto group" type="submit"
                                aria-label="Search">
                                <svg className="w-4 h-4 shrink-0 fill-current text-gray-400 group-hover:text-gray-500 ml-3 mr-2"
                                    viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                                    <path
                                        d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="mt-8">
                        <div className="grid grid-cols-12 gap-6">
                            {
                                templateData.map((values, i) => {
                                    return (
                                        <div className="col-span-full sm:col-span-6 xl:col-span-3 bg-white shadow-lg rounded-sm border border-neutral-200 overflow-hidden">
                                            <label className="flex flex-col h-full">
                                                <div className="h-96 border-b overflow-hidden">
                                                    <img className="w-full" src={values?.image_src} alt={values?.title} />
                                                </div>
                                                <div className="grow flex flex-col p-5">
                                                    <div className="grow">
                                                        <header className="mb-3 flex justify-between">
                                                            <h3 className="text-lg text-left text-gray-800 font-semibold">{values?.title}</h3>
                                                            <div >
                                                                <RadioButton
                                                                    name="template_id"
                                                                    id={values.id}
                                                                    value={values?.id}
                                                                    onClick={(e) => {
                                                                        setTemplateId(e.target.value);
                                                                    }}
                                                                />
                                                            </div>
                                                        </header>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PageTemplate