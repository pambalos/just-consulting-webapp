import React from "react";

export default function ShopLayout({
     children,
 }: {
    children: React.ReactNode;
}) {

    return (
        <div className={"shop-layout"}>
            {
                children
            }
        </div>
    )
}