import {CategoryType, DetailedProductType, FeaturesType, ProductType, ReviewType} from "@/types";
import {Award, Shield, Star, Truck} from "lucide-react";

export const HERO_PRODUCTS = [
    {
        id: '1',
        name: 'Beluga Caviar Imperial',
        price: 280,
        originalPrice: 320,
        category: 'caviar',
        image: 'https://images.unsplash.com/photo-1535473895227-bdecb20fb157?w=800',
        description: '50g Imperial Selection - Rare Beluga',
        badge: 'PREMIUM',
        weight: '50g',
        rating: 5.0,
        reviews: 127,
        inStock: true
    }, {
        id: '2',
        name: 'Osetra Caviar Classic',
        price: 180,
        category: 'caviar',
        image: 'https://images.unsplash.com/photo-1600243241290-a3cfab8e7ffe?w=800',
        description: '30g Classic Selection - Golden Osetra',
        weight: '30g',
        rating: 4.8,
        reviews: 89,
        inStock: true
    }, {
        id: '3',
        name: 'Sevruga Caviar Reserve',
        price: 145,
        category: 'caviar',
        image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',
        description: '30g Reserve Selection - Fine Sevruga',
        weight: '30g',
        rating: 4.7,
        reviews: 64,
        inStock: true
    }] as ProductType[];

export const FEATURED_CATEGORIES = [
    {
        id: 1,
        name: 'Charcuterie',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop',
        count: '48 Products'
    }, {
        id: 2,
        name: 'Artisan Cheese',
        image: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=600&h=400&fit=crop',
        count: '62 Products'
    }, {
        id: 3,
        name: 'Fine Wines',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&h=400&fit=crop',
        count: '85 Products'
    }, {
        id: 4,
        name: 'Gourmet Oils',
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=400&fit=crop',
        count: '34 Products'
    }] as CategoryType[];

export const BESTSELLERS = [
    {
        id: '6',
        name: 'Platinum Edition Vodka',
        price: 120,
        category: 'vodka',
        image: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?w=800',
        description: '750ml Platinum Edition - Triple Distilled',
        badge: 'PREMIUM',
        weight: '750ml',
        rating: 5.0,
        reviews: 167,
        inStock: true
    }, {
        id: '7',
        name: 'Heritage Vodka 1895',
        price: 65,
        category: 'vodka',
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800',
        description: '750ml Heritage Edition - Classic Recipe',
        weight: '750ml',
        rating: 4.6,
        reviews: 312,
        inStock: true
    }, {
        id: '8',
        name: 'Imperial Gold Vodka',
        price: 155,
        category: 'vodka',
        image: 'https://images.unsplash.com/photo-1585870938850-2d447a611b57?w=800',
        description: '750ml Gold Edition - Luxury Blend',
        badge: 'LIMITED',
        weight: '750ml',
        rating: 4.8,
        reviews: 98,
        inStock: false
    }, {
        id: '9',
        name: 'Traditional Dill Pickles',
        price: 18,
        category: 'pickles',
        image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800',
        description: '500g Traditional Recipe - Crispy Dill',
        badge: 'ORGANIC',
        weight: '500g',
        rating: 4.7,
        reviews: 423,
        inStock: true
    }] as ProductType[];

export const FEATURES = [
    {
        icon: Award,
        title: 'Premium Quality',
        description: 'Handpicked gourmet products from around the world'
    }, {
        icon: Truck,
        title: 'Free Shipping',
        description: 'On orders over $75 with expedited delivery'
    }, {
        icon: Shield,
        title: 'Secure Payment',
        description: 'Protected checkout with industry-leading security'
    }, {
        icon: Star,
        title: 'Expert Curation',
        description: 'Carefully selected by our culinary specialists'
    }] as FeaturesType[];

export const COLLECTIONDATA = {
    caviar: {
        title: 'Premium Caviar Collection',
        description: 'The finest selection of sturgeon roe, sourced from pristine waters and prepared with centuries-old techniques. Each tin represents the pinnacle of luxury and taste.',
        hero: 'https://images.unsplash.com/photo-1535473895227-bdecb20fb157?w=1200',
        bgGradient: 'from-slate-800 to-slate-900'
    },
    vodka: {
        title: 'Imperial Vodka Collection',
        description: 'Distilled to perfection using traditional Russian methods. Our vodka collection showcases the pure essence of craftsmanship with smooth, refined flavors.',
        hero: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=1200',
        bgGradient: 'from-red-900 to-red-950'
    },
    pickles: {
        title: 'Traditional Pickles Collection',
        description: 'Authentic Russian pickles fermented using time-honored recipes. Crisp, flavorful, and made with the finest organic vegetables and natural spices.',
        hero: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=1200',
        bgGradient: 'from-red-800 to-red-900'
    }
};

