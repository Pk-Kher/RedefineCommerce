import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import UserService from "services/admin/user/UserService";
import * as Yup from "yup";
import Dropdown from "components/common/formComponent/Dropdown";
import UserDetail from "./UserDetail";
import { Formik, Form as FormikForm, FieldArray } from "formik";
import DropdownService from "services/common/dropdown/DropdownService";
import Messages from "components/common/alerts/messages/Index";
import { RecStatusValuebyName } from "global/Enum";
import { ValidationMsgs } from "global/ValidationMessages";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { useDispatch, useSelector } from "react-redux";
import { serverError } from "services/common/helper/Helper";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const InviteUsers = () => {
  const [status, setStatus] = useState("");
  const [roles, setRoles] = useState([]);
  const dispatch = useDispatch();
  const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

  const submitHandler = (values, { resetForm }) => {
    const users = values.adminUserViewModel.map((values, index) => {
      return { ...values, recstatus: status };
    });

    if (status === RecStatusValuebyName.Draft) {
      dispatch(setAddLoading(true))

      UserService.createUsers({
        inviteUserModel: {
          ...values,
          adminUserViewModel: users,
        },
      })
        .then((response) => {
          if (response.data.success) {
            dispatch(
              setAlertMessage({
                view: true,
                type: "success",
                message: ValidationMsgs.user.created,
              })
            );
            resetForm({});
          } else {
            dispatch(
              setAlertMessage({
                view: true,
                type: "danger",
                message: serverError(response),
              })
            );
          }
          dispatch(setAddLoading(false))
        })
        .catch((errors) => {
          dispatch(
            setAlertMessage({
              view: true,
              type: "danger",
              message: ValidationMsgs.user.notCreated,
            })
          );
          dispatch(setAddLoading(false))
        });
    } else {
      dispatch(setAddLoading(true))

      UserService.inviteUsers({
        inviteUserModel: {
          ...values,
          adminUserViewModel: users,
        },
      })
        .then((response) => {
          if (response.data.success) {
            dispatch(
              setAlertMessage({
                view: true,
                type: "success",
                message: ValidationMsgs.user.created,
              })
            );
            resetForm({});
          } else {
            dispatch(
              setAlertMessage({
                view: true,
                type: "danger",
                message: serverError(response),
              })
            );
          }
          dispatch(setAddLoading(false))
        })
        .catch((errors) => {
          dispatch(
            setAlertMessage({
              view: true,
              type: "danger",
              message: ValidationMsgs.user.notCreated,
            })
          );
          dispatch(setAddLoading(false))
        });
    }

  };

  const schema = Yup.object().shape({
    adminUserViewModel: Yup.array()
      .of(
        Yup.object().shape({
          firstname: Yup.string().required(
            ValidationMsgs.user.firstNameRequired
          ),
          lastname: Yup.string().required(ValidationMsgs.user.lastNameRequired),
          email: Yup.string()
            .email(ValidationMsgs.user.Email)
            .required(ValidationMsgs.user.emailRequired),
          phone: Yup.string()
            .required(ValidationMsgs.common.phoneRequired)
            .matches(
              /^(\+\d{1,3}[- ]?)?\d{10}$/,
              ValidationMsgs.common.phoneMatches
            ),
        })
      )
      .required(ValidationMsgs.user.UserArray),
    roleId: Yup.number().when('adminUserViewModel', {
      is: (adminUserViewModel) => adminUserViewModel[0].isSuperUser !== true,
      then: Yup.number().min(1, ValidationMsgs.user.roleIdRequired).required(ValidationMsgs.user.roleIdRequired).typeError(ValidationMsgs.user.roleIdTypeError),
      otherwise: Yup.number().typeError(ValidationMsgs.user.roleIdTypeError)
    })
  })

  useEffect(() => {
    DropdownService.getDropdownValues("adminrole")
      .then((res) => {
        if (res.data.success) {
          setRoles(() => {
            return res.data.data;
            // return Object.keys(res.data.data).map((value, key) => {
            //   return { label: res.data.data[value], value: value };
            // });
          });
        }
      })
      .catch((err) => { });
  }, []);
  return (
    <>
      <title>Invite Users</title>
      <Formik
        initialValues={{
          adminUserViewModel: [
            {
              firstname: "",
              lastname: "",
              email: "",
              phone: "",
              isSuperUser: false,
              recstatus: RecStatusValuebyName.Draft,
            },
          ],
          roleId: 0,
          storeId: [],
        }}
        onSubmit={submitHandler}
        validationSchema={schema}
        validateOnMount={true}
      >
        {({ errors, touched, setFieldValue, values }) => {
          return (
            <FormikForm>
              <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/*  Cards  */}
                <div className="sm:flex sm:justify-between sm:items-center mb-8">
                  {/*  Page Title  */}
                  <div className="flex flex-wrap items-center">
                    <NavLink
                      to="/admin/Settings/user"
                      className="btn border-neutral-200 hover:border-neutral-400 text-gray-500 hover:text-gray-700 flex items-center mr-2"
                    >
                      <span className="material-icons-outlined"> west </span>
                    </NavLink>
                    {/*  Title  */}
                    <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
                      Invite User
                    </h1>
                  </div>
                  <div className="flex flex-wrap space-x-2">
                    <NavLink
                      to="/admin/Settings/user"
                      className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </NavLink>
                    <button
                      type="submit"
                      disabled={GlobalLoading}
                      onClick={() => {
                        setStatus(RecStatusValuebyName.Pending);
                        dispatch(setAlertMessage({ type: "danger", message: serverError({ data: { errors: errors } }) }));
                      }}
                      // className="btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white"
                      className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(GlobalLoading) ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}
                      id={RecStatusValuebyName.Pending}
                    >
                      <div className={`w-full flex justify-center align-middle `}>
                        {GlobalLoading && (
                          <span className="spinner-border spinner-border-sm mr-2"></span>
                        )}
                        Invite
                      </div>
                    </button>
                    <button
                      disabled={GlobalLoading}
                      type="submit"
                      onClick={() => { setStatus(RecStatusValuebyName.Draft); dispatch(setAlertMessage({ type: "danger", message: serverError({ data: { errors: errors } }) })); }}
                      className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(GlobalLoading) ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}
                      id={RecStatusValuebyName.Draft}
                    >
                      <div className={`w-full flex justify-center align-middle `}>
                        {GlobalLoading && (
                          <span className="spinner-border spinner-border-sm mr-2"></span>
                        )}
                        Save
                      </div>
                    </button>
                  </div>
                </div>

                <Messages />

                <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
                  <FieldArray
                    name="adminUserViewModel"
                    render={(fieldArrayProps) => {
                      const { form } = fieldArrayProps;
                      return (
                        <>
                          {form.values.adminUserViewModel.map((value, i) => {
                            return (
                              <UserDetail
                                fieldArrayProps={fieldArrayProps}
                                key={i}
                                index={i}
                                status={status}
                              />
                            );
                          })}

                          <div className="flex w-full mt-4">
                            <div className="w-1/3 mb-6 mr-5">
                              {
                                !values.adminUserViewModel[0].isSuperUser && <>
                                  <label
                                    className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2"
                                    htmlFor="grid-first-name"
                                  >
                                    Role
                                  </label>
                                  <Dropdown
                                    label="Roles"
                                    isMulti={false}
                                    name="roleId"
                                    options={roles}
                                    defaultValue={values.roleId}
                                  />
                                </>
                              }
                            </div>

                            <div className="w-2/3 mb-6 mr-5 text-right mt-2">
                              <label
                                className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-5"
                                htmlFor="grid-first-name"
                              ></label>
                              <span
                                onClick={() => {
                                  fieldArrayProps.push({
                                    firstname: "",
                                    lastname: "",
                                    email: "",
                                    phone: "",
                                    isSuperUser: false,
                                    recstatus: RecStatusValuebyName.Draft,
                                  });
                                }}
                                className="text-indigo-500 hover:text-indigo-600 cursor-pointer"
                              >
                                + Add another team member
                              </span>
                            </div>
                          </div>
                        </>
                      );
                    }}
                  />

                  {/* <Store /> */}
                </div>
              </div>
            </FormikForm>
          );
        }}
      </Formik>
    </>
  );
};

export default InviteUsers;
