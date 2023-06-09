export const numberdescriptionblock = (dataArr, selectedObj) => {
    let strHTML = "";
    if(dataArr.length > 0) {
        let cnt = 1;
        dataArr.forEach(function (item) {


            strHTML += '<div class="w-full lg:w-1/3 px-4 mb-8">';
            strHTML += '<div class="g-gray-50 text-center p-6 rounded" style="'+ (item.BlockBg ? "background: "+item.BlockBg+";" : "") + '">';
            strHTML += '<div class="inset-x-0 -mt-6 flex justify-center items-center w-12 h-12 mx-auto rounded-full bg-gray-500 text-gray-50 font-bold font-heading">';
            if(item.ImageNumber === "Number")
                strHTML += cnt;
            else
                strHTML += "<img src='"+item.ImageNumber_image+"' />";
            cnt++;
            strHTML += '</div>';
            strHTML += '<div class="text-box-h4 mt-4">'+item.Headline+'</div>'
            strHTML += '<div class="text-box-h4 mt-4">';
            strHTML += item.Description
            strHTML += '</div>';
            strHTML += '</div>';
            strHTML += '</div>';

        });
    }

    
    return strHTML;
}

export const boximage = (dataArr, selectedObj) => {
   
    let strHTML = "";
    if(dataArr.length > 0)
    {
        let count = 1;
        dataArr.forEach(function (item) {
            let className;
            if(item.colcount == 2)
                className = "lg:w-1/2";
            else if(item.colcount == 3)
                className = "lg:w-1/3";
            else   
                className = "lg:w-1/4";
            strHTML += '<div class="w-full '+className+' px-3 md:w-1/3 mt-6">';
            if(window.location.href.indexOf("/preview/") < 0)
            {
                strHTML += '<div class="flex justify-center pb-5">';
                strHTML += '<div class="btn-primary rounded-full w-10 h-10 flex justify-center items-center text-base text-white font-semibold">'+count+'</div>';
                strHTML += '</div>';
            }
            count = count + 1;
    
            strHTML += '<div class="border border-gray-50 px-2 py-2">';
            //flex relative w-full text-white
            let clName = 'flex justify-center';
            let aprData = {};
            let textPos = "bottom";
            let headLine = '';
            let textBg = 'text-center bg-white w-full';

            let fontSize = "text-base";
            let bgOpacity = 1;
            let bgColor = "";

            var buttonHTML = '';
            if(item.Button_display != undefined && item.Button_display == "Yes" && item.Button_text != "" && item.Button_text != null)
            {
              
                buttonHTML += '<div class="mt-5 mb-5">';
                buttonHTML += '<a target="" href="'+item.Button_link+'" class="'+item.Button_size+' '+item.Button_style+'">';
                buttonHTML += item.Button_text;
                buttonHTML += '</a>'
                buttonHTML += '</div>';
            }

            //flex items-center absolute text-3xl inset-0 p-1 lg:p-4 text-white justify-center
            if(selectedObj.selected_Values.TextAppearance != undefined)
            {
                aprData = selectedObj.selected_Values.TextAppearance.value;
                if(aprData.text_pos != undefined)
                {
                    textPos  = aprData.text_pos;
                    fontSize = aprData.font_size;
                    bgOpacity = aprData.bg_opacity;
                    bgColor = aprData.text_bg_color;
                    
                }

            }

            
            if(item.Headline !== undefined && item.Headline !== "" && item.Headline !== null)
            {
                if(textPos != "top" && textPos != "bottom")
                {
                    clName = "flex relative w-full text-white";
                    headLine += '<div class="flex items-center absolute '+fontSize+' inset-0 p-1 lg:p-4 text-white justify-center">';
					headLine += '<div class="" style="background: rgba('+bgColor+','+bgOpacity+'); padding: 20px;">';
					headLine += '<div class="pb-2">'+item.Headline+'</div>';
					headLine += '<div>';
					headLine += buttonHTML;
					headLine += '</div>';
					headLine += '</div>';
				    headLine += '</div>';
                }
                else
                {
                    headLine += '<div class="text-center bg-white w-full">';
                    headLine += '<div class="text-base p-4">'+item.Headline+'</div>';
                    headLine += '</div>';
                }
                
            }

            if(textPos == "top")
            {
                strHTML += headLine;
            }
            
            if(item.Image !== undefined)
            {
                strHTML += '<div class="'+clName+'">';
                strHTML += '<a title="'+item.Image_link+'">';
                strHTML += '<img class="w-full" src="'+item.Image+'"/>';
                strHTML += '</a>';
                if(textPos != "top" && textPos != "bottom")
                {
                    strHTML += headLine;
                }
                strHTML += '</div>';
            }



            if(textPos == "bottom")
            {
                strHTML += headLine;
            }
            if(textPos == "top" || textPos == "bottom")
            {
                strHTML += buttonHTML;
            }
            strHTML += '</div>';
            strHTML += '</div>';
            
        }
        );
    };

    return strHTML;
    // <div class="w-full lg:w-1/4 px-3 md:w-1/3 mt-6 isinput">
    //   <div class="border border-gray-50 px-2 py-2">
    //     <div class="flex justify-center">
    //       Image
    //     </div>
    //     <div class="text-center bg-white w-full">
    //       <div class="text-base p-4">Headline</div>
    //       <div class="mb-5">
    //         Button
    //       </div>
    //     </div>
    //   </div>
    // </div>
};

