import React from 'react'
import {Heart, Plus, Star} from "lucide-react";
import {motion} from 'framer-motion';
import {ProductType} from "@/types";
import {useCart, useFavourites} from "@/hooks";

const DetailedProductCard = ({product, index}: { product: ProductType, index: number }) => {
    const {addToCart} = useCart()
    const {favourites, toggleFavourite} = useFavourites()

    return (
        <motion.div key={product.id} initial={{
            opacity: 0,
            y: 20
        }} animate={{
            opacity: 1,
            y: 0
        }} transition={{
            delay: index * 0.05
        }}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100">
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                <img src={product.image} alt={product.name}
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                {product.badge && <div
                    className="absolute top-3 left-3 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded">
                    {product.badge}
                </div>}
                {!product.inStock &&
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <span className="px-4 py-2 bg-white text-gray-900 font-semibold rounded-lg">
            Out of Stock
        </span>
                    </div>}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <button onClick={() => toggleFavourite(product.id)}
                            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                            aria-label="Add to favorites">
                        <Heart
                            className={`w-4 h-4 ${favourites.includes(product.id) ? 'fill-red-800 text-red-800' : 'text-gray-600'}`}/>
                    </button>
                </div>
            </div>

            <div className="p-5">
                <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i}
                                                       className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}/>)}
                    <span className="text-sm text-gray-600 ml-2">
            {product.rating} ({product.reviews})
            </span>
                </div>

                <h4 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-red-900 transition-colors">
                    {product.name}
                </h4>
                <p className="text-sm text-gray-500 mb-4">{product.description}</p>

                <div className="flex items-end justify-between">
                    <div>
                        <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-red-900">
            ${product.price}
            </span>
                            {product.originalPrice &&
                                <span className="text-sm text-gray-400 line-through">
                ${product.originalPrice}
                </span>}
                        </div>
                        <span className="text-xs text-gray-500">{product.weight}</span>
                    </div>
                    <button onClick={() => addToCart(product)} disabled={!product.inStock}
                            className="p-2.5 bg-red-800 text-white rounded-full hover:bg-red-900 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Add to cart">
                        <Plus className="w-5 h-5"/>
                    </button>
                </div>
            </div>
        </motion.div>)
}
export default DetailedProductCard


//TODO
//- add stock availability
//- if possible best before date
//-