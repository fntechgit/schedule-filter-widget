# schedule-filter-widget
React component for the schedule filter widget


## Schedule Filter config      

   **title**            = widget title, defaults to "Filter by"
   
   **summit**           = the summit object
   
   **events**           = the collection of events currently rendered
   
   **marketingData**    = object with the settings from the marketing API
   
   **filters**          = object with the desired filters to render and its values. 
   
   Example:
   ```
   [
     date: {label: "Date", values: []},
     level: {label: "Level", values: ["Beginner", "Intermediate"]}
     track: {label: "Date", values: [], useColor: true},
   ]
   ```
   
   **triggerAction**    = method that will take an ACTION and a payload as params and will return a promise.
   Example: `{action: 'UPDATE_FILTER', payload: {type, options}}`


#### Notes:
   * types ***track***, ***track_groups*** and ***event_types*** must include property ***useColors*** to define if checkmarks should be colored
   

   
## PUBLISH TO NPM:

1 - npm version patch / npm version minor / npm version major

2 - npm run publish-package

## IMPORT:

import ScheduleFilterWidget from 'schedule-filter-widget/dist';

import 'schedule-filter-widget/dist/index.css';