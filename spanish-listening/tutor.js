#!/usr/bin/env node
'use strict';

const core = require('../_lib/core');

// ---------------------------------------------------------------------------
// Embedded exercise data by CEFR level
// ---------------------------------------------------------------------------

const EXERCISES = {
  A1: [
    {
      id: 'a1-dict-farmacia',
      title: 'En la farmacia',
      type: 'dictation',
      transcript: 'Buenos días. Necesito algo para el dolor de cabeza, por favor.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Buenos días. Necesito algo para el dolor de cabeza, por favor.',
          explanation: 'Note the accent on "días". "Dolor de cabeza" is the fixed phrase for headache.'
        }
      ],
      vocabulary: ['dolor de cabeza', 'necesitar', 'por favor'],
      connectedSpeechFeatures: []
    },
    {
      id: 'a1-dict-presentacion',
      title: 'Presentación personal',
      type: 'dictation',
      transcript: 'Me llamo María y tengo veinticinco años. Soy de Colombia.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Me llamo María y tengo veinticinco años. Soy de Colombia.',
          explanation: 'Accent on "María" and the ñ in "años" are essential. "Veinticinco" is one word.'
        }
      ],
      vocabulary: ['llamarse', 'tener años', 'ser de'],
      connectedSpeechFeatures: []
    },
    {
      id: 'a1-mp-perro-pero',
      title: 'Perro vs pero',
      type: 'minimal-pairs',
      transcript: 'El ___ corre por el parque.',
      questions: [
        {
          question: 'Which word fits: "pero" or "perro"?',
          answer: 'perro',
          explanation: 'Something runs through the park — a dog (perro), not "but" (pero). The trill /rr/ vs tap /r/ changes meaning.'
        }
      ],
      vocabulary: ['perro', 'pero', 'correr', 'parque'],
      connectedSpeechFeatures: ['tap vs trill /r/']
    },
    {
      id: 'a1-mp-caro-carro',
      title: 'Caro vs carro',
      type: 'minimal-pairs',
      transcript: 'Este restaurante es muy ___.',
      questions: [
        {
          question: 'Which word fits: "caro" or "carro"?',
          answer: 'caro',
          explanation: 'A restaurant is expensive (caro), not a car (carro). Single /r/ = tap, double /rr/ = trill.'
        }
      ],
      vocabulary: ['caro', 'carro', 'restaurante'],
      connectedSpeechFeatures: ['tap vs trill /r/']
    },
    {
      id: 'a1-comp-supermercado',
      title: 'En el supermercado',
      type: 'comprehension',
      transcript: 'CAJERA: Buenos días. Son cinco euros con cincuenta céntimos.\nCLIENTE: Aquí tiene. Diez euros.\nCAJERA: Muy bien. Su cambio: cuatro euros con cincuenta. Quiere la bolsa?\nCLIENTE: Sí, por favor.',
      questions: [
        {
          question: '¿Cuánto cuesta la compra?',
          answer: 'cinco euros con cincuenta céntimos',
          explanation: 'The cashier states the price: "Son cinco euros con cincuenta céntimos" (€5.50).'
        },
        {
          question: '¿Cuánto paga el cliente?',
          answer: 'diez euros',
          explanation: 'The client hands over ten euros: "Aquí tiene. Diez euros."'
        },
        {
          question: '¿Cuánto es el cambio?',
          answer: 'cuatro euros con cincuenta',
          explanation: '10.00 - 5.50 = 4.50. The cashier confirms: "cuatro euros con cincuenta."'
        }
      ],
      vocabulary: ['cajera', 'cambio', 'bolsa', 'céntimos'],
      connectedSpeechFeatures: []
    },
    {
      id: 'a1-comp-hotel',
      title: 'En la recepción del hotel',
      type: 'comprehension',
      transcript: 'RECEPCIONISTA: Buenas tardes. Tiene reserva?\nCLIENTE: Sí, a nombre de García. Una habitación doble para tres noches.\nRECEPCIONISTA: Perfecto. Habitación doscientos quince, segunda planta. El desayuno es de siete a diez en el comedor.\nCLIENTE: Muchas gracias.',
      questions: [
        {
          question: '¿Qué tipo de habitación tiene reservada?',
          answer: 'una habitación doble',
          explanation: 'The client says "una habitación doble" — a double room.'
        },
        {
          question: '¿Cuántas noches se queda?',
          answer: 'tres noches',
          explanation: '"Para tres noches" — three nights.'
        },
        {
          question: '¿A qué hora es el desayuno?',
          answer: 'de siete a diez',
          explanation: 'The receptionist says: "de siete a diez en el comedor."'
        }
      ],
      vocabulary: ['reserva', 'habitación doble', 'planta', 'desayuno', 'comedor'],
      connectedSpeechFeatures: []
    }
  ],

  A2: [
    {
      id: 'a2-dict-direcciones',
      title: 'Pidiendo direcciones',
      type: 'dictation',
      transcript: 'Perdone, ¿sabe dónde está la estación de tren? Siga todo recto y gire a la izquierda.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Perdone, ¿sabe dónde está la estación de tren? Siga todo recto y gire a la izquierda.',
          explanation: 'Accents on "dónde" (interrogative) and "está" (verb). "Estación" has an accent on the final syllable.'
        }
      ],
      vocabulary: ['perdone', 'estación', 'todo recto', 'girar', 'izquierda'],
      connectedSpeechFeatures: []
    },
    {
      id: 'a2-dict-tiempo',
      title: 'El pronóstico del tiempo',
      type: 'dictation',
      transcript: 'Mañana va a llover por la tarde, así que lleva un paraguas. Las temperaturas estarán entre quince y veinte grados.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Mañana va a llover por la tarde, así que lleva un paraguas. Las temperaturas estarán entre quince y veinte grados.',
          explanation: '"Mañana" (ñ), "así" (accent), "estarán" (accent on last syllable — future tense).'
        }
      ],
      vocabulary: ['llover', 'paraguas', 'temperatura', 'grados'],
      connectedSpeechFeatures: ['sinalefa: va‿a']
    },
    {
      id: 'a2-gap-basic',
      title: 'Rellenar huecos básico',
      type: 'gap-fill',
      transcript: 'No ___ qué decir.',
      questions: [
        {
          question: 'Fill the blank. The spoken form sounds like "No sé qué decir" with the "sé" weakly pronounced.',
          answer: 'sé',
          explanation: '"Sé" (I know) carries an accent to distinguish it from "se" (reflexive pronoun). In rapid speech it can be barely audible.'
        }
      ],
      vocabulary: ['saber', 'decir'],
      connectedSpeechFeatures: ['weak function words']
    },
    {
      id: 'a2-mp-esta-esta',
      title: 'Esta vs está',
      type: 'minimal-pairs',
      transcript: 'Ella ___ en la universidad.',
      questions: [
        {
          question: 'Which word fits: "esta" (this) or "está" (is)?',
          answer: 'está',
          explanation: '"Ella está en la universidad" — she IS at university. The accent mark shifts stress and changes from demonstrative to verb.'
        }
      ],
      vocabulary: ['esta', 'está', 'universidad'],
      connectedSpeechFeatures: ['stress contrast']
    },
    {
      id: 'a2-comp-medico',
      title: 'En el médico',
      type: 'comprehension',
      transcript: 'MÉDICO: ¿Qué le pasa?\nPACIENTE: Me duele mucho la garganta y tengo fiebre desde ayer.\nMÉDICO: Vamos a ver. Abra la boca, por favor. Sí, tiene la garganta muy roja. Le voy a recetar un antibiótico. Tome una pastilla cada ocho horas durante siete días. Y descanse mucho.\nPACIENTE: ¿Puedo ir a trabajar?\nMÉDICO: Mejor quédese en casa dos o tres días.',
      questions: [
        {
          question: '¿Cuáles son los síntomas del paciente?',
          answer: 'dolor de garganta y fiebre',
          explanation: '"Me duele mucho la garganta y tengo fiebre desde ayer."'
        },
        {
          question: '¿Cada cuántas horas debe tomar la pastilla?',
          answer: 'cada ocho horas',
          explanation: 'The doctor prescribes: "Tome una pastilla cada ocho horas."'
        },
        {
          question: '¿Cuántos días debe quedarse en casa?',
          answer: 'dos o tres días',
          explanation: '"Mejor quédese en casa dos o tres días."'
        }
      ],
      vocabulary: ['garganta', 'fiebre', 'recetar', 'antibiótico', 'pastilla', 'descansar'],
      connectedSpeechFeatures: []
    },
    {
      id: 'a2-comp-planes',
      title: 'Planes para el fin de semana',
      type: 'comprehension',
      transcript: 'ELENA: ¿Qué vas a hacer este fin de semana?\nPABLO: El sábado por la mañana voy a jugar al fútbol con mis amigos. Después quiero ir al cine. ¿Vienes?\nELENA: El sábado no puedo, tengo que estudiar para el examen del lunes. Pero el domingo estoy libre.\nPABLO: Pues el domingo podemos ir a comer a ese restaurante nuevo que han abierto en el centro.',
      questions: [
        {
          question: '¿Qué va a hacer Pablo el sábado por la mañana?',
          answer: 'jugar al fútbol con sus amigos',
          explanation: '"Voy a jugar al fútbol con mis amigos."'
        },
        {
          question: '¿Por qué no puede Elena el sábado?',
          answer: 'tiene que estudiar para un examen',
          explanation: '"Tengo que estudiar para el examen del lunes."'
        },
        {
          question: '¿Qué planean para el domingo?',
          answer: 'ir a comer a un restaurante nuevo en el centro',
          explanation: '"Podemos ir a comer a ese restaurante nuevo que han abierto en el centro."'
        }
      ],
      vocabulary: ['fin de semana', 'jugar al fútbol', 'cine', 'examen', 'libre'],
      connectedSpeechFeatures: ['sinalefa: que‿han']
    }
  ],

  B1: [
    {
      id: 'b1-dict-telefono',
      title: 'Conversación telefónica',
      type: 'dictation',
      transcript: 'Oye, ¿qué tal si quedamos el sábado para ir a esa exposición nueva que han abierto en el centro?',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Oye, ¿qué tal si quedamos el sábado para ir a esa exposición nueva que han abierto en el centro?',
          explanation: 'Key accents: "qué" (interrogative), "sábado" (esdrújula), "exposición" (aguda). Sinalefa links "para‿ir‿a‿esa".'
        }
      ],
      vocabulary: ['quedar', 'exposición', 'abrir'],
      connectedSpeechFeatures: ['sinalefa: para‿ir‿a‿esa']
    },
    {
      id: 'b1-dict-opinion',
      title: 'Dando una opinión',
      type: 'dictation',
      transcript: 'Creo que deberías llamarla antes de que se haga tarde, porque luego va a ser más difícil.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Creo que deberías llamarla antes de que se haga tarde, porque luego va a ser más difícil.',
          explanation: '"Deberías" (conditional), "más" (accent), "difícil" (accent). Note the subjunctive "se haga" after "antes de que".'
        }
      ],
      vocabulary: ['creer', 'deber', 'llamar', 'antes de que'],
      connectedSpeechFeatures: ['sinalefa: va‿a', 'subjunctive trigger: antes de que']
    },
    {
      id: 'b1-gap-vamos',
      title: 'Vamos a + infinitivo',
      type: 'gap-fill',
      transcript: '___ ___ salir esta noche.',
      questions: [
        {
          question: 'Fill the blanks. In natural speech "vamos a" is often reduced to "vam\'a" or run together.',
          answer: 'Vamos a',
          explanation: '"Vamos a" is the most common near-future construction. In fast speech the /s/ of "vamos" and the /a/ merge: "vam\'a salir".'
        }
      ],
      vocabulary: ['ir a + infinitivo', 'salir'],
      connectedSpeechFeatures: ['sinalefa: vamos‿a', 's-elision in vamo\'']
    },
    {
      id: 'b1-gap-haber',
      title: 'Pretérito perfecto reducido',
      type: 'gap-fill',
      transcript: 'No ___ ___ enterado de lo que pasó.',
      questions: [
        {
          question: 'Fill the blanks. The pronoun + auxiliary cluster runs together in natural speech.',
          answer: 'me he',
          explanation: '"No me he enterado" — the reflexive pronoun "me" + auxiliary "he" form a cluster that in fast speech sounds like one syllable: "me-e" or even "m\'e".'
        }
      ],
      vocabulary: ['enterarse', 'pretérito perfecto', 'pasar'],
      connectedSpeechFeatures: ['pronoun + auxiliary cluster']
    },
    {
      id: 'b1-comp-trabajo',
      title: 'Entrevista de trabajo',
      type: 'comprehension',
      transcript: 'ENTREVISTADORA: Cuénteme un poco sobre su experiencia profesional.\nCANDIDATO: Bueno, después de terminar la carrera de Administración de Empresas, estuve trabajando tres años en una empresa de marketing en Bogotá. Me encargaba de las campañas en redes sociales. Luego decidí venirme a Madrid para hacer un máster.\nENTREVISTADORA: ¿Y por qué le interesa este puesto?\nCANDIDATO: Porque combina lo que más me gusta: la creatividad y el análisis de datos. Además, su empresa tiene proyectos internacionales, y eso me motiva mucho.',
      questions: [
        {
          question: '¿Cuántos años trabajó el candidato en Bogotá?',
          answer: 'tres años',
          explanation: '"Estuve trabajando tres años en una empresa de marketing en Bogotá."'
        },
        {
          question: '¿Por qué se mudó a Madrid?',
          answer: 'para hacer un máster',
          explanation: '"Decidí venirme a Madrid para hacer un máster."'
        },
        {
          question: '¿Qué dos cosas le atraen del puesto?',
          answer: 'la creatividad y el análisis de datos',
          explanation: '"Combina lo que más me gusta: la creatividad y el análisis de datos."'
        }
      ],
      vocabulary: ['experiencia profesional', 'carrera', 'encargarse de', 'redes sociales', 'puesto', 'análisis de datos'],
      connectedSpeechFeatures: ['sinalefa: de‿empresas', 'consonant linking: máster‿en']
    },
    {
      id: 'b1-note-salud',
      title: 'Charla sobre alimentación saludable',
      type: 'note-taking',
      transcript: 'Hoy vamos a hablar sobre cómo mejorar nuestra alimentación. Lo primero es reducir el consumo de azúcar. Muchos productos que parecen saludables, como los yogures de sabores o los cereales de desayuno, tienen cantidades enormes de azúcar añadido. Lo segundo es comer más verduras y frutas frescas. Los expertos recomiendan al menos cinco porciones al día. Y lo tercero, que mucha gente olvida, es beber suficiente agua. La mayoría de las personas no bebe los dos litros recomendados. Un truco fácil es llevar siempre una botella de agua encima.',
      questions: [
        {
          question: 'List the three main recommendations from the talk.',
          answer: 'reducir el consumo de azúcar; comer más verduras y frutas frescas (cinco porciones al día); beber suficiente agua (dos litros)',
          explanation: 'The talk is structured with "lo primero", "lo segundo", "lo tercero" — signposting three clear points.'
        },
        {
          question: '¿Qué productos parecen saludables pero tienen mucha azúcar?',
          answer: 'yogures de sabores y cereales de desayuno',
          explanation: 'Supporting detail for the first point.'
        }
      ],
      vocabulary: ['alimentación', 'consumo', 'azúcar añadido', 'porciones', 'recomendado'],
      connectedSpeechFeatures: ['sinalefa: de‿azúcar', 'consonant linking: al‿menos']
    }
  ],

  B2: [
    {
      id: 'b2-dict-debate',
      title: 'Opinión sobre gentrificación',
      type: 'dictation',
      transcript: 'El problema no es que lleguen negocios nuevos al barrio, sino que los alquileres suben tanto que la gente que ha vivido ahí toda la vida ya no puede permitírselo.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'El problema no es que lleguen negocios nuevos al barrio, sino que los alquileres suben tanto que la gente que ha vivido ahí toda la vida ya no puede permitírselo.',
          explanation: 'Key: subjunctive "lleguen" after "no es que", "ahí" (accent), "permitírselo" (pronoun attachment). Connected speech runs "toda‿la‿vida" together.'
        }
      ],
      vocabulary: ['gentrificación', 'alquiler', 'barrio', 'permitirse'],
      connectedSpeechFeatures: ['sinalefa: toda‿la', 'subjunctive after expressions of denial']
    },
    {
      id: 'b2-dict-noticias',
      title: 'Fragmento de noticias',
      type: 'dictation',
      transcript: 'Según los últimos datos del Instituto Nacional de Estadística, el desempleo juvenil ha descendido un dos por ciento respecto al trimestre anterior, aunque los expertos advierten que la recuperación sigue siendo frágil.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'Según los últimos datos del Instituto Nacional de Estadística, el desempleo juvenil ha descendido un dos por ciento respecto al trimestre anterior, aunque los expertos advierten que la recuperación sigue siendo frágil.',
          explanation: 'Many accents: "Según", "últimos", "Estadística", "recuperación", "frágil". News register uses formal vocabulary and complex sentence structure.'
        }
      ],
      vocabulary: ['desempleo juvenil', 'descender', 'trimestre', 'advertir', 'recuperación'],
      connectedSpeechFeatures: ['consonant linking: Nacional‿de', 'formal register pacing']
    },
    {
      id: 'b2-gap-connected',
      title: 'Habla conectada: condicional compuesto',
      type: 'gap-fill',
      transcript: 'Se lo ___ ___ ___ si lo hubiera sabido.',
      questions: [
        {
          question: 'Fill the three blanks. In natural speech this conditional perfect cluster runs together.',
          answer: 'habría dicho antes',
          explanation: '"Se lo habría dicho antes si lo hubiera sabido." The cluster "habría dicho" in fast speech reduces to something like "abría dicho". The conditional perfect + pluperfect subjunctive is a key B2 pattern.'
        }
      ],
      vocabulary: ['condicional compuesto', 'pluscuamperfecto de subjuntivo', 'decir'],
      connectedSpeechFeatures: ['h-deletion in habría', 'conditional perfect structure']
    },
    {
      id: 'b2-gap-reduccion',
      title: 'Reducciones informales',
      type: 'gap-fill',
      transcript: 'Es que no ___ si ___ ___ poder ir, porque tengo un montón de cosas que hacer.',
      questions: [
        {
          question: 'Fill the blanks. The speaker uses natural fast speech.',
          answer: 'sé; voy a',
          explanation: '"No sé si voy a poder ir" — "voy a" reduces to "voy\'a" in fast speech. "Es que" is a hedging device very common in spoken Spanish.'
        }
      ],
      vocabulary: ['es que', 'un montón de', 'poder'],
      connectedSpeechFeatures: ['sinalefa: voy‿a', 'hedging with "es que"']
    },
    {
      id: 'b2-comp-debate',
      title: 'Debate sobre gentrificación',
      type: 'comprehension',
      transcript: 'MODERADOR: El tema de hoy es la gentrificación en las grandes ciudades latinoamericanas. Tenemos dos posturas. Adelante.\n\nPANELISTA 1: Mira, el problema no es que lleguen negocios nuevos al barrio — eso en principio está bien. El problema es cuando los alquileres suben tanto que la gente que ha vivido ahí toda la vida ya no puede permitírselo. Y eso es lo que está pasando en barrios como la Condesa en Ciudad de México o Palermo en Buenos Aires.\n\nPANELISTA 2: Bueno, pero también hay que reconocer que la inversión trae mejoras en infraestructura, seguridad, servicios... El barrio mejora objetivamente. La pregunta es cómo hacer que esas mejoras beneficien a todos, no solo a los que llegan con más poder adquisitivo.',
      questions: [
        {
          question: '¿Cuál es la postura del Panelista 1?',
          answer: 'La gentrificación sube los alquileres y desplaza a los residentes originales.',
          explanation: 'Panelista 1 argues that rising rents force out long-time residents: "la gente que ha vivido ahí toda la vida ya no puede permitírselo."'
        },
        {
          question: '¿Qué ejemplos da de barrios gentrificados?',
          answer: 'la Condesa en Ciudad de México y Palermo en Buenos Aires',
          explanation: 'Specific examples given to support the argument.'
        },
        {
          question: '¿Qué concede el Panelista 2 antes de dar su contraargumento?',
          answer: 'Concede que la inversión trae mejoras en infraestructura, seguridad y servicios.',
          explanation: 'Uses "pero también hay que reconocer" — a concession move before pivoting to the real question: how to make improvements benefit everyone.'
        },
        {
          question: '¿Cuál es la pregunta clave según el Panelista 2?',
          answer: 'Cómo hacer que las mejoras beneficien a todos, no solo a los que tienen más dinero.',
          explanation: '"La pregunta es cómo hacer que esas mejoras beneficien a todos, no solo a los que llegan con más poder adquisitivo."'
        }
      ],
      vocabulary: ['gentrificación', 'alquiler', 'inversión', 'infraestructura', 'poder adquisitivo', 'postura'],
      connectedSpeechFeatures: ['sinalefa: que‿ha', 'consonant linking: también‿hay']
    },
    {
      id: 'b2-note-urbanizacion',
      title: 'Conferencia: urbanización y biodiversidad',
      type: 'note-taking',
      transcript: 'Lo que hemos estado viendo esta semana es cómo la urbanización afecta a la biodiversidad — y no siempre de la manera que uno esperaría. Si bien es cierto que la expansión de las ciudades suele destruir hábitats naturales, investigaciones recientes sugieren que los espacios verdes urbanos — parques, jardines, incluso cubiertas vegetales en azoteas — pueden albergar una variedad sorprendente de especies. Un estudio realizado en Barcelona encontró que los parques urbanos contenían el sesenta por ciento de las especies de aves que se encuentran en los bosques circundantes. Otro estudio en Ciudad de México documentó más de cien especies de mariposas en jardines urbanos. Esto no significa que la urbanización sea buena para la biodiversidad, sino que un diseño urbano inteligente puede mitigar significativamente el daño.',
      questions: [
        {
          question: 'What is the main argument of the lecture?',
          answer: 'Urban green spaces can host a surprising variety of species, so smart urban design can mitigate biodiversity loss from urbanization.',
          explanation: 'The lecture presents a nuanced view: urbanization generally harms biodiversity, BUT urban green spaces partially compensate.'
        },
        {
          question: '¿Qué datos aporta el estudio de Barcelona?',
          answer: 'Los parques urbanos contenían el 60% de las especies de aves de los bosques circundantes.',
          explanation: 'A specific statistic supporting the main claim.'
        },
        {
          question: '¿Qué se encontró en Ciudad de México?',
          answer: 'Más de cien especies de mariposas en jardines urbanos.',
          explanation: 'Second piece of evidence supporting the argument.'
        }
      ],
      vocabulary: ['urbanización', 'biodiversidad', 'hábitat', 'albergar', 'cubiertas vegetales', 'azoteas', 'mitigar'],
      connectedSpeechFeatures: ['sinalefa: de‿especies', 'consonant linking: urbanos‿—', 'academic register']
    }
  ],

  C1: [
    {
      id: 'c1-dict-argentina',
      title: 'Conversación informal argentina',
      type: 'dictation',
      transcript: 'Che, viste lo que pasó con el tema del alquiler? Al final el dueño nos quiere subir un treinta por ciento.',
      questions: [
        {
          question: 'Write the full sentence. The speaker uses Argentine Spanish features.',
          answer: 'Che, ¿viste lo que pasó con el tema del alquiler? Al final el dueño nos quiere subir un treinta por ciento.',
          explanation: '"Che" is an Argentine interjection. "Viste" is used as a discourse marker (did you see/hear about). "Pasó" (accent — preterite), "dueño" (ñ). Argentine speakers use voseo but this sentence doesn\'t show it.'
        }
      ],
      vocabulary: ['che', 'viste (discourse marker)', 'dueño', 'alquiler', 'subir'],
      connectedSpeechFeatures: ['Argentine interjection "che"', 'voseo context']
    },
    {
      id: 'c1-dict-reducido',
      title: 'Habla muy reducida',
      type: 'dictation',
      transcript: 'Mira, la verdad es que no me apetece nada, pero bueno, si tú quieres vamos.',
      questions: [
        {
          question: 'Write the standard form. You hear: "Mira, la verdad es que no me apetece na\', pero bueno, si tú quiere\' vamo\'."',
          answer: 'Mira, la verdad es que no me apetece nada, pero bueno, si tú quieres vamos.',
          explanation: 'Reductions: "na\'" = nada (d-dropping), "quiere\'" = quieres (s-aspiration), "vamo\'" = vamos (s-deletion). All very common in informal peninsular and Caribbean speech.'
        }
      ],
      vocabulary: ['apetecer', 'la verdad es que', 'pero bueno'],
      connectedSpeechFeatures: ['d-dropping: nada → na\'', 's-aspiration: quieres → quiere\'', 's-deletion: vamos → vamo\'']
    },
    {
      id: 'c1-gap-regional',
      title: 'Reducciones regionales fuertes',
      type: 'gap-fill',
      transcript: '___ ___ quieres eso?',
      questions: [
        {
          question: 'Fill the blanks. You hear: "Pa\' qué quiere\' eso?" — reconstruct the standard form.',
          answer: 'Para qué',
          explanation: '"Pa\'" = para (universal informal reduction). Combined with s-aspiration on "quieres", this is typical C1-level fast speech.'
        }
      ],
      vocabulary: ['para qué', 'para → pa\''],
      connectedSpeechFeatures: ['para → pa\'', 's-aspiration']
    },
    {
      id: 'c1-gap-cluster',
      title: 'Cluster verbal reducido',
      type: 'gap-fill',
      transcript: '___ ___ ___ que estudiar más.',
      questions: [
        {
          question: 'Fill the blanks. The spoken form compresses a modal verb cluster.',
          answer: 'Tendrías que haber',
          explanation: '"Tendrías que haber (estudiado más)" — conditional of obligation + perfect infinitive. In fast speech "tendrías" loses the final /s/ and "que haber" runs together.'
        }
      ],
      vocabulary: ['tener que + haber + participio', 'condicional de obligación'],
      connectedSpeechFeatures: ['s-aspiration on tendrías', 'h-deletion in haber', 'que‿haber cluster']
    },
    {
      id: 'c1-comp-argentina',
      title: 'Problema con el alquiler (Argentina)',
      type: 'comprehension',
      transcript: 'MARTÍN: Che, viste lo que pasó con el tema del alquiler? Al final el dueño nos quiere subir un treinta por ciento. Un treinta. Estamos re locos si aceptamos eso.\n\nLUCÍA: Ay, no... ¿y qué van a hacer? Porque mudarse ahora sería un quilombo, con todo lo del laburo y eso.\n\nMARTÍN: Y sí, pero ¿qué opción tenemos? Si nos quedamos, nos funden. Y encima el tipo ni arregla nada — hace dos meses que le venimos pidiendo que arregle la calefacción.\n\nLUCÍA: Mirá, yo que vos, le mando una carta documento. Eso los pone nerviosos al toque.',
      questions: [
        {
          question: '¿Cuánto quiere subir el dueño el alquiler?',
          answer: 'un treinta por ciento',
          explanation: 'Explicit detail stated twice for emphasis: "un treinta por ciento. Un treinta."'
        },
        {
          question: '¿Qué significa "quilombo" en este contexto?',
          answer: 'un lío / un desastre / un problema grande',
          explanation: '"Quilombo" is Argentine slang for a big mess or chaotic situation. "Sería un quilombo" = it would be a disaster.'
        },
        {
          question: '¿Qué problema adicional tienen con el dueño?',
          answer: 'No arregla la calefacción a pesar de que llevan dos meses pidiéndolo.',
          explanation: '"Hace dos meses que le venimos pidiendo que arregle la calefacción" — perifrastic construction for ongoing action.'
        },
        {
          question: '¿Qué le recomienda Lucía?',
          answer: 'Mandarle una carta documento (formal legal notice).',
          explanation: '"Yo que vos, le mando una carta documento" — Argentine conditional advice using "yo que vos" (= yo que tú). A "carta documento" is an Argentine legal communication tool.'
        }
      ],
      vocabulary: ['quilombo', 'laburo', 're (intensifier)', 'fundir', 'encima', 'al toque', 'carta documento'],
      connectedSpeechFeatures: ['Argentine voseo: "vos", "mirá"', 'slang: quilombo, laburo, al toque', 're as intensifier']
    },
    {
      id: 'c1-note-economia',
      title: 'Conferencia: economía digital en Latinoamérica',
      type: 'note-taking',
      transcript: 'La transformación digital en Latinoamérica presenta un panorama contradictorio. Por un lado, la región ha experimentado un crecimiento explosivo del comercio electrónico — solo en dos mil veinte, las ventas en línea crecieron un treinta y seis por ciento en la región, impulsadas por la pandemia. Países como Brasil, México y Argentina lideran esta tendencia. Sin embargo, persiste una brecha digital alarmante: aproximadamente un cuarenta por ciento de la población latinoamericana aún no tiene acceso a internet de banda ancha. En zonas rurales de países como Bolivia, Honduras y Guatemala, esa cifra supera el setenta por ciento. Esto significa que la economía digital está creando una nueva forma de desigualdad. Los que tienen conectividad acceden a empleos remotos, educación en línea y servicios financieros digitales. Los que no, quedan excluidos de una parte cada vez más importante de la economía. La solución no es solo infraestructura — también requiere alfabetización digital y políticas públicas que garanticen acceso equitativo.',
      questions: [
        {
          question: 'What is the central contradiction the speaker describes?',
          answer: 'Explosive e-commerce growth coexists with a severe digital divide — 40% of Latin Americans lack broadband.',
          explanation: 'The talk is structured around "por un lado... sin embargo" — a classic contrast pattern.'
        },
        {
          question: '¿Qué porcentaje creció el comercio electrónico en 2020?',
          answer: 'un 36%',
          explanation: '"Las ventas en línea crecieron un treinta y seis por ciento."'
        },
        {
          question: '¿Qué países lideran el comercio electrónico?',
          answer: 'Brasil, México y Argentina',
          explanation: 'Specific examples supporting the growth claim.'
        },
        {
          question: '¿Cuál es la cifra de exclusión digital en zonas rurales?',
          answer: 'Más del 70% sin internet de banda ancha.',
          explanation: '"En zonas rurales de países como Bolivia, Honduras y Guatemala, esa cifra supera el setenta por ciento."'
        },
        {
          question: '¿Qué soluciones propone además de infraestructura?',
          answer: 'Alfabetización digital y políticas públicas de acceso equitativo.',
          explanation: '"También requiere alfabetización digital y políticas públicas que garanticen acceso equitativo."'
        }
      ],
      vocabulary: ['brecha digital', 'banda ancha', 'comercio electrónico', 'alfabetización digital', 'acceso equitativo', 'desigualdad'],
      connectedSpeechFeatures: ['academic register', 'por un lado... sin embargo contrast', 'numbers in speech']
    }
  ],

  C2: [
    {
      id: 'c2-dict-chileno',
      title: 'Habla informal chilena',
      type: 'dictation',
      transcript: 'Oye, ¿cachai que al final el loco no pescó ni una cosa de lo que le dijimos? O sea, le explicamos todo al tiro y el tipo ahí nomás, como si nada, pues.',
      questions: [
        {
          question: 'Write the standard Spanish. You hear: "Oye, ¿cachai que al final el loco no pescó ni una wea de lo que le dijimos? O sea, le explicamos todo al tiro y el tipo ahí nomás, como si nada po\'."',
          answer: 'Oye, ¿cachai que al final el loco no pescó ni una cosa de lo que le dijimos? O sea, le explicamos todo al tiro y el tipo ahí nomás, como si nada, pues.',
          explanation: 'Chilean slang: "cachai" = ¿entiendes? (from English "catch"), "loco" = guy, "pescar" = to pay attention, "wea" = cosa (vulgar Chilean), "al tiro" = inmediatamente, "po\'" = pues.'
        }
      ],
      vocabulary: ['cachai', 'pescar (Chilean: pay attention)', 'al tiro', 'po\'', 'loco (guy)'],
      connectedSpeechFeatures: ['Chilean s-aspiration', 'po\' = pues', 'wea = cosa']
    },
    {
      id: 'c2-dict-cubano',
      title: 'Habla informal cubana',
      type: 'dictation',
      transcript: 'Asere, ¿qué bolá? Mira, ayer fui para la bodega a buscar el mandado y no había nada. La cola era kilométrica y al final me quedé sin nada. Esto está de madre, compadre.',
      questions: [
        {
          question: 'Write the standard form. You hear: "Asere, ¿qué bolá? Mira, ayer fui pa\' la bodega a buscah el mandao y no había na\'. La cola era kilométrica y al final me quedé sin na\'. Ehto ehtá de madre, compadre."',
          answer: 'Asere, ¿qué bolá? Mira, ayer fui para la bodega a buscar el mandado y no había nada. La cola era kilométrica y al final me quedé sin nada. Esto está de madre, compadre.',
          explanation: 'Cuban: "asere" = buddy, "qué bolá" = what\'s up, "bodega" = corner store, "mandado" = groceries, "de madre" = terrible. S-aspiration throughout, d-dropping in "mandao".'
        }
      ],
      vocabulary: ['asere', 'qué bolá', 'bodega (Cuban)', 'mandado', 'de madre', 'compadre'],
      connectedSpeechFeatures: ['Caribbean s-aspiration', 'd-dropping: mandado → mandao', 'para → pa\'']
    },
    {
      id: 'c2-dict-mexicano',
      title: 'Jerga mexicana',
      type: 'dictation',
      transcript: 'No manches, güey, neta que se pasó de lanza. Le dijimos que no le hiciera al chistoso y ahí va el cuate haciéndose el payaso. Ya ni la amuela.',
      questions: [
        {
          question: 'Write the full sentence you heard.',
          answer: 'No manches, güey, neta que se pasó de lanza. Le dijimos que no le hiciera al chistoso y ahí va el cuate haciéndose el payaso. Ya ni la amuela.',
          explanation: 'Mexican slang: "no manches" = no way, "güey" = dude, "neta" = really/truth, "pasarse de lanza" = to go too far, "cuate" = buddy, "hacerse el payaso" = to act like a clown, "ya ni la amuela" = that\'s the last straw.'
        }
      ],
      vocabulary: ['no manches', 'güey', 'neta', 'pasarse de lanza', 'cuate', 'ya ni la amuela'],
      connectedSpeechFeatures: ['Mexican intonation', 'informal register']
    },
    {
      id: 'c2-mp-sarcasmo',
      title: 'Detección de sarcasmo',
      type: 'minimal-pairs',
      transcript: 'Context: A colleague arrives 45 minutes late to a meeting. The boss says: "Qué amable de tu parte honrarnos con tu presencia."',
      questions: [
        {
          question: 'Is the boss being sincere or sarcastic? Explain how you know.',
          answer: 'sarcastic',
          explanation: 'The formal register ("honrarnos con tu presencia") is absurdly elevated for the situation. The exaggerated politeness signals sarcasm — the boss is criticizing the tardiness, not genuinely expressing gratitude.'
        }
      ],
      vocabulary: ['honrar', 'presencia', 'sarcasmo', 'registro elevado'],
      connectedSpeechFeatures: ['register mismatch as sarcasm signal']
    },
    {
      id: 'c2-comp-regional',
      title: 'Identificación de variedades regionales',
      type: 'comprehension',
      transcript: 'Version A: "Vos sabés que ella no va a venir, che. Dejate de joder."\nVersion B: "Tú sabes que ella no va a venir, güey. Ya déjate de mamadas."\nVersion C: "Vosotros sabéis que ella no va a venir. Dejad de hacer el tonto."',
      questions: [
        {
          question: '¿De qué país o región es cada versión?',
          answer: 'A = Argentina, B = México, C = España',
          explanation: 'A: voseo (vos sabés), "che", "joder" (also common in Argentina). B: "tú" + "güey" + "mamadas" = Mexican slang. C: vosotros + imperative "dejad" = Castilian Spanish.'
        },
        {
          question: '¿Qué rasgos lingüísticos identifican cada variedad?',
          answer: 'A: voseo + che; B: tuteo + güey; C: vosotros + imperative plural in -ad',
          explanation: 'The pronoun system (vos/tú/vosotros) is the clearest marker, reinforced by regional slang and verb morphology.'
        }
      ],
      vocabulary: ['voseo', 'tuteo', 'vosotros', 'variedad regional'],
      connectedSpeechFeatures: ['accent identification', 'register and slang markers']
    },
    {
      id: 'c2-note-migracion',
      title: 'Conferencia: migración venezolana',
      type: 'note-taking',
      transcript: 'La diáspora venezolana constituye uno de los mayores desplazamientos poblacionales en la historia reciente de América Latina. Desde dos mil quince, más de siete millones de venezolanos han abandonado el país — una cifra comparable, en términos proporcionales, al éxodo sirio. Los principales países receptores — Colombia, Perú, Chile, Ecuador y Brasil — han enfrentado desafíos enormes de integración. Colombia, que comparte una frontera de más de dos mil kilómetros con Venezuela, ha recibido aproximadamente dos millones y medio de migrantes, implementando un estatuto temporal de protección que ha sido elogiado por organismos internacionales. Sin embargo, la xenofobia ha crecido en varios países receptores. En Perú y Chile, encuestas recientes muestran que más del sesenta por ciento de la población tiene una percepción negativa de la inmigración venezolana, a pesar de que los datos económicos sugieren que los migrantes contribuyen positivamente al PIB. Este fenómeno refleja una tensión fundamental: la solidaridad inicial se erosiona cuando los recursos públicos se perciben como escasos. La respuesta regional ha sido desigual — mientras algunos países han facilitado la regularización, otros han endurecido los requisitos de visa y cerrado fronteras.',
      questions: [
        {
          question: '¿Cuántos venezolanos han emigrado desde 2015?',
          answer: 'Más de siete millones.',
          explanation: 'Opening statistic to frame the scale of the crisis.'
        },
        {
          question: '¿Con qué se compara la cifra de emigración venezolana?',
          answer: 'Con el éxodo sirio, en términos proporcionales.',
          explanation: 'A striking comparison to convey magnitude.'
        },
        {
          question: '¿Qué ha hecho Colombia para gestionar la migración?',
          answer: 'Implementó un estatuto temporal de protección, elogiado internacionalmente.',
          explanation: 'Specific policy example — a positive case.'
        },
        {
          question: '¿Qué contradicción señala el ponente sobre la xenofobia?',
          answer: 'Más del 60% tiene percepción negativa de los migrantes, pero los datos muestran que contribuyen positivamente al PIB.',
          explanation: 'The speaker highlights the gap between perception and economic reality.'
        },
        {
          question: '¿Cuál es la "tensión fundamental" que describe?',
          answer: 'La solidaridad inicial se erosiona cuando los recursos públicos se perciben como escasos.',
          explanation: 'Abstract analytical point — the core thesis of the lecture.'
        }
      ],
      vocabulary: ['diáspora', 'desplazamiento', 'éxodo', 'estatuto de protección', 'xenofobia', 'regularización', 'PIB'],
      connectedSpeechFeatures: ['academic register', 'complex subordination', 'nuanced hedging: "a pesar de que"']
    }
  ]
};

