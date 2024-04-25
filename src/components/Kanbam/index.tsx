// AndamentoList.js
import { Space } from 'antd';
import './index.css';

type Props = {
  andamentos: any;
  etapas: any;
};

const KanbamList = ({ andamentos, etapas }: Props) => {
  return (
    <div className="body-kanbam">
      {andamentos.length > 0 ? (
        andamentos.map((andamento: any) => (
          <div className="andamento-container" key={andamento.id}>
            <div className="andamento-header">
              <h2 className="andamento-title">{andamento.name}</h2>
            </div>
            <div>
              {etapas
                .filter((etapa: any) => etapa.andamento?.id === andamento.id)
                .map((etapa: any) => (
                  <div className="card-etapa" key={etapa.id}>
                    <Space>
                      <h3 className="card-title">{etapa.name}</h3>
                    </Space>
                  </div>
                ))}
            </div>
          </div>
        ))
      ) : (
        <div>Você não tem nenhum andamento, comece a criar</div>
      )}
    </div>
  );
};

export default KanbamList;
