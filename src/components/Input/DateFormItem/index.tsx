import React, { useState } from 'react';
import { Form, Input, message } from 'antd';
import ReactInputMask from 'react-input-mask';
import moment from 'moment';

type Props = {
  name: string;
  label: string;
  initialValue?: string;
};

const DateFormItem = ({ name, label, initialValue }: Props) => {
  const [isDateValid, setDateValid] = useState<boolean>(true);

  const validateDate = (value: any) => {
    const isValid = moment(value, 'DD/MM/YYYY', true).isValid();
    setDateValid(isValid);
    return isValid;
  };

  return (
    <Form.Item
      name={name}
      label={label}
      validateStatus={isDateValid ? undefined : 'error'}
      help={!isDateValid && 'Por favor, insira uma data válida'}
      initialValue={initialValue}
      rules={[
        {
          validator(_, value) {
            if (!value || validateDate(value)) {
              return Promise.resolve();
            }
            return Promise.reject('Por favor, insira uma data válida');
          },
        },
      ]}
    >
      <ReactInputMask
        className="input-mask-date"
        placeholder="00/00/0000"
        maskChar={null}
        mask="99/99/9999"
      />
    </Form.Item>
  );
};

export default DateFormItem;
