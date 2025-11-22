"use client";

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import styles from './BrandCarousel.module.css';

export interface BrandLogo {
    name: string;
    filename: string;
}

interface BrandCarouselProps {
    brandLogos: BrandLogo[];
}

export default function BrandCarousel({ brandLogos }: BrandCarouselProps) {
    const [isClient, setIsClient] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Intersection Observer to pause animation when out of viewport
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            {
                threshold: 0.1, // Trigger when at least 10% is visible
            }
        );

        if (carouselRef.current) {
            observer.observe(carouselRef.current);
        }

        return () => {
            if (carouselRef.current) {
                observer.unobserve(carouselRef.current);
            }
        };
    }, []);

    // Triple the brands array to create a seamless loop
    const duplicatedBrands = [...brandLogos, ...brandLogos, ...brandLogos];

    if (!isClient) {
        return null;
    }

    return (
        <div
            ref={carouselRef}
            className={`${styles.brandsCarousel} ${!isVisible ? styles.paused : ''}`}
        >
            <div className={styles.carouselTrack}>
                {duplicatedBrands.map((brand, index) => (
                    <div key={`${brand.name}-${index}`} className={styles.brandLogo}>
                        <Image
                            src={`/brands/${brand.filename}`}
                            alt={brand.name}
                            width={180}
                            height={90}
                            style={{
                                objectFit: 'contain',
                                filter: 'brightness(0) invert(1)',
                                opacity: 0.85,
                                transition: 'all 0.3s ease'
                            }}
                            onError={(e) => {
                                console.error(`Failed to load ${brand.filename}`);
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
