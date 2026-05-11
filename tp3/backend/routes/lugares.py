from flask import Blueprint, request, jsonify
from redis_client import r
import uuid

lugares_bp = Blueprint('lugares', __name__)

# Agregar lugar
@lugares_bp.route('/lugares', methods=['POST'])
def agregar_lugar():
    data = request.json

    nombre = data['nombre']
    lat = float(data['lat'])
    lon = float(data['lon'])
    categoria = data['categoria']

    # generar id único
    id_lugar = str(uuid.uuid4())

    # guardar en GEO
    r.geoadd(categoria, (lon, lat, id_lugar))

    # guardar info en HASH
    r.hset(f"lugar:{id_lugar}", mapping={
        "nombre": nombre,
        "categoria": categoria,
        "lat": lat,
        "lon": lon
    })

    return jsonify({"id": id_lugar, "mensaje": "Lugar agregado"}), 201


# Buscar lugares cercanos 
@lugares_bp.route('/lugares-cercanos', methods=['GET'])
def lugares_cercanos():

    lat = float(request.args.get('lat'))
    lon = float(request.args.get('lon'))
    categoria = request.args.get('categoria')

    ids = r.geosearch(
        categoria,
        longitude=lon,
        latitude=lat,
        radius=5,
        unit='km'
    )

    resultados = []

    for id_lugar in ids:
        data = r.hgetall(f"lugar:{id_lugar}")
        data["id"] = id_lugar
        resultados.append(data)

    return jsonify(resultados)


#Calcular distancia usuario → lugar
@lugares_bp.route('/distancia', methods=['GET'])
def calcular_distancia():

    lat = float(request.args.get('lat'))
    lon = float(request.args.get('lon'))
    id_lugar = request.args.get('id')
    categoria = request.args.get('categoria')

    # agregar usuario temporal
    r.geoadd(categoria, (lon, lat, "usuario_temp"))

    distancia = r.geodist(categoria, "usuario_temp", id_lugar, unit='km')

    # eliminar usuario temporal
    r.zrem(categoria, "usuario_temp")

    return jsonify({"distancia_km": distancia})