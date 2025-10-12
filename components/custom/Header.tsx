import React from 'react'
import Link from "next/link";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

const Header = () => {
    return (
        <header className={"w-full flex justify-between items-center gap-10 py-3 px-5 bg-secondary"}>
            <Link href={"/"} className={"text-2xl font-bold"}>
                Gastronom
            </Link>
            <ul className={"flex gap-5"}>
                <li>Shop</li>
                <li>Blog</li>
                <li>Contatti</li>
            </ul>
            <Input className={"bg-popover max-w-1/2"}/>
            <div className={"flex gap-5"}>
                <Button variant={"outline"}>
                    Cart
                </Button>
                <Button>
                    Profile
                </Button>
            </div>
        </header>
    )
}
export default Header
