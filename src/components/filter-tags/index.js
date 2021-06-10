import React from 'react';

import styles from "./index.module.scss";

const FilterTag = ({ option, filtered, onFilterChange }) => {
    const buttonClass = `${styles.tagButton} ${filtered ? styles.tagButtonActive : ''}`;

    return (
        <button className={buttonClass} onClick={() => onFilterChange(option, !filtered)} data-testid="tag-button">
            <span className={styles.title} data-testid="tag-title">{option.name}</span>
                &nbsp;
            <span className={styles.quantity} data-testid="tag-count">({option.count})</span>
        </button>
    )
};

export default FilterTag;