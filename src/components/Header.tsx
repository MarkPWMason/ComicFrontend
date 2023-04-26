import React from 'react';

import styles from './Header.module.css';

const Header = () => {
  return (
    <div className={styles.headerContainer}>
        <div className={styles.headerTitle}>Marvel API</div>
    </div>
  );
};

export default Header;
