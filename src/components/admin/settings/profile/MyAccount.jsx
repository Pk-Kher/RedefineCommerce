/*Component Name: UserMenu
Component Functional Details: My Account.
Created By: -
Created Date: -
Modified By: Pradip
Modified Date: 6-1-2022 */

import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Input from "components/common/formComponent/Input";
import Checkbox from "components/common/formComponent/Checkbox";
import UserService from "services/admin/user/UserService";
import ImageUpload from "services/common/imageUpload/ImageUpload";
import { useDispatch, useSelector } from "react-redux";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { blobFolder, RecStatusValuebyName } from "global/Enum";
import { ValidationMsgs } from "global/ValidationMessages";
import AuthService from "services/admin/auth/AuthService";
import FormErrorMessage from "components/common/alerts/FormErrorMessage";
import { v4 as uuidv4 } from "uuid";
import { serverError } from "services/common/helper/Helper";
import { setUser as storeUserInfo } from "redux/user/UserActions";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import UserAvatar from "assets/images/userAvatar.png";

const MyAccount = ({ setFormSubmit, setUserId, userId, setFormErrors, isReadOnly }) => {
  const permission = useSelector(store => store.permission);
  const { id: urlId } = useParams();
  const [id, setId] = useState(urlId);
  const location = useSelector((store) => store?.location);
  const navigation = useNavigate();
  const formRef = useRef();
  const dispatch = useDispatch();
  const CurrentUserObject = useSelector((store) => store?.user)
  const [showPassword, setShowPassword] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [user, setUser] = useState({});
  const CompanyId = useSelector((store) => store?.CompanyConfiguration.id)

  const FolderPath = `/${blobFolder.temp}/${CompanyId}/${blobFolder.account}/${blobFolder.user}`

  useEffect(() => {
    if (id) {
      setUserId(id);
    } else {
      setUserId(CurrentUserObject.id);
      setId(CurrentUserObject.id);
    }
  }, [CurrentUserObject, setUserId, id]);

  const validationSchema = Yup.object().shape({
    userPhoto: Yup.mixed().test('fileFormat', ValidationMsgs.profile.myAccount.imageRequired, (value) => {
      var temp = value ? value.split(".") : [];
      if (temp.length === 0) {
        return true;
      }
      return temp.length > 0 && ['jpeg', 'png', 'jpg', 'gif'].includes(temp[temp.length - 1]);
    }),
    firstname: Yup.string().required(
      ValidationMsgs.profile.myAccount.firstNameRequired
    ),
    lastname: Yup.string().required(
      ValidationMsgs.profile.myAccount.lastNameRequired
    ),
    phone: Yup.string()
      .required(ValidationMsgs.common.phoneRequired)
      .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, ValidationMsgs.common.phoneMatches),
    // email: Yup.string().email("Invalid email format").required("Email is Required"),
  });

  const ChangePassWordValidations = Yup.object().shape({
    currentPassword: Yup.string().when(`${showPassword}`, {
      is: true, // alternatively: (val) => val == true
      then: Yup.string().required(ValidationMsgs.profile.myAccount.currentPasswordRequired)
    }),
    newPassword: Yup.string()
      .test(
        "setpassword",
        ValidationMsgs.profile.myAccount.newPasswordRequired,
        function (value) {
          if (showPassword && value === undefined) return false;
          return true;
        }
      )
      .min(8, ValidationMsgs.profile.myAccount.newPasswordMin).max(25, ValidationMsgs.profile.myAccount.newPasswordMax),
    confirm_password: Yup.string()
      .test(
        "setpassword",
        ValidationMsgs.profile.myAccount.confirm_passwordRequired,
        function (value) {
          if (showPassword && value === undefined) return false;
          return true;
        }
      )
      .when("newPassword", {
        is: (val) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref("newPassword")],
          ValidationMsgs.profile.myAccount.confirm_passwordMatches
        ),
      }),
  });

  useEffect(() => {
    setFormSubmit(formRef.current);
  }, [formRef, setFormSubmit, user]);

  useEffect(() => {
    if (id) {
      setEditLoading(true)
      dispatch(setAddLoading(true))

      UserService.getUserById(id)
        .then((response) => {
          if (response.data.data) {
            setUser(response.data.data);
          } else {
            dispatch(
              setAlertMessage({
                message: ValidationMsgs.user.userNotAvailable,
                type: "danger",
              })
            );
            // navigation('/admin/Settings/user');
          }
          setEditLoading(false)
          dispatch(setAddLoading(false))

        })
        .catch((error) => {
          navigation("/admin/Settings/user");
          dispatch(setAddLoading(false))

        });
    }
  }, [id, navigation, dispatch]);

  const submitHandler = (values) => {
    dispatch(setAddLoading(true))

    UserService.updateUser({ adminUserModel: values })
      .then((response) => {
        if (response.data.success) {
          dispatch(
            setAlertMessage({
              message: ValidationMsgs.user.updated,
              type: "success",
            })
          );
          if (userId === String(CurrentUserObject?.id)) {
            dispatch(storeUserInfo(response.data.data))
          }
          dispatch(setAddLoading(false))

        } else {
          dispatch(
            setAlertMessage({
              message: serverError(response),
              type: "danger",
            })
          );
          dispatch(setAddLoading(false))

        }
      })
      .catch((error) => {
        dispatch(
          setAlertMessage({
            message: ValidationMsgs.user.notUpdated,
            type: "danger",
          })
        );
        dispatch(setAddLoading(false))

      });
  };

  const ChangePasswordHandler = (values, { resetForm }) => {
    dispatch(setAddLoading(true));
    UserService.changePassword({
      args: {
        id: values.id,
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      },
    })
      .then((response) => {
        if (response.data.data) {
          dispatch(
            setAlertMessage({
              message: ValidationMsgs.profile.myAccount.passwordChanged,
              type: "success",
            })
          );
          setShowPassword(false);
          resetForm({});
        } else {
          dispatch(
            setAlertMessage({
              // message: ValidationMsgs.profile.myAccount.validPassword,
              message: serverError(response),
              type: "danger",
            })
          );
        }
        dispatch(setAddLoading(false));
      })
      .catch(() => {
        dispatch(setAddLoading(false));
      });


  };

  const sendUserInvitation = () => {
    dispatch(setAddLoading(true));
    AuthService.sendResetPasswordLink(user.email).then((response) => {
      if (response?.data?.data?.issend) {
        dispatch(setAlertMessage({
          type: "success",
          message: ValidationMsgs.profile.myAccount.linkSend
        }));
      } else {
        dispatch(setAlertMessage({
          type: "danger",
          message: ValidationMsgs.profile.myAccount.emailNotSend
        }));
      }
      dispatch(setAddLoading(false));
    }).catch((error) => {
      dispatch(setAddLoading(false));
    })
  }

  const uploadImage = (setFieldValue, e) => {
    const formData = new FormData();

    const currentFile = e.target.files[0].name
    const fileExt = currentFile.split(".")
    const currentExt = fileExt[fileExt.length - 1]

    const currentImagName = `${uuidv4()}.${currentExt}`

    formData.append("files", e.target.files[0], currentImagName);
    formData.append("name", fileExt[0]);


    ImageUpload.uploadImage(FolderPath, formData)
      .then((response) => {
        if (response.data.success) {
          setFieldValue("userPhoto", response.data.data);
        }
      })
      .catch((error) => { });
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <h2 className="text-2xl text-gray-800 font-bold mb-5">My Account</h2>
        <Formik
          enableReinitialize={true}
          initialValues={{
            id: user.id,
            userPhoto: user.userPhoto || "",
            firstname: user.firstname || "",
            lastname: user.lastname || "",
            email: user.email,
            phone: user.phone || "",
            isNewsSubscription: user?.isNewsSubscription || false,
            isSuperUser: user.isSuperUser || false,
            recstatus: user.recstatus || RecStatusValuebyName.Active,
            ...location
          }}
          onSubmit={submitHandler}
          validationSchema={validationSchema}
          innerRef={formRef}
        >
          {({ errors, touched, setFieldValue, values, handleSubmit }) => {
            return (
              <>
                <Form>
                  <ErrorHandler setFormErrors={setFormErrors} errors={errors} />
                  <section className="pb-7">
                    <div className="flex items-center">
                      <div className="mr-4 w-20 h-20 rounded-full overflow-hidden flex items-center justify-center">
                        <img
                          src={
                            values.userPhoto ? `${process.env.REACT_APP_API_BLOB}${values.userPhoto}` :
                              UserAvatar
                          }
                          alt="User upload"
                          width="80"
                          height="80"
                        />
                      </div>
                      {(permission?.isEdit || permission?.isDelete) && <div>
                        <label htmlFor={"userPhoto"} className="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer" style={{ backgroundColor: "#6366f1" }} >
                          {"Change"}
                        </label>
                        <div className="text-xs">
                          recommended size 80px to 80px (width to height) &amp;
                          (JPG, PNG)
                        </div>
                        <input
                          type="file"
                          name={"userPhoto"}
                          id={"userPhoto"}
                          onChange={uploadImage.bind(null, setFieldValue)}
                          className={`hidden w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}
                        />
                        <ErrorMessage name="userPhoto" component={FormErrorMessage} />
                      </div>}
                    </div>
                  </section>
                  <section>
                    <h3 className="text-xl leading-snug text-gray-800 font-bold mb-1">
                      User Profile
                    </h3>
                    <div className="text-sm">
                      You may edit this page to include additional informaiton
                      about yourself.
                    </div>
                    <div className="sm:flex sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                      <div className="sm:w-1/3">
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="name"
                        >
                          First Name
                          <span className="text-rose-500 text-2xl leading-none">*</span>
                        </label>
                        <Input
                          className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md"
                          id="firstname"
                          type="text"
                          name="firstname"
                          placeholder="First Name"
                          maxLength={25}
                        />

                        {
                          (CurrentUserObject?.isSuperUser) && <label className="text-gray-500 flex items-start mt-3">
                            <Checkbox
                              className="mt-1"
                              name="isSuperUser"
                              id="isSuperUser"
                              checked={values.isSuperUser}
                              disabled={isReadOnly}
                              onChange={(e) => {
                                if (!isReadOnly) {
                                  setFieldValue(
                                    "isSuperUser",
                                    e.target.checked
                                  )
                                }
                              }
                              }
                            />
                            <span className="ml-2">
                              Super User
                            </span>
                          </label>
                        }

                      </div>
                      <div className="sm:w-1/3">
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="business-id"
                        >
                          Last Name
                          <span className="text-rose-500 text-2xl leading-none">*</span>
                        </label>
                        <Input
                          id="lastname"
                          name="lastname"
                          className="form-input w-full"
                          type="text"
                          placeholder="Last Name"
                          maxLength={25}
                        />
                      </div>
                      <div className="sm:w-1/3">
                        <label
                          className="block text-sm font-medium mb-1"
                          htmlFor="phone"
                        >
                          Phone Number
                          <span className="text-rose-500 text-2xl leading-none">*</span>
                        </label>
                        <Input
                          id="phone"
                          className="form-input w-full"
                          type="text"
                          name="phone"
                          placeholder="Phone Number"
                          maxLength="15"
                        />
                        <label className="text-gray-500 flex items-start mt-3">
                          <Checkbox
                            className="mt-1"
                            name="acceptNewsletter"
                            id="acceptNewsletter"
                            checked={values?.isNewsSubscription}
                            onChange={(e) =>
                              setFieldValue(
                                "isNewsSubscription",
                                e.target.checked
                              )
                            }
                          />
                          <span className="ml-2">
                            Accept To Receive Promotional Newsletter
                          </span>
                        </label>
                      </div>
                    </div>
                  </section>
                  <section>
                    <h3 className="text-xl leading-snug text-gray-800 font-bold mb-1 mt-4">
                      Email
                    </h3>
                    <div className="flex flex-wrap mt-5">
                      <div className="mr-2">
                        <label className="sr-only" htmlFor="email">
                          Email
                        </label>
                        <div className="text-sm font-bold text-gray-500">
                          {user.email}
                        </div>
                      </div>
                      {urlId !== String(CurrentUserObject?.id) && (permission?.isEdit || permission?.isDelete) && (
                        <button
                          type="button"
                          className="btn border-gray-200 hover:border-gray-300 shadow-sm text-indigo-500 ml-6"
                          onClick={sendUserInvitation}
                        >
                          Resend invitation
                        </button>
                      )}
                    </div>
                  </section>
                </Form>
              </>
            );
          }}
        </Formik>
        {urlId === String(CurrentUserObject?.id) && (permission?.isEdit || permission?.isDelete) && (
          <Formik
            Formik
            enableReinitialize={true}
            initialValues={{
              id: user.id,
              currentPassword: "",
              newPassword: "",
              confirm_password: "",
            }}
            onSubmit={ChangePasswordHandler}
            validationSchema={ChangePassWordValidations}
            validateOnMount={true}
          >
            {({ errors, touched, setFieldValue, values, handleSubmit }) => {
              return (
                <>
                  <ErrorHandler setFormErrors={setFormErrors} errors={errors} />
                  <Form>
                    <section>
                      <h3 className="text-xl leading-snug text-gray-800 font-bold mb-1">
                        Password
                      </h3>
                      <div className="text-sm">
                        You can set a permanent password if you don't want to
                        use temporary login codes.
                      </div>
                      <div className="mt-5">
                        <button
                          type="button"
                          onClick={() => {
                            setFieldValue("password", "");
                            setFieldValue("confirm_password", "");
                            setShowPassword(!showPassword);
                          }}
                          className="btn border-gray-200 hover:border-gray shadow-sm text-indigo-500"
                        >
                          Set New Password
                        </button>
                        <div className={`${!showPassword && "hidden"}`}>
                          <div
                            className={`sm:flex sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 mt-5`}
                          >
                            <div className="sm:w-1/3">
                              <label
                                className="block text-sm font-medium mb-1"
                                htmlFor=""
                              >
                                Current Password
                              </label>
                              <Input
                                id="currentPassword"
                                disabled={!showPassword}
                                name="currentPassword"
                                className="form-input w-full"
                                type="password"
                                placeholder="Current Password"
                              />
                            </div>
                            <div className="sm:w-1/3">
                              <label
                                className="block text-sm font-medium mb-1"
                                htmlFor=""
                              >
                                New Password
                              </label>
                              <Input
                                id="newPassword"
                                disabled={!showPassword}
                                name="newPassword"
                                className="form-input w-full"
                                type="password"
                                placeholder="New Password"
                              />
                            </div>
                            <div className="sm:w-1/3">
                              <label
                                className="block text-sm font-medium mb-1"
                                htmlFor=""
                              >
                                Re-enter New Password
                              </label>
                              <Input
                                id="confirm_password"
                                disabled={!showPassword}
                                name="confirm_password"
                                className="form-input w-full"
                                type="password"
                                placeholder="Re-enter New Password"
                              />
                            </div>
                          </div>
                          <div className="mt-5 flex-col-reverse">
                            <div className="text-right">
                              <button className="btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white">
                                Change Password
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </Form>
                </>
              );
            }}
          </Formik>
        )}
      </div>
    </>
  );
};

export default MyAccount;

const ErrorHandler = ({ errors = {}, setFormErrors }) => {
  useEffect(() => {
    setFormErrors(errors);
  }, [errors]);
  return ("");
}
