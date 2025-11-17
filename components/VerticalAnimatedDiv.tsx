import {motion} from 'framer-motion'
import React from 'react'

const VerticalAnimatedDiv = ({children, className, delay = 0, onClick}: {
    children: React.ReactNode,
    className?: string,
    delay?: number,
    onClick?: React.MouseEventHandler<HTMLButtonElement>
}) => {
    return (
        <motion.div initial={{opacity: 0, y: 20}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}}
                    transition={{duration: 0.6, delay: delay}}
                    className={className} {...onClick}>
            {children}
        </motion.div>
    )
}
export default VerticalAnimatedDiv
