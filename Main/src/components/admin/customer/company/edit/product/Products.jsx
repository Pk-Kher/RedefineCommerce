/*Component Name: Cart
Component Functional Details:  Cart .
Created By: Divyesh
Created Date: <Creation Date>
Modified By: Divyesh
Modified Date: <Modified Date> */

import Tab2 from 'components/common/Tab2';
import React from 'react';
import Purchased from './Purchased';
import { companyProductTab } from 'global/Enum';
import { useState } from 'react';
import Cart from './Cart';
import Viewed from './Viewed';
import WishList from './WishList';
import AllProducts from './AllProducts';
import { useParams } from 'react-router-dom';

const Products = ({ PageName }) => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState(0);
    const tabs = {
        Purchased: Purchased,
        Cart: Cart,
        Viewed: Viewed,
        AllProducts: AllProducts,
        Wishlist: WishList,
    }
    return (
        <>
            <div className='overflow-x-auto grow'>
                <div className=''>
                    <div className='flex flex-col md:flex-row text-sm'>
                        <div className='w-full'>
                            <h2 className="text-2xl text-gray-800 font-bold my-6">{PageName}</h2>
                            <div className='pb-5'>
                                <Tab2 options={companyProductTab} activeTab={activeTab} setActiveTab={setActiveTab} />
                            </div>
                            {companyProductTab.map((value, index) => {
                                let Component = tabs[value.componentname]
                                return (
                                    <div className={`${activeTab === value.id ? '' : 'hidden'}`} key={index}>
                                        <Component {...value} key={index} activeTab={activeTab} id={id} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div >
        </>
    );
};

export default Products;
