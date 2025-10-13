import React from 'react'
import Image from "next/image";
import {Button} from "@/components/ui/button";

const Hero = () => {
    return (
        <section className={"w-full my-10 bg-popover"}>
            <div className={"w-3/4 mx-auto flex items-center justify-center"}>
                <div className={"w-1/2"}>
                    <h2 className={"text-6xl font-bold mb-3"}>Il negozio dove puoi trovare i migliori prodotti tipici
                        est
                        europei</h2>
                    <h3 className={"text-2xl font-medium mb-3"}>Esplora la nostra vasta selezione di prodotti tipici Est
                        Europei</h3>
                    <Button size={"lg"} className={"text-lg"}>Guarda il nostro assortimento</Button>
                </div>
                <Image className="w-1/2" src={"/hero.png"} alt={"Hero"} width={600} height={600}/>
            </div>
        </section>
    )
}
export default Hero
