import React from 'react'
import Keywords from './sections/Keywords';
import Images from './sections/Images';

const LeftBar = (props) => {
    return (
        <>
            <div className='p-1 bg-slate-100 border-b border-b-solid border-b-slate-300 text-right w-full'>
                <a href="javascript:void(0)" className='pr-1'>
                    <span id="btn1" className='material-icons-outlined text-sm'>
                        arrow_back_ios
                    </span>
                </a>
            </div>
            <div id="left-main1">
                <div className="p-4 bg-slate-200 border-b border-b-solid border-b-slate-300 w-full">
                    <div className='py-2 px-3 text-xl font-bold'>
                        Optimize
                    </div>

                    <div className="py-2 px-3 mb-2 flex flex-wrap justify-start items-center">
                        <div >Current SEO Score:</div>
                        <div className="text-xs inline-flex font-medium border border-green-300 bg-green-100 text-green-600 rounded-full text-center px-4 py-1 ml-3">{props.seoScore}%</div>
                    </div>

                    <div className="bg-transparent w-full">
                        <div className="relative">
                            <Keywords {...props} />
                            <Images {...props} />
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default LeftBar