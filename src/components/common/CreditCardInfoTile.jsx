/*Component Name: CreditCardInfoTile
Component Functional Details:  CreditCardInfoTile .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import React from 'react';

const CreditCardInfoTile = ({ CreditCardData }) => {
    return (
        <>
            <div className="col-span-full xl:col-span-6 2xl:col-span-4 bg-white shadow-md rounded-sm border border-slate-200">
                <div className="flex flex-col h-full p-5">

                    <div className="relative">
                        <header className="flex items-center mb-3">
                            <div className="w-10 h-10 rounded-full shrink-0 flex flex-wrap justify-center items-center bg-gradient-to-tr from-indigo-500 to-indigo-300 text-white mr-3 text-center">
                                <span className="material-icons-outlined">payment</span>
                            </div>
                            <h3 className="text-lg text-slate-800 font-semibold">{CreditCardData?.name}</h3>
                        </header>
                        <div className="text-lg">XXXX XXXX XXXX {CreditCardData?.last4}</div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default CreditCardInfoTile;
