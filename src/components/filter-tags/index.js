import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import styles from "./index.module.scss";

const FilterTag = ({ option, option: { tag, count }, onFilterChange }) => {

    const [isActive, setIsActive] = useState(null);

    useEffect(() => {
        if (isActive !== null) {
            isActive ? onFilterChange(option, true) : onFilterChange(option, false);
        }
    }, [isActive]);

    return (
        <button className={`${styles.tagButton} ${isActive ? styles.tagButtonActive : ''}`} onClick={() => setIsActive(!isActive)} data-testid="tag-button">
            <span className={styles.title} data-testid="tag-title">{tag}</span>
                &nbsp;
            <span className={styles.quantity} data-testid="tag-count">({count})</span>
        </button>
    )
}

export default FilterTag;