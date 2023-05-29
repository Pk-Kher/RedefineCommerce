/*Component Name: Create
Component Functional Details: User can create or update Create master details from here.
Created By: Shrey Patel
Created Date: <Created Date>
Modified By: chandan
Modified Date: 08/25/2022 */

import React, { useState, useEffect } from "react";
import { Formik, Form as FormikForm } from "formik";
import { useParams, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Dropdown from "../../../../../common/formComponent/Dropdown";
import CategoryInfo from "./CategoryInfo";
import CategoryProducts from "./CategoryProducts";
import {
	RecStatusValue,
	RecStatusValuebyName,
} from "global/Enum";
import Messages from "components/common/alerts/messages/Index";
import CategoryService from "services/admin/masterCatalog/store/categoryMaster/CategoryMasterService";
import { ValidationMsgs } from "global/ValidationMessages";
import { useDispatch, useSelector } from "react-redux";
import { serverError } from "services/common/helper/Helper";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { useCallback } from "react";
import CategorySEO from "./CategorySEO";
import CreateFileHeader from "components/common/CreateFileHeader";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import Input from "components/common/formComponent/Input";

const Create = () => {
	const { id, storeId, storeName, storeType } = useParams();
	const isAddMode = !id;
	const [data, setData] = useState({});
	const dispatch = useDispatch();
	const [initialParentId, setInitialParentId] = useState([]);
	const location = useSelector((store) => store?.location);

	useEffect(() => {
		getCategoryById();
	}, [id]);

	const getCategoryById = useCallback(() => {
		if (id) {
			CategoryService.getCategoryById(id)
				.then((res) => {
					let CategoryData = res.data;
					if (CategoryData.success) {
						setData({
							id: CategoryData?.data?.id,
							name: CategoryData?.data?.name,
							description: CategoryData?.data?.description,
							parentId: CategoryData?.data?.parentId,
							// parentId: (
							// 	CategoryData?.data?.parentId ? CategoryData?.data?.parentId.map((value, key) => {
							// 		return value.parentId
							// 	}) : []),
							collectionImageURl: CategoryData?.data?.collectionImageURl,
							bannerImagePath: CategoryData?.data?.bannerImagePath,
							recStatus: CategoryData?.data?.recStatus,
							// storeID: CategoryData?.data?.storeID,
							masterCategoryId: CategoryData?.data?.masterCategoryId,
							rowVersion: CategoryData?.data?.rowVersion,
							seTitle: CategoryData?.data?.seTitle,
							seKeywords: CategoryData?.data?.seKeywords,
							seDescription: CategoryData?.data?.seDescription,
							seName: CategoryData?.data?.seName,
						});
						setInitialParentId(CategoryData?.data?.parentId);
					}
				})
		}
	})

	const submitHandler = (fields, { resetForm }) => {
		updateCategory(fields);
	};

	const updateCategory = (values) => {

		let categories = [...initialParentId];
		const categoryIDs = values.parentId.map((categoryParentId) => {
			const existCategory = initialParentId.find((value) => value.toString() === categoryParentId.toString());
			if (!existCategory) {
				categories = [...categories, categoryParentId]
			}
			return categoryParentId.toString();
		});

		categories = categories.map((value) => {
			if (categoryIDs.includes(value.toString())) {
				return { id: value, status: 'A' };
			} else {
				return { id: value, status: 'R' };
			}
		}).filter((value) => value.id !== 0);

		dispatch(setAddLoading(true));
		CategoryService.updateCategory({
			categoryModel: { ...values, ...location },
		}).then((response) => {

			if (response.data.success) {
				CategoryService.updateCategoryParent({
					id: id,
					...location,
					storeId: storeId,
					parentCategoryId: (
						categories.length <= 0 ?
							[{
								id: 0,
								rowVersion: "",
								status: "A"
							}] : categories) /* parentId.filter(ParentID => {
						return ParentID.id !== 0;
					}) */
				}).then((response) => {
					if (response.data.success) {
						dispatch(
							setAlertMessage({
								type: "success",
								message: ValidationMsgs.category.categoryUpdated,
							})
						);
						getCategoryById();
					} else {
						dispatch(
							setAlertMessage({ type: "danger", message: serverError(response) })
						);
						dispatch(setAddLoading(false))
					}
				}).catch((errors) => {
					dispatch(
						setAlertMessage({
							view: true,
							type: "danger",
							message: ValidationMsgs.category.categoryNotUpdated,
						})
					);
					dispatch(setAddLoading(false))

				});
			} else {
				dispatch(setAlertMessage({
					type: "danger",
					message: serverError(response)
				}))
			}
			dispatch(setAddLoading(false))
		}).catch((errors) => {
			dispatch(
				setAlertMessage({
					type: "danger",
					message: ValidationMsgs.category.categoryNotUpdated,
				})
			);
		});
	};

	const schema = Yup.object({
		name: Yup.string().required(ValidationMsgs.category.nameRequired),
		collectionImageURl: Yup.string()
			.matches(
				/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
				'Enter valid url'
			),
		recStatus: Yup.string().required(ValidationMsgs.common.recStatusRequired),
		seTitle: Yup.string().required(ValidationMsgs.masterCatalog.Store.brand.seTitleRequired),
	});

	return (
		<>
			<title>{isAddMode ? "Create" : "Edit"} Category</title>
			<Formik
				enableReinitialize={true}
				initialValues={{
					id: data?.id || 0,
					name: data?.name || "",
					bannerImagePath: data?.bannerImagePath || "",
					description: data?.description || "",
					parentId: data?.parentId || [],
					storeID: /* data?.storeID || */ storeId,
					seTitle: data?.seTitle || "",
					seKeywords: data?.seKeywords || "",
					seDescription: data?.seDescription || "",
					collectionImageURl: data?.collectionImageURl || "",
					seName: data?.seName || "",
					recStatus: data?.recStatus || RecStatusValuebyName.Active,
					rowVersion: data?.rowVersion || null,
				}}
				validationSchema={schema}
				onSubmit={submitHandler}
			>
				{({ errors, touched, setFieldValue, values, validateForm }) => {
					return (
						<FormikForm>
							<div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
								{/* Page header */}
								{/* <div className="flex mb-8 justify-between">
									<div className="flex items-center">
										<Link
											to={`/admin/MasterCatalog/eCommerceStore/corporateGear/${storeId}/category`}
											className="btn border-neutral-200 hover:border-neutral-400 text-gray-500 hover:text-gray-700 flex items-center mr-2"
										>
											<span className="material-icons-outlined">west</span>
										</Link>
										<h1 className="text-2xl md:text-3xl text-gray-800 font-bold">
											{isAddMode ? "Create" : "Edit"} Category
										</h1>
									</div>
									<div className="flex flex-wrap space-x-2">
										<NavLink
											to={`/admin/MasterCatalog/eCommerceStore/corporateGear/${storeId}/category`}
											className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
										>
											Cancel
										</NavLink>
										<button type="submit" className="btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white" >
											Save
										</button>
									</div>
								</div> */}
								<CreateFileHeader url={`/admin/MasterCatalog/${storeType}/${storeName}/${storeId}/category`} module={`${isAddMode ? 'Create' : 'Edit'} Category`} errors={errors} validateForm={validateForm} />
								<Messages />

								{/* Form Part */}
								<div className="grid grid-cols-12 gap-6">
									{/* Information Part */}
									<div className="col-span-full xl:col-span-9">
										<div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
											<CategoryInfo
												setFieldValue={setFieldValue}
												values={values}
												data={data}
											/>
										</div>

										{!isAddMode && (
											<>
												<div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 mb-6">
													<CategoryProducts />
												</div>
											</>
										)}

										{!isAddMode && (
											<>
												<div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 mb-6">
													<CategorySEO
														setFieldValue={setFieldValue}
														values={values}
													/>
												</div>
											</>
										)}
									</div>

									<div className="flex flex-col col-span-full xl:col-span-3">
										<div className="w-full bg-white shadow-xxl rounded-md mb-6">
											{/* Category status field */}
											<div className="border-b-2 border-neutral-200 p-6">
												<div className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2">
													Category Status
													<span className="text-rose-500 text-lg leading-none">*</span>
												</div>
												<Dropdown
													className="block w-full bg-white focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md"
													label="recStatus"
													defaultValue={values.recStatus}
													isMulti={false}
													name="recStatus"
													options={RecStatusValue}
													isSearchable={false}
												/>
											</div>
										</div>
										<div className="w-full bg-white shadow-xxl rounded-md p-6 mb-6">
											<div className="mb-3">
												<div className="flex flex-wrap items-center justify-between pb-2 last:pb-0  last:mb-0 capitalize">
													Custom Collection URL
												</div>
												<Input
													id={"collectionImageURl"}
													name={"collectionImageURl"}
												/>
											</div>
											<div className="mb-3">
												<div className="flex flex-wrap items-center justify-between pb-2 last:pb-0 last:mb-0 capitalize">
													SE Name
												</div>
												<Input
													id={"seName"}
													name={"seName"}
													disabled={true}
												/>
											</div>
										</div>

										{/* <div className="w-full bg-white shadow-xxl rounded-md mb-6">
											// Category Landing Page field
											<div className="border-b-2 border-neutral-200 p-6">
												<div className="block uppercase tracking-wide text-gray-500 text-base font-bold mb-2">
													Landing Page
													<span className="text-rose-500 text-lg leading-none">*</span>
												</div>
												<Dropdown
													className="block w-full bg-white focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md"
													label="landingPage"
													defaultValue={values.landingPage}
													isMulti={false}
													name="landingPage"
													options={[{ value: 0, label: "Default Page" }, { value: 1, label: "Landing Page 1" }, { value: 2, label: "Landing Page 2" }, { value: 3, label: "Landing Page 3" }]}
													isSearchable={false}
												/>
											</div>
										</div> */}
										{/* {!isAddMode && (
											<div className="w-full bg-white shadow-xxl rounded-md p-6 mb-6">
												<SidebarStoreList />
											</div>	
										)} */}
									</div>
								</div>
							</div>
						</FormikForm>
					);
				}}
			</Formik>
		</>
	);
};

export default Create;
