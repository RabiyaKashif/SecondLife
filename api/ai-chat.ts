interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface RestyleIdea {
  restyle_output: string;
  restyle_description: string;
  difficulty_level: string;
  garment_type: string;
  fabric_type: string[];
  dominant_color: string;
  original_style_tags: string[];
}

/**
 * Generate detailed styling advice based on the user's question and matched ideas
 */
function generateAIResponse(
  userQuestion: string,
  garmentType: string,
  dominantColor: string,
  fabricType: string[],
  topMatches: RestyleIdea[]
): string {
  const questionLower = userQuestion.toLowerCase();

  // Fabric advice
  if (
    questionLower.includes('fabric') ||
    questionLower.includes('material') ||
    questionLower.includes('cloth')
  ) {
    const fabrics = [...new Set(topMatches.flatMap((m) => m.fabric_type))];
    return `For your ${dominantColor} ${garmentType}, here are fabric recommendations:

**Recommended Fabrics:** ${fabrics.join(', ') || 'Silk, Raw Silk, Velvet, Cotton blends'}

**Why these work:**
- They hold their shape well for structured cuts
- They drape beautifully for flowing styles
- They take embroidery beautifully
- They're durable for tailor modifications

**Fabric Modification Tips:**
- For color change: Dye natural fabrics (silk, cotton) well. Blended fabrics may have varied results.
- For weight: Heavier silks work for voluminous skirts. Lighter fabrics suit fitted co-ord sets.
- For embroidery: Ensure base fabric can support embroidered pieces without puckering.

Ask me about specific cuts or colors if you need more detailed guidance!`;
  }

  // Color transformation advice
  if (
    questionLower.includes('color') ||
    questionLower.includes('dye') ||
    questionLower.includes('shade')
  ) {
    return `Transforming the color of your ${garmentType} from ${dominantColor}:

**Color Change Options:**
1. **Professional Dyeing** (Recommended)
   - Take to a professional dyer (usually ₹500-1500)
   - Works best on natural fabrics: silk, cotton, linen
   - Results depend on current color and desired shade

2. **Color Blocking**
   - Add contrasting colored panels
   - Great for modern co-ord sets
   - Keeps original embroidery visible

3. **Fabric Overlays**
   - Drape contrasting sheer fabric over original
   - Reversible (can be removed)
   - Creates layered, modern look

4. **Embroidery Relocation**
   - Move embroidered panels to different positions
   - Add new colored base beneath
   - Changes overall aesthetic

**For your specific garment:** Based on your request, I recommend ${topMatches[0]?.restyle_description || 'consulting with a professional dyer'}.

What specific color are you aiming for?`;
  }

  // Cutting & silhouette advice
  if (
    questionLower.includes('cut') ||
    questionLower.includes('silhouette') ||
    questionLower.includes('shape') ||
    questionLower.includes('co-ord') ||
    questionLower.includes('modern')
  ) {
    return `Cutting & Silhouette Options for your ${garmentType}:

**Popular Transformations:**
1. **Co-ord Set Conversion**
   - Lehenga → High-waisted pants/skirt + crop top
   - Saree → Draped co-ord set or palazzo set
   - Anarkali → Tunic top + fitted pants
   - Cost: 2-3 tailor visits

2. **Modern Crop Top**
   - Keep embroidered choli, shorten it
   - Convert lehenga into full skirt or culotte pants
   - Clean, wearable look

3. **Gown/Maxi Style**
   - Remove lehnga cut, create straight gown silhouette
   - Add modern neckline or back
   - Reposition embroidery as accent

4. **Skirt Reimagine**
   - A-line to straight cut
   - Ghera (flare) to fitted
   - Add high slits for modern feel

**For your garment:** Your ${dominantColor} ${garmentType} would look stunning as a ${topMatches[0]?.restyle_output || 'modern co-ord set'}.

**Tailor Instructions:**
- Take accurate measurements (waist, bust, length, sleeve)
- Discuss seam placement to preserve embroidery
- Get approval sketches before cutting
- Keep fabric scraps for matching

What specific silhouette appeals to you?`;
  }

  // Embroidery advice
  if (
    questionLower.includes('embroid') ||
    questionLower.includes('work') ||
    questionLower.includes('zari') ||
    questionLower.includes('sequin')
  ) {
    return `Working with Embroidery in Your Restyle:

**Embroidery Preservation:**
1. **Keep it centered** - Make embroidery the focal point
2. **Relocate if needed** - Move to neckline, hemline, or back
3. **Add new work** - Combine old + new for layered look

**Embroidery Types & Handling:**
- **Heavy Zari Work**: Keep on structured pieces (choli, blouse)
- **Beadwork**: Can be carefully relocated with patience
- **Hand Embroidery**: Precious - preserve on main piece
- **Machine Embroidery**: More flexible for repositioning

**Creative Options:**
- Create embroidered belt for co-ord set
- Make matching dupatta from embroidered panels
- Frame embroidered sections as accent on modern piece
- Create trendy embroidered crop top

**Your Garment:** Your ${garmentType} has beautiful embroidery. ${topMatches[0]?.restyle_description || 'Consider keeping it as the focal point of your restyle'}

**Cost Estimate for Embroidery Work:**
- Simple relocation: ₹200-500
- Adding new embroidery: ₹500-1000
- Intricate repositioning: ₹1000+

Shall I tell you about keeping vs. relocating your specific embroidery?`;
  }

  // Default: Summarize matched ideas
  return `Great question! Based on your ${dominantColor} ${garmentType} and your style preferences, here are the best ways to transform it:

**Top Recommendations:**
${topMatches
  .slice(0, 3)
  .map(
    (idea, i) =>
      `${i + 1}. **${idea.restyle_output}** (${idea.difficulty_level})
   ${idea.restyle_description}
   Fabrics: ${idea.fabric_type.join(', ')}`
  )
  .join('\n\n')}

**What Would You Like to Know More About?**
- Specific **fabric** to use
- **Color** transformation techniques  
- **Cutting & silhouette** changes
- **Embroidery** handling
- **Detailed tailor instructions**
- **Cost estimates**

Feel free to ask me anything about these ideas or suggest your own custom restyle!`;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      garment_type,
      dominant_color,
      fabric_type,
      user_question,
      topMatches
    }: {
      garment_type: string;
      dominant_color: string;
      fabric_type: string[];
      user_question: string;
      topMatches: RestyleIdea[];
    } = req.body;

    if (!user_question) {
      return res.status(400).json({ error: 'User question is required' });
    }

    // Generate response locally (no external API needed)
    const response = generateAIResponse(
      user_question,
      garment_type,
      dominant_color,
      fabric_type,
      topMatches
    );

    return res.status(200).json({ response });
  } catch (error: any) {
    console.error('AI chat handler error:', error.message);
    return res.status(500).json({ 
      error: 'Server error', 
      message: error.message 
    });
  }
}
