import React, { useEffect, useState } from "react";
import Input from "components/common/formComponent/Input";
import Dropdown from "../../../../../common/formComponent/Dropdown";
import CKEditor from "components/common/formComponent/CKEditor";
import CategoryService from "services/admin/masterCatalog/store/categoryMaster/CategoryMasterService";
import { useParams } from "react-router-dom";
import ImageFile from "components/common/formComponent/ImageFile";
import { blobFolder } from "global/Enum";
import { useSelector } from "react-redux";

const CategoryInfo = ({ setFieldValue, values, data }) => {
  const [categoryList, setcategoryList] = useState([]);
  const { id, storeId } = useParams();

  const CompanyId = useSelector((store) => store?.CompanyConfiguration.id)
  const FolderPath = `/${blobFolder.temp}/${CompanyId}/${blobFolder.category}${!id ? "/0" : `/${id}`}`

  useEffect(() => {
    CategoryService.getCategoryDropdownOptions(id, storeId).then((response) => {
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
          <span className="text-rose-500 text-lg leading-none">*</span>
        </label>
        <Input
          type={"text"}
          name={`name`}
          placeholder="Category Name"
          id="name"
          className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}
        />
      </div>

      {/* Parent Category */}
      <div className="w-full mb-6 relative">
        <div className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
          Category
        </div>
        <div >
          <Dropdown
            id="parentId"
            defaultValue={values.parentId}
            label="parentId"
            isMulti={true}
            name="parentId"
            options={categoryList}
            isSearchable={true}
          />
        </div>
      </div>

      {/* Banner Image */}
      <div className="w-full mb-6 relative">
        <div className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2">
          Banner Image
        </div>
        <div >
          <ImageFile
            type="file"
            className="sr-only"
            name="bannerImagePath"
            id="bannerImagePath"
            buttonName="Add"
            // disabled={readOnly}
            folderpath={`${FolderPath}`}
            onChange={(value) => {
              setFieldValue("bannerImagePath", value);
            }}
            url={values.bannerImagePath}
          />
        </div>
        <div className="text-sm mt-2">
          Recommended size for brand logo is 1920 x 600 pixel and it's mandatory for
          user to compress logo via &nbsp;
          <a
            href="https://tinypng.com/"
            title="www.tinypng.com"
            className="text-indigo-500"
            target="_blank"
          >
            www.tinypng.com &nbsp;
          </a>
          and then upload.
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
