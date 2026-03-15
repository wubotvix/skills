// Spanish Vocabulary Tutor — complete implementation with embedded data
// Usage: node tutor.js <command> [args...]
'use strict';

const core = require('../_lib/core');

const SKILL_NAME = 'spanish-vocabulary';
const MAX_NEW_PER_SESSION = 7;

// ─── Embedded Word Banks by CEFR Level ───────────────────────────────────────

const WORD_BANKS = {
  A1: [
    // Greetings
    { word: 'hola', article: null, category: 'greetings', definition: 'hello',
      exampleSentence: 'Hola, ¿cómo estás?', collocations: ['hola a todos', 'decir hola'], falseFriends: null },
    { word: 'adiós', article: null, category: 'greetings', definition: 'goodbye',
      exampleSentence: 'Adiós, nos vemos mañana.', collocations: ['decir adiós', 'adiós por ahora'], falseFriends: null },
    { word: 'buenos días', article: null, category: 'greetings', definition: 'good morning',
      exampleSentence: 'Buenos días, señora García.', collocations: ['dar los buenos días'], falseFriends: null },
    { word: 'gracias', article: null, category: 'greetings', definition: 'thank you',
      exampleSentence: 'Muchas gracias por tu ayuda.', collocations: ['muchas gracias', 'dar las gracias', 'gracias a Dios'], falseFriends: null },
    // Food
    { word: 'agua', article: 'el', category: 'food', definition: 'water',
      exampleSentence: 'El agua está muy fría.', collocations: ['agua mineral', 'vaso de agua', 'agua con gas'], falseFriends: null },
    { word: 'pan', article: 'el', category: 'food', definition: 'bread',
      exampleSentence: 'Compro el pan en la panadería.', collocations: ['pan con mantequilla', 'pan integral', 'rebanada de pan'], falseFriends: null },
    { word: 'leche', article: 'la', category: 'food', definition: 'milk',
      exampleSentence: 'Tomo la leche con el desayuno.', collocations: ['leche entera', 'leche desnatada', 'café con leche'], falseFriends: null },
    { word: 'manzana', article: 'la', category: 'food', definition: 'apple',
      exampleSentence: 'La manzana roja es muy dulce.', collocations: ['zumo de manzana', 'tarta de manzana'], falseFriends: null },
    // Family
    { word: 'madre', article: 'la', category: 'family', definition: 'mother',
      exampleSentence: 'Mi madre cocina muy bien.', collocations: ['lengua madre', 'madre patria', 'día de la madre'], falseFriends: null },
    { word: 'padre', article: 'el', category: 'family', definition: 'father',
      exampleSentence: 'Mi padre trabaja en un hospital.', collocations: ['padre de familia', 'Santo Padre'], falseFriends: null },
    { word: 'hermano', article: 'el', category: 'family', definition: 'brother',
      exampleSentence: 'Mi hermano mayor se llama Carlos.', collocations: ['hermano menor', 'hermano gemelo'], falseFriends: null },
    { word: 'amigo', article: 'el', category: 'people', definition: 'friend',
      exampleSentence: 'Mi amigo vive cerca de mi casa.', collocations: ['mejor amigo', 'amigo íntimo', 'hacerse amigos'], falseFriends: null },
    // Everyday objects
    { word: 'casa', article: 'la', category: 'everyday', definition: 'house',
      exampleSentence: 'La casa tiene un jardín grande.', collocations: ['ama de casa', 'casa adosada', 'en casa'], falseFriends: null },
    { word: 'libro', article: 'el', category: 'everyday', definition: 'book',
      exampleSentence: 'Leo un libro cada semana.', collocations: ['libro de texto', 'libro de bolsillo'], falseFriends: { en: 'library (which is "biblioteca")' } },
    { word: 'mesa', article: 'la', category: 'everyday', definition: 'table',
      exampleSentence: 'La mesa del comedor es de madera.', collocations: ['poner la mesa', 'mesa redonda', 'mesa de noche'], falseFriends: null },
    { word: 'calle', article: 'la', category: 'everyday', definition: 'street',
      exampleSentence: 'La calle está llena de gente.', collocations: ['calle principal', 'cruzar la calle', 'en la calle'], falseFriends: null },
    // Time / numbers
    { word: 'día', article: 'el', category: 'time', definition: 'day',
      exampleSentence: 'Hoy es un día muy bonito.', collocations: ['todos los días', 'buen día', 'día festivo'], falseFriends: null },
    { word: 'noche', article: 'la', category: 'time', definition: 'night',
      exampleSentence: 'La noche es muy tranquila aquí.', collocations: ['buenas noches', 'por la noche', 'de noche'], falseFriends: null },
    { word: 'hoy', article: null, category: 'time', definition: 'today',
      exampleSentence: 'Hoy vamos al parque.', collocations: ['hoy en día', 'hoy por hoy'], falseFriends: null },
    { word: 'grande', article: null, category: 'adjectives', definition: 'big / large',
      exampleSentence: 'Esta ciudad es muy grande.', collocations: ['a lo grande', 'en grande'], falseFriends: null },
  ],

  A2: [
    // Travel
    { word: 'equipaje', article: 'el', category: 'travel', definition: 'luggage / baggage',
      exampleSentence: 'Mi equipaje pesa demasiado.', collocations: ['equipaje de mano', 'facturar el equipaje', 'recoger el equipaje'], falseFriends: null },
    { word: 'billete', article: 'el', category: 'travel', definition: 'ticket',
      exampleSentence: 'Necesito comprar un billete de tren.', collocations: ['billete de ida', 'billete de ida y vuelta', 'sacar un billete'],
      falseFriends: { en: 'billet (military lodging)' } },
    { word: 'estación', article: 'la', category: 'travel', definition: 'station / season',
      exampleSentence: 'La estación de autobuses está lejos.', collocations: ['estación de tren', 'estación del año'], falseFriends: null },
    { word: 'maleta', article: 'la', category: 'travel', definition: 'suitcase',
      exampleSentence: 'Voy a hacer la maleta esta noche.', collocations: ['hacer la maleta', 'maleta de viaje'], falseFriends: null },
    // Food (expanded)
    { word: 'carne', article: 'la', category: 'food', definition: 'meat',
      exampleSentence: 'La carne de ternera es mi favorita.', collocations: ['carne de res', 'carne picada', 'carne asada'], falseFriends: null },
    { word: 'pescado', article: 'el', category: 'food', definition: 'fish (for eating)',
      exampleSentence: 'El pescado fresco es más sabroso.', collocations: ['pescado a la plancha', 'pescado frito'], falseFriends: null },
    { word: 'cuenta', article: 'la', category: 'food', definition: 'bill / check (at restaurant); account',
      exampleSentence: 'La cuenta, por favor.', collocations: ['pedir la cuenta', 'cuenta bancaria', 'tener en cuenta', 'darse cuenta'],
      falseFriends: { en: 'count (verb is "contar")' } },
    { word: 'propina', article: 'la', category: 'food', definition: 'tip (gratuity)',
      exampleSentence: 'Dejamos una propina generosa.', collocations: ['dejar propina', 'dar propina'], falseFriends: null },
    // Shopping
    { word: 'tienda', article: 'la', category: 'shopping', definition: 'store / shop',
      exampleSentence: 'La tienda cierra a las nueve.', collocations: ['tienda de ropa', 'ir de tiendas', 'tienda en línea'], falseFriends: null },
    { word: 'precio', article: 'el', category: 'shopping', definition: 'price',
      exampleSentence: 'El precio de la fruta ha subido.', collocations: ['buen precio', 'precio fijo', 'a mitad de precio'], falseFriends: null },
    { word: 'dinero', article: 'el', category: 'shopping', definition: 'money',
      exampleSentence: 'No tengo suficiente dinero.', collocations: ['ganar dinero', 'ahorrar dinero', 'dinero en efectivo'], falseFriends: null },
    { word: 'barato', article: null, category: 'shopping', definition: 'cheap / inexpensive',
      exampleSentence: 'Este restaurante es muy barato.', collocations: ['salir barato', 'más barato'], falseFriends: null },
    // Weather
    { word: 'lluvia', article: 'la', category: 'weather', definition: 'rain',
      exampleSentence: 'La lluvia no para desde ayer.', collocations: ['lluvia torrencial', 'día de lluvia', 'bajo la lluvia'], falseFriends: null },
    { word: 'sol', article: 'el', category: 'weather', definition: 'sun',
      exampleSentence: 'Hoy hace mucho sol.', collocations: ['tomar el sol', 'gafas de sol', 'puesta de sol'], falseFriends: null },
    { word: 'frío', article: 'el', category: 'weather', definition: 'cold',
      exampleSentence: 'En invierno hace mucho frío.', collocations: ['hacer frío', 'tener frío', 'frío polar'], falseFriends: null },
    // Body / health
    { word: 'cabeza', article: 'la', category: 'health', definition: 'head',
      exampleSentence: 'Me duele la cabeza.', collocations: ['dolor de cabeza', 'de cabeza', 'perder la cabeza'], falseFriends: null },
    { word: 'médico', article: 'el', category: 'health', definition: 'doctor',
      exampleSentence: 'Tengo cita con el médico mañana.', collocations: ['ir al médico', 'médico de cabecera'], falseFriends: null },
    { word: 'enfermo', article: null, category: 'health', definition: 'sick / ill',
      exampleSentence: 'Mi hijo está enfermo hoy.', collocations: ['caer enfermo', 'ponerse enfermo'], falseFriends: null },
    { word: 'receta', article: 'la', category: 'health', definition: 'prescription; recipe',
      exampleSentence: 'El médico me dio una receta.', collocations: ['receta médica', 'receta de cocina'], falseFriends: null },
    { word: 'dolor', article: 'el', category: 'health', definition: 'pain / ache',
      exampleSentence: 'Tengo un dolor fuerte en la espalda.', collocations: ['dolor de cabeza', 'dolor de estómago', 'aliviar el dolor'], falseFriends: { en: 'dolor (grief/sadness in English lit.)' } },
  ],

  B1: [
    // Work
    { word: 'empresa', article: 'la', category: 'work', definition: 'company / business',
      exampleSentence: 'Trabajo en una empresa de tecnología.', collocations: ['empresa privada', 'montar una empresa', 'empresa familiar'], falseFriends: null },
    { word: 'reunión', article: 'la', category: 'work', definition: 'meeting',
      exampleSentence: 'La reunión empieza a las diez.', collocations: ['tener una reunión', 'sala de reuniones', 'convocar una reunión'], falseFriends: null },
    { word: 'sueldo', article: 'el', category: 'work', definition: 'salary / wages',
      exampleSentence: 'Me van a subir el sueldo este año.', collocations: ['sueldo fijo', 'cobrar el sueldo', 'sueldo mínimo'], falseFriends: null },
    { word: 'jefe', article: 'el', category: 'work', definition: 'boss',
      exampleSentence: 'Mi jefe es muy exigente pero justo.', collocations: ['jefe de departamento', 'jefe de estado'], falseFriends: null },
    { word: 'solicitud', article: 'la', category: 'work', definition: 'application / request',
      exampleSentence: 'Envié mi solicitud de empleo ayer.', collocations: ['solicitud de trabajo', 'rellenar una solicitud', 'presentar una solicitud'], falseFriends: null },
    // Emotions
    { word: 'esperanza', article: 'la', category: 'emotions', definition: 'hope',
      exampleSentence: 'Tengo esperanza de que todo salga bien.', collocations: ['perder la esperanza', 'tener esperanza', 'rayo de esperanza'], falseFriends: null },
    { word: 'orgulloso', article: null, category: 'emotions', definition: 'proud',
      exampleSentence: 'Estoy muy orgulloso de mi hija.', collocations: ['estar orgulloso de', 'sentirse orgulloso'], falseFriends: null },
    { word: 'preocupado', article: null, category: 'emotions', definition: 'worried',
      exampleSentence: 'Estoy preocupado por el examen.', collocations: ['estar preocupado por', 'andar preocupado'], falseFriends: null },
    { word: 'vergüenza', article: 'la', category: 'emotions', definition: 'shame / embarrassment',
      exampleSentence: 'Me da vergüenza hablar en público.', collocations: ['dar vergüenza', 'pasar vergüenza', 'sin vergüenza'],
      falseFriends: { en: 'Not "vengeance" (venganza)' } },
    // False friends cluster
    { word: 'éxito', article: 'el', category: 'abstract', definition: 'success',
      exampleSentence: 'La película fue un gran éxito.', collocations: ['tener éxito', 'éxito rotundo', 'con éxito'],
      falseFriends: { en: '"exit" is "salida" in Spanish' } },
    { word: 'realizar', article: null, category: 'abstract', definition: 'to carry out / accomplish',
      exampleSentence: 'Vamos a realizar el proyecto juntos.', collocations: ['realizar un estudio', 'realizar un sueño', 'realizar cambios'],
      falseFriends: { en: '"to realize" (understand) is "darse cuenta"' } },
    { word: 'actual', article: null, category: 'abstract', definition: 'current / present',
      exampleSentence: 'La situación actual es complicada.', collocations: ['en la actualidad', 'momento actual'],
      falseFriends: { en: '"actual" (real) is "real" or "verdadero"' } },
    { word: 'sensible', article: null, category: 'abstract', definition: 'sensitive',
      exampleSentence: 'Es una persona muy sensible.', collocations: ['ser sensible a', 'tema sensible'],
      falseFriends: { en: '"sensible" (reasonable) is "sensato"' } },
    // Education
    { word: 'asignatura', article: 'la', category: 'education', definition: 'school subject',
      exampleSentence: 'Las matemáticas son mi asignatura favorita.', collocations: ['asignatura pendiente', 'aprobar una asignatura'], falseFriends: null },
    { word: 'apuntes', article: 'los', category: 'education', definition: 'notes (class notes)',
      exampleSentence: 'Tomo apuntes en todas las clases.', collocations: ['tomar apuntes', 'pasar a limpio los apuntes'], falseFriends: null },
    { word: 'beca', article: 'la', category: 'education', definition: 'scholarship / grant',
      exampleSentence: 'Conseguí una beca para estudiar en Madrid.', collocations: ['solicitar una beca', 'beca de estudios', 'becario'], falseFriends: null },
    // Daily life
    { word: 'costumbre', article: 'la', category: 'daily', definition: 'habit / custom',
      exampleSentence: 'Tengo la costumbre de pasear después de cenar.', collocations: ['tener la costumbre de', 'como de costumbre', 'por costumbre'], falseFriends: null },
    { word: 'mudarse', article: null, category: 'daily', definition: 'to move (change residence)',
      exampleSentence: 'Nos mudamos a Barcelona el mes pasado.', collocations: ['mudarse de casa', 'mudarse de ciudad'], falseFriends: null },
    { word: 'alquilar', article: null, category: 'daily', definition: 'to rent',
      exampleSentence: 'Quiero alquilar un piso en el centro.', collocations: ['alquilar un piso', 'alquilar un coche', 'piso de alquiler'], falseFriends: null },
    { word: 'quejarse', article: null, category: 'daily', definition: 'to complain',
      exampleSentence: 'Siempre se queja del ruido.', collocations: ['quejarse de', 'quejarse por'], falseFriends: null },
  ],

  B2: [
    // Work (advanced)
    { word: 'despido', article: 'el', category: 'work', definition: 'dismissal / layoff',
      exampleSentence: 'El despido fue completamente inesperado.', collocations: ['despido improcedente', 'carta de despido', 'despido colectivo'], falseFriends: null },
    { word: 'ascenso', article: 'el', category: 'work', definition: 'promotion (at work)',
      exampleSentence: 'Después de cinco años, consiguió un ascenso.', collocations: ['conseguir un ascenso', 'ascenso laboral'], falseFriends: null },
    { word: 'rendimiento', article: 'el', category: 'work', definition: 'performance / yield',
      exampleSentence: 'El rendimiento del equipo ha mejorado mucho.', collocations: ['alto rendimiento', 'rendimiento académico', 'mejorar el rendimiento'], falseFriends: null },
    { word: 'emprendedor', article: 'el', category: 'work', definition: 'entrepreneur',
      exampleSentence: 'Es un emprendedor con mucha visión.', collocations: ['espíritu emprendedor', 'joven emprendedor'], falseFriends: null },
    // Society / current affairs
    { word: 'desigualdad', article: 'la', category: 'society', definition: 'inequality',
      exampleSentence: 'La desigualdad social sigue siendo un problema.', collocations: ['desigualdad de género', 'brecha de desigualdad', 'luchar contra la desigualdad'], falseFriends: null },
    { word: 'ciudadanía', article: 'la', category: 'society', definition: 'citizenship',
      exampleSentence: 'Solicitó la ciudadanía española.', collocations: ['obtener la ciudadanía', 'doble ciudadanía', 'derechos de ciudadanía'], falseFriends: null },
    { word: 'manifestación', article: 'la', category: 'society', definition: 'demonstration / protest',
      exampleSentence: 'Hubo una manifestación pacífica en la plaza.', collocations: ['convocar una manifestación', 'manifestación multitudinaria'],
      falseFriends: { en: '"manifestation" can work, but Spanish use is more protest-specific' } },
    { word: 'compromiso', article: 'el', category: 'society', definition: 'commitment / compromise',
      exampleSentence: 'El compromiso con el medio ambiente es fundamental.', collocations: ['adquirir un compromiso', 'sin compromiso', 'compromiso social'],
      falseFriends: { en: 'More "commitment" than "compromise" (which is "acuerdo")' } },
    // Abstract / academic
    { word: 'matiz', article: 'el', category: 'abstract', definition: 'nuance / shade',
      exampleSentence: 'Hay un matiz importante en esa frase.', collocations: ['con matices', 'sin matices', 'matiz de significado'], falseFriends: null },
    { word: 'plantear', article: null, category: 'abstract', definition: 'to raise (a question) / to pose',
      exampleSentence: 'Quiero plantear una cuestión importante.', collocations: ['plantear un problema', 'plantear una pregunta', 'plantearse algo'], falseFriends: null },
    { word: 'imprescindible', article: null, category: 'abstract', definition: 'essential / indispensable',
      exampleSentence: 'El diccionario es imprescindible para este curso.', collocations: ['ser imprescindible', 'resultar imprescindible'], falseFriends: null },
    { word: 'aprovechar', article: null, category: 'abstract', definition: 'to take advantage of / make the most of',
      exampleSentence: 'Hay que aprovechar el buen tiempo.', collocations: ['aprovechar la oportunidad', 'aprovechar el tiempo', '¡que aproveche!'], falseFriends: null },
    // False friends (B2)
    { word: 'embarazada', article: null, category: 'health', definition: 'pregnant',
      exampleSentence: 'Mi hermana está embarazada de cinco meses.', collocations: ['estar embarazada', 'quedarse embarazada'],
      falseFriends: { en: '"embarrassed" is "avergonzado/a"' } },
    { word: 'constipado', article: 'el', category: 'health', definition: 'common cold',
      exampleSentence: 'Tengo un constipado terrible.', collocations: ['estar constipado', 'coger un constipado'],
      falseFriends: { en: '"constipated" is "estreñido"' } },
    { word: 'carpeta', article: 'la', category: 'everyday', definition: 'folder / binder',
      exampleSentence: 'Guarda los documentos en la carpeta azul.', collocations: ['carpeta de archivos', 'carpeta de anillas'],
      falseFriends: { en: '"carpet" is "alfombra"' } },
    // Environment
    { word: 'medio ambiente', article: 'el', category: 'environment', definition: 'environment (natural)',
      exampleSentence: 'Debemos proteger el medio ambiente.', collocations: ['proteger el medio ambiente', 'daño al medio ambiente', 'medio ambiente urbano'], falseFriends: null },
    { word: 'sostenible', article: null, category: 'environment', definition: 'sustainable',
      exampleSentence: 'Necesitamos un desarrollo más sostenible.', collocations: ['desarrollo sostenible', 'energía sostenible', 'turismo sostenible'], falseFriends: null },
    { word: 'recurso', article: 'el', category: 'environment', definition: 'resource',
      exampleSentence: 'Los recursos naturales son limitados.', collocations: ['recursos naturales', 'recursos humanos', 'recurso renovable'], falseFriends: null },
    { word: 'huella', article: 'la', category: 'environment', definition: 'footprint / trace',
      exampleSentence: 'Debemos reducir nuestra huella de carbono.', collocations: ['huella de carbono', 'huella ecológica', 'dejar huella'], falseFriends: null },
  ],

  C1: [
    // Academic / formal
    { word: 'ámbito', article: 'el', category: 'academic', definition: 'sphere / field / scope',
      exampleSentence: 'En el ámbito de la investigación, los resultados son prometedores.', collocations: ['en el ámbito de', 'ámbito laboral', 'ámbito académico'], falseFriends: null },
    { word: 'abordar', article: null, category: 'academic', definition: 'to address / to tackle',
      exampleSentence: 'Es necesario abordar este tema con seriedad.', collocations: ['abordar un tema', 'abordar un problema', 'abordar una cuestión'], falseFriends: null },
    { word: 'desempeñar', article: null, category: 'academic', definition: 'to perform / fulfill (a role)',
      exampleSentence: 'Desempeña un papel clave en la empresa.', collocations: ['desempeñar un papel', 'desempeñar un cargo', 'desempeñar funciones'], falseFriends: null },
    { word: 'trasladar', article: null, category: 'academic', definition: 'to transfer / to convey / to move',
      exampleSentence: 'Es difícil trasladar esta idea a otro idioma.', collocations: ['trasladar un mensaje', 'trasladarse de ciudad'], falseFriends: null },
    { word: 'abarcar', article: null, category: 'academic', definition: 'to encompass / cover / span',
      exampleSentence: 'El estudio abarca un período de diez años.', collocations: ['abarcar un tema', 'abarcar mucho', 'quien mucho abarca, poco aprieta'], falseFriends: null },
    // Nuanced connectors
    { word: 'no obstante', article: null, category: 'connectors', definition: 'nevertheless / however',
      exampleSentence: 'El plan es arriesgado; no obstante, merece la pena intentarlo.', collocations: ['no obstante lo anterior'], falseFriends: null },
    { word: 'a pesar de', article: null, category: 'connectors', definition: 'despite / in spite of',
      exampleSentence: 'A pesar de las dificultades, siguió adelante.', collocations: ['a pesar de todo', 'a pesar de que'], falseFriends: null },
    { word: 'en cambio', article: null, category: 'connectors', definition: 'on the other hand / instead',
      exampleSentence: 'Él prefiere el cine; ella, en cambio, prefiere el teatro.', collocations: [], falseFriends: null },
    // Idiomatic / figurative
    { word: 'contar con', article: null, category: 'idiomatic', definition: 'to count on / to have available',
      exampleSentence: 'Puedes contar conmigo para lo que necesites.', collocations: ['contar con alguien', 'contar con recursos'], falseFriends: null },
    { word: 'dar por hecho', article: null, category: 'idiomatic', definition: 'to take for granted',
      exampleSentence: 'No des por hecho que todo saldrá bien.', collocations: ['dar algo por hecho'], falseFriends: null },
    { word: 'hacerse cargo', article: null, category: 'idiomatic', definition: 'to take charge of / to understand',
      exampleSentence: 'Ella se hizo cargo de la situación inmediatamente.', collocations: ['hacerse cargo de algo', 'hacerse cargo de un negocio'], falseFriends: null },
    // Abstract
    { word: 'afán', article: 'el', category: 'abstract', definition: 'eagerness / zeal / desire',
      exampleSentence: 'Su afán de superación es admirable.', collocations: ['afán de superación', 'con afán', 'afán de lucro'], falseFriends: null },
    { word: 'paulatino', article: null, category: 'abstract', definition: 'gradual',
      exampleSentence: 'Se observa un cambio paulatino en las actitudes.', collocations: ['de forma paulatina', 'cambio paulatino', 'descenso paulatino'], falseFriends: null },
    { word: 'desvincular', article: null, category: 'abstract', definition: 'to dissociate / separate',
      exampleSentence: 'Es imposible desvincular la economía de la política.', collocations: ['desvincularse de', 'desvincular algo de algo'], falseFriends: null },
    { word: 'ineludible', article: null, category: 'abstract', definition: 'unavoidable / inescapable',
      exampleSentence: 'La reforma del sistema es una tarea ineludible.', collocations: ['responsabilidad ineludible', 'deber ineludible'], falseFriends: null },
    // Law / formal
    { word: 'tramitar', article: null, category: 'formal', definition: 'to process / handle (paperwork)',
      exampleSentence: 'Necesito tramitar mi permiso de residencia.', collocations: ['tramitar un visado', 'tramitar una solicitud', 'tramitar la documentación'], falseFriends: null },
    { word: 'vigente', article: null, category: 'formal', definition: 'in force / current / valid',
      exampleSentence: 'La ley vigente prohíbe esa práctica.', collocations: ['legislación vigente', 'norma vigente', 'en vigente'], falseFriends: null },
    { word: 'dictaminar', article: null, category: 'formal', definition: 'to rule / to issue a ruling',
      exampleSentence: 'El tribunal dictaminó a favor del demandante.', collocations: ['dictaminar una sentencia', 'dictaminar sobre'], falseFriends: null },
    { word: 'rescindir', article: null, category: 'formal', definition: 'to rescind / cancel (a contract)',
      exampleSentence: 'La empresa decidió rescindir el contrato.', collocations: ['rescindir un contrato', 'rescindir un acuerdo'], falseFriends: null },
  ],

  C2: [
    // Literary / archaic
    { word: 'menester', article: 'el', category: 'literary', definition: 'need / necessity (formal/archaic)',
      exampleSentence: 'Es menester actuar con prudencia.', collocations: ['ser menester', 'haber menester'], falseFriends: null },
    { word: 'acaecer', article: null, category: 'literary', definition: 'to happen / occur (literary)',
      exampleSentence: 'Los hechos que acaecieron aquel verano cambiaron todo.', collocations: ['acaecer un suceso'], falseFriends: null },
    { word: 'deslinde', article: 'el', category: 'literary', definition: 'demarcation / delimitation',
      exampleSentence: 'El deslinde entre ambos conceptos no es claro.', collocations: ['deslinde de responsabilidades', 'deslinde conceptual'], falseFriends: null },
    { word: 'atisbar', article: null, category: 'literary', definition: 'to glimpse / to make out',
      exampleSentence: 'Se puede atisbar un cambio en el horizonte político.', collocations: ['atisbar una solución', 'atisbar el futuro'], falseFriends: null },
    // Colloquial / register mastery
    { word: 'currar', article: null, category: 'colloquial', definition: 'to work (informal, Spain)',
      exampleSentence: 'Llevo todo el día currando sin parar.', collocations: ['currar mucho', 'ir a currar'], falseFriends: null },
    { word: 'molar', article: null, category: 'colloquial', definition: 'to be cool (informal, Spain)',
      exampleSentence: '¡Esa película mola mucho!', collocations: ['molar mucho', 'mola mogollón'], falseFriends: null },
    { word: 'flipar', article: null, category: 'colloquial', definition: 'to be amazed / blown away (informal)',
      exampleSentence: 'Vas a flipar cuando veas el regalo.', collocations: ['flipar en colores', 'estoy flipando'], falseFriends: null },
    // Proverbs / fixed expressions
    { word: 'no dar abasto', article: null, category: 'idiomatic', definition: 'to not be able to cope / keep up',
      exampleSentence: 'Con tantos pedidos, no damos abasto.', collocations: ['no dar abasto con'], falseFriends: null },
    { word: 'a rajatabla', article: null, category: 'idiomatic', definition: 'strictly / to the letter',
      exampleSentence: 'Cumple las normas a rajatabla.', collocations: ['cumplir a rajatabla', 'seguir a rajatabla'], falseFriends: null },
    { word: 'dar en el clavo', article: null, category: 'idiomatic', definition: 'to hit the nail on the head',
      exampleSentence: 'Con ese comentario, diste en el clavo.', collocations: ['dar en el clavo'], falseFriends: null },
    // Nuanced academic
    { word: 'soslayar', article: null, category: 'academic', definition: 'to avoid / sidestep / bypass',
      exampleSentence: 'No podemos soslayar las responsabilidades éticas.', collocations: ['soslayar un problema', 'soslayar una cuestión'], falseFriends: null },
    { word: 'subyacer', article: null, category: 'academic', definition: 'to underlie',
      exampleSentence: 'Las causas que subyacen al conflicto son complejas.', collocations: ['subyacer a algo', 'idea subyacente'], falseFriends: null },
    { word: 'concatenar', article: null, category: 'academic', definition: 'to concatenate / to link together',
      exampleSentence: 'Se concatenaron varios errores que provocaron la crisis.', collocations: ['concatenar ideas', 'concatenar hechos'], falseFriends: null },
    { word: 'dilucidar', article: null, category: 'academic', definition: 'to elucidate / to clarify',
      exampleSentence: 'Intentaron dilucidar las causas del accidente.', collocations: ['dilucidar una cuestión', 'dilucidar un misterio'], falseFriends: null },
    { word: 'esgrimir', article: null, category: 'academic', definition: 'to wield (an argument) / to put forward',
      exampleSentence: 'Esgrimió argumentos muy convincentes.', collocations: ['esgrimir un argumento', 'esgrimir razones'], falseFriends: null },
    // Regional variation awareness
    { word: 'coger', article: null, category: 'regional', definition: 'to take / grab (Spain); vulgar in parts of Latin America',
      exampleSentence: 'Voy a coger el autobús. (Spain)', collocations: ['coger el autobús', 'coger un resfriado'],
      falseFriends: { note: 'In Argentina/Mexico, use "tomar" instead — "coger" is vulgar there' } },
    { word: 'computadora', article: 'la', category: 'regional', definition: 'computer (Latin America)',
      exampleSentence: 'Necesito arreglar la computadora.', collocations: ['computadora portátil'],
      falseFriends: { note: 'In Spain, "ordenador" is used instead' } },
    { word: 'platicar', article: null, category: 'regional', definition: 'to chat (Mexico, Central America)',
      exampleSentence: 'Vamos a platicar un rato.', collocations: ['platicar con alguien'],
      falseFriends: { note: 'In Spain, "charlar" or "hablar" is preferred' } },
    { word: 'pararse', article: null, category: 'regional', definition: 'to stand up (Latin America); to stop (Spain)',
      exampleSentence: 'Se paró del asiento. (LatAm) / El coche se paró. (Spain)', collocations: ['pararse en seco'],
      falseFriends: { note: 'Meaning differs between Spain and Latin America' } },
  ],
};

