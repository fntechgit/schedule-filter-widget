# schedule-filter-widget
React component for the schedule filter widget


## Schedule Filter config      

   title            = widget title
   
   onRef            = method to retrieve schedule component ref. Usage -> {ref => (this.child = ref)}
   
   updateCallback   = method passed that will be called by component on update. args -> {action: 'ADD_TO_SCHEDULE', event}

   marketingData    = object with the settings from the marketing API
   
   eventCallback    = method that will return a promise with the result of add or remove an event for the user schedule.

   
## PUBLISH TO NPM:

1 - npm version patch / npm version minor / npm version major

2 - npm run publish-package

## IMPORT:

import ScheduleFilterWidget from 'schedule-filter-widget';

import 'schedule-filter-widget/index.css';

## DEBUG:
You can pass this hash on url to override current time, time must be in this format and on summit timezone

\#now=2020-06-03,10:59:50