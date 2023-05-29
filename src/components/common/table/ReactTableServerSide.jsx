/*Component Name: checkboxFilter
Component Functional Details: User can create or update checkboxFilter master details from here.
Created By: Pradip Kher
Created Date: 
Modified By: Pradip kher, Keval Takodara
Modified Date: 6/13/2022 */

import React, {
	useEffect,
	useMemo,
	useState,
	Fragment,
	useCallback,
} from "react";
import {
	useTable,
	useSortBy,
	useGlobalFilter,
	usePagination,
	useRowSelect,
	useColumnOrder,
	useExpanded,
} from "react-table";
import TableSearch from "./filters/TableSearch";
import CheckBox from "./CheckBox";
import EditColumn from "./filters/EditColumn";
import RadiobuttonFilter from "./filters/RadiobuttonFilter";
import MoreFilter from "./filters/moreFilter/MoreFilter";
import RefreshTable from "./RefreshTable";
import Sorting from "./filters/Sorting";
import CheckboxFilter from "./filters/CheckboxFilter";
import Download from "./filters/Download";
import DropdownFilter from "./filters/DropdownFilter";
import GridViewTemplate from "./GridViewTemplate";
import Pagination from "./Pagination";
import { useDispatch, useSelector } from "react-redux";
import SaveFilter from "./filters/moreFilter/SaveFilter";
import MoreFilterService from "services/admin/moreFilter/MoreFilterService";
import { setAddLoading } from "redux/globalLoader/GlobalLoaderAction";
import { ValidationMsgs } from "global/ValidationMessages";
import { serverError } from "services/common/helper/Helper";
import { setAlertMessage } from "redux/alertMessage/AlertMessageReducers";

