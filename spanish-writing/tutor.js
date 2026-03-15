const core = require('../_lib/core');

// ── Correction categories ──────────────────────────────────────────────────
const CORRECTION_CATEGORIES = [
  'gender', 'agreement', 'ser-estar', 'tense',
  'subjunctive', 'por-para', 'spelling', 'punctuation',
];

// ── Prompts by CEFR level ──────────────────────────────────────────────────
const PROMPTS = {
  A1: [
    {
      id: 'a1-personal-1', category: 'personal', title: 'Postal desde vacaciones',
      type: 'postcard',
      instructions: 'Escribe una postal a un amigo desde un lugar de vacaciones. Incluye: dónde estás, qué tiempo hace, qué haces cada día. (30-50 palabras)',
      targetStructures: ['present tense regular verbs', 'estar + location', 'hacer for weather'],
      rubric: {
        content: 'Mentions location, weather, and daily activity',
        grammar: 'Correct present tense conjugation of regular -ar/-er/-ir verbs',
        vocabulary: 'Basic travel and weather words used appropriately',
        organization: 'Greeting, body, farewell structure',
      },
      modelResponse: 'Querido Pablo: Estoy en Barcelona. Hace mucho sol y calor. Todos los días visito la playa y como paella. La ciudad es muy bonita. ¡Hasta pronto! Ana',
    },
    {
      id: 'a1-personal-2', category: 'personal', title: 'Mi familia',
      type: 'description',
      instructions: 'Describe a tu familia. Incluye: nombres, edades, profesiones y algo que les gusta hacer. (40-60 palabras)',
      targetStructures: ['ser for descriptions', 'tener for age', 'possessive adjectives'],
      rubric: {
        content: 'Names at least 3 family members with details',
        grammar: 'Correct use of ser/tener; gender agreement with adjectives',
        vocabulary: 'Family terms, numbers, professions',
        organization: 'Logical grouping of family members',
      },
      modelResponse: 'Mi familia es pequeña. Mi padre se llama Carlos y tiene 45 años. Es profesor. Mi madre se llama María y tiene 42 años. Es doctora. Mi hermana Ana tiene 12 años. Es estudiante. Los fines de semana nos gusta ir al parque.',
    },
    {
      id: 'a1-formal-1', category: 'formal', title: 'Reserva de hotel',
      type: 'email',
      instructions: 'Escribe un correo electrónico corto para reservar una habitación de hotel. Incluye: fechas, tipo de habitación, número de personas. (30-50 palabras)',
      targetStructures: ['querer/necesitar + infinitive', 'numbers and dates', 'formal usted'],
      rubric: {
        content: 'Includes dates, room type, number of guests',
        grammar: 'Correct formal register (usted); querer + infinitive',
        vocabulary: 'Hotel vocabulary: habitación, reserva, noche',
        organization: 'Greeting, request, sign-off',
      },
      modelResponse: 'Estimado señor: Quiero reservar una habitación doble para dos personas del 15 al 20 de junio. ¿Cuánto cuesta por noche? Gracias por su atención. Un saludo, Pedro López',
    },
    {
      id: 'a1-creative-1', category: 'creative', title: 'Mi día perfecto',
      type: 'narrative',
      instructions: 'Describe tu día perfecto desde la mañana hasta la noche. Usa expresiones de tiempo. (40-60 palabras)',
      targetStructures: ['time expressions', 'reflexive verbs', 'present tense sequence'],
      rubric: {
        content: 'Covers morning, afternoon, and evening with activities',
        grammar: 'Correct reflexive verb forms; time expressions',
        vocabulary: 'Daily routine vocabulary',
        organization: 'Chronological order with time markers',
      },
      modelResponse: 'Por la mañana me despierto a las nueve. Desayuno con mi familia. A las once voy a la playa. Por la tarde como en un restaurante italiano. Por la noche paseo por la ciudad y tomo un helado. Me acuesto a las once. ¡Es perfecto!',
    },
  ],
  A2: [
    {
      id: 'a2-personal-1', category: 'personal', title: 'Mi último fin de semana',
      type: 'narrative',
      instructions: 'Cuenta qué hiciste el fin de semana pasado. Incluye al menos 4 actividades y di con quién estuviste. (60-80 palabras)',
      targetStructures: ['pretérito indefinido regular', 'time markers: el sábado, después, luego'],
      rubric: {
        content: 'At least 4 activities with companions mentioned',
        grammar: 'Correct preterite forms of regular and common irregular verbs',
        vocabulary: 'Leisure activities, time connectors',
        organization: 'Chronological narrative with connectors',
      },
      modelResponse: 'El sábado por la mañana fui al mercado con mi madre y compramos fruta fresca. Después comimos en casa de mi abuela. Por la tarde jugué al fútbol con mis amigos en el parque. El domingo me levanté tarde. Luego estudié español y por la noche vi una película con mi hermano. Fue un fin de semana muy divertido.',
    },
    {
      id: 'a2-personal-2', category: 'personal', title: 'Carta a un amigo por correspondencia',
      type: 'letter',
      instructions: 'Escribe una carta informal a un nuevo amigo por correspondencia. Preséntate, habla de tus gustos y pregúntale sobre los suyos. (70-90 palabras)',
      targetStructures: ['gustar/encantar', 'indirect object pronouns', 'question formation'],
      rubric: {
        content: 'Self-introduction, likes/dislikes, questions to the friend',
        grammar: 'Correct gustar structure; indirect pronouns',
        vocabulary: 'Hobbies, interests, personality adjectives',
        organization: 'Informal letter format with greeting and questions',
      },
      modelResponse: 'Hola Marco: Me llamo Lucía y tengo 16 años. Vivo en Sevilla, una ciudad muy bonita en el sur de España. Me encanta la música y toco la guitarra. También me gusta mucho leer novelas de aventuras. No me gustan nada los deportes, ¡son muy aburridos! ¿Y tú? ¿Qué te gusta hacer en tu tiempo libre? ¿Te gusta la música? Espero tu respuesta. Un abrazo, Lucía',
    },
    {
      id: 'a2-formal-1', category: 'formal', title: 'Queja sobre un producto',
      type: 'email',
      instructions: 'Escribe un correo de queja porque compraste un producto que llegó roto. Explica qué pasó y qué quieres que hagan. (60-80 palabras)',
      targetStructures: ['preterite for narrating events', 'conditional for polite requests'],
      rubric: {
        content: 'States problem clearly, explains what happened, requests solution',
        grammar: 'Preterite narration; conditional for requests',
        vocabulary: 'Shopping and complaint vocabulary',
        organization: 'Problem statement, details, request, closing',
      },
      modelResponse: 'Estimados señores: El día 3 de marzo compré una lámpara en su tienda en línea. Cuando llegó el paquete, la lámpara estaba rota. Me gustaría recibir una nueva lámpara o la devolución de mi dinero. Adjunto una foto del producto dañado. Espero su respuesta pronto. Atentamente, Roberto Sánchez',
    },
    {
      id: 'a2-creative-1', category: 'creative', title: 'Una historia con imágenes',
      type: 'narrative',
      instructions: 'Mira estas palabras y escribe una historia corta que las incluya todas: gato, lluvia, ventana, chocolate, sorpresa. (60-90 palabras)',
      targetStructures: ['preterite vs imperfect basic', 'descriptive adjectives', 'sequencing'],
      rubric: {
        content: 'All 5 words included in a coherent story',
        grammar: 'Appropriate use of preterite and imperfect',
        vocabulary: 'Descriptive language, all trigger words used naturally',
        organization: 'Beginning, middle, end structure',
      },
      modelResponse: 'Era una tarde de lluvia. Mi gato estaba sentado en la ventana y miraba la calle. Yo preparé un chocolate caliente y me senté a leer. De repente, el gato saltó de la ventana y corrió a la puerta. Abrí la puerta y encontré una caja. ¡Era una sorpresa de mi amiga! Dentro había un libro y galletas. Fue una tarde perfecta.',
    },
  ],
  B1: [
    {
      id: 'b1-personal-1', category: 'personal', title: 'Un cambio importante en mi vida',
      type: 'essay',
      instructions: 'Escribe sobre un cambio importante que hiciste en tu vida (mudanza, nuevo trabajo, nueva afición). Explica por qué lo hiciste, cómo te sentiste y qué aprendiste. (100-140 palabras)',
      targetStructures: ['preterite vs imperfect contrast', 'past emotions with imperfect', 'cause/effect connectors'],
      rubric: {
        content: 'Describes change, motivation, feelings, and lesson learned',
        grammar: 'Consistent preterite/imperfect distinction; correct connector usage',
        vocabulary: 'Emotions vocabulary, cause-effect language (porque, por eso, así que)',
        organization: 'Introduction, development with timeline, reflection/conclusion',
      },
      modelResponse: 'Hace dos años decidí mudarme de mi pueblo a Madrid para estudiar en la universidad. Al principio tenía mucho miedo porque no conocía a nadie y todo era diferente. Los primeros meses fueron difíciles: me sentía solo y echaba de menos a mi familia. Sin embargo, poco a poco hice amigos en clase y empecé a disfrutar de la ciudad. Aprendí a cocinar, a organizar mi tiempo y a ser más independiente. Ahora sé que fue la mejor decisión de mi vida porque me ayudó a crecer como persona. A veces los cambios dan miedo, pero son necesarios.',
    },
    {
      id: 'b1-formal-1', category: 'formal', title: 'Carta de solicitud de empleo',
      type: 'letter',
      instructions: 'Escribe una carta formal solicitando un puesto de camarero/a en un restaurante. Incluye tu experiencia, disponibilidad y por qué quieres el trabajo. (100-130 palabras)',
      targetStructures: ['formal register usted', 'present perfect for experience', 'conditional for polite language'],
      rubric: {
        content: 'States position, relevant experience, availability, motivation',
        grammar: 'Consistent formal register; present perfect; conditional politeness',
        vocabulary: 'Work vocabulary, formal expressions (me dirijo a, adjunto)',
        organization: 'Formal letter structure: header, greeting, body paragraphs, closing',
      },
      modelResponse: 'Estimado señor director: Me dirijo a usted para solicitar el puesto de camarero que han publicado en su página web. He trabajado durante dos años en el restaurante La Mesa, donde he adquirido experiencia en atención al cliente y servicio de mesa. Soy una persona responsable, organizada y me gusta trabajar en equipo. Tengo disponibilidad completa los fines de semana y por las tardes entre semana. Me gustaría trabajar en su restaurante porque tiene una excelente reputación y me encantaría formar parte de su equipo. Adjunto mi currículum para su consideración. Quedo a su disposición para una entrevista. Atentamente, Elena Ruiz',
    },
    {
      id: 'b1-academic-1', category: 'academic', title: 'Ventajas y desventajas de las redes sociales',
      type: 'essay',
      instructions: 'Escribe un ensayo sobre las ventajas y desventajas de las redes sociales. Da al menos dos de cada una y tu opinión personal. (120-150 palabras)',
      targetStructures: ['opinion expressions', 'contrast connectors (sin embargo, por otro lado)', 'present subjunctive with doubt'],
      rubric: {
        content: 'At least 2 advantages, 2 disadvantages, personal opinion',
        grammar: 'Correct use of contrast connectors; subjunctive with opinions',
        vocabulary: 'Technology vocabulary, discourse markers',
        organization: 'Introduction, advantages paragraph, disadvantages paragraph, conclusion',
      },
      modelResponse: 'Las redes sociales forman parte de nuestra vida diaria, pero tienen aspectos positivos y negativos. Por un lado, nos permiten comunicarnos con personas de todo el mundo y compartir información rápidamente. Además, son útiles para encontrar trabajo y aprender cosas nuevas. Por otro lado, las redes sociales pueden crear adicción, especialmente entre los jóvenes. También es posible que afecten a nuestra autoestima porque siempre comparamos nuestra vida con la de los demás. En mi opinión, las redes sociales son una herramienta útil si las usamos con moderación. Es importante que no pasemos demasiado tiempo conectados y que mantengamos nuestras relaciones en la vida real. En conclusión, creo que debemos ser responsables con su uso.',
    },
    {
      id: 'b1-creative-1', category: 'creative', title: 'Continúa la historia',
      type: 'narrative',
      instructions: 'Continúa esta historia: "Cuando abrí la puerta del apartamento, todo estaba diferente. Los muebles habían desaparecido y en medio del salón había..." Escribe qué pasó después. (100-140 palabras)',
      targetStructures: ['past perfect (pluscuamperfecto)', 'narrative tenses', 'direct speech'],
      rubric: {
        content: 'Coherent continuation with conflict/resolution; creative details',
        grammar: 'Correct past perfect; consistent narrative tenses; punctuated dialogue',
        vocabulary: 'Descriptive and emotional language',
        organization: 'Builds suspense, develops plot, reaches resolution',
      },
      modelResponse: '...una maleta enorme de color rojo. Me acerqué despacio porque tenía miedo. Cuando la abrí, encontré dentro una nota que decía: "No te preocupes. Mira por la ventana." Fui a la ventana y vi que en la calle había un camión de mudanzas. En ese momento sonó el teléfono. Era mi hermana. "¡Sorpresa! Hemos renovado tu apartamento mientras estabas de viaje", me dijo riendo. No podía creerlo. Cuando bajé a la calle, mi familia había preparado todos los muebles nuevos. Subimos todo al apartamento y al final quedó precioso. Había sido la mejor sorpresa de mi vida. Esa noche celebramos con una cena todos juntos.',
    },
  ],
  B2: [
    {
      id: 'b2-personal-1', category: 'personal', title: 'Reflexión sobre un viaje transformador',
      type: 'essay',
      instructions: 'Escribe sobre un viaje que cambió tu perspectiva. Describe el lugar, una experiencia concreta y cómo te transformó. Usa conectores variados y vocabulario preciso. (140-180 palabras)',
      targetStructures: ['subjunctive in relative clauses', 'advanced connectors (no obstante, a pesar de que)', 'nominalizations'],
      rubric: {
        content: 'Vivid description, specific anecdote, reflection on personal change',
        grammar: 'Subjunctive in subordinate clauses; advanced connector variety',
        vocabulary: 'Rich descriptive language; precise emotional vocabulary',
        organization: 'Engaging introduction, narrative body, reflective conclusion',
      },
      modelResponse: 'Nunca imaginé que un viaje a Oaxaca pudiera cambiar mi forma de ver el mundo. Llegué buscando playas y buena comida, pero encontré algo mucho más profundo. Una mañana, una señora zapoteca me invitó a su taller de textiles. Mientras me enseñaba a teñir lana con cochinilla, me explicó que cada diseño contaba la historia de su comunidad. Me di cuenta de que, a pesar de que vivimos en un mundo globalizado, hay conocimientos ancestrales que ninguna tecnología puede sustituir. Aquella experiencia me hizo cuestionar mi obsesión por la productividad. No obstante, lo más valioso no fue la técnica que aprendí, sino la paciencia que observé en cada gesto de aquella mujer. Desde entonces, intento dedicar más tiempo a los procesos y menos a los resultados. Oaxaca me enseñó que la riqueza verdadera no se mide en eficiencia.',
    },
    {
      id: 'b2-formal-1', category: 'formal', title: 'Carta al director de un periódico',
      type: 'letter',
      instructions: 'Escribe una carta al director de un periódico expresando tu opinión sobre la prohibición de coches en el centro de la ciudad. Argumenta a favor o en contra con datos y razones. (140-180 palabras)',
      targetStructures: ['subjunctive with value judgments', 'impersonal constructions', 'conditional for hypothetical'],
      rubric: {
        content: 'Clear position, at least 3 arguments, counterargument addressed',
        grammar: 'Subjunctive with opinion/value; impersonal se; conditional hypotheticals',
        vocabulary: 'Formal argumentation language; urban planning vocabulary',
        organization: 'Position statement, arguments with evidence, counterargument, conclusion',
      },
      modelResponse: 'Estimado director: Le escribo en relación con la propuesta de prohibir la circulación de coches en el centro de la ciudad. Considero que es fundamental que las autoridades tomen medidas para mejorar la calidad del aire. En primer lugar, se ha demostrado que la contaminación en el centro supera los límites recomendados por la OMS. Si se restringiera el tráfico, los niveles de contaminación se reducirían hasta un 40%. En segundo lugar, las ciudades europeas que han implementado zonas peatonales han visto un aumento del comercio local. Es cierto que algunos comerciantes temen perder clientes; sin embargo, la experiencia de Pontevedra demuestra lo contrario. Por último, es necesario que invirtamos en transporte público eficiente como alternativa. No sería justo prohibir los coches sin ofrecer opciones viables. En definitiva, apoyo esta medida siempre que vaya acompañada de un plan integral de movilidad. Atentamente, Carmen Delgado',
    },
    {
      id: 'b2-academic-1', category: 'academic', title: 'Ensayo argumentativo: educación bilingüe',
      type: 'essay',
      instructions: 'Escribe un ensayo argumentativo sobre si la educación bilingüe debería ser obligatoria. Presenta tesis, argumentos, contraargumento y conclusión. (150-200 palabras)',
      targetStructures: ['subjunctive in concessive clauses', 'passive constructions', 'academic hedging (cabe señalar, conviene destacar)'],
      rubric: {
        content: 'Clear thesis, 2-3 supporting arguments, counterargument, conclusion',
        grammar: 'Subjunctive in concessive/purpose clauses; passive voice; hedging',
        vocabulary: 'Academic register; education terminology; hedging expressions',
        organization: 'Thesis introduction, body paragraphs with topic sentences, balanced conclusion',
      },
      modelResponse: 'En las últimas décadas, la educación bilingüe ha sido objeto de un intenso debate. Cabe señalar que, aunque presenta desafíos, los beneficios cognitivos y profesionales justifican su implementación obligatoria. En primer lugar, numerosos estudios han demostrado que el bilingüismo mejora la flexibilidad cognitiva y retrasa el deterioro mental. Conviene destacar que estos beneficios se maximizan cuando la exposición comienza en la infancia. En segundo lugar, en un mercado laboral globalizado, el dominio de dos lenguas constituye una ventaja competitiva indiscutible. Aunque es comprensible que algunos padres teman que la educación bilingüe pueda ralentizar el aprendizaje de contenidos, las investigaciones indican que, a largo plazo, los alumnos bilingües igualan o superan a sus compañeros monolingües. No obstante, es imprescindible que se garantice una formación adecuada del profesorado y que se destinen recursos suficientes. En conclusión, la educación bilingüe obligatoria representaría una inversión en el capital humano de nuestra sociedad.',
    },
    {
      id: 'b2-creative-1', category: 'creative', title: 'Microrrelato: el objeto perdido',
      type: 'narrative',
      instructions: 'Escribe un microrrelato (historia muy corta) sobre alguien que encuentra un objeto misterioso. Cuida el estilo literario: usa metáforas, ritmo y un final sorprendente. (120-160 palabras)',
      targetStructures: ['literary past tenses', 'metaphor and simile', 'sentence rhythm variation'],
      rubric: {
        content: 'Complete micro-narrative with mystery element and surprise ending',
        grammar: 'Fluent past tense narration; varied sentence structures',
        vocabulary: 'Literary language; sensory details; figurative expressions',
        organization: 'Compressed narrative arc; impactful ending',
      },
      modelResponse: 'Lo encontró en la acera, entre dos charcos que reflejaban un cielo plomizo. Era una llave de bronce, antigua, con un grabado que parecía un laberinto. Se la guardó en el bolsillo como quien guarda una promesa. Durante semanas probó cerraduras: la del desván de su abuela, la del diario que nunca escribió, la del armario donde guardaba cartas que no envió. Ninguna cedía. Una noche de insomnio, mientras daba vueltas en la cama, sintió el metal frío contra su muslo. La sacó y, sin pensarlo, la acercó a su propio pecho. Encajó. Un clic suave, casi imperceptible. Entonces recordó todo lo que había olvidado a propósito: la voz de su padre, el olor del mar en septiembre, la risa que había silenciado. La llave no abría puertas. Abría personas.',
    },
  ],
  C1: [
    {
      id: 'c1-academic-1', category: 'academic', title: 'Reseña crítica de un fenómeno cultural',
      type: 'essay',
      instructions: 'Escribe una reseña crítica sobre la gentrificación cultural (o un fenómeno similar). Analiza causas, consecuencias y propuestas. Usa registro académico con matizaciones. (180-230 palabras)',
      targetStructures: ['subjunctive in hypothetical si clauses', 'nominalizations', 'academic hedging and distancing'],
      rubric: {
        content: 'Nuanced analysis with causes, effects, proposals; avoids oversimplification',
        grammar: 'Complex subordination; conditional/subjunctive hypotheticals; impersonal constructions',
        vocabulary: 'Academic lexis; abstract nominalizations; discipline-specific terms',
        organization: 'Introduction with framing, analytical body, nuanced conclusion',
      },
      modelResponse: 'La gentrificación cultural constituye uno de los fenómenos más controvertidos de la urbanización contemporánea. Cabría definirla como el proceso mediante el cual la llegada de nuevos residentes con mayor poder adquisitivo transforma no solo la economía, sino el tejido cultural de un barrio. Entre sus causas se encuentran la especulación inmobiliaria y la mercantilización del patrimonio cultural. Si bien es cierto que la renovación urbana puede mejorar infraestructuras, no se debe ignorar que frecuentemente conlleva el desplazamiento de comunidades arraigadas. El caso del Raval barcelonés ilustra esta tensión: lo que otrora fue un barrio obrero multicultural ha experimentado una metamorfosis que, si no se hubiera gestionado con políticas de vivienda social, habría resultado en la expulsión total de sus habitantes originales. Resultaría reduccionista atribuir este fenómeno exclusivamente al mercado; las políticas públicas desempeñan un papel determinante. Sería deseable que las administraciones implementasen mecanismos de protección del comercio tradicional y garantizasen el derecho a la vivienda. En definitiva, la gentrificación cultural nos obliga a replantearnos qué modelo de ciudad queremos construir y para quién.',
    },
    {
      id: 'c1-formal-1', category: 'formal', title: 'Informe profesional con recomendaciones',
      type: 'report',
      instructions: 'Redacta un informe para la dirección de tu empresa recomendando la implementación del teletrabajo parcial. Incluye contexto, datos, ventajas, riesgos y recomendación final. (180-230 palabras)',
      targetStructures: ['passive and impersonal constructions', 'conditional for recommendations', 'formal hedging (cabría, convendría)'],
      rubric: {
        content: 'Context, evidence, balanced analysis, actionable recommendation',
        grammar: 'Passive/impersonal; modal verbs for hedging; conditional advice',
        vocabulary: 'Business register; report language (se recomienda, cabe destacar)',
        organization: 'Numbered sections or clear heading structure; executive summary tone',
      },
      modelResponse: 'Informe sobre la implementación del teletrabajo parcial. 1. Contexto: Tras la experiencia adquirida durante los últimos años, se ha constatado que el modelo de trabajo exclusivamente presencial resulta cada vez menos competitivo. El presente informe analiza la viabilidad de un modelo híbrido. 2. Datos relevantes: Según un estudio de la Universidad de Stanford, la productividad aumenta un 13% en empleados que teletrabajan. Asimismo, nuestra encuesta interna revela que el 78% de la plantilla valora positivamente esta modalidad. 3. Ventajas: Se reducirían los costes operativos en aproximadamente un 20%. Además, cabría esperar una mejora en la conciliación laboral, lo que disminuiría la rotación de personal. 4. Riesgos: Convendría señalar que el aislamiento social podría afectar al trabajo en equipo. Asimismo, sería necesario invertir en herramientas digitales de colaboración. 5. Recomendación: Se recomienda implementar un modelo de tres días presenciales y dos de teletrabajo durante un período de prueba de seis meses, tras el cual se evaluarían los resultados. Dicha implementación debería ir acompañada de formación en gestión remota para los responsables de equipo.',
    },
    {
      id: 'c1-creative-1', category: 'creative', title: 'Columna de opinión con ironía',
      type: 'opinion',
      instructions: 'Escribe una columna de opinión irónica sobre la obsesión contemporánea con la productividad. Usa humor, referencias culturales y un estilo literario cuidado. (160-210 palabras)',
      targetStructures: ['irony and understatement', 'rhetorical questions', 'subjunctive in independent clauses (ojalá, quizá)'],
      rubric: {
        content: 'Clear ironic thesis; humor that serves the argument; cultural references',
        grammar: 'Rhetorical structures; subjunctive for wishes/doubt; varied subordination',
        vocabulary: 'Journalistic register with literary flair; ironic tone markers',
        organization: 'Hook opening, escalating irony, reflective closing',
      },
      modelResponse: 'Levántate a las cinco, medita, corre diez kilómetros, desayuna un batido verde y ten escritas tres páginas de tu novela antes de que amanezca. Bienvenidos a la era en que descansar es pecado y el ocio, una enfermedad que hay que curar con aplicaciones de productividad. Quizá nuestros abuelos, que se sentaban a tomar café sin cronómetro, fueran unos inconscientes. O quizá supieran algo que nosotros hemos olvidado. Hoy optimizamos el sueño, gamificamos la lectura y convertimos cada paseo en una "sesión de mindfulness con objetivos medibles". Ojalá alguien nos explicara cuándo perdimos el derecho a no hacer absolutamente nada. Lo más irónico es que esta obsesión por el rendimiento nos ha hecho profundamente ineficientes: gastamos más energía organizando nuestras listas de tareas que ejecutándolas. Mientras tanto, los gurús de la productividad nos venden cursos sobre cómo recuperar el tiempo que perdemos comprando cursos. Quién sabe, tal vez la revolución del siglo XXI no sea tecnológica sino la más antigua de todas: sentarse, mirar por la ventana y dejar que el tiempo haga lo que le dé la gana.',
    },
    {
      id: 'c1-personal-1', category: 'personal', title: 'Ensayo reflexivo: identidad y lengua',
      type: 'essay',
      instructions: 'Reflexiona sobre cómo aprender español ha influido en tu identidad o forma de pensar. Explora la relación entre lengua y pensamiento. (160-200 palabras)',
      targetStructures: ['abstract vocabulary', 'complex conditional (de + infinitivo)', 'concessive structures'],
      rubric: {
        content: 'Personal and philosophical depth; specific examples of language-thought link',
        grammar: 'Complex subordination; alternative conditional forms; concessive clauses',
        vocabulary: 'Abstract/philosophical lexis; metalinguistic awareness',
        organization: 'Personal hook, philosophical exploration, insightful conclusion',
      },
      modelResponse: 'De no haber empezado a aprender español, probablemente seguiría creyendo que las emociones son universales. Pero cuando descubrí que en español se puede "tener morriña" — esa nostalgia gallega que duele en el cuerpo — comprendí que cada lengua recorta la realidad de manera diferente. Aprender español no solo me dio una herramienta de comunicación; me regaló una nueva forma de estar en el mundo. En inglés "I am bored"; en español, "estoy aburrido". Esa distinción entre ser y estar, que al principio me parecía un capricho gramatical, esconde una filosofía: los estados son pasajeros, la esencia permanece. Aun cuando no domine todos los matices del subjuntivo, reconozco que pensar en español me ha vuelto más tolerante con la ambigüedad. El subjuntivo, al fin y al cabo, es el modo de lo posible, lo deseado, lo incierto. Si algo me ha enseñado esta lengua es que no todo necesita ser categórico. A veces, "puede que" es más honesto que "estoy seguro de que". Y en esa duda habita una sabiduría que mi lengua materna no me había mostrado.',
    },
  ],
  C2: [
    {
      id: 'c2-academic-1', category: 'academic', title: 'Ensayo académico: lengua e ideología',
      type: 'essay',
      instructions: 'Escribe un ensayo académico sobre cómo el lenguaje construye realidades ideológicas. Analiza un ejemplo concreto (medios, política, publicidad). Registro académico riguroso. (200-260 palabras)',
      targetStructures: ['nominalization chains', 'academic distancing (se podría argumentar)', 'intertextuality'],
      rubric: {
        content: 'Sophisticated thesis; concrete example analyzed in depth; theoretical grounding',
        grammar: 'Native-level subordination; impeccable register consistency; zero errors expected',
        vocabulary: 'Academic discourse; critical theory terminology; precise and varied',
        organization: 'Academic essay with thesis, analytical framework, evidence, implications',
      },
      modelResponse: 'El lenguaje, lejos de constituir un vehículo neutro de transmisión informativa, opera como un mecanismo de construcción ideológica. Como señaló Fairclough, todo acto discursivo implica una elección — y toda elección, una exclusión. Considérese el tratamiento mediático de los movimientos migratorios. Cuando un medio emplea "avalancha de inmigrantes" en lugar de "llegada de personas migrantes", no está describiendo la realidad: la está configurando. La metáfora del desastre natural deshumaniza al sujeto y naturaliza la percepción de amenaza. Se podría argumentar que se trata de meras convenciones estilísticas; sin embargo, la investigación en lingüística cognitiva ha demostrado que las metáforas conceptuales moldean los marcos interpretativos del receptor. La nominalización constituye otro recurso ideológicamente cargado: transformar "la policía desalojó a las familias" en "el desalojo de las familias" borra al agente y difumina la responsabilidad. Este fenómeno, que Fowler denominó "mistificación sintáctica", resulta particularmente eficaz precisamente porque pasa inadvertido. Cabría concluir que la alfabetización crítica — la capacidad de desmontar estos mecanismos — debería ocupar un lugar central en la educación. De lo contrario, corremos el riesgo de habitar un mundo cuyas coordenadas ideológicas han sido trazadas por otros sin que seamos siquiera conscientes del mapa.',
    },
    {
      id: 'c2-creative-1', category: 'creative', title: 'Relato breve: voces múltiples',
      type: 'narrative',
      instructions: 'Escribe un relato breve que emplee al menos dos voces narrativas distintas (primera persona, tercera, monólogo interior, etc.) sobre un mismo acontecimiento. Cuida el estilo literario. (200-260 palabras)',
      targetStructures: ['narrative voice shifts', 'literary subjunctive (pretérito imperfecto)', 'rhetorical and poetic devices'],
      rubric: {
        content: 'At least 2 distinct narrative voices; same event from different perspectives',
        grammar: 'Flawless command of all tenses; deliberate stylistic rule-bending',
        vocabulary: 'Literary register; sensory precision; voice differentiation through lexis',
        organization: 'Clear voice transitions; structural choice serves the narrative',
      },
      modelResponse: 'I. La mujer del andén. Lo vi subir al tren con esa maleta que parecía contener el peso de todas las despedidas. No se volvió. Nunca se vuelven los que de verdad se van. Yo me quedé en el andén con las manos vacías y esa sensación — ¿cómo explicarlo? — de que alguien había arrancado una página del libro que estábamos escribiendo juntos. El tren se alejó y el andén se llenó de un silencio que olía a metal y a lluvia por venir. II. El hombre del tren. Si ella supiera que cada paso hacia el vagón era un acto de cobardía disfrazado de valentía. Sentarse. No mirar atrás. Así se sobrevive: convirtiendo las huidas en decisiones. La maleta pesa exactamente lo que pesan las cosas que uno no dice. El tren arranca y el paisaje empieza a deshacerse como un recuerdo que ya está volviéndose ficción. III. El revisor. Otro pasajero con los ojos rojos. Otra mujer inmóvil en el andén. Este tren lleva treinta años transportando historias que nadie le cuenta. Pico el billete. Madrid-Barcelona. Solo ida. Los billetes de solo ida siempre son más pesados.',
    },
    {
      id: 'c2-formal-1', category: 'formal', title: 'Discurso inaugural',
      type: 'speech',
      instructions: 'Redacta un discurso inaugural para un congreso internacional sobre diversidad lingüística. Tono solemne pero accesible, con citas o alusiones culturales. (200-260 palabras)',
      targetStructures: ['rhetorical parallelism', 'subjunctive in exhortations', 'elevated register with accessibility'],
      rubric: {
        content: 'Appropriate gravitas; cultural references; call to action',
        grammar: 'Impeccable formal register; rhetorical structures; subjunctive exhortations',
        vocabulary: 'Ceremonial language; precise and evocative; culturally resonant',
        organization: 'Salutation, framing, thematic development, peroration',
      },
      modelResponse: 'Excelentísimas autoridades, estimados colegas, queridos amigos de la palabra: Cuenta Borges que en el paraíso, cada ángel habla su propia lengua y, sin embargo, todos se entienden. Permítanme sugerir que en la Tierra ocurre exactamente lo contrario: hablamos lenguas que se parecen y, aun así, el malentendido es nuestra condición natural. Quizá sea precisamente esa imperfección la que nos hace humanos. Nos reunimos hoy para celebrar no la uniformidad, sino la diferencia. Cada una de las seis mil lenguas que aún respiran en este planeta es un archivo irreemplazable de conocimiento, una cartografía única de lo posible. Cuando muere una lengua — y muere una cada dos semanas —, no desaparece solo un código: se extingue una manera de nombrar la lluvia, de contar el tiempo, de imaginar lo sagrado. Que este congreso sea, pues, un acto de resistencia. Que cada ponencia nos recuerde que la diversidad lingüística no es un problema que resolver, sino un patrimonio que custodiar. Que no nos conformemos con documentar lo que se pierde, sino que trabajemos para que las lenguas vivan donde deben vivir: en las bocas de quienes las heredaron. Ojalá, al término de estas jornadas, salgamos de aquí con la convicción de que defender una lengua es defender el derecho de una comunidad a soñar en sus propios términos. Muchas gracias.',
    },
    {
      id: 'c2-personal-1', category: 'personal', title: 'Ensayo literario: el silencio',
      type: 'essay',
      instructions: 'Escribe un ensayo literario (estilo libre, personal, cuidado) sobre el silencio: qué significa, cuándo lo buscamos, cuándo nos aterra. Busca un equilibrio entre reflexión y poesía. (200-260 palabras)',
      targetStructures: ['all tenses and moods at will', 'figurative language', 'sentence rhythm as meaning'],
      rubric: {
        content: 'Philosophical depth with personal resonance; original perspective',
        grammar: 'Complete mastery; deliberate stylistic choices indistinguishable from native',
        vocabulary: 'Rich, precise, literary; sensory and abstract in balance',
        organization: 'Essayistic freedom with internal coherence; resonant ending',
      },
      modelResponse: 'Hay silencios que pesan y silencios que flotan. El de una biblioteca es de terciopelo; el de un hospital, de cristal. El silencio de después de una discusión tiene filos, y el que sigue a un beso sabe a pan recién hecho. Aprendemos a hablar, pero nadie nos enseña a callar. Y sin embargo, casi todo lo importante sucede en los márgenes de la palabra: en la pausa antes de decir "te quiero", en el espacio entre la pregunta y la respuesta, en ese instante en que un auditorio contiene el aliento antes de aplaudir. Buscamos el silencio cuando la vida hace demasiado ruido. Subimos montañas, nos encerramos en habitaciones, meditamos con aplicaciones que, paradójicamente, no dejan de hablarnos. Pero el silencio verdadero no está fuera: está en esa zona del pensamiento donde las palabras aún no se han cuajado, donde la idea es todavía sensación. Lo que nos aterra no es la ausencia de sonido, sino lo que esa ausencia revela. En el silencio nos encontramos con nosotros mismos sin la armadura del discurso, sin la posibilidad de disfrazarnos de lo que decimos. Quizá por eso los místicos — Juan de la Cruz, Teresa de Ávila — buscaban el silencio como quien busca la verdad: sabían que Dios, si existe, habla bajito. O no habla. Y en ese no-hablar, dice todo.',
    },
  ],
};

