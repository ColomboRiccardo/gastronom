import React from 'react'
import Link from "next/link";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const Header = () => {
    return (
        <header className={"w-full  bg-secondary"}>
            <div className={"w-3/4 mx-auto flex justify-between items-center gap-10 py-3"}>
                <Link href={"/"} className={"text-2xl font-bold"}>
                    Gastronom
                </Link>
                <nav>
                    <ul className={"flex gap-5"}>
                        <li>
                            <DropdownMenu>
                                <DropdownMenuTrigger>Shop</DropdownMenuTrigger>
                                <DropdownMenuContent align={"start"} className={"absolute top-2 p-5"}>
                                    <DropdownMenuLabel className={"font-bold mb-4"}>Categorie</DropdownMenuLabel>
                                    <div className={"columns-3 gap-8"}>
                                        <DropdownMenuGroup className={"flex flex-col gap-2"}>
                                            <DropdownMenuItem>Pelmeni</DropdownMenuItem>
                                            <DropdownMenuItem>Salami</DropdownMenuItem>
                                            <DropdownMenuItem>Cetrioli</DropdownMenuItem>
                                            <DropdownMenuItem>Latticini</DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuGroup className={"flex flex-col gap-2"}>
                                            <DropdownMenuItem>Pelmeni</DropdownMenuItem>
                                            <DropdownMenuItem>Salami</DropdownMenuItem>
                                            <DropdownMenuItem>Cetrioli</DropdownMenuItem>
                                            <DropdownMenuItem>Latticini</DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuGroup className={"flex flex-col gap-2"}>
                                            <DropdownMenuItem>Pelmeni</DropdownMenuItem>
                                            <DropdownMenuItem>Salami</DropdownMenuItem>
                                            <DropdownMenuItem>Cetrioli</DropdownMenuItem>
                                            <DropdownMenuItem>Latticini</DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </li>
                        <li>Blog</li>
                        <li>Contatti</li>
                    </ul>
                </nav>
                <Input className={"bg-popover max-w-1/2"}/>
                <div className={"flex gap-5"}>
                    <Button variant={"outline"}>
                        Cart
                    </Button>
                    <Button>
                        Profile
                    </Button>
                </div>
            </div>
        </header>
    )
}
export default Header
