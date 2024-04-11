import {
  Button,
  Card,
  Dropdown,
  List,
  Popconfirm,
  Popover,
  Space,
  message,
} from 'antd';
import { useEffect, useState } from 'react';
import {
  deletePerspectiva,
  getPerspectiva,
} from '../../hooks/services/axios/perspectivaService';
import { getObjetivo } from '../../hooks/services/axios/objetivoService';
import ModalPerspectiva from '../../components/Modal/ModalPerspectiva';
import { EditOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons';
require('../index.css');

interface PerspectivaData {
  id: string;
  name: string;
}

interface ObjetivoData {
  id: string;
  name: string;
  perspectiva: PerspectivaData;
}

type Props = {
  setChave: (id: string) => void;
  onObjetivoChange: (boletim: any) => void;
};

export default function Board({ setChave, onObjetivoChange }: Props) {
  const [perspectivas, setPerspectiva] = useState<PerspectivaData[]>([]);
  const [recordPerspectiva, setRecordPerspectiva] = useState<any>({});

  const [objetivos, setObjetivo] = useState<ObjetivoData[]>([]);
  const [showPerspectivaModal, setShowPerspectivaModal] =
    useState<boolean>(false);

  useEffect(() => {
    loadingPerspectiva();
  }, []);

  const hideModal = () => {
    setShowPerspectivaModal(false);
    setRecordPerspectiva(null);
  };
  const handleObjetivoClick = (objetivo: ObjetivoData) => {
    setChave('3');
    onObjetivoChange(objetivo.id);
  };

  const handleOpenPerspectivaModal = () => {
    setShowPerspectivaModal(true);
  };

  const updatePerspectiva = (perspectivas: any) => {
    setPerspectiva(prevPers => [...prevPers, perspectivas]);
    loadingPerspectiva();
  };

  const loadingPerspectiva = async () => {
    const response = await getPerspectiva('perspectiva');
    if (response) {
      const perspectiva = response.data;
      const sortedPerspectiva = perspectiva.sort((a: any, b: any) => {
        return parseInt(a.position, 10) - parseInt(b.position, 10);
      });
      setPerspectiva(sortedPerspectiva);
      // Carrega os objetivos após o carregamento das perspectivas
      loadingObjetivo(perspectiva);
    }
  };

  const loadingObjetivo = async (perspectivas: PerspectivaData[]) => {
    const response = await getObjetivo('objetivo');
    if (response) {
      const objetivo = response.data;
      setObjetivo(objetivo);
    }
  };

  const clickDeletePerspectiva = async (record: PerspectivaData) => {
    await deletePerspectiva(record.id);
    updatePerspectiva(record);
    message.warning('Perspectiva excluida');
  };

  const handleMenuClick = (e: any) => {
    if (e.key === '1') {
      setShowPerspectivaModal(true);
    }
  };

  const renderMenu = (record: PerspectivaData) => {
    return (
      <Space size="middle">
        <Dropdown
          menu={{
            items: [
              {
                label: 'Alterar',
                key: '1',
                onClick: () => {
                  setRecordPerspectiva(record);
                },
              },
              {
                label: (
                  <Popconfirm
                    title="Tem certeza de que deseja desabilitar este registro?"
                    onConfirm={() => clickDeletePerspectiva(record)}
                  >
                    Excluir
                  </Popconfirm>
                ),
                key: '2',
                danger: true,
              },
            ],
            onClick: handleMenuClick,
          }}
        >
          <a onClick={e => e.preventDefault()} className="option">
            <Space>
              <EditOutlined />
            </Space>
          </a>
        </Dropdown>
      </Space>
    );
  };

  return (
    <>
      <Button
        className="button-criar"
        type="primary"
        onClick={handleOpenPerspectivaModal}
      >
        Nova Perspectiva
      </Button>
      <List
        grid={{
          gutter: 16,
          column: 2,
        }}
        dataSource={perspectivas}
        renderItem={perspectiva => (
          <List.Item>
            <Card
              title={perspectiva.name}
              extra={
                <>
                  <span className="icon-wrapper">
                    {renderMenu(perspectiva)}
                  </span>

                  <Popover title="Adcionar objetivo">
                    <Button
                      type="text"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        // Função para lidar com a adição
                      }}
                    />
                  </Popover>
                </>
              }
            >
              <ul>
                <a>
                  {objetivos
                    .filter(
                      objetivo => objetivo.perspectiva?.id === perspectiva.id,
                    )
                    .map(objetivo => (
                      <li key={objetivo.name}>
                        <a onClick={() => handleObjetivoClick(objetivo)}>
                          {objetivo.name}
                        </a>
                      </li>
                    ))}
                </a>
              </ul>
            </Card>
          </List.Item>
        )}
      />

      <ModalPerspectiva
        updatedPerspectivaList={updatePerspectiva}
        id={recordPerspectiva?.id}
        openModal={showPerspectivaModal}
        closeModal={hideModal}
      />
    </>
  );
}
