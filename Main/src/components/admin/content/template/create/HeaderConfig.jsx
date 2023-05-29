/*Component Name: Template create
Component Functional Details: Here we are creating template with components.
Created By: Vikas Patel 
Created Date: - 06/30/2022
Modified By:
Modified Date:  */

import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import * as Yup from "yup";
// import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import LeftSideBar from "./LeftSideBar";
import TemplateHeader from "./TemplateHeader";
import TemplateFooter from "./TemplateFooter";
import Toolbar from "./Toolbar";
import CMSConfiguration from "services/admin/cmsConfiguration/CMSConfiguration";
import { Link } from "react-router-dom";
import ElementHeaderSetup from "./elements/ElementHeaderSetup";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const HeaderConfig = () => {
  const CompanyName = useSelector((store) => store?.CompanyConfiguration.data);

  const [addedComponent, setAddedComponent] = useState([]);
  const { id } = useParams();
  const imagePath = `/${CompanyName}/store/${id}/images/`;
  const [headerProps, setHeaderProps] = useState([]);
  const getHeaderConfigData = useCallback(() => {
    CMSConfiguration
      .getConfiguration(id, "header_config")
      .then((res) => {
        setHeaderProps(JSON.parse(res.data.data.config_value));
      }).catch((error) => { });
  }, [])

  const updateHeaderConfigData = () => {
    var jsonData = JSON.stringify(headerProps);
    let headerConfigObj = {
      "store_id": id,
      "config_name": "header_config",
      "config_value": jsonData,
      "status": "Y"
    }
    CMSConfiguration.updateConfiguration(headerConfigObj)
      .then((res) => {
        console.log(res.data, "Updated Successfully.");
      })
      .catch(() => { })
  }

  useEffect(() => {
    getHeaderConfigData();

  }, []);

  const saveData = () => {
    updateHeaderConfigData();



  };




  /* Main Drop function where it will update content HTML array */




  const itemsFromBackend = [];






  /* Hiden Div Element */


  return (
    <>
      <div className="flex py-3 p-4 justify-between items-center bg-slate-800 sticky inset-0 bottom-auto z-60">
        <div className="flex items-center flex-wrap">
          <div className="relative inline-flex">
            <Link
              to={`/admin/MasterCatalog/Store`}
              className="flex flex-wrap btn-sm px-4 py-[5px] bg-white hover:bg-indigo-500 text-indigo-500 hover:text-white mr-2"
            >
              Exit
            </Link>

            <a
              href="javascript:void(0);"
              className="px-4 py-[5px] btn-sm bg-indigo-500 hover:bg-indigo-600 text-white mr-2"
              onClick={saveData}
            >
              Save
            </a>
          </div>
        </div>
      </div>

      <div className="flex justify-between border-solid border-b-gray-100 w-full">
        <div className="w-full">


          <div className="flex flex-wrap mb-6 relative">
            {/* Left Side Panel Code Starts */}
            <div
              className="fixed transition-all bg-slate-100 overflow-x-hidden shadow-lg bottom-0 top-[115px] z-40"
              id="left"
              style={{ width: "380px" }}
            >
              <ElementHeaderSetup imagePath={imagePath} headerProps={headerProps} setHeaderProps={setHeaderProps} />
            </div>

            {/* Left Side Panel code Ends */}

            {/* Content Part code Starts */}
            <div
              id="#desktop_phone_view"
              className="transition-all relative grow"
              style={{ marginLeft: "380px" }}
            >
              <div className="inset-0 h-14 w-full collapse collapse-horizontal relative z-20">
                <div className="block p-2 shadow-lg bg-white">
                  <div className="flex flex-wrap sm:auto-cols-max justify-start sm:justify-end gap-2">
                    <div className="flex">
                      {" "}
                      <button className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700 flex items-center">
                        {" "}
                        <span className="material-icons-outlined">
                          format_bold
                        </span>{" "}
                      </button>{" "}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 relative z-10">
                <div className="border border-dashed border-neutral-200 mx-auto">
                  <div className="w-full min-h-screen mx-auto">
                    <div className="font-inter antialiased bg-slate-100 text-gray-500">
                      <div className="border border-dashed border-neutral-200 mx-auto">
                        <div className="font-inter antialiased bg-slate-100 text-gray-500">
                          <div className="p-4">
                            <TemplateHeader headerProps={headerProps} setHeaderProps={setHeaderProps} />

                            <TemplateFooter />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </>
  );
};

export default HeaderConfig;