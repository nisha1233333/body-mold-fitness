/*
  # Seed Data for Body Mold Fitness

  1. Categories
    - Protein, Pre-Workout, Post-Workout, Vitamins, Fat Burners, Accessories

  2. Products
    - 12 realistic supplement products with full details

  3. Blog Posts
    - 6 fitness/nutrition articles

  4. Coupons
    - WELCOME20, SUMMER15, FREE50
*/

-- Categories
INSERT INTO categories (name, slug, description, display_order) VALUES
  ('Protein', 'protein', 'Premium protein powders and supplements for muscle growth and recovery', 1),
  ('Pre-Workout', 'pre-workout', 'Energy-boosting pre-workout formulas for peak performance', 2),
  ('Post-Workout', 'post-workout', 'Recovery supplements to maximize your post-gym results', 3),
  ('Vitamins & Minerals', 'vitamins-minerals', 'Essential vitamins and minerals for overall health', 4),
  ('Fat Burners', 'fat-burners', 'Thermogenic and metabolic boosters for fat loss', 5),
  ('Accessories', 'accessories', 'Shaker bottles, gym bags, and fitness accessories', 6)
ON CONFLICT (slug) DO NOTHING;

-- Products
INSERT INTO products (name, slug, description, short_description, price, compare_price, category_id, image_url, images, ingredients, nutrition_facts, benefits, rating, review_count, stock, sku, is_featured, tags) VALUES
  ('Whey Gold Isolate', 'whey-gold-isolate',
   'Body Mold Whey Gold Isolate delivers 27g of pure whey protein isolate per serving with minimal fat and lactose. Micro-filtered for maximum purity, this premium protein supports lean muscle growth and rapid recovery. Each scoop mixes smoothly and tastes incredible, making it the perfect post-workout shake.',
   '27g pure whey isolate per serving. Ultra-filtered for maximum purity.',
   59.99, 79.99, (SELECT id FROM categories WHERE slug='protein'),
   'https://images.pexels.com/photos/3735045/pexels-photo-3735045.jpeg?auto=compress&cs=tinysrgb&w=600',
   ARRAY['https://images.pexels.com/photos/3735045/pexels-photo-3735045.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=600'],
   'Whey Protein Isolate, Natural Flavors, Stevia, Sunflower Lecithin, Xanthan Gum',
   '{"serving_size": "1 scoop (32g)", "calories": 120, "protein": "27g", "carbs": "2g", "fat": "1g", "sugar": "0g", "sodium": "180mg"}',
   ARRAY['Supports lean muscle growth', 'Fast absorption for quick recovery', 'Low in fat and carbs', 'Great tasting formula'],
   4.8, 342, 150, 'WGI-001', true, ARRAY['whey', 'isolate', 'protein', 'muscle']),

  ('Nitro Surge Pre-Workout', 'nitro-surge-pre-workout',
   'Ignite your training with Nitro Surge, our most powerful pre-workout formula. Packed with 300mg caffeine, 3.2g beta-alanine, and 6g citrulline malate for explosive energy, skin-tearing pumps, and laser focus. No proprietary blends - full transparency on every ingredient.',
   '300mg caffeine + 6g citrulline for explosive energy and pumps.',
   44.99, 54.99, (SELECT id FROM categories WHERE slug='pre-workout'),
   'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=600',
   ARRAY['https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=600'],
   'Citrulline Malate 6g, Beta-Alanine 3.2g, Caffeine Anhydrous 300mg, L-Theanine 200mg, Alpha-GPC 300mg, Huperzine A 50mcg',
   '{"serving_size": "1 scoop (15g)", "calories": 5, "protein": "0g", "carbs": "1g", "fat": "0g", "caffeine": "300mg"}',
   ARRAY['Explosive energy and focus', 'Enhanced muscle pumps', 'No crash formula', 'Fully transparent labeling'],
   4.7, 218, 85, 'NSP-002', true, ARRAY['pre-workout', 'caffeine', 'energy', 'pumps']),

  ('BCAA Recovery Complex', 'bcaa-recovery-complex',
   'Body Mold BCAA Recovery Complex features a clinically-dosed 2:1:1 ratio of leucine, isoleucine, and valine. Enhanced with electrolytes and vitamin B6 for superior hydration and absorption. Sip during or after training to reduce muscle soreness and accelerate recovery.',
   '2:1:1 BCAA ratio with electrolytes for faster recovery.',
   34.99, 44.99, (SELECT id FROM categories WHERE slug='post-workout'),
   'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=600',
   ARRAY['https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=600'],
   'L-Leucine 3.5g, L-Isoleucine 1.75g, L-Valine 1.75g, Coconut Water Powder 500mg, Vitamin B6 10mg, Sodium 200mg, Potassium 150mg',
   '{"serving_size": "1 scoop (10g)", "calories": 0, "protein": "0g", "carbs": "0g", "fat": "0g", "bcaa": "7g"}',
   ARRAY['Reduces muscle soreness', 'Accelerates recovery', 'Supports hydration', 'Zero calories'],
   4.6, 156, 200, 'BRC-003', true, ARRAY['bcaa', 'recovery', 'amino', 'hydration']),

  ('Thermo Shred Elite', 'thermo-shred-elite',
   'Thermo Shred Elite is our most advanced thermogenic fat burner. Formulated with green tea extract, caffeine, and capsicum to boost metabolism and support fat loss. Added L-carnitine helps transport fatty acids for energy production during intense training.',
   'Advanced thermogenic formula for maximum fat burning.',
   49.99, 59.99, (SELECT id FROM categories WHERE slug='fat-burners'),
   'https://images.pexels.com/photos/1120922/pexels-photo-1120922.jpeg?auto=compress&cs=tinysrgb&w=600',
   ARRAY['https://images.pexels.com/photos/1120922/pexels-photo-1120922.jpeg?auto=compress&cs=tinysrgb&w=600'],
   'Green Tea Extract 500mg, Caffeine 200mg, Capsicum Extract 100mg, L-Carnitine 500mg, Black Pepper Extract 5mg, Chromium 200mcg',
   '{"serving_size": "2 capsules", "calories": 0, "protein": "0g", "carbs": "0g", "fat": "0g", "caffeine": "200mg"}',
   ARRAY['Boosts metabolism', 'Supports fat oxidation', 'Increases energy', 'Appetite management'],
   4.5, 189, 60, 'TSE-004', true, ARRAY['fat-burner', 'thermogenic', 'weight-loss', 'metabolism']),

  ('Multi-Vitamin Sport', 'multi-vitamin-sport',
   'Body Mold Multi-Vitamin Sport is designed specifically for athletes and active individuals. Packed with 28 essential vitamins and minerals, including high-potency B-vitamins for energy metabolism, vitamin D3 for bone health, and zinc for immune support. One daily serving covers all your nutritional bases.',
   '28 vitamins and minerals optimized for athletes.',
   29.99, 39.99, (SELECT id FROM categories WHERE slug='vitamins-minerals'),
   'https://images.pexels.com/photos/5937124/pexels-photo-5937124.jpeg?auto=compress&cs=tinysrgb&w=600',
   ARRAY['https://images.pexels.com/photos/5937124/pexels-photo-5937124.jpeg?auto=compress&cs=tinysrgb&w=600'],
   'Vitamin A 5000IU, Vitamin C 250mg, Vitamin D3 2000IU, Vitamin E 100IU, B-Complex, Zinc 15mg, Magnesium 200mg, Selenium 200mcg',
   '{"serving_size": "3 tablets", "calories": 5, "protein": "0g", "carbs": "1g", "fat": "0g"}',
   ARRAY['Supports immune function', 'Energy metabolism', 'Bone health', 'Optimized for athletes'],
   4.7, 267, 300, 'MVS-005', false, ARRAY['vitamins', 'minerals', 'health', 'immune']),

  ('Creatine Monohydrate', 'creatine-monohydrate',
   'Pure micronized creatine monohydrate - the most researched sports supplement in history. Each serving delivers 5g of Creapure-certified creatine for increased strength, power, and muscle volume. Unflavored and mixes easily into any beverage.',
   '5g Creapure-certified micronized creatine per serving.',
   24.99, 34.99, (SELECT id FROM categories WHERE slug='post-workout'),
   'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=600',
   ARRAY['https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=600'],
   'Micronized Creatine Monohydrate 5g (Creapure)',
   '{"serving_size": "1 scoop (5g)", "calories": 0, "protein": "0g", "carbs": "0g", "fat": "0g", "creatine": "5g"}',
   ARRAY['Increases strength and power', 'Enhances muscle volume', 'Improves high-intensity performance', 'Most researched supplement'],
   4.9, 412, 250, 'CM-006', true, ARRAY['creatine', 'strength', 'power', 'muscle']),

  ('Casein Night Protein', 'casein-night-protein',
   'Slow-digesting micellar casein protein for sustained overnight recovery. Each serving delivers 24g of premium casein that feeds your muscles for up to 8 hours. Thick, creamy texture makes it the perfect before-bed shake.',
   '24g slow-digesting casein for overnight muscle recovery.',
   54.99, 64.99, (SELECT id FROM categories WHERE slug='protein'),
   'https://images.pexels.com/photos/3735045/pexels-photo-3735045.jpeg?auto=compress&cs=tinysrgb&w=600',
   ARRAY['https://images.pexels.com/photos/3735045/pexels-photo-3735045.jpeg?auto=compress&cs=tinysrgb&w=600'],
   'Micellar Casein, Natural Flavors, Stevia, Sunflower Lecithin',
   '{"serving_size": "1 scoop (35g)", "calories": 130, "protein": "24g", "carbs": "3g", "fat": "1.5g", "sugar": "0g"}',
   ARRAY['Sustained 8-hour release', 'Perfect for nighttime recovery', 'Thick creamy texture', 'Supports muscle preservation'],
   4.6, 178, 120, 'CNP-007', false, ARRAY['casein', 'protein', 'night', 'recovery']),

  ('Omega-3 Fish Oil', 'omega-3-fish-oil',
   'Premium triple-strength omega-3 fish oil with 1000mg EPA and DHA per serving. Molecularly distilled for purity and tested for heavy metals. Supports heart health, joint function, and cognitive performance. Enteric-coated softgels prevent fishy aftertaste.',
   'Triple-strength 1000mg EPA/DHA. No fishy aftertaste.',
   27.99, 37.99, (SELECT id FROM categories WHERE slug='vitamins-minerals'),
   'https://images.pexels.com/photos/5937124/pexels-photo-5937124.jpeg?auto=compress&cs=tinysrgb&w=600',
   ARRAY['https://images.pexels.com/photos/5937124/pexels-photo-5937124.jpeg?auto=compress&cs=tinysrgb&w=600'],
   'Fish Oil Concentrate, EPA 600mg, DHA 400mg, Natural Lemon Oil, Mixed Tocopherols, Enteric Coating',
   '{"serving_size": "2 softgels", "calories": 10, "protein": "0g", "carbs": "0g", "fat": "1g", "omega3": "1000mg"}',
   ARRAY['Heart health support', 'Joint function', 'Cognitive performance', 'No fishy aftertaste'],
   4.8, 195, 180, 'O3F-008', false, ARRAY['omega-3', 'fish-oil', 'heart', 'joints']),

  ('Glutamine Repair', 'glutamine-repair',
   'L-Glutamine is the most abundant amino acid in muscle tissue and plays a critical role in recovery and immune function. Body Mold Glutamine Repair delivers 5g of pure micronized L-glutamine per serving to support muscle repair, gut health, and immune resilience during intense training phases.',
   '5g pure micronized L-Glutamine for recovery and immune support.',
   22.99, 29.99, (SELECT id FROM categories WHERE slug='post-workout'),
   'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=600',
   ARRAY['https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=600'],
   'L-Glutamine 5g',
   '{"serving_size": "1 scoop (5g)", "calories": 0, "protein": "0g", "carbs": "0g", "fat": "0g", "glutamine": "5g"}',
   ARRAY['Accelerates muscle repair', 'Supports immune function', 'Promotes gut health', 'Unflavored versatility'],
   4.5, 134, 175, 'GR-009', false, ARRAY['glutamine', 'recovery', 'immune', 'gut']),

  ('Shaker Pro 700ml', 'shaker-pro-700ml',
   'The Body Mold Shaker Pro features a patented mixing vortex ball for smooth, clump-free shakes every time. BPA-free, dishwasher safe, and leak-proof. Includes a convenient storage compartment for supplements and a snap-on carabiner clip.',
   'Premium BPA-free shaker with vortex mixing ball.',
   14.99, 19.99, (SELECT id FROM categories WHERE slug='accessories'),
   'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=600',
   ARRAY['https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=600'],
   'BPA-Free Tritan Plastic, Stainless Steel Vortex Ball, Silicone Seal',
   '{}',
   ARRAY['Smooth clump-free mixing', 'BPA-free and dishwasher safe', 'Leak-proof design', 'Storage compartment included'],
   4.4, 89, 500, 'SP-010', false, ARRAY['shaker', 'bottle', 'accessory', 'mixing']),

  ('Plant Protein Fusion', 'plant-protein-fusion',
   'Body Mold Plant Protein Fusion combines pea, rice, and hemp protein for a complete amino acid profile. 25g protein per serving with added digestive enzymes for optimal absorption. Vegan, gluten-free, and naturally sweetened. Perfect for plant-based athletes.',
   '25g plant protein from pea, rice, and hemp. Vegan certified.',
   49.99, 59.99, (SELECT id FROM categories WHERE slug='protein'),
   'https://images.pexels.com/photos/3735045/pexels-photo-3735045.jpeg?auto=compress&cs=tinysrgb&w=600',
   ARRAY['https://images.pexels.com/photos/3735045/pexels-photo-3735045.jpeg?auto=compress&cs=tinysrgb&w=600'],
   'Pea Protein Isolate, Brown Rice Protein, Hemp Protein, Natural Flavors, Stevia, Digestive Enzyme Blend (Protease, Bromelain)',
   '{"serving_size": "1 scoop (38g)", "calories": 140, "protein": "25g", "carbs": "5g", "fat": "2g", "sugar": "1g", "fiber": "3g"}',
   ARRAY['Complete amino acid profile', 'Vegan and gluten-free', 'Added digestive enzymes', 'Naturally sweetened'],
   4.5, 167, 90, 'PPF-011', true, ARRAY['plant-protein', 'vegan', 'organic', 'pea-protein']),

  ('ZMA Sleep Complex', 'zma-sleep-complex',
   'Body Mold ZMA Sleep Complex combines zinc, magnesium, and B6 to support deep, restorative sleep and natural testosterone production. Enhanced with melatonin and GABA for faster sleep onset and improved sleep quality. Wake up recovered and ready to perform.',
   'Zinc + Magnesium + B6 with melatonin for deep sleep.',
   32.99, 42.99, (SELECT id FROM categories WHERE slug='vitamins-minerals'),
   'https://images.pexels.com/photos/5937124/pexels-photo-5937124.jpeg?auto=compress&cs=tinysrgb&w=600',
   ARRAY['https://images.pexels.com/photos/5937124/pexels-photo-5937124.jpeg?auto=compress&cs=tinysrgb&w=600'],
   'Zinc 30mg, Magnesium 450mg, Vitamin B6 10mg, Melatonin 3mg, GABA 500mg, L-Theanine 200mg',
   '{"serving_size": "3 capsules", "calories": 0, "protein": "0g", "carbs": "0g", "fat": "0g"}',
   ARRAY['Deep restorative sleep', 'Supports testosterone levels', 'Muscle recovery overnight', 'Faster sleep onset'],
   4.7, 143, 110, 'ZMA-012', false, ARRAY['zma', 'sleep', 'recovery', 'magnesium'])
