import React from "react";
import { useFormikContext } from "formik";
import Input from "components/common/formComponent/Input";
import Checkbox from "components/common/formComponent/Checkbox";
import Dropdown from "components/common/formComponent/Dropdown";

const BillingInformation = ({ countries }) => {
  const { setFieldValue, values } = useFormikContext();
  return (
    <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 mb-6 p-6">
      <div className="block uppercase tracking-wide text-gray-500 text-lg font-bold mb-6">
        Billing Information
      </div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6">
          <label className="w-full block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
            First Name{" "}
            <span className="text-rose-500 text-xl leading-none">*</span>
          </label>
          <Input name={"firstName"} />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <label className="w-full block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
            Last Name{" "}
            <span className="text-rose-500 text-xl leading-none">*</span>
          </label>
          <Input name={"lastName"} />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <label className="w-full block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
            street address{" "}
          </label>
          <Input name={"address1"} />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <label className="w-full block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
            apt, suite{" "}
          </label>
          <Input name={"suite"} />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <label className="w-full block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
            zip code{" "}
          </label>
          <Input name={"zipCode"} />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <label className="w-full block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
            state / province{" "}
          </label>
          <Input name={"state"} />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <label className="w-full block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
            country{" "}
          </label>
          <Dropdown
            label={""}
            name={"country"}
            options={countries}
            defaultValue={values?.country}
            isSearchable={true}
          />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <label className="w-full block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
            Phone number{" "}
          </label>
          <Input name={"phone"} />
        </div>
        <div className="col-span-12">
          <label className="text-gray-500 inline-flex items-center">
            <Checkbox
              name="shipSameasBilling"
              label="Ship to my billing address"
              id="shipSameasBilling"
              checked={values?.shipSameasBilling}
              onChange={(e) => {
                setFieldValue("shipSameasBilling", e.target.checked);
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default BillingInformation;
