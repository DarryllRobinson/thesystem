import React, { useState, useCallback, useMemo } from 'react';
import { useUploadyContext } from '@rpldy/uploady';
import MyUploadField from './UploadField';

const MyForm = () => {
  const [fields, setFields] = useState({});
  const [fileName, setFileName] = useState(null);
  const uploadyContext = useUploadyContext();

  const onSubmit = useCallback(() => {
    uploadyContext.processPending({ params: fields });
  }, [fields, uploadyContext]);

  const onFieldChange = useCallback(
    (e) => {
      setFields({
        ...fields,
        [e.currentTarget.id]: e.currentTarget.value,
      });
    },
    [fields, setFields]
  );

  const buttonExtraProps = useMemo(
    () => ({
      onChange: setFileName,
    }),
    [setFileName]
  );

  return (
    <form>
      <MyUploadField autoUpload={false} extraProps={buttonExtraProps} />
      <br />
      <input
        onChange={onFieldChange}
        id="field-name"
        type="text"
        placeholder="your name"
      />
      <br />
      <input
        onChange={onFieldChange}
        id="field-age"
        type="number"
        placeholder="your age"
      />
      <br />
      <button
        id="form-submit"
        type="button"
        onClick={onSubmit}
        disabled={!fileName}
      >
        Submit Form
      </button>
    </form>
  );
};

export default MyForm;
