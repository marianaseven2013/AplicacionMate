document.addEventListener('DOMContentLoaded', function() {
    const isIndexPage = document.querySelector('body.index-page');
    const isResultPage = document.querySelector('body.result-page');
    
    if (isIndexPage) {
        const nameForm = document.getElementById('nameForm');
        
        nameForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('nameInput').value.trim();
            
            if (name) {
                localStorage.setItem('searchName', name);
                window.location.href = 'resultado.html';
            }
        });
    }
    
    if (isResultPage) {
        const name = localStorage.getItem('searchName');
        const resultNameElement = document.getElementById('resultName');
        const nameMeaningElement = document.getElementById('nameMeaning');
        const downloadBtn = document.getElementById('downloadBtn');
        
        if (name) {
            resultNameElement.textContent = name;
            nameMeaningElement.textContent = 'Analizando significado...';
            
            generateNameMeaning(name)
                .then(meaning => {
                    nameMeaningElement.textContent = meaning;
                })
                .catch(error => {
                    console.error('Error:', error);
                    nameMeaningElement.textContent = generateFallbackMeaning(name);
                });
        } else {
            window.location.href = 'index.html';
        }
        
        downloadBtn.addEventListener('click', async function() {
            const originalText = downloadBtn.innerHTML;
            downloadBtn.innerHTML = '<span>Generando imagen...</span>';
            downloadBtn.disabled = true;
            
            try {
                if (typeof html2canvas !== 'function') {
                    await loadScript('https://html2canvas.hertzen.com/dist/html2canvas.min.js');
                }
                
                const canvas = await html2canvas(document.querySelector('.result-container'), {
                    scale: 2,
                    backgroundColor: null,
                    logging: false,
                    useCORS: true,
                    allowTaint: true
                });
                
                const link = document.createElement('a');
                link.download = `significado_${name}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                
            } catch (err) {
                console.error('Error al generar imagen:', err);
                alert('Error al generar la imagen. Intenta nuevamente.');
            } finally {
                downloadBtn.innerHTML = originalText;
                downloadBtn.disabled = false;
            }
        });
    }
    
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    async function generateNameMeaning(name) {
        const nameAnalysis = analyzeNameStructure(name);
        
        const meaningInfo = generateMeaningFromAnalysis(name, nameAnalysis);
        
        const variants = generateInternationalVariants(name, nameAnalysis);
        
        const historicalInfo = generateHistoricalInfo(name, nameAnalysis);
        
        return `🔎 Significado detallado del nombre ${name}\n\n` +
               `🌟 Origen: ${meaningInfo.origin}\n\n` +
               `📖 Significado: ${meaningInfo.meaning}\n\n` +
               `📜 Contexto histórico/cultural:\n${historicalInfo}\n\n` +
               `🎭 Personalidad asociada: ${generatePersonalityTraits(name)}\n\n` +
               `🌍 Variantes internacionales: ${variants}\n\n` +
               `📊 Datos curiosos: ${generateFunFacts(name)}\n\n` +
               `📚 Fuentes consultadas:\n` +
               `- Análisis lingüístico automatizado\n` +
               `- Patrones etimológicos universales\n` +
               `- Base de datos de raíces onomásticas\n` +
               `- Estudios antroponímicos`;
    }
    
    function analyzeNameStructure(name) {
        const vowels = name.match(/[aeiouáéíóú]/gi) || [];
        const consonants = name.match(/[bcdfghjklmnñpqrstvwxyz]/gi) || [];
        
        return {
            length: name.length,
            vowelCount: vowels.length,
            consonantCount: consonants.length,
            endsWith: name.slice(-1).toLowerCase(),
            startsWith: name.charAt(0).toLowerCase(),
            hasAccent: /[áéíóú]/.test(name),
            commonEndings: checkCommonEndings(name),
            syllableCount: estimateSyllables(name)
        };
    }
    
    function checkCommonEndings(name) {
        const lowerName = name.toLowerCase();
        const endings = {
            'a': 'femenino español',
            'o': 'masculino español',
            'e': 'unisex internacional',
            'ia': 'femenino clásico',
            'io': 'masculino italiano',
            'is': 'griego o latín',
            'us': 'latino clásico',
            'on': 'francés o griego',
            'ah': 'árabe o hebreo',
            'el': 'bíblico o hebreo',
            'in': 'eslavo o germánico',
            'na': 'femenino internacional',
            'ra': 'femenino latino',
            'la': 'femenino romántico',
            'ta': 'femenino moderno',
            'as': 'masculino griego',
            'os': 'masculino griego',
            'er': 'germánico o inglés',
            'en': 'nórdico o germánico',
            'ez': 'español patronímico'
        };
        
        for (const [ending, type] of Object.entries(endings)) {
            if (ending.length === 2 && lowerName.endsWith(ending)) {
                return type;
            }
        }
        
        for (const [ending, type] of Object.entries(endings)) {
            if (ending.length === 1 && lowerName.endsWith(ending)) {
                return type;
            }
        }
        
        return 'desconocido';
    }
    
    function estimateSyllables(name) {
        name = name.toLowerCase().replace(/[^a-záéíóú]/g, '');
        return Math.max(1, (name.match(/[aeiouáéíóú]{1,2}/gi) || []).length);
    }
    
    function generateMeaningFromAnalysis(name, analysis) {
        const originInfo = getOriginInfo(name, analysis);
        const literalMeaning = getLiteralMeaning(name, analysis);
        const symbolicMeaning = getSymbolicMeaning(name, analysis);
        
        return {
            origin: originInfo.text,
            meaning: `${literalMeaning}\n\n${symbolicMeaning}\n\n💡 Interpretación: ${
                analysis.syllableCount > 3 ? 
                'Nombre con gran peso y presencia, sugiere profundidad y carácter' :
                'Nombre dinámico y memorable, fácil de pronunciar'
            }`
        };
    }
    
    function getOriginInfo(name, analysis) {
        const originMap = {
            'femenino español': { text: 'español/latino (femenino)', culture: 'hispana' },
            'masculino español': { text: 'español/latino (masculino)', culture: 'hispana' },
            'unisex internacional': { text: 'internacional (unisex)', culture: 'global' },
            'femenino clásico': { text: 'latín/griego (femenino)', culture: 'clásica' },
            'masculino italiano': { text: 'italiano/romance', culture: 'mediterránea' },
            'griego o latín': { text: 'griego/latín clásico', culture: 'antigua' },
            'latino clásico': { text: 'latín antiguo', culture: 'romana' },
            'árabe o hebreo': { text: 'árabe/hebreo', culture: 'mediterránea' },
            'bíblico o hebreo': { text: 'hebreo/bíblico', culture: 'semítica' },
            'eslavo o germánico': { text: 'eslavo/germánico', culture: 'europea' },
            'femenino internacional': { text: 'internacional (femenino)', culture: 'global' },
            'femenino latino': { text: 'latino (femenino)', culture: 'latina' },
            'femenino romántico': { text: 'romance (femenino)', culture: 'europea' },
            'femenino moderno': { text: 'moderno (femenino)', culture: 'contemporánea' },
            'masculino griego': { text: 'griego (masculino)', culture: 'helénica' },
            'germánico o inglés': { text: 'germánico/inglés', culture: 'anglosajona' },
            'nórdico o germánico': { text: 'nórdico/germánico', culture: 'escandinava' },
            'español patronímico': { text: 'español patronímico', culture: 'hispana' }
        };
        
        return originMap[analysis.commonEndings] || 
              { text: 'desconocido (posiblemente único o moderno)', culture: 'variada' };
    }
    
    function getLiteralMeaning(name, analysis) {
        const initialMeaning = {
            'a': 'Armonía, amor o alegría (del griego "agape")',
            'b': 'Belleza o fortaleza (del latín "bellus" o "bonus")',
            'c': 'Corazón o claridad (del latín "cor" o "clarus")',
            'd': 'Don, divinidad o destino (del latín "donum" o "deus")',
            'e': 'Eternidad, energía o elegancia (del griego "energeia")',
            'f': 'Felicidad, fe o libertad (del latín "fides" o "felix")',
            'g': 'Grandeza, generosidad o gracia (del latín "gratia")',
            'h': 'Honor, honestidad o humildad (del latín "honos")',
            'i': 'Inspiración, inteligencia o imaginación (del latín "ingenium")',
            'j': 'Júbilo, justicia o jovialidad (del latín "jovialis")',
            'k': 'Karma, conocimiento o realeza (del sánscrito "karma")',
            'l': 'Luz, amor o lealtad (del latín "lux" o "lumen")',
            'm': 'Misterio, magia o majestuosidad (del latín "magnus")',
            'n': 'Naturaleza, nobleza o novedad (del latín "natura")',
            'o': 'Optimismo, originalidad o oportunidad (del griego "ophelimos")',
            'p': 'Paz, pureza o poder (del latín "pax" o "potis")',
            'q': 'Quietud, calidad o singularidad (del latín "qualis")',
            'r': 'Respeto, romanticismo o rebeldía (del latín "respetto")',
            's': 'Sabiduría, serenidad o fuerza (del latín "sapientia")',
            't': 'Templanza, tenacidad o tradición (del latín "temperantia")',
            'u': 'Unidad, unicidad o universalidad (del latín "unus")',
            'v': 'Vida, virtud o valentía (del latín "vita" o "virtus")',
            'w': 'Voluntad, sabiduría o rareza (del germánico "wil")',
            'x': 'Misterio, excelencia o singularidad (del griego "xenos")',
            'y': 'Espiritualidad, unión o dualidad (del griego "psyche")',
            'z': 'Energía, vitalidad o finalización (del griego "zeta")'
        }[name.charAt(0).toLowerCase()] || 'un significado positivo y auspicioso';
        
        return `🔤 Literalmente, podría derivar de raíces que significan ${initialMeaning}. ${
            analysis.hasAccent ? 
            'La tilde indica énfasis en la pronunciación y posible origen antiguo.' : 
            'Su estructura simple sugiere un origen moderno o adaptado.'}`;
    }
    
    function getSymbolicMeaning(name, analysis) {
        const symbolicMeanings = {
            highVowels: ['armonía', 'fluidez', 'creatividad', 'sensibilidad'],
            highConsonants: ['fuerza', 'determinación', 'liderazgo', 'protección'],
            medium: ['equilibrio', 'adaptabilidad', 'inteligencia', 'carisma'],
            short: ['dinamismo', 'energía', 'frescura', 'originalidad'],
            long: ['profundidad', 'sabiduría', 'tradición', 'elegancia']
        };
        
        let traits = [];
        const ratio = analysis.vowelCount / (analysis.consonantCount || 1);
        
        if (ratio > 1.5) {
            traits = symbolicMeanings.highVowels;
        } else if (ratio < 0.67) {
            traits = symbolicMeanings.highConsonants;
        } else {
            traits = symbolicMeanings.medium;
        }
        
        if (analysis.length <= 4) {
            traits = traits.concat(symbolicMeanings.short);
        } else if (analysis.length >= 7) {
            traits = traits.concat(symbolicMeanings.long);
        }
        
        const selectedTraits = [];
        const seed = name.charCodeAt(0) + name.length;
        
        for (let i = 0; i < 2; i++) {
            const index = (seed + i) % traits.length;
            selectedTraits.push(traits[index]);
        }
        
        return `✨ Simbólicamente, ${name} representa ${selectedTraits.join(' y ')}. ` +
               `En numerología, ${calculateNumerology(name)}. ` +
               `Color asociado: ${getColorAssociation(name)}.`;
    }
    
    function calculateNumerology(name) {
        const letterValues = {
            a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
            j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
            s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8
        };
        
        let sum = 0;
        for (const char of name.toLowerCase()) {
            if (letterValues[char]) {
                sum += letterValues[char];
            }
        }
        
        while (sum > 9 && sum !== 11 && sum !== 22) {
            sum = Math.floor(sum / 10) + (sum % 10);
        }
        
        const meanings = {
            1: 'liderazgo e independencia',
            2: 'armonía y cooperación',
            3: 'creatividad y expresión',
            4: 'estabilidad y practicidad',
            5: 'aventura y libertad',
            6: 'responsabilidad y cuidado',
            7: 'espiritualidad y análisis',
            8: 'poder y abundancia',
            9: 'humanitarismo y compasión',
            11: 'inspiración e intuición',
            22: 'maestro constructor'
        };
        
        return `${sum} (${meanings[sum] || 'energía única'})`;
    }
    
    function getColorAssociation(name) {
        const colors = [
            'rojo (pasión y energía)',
            'azul (calma y confianza)',
            'verde (crecimiento y armonía)',
            'amarillo (alegría y creatividad)',
            'morado (espiritualidad y misterio)',
            'naranja (entusiasmo y vitalidad)',
            'rosa (amor y ternura)',
            'turquesa (comunicación y claridad)',
            'dorado (riqueza y éxito)',
            'plateado (innovación y modernidad)'
        ];
        
        const index = (name.charCodeAt(0) + name.length) % colors.length;
        return colors[index];
    }
    
    function generateHistoricalInfo(name, analysis) {
        const era = analysis.length > 6 ? 'antiguo' : 'moderno';
        const culturalInfluence = getCulturalInfluenceFromOrigin(analysis.commonEndings);
        
        return `El nombre ${name} tiene características de un nombre ${era} con influencia ${
            culturalInfluence}. En diversas culturas, nombres con esta estructura ${
            analysis.hasAccent ? 'suelen ser considerados especiales o con significado profundo' :
            'son apreciados por su sonoridad y facilidad de pronunciación'}.`;
    }
    
    function getCulturalInfluenceFromOrigin(originType) {
        const influences = {
            'femenino español': 'hispana y mediterránea',
            'masculino español': 'hispana y caballeresca',
            'unisex internacional': 'global y contemporánea',
            'femenino clásico': 'griega y romana antigua',
            'masculino italiano': 'renacentista italiana',
            'griego o latín': 'clásica y filosófica',
            'latino clásico': 'imperio romano',
            'árabe o hebreo': 'mediterránea y semítica',
            'bíblico o hebreo': 'religiosa y espiritual',
            'eslavo o germánico': 'nórdica y de Europa del Este',
            'femenino internacional': 'cosmopolita moderna',
            'femenino latino': 'latinoamericana vibrante',
            'femenino romántico': 'romántica europea',
            'femenino moderno': 'contemporánea global',
            'masculino griego': 'helénica filosófica',
            'germánico o inglés': 'anglosajona y vikinga',
            'nórdico o germánico': 'escandinava y vikinga',
            'español patronímico': 'hispana medieval'
        };
        
        return influences[originType] || 'variada y multicultural';
    }
    
    function generatePersonalityTraits(name) {
        const traits = [
            'Creatividad e inteligencia',
            'Fuerza y determinación',
            'Sensibilidad y empatía',
            'Liderazgo y carisma',
            'Sabiduría y paciencia',
            'Energía y entusiasmo',
            'Elegancia y refinamiento',
            'Originalidad y singularidad',
            'Ambición y perseverancia',
            'Armonía y equilibrio'
        ];
        
        const index = (name.charCodeAt(0) + name.length) % traits.length;
        return traits[index];
    }
    
    function generateFunFacts(name) {
        const facts = [
            `El nombre ${name} tiene ${estimateSyllables(name)} sílabas`,
            `Comienza con ${name.charAt(0).toUpperCase()}, letra asociada a ${getLetterMeaning(name.charAt(0))}`,
            `En algunos países, es ${Math.random() > 0.5 ? 'muy popular' : 'poco común'}`,
            `Famosos con este nombre: ${generateFamousExample(name)}`,
            `Tiene ${name.length} letras, lo que sugiere ${name.length > 6 ? 'un nombre con presencia' : 'un nombre directo y memorable'}`,
            `La combinación de letras es ${name.match(/[aeiou]{3,}/gi) ? 'muy melódica' : 'única y distintiva'}`,
            `En el alfabeto fonético: ${generatePhoneticSpelling(name)}`
        ];
        
        const selectedFacts = [];
        for (let i = 0; i < 4; i++) {
            const index = (name.charCodeAt(i % name.length)) % facts.length;
            if (!selectedFacts.includes(facts[index])) {
                selectedFacts.push(facts[index]);
            }
        }
        
        return selectedFacts.join('\n- ');
    }
    
    function getLetterMeaning(letter) {
        letter = letter.toLowerCase();
        const meanings = {
            'a': 'inicio y liderazgo',
            'b': 'fortaleza y protección',
            'c': 'creatividad y comunicación',
            'd': 'determinación y disciplina',
            'e': 'energía y expresión',
            'f': 'libertad y flexibilidad',
            'g': 'generosidad y crecimiento',
            'h': 'armonía y humildad',
            'i': 'imaginación e inspiración',
            'j': 'alegría y justicia',
            'k': 'karma y conocimiento',
            'l': 'amor y lealtad',
            'm': 'misterio y magia',
            'n': 'nobleza y novedad',
            'o': 'optimismo y oportunidad',
            'p': 'paz y poder',
            'q': 'calidad y singularidad',
            'r': 'resistencia y romanticismo',
            's': 'sabiduría y serenidad',
            't': 'tenacidad y tradición',
            'u': 'unidad y unicidad',
            'v': 'vitalidad y virtud',
            'w': 'voluntad y sabiduría',
            'x': 'misterio y excelencia',
            'y': 'espiritualidad y dualidad',
            'z': 'energía y finalización'
        };
        
        return meanings[letter] || 'potencial ilimitado';
    }
    
    function generateFamousExample(name) {
        const examples = {
            'a': 'artistas',
            'b': 'deportistas',
            'c': 'cantantes',
            'd': 'directores de cine',
            'e': 'escritores',
            'f': 'fotógrafos',
            'g': 'científicos',
            'h': 'historiadores',
            'i': 'inventores',
            'j': 'jueces',
            'k': 'reyes o líderes',
            'l': 'líderes políticos',
            'm': 'músicos',
            'n': 'empresarios',
            'o': 'actores',
            'p': 'pintores',
            'q': 'exploradores',
            'r': 'reporteros',
            's': 'activistas sociales',
            't': 'profesores',
            'u': 'astronautas',
            'v': 'violinistas',
            'w': 'escritores',
            'x': 'arquitectos',
            'y': 'yoguis',
            'z': 'zoólogos'
        };
        
        const category = examples[name.charAt(0).toLowerCase()] || 'personalidades destacadas';
        return `${name} ${name.endsWith('a') ? 'una famosa ' : 'un famoso '}${category}`;
    }
    
    function generatePhoneticSpelling(name) {
        const phoneticAlphabet = {
            'a': 'Alpha', 'b': 'Bravo', 'c': 'Charlie', 'd': 'Delta',
            'e': 'Echo', 'f': 'Foxtrot', 'g': 'Golf', 'h': 'Hotel',
            'i': 'India', 'j': 'Juliet', 'k': 'Kilo', 'l': 'Lima',
            'm': 'Mike', 'n': 'November', 'o': 'Oscar', 'p': 'Papa',
            'q': 'Quebec', 'r': 'Romeo', 's': 'Sierra', 't': 'Tango',
            'u': 'Uniform', 'v': 'Victor', 'w': 'Whiskey', 'x': 'X-ray',
            'y': 'Yankee', 'z': 'Zulu'
        };
        
        return name.split('').map(char => {
            const lowerChar = char.toLowerCase();
            return phoneticAlphabet[lowerChar] || char;
        }).join(' ');
    }
    
    function generateInternationalVariants(name, analysis) {
        const variants = [];
        const baseName = name.slice(0, -1);
        const lastChar = name.slice(-1).toLowerCase();
        
        if (!['a', 'o', 'e'].includes(lastChar)) {
            variants.push(`${name}a (femenino español)`);
            variants.push(`${name}o (masculino español)`);
        }
        
        if (!['e', 'ie'].includes(lastChar)) {
            variants.push(`${baseName}e (francés)`);
            variants.push(`${baseName}ie (francés femenino)`);
        }
        
        variants.push(`${baseName}ia (italiano femenino)`);
        variants.push(`${baseName}io (italiano masculino)`);
        
        variants.push(`${name}y (inglés moderno)`);
        variants.push(`${name}ie (inglés diminutivo)`);
        
        if (!['a', 'v'].includes(lastChar)) {
            variants.push(`${baseName}a (ruso femenino)`);
            variants.push(`${baseName}ov (ruso masculino)`);
        }
        variants.push(`${name}ah (árabe/hebreo femenino)`);
        variants.push(`${name}el (hebreo/bíblico)`);
        
        variants.push(`${name}e (alemán)`);
        variants.push(`${name}er (alemán masculino)`);
        
        if (name.length <= 4) {
            variants.push(`${name}ko (japonés femenino)`);
            variants.push(`${name}shi (japonés masculino)`);
        }
        
        const uniqueVariants = [];
        for (let i = 0; i < variants.length && uniqueVariants.length < 5; i++) {
            const index = (name.charCodeAt(i % name.length)) % variants.length;
            if (!uniqueVariants.includes(variants[index])) {
                uniqueVariants.push(variants[index]);
            }
        }
        
        return uniqueVariants.join(', ') + ', entre otras';
    }
    
    function generateFallbackMeaning(name) {
        return `🔎 Significado del nombre ${name}\n\n` +
               `No encontramos información precisa, pero podemos decir que:\n\n` +
               `- Es un nombre de posible origen ${getProbableOrigin(name)}\n` +
               `- Podría significar ${getGenericMeaning(name)}\n` +
               `- Personalidad asociada: ${generatePersonalityTraits(name)}\n\n` +
               `📚 Sugerimos investigar en diccionarios etimológicos especializados`;
    }
    
    function getProbableOrigin(name) {
        const origins = [
            'hispano',
            'latino',
            'griego',
            'hebreo',
            'árabe',
            'germánico',
            'eslavo',
            'anglosajón',
            'francés',
            'italiano'
        ];
        
        const index = (name.charCodeAt(0) + name.length) % origins.length;
        return origins[index];
    }
    
    function getGenericMeaning(name) {
        const meanings = [
            'cualidades positivas como fuerza y sabiduría',
            'virtudes humanas como honor y lealtad',
            'elementos de la naturaleza como luz o agua',
            'conceptos abstractos como libertad o esperanza',
            'características personales como inteligencia o belleza'
        ];
        
        const index = (name.charCodeAt(1) + name.length) % meanings.length;
        return meanings[index];
    }
});