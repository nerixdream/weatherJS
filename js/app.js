(() => {
    //Variables
    const formulario = document.querySelector('#formulario'),
        API = '94405f5b12df9990b54925d13f6f010a'


    document.addEventListener('DOMContentLoaded', () => {
        formulario.addEventListener('submit', validarFormulario)
    })

    class Clima {

        //Obtiene la geolocalización del dispositivo 
        getGeolocalizacion() {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(this.obtenerPosicion)
            } else {
                this.mostrarError('El navegador no soporta Geolocalización');
            }
        }

        obtenerPosicion(position) {
            // console.log(position);
            const { latitude, longitude } = position.coords
            obtenerClima(latitude, longitude)
        }

        //Consulta la api del clima
        async getClima(lat, lon) {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}`

            try {
                const respuesta = await fetch(url)
                const resultado = await respuesta.json()

                obtenerDatos(resultado)
            } catch (error) {
                console.log(error);
                this.mostrarError('Ocurrio un error')
            }
        }

        async getClimaCiudad(ciudad) {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API}`

            try {
                const respuesta = await fetch(url)
                const resultado = await respuesta.json()

                obtenerDatos(resultado)
            } catch (error) {
                console.log(error);
                this.mostrarError('Ciudad no encontrada')
            }

        }

        //Muestra los datos de la respuesta de la api
        mostrarDatos(info) {
            // console.log(info);
            const { name,
                sys: { country },
                main: { temp, temp_max, temp_min },
                clouds: { all }, wind: { speed } } = info;
            const { icon } = info.weather[0];


            this.mostrarCiudad(name, country)
            this.mostrarIcono(icon)
            this.mostrarTemperatura(temp, temp_max, temp_min, all, speed)
        }

        mostrarCiudad(ciudad, pais) {
            const ciudadHTML = document.querySelector('#ciudad')
            ciudadHTML.textContent = `${ciudad}, ${pais}.`
        }

        mostrarIcono(icon) {
            const iconoHTML = document.querySelector('#icono')
            while (iconoHTML.firstChild) {
                iconoHTML.removeChild(iconoHTML.firstChild)
            }
            const img = document.createElement('img')
            img.src = `icons/${icon}.png`
            iconoHTML.appendChild(img)
        }

        mostrarTemperatura(actual, max, min, clouds, wind) {
            // console.log(actual, max, min);
            const temperatura = document.querySelector('#temperatura'),
                maxHTML = document.querySelector('#max'),
                minHTML = document.querySelector('#min'),
                cloudsHTML = document.querySelector('#clouds'),
                windHTML = document.querySelector('#wind');

            const tempActual = convertirAGrados(actual),
                maxActual = convertirAGrados(max),
                minActual = convertirAGrados(min);

            temperatura.textContent = `${tempActual}º`
            maxHTML.textContent = `${maxActual}º`
            minHTML.textContent = `${minActual}º`
            cloudsHTML.textContent = `${clouds}%`
            windHTML.innerHTML = `${wind} <span>m/s</span>`
        }

        mostrarError(msg) {
            const mensaje = document.createElement('div')
            mensaje.classList.add('error')
            mensaje.textContent = msg

            document.querySelector('.main').appendChild(mensaje)

            setTimeout(() => {
                mensaje.remove()
            }, 3000);
        }
    }


    function obtenerClima(lat, lon) {
        clima.getClima(lat, lon)
    }

    function obtenerDatos(datos) {
        clima.mostrarDatos(datos)
    }

    function convertirAGrados(temp) {
        const resultado = temp - 273,
            grados = resultado.toFixed(1);

        if (grados > 10) {
            return parseInt(grados)
        } else {
            return grados
        }
    }

    function validarFormulario(e) {
        e.preventDefault()
        const buscar = document.querySelector('#buscar').value

        if (buscar !== '') {
            clima.getClimaCiudad(buscar)
            formulario.reset()
        } else {
            clima.mostrarError('El campo esta vacío');
        }
    }


    const clima = new Clima()
    clima.getGeolocalizacion()


})()