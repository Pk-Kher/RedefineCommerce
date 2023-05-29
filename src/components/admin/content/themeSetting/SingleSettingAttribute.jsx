import { attributes } from 'dummy/Dummy';
import React, { useState, useRef, useEffect } from 'react';
import Transition from "utils/Transition";

import FontStyle from './inputs/FontStyle';
import FontSize from './inputs/FontSize';
import LetterSpacing from './inputs/LetterSpacing';
import FontWeight from './inputs/FontWeight';
import MaxContainerWidth from './inputs/MaxContainerWidth';
import VerticalSpacing from './inputs/VerticalSpacing';
import BorderStyle from './inputs/BorderStyle';
import BackgroundColor from './inputs/BackgroundColor';
import FontTransform from './inputs/FontTransform';

const SingleSettingAttribute = ({ attribute = {} }) => {
    const [show, setShow] = useState(false);

    const dropdown = useRef(null);
    const trigger = useRef(null);

    useEffect(() => {
        const clickHandler = ({ target }) => {
            console.log(target, dropdown.current, trigger.current, show);

            if (!dropdown.current) return;

            if (
                !show ||
                dropdown.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;

            setShow(false);
        };
        // document.addEventListener("click", clickHandler);
        // return () => document.removeEventListener("click", clickHandler);
    }, []);

    const InputAttribute = {
        font_style: FontStyle,
        font_size: FontSize,
        font_weight: FontWeight,
        font_letter_spacing: LetterSpacing,
        max_container_width: MaxContainerWidth,
        vertical_spacing: VerticalSpacing,
        border_style: BorderStyle,
        background_color: BackgroundColor,
        font_transform: FontTransform,
    }

    return (
        <>
            <div className="relative border-b border-neutral-00">
                <button
                    ref={trigger}
                    onClick={() => setShow(!show)}
                    type="button"
                    className="flex w-full flex-wrap justify-between items-center text-sm px-3 py-4 bg-white border-0 font-medium">
                    <span className="ml-1">{attribute?.label}</span>
                    <span className="material-icons-outlined">{show ? 'expand_less' : 'expand_more'}</span>
                </button>
                <Transition
                    className="bg-slate-100 border-y border-b-0 border-neutral-200"
                    show={show}
                    tag="div"
                    enter="transition ease-out duration-200 transform"
                    enterStart="opacity-0 -translate-y-2"
                    enterEnd="opacity-100 translate-y-0"
                    leave="transition ease-out duration-200"
                    leaveStart="opacity-100"
                    leaveEnd="opacity-0"
                >
                    <div className="bg-white py-4 px-3" ref={dropdown}>
                        {attribute?.components &&
                            Object.keys(attribute.components).map((key, index) => {
                                const Component = InputAttribute[key];
                                const Properties = attribute.components[key];
                                return (Component && <div className='pt-4'>
                                    <Component {...Properties} key={index} />
                                </div>)
                            })
                        }
                    </div>
                </Transition>
            </div>
        </>
    )
}

export default SingleSettingAttribute