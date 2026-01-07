import {motion} from 'framer-motion'
import React from 'react'

interface VerticalAnimatedDivProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const VerticalAnimatedDiv: React.FC<VerticalAnimatedDivProps> = ({
    children,
    className,
    delay = 0,
    onClick
}) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            className={className}
            onClick={onClick}
        >
            {children}
        </motion.div>
    )
}
export default VerticalAnimatedDiv
