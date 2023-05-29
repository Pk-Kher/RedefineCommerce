import React from "react";
import Input from "../../../../common/formComponent/Input";
import { useSelector } from "react-redux";
import Checkbox from "components/common/formComponent/Checkbox";
import { useFormikContext } from 'formik';

const UserDetail = ({ fieldArrayProps, index }) => {
  const CurrentUserObject = useSelector((store) => store?.user)
  const { values, setFieldValue } = useFormikContext();

  return (
    <>
      <div
        className={`${index !== 0
          ? "bg-slate-50 border border-slate-200 p-6 pb-0 relative mb-6"
          : ""
          }`}
      >
        <div
          className={`bg-white absolute top-0 right-0 border-l border-b w-8 h-8 p-1 border-slate-200 ${index === 0 && "hidden"
            }`}
        >
          <span
            className="text-rose-500"
            onClick={fieldArrayProps.remove.bind(null, index)}
          >
            <span className="material-icons-outlined cursor-pointer">
              delete
            </span>
          </span>
        </div>
        <div className="flex w-full md:gap-6">
          <div className="w-full md:w-1/2 mb-6">
            <label
              className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
              htmlFor="grid-first-name"
            >
              First Name
              <span className="text-rose-500 text-2xl leading-none">*</span>
            </label>
            <Input
              className={
                "block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md"
              }
              name={`adminUserViewModel[${index}].firstname`}
              placeholder="First Name"
              id="first_name"
              maxLength={255}
            />
          </div>
          <div className="w-full md:w-1/2 mb-6">
            <label
              className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
              htmlFor="grid-last-name"
            >
              Last Name
              <span className="text-rose-500 text-2xl leading-none">*</span>
            </label>
            <Input
              name={`adminUserViewModel[${index}].lastname`}
              placeholder="Last Name"
              id="last_name"
              maxLength={255}
            />
          </div>
        </div>
        <div className="flex w-full md:gap-6">
          <div className="w-full md:w-1/2 mb-6">
            <label
              className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
              htmlFor="grid-email"
            >
              Email
              <span className="text-rose-500 text-2xl leading-none">*</span>
            </label>
            <Input
              name={`adminUserViewModel[${index}].email`}
              placeholder="Email"
              id="email"
            />
          </div>
          <div className="w-full md:w-1/2 mb-6">
            <label
              className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
              htmlFor="grid-phone-number"
            >
              Phone Number
              <span className="text-rose-500 text-2xl leading-none">*</span>
            </label>
            <Input
              name={`adminUserViewModel[${index}].phone`}
              placeholder="Phone Number"
              id="phone"
              maxLength="13"
            />
          </div>
        </div>
        {
          CurrentUserObject?.isSuperUser && <div><label className="text-gray-500 flex items-start mt-3 mb-6">
            <Checkbox
              className="mt-1"
              name={`adminUserViewModel[${index}].isSuperUser`}
              id={`adminUserViewModel[${index}].isSuperUser`}
              checked={values.adminUserViewModel[index].isSuperUser}
              onChange={(e) =>
                setFieldValue(
                  `adminUserViewModel[${index}].isSuperUser`,
                  e.target.checked
                )
              }
            />
            <span className="ml-2">
              Super User
            </span>
          </label>
          </div>
        }
      </div>
    </>
  );
};

export default UserDetail;
