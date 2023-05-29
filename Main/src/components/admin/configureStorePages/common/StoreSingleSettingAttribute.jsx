import React, { useRef } from 'react';
import Transition from "utils/Transition";

// common slider for other section (which we are using all the time as an component and passing to the variable as and return statement of a anonomous function)
import FormatStyle from "./inputs/FormatStyle"
import AddToCartButton from "./inputs/AddToCartButton"
import ColorPicker from "./inputs/ColorPicker"
// end of common mini component

// components are used for {Product Gallery Option}
import ProductGallerySlideStyle from './inputs/ProductGallerySlideStyle';
// end components are used for {Product Gallery Option}

// components are used for {Product Section Display}
import ColumnSelect from './inputs/ColumnSelect';
import Alignment from './inputs/Alignment';
//end of components are used for {Product Section Display}

import CKEditor from './inputs/CKEditor';
import VerticalAlign from './inputs/VerticalAlign';
import ToggleButton from './inputs/ToggleButton';
import { useFormikContext } from 'formik';
import RadiobuttonGroup from './inputs/RadioButtonGroup';
import LeftRight from './inputs/LeftRight';
import Input from './inputs/Input';
const SingleSettingAttribute = ({ attribute = {}, index, show, setShow, initialValues, ...rest }) => {

    const dropdown = useRef(null);
    const trigger = useRef(null);
    const InputAttribute = {
        AddToCartButton: AddToCartButton,
        ProductGallerySlideStyle: ProductGallerySlideStyle,
        ColumnSelect: ColumnSelect,
        Alignment: Alignment,
        CKEditor: CKEditor,
        ColorPicker: ColorPicker,
        VerticalAlign: VerticalAlign,
        ToggleButton: ToggleButton,
        Dropdown: FormatStyle,
        RadioButtonGroup: RadiobuttonGroup,
        LeftRight: LeftRight,
        Input: Input
    }
    const { values } = useFormikContext();
    return (
        <>
            <div className="relative w-full px-4">
                <button
                    ref={trigger}
                    onClick={() => setShow(() => ({ isVisible: (attribute.id !== show.isVisible) ? attribute.id : "", whichRow: index }))}
                    type="button"
                    className="flex border-b border-neutral-200 w-full flex-wrap justify-between items-center text-sm px-3 py-4 bg-white border-0 font-medium">
                    <span className="ml-1">{attribute?.label}</span>
                    <span className="material-icons-outlined">{(show.isVisible === attribute.id && show.whichRow === index) ? 'expand_less' : 'expand_more'}</span>
                </button>
                <Transition
                    className="bg-white border-y border-b-0 border-neutral-200 overflow-visible"
                    show={(show.isVisible === attribute.id && show.whichRow === index) ? true : false}
                    tag="div"
                    enter="transition ease-out duration-200 transform"
                    enterStart="opacity-0 -translate-y-2"
                    enterEnd="opacity-100 translate-y-0"
                    leave="transition ease-out duration-200"
                    leaveStart="opacity-100"
                    leaveEnd="opacity-0"
                >
                    <div className="text-sm m-1" ref={dropdown}>
                        <div className="bg-white py-4 px-3">
                            {attribute?.components &&
                                attribute.components.map((value, index) => {
                                    if (!value.conditionalRender || values[value.conditionalRender]) {
                                        const { Component: componentName, ...Properties } = value;
                                        const Component = InputAttribute[componentName];
                                        return (Component && <Component {...Properties} key={index} initialValues={initialValues} />)
                                    }
                                    return "";
                                })
                            }
                        </div>
                    </div>
                </Transition>
            </div>
        </>
    )
}

export default SingleSettingAttribute