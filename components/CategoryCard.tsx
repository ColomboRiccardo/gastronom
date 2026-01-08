import {motion} from 'framer-motion'
import React from 'react'
import Image from "next/image";
import {CategoryType} from "@/types";

const CategoryCard = ({category, index}: { category: CategoryType, index: number }) => {
    return (
        <motion.div key={category.id} initial={{
            opacity: 0,
            y: 20
        }} whileInView={{
            opacity: 1,
            y: 0
        }} viewport={{
            once: true
        }} transition={{
            delay: index * 0.1
        }} whileHover={{
            y: -8
        }} className="group cursor-pointer">
            <div className="relative h-64 rounded-xl overflow-hidden mb-4">
                <Image src={category.image} alt={category.name} width={500} height={500}
                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                <div
                    className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent"/>
                <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-serif font-bold text-background mb-1">{category.name}</h3>
                    <p className="text-sm text-background/90">{category.count}</p>
                </div>
            </div>
        </motion.div>
    )
}
export default CategoryCard
