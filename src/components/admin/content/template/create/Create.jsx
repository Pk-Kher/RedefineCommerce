/*Component Name: Template create
Component Functional Details: Here we are creating template with components.
Created By: Vikas Patel 
Created Date: - 06/30/2022
Modified By:
Modified Date:  */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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
import { useSelector } from "react-redux";
import { ValidationMsgs } from "global/ValidationMessages";

//import { addedComponent } from "dummy/Dummy";
import { Link } from 'react-router-dom';
import LoaderImage from "assets/images/loading.gif"
import * as helper from "components/admin/content/helper/Helper";
import * as ReactDOMServer from 'react-dom/server';
import { Carousel } from 'react-responsive-carousel';
import PageEditTabHeader from 'components/admin/content/page/edit/PageEditTabHeader';
import { Helmet } from "react-helmet";
//import '../../../../../assets/css/tailwind/front/output.css';
import 'react-responsive-carousel/lib/styles/carousel.css';


const Create = () => {
  const CompanyName = useSelector((store) => store?.CompanyConfiguration.data);
  const FolderPath = `/${CompanyName}/store/`;
  const [storeId, setStoreId] = useState(4);
  const [loadCSS, setLoadCSS] = useState(false);

  const [testStr, setTestStr] = useState('');
  const refArray = React.useRef([]);
  const [addedComponent, setAddedComponent] = useState([]);
  const { id } = useParams();
  const isAddMode = !id;
  const [compArr, setCompArr] = useState([]);
  const [cmpIdArr, setCmpIdArr] = useState([]);
  const [componentHtml, setComponentHtml] = useState([]);
  const [accordArr, setAccordArr] = useState([]);
  const [currentComponent, setCurrentComponent] = useState();
  const [tabNumber, setTabNumber] = useState(1);
  const [comProperties, setComProperties] = useState([]);
  const [firstLoaded, setFirstLoaded] = useState(false);
  const [newAddedComponent, setNewAddedComponent] = useState([]);
  const [postArr, setPostArr] = useState([]);
  const [postArr1, setPostArr1] = useState([]);

  const [componentList, setComponentList] = useState([]);
  const [displayPublish, setDisplayPublish] = useState(false);


  const getPageType = () => {
    if (window.location.href.includes("Page/edit"))
      return "Page";
    else
      return "Template";
  };

  const getComponents = () => {
    let xy = document.getElementById("wrapperloading");
    xy.style.display = "block";
    ComponentService.getComponents()
      .then((res) => {
        setComponentList(res.data.data);
        xy.style.display = "none";
      }).catch((error) => {
        console.log(error, "Template ERrror");
      });
  };

  // const sayHello = () => {
  //   alert('s');
  // }

  const getTopicDetails = () => {
    TopicsDetailsServices.getTopicDetails(id, {})
      .then((res) => {
        let data = res.data.data;
        setStoreId(data.storeId);
        setLoadCSS(true);
        if (res.data.data.publish_status != undefined) {
          setDisplayPublish(res.data.data.publish_status);
        }
        // updateComponentHTML();
      }).catch((error) => {
      });
  };

  useEffect(() => {

    getComponents();
    // let str = "Hello";
    // {"say"+str}();
    if (getPageType() == "Page") {
      TopicsDetailsServices.getTopicComponent(id)
        .then((res) => {
          setAddedComponent(res.data.data);
          getTopicDetails();
          // updateComponentHTML();
        }).catch((error) => {
        });
    }
    else if (getPageType() == "Template") {
      setLoadCSS(true);
      TemplateService.getTemplateComponents(id)
        .then((res) => {
          setAddedComponent(res.data);
          // updateComponentHTML();
        }).catch((error) => {
        });
    }
  }, []);

  useEffect(() => {
    if (document.readyState === "complete") {
      displayComponentSelectProperties();
    }
  });
  // const updateComponentHTML = useCallback(() => {

  //   addedComponent.forEach((el) => {

  //     let element = compArr.filter((value)=> value.id === el.id);
  //     if(element.length > 0 && !newAddedComponent.includes(el.no) ) {
  //       //console.log("NEW", element);
  //       let uid = uuid();// "divNo"+len + "-"+element[0].id;
  //       setComponentHtml((previous)=>[...previous, {no: el.no ?? "", id: element[0].id, html: element[0].html, uid: uid, name: element[0].name, visibility: "on", properties: element[0].properties, selected_Values: el.selected_Values ?? {}}]);
  //       setNewAddedComponent((previous1) => [...previous1, el.no]);
  //   }
  //   console.log("D");
  // })}, [addedComponent]);

  useEffect(() => {
    // setPostArr([]);

    let tmpArr = [];
    let tmpArr1 = [];
    componentHtml.map((element, index) => {

      tmpArr = [...tmpArr, { id: element.id, page_Id: id, component_Id: element.component_Id, selected_Values: JSON.stringify(element.selected_Values), visibility: element.visibility }]
      tmpArr1 = [...tmpArr1, { id: element.id, page_Id: id, uid: element.uid, component_Id: element.component_Id, selected_Values: JSON.stringify(element.selected_Values), visibility: element.visibility }]




    });
    setPostArr(tmpArr);
    setPostArr1(tmpArr1);
  }, [componentHtml])

  const singleSaveData = (uid, compid) => {
    let xy = document.getElementById("wrapperloading");
    xy.style.display = "block";
    let tmpArr;

    let data = postArr1.filter(element => { return element.uid === uid; })[0];

    let tmpData = [{id: data.id, page_Id: id, component_Id: data.component_Id, selected_Values: data.selected_Values, visibility: data.visibility}];
    if (getPageType() == "Page") {
      TopicsDetailsServices.updateSingleTopicComponent(tmpData, id)
        .then((res) => {
          alert(ValidationMsgs.topic.publishSuccess);
          xy.style.display = "none";
          setDisplayPublish(true);

        }).catch((error) => {
          alert(ValidationMsgs.topic.publishError);
          xy.style.display = "none";

        });
    }

  };
  const saveData = useCallback(() => {
    let xy = document.getElementById("wrapperloading");
    xy.style.display = "block";
    let tmpArr;
    let data = { data: postArr };
    if (getPageType() == "Page") {
      TopicsDetailsServices.updateTopicComponent(postArr, id)
        .then((res) => {
          alert(ValidationMsgs.topic.publishSuccess);
          xy.style.display = "none";
          setDisplayPublish(true);

        }).catch((error) => {
          alert(ValidationMsgs.topic.publishError);
          xy.style.display = "none";

        });
    }
    else if (getPageType() == "Template") {
      TemplateService.updateTemplateComponents(data, id)
        .then((res) => {
          alert(ValidationMsgs.topic.publishSuccess);
          xy.style.display = "none";


        }).catch((error) => {
          alert(ValidationMsgs.topic.publishError);
          xy.style.display = "none";

        });
    }

    // console.log(JSON.stringify(postArr));
  }, [postArr]);
  const filterArr = () => {
    componentList.forEach((el) => {
        
      el.child.forEach((elchild) => {
        //console.log(elchild);
        // setCompArr(...compArr, {[elchild.id]: elchild.html});\
        setCmpIdArr(cmpIdArr=> [...cmpIdArr, elchild.id]);
        if(cmpIdArr.indexOf(elchild.id) <= -1)
        {
          setCompArr(compArr => [...compArr, { no: elchild.no, id: elchild.id, html: elchild.html, name: elchild.name, properties: elchild.properties, selected_Values: elchild.selected_Values ?? {}, visibility: elchild.visibility, extraHTML: elchild.extraHTML ?? {} }]);

        }

      })
    });
  };

  useEffect(() => {
    
    filterArr();

  }, [componentList]);

  useEffect(() => {



  }, [compArr]);

  /* Main Drop function where it will update content HTML array */
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    // if(destination != null && destination.droppableId == "1100")
    if (source.droppableId !== destination.droppableId) {
      //  console.log("index", source.index);
      let index = source.index.replace("cmp", "");
      const element = compArr.filter((value) => value.id.toString() == index);

      let len = componentHtml.length;

      let uid = uuid();// "divNo"+len + "-"+element[0].id;

      // let elementNew;
      // ComponentService.getComponents(index)
      // .then((res)=>{
      //   elementNew = res[0].data;
      //   //setComponentList(res.data);

      // }).catch((error)=>{
      //     //console.log(error, "Template ERrror");
      // });


     // console.log({ no: 0, id: 0, component_Id: element[0].id, html: element[0].html, uid: uid, name: element[0].name, visibility: "on", properties: element[0].properties, selected_Values: element[0].selected_Values ?? {}, extraHTML: element[0].extraHTML ?? {} });
      setComponentHtml((previous) => [...previous, { no: 0, id: 0, component_Id: element[0].id, html: element[0].html, uid: uid, name: element[0].name, visibility: "on", properties: JSON.parse(element[0].properties), selected_Values: element[0].selected_Values ?? {}, extraHTML: element[0].extraHTML ?? {} }]);
      /* if(Object.keys(element[0].selected_Values).length > 0)
       {
           const bgPropertyName = Object.keys(element[0].properties).find(key => element[0].properties[key] === "background");
           

           const attributes = Object.entries(element[0].selected_Values).map(([key, value]) => {
               if(key == bgPropertyName)
                   return value;
           })[0];
           if (Object.keys(attributes).length > 0) {
               
               if(attributes.type == "color")
               {
                   refArray.current[uid].style='background: '+attributes.value+';';
               }
               else if(attributes.type == "image")
               {
                   refArray.current[uid].style='background: url("'+attributes.value+'");';
               }
               else if(attributes.type == "none")
               {
                   refArray.current[uid].style='background: none;';
               }
           }
       }*/



    }
    else {
      let componentHtmlNew = [...componentHtml];
      const [removed] = componentHtmlNew.splice(source.index, 1);
      componentHtmlNew.splice(destination.index, 0, removed);
      setComponentHtml(componentHtmlNew);
      componentHtml.map((componentValue, index) => {
        if (componentValue.selected_Values != undefined) {
          //selectCurrentComponent(componentValue.uid);
          setTimeout(function () { helper.updateSetProperties(componentValue, 1); }, 1000);
//          helper.updateSetProperties(componentValue, index);
          
        }
      });
    }
  }

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

  /* Function for Accordion On/Off in Sidebar */
  const updateAccordion = (id) => {
    if (accordArr.includes(id)) {

      setAccordArr(previous =>
        previous.filter(data => {
          return data !== id;
        }),
      );

    }
    else {
      setAccordArr((previous) => [...previous, id]);
    }
  }

  /* Select current component */
  const selectCurrentComponent = (uid) => {
    setCurrentComponent(uid);

    let element = componentHtml.filter(data => {
      return data.uid == uid;
    });

    setComProperties(element[0].properties);
  }

  /* Clone Component */
  const cloneComponent = (uid) => {
    let componentHtmlNew = [...componentHtml];
    let latestComponent = [];
    let newObj;
    componentHtmlNew.map((arr) => {
      
      latestComponent.push(arr);
      if (arr.uid == uid) {
        //arr.uid = uuid();
        // console.log(currentComponent, arr);
        let newuid = uuid();
        let sno = Math.random();
        newObj = { no: sno, id: arr.id, component_Id: arr.component_Id, html: arr.html, uid: newuid, name: arr.name, visibility: "on", properties: arr.properties, selected_Values: arr.selected_Values ?? {}, extraHTML: arr.extraHTML ?? {} };

        latestComponent.push({ no: sno, id: arr.id, component_Id: arr.component_Id, html: arr.html, uid: newuid, name: arr.name, visibility: "on", properties: arr.properties, selected_Values: arr.selected_Values ?? {}, extraHTML: arr.extraHTML ?? {} });
      }
    });
    setComponentHtml(latestComponent);
    setTimeout(function () { helper.updateSetProperties(newObj, 1); }, 2000);

  }

  /* Hide Component */
  const changeVisibility = (uid) => {
    let componentHtmlNew = [...componentHtml];
    let latestComponent = [];
    let newObj;
    componentHtmlNew.map((arr) => {


      if (arr.uid == uid) {
        newObj = { no: arr.no, id: arr.id, html: arr.html, component_Id: arr.component_Id, uid: uuid(), name: arr.name, "visibility": arr.visibility === "on" ? "off" : "on", properties: arr.properties, selected_Values: arr.selected_Values ?? {}, extraHTML: arr.extraHTML ?? {} };
        latestComponent.push({ no: arr.no, id: arr.id, component_Id: arr.component_Id, html: arr.html, uid: uuid(), name: arr.name, "visibility": arr.visibility === "on" ? "off" : "on", properties: arr.properties, selected_Values: arr.selected_Values ?? {}, extraHTML: arr.extraHTML ?? {} });
      }
      else {
        latestComponent.push(arr);
      }
    });
    setComponentHtml(latestComponent);

    setTimeout(function () { helper.updateSetProperties(newObj, 1); }, 2000);

  }

  /* Delete Component */
  const deleteComponent = (uid) => {
    setComponentHtml(previous =>
      previous.filter(data => {
        return data.uid !== uid;
      }),
    );

  }

  /* UPDATE selected attributes of component */
  const updateProperty = (bgObj, propertyChange) => {
    const curObj = componentHtml.filter(obj => obj.uid == currentComponent);
    let attributes;
    if (propertyChange != "") {
      if (curObj[0].selected_Values != undefined) {
        let isProperty = false;
        Object.entries(curObj[0].selected_Values).map(([key, value]) => {
          if (key == propertyChange) {
            isProperty = true;
            attributes = { ...attributes, [key]: bgObj };
          }
          else {
            attributes = { ...attributes, [key]: value };

          }
        });
        if (!isProperty) {
          attributes = { ...attributes, [propertyChange]: bgObj };
        }

      }
      else {
        attributes = { [propertyChange]: bgObj };
      }
      const updatedObj = componentHtml.map((obj) => {
        if (obj.uid == currentComponent) {
          return { ...obj, selected_Values: attributes };
        }
        else {
          return { ...obj };
        }

      });



      setComponentHtml(updatedObj);
      // setBackAttributes(updatedObj);

    }
  }


  const allFunctions = {
    deleteComponent: deleteComponent,
    currentComponent: currentComponent,
    setCurrentComponent: setCurrentComponent,
    refArray: refArray,
    componentHtml: componentHtml,
    componentList: componentList,
    setComponentHtml: setComponentHtml,
    changeVisibility: changeVisibility,
    cloneComponent: cloneComponent,
    selectCurrentComponent: selectCurrentComponent,
    updateAccordion: updateAccordion,
    accordArr: accordArr,
    setTabNumber: setTabNumber,
    tabNumber: tabNumber,
    comProperties: comProperties,
    setComProperties: setComProperties,
    updateProperty: updateProperty,
    singleSaveData: singleSaveData,
    type: getPageType(),
    imagePath: FolderPath + storeId + `/images/`,
    storeId: storeId
  };



  /* Hiden Div Element */





  const updatePropertyFirstTime = () => {
    if (componentHtml.length > 0) {
      setFirstLoaded(true);
      componentHtml.map((componentValue, index) => {
        if (componentValue.selected_Values != undefined) {
          //            document.querySelectorAll("#609e3da3-0ba3-412f-9d52-9553ba7868db")[0].click();
          // console.log(el);
          //    alert(componentValue.uid);
          //            document.getElementById(componentValue.uid).click();
          //          ;

          // let x = document.getElementById("dynamicbutton"+index);
          // //alert(x);
          // if(x != undefined && x != null)
          // {
          //   x.click();

          // }
          helper.updateSetProperties(componentValue, index);
          //            setTimeout(selectCurrentComponent(componentValue.uid), 5000);
          //  var element = document.getElementById("bf32d424-ed77-4a06-91a3-41802d556e1e");
          //  alert(element.innerHTML);

          //          element.click();
        }
      });

    }
  };

  const displayComponentSelectProperties = () => {

    if (!firstLoaded) {
      
      if (compArr.length > 0) {
        

        updatePropertyFirstTime();
        addedComponent.map((el) => {
          //console.log("NEW", el, compArr);
          let element = compArr.filter((value) => value.id === el.component_Id);
          
          if (element.length > 0 && !newAddedComponent.includes(el.no)) {
            
            let uid = uuid();// "divNo"+len + "-"+element[0].id;
            setComponentHtml((previous) => [...previous, { no: el.no ?? "", component_Id: el.component_Id, id: el.id, html: element[0].html, uid: uid, name: element[0].name, visibility: el.visibility, properties: JSON.parse(element[0].properties), selected_Values: JSON.parse(el.selected_Values) ?? {} }]);
            setNewAddedComponent((previous1) => [...previous1, el.no]);
          }

        });
      }





    }

  };


  useEffect(() => {
    // const ourComponetiNString = ReactDOMServer.renderToStaticMarkup(

    //   <TestCp arr={componentHtml} />

    // );
    // let str = "This is REPLACE code";
    // setTestStr(str.replace("REPLACE", `${ourComponetiNString}`));
  }, [componentHtml]);

  //     testStr = testStr.replace("REPLACE", `${ourComponetiNString}`);
  // console.log(SomeComponent());
  //     testStr = testStr.replace("REPLACE", `${SomeComponent('VIKAS').props.children}`);

  const publishPage = () => {
    let xy = document.getElementById("wrapperloading");
    xy.style.display = "block";

    let topicObj = {
      "id": id,
      "title": "string",
      "pageType": "string",
      "passRequired": "string",
      "password": "string",
      "pass_expiry_period": "string",
      "author": "string",
      "preview_As": "string",
      "store_Id": 0,
      "slug": "string",
      "topic_Title": "string",
      "meta_Description": "string",
      "meta_Keywords": "string",
      "template_Id": 0,
      "head_Html": "string",
      "footer_Html": "string",
      "canonical_Url": "string",
      "publish_Duration": "string",
      "publish_Date": null,
      "publish_Time": null,
      "unpublish_Date": null,
      "unpublish_Time": null,
      "schedule_Unpublish": "string",
      "redirect_Page_Id": "string",
      "created_By": "string",
      "updated_By": "string",
      "status": "string",
      "created_At": null,
      "updated_At": null,
      "isHomePage": "string",
      "page_Id": id,
      "menu_Type": "string"
    };

    TopicsDetailsServices.publishPage(topicObj)
      .then((res) => {
        let topicObj = {
            "id": 0,
            "page_Id": id
        }
        TopicsDetailsServices.publishTopicComponents(topicObj).then((res) => {
             alert(ValidationMsgs.topic.publishSuccess);
            xy.style.display = "none";
            setDisplayPublish(false);
        }).catch((error) => {
            alert(ValidationMsgs.topic.publishError);
            xy.style.display = "none";

        });  

      }).catch((error) => {
        alert(ValidationMsgs.topic.publishError);
        xy.style.display = "none";

      });
  }

  return (
    <>
    
    {loadCSS && <Helmet>
          <link
            rel="stylesheet"
            type="text/css"
            href={`${process.env.REACT_APP_API_BLOB}/${process.env.REACT_APP_BLOB_CONTAINER}/${1}/store/${
              storeId}/css/${storeId}.css`}
          />
          {/* <link
            rel="stylesheet"
            type="text/css"
            href={`../../../../../assets/css/tailwind/front/output.css`}
          /> */}
        </Helmet>
      }
      <DragDropContext
        onDragEnd={result => onDragEnd(result)}
      >
        <div className="flex py-3 p-4 justify-between items-center bg-slate-800 sticky inset-0 bottom-auto z-60">
          <div className="flex items-center flex-wrap">
            <div className="relative inline-flex">
              <Link to={`/admin/Content/${getPageType()}`} className="flex flex-wrap btn-sm px-4 py-[5px] bg-white hover:bg-indigo-500 text-indigo-500 hover:text-white mr-2">Exit</Link>

              <a href="javascript:void(0);" className="px-4 py-[5px] btn-sm bg-indigo-500 hover:bg-indigo-600 text-white mr-2" onClick={saveData}>Save</a>
            </div>
          </div>
          {(getPageType() == "Page" && displayPublish) && <><div >
            <a href="javascript:void(0);" className="px-4 py-[5px] btn-sm bg-indigo-500 hover:bg-indigo-600 text-white ml-2" onClick={publishPage}>Publish</a>
          </div>
          </>}

        </div>

        <div className="flex justify-between border-solid border-b-gray-100 w-full">
          <div className="w-full">

            {getPageType() == "Page" && <>
              <PageEditTabHeader activeTab={1} />
            </>
            }


            <div className="flex flex-wrap mb-6 relative">

              {/* Left Side Panel Code Starts */}
              <div className={`fixed transition-all bg-slate-100 
                  shadow-lg z-40 flex max-h-screen overflow-y-auto flex-col bottom-0 top-[110px]`} id="left" style={{ width: '380px' }}>
                <LeftSideBar {...allFunctions} />
              </div>

              {/* Left Side Panel code Ends */}

              { /* Content Part code Starts */}
              <div id="right" className="transition-all relative grow" style={{ marginLeft: '380px' }}>
                {getPageType() == "Template" && <>
                  <div className="inset-0 h-14 w-full collapse collapse-horizontal relative z-20">
                    <div className="block p-2 shadow-lg bg-white">
                      <div className="flex flex-wrap sm:auto-cols-max justify-start sm:justify-end gap-2">
                        <div className="flex">
                          <a href={`/admin/Content/${getPageType()}`} target="_blank" className="btn-xs border-indigo-300 hover:border-indigo-400 text-indigo-500 ml-2"><span class="text-sm">Preview</span></a>

                        </div>
                      </div>
                    </div>
                  </div>
                </>
                }

                <div className='p-6 relative z-10'>
                  <div className="border border-dashed border-neutral-200 mx-auto">

                    <div id="desktop_phone_view" className="w-full min-h-screen mx-auto">
                      <div className="font-inter antialiased bg-slate-100 text-gray-500">


                        <div className='border border-dashed border-neutral-200 mx-auto'>
                          <div className="font-inter antialiased bg-slate-100 text-gray-500">
                            <div className="p-4">

                              <TemplateHeader />
                              <main>
                                <div className='p-5 brder border-dotted border-gray-500 h-full overflow-y-scroll'>
                                  <Droppable droppableId='1100' key='1100'>
                                    {(provided, snapshot) => {
                                      return (
                                        <>
                                          <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className='p-8 relative border h-full overflow-y-scroll'
                                          >
                                            {componentHtml.length > 0 ?
                                              componentHtml.map((componentValue, index) => {
                                                return (
                                                  <>
                                                    <Draggable key={componentValue.uid} draggableId={componentValue.uid} index={index}>
                                                      {(provided, snapshot) => {
                                                        const backgroundDefault = loadBackgroundDefault(componentValue);
                                                        let additionalclass = "";
                                                        //console.log(componentValue.properties);
                                                        if(componentValue.selected_Values && "additionalclass" in componentValue.selected_Values)
                                                        {
                                                            additionalclass = componentValue.selected_Values.additionalclass.value;                                                          
                                                        }
                                                        //console.log(componentValue.uid);
                                                        return (


                                                          <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}>
                                                            <div className={`pb-5 mb-5 flex flex-wrap items-center -mx-4 relative border-solid ${componentValue.visibility == "off" ? "hidden" : ""} ${currentComponent === componentValue.uid ? "border border-red-500" : "border"} ${additionalclass}`} ref={ref => {
                                                              refArray.current[componentValue.uid] = ref; // took this from your guide's example.
                                                            }}

                                                              onClick={() => selectCurrentComponent(componentValue.uid)} style={{ background: backgroundDefault }} id={`div${componentValue.no}`}
                                                            >
                                                              <div className={`p-5 pt-10 w-full `}>
                                                                {currentComponent === componentValue.uid && <>

                                                                  <Toolbar property={allFunctions} uid={componentValue.uid} no={componentValue.no} />
                                                                </>}

                                                                <div dangerouslySetInnerHTML={{ __html: componentValue.html }}></div>


                                                              </div>
                                                            </div>


                                                          </div>

                                                        )
                                                      }}
                                                    </Draggable>

                                                  </>

                                                )

                                                // return <div key={index} className="text-center p-5 border my-2" dangerouslySetInnerHTML={{ __html: comphtml }}></div>
                                              }) : <>
                                                <div class="text-center p-5 border my-2"><section classname="mainsection taillwind_content_block_22">
                                                  Drop Component Here
                                                </section></div></>
                                            }
                                            {provided.placeholder}
                                          </div>

                                        </>
                                      );
                                    }}
                                  </Droppable>


                                </div>
                              </main>
                              <TemplateFooter />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              { /* Content Part Code Ends */}
            </div>


          </div>
        </div>

      </DragDropContext>

      <div id="wrapperloading" style={{ "position": "fixed", "z-index": "10000000", "display": "none" }}>
        <div id="loading">
          <img src={LoaderImage} /> <br /> Please Wait ...
        </div>
      </div>



    </>
  );
};

export default Create;