// ── WritingTutor class ─────────────────────────────────────────────────────

class WritingTutor {
  constructor() {
    this.dir = core.dataDir('spanish-writing');
    core.ensureDir(this.dir);
  }

  // Profile management

  getProfile(studentId, level) {
    const p = core.loadProfile(this.dir, studentId);
    if (level && core.CEFR.includes(level)) {
      p.level = level;
      if (!p.corrections) p.corrections = {};
      for (const cat of CORRECTION_CATEGORIES) {
        if (!p.corrections[cat]) p.corrections[cat] = { attempts: [], stability: 2, difficulty: 5 };
      }
      core.saveProfile(this.dir, p);
    } else if (!p.level) {
      p.level = 'A1';
      if (!p.corrections) p.corrections = {};
      for (const cat of CORRECTION_CATEGORIES) {
        if (!p.corrections[cat]) p.corrections[cat] = { attempts: [], stability: 2, difficulty: 5 };
      }
      core.saveProfile(this.dir, p);
    }
    return p;
  }

  setLevel(studentId, level) {
    level = level.toUpperCase();
    if (!core.CEFR.includes(level)) throw new Error(`Invalid level: ${level}. Must be one of ${core.CEFR.join(', ')}`);
    const p = this.getProfile(studentId);
    p.level = level;
    core.saveProfile(this.dir, p);
    return p;
  }

