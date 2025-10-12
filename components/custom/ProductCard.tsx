import React from 'react'
import {Card, CardAction, CardContent, CardDescription, CardFooter, CardTitle} from "@/components/ui/card";
import Image from "next/image";

const ProductCard = () => {
    return (
        <Card>
            <CardContent>
                <Image src={"/pelmeni.jpg"} alt={"pelmeni"} width={200} height={200}/>
                <CardTitle>Product Card</CardTitle>
                <CardDescription>Product description</CardDescription>
            </CardContent>
            <CardFooter>
                <CardAction>Product action</CardAction>
            </CardFooter>
        </Card>
    )
}
export default ProductCard