ON CONFLICT (slug) DO NOTHING;

-- Reviews
INSERT INTO reviews (product_id, user_name, rating, title, comment, is_verified) VALUES
  ((SELECT id FROM products WHERE slug='whey-gold-isolate'), 'Marcus T.', 5, 'Best protein I have ever used', 'Mixes perfectly, tastes amazing, and the results speak for themselves. Gained 8 lbs of lean muscle in 2 months.', true),
  ((SELECT id FROM products WHERE slug='whey-gold-isolate'), 'Sarah K.', 4, 'Great quality protein', 'Very clean protein with minimal ingredients. Wish there were more flavors available.', true),
  ((SELECT id FROM products WHERE slug='whey-gold-isolate'), 'James R.', 5, 'Premium quality', 'You can tell this is a premium product. No bloating, mixes smooth, great macros.', true),
  ((SELECT id FROM products WHERE slug='nitro-surge-pre-workout'), 'David L.', 5, 'Insane energy and focus', 'This pre-workout hits different. Great energy without the jitters. Pumps are incredible.', true),
  ((SELECT id FROM products WHERE slug='nitro-surge-pre-workout'), 'Mike P.', 4, 'Strong but smooth', 'Good energy that lasts the whole workout. The focus is real. Only wish it had more flavors.', true),
  ((SELECT id FROM products WHERE slug='creatine-monohydrate'), 'Chris W.', 5, 'Pure and effective', 'Creapure quality, mixes easily, no taste so I can add it to anything. Strength gains are noticeable.', true),
  ((SELECT id FROM products WHERE slug='creatine-monohydrate'), 'Amanda S.', 5, 'The gold standard', 'Creatine is creatine, but the quality here is top tier. No stomach issues at all.', true),
  ((SELECT id FROM products WHERE slug='thermo-shred-elite'), 'Lisa M.', 4, 'Good fat burner', 'Noticeable increase in energy and sweating during workouts. Lost 5 lbs in the first month.', true),
  ((SELECT id FROM products WHERE slug='bcaa-recovery-complex'), 'Tom H.', 5, 'Less soreness', 'Since adding this to my intra-workout, my DOMS has reduced significantly. Great flavors too.', true),
  ((SELECT id FROM products WHERE slug='plant-protein-fusion'), 'Rachel G.', 5, 'Finally a good vegan protein', 'Most plant proteins taste like dirt. This one is actually delicious and the macros are solid.', true)
