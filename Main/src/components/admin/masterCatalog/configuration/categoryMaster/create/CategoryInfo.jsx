import React, { useEffect, useState } from "react";
import Input from "../../../../../common/formComponent/Input";
import Dropdown from "../../../../../common/formComponent/Dropdown";
import CKEditor from "components/common/formComponent/CKEditor";
import CategoryService from "services/admin/category/CategoryService";
import { useParams } from "react-router-dom";

const CategoryInfo = ({ setFieldValue, values, data }) => {
  const [categoryList, setcategoryList] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    CategoryService.getCategoryDropdownOptions((id ? id : -1)).then((response) => {
      setcategoryList(() => {
        return response.data.data;
      });
    });
  }, []);

  return (
    <>
      {/* Category Name */}
      <div className="w-full mb-6">
        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
          Category Name
          <span className="text-rose-500 text-2xl leading-none">*</span>
        </label>
        <Input
          type={"text"}
          name={`name`}
          id="name"
          maxLength={60}
          className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}
        />
      </div>

      {/* Parent Category */}
      <div className="w-full mb-6 relative" x-data="{ open: false }">
        <div className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
          Parent Category
        </div>
        <div >
          <Dropdown
            defaultValue={values.parentId}
            label="ParentID"
            isMulti={true}
            name="parentId"
            options={categoryList}
            isSearchable={true}
          />
        </div>
      </div>

      {/* Category Description */}
      <div className="w-full">
        <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
          Description
        </label>
        <CKEditor
          type="simple"
          name={"description"}
          maxLength={300}
          defaultValue={values.description}
          onChange={(value) => {
            setFieldValue("description", value);
          }}
          loading={data?.description}
        />


      </div>
    </>
  );
};

export default CategoryInfo;
