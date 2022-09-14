require('dotenv').config();

const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./helpers/models/busquedas");


const main = async() => {
    const busquedas = new Busquedas();
    let opt;
    
    do {
        opt = await inquirerMenu();
        
        switch (opt) {
            case 1:
                //Mostrar mensaje
                const termino = await leerInput('Ciudad: ');

                //Buscar los lugares
                const lugares = await busquedas.ciudad(termino)

                //Seleccionar el lugar
                const id = await listarLugares(lugares);
                if ( id === '0') continue;
                 
                const {nombre, lat, lng} = lugares.find( l => l.id === id);
                
                //Guardar en DB
                busquedas.agregarHistorial (nombre)

                //Clima
                const clima = await busquedas.climaLugar(lat, lng);
                const {desc, min, max, temp} = clima;

                //Mostrar resultados

                //console.clear();
                console.log('\nInformacion del lugar\n'.green)
                console.log('Ciudad:', nombre.green)
                console.log('Lat:', lat)
                console.log('Lng: ', lng)
                console.log('Clima: ', desc.green)
                console.log('Temperatura', temp)
                console.log('Minima: ', min)
                console.log('Maxima: ', max)
            break;
            
            case 2:
                //busquedas.historial.forEach( (lugar, i) => {
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${ i + 1 }`.green
                    console.log(`${idx} ${lugar}`)
                })
                break;
            default:
                break;
        }

        if(opt !== 0) await pausa();
    } while (opt !== 0);
    console.clear()
}

main();