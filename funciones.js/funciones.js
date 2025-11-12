// Practica de JavaScript - Funciones y Asincronismo
// Ejercicios implementados

// 1) Suma de números únicos
function sumUnique(nums) {
    // Creo un array para guardar los numeros unicos
    var numerosUnicos = [];
    
    // Recorro el array que me pasaron
    for (var i = 0; i < nums.length; i++) {
        var elemento = nums[i];
        
        // Verifico si es un numero valido
        if (Number.isFinite(elemento)) {
            // Verifico si ya esta en mi array de unicos
            var yaExiste = false;
            for (var j = 0; j < numerosUnicos.length; j++) {
                if (numerosUnicos[j] === elemento) {
                    yaExiste = true;
                    break;
                }
            }
            
            // Si no existe, lo agrego
            if (!yaExiste) {
                numerosUnicos.push(elemento);
            }
        }
    }
    
    // Sumo todos los numeros unicos
    var suma = 0;
    for (var k = 0; k < numerosUnicos.length; k++) {
        suma = suma + numerosUnicos[k];
    }
    
    return suma;
}

// 2) Seleccionar propiedades
function pick(obj, keys) {
    // Creo un nuevo objeto vacio
    var nuevoObjeto = {};
    
    // Recorro el array de keys que me pasaron
    for (var i = 0; i < keys.length; i++) {
        var clave = keys[i];
        
        // Verifico si la clave existe en el objeto original
        if (obj.hasOwnProperty(clave)) {
            // Copio la propiedad al nuevo objeto
            nuevoObjeto[clave] = obj[clave];
        }
    }
    
    return nuevoObjeto;
}

// 3) Agrupar por clave o función
function groupBy(list, keyOrFn) {
    // Creo un objeto vacio para guardar los grupos
    var grupos = {};
    
    // Recorro todos los elementos de la lista
    for (var i = 0; i < list.length; i++) {
        var elemento = list[i];
        var claveGrupo;
        
        // Verifico si keyOrFn es una funcion o un string
        if (typeof keyOrFn === 'function') {
            // Si es funcion, la llamo con el elemento
            claveGrupo = keyOrFn(elemento);
        } else {
            // Si es string, uso la propiedad del objeto
            claveGrupo = elemento[keyOrFn];
        }
        
        // Convierto la clave a string por si acaso
        var claveString = String(claveGrupo);
        
        // Si el grupo no existe, lo creo como array vacio
        if (!grupos.hasOwnProperty(claveString)) {
            grupos[claveString] = [];
        }
        
        // Agrego el elemento al grupo correspondiente
        grupos[claveString].push(elemento);
    }
    
    return grupos;
}

// 4) Ordenar por múltiples campos
function sortByMany(list, specs) {
    // Primero copio el array para no modificar el original
    var copia = [];
    for (var i = 0; i < list.length; i++) {
        copia.push(list[i]);
    }
    
    // Ordeno usando sort
    copia.sort(function(a, b) {
        // Recorro todas las especificaciones de ordenamiento
        for (var j = 0; j < specs.length; j++) {
            var spec = specs[j];
            var valorA = a[spec.key];
            var valorB = b[spec.key];
            
            // Comparo los valores
            var resultado;
            if (valorA < valorB) {
                resultado = -1;
            } else if (valorA > valorB) {
                resultado = 1;
            } else {
                resultado = 0;
            }
            
            // Si la direccion es descendente, invierto el resultado
            if (spec.dir === 'desc') {
                resultado = -resultado;
            }
            
            // Si hay diferencia, retorno el resultado
            if (resultado !== 0) {
                return resultado;
            }
        }
        
        // Si todos los campos son iguales, retorno 0
        return 0;
    });
    
    return copia;
}

// 5) deepEqual (objetos/arrays simples)
function deepEqual(a, b) {
    // Si son exactamente iguales (primitivos), retorno true
    if (a === b) {
        return true;
    }
    
    // Si alguno es null o no son del mismo tipo, retorno false
    if (a === null || b === null) {
        return a === b;
    }
    
    if (typeof a !== typeof b) {
        return false;
    }
    
    // Si son arrays
    if (Array.isArray(a) && Array.isArray(b)) {
        // Verifico que tengan la misma longitud
        if (a.length !== b.length) {
            return false;
        }
        
        // Comparo cada elemento recursivamente
        for (var i = 0; i < a.length; i++) {
            if (!deepEqual(a[i], b[i])) {
                return false;
            }
        }
        return true;
    }
    
    // Si son objetos
    if (typeof a === 'object' && typeof b === 'object') {
        // Obtengo las claves de ambos objetos
        var clavesA = Object.keys(a);
        var clavesB = Object.keys(b);
        
        // Verifico que tengan la misma cantidad de claves
        if (clavesA.length !== clavesB.length) {
            return false;
        }
        
        // Verifico que todas las claves de A esten en B
        for (var j = 0; j < clavesA.length; j++) {
            var clave = clavesA[j];
            if (!clavesB.includes(clave)) {
                return false;
            }
            
            // Comparo los valores recursivamente
            if (!deepEqual(a[clave], b[clave])) {
                return false;
            }
        }
        
        return true;
    }
    
    // Si no es ninguno de los casos anteriores, son diferentes
    return false;
}

