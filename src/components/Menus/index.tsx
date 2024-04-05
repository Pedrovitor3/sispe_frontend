import {
  ContainerOutlined,
  DesktopOutlined,
  PaperClipOutlined,
  PartitionOutlined,
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
];
