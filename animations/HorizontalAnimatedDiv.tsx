import {motion} from 'framer-motion'
import React from 'react'

interface HorizontalAnimatedDivProps {
    children: React.ReactNode,
    className: string,
    delay?: number,
    onClick?: () => void
}

const HorizontalAnimatedDiv: React.FC<HorizontalAnimatedDivProps> = ({children, className, delay = 0, onClick}) => {
    return (
        <motion.div initial={{opacity: 0, x: -20}} animate={{opacity: 1, x: 0}} className={className} onClick={onClick}>
            {children}
        </motion.div>
    )
}
export default HorizontalAnimatedDiv
