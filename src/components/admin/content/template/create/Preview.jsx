/*Component Name: Template create
Component Functional Details: Here we are creating template with components.
Created By: Vikas Patel 
Created Date: - 06/30/2022
Modified By:
Modified Date:  */

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable   } from 'react-beautiful-dnd';
import * as Yup from "yup";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import LeftSideBar from "./LeftSideBar";
import TemplateHeader from "./TemplateHeader";
import TemplateFooter from "./TemplateFooter";
import { v4 as uuid } from 'uuid';
import Toolbar from "./Toolbar";
import ComponentService from "services/admin/component/ComponentService";
import TemplateService from "services/admin/template/TemplateService";
import TopicsDetailsServices from "services/admin/topics/TopicsDetailsServices";
//import { addedComponent } from "dummy/Dummy";
import { Link } from 'react-router-dom';
import { useCallback } from "react";
import { cssNumber } from "jquery";
import { useSelector } from "react-redux";
import LoaderImage from "assets/images/loading.gif"
import * as helper from "components/admin/content/helper/Helper";
import ElementCarouselDisplay from "./elements/ElementCarouselDisplay";
import ElementAccordionDisplay from "./elements/ElementAccordionDisplay";
import SEO from "components/admin/masterCatalog/common/product/create/forms/SEO";
import { Helmet } from "react-helmet";



