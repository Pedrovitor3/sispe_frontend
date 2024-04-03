import { Card, List } from 'antd';
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

export default function Board() {
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
                {objetivos
                  .filter(
                    objetivo => objetivo.perspectiva.id === perspectiva.id,
                  )
                  .map(objetivo => (
                    <li key={objetivo.name}>{objetivo.name}</li>
                  ))}
              </ul>
            </Card>
          </List.Item>
        )}
      />
    </>
  );
}
