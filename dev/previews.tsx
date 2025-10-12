import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox-next";
import {PaletteTree} from "./palette";
import ProductCard from "@/components/custom/ProductCard";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/ProductCard">
                <ProductCard/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;