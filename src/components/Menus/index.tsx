import {
  ContainerOutlined,
  ProjectOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { perfisSistema } from '../../configs/sistemaConfig';

export const menus = [
  {
    label: 'Objetivos',
    key: '2',
    icon: <ContainerOutlined />,
    link: '/objetivo',
    perfis: [perfisSistema.ALL],
    children: [],
  },
  {
    label: 'Andamentos',
    key: '5',
    icon: <ProjectOutlined />,
    link: '/',
    perfis: [perfisSistema.ALL],
    children: [],
  },
  {
    label: 'Responsaveis',
    key: '6',
    icon: <UserOutlined />,
    link: '/',
    perfis: [perfisSistema.ALL],
    children: [],
  },
];
