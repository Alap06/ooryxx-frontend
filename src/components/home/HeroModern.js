import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    ShoppingBagIcon,
    SparklesIcon,
    PlayIcon,
    ArrowRightIcon,
    StarIcon,
    TrophyIcon,
    UserGroupIcon
} from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import smartphoneImg from '../../data/images/Hero/smartphone.png';
import watchImg from '../../data/images/Hero/watch.png';
import shoeImg from '../../data/images/Hero/shoe.png';
import controllerImg from '../../data/images/Hero/controller.png';

const HeroModern = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        setMousePosition({
            x: (clientX - centerX) / 50,
            y: (clientY - centerY) / 50
        });
    };

    return (
        <section
            className="relative min-h-[100svh] w-full overflow-hidden bg-neutral-900 flex items-center"
            onMouseMove={handleMouseMove}
        >
            {/* 1. Background Mesh Gradient (Animated) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[30%] sm:-top-[20%] -left-[20%] sm:-left-[10%] w-[100vw] sm:w-[80vw] h-[100vw] sm:h-[80vw] rounded-full bg-gradient-to-br from-accent-500/20 to-transparent blur-[80px] sm:blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        x: [0, 100, 0],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute top-[30%] sm:top-[20%] -right-[20%] sm:-right-[10%] w-[80vw] sm:w-[60vw] h-[80vw] sm:h-[60vw] rounded-full bg-gradient-to-bl from-primary-900/40 to-transparent blur-[80px] sm:blur-[100px]"
                />
                <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-32 bg-gradient-to-t from-neutral-900 to-transparent z-10" />
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 mix-blend-overlay"></div>

            <div className="container mx-auto px-4 sm:px-6 relative z-20 pt-16 sm:pt-20 pb-8 sm:pb-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

                    {/* 2. Hero Text Section */}
                    <div className="space-y-5 sm:space-y-6 lg:space-y-8 text-center lg:text-left">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500"></span>
                            </span>
                            <span className="text-xs sm:text-sm font-medium text-accent-100/90 tracking-wide uppercase">
                                Nouvelle Collection 2024
                            </span>
                        </motion.div>

                        {/* Main Title with Mask Reveal */}
                        <div className="overflow-hidden">
                            <motion.h1
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[1.1] tracking-tight"
                            >
                                Livraison <br className="hidden sm:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-600 relative inline-block">
                                    Gratuite
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ delay: 0.8, duration: 0.8 }}
                                        className="absolute bottom-1 sm:bottom-2 left-0 w-full h-0.5 sm:h-1 bg-accent-500/50 rounded-full origin-left"
                                    />
                                    <div className="absolute inset-0 bg-accent-400/20 blur-2xl -z-10" />
                                </span>
                            </motion.h1>
                        </div>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-base sm:text-lg md:text-xl text-neutral-400 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light"
                        >
                            Profitez d'une expérience shopping <span className="text-white font-medium">premium</span> partout en Tunisie.
                            <span className="hidden sm:inline"> Technologie, Mode et Maison livrés chez vous.</span>
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
                        >
                            <Link to="/products" className="w-full sm:w-auto">
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="w-full sm:w-auto group relative px-6 sm:px-8 py-3 sm:py-4 bg-white text-neutral-900 rounded-full font-bold text-base sm:text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-all duration-300 overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        Commander maintenant
                                        <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-accent-400 to-accent-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                                </motion.button>
                            </Link>
                            <Link to="/categories" className="w-full sm:w-auto lg:hidden">
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full font-bold text-base sm:text-lg hover:bg-white/20 transition-all duration-300"
                                >
                                    Explorer les catégories
                                </motion.button>
                            </Link>
                        </motion.div>

                        {/* Glass Stats Cards */}
                        <div className="pt-6 sm:pt-8 flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 lg:gap-6">
                            {[
                                { number: "10K+", label: "Produits", icon: ShoppingBagIcon },
                                { number: "24h", label: "Livraison", icon: TrophyIcon },
                                { number: "4.9", label: "Avis", icon: StarIcon, star: true }
                            ].map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 + (idx * 0.1) }}
                                    className="relative group cursor-default"
                                >
                                    <div className="absolute inset-0 bg-white/5 rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative px-4 sm:px-5 lg:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                                            <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">{stat.number}</span>
                                            {stat.star && <StarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-accent-400" />}
                                        </div>
                                        <div className="text-[10px] sm:text-xs font-medium text-neutral-400 uppercase tracking-wider">{stat.label}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* 3. Right 3D Visuals (Simulated with CSS/Images) */}
                    <div className="relative hidden lg:block h-[500px] xl:h-[650px] 2xl:h-[800px] perspective-1000">
                        {/* Orbit Circles */}
                        {[1, 2, 3].map((circle, idx) => (
                            <motion.div
                                key={idx}
                                className="absolute top-1/2 left-1/2 rounded-full border border-white/5"
                                style={{
                                    width: `${300 + idx * 100}px`,
                                    height: `${300 + idx * 100}px`,
                                    x: "-50%",
                                    y: "-50%",
                                    rotateX: 60,
                                    rotateZ: -20,
                                }}
                                animate={{ rotateZ: [0, 360] }}
                                transition={{ duration: 20 + idx * 10, repeat: Infinity, ease: "linear" }}
                            />
                        ))}

                        {/* Central Floating Element (Phone) */}
                        <motion.div
                            style={{
                                x: mousePosition.x * -2,
                                y: mousePosition.y * -2
                            }}
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-[250px] xl:w-[300px] 2xl:w-[350px]"
                        >
                            <div className="relative">
                                {/* Glow behind phone */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 1.2, ease: "easeOut" }}
                                    className="absolute inset-0 bg-accent-500/30 blur-[60px] rounded-full scale-90"
                                />

                                <motion.img
                                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    src={smartphoneImg}
                                    alt="Latest Smartphone"
                                    className="relative z-10 w-full drop-shadow-2xl"
                                />

                                {/* Floating UI Elements on top of phone to simulate "Pop-out" */}
                                <motion.div
                                    animate={{ y: [10, -10, 10] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -right-8 top-20 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl z-20"
                                >
                                    <ShoppingBagIcon className="w-6 h-6 text-white" />
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Floating Satellites (Other Products) */}

                        {/* Watch - Top Right */}
                        <motion.div
                            className="absolute top-[10%] right-[10%] xl:right-[15%] w-20 xl:w-28 2xl:w-32 z-10"
                            animate={{
                                y: [-15, 15, -15],
                                rotate: [0, 10, 0]
                            }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <motion.img
                                initial={{ opacity: 0, scale: 0, x: 50 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.5, ease: "backOut" }}
                                src={watchImg}
                                alt="Smart Watch"
                                className="w-full drop-shadow-lg transform rotate-12"
                            />
                        </motion.div>

                        {/* Shoe - Bottom Left */}
                        <motion.div
                            className="absolute bottom-[15%] left-[0%] xl:left-[5%] w-32 xl:w-40 2xl:w-48 z-30"
                            animate={{
                                y: [20, -20, 20],
                                rotate: [0, -5, 0]
                            }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        >
                            <motion.img
                                initial={{ opacity: 0, scale: 0, x: -50 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.7, ease: "backOut" }}
                                src={shoeImg}
                                alt="Running Shoe"
                                className="w-full drop-shadow-xl transform -rotate-12"
                            />
                        </motion.div>

                        {/* Controller - Bottom Right */}
                        <motion.div
                            className="absolute bottom-[25%] right-[0%] xl:right-[5%] w-28 xl:w-32 2xl:w-40 z-10"
                            animate={{
                                y: [10, -10, 10],
                                rotate: [0, 5, 0]
                            }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        >
                            <motion.img
                                initial={{ opacity: 0, scale: 0, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.9, ease: "backOut" }}
                                src={controllerImg}
                                alt="Game Controller"
                                className="w-full drop-shadow-lg transform rotate-6"
                            />
                        </motion.div>

                        <motion.div
                            className="absolute bottom-[18%] xl:bottom-[20%] left-[5%] xl:left-[10%] p-2 xl:p-3 bg-neutral-900/80 backdrop-blur-xl rounded-lg xl:rounded-xl border border-accent-500/30 z-30 flex items-center gap-2 xl:gap-3 shadow-[0_0_30px_rgba(249,115,22,0.2)]"
                            animate={{
                                y: [10, -10, 10],
                                x: [-5, 5, -5]
                            }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        >
                            <div className="w-1.5 h-1.5 xl:w-2 xl:h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-white text-xs xl:text-sm font-medium">Commande en direct</span>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1.5 sm:gap-2 text-white/30"
                animate={{ y: [0, 10, 0], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em]">Scroll</span>
                <div className="w-[1px] h-8 sm:h-12 bg-gradient-to-b from-white/0 via-white/50 to-white/0" />
            </motion.div>
        </section>
    );
};

export default HeroModern;
