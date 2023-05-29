/*Component Name: ElementImage
Component Functional Details: Element for Component Background  
Created By: Vikas Patel
Created Date: 07/07/2022
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useCallback } from 'react';
import { iconLibrary } from 'dummy/Dummy';

const ElementIconBrowser = ({ showModal, defaultIcon, setShowModal, updateFont }) => {


  const showElement = (str) => {
    let x = document.getElementById('fontdisplay');
    if (x != undefined) {
      x.querySelectorAll('#fontawesome-div')[0].classList.remove("bg-slate-500");
      x.querySelectorAll('#fontawesome-div')[0].classList.remove("text-white");

      x.querySelectorAll('#googlematerial-div')[0].classList.remove("bg-slate-500");
      x.querySelectorAll('#googlematerial-div')[0].classList.remove("text-white");

      x.querySelectorAll('#googlematerial')[0].classList.add("hidden");
      x.querySelectorAll('#fontawesome')[0].classList.add("hidden");

      x.querySelectorAll('#' + str + "-div")[0].classList.add("bg-slate-500");
      x.querySelectorAll('#' + str + "-div")[0].classList.add("text-white");
      x.querySelectorAll('#' + str)[0].classList.remove("hidden");

    }

  }


  return (
    <>
      {showModal ? (
        <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative w-full my-6 mx-auto max-w-3xl">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                <h3 className="text-3xl font=semibold">Icon Library</h3>
                <button
                  className="bg-transparent border-0 text-black float-right"
                  onClick={() => setShowModal(false)}
                >
                  <span className="text-black opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
                    x
                  </span>
                </button>
              </div>
              <div className="relative p-6 flex-auto flex flex-wrap" id={`fontdisplay`}>
                <ul class="w-full nav nav-tabs custom-tabs flex" role="tablist">
                  <li role="presentation" className="pr-5 border-l border-t border-r rounded-t bg-slate-500 text-white p-1" id="fontawesome-div"><a href="javascript:void(0)" onClick={() => { showElement("fontawesome") }} >Font Awesome</a></li>
                  <li role="presentation" className="border-l border-t border-r rounded-t p-1" id="googlematerial-div"><a href="javascript:void(0)" onClick={() => { showElement("googlematerial") }}>Elementor Icons</a></li>
                </ul>
                <div className="box-border h-20 w-full p-4 border- border-gray-400 bg-gray-100">
                  <div className="h-full w-full bg-gray-10">
                    <div id="fontawesome" className="tab-pane" role="tabpanel">
                      {iconLibrary.fontawesome.length > 0 && <>
                        {iconLibrary.fontawesome.map((fntsome, index) => <>
                          <a href="javascript:void(0)" onClick={() => { updateFont('fontawesome', fntsome) }} className="p-2 icon-list">
                            <span className="icon-asset material-icons-outlined ng-star-inserted">{fntsome}</span>
                          </a>
                        </>
                        )
                        }
                      </>}

                    </div>

                    <div id="googlematerial" className="tab-pane" role="tabpanel">
                      {iconLibrary.googlematerial.length > 0 && <>
                        {iconLibrary.googlematerial.map((googlefnt, index) => <>
                          <a href="javascript:void(0)" onClick={() => { updateFont('googlematerial', googlefnt) }} className="p-2  icon-list">
                            <span className="icon-asset material-icons-outlined ng-star-inserted">{googlefnt}</span>
                          </a>
                        </>
                        )
                        }
                      </>}

                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                <button
                  className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button
                  className="text-white bg-yellow-500 active:bg-yellow-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>

      ) : null}
    </>
  );
};

export default ElementIconBrowser;
