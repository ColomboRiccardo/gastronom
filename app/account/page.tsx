"use client";

import * as React from 'react';
import {useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {
    Bell,
    Check,
    CheckCircle2,
    ChevronRight,
    Clock,
    Edit2,
    Heart,
    Lock,
    LogOut,
    Mail,
    MapPin,
    Menu,
    Package,
    Phone,
    Save,
    Search,
    Settings,
    ShoppingBag,
    ShoppingCart,
    Truck,
    User,
    X
} from 'lucide-react';

type TabType = 'profile' | 'orders' | 'favorites' | 'settings';
type Order = {
    id: string;
    date: string;
    status: 'processing' | 'shipped' | 'delivered';
    total: number;
    items: number;
    products: Array<{
        name: string;
        image: string;
        quantity: number;
        price: number;
    }>;
};
type FavoriteProduct = {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    inStock: boolean;
};
type ProfileData = {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
};

export interface GastronomAccountProps {
}

const mockOrders: Order[] = [{
    id: 'ORD-2024-001',
    date: 'March 15, 2024',
    status: 'delivered',
    total: 465.00,
    items: 3,
    products: [{
        name: 'Beluga Caviar',
        image: 'https://images.unsplash.com/photo-1535473895227-bdecb20fb157?w=800',
        quantity: 1,
        price: 280
    }, {
        name: 'Imperial Vodka',
        image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800',
        quantity: 2,
        price: 85
    }]
}, {
    id: 'ORD-2024-002',
    date: 'March 10, 2024',
    status: 'shipped',
    total: 198.00,
    items: 2,
    products: [{
        name: 'Osetra Caviar',
        image: 'https://images.unsplash.com/photo-1600243241290-a3cfab8e7ffe?w=800',
        quantity: 1,
        price: 180
    }, {
        name: 'Dill Pickles',
        image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800',
        quantity: 1,
        price: 18
    }]
}, {
    id: 'ORD-2024-003',
    date: 'March 5, 2024',
    status: 'processing',
    total: 85.00,
    items: 1,
    products: [{
        name: 'Imperial Vodka',
        image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800',
        quantity: 1,
        price: 85
    }]
}];
const mockFavorites: FavoriteProduct[] = [{
    id: '1',
    name: 'Beluga Caviar',
    price: 280,
    image: 'https://images.unsplash.com/photo-1535473895227-bdecb20fb157?w=800',
    description: '50g Imperial Selection',
    inStock: true
}, {
    id: '2',
    name: 'Osetra Caviar',
    price: 180,
    image: 'https://images.unsplash.com/photo-1600243241290-a3cfab8e7ffe?w=800',
    description: '30g Classic Selection',
    inStock: true
}, {
    id: '3',
    name: 'Dill Pickles',
    price: 18,
    image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800',
    description: '500g Traditional Recipe',
    inStock: false
}];
export default function GastronomAccount(_props: GastronomAccountProps) {
    const [activeTab, setActiveTab] = useState<TabType>('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [profileData, setProfileData] = useState<ProfileData>({
        name: 'Alexander Petrov',
        email: 'alexander.petrov@email.com',
        phone: '+7 (495) 123-4567',
        address: '15 Tverskaya Street',
        city: 'Moscow',
        country: 'Russia',
        postalCode: '125009'
    });
    const [editedData, setEditedData] = useState<ProfileData>(profileData);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [newsletter, setNewsletter] = useState(true);
    const [orderUpdates, setOrderUpdates] = useState(true);
    const handleEdit = () => {
        setIsEditing(true);
        setEditedData(profileData);
    };
    const handleCancel = () => {
        setIsEditing(false);
        setEditedData(profileData);
    };
    const handleSave = () => {
        setProfileData(editedData);
        setIsEditing(false);
        showToast('Profile updated successfully');
    };
    const showToast = (message: string) => {
        setNotificationMessage(message);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
    };
    const getOrderStatusIcon = (status: Order['status']) => {
        switch (status) {
            case 'processing':
                return <Clock className="w-5 h-5"/>;
            case 'shipped':
                return <Truck className="w-5 h-5"/>;
            case 'delivered':
                return <CheckCircle2 className="w-5 h-5"/>;
        }
    };
    const getOrderStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'processing':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'shipped':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'delivered':
                return 'bg-green-100 text-green-700 border-green-200';
        }
    };
    return <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex items-center">
                        <a href="/" className="text-3xl font-serif tracking-wider text-red-900">
                            GASTRONOM
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <a href="/" className="text-sm text-gray-700 hover:text-red-900 transition-colors">
                            Shop
                        </a>
                        <a href="#collections" className="text-sm text-gray-700 hover:text-red-900 transition-colors">
                            Collections
                        </a>
                        <a href="#about" className="text-sm text-gray-700 hover:text-red-900 transition-colors">
                            About
                        </a>
                        <a href="#contact" className="text-sm text-gray-700 hover:text-red-900 transition-colors">
                            Contact
                        </a>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                        <button className="p-2.5 hover:bg-gray-50 rounded-full transition-colors" aria-label="Search">
                            <Search className="w-5 h-5 text-gray-700"/>
                        </button>
                        <button className="p-2.5 bg-amber-50 rounded-full transition-colors" aria-label="Account">
                            <User className="w-5 h-5 text-amber-600"/>
                        </button>
                        <button className="relative p-2.5 hover:bg-gray-50 rounded-full transition-colors"
                                aria-label="Shopping cart">
                            <ShoppingCart className="w-5 h-5 text-gray-700"/>
                        </button>
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2.5 hover:bg-gray-50 rounded-full transition-colors"
                                aria-label="Menu">
                            <Menu className="w-5 h-5 text-gray-700"/>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && <motion.nav initial={{
                        height: 0,
                        opacity: 0
                    }} animate={{
                        height: 'auto',
                        opacity: 1
                    }} exit={{
                        height: 0,
                        opacity: 0
                    }} className="md:hidden border-t border-gray-100 overflow-hidden">
                        <div className="py-4 space-y-1">
                            <a href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded">
                                Shop
                            </a>
                            <a href="#collections" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded">
                                Collections
                            </a>
                            <a href="#about" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded">
                                About
                            </a>
                            <a href="#contact" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded">
                                Contact
                            </a>
                        </div>
                    </motion.nav>}
                </AnimatePresence>
            </div>
        </header>

        {/* Page Header */}
        <section className="bg-gradient-to-br from-red-50 via-white to-amber-50 border-b border-gray-100">
            <div className="container mx-auto px-6 py-12">
                <motion.div initial={{
                    opacity: 0,
                    y: 20
                }} animate={{
                    opacity: 1,
                    y: 0
                }} transition={{
                    duration: 0.6
                }}>
                    <div className="inline-block mb-4">
              <span
                  className="px-4 py-1.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-200">
                Welcome Back
              </span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-serif text-red-900 mb-3">
                        My Account
                    </h1>
                    <p className="text-lg text-gray-600">
                        Manage your profile, orders, and preferences
                    </p>
                </motion.div>
            </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Sidebar Navigation */}
                    <motion.div initial={{
                        opacity: 0,
                        x: -20
                    }} animate={{
                        opacity: 1,
                        x: 0
                    }} transition={{
                        duration: 0.5
                    }} className="lg:col-span-3">
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-28">
                            <div className="space-y-2">
                                <button onClick={() => setActiveTab('profile')}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${activeTab === 'profile' ? 'bg-red-50 text-red-900 border border-red-100' : 'text-gray-700 hover:bg-gray-50'}`}>
                                    <User className="w-5 h-5"/>
                                    <span>Profile</span>
                                </button>

                                <button onClick={() => setActiveTab('orders')}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${activeTab === 'orders' ? 'bg-red-50 text-red-900 border border-red-100' : 'text-gray-700 hover:bg-gray-50'}`}>
                                    <ShoppingBag className="w-5 h-5"/>
                                    <span>Orders</span>
                                </button>

                                <button onClick={() => setActiveTab('favorites')}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${activeTab === 'favorites' ? 'bg-red-50 text-red-900 border border-red-100' : 'text-gray-700 hover:bg-gray-50'}`}>
                                    <Heart className="w-5 h-5"/>
                                    <span>Favorites</span>
                                </button>

                                <button onClick={() => setActiveTab('settings')}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${activeTab === 'settings' ? 'bg-red-50 text-red-900 border border-red-100' : 'text-gray-700 hover:bg-gray-50'}`}>
                                    <Settings className="w-5 h-5"/>
                                    <span>Settings</span>
                                </button>

                                <div className="border-t border-gray-100 my-4 pt-4">
                                    <button onClick={() => showToast('Logged out successfully')}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-800 hover:bg-red-50 transition-colors font-medium">
                                        <LogOut className="w-5 h-5"/>
                                        <span>Log Out</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content Area */}
                    <div className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            {activeTab === 'profile' && <motion.div key="profile" initial={{
                                opacity: 0,
                                y: 20
                            }} animate={{
                                opacity: 1,
                                y: 0
                            }} exit={{
                                opacity: 0,
                                y: -20
                            }} transition={{
                                duration: 0.3
                            }}>
                                <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h2 className="text-3xl font-serif text-red-900 mb-2">Profile
                                                Information</h2>
                                            <p className="text-gray-600">Manage your personal details</p>
                                        </div>
                                        {!isEditing ? <button onClick={handleEdit}
                                                              className="px-6 py-3 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg">
                                            <Edit2 className="w-4 h-4"/>
                                            Edit Profile
                                        </button> : <div className="flex gap-2">
                                            <button onClick={handleCancel}
                                                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                                                <X className="w-4 h-4"/>
                                                Cancel
                                            </button>
                                            <button onClick={handleSave}
                                                    className="px-6 py-3 bg-red-800 text-white rounded-lg font-medium hover:bg-red-900 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg">
                                                <Save className="w-4 h-4"/>
                                                Save Changes
                                            </button>
                                        </div>}
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Full Name
                                            </label>
                                            <div className="relative">
                                                <User
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                                                <input type="text"
                                                       value={isEditing ? editedData.name : profileData.name}
                                                       onChange={e => setEditedData({
                                                           ...editedData,
                                                           name: e.target.value
                                                       })} disabled={!isEditing}
                                                       className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-600"/>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <Mail
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                                                <input type="email"
                                                       value={isEditing ? editedData.email : profileData.email}
                                                       onChange={e => setEditedData({
                                                           ...editedData,
                                                           email: e.target.value
                                                       })} disabled={!isEditing}
                                                       className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-600"/>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Phone Number
                                            </label>
                                            <div className="relative">
                                                <Phone
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                                                <input type="tel"
                                                       value={isEditing ? editedData.phone : profileData.phone}
                                                       onChange={e => setEditedData({
                                                           ...editedData,
                                                           phone: e.target.value
                                                       })} disabled={!isEditing}
                                                       className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-600"/>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Street Address
                                            </label>
                                            <div className="relative">
                                                <MapPin
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                                                <input type="text"
                                                       value={isEditing ? editedData.address : profileData.address}
                                                       onChange={e => setEditedData({
                                                           ...editedData,
                                                           address: e.target.value
                                                       })} disabled={!isEditing}
                                                       className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-600"/>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                City
                                            </label>
                                            <input type="text" value={isEditing ? editedData.city : profileData.city}
                                                   onChange={e => setEditedData({
                                                       ...editedData,
                                                       city: e.target.value
                                                   })} disabled={!isEditing}
                                                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-600"/>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Country
                                            </label>
                                            <input type="text"
                                                   value={isEditing ? editedData.country : profileData.country}
                                                   onChange={e => setEditedData({
                                                       ...editedData,
                                                       country: e.target.value
                                                   })} disabled={!isEditing}
                                                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-600"/>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Postal Code
                                            </label>
                                            <input type="text"
                                                   value={isEditing ? editedData.postalCode : profileData.postalCode}
                                                   onChange={e => setEditedData({
                                                       ...editedData,
                                                       postalCode: e.target.value
                                                   })} disabled={!isEditing}
                                                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-600"/>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 mt-8 pt-8">
                                        <h3 className="text-xl font-serif text-red-900 mb-4">Password & Security</h3>
                                        <button onClick={() => showToast('Password change requested')}
                                                className="px-6 py-3 border-2 border-amber-500 text-amber-600 rounded-lg font-medium hover:bg-amber-500 hover:text-white transition-colors flex items-center gap-2">
                                            <Lock className="w-4 h-4"/>
                                            Change Password
                                        </button>
                                    </div>
                                </div>
                            </motion.div>}

                            {activeTab === 'orders' && <motion.div key="orders" initial={{
                                opacity: 0,
                                y: 20
                            }} animate={{
                                opacity: 1,
                                y: 0
                            }} exit={{
                                opacity: 0,
                                y: -20
                            }} transition={{
                                duration: 0.3
                            }}>
                                <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                                    <div className="mb-8">
                                        <h2 className="text-3xl font-serif text-red-900 mb-2">Order History</h2>
                                        <p className="text-gray-600">Track and manage your orders</p>
                                    </div>

                                    <div className="space-y-4">
                                        {mockOrders.map((order, index) => <motion.div key={order.id} initial={{
                                            opacity: 0,
                                            y: 10
                                        }} animate={{
                                            opacity: 1,
                                            y: 0
                                        }} transition={{
                                            delay: index * 0.1
                                        }}
                                                                                      className="border-2 border-gray-100 rounded-xl p-6 hover:border-amber-200 transition-colors">
                                            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                        Order {order.id}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">{order.date}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                <span
                                    className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center gap-2 ${getOrderStatusColor(order.status)}`}>
                                  {getOrderStatusIcon(order.status)}
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                                                </div>
                                            </div>

                                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                                {order.products.map((product, idx) => <div key={idx}
                                                                                           className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <img src={product.image} alt={product.name}
                                                         className="w-16 h-16 object-cover rounded"/>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-gray-900 text-sm truncate">
                                                            {product.name}
                                                        </h4>
                                                        <p className="text-sm text-gray-600">
                                                            Qty: {product.quantity}
                                                        </p>
                                                        <p className="text-sm font-semibold text-red-900">
                                                            ${product.price}
                                                        </p>
                                                    </div>
                                                </div>)}
                                            </div>

                                            <div
                                                className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                                                <div className="flex items-center gap-6">
                                                    <div>
                                                        <p className="text-sm text-gray-600">Total Amount</p>
                                                        <p className="text-xl font-bold text-red-900">
                                                            ${order.total.toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">Items</p>
                                                        <p className="text-lg font-semibold text-gray-900">
                                                            {order.items}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    className="px-6 py-2.5 border-2 border-amber-500 text-amber-600 rounded-lg font-medium hover:bg-amber-500 hover:text-white transition-colors flex items-center gap-2">
                                                    View Details
                                                    <ChevronRight className="w-4 h-4"/>
                                                </button>
                                            </div>
                                        </motion.div>)}
                                    </div>
                                </div>
                            </motion.div>}

                            {activeTab === 'favorites' && <motion.div key="favorites" initial={{
                                opacity: 0,
                                y: 20
                            }} animate={{
                                opacity: 1,
                                y: 0
                            }} exit={{
                                opacity: 0,
                                y: -20
                            }} transition={{
                                duration: 0.3
                            }}>
                                <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                                    <div className="mb-8">
                                        <h2 className="text-3xl font-serif text-red-900 mb-2">My Favorites</h2>
                                        <p className="text-gray-600">Your saved products and wishlist</p>
                                    </div>

                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {mockFavorites.map((product, index) => <motion.div key={product.id} initial={{
                                            opacity: 0,
                                            y: 10
                                        }} animate={{
                                            opacity: 1,
                                            y: 0
                                        }} transition={{
                                            delay: index * 0.1
                                        }}
                                                                                           className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100">
                                            <div className="relative aspect-square overflow-hidden">
                                                <img src={product.image} alt={product.name}
                                                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                                                {!product.inStock && <div
                                                    className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                  <span className="px-4 py-2 bg-white text-gray-900 text-sm font-bold rounded">
                                    Out of Stock
                                  </span>
                                                </div>}
                                                <button onClick={() => showToast('Removed from favorites')}
                                                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                                                        aria-label="Remove from favorites">
                                                    <Heart className="w-4 h-4 fill-red-800 text-red-800"/>
                                                </button>
                                            </div>

                                            <div className="p-5">
                                                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                                    {product.name}
                                                </h4>
                                                <p className="text-sm text-gray-500 mb-4">{product.description}</p>

                                                <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold text-red-900">
                                  ${product.price}
                                </span>
                                                    <button disabled={!product.inStock}
                                                            onClick={() => showToast('Added to cart')}
                                                            className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed font-medium text-sm">
                                                        Add to Cart
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>)}
                                    </div>
                                </div>
                            </motion.div>}

                            {activeTab === 'settings' && <motion.div key="settings" initial={{
                                opacity: 0,
                                y: 20
                            }} animate={{
                                opacity: 1,
                                y: 0
                            }} exit={{
                                opacity: 0,
                                y: -20
                            }} transition={{
                                duration: 0.3
                            }}>
                                <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                                    <div className="mb-8">
                                        <h2 className="text-3xl font-serif text-red-900 mb-2">Account Settings</h2>
                                        <p className="text-gray-600">Manage your preferences and notifications</p>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Email Notifications */}
                                        <div
                                            className="p-6 bg-gradient-to-br from-amber-50 to-red-50 rounded-xl border border-amber-100">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-4">
                                                    <div className="p-3 bg-amber-500 text-white rounded-lg">
                                                        <Bell className="w-6 h-6"/>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                            Email Notifications
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            Receive updates about your orders and account
                                                        </p>
                                                    </div>
                                                </div>
                                                <button onClick={() => {
                                                    setEmailNotifications(!emailNotifications);
                                                    showToast(emailNotifications ? 'Email notifications disabled' : 'Email notifications enabled');
                                                }}
                                                        className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${emailNotifications ? 'bg-red-800' : 'bg-gray-300'}`}>
                                                    <span
                                                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${emailNotifications ? 'translate-x-8' : 'translate-x-1'}`}/>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Newsletter */}
                                        <div
                                            className="p-6 bg-gradient-to-br from-red-50 to-amber-50 rounded-xl border border-red-100">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-4">
                                                    <div className="p-3 bg-red-800 text-white rounded-lg">
                                                        <Mail className="w-6 h-6"/>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                            Newsletter Subscription
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            Stay updated with new products and exclusive offers
                                                        </p>
                                                    </div>
                                                </div>
                                                <button onClick={() => {
                                                    setNewsletter(!newsletter);
                                                    showToast(newsletter ? 'Unsubscribed from newsletter' : 'Subscribed to newsletter');
                                                }}
                                                        className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${newsletter ? 'bg-red-800' : 'bg-gray-300'}`}>
                                                    <span
                                                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${newsletter ? 'translate-x-8' : 'translate-x-1'}`}/>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Order Updates */}
                                        <div
                                            className="p-6 bg-gradient-to-br from-amber-50 to-white rounded-xl border border-amber-100">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-4">
                                                    <div className="p-3 bg-amber-600 text-white rounded-lg">
                                                        <Package className="w-6 h-6"/>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                            Order Status Updates
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            Get notified about shipping and delivery updates
                                                        </p>
                                                    </div>
                                                </div>
                                                <button onClick={() => {
                                                    setOrderUpdates(!orderUpdates);
                                                    showToast(orderUpdates ? 'Order updates disabled' : 'Order updates enabled');
                                                }}
                                                        className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${orderUpdates ? 'bg-red-800' : 'bg-gray-300'}`}>
                                                    <span
                                                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${orderUpdates ? 'translate-x-8' : 'translate-x-1'}`}/>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 mt-8 pt-8">
                                        <h3 className="text-xl font-serif text-red-900 mb-4">Account Actions</h3>
                                        <div className="flex flex-wrap gap-4">
                                            <button onClick={() => showToast('Export data requested')}
                                                    className="px-6 py-3 border-2 border-amber-500 text-amber-600 rounded-lg font-medium hover:bg-amber-500 hover:text-white transition-colors">
                                                Export My Data
                                            </button>
                                            <button
                                                onClick={() => showToast('Account deletion requested - please contact support')}
                                                className="px-6 py-3 border-2 border-red-800 text-red-800 rounded-lg font-medium hover:bg-red-800 hover:text-white transition-colors">
                                                Delete Account
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>

        {/* Footer */}
        <footer className="bg-red-950 text-gray-300 py-12 mt-12">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h5 className="font-serif text-xl text-amber-400 mb-4">GASTRONOM</h5>
                        <p className="text-sm leading-relaxed">
                            Bringing authentic Russian delicacies to discerning customers since 1895.
                        </p>
                    </div>

                    <div>
                        <h6 className="font-semibold text-amber-400 mb-4">Shop</h6>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="hover:text-amber-300 transition-colors">
                                    Caviar
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-amber-300 transition-colors">
                                    Vodka
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-amber-300 transition-colors">
                                    Pickles
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h6 className="font-semibold text-amber-400 mb-4">Company</h6>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="hover:text-amber-300 transition-colors">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-amber-300 transition-colors">
                                    Contact
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-amber-300 transition-colors">
                                    Shipping
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h6 className="font-semibold text-amber-400 mb-4">Legal</h6>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="hover:text-amber-300 transition-colors">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-amber-300 transition-colors">
                                    Terms of Service
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-red-900 pt-8 text-center text-sm">
                    <p>&copy; 2024 Gastronom. All rights reserved.</p>
                </div>
            </div>
        </footer>

        {/* Toast Notification */}
        <AnimatePresence>
            {showNotification && <motion.div initial={{
                opacity: 0,
                y: 50
            }} animate={{
                opacity: 1,
                y: 0
            }} exit={{
                opacity: 0,
                y: 50
            }} className="fixed bottom-6 right-6 z-50">
                <div
                    className="bg-red-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px]">
                    <div className="p-2 bg-amber-500 rounded-full">
                        <Check className="w-5 h-5"/>
                    </div>
                    <p className="font-medium">{notificationMessage}</p>
                </div>
            </motion.div>}
        </AnimatePresence>
    </div>;
};