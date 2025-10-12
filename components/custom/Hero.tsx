import React from 'react'
import Image from "next/image";
import {Button} from "@/components/ui/button";

const Hero = () => {
    return (
        <section className={"w-full my-10 flex items-center justify-center bg-popover"}>
            <div className={"w-1/3"}>
                <h2 className={"text-5xl font-bold mb-3"}>Il negozio dove puoi trovare i migliori prodotti tipici est
                    europei</h2>
                <h3 className={"text-xl font-medium mb-3"}>Esplora la nostra vasta selezione di prodotti tipici Est
                    Europei</h3>
                <Button>Guarda il nostro assortimento</Button>
            </div>
            <Image src={"/hero.png"} alt={"Hero"} width={600} height={600}/>
        </section>
    )
}
export default Hero