// ─── Exercise Types ──────────────────────────────────────────────────────────

const EXERCISE_TYPES = ['definition', 'fill-in-blank', 'matching', 'context-guess', 'collocation'];

function makeDefinitionExercise(targetWord, level) {
  const bank = WORD_BANKS[level] || WORD_BANKS.A1;
  const distractors = core.pick(bank.filter(w => w.word !== targetWord.word), 3)
    .map(w => w.definition);
  const options = core.shuffle([targetWord.definition, ...distractors]);
  return {
    type: 'definition',
    prompt: `What does "${targetWord.article ? targetWord.article + ' ' : ''}${targetWord.word}" mean?`,
    options,
    answer: targetWord.definition,
    word: targetWord.word,
  };
}

function makeFillInBlankExercise(targetWord) {
  const sentence = targetWord.exampleSentence;
  // Replace the target word in the sentence with a blank
  const escapedWord = targetWord.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedWord, 'i');
  const blanked = sentence.replace(regex, '________');
  // If no replacement happened, fall back to a simpler version
  if (blanked === sentence) {
    return {
      type: 'fill-in-blank',
      prompt: `Complete the sentence with the correct word:\n"${sentence.replace(targetWord.word, '________')}"`,
      answer: targetWord.word,
      hint: targetWord.definition,
      word: targetWord.word,
    };
  }
  return {
    type: 'fill-in-blank',
    prompt: `Fill in the blank:\n"${blanked}"`,
    answer: targetWord.word,
    hint: targetWord.definition,
    word: targetWord.word,
  };
}

