import React, { useState, useEffect, useRef } from "react";
import { ErrorMessage } from "formik";
import FormErrorMessage from "components/common/alerts/FormErrorMessage";
// import axios from "axios";
import TableLoading from "../table/TableLoading";
import ImageUpload from "services/common/imageUpload/ImageUpload";

import { fileValidation } from "services/common/helper/Helper.jsx";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { useDispatch, useSelector } from "react-redux";

const ImageFile = ({
  type,
  name,
  className,
  label,
  buttonName,
  folderpath,
  url,
  onChange,
  editOff,
  InnerCompo,
  ...rest
}) => {
  const dispatch = useDispatch();
  const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

  const [message, setMessage] = useState(false);
  const [image, setImage] = useState(url);
  const [dragging, setDragging] = React.useState(false);
  const drop = useRef(null);

  useEffect(() => {
    setImage(url);
  }, [url, setImage]);

  const upload = async (e, file) => {
    // console.log("currentFile in handleDrop", e, file);

    const formData = new FormData();
    if (file) {
      if (fileValidation(file[0].name, setMessage)) {
        formData.append("files", file[0]);
        dispatch(setAddLoading(true))

        ImageUpload.uploadImage(folderpath, formData)
          .then((response) => {
            if (response.data.success) {
              onChange(response.data.data);
              setMessage(false);
            } else {
              setMessage("File does't upload successfully");
            }
            dispatch(setAddLoading(false))

          })
          .catch((error) => {
            setMessage("File does't upload successfully");
            dispatch(setAddLoading(false))

          });
      }
    } else {
      if (fileValidation(e.target.files[0].name, setMessage)) {
        formData.append("files", e.target.files[0]);
        dispatch(setAddLoading(true))

        ImageUpload.uploadImage(folderpath, formData)
          .then((response) => {
            if (response.data.success) {
              onChange(response.data.data);
              setMessage(false);
            } else {
              setMessage("File does't upload successfully");
            }
            dispatch(setAddLoading(false))

          })
          .catch((error) => {
            setMessage("File does't upload successfully");
            dispatch(setAddLoading(false))

          });
      }
    }
  };

  const deleteImage = (e) => {
    const filePath = url.replace(
      process.env.REACT_APP_API_BLOB ?? "https://redefinecommerce.blob.core.windows.net" + "/images/",
      ""
    );
    if (filePath) {
      ImageUpload.deleteImage(filePath)
        .then((response) => {
          if (response.data.data) {
            setMessage(false);
          } else {
            setMessage("File does't delete.");
          }
        })
        .catch((error) => {
          setMessage("File does't delete.");
        });
    }
    onChange("");
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter") {
      setDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragleave") {
      setDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { files } = e.dataTransfer;

    if (files && files.length) {
      upload(null, files);
      setDragging(false);
    }
  };

  useEffect(() => {
    drop?.current?.addEventListener("dragenter", handleDragEnter);
    drop?.current?.addEventListener("dragover", handleDragOver);
    drop?.current?.addEventListener("dragleave", handleDragLeave);
    drop?.current?.addEventListener("drop", handleDrop);

    return () => {
      drop?.current?.addEventListener("dragenter", handleDragEnter);
      drop?.current?.addEventListener("dragover", handleDragOver);
      drop?.current?.addEventListener("dragleave", handleDragLeave);
      drop?.current?.addEventListener("drop", handleDrop);
    };
  }, []);

  return (
    <>
      <div ref={drop} className={`relative ${className}`}>
        <div
          className={`w-full flex flex-wrap h-full items-center bg-center bg-no-repeat bg-contain ${dragging ? "opacity-20" : ""
            }`}
          style={{ backgroundImage: `url('${process.env.REACT_APP_API_BLOB}${image}')` }}
        >
          {GlobalLoading ? (
            <TableLoading />
          ) : (
            <>
              <div className="w-full text-center justify-center inset-0">
                {image ? (
                  <div className="absolute top-0 right-0 text-sm p-1 text-center items-center">
                    {false && (
                      <>
                        <label
                          htmlFor={name}
                          className="inline-block w-6 h-6 text-indigo-500 cursor-pointer"
                        >
                          <span className="material-icons-outlined">edit</span>
                        </label>
                      </>
                    )}
                    <label
                      className="inline-block w-6 h-6 text-rose-500 cursor-pointer"
                      onClick={deleteImage}
                    >
                      <span className="material-icons-outlined">delete</span>
                    </label>
                  </div>
                ) : (
                  <>
                    <svg
                      className="mx-auto h-16 w-16 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                    <div className=" flex text-sm text-gray-600 justify-center">
                      <label
                        htmlFor={name}
                        className="relative mr-1 cursor-pointer bg-white rounded-md font-medium  focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span className="text-indigo-600 hover:text-indigo-500">
                          Upload a file
                        </span>

                        <input
                          type="file"
                          name={name}
                          accept="image/x-png,image/gif,image/jpeg"
                          {...rest}
                          onChange={upload}
                          className={`sr-only block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}
                        />
                      </label>
                      <p className="pl-1">
                        <span> or drag and drop</span>
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </>
                )}

                {name && (
                  <ErrorMessage name={name} component={FormErrorMessage} />
                )}
                {message && <FormErrorMessage>{message}</FormErrorMessage>}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ImageFile;
