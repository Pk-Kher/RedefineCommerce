/*Component Name: ElementCarousel
Component Functional Details: Element for Component ElementCarousel  
Created By: Vikas Patel
Created Date: 17th September 2022
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useState } from 'react';

import { Carousel  } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.css'

const ElementCarouselDisplay = ({bannerArr}) => {
    const showArrow = (bannerArr.showArrow != undefined ? (bannerArr.showArrow == "On" ? true : false) : true);    
    const showIndicators = (bannerArr.showIndicators != undefined ? (bannerArr.showIndicators == "On" ? true : false) : true);    
    const showThumb = (bannerArr.showThumb != undefined ? (bannerArr.showThumb == "On" ? true : false) : true);    
    const autoPlay = (bannerArr.autoPlay != undefined ? (bannerArr.autoPlay == "On" ? true : false) : true);    
    const infiniteLoop = (bannerArr.infiniteLoop != undefined ? (bannerArr.infiniteLoop == "On" ? true : false) : true);    
    const stopOnHover = (bannerArr.stopOnHover != undefined ? (bannerArr.stopOnHover == "On" ? true : false) : true);   
    const showStatus = (bannerArr.showStatus != undefined ? (bannerArr.showStatus == "On" ? true : false) : true);   

    return ( 
        <>
        
        {(Object.keys(bannerArr).length > 0 && bannerArr.images != null) && 
            <Carousel showStatus={showStatus} stopOnHover={stopOnHover} infiniteLoop={infiniteLoop} autoPlay={autoPlay} showArrows={showArrow} showIndicators={showIndicators} showThumbs={showThumb} >
                {bannerArr.images.map((image) => {
                        return (<div>
                            {image.image_or_video == "Image" ?
                                <img src={image.image_url} />
                                :
                                <>
                                {image.video_type == "Youtube" ? 
                                    <iframe class="w-full aspect-video" src={`https://www.youtube.com/embed/${image.video_url}?rel=0`} allow="autoplay; encrypted-media" frameborder="0"></iframe>
                                :
                                    <iframe class="w-full aspect-video" src={`https://player.vimeo.com/video/${image.video_url}`} allow="autoplay; encrypted-media" frameborder="0"></iframe>
                                }
                                </>
                            }
                               {// justify-start justify-end justify-center 
                               }
                            <div className={`flex items-center absolute ${image.headline_font_size} inset-0 p-1 lg:p-4 justify-${image.text_pos ? image.text_pos : "center"} text-white`}>
                            <div class="" style={{ background: `rgb(${image.text_bg_color}, ${image.bg_opacity})`, padding: "20px"}}>
                                <div class="">{image.headline}</div>
                                <div class="">{image.headline1}</div>
                                {image.button_display == "Yes" && <>
                                    <div><a href={image.button_link} target={image.button_link_window ? "_blank" : ""} className={`btn ${image.button_text_transform} ${image.button_size} ${image.button_style}`}>{image.button_text}</a></div>
                                </>
                                }
                            </div>

                            </div>
                        </div>
                        )    
                    }

                )}
            </Carousel>
        }
        
           
        </>
    );
};

export default ElementCarouselDisplay;