function makeMatchingExercise(level) {
  const bank = WORD_BANKS[level] || WORD_BANKS.A1;
  const items = core.pick(bank, 5);
  const pairs = items.map(w => ({
    word: (w.article ? w.article + ' ' : '') + w.word,
    definition: w.definition,
  }));
  return {
    type: 'matching',
    prompt: 'Match each word with its definition.',
    pairs,
    shuffledDefinitions: core.shuffle(pairs.map(p => p.definition)),
    words: pairs.map(p => p.word),
  };
}

function makeContextGuessExercise(targetWord) {
  return {
    type: 'context-guess',
    prompt: `Read the sentence and guess the meaning of the underlined word:\n"${targetWord.exampleSentence}"\n\nWhat does "${targetWord.word}" mean?`,
    answer: targetWord.definition,
    word: targetWord.word,
    falseFriends: targetWord.falseFriends,
  };
}

function makeCollocationExercise(targetWord, level) {
  if (!targetWord.collocations || targetWord.collocations.length === 0) {
    return makeDefinitionExercise(targetWord, level);
  }
  const correctCollocation = core.pick(targetWord.collocations, 1)[0];
  const bank = WORD_BANKS[level] || WORD_BANKS.A1;
  const otherCollocations = [];
  for (const w of core.shuffle(bank)) {
    if (w.word !== targetWord.word && w.collocations && w.collocations.length) {
      otherCollocations.push(w.collocations[0]);
      if (otherCollocations.length >= 3) break;
    }
  }
  const options = core.shuffle([correctCollocation, ...otherCollocations]);
  return {
    type: 'collocation',
    prompt: `Which is a common collocation with "${targetWord.article ? targetWord.article + ' ' : ''}${targetWord.word}"?`,
    options,
    answer: correctCollocation,
    word: targetWord.word,
  };
}

