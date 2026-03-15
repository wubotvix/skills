#!/usr/bin/env node
'use strict';

const core = require('../_lib/core');

// ---------------------------------------------------------------------------
// Embedded reading texts by CEFR level
// ---------------------------------------------------------------------------

const TEXTS = {
  A1: [
    {
      id: 'a1-cafe',
      title: 'En el café',
      type: 'dialogue',
      text:
        '— Hola, buenos días. ¿Qué desea?\n' +
        '— Buenos días. Quiero un café con leche, por favor.\n' +
        '— ¿Grande o pequeño?\n' +
        '— Grande. Y también una tostada.\n' +
        '— Muy bien. Son tres euros cincuenta.\n' +
        '— Aquí tiene. Gracias.\n' +
        '— De nada. ¡Buen provecho!',
      vocabulary: [
        { word: 'desea', definition: 'do you want (formal)', example: '¿Qué desea tomar?' },
        { word: 'tostada', definition: 'toast', example: 'Una tostada con mantequilla.' },
        { word: 'buen provecho', definition: 'enjoy your meal', example: '¡Buen provecho a todos!' },
      ],
      comprehensionQuestions: [
        {
          question: '¿Qué pide el cliente para beber?',
          options: ['Un té', 'Un café con leche', 'Un zumo de naranja', 'Un agua'],
          answer: 1,
          explanation: 'El cliente dice "Quiero un café con leche."',
        },
        {
          question: '¿Qué tamaño quiere el café?',
          options: ['Pequeño', 'Mediano', 'Grande', 'No dice'],
          answer: 2,
          explanation: 'Cuando le preguntan "¿Grande o pequeño?", responde "Grande."',
        },
        {
          question: '¿Cuánto cuesta todo?',
          options: ['Dos euros', 'Tres euros', 'Tres euros cincuenta', 'Cinco euros'],
          answer: 2,
          explanation: 'El camarero dice "Son tres euros cincuenta."',
        },
      ],
    },
    {
      id: 'a1-familia',
      title: 'Mi familia',
      type: 'narrative',
      text:
        'Me llamo Ana. Tengo veinticinco años y vivo en Madrid. Mi familia es pequeña. ' +
        'Mi padre se llama Carlos y tiene cincuenta y dos años. Es profesor. Mi madre ' +
        'se llama María y tiene cuarenta y nueve años. Es médica. Tengo un hermano. ' +
        'Se llama Pedro y tiene veintidós años. Pedro estudia en la universidad. ' +
        'Los fines de semana comemos juntos en casa de mis padres.',
      vocabulary: [
        { word: 'vivo', definition: 'I live', example: 'Vivo en una casa grande.' },
        { word: 'médica', definition: 'doctor (female)', example: 'La médica trabaja en el hospital.' },
        { word: 'los fines de semana', definition: 'on weekends', example: 'Los fines de semana descanso.' },
      ],
      comprehensionQuestions: [
        {
          question: '¿Dónde vive Ana?',
          options: ['En Barcelona', 'En Madrid', 'En Sevilla', 'En Valencia'],
          answer: 1,
          explanation: 'Ana dice "vivo en Madrid."',
        },
        {
          question: '¿Cuál es la profesión de la madre de Ana?',
          options: ['Profesora', 'Enfermera', 'Médica', 'Abogada'],
          answer: 2,
          explanation: 'El texto dice "Mi madre se llama María... Es médica."',
        },
        {
          question: '¿Qué hace Pedro?',
          options: ['Trabaja', 'Estudia en la universidad', 'Viaja', 'Cocina'],
          answer: 1,
          explanation: 'El texto dice "Pedro estudia en la universidad."',
        },
      ],
    },
    {
      id: 'a1-horario',
      title: 'Mi día',
      type: 'narrative',
      text:
        'Todos los días me levanto a las siete de la mañana. Desayuno café y fruta. ' +
        'A las ocho voy al trabajo en autobús. Trabajo en una oficina de nueve a cinco. ' +
        'Al mediodía como un bocadillo en el parque. Por la tarde vuelvo a casa y cocino ' +
        'la cena. Después veo la televisión o leo un libro. Me acuesto a las once.',
      vocabulary: [
        { word: 'me levanto', definition: 'I get up', example: 'Me levanto temprano.' },
        { word: 'bocadillo', definition: 'sandwich (on a baguette)', example: 'Un bocadillo de jamón.' },
        { word: 'me acuesto', definition: 'I go to bed', example: 'Me acuesto tarde los viernes.' },
      ],
      comprehensionQuestions: [
        {
          question: '¿Cómo va al trabajo?',
          options: ['En coche', 'En metro', 'En autobús', 'Andando'],
          answer: 2,
          explanation: 'El texto dice "voy al trabajo en autobús."',
        },
        {
          question: '¿Dónde come al mediodía?',
          options: ['En la oficina', 'En un restaurante', 'En casa', 'En el parque'],
          answer: 3,
          explanation: 'El texto dice "como un bocadillo en el parque."',
        },
        {
          question: '¿A qué hora se acuesta?',
          options: ['A las diez', 'A las once', 'A las doce', 'A las nueve'],
          answer: 1,
          explanation: 'El texto dice "Me acuesto a las once."',
        },
      ],
    },
  ],

  A2: [
    {
      id: 'a2-vacaciones',
      title: 'Mis vacaciones en la playa',
      type: 'narrative',
      text:
        'El verano pasado fui de vacaciones a la costa con mi familia. Viajamos en coche ' +
        'durante cuatro horas. El hotel estaba cerca de la playa y tenía una piscina muy ' +
        'grande. Todos los días nos levantábamos tarde y desayunábamos en el hotel. Por ' +
        'la mañana íbamos a la playa. El agua estaba un poco fría, pero a los niños les ' +
        'encantaba nadar. Por la tarde paseábamos por el pueblo y tomábamos helados. Una ' +
        'noche cenamos en un restaurante de mariscos. La paella estaba deliciosa. Fueron ' +
        'las mejores vacaciones de mi vida.',
      vocabulary: [
        { word: 'mariscos', definition: 'seafood', example: 'Me gustan los mariscos frescos.' },
        { word: 'paseábamos', definition: 'we used to walk/stroll', example: 'Paseábamos por la ciudad vieja.' },
        { word: 'deliciosa', definition: 'delicious', example: 'La comida estaba deliciosa.' },
      ],
      comprehensionQuestions: [
        {
          question: '¿Cómo viajaron a la costa?',
          options: ['En tren', 'En avión', 'En coche', 'En autobús'],
          answer: 2,
          explanation: 'El texto dice "Viajamos en coche durante cuatro horas."',
        },
        {
          question: '¿Cómo estaba el agua del mar?',
          options: ['Caliente', 'Un poco fría', 'Muy fría', 'Perfecta'],
          answer: 1,
          explanation: 'El texto dice "El agua estaba un poco fría."',
        },
        {
          question: '¿Qué comieron en el restaurante?',
          options: ['Pizza', 'Hamburguesas', 'Paella', 'Ensalada'],
          answer: 2,
          explanation: 'El texto dice "cenamos en un restaurante de mariscos. La paella estaba deliciosa."',
        },
      ],
    },
    {
      id: 'a2-mercado',
      title: 'En el mercado',
      type: 'dialogue',
      text:
        '— Buenos días. ¿Tiene tomates frescos?\n' +
        '— Sí, claro. Estos son de la huerta de hoy. ¿Cuántos quiere?\n' +
        '— Ponga un kilo, por favor. ¿Y las fresas? ¿Están buenas?\n' +
        '— Buenísimas. Están muy dulces esta semana.\n' +
        '— Vale, medio kilo de fresas también. ¿Cuánto es todo?\n' +
        '— El kilo de tomates, dos euros. Las fresas, tres euros. Son cinco euros en total.\n' +
        '— Tenga. ¿Tiene bolsa?\n' +
        '— Sí, aquí tiene. ¡Que aproveche!',
      vocabulary: [
        { word: 'huerta', definition: 'vegetable garden / orchard', example: 'Los tomates vienen de la huerta.' },
        { word: 'dulces', definition: 'sweet', example: 'Las fresas están muy dulces.' },
        { word: 'que aproveche', definition: 'enjoy (your food/purchase)', example: '¡Que aproveche la comida!' },
      ],
      comprehensionQuestions: [
        {
          question: '¿De dónde son los tomates?',
          options: ['Del supermercado', 'De la huerta de hoy', 'De otro país', 'No dice'],
          answer: 1,
          explanation: 'El vendedor dice "Estos son de la huerta de hoy."',
        },
        {
          question: '¿Cuánto cuestan las fresas?',
          options: ['Dos euros', 'Tres euros', 'Cinco euros', 'Un euro'],
          answer: 1,
          explanation: 'El vendedor dice "Las fresas, tres euros."',
        },
        {
          question: '¿Cómo están las fresas esta semana?',
          options: ['Ácidas', 'Muy dulces', 'Un poco verdes', 'Normales'],
          answer: 1,
          explanation: 'El vendedor dice "Están muy dulces esta semana."',
        },
      ],
    },
  ],

  B1: [
    {
      id: 'b1-bici',
      title: 'Las bicicletas conquistan las ciudades',
      type: 'article',
      text:
        'En los últimos años, muchas ciudades españolas han apostado por la bicicleta como ' +
        'medio de transporte. Barcelona, Sevilla y Valencia han creado cientos de kilómetros ' +
        'de carriles bici. Sevilla, por ejemplo, pasó de tener casi cero ciclistas en 2006 ' +
        'a más de setenta mil viajes diarios en bicicleta en pocos años.\n\n' +
        'Las razones son claras: la bicicleta no contamina, es barata y mejora la salud. ' +
        'Un estudio reciente demostró que las personas que van en bici al trabajo tienen ' +
        'menos estrés y duermen mejor. Además, en distancias cortas, la bicicleta es más ' +
        'rápida que el coche porque no hay problemas de aparcamiento.\n\n' +
        'Sin embargo, todavía hay problemas. Muchos conductores no respetan los carriles bici ' +
        'y faltan aparcamientos seguros. Algunos ciclistas tampoco respetan las normas de ' +
        'tráfico. Para que la bicicleta sea una opción real para todos, las ciudades necesitan ' +
        'invertir más en infraestructura y educación vial.',
      vocabulary: [
        { word: 'han apostado por', definition: 'have bet on / committed to', example: 'La empresa ha apostado por la tecnología.' },
        { word: 'carriles bici', definition: 'bike lanes', example: 'Los carriles bici son seguros.' },
        { word: 'educación vial', definition: 'road safety education', example: 'La educación vial es importante para los niños.' },
      ],
      comprehensionQuestions: [
        {
          question: '¿Qué ciudad pasó de casi cero ciclistas a setenta mil viajes diarios?',
          options: ['Barcelona', 'Madrid', 'Sevilla', 'Valencia'],
          answer: 2,
          explanation: 'El texto dice "Sevilla, por ejemplo, pasó de tener casi cero ciclistas en 2006 a más de setenta mil viajes diarios."',
        },
        {
          question: 'Según el texto, ¿por qué la bici es más rápida que el coche en distancias cortas?',
          options: ['Porque va más rápido', 'Porque no hay problemas de aparcamiento', 'Porque tiene carril propio', 'Porque no hay semáforos'],
          answer: 1,
          explanation: 'El texto dice "la bicicleta es más rápida que el coche porque no hay problemas de aparcamiento."',
        },
        {
          question: '¿Qué necesitan las ciudades para que la bicicleta sea una opción real?',
          options: ['Más coches', 'Más infraestructura y educación vial', 'Menos carriles bici', 'Bicicletas gratis'],
          answer: 1,
          explanation: 'El último párrafo dice "las ciudades necesitan invertir más en infraestructura y educación vial."',
        },
      ],
    },
    {
      id: 'b1-carta',
      title: 'Carta a un amigo',
      type: 'letter',
      text:
        'Querido Miguel:\n\n' +
        '¡Cuánto tiempo sin escribirte! Te cuento que el mes pasado cambié de trabajo. ' +
        'Ahora trabajo en una empresa de tecnología en el centro de la ciudad. El horario ' +
        'es mejor que el anterior: entro a las nueve y salgo a las seis. Mis compañeros ' +
        'son muy simpáticos y el jefe es bastante flexible.\n\n' +
        'Lo mejor es que ahora puedo ir andando al trabajo porque la oficina está a solo ' +
        'quince minutos de mi casa. Antes tardaba una hora en el metro, así que estoy ' +
        'muy contento con el cambio.\n\n' +
        'También quería contarte que Laura y yo estamos pensando en hacer un viaje a ' +
        'Portugal en agosto. ¿Te apetece venir con nosotros? Podríamos alquilar una casa ' +
        'cerca de la playa. Escríbeme cuando puedas.\n\n' +
        'Un abrazo fuerte,\nDaniel',
      vocabulary: [
        { word: 'cuánto tiempo sin', definition: 'it has been so long since', example: '¡Cuánto tiempo sin verte!' },
        { word: 'tardaba', definition: 'it used to take (me)', example: 'Tardaba mucho en llegar.' },
        { word: 'te apetece', definition: 'do you feel like / would you like', example: '¿Te apetece un café?' },
      ],
      comprehensionQuestions: [
        {
          question: '¿Por qué está contento Daniel con su nuevo trabajo?',
          options: ['Gana más dinero', 'Puede ir andando y el horario es mejor', 'Trabaja desde casa', 'Tiene más vacaciones'],
          answer: 1,
          explanation: 'Daniel menciona que el horario es mejor y que puede ir andando, mientras antes tardaba una hora en metro.',
        },
        {
          question: '¿Cuánto tardaba Daniel antes en llegar al trabajo?',
          options: ['Quince minutos', 'Treinta minutos', 'Una hora', 'Dos horas'],
          answer: 2,
          explanation: 'El texto dice "Antes tardaba una hora en el metro."',
        },
        {
          question: '¿Qué le propone Daniel a Miguel?',
          options: ['Cambiar de trabajo', 'Ir a Portugal juntos en agosto', 'Visitarle en Madrid', 'Alquilar un piso'],
          answer: 1,
          explanation: 'Daniel pregunta "¿Te apetece venir con nosotros?" refiriéndose al viaje a Portugal en agosto.',
        },
      ],
    },
    {
      id: 'b1-tradiciones',
      title: 'La Tomatina de Buñol',
      type: 'article',
      text:
        'Cada último miércoles de agosto, el pequeño pueblo de Buñol, en Valencia, celebra ' +
        'la fiesta más roja del mundo: La Tomatina. Durante una hora, más de veinte mil ' +
        'personas se lanzan tomates por las calles del pueblo.\n\n' +
        'La fiesta comenzó en 1945, probablemente cuando unos jóvenes empezaron una pelea ' +
        'de comida durante un desfile. Al año siguiente, los jóvenes trajeron sus propios ' +
        'tomates y la tradición nació. El ayuntamiento la prohibió varias veces, pero los ' +
        'vecinos seguían celebrándola hasta que finalmente se hizo oficial en 1959.\n\n' +
        'Hay una regla importante: antes de lanzar un tomate, hay que aplastarlo con la mano ' +
        'para no hacer daño a nadie. Después de la batalla, los bomberos limpian las calles ' +
        'con agua. Sorprendentemente, el ácido de los tomates deja las calles más limpias ' +
        'que antes de la fiesta.',
      vocabulary: [
        { word: 'se lanzan', definition: 'they throw at each other', example: 'Los niños se lanzan bolas de nieve.' },
        { word: 'aplastarlo', definition: 'to squash/crush it', example: 'Hay que aplastarlo antes de tirarlo.' },
        { word: 'bomberos', definition: 'firefighters', example: 'Los bomberos apagaron el fuego rápidamente.' },
      ],
      comprehensionQuestions: [
        {
          question: '¿Cuándo se celebra La Tomatina?',
          options: ['El primer lunes de julio', 'El último miércoles de agosto', 'El 15 de septiembre', 'Cada domingo de verano'],
          answer: 1,
          explanation: 'El texto dice "Cada último miércoles de agosto."',
        },
        {
          question: '¿Por qué hay que aplastar el tomate antes de lanzarlo?',
          options: ['Para que sea más divertido', 'Para no hacer daño a nadie', 'Porque es la tradición', 'Para que vuele más lejos'],
          answer: 1,
          explanation: 'El texto dice "hay que aplastarlo con la mano para no hacer daño a nadie."',
        },
        {
          question: '¿Qué efecto sorprendente tienen los tomates en las calles?',
          options: ['Las manchan de rojo permanentemente', 'Las dejan más limpias que antes', 'Las hacen resbaladizas', 'Las dañan'],
          answer: 1,
          explanation: 'El texto dice "el ácido de los tomates deja las calles más limpias que antes de la fiesta."',
        },
      ],
    },
  ],

  B2: [
    {
      id: 'b2-teletrabajo',
      title: 'El teletrabajo: ¿revolución o retroceso?',
      type: 'article',
      text:
        'La pandemia aceleró una tendencia que ya existía: el teletrabajo. Según datos del ' +
        'Instituto Nacional de Estadística, el porcentaje de empleados que trabajaban desde ' +
        'casa en España pasó del 4,8% en 2019 al 16,2% en 2020. Aunque muchas empresas ' +
        'han vuelto a exigir la presencialidad, el debate sigue abierto.\n\n' +
        'Los defensores del teletrabajo argumentan que aumenta la productividad, reduce ' +
        'los desplazamientos y mejora la conciliación familiar. Un estudio de la Universidad ' +
        'de Stanford demostró que los trabajadores remotos eran un 13% más productivos que ' +
        'sus compañeros de oficina. Además, cada persona que trabaja desde casa evita emitir ' +
        'una media de 1,4 toneladas de CO₂ al año.\n\n' +
        'Sin embargo, los críticos señalan riesgos importantes. El aislamiento social puede ' +
        'provocar problemas de salud mental. La frontera entre vida personal y laboral se ' +
        'difumina, lo que lleva a jornadas más largas. También existe la preocupación de que ' +
        'el teletrabajo profundice las desigualdades: mientras los profesionales cualificados ' +
        'disfrutan de flexibilidad, los trabajadores de servicios esenciales no tienen esa opción.\n\n' +
        'Quizás la solución no sea elegir entre un modelo u otro, sino encontrar un equilibrio. ' +
        'El modelo híbrido — dos o tres días en la oficina y el resto desde casa — parece ' +
        'ofrecer lo mejor de ambos mundos, aunque su implementación todavía plantea desafíos ' +
        'organizativos considerables.',
      vocabulary: [
        { word: 'conciliación familiar', definition: 'work-life balance (lit. family reconciliation)', example: 'La conciliación familiar es un derecho.' },
        { word: 'se difumina', definition: 'becomes blurred', example: 'La línea entre realidad y ficción se difumina.' },
        { word: 'profundice', definition: 'deepen (subjunctive)', example: 'Es posible que la crisis profundice las diferencias.' },
      ],
      comprehensionQuestions: [
        {
          question: '¿Qué porcentaje de empleados teletrabajaba en España en 2020?',
          options: ['4,8%', '10,5%', '16,2%', '25%'],
          answer: 2,
          explanation: 'El texto dice que pasó "al 16,2% en 2020."',
        },
        {
          question: '¿Qué riesgo del teletrabajo mencionan los críticos respecto a la desigualdad?',
          options: [
            'Los jefes ganan más',
            'Solo los profesionales cualificados pueden teletrabajar',
            'Las mujeres trabajan más',
            'Los jóvenes no tienen experiencia',
          ],
          answer: 1,
          explanation: 'El texto dice que "los profesionales cualificados disfrutan de flexibilidad" mientras que "los trabajadores de servicios esenciales no tienen esa opción."',
        },
        {
          question: '¿Qué solución propone el autor?',
          options: ['Teletrabajo total', 'Volver a la oficina', 'Un modelo híbrido', 'Reducir la jornada'],
          answer: 2,
          explanation: 'El último párrafo propone "El modelo híbrido — dos o tres días en la oficina y el resto desde casa."',
        },
      ],
    },
    {
      id: 'b2-lenguas',
      title: 'Las lenguas en peligro de extinción',
      type: 'article',
      text:
        'De las aproximadamente siete mil lenguas que se hablan en el mundo, los lingüistas ' +
        'estiman que la mitad desaparecerá antes de que termine este siglo. Cada dos semanas ' +
        'muere una lengua, y con ella se pierde un sistema único de pensamiento, una forma ' +
        'irrepetible de entender la realidad.\n\n' +
        'En América Latina, la situación es especialmente preocupante. Lenguas como el ' +
        'náhuatl, el quechua y el guaraní, aunque cuentan con millones de hablantes, sufren ' +
        'una presión constante del español. Los jóvenes abandonan las lenguas de sus abuelos ' +
        'porque las asocian con la pobreza y la marginación. La globalización y las redes ' +
        'sociales, que operan casi exclusivamente en lenguas dominantes, aceleran este proceso.\n\n' +
        'No obstante, hay motivos para el optimismo. Paraguay es un caso excepcional: el ' +
        'guaraní es lengua cooficial junto con el español y lo habla más del 90% de la ' +
        'población, incluyendo a personas que no tienen ascendencia indígena. En México, ' +
        'programas de educación bilingüe están recuperando el prestigio de lenguas como el ' +
        'zapoteco y el mixteco. La tecnología también ayuda: existen ya teclados, correctores ' +
        'ortográficos e incluso asistentes virtuales en lenguas indígenas.\n\n' +
        'Preservar la diversidad lingüística no es solo una cuestión cultural; es una cuestión ' +
        'de justicia. Como afirmó el lingüista Ken Hale, cuando muere una lengua, se pierde ' +
        'el equivalente intelectual de una especie biológica.',
      vocabulary: [
        { word: 'irrepetible', definition: 'unrepeatable, unique', example: 'Fue una experiencia irrepetible.' },
        { word: 'ascendencia', definition: 'ancestry, descent', example: 'Tiene ascendencia italiana.' },
        { word: 'cooficial', definition: 'co-official', example: 'El catalán es cooficial en Cataluña.' },
      ],
      comprehensionQuestions: [
        {
          question: '¿Con qué frecuencia desaparece una lengua según el texto?',
          options: ['Cada día', 'Cada semana', 'Cada dos semanas', 'Cada mes'],
          answer: 2,
          explanation: 'El texto dice "Cada dos semanas muere una lengua."',
        },
        {
          question: '¿Por qué es Paraguay un caso excepcional?',
          options: [
            'Prohibió las lenguas indígenas',
            'El guaraní es cooficial y lo habla más del 90% de la población',
            'Solo se habla español',
            'Tiene más lenguas que cualquier otro país',
          ],
          answer: 1,
          explanation: 'El texto dice que el guaraní "es lengua cooficial junto con el español y lo habla más del 90% de la población."',
        },
        {
          question: '¿Qué comparación hace el lingüista Ken Hale?',
          options: [
            'Una lengua es como un país',
            'Una lengua perdida es como una especie biológica perdida',
            'Las lenguas son como los ríos',
            'Las lenguas son como los libros',
          ],
          answer: 1,
          explanation: 'Hale afirmó que "cuando muere una lengua, se pierde el equivalente intelectual de una especie biológica."',
        },
      ],
    },
    {
      id: 'b2-editorial',
      title: 'Opinión: El derecho a desconectar',
      type: 'article',
      text:
        'Francia aprobó en 2017 una ley que reconoce el derecho de los trabajadores a no ' +
        'responder correos electrónicos fuera de su horario laboral. España siguió su ejemplo ' +
        'con una regulación similar en 2018. Sin embargo, la realidad cotidiana está lejos de ' +
        'respetar este derecho.\n\n' +
        'Una encuesta de Infojobs reveló que el 68% de los trabajadores españoles consulta el ' +
        'correo del trabajo en su tiempo libre. Uno de cada tres confiesa sentir ansiedad si ' +
        'no revisa sus mensajes durante el fin de semana. Las notificaciones del móvil han ' +
        'convertido lo que antes era tiempo de descanso en una extensión permanente de la ' +
        'jornada laboral.\n\n' +
        'El problema no es solo legal sino cultural. En muchos entornos laborales, responder ' +
        'rápidamente se percibe como señal de compromiso y profesionalidad. Quienes se ' +
        'desconectan temen ser considerados perezosos o poco ambiciosos. Esta presión ' +
        'invisible es, paradójicamente, más difícil de combatir que cualquier norma escrita.\n\n' +
        'Para que el derecho a desconectar sea efectivo, las empresas necesitan cambiar su ' +
        'cultura organizativa. No basta con aprobar leyes; es imprescindible que los directivos ' +
        'den ejemplo desconectándose ellos mismos y que se establezcan protocolos claros sobre ' +
        'comunicación fuera de horario.',
      vocabulary: [
        { word: 'imprescindible', definition: 'essential, indispensable', example: 'Es imprescindible llevar pasaporte.' },
        { word: 'entornos laborales', definition: 'work environments', example: 'Los entornos laborales están cambiando.' },
        { word: 'paradójicamente', definition: 'paradoxically', example: 'Paradójicamente, descansar más mejora la productividad.' },
      ],
      comprehensionQuestions: [
        {
          question: '¿Qué porcentaje de trabajadores españoles consulta el correo en su tiempo libre?',
          options: ['32%', '50%', '68%', '85%'],
          answer: 2,
          explanation: 'La encuesta de Infojobs reveló que "el 68% de los trabajadores españoles consulta el correo del trabajo en su tiempo libre."',
        },
        {
          question: '¿Cuál es la presión "invisible" que menciona el autor?',
          options: [
            'Las leyes son muy estrictas',
            'La cultura de responder rápido como señal de compromiso',
            'Los jefes envían muchos correos',
            'No hay wifi en casa',
          ],
          answer: 1,
          explanation: 'El texto habla de que "responder rápidamente se percibe como señal de compromiso y profesionalidad" y que "quienes se desconectan temen ser considerados perezosos."',
        },
        {
          question: '¿Qué propone el autor como solución?',
          options: [
            'Más leyes',
            'Prohibir los teléfonos',
            'Que los directivos den ejemplo y se establezcan protocolos',
            'Trabajar menos horas',
          ],
          answer: 2,
          explanation: 'El último párrafo dice que "es imprescindible que los directivos den ejemplo desconectándose ellos mismos y que se establezcan protocolos claros."',
        },
      ],
    },
  ],

  C1: [
    {
      id: 'c1-memoria',
      title: 'La memoria selectiva de las naciones',
      type: 'article',
      text:
        'Toda nación construye su identidad sobre una narrativa que selecciona, ordena e ' +
        'interpreta ciertos acontecimientos del pasado mientras relega otros al olvido. ' +
        'Este proceso, que el historiador francés Ernest Renan describió como "el olvido ' +
        'colectivo necesario," no es accidental: responde a necesidades políticas y sociales ' +
        'del presente.\n\n' +
        'El caso español resulta particularmente revelador. Durante décadas, el pacto de la ' +
        'Transición promovió un consenso implícito de no mirar atrás. La Guerra Civil y la ' +
        'dictadura franquista fueron deliberadamente marginadas del discurso público en aras ' +
        'de la reconciliación. Este "pacto del olvido," como lo denominaron sus críticos, ' +
        'permitió una transición democrática relativamente pacífica, pero dejó heridas sin ' +
        'cerrar: fosas comunes sin excavar, víctimas sin reconocer, responsabilidades sin ' +
        'exigir.\n\n' +
        'La Ley de Memoria Histórica de 2007 intentó subsanar esta deuda pendiente, aunque ' +
        'su aplicación fue desigual y generó una polarización que persiste. Sus defensores la ' +
        'consideran un acto de justicia elemental; sus detractores la acusan de reabrir ' +
        'heridas para obtener rédito político. Lo cierto es que ninguna sociedad puede ' +
        'construir un futuro verdaderamente democrático sin confrontar honestamente su pasado, ' +
        'por incómodo que resulte.\n\n' +
        'Como advirtió el filósofo George Santayana — nacido, no casualmente, en Madrid —, ' +
        '"aquellos que no pueden recordar el pasado están condenados a repetirlo." La ' +
        'pregunta no es si debemos recordar, sino cómo hacerlo sin que la memoria se convierta ' +
        'en instrumento de venganza ni el olvido en cómplice de la impunidad.',
      vocabulary: [
        { word: 'relega', definition: 'relegates, pushes aside', example: 'La sociedad relega ciertos temas al silencio.' },
        { word: 'en aras de', definition: 'for the sake of', example: 'Lo hizo en aras de la paz.' },
        { word: 'subsanar', definition: 'to remedy, to rectify', example: 'Hay que subsanar los errores del pasado.' },
        { word: 'rédito', definition: 'benefit, profit (figurative)', example: 'Buscan rédito electoral con estas medidas.' },
      ],
      comprehensionQuestions: [
        {
          question: '¿Qué describió Ernest Renan como necesario para la identidad nacional?',
          options: [
            'La guerra',
            'El olvido colectivo',
            'La democracia',
            'La educación histórica',
          ],
          answer: 1,
          explanation: 'El texto menciona que Renan describió "el olvido colectivo necesario" como parte de la construcción de la identidad nacional.',
        },
        {
          question: '¿Cuál fue la consecuencia negativa del "pacto del olvido" durante la Transición española?',
          options: [
            'Hubo más violencia',
            'Se dejaron heridas sin cerrar: fosas comunes, víctimas sin reconocer',
            'España no se hizo democrática',
            'Francia criticó a España',
          ],
          answer: 1,
          explanation: 'El texto dice que el pacto "dejó heridas sin cerrar: fosas comunes sin excavar, víctimas sin reconocer, responsabilidades sin exigir."',
        },
        {
          question: '¿Cuál es la tesis principal del autor en el último párrafo?',
          options: [
            'Hay que olvidar el pasado para avanzar',
            'La memoria histórica es siempre política',
            'Debemos recordar el pasado sin convertir la memoria en venganza ni el olvido en impunidad',
            'Santayana tenía razón en todo',
          ],
          answer: 2,
          explanation: 'El autor concluye que la cuestión es "cómo hacerlo sin que la memoria se convierta en instrumento de venganza ni el olvido en cómplice de la impunidad."',
        },
      ],
    },
    {
      id: 'c1-algoritmos',
      title: 'Los algoritmos y la ilusión de la objetividad',
      type: 'article',
      text:
        'Existe una creencia ampliamente extendida de que los algoritmos son herramientas ' +
        'neutrales, incapaces de discriminar porque carecen de prejuicios humanos. Esta ' +
        'suposición, aparentemente lógica, resulta profundamente engañosa. Los algoritmos no ' +
        'surgen del vacío: son diseñados por personas, entrenados con datos históricos y ' +
        'desplegados en contextos sociales concretos. En cada una de estas etapas, los sesgos ' +
        'humanos pueden infiltrarse y, lo que es más preocupante, quedar ocultos tras una ' +
        'apariencia de neutralidad técnica.\n\n' +
        'Un ejemplo paradigmático lo ofrece el sistema COMPAS, utilizado en tribunales ' +
        'estadounidenses para predecir la probabilidad de reincidencia criminal. Una ' +
        'investigación de ProPublica reveló que el algoritmo asignaba sistemáticamente mayor ' +
        'riesgo a los acusados afroamericanos que a los blancos, incluso cuando sus perfiles ' +
        'delictivos eran comparables. El sesgo no estaba codificado explícitamente: emergía de ' +
        'los datos históricos de un sistema judicial ya desigual.\n\n' +
        'El problema se agrava cuando consideramos que estos sistemas operan como cajas negras. ' +
        'A diferencia de un juez humano, cuyo razonamiento puede ser cuestionado en apelación, ' +
        'un algoritmo de aprendizaje profundo no puede explicar por qué llegó a una determinada ' +
        'conclusión. Esta opacidad representa un desafío fundamental para el Estado de derecho, ' +
        'que exige que toda decisión que afecte a los derechos de una persona sea transparente ' +
        'y susceptible de revisión.\n\n' +
        'La solución no pasa por rechazar la tecnología, sino por exigir lo que la matemática ' +
        'Cathy O\'Neil denomina "auditorías algorítmicas": evaluaciones independientes que ' +
        'examinen los datos de entrenamiento, las métricas de rendimiento y los impactos ' +
        'diferenciados sobre distintos grupos poblacionales. Solo así podremos aprovechar el ' +
        'potencial de la inteligencia artificial sin sacrificar los principios de equidad que ' +
        'sustentan la convivencia democrática.',
      vocabulary: [
        { word: 'sesgos', definition: 'biases', example: 'Los sesgos inconscientes afectan nuestras decisiones.' },
        { word: 'reincidencia', definition: 'recidivism, reoffending', example: 'La tasa de reincidencia es alta.' },
        { word: 'opacidad', definition: 'opacity, lack of transparency', example: 'La opacidad del proceso genera desconfianza.' },
        { word: 'susceptible de', definition: 'subject to, capable of being', example: 'Esta decisión es susceptible de apelación.' },
      ],
      comprehensionQuestions: [
        {
          question: '¿Por qué, según el autor, es engañosa la creencia en la neutralidad algorítmica?',
          options: [
            'Porque los ordenadores cometen errores matemáticos',
            'Porque los algoritmos son diseñados por personas y entrenados con datos históricos sesgados',
            'Porque la tecnología es siempre mala',
            'Porque los programadores son racistas',
          ],
          answer: 1,
          explanation: 'El texto argumenta que los algoritmos "son diseñados por personas, entrenados con datos históricos y desplegados en contextos sociales concretos," permitiendo que sesgos humanos se infiltren.',
        },
        {
          question: '¿Qué problema fundamental plantean las "cajas negras" algorítmicas para el Estado de derecho?',
          options: [
            'Son muy caras',
            'No pueden explicar su razonamiento, impidiendo la transparencia y revisión',
            'Los jueces no saben usarlas',
            'No funcionan bien',
          ],
          answer: 1,
          explanation: 'El texto dice que la opacidad "representa un desafío fundamental para el Estado de derecho, que exige que toda decisión... sea transparente y susceptible de revisión."',
        },
        {
          question: '¿Qué solución propone Cathy O\'Neil según el texto?',
          options: [
            'Prohibir la inteligencia artificial',
            'Usar solo jueces humanos',
            'Auditorías algorítmicas independientes',
            'Publicar el código fuente',
          ],
          answer: 2,
          explanation: 'El texto propone "auditorías algorítmicas: evaluaciones independientes que examinen los datos de entrenamiento, las métricas de rendimiento y los impactos diferenciados."',
        },
      ],
    },
    {
      id: 'c1-literario',
      title: 'El sur — fragmento adaptado (Borges)',
      type: 'narrative',
      text:
        'Juan Dahlmann, secretario de una biblioteca municipal, se consideraba profundamente ' +
        'argentino. Su abuelo materno había sido aquel Francisco Flores que murió en la ' +
        'frontera de Buenos Aires, lanceado por indios de Catriel. En la discordia de sus dos ' +
        'linajes, Dahlmann eligió el del antepasado romántico. Un estuche con el daguerrotipo ' +
        'de un hombre inexpresivo y barbado, una vieja espada, la dicha y el coraje de ciertas ' +
        'músicas, el hábito de estrofas del Martín Fierro, los años, el desgano y la soledad ' +
        'fomentaron ese criollismo voluntario que nunca fue ostentoso.\n\n' +
        'A costa de algunas privaciones, Dahlmann había logrado salvar el casco de una estancia ' +
        'en el Sur, que fue de los Flores. Una de las costumbres de su memoria era la imagen ' +
        'de los eucaliptos balsámicos y de la larga casa rosada que alguna vez fue carmesí. ' +
        'Las tareas y acaso la indolencia lo retenían en la ciudad. Verano tras verano se ' +
        'contentaba con la idea abstracta de posesión y con la certidumbre de que su casa ' +
        'estaba esperándolo, en un sitio preciso de la llanura.',
      vocabulary: [
        { word: 'linajes', definition: 'lineages, ancestral lines', example: 'Los dos linajes de la familia eran muy diferentes.' },
        { word: 'daguerrotipo', definition: 'daguerreotype (early photograph)', example: 'El daguerrotipo mostraba una imagen borrosa.' },
        { word: 'criollismo', definition: 'criollo identity/cultural movement valuing Argentine rural traditions', example: 'El criollismo marcó la literatura argentina.' },
        { word: 'indolencia', definition: 'indolence, laziness', example: 'La indolencia le impedía actuar.' },
      ],
      comprehensionQuestions: [
        {
          question: '¿Cuál de sus dos linajes eligió Dahlmann como identidad?',
          options: [
            'El de su padre, más urbano',
            'El de su abuelo materno, el romántico antepasado de frontera',
            'El europeo',
            'Ninguno de los dos',
          ],
          answer: 1,
          explanation: 'El texto dice "En la discordia de sus dos linajes, Dahlmann eligió el del antepasado romántico," refiriéndose a su abuelo materno Francisco Flores.',
        },
        {
          question: '¿Qué relación tiene Dahlmann con la estancia del Sur?',
          options: [
            'La visita todos los veranos',
            'La posee pero nunca va, retenido en la ciudad',
            'La vendió hace años',
            'Quiere comprarla',
          ],
          answer: 1,
          explanation: 'El texto dice que "las tareas y acaso la indolencia lo retenían en la ciudad" y que se contentaba "con la idea abstracta de posesión."',
        },
        {
          question: '¿Qué sugiere Borges sobre la identidad de Dahlmann con la expresión "criollismo voluntario"?',
          options: [
            'Dahlmann nació en el campo',
            'Su identidad argentina era una elección consciente y deliberada, no una herencia natural',
            'Era un gaucho profesional',
            'Odiaba la ciudad',
          ],
          answer: 1,
          explanation: 'La expresión "criollismo voluntario que nunca fue ostentoso" sugiere que su identificación con la tradición criolla fue una elección deliberada, cultivada a través de objetos y hábitos, no una identidad heredada naturalmente.',
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// ReadingTutor class
// ---------------------------------------------------------------------------

class ReadingTutor {
  constructor() {
    this.dir = core.dataDir('spanish-reading');
    core.ensureDir(this.dir);
  }

  // -- Profile management --

  getProfile(studentId) {
    const p = core.loadProfile(this.dir, studentId);
    if (!p.readingStats) {
      p.readingStats = {};  // textId -> { attempts: [{score,total,date}], stability, difficulty, nextReview }
    }
    return p;
  }

  _save(p) {
    core.saveProfile(this.dir, p);
  }

  setLevel(studentId, level) {
    const lev = level.toUpperCase();
    if (!core.CEFR.includes(lev)) throw new Error(`Invalid level: ${level}. Use one of: ${core.CEFR.join(', ')}`);
    if (lev === 'C2') throw new Error('C2 texts are not yet available. Maximum level is C1.');
    const p = this.getProfile(studentId);
    p.level = lev;
    this._save(p);
    return { studentId, level: lev, message: `Level set to ${lev}.` };
  }

  // -- Text catalog --

  getTextCatalog(level) {
    if (level) {
      const lev = level.toUpperCase();
      const texts = TEXTS[lev];
      if (!texts) return { error: `No texts for level ${lev}.` };
      return { level: lev, texts: texts.map(t => ({ id: t.id, title: t.title, type: t.type })) };
    }
    const catalog = {};
    for (const lev of Object.keys(TEXTS)) {
      catalog[lev] = TEXTS[lev].map(t => ({ id: t.id, title: t.title, type: t.type }));
    }
    return catalog;
  }

  _textsForLevel(level) {
    return TEXTS[level] || TEXTS[Object.keys(TEXTS).find(k => k === level)] || [];
  }

  _findText(textId) {
    for (const lev of Object.keys(TEXTS)) {
      const t = TEXTS[lev].find(t => t.id === textId);
      if (t) return { text: t, level: lev };
    }
    return null;
  }

  // -- Lesson generation --

  generateLesson(studentId) {
    const p = this.getProfile(studentId);
    if (!p.level) throw new Error('No level set. Use set-level first.');
    const texts = this._textsForLevel(p.level);
    if (!texts.length) throw new Error(`No texts available for level ${p.level}.`);

    // Prefer texts not yet attempted, or due for review
    const stats = p.readingStats || {};
    const unattempted = texts.filter(t => !stats[t.id] || !stats[t.id].attempts || stats[t.id].attempts.length === 0);
    const chosen = unattempted.length > 0 ? core.pick(unattempted, 1)[0] : core.pick(texts, 1)[0];

    return {
      studentId,
      level: p.level,
      text: {
        id: chosen.id,
        title: chosen.title,
        type: chosen.type,
        text: chosen.text,
        vocabulary: chosen.vocabulary,
      },
      questions: chosen.comprehensionQuestions.map((q, i) => ({
        index: i,
        question: q.question,
        options: q.options.map((o, j) => `${j}) ${o}`),
      })),
      instructions: 'Read the text carefully. Then answer the comprehension questions using the option number (0-3).',
    };
  }

  getText(studentId, textId) {
    const found = this._findText(textId);
    if (!found) throw new Error(`Text not found: ${textId}`);
    const t = found.text;
    return {
      id: t.id,
      title: t.title,
      type: t.type,
      level: found.level,
      text: t.text,
      vocabulary: t.vocabulary,
      questionCount: t.comprehensionQuestions.length,
    };
  }

  // -- Answer checking --

  checkAnswer(studentId, textId, qIndex, answer) {
    const found = this._findText(textId);
    if (!found) throw new Error(`Text not found: ${textId}`);
    const t = found.text;
    const qi = parseInt(qIndex, 10);
    if (qi < 0 || qi >= t.comprehensionQuestions.length) {
      throw new Error(`Invalid question index: ${qIndex}. Text has ${t.comprehensionQuestions.length} questions.`);
    }
    const q = t.comprehensionQuestions[qi];
    const ans = parseInt(answer, 10);
    const correct = ans === q.answer;
    return {
      textId,
      questionIndex: qi,
      correct,
      yourAnswer: ans,
      correctAnswer: q.answer,
      correctOption: q.options[q.answer],
      explanation: q.explanation,
    };
  }

  // -- Assessment recording --

  recordAssessment(studentId, textId, score, total) {
    const found = this._findText(textId);
    if (!found) throw new Error(`Text not found: ${textId}`);
    const p = this.getProfile(studentId);
    if (!p.readingStats) p.readingStats = {};
    if (!p.readingStats[textId]) {
      p.readingStats[textId] = {
        attempts: [],
        stability: 1,
        difficulty: 5,
        nextReview: core.today(),
      };
    }
    const st = p.readingStats[textId];
    const s = parseInt(score, 10);
    const t = parseInt(total, 10);
    st.attempts.push({ score: s, total: t, date: core.today() });

    // FSRS update
    const grade = s === t ? 4 : s >= t * 0.7 ? 3 : s >= t * 0.5 ? 2 : 1;
    st.stability = core.fsrsUpdateStability(st.stability, st.difficulty, grade);
    st.difficulty = core.fsrsUpdateDifficulty(st.difficulty, grade);
    st.nextReview = (() => {
      const days = core.fsrsNextReview(st.stability);
      const d = new Date();
      d.setDate(d.getDate() + days);
      return d.toISOString().slice(0, 10);
    })();

    // Also record in the standard assessments array
    p.assessments.push({
      type: 'reading',
      textId,
      score: s,
      total: t,
      date: core.today(),
    });

    this._save(p);
    return {
      studentId,
      textId,
      score: s,
      total: t,
      mastery: core.calcMastery(st.attempts),
      nextReview: st.nextReview,
    };
  }

  // -- Progress & reports --

  getProgress(studentId) {
    const p = this.getProfile(studentId);
    const stats = p.readingStats || {};
    const textIds = Object.keys(stats);
    const totalAttempts = textIds.reduce((sum, id) => sum + (stats[id].attempts || []).length, 0);
    const masteries = textIds.map(id => core.calcMastery(stats[id].attempts));
    const avgMastery = masteries.length ? Math.round(masteries.reduce((a, b) => a + b, 0) / masteries.length * 100) / 100 : 0;

    return {
      studentId,
      level: p.level || 'not set',
      textsAttempted: textIds.length,
      totalAttempts,
      averageMastery: avgMastery,
      masteryLabel: core.masteryLabel(avgMastery),
    };
  }

  getReport(studentId) {
    const p = this.getProfile(studentId);
    const stats = p.readingStats || {};
    const details = [];
    for (const textId of Object.keys(stats)) {
      const st = stats[textId];
      const found = this._findText(textId);
      const mastery = core.calcMastery(st.attempts);
      details.push({
        textId,
        title: found ? found.text.title : textId,
        level: found ? found.level : '?',
        attempts: st.attempts.length,
        lastScore: st.attempts.length ? st.attempts[st.attempts.length - 1] : null,
        mastery,
        masteryLabel: core.masteryLabel(mastery),
        nextReview: st.nextReview,
      });
    }
    return {
      studentId,
      level: p.level || 'not set',
      createdAt: p.createdAt,
      texts: details,
    };
  }

  getNextTexts(studentId) {
    const p = this.getProfile(studentId);
    if (!p.level) throw new Error('No level set. Use set-level first.');
    const stats = p.readingStats || {};
    const todayStr = core.today();

    // Collect texts due for review
    const due = [];
    for (const textId of Object.keys(stats)) {
      const st = stats[textId];
      if (st.nextReview <= todayStr) {
        const found = this._findText(textId);
        due.push({
          textId,
          title: found ? found.text.title : textId,
          level: found ? found.level : '?',
          nextReview: st.nextReview,
          mastery: core.calcMastery(st.attempts),
        });
      }
    }

    // Also suggest unattempted texts at current level
    const texts = this._textsForLevel(p.level);
    const unattempted = texts
      .filter(t => !stats[t.id])
      .map(t => ({ textId: t.id, title: t.title, level: p.level, nextReview: 'new', mastery: 0 }));

    return {
      studentId,
      level: p.level,
      dueForReview: due,
      newTexts: unattempted,
    };
  }

  listStudents() {
    return { students: core.listProfiles(this.dir) };
  }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const tutor = new ReadingTutor();

core.runCLI((cmd, args, out) => {
  switch (cmd) {
    case 'start': {
      const [, sid, level] = args;
      if (!sid) throw new Error('Usage: start <studentId> [level]');
      if (level) tutor.setLevel(sid, level);
      const p = tutor.getProfile(sid);
      tutor._save(p);
      out({ message: `Profile loaded for ${sid}.`, level: p.level || 'not set' });
      break;
    }
    case 'set-level': {
      const [, sid, level] = args;
      if (!sid || !level) throw new Error('Usage: set-level <studentId> <level>');
      out(tutor.setLevel(sid, level));
      break;
    }
    case 'lesson': {
      const [, sid] = args;
      if (!sid) throw new Error('Usage: lesson <studentId>');
      out(tutor.generateLesson(sid));
      break;
    }
    case 'text': {
      const [, sid, textId] = args;
      if (!sid || !textId) throw new Error('Usage: text <studentId> <textId>');
      out(tutor.getText(sid, textId));
      break;
    }
    case 'check': {
      const [, sid, textId, qIndex, answer] = args;
      if (!sid || !textId || qIndex === undefined || answer === undefined) {
        throw new Error('Usage: check <studentId> <textId> <qIndex> <answer>');
      }
      out(tutor.checkAnswer(sid, textId, qIndex, answer));
      break;
    }
    case 'record': {
      const [, sid, textId, score, total] = args;
      if (!sid || !textId || score === undefined || total === undefined) {
        throw new Error('Usage: record <studentId> <textId> <score> <total>');
      }
      out(tutor.recordAssessment(sid, textId, score, total));
      break;
    }
    case 'progress': {
      const [, sid] = args;
      if (!sid) throw new Error('Usage: progress <studentId>');
      out(tutor.getProgress(sid));
      break;
    }
    case 'report': {
      const [, sid] = args;
      if (!sid) throw new Error('Usage: report <studentId>');
      out(tutor.getReport(sid));
      break;
    }
    case 'next': {
      const [, sid] = args;
      if (!sid) throw new Error('Usage: next <studentId>');
      out(tutor.getNextTexts(sid));
      break;
    }
    case 'texts': {
      const [, level] = args;
      out(tutor.getTextCatalog(level || null));
      break;
    }
    case 'students': {
      out({ students: tutor.listStudents() });
      break;
    }

    case 'help':
      out({ info: 'Use one of the commands listed in SKILL.md' });
      break;
    default:
      out({
        error: `Unknown command: ${cmd}`,
        commands: ['start', 'set-level', 'lesson', 'text', 'check', 'record', 'progress', 'report', 'next', 'texts', 'students'],
      });
  }
});
