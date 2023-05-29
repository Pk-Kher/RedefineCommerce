/*Component Name: SEOSocial
Component Functional Details:  SEOSocial .
Created By: PK Kher
Created Date: 9-13-2022
Modified By: PK Kher
Modified Date: 9-13-2022 */

import React, { useState } from "react";
import { useFormikContext } from "formik";
import Input from "components/common/formComponent/Input";
import Textarea from "components/common/formComponent/Textarea";
import ImageFile from "components/common/formComponent/ImageFile";
import OpenGraphPopup from "components/common/modals/SEOConfig/OpenGraphPopup";
import { useSelector } from "react-redux";
import facebookIcon from "assets/images/fb-icon.png";
import twitterIcon from "assets/images/twitter-icon.png";
import linkedinIcon from "assets/images/linkedin-icon.png";
import pinterestIcon from "assets/images/pinterest-icon.png";
import { blobFolder } from "global/Enum";
import { ToolTipsMessages } from "global/ToolTipsMessages";
import ToolTipComponent from "components/common/ToolTips";

const SEOSocial = ({ values, setFieldValue, displayFieldElement, readOnly, fields, id, moduleName }) => {
    const permission = useSelector(store => store.permission);
    const CompanyId = useSelector((store) => store?.CompanyConfiguration.id)
    const FolderPath = `/${blobFolder.temp}/${CompanyId}/${blobFolder[moduleName]}${!id ? "/0" : `/${id}`}/${blobFolder.seo}`

    return (
        <>
            <div>
                <div id="socialPanel">
                    <div className="mt-6">
                        <div className="flex flex-wrap -mx-4 -mb-4 md:mb-0">
                            {displayFieldElement(fields, "openGraphImagePath") && (<div className="w-full md:w-1/2 px-4 mb-4">
                                <ImageFile
                                    type="file"
                                    className="sr-only"
                                    name="openGraphImagePath"
                                    id="openGraphImagePath"
                                    buttonName="Add"
                                    disabled={readOnly}
                                    folderpath={`${FolderPath}`}
                                    onChange={(value) => {
                                        if ((!values.facebookImagePath && values.facebookImagePath === '') || values.openGraphImagePath === values.facebookImagePath) {
                                            setFieldValue("facebookImagePath", value);
                                        }
                                        if ((!values.twitterImagePath && values.twitterImagePath === '') || values.openGraphImagePath === values.twitterImagePath) {
                                            setFieldValue("twitterImagePath", value);
                                        }
                                        if ((!values.linkedinImagePath && values.linkedinImagePath === '') || values.openGraphImagePath === values.linkedinImagePath) {
                                            setFieldValue("linkedinImagePath", value);
                                        }
                                        setFieldValue("openGraphImagePath", value);
                                    }}
                                    url={values.openGraphImagePath}
                                />

                            </div>)}
                            <div className="w-full md:w-1/2 px-4 mb-4">
                                {displayFieldElement(fields, "previewType") && (<div >
                                    <div className="flex items-center justify-between">
                                        <label className="tracking-wide text-gray-700 text-sm font-bold mb-2 flex items-center">
                                            Open Graph Title
                                            <ToolTipComponent
                                            id="SeoOpenGraphTitle"
                                            message={ToolTipsMessages.SEOConfiguratorTooltips.SeoOpenGraphTitle}
                                            />
                                        </label>
                                        <span className="text-xs"><span x-html="count">{values.openGraphTitle.length}</span> / <span>60</span> Character</span>
                                          </div>
                                    <Input
                                        name={'openGraphTitle'}
                                        className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                        type="text"
                                        placeholder=""
                                        maxLength="60"
                                        disabled={readOnly}
                                    />
                                </div>)}
                                {displayFieldElement(fields, "previewType") && (<div className="mb-6" x-data="{ count: 0 }">
                                    <div className="flex items-center justify-between">
                                        <label className="tracking-wide text-gray-700 text-sm font-bold mb-2 flex items-center">
                                            Open Graph Description
                                            <ToolTipComponent
                                            id="SeoOpenGraphDesc"
                                            message={ToolTipsMessages.SEOConfiguratorTooltips.SeoOpenGraphDesc}
                                            />
                                        </label>
                                        <span className="text-xs"><span x-html="count">{values.openGraphDescription}</span> / <span>60</span> Character</span>
                                    </div>
                                    <Textarea name="openGraphDescription" id="openGraphDescription" className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" maxLength="60" disabled={readOnly} />
                                </div>)}
                            </div>

                        </div>
                    </div>
                    <div className="mt-10 mb-10"> <hr className="border-neutral-300" /> </div>
                    <div className="mt-6">
                        <ul>
                            <li className="w-full">
                                <div type="button" className="flex items-center justify-between w-full group mb-1"> <div className="text-md text-gray-800 font-bold">Social Preview</div> </div>
                                <div className="relative text-sm overflow-hidden duration-700">
                                    <div className="mt-6">
                                        <div className="flex flex-wrap -mx-4 -mb-4 md:mb-0">
                                            <div className="w-full md:w-1/2 px-4 mb-4">
                                                <SocialPreview socialIcon={facebookIcon} name={'facebook'} readOnly={readOnly} displayFieldElement={displayFieldElement} fields={fields} id={id} />
                                            </div>
                                            <div className="w-full md:w-1/2 px-4 mb-4">
                                                <SocialPreview socialIcon={twitterIcon} name={'twitter'} readOnly={readOnly} displayFieldElement={displayFieldElement} fields={fields} id={id} />
                                            </div>
                                            <div className="w-full md:w-1/2 px-4 mb-4">
                                                <SocialPreview socialIcon={linkedinIcon} name={'linkedin'} readOnly={readOnly} displayFieldElement={displayFieldElement} fields={fields} id={id} />
                                            </div>
                                            <div className="w-full md:w-1/2 px-4 mb-4">
                                                <SocialPreview socialIcon={pinterestIcon} name={'pinterest'} readOnly={readOnly} displayFieldElement={displayFieldElement} fields={fields} id={id} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SEOSocial;

const SocialPreview = ({ readOnly, socialIcon, name, displayFieldElement, fields, id }) => {
    const permission = useSelector(store => store.permission);
    const [openModal, setOpenModal] = useState(false);
    const { values, setFieldValue } = useFormikContext();
    // console.log(displayFieldElement(fields, `${name}ImagePath`), `${name}ImagePath`);
    const CompanyId = useSelector((store) => store?.CompanyConfiguration.id)
    const FolderPath = `/${blobFolder.temp}/${CompanyId}/${blobFolder.store}${!id ? "/0" : `/${id}`}/${blobFolder.seo}`

    return (
        <>
            <div className="border border-gray-200 p-4">
                <div className="text-center mt-1 mb-3 w-10 mx-auto text-[#1e4fad]">
                    <img src={socialIcon} title="" alt="" />
                    {/* <span className="material-icons-outlined text-[48px]"> facebook </span> */}
                </div>
                {/* <img className="rounded mt-3" src={values[`${name}ImagePath`]} alt="" /> */}
                {displayFieldElement(fields, `${name}ImagePath`) && (
                    <ImageFile
                        type="file"
                        className="sr-only"
                        name={`${name}ImagePath`}
                        id={`${name}ImagePath`}
                        buttonName="Add"
                        folderpath={`${FolderPath}`}
                        url={values[`${name}ImagePath`]}
                        onChange={(url) => {
                            setFieldValue(`${name}ImagePath`, url)
                        }}
                        disabled={readOnly}
                    />)}

                {(values[`${name}ImagePath`] !== undefined && values[`${name}ImagePath`] !== '') ? (
                    <>
                        <div className="mb-3 text-base bg-gray-100 px-4 py-4 max-w-full">
                            <div className="text-base leading-5 font-bold text-black mb-1">{values[`${name}OpenGraphTitle`]}</div>
                            <div className="text-sm leading-5 text-gray-500">{values[`${name}OpenGraphDescription`]}</div>
                        </div>
                        <div className="flex justify-between">
                            <label className="tracking-wide text-gray-700 text-sm leading-4 flex items-center" htmlFor="">We recommend 1,200px by 628px.</label>
                            <div>
                                {(!readOnly && (permission?.isEdit || permission?.isDelete)) && <button type="button" onClick={() => setOpenModal(true)} className="btn btn-sm bg-indigo-500 hover:bg-indigo-600 text-white"><span className="material-icons-outlined"> edit </span> <span className="ml-1">Edit</span></button>}
                            </div>
                        </div>
                    </>
                ) :
                    <div className="flex justify-between mt-5">
                        <label className="tracking-wide text-gray-700 text-sm leading-4 flex items-center" htmlFor="">We recommend 1,200px by 628px.</label>
                    </div>}
            </div>
            <OpenGraphPopup openModal={openModal} setOpenModal={setOpenModal} name={name} displayFieldElement={displayFieldElement} fields={fields} />
        </>
    );
}