function generateExercise(targetWord, level, type) {
  switch (type) {
    case 'fill-in-blank': return makeFillInBlankExercise(targetWord);
    case 'matching': return makeMatchingExercise(level);
    case 'context-guess': return makeContextGuessExercise(targetWord);
    case 'collocation': return makeCollocationExercise(targetWord, level);
    default: return makeDefinitionExercise(targetWord, level);
  }
}

// ─── Answer Checking ─────────────────────────────────────────────────────────

function checkAnswer(exercise, userAnswer) {
  const normalise = s => core.norm(s);
  if (exercise.type === 'matching') {
    // For matching, userAnswer should be an array of {word, definition} pairs
    if (!Array.isArray(userAnswer)) return { correct: false, message: 'Provide matched pairs.' };
    const correctCount = userAnswer.filter(ua =>
      exercise.pairs.some(p => normalise(p.word) === normalise(ua.word) && normalise(p.definition) === normalise(ua.definition))
    ).length;
    return {
      correct: correctCount === exercise.pairs.length,
      score: correctCount,
      total: exercise.pairs.length,
      message: correctCount === exercise.pairs.length ? '¡Perfecto!' : `${correctCount}/${exercise.pairs.length} correct.`,
    };
  }

  const expected = normalise(exercise.answer);
  const given = normalise(userAnswer);

  if (given === expected) {
    return { correct: true, message: '¡Correcto! Well done.' };
  }

  // Partial match: check if the answer contains the key word
  if (expected.includes(given) && given.length > 2) {
    return { correct: true, partial: true, message: `Close enough — the full answer is "${exercise.answer}".` };
  }

  return {
    correct: false,
    message: `Not quite. The answer is "${exercise.answer}".`,
    expected: exercise.answer,
  };
}

