import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import ReactDOM from 'react-dom';
import { FieldArray } from "formik";
import ColorPicker from 'components/admin/content/common/ColorPicker';
import ImageFile from 'components/admin/content/common/ImageFile';
import { useEffect } from 'react';
import { object } from 'yup';
import ReactDOMServer from 'react-dom/server';
import header3 from 'assets/images/svgImages/header-3.svg';
import header4 from 'assets/images/svgImages/header-4.svg';
import header5 from 'assets/images/svgImages/header-5.svg';
import header6 from 'assets/images/svgImages/header-6.svg';
import header7 from 'assets/images/svgImages/header-7.svg';
import { Formik, useFormikContext } from 'formik';
import Input from 'components/common/formComponent/Input';
import Checkbox from 'components/common/formComponent/Checkbox';


const ElementHeaderSetup = ({ imagePath, headerProps, setHeaderProps }) => {


    const [showHide, setShowHide] = useState(false);
    const [headerLayout, setHeaderLayout] = useState(headerProps.header_layout);
    const [desktopImage, setDesktopImage] = useState('');
    const [mobileImage, setMobileImage] = useState('');

    const onSubmit = ({ fields }) => {
       // console.log(fields, "ON Save Click");
    }

    const onChangeCheck = (e) => {
        setHeaderProps({ ...headerProps, [e.target.name]: e.target.checked })
    }

    const onChangeLayout = (layout) => {
        setHeaderProps({ ...headerProps, header_layout: layout })
    }

    const onChangeAlignment = (name, value) => {
        setHeaderProps({ ...headerProps, [name]: value })
    }

    const onDesktopImageChange = (url) => {
        setDesktopImage(url);
        setHeaderProps({ ...headerProps, "desktop_image": url });
    }

    const onMobileImageChange = (url) => {
        setMobileImage(url);
        setHeaderProps({ ...headerProps, "mobile_image": url });

    }

    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={headerProps}
                onSubmit={onSubmit}
            >
                {
                    ({ setFieldValue, errors, values, resetForm }) => {
                        return (
                            <div className="relative border-b border-neutral-00">
                                <button onClick={() => { setShowHide(!showHide) }}
                                    className="flex w-full flex-wrap justify-between items-center text-sm px-3 py-4 bg-white border-0 font-bold">
                                    <span >{"Header"}</span>
                                    <span className="material-icons-outlined">expand_more</span>
                                </button>

                                <div className={`property-content bg-white border-y border-b-0 border-neutral-200 ${showHide ? "" : "hidden"}`}>
                                    <div className="py-4 px-3">
                                        {/* Layout Properties  */}
                                        <div className="last:mb-0 flex flex-wrap justify-between items-center">
                                            <label htmlFor="" className="mb-1 block text-sm font-bold">Layout Select</label>
                                            <div className="grid grid-cols-3 gap-2 mb-5">
                                                <div className={`border-2 rounded-md overflow-hidden focus:ring-indigo-500 focus:border-indigo-500 ${(headerProps.header_layout == 1) ? 'border-blue-500' : 'border-gray-300'}`} onClick={onChangeLayout.bind(null, "1")}>
                                                    <img alt="" src={header3} />
                                                </div>
                                                <div className={`border-2 rounded-md overflow-hidden focus:ring-indigo-500 focus:border-indigo-500 ${(headerProps.header_layout == 2) ? 'border-blue-500' : 'border-gray-300'}`} onClick={onChangeLayout.bind(null, "2")}>
                                                    <img alt="" src={header4} />
                                                </div>
                                                <div className={`border-2 rounded-md overflow-hidden focus:ring-indigo-500 focus:border-indigo-500 ${(headerProps.header_layout == 3) ? 'border-blue-500' : 'border-gray-300'}`} onClick={onChangeLayout.bind(null, "3")}>
                                                    <img alt="" src={header5} />
                                                </div>
                                                <div className={`border-2 rounded-md overflow-hidden focus:ring-indigo-500 focus:border-indigo-500 ${(headerProps.header_layout == 4) ? 'border-blue-500' : 'border-gray-300'}`} onClick={onChangeLayout.bind(null, "4")}>
                                                    <img alt="" src={header6} />
                                                </div>
                                                <div className={`border-2 rounded-md overflow-hidden focus:ring-indigo-500 focus:border-indigo-500 ${(headerProps.header_layout == 5) ? 'border-blue-500' : 'border-gray-300'}`} onClick={onChangeLayout.bind(null, "5")}>
                                                    <img alt="" src={header7} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Header Position, Width and Tranparncy Properties */}
                                        {/* <div>
                                            <div className="mb-2 last:mb-0 flex flex-wrap justify-between border-t border-gray-300 pt-4">
                                                <label className="text-gray-500 flex items-center">
                                                    <input type="checkbox" 
                                                        name="enable_sticky_header" 
                                                        className="form-checkbox" 
                                                        checked={headerProps?.enable_sticky_header}
                                                        onChange={onChangeCheck}
                                                    />
                                                    <span className="ml-2 text-sm">Enable sticky header</span> 
                                                </label>
                                            </div>
                                            <div className="mb-2 last:mb-0 flex flex-wrap justify-between">
                                                <label className="text-gray-500 flex items-center">
                                                    <input 
                                                        type="checkbox" 
                                                        name="enable_fullwidth" 
                                                        className="form-checkbox" 
                                                        checked={headerProps?.enable_fullwidth}
                                                        onChange={onChangeCheck}
                                                    />
                                                    <span className="ml-2 text-sm">Enable fullwidth</span> 
                                                </label>
                                            </div>
                                            <div className="mb-4 last:mb-0 flex flex-wrap justify-between">
                                                <label className="text-gray-500 flex items-center">
                                                    <input 
                                                        type="checkbox" 
                                                        name='overlay_header' 
                                                        className="form-checkbox" 
                                                        checked={headerProps?.overlay_header}
                                                        onChange={onChangeCheck}
                                                    />
                                                    <span className="ml-2 text-sm">Overlay header on homepage</span> 
                                                </label>
                                            </div>
                                            <div className="pb-4 last:mb-0 flex flex-wrap justify-between border-t border-gray-300 pt-4">
                                                <label className="font-bold">Transparent Header</label>
                                                <div className="text-xs text-gary-300 mb-2">Home page only. For best results, use an mage section such as slideshow.</div>
                                                <label className="text-gray-500 flex items-center">
                                                    <input 
                                                        type="checkbox" 
                                                        name='reduce_padding' 
                                                        className="form-checkbox" 
                                                        checked={headerProps?.reduce_padding}
                                                        onChange={onChangeCheck}
                                                    />
                                                    <span className="ml-2">Reduce pedding</span> 
                                                </label>
                                            </div>
                                        </div> */}

                                        {/* Color (BG and Text) Properties  */}
                                        <div>
                                            <div className="mb-4 last:mb-0 flex flex-wrap justify-between border-t border-gray-300 pt-4">
                                                <label className="block text-sm font-medium mb-1"> Header Bg color </label>
                                                <div className="flex flex-wrap">
                                                    <ColorPicker
                                                        name="header_bg_color"
                                                        changeBackgroundColor={(color) => {
                                                            setHeaderProps({ ...headerProps, header_bg_color: color.hex })
                                                        }}
                                                        value={headerProps?.header_bg_color}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-4 last:mb-0 flex flex-wrap justify-between border-t border-gray-300 pt-4">
                                                <label className="block text-sm font-medium mb-1"> Header Text color </label>
                                                <div className="flex flex-wrap">
                                                    <ColorPicker
                                                        name="header_text_color"
                                                        value={headerProps?.header_text_color}
                                                        changeBackgroundColor={(color) => {
                                                            setHeaderProps({ ...headerProps, header_text_color: color.hex })
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="w-full py-4 px-0">
                                                <label className="mb-4 block text-sm font-bold border-b border-gray-300">Logo </label>

                                                {/* DeskTop Logo Attributes */}
                                                <div>
                                                    <div className="mb-1">Desktop Image</div>
                                                    <div className="mb-3">
                                                        <ImageFile
                                                            type="file"
                                                            className="sr-only"
                                                            name="desktop_image"
                                                            id="desktop_image"
                                                            buttonName="Add"
                                                            folderpath={imagePath}
                                                            edibtn={true}
                                                            onChange={onDesktopImageChange}
                                                            url={desktopImage}
                                                        />
                                                    </div>
                                                    <div className="mb-4 last:mb-0 flex flex-wrap justify-between">
                                                        <label>logo Resize</label>
                                                        <div className="max-w-screen-xl mx-auto grid grid-cols-12 gap-2">
                                                            <Input
                                                                name="desktop_logo_resize"
                                                                type="range"
                                                                min="0"
                                                                max="100"
                                                                step="5"
                                                                className="col-span-8 py-0"
                                                                defaultValue={headerProps.desktop_logo_resize}
                                                                onChange={(e) => {
                                                                    setFieldValue('desktop_logo_resize', e.target.value);
                                                                    setHeaderProps({ ...headerProps, desktop_logo_resize: e.target.value })
                                                                }}
                                                            />
                                                            <Input
                                                                name="desktop_logo_resize" type="text"
                                                                className="col-span-4"
                                                                defaultValue={headerProps.desktop_logo_resize}
                                                                onChange={(e) => {
                                                                    setFieldValue('desktop_logo_resize', e.target.value);
                                                                    setHeaderProps({ ...headerProps, desktop_logo_resize: e.target.value })
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="mb-3">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <div >Alt Tag</div>
                                                        </div>
                                                        <div className="text-center relative overflow-hidden">
                                                            <Input
                                                                type="text"
                                                                name="desktop_logo_alt"
                                                                className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-3 py-2 leading-tight focus:outline-none focus:bg-white"
                                                                defaultValue={headerProps.desktop_logo_alt}
                                                                onChange={(e) => {
                                                                    setFieldValue('desktop_logo_alt', e.target.value);
                                                                    setHeaderProps({ ...headerProps, desktop_logo_alt: e.target.value })
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="mb-4 last:mb-0 justify-between">
                                                        <div className="flex justify-between items-center mb-4 last:mb-0">
                                                            <div className="block">Alignment</div>
                                                        </div>
                                                        <Alignment
                                                            name="desktop_logo_alignment"
                                                            onChangeAlignment={onChangeAlignment}
                                                            headerProps={headerProps}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Mobile Logo Attributes */}
                                                <div className="mt-4 mb-3">
                                                    <div className="mb-1">Mobile Image</div>
                                                    <div className="mb-3">
                                                        <ImageFile
                                                            type="file"
                                                            className="sr-only"
                                                            name="mobile_logo"
                                                            id="mobile_logo"
                                                            buttonName="Add"
                                                            folderpath={imagePath}
                                                            edibtn={true}
                                                            onChange={onMobileImageChange}
                                                            url={mobileImage}
                                                        />
                                                    </div>
                                                    <div className="mb-4 last:mb-0 flex flex-wrap justify-between">
                                                        <label>logo Resize</label>
                                                        <div className="max-w-screen-xl mx-auto grid grid-cols-12 gap-2">
                                                            <Input
                                                                name="mobile_logo_resize"
                                                                type="range"
                                                                min="0"
                                                                max="100"
                                                                step="5"
                                                                className="col-span-8 py-0"
                                                                onChange={(e) => {
                                                                    setFieldValue('mobile_logo_resize', e.target.value);
                                                                    setHeaderProps({ ...headerProps, mobile_logo_resize: e.target.value })
                                                                }}
                                                            />
                                                            <Input
                                                                name="mobile_logo_resize"
                                                                type="text"
                                                                className="col-span-4"
                                                                onChange={(e) => {
                                                                    setFieldValue('mobile_logo_resize', e.target.value);
                                                                    setHeaderProps({ ...headerProps, mobile_logo_resize: e.target.value })
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="mb-3">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <div >Alt Tag</div>
                                                        </div>
                                                        <div className="text-center relative overflow-hidden">
                                                            <input
                                                                type="text"
                                                                name="mobile_logo_alt"
                                                                defaultValue={headerProps?.mobile_logo_alt}
                                                                className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-3 py-2 leading-tight focus:outline-none focus:bg-white"
                                                                onChange={(e) => {
                                                                    setHeaderProps({ ...headerProps, mobile_logo_alt: e.target.value })
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="mb-4 last:mb-0 flex-wrap justify-between">
                                                        <div className="flex justify-between items-center mb-4 last:mb-0">
                                                            <div className="block">Alignment</div>
                                                        </div>
                                                        <Alignment
                                                            name="mobile_logo_alignment"
                                                            onChangeAlignment={onChangeAlignment}
                                                            headerProps={headerProps} />
                                                    </div>
                                                </div>

                                                {/* Logo Title Property */}
                                                <div className="mb-3">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <div className="text-sm">Title</div>
                                                    </div>
                                                    <div className="text-center relative overflow-hidden">
                                                        <Input
                                                            type="text"
                                                            name="logo_title"
                                                            className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-3 py-2 leading-tight focus:outline-none focus:bg-white"
                                                            defaultValue={headerProps.logo_title}
                                                            onChange={(e) => {
                                                                setFieldValue('logo_title', e.target.value);
                                                                setHeaderProps({ ...headerProps, logo_title: e.target.value })
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Logo URL */}
                                                <div className="mb-3">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <div className="text-sm">Link URL</div>
                                                    </div>
                                                    <div className="text-center relative overflow-hidden">
                                                        <Input
                                                            type="text"
                                                            name="image_link"
                                                            className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-3 py-2 leading-tight focus:outline-none focus:bg-white"
                                                            defaultValue={headerProps.image_link}
                                                            onChange={(e) => {
                                                                setFieldValue('image_link', e.target.value);
                                                                setHeaderProps({ ...headerProps, image_link: e.target.value })
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu Navication */}
                                        <div style={{ display: "none" }}>
                                            <Navigation headerProps={headerProps} setHeaderProps={setHeaderProps} />
                                        </div>

                                        {/* Header Icons Settings */}
                                        <div>
                                            <HeaderIconsSetting />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                }
            </Formik>

        </>
    );
};

export default ElementHeaderSetup;

const Alignment = ({ name, onChangeAlignment, headerProps }) => {

    let AlignmentArr = ['Left', 'Center', 'Right'];
    return (
        <div className="justify-between mb-4 last:mb-0">
            <div className="grid grid-cols-3 gap-1 px-4">
                {
                    AlignmentArr.map((value, index) => {
                        return (
                            <div className="w-full">
                                <button
                                    type='button'
                                    className={`w-full bg-white text-gray-400 hover:text-gray-900 flex items-center ${headerProps[name] == value ? 'text-gray-900' : ''}`}
                                    onClick={() => onChangeAlignment(name, value)}>
                                    <span className="material-icons-outlined">format_align_{value.toLowerCase()}</span>
                                    <span className="ml-1">{value}</span>
                                </button>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

const Navigation = ({ headerProps, setHeaderProps }) => {
    return (
        <>
            <div className="w-full py-4 px-0">
                <label className="mb-4 block text-sm font-bold border-b border-gray-300">Navigation </label>
            </div>
            <div className="mb-4 last:mb-0">
                <div >
                    <FieldArray
                        name="navigation_link"
                        render={(fieldArrayProps) => {
                            const { form } = fieldArrayProps;
                            return (
                                <>
                                    {form.values.navigation_link &&
                                        form.values.navigation_link.map((value, i) => {
                                            return (
                                                <NavigationLink value={value} index={i} fieldArrayProps={fieldArrayProps} headerProps={headerProps} setHeaderProps={setHeaderProps} />
                                            )
                                        })
                                    }
                                    <button
                                        type='button'
                                        className="flex flex-wrap items-center btn bg-indigo-500 hover:bg-indigo-600 text-white rounded-md mt-4"
                                        onClick={() => {
                                            const newLink = {
                                                title: "Loream",
                                                url: "",
                                                visible: false
                                            }
                                           // console.log('Test');
                                            fieldArrayProps.push(newLink);
                                            // setHeaderProps(current => {
                                            //     let navigation_link = current.navigation_link;
                                            //     navigation_link.push(newLink);
                                            //     return {
                                            //         ...current,
                                            //         navigation_link
                                            //     }
                                            // })
                                        }}>
                                        <span className="material-icons-outlined">add</span>
                                        <span className="ml-1">Add link</span>
                                    </button>
                                </>
                            );
                        }}
                    />
                </div>
            </div>
        </>
    )
}

const NavigationLink = ({ value, index, fieldArrayProps, setHeaderProps, headerProps }) => {
    const [showEdit, setShowEdit] = useState(false);
    const [visible, setVisible] = useState(value.visible);
    const { setFieldValue, values } = useFormikContext();

    return (
        <div className="px-2 py-2 last:mb-0 border-2 border-neutral-200 hover:border-indigo-400 hover:bg-indigo-100 rounded-md mx-0 mb-2">
            <div className="flex items-center justify-between">
                <div className="block text-gray-200 hover:text-white truncate transition duration-150">
                    <div className="flex items-center text-gray-500">
                        <span className="material-icons-outlined mr-1">drag_indicator</span>
                        <span className="text-sm font-medium ml-2 text-gray-500">{value.title}</span>
                    </div>
                </div>
                <div className="text-center flex">
                    <button
                        type='button'
                        className="inline-block text-gray-900 truncate transition duration-150 w-6 h-6"
                        onClick={() => {
                            setShowEdit(!showEdit)

                            if (showEdit) {
                                setHeaderProps({ ...headerProps, navigation_link: values.navigation_link })
                            }
                        }}>
                        <span className="material-icons-outlined text-base">{showEdit ? 'save' : 'mode_edit'}</span>
                    </button>
                    <button
                        type='button'
                        className="inline-block leading-none w-6 h-6"
                        onClick={() => {
                            setVisible(!visible)
                            setFieldValue(`navigation_link[${index}].visible`, !visible)
                            // setHeaderProps({...headerProps, navigation_link: values.navigation_link})
                            setHeaderProps(current => {
                                let navigation_link = current.navigation_link;
                                navigation_link[index].visible = !visible;

                                return {
                                    ...current,
                                    navigation_link
                                }
                            })

                           // console.log(headerProps, "Visibility Updated");
                        }}>
                        <span className="material-icons-outlined text-base">{visible ? 'visibility' : 'visibility_off'}</span>
                    </button>
                    <button
                        type='button'
                        className="text-rose-500 inline-block leading-none w-6 h-6"
                        onClick={fieldArrayProps.remove.bind(
                            null,
                            index
                        )}
                    >
                        <span className="material-icons-outlined text-base">delete</span>
                    </button>
                </div>
            </div>
            <div className={`${showEdit ? '' : 'hidden'}`}>
                <div className="mb-3 mt-2">
                    <div className="flex justify-between items-center mb-1">
                        <div className="text-sm">Title</div>
                    </div>
                    <div className="text-center relative overflow-hidden">
                        <Input
                            type="text"
                            name={`navigation_link[${index}].title`}
                            className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-3 py-2 leading-tight focus:outline-none focus:bg-white"
                        />
                    </div>
                </div>
                <div className="mb-3 mt-2">
                    <div className="flex justify-between items-center mb-1">
                        <div className="text-sm">URL</div>
                    </div>
                    <div className="text-center relative overflow-hidden">
                        <Input
                            type="text"
                            name={`navigation_link[${index}].url`}
                            className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded p-3 py-2 leading-tight focus:outline-none focus:bg-white"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

const HeaderIconsSetting = () => {
    const icons = [
        { title: 'Card', icon: 'shopping_cart', visible: true },
        { title: 'Account', icon: 'person', visible: true },
        { title: 'Wishlist', icon: 'favorite_border', visible: true },
        { title: 'Search', icon: 'search', visible: true },
    ];
    const [visible, setVisible] = useState(true);
    return (
        <>
            <div className="w-full py-4 px-0">
                <label className="mb-4 block text-sm font-bold border-b border-gray-300">Header icon Setting </label>
            </div>
            <div className="mb-4 last:mb-0">
                {
                    icons.map((value, index) => {
                        return (
                            <div
                                key={index}
                                className="px-2 py-2 last:mb-0 border-2 border-neutral-200 hover:border-indigo-400 hover:bg-indigo-100 rounded-md mx-0 mb-2">
                                <div className="flex items-center justify-between">
                                    <div className="block text-gray-200 hover:text-white truncate transition duration-150">
                                        <div className="flex items-center text-gray-500">
                                            <span className="text-md material-icons-outlined mr-1">{value.icon}</span>
                                            <span className="text-sm font-medium ml-2 text-gray-500">{value.title}</span>
                                        </div>
                                    </div>
                                    <div className="text-center flex">
                                        <button
                                            type='button'
                                            className="inline-block leading-none w-6 h-6"
                                            onClick={() => {
                                            }}>
                                            <span className="material-icons-outlined text-base">{visible ? 'visibility' : 'visibility_off'}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </>
    )
}