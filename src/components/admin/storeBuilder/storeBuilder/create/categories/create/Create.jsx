/*Component Name: Create
Component Functional Details: User can create or update store builder category details from here.
Created By: Ankit Sharma
Created Date: 11/29/2022
Modified By: Ankit Sharma
Modified Date: 11/29/2022 */

import React, { useState, useCallback, useEffect } from "react";
import { Formik, Form as FormikForm } from "formik";
import { Link, NavLink, useParams, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Dropdown from "components/common/formComponent/Dropdown";
import CategoryInfo from "./CategoryInfo";
import CategoryProducts from "./CategoryProducts";
import {
	RecStatusValue,
	RecStatusValuebyName
} from "global/Enum";
import Messages from "components/common/alerts/messages/Index";
import CategoryService from "services/admin/storeBuilderCategories/CategoryService";
import { ValidationMsgs } from "global/ValidationMessages";
import { useDispatch, useSelector } from "react-redux";
import { serverError } from "services/common/helper/Helper";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const Create = () => {
	const { storeId, id } = useParams();
	const isAddMode = !id;
	const [data, setData] = useState({});
	let navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useSelector((store) => store?.location);
	const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);

	useEffect(() => {
		getCategoryById();
	}, [id]);

	const getCategoryById = useCallback(() => {
		if (id) {
			CategoryService.getCategoryById(id).then((res) => {
				var Category = res?.data;
				if (Category?.success) {
					setData({
						id: Category?.data?.id,
						storeId: Category?.data?.storeId,
						name: Category?.data?.name,
						description: Category?.data?.description,
						collectionImageURl: Category?.data?.collectionImageURl,
						recStatus: Category?.data?.recStatus,
						parentId: Category?.data?.parentId,
						productId: Category?.data?.productId,
						rowVersion: Category?.data?.rowVersion
					});
				}
			})
		}
	})

	const submitHandler = (fields, { resetForm }) => {
		if (isAddMode) {
			createCategory(fields, resetForm);
			resetForm({})
			setData({ description: "" })
		} else {
			updateCategory(fields, resetForm);
		}
	};

	const createCategory = (values, resetForm) => {
		dispatch(setAddLoading(true))
		CategoryService.createCategory({
			categoryModel: { ...values, ...location },
		}).then((response) => {
			if (response.data.success) {
				// store parents
				let parents = [];
				if (values.parentId.length > 0) {
					parents = values.parentId.map((value, i) => {
						return {
							id: value,
							status: RecStatusValuebyName.Active,
							rowVersion: ""
						}
					})
				} else {
					parents.push({
						id: 0,
						status: RecStatusValuebyName.Active,
						rowVersion: ""
					})
				}
				CategoryService.updateCategoryParent({
					id: response.data.data.id,
					...location,
					storeId: storeId,
					parentCategoryId: parents
				}).then((response) => {
					if (response.data.success) {
						dispatch(
							setAlertMessage({
								view: true,
								type: "success",
								message: ValidationMsgs.category.categoryCreated
							})
						);
						resetForm({});
						dispatch(setAddLoading(false))
					} else {
						dispatch(
							setAlertMessage({ type: "danger", message: serverError(response) })
						);
						dispatch(setAddLoading(false))
					}
				})
				navigate(`/admin/StoreBuilder/${storeId}/categories/edit/${response.data.data.id}`);
				dispatch(setAddLoading(false))
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
					message: ValidationMsgs.category.categoryNotCreated
				})
			);
			dispatch(setAddLoading(false))
		});
	};

	const updateCategory = (values) => {
		dispatch(setAddLoading(true))
		let parents = values.parentId.map((id) => {
			return { id: id, status: RecStatusValuebyName.Active, rowVersion: '' }
		})

		CategoryService.updateCategoryParent({
			id: id,
			...location,
			storeId: storeId,
			parentCategoryId: parents
		}).then((response) => {

		}).catch(() => {

		})

		CategoryService.updateCategory({
			categoryModel: { ...values, ...location },
		}).then((response) => {
			if (response.data.success) {
				dispatch(
					setAlertMessage({
						view: true,
						type: "success",
						message: ValidationMsgs.category.categoryUpdated
					})
				);
				getCategoryById();
				dispatch(setAddLoading(false))
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
					message: ValidationMsgs.category.categoryNotUpdated
				})
			);
			dispatch(setAddLoading(false))
		});
	};

	const schema = Yup.object({
		name: Yup.string().required(ValidationMsgs.category.nameRequired),
		recStatus: Yup.string().required(ValidationMsgs.common.recStatusRequired)
	});

	return (
		<>
			<title>{isAddMode ? "Create" : "Edit"} Category</title>
			<Formik
				enableReinitialize={true}
				initialValues={{
					id: data?.id || 0,
					storeId: data?.storeId || storeId,
					name: data?.name || "",
					description: data?.description || "",
					recStatus: data?.recStatus || RecStatusValuebyName.Active,
					collectionImageURl: data?.collectionImageURl || "",
					parentId: data?.parentId || [],
					rowVersion: data?.rowVersion || null,
				}}
				validationSchema={schema}
				onSubmit={submitHandler}
			>
				{({ errors, touched, setFieldValue, values }) => {
					return (
						<FormikForm>
							<div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
								{/* Page header */}
								<div className="flex mb-8 justify-between">
									<div className="flex items-center">
										<Link
											to={"/admin/StoreBuilder/edit/" + storeId}
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
											to={"/admin/StoreBuilder/edit/" + storeId}
											className="btn bg-white border-neutral-200 text-gray-500 hover:text-gray-700"
										>
											Cancel
										</NavLink>

										<button type="submit" className={`flex justify-center btn px-6 bg-indigo-500 hover:bg-indigo-600 text-white ${(GlobalLoading) ? "bg-indigo-200 hover:bg-indigo-200" : "cursor-pointer"}`}
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

								{/* Form Part */}
								<div className="grid grid-cols-12 gap-6">
									{/* Information Part */}
									<div className="col-span-full xl:col-span-9">
										<div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
											<CategoryInfo
												setFieldValue={setFieldValue}
												values={values}
											/>
										</div>

										{!isAddMode && (
											<>
												<div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 mb-6">
													<CategoryProducts />
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
													<span className="text-rose-500 text-2xl leading-none">
														*
													</span>
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

											{/* Sales channel */}
										</div>
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
