import React, { useState, useRef } from 'react'
import { useFormikContext } from "formik";
import Input from 'components/common/formComponent/Input';
import Textarea from 'components/common/formComponent/Textarea';
import ToolTipComponent from "components/common/ToolTips";
import { useSelector } from "react-redux";

import OpenGraphPopup from "components/common/modals/SEOConfig/OpenGraphPopup";

import facebookIcon from "assets/images/fb-icon.png";
import twitterIcon from "assets/images/twitter-icon.png";
import linkedinIcon from "assets/images/linkedin-icon.png";
import pinterestIcon from "assets/images/pinterest-icon.png";

import FileUploadDnD from "components/common/formComponent/FileUploadDnD";
import { blobFolder } from 'global/Enum';

const SocialSetting = ({
    setOpenGraphInfo,
    setFBOpenGraphInfo,
    setLnkOpenGraphInfo,
    setTwtOpenGraphInfo,
    setPintOpenGraphInfo,
    openGraphInfo,
    fbOpenGraphInfo,
    twtOpenGraphInfo,
    pintOpenGraphInfo,
    lnkOpenGraphInfo
}) => {
    const [show, setShow] = useState(false);
    const { values, setFieldValue } = useFormikContext();
    const getEditData = useRef(null);

    const CompanyId = useSelector((store) => store?.CompanyConfiguration.id)
    const FolderPath = `/${blobFolder.temp}/${CompanyId}/${blobFolder.socialSettings}`


    return (
        <div className="px-5 py-4 bg-white mb-6">
            <button className="flex items-center justify-between w-full group mb-1" type='button' onClick={() => setShow(!show)}>
                <div className="text-lg text-gray-800 font-bold">Social Settings</div>
                <svg className={`w-8 h-8 shrink-0 fill-current text-gray-400 group-hover:text-gray-500 ml-3 ${show ? "rotate-180" : ""}`} viewBox="0 0 32 32">
                    <path d="M16 20l-5.4-5.4 1.4-1.4 4 4 4-4 1.4 1.4z"></path>
                </svg>
            </button>
            <div className={`${show ? "" : "hidden"}`}>
                <div className='p-5'>
                    <div className="mt-6">
                        <div className="flex flex-wrap -mx-4 -mb-4 md:mb-0">
                            <div className="w-full md:w-1/2 px-4 mb-4 h-100 FilesDragAndDrop">
                                {false ? (
                                    <img src="http://ystore.us/HTML/RedefineCommerce/Admin/images/social-preview-facebook.jpg" />
                                ) : (
                                    <FileUploadDnD
                                        id="opengraphimage"
                                        type={`file`}
                                        folderpath={`${FolderPath}`}
                                        className="h-72 flex justify-center items-center  mt-6   border-2 border-gray-300 border-dashed rounded-md  mb-4 w-4/5  FilesDragAndDrop__area"
                                        name={`opengraphimage`}
                                        url={openGraphInfo.image}
                                        onChange={(value) => {
                                            setFieldValue("opengraphimage", value);
                                            setOpenGraphInfo((prev) => ({
                                                ...prev,
                                                image: value,
                                            }));

                                            if (
                                                fbOpenGraphInfo.image.length <= 0 ||
                                                (!fbOpenGraphInfo.imagediff && value == "")
                                            ) {
                                                setFBOpenGraphInfo((prev) => ({
                                                    ...prev,
                                                    image: value,
                                                }));
                                            } else if (!fbOpenGraphInfo.imagediff) {
                                                setFBOpenGraphInfo((prev) => ({
                                                    ...prev,
                                                    image: value,
                                                }));
                                            }

                                            if (
                                                twtOpenGraphInfo.image.length <= 0 ||
                                                (!twtOpenGraphInfo.imagediff && value == "")
                                            ) {
                                                setTwtOpenGraphInfo((prev) => ({
                                                    ...prev,
                                                    image: value,
                                                }));
                                            } else if (!twtOpenGraphInfo.imagediff) {
                                                setTwtOpenGraphInfo((prev) => ({
                                                    ...prev,
                                                    image: value,
                                                }));
                                            }

                                            if (
                                                lnkOpenGraphInfo.image.length <= 0 ||
                                                (!lnkOpenGraphInfo.imagediff && value == "")
                                            ) {
                                                setLnkOpenGraphInfo((prev) => ({
                                                    ...prev,
                                                    image: value,
                                                }));
                                            } else if (!lnkOpenGraphInfo.imagediff) {
                                                setLnkOpenGraphInfo((prev) => ({
                                                    ...prev,
                                                    image: value,
                                                }));
                                            }
                                        }}
                                    />
                                )}
                                <label className="tracking-wide text-gray-700 text-sm mb-3 flex items-center">
                                    We recommend 1,200px by 628px.
                                </label>
                            </div>
                            <div className="w-full md:w-1/2 px-4 mb-4">
                                <div className="mt-6"
                                    x-data="{ count: 0 }"
                                    x-init="count = $refs.countme.value.length"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="tracking-wide text-gray-700 text-sm font-bold mb-2 flex items-center">
                                            Open Graph Title
                                            <div className="relative ml-2">
                                                <button
                                                    className="block"
                                                    aria-haspopup="true"
                                                    data-tip=""
                                                    data-for="opengraphtitle"
                                                    type="button"
                                                >
                                                    <svg
                                                        className="w-4 h-4 fill-current text-slate-400"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
                                                    </svg>
                                                </button>

                                                <ToolTipComponent
                                                    id="opengraphtitle"
                                                    className="uppercase tracking-wide text-gray-500 text-xs font-bold mb-2 flex flex-wrap"
                                                    elemForToolTip={`We are seeing Open Graph Title Tooltip`}
                                                />
                                            </div>
                                        </div>

                                        <span className="text-xs">
                                            <span x-html="count">0</span> /
                                            <span x-html="$refs.countme.maxLength">
                                                60
                                            </span>
                                            Character
                                        </span>
                                    </div>

                                    <Input
                                        type={"text"}
                                        name={"opengraphtitle"}
                                        placeholder=""
                                        maxLength="160"
                                        id="opengraphtitle"
                                        defaultValue={openGraphInfo.title}
                                        onKeyUp={(e) => {
                                            setOpenGraphInfo((prev) => ({
                                                ...prev,
                                                title: e.target.value,
                                            }));

                                            if (
                                                fbOpenGraphInfo.title.length <= 0 ||
                                                !fbOpenGraphInfo.titlediff
                                            )
                                                setFBOpenGraphInfo((prev) => ({
                                                    ...prev,
                                                    title: e.target.value,
                                                }));

                                            if (
                                                twtOpenGraphInfo.title.length <= 0 ||
                                                !twtOpenGraphInfo.titlediff
                                            )
                                                setTwtOpenGraphInfo((prev) => ({
                                                    ...prev,
                                                    title: e.target.value,
                                                }))
                                            if (
                                                lnkOpenGraphInfo.title.length <= 0 ||
                                                !lnkOpenGraphInfo.titlediff
                                            )
                                                setLnkOpenGraphInfo((prev) => ({
                                                    ...prev,
                                                    title: e.target.value,
                                                }));
                                        }}
                                        className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}
                                    />
                                </div>
                                <div
                                    className="mb-6"
                                    x-data="{ count: 0 }"
                                    x-init="count = $refs.countme.value.length"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="tracking-wide text-gray-700 text-sm font-bold mb-2 flex items-center">
                                            Open Graph Description
                                            <div className="relative ml-2">
                                                <button
                                                    className="block"
                                                    aria-haspopup="true"
                                                    data-tip=""
                                                    data-for="opengraphdescription"
                                                    type="button"
                                                >
                                                    <svg
                                                        className="w-4 h-4 fill-current text-slate-400"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
                                                    </svg>
                                                </button>
                                                <ToolTipComponent
                                                    id="opengraphdescription"
                                                    className="uppercase tracking-wide text-gray-500 text-xs font-bold mb-2 flex flex-wrap"
                                                    elemForToolTip={`We are seeing Open Graph Description Tooltip`}
                                                />
                                            </div>
                                        </div>

                                        <span className="text-xs">
                                            <span x-html="count">0</span> /
                                            <span x-html="$refs.countme.maxLength">
                                                60
                                            </span>
                                            Character
                                        </span>
                                    </div>

                                    <Textarea
                                        name={"opengraphdescription"}
                                        placeholder=""
                                        maxLength="160"
                                        id="opengraphdescription"
                                        onKeyUp={(e) => {
                                            // setOpenGraphDescription(e.target.value);
                                            setOpenGraphInfo((prev) => ({
                                                ...prev,
                                                description: e.target.value,
                                            }));

                                            if (
                                                fbOpenGraphInfo.description.length <=
                                                0 ||
                                                !fbOpenGraphInfo.descdiff
                                            )
                                                setFBOpenGraphInfo((prev) => ({
                                                    ...prev,
                                                    description: e.target.value,
                                                }));

                                            if (
                                                twtOpenGraphInfo.description.length <=
                                                0 ||
                                                !twtOpenGraphInfo.descdiff
                                            )
                                                setTwtOpenGraphInfo((prev) => ({
                                                    ...prev,
                                                    description: e.target.value,
                                                }));

                                            if (
                                                lnkOpenGraphInfo.description.length <=
                                                0 ||
                                                !lnkOpenGraphInfo.descdiff
                                            )
                                                setLnkOpenGraphInfo((prev) => ({
                                                    ...prev,
                                                    description: e.target.value,
                                                }));
                                        }}
                                        className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 mb-10">
                        <hr className="border-neutral-300" />
                    </div>
                    {(openGraphInfo.image !== "" ||
                        fbOpenGraphInfo.image !== "" ||
                        twtOpenGraphInfo.image !== "" ||
                        pintOpenGraphInfo.image !== "") && (
                            <>
                                <div className="mt-6">
                                    <ul>
                                        <li className="w-full">
                                            <button
                                                type="button"
                                                className="flex items-center justify-between w-full group mb-1"
                                            >
                                                <div className="text-md text-gray-800 font-bold">
                                                    Social Preview
                                                </div>
                                            </button>
                                            <div className="relative text-sm overflow-hidden duration-700">
                                                <div className="mt-6">
                                                    <div className="flex flex-wrap -mx-4 -mb-4 md:mb-0">
                                                        <div className="w-full md:w-1/2 px-4 mb-4">
                                                            <div className="border border-gray-200 rounded p-4">
                                                                <div className="text-center mt-1 w-10 mx-auto">
                                                                    <img src={facebookIcon} />
                                                                </div>
                                                                <div className="mt-6">
                                                                    <FileUploadDnD
                                                                        id="soFbImage"
                                                                        type={`file`}
                                                                        folderpath={`${FolderPath}`}
                                                                        className="flex h-40 justify-center px-6 mt-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md mb-3 py-6"
                                                                        name={`soFbImage`}
                                                                        url={fbOpenGraphInfo.image}
                                                                        onChange={(value) => {
                                                                            setFieldValue(
                                                                                "fbopengraphimage",
                                                                                value
                                                                            );
                                                                            setFBOpenGraphInfo(
                                                                                (prev) => ({
                                                                                    ...prev,
                                                                                    image: value,
                                                                                })
                                                                            );
                                                                            if (
                                                                                value !=
                                                                                openGraphInfo.image
                                                                            )
                                                                                setFBOpenGraphInfo(
                                                                                    (prev) => ({
                                                                                        ...prev,
                                                                                        imagediff: true,
                                                                                    })
                                                                                );
                                                                        }}
                                                                    />
                                                                </div>
                                                                {fbOpenGraphInfo.image !=
                                                                    "" && (
                                                                        <>
                                                                            <div
                                                                                className="mt-6 flex justify-between"

                                                                            >
                                                                                <label
                                                                                    className="tracking-wide text-gray-700 text-sm leanding-4 flex items-center"

                                                                                >
                                                                                    We recommend 1,200px by
                                                                                    628px.
                                                                                </label>
                                                                                <button
                                                                                    className="btn btn-sm bg-indigo-500 hover:bg-indigo-600 text-white"
                                                                                    onClick={() => {
                                                                                        getEditData.current({
                                                                                            label: "Facebook",
                                                                                            title:
                                                                                                fbOpenGraphInfo.title,
                                                                                            description:
                                                                                                fbOpenGraphInfo.description,
                                                                                            image:
                                                                                                fbOpenGraphInfo.image,
                                                                                        });
                                                                                    }}
                                                                                >
                                                                                    <span className="material-icons-outlined">
                                                                                        edit
                                                                                    </span>
                                                                                    <span className="ml-1">
                                                                                        Edit
                                                                                    </span>
                                                                                </button>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                            </div>
                                                        </div>
                                                        <div className="w-full md:w-1/2 px-4 mb-4">
                                                            <div className="border border-gray-200 rounded p-4">
                                                                <div className="text-center mt-1 w-10 mx-auto">
                                                                    <img src={twitterIcon} />
                                                                </div>
                                                                <div className="mt-6">
                                                                    <FileUploadDnD
                                                                        id="twtopengraphimage"
                                                                        type={`file`}
                                                                        folderpath={`${FolderPath}`}
                                                                        className="flex h-40 justify-center px-6 mt-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md mb-3 py-6"
                                                                        name={`twtopengraphimage`}
                                                                        url={twtOpenGraphInfo.image}
                                                                        onChange={(value) => {
                                                                            setFieldValue(
                                                                                "twtopengraphimage",
                                                                                value
                                                                            );
                                                                            setTwtOpenGraphInfo(
                                                                                (prev) => ({
                                                                                    ...prev,
                                                                                    image: value,
                                                                                })
                                                                            );
                                                                            if (
                                                                                value !=
                                                                                openGraphInfo.image
                                                                            )
                                                                                setTwtOpenGraphInfo(
                                                                                    (prev) => ({
                                                                                        ...prev,
                                                                                        imagediff: true,
                                                                                    })
                                                                                );
                                                                        }}
                                                                    />
                                                                </div>
                                                                {twtOpenGraphInfo.image !=
                                                                    "" && (
                                                                        <>
                                                                            {" "}
                                                                            <div className="mt-6 flex justify-between" >
                                                                                <label className="tracking-wide text-gray-700 text-sm leanding-4 flex items-center" >
                                                                                    We recommend 1,200px by
                                                                                    628px.
                                                                                </label>
                                                                                <button
                                                                                    className="btn btn-sm bg-indigo-500 hover:bg-indigo-600 text-white"
                                                                                    onClick={() => {
                                                                                        getEditData.current({
                                                                                            label: "Twitter",
                                                                                            title:
                                                                                                twtOpenGraphInfo.title,
                                                                                            description:
                                                                                                twtOpenGraphInfo.description,
                                                                                            image:
                                                                                                twtOpenGraphInfo.image,
                                                                                        });
                                                                                    }}
                                                                                >
                                                                                    <span className="material-icons-outlined">
                                                                                        edit
                                                                                    </span>
                                                                                    <span className="ml-1">
                                                                                        Edit
                                                                                    </span>
                                                                                </button>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                            </div>
                                                        </div>
                                                        <div className="w-full md:w-1/2 px-4 mb-4">
                                                            <div className="border border-gray-200 rounded p-4">
                                                                <div className="text-center mt-1 w-10 mx-auto">
                                                                    <img src={linkedinIcon} />
                                                                </div>
                                                                <div className={`mt-6`}>
                                                                    <FileUploadDnD
                                                                        id="lnkopengraphimage"
                                                                        type={`file`}
                                                                        folderpath={`${FolderPath}`}
                                                                        className="flex h-40 justify-center px-6 mt-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md mb-3 py-6"
                                                                        name={`lnkopengraphimage`}
                                                                        url={lnkOpenGraphInfo.image}
                                                                        onChange={(value) => {
                                                                            setFieldValue(
                                                                                "lnkopengraphimage",
                                                                                value
                                                                            );
                                                                            setLnkOpenGraphInfo(
                                                                                (prev) => ({
                                                                                    ...prev,
                                                                                    image: value,
                                                                                })
                                                                            );
                                                                            if (
                                                                                value !=
                                                                                openGraphInfo.image
                                                                            )
                                                                                setLnkOpenGraphInfo(
                                                                                    (prev) => ({
                                                                                        ...prev,
                                                                                        imagediff: true,
                                                                                    })
                                                                                );
                                                                        }}
                                                                    />
                                                                </div>
                                                                {lnkOpenGraphInfo.image !=
                                                                    "" && (
                                                                        <>
                                                                            <div
                                                                                className="mt-6 flex justify-between"

                                                                            >
                                                                                <label
                                                                                    className="tracking-wide text-gray-700 text-sm leanding-4 flex items-center"

                                                                                >
                                                                                    We recommend 1,200px by
                                                                                    628px.
                                                                                </label>
                                                                                <button
                                                                                    className="btn btn-sm bg-indigo-500 hover:bg-indigo-600 text-white"
                                                                                    onClick={() => {
                                                                                        getEditData.current({
                                                                                            label: "Linkden",
                                                                                            title:
                                                                                                lnkOpenGraphInfo.title,
                                                                                            description:
                                                                                                lnkOpenGraphInfo.description,
                                                                                            image:
                                                                                                lnkOpenGraphInfo.image,
                                                                                        });
                                                                                    }}
                                                                                >
                                                                                    <span className="material-icons-outlined">
                                                                                        edit
                                                                                    </span>
                                                                                    <span className="ml-1">
                                                                                        Edit
                                                                                    </span>
                                                                                </button>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                            </div>
                                                        </div>
                                                        <div className="w-full md:w-1/2 px-4 mb-4">
                                                            <div className="border border-gray-200 rounded p-4">
                                                                <div className="text-center mt-1 w-10 mx-auto">
                                                                    <img src={pinterestIcon} />
                                                                </div>
                                                                <div className="mt-6">
                                                                    <FileUploadDnD
                                                                        id="pintopengraphimage"
                                                                        type={`file`}
                                                                        folderpath={`${FolderPath}`}
                                                                        className="flex h-40 justify-center px-6 mt-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md mb-3 py-6"
                                                                        name={`pintopengraphimage`}
                                                                        url={pintOpenGraphInfo.image}
                                                                        onChange={(value) => {
                                                                            setFieldValue(
                                                                                "pintopengraphimage",
                                                                                value
                                                                            );
                                                                            setPintOpenGraphInfo(
                                                                                (prev) => ({
                                                                                    ...prev,
                                                                                    image: value,
                                                                                })
                                                                            );
                                                                        }}
                                                                    />
                                                                </div>
                                                                {pintOpenGraphInfo.image !=
                                                                    "" && (
                                                                        <>
                                                                            <div
                                                                                className="mt-6 flex justify-between"

                                                                            >
                                                                                <label
                                                                                    className="tracking-wide text-gray-700 text-sm leanding-4 flex items-center"

                                                                                >
                                                                                    We recommend 1,200px by
                                                                                    628px.
                                                                                </label>
                                                                                <button
                                                                                    className="btn btn-sm bg-indigo-500 hover:bg-indigo-600 text-white"
                                                                                    onClick={() => {
                                                                                        getEditData.current({
                                                                                            label: "Pinterest",
                                                                                            title:
                                                                                                pintOpenGraphInfo.title,
                                                                                            description:
                                                                                                pintOpenGraphInfo.description,
                                                                                            image:
                                                                                                pintOpenGraphInfo.image,
                                                                                        });
                                                                                    }}
                                                                                >
                                                                                    <span className="material-icons-outlined">
                                                                                        edit
                                                                                    </span>
                                                                                    <span className="ml-1">
                                                                                        Edit
                                                                                    </span>
                                                                                </button>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="relative text-sm overflow-hidden duration-700">
                                                <div className="mt-6">
                                                    <div className="flex items-center justify-between mb-2 last:mb-0">
                                                        <label className="text-gray-700 text-sm font-bold flex items-center">
                                                            Reset Post Meta
                                                        </label>
                                                    </div>
                                                    <div className="flex items-center justify-between mb-2 last:mb-0">
                                                        <button className="btn border-indigo-300 hover:border-indigo-400 text-indigo-500">
                                                            Reset Meta Post
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center justify-between mb-2 last:mb-0">
                                                        <label className="text-gray-700 text-xs flex items-center">
                                                            If the buttons on this post
                                                            are misbehaving, this resets
                                                            all Social Warfare data for
                                                            this post.
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        )}
                </div>
                <OpenGraphPopup
                    getEditData={getEditData}
                    setFieldValue={setFieldValue}
                    setOpenGraphInfo={setOpenGraphInfo}
                    setFBOpenGraphInfo={setFBOpenGraphInfo}
                    setLnkOpenGraphInfo={setLnkOpenGraphInfo}
                    setTwtOpenGraphInfo={setTwtOpenGraphInfo}
                    setPintOpenGraphInfo={setPintOpenGraphInfo}
                    openGraphInfo={openGraphInfo}
                    fbOpenGraphInfo={fbOpenGraphInfo}
                    twtOpenGraphInfo={twtOpenGraphInfo}
                    pintOpenGraphInfo={pintOpenGraphInfo}
                    displayFieldElement={() => { }}
                />
            </div>
        </div>
    )
}

export default SocialSetting