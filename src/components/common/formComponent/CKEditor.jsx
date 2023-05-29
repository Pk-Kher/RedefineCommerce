import React, { useEffect, useState } from "react";
import { ErrorMessage, useFormikContext } from "formik";
import FormErrorMessage from "components/common/alerts/FormErrorMessage";
import { CKEditor as CKEditorCore } from "ckeditor4-react";
import { useSelector } from "react-redux";
import SidebarStoreList from "../others/admin/Store/SidebarStoreList";
const CKEditor = ({
  name,
  onChange,
  defaultValue,
  type,
  loading = false,
  readOnly,
  ...rest
}) => {
  const permission = useSelector(store => store.permission);
  const { setFieldValue } = useFormikContext();
  const [ckData, setckdata] = useState(null);
  useEffect(() => {
    if (ckData && loading === false) {
      ckData.setData("");
    }
    if (ckData && loading != "") {
      ckData.setData(loading);
    }
  }, [loading]);
  const onChangeHandler = (editor) => {
    if (onChange instanceof Function) {
      onChange(editor.getData());
    } else if (setFieldValue instanceof Function) {
      setFieldValue(name, editor.getData());
    }
  };
  return (
    <>
      <CKEditorCore
        name={name}
        onInstanceReady={(editor) => {
          setckdata(editor.editor);
        }}
        initData={defaultValue}
        config={
          type
            ? {
              toolbar: [
                ["Source"],
                ["Styles", "Format", "Font", "FontSize"],
                ["Bold", "Italic"],
                ["Undo", "Redo"],
                ["About"],
              ],
              extraPlugins: [
                /* 'wordcount'  */
              ],
              extraAllowedContent: 'div(*)',
              allowedContent: true,
              removePlugins: ["image"],
            }
            : {}
        }
        onChange={({ editor }) => onChangeHandler(editor)}
        readOnly={(!permission?.isEdit && !permission?.isDelete) || readOnly}
        {...rest}

      />
      <br />
      {name && <ErrorMessage name={name} component={FormErrorMessage} />}
    </>
  );
};
export default CKEditor;
