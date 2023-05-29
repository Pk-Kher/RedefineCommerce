import React, { useRef, useState, useEffect, Fragment } from "react";
import { NavLink, useLocation } from "react-router-dom";
import SidebarLinkGroup from "./SidebarLinkGroup.jsx";
import UserService from "services/admin/user/UserService.jsx";
import { useSelector, useDispatch } from "react-redux";
import { storeMenuListByUserData } from "redux/GetMenuListByUserRole/MenuListByUserRoleActions"
import { addActiveTab, setSearchQuery, fillSerchQuery } from "redux/searchQueryForMGS/SearchQueryAction"

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
	const location = useLocation();
	const { pathname } = location;
	const [MenuList, setMenuList] = useState([]);
	const user = useSelector((store) => store?.user);
	const CompanyId = useSelector((store) => store?.CompanyConfiguration.id)
	const dispatch = useDispatch();

	useEffect(() => {
		if (user?.id && CompanyId) {
			UserService.getMenuList({ userId: user.id, companyConfigurationId: CompanyId, isSuperUser: user?.isSuperUser || false }).then((response) => {
				if (response?.data?.data) {
					setMenuList(response?.data?.data);
					dispatch(storeMenuListByUserData(response?.data?.data));
				}
			}).catch(() => { });
		}
	}, [user, CompanyId]);

	// const trigger = useRef(null);
	const sidebar = useRef(null);
	const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
	const [sidebarExpanded, setSidebarExpanded] = useState(
		storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
	);
	useEffect(() => {
		localStorage.setItem("sidebar-expanded", sidebarExpanded);
		if (sidebarExpanded) {
			document.querySelector("body").classList.add("sidebar-expanded");
		} else {
			document.querySelector("body").classList.remove("sidebar-expanded");
		}
	}, [sidebarExpanded]);

	// close on click outside
	useEffect(() => {
		const clickHandler = ({ target }) => {
			if (!sidebar.current) return;
			if (!sidebarOpen || sidebar.current.contains(target)) return;
			//   setSidebarOpen(false);
		};
		document.addEventListener("click", clickHandler);
		return () => document.removeEventListener("click", clickHandler);
	});

	// close if the esc key is pressed
	useEffect(() => {
		const keyHandler = ({ keyCode }) => {
			if (!sidebarOpen || keyCode !== 27) return;
			setSidebarOpen(false);
		};
		document.addEventListener("keydown", keyHandler);
		return () => document.removeEventListener("keydown", keyHandler);
	});
	useEffect(() => {
		localStorage.setItem("sidebar-expanded", sidebarExpanded);
		if (sidebarExpanded) {
			document.querySelector("body").classList.add("sidebar-expanded");
		} else {
			document.querySelector("body").classList.remove("sidebar-expanded");
		}
	}, [sidebarExpanded]);

	const findSelectedMenu = (menuList) => {
		let menuUrl = menuList.navigationurl.startsWith("/") ? menuList.navigationurl : '/' + menuList.navigationurl
		if (menuList.navigationurl && menuList.navigationurl !== '' && pathname.toLowerCase().startsWith(menuUrl.toLowerCase())) {
			return true;
		} else if (menuList.subRows && menuList.subRows.length > 0) {
			var temp = false;
			for (let index = 0; index < menuList.subRows.length; index++) {
				temp = findSelectedMenu(menuList.subRows[index]);
				if (temp) {
					break;
				}
			}
			return temp;
		} else {
			return false;
		}

	}

	const resetSerchQueryRedux = () => {
		dispatch(setSearchQuery(""));
		dispatch(fillSerchQuery(false));
		dispatch(addActiveTab(0));
	}

	const createSubmenu = (menu, index, background) => {
		let menuUrl = menu.navigationurl.startsWith("/") ? menu.navigationurl : '/' + menu.navigationurl
		var currentUrl = (menu.navigationurl !== '' && pathname.toLowerCase().startsWith(menuUrl.toLowerCase()));
		var iconColor = (menu.isNavigation) ? (findSelectedMenu(menu) ? true : false) : currentUrl;
		if (!menu.subRows || menu.subRows.length <= 0) {
			return (
				<Fragment key={index}>
					{
						menu.parentId === 0 ?
							<Fragment key={index}>
								<li className={`px-3 pt-2 pb-2 rounded-sm mb-1 last:mb-0`}>
									<NavLink
										end
										to={menuUrl}
										className={`block text-lightpurple-700 hover:text-lightpurple-900 truncate transition duration-150 font-bold ${currentUrl && background ? "font-bold" : "font-semibold"} ${(currentUrl && menu.isNavigation) ? 'bg-red-500  px-1 py-2 rounded-md' : ''}`}
										onClick={() => resetSerchQueryRedux()}
									>
										<div className="flex items-center">
											<div className="flex items-center">
												{(menu.menuicon && menu.menuicon !== '') && <span className={`material-icons-outlined ${iconColor ? "text-red-500" : "text-[#b8b8bc]"} ${menu.isNavigation && currentUrl ? "text-white" : ""}`}>{menu.menuicon}</span>}
												<span className={`text-sm ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 duration-200 ${(currentUrl && background) ? "font-bold" : "font-semibold"} ${menu.isNavigation && currentUrl ? "text-white" : ""}`}>{menu.name}</span>
											</div>
										</div>
									</NavLink>
								</li>
							</Fragment>
							:
							<Fragment key={index}>
								<li className={`${menu.parentId === 0 ? "px-3 py-2 rounded-sm mb-1 last:mb-0" : ""}`}>
									<NavLink
										end
										to={menuUrl}
										className={`block text-lightpurple-700 hover:text-lightpurple-900 transition duration-150  px-3 py-2 rounded-md ${currentUrl && background ? "bg-red-500 font-bold" : " rounded-md text-lightpurple-700 hover:text-lightpurple-900"}`}
										onClick={() => resetSerchQueryRedux()}
									>

										{/* {(menu.menuicon && menu.menuicon !== '') && <span className={`material-icons-outlined mr-3 ${pathname.startsWith(menu.navigationurl) ? "text-white" : "text-[#b8b8bc]"}`}>{menu.menuicon}</span>} */}
										<div className={`text-sm lg:opacity-0 lg:sidebar-expanded:opacity-100 duration-200 break-words ${currentUrl ? "text-white" : ""}`}>{menu.name}</div>

									</NavLink>
								</li>
							</Fragment>
					}

				</Fragment >
			)
		}
		if (menu.subRows) {
			return (
				<SidebarLinkGroup
					activecondition={iconColor}
					key={index}
					type={menu.parentId === 0}
				>
					{(handleClick, open) => {
						return (
							<React.Fragment>
								<a
									href="#0"
									className={`${menu.parentId !== 0 ? 'py-2' : ""} block text-lightpurple-700 hover:text-lightpurple-900 transition duration-150 ${currentUrl &&
										"hover:text-lightpurple-700"
										}`}
									onClick={(e) => {
										e.preventDefault();
										sidebarExpanded
											? handleClick()
											: setSidebarExpanded(true);
									}}
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center">
											{(menu.menuicon && menu.menuicon !== '') && <span className={`material-icons-outlined ${menu.parentId !== 0 && 'ml-3'} ${iconColor ? "text-red-500" : "text-[#b8b8bc]"}`}>{menu.menuicon}</span>}
											<span className={`text-sm ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 duration-200 break-words ${currentUrl ? "font-bold" : "font-semibold"}`}>
												{menu.name}
											</span>
										</div>
										{/* Icon */}
										<div className="flex shrink-0 ml-2 lg:opacity-0 lg:sidebar-expanded:opacity-100 duration-200">
											<svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${open && "transform rotate-180"}`} viewBox="0 0 12 12" >
												<path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
											</svg>
										</div>
									</div>
								</a>
								<div className="lg:hidden lg:sidebar-expanded:block">
									<ul className={`${(menu.menuicon && menu.menuicon !== '') ? 'pl-9' : "pl-3"} mt-2 ${!open && "hidden"}`}>
										{
											menu.subRows.map((menu, index) => {
												return createSubmenu(menu, index, background = true);
											})
										}
									</ul>
								</div>

							</React.Fragment>
						);
					}}
				</SidebarLinkGroup>
			);
		}
	}
	return (
		<>
			<div>
				<div className={`fixed inset-0 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} aria-hidden="true" />
				<div
					id="sidebar"
					ref={sidebar}
					className={`flex flex-col absolute lg:static bg-slate-100 border-r border-neutral-200 z-40 left-0 mt-16 h-[calc(100vh-4rem)] lg:left-auto lg:translate-x-0 transform overflow-y-scroll lg:overflow-y-auto lg:w-20 lg:sidebar-expanded:!w-72 shrink-0 p-3 transition-all duration-200 ease-in-out -translate-x-72  ${sidebarOpen ? "translate-x-0  w-72" : "-translate-x-64"
						}`}
				>
					<div className="space-y-8">
						<div>
							<ul className="mt-3">
								{
									MenuList.map((menu, index) => {
										return createSubmenu(menu, index);

									})
								}

							</ul>
						</div>
					</div>

					{/* Expand / collapse button */}
					<div className="pt-3 hidden lg:inline-flex justify-end mt-auto">
						<div className="px-3 py-2">
							<button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
								<span className="sr-only">Expand / collapse sidebar</span>
								<svg
									className="w-6 h-6 fill-current sidebar-expanded:rotate-180"
									viewBox="0 0 24 24"
								>
									<path
										className="text-lightpurple-500"
										d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z"
									></path>
									<path className="text-gray-600" d="M3 23H1V1h2z"></path>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
