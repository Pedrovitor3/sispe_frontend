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
import {
  deleteObjetivo,
  getObjetivo,
} from '../../hooks/services/axios/objetivoService';
import ModalPerspectiva from '../../components/Modal/ModalPerspectiva';
import {
  DownOutlined,
  EditOutlined,
  MoreOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import ModalObjetivo from '../../components/Modal/ModalObjetivo';
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
  const [objetivos, setObjetivo] = useState<ObjetivoData[]>([]);

  const [recordPerspectiva, setRecordPerspectiva] = useState<any>({});
  const [recordObjetivo, setRecordObjetivo] = useState<any>({});

  const [showObjetivoModal, setShowObjetivoModal] = useState<boolean>(false);
  const [showPerspectivaModal, setShowPerspectivaModal] =
    useState<boolean>(false);

  useEffect(() => {
    loadingPerspectiva();
  }, []);

  const hideModal = () => {
    setShowPerspectivaModal(false);
    setShowObjetivoModal(false);

    setRecordPerspectiva(null);
    setRecordObjetivo(null);
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

  const updateObjetivo = (obj: any) => {
    setPerspectiva(prevObj => [...prevObj, obj]);
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
      loadingObjetivo(sortedPerspectiva);
    }
  };

  const loadingObjetivo = async (perspectivaData: PerspectivaData[]) => {
    const response = await getObjetivo('objetivo');
    if (response) {
      const objetivo = response.data;

      const filteredObjetivos = objetivo.filter((obj: ObjetivoData) => {
        return perspectivaData.some(pers => obj.perspectiva?.id === pers.id);
      });

      const sortedObjetivo = filteredObjetivos.sort((a: any, b: any) => {
        return parseInt(a.position, 10) - parseInt(b.position, 10);
      });
      setObjetivo(sortedObjetivo);
    }
  };

  const clickDeletePerspectiva = async (perspectiva: any) => {
    const perspectivaId = perspectiva?.id;
    await deletePerspectiva(perspectivaId);
    const newData = [...perspectivas];
    newData.splice(perspectivaId, -1);
    setPerspectiva(newData);
    loadingPerspectiva();
  };

  const clickDeleteObjetivo = async (objId: any) => {
    await deleteObjetivo(objId);
    const newData = [...objetivos];
    newData.splice(objId, -1);
    setObjetivo(newData);
    loadingPerspectiva();
  };

  const handleMenuClickPerspectiva = (e: any) => {
    if (e.key === '1') {
      setShowPerspectivaModal(true);
    }
    if (e.key === '3') {
      setShowObjetivoModal(true);
    }
  };
  const handleMenuClickObjetivo = (e: any) => {
    if (e.key === '1') {
      setShowObjetivoModal(true);
    }
  };

  const renderMenuPerspectiva = (record: PerspectivaData) => {
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
              {
                label: (
                  <Space style={{ color: ' rgb(0, 21, 42)' }}>
                    <PlusOutlined style={{ color: 'rgb(0, 21, 42)' }} />
                    Objetivo
                  </Space>
                ),
                key: '3',
                onClick: () => {
                  setRecordPerspectiva(record);
                },
              },
            ],
            onClick: handleMenuClickPerspectiva,
          }}
        >
          <a onClick={e => e.preventDefault()} className="option">
            <Space>
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </Space>
    );
  };

  const renderMenuObjetivo = (record: ObjetivoData) => {
    return (
      <Space size="middle">
        <Dropdown
          menu={{
            items: [
              {
                label: 'Alterar',
                key: '1',
                onClick: () => {
                  setRecordObjetivo(record);
                },
              },
              {
                label: (
                  <Popconfirm
                    title="Tem certeza de que deseja desabilitar este registro?"
                    onConfirm={() => clickDeleteObjetivo(record?.id)}
                  >
                    Excluir
                  </Popconfirm>
                ),
                key: '2',
                danger: true,
              },
            ],
            onClick: handleMenuClickObjetivo,
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
              className="container-card"
              title={perspectiva.name}
              extra={
                <>
                  <span className="icon-wrapper-perspectiva">
                    {renderMenuPerspectiva(perspectiva)}
                  </span>
                </>
              }
            >
              <ul>
                <div>
                  {objetivos
                    .filter(
                      objetivo => objetivo.perspectiva?.id === perspectiva.id,
                    )
                    .map(objetivo => (
                      <li key={objetivo.name}>
                        <div className="container-body-card">
                          <a
                            className="objetivo-title"
                            onClick={() => handleObjetivoClick(objetivo)}
                          >
                            {objetivo.name}
                          </a>
                          <span className="icon-wrapper-objetivo">
                            {renderMenuObjetivo(objetivo)}
                          </span>
                        </div>
                      </li>
                    ))}
                </div>
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

      <ModalObjetivo
        updatedObjetivoList={updateObjetivo}
        id={recordObjetivo?.id}
        openModal={showObjetivoModal}
        closeModal={hideModal}
        perspectivaId={recordPerspectiva?.id}
      />
    </>
  );
}
