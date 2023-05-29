/*Component Name: CustomLogo
Component Functional Details:  CustomLogo .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React from 'react';
import { useParams } from 'react-router-dom';
import CompanyCustomLogo from '../../../../../common/others/admin/CustomerCompany/customLogo/CustomLogo';

const CustomLogo = () => {
    const { id } = useParams();

    return (
        <CompanyCustomLogo CompanyId={id} />
    );
};

export default CustomLogo;
