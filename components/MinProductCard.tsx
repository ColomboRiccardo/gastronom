import React from 'react'
import {motion} from "framer-motion";
import {Star} from "lucide-react";
import {DetailedProductType} from "@/types";
import Image from "next/image";

const MinProductCard = ({product, index}: { product: DetailedProductType, index: number }) => {
    return (
        <motion.div key={product.id} initial={{
            opacity: 0,
            y: 20
        }} animate={{
            opacity: 1,
            y: 0
        }} transition={{
            delay: 0.3 + index * 0.1
        }} whileHover={{
            y: -8
        }}
                    className={`bg-card rounded-xl p-4 shadow-md hover:shadow-xl transition-all ${index === 0 ? 'col-span-2' : ''}`}>
            <div className="aspect-square rounded-lg overflow-hidden mb-3">
                <Image src={product.images[0]} alt={product.name}
                       className="w-full h-full object-cover" width={300}
                       height={300}/>
            </div>
            <div className="flex items-start justify-between gap-2">
                <div>
                    <h3 className={`${index === 0 ? 'text-xl' : ''} font-semibold text-foreground mb-1`}>{product.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 fill-primary text-primary"/>
                        <span className={`${index === 0 ? 'text-xl' : 'text-sm'} font-medium`}>{product.rating}</span>
                    </div>
                </div>
                <span
                    className={`${index === 0 ? 'text-2xl' : 'text-lg'} font-bold text-primary`}>{product.price}</span>
            </div>
        </motion.div>
    )
}
export default MinProductCard
