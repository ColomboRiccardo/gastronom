"use client"

import React, {createContext, useState} from 'react'
import {FavouritesContextType} from "@/types";

export const FavouritesContext = createContext<FavouritesContextType | null>(null)

export const FavouritesProvider = ({children}: { children: React.ReactNode }) => {
    const [favourites, setFavourites] = useState<string[]>([])

    const addFavourites = (productId: string) => {
        setFavourites(prev => [...prev, productId])
    }

    const removeFavourites = (productId: string) => {
        setFavourites(prev => prev.filter(id => id !== productId))
    }

    const toggleFavourite = (productId: string) => {
        if (favourites.includes(productId)) {
            removeFavourites(productId)
        } else {
            addFavourites(productId)
        }
    }

    return (
        <FavouritesContext.Provider value={{favourites, toggleFavourite}}>{children}</FavouritesContext.Provider>
    )
}
