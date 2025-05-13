//
// FITjs
//

import { CRC } from './crc.js';
import { fileHeader } from './file-header.js';
import { recordHeader } from './record-header.js';
import { fieldDefinition } from './field-definition.js';
import { definitionRecord } from './definition-record.js';
import { dataRecord } from './data-record.js';
import { profiles } from './profiles/profiles.js';
import { fitRecord, FITjs } from './fitjs.js';

import { localActivity } from './local-activity.js';
import { localCourse } from './local-course.js';

function FIT(args = {}) {

    return {
        fileHeader,
        recordHeader,
        definitionRecord,
        dataRecord,
        fieldDefinition,
        CRC,
        profiles,
        fitRecord,
        FITjs,

        // remove those from the general library
        localActivity,
        localCourse,
    };
}

const fit = FIT();

export {
    FIT,
    fit,
};