// ---------------------------------------------------------------------------
// Flatten exercises for quick lookup
// ---------------------------------------------------------------------------

const ALL_EXERCISES = {};
for (const level of core.CEFR) {
  if (EXERCISES[level]) {
    for (const ex of EXERCISES[level]) {
      ALL_EXERCISES[ex.id] = { ...ex, level };
    }
  }
}

// ---------------------------------------------------------------------------
// ListeningTutor class
// ---------------------------------------------------------------------------

class ListeningTutor {
  constructor() {
    this.dir = core.dataDir('spanish-listening');
    core.ensureDir(this.dir);
  }

  // ---- Profile management ----

  getProfile(studentId) {
    const p = core.loadProfile(this.dir, studentId);
    if (!p.skills) p.skills = {};
    if (!p.assessments) p.assessments = [];
    if (!p.sessions) p.sessions = [];
    if (!p.exerciseHistory) p.exerciseHistory = {};
    return p;
  }

  _save(p) {
    core.saveProfile(this.dir, p);
  }

  setLevel(studentId, level) {
    level = level.toUpperCase();
    if (!core.CEFR.includes(level)) throw new Error('Invalid CEFR level: ' + level);
    const p = this.getProfile(studentId);
    p.level = level;
    this._save(p);
    return { studentId, level };
  }

