import React from "react";
import { useFormikContext } from "formik";
import Input from "components/common/formComponent/Input";
import Dropdown from "components/common/formComponent/Dropdown";

const ShippingInformation = ({ countries }) => {
  const { setFieldValue, values } = useFormikContext();
  return (
    !values.shipsameasbilling && (
      <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 mb-6 p-6">
        <div className="block uppercase tracking-wide text-gray-500 text-lg font-bold mb-6">
          Shipping Information
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-6">
            <label className="w-full block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
              First Name{" "}
              <span className="text-rose-500 text-xl leading-none">*</span>
            </label>
            <Input name={"shipFirstName"} />
          </div>
          <div className="col-span-12 lg:col-span-6">
            <label className="w-full block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
              Last Name{" "}
              <span className="text-rose-500 text-xl leading-none">*</span>
            </label>
            <Input name={"shipLastName"} />
          </div>
          <div className="col-span-12 lg:col-span-6">
            <label className="w-full block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
              street address{" "}
            </label>
            <Input name={"shipAddress1"} />
          </div>
          <div className="col-span-12 lg:col-span-6">
            <label className="w-full block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
              apt, suite{" "}
            </label>
            <Input name={"shipSuite"} />
          </div>
          <div className="col-span-12 lg:col-span-6">
            <label className="w-full block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
              zip code{" "}
            </label>
            <Input name={"shipZipcode"} />
          </div>
          <div className="col-span-12 lg:col-span-6">
            <label className="w-full block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
              state / province{" "}
            </label>
            <Input name={"shipState"} />
          </div>
          <div className="col-span-12 lg:col-span-6">
            <label className="w-full block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
              country{" "}
            </label>
            <Dropdown
              label={""}
              name={"shipCountry"}
              options={countries}
              defaultValue={values?.shipCountry}
              isSearchable={true}
            />
          </div>
          <div className="col-span-12 lg:col-span-6">
            <label className="w-full block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
              Phone number{" "}
            </label>
            <Input name={"shipPhone"} />
          </div>
        </div>
      </div>
    )
  );
};

export default ShippingInformation;
