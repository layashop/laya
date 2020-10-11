const baseData = {
  categories: [
    {
      name: 'Vestimenta',
      id: 1,
      subcategories: [
        {
          name: 'Zapatillas',
          id: 1
        },
        {
          name: 'Camisas',
          id: 2,
        }
      ]
    }
  ],
  sort: [
    {
      value: -1,
      label: 'Relevancia',
    },
    {
      value: 1,
      label: 'Más recientes',
    },
    {
      value: 2,
      label: 'Más antiguos',
    },
    {
      value: 3,
      label: 'Menor precio',
    },
    {
      value: 4,
      label: 'Mayor precio'
    },
  ],
  state: [
    {
      value: -1,
      label: 'Todos'
    },
    {
      value: 1,
      label: 'Nuevo',
    },
    {
      value: 2,
      label: 'Usado',
    },
    {
      value: 3,
      label: 'Hecho por pedido',
    }
  ],
  delivery: [
    {
      value: -1,
      label: 'Todos'
    },
    {
      value: 1,
      label: 'Entrega a domicilio',
    },
    {
      value: 2,
      label: 'Pick-up',
    },
    {
      value: 3,
      label: 'Punto de encuentro',
    }
  ],
  currency: {
    NIO: {
      symbol: 'C$',
      rate: '34.65'
    },
    USD: {
      symbol: '$',
      rate: '1'
    }
  },
  location: [
    {
      value: -1,
      label: 'Todos'
    },
    {
      value: 1,
      label: 'Boaco',
    },
    {
      value: 2,
      label: 'Carazo',
    },
    {
      value: 3,
      label: 'Chinandega',
    },
    {
      value: 4,
      label: 'Chontales',
    },
      {
      value: 5,
      label: 'Costa Caribe Norte',
    },
      {
      value: 6,
      label: 'Costa Caribe Sur',
    },
      {
      value: 7,
      label: 'Estelí',
    },
      {
      value: 8,
      label: 'Granada',
    },
      {
      value: 9,
      label: 'Jinotega',
    },
      {
      value: 10,
      label: 'León',
    },
      {
      value: 11,
      label: 'Madriz',
    },
      {
      value: 12,
      label: 'Managua',
    },
      {
      value: 13,
      label: 'Masaya',
    },
      {
      value: 14,
      label: 'Matagalpa',
    },
      {
      value: 15,
      label: 'Nueva Segovia',
    },
      {
      value: 16,
      label: 'Río San Juan',
    },
      {
      value: 17,
      label: 'Rivas',
    }
  ]
}

export default baseData
