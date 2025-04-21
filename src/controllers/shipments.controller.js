import config from '../config/config.js';

const obtenerDistancia = async (origen, destino) => {
    const API_KEY = config.googleApiKey;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origen)}&destinations=${encodeURIComponent(destino)}&key=${API_KEY}`;
  
    const response = await fetch(url);
    const data = await response.json();
  
    if (data.rows[0]?.elements[0]?.status === "OK") {
      const distanciaKm = data.rows[0].elements[0].distance.value / 1000;
      return distanciaKm;
    }
  
    throw new Error("No se pudo calcular la distancia.");
};

const calculateShipments = async (req, res) => {

    const { direccionCliente, pesoKg } = req.body;

    try {
        const resultados = await Promise.all(
        sucursales.map(async (sucursal) => {
            const distanciaKm = await obtenerDistancia(sucursal.direccion, direccionCliente);
            return {
            ...sucursal,
            distanciaKm,
            precioEnvio: calcularPrecio(distanciaKm, pesoKg)
            };
        })
        );

        const masCercana = resultados.sort((a, b) => a.distanciaKm - b.distanciaKm)[0];
        res.json(masCercana);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}

function calcularPrecio(distanciaKm, pesoKg) {
    const base = 500; // base por envío
    const precioPorKm = 20;
    const precioPorKg = 150;
    return Math.round(base + distanciaKm * precioPorKm + pesoKg * precioPorKg);
  }

export {
    calculateShipments
}