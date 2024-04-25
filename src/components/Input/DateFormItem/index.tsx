// DateFormItem.tsx

import React, { useState } from 'react';
import { Form } from 'antd';
import ReactInputMask from 'react-input-mask';
import moment from 'moment';

type Props = {
  name: string;
  label: string;
  initialValue?: string;
  required?: boolean;
};

const DateFormItem = ({
  name,
  label,
  initialValue,
  required = false,
}: Props) => {
  const [isDateValid, setDateValid] = useState<boolean>(true);

  const validateDate = (value: any) => {
    // Permitindo que o valor seja nulo ou vazio se o campo não for obrigatório
    if (!required && !value) return true;

    const isValid = moment(value, 'DD/MM/YYYY', true).isValid();
    setDateValid(isValid);
    return isValid;
  };

  return (
    <Form.Item
      name={name}
      label={label}
      validateStatus={isDateValid ? undefined : 'error'}
      rules={[
        {
          validator(_, value) {
            // Permitindo que o valor seja nulo ou vazio se o campo não for obrigatório
            if (!required && !value) return Promise.resolve();

            if (!validateDate(value)) {
              return Promise.reject('Insira uma data válida');
            }
            return Promise.resolve();
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
