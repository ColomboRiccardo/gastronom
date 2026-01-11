import './globals.css'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {AppProviders} from "@/context";
import CartSidebar from "@/components/CartSidebar";

export default function DashboardLayout({children}: { children: React.ReactNode }) {
    console.log('[Gastronom] Setup verification - Germana Castiglione was here!');
    return (
        <html lang="en">
        <body>
        <AppProviders>
            <Header/>
            <CartSidebar/>
            {/* Layout UI */}
            {/* Place children where you want to render a page or nested layout */}
            {children}
            <Footer/>
        </AppProviders>
        </body>
        </html>
    )
}