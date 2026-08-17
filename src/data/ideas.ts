import type { RestyleIdea } from '../types/restyle';

// Real photos supplied by the user, replacing Magic Patterns' placeholder URLs.
const IMG = {
  capeSaree: '/cape_saree.jpg',
  bustierCoord: '/structured_bustier_lehange.jpg',
  cutOutBlouse: '/cut_out_blause.jpg',
  jacketAnarkali: '/fe9e9b554fdcb2c08fed7e9de6b022da.jpg',
  preDrapedSkirt: '/pre_draped_saree.jpg',
  softOmbre: '/lavender_dress.jpg',
  cowlDrape: '/cowl_drape_anarkali_gown.jpg',
  bodiceLehenga: '/red_lehenga.jpg',
  fabricDetail: '/duppata.jpg'
};

/**
 * Local stand-in for the "Restyle Ideas" table in the SecondLife Airtable base.
 * Same field names as Airtable so swapping in the REST response is a drop-in.
 */
export const restyleIdeas: RestyleIdea[] = [
  {
    idea_id: 1,
    garment_type: 'Lehenga Choli',
    dominant_color: 'Maroon',
    fabric_type: ['Silk', 'Raw Silk'],
    original_style_tags: ['Heavy Embroidery', 'Bordered'],
    restyle_output: 'Cape-sleeve lehenga choli',
    restyle_description:
      'The dupatta is cut down into a sheer cape and stitched into the shoulder seams of the choli, so the blouse reads modern without touching the embroidery. The skirt stays exactly as it is, which keeps the cost to one tailor visit.',
    difficulty_level: 'Easy (tailor can do)',
    source_link: 'https://www.pinterest.com/search/pins/?q=cape%20sleeve%20lehenga',
    after_image_reference: IMG.capeSaree,
    image_gallery: [IMG.capeSaree]
  },
  {
    idea_id: 2,
    garment_type: 'Lehenga Choli',
    dominant_color: 'Maroon',
    fabric_type: ['Velvet', 'Silk'],
    original_style_tags: ['Heavy Embroidery', 'Zari Work'],
    restyle_output: 'Embroidered co-ord set',
    restyle_description:
      'The choli is lengthened into a boxy cropped top and the lehenga panels are re-cut into wide-leg trousers. You lose the ghera but gain something you will actually wear to dinner.',
    difficulty_level: 'Medium',
    source_link: 'https://www.pinterest.com/search/pins/?q=lehenga%20to%20co-ord%20set',
    after_image_reference: IMG.bustierCoord,
    image_gallery: [IMG.bustierCoord]
  },
  {
    idea_id: 3,
    garment_type: 'Saree',
    dominant_color: 'Sage Green',
    fabric_type: ['Georgette', 'Chiffon'],
    original_style_tags: ['Bordered', 'Plain'],
    restyle_output: 'Saree to co-ord set',
    restyle_description:
      'Six yards of georgette is more than enough for a cropped top and a pair of flowing pants, with the pallu border reused as a waistband and cuff trim. Best for sarees you never drape because pleating feels like a chore.',
    difficulty_level: 'Easy (tailor can do)',
    source_link: 'https://www.pinterest.com/search/pins/?q=saree%20to%20coord%20set',
    after_image_reference: IMG.cutOutBlouse,
    image_gallery: [IMG.cutOutBlouse]
  },
  {
    idea_id: 4,
    garment_type: 'Saree',
    dominant_color: 'Navy',
    fabric_type: ['Silk', 'Banarsi'],
    original_style_tags: ['Zari Work', 'Bordered'],
    restyle_output: 'Banarsi wrap jacket',
    restyle_description:
      'A heavy Banarsi saree becomes a knee-length open jacket with the zari border running down both front panels. Throw it over jeans or a plain kurta and the weave does all the work.',
    difficulty_level: 'Medium',
    source_link: 'https://www.pinterest.com/search/pins/?q=banarasi%20saree%20jacket',
    after_image_reference: IMG.jacketAnarkali,
    image_gallery: [IMG.jacketAnarkali]
  },
  {
    idea_id: 5,
    garment_type: 'Anarkali',
    dominant_color: 'Navy',
    fabric_type: ['Velvet', 'Net'],
    original_style_tags: ['Heavy Embroidery', 'Flared'],
    restyle_output: 'Open-front jacket dress',
    restyle_description:
      'The anarkali is slit open down the centre front and finished with a zari border, turning it into a floor-length jacket worn over a plain slip or trousers. The original flare becomes the drama of the coat.',
    difficulty_level: 'Medium',
    source_link: 'https://www.pinterest.com/search/pins/?q=anarkali%20to%20jacket',
    after_image_reference: IMG.jacketAnarkali,
    image_gallery: [IMG.jacketAnarkali]
  },
  {
    idea_id: 6,
    garment_type: 'Anarkali',
    dominant_color: 'Emerald',
    fabric_type: ['Georgette', 'Net'],
    original_style_tags: ['Sequins', 'Flared'],
    restyle_output: 'Cropped kurta with tiered skirt',
    restyle_description:
      'The anarkali is cut at the waist: the yoke becomes a short kurta and the lower flare is gathered into a separate tiered skirt. Two pieces you can mix with things you already own.',
    difficulty_level: 'Medium',
    source_link: 'https://www.pinterest.com/search/pins/?q=anarkali%20restyle%20skirt',
    after_image_reference: IMG.preDrapedSkirt,
    image_gallery: [IMG.preDrapedSkirt]
  },
  {
    idea_id: 7,
    garment_type: 'Gharara',
    dominant_color: 'Dusty Rose',
    fabric_type: ['Silk', 'Organza'],
    original_style_tags: ['Sequins', 'Bordered'],
    restyle_output: 'Flared wrap skirt',
    restyle_description:
      'The gharara legs are opened at the inseam and re-joined into one continuous wrap skirt, keeping the sequin band exactly where it falls. Pair it with a plain blouse so the border stays the focus.',
    difficulty_level: 'Easy (tailor can do)',
    source_link: 'https://www.pinterest.com/search/pins/?q=gharara%20to%20skirt',
    after_image_reference: IMG.preDrapedSkirt,
    image_gallery: [IMG.preDrapedSkirt]
  },
  {
    idea_id: 8,
    garment_type: 'Gharara',
    dominant_color: 'Maroon',
    fabric_type: ['Velvet', 'Banarsi'],
    original_style_tags: ['Zari Work', 'Heavy Embroidery'],
    restyle_output: 'Short kurta with straight pants',
    restyle_description:
      'The heavy gharara flare is trimmed into straight-leg pants and the leftover fabric lines a short mandarin-collar kurta. A much lighter outfit that still photographs as formal.',
    difficulty_level: 'Needs designer',
    source_link: 'https://www.pinterest.com/search/pins/?q=gharara%20restyle',
    after_image_reference: IMG.bustierCoord,
    image_gallery: [IMG.bustierCoord]
  },
  {
    idea_id: 9,
    garment_type: 'Sharara',
    dominant_color: 'Ivory',
    fabric_type: ['Chiffon', 'Organza'],
    original_style_tags: ['Mirror Work', 'Sheer Panels'],
    restyle_output: 'Palazzo and cropped cami',
    restyle_description:
      'The sharara is narrowed into soft palazzos and the extra width is used for a bias-cut cami with mirror-work straps. Feels summery instead of bridal.',
    difficulty_level: 'Easy (tailor can do)',
    source_link: 'https://www.pinterest.com/search/pins/?q=sharara%20restyle',
    after_image_reference: IMG.softOmbre,
    image_gallery: [IMG.softOmbre]
  },
  {
    idea_id: 10,
    garment_type: 'Peshwas',
    dominant_color: 'Gold',
    fabric_type: ['Net', 'Organza'],
    original_style_tags: ['Sequins', 'Sheer Panels'],
    restyle_output: 'Sheer layered maxi',
    restyle_description:
      'The peshwas frock is shortened at the hem and layered over a plain slip to lighten it, with the sequin net kept only on the top half. A good fix for frocks that feel too heavy to sit in.',
    difficulty_level: 'Medium',
    source_link: 'https://www.pinterest.com/search/pins/?q=peshwas%20restyle',
    after_image_reference: IMG.softOmbre,
    image_gallery: [IMG.softOmbre]
  },
  {
    idea_id: 11,
    garment_type: 'Shalwar/Kameez',
    dominant_color: 'Mustard',
    fabric_type: ['Cotton', 'Silk'],
    original_style_tags: ['Printed', 'Straight Cut'],
    restyle_output: 'Belted shirt dress',
    restyle_description:
      'The kameez is taken in at the waist, given a placket and a self-fabric belt, and worn as a standalone shirt dress. The shalwar fabric becomes the belt and pocket facings.',
    difficulty_level: 'Easy (tailor can do)',
    source_link: 'https://www.pinterest.com/search/pins/?q=kameez%20shirt%20dress',
    after_image_reference: IMG.cowlDrape,
    image_gallery: [IMG.cowlDrape]
  },
  {
    idea_id: 12,
    garment_type: 'Kurti with palazzo/pants',
    dominant_color: 'Lilac',
    fabric_type: ['Georgette', 'Cotton'],
    original_style_tags: ['Plain', 'Bordered'],
    restyle_output: 'Cropped top and sarong skirt',
    restyle_description:
      'The kurti is cropped to the waist and the palazzos are opened into a tie-front sarong skirt. Two casual separates from one tired suit.',
    difficulty_level: 'Easy (tailor can do)',
    source_link: 'https://www.pinterest.com/search/pins/?q=kurti%20restyle',
    after_image_reference: IMG.cutOutBlouse,
    image_gallery: [IMG.cutOutBlouse]
  },
  {
    idea_id: 13,
    garment_type: 'Angrakha',
    dominant_color: 'Red',
    fabric_type: ['Silk', 'Raw Silk'],
    original_style_tags: ['Zari Work', 'Bordered'],
    restyle_output: 'Wrap top with tie waist',
    restyle_description:
      'The angrakha panel is shortened to hip length and re-tied at the side to work as a wrap top. Keep the original zari ties as the fastening so nothing is wasted.',
    difficulty_level: 'Easy (tailor can do)',
    source_link: 'https://www.pinterest.com/search/pins/?q=angrakha%20restyle',
    after_image_reference: IMG.cowlDrape,
    image_gallery: [IMG.cowlDrape]
  },
  {
    idea_id: 14,
    garment_type: 'Maxi/Gown',
    dominant_color: 'Black',
    fabric_type: ['Velvet', 'Net'],
    original_style_tags: ['Sequins', 'Straight Cut'],
    restyle_output: 'Corset bodice with lehenga skirt',
    restyle_description:
      'The gown bodice is boned into a structured corset and the skirt is re-gathered onto a lehenga waistband. Reads bridal-adjacent without buying anything new.',
    difficulty_level: 'Needs designer',
    source_link: 'https://www.pinterest.com/search/pins/?q=gown%20to%20lehenga',
    after_image_reference: IMG.bodiceLehenga,
    image_gallery: [IMG.bodiceLehenga]
  },
  {
    idea_id: 15,
    garment_type: 'Lehenga Choli',
    dominant_color: 'Sage Green',
    fabric_type: ['Organza', 'Net'],
    original_style_tags: ['Sheer Panels', 'Flared'],
    restyle_output: 'Layered organza midi',
    restyle_description:
      'The lehenga is shortened to mid-calf and the removed panels are added as a second sheer layer for movement. Wear it with a plain knit and it stops looking like a wedding outfit.',
    difficulty_level: 'Medium',
    source_link: 'https://www.pinterest.com/search/pins/?q=lehenga%20to%20midi%20skirt',
    after_image_reference: IMG.fabricDetail,
    image_gallery: [IMG.fabricDetail]
  },
  {
    idea_id: 16,
    garment_type: 'Saree',
    dominant_color: 'Royal Blue',
    fabric_type: ['Chiffon', 'Georgette'],
    original_style_tags: ['Printed', 'Plain'],
    restyle_output: 'Pre-draped saree gown',
    restyle_description:
      'The saree is stitched into a permanent drape over a fitted underskirt so it goes on in one step. Nothing is cut away, so the piece can be undone later if you change your mind.',
    difficulty_level: 'Medium',
    source_link: 'https://www.pinterest.com/search/pins/?q=pre%20draped%20saree%20gown',
    after_image_reference: IMG.preDrapedSkirt,
    image_gallery: [IMG.preDrapedSkirt]
  },
  {
    idea_id: 17,
    garment_type: 'Lehenga Choli',
    dominant_color: 'Ivory',
    fabric_type: ['Raw Silk', 'Banarsi'],
    original_style_tags: ['Bordered', 'Plain'],
    restyle_output: 'Bustier and pleated pants',
    restyle_description:
      'The choli is rebuilt as a structured bustier and the lehenga is re-cut into deeply pleated trousers with the border sitting at the hem. Modern, but the fabric story stays intact.',
    difficulty_level: 'Needs designer',
    source_link: 'https://www.pinterest.com/search/pins/?q=lehenga%20to%20pants',
    after_image_reference: IMG.bustierCoord,
    image_gallery: [IMG.bustierCoord]
  },
  {
    idea_id: 18,
    garment_type: 'Other',
    dominant_color: 'Gold',
    fabric_type: ['Net', 'Silk'],
    original_style_tags: ['Heavy Embroidery', 'Sequins'],
    restyle_output: 'Embroidery salvage panel set',
    restyle_description:
      'Where a garment is too damaged to re-cut whole, the embroidered motifs are lifted off and re-applied onto a new plain base — a jacket, a bag, or a plain kurta. The handwork survives even if the outfit does not.',
    difficulty_level: 'Needs designer',
    source_link: 'https://www.pinterest.com/search/pins/?q=embroidery%20salvage%20upcycle',
    after_image_reference: IMG.fabricDetail,
    image_gallery: [IMG.fabricDetail]
  }
];