// 6) Validador de paréntesis
function isBalanced(s) {
    // Creo un array que usare como pila (stack)
    var pila = [];
    
    // Recorro cada caracter del string
    for (var i = 0; i < s.length; i++) {
        var caracter = s[i];
        
        // Si es un caracter de apertura, lo agrego a la pila
        if (caracter === '(' || caracter === '[' || caracter === '{') {
            pila.push(caracter);
        }
        // Si es un caracter de cierre
        else if (caracter === ')' || caracter === ']' || caracter === '}') {
            // Si la pila esta vacia, no hay balance
            if (pila.length === 0) {
                return false;
            }
            
            // Saco el ultimo elemento de la pila
            var ultimo = pila.pop();
            
            // Verifico que coincida con el caracter de cierre
            if (caracter === ')' && ultimo !== '(') {
                return false;
            }
            if (caracter === ']' && ultimo !== '[') {
                return false;
            }
            if (caracter === '}' && ultimo !== '{') {
                return false;
            }
        }
    }
    
    // Si la pila esta vacia al final, esta balanceado
    return pila.length === 0;
}

// 7) Frecuencia de palabras
function wordFreq(text) {
    // Creo un Map para guardar las frecuencias
    var frecuencia = new Map();
    
    // Primero limpio el texto: quito puntuacion y paso a minusculas
    var textoLimpio = text.toLowerCase();
    
    // Reemplazo los signos de puntuacion por espacios
    var signos = [',', '.', ':', ';', '!', '?'];
    for (var i = 0; i < signos.length; i++) {
        var signo = signos[i];
        textoLimpio = textoLimpio.split(signo).join(' ');
    }
    
    // Divido el texto en palabras
    var palabras = textoLimpio.split(/\s+/);
    
    // Recorro cada palabra
    for (var j = 0; j < palabras.length; j++) {
        var palabra = palabras[j].trim();
        
        // Si la palabra no esta vacia
        if (palabra.length > 0) {
            // Si ya existe en el Map, incremento su contador
            if (frecuencia.has(palabra)) {
                var contadorActual = frecuencia.get(palabra);
                frecuencia.set(palabra, contadorActual + 1);
            } else {
                // Si no existe, la agrego con contador 1
                frecuencia.set(palabra, 1);
            }
        }
    }
    
    return frecuencia;
}

// 9) Debounce
function debounce(fn, delay) {
    // Variable para guardar el timer
    var timerId = null;
    
    // Retorno una nueva funcion
    return function() {
        // Guardo los argumentos que recibio esta funcion
        var args = arguments;
        var contexto = this;
        
        // Si ya habia un timer, lo cancelo
        if (timerId !== null) {
            clearTimeout(timerId);
        }
        
        // Creo un nuevo timer
        timerId = setTimeout(function() {
            // Cuando pase el delay, ejecuto la funcion original
            fn.apply(contexto, args);
        }, delay);
    };
}

// 10) Asincronismo: withTimeout + allSettledLite
function withTimeout(promise, ms) {
    // Creo una nueva promesa
    return new Promise(function(resolve, reject) {
        // Creo un timer que rechaza si pasa el tiempo
        var timer = setTimeout(function() {
            reject(new Error('Timeout'));
        }, ms);
        
        // Cuando la promesa original se resuelve o rechaza
        promise.then(function(valor) {
            // Cancelo el timer
            clearTimeout(timer);
            // Resuelvo con el valor
            resolve(valor);
        }).catch(function(razon) {
            // Cancelo el timer
            clearTimeout(timer);
            // Rechazo con la razon
            reject(razon);
        });
    });
}

function allSettledLite(promises) {
    // Creo un array para guardar los resultados
    var resultados = [];
    var completadas = 0;
    var total = promises.length;
    
    // Si no hay promesas, retorno array vacio
    if (total === 0) {
        return Promise.resolve([]);
    }
    
    // Retorno una nueva promesa
    return new Promise(function(resolve) {
        // Recorro todas las promesas
        for (var i = 0; i < promises.length; i++) {
            // Uso una funcion autoinvocada para capturar el indice
            (function(indice) {
                var promesa = promises[indice];
                
                // Cuando la promesa se resuelve
                promesa.then(function(valor) {
                    resultados[indice] = {
                        status: 'fulfilled',
                        value: valor
                    };
                    completadas++;
                    
                    // Si todas estan completas, resuelvo
                    if (completadas === total) {
                        resolve(resultados);
                    }
                }).catch(function(razon) {
                    resultados[indice] = {
                        status: 'rejected',
                        reason: razon
                    };
                    completadas++;
                    
                    // Si todas estan completas, resuelvo
                    if (completadas === total) {
                        resolve(resultados);
                    }
                });
            })(i);
        }
    });
}

