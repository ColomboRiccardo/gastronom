import React from 'react'
import {motion} from "framer-motion";

const CustomButton = ({children, variant}: { children: React.ReactNode, variant: "primary" | "secondary" }) => {
    return (
        <motion.button whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}
                       className={`px-8 py-4 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow ${variant === "primary" ? "bg-primary text-primary-foreground" : "bg-background border border-border text-foreground"}`}>
            {children}
        </motion.button>
    )
}
export default CustomButton