// ─── VocabularyTutor Class ───────────────────────────────────────────────────

class VocabularyTutor {
  constructor() {
    this.dir = core.dataDir(SKILL_NAME);
    core.ensureDir(this.dir);
  }

  getProfile(studentId) {
    const p = core.loadProfile(this.dir, studentId);
    if (!p.level) p.level = 'A1';
    if (!p.skills) p.skills = {};
    if (!p.sessions) p.sessions = [];
    return p;
  }

  setLevel(studentId, level) {
    level = level.toUpperCase();
    if (!core.CEFR.includes(level)) throw new Error(`Invalid CEFR level: ${level}`);
    const p = this.getProfile(studentId);
    p.level = level;
    core.saveProfile(this.dir, p);
    return { studentId, level };
  }

  generateLesson(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const bank = WORD_BANKS[level];
    if (!bank) throw new Error(`No word bank for level ${level}`);

    // Pick words the student hasn't mastered yet
    const seen = Object.keys(p.skills);
    const unseen = bank.filter(w => !seen.includes(w.word));
    const newWords = core.pick(unseen.length > 0 ? unseen : bank, Math.min(MAX_NEW_PER_SESSION, unseen.length || MAX_NEW_PER_SESSION));

    // Generate one exercise per new word, varying types
    const exercises = newWords.map((w, i) => {
      const type = EXERCISE_TYPES[i % EXERCISE_TYPES.length];
      return generateExercise(w, level, type);
    });

    const session = {
      date: core.today(),
      level,
      newWords: newWords.map(w => ({
        word: w.word,
        article: w.article,
        definition: w.definition,
        exampleSentence: w.exampleSentence,
        collocations: w.collocations,
        falseFriends: w.falseFriends,
        category: w.category,
      })),
      exercises,
    };

    return session;
  }

