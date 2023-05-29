import React from "react";
import ForgotPasswordForm from "./authForms/ForgotPasswordForm";
import AlignmentView from "./authViews/AlignmentView";

const ForgotPassword = () => {
  return (
    <>
      <title>Forgot Password</title>
      {(() => {
        return <AlignmentView><ForgotPasswordForm /></AlignmentView>
      })()}
    </>
  );
};

export default ForgotPassword;
