import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-foreground text-background py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl font-serif font-bold">Gastronom</span>
                        </div>
                        <p className="text-background/80 text-sm">
                            Premium gourmet foods for discerning tastes since 2024
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Shop</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-background/80 hover:text-background transition-colors">All
                                Products</a></li>
                            <li><a href="#" className="text-background/80 hover:text-background transition-colors">New
                                Arrivals</a></li>
                            <li><a href="#"
                                   className="text-background/80 hover:text-background transition-colors">Bestsellers</a>
                            </li>
                            <li><a href="#" className="text-background/80 hover:text-background transition-colors">Gift
                                Sets</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-background/80 hover:text-background transition-colors">Contact
                                Us</a></li>
                            <li><a href="#"
                                   className="text-background/80 hover:text-background transition-colors">FAQ</a>
                            </li>
                            <li><a href="#"
                                   className="text-background/80 hover:text-background transition-colors">Shipping</a>
                            </li>
                            <li><a href="#"
                                   className="text-background/80 hover:text-background transition-colors">Returns</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-background/80 hover:text-background transition-colors">About
                                Us</a></li>
                            <li><a href="#"
                                   className="text-background/80 hover:text-background transition-colors">Careers</a>
                            </li>
                            <li><a href="#"
                                   className="text-background/80 hover:text-background transition-colors">Privacy</a>
                            </li>
                            <li><a href="#"
                                   className="text-background/80 hover:text-background transition-colors">Terms</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-background/20 pt-8 text-center text-sm text-background/60">
                    <p>© 2024 Gastronom. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
export default Footer
