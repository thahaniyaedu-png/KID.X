import React, { useState } from 'react';
import { Product } from '../data/products';

import studioBabyWear from '../assets/images/studio_baby_wear_1790490433172.jpg';
import studioBoysTopwear from '../assets/images/studio_boys_topwear_1790490446365.jpg';
import studioBoysBottomsEthnic from '../assets/images/studio_boys_bottoms_ethnic_1790490456565.jpg';
import studioGirlsDressesEthnic from '../assets/images/studio_girls_dresses_ethnic_1790490467661.jpg';
import studioGirlsCasualwear from '../assets/images/studio_girls_casualwear_1790490477843.jpg';
import studioToysPlushWooden from '../assets/images/studio_toys_plush_wooden_1790490488113.jpg';
import studioToysActiveStem from '../assets/images/studio_toys_active_stem_1790490498272.jpg';
import studioBabyCareLineup from '../assets/images/studio_baby_care_lineup_1790490510987.jpg';
import studioBooksAndSchool from '../assets/images/studio_books_and_school_1790490523089.jpg';
import studioAccessoriesFootwear from '../assets/images/studio_accessories_footwear_1790490534905.jpg';

interface ProductVisualProps {
  product: Product;
  className?: string;
}

type Quadrant = 'TL' | 'TR' | 'BL' | 'BR';

interface StudioPhotoSpec {
  sheet: string;
  quadrant: Quadrant;
  /** Fine-tuned zoom (e.g., 204 = 204% width/height for a single quadrant, 225 = tighter macro crop) */
  zoomPercent: number;
  /** Additional horizontal shift percentage within the quadrant */
  offsetX: number;
  /** Additional vertical shift percentage within the quadrant */
  offsetY: number;
  /** Subtle CSS filter for unique color/tone differentiation when two items share a base quadrant */
  filter: string;
  /** Studio rim accent */
  studioNote: string;
}

/**
 * Maps each of the 100 unique KID.X products (kidx-001 through kidx-100)
 * to its specific realistic studio product photograph quadrant & unique framing.
 */
