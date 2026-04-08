from flask import Flask, render_template
from routes.capitulos import capitulos_bp
from threading import Timer
from redis_client import r

app = Flask(__name__)

app.register_blueprint(capitulos_bp, url_prefix='/api/capitulos')

# Verificar reservas expiradas cada 10 segundos
def verificar_expiraciones():
    from routes.capitulos import capitulos
    for cap in capitulos:
        id = cap['id']
        key = f"capitulo:{id}"
        if not r.exists(f"reserva:{id}"):
            estado = r.hget(key, 'estado')
            if estado == 'reservado':
                r.hset(key, 'estado', 'disponible')
        if not r.exists(f"alquiler:{id}"):
            estado = r.hget(key, 'estado')
            if estado == 'alquilado':
                r.hset(key, 'estado', 'disponible')
    Timer(10, verificar_expiraciones).start()

verificar_expiraciones()

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=False, port=5000)