/*Component Name: EditcustomLogo
Component Functional Details: User can create or update EditcustomLogo master details from here.
Created By: Shrey Patel
Created Date: 12/29/2022
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import React, { useEffect, useRef, useState } from "react";
import FileComponent from "components/common/formComponent/File";
import { blobFolder, RecStatusValuebyName } from "global/Enum";
import { useDispatch, useSelector } from "react-redux";
import ImageFile from 'components/common/formComponent/ImageFile';
import { Form as FormikForm, Formik } from "formik";
import * as Yup from "yup";
import Input from 'components/common/formComponent/Input';
import { useParams } from "react-router-dom";
import Textarea from "components/common/formComponent/Textarea";
import ColorPicker from "components/common/formComponent/ColorPicker";
import Image from 'components/common/formComponent/Image';
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { DateTimeFormat, serverError } from "services/common/helper/Helper";
import CustomerLogoService from "services/admin/customerLogo/CustomerLogoService";
import { ValidationMsgs } from "global/ValidationMessages";

const EditcustomLogo = ({ setEditCustomLogo, CustomLogoId, Data }) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const CompanyId = useSelector((store) => store?.CompanyConfiguration.id)
    const location = useSelector((store) => store?.location);
    const AdminId = useSelector((store) => store?.user?.id);
    const permission = useSelector(store => store?.permission)

    const [APIType, setAPIType] = useState("SubmitFeedBack");
    const [CustomerLogoDetails, setCustomerLogoDetails] = useState([]);

    const [DigitalLogoData, setDigitalLogoData] = useState({});
    const [SewOutLogoData, setSewOutLogoData] = useState({});
    const [JpegLogoData, setJpegLogoData] = useState({});

    const [ShowDigital, setShowDigital] = useState(false);
    const [ShowSewOutLogo, setShowSewOutLogo] = useState(false);
    const [ShowJpegLogo, setShowJpegLogo] = useState(false);

    const getAllCustomerLogDetailsById = () => {
        CustomerLogoService.getAllCustomerLogoById(CustomLogoId)
            .then((response) => {
                if (response.data.success) {
                    setCustomerLogoDetails(response.data.data);
                }
            }).catch((errors) => { });
    };

    const submitFeedBack = (values, resetForm) => {
        dispatch(setAddLoading(true))
        if (APIType === "ApproveLogo") {
            CustomerLogoService.ApproveLogo({ customeradminlogodescriptionrequestmodel: { ...values, ...location } })
                .then((response) => {
                    if (response.data.success) {
                        dispatch(
                            setAlertMessage({ type: "success", message: "Logo Approved successfully." })
                        )
                        getAllCustomerLogDetailsById()
                        resetForm({})
                    } else {
                        dispatch(
                            setAlertMessage({ type: "danger", message: serverError(response) })
                        );
                    }
                    dispatch(setAddLoading(false))
                })
                .catch((errors) => {
                    dispatch(setAlertMessage({ type: "danger", message: "Logo not approved." }));
                    dispatch(setAddLoading(false))
                });
        } else {
            CustomerLogoService.SubmitFeedBack({ customeradminlogodescriptionrequestmodel: { ...values, ...location } })
                .then((response) => {
                    if (response.data.success) {
                        dispatch(
                            setAlertMessage({ type: "success", message: "Feedback submitted successfully." })
                        )
                        getAllCustomerLogDetailsById()
                        resetForm({})
                    } else {
                        dispatch(
                            setAlertMessage({ type: "danger", message: serverError(response) })
                        );
                    }
                    dispatch(setAddLoading(false))
                })
                .catch((errors) => {
                    dispatch(setAlertMessage({ type: "danger", message: "Feedback not submitted." }));
                    dispatch(setAddLoading(false))
                });
        }
    };

    const onSubmit = (fields, { resetForm }) => {
        submitFeedBack(fields, resetForm);
    }

    const LogoDetailsData = () => {
        setDigitalLogoData(CustomerLogoDetails.find(DigitalLogoDetails => {
            return DigitalLogoDetails.name === 'digital logo';
        }));
        setSewOutLogoData(CustomerLogoDetails.find(sewOutLogo => {
            return sewOutLogo?.name.includes('sew-out logo');
        }))
        setJpegLogoData(CustomerLogoDetails.find(jpegLogo => {
            return jpegLogo?.name.includes('jpeg logo');
        }))
    }

    useEffect(() => {
        getAllCustomerLogDetailsById()
    }, [])

    const validationSchema = Yup.object({
        logoSize: Yup.string().required(ValidationMsgs.customer.logoSize),
        longDescription: Yup.string().required(ValidationMsgs.customer.CustomLogoMessage),
    });

    return (
        <>
            <div className="flex justify-between">
                <div className="flex items-center">
                    <button
                        onClick={() => { setEditCustomLogo(false) }}
                        className="btn border-neutral-200 hover:border-neutral-400 text-gray-500 hover:text-gray-700 flex items-center mr-2"
                    >
                        <span className="material-icons-outlined">west</span>
                    </button>
                    <h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
                        Back
                    </h1>
                </div>
            </div>
            <div className="">
                <div className="p-6">
                    {(CustomerLogoDetails.find(jpegLogo => {
                        return jpegLogo?.name.includes('jpeg logo');
                    })) ?
                        <>
                            {DigitalLogoData?.isApproved &&
                                <SewOutLogo CustomerId={id} CustomLogoId={CustomLogoId} validationSchema={validationSchema} Data={Data} CompanyId={CompanyId} AdminId={AdminId} permission={permission} onSubmit={() => onSubmit} ShowSewOutLogo={ShowSewOutLogo} setShowSewOutLogo={setShowSewOutLogo} SewOutLogoData={SewOutLogoData} CustomerLogoDetails={CustomerLogoDetails} LogoDetailsData={() => LogoDetailsData()} setAPIType={setAPIType} />
                            }
                            {JpegLogoData.isApproved &&
                                <DigitalLogo CustomerId={id} CustomLogoId={CustomLogoId} validationSchema={validationSchema} Data={Data} CompanyId={CompanyId} AdminId={AdminId} permission={permission} onSubmit={() => onSubmit} ShowDigital={ShowDigital} setShowDigital={setShowDigital} DigitalLogoData={DigitalLogoData} CustomerLogoDetails={CustomerLogoDetails} LogoDetailsData={() => LogoDetailsData()} setAPIType={setAPIType} />
                            }
                            {JpegLogoData !== "" &&
                                <JpegLogo CustomerId={id} CustomLogoId={CustomLogoId} validationSchema={validationSchema} Data={Data} CompanyId={CompanyId} AdminId={AdminId} permission={permission} onSubmit={() => onSubmit} ShowJpegLogo={ShowJpegLogo} setShowJpegLogo={setShowJpegLogo} JpegLogoData={JpegLogoData} CustomerLogoDetails={CustomerLogoDetails} LogoDetailsData={() => LogoDetailsData()} />
                            }
                        </>
                        :
                        <label className={`cursor-pointer block bg-white shadow-lg rounded-md border border-neutral-200 p-6`}>
                            <div>
                                <div className="font-semibold text-red-400 text-lg"> No Data Found! Please Order First</div>
                            </div>
                        </label>
                    }
                </div>
            </div>
        </>
    );
};

export default EditcustomLogo;

const SewOutLogo = ({ CustomerId, CustomLogoId, Data, CompanyId, AdminId, permission, onSubmit, ShowSewOutLogo, setShowSewOutLogo, CustomerLogoDetails, SewOutLogoData, LogoDetailsData, setAPIType, validationSchema }) => {

    const FolderPath = `/${blobFolder.temp}/${CompanyId}/${blobFolder.customLogo}${!CustomerId ? "/0" : `/${CustomerId}`}/logoImageName`

    const [ShowDigitalLogo, setShowDigitalLogo] = useState("");// For Embroidery color 
    const [ShowLogoApproved, setShowLogoApproved] = useState({});

    const [ColorData, setColorData] = useState("");
    const [colors, setColors] = useState([]);
    const [check, setCheck] = useState("");

    const MouseHoverEvent = (MouseHoverId) => {
        setCheck(MouseHoverId)
    }

    const addColor = (values) => {
        if (values.haxCode !== "") {
            let newColor = { id: colors.length + 1, hexCode: values.hexCode };
            setColors([...colors, newColor]);
        } else {
            setColors(ColorData);
        }
    };

    const deleteColor = (index) => {
        let copy_color = [...colors];
        copy_color.splice(index, 1);

        setColors(copy_color);
    };

    useEffect(() => {
        if (ShowDigitalLogo !== "") {
            let getEmbroideryColor = ShowDigitalLogo?.split(',').map((item, index) => {
                return { id: index, hexCode: item }
            })
            setColors(getEmbroideryColor)
        }
        LogoDetailsData()
    }, [CustomerLogoDetails, ShowDigitalLogo])

    useEffect(() => {
        setShowSewOutLogo(ShowLogoApproved.isApproved == true ? true : false)
    }, [ShowLogoApproved])


    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    hexCode: "",
                    EmbrodaryColor: [],
                    embroideryColor: ColorData,
                    id: 0,
                    rowVersion: "",
                    customerId: CustomerId,
                    customerLogoId: CustomLogoId || 0,
                    adminId: AdminId,
                    longDescription: "",
                    logoImageName: SewOutLogoData?.imageUrl || "",
                    isApproved: ShowLogoApproved?.ApproveLogo || false,
                    approvedDate: "",
                    logoType: 2,
                    isAdmin: 0,
                    logoSize: ShowLogoApproved?.logoSize || "",
                    parentId: ShowLogoApproved.id
                }}
                onSubmit={onSubmit()}
                validationSchema={validationSchema}
                validateOnMount={true}
            >
                {({ setFieldValue, errors, values, setValues }) => {
                    let catalogFileUrl = values.logoImageName.split('/')
                    let FinalData = "";
                    return (
                        <FormikForm>
                            <div className="manage-logo-detail text-gray-500 mb-10 last:mb-4">
                                <div className="text-2xl text-gray-800 font-bold mb-5">Sew-out</div>
                                <div className="border border-neutral-200 grid grid-cols-3 gap-x-6 rounded-md">
                                    <div className="left-side-box col-span-1 p-6 pr-0">
                                        <div className="relative">
                                            <div className="">
                                                {values && values.logoImageName.includes("/rdc/") ?
                                                    <img className='flex justify-center border-spacing-1 border-dashed border-2 border-neutral-200 rounded-lg h-96 w-full text-center' src={`${process.env.REACT_APP_API_BLOB}${values.logoImageName}`} alt={'No Image'} />
                                                    :
                                                    <img className='flex justify-center border-spacing-1 border-dashed border-2 border-neutral-200 rounded-lg h-96 w-full text-center bg-sky-400/10' alt="No Image" />
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-2 bg-gray-50 p-6 rounded-r-md text-sm">
                                        <div className="">
                                            <div className="flex items-center justify-between gap-2 mb-3">
                                                <div className="w-1/3 min-w-44 font-bold">{Data?.[0].logoName}</div>
                                                <div className=""></div>
                                            </div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-1/3 min-w-44 font-semibold">Logo uploaded on:</div>
                                                <div className="">{DateTimeFormat(Data?.[0].uploadDate, "MMMM dd, yyyy").date}</div>
                                            </div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-1/3 min-w-44 font-semibold">Logo size:</div>
                                                <div className="">
                                                    <Input readOnly={ShowSewOutLogo} className={`w-1/2 rounded-md ${ShowSewOutLogo ? "bg-slate-200" : ""} `} type="text" name="logoSize" placeholder={`2x2"`} defaultValue={values?.logoSize} onChange={(e) => setFieldValue("logoSize", e.target.value)} maxLength={10} />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 mb-1">
                                                <div className="w-1/3 min-w-44 font-semibold">Embroidery color:</div>
                                                {colors && colors?.length > 0 && colors.map((color, index) => {
                                                    return (
                                                        <div key={index} className="relative">
                                                            {setColorData(FinalData = !FinalData ? FinalData.concat(color.hexCode) : FinalData.concat(",", color.hexCode))}
                                                            {(permission?.isEdit || permission?.isDelete) &&
                                                                <>
                                                                    {ShowSewOutLogo ? "" :
                                                                        <>
                                                                            {((color.recStatus !== RecStatusValuebyName.Archived) && (check == index)) && (
                                                                                <button
                                                                                    id={index}
                                                                                    onMouseLeave={() => MouseHoverEvent(undefined)}
                                                                                    type="button"
                                                                                    className="inline-block w-6 h-6 cursor-pointer absolute border border-gray-500 text-red-600 bg-gray-300"
                                                                                    onClick={() => {
                                                                                        deleteColor(index)
                                                                                    }}
                                                                                >
                                                                                    <span className="material-icons">delete</span>
                                                                                </button>
                                                                            )}
                                                                        </>}
                                                                </>}
                                                            <div
                                                                key={index}
                                                                id={index}
                                                                className="flex justify-center items-center text-white border border-gray-500 h-6 w-6"
                                                                onMouseEnter={(e) => MouseHoverEvent(e.target.id)}
                                                                style={{
                                                                    backgroundColor: color.hexCode,
                                                                    borderColor: "black",
                                                                }}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                                {(permission?.isEdit || permission?.isDelete) &&
                                                    <>
                                                        {ShowSewOutLogo ? "" :
                                                            <>
                                                                <div className="col-span-full sm:col-span-6 xl:col-span-8">
                                                                    <div className="max-w-sm mx-auto">
                                                                        <div className="">
                                                                            <div className="flex items-center">
                                                                                <ColorPicker
                                                                                    name="hexCode"
                                                                                    maxLength={12}
                                                                                    isDisabled={true}
                                                                                    defaultValue={values.hexCode}
                                                                                />
                                                                                <div className="ml-1"><button className="btn btn-sm bg-indigo-500 hover:bg-indigo-600 text-white" type="button" onClick={() => addColor(values)}>Add</button></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>}
                                                    </>}
                                            </div>
                                            <div className="font-semibold">Comment:</div>
                                            <div className="overflow-auto max-h-screen border border-neutral-200 mb-4 rounded-md">
                                                <table className="table-auto w-full text-sm text-[#191919]">
                                                    <tbody className="text-sm divide-y divide-slate-200">
                                                        {SewOutLogoData?.comments ?
                                                            SewOutLogoData?.comments.length > 0 && SewOutLogoData?.comments.map((comment, index) => {
                                                                setShowLogoApproved(SewOutLogoData?.comments[SewOutLogoData?.comments.length - 1])
                                                                setShowDigitalLogo(SewOutLogoData?.comments[SewOutLogoData?.comments?.length - 1].embroideryColor)
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="px-2 first:pl-5 py-3 font-semibold first-letter:capitalize"> {comment?.senderName} :
                                                                            <div className="font-semibold first-letter:capitalize">({comment?.senderType})</div>
                                                                        </td>
                                                                        <td className="px-2  py-3">
                                                                            <div className="font-semibold">{DateTimeFormat(comment?.date, "MMMM dd, yyyy").date}</div>
                                                                            <div className="text-gray-500">{comment?.message}</div>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            "Please add some comments"
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="mb-4">
                                                {ShowSewOutLogo ?
                                                    <div className="w-full px-2 py-1 text-lg leading-7 bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                                        {catalogFileUrl ? catalogFileUrl[catalogFileUrl.length - 1] : ""}
                                                    </div>
                                                    :
                                                    <>
                                                        {(permission?.isEdit || permission?.isDelete) &&
                                                            <>
                                                                <FileComponent
                                                                    type="file"
                                                                    className="w-full px-2 py-1 text-sm leading-7 bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md"
                                                                    folderpath={`${FolderPath}`}
                                                                    name="logoImageName"
                                                                    // filePath={'files'}
                                                                    // isChangeDefaultName={true}
                                                                    value={catalogFileUrl ? catalogFileUrl[catalogFileUrl.length - 1] : ""}
                                                                    onChange={(imgUrl) => {
                                                                        setFieldValue("logoImageName", imgUrl);
                                                                    }}
                                                                />
                                                            </>
                                                        }
                                                    </>}
                                            </div>
                                            {(permission?.isEdit || permission?.isDelete) &&
                                                <>
                                                    {ShowSewOutLogo ? "" :
                                                        <>
                                                            <div className="">
                                                                <Textarea
                                                                    name={`longDescription`}
                                                                    maxLength="160"
                                                                    id="longDescription"
                                                                    value={values?.longDescription}
                                                                    placeholder="Your feedback"
                                                                    rows="3"
                                                                    className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}
                                                                />
                                                            </div>
                                                            <div className="flex items-center justify-center mt-4">
                                                                <div className="grow"><button type="submit" className={`btn block text-center px-6 bg-indigo-500 hover:bg-indigo-600 text-white w-full ${ShowSewOutLogo ? "w-1/4 float-right" : ""}`} onClick={() => { ShowSewOutLogo ? setFieldValue("isApproved", true) : setFieldValue("isApproved", false) }}>Submit Your feedback</button></div>
                                                                <div className="mx-2">OR</div>
                                                                <div className="grow"><button type="submit" className="btn block text-center px-6 bg-indigo-500 hover:bg-indigo-600 text-white w-full" onClick={() => { setAPIType("ApproveLogo"); setFieldValue("isApproved", true); }}>Approve your logo</button></div>
                                                            </div>
                                                        </>}
                                                </>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FormikForm>
                    );
                }}
            </Formik>
        </>
    )
}

const DigitalLogo = ({ CustomerId, CustomLogoId, Data, CompanyId, AdminId, permission, onSubmit, ShowDigital, setShowDigital, CustomerLogoDetails, DigitalLogoData, LogoDetailsData, setAPIType, validationSchema }) => {

    const FolderPath = `/${blobFolder.temp}/${CompanyId}/${blobFolder.customLogo}${!CustomerId ? "/0" : `/${CustomerId}`}/logoImageName`

    const [ShowDigitalLogo, setShowDigitalLogo] = useState("");// For Embroidery color 
    const [ShowLogoApproved, setShowLogoApproved] = useState({});

    const [ColorData, setColorData] = useState("");
    const [colors, setColors] = useState([]);
    const [check, setCheck] = useState(undefined);

    const MouseHoverEvent = (MouseHoverId) => {
        setCheck(MouseHoverId)
    }

    const addColor = (values, index) => {
        if (values.haxCode !== "") {
            let newColor = { id: index, hexCode: values.hexCode };
            setColors([...colors, newColor]);
        } else {
            setColors(ColorData);
        }
    };

    const deleteColor = (index) => {
        let copy_color = [...colors];
        copy_color.splice(index, 1);

        setColors(copy_color);
    };

    useEffect(() => {
        if (ShowDigitalLogo !== "") {
            let getEmbroideryColor = ShowDigitalLogo?.split(',').map((item, index) => {
                return { id: index, hexCode: item }
            })
            setColors(getEmbroideryColor)
        }
        LogoDetailsData()
    }, [CustomerLogoDetails, ShowDigitalLogo])

    useEffect(() => {
        setShowDigital(ShowLogoApproved.isApproved == true ? true : false)
    }, [ShowLogoApproved])

    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    hexCode: "",
                    EmbrodaryColor: [],
                    embroideryColor: ColorData,
                    id: 0,
                    rowVersion: "",
                    customerId: CustomerId,
                    customerLogoId: CustomLogoId || 0,
                    adminId: AdminId,
                    longDescription: "",
                    logoImageName: DigitalLogoData?.imageUrl || "",
                    isApproved: ShowLogoApproved?.ApproveLogo || false,
                    approvedDate: "",
                    logoType: 1,
                    isAdmin: 0,
                    logoSize: ShowLogoApproved?.logoSize || "",
                    parentId: ShowLogoApproved.id
                }}
                onSubmit={onSubmit()}
                validationSchema={validationSchema}
                validateOnMount={true}
            >
                {({ setFieldValue, errors, values, setValues }) => {
                    let catalogFileUrl = values.logoImageName.split('/')
                    let FinalData = "";
                    return (
                        <FormikForm>
                            <div className="manage-logo-detail text-gray-500 mb-10 last:mb-4">
                                <div className="text-2xl text-gray-800 font-bold mb-5">Digital Logo</div>
                                <div className="border border-neutral-200 grid grid-cols-3 gap-x-6 rounded-md">
                                    <div className="left-side-box col-span-1 p-6 pr-0">
                                        <div className="relative">
                                            <div className="">
                                                {values && values.logoImageName.includes("/rdc/") ?
                                                    <img className='flex justify-center border-spacing-1 border-dashed border-2 border-neutral-200 rounded-lg h-96 w-full text-center' src={`${process.env.REACT_APP_API_BLOB}${values.logoImageName}`} alt={'No Image'} />
                                                    :
                                                    <img className='flex justify-center border-spacing-1 border-dashed border-2 border-neutral-200 rounded-lg h-96 w-full text-center bg-sky-400/10' alt="No Image" />
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-2 bg-gray-50 p-6 rounded-r-md text-sm">
                                        <div className="">
                                            <div className="flex items-center justify-between gap-2 mb-3">
                                                <div className="w-1/3 min-w-44 font-bold">{Data?.[0].logoName}</div>
                                                <div className=""></div>
                                            </div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-1/3 min-w-44 font-semibold">Logo uploaded on:</div>
                                                <div className="">{DateTimeFormat(Data?.[0].uploadDate, "MMMM dd, yyyy").date}</div>
                                            </div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-1/3 min-w-44 font-semibold">Logo size:</div>
                                                <div className="">
                                                    <Input readOnly={ShowDigital} className={`w-1/2 rounded-md ${ShowDigital ? "bg-slate-200" : ""} `} type="text" name="logoSize" placeholder={`2x2"`} defaultValue={values?.logoSize} onChange={(e) => setFieldValue("logoSize", e.target.value)} maxLength={10} />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 mb-1">
                                                <div className="w-1/3 min-w-44 font-semibold">Embroidery color:</div>
                                                {colors && colors?.length > 0 && colors.map((color, index) => {
                                                    return (
                                                        <div key={index} className="relative">
                                                            {setColorData(FinalData = !FinalData ? FinalData.concat(color.hexCode) : FinalData.concat(",", color.hexCode))}
                                                            {(permission?.isEdit || permission?.isDelete) &&
                                                                <>
                                                                    {ShowDigital ? "" :
                                                                        <>
                                                                            {((color.recStatus !== RecStatusValuebyName.Archived) && (check == index)) && (
                                                                                <button
                                                                                    id={index}
                                                                                    onMouseLeave={() => MouseHoverEvent(undefined)}
                                                                                    type="button"
                                                                                    className="inline-block w-6 h-6 cursor-pointer absolute border border-gray-500 text-red-600 bg-gray-300"
                                                                                    onClick={() => {
                                                                                        deleteColor(index)
                                                                                    }}
                                                                                >
                                                                                    <span className="material-icons">delete</span>
                                                                                </button>
                                                                            )}
                                                                        </>
                                                                    }
                                                                </>
                                                            }
                                                            <div
                                                                key={index}
                                                                id={index}
                                                                className="flex justify-center items-center text-white border border-gray-500 h-6 w-6"
                                                                onMouseEnter={(e) => MouseHoverEvent(e.target.id)}
                                                                style={{
                                                                    backgroundColor: color.hexCode,
                                                                    borderColor: "black",
                                                                }}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                                {(permission?.isEdit || permission?.isDelete) &&
                                                    <>
                                                        {ShowDigital ? "" :
                                                            <>
                                                                <div className="col-span-full sm:col-span-6 xl:col-span-8">
                                                                    <div className="max-w-sm mx-auto">
                                                                        <div className="">
                                                                            <div className="flex items-center">
                                                                                <ColorPicker
                                                                                    name="hexCode"
                                                                                    maxLength={12}
                                                                                    isDisabled={true}
                                                                                    defaultValue={values.hexCode}
                                                                                // value={values.hexCode}
                                                                                />
                                                                                <div className="ml-1"><button className="btn btn-sm bg-indigo-500 hover:bg-indigo-600 text-white" type="button" onClick={() => addColor(values)}>Add</button></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        }
                                                    </>
                                                }
                                            </div>
                                            <div className="font-semibold">Comment:</div>
                                            <div className="overflow-auto max-h-screen border border-neutral-200 mb-4 rounded-md">
                                                <table className="table-auto w-full text-sm text-[#191919]">
                                                    <tbody className="text-sm divide-y divide-slate-200">
                                                        {DigitalLogoData?.comments ?
                                                            DigitalLogoData?.comments.length > 0 && DigitalLogoData?.comments.map((comment, index) => {
                                                                setShowLogoApproved(DigitalLogoData?.comments[DigitalLogoData?.comments?.length - 1])
                                                                setShowDigitalLogo(DigitalLogoData?.comments[DigitalLogoData?.comments?.length - 1].embroideryColor)
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="px-2 first:pl-5 py-3 font-semibold first-letter:capitalize"> {comment?.senderName} :
                                                                            <div className="font-semibold first-letter:capitalize">({comment?.senderType})</div>
                                                                        </td>
                                                                        <td className="px-2  py-3">
                                                                            <div className="font-semibold">{DateTimeFormat(comment?.date, "MMMM dd, yyyy").date}</div>
                                                                            <div className="text-gray-500">{comment?.message}</div>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            "Please add some comments"
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="mb-4">
                                                {
                                                    ShowDigital ?
                                                        <div className="w-full px-2 py-1 text-lg leading-7 bg-slate-200 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                                            {catalogFileUrl ? catalogFileUrl[catalogFileUrl.length - 1] : ""}
                                                        </div>
                                                        :
                                                        <>
                                                            {(permission?.isEdit || permission?.isDelete) &&
                                                                <>
                                                                    <FileComponent
                                                                        type="file"
                                                                        className="w-full px-2 py-1 text-sm leading-7 bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md"
                                                                        folderpath={`${FolderPath}`}
                                                                        name="logoImageName"
                                                                        // filePath={'files'}
                                                                        // isChangeDefaultName={true}
                                                                        value={catalogFileUrl ? catalogFileUrl[catalogFileUrl.length - 1] : ""}
                                                                        onChange={(imgUrl) => {
                                                                            setFieldValue("logoImageName", imgUrl);
                                                                        }}
                                                                    />
                                                                </>
                                                            }
                                                        </>
                                                }
                                            </div>
                                            {(permission?.isEdit || permission?.isDelete) &&
                                                <>
                                                    {ShowDigital ? ""
                                                        :
                                                        <>
                                                            <div className="">
                                                                <Textarea
                                                                    name={`longDescription`}
                                                                    maxLength="160"
                                                                    id="longDescription"
                                                                    value={values?.longDescription}
                                                                    placeholder="Your feedback"
                                                                    rows="3"
                                                                    className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}
                                                                />
                                                            </div>
                                                            <div className="flex items-center justify-center mt-4">
                                                                <div className="grow"><button type="submit" className="btn block text-center px-6 bg-indigo-500 hover:bg-indigo-600 text-white w-full">Add Comments</button></div>
                                                                <div className="mx-2">OR</div>
                                                                <div className="grow"><button type="submit" className="btn block text-center px-6 bg-indigo-500 hover:bg-indigo-600 text-white w-full" onClick={() => { setAPIType("ApproveLogo"); setFieldValue("isApproved", true); }}>Approve your logo</button></div>
                                                            </div>
                                                        </>
                                                    }
                                                </>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FormikForm>
                    );
                }}
            </Formik>
        </>
    )
}

const JpegLogo = ({ CustomerId, CustomLogoId, Data, CompanyId, AdminId, permission, onSubmit, ShowJpegLogo, setShowJpegLogo, CustomerLogoDetails, JpegLogoData, LogoDetailsData, setAPIType, validationSchema }) => {

    const FolderPath = `/${blobFolder.temp}/${CompanyId}/${blobFolder.customLogo}${!CustomerId ? "/0" : `/${CustomerId}`}/logoImageName`

    const [ShowDigitalLogo, setShowDigitalLogo] = useState("");// For Embroidery color 
    const [ShowLogoApproved, setShowLogoApproved] = useState({});

    const [ColorData, setColorData] = useState("");
    const [colors, setColors] = useState([]);
    const [check, setCheck] = useState(undefined);

    const MouseHoverEvent = (MouseHoverId) => {
        setCheck(MouseHoverId)
    }

    const addColor = (values, index) => {
        if (values.haxCode !== "") {
            let newColor = { id: index, hexCode: values.hexCode };
            setColors([...colors, newColor]);
        } else {
            setColors(ColorData);
        }
    };

    const deleteColor = (index) => {
        let copy_color = [...colors];
        copy_color.splice(index, 1);

        setColors(copy_color);
    };

    useEffect(() => {
        if (ShowDigitalLogo !== "") {
            let getEmbroideryColor = ShowDigitalLogo?.split(',').map((item, index) => {
                return { id: index, hexCode: item }
            })
            setColors(getEmbroideryColor)
        }
        LogoDetailsData()
    }, [CustomerLogoDetails, ShowDigitalLogo, ShowLogoApproved])

    useEffect(() => {
        setShowJpegLogo(ShowLogoApproved.isApproved == true ? true : false)
    }, [ShowLogoApproved])

    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    hexCode: "",
                    EmbrodaryColor: [],
                    embroideryColor: ColorData,
                    id: 0,
                    rowVersion: "",
                    customerId: CustomerId,
                    customerLogoId: CustomLogoId || 0,
                    adminId: AdminId,
                    longDescription: "",
                    logoImageName: JpegLogoData?.imageUrl || "",
                    isApproved: false,
                    approvedDate: "",
                    logoType: 0,
                    isAdmin: 0,
                    logoSize: ShowLogoApproved?.logoSize || "",
                    parentId: ShowLogoApproved.id
                }}
                onSubmit={onSubmit()}
                validationSchema={validationSchema}
                validateOnMount={true}
            >
                {({ setFieldValue, errors, values, setValues }) => {
                    let catalogFileUrl = values.logoImageName.split('/')
                    let FinalData = "";
                    return (
                        <FormikForm>
                            <div className="manage-logo-detail text-gray-500 mb-10 last:mb-0">
                                <div className="text-2xl text-gray-800 font-bold mb-5">Jpeg Logo</div>
                                <div className="border border-neutral-200 grid grid-cols-3 gap-x-6 rounded-md">
                                    <div className="left-side-box col-span-1 p-6 pr-0">
                                        <div className="relative">
                                            <div className="">
                                                {values && values.logoImageName.includes("/rdc/") ?
                                                    <img className='flex justify-center border-spacing-1 border-dashed border-2 border-neutral-200 rounded-lg h-96 w-full text-center' src={`${process.env.REACT_APP_API_BLOB}${values.logoImageName}`} alt={'No Image'} />
                                                    :
                                                    <img className='flex justify-center border-spacing-1 border-dashed border-2 border-neutral-200 rounded-lg h-96 w-full text-center bg-sky-400/10' alt="No Image" />
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-2 bg-gray-50 p-6 rounded-r-md text-sm">
                                        <div className="">
                                            <div className="flex items-center justify-between gap-2 mb-3">
                                                <div className="w-1/3 min-w-44 font-bold">{Data?.[0].logoName}</div>
                                                <div className=""></div>
                                            </div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-1/3 min-w-44 font-semibold">Logo uploaded on:</div>
                                                <div className="">{DateTimeFormat(Data?.[0].uploadDate, "MMMM dd, yyyy").date}</div>
                                            </div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-1/3 min-w-44 font-semibold">Logo size:</div>
                                                <div className="">
                                                    <Input readOnly={ShowJpegLogo} className={`w-1/2 rounded-md ${ShowJpegLogo ? "bg-slate-200" : ""} `} type="text" name="logoSize" placeholder={`2x2"`} defaultValue={values?.logoSize} onChange={(e) => setFieldValue("logoSize", e.target.value)} maxLength={10} />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 mb-1">
                                                <div className="w-1/3 min-w-44 font-semibold">Embroidery color:</div>
                                                {colors && colors?.length > 0 && colors.map((color, index) => {
                                                    return (
                                                        <div key={index} className="relative">
                                                            {setColorData(FinalData = !FinalData ? FinalData.concat(color.hexCode) : FinalData.concat(",", color.hexCode))}
                                                            {(permission?.isEdit || permission?.isDelete) &&
                                                                <>
                                                                    {ShowJpegLogo ? "" :
                                                                        <>
                                                                            {((color.recStatus !== RecStatusValuebyName.Archived) && (check == index)) && (
                                                                                <button
                                                                                    readOnly={ShowJpegLogo}
                                                                                    id={index}
                                                                                    onMouseLeave={() => MouseHoverEvent(undefined)}
                                                                                    type="button"
                                                                                    className="inline-block w-6 h-6 cursor-pointer absolute border border-gray-500 text-red-600 bg-gray-300"
                                                                                    onClick={() => {
                                                                                        deleteColor(index)
                                                                                    }}
                                                                                >
                                                                                    <span className="material-icons">delete</span>
                                                                                </button>
                                                                            )}
                                                                        </>
                                                                    }
                                                                </>
                                                            }
                                                            <div
                                                                key={index}
                                                                id={index}
                                                                className="flex justify-center items-center text-white border border-gray-500 h-6 w-6"
                                                                onMouseEnter={(e) => MouseHoverEvent(e.target.id)}
                                                                style={{
                                                                    backgroundColor: color.hexCode,
                                                                    borderColor: "black",
                                                                }}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                                {(permission?.isEdit || permission?.isDelete) &&
                                                    <>
                                                        {ShowJpegLogo ? "" :
                                                            <div className="col-span-full sm:col-span-6 xl:col-span-8">
                                                                <div className="max-w-sm mx-auto">
                                                                    <div className="">
                                                                        <div className="flex items-center">
                                                                            <ColorPicker
                                                                                name="hexCode"
                                                                                maxLength={12}
                                                                                isDisabled={true}
                                                                                defaultValue={values.hexCode}
                                                                            // value={values.hexCode}
                                                                            />
                                                                            <div className="ml-1"><button className="btn btn-sm bg-indigo-500 hover:bg-indigo-600 text-white" type="button" onClick={() => addColor(values)}>Add</button></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }
                                                    </>
                                                }
                                            </div>
                                            <div className="font-semibold">Comment:</div>
                                            <div className="overflow-auto max-h-screen border border-neutral-200 mb-4 rounded-md">
                                                <table className="table-auto w-full text-sm text-[#191919]">
                                                    <tbody className="text-sm divide-y divide-slate-200">
                                                        {JpegLogoData?.comments ?
                                                            JpegLogoData?.comments.length > 0 && JpegLogoData?.comments.map((comment, index) => {
                                                                setShowLogoApproved(JpegLogoData?.comments[JpegLogoData?.comments?.length - 1])
                                                                setShowDigitalLogo(JpegLogoData?.comments[JpegLogoData?.comments?.length - 1].embroideryColor)
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="px-2 first:pl-5 py-3 font-semibold first-letter:capitalize"> {comment?.senderName} :
                                                                            <div className="font-semibold first-letter:capitalize">({comment?.senderType})</div>
                                                                        </td>
                                                                        <td className="px-2 first:pl-5 py-3">
                                                                            <div className="font-semibold">{DateTimeFormat(comment?.date, "MMMM dd, yyyy").date}</div>
                                                                            <div className="text-gray-500">{comment?.message}</div>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            "Please add some comments"
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="mb-4">
                                                {ShowJpegLogo ?
                                                    <div className="w-full px-2 py-1 text-lg leading-7 bg-slate-200 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md">
                                                        {catalogFileUrl ? catalogFileUrl[catalogFileUrl.length - 1] : ""}
                                                    </div>
                                                    :
                                                    <>
                                                        {(permission?.isEdit || permission?.isDelete) &&
                                                            <>
                                                                <FileComponent
                                                                    type="file"
                                                                    className="w-full px-2 py-1 text-sm leading-7 bg-slate-100 border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md"
                                                                    folderpath={`${FolderPath}`}
                                                                    name="logoImageName"
                                                                    value={catalogFileUrl ? catalogFileUrl[catalogFileUrl.length - 1] : ""}
                                                                    onChange={(imgUrl) => {
                                                                        setFieldValue("logoImageName", imgUrl);
                                                                    }}
                                                                />
                                                            </>
                                                        }
                                                    </>
                                                }
                                            </div>
                                            {(permission?.isEdit || permission?.isDelete) &&
                                                <>
                                                    {ShowJpegLogo ? "" :
                                                        <>
                                                            <div className="">
                                                                <Textarea
                                                                    readOnly={ShowJpegLogo}
                                                                    name={`longDescription`}
                                                                    // maxLength="160"
                                                                    id="longDescription"
                                                                    value={values?.longDescription}
                                                                    placeholder="Your feedback"
                                                                    rows="3"
                                                                    className={`block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md`}
                                                                />
                                                            </div>
                                                            {/* <div className="flex items-center justify-center mt-4">
                                                                <div className="grow"><button type="submit" className="btn block text-center px-6 bg-indigo-500 hover:bg-indigo-600 text-white w-1/4 float-right" onClick={() => { setFieldValue("logoType", 0); }} >Add Comments</button></div>
                                                            </div> */}
                                                            <div className="flex items-center justify-center mt-4">
                                                                <div className="grow"><button type="submit" className={`btn block text-center px-6 bg-indigo-500 hover:bg-indigo-600 text-white w-full ${ShowJpegLogo ? "w-1/4 float-right" : ""}`}>Add Comments</button></div>
                                                                {ShowJpegLogo ? "" : <>
                                                                    <div className="mx-2">OR</div>
                                                                    <div className="grow"><button type="submit" className="btn block text-center px-6 bg-indigo-500 hover:bg-indigo-600 text-white w-full" onClick={() => { setAPIType("ApproveLogo"); setFieldValue("isApproved", true); }}>Approve your logo</button></div>
                                                                </>}
                                                            </div>
                                                        </>
                                                    }
                                                </>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FormikForm>
                    );
                }}
            </Formik>
        </>
    )
}
