import { Col, Form, Input, Modal, Row, message } from 'antd';
import { useEffect, useState } from 'react';

import '../index.css';
import {
  getAcao,
  postAcao,
  updateAcao,
} from '../../../hooks/services/axios/acaoService';

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
      width={800}
    >
      <Form layout="vertical" form={form}>
        <Row gutter={30}>
          <Col offset={1} span={15}>
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
          <Col span={6}>
            <Form.Item
              name="ano"
              label="Ano"
              rules={[
                {
                  required: true,
                  message: 'Por favor, insira uma data',
                },
                {
                  pattern: /^(19|20)\d{2}$/,
                  message: 'Por favor, insira um ano válido (exemplo: 2024)',
                },
              ]}
            >
              <Input maxLength={4} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={30}>
          <Col offset={1} span={15}>
            <Form.Item
              name="status"
              label="Status"
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
          <Col span={6}>
            <Form.Item
              name="percentualExecutado"
              label="Percentual Executado"
              rules={[
                {
                  required: true,
                  message: 'Por favor, insira uma porcentagem válida',
                },
              ]}
            >
              <Input type="number" max={100} min={0} maxLength={3} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={30}>
          <Col offset={1} span={15}>
            <Form.Item
              name="justificativa"
              label="Justificativa"
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
          <Col span={6}>
            <Form.Item
              name="observacao"
              label="Observação"
              rules={[
                {
                  required: true,
                  message: 'Por favor, insira uma data',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={30}>
          <Col offset={1} span={15}>
            <Form.Item
              name="departamentoResponsavel"
              label="Departamento Responsavel"
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
          <Col span={6}>
            <Form.Item
              name="entraves"
              label="Entravess"
              rules={[
                {
                  required: true,
                  message: 'Por favor, insira uma data',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item initialValue={metaId} hidden />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ModalAcao;