  // ---- Exercise catalog ----

  getExerciseCatalog(level) {
    if (level) {
      return (EXERCISES[level] || []).map(e => ({
        id: e.id, title: e.title, type: e.type, level,
        questionCount: e.questions.length
      }));
    }
    const catalog = {};
    for (const lv of core.CEFR) {
      if (EXERCISES[lv]) {
        catalog[lv] = EXERCISES[lv].map(e => ({
          id: e.id, title: e.title, type: e.type,
          questionCount: e.questions.length
        }));
      }
    }
    return catalog;
  }

  // ---- Exercise generation ----

  generateExercise(studentId, type) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    let pool = EXERCISES[level] || EXERCISES.A1;
    if (type) {
      pool = pool.filter(e => e.type === type);
      if (!pool.length) throw new Error(`No exercises of type "${type}" at level ${level}`);
    }

    // Prefer exercises not recently done
    const history = p.exerciseHistory || {};
    const unseen = pool.filter(e => !history[e.id]);
    const chosen = unseen.length ? core.pick(unseen, 1)[0] : core.pick(pool, 1)[0];

    return {
      exerciseId: chosen.id,
      level,
      type: chosen.type,
      title: chosen.title,
      transcript: chosen.transcript,
      questions: chosen.questions.map((q, i) => ({
        index: i,
        question: q.question
      })),
      vocabulary: chosen.vocabulary,
      connectedSpeechFeatures: chosen.connectedSpeechFeatures
    };
  }

  generateLesson(studentId) {
    const p = this.getProfile(studentId);
    const level = p.level || 'A1';
    const pool = EXERCISES[level] || EXERCISES.A1;

    // Pick up to 4 exercises, varying types
    const types = [...new Set(pool.map(e => e.type))];
    const lesson = [];
    for (const t of core.shuffle(types).slice(0, 4)) {
      const ofType = pool.filter(e => e.type === t);
      lesson.push(core.pick(ofType, 1)[0]);
    }

    return {
      studentId,
      level,
      date: core.today(),
      exercises: lesson.map(ex => ({
        exerciseId: ex.id,
        type: ex.type,
        title: ex.title,
        transcript: ex.transcript,
        questions: ex.questions.map((q, i) => ({ index: i, question: q.question })),
        vocabulary: ex.vocabulary,
        connectedSpeechFeatures: ex.connectedSpeechFeatures
      }))
    };
  }

  // ---- Answer checking ----

  checkAnswer(studentId, exerciseId, answerText, questionIndex) {
    const ex = ALL_EXERCISES[exerciseId];
    if (!ex) throw new Error('Exercise not found: ' + exerciseId);

    const results = [];
    for (const q of ex.questions) {
      const normAnswer = core.norm(answerText);
      const normExpected = core.norm(q.answer);
      const exact = normAnswer === normExpected;
      const partial = !exact && normExpected.split(' ').filter(w =>
        normAnswer.split(' ').includes(w)
      ).length / normExpected.split(' ').length;

      results.push({
        question: q.question,
        expected: q.answer,
        given: answerText,
        correct: exact,
        partialScore: exact ? 1 : Math.round((partial || 0) * 100) / 100,
        explanation: q.explanation
      });
    }

    // Record in profile
    const p = this.getProfile(studentId);
    if (!p.exerciseHistory) p.exerciseHistory = {};
    p.exerciseHistory[exerciseId] = {
      lastAttempt: core.today(),
      results,
      type: ex.type,
      level: ex.level
    };
    this._save(p);

    return {
      exerciseId,
      type: ex.type,
      level: ex.level,
      results
    };
  }

  // ---- Assessment recording ----

  recordAssessment(studentId, exerciseId, score, total) {
    const ex = ALL_EXERCISES[exerciseId];
    if (!ex) throw new Error('Exercise not found: ' + exerciseId);

    const p = this.getProfile(studentId);
    const skillKey = `${ex.level}-${ex.type}`;

    if (!p.skills[skillKey]) {
      p.skills[skillKey] = {
        level: ex.level,
        type: ex.type,
        attempts: [],
        stability: 1,
        difficulty: 5,
        lastReview: null,
        nextReview: null
      };
    }

    const sk = p.skills[skillKey];
    sk.attempts.push({ score, total, date: core.today(), exerciseId });
    if (sk.attempts.length > 20) sk.attempts = sk.attempts.slice(-20);

    // FSRS update
    const grade = total > 0 ? Math.min(4, Math.max(1, Math.round((score / total) * 4))) : 1;
    sk.stability = core.fsrsUpdateStability(sk.stability, sk.difficulty, Math.max(1, grade));
    sk.difficulty = core.fsrsUpdateDifficulty(sk.difficulty, Math.max(1, grade));
    sk.lastReview = core.today();
    sk.nextReview = (() => {
      const d = new Date();
      d.setDate(d.getDate() + core.fsrsNextReview(sk.stability));
      return d.toISOString().slice(0, 10);
    })();

    p.assessments.push({
      exerciseId,
      skillKey,
      score,
      total,
      date: core.today()
    });

    this._save(p);
    return {
      studentId,
      exerciseId,
      skillKey,
      score,
      total,
      mastery: core.calcMastery(sk.attempts),
      masteryLabel: core.masteryLabel(core.calcMastery(sk.attempts)),
      nextReview: sk.nextReview
    };
  }

  // ---- Progress & reports ----

  getProgress(studentId) {
    const p = this.getProfile(studentId);
    const progress = {};
    for (const [key, sk] of Object.entries(p.skills || {})) {
      progress[key] = {
        level: sk.level,
        type: sk.type,
        mastery: core.calcMastery(sk.attempts),
        masteryLabel: core.masteryLabel(core.calcMastery(sk.attempts)),
        attempts: (sk.attempts || []).length,
        nextReview: sk.nextReview
      };
    }
    return { studentId, level: p.level, progress };
  }

  getReport(studentId) {
    const p = this.getProfile(studentId);
    const progress = this.getProgress(studentId);

    // Summary by type
    const byType = {};
    for (const [, sk] of Object.entries(p.skills || {})) {
      if (!byType[sk.type]) byType[sk.type] = { attempts: 0, totalScore: 0, totalPossible: 0 };
      for (const a of sk.attempts || []) {
        byType[sk.type].attempts++;
        byType[sk.type].totalScore += a.score;
        byType[sk.type].totalPossible += a.total;
      }
    }
    for (const t of Object.keys(byType)) {
      byType[t].accuracy = byType[t].totalPossible > 0
        ? Math.round(byType[t].totalScore / byType[t].totalPossible * 100) : 0;
    }

    // Summary by level
    const byLevel = {};
    for (const [, sk] of Object.entries(p.skills || {})) {
      if (!byLevel[sk.level]) byLevel[sk.level] = { skills: 0, mastered: 0 };
      byLevel[sk.level].skills++;
      if (core.calcMastery(sk.attempts) >= core.MASTERY_THRESHOLD) byLevel[sk.level].mastered++;
    }

    return {
      studentId,
      level: p.level,
      createdAt: p.createdAt,
      totalAssessments: (p.assessments || []).length,
      skillProgress: progress.progress,
      byType,
      byLevel,
      recentActivity: (p.assessments || []).slice(-10).reverse()
    };
  }

  getNextExercises(studentId) {
    const p = this.getProfile(studentId);
    const now = core.today();
    const due = [];

    for (const [key, sk] of Object.entries(p.skills || {})) {
      if (sk.nextReview && sk.nextReview <= now) {
        due.push({
          skillKey: key,
          level: sk.level,
          type: sk.type,
          mastery: core.calcMastery(sk.attempts),
          dueDate: sk.nextReview
        });
      }
    }

    // Also suggest new exercise types not yet attempted at current level
    const level = p.level || 'A1';
    const pool = EXERCISES[level] || [];
    const triedTypes = new Set(Object.values(p.skills || {})
      .filter(sk => sk.level === level)
      .map(sk => sk.type));
    const newTypes = [...new Set(pool.map(e => e.type))].filter(t => !triedTypes.has(t));

    return {
      studentId,
      level,
      dueForReview: due.sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
      newTypesToTry: newTypes
    };
  }

  // ---- Admin ----

  listStudents() {
    return core.listProfiles(this.dir);
  }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const tutor = new ListeningTutor();