  generateExercise(studentId, type) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const bank = WORD_BANKS[level];
    if (!bank) throw new Error(`No word bank for level ${level}`);
    const targetWord = core.pick(bank, 1)[0];
    const exType = type && EXERCISE_TYPES.includes(type) ? type : core.pick(EXERCISE_TYPES, 1)[0];
    return generateExercise(targetWord, level, exType);
  }

  checkAnswer(exercise, userAnswer) {
    return checkAnswer(exercise, userAnswer);
  }

  recordAssessment(studentId, word, grade) {
    if (!core.isValidGrade(grade, 1, 4)) throw new Error('Grade must be 1-4 (1=forgot, 2=hard, 3=good, 4=easy)');
    const p = this.getProfile(studentId);

    if (!p.skills[word]) {
      p.skills[word] = {
        word,
        encounters: 0,
        stability: 1,
        difficulty: 5,
        lastReview: null,
        nextReview: null,
        attempts: [],
      };
    }
    const sk = p.skills[word];
    sk.encounters += 1;
    sk.stability = core.fsrsUpdateStability(sk.stability, sk.difficulty, grade);
    sk.difficulty = core.fsrsUpdateDifficulty(sk.difficulty, grade);
    sk.lastReview = core.today();
    sk.nextReview = (() => {
      const days = core.fsrsNextReview(sk.stability, core.DEFAULT_RETENTION);
      const d = new Date();
      d.setDate(d.getDate() + days);
      return d.toISOString().slice(0, 10);
    })();
    sk.attempts.push({ score: grade >= 3 ? 1 : 0, total: 1, date: core.today() });

    p.assessments.push({ word, grade, date: core.today() });
    core.saveProfile(this.dir, p);

    return {
      word,
      grade,
      mastery: core.masteryLabel(core.calcMastery(sk.attempts)),
      nextReview: sk.nextReview,
      encounters: sk.encounters,
    };
  }

  getProgress(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const bankSize = (WORD_BANKS[level] || []).length;
    const words = Object.keys(p.skills);
    const masteryMap = {};
    let masteredCount = 0;
    let totalEncounters = 0;

    for (const w of words) {
      const sk = p.skills[w];
      const m = core.calcMastery(sk.attempts);
      masteryMap[w] = { mastery: m, label: core.masteryLabel(m), encounters: sk.encounters };
      if (m >= core.MASTERY_THRESHOLD) masteredCount++;
      totalEncounters += sk.encounters;
    }

    return {
      studentId,
      level,
      wordsStudied: words.length,
      wordsMastered: masteredCount,
      totalInLevel: bankSize,
      totalEncounters,
      words: masteryMap,
    };
  }

  getNextTopics(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const bank = WORD_BANKS[level] || [];
    const seen = new Set(Object.keys(p.skills));
    const unseen = bank.filter(w => !seen.has(w.word));

    // Group by category
    const categories = {};
    for (const w of unseen) {
      if (!categories[w.category]) categories[w.category] = [];
      categories[w.category].push(w.word);
    }

    return { level, unseenCount: unseen.length, byCategory: categories };
  }

  getReport(studentId) {
    const p = this.getProfile(studentId);
    const progress = this.getProgress(studentId);
    const review = this.getReviewDue(studentId);

    return {
      studentId,
      level: p.level,
      createdAt: p.createdAt,
      sessionsCount: p.assessments.length,
      ...progress,
      reviewDueCount: review.length,
      reviewDueWords: review.map(r => r.word),
    };
  }

  listStudents() {
    return core.listProfiles(this.dir);
  }

  getWordCatalog(level) {
    const lvl = level && core.CEFR.includes(level) ? level : null;
    if (lvl) {
      return { [lvl]: (WORD_BANKS[lvl] || []).map(w => ({ word: w.word, article: w.article, definition: w.definition, category: w.category })) };
    }
    const catalog = {};
    for (const l of core.CEFR) {
      if (WORD_BANKS[l]) {
        catalog[l] = WORD_BANKS[l].map(w => ({ word: w.word, article: w.article, definition: w.definition, category: w.category }));
      }
    }
    return catalog;
  }

  getReviewDue(studentId) {
    const p = this.getProfile(studentId);
    const t = core.today();
    const due = [];
    for (const [word, sk] of Object.entries(p.skills)) {
      if (sk.nextReview && sk.nextReview <= t) {
        due.push({ word, nextReview: sk.nextReview, encounters: sk.encounters, mastery: core.masteryLabel(core.calcMastery(sk.attempts)) });
      }
    }
    return due.sort((a, b) => a.nextReview.localeCompare(b.nextReview));
  }
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

