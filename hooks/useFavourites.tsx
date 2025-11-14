import {useContext} from 'react'
import {FavouritesContext} from "@/context/FavouritesContext";

export const useFavourites = () => {
    const context = useContext(FavouritesContext)
    if (context === undefined || context === null) {
        throw new Error("useFavourites must be used within a FavouritesProvider")
    }
    const {favourites, toggleFavourite} = context

    return {favourites, toggleFavourite}
}