// export const ALLPRODUCTS: ProductType[] = [
//     {
//         id: '1',
//         name: 'Beluga Caviar Imperial',
//         price: 280,
//         originalPrice: 320,
//         category: 'caviar',
//         image: 'https://images.unsplash.com/photo-1535473895227-bdecb20fb157?w=800',
//         description: '50g Imperial Selection - Rare Beluga',
//         badge: 'PREMIUM',
//         weight: '50g',
//         rating: 5.0,
//         reviews: 127,
//         inStock: true
//     }, {
//         id: '2',
//         name: 'Osetra Caviar Classic',
//         price: 180,
//         category: 'caviar',
//         image: 'https://images.unsplash.com/photo-1600243241290-a3cfab8e7ffe?w=800',
//         description: '30g Classic Selection - Golden Osetra',
//         weight: '30g',
//         rating: 4.8,
//         reviews: 89,
//         inStock: true
//     }, {
//         id: '3',
//         name: 'Sevruga Caviar Reserve',
//         price: 145,
//         category: 'caviar',
//         image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',
//         description: '30g Reserve Selection - Fine Sevruga',
//         weight: '30g',
//         rating: 4.7,
//         reviews: 64,
//         inStock: true
//     }, {
//         id: '4',
//         name: 'Kaluga Hybrid Caviar',
//         price: 210,
//         category: 'caviar',
//         image: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=800',
//         description: '50g Premium Selection - Kaluga Hybrid',
//         badge: 'LIMITED',
//         weight: '50g',
//         rating: 4.9,
//         reviews: 45,
//         inStock: true
//     }, {
//         id: '5',
//         name: 'Imperial Reserve Vodka',
//         price: 85,
//         originalPrice: 95,
//         category: 'vodka',
//         image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800',
//         description: '750ml Premium Reserve - Crystal Clear',
//         weight: '750ml',
//         rating: 4.9,
//         reviews: 234,
//         inStock: true
//     }, {
//         id: '6',
//         name: 'Platinum Edition Vodka',
//         price: 120,
//         category: 'vodka',
//         image: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?w=800',
//         description: '750ml Platinum Edition - Triple Distilled',
//         badge: 'PREMIUM',
//         weight: '750ml',
//         rating: 5.0,
//         reviews: 167,
//         inStock: true
//     }, {
//         id: '7',
//         name: 'Heritage Vodka 1895',
//         price: 65,
//         category: 'vodka',
//         image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800',
//         description: '750ml Heritage Edition - Classic Recipe',
//         weight: '750ml',
//         rating: 4.6,
//         reviews: 312,
//         inStock: true
//     }, {
//         id: '8',
//         name: 'Imperial Gold Vodka',
//         price: 155,
//         category: 'vodka',
//         image: 'https://images.unsplash.com/photo-1585870938850-2d447a611b57?w=800',
//         description: '750ml Gold Edition - Luxury Blend',
//         badge: 'LIMITED',
//         weight: '750ml',
//         rating: 4.8,
//         reviews: 98,
//         inStock: false
//     }, {
//         id: '9',
//         name: 'Traditional Dill Pickles',
//         price: 18,
//         category: 'pickles',
//         image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800',
//         description: '500g Traditional Recipe - Crispy Dill',
//         badge: 'ORGANIC',
//         weight: '500g',
//         rating: 4.7,
//         reviews: 423,
//         inStock: true
//     }, {
//         id: '10',
//         name: 'Garlic & Herb Pickles',
//         price: 20,
//         category: 'pickles',
//         image: 'https://images.unsplash.com/photo-1619419152703-15cbe2a2e93e?w=800',
//         description: '500g Gourmet Blend - Bold Garlic',
//         badge: 'ORGANIC',
//         weight: '500g',
//         rating: 4.8,
//         reviews: 289,
//         inStock: true
//     }, {
//         id: '11',
//         name: 'Spicy Pickled Vegetables',
//         price: 22,
//         originalPrice: 26,
//         category: 'pickles',
//         image: 'https://images.unsplash.com/photo-1599021662715-eb19bb62c3eb?w=800',
//         description: '650g Mixed Vegetables - Fiery Blend',
//         weight: '650g',
//         rating: 4.6,
//         reviews: 198,
//         inStock: true
//     }, {
//         id: '12',
//         name: 'Artisan Pickled Tomatoes',
//         price: 24,
//         category: 'pickles',
//         image: 'https://images.unsplash.com/photo-1592921869218-8c8bf5d1497c?w=800',
//         description: '550g Cherry Tomatoes - Sweet & Tangy',
//         badge: 'NEW',
//         weight: '550g',
//         rating: 4.9,
//         reviews: 156,
//         inStock: true
//     }];

