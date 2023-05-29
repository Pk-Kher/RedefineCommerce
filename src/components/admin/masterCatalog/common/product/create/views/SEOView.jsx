/*Component Name: SEOView.jsx
Component Functional Details: Basic Information tab field display
Created By: Vikas Patel
Created Date: 11-May-2022
Modified By: Viks Patel
Modified Date: June/02/2022 */
import React from 'react';
import RadioButton from 'components/common/formComponent/RadioButton';
import { useState, useEffect } from 'react';
import ImageFile from 'components/common/formComponent/ImageFile';
import facebookIcon from "assets/images/fb-icon.png";
import twitterIcon from "assets/images/twitter-icon.png";
import linkedinIcon from "assets/images/linkedin-icon.png";
import pinterestIcon from "assets/images/pinterest-icon.png";
import { productType } from "dummy/Dummy";
import { useSelector } from "react-redux";
import Image from "components/common/formComponent/Image";
// import BundleProductService from "services/admin/masterCatalog/store/bundle/SEOService";
import StoreProductService from "services/admin/masterCatalog/store/product/SEOService";
import { blobFolder, defaultImage } from 'global/Enum';
import { ToolTipsMessages } from 'global/ToolTipsMessages';
import ToolTipComponent from "components/common/ToolTips";
import { scrollTop } from 'services/common/helper/Helper';

