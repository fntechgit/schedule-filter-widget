# schedule-filter-widget
React component for the schedule filter widget


## Schedule Filter config      

   **title**            = widget title, defaults to "Filter by"
   
   **summit**           = the summit object
   
   **events**           = the collection of events currently rendered
   
   **marketingData**    = object with the settings from the marketing API
    
   **colorSource**      = source of color, could be one of : event_type, track, track_group 
   
   **filters**          = object with the desired filters to render and its values. 
   
   
   Example:
   ```
   [
     date: {label: "Date", values: [], enabled: true},
     level: {label: "Level", values: ["Beginner", "Intermediate"], enabled: false}
   ]
   ```
   
   **triggerAction**    = method that will take an ACTION and a payload as params and will return a promise.
   Example: `{action: 'UPDATE_FILTER', payload: {type, values}}`
   
## PUBLISH TO NPM:

1 - npm version patch / npm version minor / npm version major

2 - npm run publish-package

## IMPORT:

import ScheduleFilterWidget from 'schedule-filter-widget/dist';

import 'schedule-filter-widget/dist/index.css';