import ProductCard from "@/components/custom/ProductCard";

export const ProductCarousel = () => {
    return (
        <section className={"w-full py-5 flex flex-col items-center bg-secondary"}>
            <div className={"w-3/4 py-5 flex flex-col items-center"}>
                <h3 className={"my-5 text-4xl font-bold"}>Prodotti</h3>
                <div className={"columns-3"}>
                    <ProductCard/>
                    <ProductCard/>
                    <ProductCard/>
                </div>
            </div>
        </section>
    );
};