const SEOView = ({ displayFieldElement, fetchFieldProperty, fields, values, requiredFields, tab, type, setActiveTab, index, productId }) => {
    const [preview, setPreview] = useState('desktop');
    const [Data, setData] = useState([]);
    // const API = ([productType.EcommerceStore, productType.CorporateStore].includes(type) : BundleProductService)
    useEffect(() => {
        let unmounted = false;
        StoreProductService.getSEOById(productId)
            .then((stores) => {
                if (stores?.data?.success && !unmounted) {
                    setData(stores?.data?.data);
                }
            })
            .catch((error) => { });
    }, []);

    return (
        <div className="px-6 py-12 border-b-4 border-neutral-200 last:border-b-0">
            <div className='flex items-center justify-between'>
                <div className='block uppercase tracking-wide text-gray-500 text-base font-bold mb-2'>
                    {tab.label}
                </div>
                <div >
                    <span className="text-indigo-500 cursor-pointer" onClick={() => { setActiveTab(index); scrollTop(); }}>Edit</span>
                </div>
            </div>
            <div className="w-full">
                <div >
                    <button className="flex items-center justify-between w-full group mb-1"><div className="text-lg text-gray-800 font-bold">Meta Data</div></button>
                    <div >
                        <div className="mt-6">
                            <div className="w-full">
                                <div className="mb-7 flex flex-wrap justify-start items-center"><div className="text-md text-gray-800 font-bold">Preview as:</div></div>
                                <div className="mb-6 w-full" x-data="{ selected: 'previewopt1' }">
                                    <div className="flex mb-6">
                                        <div className="form-check form-check-inline md:mr-5">
                                            <RadioButton
                                                className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-indigo-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                                id="previewurl1"
                                                type="radio"
                                                name="rdoUpdate"
                                                value="desktop"
                                                label={'Desktop Result'}
                                                checked={preview === 'desktop'}
                                                onChange={(e) => { setPreview('desktop'); }}
                                            />
                                        </div>
                                        <div className="form-check form-check-inline md:ml-5">
                                            <RadioButton
                                                className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-indigo-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                                id="previewurl2"
                                                type="radio"
                                                name="rdoUpdate"
                                                value="mobile"
                                                label={'Mobile Result'}
                                                checked={preview === 'mobile'}
                                                onChange={(e) => { setPreview('mobile'); }}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-6">
                                        <div className={`mb-3 text-base bg-white py-4 rounded ${preview === 'desktop' ? 'w-full' : ' w-2/4'}`}>
                                            <div className="text-sm leading-4 text-[#202124] flex py-1 font-arial">
                                                <span className="cursor-pointer" title="">https://www.corporategear.com › ... <span className="material-icons-outlined text-[15px]">more_vert</span></span>
                                            </div>
                                            <div className="text-[20px] text-[#1a0dab] font-arial leading-6 py-1"><span className="cursor-pointer" title="">Corporate Gear</span></div>
                                            <div className="text-sm text-black leading-6 mb-2">
                                                <div className="text-[14px] leading-[22px] text-[#4d5156] mb-2 mr-2 inline-block font-arial">
                                                    <span className="font-bold">Corporate Gear</span> gives its customers exclusive, direct access to custom branded clothing and accessories from iconic premium sports and lifestyle brands.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label className="tracking-wide text-gray-700 text-sm font-bold mb-2 flex items-center">
                                        Page URL *
                                        <div className="relative inline-block ml-2" x-data="{ open: false }">
                                            <ToolTipComponent
                                                id="PageURLProduct"
                                                message={ToolTipsMessages.SeoViewForProduct.PageURLProduct}
                                            />
                                        </div>
                                    </label>
                                    {/* <div className="text-sm"></div> */}
                                    <div className="flex">
                                        <div>{Data?.seName}</div>
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <div className="flex items-center justify-between">
                                        <label className="tracking-wide text-gray-700 text-sm font-bold mb-2 flex items-center">
                                            Page Title *
                                            <div className="relative" x-data="{ open: false }">
                                                {/* <button  ><span className="material-icons-outlined ml-2 text-sm">info</span></button> */}
                                                <ToolTipComponent
                                                    id="PageTitleProduct"
                                                    message={ToolTipsMessages.SeoViewForProduct.PageTitleProduct}
                                                />
                                            </div>
                                        </label>
                                    </div>
                                    <div >{Data?.pageTitle}</div>
                                </div>
                                <div className="mb-6">
                                    <div className="flex items-center justify-between">
                                        <label className="tracking-wide text-gray-700 text-sm font-bold mb-2 flex items-center">
                                            Meta Description *
                                            <div className="relative" x-data="{ open: false }">
                                                <ToolTipComponent
                                                    id=" MetaDescriptionProduct"
                                                    message={ToolTipsMessages.SeoViewForProduct.MetaDescriptionProduct}
                                                />
                                            </div>
                                        </label >
                                    </div >
                                    <div >{Data?.metaDescription}</div>
                                </div >
                                <div className="mb-6">
                                    <div className="flex items-center justify-between">
                                        <label className="tracking-wide text-gray-700 text-sm font-bold mb-2 flex items-center">
                                            Meta Keywords *
                                            <div className="relative" x-data="{ open: false }">
                                                <ToolTipComponent
                                                    id="MetaKeywordsProduct"
                                                    message={ToolTipsMessages.SeoViewForProduct.MetaKeywordsProduct}
                                                />
                                                <div className="z-10 absolute bottom-full left-1/2 transform -translate-x-1/2" aria-haspopup="true" >
                                                </div>
                                            </div>
                                        </label >
                                    </div >
                                    <div >{Data?.metaKeywords}</div>
                                </div >
                            </div >
                        </div >
                    </div >
                    <div className="mt-10 mb-10"><hr className="border-neutral-300" /></div>
                    <div>
                        <div x-data="{ show: false }">
                            <div className="mt-6">
                                <div className="flex flex-wrap -mx-4 -mb-4 md:mb-0">
                                    <div className="w-full md:w-1/2 px-4 mb-4">
                                        <span className="cursor-pointer block mb-4 active" title="" aria-expanded="true">
                                            <img className=" h-44 min-h-full mx-auto rounded-t-md" src={`${process.env.REACT_APP_API_BLOB}${Data?.openGraphImagePath}`} alt="No Image Data Found !" />
                                        </span>
                                        <label className="tracking-wide text-gray-700 text-sm mb-3 flex items-center" htmlFor="">We recommend 1,200px by 628px.</label>
                                    </div>
                                    <div className="w-full md:w-1/2 px-4 mb-4">
                                        <div className="mb-6">
                                            <div className="flex items-center justify-between">
                                                <label className="tracking-wide text-gray-700 text-sm font-bold mb-2 flex items-center">
                                                    Open Graph Title
                                                    <div className="relative" x-data="{ open: false }">
                                                        <ToolTipComponent
                                                            id="OpenGraphTitleProduct"
                                                            message={ToolTipsMessages.SeoViewForProduct.OpenGraphTitleProduct}
                                                        />
                                                        <div className="z-10 absolute bottom-full left-1/2 transform -translate-x-1/2">
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                            <div >{Data?.openGraphTitle} </div>
                                        </div>
                                        <div className="mb-6">
                                            <div className="flex items-center justify-between">
                                                <label className="tracking-wide text-gray-700 text-sm font-bold mb-2 flex items-center">
                                                    Open Graph Description
                                                    <div className="relative" x-data="{ open: false }">
                                                        <ToolTipComponent
                                                            id="OpenGraphDescriptionProduct"
                                                            message={ToolTipsMessages.SeoViewForProduct.OpenGraphDescriptionProduct}
                                                        />
                                                    </div>
                                                </label>
                                            </div >
                                            <div >{Data?.openGraphDescription} </div>
                                        </div >
                                    </div >
                                </div >
                            </div >
                            <div className="mt-4">
                                <ul >
                                    <li className="w-full">
                                        <button type="button" className="flex items-center justify-between w-full group mb-1"><div className="text-md text-gray-800 font-bold">Social Preview</div></button>
                                        <div className="relative text-sm overflow-hidden duration-700">
                                            <div className="mt-6">
                                                <div className="flex flex-wrap -mx-4 -mb-4 md:mb-0">
                                                    <div className="w-full md:w-1/2 px-4 mb-4">
                                                        {/* <div className="p-0 h-auto"><img className=" h-44 min-h-full mx-auto rounded-t-md" src={`${process.env.REACT_APP_API_BLOB}${Data?.facebookImagePath}`} alt="" /></div> */}
                                                        <SocialPreview fields={fields} name={"facebook"} displayFieldElement={displayFieldElement} imageUrl={Data?.facebookImagePath} socialIcon={facebookIcon} title={Data?.facebookOpenGraphTitle} description={Data?.facebookOpenGraphDescription} />
                                                    </div>
                                                    <div className="w-full md:w-1/2 px-4 mb-4">
                                                        <SocialPreview fields={fields} name={"twitter"} displayFieldElement={displayFieldElement} imageUrl={Data?.twitterImagePath} socialIcon={twitterIcon} title={Data?.twitterOpenGraphTitle} description={Data?.twitterOpenGraphDescription} />
                                                    </div>
                                                    <div className="w-full md:w-1/2 px-4 mb-4">
                                                        <SocialPreview fields={fields} name={"linkedin"} displayFieldElement={displayFieldElement} imageUrl={Data?.linkedinImagePath} socialIcon={linkedinIcon} title={Data?.linkedinOpenGraphTitle} description={Data?.linkedinOpenGraphDescription} />
                                                    </div>
                                                    <div className="w-full md:w-1/2 px-4 mb-4">
                                                        <SocialPreview fields={fields} name={"pinterest"} displayFieldElement={displayFieldElement} imageUrl={Data?.pinterestImagePath} socialIcon={pinterestIcon} title={Data?.pinterestOpenGraphTitle} description={Data?.pinterestOpenGraphDescription} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SEOView;

const SocialPreview = ({ socialIcon, name, description, title, fields, displayFieldElement, imageUrl }) => {
    const CompanyId = useSelector((store) => store?.CompanyConfiguration.id)
    const FolderPath = `/${blobFolder.temp}/${CompanyId}/${blobFolder.seoViews}`
    return (
        <>
            <div className="border border-gray-200 p-4">
                <div className="text-center mt-1 mb-3 w-10 mx-auto text-[#1e4fad]">
                    <img src={socialIcon} title="" alt="" />
                </div>

                {imageUrl ?
                    <>
                        {displayFieldElement(fields, `${name}ImagePath`) && (
                            <img
                                className="h-44 min-h-full mx-auto rounded-t-md"
                                name={`${name}ImagePath`}
                                id={`${name}ImagePath`}
                                src={`${process.env.REACT_APP_API_BLOB}${imageUrl}`}
                                alt="No Image"
                            />
                        )}
                    </>
                    :
                    ""
                }
                {imageUrl !== '' ? (
                    <>
                        {description && title ? (
                            <div className="mb-3 text-base bg-gray-100 px-4 py-4 max-w-full">
                                <div className="text-base leading-5 font-bold text-black mb-1">{title}</div>
                                <div className="text-sm leading-5 text-gray-500">{description}</div>
                            </div>
                        )
                            :
                            <div className="mb-3 text-base bg-gray-100 px-4 py-4 max-w-full">
                                <label className="tracking-wide text-gray-700 text-sm leading-4 flex items-center" htmlFor=""> No Data Found !</label>
                            </div>
                        }
                        <div className="flex justify-between">
                            <label className="tracking-wide text-gray-700 text-sm leading-4 flex items-center" htmlFor="">We recommend 1,200px by 628px.</label>
                        </div>
                    </>
                ) :
                    <div className="flex justify-between mt-5">
                        <label className="tracking-wide text-gray-700 text-sm leading-4 flex items-center" htmlFor="">We recommend 1,200px by 628px.</label>
                    </div>}
            </div>
        </>
    );
}


