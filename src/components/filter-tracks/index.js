import React from 'react';
import FilterCheckbox from "../filter-checkbox";
import {FilterTypes} from "../../constants";
import FilterGroupCheckbox from "../filter-group-checkbox";

const TracksFilter = ({ options, colorSource, onFilterChange, values }) => {
  const sortedOptions = options.filter(op => !op.parent_id).sort((a, b) => a.order - b.order);
  
  return sortedOptions.map(
    (op, index) => {
      if (op.childs.length > 0) {
        return (
          <FilterGroupCheckbox
            key={`op-${FilterTypes.Track}-${index}`}
            option={op}
            applyColors={FilterTypes.Track === colorSource}
            values={values}
            onFilterChange={onFilterChange}
          />
        );
      } else {
        return (
          <FilterCheckbox
            key={`op-${FilterTypes.Track}-${index}`}
            option={op}
            selected={values?.find(v => v === op.value)}
            applyColors={FilterTypes.Track === colorSource}
            onFilterChange={onFilterChange}
          />
        );
      }
    }
  );
};

export default TracksFilter;