export const numberingdiv = (dataArr, selectedObj) => {
    let strHTML = "";
    if(dataArr.length > 0)
    {
      let count = 1;
        dataArr.forEach(function (item) {
            strHTML += '<div class="flex items-start mb-6">';
            strHTML += '<div class="mr-10 flex-shrink-0 flex justify-center items-center w-12 h-12 rounded-full bg-gray-500 text-gray-50 font-bold font-heading">'+count+'</div>'; 
            strHTML += '<div class="max-w-xs">';
            strHTML += '<div class="text-box-p leading-loose">';
            strHTML += item.Description;
            strHTML += '</div>';
            strHTML += '</div>';
            strHTML += '</div>';
        })
    }
    return strHTML;
};

export const multipleImages = (dataArr, selectedObj) => {
   
  let strHTML = "";
  if(dataArr.length > 0)
  {
        let cnt = 1;
      dataArr.forEach(function (item) {
        let textPos  = "";
        let fontSize = "";
        let bgOpacity = "";
        let bgColor = "";
        let headLine = "";
        let clName = "";
        let aprData = {};
        let buttonHTML = "";


        if(item.Button_display != undefined && item.Button_display == "Yes" && item.Button_text !== "" && item.Button_text !== null)
        {
          
            buttonHTML = '<div class="mt-5 mb-5">';
            buttonHTML += '<a target="" href="'+item.Button_link+'" class="'+item.Button_size+' '+item.Button_style+'">';
            buttonHTML += item.Button_text;
            buttonHTML += '</a>'
            buttonHTML += '</div>';
        }
        
        if(selectedObj.selected_Values.TextAppearance != undefined)
            {
                aprData = selectedObj.selected_Values.TextAppearance.value;
                if(aprData.text_pos != undefined)
                {
                    textPos  = aprData.text_pos;
                    fontSize = item.font_size;
                    bgOpacity = aprData.bg_opacity;
                    bgColor = aprData.text_bg_color;
                    
                }

            }

          if(item.Headline != undefined && item.Headline != "" && item.Headline != null)
          {

                if(textPos != "top" && textPos != "bottom" && textPos != "")
                {
                    clName = "flex relative w-full text-white";
                    headLine += '<div class="flex items-center absolute '+fontSize+' inset-0 p-1 lg:p-4 text-white justify-center">';
                    headLine += '<div class="" style="background: rgba('+bgColor+','+bgOpacity+'); padding: 20px;">';
                    headLine += '<div class="pb-2">'+item.Headline+'</div>';
                    headLine += '<div>';
                    headLine += buttonHTML;
                    headLine += '</div>';
                    headLine += '</div>';
                    headLine += '</div>';
                }
                else
                {
                    headLine += '<div class="text-center bg-white w-full">';
                    headLine += '<div class="text-base p-4">'+item.Headline+'</div>';
                    headLine += '</div>';
                }
        }
                

          strHTML += '<div class="w-full lg:w-1/3 px-3">';
          if(window.location.href.indexOf("/preview/") < 0)
          {
            strHTML += '<div class="flex justify-center pb-5">';
            strHTML += '<div class="btn-primary rounded-full w-10 h-10 flex justify-center items-center text-base text-white font-semibold">'+cnt+'</div>';
            strHTML += '</div>';
          }
          cnt = cnt + 1;
          strHTML += '<div class="border border-gray-50 px-2 py-2">';

          if(textPos === "top")
          {
            strHTML += headLine;
          }

          if(item.Image !== undefined)
          {
            strHTML += '<div class="'+clName+'">';
            strHTML += '<div class="flex justify-center">';
            strHTML += '<a title="'+item.Image_link+'">';
            strHTML += '<img class="w-full" src="'+item.Image+'"/>';
            strHTML += '</a>';
            strHTML += '</div>';
            if(textPos === "center")
            {
                strHTML += headLine;
            }
            strHTML += '</div>';
          }

          if(textPos === "bottom")
          {
            strHTML += headLine;
          }

          if(textPos === "top" || textPos === "bottom")
          {
            strHTML += buttonHTML;
          }
          


        //   if(item.Headline != undefined && item.Headline != "" && item.Headline != null)
        //   {
        //       strHTML += '<div class="text-center bg-white w-full">';
        //       strHTML += '<div class="text-base p-4">'+item.Headline+'</div>';
        //       strHTML += '</div>';
        //   }
         
  
          // <div class="mb-5">
          //         <a title="" target="" href="javascript:void(0);" inpname="first_btn" inplnname="first_btn_link" inpclname="first_btn_cls" class="px-6 py-3 text-green-700 font-semibold uppercase bg-neutral-900 hover:bg-gray-600 hrefurl isinput changebtn" data-nofollow="N" contenteditable="true">
          //           lorem impluse
          //         </a>
          //       </div>
          strHTML += '</div>';
          strHTML += '</div>';
          
      }
      );
  };

  return strHTML;
  // <div class="w-full lg:w-1/4 px-3 md:w-1/3 mt-6 isinput">
  //   <div class="border border-gray-50 px-2 py-2">
  //     <div class="flex justify-center">
  //       Image
  //     </div>
  //     <div class="text-center bg-white w-full">
  //       <div class="text-base p-4">Headline</div>
  //       <div class="mb-5">
  //         Button
  //       </div>
  //     </div>
  //   </div>
  // </div>
};