function getStudioPhotoSpec(product: Product): StudioPhotoSpec {
  const num = parseInt(product.id.replace('kidx-', ''), 10) || 1;

  //Exact per-product mapping across our 10 studio photography sheets (40 quadrants)
  const mappings: Record<number, StudioPhotoSpec> = {
    // --- BABY CLOTHING (1-3) ---
    1: { sheet: studioBabyWear, quadrant: 'TL', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: 'Organic Combed Cotton' },
    2: { sheet: studioBabyWear, quadrant: 'TR', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: 'Snap-Front Interlock' },
    3: { sheet: studioBabyWear, quadrant: 'BL', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: '5-Pc Newborn Set' },

    // --- BOYS CLOTHING (4-16) ---
    4: { sheet: studioBoysTopwear, quadrant: 'TL', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: '180 GSM Bio-Washed' },
    5: { sheet: studioBoysTopwear, quadrant: 'TR', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: 'Soft-Washed Chambray' },
    6: { sheet: studioBoysTopwear, quadrant: 'BL', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: 'Honeycomb Pique Knit' },
    7: { sheet: studioBoysBottomsEthnic, quadrant: 'TL', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: 'Peached Cotton Twill' },
    8: { sheet: studioBoysBottomsEthnic, quadrant: 'TL', zoomPercent: 224, offsetX: -6, offsetY: -6, filter: 'hue-rotate(65deg) saturate(1.05)', studioNote: 'Stretch Adventure Chino' },
    9: { sheet: studioBoysBottomsEthnic, quadrant: 'TR', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: 'Knitted Indigo Denim' },
    10: { sheet: studioBoysBottomsEthnic, quadrant: 'TR', zoomPercent: 228, offsetX: -12, offsetY: -8, filter: 'saturate(1.2) contrast(1.04)', studioNote: 'Loopback French Terry' },
    11: { sheet: studioBoysTopwear, quadrant: 'BR', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: 'Brushed Fleece Lined' },
    12: { sheet: studioBoysTopwear, quadrant: 'BR', zoomPercent: 226, offsetX: -8, offsetY: -6, filter: 'hue-rotate(135deg) saturate(0.95)', studioNote: 'Diamond Quilted Shell' },
    13: { sheet: studioBoysBottomsEthnic, quadrant: 'BL', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: 'Festive Silk Jacquard' },
    14: { sheet: studioBoysBottomsEthnic, quadrant: 'BR', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: '4-Pc Velvet Tuxedo' },
    15: { sheet: studioBoysBottomsEthnic, quadrant: 'BR', zoomPercent: 224, offsetX: -8, offsetY: -4, filter: 'hue-rotate(-25deg) brightness(1.06)', studioNote: '1st Birthday Gentleman' },
    16: { sheet: studioBoysTopwear, quadrant: 'TL', zoomPercent: 226, offsetX: -8, offsetY: -8, filter: 'hue-rotate(35deg) contrast(1.05)', studioNote: '2-Pc Cotton Night Suit' },

    // --- GIRLS CLOTHING (17-29) ---
    17: { sheet: studioGirlsDressesEthnic, quadrant: 'TL', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: 'Hand-Smocked Cambric' },
    18: { sheet: studioGirlsDressesEthnic, quadrant: 'TR', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: 'Swiss-Dot Tulle Overlay' },
    19: { sheet: studioGirlsCasualwear, quadrant: 'TL', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: 'Schiffli Eyelet Cotton' },
    20: { sheet: studioGirlsCasualwear, quadrant: 'TL', zoomPercent: 226, offsetX: -10, offsetY: -6, filter: 'hue-rotate(-20deg) saturate(1.15)', studioNote: '3D Ribbon Applique Tee' },
    21: { sheet: studioGirlsCasualwear, quadrant: 'TR', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: '360° Box-Pleat Twirl' },
    22: { sheet: studioGirlsCasualwear, quadrant: 'BL', zoomPercent: 222, offsetX: 0, offsetY: 0, filter: 'hue-rotate(15deg) brightness(1.04)', studioNote: 'Scallop-Hem Tencel Denim' },
    23: { sheet: studioGirlsCasualwear, quadrant: 'BL', zoomPercent: 228, offsetX: -14, offsetY: -10, filter: 'saturate(1.18)', studioNote: '4-Way Stretch Rib Knit' },
    24: { sheet: studioGirlsCasualwear, quadrant: 'BL', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: 'Chain-Stitch Heart Denim' },
    25: { sheet: studioGirlsCasualwear, quadrant: 'BR', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: '2-Pc Linen Culotte Set' },
    26: { sheet: studioGirlsDressesEthnic, quadrant: 'BL', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: 'Festive Gota-Patti Chanderi' },
    27: { sheet: studioGirlsDressesEthnic, quadrant: 'BR', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: 'Starlight Sequin Organza' },
    28: { sheet: studioGirlsDressesEthnic, quadrant: 'TR', zoomPercent: 226, offsetX: -8, offsetY: -6, filter: 'hue-rotate(30deg) saturate(1.15)', studioNote: 'Crown & Bridal Tulle Set' },
    29: { sheet: studioBabyWear, quadrant: 'BR', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: 'Double-Gauze Organic Muslin' },

    // --- TOYS (30-52) ---
    30: { sheet: studioToysPlushWooden, quadrant: 'TL', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: '40 cm Honey-Plush Bear' },
    31: { sheet: studioToysPlushWooden, quadrant: 'TL', zoomPercent: 226, offsetX: -8, offsetY: -6, filter: 'hue-rotate(-35deg) brightness(1.06)', studioNote: '32 cm Velour Bunny' },
    32: { sheet: studioToysPlushWooden, quadrant: 'TL', zoomPercent: 232, offsetX: -12, offsetY: -10, filter: 'hue-rotate(310deg) saturate(1.15)', studioNote: 'Handcrafted Cotton Doll' },
    33: { sheet: studioToysPlushWooden, quadrant: 'TR', zoomPercent: 224, offsetX: -8, offsetY: -4, filter: 'hue-rotate(45deg)', studioNote: 'Polished Beechwood Rattle' },
    34: { sheet: studioToysPlushWooden, quadrant: 'TR', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: '8-Note Tuned Xylophone' },
    35: { sheet: studioToysPlushWooden, quadrant: 'BL', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: '60-Pc Maple Castle Blocks' },
    36: { sheet: studioToysPlushWooden, quadrant: 'BL', zoomPercent: 226, offsetX: -10, offsetY: -8, filter: 'hue-rotate(175deg) saturate(1.1)', studioNote: '110-Pc Gear & Bolt Set' },
    37: { sheet: studioToysPlushWooden, quadrant: 'BR', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: '7-Arch Basswood Stacker' },
    38: { sheet: studioToysPlushWooden, quadrant: 'BR', zoomPercent: 228, offsetX: -12, offsetY: -10, filter: 'hue-rotate(85deg)', studioNote: '12-Block Woodland Sorter' },
    39: { sheet: studioToysActiveStem, quadrant: 'BL', zoomPercent: 224, offsetX: -6, offsetY: -6, filter: 'hue-rotate(190deg)', studioNote: '84-Magnet Solar & World Board' },
    40: { sheet: studioToysPlushWooden, quadrant: 'BL', zoomPercent: 232, offsetX: -4, offsetY: -12, filter: 'sepia(0.15) contrast(1.05)', studioNote: '3-in-1 Montessori Box' },
    41: { sheet: studioToysActiveStem, quadrant: 'TL', zoomPercent: 228, offsetX: -10, offsetY: -8, filter: 'hue-rotate(160deg)', studioNote: '14-Pc Wooden Doctor Kit' },
    42: { sheet: studioToysActiveStem, quadrant: 'TL', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: '24-Pc Modular Play Kitchen' },
    43: { sheet: studioToysActiveStem, quadrant: 'TR', zoomPercent: 226, offsetX: -12, offsetY: -8, filter: 'hue-rotate(-15deg) saturate(1.1)', studioNote: '4-Pack Die-Cast Rescue' },
    44: { sheet: studioToysActiveStem, quadrant: 'TR', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: '2.4GHz 4WD Stunt RC Car' },
    45: { sheet: studioToysActiveStem, quadrant: 'BR', zoomPercent: 228, offsetX: -12, offsetY: -10, filter: 'saturate(1.15)', studioNote: '12-Pc Wildlife Figurines' },
    46: { sheet: studioToysActiveStem, quadrant: 'TR', zoomPercent: 230, offsetX: -4, offsetY: -12, filter: 'hue-rotate(140deg) brightness(1.05)', studioNote: '6-Pc Submarine Bath Set' },
    47: { sheet: studioToysPlushWooden, quadrant: 'TR', zoomPercent: 232, offsetX: -14, offsetY: -12, filter: 'hue-rotate(95deg)', studioNote: '2-in-1 Lawn Bowling & Toss' },
    48: { sheet: studioToysActiveStem, quadrant: 'BL', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: '48-Pc Giant Floor Puzzle' },
    49: { sheet: studioToysActiveStem, quadrant: 'BL', zoomPercent: 228, offsetX: -14, offsetY: -10, filter: 'hue-rotate(35deg) contrast(1.05)', studioNote: 'Magnetic Ludo & Snakes' },
    50: { sheet: studioToysPlushWooden, quadrant: 'BR', zoomPercent: 234, offsetX: -6, offsetY: -14, filter: 'hue-rotate(270deg)', studioNote: '6-in-1 Sensory Busy Cube' },
    51: { sheet: studioAccessoriesFootwear, quadrant: 'TL', zoomPercent: 228, offsetX: -10, offsetY: -10, filter: 'hue-rotate(320deg)', studioNote: 'Platinum Silicone Teether' },
    52: { sheet: studioToysActiveStem, quadrant: 'BR', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: '14-in-1 Solar Rover STEM' },

    // --- BABY & KIDS CARE (53-64) ---
    53: { sheet: studioBabyCareLineup, quadrant: 'TL', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: '250 ml Colloidal Oat Lotion' },
    54: { sheet: studioBabyCareLineup, quadrant: 'BL', zoomPercent: 224, offsetX: -4, offsetY: -6, filter: 'hue-rotate(-30deg)', studioNote: '200 g Shea & Almond Cream' },
    55: { sheet: studioBabyCareLineup, quadrant: 'TL', zoomPercent: 226, offsetX: -12, offsetY: -6, filter: 'hue-rotate(25deg)', studioNote: '300 ml Tear-Free Foam Wash' },
    56: { sheet: studioBabyCareLineup, quadrant: 'TR', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: '300 ml Hibiscus Shampoo' },
    57: { sheet: studioBabyCareLineup, quadrant: 'BL', zoomPercent: 228, offsetX: -14, offsetY: -10, filter: 'brightness(1.03)', studioNote: '3 x 75 g Milk & Shea Soap' },
    58: { sheet: studioBabyCareLineup, quadrant: 'BL', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: '100 g Avocado Face Cream' },
    59: { sheet: studioBabyCareLineup, quadrant: 'TR', zoomPercent: 228, offsetX: -14, offsetY: -8, filter: 'saturate(1.12)', studioNote: '200 ml Cold-Pressed Oil' },
    60: { sheet: studioBabyCareLineup, quadrant: 'TL', zoomPercent: 232, offsetX: -8, offsetY: -12, filter: 'hue-rotate(15deg) saturate(1.1)', studioNote: '150 ml Aloe Kids Face Wash' },
    61: { sheet: studioBabyCareLineup, quadrant: 'TR', zoomPercent: 234, offsetX: -4, offsetY: -14, filter: 'hue-rotate(330deg)', studioNote: 'Twin Pack Berry Lip Balm' },
    62: { sheet: studioBabyCareLineup, quadrant: 'BR', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: '216 Bamboo Water Wipes' },
    63: { sheet: studioBabyCareLineup, quadrant: 'BL', zoomPercent: 234, offsetX: -10, offsetY: -4, filter: 'hue-rotate(180deg)', studioNote: '100 g Zinc & Kokum Barrier' },
    64: { sheet: studioBabyCareLineup, quadrant: 'BR', zoomPercent: 228, offsetX: -14, offsetY: -10, filter: 'contrast(1.04)', studioNote: '7-Pc Nursery Rope Hamper' },

    // --- BOOKS & LEARNING (65-76) ---
    65: { sheet: studioBooksAndSchool, quadrant: 'TL', zoomPercent: 226, offsetX: -12, offsetY: -8, filter: 'hue-rotate(-15deg)', studioNote: 'Touch & Feel Board Book' },
    66: { sheet: studioBooksAndSchool, quadrant: 'TL', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: 'Hardcover ABCs of India' },
    67: { sheet: studioBooksAndSchool, quadrant: 'TL', zoomPercent: 232, offsetX: -6, offsetY: -12, filter: 'hue-rotate(165deg)', studioNote: '1-to-20 Finger-Trail Book' },
    68: { sheet: studioBooksAndSchool, quadrant: 'TR', zoomPercent: 224, offsetX: -4, offsetY: -6, filter: 'hue-rotate(85deg)', studioNote: 'Reusable Wipe-Clean Book' },
    69: { sheet: studioBooksAndSchool, quadrant: 'TR', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: '500+ Puffy Stickers Book' },
    70: { sheet: studioBooksAndSchool, quadrant: 'TR', zoomPercent: 228, offsetX: -14, offsetY: -8, filter: 'hue-rotate(30deg)', studioNote: '120-Pg Jumbo Colouring' },
    71: { sheet: studioBooksAndSchool, quadrant: 'BL', zoomPercent: 224, offsetX: -6, offsetY: -6, filter: 'hue-rotate(290deg)', studioNote: '4-Step How to Draw Studio' },
    72: { sheet: studioBooksAndSchool, quadrant: 'TR', zoomPercent: 234, offsetX: -10, offsetY: -12, filter: 'hue-rotate(340deg) saturate(1.1)', studioNote: '25 Panchatantra Folktales' },
    73: { sheet: studioBooksAndSchool, quadrant: 'TL', zoomPercent: 236, offsetX: -14, offsetY: -4, filter: 'hue-rotate(210deg)', studioNote: '150 Brain-Booster Puzzles' },
    74: { sheet: studioBooksAndSchool, quadrant: 'TR', zoomPercent: 230, offsetX: -2, offsetY: -14, filter: 'hue-rotate(135deg)', studioNote: '4-Book 3D Grooved Cursive' },
    75: { sheet: studioBooksAndSchool, quadrant: 'TL', zoomPercent: 220, offsetX: -8, offsetY: -10, filter: 'hue-rotate(245deg) contrast(1.05)', studioNote: '224-Pg GK Encyclopedia' },
    76: { sheet: studioBooksAndSchool, quadrant: 'TR', zoomPercent: 222, offsetX: -12, offsetY: -4, filter: 'hue-rotate(65deg)', studioNote: '101 Science Experiments' },

    // --- BABY ACCESSORIES (77-86) ---
    77: { sheet: studioAccessoriesFootwear, quadrant: 'TL', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: '2-Pack Silicone Crumb Bibs' },
    78: { sheet: studioAccessoriesFootwear, quadrant: 'TL', zoomPercent: 226, offsetX: -10, offsetY: -6, filter: 'hue-rotate(185deg)', studioNote: '240 ml Borosilicate Bottle' },
    79: { sheet: studioAccessoriesFootwear, quadrant: 'TL', zoomPercent: 232, offsetX: -14, offsetY: -12, filter: 'hue-rotate(310deg)', studioNote: '300 ml Weighted Straw Cup' },
    80: { sheet: studioAccessoriesFootwear, quadrant: 'TR', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: '500 GSM Bamboo Bear Towel' },
    81: { sheet: studioAccessoriesFootwear, quadrant: 'TR', zoomPercent: 226, offsetX: -8, offsetY: -8, filter: 'hue-rotate(150deg)', studioNote: '6-Layer Mulmul Dohar' },
    82: { sheet: studioBabyWear, quadrant: 'BL', zoomPercent: 228, offsetX: -12, offsetY: -10, filter: 'hue-rotate(40deg)', studioNote: '5-Pair Anti-Skid Socks' },
    83: { sheet: studioBabyWear, quadrant: 'BL', zoomPercent: 234, offsetX: -4, offsetY: -14, filter: 'hue-rotate(315deg)', studioNote: '3-Set Newborn Mittens' },
    84: { sheet: studioBoysTopwear, quadrant: 'TR', zoomPercent: 232, offsetX: -10, offsetY: -10, filter: 'hue-rotate(25deg)', studioNote: 'UPF 50+ Reversible Hat' },
    85: { sheet: studioGirlsDressesEthnic, quadrant: 'TL', zoomPercent: 232, offsetX: -12, offsetY: -12, filter: 'hue-rotate(315deg)', studioNote: '18-Pc Grosgrain Bow Box' },
    86: { sheet: studioAccessoriesFootwear, quadrant: 'TR', zoomPercent: 228, offsetX: -14, offsetY: -10, filter: 'saturate(1.12)', studioNote: 'Suction Bamboo Plate Set' },

    // --- KIDS FOOTWEAR (87-93) ---
    87: { sheet: studioAccessoriesFootwear, quadrant: 'BL', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: 'Anatomical Cork Footbed' },
    88: { sheet: studioAccessoriesFootwear, quadrant: 'BL', zoomPercent: 228, offsetX: -14, offsetY: -8, filter: 'saturate(1.15)', studioNote: '3D Air-Mesh Velcro Runner' },
    89: { sheet: studioAccessoriesFootwear, quadrant: 'BR', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: 'Memory-Foam Uniform Shoe' },
    90: { sheet: studioAccessoriesFootwear, quadrant: 'BR', zoomPercent: 228, offsetX: -14, offsetY: -10, filter: 'saturate(1.1)', studioNote: 'Pearl-Strap Rose Gold Belly' },
    91: { sheet: studioAccessoriesFootwear, quadrant: 'BL', zoomPercent: 234, offsetX: -6, offsetY: -12, filter: 'hue-rotate(85deg)', studioNote: '4cm EVA Cloud Dino Slide' },
    92: { sheet: studioAccessoriesFootwear, quadrant: 'BL', zoomPercent: 232, offsetX: -14, offsetY: -12, filter: 'hue-rotate(250deg)', studioNote: 'Non-Marking Court Shoe' },
    93: { sheet: studioAccessoriesFootwear, quadrant: 'BR', zoomPercent: 232, offsetX: -8, offsetY: -12, filter: 'hue-rotate(345deg)', studioNote: 'Washable Canvas Slip-On' },

    // --- SCHOOL & ACTIVITY (94-100) ---
    94: { sheet: studioBooksAndSchool, quadrant: 'BL', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: '68-Pc Wooden Art Briefcase' },
    95: { sheet: studioBooksAndSchool, quadrant: 'BL', zoomPercent: 228, offsetX: -14, offsetY: -10, filter: 'saturate(1.15)', studioNote: '36-Pc Beeswax Crayons Tub' },
    96: { sheet: studioBooksAndSchool, quadrant: 'BL', zoomPercent: 234, offsetX: -8, offsetY: -12, filter: 'hue-rotate(300deg)', studioNote: '20-Project DIY Craft Trunk' },
    97: { sheet: studioBooksAndSchool, quadrant: 'BR', zoomPercent: 226, offsetX: -4, offsetY: -6, filter: 'hue-rotate(15deg)', studioNote: '3D EVA Hard-Shell Pencil Box' },
    98: { sheet: studioBooksAndSchool, quadrant: 'BR', zoomPercent: 204, offsetX: 0, offsetY: 0, filter: 'none', studioNote: '18L Orthopedic School Bag' },
    99: { sheet: studioBooksAndSchool, quadrant: 'BR', zoomPercent: 228, offsetX: -12, offsetY: -10, filter: 'hue-rotate(-35deg)', studioNote: '304 Steel 4-Section Bento' },
    100: { sheet: studioBooksAndSchool, quadrant: 'BR', zoomPercent: 234, offsetX: -14, offsetY: -12, filter: 'hue-rotate(240deg)', studioNote: '500 ml Vacuum Steel Flask' },
  };

  return (
    mappings[num] || {
      sheet: studioBabyWear,
      quadrant: 'TL',
      zoomPercent: 204,
      offsetX: 0,
      offsetY: 0,
      filter: 'none',
      studioNote: product.subcategory,
    }
  );
}

