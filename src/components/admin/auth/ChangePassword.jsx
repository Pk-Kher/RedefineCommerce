/*Component Name: ChangePassword
Component Functional Details: User can create or update ChangePassword master details from here.
Created By: Happy
Created Date: <Creation Date>

Modified By: Keval
Modified Date: JULY 14th 2022 */

import React, { useState, useEffect } from "react";
import ChangePasswordForm from "./authForms/ChangePasswordForm";
import AlignmentView from "./authViews/AlignmentView";

const ChangePassword = () => {

  return (
    <>
      <title>Change Password</title>
      {(() => {
        return <AlignmentView><ChangePasswordForm /></AlignmentView>
      })()}
    </>
  );
};

export default ChangePassword;
