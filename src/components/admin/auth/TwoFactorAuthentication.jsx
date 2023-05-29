import React from "react";
import TwoFactorAuthenticationForm from "./authForms/TwoFactorAuthenticationForm";
import AlignmentView from "./authViews/AlignmentView";

const TwoFactorAuthentication = () => {
  return (
    <>
      <title>Two Factor Authentication</title>
      {(() => {
        return <AlignmentView><TwoFactorAuthenticationForm /></AlignmentView>
      })()}
    </>
  );
};

export default TwoFactorAuthentication;
