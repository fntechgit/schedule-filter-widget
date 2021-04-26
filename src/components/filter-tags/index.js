import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import styles from "./index.module.scss";

const FilterTag = ({ option, option: { tag, count, color }, onFilterChange, filtered }) => {

    const [isActive, setIsActive] = useState(null);    

    useEffect(() => {
        if (isActive === null && filtered[0]?.options.find(f => f === option)) {
            setIsActive(true);
        } else if (isActive !== null) {
            isActive ? onFilterChange(option, true) : onFilterChange(option, false);
        }
    }, [isActive]);

    return (
        <button className={`${styles.tagButton} ${isActive ? styles.tagButtonActive : ''}`} onClick={() => setIsActive(!isActive)}>
            <span className={styles.title}>{tag}</span>
                &nbsp;
            <span className={styles.quantity}>({count})</span>
        </button>
    )
}

export default FilterTag;