export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  image: string;
}

export const blogArticles: BlogArticle[] = [
  {
    slug: "art-of-russian-vodka",
    title: "The Art of Russian Vodka: A Journey Through Centuries",
    excerpt: "Discover the rich history and craftsmanship behind Russia's most iconic spirit, from medieval monasteries to modern distilleries.",
    content: `Vodka is more than just a spirit in Russian culture — it is a symbol of hospitality, celebration, and tradition that stretches back centuries.

## A Brief History

The origins of vodka production in Russia date back to the 14th century, when monks first began distilling grain spirits in monasteries. By the 15th century, the Russian state had established a monopoly on vodka production, recognizing both its economic potential and cultural significance.

## The Craft of Distillation

Modern Russian vodka production combines time-honored traditions with contemporary technology. The best vodkas start with carefully selected grains — typically winter wheat or rye — and pristine water sources. The distillation process is repeated multiple times to achieve exceptional purity.

### Key Quality Indicators

- **Water source**: The mineral content and purity of water dramatically affect the final taste
- **Grain selection**: Winter wheat produces a smoother, slightly sweet vodka, while rye adds a spicy complexity
- **Filtration**: Many premium brands use charcoal, silver, or even diamond filtration
- **Number of distillations**: More distillations generally mean greater purity

## How to Enjoy

The Russian tradition of drinking vodka involves small chilled shots, accompanied by zakuski — an array of appetizers like pickled cucumbers, herring, and dark bread. The vodka should be ice-cold, served in small glasses, and consumed in a single, smooth motion.

## Our Selection

At ГАСТРОНОМ, we carefully curate our vodka collection to represent the finest traditions of Eastern European distillation. From the silky smoothness of Beluga Noble to the herbaceous complexity of Zubrowka, each bottle tells a story.`,
    date: "2026-03-28",
    author: "Dmitri Volkov",
    category: "Spirits",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1607622750671-6cd9a99eabd1?w=800&q=80",
  },
  {
    slug: "caviar-guide-beginners",
    title: "Caviar for Beginners: Your Complete Guide",
    excerpt: "Everything you need to know about selecting, storing, and serving caviar — from affordable red roe to luxurious Beluga.",
    content: `Caviar has long been associated with luxury dining, but understanding and enjoying it doesn't require a sommelier's palate. Here's everything you need to know.

## Types of Caviar

### Red Caviar (Salmon Roe)
The most accessible and popular variety in Eastern European cuisine. Large, glistening orange-red pearls with a pleasantly briny, slightly sweet flavor. Perfect on blini with sour cream.

### Black Caviar (Sturgeon)
The crown jewel of caviar. Ranges from the affordable Sevruga to the legendary Beluga. Each variety offers distinct size, color, and flavor profiles.

### Pike Roe
An underrated gem — smaller grains with a concentrated, smoky flavor. Excellent as a spread on dark bread.

## How to Serve

- Always serve caviar chilled, ideally on a bed of crushed ice
- Use mother-of-pearl, bone, or glass spoons — never metal, which can impart a metallic taste
- Traditional accompaniments: blini, sour cream, finely chopped egg, red onion, and fresh dill
- Pair with chilled vodka or dry champagne

## Storage Tips

Caviar is highly perishable. Store unopened jars in the coldest part of your refrigerator (0-4°C). Once opened, consume within 3 days. Never freeze caviar — it destroys the delicate texture of the eggs.`,
    date: "2026-03-15",
    author: "Marina Sokolova",
    category: "Food Guide",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1623428187425-873f16e10554?w=800&q=80",
  },
  {
    slug: "fermentation-tradition",
    title: "The Ancient Art of Fermentation in Slavic Cuisine",
    excerpt: "From sauerkraut to kvass, explore the fermented foods that have sustained Eastern European families for generations.",
    content: `Long before the modern wellness movement discovered fermented foods, Slavic households had been practicing the art of fermentation for centuries.

## Why Fermentation Matters

Fermentation was originally a preservation technique — a way to extend the harvest through harsh winters. But it also creates complex flavors and beneficial probiotics that support digestive health.

## Essential Fermented Foods

### Sauerkraut
Perhaps the most iconic fermented food in Slavic cuisine. Cabbage is shredded, salted, and left to ferment naturally. The result is tangy, crunchy, and incredibly versatile.

### Pickled Cucumbers
Unlike vinegar pickles common in Western cuisine, traditional Russian pickled cucumbers rely on natural lacto-fermentation in a salt brine with dill, garlic, and horseradish leaves.

### Kvass
A mildly fermented beverage made from dark bread. Slightly sweet, slightly sour, and incredibly refreshing on a hot summer day.

### Beet Kvass
A vibrant crimson drink made from fermented beets. Earthy, tangy, and packed with nutrients.

## Making Your Own

The beauty of fermentation is its simplicity. All you need is fresh vegetables, salt, water, and patience. Start with sauerkraut — it's the most forgiving for beginners.`,
    date: "2026-03-01",
    author: "Olga Petrov",
    category: "Traditions",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80",
  },
  {
    slug: "matryoshka-history",
    title: "Matryoshka: More Than Just Nesting Dolls",
    excerpt: "The surprising history and deep symbolism behind Russia's most recognizable cultural export.",
    content: `The matryoshka doll — a set of wooden figures of decreasing size nested inside one another — is perhaps Russia's most recognizable cultural symbol. But its origins may surprise you.

## A Japanese Inspiration

Contrary to popular belief, the matryoshka was not an ancient Russian invention. The first set was carved in 1890 by Vasily Zvyozdochkin, inspired by a Japanese nesting doll (fukuruma) that depicted the Seven Lucky Gods.

## Symbolism

The matryoshka represents many things in Russian culture:
- **Motherhood**: The word "matryoshka" derives from the Latin root "mater" (mother)
- **Family**: Each doll containing smaller versions of itself symbolizes generational bonds
- **Russian soul**: The idea that truth lies within, revealed only layer by layer

## Craftsmanship

Traditional matryoshka production involves:
1. Selecting well-dried linden or birch wood
2. Carving the smallest doll first, then working outward
3. Painting by hand with tempera or gouache
4. Applying multiple layers of lacquer for durability

Each region of Russia has developed its own distinctive painting style, from the floral patterns of Semyonov to the fairy-tale scenes of Palekh.

## Collecting

Vintage matryoshka dolls, especially Soviet-era sets with political themes, have become valuable collector's items. Our selection at ГАСТРОНОМ features hand-painted sets from traditional workshops.`,
    date: "2026-02-20",
    author: "Alexei Kuznetsov",
    category: "Culture",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1560859251-d563a49c5e4a?w=800&q=80",
  },
  {
    slug: "perfect-zakuski-spread",
    title: "How to Build the Perfect Zakuski Spread",
    excerpt: "Master the art of the Russian appetizer table — the essential companion to any vodka tasting or celebration.",
    content: `In Russian dining culture, zakuski are not mere appetizers — they are an essential ritual that transforms drinking into a social art form.

## What Are Zakuski?

Zakuski is the collective term for a spread of appetizers served before or alongside the main meal, particularly when vodka is being served. The tradition dates back to the elaborate banquets of the Russian aristocracy.

## Essential Components

### The Bread
- Dark rye bread — the foundation of any zakuski table
- White bread for lighter accompaniments

### Pickled Items
- Pickled cucumbers and tomatoes
- Marinated mushrooms
- Pickled garlic and onions

### Fish
- Smoked salmon or trout
- Pickled herring with onions
- Sprats on dark bread

### Caviar
- Red caviar on blini with sour cream
- Caviar butter on toast points

### Salads
- Olivier salad (Russian potato salad)
- Vinegret (beet, potato, and pickle salad)
- Mimosa salad (layered fish and egg salad)

### Cold Meats
- Doctor's kolbasa sliced thin
- Salo (cured fatback) with garlic
- Smoked sausages

## The Art of Pairing

The key principle: zakuski should complement and enhance the vodka, not overpower it. Rich, fatty items like salo and butter balance the spirit's heat, while pickled items cleanse the palate.

## Presentation

Arrange everything on a communal table. Use vintage serving dishes if possible. The table should look abundant — generosity is fundamental to Russian hospitality.`,
    date: "2026-02-05",
    author: "Dmitri Volkov",
    category: "Food Guide",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
  },
  {
    slug: "slavic-new-year-traditions",
    title: "New Year's Eve, the Slavic Way",
    excerpt: "Explore the beloved traditions, dishes, and rituals that make Eastern European New Year celebrations truly magical.",
    content: `For many Slavic families, New Year's Eve is the most important celebration of the year — even more so than Christmas.

## The Traditions

### The Soviet Legacy
When religious holidays were discouraged during the Soviet era, New Year's Eve absorbed many Christmas traditions. Ded Moroz (Grandfather Frost) delivers presents, and a decorated New Year's tree takes center stage.

### The Presidential Address
At 11:55 PM, the entire nation watches the President's televised address. When the Kremlin bells strike midnight, champagne corks pop across the country.

### Making a Wish
A beloved tradition: write your wish on a piece of paper, burn it, drop the ashes into a glass of champagne, and drink it before the clock finishes striking twelve.

## The Feast

### Olivier Salad
No New Year's table is complete without this iconic potato salad with peas, pickles, eggs, and bologna.

### Herring Under a Fur Coat
Layers of herring, potato, carrot, egg, and beet dressed with mayonnaise — a visual and culinary masterpiece.

### Mandarin Oranges
The scent of mandarins is synonymous with New Year in Russia, a tradition dating back to when citrus fruits were a rare winter luxury.

### Champagne
Soviet Champagne remains the traditional choice, though tastes have expanded in recent years.

## Celebrating with ГАСТРОНОМ

We stock everything you need for an authentic Slavic New Year celebration — from Olivier salad ingredients to Soviet-style champagne and festive chocolates.`,
    date: "2026-01-15",
    author: "Marina Sokolova",
    category: "Traditions",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800&q=80",
  },
];
