/*Component Name: ElementCarousel
Component Functional Details: Element for Component ElementCarousel  
Created By: Vikas Patel
Created Date: 17th September 2022
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import ColorPicker from 'components/admin/content/common/ColorPicker';
import ImageFile from 'components/admin/content/common/ImageFile';
import Input from 'components/admin/content/common/Input';
import { displayCarousel } from 'components/admin/content/helper/Helper';

import { useEffect } from 'react';
import { object } from 'yup';
import ReactDOMServer from 'react-dom/server';
import * as helper from 'components/admin/content/helper/Helper';
import ToggleButton from 'components/admin/content/common/ToggleButton';
import ElementCarouselDisplay from 'components/admin/content/template/create/elements/ElementCarouselDisplay';
import { cssNumber } from 'jquery';
import ElementHeadlineColorOpacity from './ElementHeadlineColorOpacity';
import { randomNumber } from 'components/admin/content/helper/Helper';


const ElementCarousel = (props) => {
    const [showHide, setShowHide] = useState(false);
    const [indArr, setIndArr] = useState([]);
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
    const [srno, setSrNo] = useState(0);
    const [textBgColor, setTextBgColor] = useState("");
    const [bgOpacity, setBgOpacity] = useState(1);
    const [dataArr, setDataArr] = useState([]);
    const [fontSize, setFontSize] = useState('text-base');
    const [fontSize1, setFontSize1] = useState('text-base');
    const [textPos, setTextPos] = useState("center");
    const [showThumb, setshowThumb] = useState("On");
    const [showArrow, setshowArrow] = useState("On");
    const [infiniteLoop, setinfiniteLoop] = useState("On");
    const [autoPlay, setautoPlay] = useState("On");
    const [stopOnHover, setstopOnHover] = useState("On");
    const [showStatus, setshowStatus] = useState("On");
    const [showIndicators, setshowIndicators] = useState("On");
    const [hexColor, setHexColor] = useState("");

    const selectedObj = props.componentHtml.filter(obj => obj.uid == props.currentComponent);

    const [imageURL, setImageURL] = useState('');
    const [imageAlt, setImageAlt] = useState('');
    const [imageLink, setImageLink] = useState('');
    const [headline, setHeadline] = useState("");
    const [headline1, setHeadline1] = useState("");

    const [btnText, setBtnText] = useState('');
    const [btnTextTransform, setBtnTextTransform] = useState('');
    const [btnStyle, setBtnStyle] = useState('');
    const [btnSize, setBtnSize] = useState('');
    const [btnLink, setBtnLink] = useState('');
    const [btnLinkWindow, setBtnLinkWindow] = useState(false);
    const [btnLinkFollow, setBtnLinkFollow] = useState('');
    const [btnDisplay, setBtnDisplay] = useState('Yes');
    const [imgArr, setImgArr] = useState([]);

    const [editBtn, setEditBtn] = useState(false);
    const [addBtn, setAddBtn] = useState(true);

    const [videoType, setVideoType] = useState('Youtube');
    const [imageOrVideo, setImageOrVideo] = useState('Image');
    const [videoUrl, setVideoUrl] = useState('');

    const [dispSaveMsg, setDispSaveMsg] = useState(false);



    let attributes = {};

    const bgPropertyName = props.variable;//selectedObj.length > 0 ? Object.keys(selectedObj[0].properties).find(key => selectedObj[0].properties[key] === "background") : [];

    /* When click on any component background component will reload and
    we have called function to set default properties */


    const updateHeadline = (event) => {
        //props.updateProperty({type: "text", value: event.target.value}, bgPropertyName);
        setHeadline(event.target.value);
    }


    const updateHeadline1 = (event) => {
        //props.updateProperty({type: "text", value: event.target.value}, bgPropertyName);
        setHeadline1(event.target.value);
    }



    useEffect(() => {

        /* Here when change component,values are not retiNING */
        if (selectedObj.length > 0) {
            let tmpVal;
            Object.entries(selectedObj[0].selected_Values).map(([key, value]) => {
                if (key == bgPropertyName) {
                    tmpVal = value;
                }
            });
            if (tmpVal != undefined) {
                // let attributes = tmpVal;
                if (Object.keys(tmpVal.value).includes("showThumb"))
                {
                    setshowThumb(tmpVal.value.showThumb);
                    updateArrKey("showThumb", tmpVal.value.showThumb);
                }
                if (Object.keys(tmpVal.value).includes("showArrow"))
                {
                    setshowArrow(tmpVal.value.showArrow);
                    updateArrKey("showArrow", tmpVal.value.showArrow);
                }
                if (Object.keys(tmpVal.value).includes("infiniteLoop"))
                {
                    setinfiniteLoop(tmpVal.value.infiniteLoop);
                    updateArrKey("infiniteLoop", tmpVal.value.infiniteLoop);
                }
                if (Object.keys(tmpVal.value).includes("autoPlay"))
                {
                    setautoPlay(tmpVal.value.autoPlay);
                    updateArrKey("autoPlay", tmpVal.value.autoPlay);
                }
                if (Object.keys(tmpVal.value).includes("stopOnHover"))
                {
                    setstopOnHover(tmpVal.value.stopOnHover);
                    updateArrKey("stopOnHover", tmpVal.value.stopOnHover);
                }
                if (Object.keys(tmpVal.value).includes("showIndicators"))
                {
                    setshowIndicators(tmpVal.value.showIndicators);
                    updateArrKey("showIndicators", tmpVal.value.showIndicators);
                }
                if (Object.keys(tmpVal.value).includes("showStatus"))
                {
                    setshowStatus(tmpVal.value.showStatus);
                    updateArrKey("showStatus", tmpVal.value.showStatus);
                }
                if (Object.keys(tmpVal.value).includes("images"))
                {
                    setImgArr(tmpVal.value.images);
                }
                setDataArr(tmpVal.value);

                

            }
        }
    }, [props.currentComponent]);

    const onElementImageChange = (url) => {
        setImageURL(url);
        //props.updateProperty({type: "image", value: url}, bgPropertyName);
    }

    const updateAltTag = (val) => {
        //props.updateProperty({type: "alt", value: val}, bgPropertyName+"_alt");
        setImageAlt(val);
    }

    const updateLink = (val) => {
        // props.updateProperty({type: "alt", value: val}, bgPropertyName+"_link");
        setImageLink(val);
        //x.querySelectorAll('#'+props.variable)[0].title = event.target.value;

    }

    useEffect(() => {


        let strHTML = displayCarousel(showIndicators, showArrow, showStatus, showThumb, dataArr);

        let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
        x.querySelectorAll("#banner_display")[0].innerHTML = strHTML;
        props.updateProperty({ type: "carousel", value: dataArr }, bgPropertyName);

    }, [dataArr]);
    useEffect(() => {
        let elementArr = {};
        if (Object.keys(dataArr).includes("images")) {
            Object.keys(dataArr).map((dkey, index) => {
                if (dkey != "images") {
                    Object.assign(elementArr, { [dkey]: dataArr[dkey] });
                }
                else {
                    Object.assign(elementArr, { "images": imgArr });
                }
            });
        }
        else {
            elementArr = dataArr;
            Object.assign(elementArr, { "images": imgArr });
        }

        setDataArr(elementArr);
        if (dispSaveMsg) {
            // alert('Banner added successfully');
            //setDispSaveMsg(false);
        }
    }, [imgArr]);

    const saveData = () => {

        let tmpArr = updateDataArray();
        setImgArr((previous) => [...previous, tmpArr]);
        setDispSaveMsg(true);


        // console.log(imgArr);

        // let elementArr = [];
        // if(Object.keys(dataArr).includes("images"))
        // {
        //     let testArr = {};
        //     Object.keys(dataArr).map((dkey, index) => {
        //         if(dkey == "images")
        //             elementArr = dataArr[dkey];
        //     });
        //     elementArr.push(tmpArr);



        // }
        // else
        // {
        //     elementArr.push(tmpArr);
        // }

        // Object.assign(elementArr, {"images": tmpArr});
        // Object.assign(elementArr, {"index": dataArr.length+1});
        // Object.keys(dataArr).map((dkey, index) => {
        //     if(dkey != "images" && dkey != "index")
        //     {
        //         Object.assign(elementArr, {dkey: dataArr[dkey]});
        //     }
        // });




    };

    const deleteData = (element) => {
        let tmpVal = [];
        imgArr.map((acValue, index) => {
            if (acValue.image_url != element.image_url) {
                tmpVal.push(acValue);
            }
        });
        setImgArr(tmpVal);
    };

    const editData = (element) => {
        setSrNo(element.srno);
        setImageOrVideo(element.image_or_video);
        setImageURL(element.image_url);
        setImageAlt(element.image_alt);
        setImageLink(element.image_link);
        setVideoType(element.video_type);
        setVideoUrl(element.video_url);
        setBtnDisplay(element.button_display);
        setBtnText(element.button_text);
        setBtnTextTransform(element.button_text_transform);
        setBtnSize(element.button_size);
        setBtnStyle(element.button_style);
        setBtnLink(element.button_link);
        setBtnLinkFollow(element.button_link_follow);
        setBtnLinkWindow(element.button_link_window);
        setHeadline(element.headline);
        setHeadline1(element.headline1);
        setAddBtn(false);
        setEditBtn(true);
        setFontSize(element.headline_font_size);
        setFontSize(element.headline1_font_size);
        setTextPos(element.text_pos);
        setTextBgColor(element.text_bg_color);
        setBgOpacity(element.bg_opacity);
        setHexColor(element.bg_hex_color);
    };

    const updateDataArray = () => {
        let tmpArr = {};
        let rndNumber = randomNumber(indArr);
        setIndArr((previous) => [...previous, rndNumber]);
        Object.assign(tmpArr, { "srno": rndNumber })
        Object.assign(tmpArr, { 'image_url': imageURL });
        Object.assign(tmpArr, { 'image_link': imageLink });
        Object.assign(tmpArr, { 'image_alt': imageAlt });

        Object.assign(tmpArr, { 'image_or_video': imageOrVideo });
        Object.assign(tmpArr, { 'video_type': videoType });
        Object.assign(tmpArr, { 'video_url': videoUrl });

        Object.assign(tmpArr, { "button_display": btnDisplay });
        Object.assign(tmpArr, { "button_text": btnText });
        Object.assign(tmpArr, { "button_text_transform": btnTextTransform });
        Object.assign(tmpArr, { "button_style": btnStyle });
        Object.assign(tmpArr, { "button_size": btnSize });
        Object.assign(tmpArr, { "button_link": btnLink });
        Object.assign(tmpArr, { "button_link_window": btnLinkWindow });
        Object.assign(tmpArr, { "button_link_follow": btnLinkFollow });
        Object.assign(tmpArr, { "headline": headline });
        Object.assign(tmpArr, { "headline_font_size": fontSize });
        Object.assign(tmpArr, { "headline1": headline1 });
        Object.assign(tmpArr, { "headline1_font_size": fontSize1 });
//        Object.assign(tmpArr, { 'headline_font_size': fontSize });
        Object.assign(tmpArr, { 'text_pos': textPos });
        Object.assign(tmpArr, { 'text_bg_color': textBgColor });
        Object.assign(tmpArr, { 'bg_opacity': bgOpacity });
        Object.assign(tmpArr, { 'bg_hex_color': hexColor });

        setImageURL('');
        setImageAlt('');
        setImageLink('');
        setFontSize('text-base');
        setFontSize1('text-base');
//        setFontSize('text-base');
        setBtnText('');
        setBtnTextTransform('');
        setBtnStyle('');
        setBtnSize('');
        setBtnLink('');
        setBtnLinkWindow(false);
        setBtnLinkFollow('');
        setBtnDisplay('Yes');
        setHeadline("");
        setHeadline1("");
        setVideoUrl('');
        setImageOrVideo("Image");
        setTextPos("center");
        setTextBgColor("");
        setBgOpacity(1);
        setHexColor("");
        return tmpArr;


    };

    const updateData = () => {
        let tmpVal = [];
        imgArr.map((acValue, index) => {
            if (acValue.srno == srno) {
                let tmpArr = {};
                Object.assign(tmpArr, {"srno": srno})
                Object.assign(tmpArr, {'image_url': imageURL});
                Object.assign(tmpArr, {'image_link': imageLink});
                Object.assign(tmpArr, {'image_alt': imageAlt});

                Object.assign(tmpArr, {'image_or_video': imageOrVideo});
                Object.assign(tmpArr, {'video_type': videoType});
                Object.assign(tmpArr, {'video_url': videoUrl});

                Object.assign(tmpArr, {"button_display": btnDisplay});
                Object.assign(tmpArr, {"button_text": btnText});
                Object.assign(tmpArr, {"button_text_transform": btnTextTransform});
                Object.assign(tmpArr, {"button_style": btnStyle});
                Object.assign(tmpArr, {"button_size": btnSize});
                Object.assign(tmpArr, {"button_link": btnLink});
                Object.assign(tmpArr, {"button_link_window": btnLinkWindow});
                Object.assign(tmpArr, {"button_link_follow": btnLinkFollow}); 
                Object.assign(tmpArr, {"headline": headline});
                Object.assign(tmpArr, {"headline1": headline1});
                Object.assign(tmpArr, {'headline_font_size': fontSize});
                Object.assign(tmpArr, {'headline1_font_size': fontSize1});
                Object.assign(tmpArr, {'text_pos': textPos});
                Object.assign(tmpArr, {'text_bg_color': textBgColor});
                Object.assign(tmpArr, {'bg_opacity': bgOpacity});
                Object.assign(tmpArr, {'bg_hex_color': hexColor});

                
                
                tmpVal.push(tmpArr);
            }
            else {
                tmpVal.push(acValue);
            }
        });


        setAddBtn(true);
        setEditBtn(false);
        setImgArr(tmpVal);

        setDispSaveMsg(true);

        // let elementArr = {};
        // if(Object.keys(dataArr).includes("images"))
        // {
        //     Object.keys(dataArr).map((dkey, index) => {
        //         if(dkey != "images")
        //         {
        //             Object.assign(elementArr, {[dkey]: dataArr[dkey]});
        //         }
        //         else
        //         {
        //             Object.assign(elementArr, {"images": tmpVal});
        //         }
        //     });
        // }
        // else
        // {
        //     elementArr = dataArr;
        //     Object.assign(elementArr, {"images": tmpVal});
        // }




        // setDataArr(elementArr);

        setImageURL('');
        setImageAlt('');
        setImageLink('');
        setFontSize('text-base');
        setFontSize1('text-base');
        setBtnText('');
        setBtnTextTransform('');
        setBtnStyle('');
        setBtnSize('');
        setBtnLink('');
        setBtnLinkWindow(false);
        setBtnLinkFollow('');
        setBtnDisplay('Yes');
        setHeadline("");
        setHeadline1("");
        setVideoUrl('');
        setImageOrVideo("Image");
        setTextPos("center");
        setTextBgColor("");
        setBgOpacity(1);
        setHexColor("");
    };

    const handleToggleChangeEvent = (data) => {
        let val;
        if (data.target.checked)
            val = "On";
        else
            val = "Off";
        if (data.target.name == "showThumb") {
            setshowThumb(val);
            updateArrKey("showThumb", val);
        }
        else if (data.target.name == "showArrow") {
            setshowArrow(val);
            updateArrKey("showArrow", val);
        }
        else if (data.target.name == "showStatus") {
            setshowStatus(val);
            updateArrKey("showStatus", val);
        }
        else if (data.target.name == "infiniteLoop") {
            setinfiniteLoop(val);
            updateArrKey("infiniteLoop", val);
        }
        else if (data.target.name == "autoPlay") {
            setautoPlay(val);
            updateArrKey("autoPlay", val);
        }
        else if (data.target.name == "stopOnHover") {
            setstopOnHover(val);
            updateArrKey("stopOnHover", val);
        }
        else if (data.target.name == "showIndicators") {
            setshowIndicators(val);
            updateArrKey("showIndicators", val);
        }
    };

    const updateArrKey = (key, value) => {

        if (Object.keys(dataArr).includes(key)) {
            let tmpArr = {};
            Object.keys(dataArr).map((dkey, index) => {

                if (dkey == key) {
                    Object.assign(tmpArr, { [key]: value });
                }
                else
                    Object.assign(tmpArr, { [dkey]: dataArr[dkey] });
            });
            setDataArr(tmpArr);
        }
        else {
            let tmpArr = dataArr;
            Object.assign(tmpArr, { [key]: value });
            setDataArr(tmpArr);

        }

    };

    const buttonTextChange = (event) => {
        setBtnText(event.target.value);
        //props.updateProperty({type: "text", value: event.target.value}, bgPropertyName);
    }

    const changeTextTransform = (event) => {
        setBtnTextTransform(event.target.value);
        //props.updateProperty({type: "transform", value: event.target.value}, bgPropertyName+"_text_transform");
    }

    const changeBtnSize = (event) => {
        setBtnSize(event.target.value);
        //props.updateProperty({type: "size", value: event.target.value}, bgPropertyName+"_size");
    }

    const changeLinkTarget = (event) => {
        if (event.target.checked) {
            setBtnLinkWindow("_blank");
            //props.updateProperty({type: "link_target", value: "_blank"}, bgPropertyName+"_window");
        }
        else {
            setBtnLinkWindow("_self");
            //props.updateProperty({type: "link_target", value: "_self"}, bgPropertyName+"_window");
        }
    }

    const changeBtnLink = (event) => {
        setBtnLink(event.target.value);
        //props.updateProperty({type: "link", value: event.target.value}, bgPropertyName+"_link");
    }

    const changeLinkFollow = (event) => {
        if (event.target.checked) {
            //props.updateProperty({type: "link_rel", value: event.target.value}, bgPropertyName+"_follow");

        }
        else {
            //props.updateProperty({type: "link_rel", value: ''}, bgPropertyName+"_follow");
        }

        setBtnLinkFollow(event.target.value);
    }

    const changeBtnStyle = (event) => {
        setBtnStyle(event.target.value);
        //props.updateProperty({type: "style", value: event.target.value}, bgPropertyName+"_style");
    }

    const changeBtnDisplay = (event) => {
        if (event.target.value == "Yes") {
            const allWithClass = Array.from(
                document.querySelectorAll('div.btn-extra-info')
            );
            allWithClass.forEach(element => {
                element.classList.remove("hidden");
            });

        }
        else {
            const allWithClass = Array.from(
                document.querySelectorAll('div.btn-extra-info')
            );
            allWithClass.forEach(element => {
                element.classList.add("hidden");
            });


        }
        setBtnDisplay(event.target.value);
        //props.updateProperty({type: "display", value: event.target.value}, bgPropertyName+"_display");
    }

    const changeImageOrVideo = (event) => {
        setImageOrVideo(event.target.value);
        // setTimeout(function () {displayImageVideo(); }, 1000);
    };

    const updateVideoUrl = (val) => {
        setVideoUrl(val);
        //setTimeout(function () {displayImageVideo(); }, 1000);
    };

    const changeVideoType = (event) => {
        setVideoType(event.target.value);
    };



    return (
        <>

            <div className="relative border-b border-neutral-00">
                <button onClick={() => { showHideProperties() }}
                    className="flex w-full flex-wrap justify-between items-center text-sm px-3 py-4 bg-white border-0 font-bold">
                    <span className="">{props.compprop.title ?? "Dynamic Properties"}</span>
                    <span className="material-icons-outlined">expand_more</span>
                </button>

                <div className={`property-content bg-white border-y border-b-0 border-neutral-200 ${showHide ? "" : "hidden"}`}>

                    <div class="mx-2 text-sm">
                        <div class="py-2">
                            <div className="grid grid-cols-12 gap-4 mb-4 last:mb-0">
                                <div className="col-span-full sm:col-span-8 xl:col-span-8">
                                    <label className="text-gray-500">
                                        Show Thumb
                                    </label>
                                </div>
                                <div className="col-span-full sm:col-span-4 xl:col-span-4">
                                    <div className="flex items-center">
                                        <ToggleButton
                                            id={`showThumb`}
                                            defaultValue={showThumb}
                                            onChange={handleToggleChangeEvent}
                                            name={`showThumb`}
                                            on={"On"}
                                            off={"Off"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="py-2">
                            <div className="grid grid-cols-12 gap-4 mb-4 last:mb-0">
                                <div className="col-span-full sm:col-span-8 xl:col-span-8">
                                    <label className="text-gray-500">
                                        Show Arrow
                                    </label>
                                </div>
                                <div className="col-span-full sm:col-span-4 xl:col-span-4">
                                    <div className="flex items-center">
                                        <ToggleButton
                                            id={`showArrow`}
                                            defaultValue={showArrow}
                                            onChange={handleToggleChangeEvent}
                                            name={`showArrow`}
                                            on={"On"}
                                            off={"Off"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="py-2">
                            <div className="grid grid-cols-12 gap-4 mb-4 last:mb-0">
                                <div className="col-span-full sm:col-span-8 xl:col-span-8">
                                    <label className="text-gray-500">
                                        Infinite Loop
                                    </label>
                                </div>
                                <div className="col-span-full sm:col-span-4 xl:col-span-4">
                                    <div className="flex items-center">
                                        <ToggleButton
                                            id={`infiniteLoop`}
                                            defaultValue={infiniteLoop}
                                            onChange={handleToggleChangeEvent}
                                            name={`infiniteLoop`}
                                            on={"On"}
                                            off={"Off"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="py-2">
                            <div className="grid grid-cols-12 gap-4 mb-4 last:mb-0">
                                <div className="col-span-full sm:col-span-8 xl:col-span-8">
                                    <label className="text-gray-500">
                                        Auto Play
                                    </label>
                                </div>
                                <div className="col-span-full sm:col-span-4 xl:col-span-4">
                                    <div className="flex items-center">
                                        <ToggleButton
                                            id={`autoPlay`}
                                            defaultValue={autoPlay}
                                            onChange={handleToggleChangeEvent}
                                            name={`autoPlay`}
                                            on={"On"}
                                            off={"Off"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="py-2">
                            <div className="grid grid-cols-12 gap-4 mb-4 last:mb-0">
                                <div className="col-span-full sm:col-span-8 xl:col-span-8">
                                    <label className="text-gray-500">
                                        Stop on Hover
                                    </label>
                                </div>
                                <div className="col-span-full sm:col-span-4 xl:col-span-4">
                                    <div className="flex items-center">
                                        <ToggleButton
                                            id={`stopOnHover`}
                                            defaultValue={stopOnHover}
                                            onChange={handleToggleChangeEvent}
                                            name={`stopOnHover`}
                                            on={"On"}
                                            off={"Off"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="py-2">
                            <div className="grid grid-cols-12 gap-4 mb-4 last:mb-0">
                                <div className="col-span-full sm:col-span-8 xl:col-span-8">
                                    <label className="text-gray-500">
                                        Show Status
                                    </label>
                                </div>
                                <div className="col-span-full sm:col-span-4 xl:col-span-4">
                                    <div className="flex items-center">
                                        <ToggleButton
                                            id={`showStatus`}
                                            defaultValue={showStatus}
                                            onChange={handleToggleChangeEvent}
                                            name={`showStatus`}
                                            on={"On"}
                                            off={"Off"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="py-2">
                            <div className="grid grid-cols-12 gap-4 mb-4 last:mb-0">
                                <div className="col-span-full sm:col-span-8 xl:col-span-8">
                                    <label className="text-gray-500">
                                        Show Indicators
                                    </label>
                                </div>
                                <div className="col-span-full sm:col-span-4 xl:col-span-4">
                                    <div className="flex items-center">
                                        <ToggleButton
                                            id={`showIndicators`}
                                            defaultValue={showIndicators}
                                            onChange={handleToggleChangeEvent}
                                            name={`showIndicators`}
                                            on={"On"}
                                            off={"Off"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4 last:mb-0">
                            <p className="font-bold">Added Data</p>
                            <ul class="my-2" id="htmlData">
                                {(dataArr.images != undefined && dataArr.images.length > 0) && dataArr.images.map((acValue, index) => {
                                    return (
                                        <>
                                            <li className="p-2 border border-neutral-200 border-b-0 last:border-b flex items-center justify-between">
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex items-center">
                                                        {acValue.image_or_video == "Image"
                                                            ? <img src={acValue.image_url} />
                                                            : <>
                                                                <span class="material-icons-outlined">play_circle</span>
                                                            </>
                                                        }
                                                    </div>
                                                    <div>
                                                        <a href="javascript:void(0)" onClick={() => { editData(acValue); }}><span class="material-icons-outlined ml-3">mode_edit</span></a>
                                                        <a href="javascript:void(0)" onClick={() => { deleteData(acValue); }}><span class="material-icons-outlined ml-3 text-red">delete</span></a>
                                                    </div>
                                                </div>
                                            </li>
                                        </>
                                    )
                                })}
                            </ul>
                        </div>

                        <div className="mb-4 last:mb-0" id="imagePosition">
                            <label for="" className="mb-1 block text-sm">Image/Video</label>
                            <div className="flex flex-wrap">
                                <select value={imageOrVideo} onChange={changeImageOrVideo} className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                    <option value="Image">Image</option>
                                    <option value="Video">Video</option>
                                </select>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="" className="mb-1 block text-sm">Image</label>
                            <ImageFile
                                type="file"
                                className="sr-only"
                                name={`image`}
                                id={`image`}
                                buttonName="Add"
                                folderpath={props.imagePath}
                                onChange={onElementImageChange}
                                edibtn={true}
                                url={imageURL}
                            />
                        </div>

                        <div className="mb-3">
                            <div className="flex justify-between items-center mb-1">
                                <div className="">Alt Title</div>
                            </div>
                            <div class="text-center relative overflow-hidden">
                                <Input onChange={(event) => { updateAltTag(event.target.value) }} type="text" className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-3 py-2 leading-tight focus:outline-none focus:bg-white" defaultValue={imageAlt} />
                            </div>
                        </div>

                        <div className="mb-3">
                            <div className="flex justify-between items-center mb-1">
                                <div className="">Link (optional)</div>
                            </div>
                            <div class="text-center relative overflow-hidden">
                                <Input onChange={(event) => { updateLink(event.target.value) }} type="text" className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-3 py-2 leading-tight focus:outline-none focus:bg-white" defaultValue={imageLink} />
                            </div>
                        </div>

                        <div className="mb-4 last:mb-0">
                            <label for="" className="mb-1 block text-sm">Video Type</label>
                            <div className="flex flex-wrap">
                                <select value={videoType} onChange={changeVideoType} className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                    <option value="Youtube">Youtube</option>
                                    <option value="Vimeo">Vimeo</option>
                                    <option value="Custom">Custom</option>
                                </select>
                            </div>
                        </div>
                        <div className="mb-4 last:mb-0" >
                            <label for="" className="mb-1 block text-sm">Video Url</label>
                            <div className="flex flex-wrap">
                                <Input onChange={(event) => { updateVideoUrl(event.target.value) }} type="text" className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-3 py-2 leading-tight focus:outline-none focus:bg-white" defaultValue={videoUrl} />
                            </div>
                        </div>

                        <div className="mb-3">
                            <div className="flex justify-between items-center mb-1">
                                <div className="">Headline Text 1</div>
                            </div>
                            <div class="text-center relative overflow-hidden">
                                <input type="text" className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-3 py-2 leading-tight focus:outline-none focus:bg-white" value={headline} onChange={updateHeadline} />
                            </div>
                        </div>

                        <div className="mb-4 last:mb-0">
                            <label htmlFor="" className="mb-1 block text-sm">Headline 1 Font Size</label>
                            <div className="flex flex-wrap">
                                <select value={fontSize} onChange={(event) => { setFontSize(event.target.value) }} className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                    <option value="text-xs">Extral Small</option>
                                    <option value="text-sm">Small</option>
                                    <option value="text-base">Normal</option>
                                    <option value="text-lg">Large</option>
                                    <option value="text-xl">Extra Large</option>
                                    <option value="text-2xl">2 XL</option>
                                    <option value="text-3xl">3 XL</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-3">
                            <div className="flex justify-between items-center mb-1">
                                <div className="">Headline Text 2</div>
                            </div>
                            <div class="text-center relative overflow-hidden">
                                <input type="text" className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-3 py-2 leading-tight focus:outline-none focus:bg-white" value={headline1} onChange={updateHeadline1} />
                            </div>
                        </div>

                        <div className="mb-4 last:mb-0">
                            <label htmlFor="" className="mb-1 block text-sm">Headline 2 Font Size</label>
                            <div className="flex flex-wrap">
                                <select value={fontSize1} onChange={(event) => { setFontSize1(event.target.value) }} className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                    <option value="text-xs">Extral Small</option>
                                    <option value="text-sm">Small</option>
                                    <option value="text-base">Normal</option>
                                    <option value="text-lg">Large</option>
                                    <option value="text-xl">Extra Large</option>
                                    <option value="text-2xl">2 XL</option>
                                    <option value="text-3xl">3 XL</option>
                                </select>
                            </div>
                        </div>                        

                        <ElementHeadlineColorOpacity
                            props={props}
                            textBgColor={textBgColor}
                            setTextBgColor={setTextBgColor}
                            fontSize={fontSize}
                            setFontSize={setFontSize}
                            bgOpacity={bgOpacity}
                            setBgOpacity={setBgOpacity}
                            textPos={textPos}
                            setTextPos={setTextPos}
                            hexColor={hexColor}
                            setHexColor={setHexColor}
                            fntDisplay={false}
                        />
                        <div className="mb-4 last:mb-0">
                            <label for="" className="mb-1 block text-sm">Button Display</label>
                            <div className="flex flex-wrap">
                                <select value={btnDisplay} onChange={changeBtnDisplay} className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                        </div>

                        <div className={`btn-extra-info ${btnDisplay == "Yes" ? "" : "hidden"}`}>

                            <div className="mb-4 last:mb-0">
                                <label for="" className="mb-1 block text-sm">Button Text</label>
                                <div className="flex flex-wrap">
                                    <input
                                        onChange={buttonTextChange}
                                        value={btnText}
                                        type="text"
                                        className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md"
                                    />



                                </div>
                            </div>

                            <div className="mb-4 last:mb-0">
                                <label for="" className="mb-1 block text-sm">Text Transform</label>
                                <div className="flex flex-wrap">
                                    <select value={btnTextTransform} onChange={changeTextTransform} className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                        <option value="normal-case">None</option>
                                        <option value="capitalize">Capitalize</option>
                                        <option value="uppercase">Uppercase</option>
                                        <option value="lowercase">Lowercase</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4 last:mb-0">
                                <label for="" className="mb-1 block text-sm">Button Style</label>
                                <div className="flex flex-wrap">
                                    <select value={btnStyle} onChange={changeBtnStyle} className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                        <option value="btn-secondary">Secondary</option>
                                        <option value="btn-primary">Primary</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4 last:mb-0">
                                <label for="" className="mb-1 block text-sm">Button Size</label>
                                <div className="flex flex-wrap">
                                    <select value={btnSize} onChange={changeBtnSize} className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                        <option value="btn-md">Regular</option>
                                        <option value="btn-xs">Small</option>
                                        <option value="btn-lg">Large</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4 last:mb-0">
                                <label for="" className="mb-1 block text-sm">Button Link</label>
                                <div className="flex flex-wrap">
                                    <select className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                        <option value="1">External</option>
                                        <option value="2">Content</option>
                                        <option value="3">File</option>
                                        <option value="4">Email address</option>
                                        <option value="5">Blog</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4 last:mb-0">
                                <label for="" class="mb-1 block text-sm">URL</label>
                                <div className="flex flex-wrap">
                                    <input
                                        onChange={changeBtnLink}
                                        type="text"
                                        value={btnLink}
                                        className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md"
                                    />
                                </div>
                            </div>

                            <div className="mb-4 last:mb-0">
                                <div className="flex flex-wrap justify-between items-center">
                                    <label for="" className="mb-1 block text-sm">Open link in new window</label>
                                    <div className="flex items-center">
                                        <div className="w-16 relative">
                                            <input onChange={changeLinkTarget} type="checkbox" id="new-window-link" x-model="checked" checked={btnLinkWindow == "_blank" ? "checked" : ""} />
                                            {/* <label className="text-gray-500 lef text-center h-7 cursor-pointer flex items-center justify-center rounded leading-5 bg-green-600 bg-slate-600 hidden" for="new-window-link"> 
                                                        <span className="bg-white shadow-sm w-6 h-6 transition-all absolute rounded left-0.5" aria-hidden="true"></span> 
                                                        <span className="text-white text-xs inline-block absolute right-2 opacity-0 opacity-100" x-text="checked ? 'ON' : 'OFF'">OFF</span> 
                                                        <span className="text-white text-xs inline-block absolute left-2 opacity-1 opacity-0" x-text="checked ? 'ON' : 'OFF'">OFF</span> 
                                                    </label>  */}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4 last:mb-0">
                                <label for="" className="mb-1 block text-sm">Link Type</label>
                                <label className="flex items-center" for="no-follow-link">
                                    <input onChange={changeLinkFollow} type="checkbox" id="no-follow-link" className="form-checkbox" checked={btnLinkFollow == "nofollow" ? "checked" : ""} />
                                    <span className="text-sm font-medium ml-2">No Follow</span>
                                </label>
                            </div>
                        </div>
                        <div className="mb-4 last:mb-0">
                            {addBtn && <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white mt-2" onClick={saveData}>+ Add</button>}
                            {editBtn && <button className="btn bg-indigo-500 hover:bg-indigo-600 text-white mt-2" onClick={updateData}>+ Update</button>}


                        </div>
                    </div>
                </div>



            </div>
        </>
    );
};

export default ElementCarousel;