  // Prompt generation

  generatePrompt(studentId, category) {
    const p = this.getProfile(studentId);
    const levelPrompts = PROMPTS[p.level] || PROMPTS.A1;
    let pool = levelPrompts;
    if (category) {
      pool = levelPrompts.filter(pr => pr.category === category);
      if (!pool.length) pool = levelPrompts;
    }

    // Prefer prompts not yet attempted
    const attempted = new Set((p.assessments || []).map(a => a.promptId));
    const fresh = pool.filter(pr => !attempted.has(pr.id));
    const chosen = fresh.length ? core.pick(fresh, 1)[0] : core.pick(pool, 1)[0];

    return {
      studentId,
      level: p.level,
      prompt: chosen,
    };
  }

  getRubric(promptId) {
    for (const level of core.CEFR) {
      const found = (PROMPTS[level] || []).find(pr => pr.id === promptId);
      if (found) return { promptId, level, title: found.title, rubric: found.rubric, targetStructures: found.targetStructures, modelResponse: found.modelResponse };
    }
    throw new Error(`Prompt not found: ${promptId}`);
  }

  // Assessment recording

  recordAssessment(studentId, promptId, scores, corrections) {
    const p = this.getProfile(studentId);
    if (!p.assessments) p.assessments = [];
    if (!p.corrections) p.corrections = {};
    for (const cat of CORRECTION_CATEGORIES) {
      if (!p.corrections[cat]) p.corrections[cat] = { attempts: [], stability: 2, difficulty: 5 };
    }

    // Validate scores
    for (const dim of ['content', 'grammar', 'vocabulary', 'organization']) {
      const v = Number(scores[dim]);
      if (isNaN(v) || v < 1 || v > 5) throw new Error(`Score ${dim} must be 1-5, got: ${scores[dim]}`);
    }

    const assessment = {
      promptId,
      date: core.today(),
      scores: {
        content: Number(scores.content),
        grammar: Number(scores.grammar),
        vocabulary: Number(scores.vocabulary),
        organization: Number(scores.organization),
      },
      total: Number(scores.content) + Number(scores.grammar) + Number(scores.vocabulary) + Number(scores.organization),
      maxTotal: 20,
    };

    // Process corrections (e.g., { "gender": 2, "tense": 1 } = error counts)
    if (corrections && typeof corrections === 'object') {
      assessment.corrections = corrections;
      for (const [cat, count] of Object.entries(corrections)) {
        if (!CORRECTION_CATEGORIES.includes(cat)) continue;
        const rec = p.corrections[cat];
        // Each error adds a failing attempt, no errors = passing
        const errorCount = Number(count) || 0;
        if (errorCount > 0) {
          rec.attempts.push({ score: 0, total: 1, date: core.today() });
          const grade = 1; // fail
          rec.stability = core.fsrsUpdateStability(rec.stability, rec.difficulty, grade);
          rec.difficulty = core.fsrsUpdateDifficulty(rec.difficulty, grade);
        } else {
          rec.attempts.push({ score: 1, total: 1, date: core.today() });
          const grade = 4; // easy
          rec.stability = core.fsrsUpdateStability(rec.stability, rec.difficulty, grade);
          rec.difficulty = core.fsrsUpdateDifficulty(rec.difficulty, grade);
        }
      }
      // Categories not mentioned in corrections = clean (no errors)
      for (const cat of CORRECTION_CATEGORIES) {
        if (!(cat in corrections)) {
          const rec = p.corrections[cat];
          rec.attempts.push({ score: 1, total: 1, date: core.today() });
          const grade = 3; // good
          rec.stability = core.fsrsUpdateStability(rec.stability, rec.difficulty, grade);
          rec.difficulty = core.fsrsUpdateDifficulty(rec.difficulty, grade);
        }
      }
    }

    p.assessments.push(assessment);
    core.saveProfile(this.dir, p);

    return {
      studentId,
      assessment,
      overallScore: `${assessment.total}/${assessment.maxTotal}`,
    };
  }

