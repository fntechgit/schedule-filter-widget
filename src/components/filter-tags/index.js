import React from 'react';

import styles from "./index.module.scss";

const FilterTag = ({ option, selected, onFilterChange }) => {
    const buttonClass = `${styles.tagButton} ${selected ? styles.active : ''}`;

    return (
        <button className={buttonClass} onClick={() => onFilterChange(option, !selected)} data-testid="tag-button">
            <span className={styles.title} data-testid="tag-title">{option.name}</span>
                &nbsp;
            <span className={styles.quantity} data-testid="tag-count">({option.count})</span>
        </button>
    )
};

export default FilterTag;