const Preview = () => {
    const refArray = React.useRef([]);
    const [addedComponent, setAddedComponent] = useState([]); 
    const { id } = useParams();
    const isAddMode = !id;
    const [compArr, setCompArr] = useState([]);
    const [componentHtml, setComponentHtml] = useState([]);
    const [componentHtmlNew, setComponentHtmlNew] = useState([]);

    const [accordArr, setAccordArr] = useState([]);
    const [currentComponent, setCurrentComponent] = useState();
    const [tabNumber, setTabNumber] = useState(1);
    const [comProperties, setComProperties] = useState([]);
    const [firstLoaded, setFirstLoaded] = useState(false);
    const [newAddedComponent, setNewAddedComponent] = useState([]);
    const [postArr, setPostArr] = useState([]);
    const [componentList, setComponentList] = useState([]);
    const [data, setData] = useState(false);
    const CompanyName = useSelector((store) => store?.CompanyConfiguration.data)

    const [storeId, setStoreId] = useState(4);
    const [loadCSS, setLoadCSS] = useState(false);
  

    const getPageType = () => {
        if(window.location.href.includes("Page/"))
          return "Page";
        else
          return "Template";
      };

    // const getComponents = () => {
    //   if(getPageType() == "Page")
    //   {
    //       TopicsDetailsServices.getPublishTopicComponent(id)
    //         .then((res)=>{
    //           setComponentList(res.data);
    //         }).catch((error)=>{
    //             console.log(error, "Page Error");
    //         });
    //   }
    //   else if(getPageType() == "Template")
    //   {
    //       TemplateService.getTemplateComponents(1)
    //         .then((res)=>{
    //           setComponentList(res.data);
    //         }).catch((error)=>{
    //         });
    //   }
    // };

    const getTopicDetails = () => {
      TopicsDetailsServices.getTopicDetails(id, {})
        .then((res) => {
          let data = res.data.data;
          setStoreId(data.store_id);
          setLoadCSS(true);
        }).catch((error) => {
        });
    };

    useEffect(() => {
    //  getComponents();
      if(getPageType() == "Page")
      {
          TopicsDetailsServices.getPublishTopicComponent(id, 'preview')
          .then((res)=>{
            if(res.data != null)
              setComponentHtml(res.data.data);
              
              getTopicDetails();
          }).catch((error)=>{
          });
      }
      else if(getPageType() == "Template")
      {
          TemplateService.getTemplateComponents(1)
          .then((res)=>{
            setComponentHtml(res.data);
            setAddedComponent(res.data);
          }).catch((error)=>{
          });
      }
    }, [])

    
    const filterArr = () => {
        componentList.forEach((elchild)=>{
          
            // setCompArr(...compArr, {[elchild.id]: elchild.html});
            if(elchild.visibility != "off")
            {

              setCompArr(compArr => [...compArr, { no: elchild.no, uid: elchild.uuid, id: elchild.id, html: elchild.html, name: elchild.name, properties: elchild.properties, selected_Values: JSON.parse(elchild.selectedVal) ?? {}, visibility: elchild.visibility, extraHTML: elchild.extraHTML ?? {} }]);

            }
        });
    };

    useEffect(() => {
        filterArr();
        
    }, [componentList]);

    useEffect(() => {
      
     let x = document.getElementById('wrapperloading');
     x.style.display = 'none';
      
  }, [compArr]);

     /* Default component background pending settings load */
    const loadBackgroundDefault = (element) => {
      
    if (element.selected_Values != undefined) {
      if (Object.keys(element.selected_Values).length > 0) {
        const bgPropertyName = Object.keys(element.properties).find(
          (key) => key === 'bg',
        );

        let attributes;
        Object.entries(element.selected_Values).map(
          ([key, value]) => {
            
            if (key == bgPropertyName)
            {
              attributes = value;
            } 
          }
        );


        if (attributes != undefined && Object.keys(attributes).length > 0) {
          if (attributes.type == 'color') {
            return attributes.value;
          } else if (attributes.type == 'image') {
            return 'url("' + attributes.value + '")';
          } else if (attributes.type == 'none') {
            return 'none';
          }
        }
      }

      return 'none';
    }
    return 'none';
    

 

    }

    const itemsFromBackend = [
       
    ];

   

    /* Select current component */
    const selectCurrentComponent = (uid) => {
      setCurrentComponent(uid);
      
      let element =  componentHtml.filter(data => {
        return data.uid == uid;
        });
        
      setComProperties(element[0].properties);
    }

  

   
    /* Hiden Div Element */

    

     const displayComponentSelectProperties = () => {

    //   if(!firstLoaded)
    //   {
    //     if(compArr.length > 0)
    //     {
    //         alert(compArr.length);
    //       updatePropertyFirstTime();
    //         addedComponent.forEach((el) => {

    //           let element = compArr.filter((value)=> value.id === el.id);

              
              
    //           if(element.length > 0 && !newAddedComponent.includes(el.no) ) {
    //             //console.log("NEW", element);
    //             let uid = uuid();// "divNo"+len + "-"+element[0].id;
    //             setComponentHtml((previous)=>[...previous, {no: el.no ?? "", id: element[0].id, html: element[0].html, uid: uid, name: element[0].name, visibility: "on", properties: element[0].properties, selectedVal: el.selectedVal ?? {}}]);
    //             setNewAddedComponent((previous1) => [...previous1, el.no]);
    //         }
            
    //       });
    //     }
        

        
  

    //   }

    };

    const updatePropertyFirstTime = () => {
//       if(componentHtml.length > 0)
//       {
//         setFirstLoaded(true);
//         componentHtml.map((componentValue, index)=>{
//           if(componentValue.selectedVal != undefined)
//           {
// //            document.querySelectorAll("#609e3da3-0ba3-412f-9d52-9553ba7868db")[0].click();
//            // console.log(el);
// //            alert(componentValue.uid);
//             //            document.getElementById(componentValue.uid).click();
//   //          ;
//             selectCurrentComponent(componentValue.uid);
//           //  var element = document.getElementById("bf32d424-ed77-4a06-91a3-41802d556e1e");
//           //  alert(element.innerHTML);
            
// //          element.click();
//           }
//         });
  
//       }
    }
    
    /* Set Properties to Component as per Selected Val */
    useEffect(() => {
     
      componentHtmlNew.map((element, index) => {
          //let x = ReactDOM.findDOMNode(refArray.current[element.uid]);
        //  x.querySelectorAll('#div'+element.no)[0].innerHTML = element.uid;
        helper.updateSetProperties(element, index);
           
      })

      }
    ,[componentHtmlNew]);

    useEffect(() => {

      componentHtml.map((elchild, index) => {
        setComponentHtmlNew(componentHtmlNew => [...componentHtmlNew, { no: elchild.no, uid: elchild.uuid, id: elchild.id, html: elchild.html, name: elchild.name, properties: elchild.properties, selected_Values: JSON.parse(elchild.selectedVal) ?? {}, visibility: elchild.visibility, extraHTML: elchild.extraHTML ?? {} }]);
      })

      }
    ,[componentHtml]);

    const [showModal, setShowModal] = useState(false);

   
  return (
    
   <>
    
   {loadCSS && <Helmet>
   
          <link
            rel="stylesheet"
            type="text/css"
            href={`${process.env.REACT_APP_API_BLOB}/${process.env.REACT_APP_BLOB_CONTAINER}/${1}/store/${
              storeId}/css/${storeId}.css`}
          />
          <link
            rel="stylesheet"
            type="text/css"
            href={`https://redefinecommerce.blob.core.windows.net/rdc/${1}/store/${
              storeId}/css/custom.css`}
          />
           <link
            rel="stylesheet"
            type="text/css"
            href={`../../../../../assets/css/tailwind/front/output.css`}
          /> 
        </Helmet>
      }
     <div className="font-inter antialiased bg-slate-100 text-gray-500">
        <TemplateHeader />
       
        {showModal ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                  <h3 className="text-3xl font=semibold">General Info</h3>
                  <button
                    className="bg-transparent border-0 text-black float-right"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="text-black opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
                      x
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                  <form className="bg-gray-200 shadow-md rounded px-8 pt-6 pb-8 w-full">
                    <label className="block text-black text-sm font-bold mb-1">
                      First Name
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-1 text-black" />
                    <label className="block text-black text-sm font-bold mb-1">
                      Last Name
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-1 text-black" />
                    <label className="block text-black text-sm font-bold mb-1">
                      Address
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-1 text-black" />
                    <label className="block text-black text-sm font-bold mb-1">
                      City
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-1 text-black" />
                  </form>
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
        </>
      ) : null}
        <main>

          
            { componentHtmlNew.length > 0 ? 
                componentHtmlNew.map((componentValue, index)=>{
                 
                const backgroundDefault = loadBackgroundDefault(componentValue);
                let additionalclass = "";
                if(componentValue.selected_Values && "additionalclass" in componentValue.selected_Values)
                {
                    additionalclass = componentValue.selected_Values.additionalclass.value;                                                          
                }
                return(
                    <div className={`${componentValue.visibility == "off" ? "hidden" : ""} ${additionalclass}`} style={{ background: backgroundDefault }} id={`div${componentValue.no}`} 
                    ref={ref => {
                        refArray.current[componentValue.uuid] = ref; // took this from your guide's example.
                    }}        >
                      
                      {Object.keys(componentValue.selected_Values).includes("carousel") ? <>
                            <ElementCarouselDisplay bannerArr={componentValue.selected_Values.carousel.value} />
                      </> :
                      <>
                        {Object.keys(componentValue.selected_Values).includes("FullAccordion") ? <>
                          <ul class="mt-4 w-full">
                            <ElementAccordionDisplay acValues={componentValue.selected_Values.FullAccordion.value} />
                          </ul>
                        </> :
                          <>
                            <div className="text-center w-full">
                              <div dangerouslySetInnerHTML={{ __html: componentValue.html }}></div>
                            </div>
                          </>
                        }
                        </>
                      }
                    </div>
                    
                    )
                
                // return <div key={index} className="text-center p-5 border my-2" dangerouslySetInnerHTML={{ __html: comphtml }}></div>
                }) : <>
                <div class="text-center p-5 border my-2"><section classname="mainsection taillwind_content_block_22">
                
                </section></div></>
            }
        </main>
        <TemplateFooter />

     </div>
     <div id="wrapperloading" style={{"position": "fixed","z-index": "10000000"}}>
      <div id="loading">
          <img src={LoaderImage} /> <br /> Please Wait ... 
        </div>
      </div>
          </>

      
      
   
  );
};

export default Preview;
