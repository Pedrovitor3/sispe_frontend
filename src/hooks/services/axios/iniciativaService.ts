import { getConfig } from '../../../configs/sistemaConfig';
import { APISISPE } from './baseService/baseService';
import { message } from 'antd';

interface Iniciativa {
  inputName: any;
}

export async function getIniciativa(url: any) {
  try {
    const response = await APISISPE.get(url, getConfig('priv'));
    return response;
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível carregar os iniciativa, tente novamente mais tarde.',
      );
    } else {
      console.error(
        `Um erro inesperado aconteceu ao tentar pegar a lista de boletins.${error}`,
      );
    }
  }
  return false;
}

export async function postIniciativa(iniciativa: Iniciativa) {
  try {
    await APISISPE.post('/iniciativa', iniciativa, getConfig('priv'));
    message.success('cadastrado com sucesso');
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

export const updateIniciativa = async (iniciativa: Iniciativa, id: any) => {
  try {
    await APISISPE.put(`iniciativa/${id}`, iniciativa, getConfig('priv'));
    message.success('Editado com sucesso');
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível editar os iniciativa, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error occurred while retrieving the iniciativa list.${error}`,
    );
  }
};

export async function deleteIniciativa(id: any) {
  try {
    await APISISPE.delete(`iniciativa/${id}`, getConfig('priv'));
  } catch (error) {
    if (error === 500) {
      message.info('O tempo da sua sessão expirou, faça o login novamente');
    } else if (error !== 401) {
      message.error(
        'Não foi possível deletar os iniciativa, tente novamente mais tarde.',
      );
    }
    console.error(
      `An unexpected error occurred while retrieving the iniciativa list .${error}`,
    );
  }
}
