from flask import Blueprint, jsonify, request
from redis_client import r

capitulos_bp = Blueprint('capitulos', __name__)


capitulos = [
    # T1
    {'id': 'S01E01', 'titulo': 'Capítulo 1: El mandaloriano'},
    {'id': 'S01E02', 'titulo': 'Capítulo 2: El niño'},
    {'id': 'S01E03', 'titulo': 'Capítulo 3: El pecado'},
    {'id': 'S01E04', 'titulo': 'Capítulo 4: Santuario'},
    {'id': 'S01E05', 'titulo': 'Capítulo 5: El pistolero'},
    {'id': 'S01E06', 'titulo': 'Capítulo 6: El prisionero'},
    {'id': 'S01E07', 'titulo': 'Capítulo 7: El ajuste de cuentas'},
    {'id': 'S01E08', 'titulo': 'Capítulo 8: Redención'},
    # T2
    {'id': 'S02E01', 'titulo': 'Capítulo 9: El mariscal'},
    {'id': 'S02E02', 'titulo': 'Capítulo 10: La pasajera'},
    {'id': 'S02E03', 'titulo': 'Capítulo 11: La heredera'},
    {'id': 'S02E04', 'titulo': 'Capítulo 12: El asedio'},
    {'id': 'S02E05', 'titulo': 'Capítulo 13: La Jedi'},
    {'id': 'S02E06', 'titulo': 'Capítulo 14: La tragedia'},
    {'id': 'S02E07', 'titulo': 'Capítulo 15: El creyente'},
    {'id': 'S02E08', 'titulo': 'Capítulo 16: El rescate'},
    # T3
    {'id': 'S03E01', 'titulo': 'Capítulo 17: El apóstata'},
    {'id': 'S03E02', 'titulo': 'Capítulo 18: Las minas de Mandalore'},
    {'id': 'S03E03', 'titulo': 'Capítulo 19: El converso'},
    {'id': 'S03E04', 'titulo': 'Capítulo 20: El huérfano'},
    {'id': 'S03E05', 'titulo': 'Capítulo 21: El pirata'},
    {'id': 'S03E06', 'titulo': 'Capítulo 22: Pistoleros a sueldo'},
    {'id': 'S03E07', 'titulo': 'Capítulo 23: Los espías'},
    {'id': 'S03E08', 'titulo': 'Capítulo 24: El regreso'},
]

def cargar_capitulos():
    for cap in capitulos:
        key = f"capitulo:{cap['id']}"
        if not r.exists(key):
            r.hset(key, mapping={
                'titulo': cap['titulo'],
                'estado': 'disponible'
            })

cargar_capitulos()

# GET /api/capitulos
@capitulos_bp.route('/')
def listar():
    resultado = []
    for cap in capitulos:
        datos = r.hgetall(f"capitulo:{cap['id']}")
        resultado.append({
            'id': cap['id'],
            'titulo': datos.get('titulo'),
            'estado': datos.get('estado')
        })
    return jsonify(resultado)

# POST /api/capitulos/<id>/alquilar
@capitulos_bp.route('/<id>/alquilar', methods=['POST'])
def alquilar(id):
    key = f"capitulo:{id}"
    datos = r.hgetall(key)

    if not datos:
        return jsonify({'error': 'Capítulo no encontrado'}), 404

    if datos['estado'] != 'disponible':
        return jsonify({'error': f"El capítulo está {datos['estado']}"}), 400

    r.hset(key, 'estado', 'reservado')
    r.setex(f"reserva:{id}", 240, '1')

    return jsonify({'mensaje': f"Capítulo {id} reservado por 4 minutos"})

# POST /api/capitulos/<id>/confirmar
@capitulos_bp.route('/<id>/confirmar', methods=['POST'])
def confirmar(id):
    key = f"capitulo:{id}"
    datos = r.hgetall(key)

    if not datos:
        return jsonify({'error': 'Capítulo no encontrado'}), 404

    if datos['estado'] != 'reservado':
        return jsonify({'error': 'El capítulo no está reservado'}), 400

    precio = request.json.get('precio')
    if not precio or float(precio) <= 0:
        return jsonify({'error': 'Precio inválido'}), 400

    r.hset(key, mapping={
        'estado': 'alquilado',
        'precio': str(precio)
    })
    r.setex(f"alquiler:{id}", 86400, '1')

    return jsonify({'mensaje': f"Pago confirmado. {id} alquilado por 24hs"})