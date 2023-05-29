/*Component Name: ElementBackground
Component Functional Details: Element for Component ElementBackground  
Created By: Vikas Patel
Created Date: 07/07/2022
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Input from 'components/admin/content/common/Input';
import { useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import DropdownService from "services/common/dropdown/DropdownService";
import Dropdown from "components/common/formComponent/Dropdown";
import Select from 'react-select';
import FeaturedImage from "assets/images/product-image-1.jpg";

const ElmentFeaturedProducts = (props) => {
    const [sectionTitle, setSectionTitle] = useState("");
    const [productsToDisplay, setProductsToDisplay] = useState("featured");
    const [productCount, setProductCount] = useState(4);
    const [brandWiseDisplay, setBrandWiseDisplay] = useState("No");
    const [scrollableSection, setScrollableSection] = useState("No");
    const [brands, setBrands] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);

    const [showHide, setShowHide] = useState(false);
    const [iconStyle, setIconStyle] = useState('caret');
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
    };

   

    const selectedObj = props.componentHtml.filter(obj => obj.uid == props.currentComponent);
  


    let attributes = {};

    const bgPropertyName = props.variable;//selectedObj.length > 0 ? Object.keys(selectedObj[0].properties).find(key => selectedObj[0].properties[key] === "background") : [];

    /* When click on any component background component will reload and
    we have called function to set default properties */

    useEffect(() => {

        DropdownService.getDropdownValues("storebrand", true, props.storeId).then((res) => {
           // console.log(res);
            if (res.data.success) {
              //  console.log(res.data.data);
              setBrands(() => {
                return res.data.data;
              });
             
            }
          });
    }, [])
  

    useEffect(() => {
        props.updateProperty({ type: "fp_section_title", value: sectionTitle }, bgPropertyName+"_section_title");
        props.updateProperty({ type: "fp_brandwise_display", value: brandWiseDisplay }, bgPropertyName+"_brandwise_display");
        props.updateProperty({ type: "fp_product_scrollable", value: scrollableSection }, bgPropertyName+"_scrollable_section");
        props.updateProperty({ type: "fp_product_count", value: productCount }, bgPropertyName+"_product_count");
        props.updateProperty({ type: "fp_product_display_type", value: productsToDisplay }, bgPropertyName+"_product_to_display");

        /* Here when change component,values are not retiNING */
        if (selectedObj.length > 0) {
            let tmpSectionTitle;
            let tmpBrandwiseDisplay;
            let tmpScrollable;
            let tmpProductCount;
            let tmpProductDisplay;
            let tmpSelectedBrands;
            Object.entries(selectedObj[0].selected_Values).map(([key, value]) => {
                

                if (key == bgPropertyName+"_section_title") {
                    tmpSectionTitle = value;
                }
                if (key == bgPropertyName+"_brandwise_display") {
                    tmpBrandwiseDisplay = value;
                }
                if (key == bgPropertyName+"_scrollable_section") {
                    tmpScrollable = value;
                }
                if (key == bgPropertyName+"_product_count") {
                    tmpProductCount = value;
                }
                if (key == bgPropertyName+"_product_to_display") {
                    tmpProductDisplay = value;
                }
                if (key == bgPropertyName+"_selected_brands") {
                    tmpSelectedBrands = value;
                }
            });


            if (tmpSectionTitle != undefined) {
                let attributes = tmpSectionTitle;
                setSectionTitle(attributes.value);
            }

            if (tmpBrandwiseDisplay != undefined) {
                let attributes = tmpBrandwiseDisplay;
                setBrandWiseDisplay(attributes.value);
            }

            if (tmpScrollable != undefined) {
                let attributes = tmpScrollable;
                setScrollableSection(attributes.value);
            }

            if (tmpSelectedBrands != undefined) {
                let attributes = tmpSelectedBrands;
                setSelectedBrands(attributes.value);
                brandHTMLDisplay(attributes.value);
            }
            
            if (tmpProductDisplay != undefined) {
                let attributes = tmpProductDisplay;
                setProductsToDisplay(attributes.value);
                productDisplayCount(attributes.value);
            }
        }
    }, [props.currentComponent]);

   

    

    const updateSectionTitle = (event) => {
        let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
        x.querySelectorAll('#sectionTitle')[0].innerHTML = event.target.value;
        props.updateProperty({ type: "fp_section_title", value: event.target.value }, bgPropertyName+"_section_title");
        setSectionTitle(event.target.value);
    }

    const changeBrandWiseDisplay = (val) => {
        let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
        props.updateProperty({ type: "fp_brandwise_display", value: val }, bgPropertyName+"_brandwise_display");
        if(val === "Yes")
        {
            brandHTMLDisplay(selectedBrands);
        }
        else
        {
            x.querySelectorAll("#brandsDisplay")[0].innerHTML = "";
        }
        setBrandWiseDisplay(val);
    }

    const changeScrollableSection = (val) => {
        props.updateProperty({ type: "fp_product_scrollable", value: val }, bgPropertyName+"_scrollable_section");
        setScrollableSection(val);
    }

    const updateProductCount = (event) => {
        props.updateProperty({ type: "fp_product_count", value: event.target.value }, bgPropertyName+"_product_count");
        setProductCount(event.target.value);
        productDisplayCount(event.target.value);
    }

    const changeProductsToDisplay = (val) => {
        props.updateProperty({ type: "fp_product_display_type", value: val }, bgPropertyName+"_product_to_display");
        setProductsToDisplay(val);
    }

    const productDisplayCount = (displayCount) => {
        let tmp = "";
        for (let i = 0; i < displayCount; i++) {
            tmp += "<div class='pr-5'><img src='"+FeaturedImage+"' width='250'></div>";
        }
        let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
        x.querySelectorAll("#productsDisplay")[0].innerHTML = tmp;
    }

    const brandHTMLDisplay = (value) => {
        let x = ReactDOM.findDOMNode(props.refArray.current[props.currentComponent]);
        let tmp = "";
        value.forEach((el) => {
            tmp += "<li class='mr-0.5 md:mr-0 font-semibold'><a href='javacsript:void(0)' class='tab py-2 mr-1 px-2 block hover:text-primary text-primary focus:outline-none text-default-text border-b-2 font-medium border-primary'>"+el.label + "</a></li>";
        });
        x.querySelectorAll("#brandsDisplay")[0].innerHTML = tmp;
    }

    const changeSelectedBrands = (selected) => {
        setSelectedBrands(selected);
        props.updateProperty({ type: "fp_selected_brands", value: selected }, bgPropertyName+"_selected_brands");
        brandHTMLDisplay(selected);   
    };


    
    
    return (
        <>

<div className="relative border-b border-neutral-00">
                <button onClick={() => { showHideProperties() }}
                    className="flex w-full flex-wrap justify-between items-center text-sm px-3 py-4 bg-white border-0 font-bold">
                    <span >{props.compprop.title ?? "Element Configuration"}</span>
                    <span className="material-icons-outlined">expand_more</span>
                </button>

                <div className={`property-content bg-white border-y border-b-0 border-neutral-200 ${showHide ? "" : "hidden"}`}>
                    <div class="mx-2 text-sm">
                        <div class="py-2">
                            <div className="mb-3">
                                <div className="flex justify-between items-center mb-1">
                                    <div>Section Title</div>
                                </div>
                                <div class="text-center relative overflow-hidden">
                                    <input type="text" className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-3 py-2 leading-tight focus:outline-none focus:bg-white" defaultValue={sectionTitle} onChange={updateSectionTitle} />

                                </div>
                            </div>

                            <div className="mb-4 last:mb-0">
                                <label htmlFor="" className="mb-1 block text-sm">Products to Display</label>
                                <div className="flex flex-wrap">
                                    <select value={productsToDisplay} onChange={(event) => { changeProductsToDisplay(event.target.value) }} className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                        <option value="featured">Featured Products</option>
                                        <option value="bestseller">Best Sellers</option>
                                        <option valuee="newarrival">New Arrivals</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="flex justify-between items-center mb-1">
                                    <div>Number of Products to Display</div>
                                </div>
                                <div class="text-center relative overflow-hidden">
                                    <input type="text" className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-3 py-2 leading-tight focus:outline-none focus:bg-white" defaultValue={productCount} onChange={updateProductCount} />
                                </div>
                            </div>
                            
                            <div className="mb-4 last:mb-0">
                                <label htmlFor="" className="mb-1 block text-sm">Brandwise Display</label>
                                <div className="flex flex-wrap">
                                    <select value={brandWiseDisplay} onChange={(event) => { changeBrandWiseDisplay(event.target.value) }} className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                            </div>
                            {brandWiseDisplay == "Yes" && 
                                <>
                                <div className="mb-4 last:mb-0">
                                    <label htmlFor="" className="mb-1 block text-sm">Select Brands</label>
                                    <div className="flex flex-wrap">
                                    <Select defaultValue={selectedBrands} options={brands} isMulti={true} isSearchable={true} onChange={changeSelectedBrands} name="selectedBrands" className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md" />
                                    </div>
                                </div>
                                
                                </>
                            } 

                            <div className="mb-4 last:mb-0 hidden">
                                <label htmlFor="" className="mb-1 block text-sm">Scrollable Section</label>
                                <div className="flex flex-wrap">
                                    <select value={scrollableSection} onChange={(event) => { changeScrollableSection(event.target.value) }} className="grow h-9 px-2 py-1 text-sm bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                            </div>
                            

                        </div>
                    </div>

                </div>

            </div>
        </>
    );
};

export default ElmentFeaturedProducts;
