import React from 'react';
import styles from './Header.module.css';
import Link from 'next/link';

const Header = () => {
    return (
        <header className={styles.header}>
            <Link href="/" className={styles.logo}>
                BimoTech
            </Link>
            <nav className={styles.nav}>
                <Link href="/" className={styles.navLink}>Home</Link>
                <Link href="/products" className={styles.navLink}>Products</Link>
                <Link href="/news" className={styles.navLink}>News</Link>
                <Link href="/careers" className={styles.navLink}>Careers</Link>
                <Link href="/contact" className={styles.navLink}>Contact</Link>
            </nav>
        </header>
    );
};

export default Header;