export const ProductVisual: React.FC<ProductVisualProps> = ({ product, className = '' }) => {
  const [imgError, setImgError] = useState(false);
  const spec = getStudioPhotoSpec(product);
  const { visual, subcategory } = product;

  // Compute exact quadrant coordinates for the 2x2 studio photography grid
  const baseLeft = spec.quadrant === 'TL' || spec.quadrant === 'BL' ? 0 : -(spec.zoomPercent - 100);
  const baseTop = spec.quadrant === 'TL' || spec.quadrant === 'TR' ? 0 : -(spec.zoomPercent - 100);

  const finalLeft = `${baseLeft + spec.offsetX}%`;
  const finalTop = `${baseTop + spec.offsetY}%`;

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none ${className}`}
      style={{ backgroundColor: visual.bgTone }}
    >
      {!imgError ? (
        <div className="relative w-full h-full overflow-hidden transition-transform duration-300 ease-out group-hover:scale-105">
          <img
            src={spec.sheet}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            style={{
              width: `${spec.zoomPercent}%`,
              height: `${spec.zoomPercent}%`,
              left: finalLeft,
              top: finalTop,
              filter: spec.filter,
            }}
            className="absolute max-w-none object-cover pointer-events-none"
          />

          {/* Soft Studio Lighting Vignette & Color-Harmony Rim */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 45%, transparent 58%, ${visual.bgTone}99 100%)`,
            }}
          />
        </div>
      ) : (
        /* Resilient Zero-Broken-Image Studio Fallback */
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
          <span
            className="w-12 h-12 rounded-2xl mb-2 shadow-xs border border-white/60"
            style={{ backgroundColor: visual.primaryColor }}
          />
          <span className="text-xs font-semibold text-slate-700 line-clamp-1">{product.name}</span>
        </div>
      )}

      {/* Bottom Studio Swatch & Authentic Material Tag (Ensures 100% unique visual signature per item) */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/92 backdrop-blur-xs shadow-2xs border border-slate-900/5">
          {/* Real Color Swatch Dots for this exact product */}
          <span
            className="w-2.5 h-2.5 rounded-full border border-slate-900/15 shrink-0"
            style={{ backgroundColor: visual.primaryColor }}
          />
          <span
            className="w-2.5 h-2.5 rounded-full border border-slate-900/15 -ml-1 shrink-0"
            style={{ backgroundColor: visual.accentColor }}
          />
          <span className="text-[10px] font-semibold text-slate-800 tracking-tight truncate max-w-[135px]">
            {spec.studioNote}
          </span>
        </div>

        <span className="px-2 py-0.5 rounded-md bg-slate-900/75 backdrop-blur-xs text-[9.5px] font-mono font-semibold text-white uppercase tracking-wider shrink-0">
          {subcategory}
        </span>
      </div>
    </div>
  );
};
