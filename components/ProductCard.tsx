import {motion} from 'framer-motion'
import React from 'react'
import {ShoppingCart, Star} from "lucide-react";

const ProductCard = ({product, key: index, handleAddToCart}) => {
    return (
        <motion.div key={product.id} initial={{
            opacity: 0,
            y: 20
        }} whileInView={{
            opacity: 1,
            y: 0
        }} viewport={{
            once: true
        }} transition={{
            delay: index * 0.1
        }}
                    className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
            <div className="relative aspect-square overflow-hidden">
                <img src={product.image} alt={product.name}
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-lg">
                      {product.badge}
                    </span>
                </div>
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-foreground mb-2">{product.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-primary text-primary"/>
                        <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">{product.price}</span>
                    <motion.button whileHover={{
                        scale: 1.1
                    }} whileTap={{
                        scale: 0.9
                    }} onClick={handleAddToCart}
                                   className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                        <ShoppingCart className="w-5 h-5"/>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}
export default ProductCard
