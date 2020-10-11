const unit = {
    length: ['pulgadas', 'yardas', 'pies', 'metros', 'centímetros', 'milímetros'],
    weight: ['libras', 'onzas', 'kilogramos', 'gramos'],
    volume: ['litros', 'mililitros', 'onzas', 'tazas'],
    battery: ['miliamperios', 'amperios']
}

const options = {
    brand: {
        label: 'Marca',
        type: 'string'
    },
    color: {
        label: 'Color',
        type: 'listmulti'
    },
    material: {
        label: 'Material',
        type: 'string'
    },
    model: {
        label: 'Modelo',
        type: 'string'
    },
    recipient: {
        label: 'Recipiente',
        type: 'setlistmulti',
        option: ['Adultos','Adolescentes', 'Niños', 'Bebes']
    },
    cloth_size: {
        label: 'Talla',
        type: 'listmulti',
    },
    dimension: {
        label: 'Dimensiones',
        type: 'dualmeasure',
        unit: unit.length
    },
    length: {
        label: 'Longitud',
        type: 'measure',
        unit: unit.length
    },
    weight: {
        label: 'Peso',
        type: 'measure',
        unit: unit.weight
    },
    volume: {
        label: 'Volumen',
        type: 'measure',
        unit: unit.volume
    },
    style: {
        label: 'Estilo',
        type: 'string'
    },
    allergy_warning: {
        label: 'Advertencia alergénica',
        type: 'warning'
    },
    chemical_warning: {
        label: 'Advertencia Química',
        type: 'warning'
    },
    flavor: {
        label: 'Sabor',
        type: 'listmulti',
    },
    screen_size: {
        label: 'Tamaño de pantalla',
        type: 'dualmeasure',
        unit: unit.length
    },
    battery_size: {
        label: 'Capacidad de bateria',
        type: 'measure',
        unit: unit.battery
    },
    battery_type: {
        label: 'Tipo de bateria',
        type: 'string'
    }
}

export default options