  // Progress and reporting

  getProgress(studentId) {
    const p = this.getProfile(studentId);
    const categories = {};
    for (const cat of CORRECTION_CATEGORIES) {
      const rec = p.corrections[cat] || { attempts: [] };
      const mastery = core.calcMastery(rec.attempts);
      categories[cat] = {
        mastery,
        label: core.masteryLabel(mastery),
        attempts: rec.attempts.length,
        nextReview: rec.stability ? core.fsrsNextReview(rec.stability, core.DEFAULT_RETENTION) : null,
      };
    }

    // Overall writing scores over time
    const recent = (p.assessments || []).slice(-10);
    const avgScores = { content: 0, grammar: 0, vocabulary: 0, organization: 0 };
    if (recent.length) {
      for (const a of recent) {
        for (const dim of Object.keys(avgScores)) avgScores[dim] += a.scores[dim];
      }
      for (const dim of Object.keys(avgScores)) avgScores[dim] = Math.round(avgScores[dim] / recent.length * 10) / 10;
    }

    return {
      studentId,
      level: p.level,
      totalAssessments: (p.assessments || []).length,
      correctionCategories: categories,
      averageScores: recent.length ? avgScores : null,
    };
  }

  getNextTopics(studentId) {
    const progress = this.getProgress(studentId);
    const cats = progress.correctionCategories;
    // Sort by mastery ascending, then by next review soonest
    const sorted = CORRECTION_CATEGORIES
      .map(cat => ({ category: cat, ...cats[cat] }))
      .sort((a, b) => a.mastery - b.mastery || (a.nextReview || 999) - (b.nextReview || 999));

    return {
      studentId,
      level: progress.level,
      focusAreas: sorted.slice(0, 3).map(s => ({
        category: s.category,
        mastery: s.mastery,
        label: s.label,
        recommendation: this._recommendation(s.category, s.label),
      })),
    };
  }

