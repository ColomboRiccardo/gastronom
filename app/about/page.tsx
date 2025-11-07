"use client";

import * as React from 'react';
import {motion} from 'framer-motion';
import {
    ArrowRight,
    Award,
    Calendar,
    CheckCircle,
    Clock,
    Globe,
    Heart,
    Mail,
    Shield,
    Star,
    Trophy,
    Users
} from 'lucide-react';

type GastronomAboutProps = Record<string, never>;
const values = [{
    id: 'quality',
    icon: Trophy,
    title: 'Uncompromising Quality',
    description: 'Every product undergoes rigorous quality control to ensure only the finest items reach our customers.',
    color: 'from-red-900 to-red-800'
}, {
    id: 'tradition',
    icon: Clock,
    title: 'Time-Honored Tradition',
    description: 'Preserving authentic Russian culinary techniques passed down through generations since 1895.',
    color: 'from-amber-600 to-amber-500'
}, {
    id: 'authenticity',
    icon: Shield,
    title: 'Authentic Sources',
    description: 'Direct partnerships with traditional producers ensuring genuine products from the heart of Russia.',
    color: 'from-gray-700 to-gray-600'
}, {
    id: 'excellence',
    icon: Star,
    title: 'Pursuit of Excellence',
    description: 'Constantly innovating while respecting tradition to deliver an exceptional customer experience.',
    color: 'from-red-800 to-red-700'
}];
const teamMembers = [{
    id: '1',
    name: 'Dmitri Volkov',
    role: 'Master Curator',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    specialty: 'Caviar Selection'
}, {
    id: '2',
    name: 'Svetlana Petrova',
    role: 'Head Sommelier',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    specialty: 'Premium Spirits'
}, {
    id: '3',
    name: 'Igor Sokolov',
    role: 'Culinary Director',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    specialty: 'Traditional Recipes'
}, {
    id: '4',
    name: 'Anastasia Ivanova',
    role: 'Quality Assurance',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    specialty: 'Product Standards'
}];
const timeline = [{
    year: '1895',
    title: 'The Beginning',
    description: 'Founded in Moscow by the Volkov family, establishing a legacy of excellence.'
}, {
    year: '1920',
    title: 'Expansion',
    description: 'Expanded operations to St. Petersburg and began international exports.'
}, {
    year: '1975',
    title: 'Innovation',
    description: 'Pioneered modern preservation techniques while maintaining traditional quality.'
}, {
    year: '2024',
    title: 'Global Presence',
    description: 'Now serving connoisseurs worldwide with our curated collection of Russian delicacies.'
}];
const certifications = [{
    id: '1',
    name: 'ISO 9001',
    description: 'Quality Management',
    icon: CheckCircle
}, {
    id: '2',
    name: 'HACCP Certified',
    description: 'Food Safety',
    icon: Shield
}, {
    id: '3',
    name: 'Organic Certified',
    description: 'Sustainable Sourcing',
    icon: Heart
}, {
    id: '4',
    name: 'Excellence Award',
    description: 'Culinary Heritage',
    icon: Award
}];
export default function GastronomAbout(_props: GastronomAboutProps) {
    const [email, setEmail] = React.useState('');
    const [subscribed, setSubscribed] = React.useState(false);
    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        setSubscribed(true);
        setTimeout(() => {
            setEmail('');
            setSubscribed(false);
        }, 3000);
    };
    return <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-red-50 via-white to-amber-50 overflow-hidden">
            <div className="container mx-auto px-6 py-20 lg:py-28">
                <motion.div initial={{
                    opacity: 0,
                    y: 30
                }} animate={{
                    opacity: 1,
                    y: 0
                }} transition={{
                    duration: 0.8
                }} className="text-center max-w-4xl mx-auto">
                    <div className="inline-block mb-6">
              <span
                  className="px-4 py-1.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-200">
                Established 1895
              </span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-serif mb-6 leading-tight">
                        <span className="text-gray-900">A Legacy of</span>
                        <br/>
                        <span className="text-red-800">Russian Excellence</span>
                    </h1>

                    <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                        For over a century, Gastronom has been the trusted source for authentic
                        Russian delicacies, bringing the finest caviar, vodka, and traditional
                        foods to connoisseurs around the world.
                    </p>
                </motion.div>
            </div>

            {/* Decorative element */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"/>
        </section>

        {/* Our Story Section */}
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
                    <motion.div initial={{
                        opacity: 0,
                        x: -20
                    }} whileInView={{
                        opacity: 1,
                        x: 0
                    }} viewport={{
                        once: true
                    }} transition={{
                        duration: 0.6
                    }}>
                        <div className="inline-block mb-4">
                            <span className="text-sm text-amber-600 font-semibold">Our Story</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-serif text-red-900 mb-6 leading-tight">
                            From Moscow to
                            <br/>
                            the World
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed mb-6">
                            Founded in the heart of Moscow in 1895, Gastronom began as a small family-owned
                            shop dedicated to preserving and sharing Russia's rich culinary traditions.
                            What started as a local merchant's dream has grown into an internationally
                            recognized purveyor of premium Russian delicacies.
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Through revolutions, wars, and changing times, we have remained steadfast in
                            our commitment to quality and authenticity. Today, we continue to honor the
                            Volkov family's original vision while embracing modern techniques to serve
                            customers worldwide.
                        </p>
                    </motion.div>

                    <motion.div initial={{
                        opacity: 0,
                        x: 20
                    }} whileInView={{
                        opacity: 1,
                        x: 0
                    }} viewport={{
                        once: true
                    }} transition={{
                        duration: 0.6
                    }} className="relative h-[500px] rounded-2xl overflow-hidden ring-4 ring-amber-200/50 shadow-2xl">
                        <img src="https://images.unsplash.com/photo-1547587371-b532b5c7e2b5?w=800" alt="Historic Moscow"
                             className="w-full h-full object-cover"/>
                    </motion.div>
                </div>

                {/* Timeline */}
                <div className="max-w-5xl mx-auto">
                    <motion.div initial={{
                        opacity: 0,
                        y: 20
                    }} whileInView={{
                        opacity: 1,
                        y: 0
                    }} viewport={{
                        once: true
                    }} className="text-center mb-12">
                        <h3 className="text-3xl font-serif text-red-900 mb-3">Our Journey</h3>
                        <p className="text-gray-600">Over a century of dedication to excellence</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {timeline.map((item, index) => <motion.div key={item.year} initial={{
                            opacity: 0,
                            y: 20
                        }} whileInView={{
                            opacity: 1,
                            y: 0
                        }} viewport={{
                            once: true
                        }} transition={{
                            delay: index * 0.1
                        }}
                                                                   className="relative p-6 bg-gradient-to-br from-red-50 to-amber-50 rounded-xl border border-amber-200">
                            <div className="flex items-center gap-2 mb-4">
                                <Calendar className="w-5 h-5 text-amber-600"/>
                                <span className="text-2xl font-bold text-red-900">{item.year}</span>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                        </motion.div>)}
                    </div>
                </div>
            </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-red-50/30">
            <div className="container mx-auto px-6">
                <motion.div initial={{
                    opacity: 0,
                    y: 20
                }} whileInView={{
                    opacity: 1,
                    y: 0
                }} viewport={{
                    once: true
                }} className="text-center mb-12">
                    <h3 className="text-4xl font-serif text-red-900 mb-3">Our Values</h3>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        The principles that guide everything we do, from sourcing to delivery
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((value, index) => {
                        const Icon = value.icon;
                        return <motion.div key={value.id} initial={{
                            opacity: 0,
                            y: 20
                        }} whileInView={{
                            opacity: 1,
                            y: 0
                        }} viewport={{
                            once: true
                        }} transition={{
                            delay: index * 0.1
                        }}
                                           className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                            <div
                                className={`w-14 h-14 rounded-lg bg-gradient-to-br ${value.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                <Icon className="w-7 h-7 text-white"/>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
                        </motion.div>;
                    })}
                </div>
            </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <motion.div initial={{
                    opacity: 0,
                    y: 20
                }} whileInView={{
                    opacity: 1,
                    y: 0
                }} viewport={{
                    once: true
                }} className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-amber-600"/>
                        <span className="text-sm text-amber-600 font-semibold">Meet the Team</span>
                    </div>
                    <h3 className="text-4xl font-serif text-red-900 mb-3">Expert Curators</h3>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Our passionate team of experts ensures every product meets our exacting standards
                    </p>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {teamMembers.map((member, index) => <motion.div key={member.id} initial={{
                        opacity: 0,
                        y: 20
                    }} whileInView={{
                        opacity: 1,
                        y: 0
                    }} viewport={{
                        once: true
                    }} transition={{
                        delay: index * 0.1
                    }} className="group text-center">
                        <div
                            className="relative mb-4 mx-auto w-48 h-48 rounded-full overflow-hidden ring-4 ring-amber-200/50 group-hover:ring-amber-400/80 transition-all duration-300">
                            <img src={member.image} alt={member.name}
                                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                        </div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h4>
                        <p className="text-red-800 font-medium mb-2">{member.role}</p>
                        <p className="text-sm text-gray-600">{member.specialty}</p>
                    </motion.div>)}
                </div>
            </div>
        </section>

        {/* Certifications Section */}
        <section className="py-20 bg-gradient-to-br from-amber-50 via-white to-red-50">
            <div className="container mx-auto px-6">
                <motion.div initial={{
                    opacity: 0,
                    y: 20
                }} whileInView={{
                    opacity: 1,
                    y: 0
                }} viewport={{
                    once: true
                }} className="text-center mb-12">
                    <h3 className="text-4xl font-serif text-red-900 mb-3">Certifications & Awards</h3>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Recognized globally for our commitment to quality and excellence
                    </p>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                    {certifications.map((cert, index) => {
                        const Icon = cert.icon;
                        return <motion.div key={cert.id} initial={{
                            opacity: 0,
                            scale: 0.9
                        }} whileInView={{
                            opacity: 1,
                            scale: 1
                        }} viewport={{
                            once: true
                        }} transition={{
                            delay: index * 0.1
                        }}
                                           className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border-2 border-amber-200 text-center">
                            <div
                                className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-4">
                                <Icon className="w-8 h-8 text-white"/>
                            </div>
                            <h4 className="font-bold text-gray-900 mb-1">{cert.name}</h4>
                            <p className="text-sm text-gray-600">{cert.description}</p>
                        </motion.div>;
                    })}
                </div>
            </div>
        </section>

        {/* Heritage & Sourcing Section */}
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div initial={{
                        opacity: 0,
                        x: -20
                    }} whileInView={{
                        opacity: 1,
                        x: 0
                    }} viewport={{
                        once: true
                    }} transition={{
                        duration: 0.6
                    }} className="relative h-[500px] rounded-2xl overflow-hidden ring-4 ring-red-200/50 shadow-2xl">
                        <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800"
                             alt="Russian Landscape" className="w-full h-full object-cover"/>
                    </motion.div>

                    <motion.div initial={{
                        opacity: 0,
                        x: 20
                    }} whileInView={{
                        opacity: 1,
                        x: 0
                    }} viewport={{
                        once: true
                    }} transition={{
                        duration: 0.6
                    }}>
                        <div className="inline-flex items-center gap-2 mb-4">
                            <Globe className="w-5 h-5 text-amber-600"/>
                            <span className="text-sm text-amber-600 font-semibold">Sourcing Excellence</span>
                        </div>
                        <h3 className="text-4xl lg:text-5xl font-serif text-red-900 mb-6 leading-tight">
                            From Source
                            <br/>
                            to Table
                        </h3>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div
                                    className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-red-900 to-red-800 flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-white"/>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Direct Partnerships</h4>
                                    <p className="text-gray-600 leading-relaxed">
                                        We work directly with traditional producers across Russia, ensuring
                                        authenticity and supporting local communities.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div
                                    className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-amber-600 to-amber-500 flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-white"/>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Sustainable Practices</h4>
                                    <p className="text-gray-600 leading-relaxed">
                                        Our caviar is sustainably sourced from certified farms, and our
                                        vegetables are organically grown using traditional methods.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div
                                    className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-white"/>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Quality Assurance</h4>
                                    <p className="text-gray-600 leading-relaxed">
                                        Every product undergoes rigorous testing and tasting by our expert
                                        team before earning the Gastronom seal of approval.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-gradient-to-br from-red-900 to-red-950 text-white">
            <div className="container mx-auto px-6">
                <motion.div initial={{
                    opacity: 0,
                    y: 20
                }} whileInView={{
                    opacity: 1,
                    y: 0
                }} viewport={{
                    once: true
                }} className="max-w-3xl mx-auto text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-500 flex items-center justify-center">
                        <Mail className="w-8 h-8 text-white"/>
                    </div>
                    <h3 className="text-4xl font-serif mb-4">Stay Connected</h3>
                    <p className="text-amber-100 mb-8 text-lg">
                        Subscribe to our newsletter for exclusive offers, new product announcements,
                        and culinary inspiration from Russia.
                    </p>

                    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                               placeholder="Enter your email" required
                               className="flex-1 px-6 py-4 rounded-lg bg-white/10 backdrop-blur-sm border border-amber-300/30 text-white placeholder:text-amber-200/60 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"/>
                        <button type="submit" disabled={subscribed}
                                className="px-8 py-4 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:bg-amber-600 disabled:cursor-not-allowed">
                            {subscribed ? <>
                                <CheckCircle className="w-5 h-5"/>
                                Subscribed!
                            </> : <>
                                Subscribe
                                <ArrowRight className="w-5 h-5"/>
                            </>}
                        </button>
                    </form>
                </motion.div>
            </div>
        </section>

        {/* Footer */}
        <footer className="bg-red-950 text-gray-300 py-12">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h5 className="font-serif text-xl text-amber-400 mb-4">
                            GASTRONOM
                        </h5>
                        <p className="text-sm leading-relaxed">
                            Bringing authentic Russian delicacies to discerning
                            customers since 1895.
                        </p>
                    </div>

                    <div>
                        <h6 className="font-semibold text-amber-400 mb-4">Shop</h6>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="hover:text-amber-300 transition-colors">
                                    Caviar
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-amber-300 transition-colors">
                                    Vodka
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-amber-300 transition-colors">
                                    Pickles
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h6 className="font-semibold text-amber-400 mb-4">Company</h6>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="hover:text-amber-300 transition-colors">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-amber-300 transition-colors">
                                    Contact
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-amber-300 transition-colors">
                                    Shipping
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h6 className="font-semibold text-amber-400 mb-4">Legal</h6>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="hover:text-amber-300 transition-colors">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-amber-300 transition-colors">
                                    Terms of Service
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-red-900 pt-8 text-center text-sm">
                    <p>&copy; 2024 Gastronom. All rights reserved.</p>
                </div>
            </div>
        </footer>
    </div>;
};