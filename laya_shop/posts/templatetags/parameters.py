from django.template.defaulttags import register


@register.filter
def parameters(key, value):
    return {
        'brand': {
            'label': 'Marca',
            'type': 'string'
        },
        'color': {
            'label': 'Color',
            'type': 'listmulti'
        },
        'material': {
            'label': 'Material',
            'type': 'string'
        },
        'model': {
            'label': 'Modelo',
            'type': 'string'
        },
        'recipient': {
            'label': 'Recipiente',
            'type': 'setlistmulti',
        },
        'cloth_size': {
            'label': 'Talla',
            'type': 'listmulti',
        },
        'dimension': {
            'label': 'Dimensiones',
            'type': 'dualmeasure',
        },
        'length': {
            'label': 'Longitud',
            'type': 'measure',
        },
        'weight': {
            'label': 'Peso',
            'type': 'measure',
        },
        'volume': {
            'label': 'Volumen',
            'type': 'measure',
        },
        'style': {
            'label': 'Estilo',
            'type': 'string'
        },
        'allergy_warning': {
            'label': 'Advertencia alergénica',
            'type': 'warning'
        },
        'chemical_warning': {
            'label': 'Advertencia Química',
            'type': 'warning'
        },
        'flavor': {
            'label': 'Sabor',
            'type': 'listmulti',
        },
        'screen_size': {
            'label': 'Tamaño de pantalla',
            'type': 'dualmeasure',
        },
        'battery_size': {
            'label': 'Capacidad de bateria',
            'type': 'measure',
        },
        'battery_type': {
            'label': 'Tipo de bateria',
            'type': 'string'
        }
    }[key][value]