  _recommendation(category, label) {
    const recs = {
      gender: 'Practice noun-adjective gender agreement. Write descriptions of objects and people.',
      agreement: 'Focus on subject-verb and noun-adjective number agreement in longer sentences.',
      'ser-estar': 'Write pairs of sentences contrasting ser vs estar with the same adjective.',
      tense: 'Narrate past events mixing preterite and imperfect. Write timelines.',
      subjunctive: 'Practice expressing wishes, doubts, and recommendations using subjunctive triggers.',
      'por-para': 'Write sentences explaining reasons (por) vs purposes (para). Translate contrasting pairs.',
      spelling: 'Review accent rules (agudas, llanas, esdrújulas). Dictation practice.',
      punctuation: 'Practice inverted punctuation marks. Review comma usage with subordinate clauses.',
    };
    if (label === 'mastered' || label === 'proficient') return `${category}: strong. Maintain through varied writing.`;
    return recs[category] || `Focus on ${category} in your next writing exercises.`;
  }

  getReport(studentId) {
    const p = this.getProfile(studentId);
    const progress = this.getProgress(studentId);
    const topics = this.getNextTopics(studentId);

    return {
      studentId,
      level: p.level,
      createdAt: p.createdAt,
      totalAssessments: progress.totalAssessments,
      averageScores: progress.averageScores,
      correctionCategories: progress.correctionCategories,
      focusAreas: topics.focusAreas,
      recentAssessments: (p.assessments || []).slice(-5).map(a => ({
        promptId: a.promptId,
        date: a.date,
        score: `${a.total}/${a.maxTotal}`,
      })),
    };
  }

