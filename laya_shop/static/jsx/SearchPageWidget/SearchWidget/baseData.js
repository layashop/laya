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
  ]
}

export default baseData
