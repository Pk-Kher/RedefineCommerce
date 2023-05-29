import React, { useState, useEffect, useCallback } from 'react'

const Keywords = (props) => {

    const [showHide, setShowHide] = useState(false);
    const showHideProperties = () => {
        if(showHide == true)
            setShowHide(false);
        else
        {
            const allWithClass = Array.from(
                document.querySelectorAll('div.property-content')
              );
              allWithClass.forEach(element => {
                element.classList.add("hidden");
              });
          
          
           
            setShowHide(true);

        }
    };

    const countKeywords = (keyword) => {
        let x = document.getElementById("right1");
        let count = 0;
        count = x.textContent.split(keyword).length-1;

        if(count < 0)
            count = 0;
//        alert(count);
        return count;
        
    };

    const [focusKeywords, setFocusKeywords] = useState([]);
    const [focusStr, setFocusStr] = useState("");
    const [focusKeywordsSynonym, setFocusKeywordsSynonym] = useState([]);
    const [focusSynStr, setFocusSynStr] = useState("");
    const [relatedKeywords, setRelatedKeywords] = useState([]);
    const [relatedStr, setRelatedStr] = useState("");
    const [totalCount, setTotalCount] = useState(0);

    const addKeyword = (type) => {
        if(type == "focus")
        {
            if(!focusKeywords.includes(focusStr))
            {
                setFocusKeywords((previous) => [...previous, focusStr]);
            }
            setFocusStr("");
        }
        if(type == "focussyn")
        {
            if(!focusKeywordsSynonym.includes(focusSynStr))
            {
                setFocusKeywordsSynonym((previous) => [...previous, focusSynStr]);
            }
            setFocusSynStr("");
        }
        if(type == "relatedstr")
        {
            if(!relatedKeywords.includes(relatedStr))
            {
                setRelatedKeywords((previous) => [...previous, relatedStr]);
            }
            setRelatedStr("");
        }
    };

    const setText = (type, text) => {
        if(type == "focus")
        {
            setFocusStr(text);
        }
        if(type == "focussyn")
        {
            setFocusSynStr(text);
        }
        if(type == "relatedstr")
        {
            setRelatedStr(text);
        }

    };

    const editKeyword = (type, keyword) => {
        if(type == "focus")
        {
            let tmpArr = focusKeywords.filter(function(str) {
                return str !== keyword; 
            })
            setFocusKeywords(tmpArr);
            setFocusStr(keyword);
        }
        if(type == "focussyn")
        {
            let tmpArr = focusKeywordsSynonym.filter(function(str) {
                return str !== keyword; 
            })
            setFocusKeywordsSynonym(tmpArr);
            setFocusSynStr(keyword);
        }
        if(type == "relatedstr")
        {
            let tmpArr = relatedKeywords.filter(function(str) {
                return str !== keyword; 
            })
            setRelatedKeywords(tmpArr);
            setRelatedStr(keyword);
        }
    };

    const getHighlightedText = (keyword) => {
        let x = document.getElementById("right1");
        x.innerHTML = props.originalText;
        //console.log(props.originalText);

      
        //console.log(x.innerHTML);
        let text = x.innerHTML.replaceAll(new RegExp(escapeRegExp(keyword), 'g'), '<span class="Highlight">'+keyword+'</span>');
        x.innerHTML = text;
       
   }

    const escapeRegExp = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
      };

    useEffect(() => {
        let count = 0;
        focusKeywords.map((keyword) => {
            if(countKeywords(keyword) > 0)
            {
                count++;
            }
        });
        focusKeywordsSynonym.map((keyword) => {
            if(countKeywords(keyword) > 0)
            {
                count++;
            }
        });
        relatedKeywords.map((keyword) => {
            if(countKeywords(keyword) > 0)
            {
                count++;
            }
        });
        setTotalCount(count);
    }, [focusKeywordsSynonym, focusKeywords, relatedKeywords])

    return (
        <>
           <div className="relative bg-white mb-4">
                <button onClick={ () => { showHideProperties()  } } className="flex w-full flex-wrap justify-between items-center text-sm px-3 py-4 bg-white border-0 font-medium">
                <span className="ml-1 font-bold">Keywords</span> 
                    <span className="flex">
                        <span className="text-xs inline-flex font-bold border border-yellow-300 bg-yellow-100 text-black-600 rounded-full text-center px-4 py-1 ml-3">
                            {totalCount}/{focusKeywords.length+focusKeywordsSynonym.length}
                        </span>
                        <span className="material-icons-outlined ml-3 pointer-class">{showHide ? "keyboard_arrow_down" : "keyboard_arrow_up"}</span>
                    </span>
                </button>

                <div className={`bg-white border-y border-b-0 border-neutral-200 overflow-hidden ${showHide ? "" : "hidden"}`}>
                    <div className='bg-white px-4 py-4'>
                        { /* Focus Keyword */}
                        <div className='text-xs mb-4'>
                            Click keyword below to highlight in content.
                        </div>
                        <div>
                            <div className='flex mb-2'>
                                <span className='leading-6 text-sm font-bold'>Focus Keyword</span>
                            </div>  
                            <div className='flex flex-wrap w-full text-xs mb-2'>
                                {focusKeywords.length > 0 && <>
                                
                                    {focusKeywords.map((keyword, index) => {
                                        let strCount = countKeywords(keyword);
                                        let klName = strCount > 0 ? "green" : "red";
                                                                             
                                        return (
                                            <>              
                                            <div className="flex items-center">                          
                                                <div className={`text-xs inline-flex font-medium border border-${klName}-300 bg-${klName}-100 text-${klName}-600 rounded-full text-center px-2.5 py-1 mb-1 mr-2`}>
                                                    <a href="javascript:void(0)" onClick={() => {getHighlightedText(keyword)}}>
                                                        {keyword} ({strCount})
                                                    </a>
                                                </div>
                                                <a href="javascript:void(0)" onClick={() => editKeyword('focus', keyword)}><span class="material-icons-outlined">mode_edit</span></a>
                                            </div>
                                        </>
                                        );
                                    })}
                                    </>
                                }
                                
                            </div>
                            <div className="flex mt-2"> 
                                    <input className="w-4\/6 px-2 py-1 text-sm leading-7 bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md" type="text" id="fousyn" value={focusStr} onChange={(event) => {setText('focus', event.target.value)}} /> 
                                    <a href="" title="" className="mt-1 ml-2"><a href="javascript:void(0)" onClick={(event) => {addKeyword('focus')}} className="material-icons-outlined">add_circle </a></a>
                                </div>      
                        </div>

                        { /* Focus Keyword Synonym */}
                        <div>
                            <div className='flex mb-2 mt-5'>
                                <span className='leading-6 text-sm font-bold'>Focus Keyword Synonyms</span>
                            </div>  
                            <div className='flex flex-wrap w-full text-xs mb-2'>
                                {focusKeywordsSynonym.length > 0 && <>
                                
                                    {focusKeywordsSynonym.map((keyword, index) => {
                                        let strCount = countKeywords(keyword);
                                        let klName = strCount > 0 ? "green" : "red";
                                            
                                        return (
                                            <>              
                                            <div className="flex items-center">                          
                                                <div className={`text-xs inline-flex font-medium border border-${klName}-300 bg-${klName}-100 text-${klName}-600 rounded-full text-center px-2.5 py-1 mb-1 mr-2`}>
                                                    <a href="javascript:void(0)" onClick={() => {getHighlightedText(keyword)}}>
                                                        {keyword} ({countKeywords(keyword)})
                                                    </a>
                                                </div>
                                                <a href="javascript:void(0)" onClick={() => editKeyword('focussyn', keyword)}><span class="material-icons-outlined">mode_edit</span></a>
                                            </div>
                                        </>
                                        );
                                    })}
                                    </>
                                }
                                
                            </div>
                            <div className="flex mt-2"> 
                                    <input type="text" className="w-4\/6 px-2 py-1 text-sm leading-7 bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md" id="fous" value={focusSynStr} onChange={(event) => {setText('focussyn', event.target.value)}}  /> 
                                    <a href="" title="" className="mt-1 ml-2"><a href="javascript:void(0)" onClick={(event) => {addKeyword('focussyn')}} className="material-icons-outlined">add_circle </a></a>
                                </div>      
                        </div>

                        { /* Related Keywords  */}
                        <div>
                            <div className='flex mb-2 mt-5'>
                                <span className='leading-6 text-sm font-bold'>Related Keywords</span>
                            </div>  
                            <div className='flex flex-wrap w-full text-xs mb-2'>
                                {relatedKeywords.length > 0 && <>
                                
                                    {relatedKeywords.map((keyword, index) => {
                                        let strCount = countKeywords(keyword);
                                        let klName = strCount > 0 ? "green" : "red";
                                            
                                        return (
                                            <>              
                                            <div className="flex items-center">                          
                                                <div className={`text-xs inline-flex font-medium border border-${klName}-300 bg-${klName}-100 text-${klName}-600 rounded-full text-center px-2.5 py-1 mb-1 mr-2`}>
                                                    <a href="javascript:void(0)" onClick={() => {getHighlightedText(keyword)}}>
                                                        {keyword} ({countKeywords(keyword)})
                                                    </a>
                                                </div>
                                                <a href="javascript:void(0)" onClick={() => editKeyword('relatedstr', keyword)}><span class="material-icons-outlined">mode_edit</span></a>
                                            </div>
                                        </>
                                        );
                                    })}
                                    </>
                                }
                                
                            </div>
                            <div className="flex mt-2"> 
                                    <input type="text" className="w-4\/6 px-2 py-1 text-sm leading-7 bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md" id="fousss" value={relatedStr} onChange={(event) => {setText('relatedstr', event.target.value)}}  /> 
                                    <a href="" title="" className="mt-1 ml-2"><a href="javascript:void(0)" onClick={(event) => {addKeyword('relatedstr')}} className="material-icons-outlined">add_circle </a></a>
                                </div>      
                        </div>


                    </div>
                </div>
            </div>
            
        </>
    )
}

export default Keywords