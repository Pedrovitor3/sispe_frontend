import React from 'react';
import { Input } from 'antd';

type DataType = {
  props: any;
  value: string;
  handlePercentage: (percentage: string) => void;
  disabled?: boolean; // Adicionado a propriedade disabled
};

const PercentageInput = ({
  props,
  value,
  disabled,
  handlePercentage,
}: DataType) => {
  function formatPercentage(input: string): string {
    const onlyNumbers = input.replace(/\D/g, '');

    // Verifica se o valor é um número válido antes de formatar
    if (!isNaN(parseFloat(onlyNumbers))) {
      const number = parseFloat(onlyNumbers) / 100;
      const formattedValue = new Intl.NumberFormat('en-US', {
        style: 'percent',
        maximumFractionDigits: 2,
      }).format(number);

      return formattedValue;
    }

    return ''; // Retorna uma string vazia se o valor não for um número válido
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPercentage(e.target.value);
    handlePercentage(formattedValue);
  };

  const displayValue = value || ''; // Definindo o displayValue como string vazia se for undefined

  return (
    <Input
      {...props}
      value={displayValue}
      onChange={handleChange}
      maxLength={25}
      disabled={disabled}
      style={disabled ? { color: '#aaa', backgroundColor: '#ddd' } : {}}
    />
  );
};

export default PercentageInput;
