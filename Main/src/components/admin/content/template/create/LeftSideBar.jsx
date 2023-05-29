/*Component Name: LeftSideBar
Component Functional Details: User can create or update LeftSideBar master details from here.
Created By: Vikas Patle
Created Date: 07/05/2022
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import ImageFile from "components/common/formComponent/FileUploadDnD";
import React, { useState, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ElementBackground from "./elements/ElementBackground";
import ElementImage from "./elements/ElementImage";
import ElementText from "./elements/ElementText";
import ElementCKEditor from "./elements/ElementCKEditor";
import ElementButton from "./elements/ElementButton";
import ElementLayout from "./elements/ElementLayout";
import ElementInput from "./elements/ElementInput";
import ElementElementConfiguration from "./elements/ElementElementConfiguration";
import ElementAccordion from "./elements/ElementAccordion";
import ElementSideChange from "./elements/ElementSideChange";
import ElementDynamic from "./elements/ElementDynamic";
import ElementHeader from "./elements/ElementHeader";
import ElementCarousel from "./elements/ElementCarousel";
import { useCallback } from "react";
import ElementSectionImageText from "./elements/ElementSectionImageText";
import ElementIcon from "./elements/ElementIcon";
import ElementTextAppearance from "./elements/ElementTextAppearance";
import ElementFeaturedProducts from "./elements/ElementFeaturedProducts";

const LeftSideBar = (props) => {

  // const changeVisibility = (e, uid) => {

  //     if(e.target.innerHTML == "visibility_off")
  //         e.target.innerHTML = "visibility";
  //     else
  //         e.target.innerHTML = "visibility_off";
  //    // refArray.current[uuid].innerHTML = "hidden";
  //     refArray.current[uid].classList.toggle("hidden")
  // }

  const propertyComponent = {
    background: ElementBackground,
    image: ElementImage,
    textsingle: ElementText,
    ckeditor: ElementCKEditor,
    button: ElementButton,
    layout: ElementLayout,
    input: ElementInput,
    elementconfiguration: ElementElementConfiguration,
    accordion: ElementAccordion,
    sidechange: ElementSideChange,
    dynamic: ElementDynamic,
    header: ElementHeader,
    carousel: ElementCarousel,
    section3: ElementSectionImageText,
    icon: ElementIcon,
    appearance: ElementTextAppearance,
    featuredproducts: ElementFeaturedProducts,
  }

  const changeBackground = () => {
    props.refArray.current[props.currentComponent].style = 'background: red;';
  }

  const changeDisplayView = useCallback((type) => {
    var node = document.getElementById("desktop_phone_view");
    var x = ReactDOM.findDOMNode(node);

    if (type == "D") {
      x.classList.remove("w-450");
    }
    else {
      x.classList.add("w-450");

    }
  }, []);

  return (
    <div id="left-main">
      <div className="bg-white pt-2">
        <div className="pl-2 pb-1 flex justify-between">
          <div className="text-2xl">{props.type == "Template" ? "Creare Template" : "Edit Page"}</div>
          <div>
            <div className="relative inline-flex mr-2">
              <a href="javascript:void(0);" onClick={() => { changeDisplayView('D') }} className="flex flex-wrap items-center text-sm px-2 py-1 border border-indigo-300 hover:border-indigo-400 text-indigo-500 rounded-l"><span className="material-icons-outlined text-sm">desktop_mac</span></a>
              <a href="javascript:void(0);" onClick={() => { changeDisplayView('M') }} className="flex flex-wrap items-center text-sm px-2 py-1 border border-indigo-300 hover:border-indigo-400 text-indigo-500 rounded-l"><span className="material-icons-outlined text-sm">phone_iphone</span></a>

            </div>
          </div>
        </div>
      </div>



      <div id="theme-tab" className="w-full bg-slate-100">
        <ul class="w-full flex bg-slate-100 justify-center items-center">
          <li className="mr-0.5 md:mr-0 w-1/2 text-center">
            <a
              href="javascript:void(0)"
              className={`${props.tabNumber == 1
                ? "tab py-4 px-6 block hover:text-blue-500 focus:outline-none text-blue-500 font-medium bg-slate-200"
                : "tab text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none font-medium hover:bg-slate-200"
                }`}
              onClick={() => {
                props.setTabNumber(1);
              }}
            >
              Add
            </a>
          </li>
          <li className="mr-0.5 md:mr-0 w-1/2 text-center">
            <a
              href="javascript:void(0)"
              className={`${props.tabNumber == 2
                ? "tab py-4 px-6 block hover:text-blue-500 focus:outline-none text-blue-500 font-medium bg-slate-200"
                : "tab text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none font-medium hover:bg-slate-200"
                }`}
              onClick={() => {
                props.setTabNumber(2);
              }}
            >
              Contents
            </a>
          </li>
          <li className="mr-0.5 md:mr-0 w-1/2 text-center">
            <a
              href="javascript:void(0)"
              className={`${props.tabNumber == 3
                ? "tab py-4 px-6 block hover:text-blue-500 focus:outline-none text-blue-500 font-medium bg-slate-200"
                : "tab text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none font-medium hover:bg-slate-200"
                }`}
              onClick={() => {
                props.setTabNumber(3);
              }}
            >
              Design
            </a>
          </li>
        </ul>
        <div
          className={`panel-01 tab-content p-2 bg-slate-200 ${props.tabNumber != 1 ? "hidden" : ""
            }`}
        >
          {props.componentList.length > 0 &&
            props.componentList.map((value, index) => (
              <>
                <div className="w-full relative mb-5">
                  <a
                    onClick={() => {
                      props.updateAccordion(value.id);
                    }}
                    className="font-semibold mb-2 mx-2 flex flex-wrap justify-between items-center"
                    href="javascript:void(0)"
                  >
                    <span >
                      {value.name}{" "}
                      <span className="ml-1">({value.child.length})</span>
                    </span>
                    <span className="material-icons-outlined">expand_more</span>
                  </a>
                </div>
                <Droppable droppableId={index} key={index}>
                  {(provided, snapshot) => {
                    const itemsFromBackend1 = value.child;
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex flex-wrap items-center -mx-2 px-2 ${props.accordArr.includes(value.id) ? "" : "hidden"
                          }`}
                      >
                        {itemsFromBackend1.map((value, i) => {
                          return (
                            <Draggable
                              key={`cmp${value.id}`}
                              draggableId={`cmp${value.id}`}
                              index={`cmp${value.id}`}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="w-1/2 mb-2 px-2"
                                  >
                                    <div className="bg-white text-center border border-solid border-neutral-200 cursor-grab">
                                      <div className="h-6 border-b border-b-slate-300">
                                        <span className="material-icons-outlined rotate-90">
                                          drag_indicator
                                        </span>
                                      </div>
                                      <img
                                        class="h-16"
                                        src={value.image}
                                        alt=""
                                      />
                                      <div class="p-2 text-xs border-t border-t-slate-300">
                                        {value.name}
                                      </div>
                                    </div>

                                    {/* test */}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                      </div>
                    );
                  }}
                </Droppable>
              </>
            ))}
        </div>

        <div
          className={`panel-01 tab-content p-2 bg-slate-200 ${props.tabNumber != 2 ? "hidden" : ""
            }`}
        >
          <div className="w-full">
            <div className="mb-3">
              <div className="font-semibold p-3">Website Headers</div>
            </div>

            <div className="mb-3">
              <div className="font-semibold p-3">Main Content</div>
              <ul>
                {props.componentHtml.map((comp) => {
                  return (
                    <li className="px-3 py-2 last:mb-0 border-2 border-neutral-200 hover:border-indigo-400 hover:bg-indigo-100 rounded-md mx-5">
                      <div className="flex items-center justify-between">
                        <a
                          className="block text-gray-200 hover:text-white truncate transition duration-150"
                          href="javascript:void(0)"
                        >
                          <div className="flex items-center text-gray-500">
                            <span className="material-icons-outlined mr-1">
                              drag_indicator
                            </span>
                            <span className="material-icons-outlined">
                              article
                            </span>
                            <span className="text-sm font-medium ml-3 text-gray-500">
                              {comp.name}
                            </span>
                          </div>
                        </a>
                        <div className="text-center flex justify-center">
                          <a
                            href="javascript:void(0)"
                            className="ml-1 inline-block leading-none"
                          >
                            <span
                              className="material-icons-outlined"
                              onClick={(e) => {
                                props.changeVisibility(comp.uid);
                              }}
                            >
                              {comp.visibility == "on"
                                ? "visibility"
                                : "visibility_off"}
                            </span>
                          </a>
                          <a
                            href="javascript:void(0)"
                            className="text-rose-500 ml-1 inline-block leading-none"
                            onClick={() => props.deleteComponent(comp.uid)}
                          >
                            <span className="material-icons-outlined">
                              delete
                            </span>
                          </a>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div >
              <div className="font-semibold p-3">Website Footers</div>
            </div>
          </div>
        </div>

        <div
          className={`panel-01 tab-content p-2 bg-slate-200 ${props.tabNumber != 3 ? "hidden" : ""
            }`}
        >
          <div className="theme-contentbox all-properties">
            {/* Page Header Design Properties  */}

            {Object.keys(props.comProperties).length > 0 && <>
              {Object.entries(props.comProperties).map(([key, val]) => {
                const Component = propertyComponent[val.type];
                
               return <Component {...props} variable={key} compprop={val} />;
              })}
              </>
          }
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSideBar;
