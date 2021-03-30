import React, { useState, useCallback, useMemo, forwardRef } from 'react';
import styled, { css } from 'styled-components';
import Uploady, {
  useBatchAddListener,
  useBatchFinishListener,
  useUploadyContext,
} from '@rpldy/uploady';
import { asUploadButton } from '@rpldy/upload-button';

import './styles.css';

const inputCss = css`
  width: 260px;
  height: 30px;
  line-height: 30px;
  font-size: 22px;
  color: #000;
  border: 1px solid #fff;
  background-color: #f1f1f1;
  margin-bottom: 10px;
  box-sizing: border-box;
  padding: 0 4px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    margin-top: 10px;
    max-width: 200px;
    height: auto;
    max-height: 200px;
  }

  input[type='text'],
  input[type='number'] {
    ${inputCss}
  }
`;

const SubmitButton = styled.button`
  height: 60px;
  width: 260px;
  font-size: 22px;
  margin-top: 20px;
  background-color: #101a2c;
  border: 1px solid #4b5763;
  color: #b0b1b3;
  text-transform: uppercase;
  cursor: pointer;
  margin-bottom: 4px;

  ${({ disabled }) =>
    disabled
      ? `
    cursor: default;
    background-color: #d8d2d2;
    color: #444040
  `
      : ''}
`;

const UploadField = styled.div`
  ${inputCss}

  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  cursor: pointer;
`;

const MyUploadField = asUploadButton(
  // eslint-disable-next-line react/display-name
  forwardRef(
    (
      {
        // eslint-disable-next-line react/prop-types
        onChange,
        ...props
      },
      ref
    ) => {
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
        <UploadField {...props} ref={ref} id="form-upload-button" title={text}>
          {text}
        </UploadField>
      );
    }
  )
);

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
    <Form>
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
      <SubmitButton
        id="form-submit"
        type="button"
        onClick={onSubmit}
        disabled={!fileName}
      >
        Submit Form
      </SubmitButton>
    </Form>
  );
};

export default function UploadyComponent() {
  return (
    <div className="App">
      <Uploady
        clearPendingOnAdd
        destination={{
          url: 'http://localhost:8080/api/business/collections/upload/document',
        }}
        multiple={false}
      >
        <h1>Hello React Uploady</h1>
        <h3>Using a Form with file input and additional fields</h3>

        <MyForm />
      </Uploady>
    </div>
  );
}
