import React from "react";
import Tiles from "../../common/Tiles";
import { DasshboardData } from "global/Enum";
const Cards = ({ tilesVisible }) => {
  return (
    <>
      {/* <!-- Cards --> */}
      {DasshboardData.map((data, index) => {
        if (tilesVisible(data?.url)) {
          return (
            <Tiles
              key={index}
              title={data.title}
              subTitle={data.subTitle}
              url={data.url}
              buttonList={
                data.title === "Orders" && [
                  {
                    url: `/admin/Order`,
                    title: "PK 1 Store",
                    Icon: () => (
                      <span className="material-icons-outlined">
                        {data.butttonstore}
                      </span>
                    ),
                  },
                  {
                    url: `/admin/Order/orders`,
                    title: "PK 2 Store",
                    Icon: () => (
                      <span className="material-icons-outlined">
                        {data.butttonstore}
                      </span>
                    ),
                  },
                ]
              }
              Icon={() => (
                <span className="material-icons-outlined text-gray-700 text-4xl">
                  {data.Icon}
                </span>
              )}
            />
          );
        }
      })}
    </>
  );
};
export default Cards;
