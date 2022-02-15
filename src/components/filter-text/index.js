import React, {useEffect, useRef} from 'react';

import styles from "./index.module.scss";

const FilterText = ({ value = "", placeholder, onFilterChange, isNumeric = false }) => {
    const inputRef = useRef();

    const onSearch = term => {
        onFilterChange(term);
    };

    const onKeyPress = (ev) => {
        if (ev.charCode === 13) {
            onSearch(inputRef.current.value);
        }
    };


    useEffect(() => {
        inputRef.current.value = value;
        onSearch(value);
    }, [value]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.searchInput}>
                <input
                    ref={inputRef}
                    type={isNumeric? 'number':'text' }
                    placeholder={placeholder}
                    data-testid="autocomplete-input"
                    onKeyPress={onKeyPress}
                />
                <i className={`fa fa-search ${styles.focus}`} onClick={() => onSearch(inputRef.current.value)} />
                {!!value && <i className={`fa fa-times ${styles.focus}`} onClick={() => onSearch('')} />}
            </div>
        </div>
    );
};

export default FilterText;