const tutor = new VocabularyTutor();

core.runCLI((cmd, args, out) => {
  const sid = args[1] || 'default';
  switch (cmd) {
    case 'start':
      out(tutor.getProfile(sid));
      break;
    case 'set-level':
      out(tutor.setLevel(sid, (args[2] || '').toUpperCase()));
      break;
    case 'lesson':
      out(tutor.generateLesson(sid));
      break;
    case 'exercise':
      out(tutor.generateExercise(sid, args[2]));
      break;
    case 'check': {
      // args: check <studentId> <exerciseJson> <answer>
      const ex = JSON.parse(args[2]);
      const ans = args.slice(3).join(' ');
      out(tutor.checkAnswer(ex, ans));
      break;
    }
    case 'record':
      // args: record <studentId> <word> <grade>
      out(tutor.recordAssessment(sid, args[2], parseInt(args[3], 10)));
      break;
    case 'review':
      out(tutor.getReviewDue(sid));
      break;
    case 'progress':
      out(tutor.getProgress(sid));
      break;
    case 'report':
      out(tutor.getReport(sid));
      break;
    case 'next':
      out(tutor.getNextTopics(sid));
      break;
    case 'words':
      out(tutor.getWordCatalog(args[1] ? args[2].toUpperCase() : null));
      break;
    case 'students':
      out({ students: tutor.listStudents() });
      break;
    case 'help':
      out({ info: 'Use one of the commands listed in SKILL.md' });
      break;
    default:
      out({
        usage: 'node tutor.js <command> [studentId] [args...]',
        commands: {
          start: 'Load or create student profile',
          'set-level': 'Set CEFR level (A1-C2)',
          lesson: 'Generate a lesson with new words + exercises',
          exercise: 'Generate a single exercise [type]',
          check: 'Check answer: check <id> <exerciseJSON> <answer>',
          record: 'Record assessment: record <id> <word> <grade 1-4>',
          review: 'Get words due for review',
          progress: 'Show progress summary',
          report: 'Full student report',
          next: 'Show upcoming topics by category',
          words: 'Show word catalog [level]',
          students: 'List all students',
        },
      });
  }
});
