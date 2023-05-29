/*Component Name: ElementImage
Component Functional Details: Element for Component Background  
Created By: Vikas Patel
Created Date: 07/07/2022
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import ImageFile from 'components/admin/content/common/ImageFile';
import Input from 'components/admin/content/common/Input';
import { useEffect } from 'react';
import LeftSideBar from '../LeftSideBar';
import { useCallback } from 'react';

const ElementImage = (props) => {

    const [showHide, setShowHide] = useState(false);
    const showHideProperties = () => {
        if (showHide == true)
            setShowHide(false);
        else {
            const allWithClass = Array.from(
                document.querySelectorAll('div.property-content')
            );
            allWithClass.forEach(element => {
                element.classList.add("hidden");
            });



            setShowHide(true);

        }
    }

    let bgPropertyName = props.variable;
    const [imageURL, setImageURL] = useState('');
    const [imageAlt, setImageAlt] = useState('');
    const [imageLink, setImageLink] = useState('');
    const [videoType, setVideoType] = useState('Youtube');
    const [imageOrVideo, setImageOrVideo] = useState('Image');
    const [videoUrl, setVideoUrl] = useState('');
    const selectedObj = props.componentHtml.filter(obj => obj.uid == props.currentComponent);
    let attributes = {};

    const propertyName = props.variable;


    /* Function to set component with updated attributes values */

    useEffect(() => {
        setImageURL('');
        setImageAlt('');
        setImageLink('');
        if (selectedObj.length > 0) {
            if (selectedObj[0].selected_Values != undefined && Object.keys(selectedObj[0].selected_Values).length > 0) {
                let tmp;
                let tmpAlt;
                let tmpLink;
                let tmpVideo = false;
                let tmpVideoType;
                let tmpVideoUrl;
                console.log(selectedObj[0].selected_Values);
                Object.entries(selectedObj[0].selected_Values).map(([key, value]) => {
                    console.log(key, bgPropertyName);
                    if (key == bgPropertyName) {
                        tmp = value;
                    }
                    if (key == bgPropertyName + "_alt") {
                        tmpAlt = value;
                    }
                    if (key == bgPropertyName + "link") {
                        tmpLink = value;
                    }
                    if (key == bgPropertyName + "_video") {
                        tmpVideo = true;
                        tmpVideoType = value.type;
                        tmpVideoUrl = value.value;
                    }
                });

                if (tmp != undefined) {
                    let attributes = tmp;
                    
                    setImageURL(attributes.value);
                    //onElementImageChange(attributes.value);

                }
                else {
                    setImageURL('');
                }

                if (tmpAlt != undefined) {
                    let attributes = tmpAlt;
                    setImageAlt(attributes.value);
                    updateAltTag(attributes.value);

                }
                else {
                    setImageAlt('');
                }

                if (tmpLink != undefined) {
                    let attributes = tmpLink;
                    setImageLink(attributes.value);
                    updateLink(attributes.value);
                }
                else {
                    setImageLink('');
                }

                if (tmpVideo) {
                    setImageOrVideo('Video');
                    setVideoType(tmpVideoType);
                    setVideoUrl(tmpVideoUrl);
                }
            }
            else {
                setImageURL('');
                //updateProperty({[bgPropertyName]: imageURL});
            }
        }


    }, [props.currentComponent]);

    const displayImageVideo = () => {
        
        let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
        if (x.querySelectorAll("#" + bgPropertyName).length > 0) {
            if (imageOrVideo == "Image") {
                if (imageURL != '') {

                    x.querySelectorAll("#" + bgPropertyName)[0].innerHTML = '<a href="' + imageLink + '"><img class="" src="' + imageURL + '" alt="' + imageAlt + '" title="' + imageAlt + '" /> </a>';


                    props.updateProperty({ type: "link", value: imageLink }, bgPropertyName + "_link");
                    props.updateProperty({ type: "alt", value: imageAlt }, bgPropertyName + "_alt");
                    props.updateProperty({ type: "image", value: imageURL }, bgPropertyName);
                }
            }
            else {
                if (videoType == "Youtube") {
                    x.querySelectorAll('#' + bgPropertyName)[0].innerHTML = '<iframe class="w-full aspect-video" src="https://www.youtube.com/embed/' + videoUrl + '?rel=0" allow="autoplay; encrypted-media" frameborder="0"></iframe>'
                    props.updateProperty({ type: "Youtube", value: videoUrl }, bgPropertyName + "_video");
                }
                else if (videoType == "vimeo") {
                    x.querySelectorAll('#' + bgPropertyName)[0].innerHTML = '<iframe src="https://player.vimeo.com/video/' + videoUrl + '?background=1" frameborder="0" allow="autoplay; fullscreen" allowfullscreen="" style="" class="w-full aspect-video"></iframe>';
                    props.updateProperty({ type: "Vimeo", value: videoUrl }, bgPropertyName + "_video");
                }
            }

        }
    };

    const onElementImageChange = (url) => {
        setImageURL(url);
        // setTimeout(function () {displayImageVideo(url); }, 500);
        // if(imageOrVideo == "Image")
        // {
        //     let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
        //     x.querySelectorAll('#'+props.variable)[0].src = url;
        //     // props.refArray.current[props.currentComponent].style='background: url("'+url+'");';
        //     props.updateProperty({type: "image", value: url}, bgPropertyName);

        // }
    }

    const updateAltTag = (val) => {

        // if(imageOrVideo == "Image")
        // {
        //     let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
        //     x.querySelectorAll('#'+props.variable)[0].alt = val;
        //     x.querySelectorAll('#'+props.variable)[0].title = val;
        //     props.updateProperty({type: "alt", value: val}, bgPropertyName+"_alt");
        // }
        setImageAlt(val);
        // setTimeout(function () {displayImageVideo(); }, 1000);
    }

    const updateLink = (val) => {
        setImageLink(val);
        // if(imageOrVideo == "Image")
        // {
        //     let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
        //     x.querySelectorAll('#'+props.variable+"_Link")[0].href = val;
        //     props.updateProperty({type: "link", value: val}, bgPropertyName+"_link");
        // }
        // setTimeout(function () {displayImageVideo(); }, 1000);
        //x.querySelectorAll('#'+props.variable)[0].title = event.target.value;

    };

    const changeImageOrVideo = (event) => {
        setImageOrVideo(event.target.value);
        // setTimeout(function () {displayImageVideo(); }, 1000);
    };

    const updateVideoUrl = (val) => {
        setVideoUrl(val);
        //setTimeout(function () {displayImageVideo(); }, 1000);
    }

    const changeVideoType = (event) => {
        setVideoType(event.target.value);
    };

    useEffect(() => {
        displayImageVideo();
    }, [imageOrVideo, videoUrl, videoType, imageAlt, imageLink, imageURL]);

    return (
        <>
            <div className="relative border-b border-neutral-00">
                <button onClick={() => { showHideProperties() }}
                    className="flex w-full flex-wrap justify-between items-center text-sm px-3 py-4 bg-white border-0 font-bold">
                    <span >{props.compprop.title ?? "Image"}</span>
                    <span className="material-icons-outlined">expand_more</span>
                </button>

                <div className={`property-content bg-white border-y border-b-0 border-neutral-200 ${showHide ? "" : "hidden"}`}>
                    <div class="mx-2 text-sm">
                        <div class="py-2">
                            {(props.compprop.video != undefined && props.compprop.video == true) &&
                                <div className="mb-4 last:mb-0" id="imagePosition">
                                    <label htmlFor="" className="mb-1 block text-sm">Image/Video</label>
                                    <div className="flex flex-wrap">
                                        <select value={imageOrVideo} onChange={changeImageOrVideo} className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                            <option value="Image">Image</option>
                                            <option value="Video">Video</option>
                                        </select>
                                    </div>
                                </div>
                            }
                            <div class="mb-3" x-data="{ modalOpen: false }">
                                {console.log("IGM", imageURL)}
                                <ImageFile
                                    type="file"
                                    className="sr-only"
                                    name={bgPropertyName}
                                    id={bgPropertyName}
                                    buttonName="Add"
                                    folderpath={props.imagePath}
                                    onChange={onElementImageChange}
                                    edibtn={true}
                                    url={imageURL}
                                />
                            </div>

                            <div className="mb-3">
                                <div className="flex justify-between items-center mb-1">
                                    <div >Alt Title</div>
                                </div>
                                <div class="text-center relative overflow-hidden">
                                    <Input onChange={(event) => { updateAltTag(event.target.value) }} type="text" className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-3 py-2 leading-tight focus:outline-none focus:bg-white" defaultValue={imageAlt} />
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="flex justify-between items-center mb-1">
                                    <div >Link (optional)</div>
                                </div>
                                <div class="text-center relative overflow-hidden">
                                    <Input onChange={(event) => { updateLink(event.target.value) }} type="text" className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-3 py-2 leading-tight focus:outline-none focus:bg-white" defaultValue={imageLink} />
                                </div>
                            </div>

                            {(props.compprop.video != undefined && props.compprop.video == true) &&
                                <>
                                    <div className="mb-4 last:mb-0">
                                        <label htmlFor="" className="mb-1 block text-sm">Video Type</label>
                                        <div className="flex flex-wrap">
                                            <select value={videoType} onChange={changeVideoType} className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                                <option value="Youtube">Youtube</option>
                                                <option value="Vimeo">Vimeo</option>
                                                <option value="Custom">Custom</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mb-4 last:mb-0" >
                                        <label htmlFor="" className="mb-1 block text-sm">Video Url</label>
                                        <div className="flex flex-wrap">
                                            <Input onChange={(event) => { updateVideoUrl(event.target.value) }} type="text" className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-3 py-2 leading-tight focus:outline-none focus:bg-white" defaultValue={videoUrl} />
                                        </div>
                                    </div>
                                </>
                            }

                        </div>
                    </div>

                </div>

            </div>
        </>
    );
};

export default ElementImage;
