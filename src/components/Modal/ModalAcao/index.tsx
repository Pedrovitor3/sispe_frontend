import { Col, Form, Input, Modal, Row, message } from 'antd';
import { useEffect, useState } from 'react';

import '../index.css';
import {
  getAcao,
  postAcao,
  updateAcao,
} from '../../../hooks/services/axios/acaoService';

import DateFormItem from '../../Input/DateFormItem';

type Props = {
  updatedAcaoList: any;
  id: string;
  metaId: string;
  openModal: boolean;
  closeModal: (refresh: boolean) => void;
};

const ModalAcao = ({
  updatedAcaoList,
  id,
  metaId,
  closeModal,
  openModal,
}: Props) => {
  const [form] = Form.useForm();

  console.log('estrategias Id', metaId);

  const handleOk = (e: any) => {
    e.preventDefault();
    form
      .validateFields()
      .then(() => {
        const formData = form.getFieldsValue(true);
        if (id) {
          submitUpdate();
        } else {
          submitCreate();
        }
        form.resetFields();
        closeModal(true);
      })
      .catch(errorInfo => message.error('Erro no preenchimento dos campos'));
  };

  useEffect(() => {
    loadingMeta();
  }, [id && openModal]);

  useEffect(() => {
    form.setFieldsValue({ meta: metaId });
  }, [metaId]);

  const loadingMeta = async () => {
    if (id) {
      await getAcao(`acao/${id}`).then((res: any) => {
        if (res) {
          const acao = res.data;
          form.setFieldsValue({
            id: acao.id,
            name: acao.name,
            ano: acao.ano,
            status: acao.status,
            percentualExecutado: acao.percentualExecutado,
            departamentoResponsavel: acao.departamentoResponsavel,
            justificativa: acao.justificativa,
            observacao: acao.observacao,
            entraves: acao.entraves,

            inicioPrevisto: acao.inicioPrevisto,
            terminoPrevisto: acao.terminoPrevisto,
            inicioReal: acao.inicioReal,
            terminoReal: acao.terminoReal,

            meta: acao.meta ? acao.meta.id : null,
          });
        } else {
          message.error('Ocorreu um erro inesperado');
        }
      });
    }
  };

  const submitCreate = async () => {
    const editingData = form.getFieldsValue(true);
    await postAcao(editingData);

    updatedAcaoList(editingData);
  };

  const submitUpdate = async () => {
    const editingData = form.getFieldsValue(true);

    await updateAcao(editingData, id);
    updatedAcaoList(editingData);
  };

  return (
    <Modal
      visible={openModal}
      title="Ação"
      okText="Salvar"
      onCancel={() => {
        form.resetFields();
        closeModal(true);
      }}
      onOk={handleOk}
      width={900}
    >
      <Form layout="vertical" form={form}>
        <Row gutter={30}>
          <Col offset={1} span={12}>
            <Form.Item
              name="name"
              label="Nome"
              rules={[
                {
                  required: true,
                  message: 'Por favor, insira o nome',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item
              name="ano"
              label="Ano"
              rules={[
                {
                  pattern: /^(19|20)\d{2}$/,
                  message: 'Por favor, insira um ano válido (exemplo: 2024)',
                },
              ]}
            >
              <Input maxLength={4} />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="percentualExecutado" label="Percentual Executado">
              <Input type="number" max={100} min={0} maxLength={3} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={30}>
          <Col offset={1} span={12}>
            <Form.Item name="justificativa" label="Justificativa">
              <Input.TextArea autoSize={{ minRows: 2, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item name="status" label="Status">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={30}>
          <Col offset={1} span={12}>
            <Form.Item name="observacao" label="Observação">
              <Input.TextArea autoSize={{ minRows: 2, maxRows: 3 }} />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item name="entraves" label="Entravess">
              <Input.TextArea autoSize={{ minRows: 2, maxRows: 3 }} />
            </Form.Item>
            <Form.Item initialValue={metaId} hidden />
          </Col>
        </Row>
        <Row gutter={30}>
          <Col offset={1} span={5}>
            <DateFormItem
              name="inicioPrevisto"
              label="Início Previsto"
              initialValue="inicioPrevisto"
            />
          </Col>
          <Col span={5}>
            <DateFormItem
              name="terminoPrevisto"
              label="Término Previsto"
              initialValue="terminoPrevisto"
            />
          </Col>
          <Col offset={2} span={5}>
            <DateFormItem
              name="inicioReal"
              label="Inicio real"
              initialValue="inicioReal"
            />
          </Col>
          <Col span={5}>
            <DateFormItem
              name="terminoReal"
              label="Termino real"
              initialValue="terminoReal"
            />
          </Col>
        </Row>
        <Row gutter={30}>
          <Col offset={1} span={15}>
            <Form.Item
              name="departamentoResponsavel"
              label="Departamento Responsavel"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalAcao;