core.runCLI((cmd, args, out) => {
  switch (cmd) {
    case 'start': {
      const id = args[1];
      if (!id) throw new Error('Usage: start <studentId> [level]');
      const level = args[2] || 'A1';
      if (!core.CEFR.includes(level)) throw new Error('Invalid level: ' + level);
      const p = tutor.getProfile(id);
      if (!p.level) p.level = level;
      tutor._save(p);
      out({ studentId: id, level: p.level, status: 'ready' });
      break;
    }
    case 'set-level': {
      const id = args[1], level = args[2];
      if (!id || !level) throw new Error('Usage: set-level <studentId> <level>');
      out(tutor.setLevel(id, level));
      break;
    }
    case 'lesson': {
      const id = args[1];
      if (!id) throw new Error('Usage: lesson <studentId>');
      out(tutor.generateLesson(id));
      break;
    }
    case 'exercise': {
      const id = args[1], type = args[2] || null;
      if (!id) throw new Error('Usage: exercise <studentId> [type]');
      out(tutor.generateExercise(id, type));
      break;
    }
    case 'check': {
      const id = args[1], exId = args[2], answer = args.slice(3).join(' ');
      if (!id || !exId || !answer) throw new Error('Usage: check <studentId> <exerciseId> <answer>');
      out(tutor.checkAnswer(id, exId, answer, parseInt(args[4], 10) || null));
      break;
    }
    case 'record': {
      const id = args[1], exId = args[2], score = parseInt(args[3]), total = parseInt(args[4]);
      if (!id || !exId || isNaN(score) || isNaN(total)) throw new Error('Usage: record <studentId> <exerciseId> <score> <total>');
      out(tutor.recordAssessment(id, exId, score, total));
      break;
    }
    case 'progress': {
      const id = args[1];
      if (!id) throw new Error('Usage: progress <studentId>');
      out(tutor.getProgress(id));
      break;
    }
    case 'report': {
      const id = args[1];
      if (!id) throw new Error('Usage: report <studentId>');
      out(tutor.getReport(id));
      break;
    }
    case 'next': {
      const id = args[1];
      if (!id) throw new Error('Usage: next <studentId>');
      out(tutor.getNextExercises(id));
      break;
    }
    case 'exercises': {
      const level = args[1] || null;
      out(tutor.getExerciseCatalog(level));
      break;
    }
    case 'students': {
      out({ students: tutor.listStudents() });
      break;
    }
    case 'help':
      out({ commands: ['start', 'set-level', 'lesson', 'exercise', 'check', 'record',
                   'progress', 'report', 'next', 'exercises', 'students'] });
      break;
    default:
      out({
        error: 'Unknown command: ' + cmd,
        commands: ['start', 'set-level', 'lesson', 'exercise', 'check', 'record',
                   'progress', 'report', 'next', 'exercises', 'students']
      });
  }
});
