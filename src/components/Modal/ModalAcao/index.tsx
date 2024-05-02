import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  message,
} from 'antd';
import { useEffect, useState } from 'react';

import '../index.css';
import {
  getAcao,
  postAcao,
  updateAcao,
} from '../../../hooks/services/axios/acaoService';

import DateFormItem from '../../Input/DateFormItem';
import PercentageInput from '../../Input/InputPorcentage';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { getResponsavel } from '../../../hooks/services/axios/responsavelService';
import ModalResponsveis from '../ModalResponsaveis';
import { ColumnsType } from 'antd/es/table';
import { set } from 'lodash';

type Props = {
  updatedAcaoList: any;
  id: string;
  metaId: string;
  openModal: boolean;
  closeModal: (refresh: boolean) => void;
};

type ResponsavelData = {
  id: string;
  name: string;
  cargo: string;
  acao: any;
};

const ModalAcao = ({
  updatedAcaoList,
  id,
  metaId,
  closeModal,
  openModal,
}: Props) => {
  const [form] = Form.useForm();

  const [responsaveis, setResponsaveis] = useState<ResponsavelData[]>([]);

  // Adicione um estado para armazenar temporariamente os responsáveis selecionados
  const [tempResponsaveis, setTempResponsaveis] = useState<any[]>([]);

  const [selectResponsavelId, setSelectedResponsavelId] = useState<string>('');

  const [showResponsavelModal, setShowResponsavelModal] =
    useState<boolean>(false);

  const handleOk = (e: any) => {
    e.preventDefault();
    form
      .validateFields()
      .then(() => {
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
    setTempResponsaveis([]);

    loadingAcao();
    loadingResponsaveis();
  }, [openModal]);

  useEffect(() => {
    form.setFieldsValue({ meta: metaId });
  }, [metaId]);

  const loadingAcao = async () => {
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
            responsaveis: acao.responsaveis ? acao.responsaveis.id : null,
          });
          setTempResponsaveis(acao.responsaveis);
        } else {
          message.error('Ocorreu um erro inesperado');
        }
      });
    }
  };

  const loadingResponsaveis = async () => {
    const resData = await getResponsavel('responsavel');
    if (resData) {
      const responsavelData = resData.data;
      setResponsaveis(responsavelData);
    }
  };

  const submitCreate = async () => {
    const editingData = form.getFieldsValue(true);

    editingData.responsaveis = tempResponsaveis;

    await postAcao(editingData);
    updatedAcaoList(editingData);
  };

  const submitUpdate = async () => {
    const editingData = form.getFieldsValue(true);

    editingData.responsaveis = tempResponsaveis;
    await updateAcao(editingData, id);
    updatedAcaoList(editingData);
  };

  const hideModal = (refresh: boolean) => {
    setShowResponsavelModal(false);
  };

  const updateResponsaveisList = (newResp: any) => {
    setResponsaveis(prevResp => [...prevResp, newResp]);
    loadingResponsaveis();
  };

  const handleEnviaResponsaveis = () => {
    const idResp = form.getFieldValue('responsaveis');
    const hasResp = tempResponsaveis.find((resp: any) => {
      return resp?.id === idResp;
    });

    if (!hasResp) {
      const newResp = responsaveis.find((resp: any) => resp?.id === idResp);

      if (newResp) {
        const newObj = {
          id: newResp.id,
          cargo: newResp.cargo,
          name: newResp.name,
        };
        setTempResponsaveis(prevResp => [...prevResp, newObj]);
      }
    }
    form.setFieldsValue({ responsaveis: '' });
  };

  const handleSelectResponsavel = (value: any) => {
    setSelectedResponsavelId(value);
  };

  const handleDeleteResponsavel = async (resp: any) => {
    const newData = [...tempResponsaveis];
    newData.splice(resp, -1);
    setTempResponsaveis(newData);
  };

  const columns: ColumnsType<any> = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
    },
    {
      title: 'Cargo',
      dataIndex: 'cargo',
      key: 'cargo',
    },

    {
      title: 'Ação',
      key: 'operation',
      width: '10%',
      render: (record: any) => {
        return (
          <Space size="middle">
            <Popconfirm
              title="Tem certeza de que deseja excluir?"
              onConfirm={() => handleDeleteResponsavel(record)}
            >
              <DeleteOutlined
                className="icon-delete-phones"
                style={{ color: 'red' }}
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <>
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
                    message: 'Insira um ano válido (exemplo: 2024)',
                  },
                ]}
              >
                <Input maxLength={4} />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                name="percentualExecutado"
                label="Percentual Executado"
                initialValue={0}
              >
                <PercentageInput />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col offset={1} span={12}>
              <Form.Item name="justificativa" label="Justificativa">
                <Input.TextArea autoSize={{ minRows: 2, maxRows: 3 }} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="status" label="Status">
                <Input />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                name="departamentoResponsavel"
                label="Departamento Responsavel"
              >
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
            </Col>
          </Row>
          <Row gutter={30}>
            <Col offset={1} span={5}>
              <Form.Item name="inicioPrevisto" label="Início Previsto">
                <DatePicker.MonthPicker />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="terminoPrevisto" label="Término Previsto">
                <DatePicker.MonthPicker />
              </Form.Item>
            </Col>
            <Col offset={2} span={5}>
              <Form.Item name="inicioReal" label="Início real">
                <DatePicker.MonthPicker />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="terminoReal" label="Término real">
                <DatePicker.MonthPicker />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={0}>
            <Col offset={1} span={2}>
              <Button
                style={{
                  marginTop: '29px',
                }}
                onClick={() => {
                  setShowResponsavelModal(true);
                }}
                title="Adicionar Responsável" // Adicione o tooltip aqui
              >
                <PlusOutlined />
                Novo
              </Button>
            </Col>
            <Col offset={1} span={16}>
              <Form.Item name="responsaveis" label="Responsável">
                <Select
                  showSearch
                  placeholder={'Selecione responsavel'}
                  value={selectResponsavelId}
                  onChange={value => handleSelectResponsavel(value)}
                  filterOption={(input, option) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={responsaveis.map(resp => ({
                    label: resp.name,
                    value: resp.id,
                  }))}
                />
              </Form.Item>
            </Col>

            <Col span={2}>
              <Button
                style={{
                  marginTop: '29px',
                  marginLeft: '25%',
                }}
                onClick={() => {
                  handleEnviaResponsaveis();
                }}
                title="Incluir na ação" // Adicione o tooltip aqui
              >
                <PlusOutlined /> Incluir
              </Button>
            </Col>
          </Row>
          <Table
            columns={columns}
            rowKey="key"
            dataSource={tempResponsaveis}
            rowClassName={() => 'custom-table-row'} // Defina o nome da classe para o estilo personalizado
            className="custom-table"
            pagination={false}
          />

          <Form.Item initialValue={metaId} hidden />
        </Form>
      </Modal>
      <ModalResponsveis
        id={''}
        openModal={showResponsavelModal}
        closeModal={hideModal}
        updateResponsaveisList={updateResponsaveisList}
      />
    </>
  );
};

export default ModalAcao;
