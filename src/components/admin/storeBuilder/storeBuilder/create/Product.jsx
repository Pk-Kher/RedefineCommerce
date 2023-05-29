import React from "react";
import { Formik, Form as FormikForm } from "formik";

const Product = ({ id, isAddMode, setFormSubmit, index, activeTab }) => {
  const submitHandler = (fields) => {};
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      onSubmit={submitHandler}
    >
      {({}) => {
        return <FormikForm></FormikForm>;
      }}
    </Formik>
  );
};

export default Product;