export const REVIEWS: ReviewType[] = [{
    id: '1',
    author: 'James Morrison',
    rating: 5,
    date: 'March 15, 2024',
    comment: 'Absolutely exceptional caviar. The texture is perfect and the flavor is sublime. Worth every penny for special occasions.',
    verified: true
}, {
    id: '2',
    author: 'Sofia Petrov',
    rating: 5,
    date: 'March 10, 2024',
    comment: 'This is the real deal. Having grown up with authentic caviar, I can say this is as good as it gets. The delivery packaging was also impressive.',
    verified: true
}, {
    id: '3',
    author: 'Michael Chen',
    rating: 4,
    date: 'March 5, 2024',
    comment: 'Outstanding quality, though quite pricey. Perfect for our anniversary dinner. The buttery flavor is exactly what you want from Beluga.',
    verified: true
}];

// Sample product data
export const DETAILEDPRODUCTS: DetailedProductType[] = [
    {
        id: '1',
        name: 'Beluga Caviar Imperial',
        price: 280,
        originalPrice: 320,
        category: 'caviar',
        images: ['https://images.unsplash.com/photo-1535473895227-bdecb20fb157?w=1200', 'https://images.unsplash.com/photo-1600243241290-a3cfab8e7ffe?w=1200', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1200', 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=1200'],
        description: '50g Imperial Selection - Rare Beluga',
        longDescription: 'Our Beluga Caviar Imperial represents the pinnacle of luxury and refinement. Sourced from the pristine waters of the Caspian Sea, these large, delicate pearls are hand-selected and processed using traditional methods passed down through generations. Each tin contains only the finest roe, characterized by its buttery texture and complex, nuanced flavor profile that develops beautifully on the palate.',
        badge: 'PREMIUM',
        weightInGrams: 50,
        rating: 5.0,
        reviews: 127,
        inStock: true,
        stockCount: 8,
        features: ['Wild-caught Beluga sturgeon from sustainable sources', 'Hand-selected and graded by master caviar experts', 'Traditional Malossol preparation (lightly salted)', 'Delivered in temperature-controlled packaging', 'Certificate of authenticity included', 'Best consumed within 6 weeks of opening'],
        specifications: [{
            label: 'Origin',
            value: 'Caspian Sea'
        }, {
            label: 'Species',
            value: 'Huso Huso (Beluga Sturgeon)'
        }, {
            label: 'Grade',
            value: 'Imperial Selection'
        }, {
            label: 'Color',
            value: 'Light to Dark Gray'
        }, {
            label: 'Bead Size',
            value: '3.0-3.5mm'
        }, {
            label: 'Salt Content',
            value: '3-4% (Malossol)'
        }, {
            label: 'Storage',
            value: '-2°C to 2°C'
        }, {
            label: 'Shelf Life',
            value: '6 months sealed, 6 weeks opened'
        }]
    },
    {
        id: '2',
        name: 'Osetra Caviar Classic',
        price: 180,
        originalPrice: 200,
        category: 'caviar',
        images: ['https://images.unsplash.com/photo-1600243241290-a3cfab8e7ffe?w=800'],
        description: '30g Classic Selection - Golden Osetra',
        longDescription: '30g Classic Selection - Golden Osetra',
        badge: "Premium",
        weightInGrams: 30,
        rating: 4.8,
        reviews: 89,
        inStock: true,
        stockCount: 5,
        features: ['Wild-caught Beluga sturgeon from sustainable sources', 'Hand-selected and graded by master caviar experts', 'Traditional Malossol preparation (lightly salted)', 'Delivered in temperature-controlled packaging', 'Certificate of authenticity included', 'Best consumed within 6 weeks of opening'],
        specifications: [{
            label: 'Origin',
            value: 'Caspian Sea'
        }, {
            label: 'Species',
            value: 'Huso Huso (Beluga Sturgeon)'
        }, {
            label: 'Grade',
            value: 'Imperial Selection'
        }, {
            label: 'Color',
            value: 'Light to Dark Gray'
        }, {
            label: 'Bead Size',
            value: '3.0-3.5mm'
        }, {
            label: 'Salt Content',
            value: '3-4% (Malossol)'
        }, {
            label: 'Storage',
            value: '-2°C to 2°C'
        }, {
            label: 'Shelf Life',
            value: '6 months sealed, 6 weeks opened'
        }]
    },
    {
        id: '3',
        name: 'Sevruga Caviar Reserve',
        price: 145,
        originalPrice: 200,
        category: 'caviar',
        images: ['https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800'],
        description: '30g Reserve Selection - Fine Sevruga',
        longDescription: '30g Reserve Selection - Fine Sevruga',
        badge: "PREMIUM",
        weightInGrams: 30,
        rating: 4.7,
        reviews: 64,
        inStock: true,
        stockCount: 5,
        features: ['Wild-caught Beluga sturgeon from sustainable sources', 'Hand-selected and graded by master caviar experts', 'Traditional Malossol preparation (lightly salted)', 'Delivered in temperature-controlled packaging', 'Certificate of authenticity included', 'Best consumed within 6 weeks of opening'],
        specifications: [{
            label: 'Origin',
            value: 'Caspian Sea'
        }, {
            label: 'Species',
            value: 'Huso Huso (Beluga Sturgeon)'
        }, {
            label: 'Grade',
            value: 'Imperial Selection'
        }, {
            label: 'Color',
            value: 'Light to Dark Gray'
        }, {
            label: 'Bead Size',
            value: '3.0-3.5mm'
        }, {
            label: 'Salt Content',
            value: '3-4% (Malossol)'
        }, {
            label: 'Storage',
            value: '-2°C to 2°C'
        }, {
            label: 'Shelf Life',
            value: '6 months sealed, 6 weeks opened'
        }]
    },
    {
        id: '4',
        name: 'Kaluga Hybrid Caviar',
        price: 210,
        originalPrice: 260,
        category: 'caviar',
        images: ['https://images.unsplash.com/photo-1604909052743-94e838986d24?w=800'],
        description: '50g Premium Selection - Kaluga Hybrid',
        longDescription: '50g Premium Selection - Kaluga Hybrid',
        badge: 'LIMITED',
        weightInGrams: 50,
        rating: 4.9,
        reviews: 45,
        inStock: true,
        stockCount: 7,
        features: ['Wild-caught Beluga sturgeon from sustainable sources', 'Hand-selected and graded by master caviar experts', 'Traditional Malossol preparation (lightly salted)', 'Delivered in temperature-controlled packaging', 'Certificate of authenticity included', 'Best consumed within 6 weeks of opening'],
        specifications: [{
            label: 'Origin',
            value: 'Caspian Sea'
        }, {
            label: 'Species',
            value: 'Huso Huso (Beluga Sturgeon)'
        }, {
            label: 'Grade',
            value: 'Imperial Selection'
        }, {
            label: 'Color',
            value: 'Light to Dark Gray'
        }, {
            label: 'Bead Size',
            value: '3.0-3.5mm'
        }, {
            label: 'Salt Content',
            value: '3-4% (Malossol)'
        }, {
            label: 'Storage',
            value: '-2°C to 2°C'
        }, {
            label: 'Shelf Life',
            value: '6 months sealed, 6 weeks opened'
        }]
    },
    {
        id: '5',
        name: 'Imperial Reserve Vodka',
        price: 85,
        originalPrice: 95,
        category: 'vodka',
        images: ['https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800'],
        description: '750ml Premium Reserve - Crystal Clear',
        longDescription: "long description here",
        badge: "BESTSELLER",
        weightInGrams: 750,
        rating: 4.9,
        reviews: 234,
        inStock: true,
        stockCount: 9,
        features: ['Wild-caught Beluga sturgeon from sustainable sources', 'Hand-selected and graded by master caviar experts', 'Traditional Malossol preparation (lightly salted)', 'Delivered in temperature-controlled packaging', 'Certificate of authenticity included', 'Best consumed within 6 weeks of opening'],
        specifications: [{
            label: 'Storage',
            value: '-2°C to 2°C'
        }, {
            label: 'Shelf Life',
            value: '6 months sealed, 6 weeks opened'
        }]
    },
    {
        id: '6',
        name: 'Platinum Edition Vodka',
        price: 120,
        originalPrice: 150,
        category: 'vodka',
        images: ['https://images.unsplash.com/photo-1560512823-829485b8bf24?w=800'],
        description: '750ml Platinum Edition - Triple Distilled',
        longDescription: "long description here",
        badge: 'PREMIUM',
        weightInGrams: 750,
        rating: 5.0,
        reviews: 167,
        inStock: true,
        stockCount: 9,
        features: ['Wild-caught Beluga sturgeon from sustainable sources', 'Hand-selected and graded by master caviar experts', 'Traditional Malossol preparation (lightly salted)', 'Delivered in temperature-controlled packaging', 'Certificate of authenticity included', 'Best consumed within 6 weeks of opening'],
        specifications: [{
            label: 'Storage',
            value: '-2°C to 2°C'
        }, {
            label: 'Shelf Life',
            value: '6 months sealed, 6 weeks opened'
        }]
    },
    {
        id: '7',
        name: 'Heritage Vodka 1895',
        price: 65,
        originalPrice: 120,
        category: 'vodka',
        images: ['https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800'],
        description: '750ml Heritage Edition - Classic Recipe',
        longDescription: "long description here",
        badge: "PREMIUM",
        weightInGrams: 750,
        rating: 4.6,
        reviews: 312,
        inStock: true,
        stockCount: 9,
        features: ['Wild-caught Beluga sturgeon from sustainable sources', 'Hand-selected and graded by master caviar experts', 'Traditional Malossol preparation (lightly salted)', 'Delivered in temperature-controlled packaging', 'Certificate of authenticity included', 'Best consumed within 6 weeks of opening'],
        specifications: [{
            label: 'Storage',
            value: '-2°C to 2°C'
        }, {
            label: 'Shelf Life',
            value: '6 months sealed, 6 weeks opened'
        }]
    },
    {
        id: '8',
        name: 'Imperial Gold Vodka',
        price: 155,
        originalPrice: 170,
        category: 'vodka',
        images: ['https://images.unsplash.com/photo-1585870938850-2d447a611b57?w=800'],
        description: '750ml Gold Edition - Luxury Blend',
        longDescription: "long description here",
        badge: 'LIMITED',
        weightInGrams: 750,
        rating: 4.8,
        reviews: 98,
        inStock: false,
        stockCount: 9,
        features: ['Wild-caught Beluga sturgeon from sustainable sources', 'Hand-selected and graded by master caviar experts', 'Traditional Malossol preparation (lightly salted)', 'Delivered in temperature-controlled packaging', 'Certificate of authenticity included', 'Best consumed within 6 weeks of opening'],
        specifications: [{
            label: 'Storage',
            value: '-2°C to 2°C'
        }, {
            label: 'Shelf Life',
            value: '6 months sealed, 6 weeks opened'
        }]
    },
    {
        id: '9',
        name: 'Traditional Dill Pickles',
        price: 18,
        originalPrice: 20,
        category: 'pickles',
        images: ['https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800'],
        description: '500g Traditional Recipe - Crispy Dill',
        longDescription: "long description here",
        badge: 'ORGANIC',
        weightInGrams: 500,
        rating: 4.7,
        reviews: 423,
        inStock: true,
        stockCount: 5,
        features: ['Hand-selected and graded by master caviar experts', 'Traditional Malossol preparation (lightly salted)', 'Delivered in temperature-controlled packaging', 'Certificate of authenticity included', 'Best consumed within 6 weeks of opening'],
        specifications: [{
            label: 'Storage',
            value: '-2°C to 2°C'
        }, {
            label: 'Shelf Life',
            value: '6 months sealed, 6 weeks opened'
        }]
    },
    {
        id: '10',
        name: 'Garlic & Herb Pickles',
        price: 20,
        originalPrice: 22,
        category: 'pickles',
        images: ['https://images.unsplash.com/photo-1619419152703-15cbe2a2e93e?w=800'],
        description: '500g Gourmet Blend - Bold Garlic',
        longDescription: "",
        badge: 'ORGANIC',
        weightInGrams: 500,
        rating: 4.8,
        reviews: 289,
        inStock: true,
        stockCount: 5,
        features: ['Hand-selected and graded by master caviar experts', 'Traditional Malossol preparation (lightly salted)', 'Delivered in temperature-controlled packaging', 'Certificate of authenticity included', 'Best consumed within 6 weeks of opening'],
        specifications: [{
            label: 'Storage',
            value: '-2°C to 2°C'
        }, {
            label: 'Shelf Life',
            value: '6 months sealed, 6 weeks opened'
        }]
    },
    {
        id: '11',
        name: 'Spicy Pickled Vegetables',
        price: 22,
        originalPrice: 26,
        category: 'pickles',
        images: ['https://images.unsplash.com/photo-1599021662715-eb19bb62c3eb?w=800'],
        description: '650g Mixed Vegetables - Fiery Blend',
        longDescription: "",
        badge: "",
        weightInGrams: 650,
        rating: 4.6,
        reviews: 198,
        inStock: true,
        stockCount: 5,
        features: ['Hand-selected and graded by master caviar experts', 'Traditional Malossol preparation (lightly salted)', 'Delivered in temperature-controlled packaging', 'Certificate of authenticity included', 'Best consumed within 6 weeks of opening'],
        specifications: [{
            label: 'Storage',
            value: '-2°C to 2°C'
        }, {
            label: 'Shelf Life',
            value: '6 months sealed, 6 weeks opened'
        }]
    },
    {
        id: '12',
        name: 'Artisan Pickled Tomatoes',
        price: 24,
        originalPrice: 30,
        category: 'pickles',
        images: ['https://images.unsplash.com/photo-1592921869218-8c8bf5d1497c?w=800'],
        description: '550g Cherry Tomatoes - Sweet & Tangy',
        longDescription: "",
        badge: 'NEW',
        weightInGrams: 550,
        rating: 4.9,
        reviews: 156,
        inStock: true,
        stockCount: 5,
        features: ['Hand-selected and graded by master caviar experts', 'Traditional Malossol preparation (lightly salted)', 'Delivered in temperature-controlled packaging', 'Certificate of authenticity included', 'Best consumed within 6 weeks of opening'],
        specifications: [{
            label: 'Storage',
            value: '-2°C to 2°C'
        }, {
            label: 'Shelf Life',
            value: '6 months sealed, 6 weeks opened'
        }]
    }];

