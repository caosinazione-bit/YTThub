import { GoogleGenAI, Modality } from "@google/genai";
import * as fs from "fs";
import * as path from "path";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface GenerateImageParams {
  title: string;
  description?: string;
  category: string;
  style: "realistic" | "cartoon";
}

export async function generateThumbnailImage(params: GenerateImageParams): Promise<{ url: string }> {
  const { title, description, category, style } = params;
  
  const stylePrompt = style === "realistic" 
    ? "ultra-realistic, photorealistic, high-definition photograph, professional cinematography, dramatic lighting"
    : "vibrant cartoon illustration, animated style, bold colors, stylized characters";
    
  // Prompts ottimizzati per miniature YouTube senza testo
  const categoryPrompts: Record<string, string> = {
    gaming: "ambiente gaming coinvolgente con controller, setup gaming RGB, action drammatica, personaggi in primo piano con espressioni intense, colori neon vivaci, movimento dinamico",
    education: "scena educativa con persone che spiegano concetti, gesti espressivi, materiali didattici visibili, atmosfera di apprendimento positiva, espressioni di comprensione",
    entertainment: "scena divertente con luci teatrali, espressioni esagerate di sorpresa o gioia, situazioni spettacolari, colori vivaci, energia palpabile, momenti culminanti",
    technology: "tecnologia moderna con dispositivi futuristici, interfacce innovative, persone che interagiscono con tech avanzata, ambienti high-tech, illuminazione moderna",
    lifestyle: "momenti lifestyle autentici con persone sorridenti, ambienti accoglienti, situazioni di vita quotidiana, colori caldi, atmosfera invitante e rilassata",
    music: "performance musicale energica con strumenti, artisti in azione, effetti di movimento ritmico, luci da concerto, energia musicale visibile, espressioni appassionate",
    crime: "atmosfera investigativa noir con elementi di mistero, luci drammatiche, ombre minacciose, personaggi sospetti, tensione palpabile, ambienti inquietanti",
    documentary: "giornalismo investigativo serio con soggetti reali, ambienti autentici, composizioni credibili, atmosfera professionale, momenti di rivelazione"
  };

  // Costruisco un prompt molto più dettagliato e specifico
  let detailedPrompt = `Create an ultra-detailed YouTube thumbnail in ${stylePrompt} style.

MAIN SUBJECT: "${title}"
${description ? `SPECIFIC DETAILS: ${description}` : ''}
CATEGORY CONTEXT: ${categoryPrompts[category] || category}

REQUISITI VISIVI PER MINIATURA YOUTUBE:
- L'immagine deve rappresentare visivamente il contenuto di "${title}"
- Se presente una descrizione, incorpora quegli elementi specifici
- Composizione dinamica con soggetti chiari e ben definiti
- Illuminazione cinematografica professionale con contrasti forti
- Colori vivaci e saturi che attirano l'attenzione su YouTube
- Soggetti principali devono occupare almeno il 60% dell'inquadratura
- Espressioni facciali marcate ed emotive se ci sono persone
- Oggetti e ambientazioni che raccontano immediatamente la storia
- Sfondo non troppo dettagliato per non distrarre dal soggetto principale
- Formato 16:9 (1280x720px) con regola dei terzi applicata
- Focus principale nel centro-sinistra per massimo impatto visivo

DIVIETO ASSOLUTO DI TESTO:
- ZERO testi, scritte, parole, lettere, numeri nell'immagine
- NO titoli, NO nomi di luoghi, NO date, NO didascalie
- NO loghi, NO insegne, NO cartelli con scritte
- NO giornali con titoli leggibili, NO documenti con testo
- L'immagine deve essere PURAMENTE VISIVA senza elementi testuali

${category === "crime" ? `
ELEMENTI SPECIALIZZATI CRIME/SUSPENSE:
- Atmosfera noir con luci drammatiche e ombre marcate
- Contrasti forti tra luci e ombre per creare tensione
- Personaggi con espressioni intense: sospetto, paura, determinazione
- Oggetti investigativi: lente d'ingrandimento, prove fisiche, nastro polizia
- Sagome misteriose, volti parzialmente nascosti, figure sospette
- Ambientazioni: strade notturne, stanze buie, uffici investigativi
- Palette colori: blu scuri, grigi freddi, rossi drammatici, gialli dei lampioni
- Elementi che suggeriscono pericolo: ombre minacciose, sguardi penetranti
- Composizione che crea suspense e curiosità immediata
- Atmosfera che trasmette mistero e urgenza investigativa
- RIGOROSAMENTE SENZA alcun tipo di testo o scritta
` : ''}

STYLE DETAILS:
- ${style === "realistic" ? 
  "Professional photography quality, realistic human expressions, natural lighting effects, detailed textures, authentic environments" :
  "Bold cartoon aesthetics, exaggerated expressions, bright saturated colors, stylized character designs, dynamic poses"}

OBIETTIVO FINALE:
La miniatura deve comunicare istantaneamente il contenuto di "${title}" attraverso:
- Elementi visivi immediatamente riconoscibili
- Composizione che cattura l'attenzione in 2-3 secondi
- Emozioni e atmosfera che invogliano al click
- Chiarezza visiva anche in formato ridotto (thumbnail piccole)

OTTIMIZZAZIONE SPECIFICA YOUTUBE:
- Contrasti estremi per visibilità su smartphone
- Soggetti principali occupano il 70% dell'immagine
- Colori saturi che emergono nel feed YouTube
- Espressioni facciali amplificate e riconoscibili
- Composizione che attira l'occhio in 0.3 secondi
- Elementi di sorpresa o curiosità immediata
- Bilanciamento perfetto tra semplicità e ricchezza visiva
- Resistente alla compressione delle miniature

VERIFICA FINALE ANTI-TESTO:
- Nessun testo in qualsiasi lingua o alfabeto
- Nessun simbolo che assomigli a lettere
- Nessuna scritta su oggetti, cartelli, schermi
- Nessun documento con testo leggibile
- Solo elementi visivi puri che comunicano attraverso forme, colori, espressioni

STANDARD QUALITÀ YOUTUBE:
- Qualità fotografica professionale 4K
- Nitidezza cristallina per ogni dettaglio
- Saturazione colori ottimizzata per algoritmo YouTube
- Composizione che massimizza il click-through rate`;

  try {
    // IMPORTANT: only this gemini model supports image generation
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: [{ role: "user", parts: [{ text: detailedPrompt }] }],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No response candidates from Gemini");
    }

    const content = candidates[0].content;
    if (!content || !content.parts) {
      throw new Error("No content parts in Gemini response");
    }

    for (const part of content.parts) {
      if (part.text) {
        console.log("Gemini image generation description:", part.text);
      } else if (part.inlineData && part.inlineData.data) {
        // Create a temporary file to store the image
        const tempDir = path.join(process.cwd(), 'temp');
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }
        
        const imagePath = path.join(tempDir, `thumbnail_${Date.now()}.png`);
        const imageData = Buffer.from(part.inlineData.data, "base64");
        fs.writeFileSync(imagePath, imageData);
        
        // For development, we'll convert to data URL
        const dataUrl = `data:image/png;base64,${part.inlineData.data}`;
        console.log(`High-quality thumbnail saved: ${imagePath}`);
        
        return { url: dataUrl };
      }
    }
    
    throw new Error("No image data found in Gemini response");
  } catch (error) {
    throw new Error(`Failed to generate image with Gemini: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
