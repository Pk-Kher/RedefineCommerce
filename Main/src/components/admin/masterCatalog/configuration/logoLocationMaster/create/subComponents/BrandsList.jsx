/*Component Name: brandsList
Component Functional Details: User can create or update brandsList master details from here.
Created By: Happy
Created Date: <Creation Date>
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import Checkbox from 'components/common/formComponent/Checkbox';
import React, { useEffect, useState } from 'react';
import DropdownService from 'services/common/dropdown/DropdownService';
import { useFormikContext } from "formik";

const BrandsList = ({ logoLocationDetailsId }) => {
    const { setFieldValue, values } = useFormikContext();

    const [brands, setBrands] = useState([]);
    const [mainbrands, setMainBrands] = useState([]);

    useEffect(() => {
        DropdownService.getDropdownValues(
            "brand"
        ).then((res) => {
            if (res.data.success) {
                setBrands(res.data.data);
                setMainBrands(res.data.data);
            }
        });
    }, [logoLocationDetailsId]);

    const searchBrand = (e) => {
        var search = e.target.value.trim();

        if (search !== "") {
            setBrands(() => {
                var temp = [];
                mainbrands.map((brandId, index) => {
                    if (
                        brandId.label.toLowerCase().includes(search.toLowerCase())
                    ) {
                        temp = [...temp, brandId]
                    };
                });
                return temp;
            });
        } else {
            setBrands(mainbrands);
        }
    };

    const setAllBrandsValue = (brands, e, brandsid) => {
        if (e.target.checked) {
            let brandData = brandsid.map((brand) => parseInt(brand.value))
            return brandData;
        } else {
            return [];
        }
    };

    const setBrandsValue = (brands, e) => {
        if (e.target.checked) {
            return [...brands, parseInt(e.target.value)];
        } else {
            var index = brands.indexOf(parseInt(e.target.value));
            if (index > -1) {
                brands.splice(index, 1); // 2nd parameter means remove one item only
            }
            return brands;
        }
    };

    return (
        <>
            <div className="overflow-y-auto overflow-x-hidden max-h-60 border border-neutral-200 rounded-md">
                <div className="py-1 px-3 sticky top-0 bg-white border-b border-neutral-200">
                    <div className="relative w-full left-32">
                        <div className="absolute h-10 mt-0 left-0 top-0 flex items-center">
                            <svg
                                className="h-4 pl-4 fill-current text-gray-600"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                            </svg>
                        </div>
                        <input
                            type="search"
                            placeholder="search"
                            onChange={searchBrand}
                            className="block w-4/5 bg-[#f7f7fa] border-neutral-200 hover:border-neutral-300 focus:border-neutral-100 focus:ring-neutral-300 focus:shadow-lg pl-10 pr-2 py-2 rounded-md"
                        />
                    </div>
                    <div className='absolute h-10 mt-1 left-3 top-0 flex items-center'>
                        <label className="flex items-center">
                            <Checkbox
                                name="AllBrandsValue"
                                onChange={(e) => {
                                    setFieldValue(
                                        `brandId`,
                                        setAllBrandsValue([...values.brandId], e, brands)
                                    );
                                }}
                                type="checkbox"
                                className="form-checkbox"

                                checked={values.brandId.length === brands.length || false}
                            />
                            <span className="text-sm font-medium ml-2">
                                {"Select All"}
                            </span>
                        </label>
                    </div>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2">
                    {brands.map((brand, index) => {
                        // console.log("chandan", brand.value);
                        return (
                            <li className="py-1 px-3" key={index}>
                                <label className="flex items-center">
                                    <Checkbox
                                        name="brandId"
                                        onChange={(e) => {
                                            setFieldValue(
                                                `brandId`,
                                                setBrandsValue([...values.brandId], e)
                                            );
                                        }}
                                        value={brand.value}
                                        type="checkbox"
                                        className="form-checkbox"

                                        checked={values.brandId.includes(
                                            Number(brand.value)
                                        )}
                                    />
                                    <span className="text-sm font-medium ml-2">
                                        {brand.label}
                                    </span>
                                </label>
                            </li>
                        );
                    })}
                    {brands.length === 0 && (
                        <li className="text-center">
                            No Data Found.
                        </li>
                    )}
                </ul>
            </div>
        </>
    );
};

export default BrandsList;
