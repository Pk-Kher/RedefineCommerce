/*Component Name: Products
Component Functional Details:  Products .
Created By: PK Kher
Created Date: <Creation Date>
Modified By: PK Kher
Modified Date: <Modified Date> */

import Tab2 from 'components/common/Tab2';
import React from 'react';
import Purchased from './Purchased';
import { customerProductTab } from 'global/Enum';
import { useState } from 'react';
import Cart from './Cart';
import Viewed from './Viewed';
import WishList from './WishList';
import { useParams } from 'react-router-dom';

const Products = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState(0);
    const tabs = {
        Purchased: Purchased,
        Cart: Cart,
        Viewed: Viewed,
        Wishlist: WishList,
    }
    return (
        <>
            <div className='overflow-x-auto grow'>
                <div className='pt-6'>
                    <h2 className="text-2xl text-gray-800 font-bold mb-5">Products</h2>
                    <div className='flex flex-col md:flex-row text-sm'>
                        <div className='w-full'>
                            <div className='pb-5'>
                                <Tab2 options={customerProductTab} activeTab={activeTab} setActiveTab={setActiveTab} />
                            </div>
                            {customerProductTab.map((value, index) => {
                                let Component = tabs[value.componentname]
                                if (activeTab === value.id) {
                                    return (
                                        <Component {...value} key={index} id={id} />
                                    );
                                }
                            })}
                        </div>
                    </div>

                </div>
            </div >
        </>
    );
};

export default Products;