export const DETAILEDPRODUCTDATA: DetailedProductType = {
    id: '1',
    name: 'Beluga Caviar Imperial',
    price: 280,
    originalPrice: 320,
    category: 'caviar',
    images: ['https://images.unsplash.com/photo-1535473895227-bdecb20fb157?w=1200', 'https://images.unsplash.com/photo-1600243241290-a3cfab8e7ffe?w=1200', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1200', 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=1200'],
    description: '50g Imperial Selection - Rare Beluga',
    longDescription: 'Our Beluga Caviar Imperial represents the pinnacle of luxury and refinement. Sourced from the pristine waters of the Caspian Sea, these large, delicate pearls are hand-selected and processed using traditional methods passed down through generations. Each tin contains only the finest roe, characterized by its buttery texture and complex, nuanced flavor profile that develops beautifully on the palate.',
    badge: 'PREMIUM',
    weight: '50g',
    rating: 5.0,
    reviews: 127,
    inStock: true,
    stockCount: 8,
    features: ['Wild-caught Beluga sturgeon from sustainable sources', 'Hand-selected and graded by master caviar experts', 'Traditional Malossol preparation (lightly salted)', 'Delivered in temperature-controlled packaging', 'Certificate of authenticity included', 'Best consumed within 6 weeks of opening'],
    specifications: [{
        label: 'Origin',
        value: 'Caspian Sea'
    }, {
        label: 'Species',
        value: 'Huso Huso (Beluga Sturgeon)'
    }, {
        label: 'Grade',
        value: 'Imperial Selection'
    }, {
        label: 'Color',
        value: 'Light to Dark Gray'
    }, {
        label: 'Bead Size',
        value: '3.0-3.5mm'
    }, {
        label: 'Salt Content',
        value: '3-4% (Malossol)'
    }, {
        label: 'Storage',
        value: '-2°C to 2°C'
    }, {
        label: 'Shelf Life',
        value: '6 months sealed, 6 weeks opened'
    }]
};

export interface ProductPageProps {
    productId?: string;
    onNavigateBack?: () => void;
}