import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";

import PageEditTabHeader from '../PageEditTabHeader'
import PageEditMainHeader from '../PageEditMainHeader'
import TopicsDetailsServices from 'services/admin/topics/TopicsDetailsServices'
import LeftBar from './LeftBar';

import LoaderImage from "assets/images/loading.gif"
import * as helper from "components/admin/content/helper/Helper";
import ElementCarouselDisplay from "components/admin/content/template/create/elements/ElementCarouselDisplay";
import ElementAccordionDisplay from "components/admin/content/template/create/elements/ElementAccordionDisplay";

const Optimize = () => {
    const [seoScore, setSeoScore] = useState(0);
    const { id } = useParams();
    const [componentHtml, setComponentHtml] = useState([]);
    const [originalText, setOriginalText] = useState("");
    const [loadComplete, setLoadComplete] = useState(false);

    useEffect(() => {
        if (document.readyState === "complete") {
            let x = document.getElementById("right1");
            if (originalText == "") {
                setOriginalText(x.innerHTML);
                setLoadComplete(true);
            }
        }
    });


    useEffect(() => {
        TopicsDetailsServices.getPublishTopicComponent(id, 'preview')
            .then((res) => {
                if (res.data != null)
                    setComponentHtml(res.data);
            }).catch((error) => {
            }
            );
    }
    );

    const loadBackgroundDefault = (element) => {
        if (element.selected_Values != undefined) {
            if (Object.keys(element.selected_Values).length > 0) {
                const bgPropertyName = Object.keys(element.properties).find(key => element.properties[key] === "background");
                const attributes = Object.entries(element.selected_Values).map(([key, value]) => {
                    if (key == bgPropertyName)
                        return value;
                })[0];

                if (attributes != undefined && Object.keys(attributes).length > 0) {

                    if (attributes.type == "color") {
                        return attributes.value;
                    }
                    else if (attributes.type == "image") {
                        return 'url("' + attributes.value + '")';
                    }
                    else if (attributes.type == "none") {
                        return 'none';
                    }
                }
            }
            return 'none';
        }
        return 'none';

    };

    useEffect(() => {

        componentHtml.map((element, index) => {
            helper.updateSetProperties(element, index);
        });
    }
        , [componentHtml]);

    const allFunctions = {
        seoScore: seoScore,
        setSeoScore: setSeoScore,
        // searchKeywords: searchKeywords,
        // setSearchKeywords: setSearchKeywords,
        originalText: originalText,
        loadComplete: loadComplete
    };

    return (
        <>

            <div className="bg-white">
                <PageEditMainHeader />
                <PageEditTabHeader activeTab={3} />
                <div className="panel-01 tab-content">
                    <div className="flex flex-wrap mb-6 relative">
                        <div id="left1" className='absolute transition-all h-screen bg-slate-100 overflow-x-hidden shadow-lg' style={{ width: "350px" }}>
                            <LeftBar {...allFunctions} />
                        </div>
                        <div id="right1" className="transition-all relative ml-380">
                            <div className="p-6">
                                <div className='border border-dashed border-neutral-200'>
                                    <div className='p-4'>
                                        {componentHtml.length > 0 ?
                                            componentHtml.map((componentValue, index) => {
                                                const backgroundDefault = loadBackgroundDefault(componentValue);
                                                return (
                                                    <section className={`mainsection container mx-auto mt-20 ${componentValue.visibility == "off" ? "hidden" : ""}`} style={{ background: backgroundDefault }} id={`div${componentValue.no}`}>

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
                                                                        <div className={`text-center p-5 pt-10 border w-full`}>
                                                                            <div dangerouslySetInnerHTML={{ __html: componentValue.html }}></div>
                                                                        </div>
                                                                    </>
                                                                }
                                                            </>
                                                        }
                                                    </section>

                                                )

                                                // return <div key={index} className="text-center p-5 border my-2" dangerouslySetInnerHTML={{ __html: comphtml }}></div>
                                            }) : <>
                                                <div class="text-center p-5 border my-2"><section classname="mainsection taillwind_content_block_22">
                                                    Drop Component Here
                                                </section></div></>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
            <div id="wrapperloading" style={{ "position": "fixed", "z-index": "10000000", "display": "none" }}>
                <div id="loading">
                    <img src={LoaderImage} /> <br /> Please Wait ...
                </div>
            </div>

            {/* {searchKeywords.length > 0 && 
                <Highlighter
                caseSensitive={false} 
                highlightClassName={styles.Highlight}
                highlightStyle={{ fontWeight: 'normal' }}
                searchWords={searchKeywords}
                textToHighlight={textToHighlight}
            />
          } */}
        </>
    )
}

export default Optimize