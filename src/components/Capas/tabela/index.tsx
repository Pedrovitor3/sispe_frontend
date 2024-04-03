import React from 'react';
import { Table } from 'antd';
import { urlsServices } from '../../../configs/urlsConfig';

require('./index.css');

export default function Tabela({ documents, unidadeBloco }: any) {
  const url = urlsServices.SENDFILE;
  //gera a posicao dos documentos
  const documentsWithPosition = documents.map((doc: any, index: number) => ({
    ...doc,
    position: index + 1,
  }));

  const columns = [
    {
      title: 'n°',
      dataIndex: 'position',
      key: 'position',
      width: '5%',
      render: (position: number) => <span>{position}</span>,
    },
    {
      title: `${documents[0].camada?.sigla}`,
      dataIndex: 'name',
      key: 'name',
      width: '35%',
      render: (name: string, record: any) => {
        console.log('record', record);
        if (record.arquivo) {
          return (
            <a
              href={`${url}loadArquivo?id=${record.arquivo}`}
              //link para abrir portaria
              //href={`https://filews.ssp.go.gov.br/loadArquivo?id=${record.arquivo}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <p>{name}</p>
            </a>
          );
        } else {
          return <p>{name}</p>;
        }
      },
    },
    {
      title: 'Tipo',
      dataIndex: 'typeDocuments',
      key: 'typeDocuments',
      width: '10%',
      render: (typeDocuments: { sigla: any }) =>
        typeDocuments ? typeDocuments.sigla : null,
    },
    {
      title: 'Data',
      dataIndex: 'data',
      key: 'data',
      width: '10%',
    },
    {
      title: 'Assunto',
      dataIndex: 'assunto',
      key: 'assunto',
      width: '40%',
    },
  ];

  return (
    <>
      <div className="table-container">
        <h2 className="unidade">{unidadeBloco}</h2>
        <Table
          columns={columns}
          dataSource={documentsWithPosition}
          pagination={false}
          className="custom-table"
        />
      </div>
    </>
  );
}
