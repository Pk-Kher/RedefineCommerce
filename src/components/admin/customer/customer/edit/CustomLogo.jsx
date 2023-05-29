/*Component Name: CustomLogo
Component Functional Details:  CustomLogo .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: Shrey Patel
Modified Date: 12/23/2022 */

import React from 'react';
import { useParams } from 'react-router-dom';
import CustomerCustomLogo from '../../../../common/others/admin/CustomerCompany/customLogo/CustomLogo';

const CustomLogo = () => {
    const { id } = useParams();

    return (
        <CustomerCustomLogo CustomerId={id} />
    );
};

export default CustomLogo;
