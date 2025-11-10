import React from 'react'
import {Minus, Plus, Trash2} from "lucide-react";
import {useCart} from "@/hooks";
import {CartProductType} from "@/types";

const CartProduct = ({item}: { item: CartProductType }) => {
    const {updateQuantity, removeFromCart} = useCart()

    return (
        <div key={item.id}
             className="flex gap-4 p-4 bg-gray-50 rounded-lg">
            <img src={item.image} alt={item.name}
                 className="w-20 h-20 object-cover rounded"/>
            <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">
                    {item.name}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                    ${item.price}
                </p>
                <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:bg-white rounded transition-colors"
                            aria-label="Decrease quantity">
                        <Minus className="w-4 h-4 text-gray-600"/>
                    </button>
                    <span className="text-sm font-medium px-3">
                                            {item.quantity}
                                        </span>
                    <button onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 hover:bg-white rounded transition-colors"
                            aria-label="Increase quantity">
                        <Plus className="w-4 h-4 text-gray-600"/>
                    </button>
                    <button onClick={() => removeFromCart(item.id)}
                            className="ml-auto p-1 hover:bg-white rounded transition-colors"
                            aria-label="Remove from cart">
                        <Trash2 className="w-4 h-4 text-red-800"/>
                    </button>
                </div>
            </div>
        </div>
    )
}
export default CartProduct
