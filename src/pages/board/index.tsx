import { Button, Card, List } from 'antd';
import { useEffect, useState } from 'react';
import { getPerspectiva } from '../../hooks/services/axios/perspectivaService';
import { getObjetivo } from '../../hooks/services/axios/objetivoService';
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

  useEffect(() => {
    loadingPerspectiva();
  }, []);

  const loadingPerspectiva = async () => {
    const response = await getPerspectiva('perspectiva');
    if (response) {
      const perspectiva = response.data;
      setPerspectiva(perspectiva);
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

  const handleObjetivoClick = (objetivo: ObjetivoData) => {
    setChave('3');
    onObjetivoChange(objetivo.id);
  };

  return (
    <>
      <List
        grid={{
          gutter: 16,
          column: 2,
        }}
        dataSource={perspectivas}
        renderItem={perspectiva => (
          <List.Item>
            <Card title={perspectiva.name}>
              <ul>
                <a>
                  {objetivos
                    .filter(
                      objetivo => objetivo.perspectiva.id === perspectiva.id,
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
    </>
  );
}
