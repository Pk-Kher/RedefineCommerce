import React, { useEffect, useState } from "react";
import Danger from "./Danger";
import Grey from "./Grey";
import Success from "./Success";
import Slate from "./Slate";
import Expired from "./Expired";
import Warning from "./Warning";
import { ProductNavStatusValuebyName, ProductStatusValuebyName, RecStatusValuebyName, RecStatusValueName, ContentTopicStatus } from "global/Enum";
import General from "components/common/displayStatus/General";

const Status = ({ type, navSync = false, ...rest }) => {

  switch (true) {
    case [RecStatusValuebyName.Active, RecStatusValueName.FulFilled, RecStatusValueName.Approved].includes(type) && navSync === false:
      return <Success type={type} navSync={navSync} {...rest} />;
    case [ProductNavStatusValuebyName.Sync].includes(type) && navSync === true:
      return <Success type={type} navSync={navSync} {...rest} />;
    case [RecStatusValuebyName.Inactive, RecStatusValuebyName.Cancelled, RecStatusValuebyName.Fraud, RecStatusValueName.Disapproved].includes(type):
      return <Danger type={type} navSync={navSync} {...rest} />;
    case [ProductNavStatusValuebyName.Resync].includes(type) && navSync === true:
      return <Danger type={type} navSync={navSync} {...rest} />;
    case [RecStatusValuebyName.Draft, RecStatusValueName.Paid].includes(type):
      return <Grey type={type}  {...rest} />;
    case [RecStatusValuebyName.Pending, RecStatusValuebyName.Scheduled, RecStatusValueName.Unfulfilled, RecStatusValueName.Pending].includes(type):
      return <Warning type={type} {...rest} />;
    case [RecStatusValuebyName.Archived].includes(type):
      return <Slate type={type} {...rest} />;
    case [RecStatusValuebyName.Expired].includes(type) && !navSync:
      return <Expired type={type} navSync={navSync} {...rest} />;
    case [ProductStatusValuebyName.Discontinued].includes(type):
      return <Expired type={type} navSync={navSync} {...rest} />;
    default:
      return <General type={type} {...rest} />;
  }
};

export default Status;
