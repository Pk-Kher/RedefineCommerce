import RadioButtonGroup from 'components/common/formComponent/RadioButtonGroup'
import React, { useEffect, useState } from 'react'
import { useFormikContext } from "formik";
import ReactTooltip from "react-tooltip";
import Input from "components/common/formComponent/Input";
import Textarea from "components/common/formComponent/Textarea";
import DropdownService from 'services/common/dropdown/DropdownService';
import Dropdown from 'components/common/formComponent/Dropdown';

const MetaData = ({ storeUrl, storeName }) => {
  const radioOption = [
    { label: "Desktop Result", value: "D" },
    { label: "Mobile Result", value: "M" },
  ];

  let { setFieldValue, values } = useFormikContext();
  const [storeList, setStoreList] = useState([]);

  useEffect(() => {
    DropdownService.getDropdownValues('store')
      .then((res) => {
        setStoreList(res.data.data);
      });
  }, []);

  return (
    <div className="px-5 py-4 bg-white mb-6">
      <button className="flex items-center justify-between w-full group mb-1">
        <div className="text-lg text-gray-800 font-bold">Meta Data</div>
      </button>

      {/* Preview As Section */}
      <div className='mt-6'>
        <div className="mb-7 flex flex-wrap justify-start items-center">
          <div className="text-md text-gray-800 font-bold">Preview as:</div>
        </div>

        <div className="mb-6 w-full">
          <div className="mb-6">
            <RadioButtonGroup
              name="previewAs"
              align="horizontal"
              options={radioOption}
            />
          </div>
          <div className="mb-6">
            <div className={`mb-3 text-base bg-white py-4 rounded ${values.previewAs === 'D' ? 'w-full' : ' w-2/4'}`}>
              <div className="text-sm leading-4 text-[#202124] flex py-1 font-arial">
                <span className="cursor-pointer" title="">{storeUrl} › ... <span className="material-icons-outlined text-[15px]">more_vert</span></span>
              </div>
              <div className="text-[20px] text-[#1a0dab] font-arial leading-6 py-1"><span className="cursor-pointer" title="">{storeName}</span></div>
              <div className="text-sm text-black leading-6 mb-2">
                <div className="text-[14px] leading-[22px] text-[#4d5156] mb-2 mr-2 inline-block font-arial">
                  <span className="font-bold">{storeName}</span> gives its customers exclusive, direct access to custom branded clothing and accessories from iconic premium sports and lifestyle brands.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page URL Section */}
      <div className="mb-6">
        <label className="tracking-wide text-gray-700 text-sm font-bold mb-2 flex items-center">
          Page URL <span className="text-rose-500 text-2xl leading-none">*</span>
          <span data-tip data-for='page-url-tip' className="material-icons-outlined ml-2 text-sm">info</span>
          <ReactTooltip id='page-url-tip' type='dark' effect="solid">
            <span>Internal Name Used For Organization</span>
          </ReactTooltip>
        </label>
        <div className="text-sm">Publish your page on your domain.</div>
        <div className="flex">
          <div className="w-4/6 md:mr-2">
            <div className="text-gray-700 text-sm font-bold mb-2 flex items-center">Domains</div>
            <div className="grow">
              <Dropdown
                isMulti={false}
                isClearable={false}
                defaultValue={values.storeId}
                name="storeId"
                className={`w-full`}
                options={storeList}
              />
            </div>
          </div>
          <div className="w-2/6 md:ml-2">
            <div className="text-gray-700 text-sm font-bold mb-2 flex items-center">Content slug <span className="text-rose-500 text-2xl leading-none">*</span></div>
            <div className="grow">
              <Input name={'slug'} type="text" placeholder="" className="bg-gray-100 text-gray-700 border-gray-200 rounded focus:outline-none focus:bg-white" />
            </div>
          </div>
        </div>
      </div>

      {/* PageTitle Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <label className="tracking-wide text-gray-700 text-sm font-bold mb-2 flex items-center">
            Page Title <span className="text-rose-500 text-2xl leading-none">*</span>
          </label>
          <span className="text-xs"><span x-html="count">{values?.topicTitle?.length}</span> / <span>160</span> Character</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="grow">
            <Input name={'topicTitle'} type="text" placeholder="" className={`bg-gray-100 text-gray-700 border-gray-200 rounded focus:outline-none focus:bg-white ${values?.topicTitle?.length > 160 ? 'bg-highlight-red' : ''}`} />
          </div>
        </div>
      </div>
      {/* Meta Description Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <label className="tracking-wide text-gray-700 text-sm font-bold mb-2 flex items-center">
            Meta Description <span className="text-rose-500 text-2xl leading-none">*</span>
          </label>
          <span className="text-xs"><span x-html="count">{values?.metaDescription?.length}</span> / <span>160</span> Character</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="grow">
            <Textarea name={'metaDescription'} type="text" placeholder="" className={`bg-gray-100 text-gray-700 border-gray-200 rounded focus:outline-none focus:bg-white ${values?.metaDescription?.length > 160 ? 'bg-highlight-red' : ''}`} />
          </div>
        </div>
      </div>

      {/* Meta Keywords Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <label className="tracking-wide text-gray-700 text-sm font-bold mb-2 flex items-center">
            Meta Keywords <span className="text-rose-500 text-2xl leading-none">*</span>
          </label>
          <span className="text-xs"><span x-html="count">{values?.metaKeywords?.length}</span> / <span>160</span> Character</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="grow">
            <Textarea name={'metaKeywords'} type="text" placeholder="" className={`bg-gray-100 text-gray-700 border-gray-200 rounded focus:outline-none focus:bg-white ${values?.metaKeywords?.length > 160 ? 'bg-highlight-red' : ''}`} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MetaData