import * as dotenv from "dotenv";
dotenv.config();

import colors from "colors";
import {
  inquirerMenu,
  leerInput,
  listarLugares,
  pausa,
} from "./helpers/inquirer.js";
import { Busquedas } from "./models/busquedas.js";

const main = async () => {
  const busquedas = new Busquedas();
  let opt = "";

  do {
    // esto muestra el menu
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        // mostrar mensajes
        const termino = await leerInput("Ciudad: ");

        // Buscar los lugares
        const lugares = await busquedas.ciudad(termino);

        // seleccionar lugar
        const id = await listarLugares(lugares);
        if (id === "0") continue;

        //Lugar seleccionado
        const lugarSel = lugares.find((l) => l.id === id);

        //Guardar DB
        busquedas.agregrarHistorial(lugarSel.nombre);

        //clima
        const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);

        //mostrar resultados
        console.clear();
        console.log("\nInformacion de la ciudad\n".green);
        console.log("Ciudad:", lugarSel.nombre.green);
        console.log("Latitud:", lugarSel.lat);
        console.log("Longitud:", lugarSel.lng);
        console.log("Temperatura:", clima.temp, "°C");
        console.log("Minima:", clima.min, "°C");
        console.log("Maxima:", clima.max, "°C");
        console.log("El clima se encuentra con:", clima.desc.green);

        break;

      case 2:
        busquedas.historialCapitalizado.forEach((lugar, i) => {
          const idx = `${i + 1}.`.green;
          console.log(`${idx} ${lugar}`);
        });

        break;
    }

    await pausa();
  } while (opt !== 0);
};

main();
