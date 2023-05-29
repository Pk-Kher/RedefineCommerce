import React from "react";
import DatePicker from "components/common/formComponent/DatePicker";
import Textarea from "components/common/formComponent/Textarea";
import { useFormikContext } from "formik";

const StoreSetting = () => {
  const { setFieldValue, values } = useFormikContext();
  return (
    <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 mb-6 p-6">
      <div className="block uppercase tracking-wide text-gray-500 text-lg font-bold mb-6">
        Store settings
      </div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6">
          <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
            Open store on :{" "}
            <span className="text-rose-500 text-xl leading-none">*</span>
          </label>
          <DatePicker name={"openStoreOn"} defaultValue={values.openStoreOn} />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
            close store on :{" "}
            <span className="text-rose-500 text-xl leading-none">*</span>
          </label>
          <DatePicker
            name={"closeStoreOn"}
            defaultValue={values.closeStoreOn}
          />
        </div>
        <div className="col-span-12">
          <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
            user terms
          </label>
          <Textarea
            rows={2}
            name={"userTerms"}
            className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default StoreSetting;
