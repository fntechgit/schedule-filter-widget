import React, { useState } from 'react';
import PropTypes from 'prop-types';

import styles from "./index.module.scss";
import { Button } from 'react-bootstrap';

const FilterTag = ({ title, quantity }) => {

    const [isActive, setIsActive] = useState(false);

    return (
        <button className={`${styles.tagButton} ${isActive ? styles.tagButtonActive : ''}`} onClick={() => setIsActive(!isActive)}>
            <span className={styles.title}>Dark</span>
                &nbsp;
            <span className={styles.quantity}>(130)</span>
        </button>
    )
}

export default FilterTag;