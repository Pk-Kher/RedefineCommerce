/*Component Name: CommonFields
Component Functional Details: User can create or update CommonFields from here.
Created By: Happy
Created Date: 08/08/2022
Modified By: <Modified By Name>
Modified Date: <Modified Date> */

import Input from 'components/common/formComponent/Input';
import React from 'react';

const CommonFields = ({ index }) => {
    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div >
                    {"First Name"}
                    <span className="text-rose-500 text-2xl leading-none">
                        *
                    </span>
                    <Input type="text" name={`customerAddress[${index}].firstname`} />
                </div>
                <div >
                    {"Last Name"}
                    <span className="text-rose-500 text-2xl leading-none">
                        *
                    </span>
                    <Input type="text" name={`customerAddress[${index}].lastName`} />
                </div>
                <div >
                    {"Email"}
                    <span className="text-rose-500 text-2xl leading-none">
                        *
                    </span>
                    <Input type="text" name={`customerAddress[${index}].email`} />
                </div>
                <div >
                    {"Address 1"}
                    <span className="text-rose-500 text-2xl leading-none">
                        *
                    </span>
                    <Input type="text" name={`customerAddress[${index}].address1`} />
                </div>
                <div >
                    {"Address 2"}
                    <Input type="text" name={`customerAddress[${index}].address2`} />
                </div>
                <div >
                    {"Apt/Suite#v"}
                    <Input type="text" name={`customerAddress[${index}].suite`} />
                </div>
                <div >
                    {"City"}
                    <span className="text-rose-500 text-2xl leading-none">
                        *
                    </span>
                    <Input type="text" name={`customerAddress[${index}].city`} />
                </div>
                <div >
                    {"State"}
                    <span className="text-rose-500 text-2xl leading-none">
                        *
                    </span>
                    <Input type="text" name={`customerAddress[${index}].state`} />
                </div>

                <div >
                    {"Country"}
                    <span className="text-rose-500 text-2xl leading-none">
                        *
                    </span>
                    <Input type="text" name={`customerAddress[${index}].countryName`} />
                </div>
                <div >
                    {"Country Code "}
                    <Input type="text" name={`customerAddress[${index}].countryCode`} maxLength={3} />
                </div>

                <div >
                    {"Postal Code "}
                    <span className="text-rose-500 text-2xl leading-none">
                        *
                    </span>
                    <Input type="text" name={`customerAddress[${index}].postalCode`} maxLength={10} />
                </div>
                <div >
                    {"Phone"}
                    <span className="text-rose-500 text-2xl leading-none">
                        *
                    </span>
                    <Input type="text" name={`customerAddress[${index}].phone`} maxLength={15} />
                </div>
                <div >
                    Fax
                    <Input name={'fax'} type="text" placeholder="000-000-0000" />
                </div>
            </div>
        </>
    );
};

export default CommonFields;
