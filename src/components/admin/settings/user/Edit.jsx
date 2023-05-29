import React,{useEffect, useState, useRef} from 'react'
import { NavLink } from 'react-router-dom'
import Transition from '../../utils/Transition';
import axios from 'axios';
import { useParams } from "react-router-dom";
import $ from 'jquery';

const EditUser = (props) => {
    const params = useParams();
    const [user, setUser] = useState([])
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownOpen1, setDropdownOpen1] = useState(false);

    const trigger = useRef(null);
    const trigger1 = useRef(null);
    const dropdown = useRef(null);
    const dropdown1 = useRef(null);


    useEffect(() => {
		
		const id = params.id
        axios.get(`https://jsonplaceholder.typicode.com/users/${id}`).then(res=>{
        // console.log(res.data)
        setUser(res.data)
    })
	},[])	


    useEffect(() => {
        const clickHandler = ({ target }) => {
          if (!dropdown.current) return;
          if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target))
            return;
          setDropdownOpen(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
      });
    
      // close if the esc key is pressed
      useEffect(() => {
        const keyHandler = ({ keyCode }) => {
          if (!dropdownOpen || keyCode !== 27) return;
          setDropdownOpen(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
      });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full">
    <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="col-span-full w-full flex justify-between items-center">
        <h1 className="flex">
            <NavLink to={'/admin/Settings/userList'} className="btn border-neutral-200 hover:border-neutral-400 text-gray-500 hover:text-gray-700 flex items-center mr-2">
                <span className="material-icons-outlined">
                    west
                </span>
            </NavLink>
            <span className="text-2xl md:text-3xl text-gray-800 font-bold">Edit User</span>
        </h1>
            <div className="flex flex-wrap sm:auto-cols-max gap-2">
                <a href="javascript:void:(0);" className="btn bg-indigo-500 hover:bg-indigo-600 text-white"> <span className="ml-1">Edit user</span></a>
            </div>
        </div>
    </div>
    <div className="w-full bg-white shadow-lg rounded-md border border-neutral-200 p-6 mb-6">
        <div className="addUser " id="usersDiv">
            <div className="flex w-full py-2">
                <div className="w-1/3 mb-6 mr-5">
                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name"> First Name</label>
                    <input className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md" id="grid-first-name" type="text" placeholder="" value={user.name}/>
                </div>
                <div className="w-1/3 mb-6 mr-5">
                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name"> Last Name</label>
                    <input className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md" id="grid-first-name" type="text" placeholder="" value={user.username}/>
                </div>
                <div className="w-1/3 mb-6">
                    <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name"> Email</label>
                    <input className="block w-full bg-white border border-neutral-200 hover:border-neutral-300 focus:border-neutral-300 focus:ring-0 focus:shadow-lg px-2 py-2 rounded-md" id="grid-first-name" type="text" placeholder="" value={user.email}/>
                </div>
                <div className="flex justify-between items-center"><div className="text-center w-7">&nbsp;</div></div>
            </div>
        </div>
        <div className="flex w-full mt-10">
            <div className="w-1/3 mb-6 mr-5">
                <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name"> Role</label>
                <div className="relative inline-flex w-full" x-data="{ open: false }">
                <div ref={trigger}
                    className="btn w-full justify-between min-w-44 bg-white border-neutral-200 hover:border-neutral-300 text-gray-500 hover:text-gray-600"
                    aria-haspopup="false"
                    aria-label="Select date range"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-expanded={dropdownOpen}>
                        <span>Roles</span>
                        <span className="material-icons-outlined">expand_more</span>
                </div>
                <Transition
                    show={dropdownOpen}
                    tag="div"
                    className="z-10 absolute top-full left-0 w-full bg-white border border-slate-200 py-1.5 rounded shadow-lg overflow-hidden mt-1"
                    enter="transition ease-out duration-100 transform"
                    enterStart="opacity-0 -translate-y-2"
                    enterEnd="opacity-100 translate-y-0"
                    leave="transition ease-out duration-100"
                    leaveStart="opacity-100"
                    leaveEnd="opacity-0">
                    <div
                        ref={dropdown}
                        className="font-medium text-sm text-slate-600"
                        onFocus={() => setDropdownOpen(true)}
                        onBlur={() => setDropdownOpen(false)}
                    >
                        <ul className="mb-4">
                            <li className="py-1 px-3">
                                <label
                                    className="flex items-center">
                                    <input type="checkbox"
                                        className="form-checkbox"/>
                                    <span
                                        className="text-sm font-medium ml-2">Admin</span>
                                </label>
                            </li>
                            <li className="py-1 px-3">
                                <label
                                    className="flex items-center">
                                    <input type="checkbox"
                                        className="form-checkbox"/>
                                    <span
                                        className="text-sm font-medium ml-2">Author</span>
                                </label>
                            </li>
                            <li className="py-1 px-3">
                                <label
                                    className="flex items-center">
                                    <input type="checkbox"
                                        className="form-checkbox"/>
                                    <span
                                        className="text-sm font-medium ml-2">Editor</span>
                                </label>
                            </li>
                        </ul>
                    </div>
                </Transition>
                </div>
            </div>

            <div className="w-1/3 mb-6 mr-5">
                <label className="block uppercase tracking-wide text-gray-500 text-xs font-bold mb-2" htmlFor="grid-first-name"> Project</label>
                <div className="relative inline-flex w-full" x-data="{ open: false, selected: 0 }">
                <div 
                    ref={trigger1}
                    className="w-full flex flex-wrap justify-between rounded-l items-center text-sm px-3 py-2 bg-white border border-neutral-200 hover:border-neutral-300 text-gray-500 hover:text-gray-600"
                    aria-haspopup="false"
                    onClick={() => setDropdownOpen1(!dropdownOpen1)}
                    aria-expanded={dropdownOpen1}>
                        <span className="ml-1">Assign projects</span><wbr/>
                        <span className="material-icons-outlined">expand_more</span>
                </div>
                    <Transition show={dropdownOpen1}
                        tag="div"
                        className="z-10 absolute top-full left-0 w-full bg-white border border-neutral-200 py-1.5 rounded shadow-lg overflow-hidden mt-1"
                        enter="transition ease-out duration-200 transform"
                        enterStart="opacity-0 -translate-y-2"
                        enterEnd="opacity-100 translate-y-0"
                        leave="transition ease-out duration-200"
                        leaveStart="opacity-100"
                        leaveEnd="opacity-0"
                    >
                        <div ref={dropdown1}
                            className="font-medium text-sm text-gray-600"
                            onFocus={() => setDropdownOpen1(true)}
                            onBlur={() => setDropdownOpen1(false)}
                        >
                            <ul className="mb-4">
                                <li className="py-1 px-3">
                                    <label
                                        className="flex items-center">
                                        <input type="checkbox"
                                            className="form-checkbox"/>
                                        <span
                                            className="text-sm font-medium ml-2">Corporate
                                            Gear</span>
                                    </label>
                                </li>
                                <li className="py-1 px-3">
                                    <label
                                        className="flex items-center">
                                        <input type="checkbox"
                                            className="form-checkbox"/>
                                        <span
                                            className="text-sm font-medium ml-2">PH
                                            Health Gear</span>
                                    </label>
                                </li>
                                <li className="py-1 px-3">
                                    <label
                                        className="flex items-center">
                                        <input type="checkbox"
                                            className="form-checkbox"/>
                                        <span
                                            className="text-sm font-medium ml-2">Driving
                                            Impressions</span>
                                    </label>
                                </li>
                                <li className="py-1 px-3">
                                    <label
                                        className="flex items-center">
                                        <input type="checkbox"
                                            className="form-checkbox"/>
                                        <span
                                            className="text-sm font-medium ml-2">Humana
                                            Heroes</span>
                                    </label>
                                </li>
                            </ul>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>
    </div>
</div>
  )
}

export default EditUser