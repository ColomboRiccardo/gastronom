import React from 'react'
import {Card, CardContent, CardDescription, CardFooter, CardTitle} from "@/components/ui/card";
import Image from "next/image";
import {Button} from "@/components/ui/button";

const ProductCard = () => {
    return (
        <Card className={"w-96 flex flex-col gap-5 items-center bg-popover"}>
            <CardContent className={"flex flex-col gap-2"}>
                <Image className={"w-full h-auto"} src={"/pelmeni.jpg"} alt={"pelmeni"} width={400} height={400}/>
                <CardTitle>Pelmeni di pollo</CardTitle>
                <CardDescription>Pelmeni di pollo surgelati, pronti da cuocere</CardDescription>
            </CardContent>
            <CardFooter>
                <Button>Aggiungi al carrello</Button>
            </CardFooter>
        </Card>
    )
}
export default ProductCard
