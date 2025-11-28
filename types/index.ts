import {ForwardRefExoticComponent, RefAttributes} from "react";
import {LucideProps} from "lucide-react";

export interface ProductType {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    discount: number;
    category: string;
    description: string;
    weightInGrams: number;
    rating: number;
    reviews: number;
    inStock: boolean;
    images: string[];
    longDescription: string;
    stockCount: number;
    features: string[];
    specifications: {
        label: string;
        value: string;
    }[];
    nutritionalValues?: string;
    badges: BadgesType[];
}

export type CategoryType = {
    id: number,
    name: string,
    image: string,
    count: string
}

export type GastronomHomepageProps = Record<string, never>;

export interface CartProductType extends ProductType {
    quantity: number;
}

export type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
//export type CollectionType = 'caviar' | 'vodka' | 'pickles';

export type CartContextType = {
    cartOpen: boolean;
    setCartOpen: (open: boolean) => void;
    cart: CartProductType[];
    setCart: (cart: CartProductType[]) => void;
    addToCart: (product: ProductType, quantity?: number) => void;
    updateQuantity: (productId: string, delta: number) => void;
    removeFromCart: (productId: string) => void;
    cartTotal: number;
    cartCount: number;
}

export type FavouritesContextType = {
    favourites: string[]
    toggleFavourite: (productId: string) => void
}

export type FeaturesType = {
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>,
    title: string,
    description: string
}

export type CollectionType = {
    title: string,
    description: string,
    hero: string,
    bgGradient: string
}

export type ReviewType = {
    id: string;
    author: string;
    rating: number;
    date: string;
    comment: string;
    verified: boolean;
};

export type BadgesType = "BESTSELLING" | "HERO" | "LIMITED" | "NEW" | "PREMIUM" | "ORGANIC"