import React, {useEffect, useRef, useState} from 'react';

import styles from "./index.module.scss";

const FilterText = ({ value = "", placeholder, onFilterChange, isNumeric = false }) => {
    const inputRef = useRef();
    const [showClear, setShouldClear] = useState(false);

    const onSearch = term => {
        onFilterChange(term);
    };

    const onKeyUp = (ev) => {
        let value = inputRef.current.value;
        setShouldClear(value !== '');
        if (ev.charCode === 13) {
            onSearch(value);
        }
    };

    const clearInput = () => {
        inputRef.current.value = '';
        onSearch('');
    }

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
                    onKeyUp={onKeyUp}
                />
                <i className={`fa fa-search ${styles.focus}`} onClick={() => onSearch(inputRef.current.value)} />
                { showClear  && <i className={`fa fa-times ${styles.focus}`} onClick={clearInput} />}
            </div>
        </div>
    );
};

export default FilterText;