import React, {useState} from 'react'

type DropdownProps = {
    title: string,
    items: string[]
}

export default function Dropdown({title, items}: DropdownProps) {
    const [open, setOpen] = useState<boolean>()

    const handleHover = () => {
        setOpen(!open)
    }

    return (
        <>
            <div className="text-foreground hover:text-primary transition-colors font-medium relative"
                 onMouseEnter={handleHover}
                 onMouseLeave={handleHover}>{title}
                <div
                    className={`${open ? "" : "hidden"} absolute left-1/2 -translate-x-1/2 top-13 w-36 bg-background border border-border flex justify-center align-center`}>
                    <ul className="flex flex-col gap-4 p-4">
                        {items.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}

