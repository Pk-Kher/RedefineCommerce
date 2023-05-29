import React, { useEffect, useState } from 'react';
import { CKEditor as CKEditorCore } from "ckeditor4-react";

const CKEditor = ({ name, onChange, defaultValue, type, changeText, props }) => {
  const [ckData, setckdata] = useState(null);
  const [currentComp, setCurrentComp] = useState('');
  useEffect(() => {
    if (ckData && defaultValue === '') {
      ckData.setData('');
    }
    if (ckData && defaultValue != '') {
      ckData.setData(defaultValue);
    }
  }, [defaultValue, ckData]);
  const onChangeHandler = (editor) => {
    changeText(editor.getData(), currentComp);
  }

  useEffect(() => {
    setCurrentComp(props.currentComponent);
  }, [props.currentComponent]);
  return (
    <>
      <CKEditorCore
        name={name}
        onInstanceReady={(editor) => { setckdata(editor.editor); }}
        initData={defaultValue}
        config={type ? {
          toolbar: [
            ['Source'],
            ['Styles'],
            ['Bold', 'Italic', 'Underline'],

            ['About']
          ],
          extraPlugins: [/* 'wordcount'  */],
          removePlugins: ['image'],
          extraAllowedContent: 'div(*)',
          allowedContent: true
        } : {}}

        onChange={({ editor }) => onChangeHandler(editor)}
      />

    </>
  );
};
export default CKEditor;


