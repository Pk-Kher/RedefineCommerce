import React from "react";
import ResetPasswordForm from "./authForms/ResetPasswordForm";
import AlignmentView from "./authViews/AlignmentView";

const ResetPassword = () => {
  return (
    <>
      <title>Reset Password</title>
      {(() => {
        return <AlignmentView><ResetPasswordForm /></AlignmentView>
      })()}
    </>
  );
};

export default ResetPassword;