ON CONFLICT DO NOTHING;

-- Coupons
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, max_uses, is_active) VALUES
  ('WELCOME20', '20% off your first order', 'percentage', 20, 0, 1000, true),
  ('SUMMER15', '15% off summer sale', 'percentage', 15, 25, 500, true),
  ('FREE50', '$10 off orders over $50', 'fixed', 10, 50, 300, true)
ON CONFLICT (code) DO NOTHING;

-- Blog Posts
INSERT INTO blog_posts (title, slug, excerpt, content, image_url, category, tags) VALUES
  ('The Ultimate Guide to Protein Supplements', 'ultimate-guide-protein-supplements',
   'Everything you need to know about choosing the right protein supplement for your fitness goals.',
   'Protein is the building block of muscle. Whether you are a seasoned athlete or just starting your fitness journey, understanding protein supplements is crucial for maximizing your results. In this comprehensive guide, we will break down the different types of protein, when to take them, and how much you really need.

## Types of Protein

### Whey Protein
Whey protein is the most popular and widely studied protein supplement. It is fast-digesting, making it ideal for post-workout recovery. Whey isolate is the purest form, containing 90% or more protein with minimal fat and lactose.

### Casein Protein
Casein is a slow-digesting protein that provides a steady stream of amino acids over several hours. This makes it perfect for nighttime recovery or between meals.

### Plant-Based Protein
For vegans and those with dairy sensitivities, plant proteins like pea, rice, and hemp offer excellent alternatives. Look for blends that combine multiple sources for a complete amino acid profile.

## How Much Protein Do You Need?

For active individuals, research suggests 1.6-2.2g of protein per kilogram of body weight daily. This means a 180lb person should aim for 130-180g of protein per day.

## Timing Matters

While total daily intake is most important, timing can optimize results. Consume 20-40g of fast-digesting protein within 2 hours of training for maximum muscle protein synthesis.',
   'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800',
   'Nutrition', ARRAY['protein', 'supplements', 'whey', 'nutrition']),

  ('5 Pre-Workout Ingredients That Actually Work', 'pre-workout-ingredients-that-work',
   'Science-backed ingredients to look for in your next pre-workout supplement.',
   'The supplement industry is full of flashy marketing and proprietary blends. But when it comes to pre-workouts, science has identified several ingredients that genuinely enhance performance. Here are the five that actually work.

## 1. Caffeine (150-400mg)
The most proven ergogenic aid in existence. Caffeine improves alertness, reduces perceived exertion, and enhances power output. Most people respond well to 200-300mg, but tolerance varies.

## 2. Citrulline Malate (6-8g)
Citrulline malate increases nitric oxide production, leading to better blood flow and muscle pumps. Studies show 6-8g is the effective dose for performance enhancement.

## 3. Beta-Alanine (3.2-6.4g)
Beta-alanine increases muscle carnosine levels, which buffers acid buildup during high-intensity exercise. This delays fatigue and improves performance in sets lasting 1-4 minutes.

## 4. Creatine (3-5g)
While traditionally taken post-workout, creatine in your pre-workout is equally effective. It increases phosphocreatine stores for explosive energy production.

## 5. Alpha-GPC (300-600mg)
This choline compound enhances acetylcholine production, improving mind-muscle connection and power output. Studies show significant improvements in bench press and squat performance.',
   'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=800',
   'Fitness', ARRAY['pre-workout', 'ingredients', 'caffeine', 'science']),

  ('How to Build Muscle on a Plant-Based Diet', 'build-muscle-plant-based-diet',
   'Yes, you can build serious muscle without animal products. Here is the complete guide.',
   'The myth that you need animal protein to build muscle has been thoroughly debunked. Plant-based athletes are proving that you can build impressive physiques without meat, dairy, or eggs. Here is how to optimize your plant-based diet for maximum muscle growth.

## Protein: Quality Over Source
The key is combining different plant protein sources to get all essential amino acids. Pea protein, soy, and rice protein are all excellent choices. Aim for slightly higher total protein intake (2.0-2.4g/kg) since plant proteins have slightly lower leucine content.

## Key Nutrients to Watch

### Iron
Plant-based iron (non-heme) is less absorbable than heme iron. Pair iron-rich foods with vitamin C to boost absorption by up to 300%.

### Vitamin B12
This is the one nutrient you cannot get from plants. Supplement with 250mcg daily or 2500mcg weekly.

### Omega-3 Fatty Acids
Algae-based DHA supplements provide the same omega-3s found in fish oil, without the fish.

## Meal Planning
Eat every 3-4 hours with 25-40g protein per meal. Include a variety of protein sources throughout the day. Supplement with a quality plant protein powder to hit your targets conveniently.',
   'https://images.pexels.com/photos/3735045/pexels-photo-3735045.jpeg?auto=compress&cs=tinysrgb&w=800',
   'Nutrition', ARRAY['vegan', 'plant-based', 'muscle', 'nutrition']),

  ('The Science of Sleep and Muscle Recovery', 'science-sleep-muscle-recovery',
   'Why sleep is the most underrated supplement in your fitness arsenal.',
   'You can have the perfect training program and nutrition plan, but without adequate sleep, you are leaving gains on the table. Sleep is when the real magic happens - muscle repair, hormone production, and neural adaptation all peak during deep sleep.

## What Happens During Sleep

### Growth Hormone Release
Up to 70% of daily growth hormone secretion occurs during slow-wave sleep. This hormone is critical for muscle repair and growth.

### Testosterone Production
Sleep deprivation can reduce testosterone by 10-15% after just one week of restricted sleep. For athletes, this is devastating to recovery and performance.

### Muscle Protein Synthesis
Research shows that sleep deprivation reduces muscle protein synthesis by 18% and increases protein breakdown. Even one night of poor sleep can shift your body into a catabolic state.

## Optimizing Sleep for Recovery

1. Aim for 7-9 hours per night
2. Keep a consistent sleep schedule
3. Avoid screens 1 hour before bed
4. Keep your room cool (65-68F)
5. Consider ZMA or magnesium supplementation
6. Limit caffeine after 2 PM

## Napping for Athletes
A 20-30 minute nap can reduce cortisol and improve afternoon training performance by up to 12%.',
   'https://images.pexels.com/photos/5937124/pexels-photo-5937124.jpeg?auto=compress&cs=tinysrgb&w=800',
   'Recovery', ARRAY['sleep', 'recovery', 'growth-hormone', 'science']),

  ('Fat Loss Myths Debunked by Science', 'fat-loss-myths-debunked',
   'Stop believing these common fat loss myths that are holding back your progress.',
   'The fitness industry is rife with fat loss misinformation. Let us separate fact from fiction with actual science.

## Myth 1: Eating Late Makes You Fat
Truth: Total daily caloric intake matters far more than meal timing. Studies show that late-night eating does not cause weight gain when calories are controlled.

## Myth 2: You Need Cardio to Lose Fat
Truth: While cardio helps create a caloric deficit, resistance training is equally important. It preserves muscle mass, keeping your metabolism high. The best approach combines both.

## Myth 3: Fat Burners Melt Fat Away
Truth: Fat burners can provide a small metabolic boost (3-5%), but they cannot overcome a poor diet. They are supplements to an already solid nutrition and training plan.

## Myth 4: Spot Reduction Works
Truth: You cannot target fat loss from specific areas. Fat loss occurs systemically based on genetics and hormones. Ab exercises will not burn belly fat specifically.

## Myth 5: More Sweat = More Fat Loss
Truth: Sweat is water loss, not fat loss. Sauna suits and excessive sweating do not increase fat burning. They only dehydrate you.

## What Actually Works
1. Maintain a moderate caloric deficit (300-500 calories)
2. Eat adequate protein (1.6-2.2g/kg)
3. Resistance train 3-4 times per week
4. Get 7-9 hours of sleep
5. Be patient and consistent',
   'https://images.pexels.com/photos/1120922/pexels-photo-1120922.jpeg?auto=compress&cs=tinysrgb&w=800',
   'Fitness', ARRAY['fat-loss', 'myths', 'science', 'weight-loss']),

  ('Beginner Guide to Creatine: Everything You Need to Know', 'beginner-guide-creatine',
   'The most researched supplement in history explained in simple terms.',
   'Creatine monohydrate is the single most studied sports supplement in existence, with over 500 peer-reviewed studies confirming its safety and efficacy. Yet misinformation persists. Here is what you need to know.

## What Is Creatine?
Creatine is a naturally occurring compound found in muscle cells. It helps produce ATP (energy) during high-intensity exercise. Your body produces about 1-2g daily, and you get another 1-2g from food (mainly red meat and fish).

## Benefits
- Increases strength by 5-10%
- Enhances power output
- Increases muscle volume (cell volumization)
- Improves high-intensity exercise capacity
- May improve cognitive function
- Very safe with no documented serious side effects

## How to Take It
### Loading Phase (Optional)
20g/day split into 4 doses for 5-7 days. This saturates muscle stores faster.

### Maintenance Phase
3-5g daily. Timing does not matter significantly. Consistency is key.

## Common Concerns

### Does It Cause Hair Loss?
One study showed increased DHT, but no study has ever shown actual hair loss from creatine. The evidence is weak.

### Does It Cause Kidney Damage?
Numerous studies in healthy individuals show no kidney damage even with long-term use. Those with pre-existing kidney conditions should consult a doctor.

### Does It Cause Water Retention?
Creatine increases intracellular water (inside muscle cells), which is beneficial. It does not cause subcutaneous bloating.',
   'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800',
   'Supplements', ARRAY['creatine', 'beginner', 'supplements', 'science'])
ON CONFLICT (slug) DO NOTHING;
