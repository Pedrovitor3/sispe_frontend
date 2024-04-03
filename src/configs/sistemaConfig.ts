export const sistemaNameSSO = 'SISBGPC';
export const sistemaDescricao = 'Sistema para geração do Boletim Geral';
export const sistemaVersao = '1.0.0-00';
export const domainNameProd = 'sisbg.policiacivil.go.gov.br/';
export const domainNameHomo = 'sisbg-homo.policiacivil.go.gov.br/';

export const domainNameDesv = 'localhost';

export const perfisSistema = {
  ADM: 'ADM',
  ATENDENTE: 'ATENDENTE',
  SUPORTE: 'SUPORTE',
  BASICO: 'BASICO',
  ALL: 'QUALQUER_PERFIL',
};

export const getConfig = (type: string) => {
  const configPub = {
    headers: {
      'Access-Control-Allow-Origin': window.location.origin,
      'Access-Control-Allow-Methods': '*',
      'Content-Type': 'application/json;charset=UTF-8',
    },
  };
  const configPriv = {
    headers: {
      'Access-Control-Allow-Origin': window.location.origin,
      'Access-Control-Allow-Headers': 'Authorization',
      'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTION',
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Bearer ${localStorage.getItem('token_sso')}`,
      Token: localStorage.getItem('token_sso'),
    },
  };

  const configFile = {
    headers: {
      'Access-Control-Allow-Origin': window.location.origin,
      'Access-Control-Allow-Headers': 'Authorization',
      'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTION',
      'Content-Type':
        'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
      Authorization: `Bearer ${localStorage.getItem('token_sso')}`,
      Token: localStorage.getItem('token_sso'),
    },
  };

  if (type === 'priv') {
    return configPriv;
  }

  if (type === 'file') {
    return configFile;
  }

  return configPub;
};
