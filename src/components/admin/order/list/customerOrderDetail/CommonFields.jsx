/*Component Name: CommonFields
Component Functional Details: User can create or update CommonFields master details from here.
Created By: Happy
Created Date: 11/10/22
Modified By: <Modified By Name>
Modified Date: <Modified Date> */


import Dropdown from 'components/common/formComponent/Dropdown';
import Input from 'components/common/formComponent/Input';
import { useFormik, useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react';
import CountryService from 'services/admin/country/CountryService';
import StateService from 'services/admin/state/StateService';

const CommonFields = ({ addressType, values }) => {
    const { setFieldValue } = useFormikContext();
    const [country, setCountry] = useState([]);
    const [state, setState] = useState([]);
    const getCountry = () => {
        CountryService.getCountryWithCode().then((response) => {
            if (response?.data?.success && response?.data?.data) {
                setCountry(() => {
                    return response?.data?.data?.map(value => {
                        return {
                            ...value,
                            label: value.name,
                            value: value.name,
                            countryCode: value.countryCode,
                        }
                    })
                });
            }
        }).catch(() => { });
    }

    const getState = (countryName) => {
        if (countryName) {
            StateService.getStateByCountryName(countryName).then((response) => {
                if (response?.data?.success && response?.data?.data) {
                    setState(() => {
                        return response?.data?.data?.map(value => {
                            return {
                                label: value.label,
                                value: value.label,
                            }
                        })
                    });
                }
            }).catch(() => { });
        } else {
            setState([]);
        }
    }
    useEffect(() => {
        getCountry();
    }, []);
    useEffect(() => {
        if (values?.country) {
            getState(values?.country);
        } else {
            setState([]);
        }
    }, [values?.country]);
    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="block uppercase tracking-wide text-gray-500 text-xs mb-2">
                    {"First Name"}
                    <span className="text-rose-500 text-lg leading-none">
                        *
                    </span>
                    <Input type="text" name={`${addressType}.firstName`} />
                </div>
                <div className="block uppercase tracking-wide text-gray-500 text-xs mb-2">
                    {"Last Name"}
                    <span className="text-rose-500 text-lg leading-none">
                        *
                    </span>
                    <Input type="text" name={`${addressType}.lastName`} />
                </div>
                <div className="block uppercase tracking-wide text-gray-500 text-xs mb-2">
                    {"Company Name"}
                    <span className="text-rose-500 text-lg leading-none">
                        *
                    </span>
                    <Input type="text" name={`${addressType}.company`} />
                </div>
                <div className="block uppercase tracking-wide text-gray-500 text-xs mb-2">
                    {"Address 1"}
                    <span className="text-rose-500 text-lg leading-none">
                        *
                    </span>
                    <Input type="text" name={`${addressType}.address1`} />
                </div>
                <div className="block uppercase tracking-wide text-gray-500 text-xs mb-2">
                    {"Address 2"}
                    <Input type="text" name={`${addressType}.address2`} />
                </div>
                <div className="block uppercase tracking-wide text-gray-500 text-xs mb-2">
                    {"Apt/Suite#v"}
                    <Input type="text" name={`${addressType}.suite`} maxLength={255} />
                </div>
                <div className="block uppercase tracking-wide text-gray-500 text-xs mb-2">
                    {"City"}
                    <span className="text-rose-500 text-lg leading-none">
                        *
                    </span>
                    <Input type="text" name={`${addressType}.city`} maxLength={255} />
                </div>
                <div className="block uppercase tracking-wide text-gray-500 text-xs mb-2">
                    {"Country"}
                    <span className="text-rose-500 text-lg leading-none">
                        *
                    </span>
                    {/* <Input type="text" name={`${addressType}.country`} maxLength={255} /> */}
                    <Dropdown
                        options={country}
                        defaultValue={values?.country || ''}
                        name={`${addressType}.country`}
                        onChange={(e) => {
                            setFieldValue(`${addressType}.country`, (e ? e.value : ''));
                            setFieldValue(`${addressType}.countryCode`, e ? e?.countryCode : '');
                            setFieldValue(`${addressType}.state`, '');
                        }}
                    />
                </div>
                <div className="block uppercase tracking-wide text-gray-500 text-xs mb-2">
                    {"Country Code "}
                    <Input type="text" disabled={true} name={`${addressType}.countryCode`} maxLength={3} />
                </div>
                <div className="block uppercase tracking-wide text-gray-500 text-xs mb-2">
                    {"State"}
                    <span className="text-rose-500 text-lg leading-none">
                        *
                    </span>
                    {/* <Input type="text" name={`${addressType}.state`} maxLength={255} /> */}
                    <Dropdown
                        options={state}
                        defaultValue={values?.state || ''}
                        name={`${addressType}.state`}
                        onChange={(e) => {
                            setFieldValue(`${addressType}.state`, (e ? e.value : ''));
                        }}
                    />
                </div>
                <div className="block uppercase tracking-wide text-gray-500 text-xs mb-2">
                    {"Postal Code "}
                    <span className="text-rose-500 text-lg leading-none">
                        *
                    </span>
                    <Input type="text" name={`${addressType}.zipCode`} maxLength={10} />
                </div>

                <div className="block uppercase tracking-wide text-gray-500 text-xs mb-2">
                    {"Email"}
                    <span className="text-rose-500 text-lg leading-none">
                        *
                    </span>
                    <Input type="text" name={`${addressType}.email`} />
                </div>
                <div className="block uppercase tracking-wide text-gray-500 text-xs mb-2">
                    {"Phone"}
                    <span className="text-rose-500 text-lg leading-none">
                        *
                    </span>
                    <Input type="text" name={`${addressType}.phone`} maxLength={15} />
                </div>
                <div className="block uppercase tracking-wide text-gray-500 text-xs mb-2">
                    Fax
                    <Input type="text" name={`${addressType}.fax`} />
                </div>
            </div>
        </>
    );
};

export default CommonFields;
