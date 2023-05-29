/*Component Name: ErrorBoundary
Component Functional Details:  ErrorBoundary .
Created By: PK Kher
Created Date: 6-17-2022
Modified By: PK Kher
Modified Date: 6-17-2022*/

import React from "react";
import { ErrorBoundary as ErrorBoundaryComponent } from "react-error-boundary";
import Error from "./Error";

const ErrorBoundary = ({ children }) => {
  const errorHandler = (error, errorInfo) => {
    console.log(error, errorInfo);
  };
  return (
    <ErrorBoundaryComponent FallbackComponent={Error} onError={errorHandler}>
      {children}
    </ErrorBoundaryComponent>
  );
};

export default ErrorBoundary;
