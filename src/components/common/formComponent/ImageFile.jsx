import React, { useState, useEffect } from "react";
import { ErrorMessage } from "formik";
import FormErrorMessage from "components/common/alerts/FormErrorMessage";
import TableLoading from "../table/TableLoading";
import ImageUpload from "services/common/imageUpload/ImageUpload";
import { v4 as uuidv4 } from "uuid";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { useDispatch, useSelector } from "react-redux";
import { fi } from "date-fns/locale";

const ImageFile = ({
  type,
  name,
  className,
  divClass,
  label,
  buttonName = "Add",
  folderpath,
  url = null,
  onChange,
  editOff,
  InnerCompo,
  id,
  fileSize = 5000114.441,//in bytes
  ...rest
}) => {
  const permission = useSelector(store => store.permission);
  const [message, setMessage] = useState(false);
  const [image, setImage] = useState("");
  const [UploadLoading, setUploadLoading] = useState(false)

  const dispatch = useDispatch();
  const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);
  const [imageError, setImageError] = useState('');
  useEffect(() => {
    // if (url) {
    setImage(`${process.env.REACT_APP_API_BLOB}${url}`);
    // }
  }, [url, setImage]);

  const upload = (e) => {
    const formData = new FormData();

    const currentFile = e.target.files[0]
    const fileExt = currentFile?.name.split(".")
    const currentExt = fileExt[fileExt.length - 1]

    const currentImagName = `${uuidv4()}.${currentExt}`

    formData.append("files", e.target.files[0], currentImagName);
    formData.append("name", fileExt[0]);
    let FileExtension = fileExt.pop();
    if (!['jpg', 'jpeg', 'png', 'gif', 'JPG', 'JPEG', 'PNG', 'GIF'].includes(FileExtension)) {
      setImageError('Please Select proper image type like jpg, jpeg, png, gif.');
      return;
    } else {
      setImageError('');
    }
    if (currentFile && currentFile?.size > fileSize) {
      setImageError('File size should not be greater then 5mb.');
      return;
    } else {
      setImageError('');
    }
    // dispatch(setAddLoading(true))
    setUploadLoading(true)

    ImageUpload.uploadImage(folderpath, formData)
      .then((response) => {
        if (response.data.success) {
          onChange(response.data.data);
          setMessage(false);
        } else {
          setMessage("File does't upload successfully");
        }
        // dispatch(setAddLoading(false))
        setUploadLoading(false)

      })
      .catch((error) => {
        setMessage("File does't upload successfully");
        // dispatch(setAddLoading(false))
        setUploadLoading(false)

      });
  };
  const deleteImage = (e) => {
    // setUploadLoading(true)

    setImage("");
    if (onChange instanceof Function) {
      onChange("");
    }
    return;//do not remove thi line
    const filePath = url.replace(
      process.env.REACT_APP_API_BLOB ?? "https://redefinecommerce.blob.core.windows.net" + "/images/",
      ""
    );
    if (filePath) {
      ImageUpload.deleteImage(filePath)
        .then((response) => {
          if (response.data.data) {
            setMessage(false);
            setImage("")
          } else {
            setMessage("File does't delete.");
            setImage("")
          }
          setUploadLoading(false)
        })
        .catch((error) => {
          setMessage("File does't delete.");
          setImage("")
          setUploadLoading(false)
        });
    } else {
      setImage("")
      setUploadLoading(false)
    }

  };
  return (
    <>
      <div className={`${rest.uprdivclass ? rest.uprdivclass : ""} col-span-full border-2 border-dashed border-neutral-200 rounded-xl shadow relative`}>
        <div
          className={`${divClass ? divClass : " w-full flex flex-wrap items-center h-56 bg-center bg-no-repeat bg-contain"
            }`}
          style={{
            backgroundImage: `url('${image}`
          }}
        >
          {UploadLoading ? (
            <TableLoading className={'absolute'} />
          ) : (
            <>
              <div className="w-full text-center justify-center inset-0">
                <div >
                  {url !== null && url !== "" && url !== process.env.REACT_APP_API_BLOB ? (
                    <div className="absolute top-0 right-0 text-sm p-1 text-center items-center">
                      {false && (
                        <>
                          {(!rest.disabled && (permission?.isEdit || permission?.isDelete)) &&
                            <label
                              htmlFor={name}
                              className="inline-block w-6 h-6 text-indigo-500 cursor-pointer"
                            >
                              <span className="material-icons-outlined">
                                edit
                              </span>
                            </label>
                          }
                        </>
                      )}
                      {(!rest.disabled && (permission?.isEdit || permission?.isDelete)) &&
                        <label
                          className="inline-block w-6 h-6 text-rose-500 cursor-pointer"
                          onClick={deleteImage}
                        >
                          <span className="material-icons-outlined">delete</span>
                        </label>
                      }
                    </div>
                  ) : (
                    <>
                      {((!rest.disabled && (permission?.isEdit || permission?.isDelete))) && (
                        <label
                          htmlFor={name}
                          className="btn bg-blue-500 text-white justify-center cursor-pointer"
                          style={{ backgroundColor: "#6366f1" }}
                        >
                          {buttonName}
                        </label>
                      )}

                      {InnerCompo && <InnerCompo />}
                    </>
                  )
                  }
                  <input
                    type="file"
                    name={name}
                    id={id ? id : name}
                    accept="image/png, image/gif, image/jpeg"
                    {...rest}
                    onChange={upload}
                    className={`${className ? className : ""
                      } block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}
                  />
                </div >

                {name && (
                  <ErrorMessage name={name} component={FormErrorMessage} />
                )}
                {imageError && (
                  <FormErrorMessage >{imageError}</FormErrorMessage>
                )}
                {message && <FormErrorMessage>{message}</FormErrorMessage>}
              </div >
            </>
          )}
        </div >
      </div >
    </>
  );
};

export default ImageFile;