  listStudents() {
    return core.listProfiles(this.dir);
  }

  getPromptCatalog(level) {
    if (level) {
      if (!core.CEFR.includes(level)) throw new Error(`Invalid level: ${level}`);
      return (PROMPTS[level] || []).map(p => ({ id: p.id, category: p.category, title: p.title, type: p.type, level }));
    }
    const catalog = [];
    for (const lvl of core.CEFR) {
      for (const p of (PROMPTS[lvl] || [])) {
        catalog.push({ id: p.id, category: p.category, title: p.title, type: p.type, level: lvl });
      }
    }
    return catalog;
  }
}

// ── CLI ────────────────────────────────────────────────────────────────────

const tutor = new WritingTutor();

core.runCLI((cmd, args, out) => {
  switch (cmd) {
    case 'start': {
      const [, studentId, level] = args;
      if (!studentId) throw new Error('Usage: start <studentId> [level]');
      out(tutor.getProfile(studentId, level));
      break;
    }
    case 'set-level': {
      const [, studentId, level] = args;
      if (!studentId || !level) throw new Error('Usage: set-level <studentId> <level>');
      out(tutor.setLevel(studentId, level));
      break;
    }
    case 'prompt': {
      const [, studentId, category] = args;
      if (!studentId) throw new Error('Usage: prompt <studentId> [category]');
      out(tutor.generatePrompt(studentId, category));
      break;
    }
    case 'rubric': {
      const [, promptId] = args;
      if (!promptId) throw new Error('Usage: rubric <promptId>');
      out(tutor.getRubric(promptId));
      break;
    }
    case 'record': {
      const [, studentId, promptId, content, grammar, vocabulary, organization, correctionsJson] = args;
      if (!studentId || !promptId || !content) throw new Error('Usage: record <studentId> <promptId> <content> <grammar> <vocab> <org> [correctionsJson]');
      const scores = { content, grammar, vocabulary, organization };
      let corrections = null;
      if (correctionsJson) {
        try { corrections = JSON.parse(correctionsJson); }
        catch { throw new Error('corrections must be valid JSON, e.g. \'{"gender":2,"tense":1}\''); }
      }
      out(tutor.recordAssessment(studentId, promptId, scores, corrections));
      break;
    }
    case 'progress': {
      const [, studentId] = args;
      if (!studentId) throw new Error('Usage: progress <studentId>');
      out(tutor.getProgress(studentId));
      break;
    }
    case 'report': {
      const [, studentId] = args;
      if (!studentId) throw new Error('Usage: report <studentId>');
      out(tutor.getReport(studentId));
      break;
    }
    case 'prompts': {
      const [, level] = args;
      out(tutor.getPromptCatalog(level));
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
        commands: ['start', 'set-level', 'prompt', 'rubric', 'record', 'progress', 'report', 'prompts', 'students'],
      });
  }
});

module.exports = { WritingTutor, PROMPTS, CORRECTION_CATEGORIES };
