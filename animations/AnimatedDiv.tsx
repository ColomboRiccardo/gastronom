import {motion} from 'framer-motion'
import React from 'react'

const AnimatedDiv = ({children, className, ...otherProps}: { children: React.ReactNode, className?: string }) => {
    return (
        <motion.div key="description" initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -10}} transition={{delay: 0.1}}>
            {children}
        </motion.div>
    )
}
export default AnimatedDiv
