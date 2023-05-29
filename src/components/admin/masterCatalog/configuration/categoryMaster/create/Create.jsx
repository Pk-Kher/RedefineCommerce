/*Component Name: Create
Component Functional Details: User can create or update Create master details from here.
Created By: < Name >
Created Date: <Created Date>
Modified By: chandan
Modified Date: 08/25/2022 */

import React, { useState, useEffect } from "react";
import { Formik, Form as FormikForm } from "formik";
import { Link, NavLink, useParams, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Dropdown from "../../../../../common/formComponent/Dropdown";
import CategoryInfo from "./CategoryInfo";
import CategoryProducts from "./CategoryProducts";
import {
	RecStatusValue,
	RecStatusValuebyName,
} from "global/Enum";
import Messages from "components/common/alerts/messages/Index";
import CategoryService from "services/admin/category/CategoryService";
import { ValidationMsgs } from "global/ValidationMessages";
import { useDispatch, useSelector } from "react-redux";
import { serverError } from "services/common/helper/Helper";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";
import SidebarStoreList from "components/common/others/admin/Store/SidebarStoreList";
import { useCallback } from "react";
import CreateFileHeader from "components/common/CreateFileHeader";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";

const Create = () => {
	const permission = useSelector(store => store.permission);
	const { id } = useParams();
	const isAddMode = !id;
	const [data, setData] = useState({});
	let navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useSelector((store) => store?.location);
	const [storeType, setStoreType] = useState([]);

	useEffect(() => {
		getCategoryById();
		getsaleschannelstoresforcategoryId();
	}, [id]);

	const getCategoryById = useCallback(() => {
		if (id) {
			dispatch(setAddLoading(true));
			CategoryService.getCategoryById(id)
				.then((res) => {
					var Category = res?.data;
					if (Category?.success) {
						setData({
							id: Category?.data?.id,
							name: Category?.data?.name,
							description: Category?.data?.description,
							collectionImageURl: Category?.data?.collectionImageURl,
							recStatus: Category?.data?.recStatus,
							parentId: Category?.data?.parentId,
							productId: Category?.data?.productId,
							rowVersion: Category?.data?.rowVersion,
						});
					}
					dispatch(setAddLoading(false))

				}).catch(() => {
					dispatch(setAddLoading(false))
				})
		}
	})

	const getsaleschannelstoresforcategoryId = useCallback(() => {
		dispatch(setAddLoading(true))

		CategoryService.getsaleschannelstoresforcategoryId(id).then((res) => {
			if (res?.data?.success) {
				setStoreType(res?.data?.data);
			}
			dispatch(setAddLoading(false))

		}).catch(() => {
			dispatch(setAddLoading(false))
		})
	})

	const submitHandler = (fields, { resetForm }) => {
		fields = { ...fields, parentId: (fields.parentId.length > 0 ? fields.parentId : [0]) }
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
							status: "A",
							rowVersion: ""
						}
					})
				}
				else {
					parents.push({
						id: 0,
						status: "A",
						rowVersion: ""
					})
				}
				CategoryService.updateCategoryParent({
					id: response.data.data.id,
					...location,
					parentCategoryId: parents
				}).then((response) => {
					if (response.data.success) {
						dispatch(
							setAlertMessage({
								type: "success",
								message: ValidationMsgs.category.categoryCreated,
							})
						);
						resetForm({});
					} else {
						dispatch(
							setAlertMessage({ type: "danger", message: serverError(response) })
						);
					}
					dispatch(setAddLoading(false))

				})
				navigate(`/admin/MasterCatalog/Configuration/category/edit/${response.data.data.id}`);
			} else {
				dispatch(
					setAlertMessage({ type: "danger", message: serverError(response) })
				);
				dispatch(setAddLoading(false))

			}
		}).catch((errors) => {
			dispatch(
				setAlertMessage({
					type: "danger",
					message: ValidationMsgs.category.categoryNotCreated,
				})
			);
			dispatch(setAddLoading(false))

		});
	};

	const updateCategory = (values) => {
		dispatch(setAddLoading(true))

		let parents = values.parentId.map((id) => {
			return { id: id, status: "A", rowVersion: '' }
		})
		CategoryService.updateCategory({
			categoryModel: { ...values, ...location },
		}).then((response) => {
			if (response.data.success) {
				CategoryService.updateCategoryParent({
					id: id,
					...location,
					parentCategoryId: parents
				}).then((response) => {
					if (response?.data?.success) {
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
					// dispatch(setAddLoading(false))

				}).catch(() => {
					// dispatch(setAddLoading(false))
				})
			} else {
				dispatch(
					setAlertMessage({ type: "danger", message: serverError(response) })
				);
				dispatch(setAddLoading(false))

			}
		}).catch((errors) => {
			dispatch(
				setAlertMessage({
					type: "danger",
					message: ValidationMsgs.category.categoryNotUpdated,
				})
			);
			dispatch(setAddLoading(false))

		});
	};

	const schema = Yup.object({
		name: Yup.string().required(ValidationMsgs.category.nameRequired),
		recStatus: Yup.string().required(ValidationMsgs.common.recStatusRequired),
	});

	return (
		<>
			<title>{isAddMode ? "Create" : "Edit"} Category</title>
			<Formik
				enableReinitialize={true}
				initialValues={{
					id: data?.id || 0,
					name: data?.name || "",
					description: data?.description || "",
					recStatus: data?.recStatus || RecStatusValuebyName.Active,
					collectionImageURl: data?.collectionImageURl || "",
					parentId: data?.parentId || [],
					rowVersion: data?.rowVersion || null,
				}}
				validationSchema={schema}
				onSubmit={submitHandler}
				validateOnMount={true}
			>
				{({ errors, touched, setFieldValue, values, validateForm }) => {
					return (
						<FormikForm>
							<div className="px-4 sm:px-6 lg:px-8 py-8 w-full">

								<CreateFileHeader url="/admin/MasterCatalog/Configuration/category" module={`${isAddMode ? 'Create' : 'Edit'} Category`} errors={errors} validateForm={validateForm} />
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
										{!isAddMode && (
											<div className="w-full bg-white shadow-xxl rounded-md p-6 mb-6">
												<SidebarStoreList storeType={storeType} />
											</div>
										)}
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
