import React, { useState, useEffect } from "react";
import LoginForm from "./authForms/LoginForm";
import AlignmentView from "./authViews/AlignmentView";

const Login = (props) => {
  return (
    <>
      <title>Login</title>
      {(() => {
        return <AlignmentView><LoginForm /></AlignmentView>
      })()}
    </>
  );
};

export default Login;
