import React from "react";
import Input from "../../../../../common/formComponent/Input";
import { categoryList } from "dummy/Dummy";
import Dropdown from "../../../../../common/formComponent/Dropdown";
import CKEditor from "components/common/formComponent/CKEditor";
import { data } from "jquery";

const CategoryStores = ({ stores }) => {
  return (
    <>
      <div id="managestoreModal" aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-4 z-50 justify-center items-center h-modal md:h-full md:inset-0">
      </div>
    </>
  );
};

export default CategoryStores;
