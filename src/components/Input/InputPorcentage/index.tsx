// PercentageInput.tsx

import React from 'react';
import { Input } from 'antd';

type PercentageInputProps = {
  value?: number | string;
  onChange?: (value: string) => void;
};

const PercentageInput = ({ value, onChange }: PercentageInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    // Remover zeros à esquerda, exceto se for "0"
    inputValue = inputValue.replace(/^0+/, '');
    // Se o valor for vazio, setar como "0"
    if (inputValue === '') inputValue = '0';
    // Se o valor for maior que 100, limitar para 100
    if (parseInt(inputValue) > 100) inputValue = '100';
    // Se o valor for menor que 0, limitar para 0
    if (parseInt(inputValue) < 0) inputValue = '0';

    onChange && onChange(inputValue);
  };

  return (
    <Input
      type="number"
      value={value}
      onChange={handleChange}
      max={100}
      min={0}
      addonAfter="%"
      maxLength={5} // Incluindo o símbolo de porcentagem
    />
  );
};

export default PercentageInput;