const ReactTable = ({
	COLUMNS,
	DATA,
	hasNextPage,
	hasPreviousPage,
	pageIndex = 0,
	pageSize,
	totalCount,
	totalPages = Math.ceil(totalCount / pageSize),
	fetchData,
	setTablePageSize,
	sortingOptions,
	setSortingOptions,
	colSpan,
	type,
	isColspan,
	handleSort,
	filteringOptions,
	setColumnFilteringOptions,
	radioFilterOptions,
	editColumnFilter,
	setHiddenColumns: setDefaultHiddenColumns,
	hiddenColumns: defaultHiddenColumns,
	refreshTable,
	CheckBoxAction,
	selectedRows,
	setSelectedRows,
	sortingColumns,
	expandedRows,
	moreFilterOption,
	checkBoxFilterOptions,
	footer,
	filters = true,
	extraFilter,
	displaySearch = 'left',
	placeholderText = "Search",
	tablePadding,
	dropdownFilterOptions,
	download,
	filterPosition,
	setInitialColumnFilterOrder,
	defaultColumnOrder,
	GridView,
	Gap,
	hasPageSize = true,
	actionRelativeCl,
	saveFilter = {},
	defaultExpandedAll = false
}) => {
	const store = useSelector(store => store);
	const dispatch = useDispatch();
	const searchQuery = useSelector((store) => store?.SearchQueryReducers);
	const GlobalLoading = useSelector((store) => store?.GlobalLoaderReducer?.toLoad);
	const [initialRender, setInitialRender] = useState(0);
	const columns = useMemo(() => {
		const expander = COLUMNS.find((column) => column.id === "expander");
		if (expandedRows && !expander) {
			COLUMNS.splice(0, 0, expandedColumn);
		}
		return COLUMNS;
	}, [COLUMNS, expandedRows]);
	const data = useMemo(() => DATA, [DATA]);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		footerGroups,
		page,
		rows,
		prepareRow,
		state,
		setGlobalFilter,
		setColumnOrder,
		allColumns,
		setHiddenColumns,
		selectedFlatRows,
		state: {
			selectedRowIds,
			hiddenColumns
			// expanded
		},
	} = useTable(
		{
			columns: columns,
			data: data,
			manualSortBy: true,
			autoResetHiddenColumns: false,
			initialState: {
				hiddenColumns: defaultHiddenColumns ? defaultHiddenColumns : [],
				expanded: defaultExpandedAll ? "expanded" : ""
			},
		},
		useGlobalFilter,
		useSortBy,
		useExpanded,
		useColumnOrder,
		usePagination,
		useRowSelect,
		(hooks) => {
			hooks.visibleColumns.push((columns) => {
				return [
					{
						id: "rowSelection",
						disableSortBy: true,
						disableShowHide: true,
						isVisible: false,
						Header: ({ getToggleAllRowsSelectedProps }) => {
							return (
								<div className="flex items-center relative">
									<span className="inline-flex leading-none w-4 h-4">
										<CheckBox {...getToggleAllRowsSelectedProps()} />
									</span>
									<div
										className={`absolute left-full bg-white input-check min-w-auto pl-1 ${selectedFlatRows.length <= 0 && "hidden"
											}`}
									>
										{CheckBoxAction && (
											<CheckBoxAction selectedFlatRows={selectedFlatRows} />
										)}
									</div>
								</div>
							);
						},
						Cell: ({ row }) => {
							return <CheckBox {...row.getToggleRowSelectedProps()} />;
						},
					},
					...columns,
				];
			});
		}
	);
	// selected rows
	useEffect(() => {
		if (setSelectedRows instanceof Function) {
			setSelectedRows(selectedFlatRows);
		}
	}, [selectedRowIds, setSelectedRows]);

	const [initialColumnOrder, setInitialColumnOrder] = useState(() => {
		if (!defaultColumnOrder) {
			return allColumns.map((value, index) => {
				return value.id;
			});
		} else {
			return defaultColumnOrder;
		}
	});
	useEffect(() => {
		setColumnOrder(initialColumnOrder);
	}, [initialColumnOrder, setColumnOrder]);
	const { globalFilter } = state;
	const changeColumnFormat = (value) => {
		setInitialColumnOrder(() => {
			return value.map((val, index) => {
				return val.id;
			});
		});
		if (setInitialColumnFilterOrder instanceof Function) {
			setInitialColumnFilterOrder(value);
		}
	};

	useEffect(() => {
		if (setDefaultHiddenColumns instanceof Function) {
			setDefaultHiddenColumns(hiddenColumns);
		}
	}, [hiddenColumns, setDefaultHiddenColumns]);

	useEffect(() => {
		if (initialRender >= 2 && !searchQuery.toFill) {
			fetchData();
		} else {
			setInitialRender(prev => prev + 1);
		}
	}, [pageSize, sortingOptions, searchQuery])
	useEffect(() => {
		if (initialRender >= 2) {
			fetchData(1);
		} else {
			setInitialRender(prev => prev + 1);
		}
	}, [filteringOptions, searchQuery]);


	useEffect(() => {
		if (defaultHiddenColumns === undefined) {
			setHiddenColumns(hiddenColumns);
		} else {
			setHiddenColumns(defaultHiddenColumns);
		}
	}, [GridView, defaultHiddenColumns]);

	// set column filter value
	const setColumnFilter = useCallback(
		(filter) => {
			if (setColumnFilteringOptions) {
				setColumnFilteringOptions((prev) => {
					const existingItem = prev.find((value) => filter.field === value.field);
					if (!existingItem && filter.value !== "") {
						return [...prev, filter];
					} else {
						const searchQueries = prev
							.map((value) => {
								if (value.field === filter.field && filter.value === "")
									return { ...value, value: filter.value, field: "" };
								else if (value.field === filter.field)
									return { ...value, value: filter.value };
								return value;
							})
							.filter((value) => value.field !== "");

						/* if (searchQueries.length <= 0) {
							searchQueries.push({
								"field": "",
								"operator": 0,
								"value": ""
							})
						} */
						return searchQueries
					}
				});
			}

		},
		[setColumnFilteringOptions]
	);
	///get save filter

	const getTableTemplate = useCallback(() => {
		if (store?.user?.id && saveFilter?.show /* && (('/' + location?.pathname.replace(/^\/+|\/+$/g, '').toLowerCase()) === ('/' + store?.permission?.navigationUrl.replace(/^\/+|\/+$/g, '').toLowerCase())) */) {
			dispatch(setAddLoading(true));
			MoreFilterService.getMoreFilter({
				getPageViewtemplateModel: {
					userid: store?.user?.id,
					tabname: saveFilter?.tabName
				}
			}).then((response) => {
				let filterColumns = { filteringOptions: [], sortingOptions: {}, columnOrder: [], hiddenColumns: [] };
				if (response?.data?.success && response?.data?.data) {
					var saveData = response.data?.data;
					if (saveData) {
						//set filtering Options
						if (saveData && saveData?.filterColumn) {
							filterColumns = { ...filterColumns, ...JSON.parse(saveData.filterColumn) };
						}
						// setColumnFilteringOptions(prev => [...filterColumns?.filteringOptions]);
						//set edit columns
						if (filterColumns?.columnOrder?.length > 0) {
							setInitialColumnOrder(filterColumns?.columnOrder);
						}
						//set hidden columns
						if (filterColumns?.hiddenColumns?.length > 0) {
							setHiddenColumns(filterColumns?.hiddenColumns);
						}
					}
				}
				// console.log(filterColumns, saveData, 'pkk');
				setColumnFilteringOptions(prev => [...prev, ...filterColumns?.filteringOptions]);
				// dispatch(setAddLoading(false));
			}).catch(() => {
				dispatch(setAlertMessage({
					type: 'danger',
					message: ValidationMsgs.common.serverError
				}));
				dispatch(setAddLoading(false));
			});
		} else {
			fetchData();
		}
	}, [store?.permission?.extId, store?.user?.id]);
	const saveFilterOptionsHandler = () => {
		dispatch(setAddLoading(true));
		let filter = filteringOptions.filter(value => value.field !== 'global')
		MoreFilterService.saveMoreFilter({
			pageViewtemplateModel: {
				id: 0,
				rowVersion: "",
				...store?.location,
				extentionId: store?.permission?.extId,//wrong spelling for extensionId from API 
				userId: store?.user?.id,
				tabName: saveFilter?.tabName || 'All',
				filterColumn: JSON.stringify({ filteringOptions: filter, columnOrder: initialColumnOrder, hiddenColumns }),
				sortColumn: JSON.stringify({ sortingOptions: (sortingOptions.length > 0 ? sortingOptions[0] : {}) }),
				recStatus: "A",
			}
		}).then((response) => {
			if (response.data.success) {
				dispatch(setAlertMessage({
					type: 'success',
					message: ValidationMsgs.table.stored
				}));
			} else {
				dispatch(setAlertMessage({
					type: 'danger',
					message: serverError(response)
				}));
			}
			dispatch(setAddLoading(false));
		}).catch(() => {
			dispatch(setAddLoading(false));
			dispatch(setAlertMessage({
				type: 'danger',
				message: ValidationMsgs.table.notStored
			}));
		});
	}
	useEffect(() => {
		getTableTemplate();
	}, [saveFilter?.tabName]);
	return (
		<div className="w-full relative">
			<div className={tablePadding ? `${tablePadding}` : "p-5"}>
				{filters &&
					<div
						className={`w-full flex flex-wrap sm:auto-cols-max justify-between gap-2 pb-7 ${filterPosition === "left" ? "flex-row-reverse" : ""
							}`}
					>
						{dropdownFilterOptions &&
							dropdownFilterOptions.map((value, index) => {
								return (
									<DropdownFilter
										setColumnFilter={setColumnFilter}
										filteringOptions={filteringOptions}
										{...value}
										key={index}
									/>
								);
							})}
						{displaySearch === 'left' && (
							<TableSearch setColumnFilter={setColumnFilter} filter={globalFilter} setFilter={setGlobalFilter} placeholderText={placeholderText} filteringOptions={filteringOptions} />
						)}
						<div>
							<div
								className="inline-flex mr-1"
								role="group"
							>
								{checkBoxFilterOptions &&
									checkBoxFilterOptions.map((value, index) => {
										return (
											<CheckboxFilter
												setColumnFilter={setColumnFilter}
												filteringOptions={filteringOptions}
												{...value}
												key={index}
											/>
										);
									})}

								{radioFilterOptions &&
									radioFilterOptions.map((value, index) => {
										return (
											<RadiobuttonFilter
												setColumnFilter={setColumnFilter}
												filteringOptions={filteringOptions}
												{...value}
												key={index}
											/>
										);
									})}
								{sortingColumns && (
									<Sorting
										options={sortingColumns}
										setSortingOptions={setSortingOptions}
									/>
								)}
								{editColumnFilter && (
									<EditColumn
										allColumns={allColumns}
										columns={initialColumnOrder}
										setHiddenColumns={setHiddenColumns}
										changeColumnFormat={changeColumnFormat}
										saveFilterOptionsHandler={saveFilterOptionsHandler}
									/>
								)}
								{extraFilter &&
									extraFilter.map(({ Component, ...rest }, index) => {
										return (
											<Fragment key={index}>
												<Component {...rest} />
											</Fragment>
										);
									})}
							</div>
							{refreshTable && <RefreshTable refreshTableFunction={fetchData} />}
							{saveFilter?.show &&
								<SaveFilter {...saveFilter} saveFilterOptionsHandler={saveFilterOptionsHandler} />}
							{moreFilterOption && (
								<MoreFilter
									filteringOptions={filteringOptions}
									setColumnFilteringOptions={setColumnFilteringOptions}
									moreFilterOption={moreFilterOption}
								/>
							)}
							{download && <Download />}
						</div>
						{(displaySearch === 'right') && (
							<TableSearch filter={globalFilter} setFilter={setGlobalFilter} placeholderText={placeholderText} />
						)}
					</div>
				}
				<div className={!GridView ? "overflow-x-auto border-t border-neutral-200" : "overflow-x-auto"}>
					{!GridView ? (
						<table
							{...getTableProps}
							className="table-auto w-full text-sm text-[#191919] overflow-x-scroll overflow-y-hidden"
						>
							<thead className="text-sm bg-white font-bold uppercase text-[#b3b3b3] border-b border-neutral-200">
								{headerGroups.map((headerGroup) => {
									return (
										<tr {...headerGroup.getHeaderGroupProps()}>
											{headerGroup.headers.map((column, index) => {
												return (
													<th
														key={index}
														{...column.getHeaderProps(
															column.getSortByToggleProps()
														)}
														className={`px-2 first:pl-5 py-4 cursor-pointer w-2`}
														onClick={() =>
															(!column.disableSortBy && sortingOptions.length > 0) &&
															setSortingOptions(
																column.column_name,
																sortingOptions[0].direction === 0 ? 1 : 0
															)
														}
													>
														<div
															className={`font-semibold text-left w-auto whitespace-nowrap flex items-center break-before-avoid ${column.width ? column.width : "w-auto"}`}
														>
															{column.render("Header")}
															{!column.disableSortBy &&
																((sortingOptions.length > 0 && column.column_name === sortingOptions[0].field) ? (
																	<div className="flex flex-col pl-2">
																		<span
																			className={`material-icons-outlined text-sm h-2 leading-[10px] ${sortingOptions[0].direction === 0
																				? "text-black"
																				: ""
																				}`}
																		>
																			keyboard_arrow_up
																		</span>
																		<span
																			className={`material-icons-outlined text-sm h-2 leading-[10px] ${sortingOptions[0].direction === 1
																				? "text-black"
																				: ""
																				}`}
																		>
																			keyboard_arrow_down
																		</span>
																	</div>
																) : (
																	<>
																		<div className="flex flex-col pl-2">
																			<span className="material-icons-outlined text-sm h-2 leading-[10px]">
																				keyboard_arrow_up
																			</span>
																			<span className="material-icons-outlined text-sm h-2 leading-[10px]">
																				keyboard_arrow_down
																			</span>
																		</div>
																	</>
																))}
														</div>
													</th>
												);
											})}
										</tr>
									);
								})}
							</thead>
							<tbody
								{...getTableBodyProps}
								className="text-sm divide-y divide-slate-200"
							>
								{
									rows.map((row) => {
										prepareRow(row);
										return (
											<tr {...row.getRowProps()}>
												{(!row.canExpand && isColspan) ? (
													<td colSpan={colSpan} className={`px-2 first:pl-5 py-3 relative`}>
														{row.cells[1].render("Cell")}
													</td>
												) : row.cells.map((cell, index) => {
													return (
														<td
															key={index}
															{...cell.getCellProps()}

															className={`px-2 first:pl-5 py-3 ${actionRelativeCl ? "relative" : ""}`}

														>
															{cell.render("Cell")}
														</td>
													);
												})}
											</tr>
										);
									})
								}

							</tbody>
							{footer && (
								<tfoot className={`text-sm font-bold uppercase text-[#b3b3b3]  ${true ? "border-t-2 divide-slate-200" : "border-b border-neutral-200"}`}>
									{footerGroups.map((footerGroup) => {
										return (
											<tr {...footerGroup.getFooterGroupProps()}>
												{footerGroup.headers.map((column, index) => {
													return (
														<td
															key={index}
															{...column.getFooterProps}
															className={`px-2 first:pl-5 py-4 w-px`}
														>
															<div className="font-semibold text-left w-auto flex items-center">
																{column.render("Footer")}
															</div>
														</td>
													);
												})}
											</tr>
										);
									})}
								</tfoot>
							)}
						</table>
					) : (
						<>
							<GridViewTemplate page={page} prepareRow={prepareRow} isColspan={isColspan} colSpan={colSpan} Gap={Gap} />
						</>
					)}
					{(page.length <= 0) && <p className="flex justify-center items-center p-5 rounded-t border-b sticky top-0 left-0 text-red-600 bg-white">No data found as of now.</p>}
				</div>
				{totalCount > 0 &&
					<Pagination totalCount={totalCount} pageSize={pageSize} totalPages={totalPages} pageIndex={pageIndex} setTablePageSize={setTablePageSize} hasPreviousPage={hasPreviousPage} hasNextPage={hasNextPage} hasPageSize={hasPageSize} fetchData={fetchData} />
				}
			</div>
		</div >
	);
};

export default React.memo(ReactTable);

const expandedColumn = {
	id: "expander",
	accessor: "a",
	Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
		<span {...getToggleAllRowsExpandedProps()}>
			{isAllRowsExpanded ? (
				<span className="material-icons-outlined select-none leading-none ml-2 w-6 h-6 cursor-pointer transition-all variant-arrow">
					remove
				</span>
			) : (
				<span className="material-icons-outlined select-none leading-none ml-2 w-6 h-6 cursor-pointer transition-all variant-arrow">
					add
				</span>
			)}
		</span>
	),
	Cell: ({ row }) => {
		return row.canExpand ? (
			<span
				{...row.getToggleRowExpandedProps({
					style: {
						paddingLeft: `${row.depth * 2}rem`,
					},
				})}
			>
				{row.isExpanded ? (
					<span className="material-icons-outlined select-none leading-none ml-2 w-6 h-6 cursor-pointer transition-all variant-arrow">
						remove
					</span>
				) : (
					<span className="material-icons-outlined select-none leading-none ml-2 w-6 h-6 cursor-pointer transition-all variant-arrow">
						add
					</span>
				)}
			</span>
		) : null;
	},
	disableShowHide: true,
	disableSortBy: true,
};