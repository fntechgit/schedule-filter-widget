# schedule-filter-widget
React component for the schedule filter widget


## Schedule Filter config      

   **title**            = widget title
   
   **onRef**            = method to retrieve schedule component ref. Usage -> {ref => (this.child = ref)}

   **filtersData**      = array with the desired filters to render. 
   
   Example
   
   ```
   [{"filterType":"date", "is_enabled":true, "label":"Date", options:[{"value":"2021-04-21", "label":"Wednesday, April 21", "start_time":1618988400, "end_time":1619074799}]}]
   ```

   #### NOTES:

   * options on filters must have a value or id and a label

   * according to the specification, the filterTypes ***track***, ***track_groups*** and ***event_types*** have a property called ***useColors*** to defying which filter should applied colors on the checkmarks


   **filteredData**     = array with the filtered options marked. 
   
   Example
   ```
   [{filterType: 'date', options: [{"value":"2021-04-21", "label":"Wednesday, April 21", "start_time":1618988400, "end_time":1619074799}]}]
   ```
   
   **filterCallback**   = method passed that will be called by component on update. args -> `{action: 'ADD_FILTER', data: {filterType, option}}`

   **marketingData**    = object with the settings from the marketing API      

   
## PUBLISH TO NPM:

1 - npm version patch / npm version minor / npm version major

2 - npm run publish-package

## IMPORT:

import ScheduleFilterWidget from 'schedule-filter-widget';

import 'schedule-filter-widget/index.css';

## DEBUG:
You can pass this hash on url to override current time, time must be in this format and on summit timezone

\#now=2020-06-03,10:59:50