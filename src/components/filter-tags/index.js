import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import styles from "./index.module.scss";

const FilterTag = ({ option, option: { tag, count }, filtered, onFilterChange }) => {

    return (
        <button className={`${styles.tagButton} ${filtered ? styles.tagButtonActive : ''}`} onClick={() => onFilterChange(option, !filtered)} data-testid="tag-button">
            <span className={styles.title} data-testid="tag-title">{tag}</span>
                &nbsp;
            <span className={styles.quantity} data-testid="tag-count">({count})</span>
        </button>
    )
}

export default FilterTag;