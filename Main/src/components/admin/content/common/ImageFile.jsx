import React, { useState, useEffect } from "react";
import ImageUpload from "services/common/imageUpload/ImageUpload";
// import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
// import { useDispatch, useSelector } from "react-redux";

const ImageFile = ({
  type,
  name,
  className,
  divClass,
  label,
  buttonName,
  folderpath,
  url,
  backProp,
  onChange,
  editOff,
  InnerCompo,
  edibtn,
  ...rest
}) => {
  // const dispatch = useDispatch();
  // const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);
  const [UploadLoading, setUploadLoading] = useState(false)

  const [message, setMessage] = useState(false);
  const [image, setImage] = useState(`${url}`);
  useEffect(() => {
    setImage(`${url}`);
  }, [url, setImage, backProp]);

  const upload = (e) => {
    const formData = new FormData();
    formData.append("files", e.target.files[0]);
    setUploadLoading(true)

    ImageUpload.uploadImage(folderpath, formData)
      .then((response) => {

        if (response.data.success == true) {
          onChange(`${process.env.REACT_APP_API_BLOB}` + response.data.data);
          setImage(`${process.env.REACT_APP_API_BLOB}` + response.data.data);
          setMessage(false);
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
  const deleteImage = (e) => {
    setUploadLoading(true)

    const filePath = url.replace(
      "https://redefinecommerce.blob.core.windows.net/images/",
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
          setUploadLoading(false)

        })
        .catch((error) => {
          setMessage("File does't delete.");
          setUploadLoading(false)

        });
    }
    if (onChange instanceof Function) {
      onChange("");
    }
  };
  return (
    <>
      <div className="col-span-full border-2 border-dashed border-neutral-200 rounded-xl shadow relative">
        <div
          className={`${divClass ? divClass : " w-full flex flex-wrap items-center h-56 bg-center bg-no-repeat bg-contain"
            }`}
          style={{ backgroundImage: image != '' ? `url('${image}')` : '' }}
        >
          {UploadLoading ? (
            <p>Loading</p>
          ) : (
            <>
              <div className="w-full text-center justify-center inset-0">
                <div >
                  {(image != '' && image != `${process.env.REACT_APP_API_BLOB}`) ? (
                    <div className="absolute top-0 right-0 text-sm p-1 text-center items-center">
                      {edibtn && (
                        <>
                          <label
                            htmlFor={name}
                            className="inline-block w-6 h-6 text-indigo-500 cursor-pointer"
                          >
                            <span className="material-icons-outlined">
                              edit
                            </span>
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
                      {buttonName && (
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
                  )}
                  <input
                    type="file"
                    name={name}
                    accept="image/png, image/gif, image/jpeg"
                    {...rest}
                    onChange={upload}
                    className={`${className ? className : ""
                      }  block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}
                  />
                </div>

                {/* {name && (
                  <p></p>
                )} */}
                {message && <p>{message}</p>}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ImageFile;
