import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';

import styles from "./index.module.scss";


const FilterAutocomplete = ({ options, values, placeholder="Search", onFilterChange }) => {
    const [selected, setSelected] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debounceSearchTerm] = useDebounce(searchTerm, 500);
    const [searching, setSearching] = useState(false);
    const [filtered, setFiltered] = useState(options.sort((a, b) => a.name.localeCompare(b.name)));

    useEffect(() => {
        if (selected === null) {
            if (values.length > 0) {
                const newOptions = options.filter(s => !values.includes(s.id));
                setFiltered(newOptions);
            }
            setSelected([...values]);
        } else {
            search();
        }
    }, [debounceSearchTerm]);



    const search = () => {
        const filtered = options.filter(s => {
            const isMatch = !debounceSearchTerm || s.name.toLowerCase().includes(debounceSearchTerm.toLowerCase());
            const alreadySelected = values.includes(s.id);
            return isMatch && !alreadySelected;
        });

        setFiltered(filtered);
    };

    const select = (itemId) => {
        setSelected([...selected, itemId]);
        onFilterChange({value: itemId}, true);
        setSearching(false);
        setSearchTerm('');
    };

    const remove = (itemId) => {
        setSelected(selected.filter(s => s !== itemId));
        onFilterChange({value: itemId}, false);
    };

    return (
        <div className={styles.wrapper} data-testid="autocomplete-wrapper">
            <div className={styles.searchInput}>
                <input
                    value={searchTerm}
                    onChange={(ev) => setSearchTerm(ev.target.value)}
                    onFocus={() => {setSearching(true);}}
                    onBlur={() => {setTimeout(() => {setSearching(false);}, 200);}}
                    placeholder={placeholder}
                    data-testid="autocomplete-input"
                />
                <i className={`fa fa-search ${styles.focus}`} onClick={() => setSearching(true)} />
            </div>
            {searching &&
                <div className={styles.dropdown} data-testid="autocomplete-dropdown">
                    {filtered.map(item => {
                        return (
                            <div key={item.id} className={styles.item} onClick={() => select(item.id)}>
                                {item.pic && <img className={styles.picture} src={item.pic} />}
                                <span className={styles.name}>{item.name}</span>
                            </div>
                        )
                    })}

                    {filtered.length === 0 &&
                    <div className={styles.noResult}>
                        <span>There is no results for the search</span>
                    </div>
                    }
                </div>
            }
            {selected?.length > 0 &&
                <div className={styles.selected} data-testid="autocomplete-selected">
                    {options.filter(op => selected.includes(op.id)).map(item => {
                        return (
                            <div key={item.id} onClick={() => remove(item.id)} data-testid="autocomplete-selected-button">
                                {item.pic && <img className={styles.picture} src={item.pic} />}
                                <span className={styles.name}>{item.name}</span>
                                <i className="fa fa-close" />
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    )
};

export default FilterAutocomplete;