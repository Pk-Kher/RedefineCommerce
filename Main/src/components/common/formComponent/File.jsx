import React, { useEffect, useState, forwardRef } from "react";
import { ErrorMessage } from "formik";
import { API } from "helpers/API";
import FormErrorMessage from "components/common/alerts/FormErrorMessage";
import TableLoading from "../table/TableLoading";
import { v4 as uuidv4 } from "uuid";

const File = forwardRef(
  (
    {
      type,
      name,
      className,
      label,
      buttonName,
      folderpath,
      url,
      onChange,
      someRef,
      filePath,
      showAddButton,
      value,
      isChangeDefaultName = false,
      ...rest
    },
    ref
  ) => {
    const [UploadLoading, setUploadLoading] = useState(false)
    const [message, setMessage] = useState(false);
    const [image, setImage] = useState(url);

    useEffect(() => {
      setImage(url);
    }, [url, setImage]);

    const upload = (e) => {
      const formData = new FormData();
      setUploadLoading(true)

      const currentFile = e.target.files[0].name
      const fileExt = currentFile.split(".")
      const currentExt = fileExt[fileExt.length - 1]

      const currentImagName = (isChangeDefaultName ? currentFile : `${uuidv4()}.${currentExt}`)
      formData.append(isChangeDefaultName ? "files" : "file", e.target.files[0], currentImagName);
      formData.append("name", fileExt[0]);

      const uploadFile = isChangeDefaultName ? `/Blob/uploadfile.json?folderPath=${folderpath}` : `/upload/file?folderPath=${folderpath}`

      const url = filePath
        ? uploadFile
        : `/upload/image?folderPath=${folderpath}`;

      API.post(url, formData)
        .then((response) => {
          if (response.data.success) {
            if (onChange instanceof Function) {
              if (isChangeDefaultName) {
                onChange(response.data.data.result, currentFile);
              }
              else {
                onChange(response.data.data, currentFile);
              }
            }
            setMessage(false);
          } else if (response?.data?.errors?.error) {
            setMessage(response?.data?.errors?.error);
          } else {
            setMessage("File does't upload successfully");
          }
          setUploadLoading(false)

        })
        .catch((error) => {
          setMessage("File does't upload successfully");
          setUploadLoading(false)

        });
    };
    return (
      <>
        <div className="flex justify-between">
          <div className="w-full rounded-md">
            <div
              className={
                buttonName &&
                `col-span-full lg:col-span-6 border-2 border-dashed border-neutral-200 rounded-xl h-40 bg-center bg-no-repeat bg-contain ${image && "bg-black "
                }`
              }
              style={{ backgroundImage: `url('${image}')` }}
            >
              <div className="w-full flex flex-wrap h-full items-center">
                <div className="w-full text-center justify-center inset-0">
                  {UploadLoading ? (
                    <div className="w-full h-28 relative">
                      <TableLoading />
                    </div>
                  ) : (
                    <>

                      <div >
                        {buttonName && (
                          <label
                            htmlFor={name}
                            className="btn bg-blue-500 text-white justify-center cursor-pointer"
                          >
                            {buttonName}
                          </label>
                        )}
                        {!value ? (
                          <input
                            ref={someRef && someRef}
                            type="file"
                            name={name}
                            {...rest}
                            onChange={upload}
                            title="some title"
                            className={`${className}  block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}
                          />
                        ) : (
                          <div
                            className={`${className} flex justify-around items-center w-full text-left bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}
                          >
                            <p>{value}</p>
                            <button
                              type="button"
                              className="text-rose-500 text-2xl font-semibold"
                              onClick={() => {
                                // removeCurrentFile()
                                onChange("");
                              }}
                            >
                              <span className="material-icons-outlined">
                                close
                              </span>
                            </button>
                          </div>
                        )}

                        {label && (
                          <div className="relative z-10">
                            <button
                              type="button"
                              className="w-full text-center text-blue-500 underline cursor-default"
                            >
                              <span
                                className="inline-block"
                                data-modal-toggle="clonemultibox"
                              >
                                {label}
                              </span>
                            </button>
                          </div>
                        )}
                      </div>

                    </>
                  )}
                </div>
              </div>
              {name && (
                <ErrorMessage name={name} component={FormErrorMessage} />
              )}
              {message && <FormErrorMessage>{message}</FormErrorMessage>}
            </div>
          </div>
        </div>
      </>
    );
  }
);

export default File;
