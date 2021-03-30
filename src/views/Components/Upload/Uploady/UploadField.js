import React, { forwardRef, useState } from 'react';
import { useBatchAddListener, useBatchFinishListener } from '@rpldy/uploady';

const MyUploadField = asUploadButton(
  forwardRef(({ onChange, ...props }, ref) => {
    const [text, setText] = useState('Select file');

    useBatchAddListener((batch) => {
      setText(batch.items[0].file.name);
      onChange(batch.items[0].file.name);
    });

    useBatchFinishListener(() => {
      setText('Select file');
      onChange(null);
    });

    return (
      <div {...props} ref={ref} id="form-upload-button">
        {text}
      </div>
    );
  })
);

export default MyUploadField;
