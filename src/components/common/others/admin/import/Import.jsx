/*Component Name: Import
Component Functional Details:  Import .
Created By: PK Kher
Created Date: 7-19-2022
Modified By: Happy Patel
Modified Date: 12/21/2022 */

import Tabs from 'components/common/Tabs';
import { ImportTabs } from 'global/Enum';
import React, { useState, useMemo } from 'react';
import History from './History';
import StepOne from './StepOne';
import StepThree from './StepThree';
import StepTwo from './StepTwo';
import Messages from "components/common/alerts/messages/Index";

const Import = ({ type }) => {
    const [steps] = useState([
        { name: 'Step 1', Component: StepOne },
        { name: 'Step 2', Component: StepTwo },
        { name: 'Step 3', Component: StepThree }
    ]);
    const [activeTab, setActiveTab] = useState(0);
    const [currentStep, setCurrentStep] = useState(1);
    const [exportType, setExportType] = useState();
    const [exportTypeOptions, setExportTypeOptions] = useState([]);
    const goToStep = (step, exportType) => {
        setCurrentStep(step);
        setExportType(exportType)
    }
    const onTabClick = (e, index) => {
        e.preventDefault();
        setActiveTab(index);
    };
    return (
        <>
            <title>Import</title>
            <div >
                <div className="bg-white shadow-xxl rounded-md">
                    <div className="w-full bg-white shadow-xxl rounded-md mb-8 pt-8">
                        <div className='p-4'>
                            <Tabs
                                options={useMemo(() =>
                                    ImportTabs.map((value) => {
                                        return {
                                            id: value.id,
                                            label: value.typeName,
                                            value: value.typeName,
                                        };
                                    })
                                )}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                onTabClick={onTabClick}
                            />
                        </div>
                        <Messages />
                        {activeTab === 0 &&
                            <div className={''}>
                                {steps.map((step, index) => {
                                    if (currentStep === index + 1) {
                                        return (
                                            <step.Component key={index} currentStep={currentStep} index={index} stepLength={steps.length} goToStep={goToStep} type={type} exportId={exportType} setExportTypeOptions={setExportTypeOptions} />
                                        );
                                    }
                                })}
                            </div>}
                        {activeTab === 1 && <div className={''}>
                            <History activeTab={activeTab} exportTypeOptions={exportTypeOptions} type={type} />
                        </div>}
                    </div>
                </div>
            </div>
        </>
    );
};
export default Import;