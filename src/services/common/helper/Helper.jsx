import format from "date-fns/format";
import LocationServices from "services/common/location/LocationServices";
import createShades from "colorshades";

export const NumericList = (start, end, gap) => {
  let font = [];
  for (var i = start; i <= end; i = i + gap) {
    font = [...font, { value: i.toString(), label: i.toString() }];
  }
  return font;
};

export const DateTimeFormat = (value, DateFormat = "MM/dd/yyyy") => {
  return {
    date: format(new Date(value), DateFormat),
    time: format(new Date(value), "hh:mm a"),
  };
};

export const getClientInfo = async () => {
  // return {
  //   browser: 'firefox',
  //   location: "string",
  //   ipAddress: "192.168.1.1",
  //   macAddress: "00-00-00-00-00-00",
  // };
  var clientInfo;
  await LocationServices.getLocation()
    .then((response) => {
      if (response?.data) {
        clientInfo = response?.data;
      }
    })
    .catch(() => { });
  return {
    browser: navigator.userAgent,
    location: clientInfo
      ? clientInfo.city +
      " " +
      clientInfo.state +
      " " +
      clientInfo.country_name +
      " " +
      clientInfo.postal
      : "AMD",
    ipAddress: clientInfo ? clientInfo.IPv4 : "125.124.545.32",
    macAddress: "00-00-00-00-00-00",
  };
};

export const ValidNumberFormat = (valFromInput, toFix = 2) => {
  let afterdecimalValue = valFromInput?.split(".")[1]?.length;

  valFromInput = valFromInput.toString();
  valFromInput = valFromInput.slice(
    0,
    valFromInput.indexOf(".") + afterdecimalValue + 1
  );
  valFromInput = Number(valFromInput).toFixed(toFix);
  return Number(valFromInput);
};

export const fileValidation = (fileInput, setMessage) => {
  // var filePath = fileInput.value;

  // Allowing file type
  var allowedExtensions = /(\.jpg|\.png|\.gif)$/i;
  // console.log("fileInput", fileInput);
  if (!allowedExtensions.exec(fileInput)) {
    // console.log("Invalid file type");
    const fileExtension = fileInput.split(".");
    setMessage(
      `Invalid file type you uploaded a .${fileExtension[fileExtension.length - 1]
      } file`
    );
    setTimeout(() => {
      setMessage("");
    }, 2000);
    return false;
  } else {
    // console.log("Image preview", fileInput[0], fileInput);
    if (fileInput && fileInput[0]) {
      return true;
    }
  }
};

export const ValidatePercentage = (event) => {
  if (!/^\d*\.?\d*$/.test(event.key)) {
    event.preventDefault();
  }
}

// using this we can restrict special Character
export const ValidateSpecialCharacter = (event, isDecimal = false, values) => {
  if (isDecimal && event.key === ".") {
    if (values.includes(".") || values === "") {
      return event.preventDefault();
    }
    return
  } else {
    if (!/^\d*$/.test(event.key)) {
      event.preventDefault();
    }
  }
}

export const serverError = (response) => {
  let errors = {};
  if (response.data.errors) {
    // return Object.values(response.data.errors).join("<br/> ");
    Object.keys(response.data.errors).map((key, index) => {
      let value = response.data.errors[key];

      if (Object.keys(response.data.errors).length > 0 && typeof value !== 'object' && !Array.isArray(value)) {
        errors = { ...errors, [key]: value };
      } else {
        errors = { ...errors, ...nested(value) };
        // nested(value);
      }
    });
  }
  return Object.values(errors).filter(value => value).join("<br/> ");
};

const nested = (data) => {
  let errors = {};
  Object.keys(data).map((key, index) => {
    let value = data[key];
    if (Object.keys(data).length > 0 && typeof value !== 'object'/*  && Array.isArray(value) */) {
      errors = { ...errors, [key]: value };
    } else {
      errors = { ...errors, ...nested(value) };
    }
  });
  return errors;
}


export const importValidation = (response) => {
  // let a = "<ul>";
  // response?.map((data, index) => {
  //   let b = " <li key={index}>" + 'row 1' + "<ul className='ml-10'>";
  //   let c = "";
  //   Object.keys(data.error).map((key, index) => {
  //     c = c + `<li key={index}>${msg}</li>`;
  //   })
  //   a =  b + c + "</ul></li>"
  // });

  let errors = response?.map((data) => {
    let errorMsg = "";
    Object.keys(data.error).map((key, index) => {
      errorMsg = [...errorMsg, data.error[key]];
    });
    return { row: 'Row ' + data?.row, error: errorMsg }
  });
  return errors;
}
export const displayColumnSelection = (value) => {
  return (value === "product" || value === "OptionProduct" || value === "ProductColor" || value === 'StoreProduct' || value === "StoreOptionProduct");
}



export const createDynamicShades = (color) => {
  const shades = createShades(color);
  return shades?.colors;
}
export const scrollTop = () => {
  var div = document.getElementById('contentbody');
  if (div) {
    div.scrollTop = 0;
  }
}