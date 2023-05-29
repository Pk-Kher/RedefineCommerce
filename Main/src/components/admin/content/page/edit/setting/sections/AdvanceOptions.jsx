import Input from 'components/common/formComponent/Input';
import Textarea from 'components/common/formComponent/Textarea';
import React, { useState } from 'react'
import ReactTooltip from 'react-tooltip';

const AdvanceOptions = () => {
    const [show, setShow] = useState(false);
    return (
        <div className="px-5 py-4 bg-white mb-6">
            <button className="flex items-center justify-between w-full group mb-1" type='button' onClick={() => setShow(!show)}>
                <div className="text-lg text-gray-800 font-bold">Advanced Options</div>
                <svg className={`w-8 h-8 shrink-0 fill-current text-gray-400 group-hover:text-gray-500 ml-3 ${show ? "rotate-180" : ""}`} viewBox="0 0 32 32">
                    <path d="M16 20l-5.4-5.4 1.4-1.4 4 4 4-4 1.4 1.4z"></path>
                </svg>
            </button>
            <div className={`${show ? "" : "hidden"}`}>
                <div className=''>
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <label className="tracking-wide text-gray-700 text-sm font-bold mb-2 flex items-center">
                                Head HTML
                                <span data-tip data-for='head-html-tip' className="material-icons-outlined ml-2 text-sm">info</span>
                                <ReactTooltip id='head-html-tip' type='dark' effect="solid">
                                    <span>Add raw HTML snippets, embed<br /> codes, or tracking javascripts<br /> "HEAD TAG" tag on the page.</span>
                                </ReactTooltip>
                            </label>
                            {/* <span className="text-xs"><span x-html="count">{values?.metaDescription.length}</span> / <span>160</span> Character</span> */}
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <div className="grow">
                                <Textarea name={'head_html'} type="text" placeholder="" maxLength="160" className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" />
                            </div>
                        </div>
                    </div>
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <label className="tracking-wide text-gray-700 text-sm font-bold mb-2 flex items-center">
                                Footer HTML
                                <span data-tip data-for='footer-html-tip' className="material-icons-outlined ml-2 text-sm">info</span>
                                <ReactTooltip id='footer-html-tip' type='dark' effect="solid">
                                    <span>Add raw HTML snippets, embed <br /> codes, or tracking javascripts that <br /> will be added right before the "BODY TAG" <br /> tag on the page.</span>
                                </ReactTooltip>
                            </label>
                            {/* <span className="text-xs"><span x-html="count">{values?.metaDescription.length}</span> / <span>160</span> Character</span> */}
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <div className="grow">
                                <Textarea name={'footer_html'} type="text" placeholder="" maxLength="160" className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" />
                            </div>
                        </div>
                    </div>
                    <div className="mb-6 text-xl font-bold">Canonical URL</div>
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <label className="tracking-wide text-gray-700 text-sm font-bold mb-2 flex items-center">
                                Customize canonical URL
                                <span data-tip data-for='canonical-url-tip' className="material-icons-outlined ml-2 text-sm">info</span>
                                <ReactTooltip id='canonical-url-tip' type='dark' effect="solid">
                                    <span>Editing this link can affect your<br /> organic traffic and isn't necessary <br /> in most cases.</span>
                                </ReactTooltip>
                            </label>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <div className="grow">
                                <Input name={'canonical_url'} type="text" placeholder="" className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-4 py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" />
                                <div className="text-xs">Tell search engines which URL should be preferred if the content in this page is available somewhere else on your site.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdvanceOptions