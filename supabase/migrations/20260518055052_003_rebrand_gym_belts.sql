/*
  # Rebrand to Body Mold Fitness - Gym Belts

  1. Clear old supplement data
  2. New Categories: Powerlifting Belts, Lever Belts, Prong Belts, Velcro Belts, Leather Belts, Accessories
  3. New Products: 12 realistic gym belt products
  4. New Blog Posts: 6 gym belt articles
  5. New Coupons: Updated codes
*/

-- Clear old data
DELETE FROM reviews;
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM wishlists;
DELETE FROM coupons;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM blog_posts;

-- New Categories
INSERT INTO categories (name, slug, description, display_order) VALUES
  ('Powerlifting Belts', 'powerlifting-belts', 'Heavy-duty belts designed for maximum support during squats and deadlifts', 1),
  ('Lever Belts', 'lever-belts', 'Quick-release lever belts for easy on and off between sets', 2),
  ('Prong Belts', 'prong-belts', 'Classic single and double prong belts for traditional lifters', 3),
  ('Velcro Belts', 'velcro-belts', 'Lightweight velcro belts for CrossFit and functional training', 4),
  ('Leather Belts', 'leather-belts', 'Premium genuine leather belts built to last a lifetime', 5),
  ('Accessories', 'accessories', 'Belt keepers, cleaning kits, and belt maintenance gear', 6);

-- New Products
INSERT INTO products (name, slug, description, short_description, price, compare_price, category_id, image_url, images, ingredients, nutrition_facts, benefits, rating, review_count, stock, sku, is_featured, tags) VALUES
  ('Titan Pro Lever Belt', 'titan-pro-lever-belt',
   'The Titan Pro Lever Belt is our flagship powerlifting belt, built for serious lifters who demand maximum support. Crafted from 10mm thick genuine leather with a stainless steel lever buckle for instant release. IPF-approved and competition legal. The rigid construction provides unmatched intra-abdominal pressure for heavy squats and deadlifts. Break-in period of 2-3 weeks for optimal fit.',
   '10mm genuine leather with stainless steel lever. IPF-approved.',
   89.99, 119.99, (SELECT id FROM categories WHERE slug='lever-belts'),
   'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=600',
   ARRAY['https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=600'],
   'Genuine Leather, Stainless Steel Lever Buckle, Suede Lining, Reinforced Stitching',
   '{"thickness": "10mm", "width": "4 inches", "material": "Genuine Leather", "buckle": "Stainless Steel Lever", "weight": "1.8 lbs"}',
   ARRAY['Maximum intra-abdominal pressure', 'IPF competition approved', 'Quick lever release', 'Lifetime leather durability'],
   4.9, 342, 75, 'TPL-001', true, ARRAY['lever', 'powerlifting', 'ipf', 'leather']),

  ('Ironclad Single Prong Belt', 'ironclad-single-prong-belt',
   'The Ironclad Single Prong is a classic powerlifting belt trusted by strength athletes worldwide. 13mm thick vegetable-tanned leather with a chrome roller buckle. The single prong design allows for precise hole-to-hole adjustment. IPF-approved for all powerlifting federations. Hand-stitched edges and a smooth interior lining prevent pinching.',
   '13mm vegetable-tanned leather with single prong buckle. IPF-approved.',
   99.99, 134.99, (SELECT id FROM categories WHERE slug='prong-belts'),
   'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=600',
   ARRAY['https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=600'],
   'Vegetable-Tanned Leather, Chrome Roller Buckle, Single Steel Prong, Suede Interior',
   '{"thickness": "13mm", "width": "4 inches", "material": "Vegetable-Tanned Leather", "buckle": "Single Prong Roller", "weight": "2.1 lbs"}',
   ARRAY['Precise fit adjustment', 'IPF competition approved', 'No break-in pinch points', 'Hand-stitched durability'],
   4.8, 218, 50, 'ISP-002', true, ARRAY['prong', 'powerlifting', 'ipf', 'leather']),

  ('FlexCore Velcro Belt', 'flexcore-velcro-belt',
   'The FlexCore Velcro Belt is designed for CrossFit, functional fitness, and high-intensity training. Lightweight 5mm neoprene construction with a heavy-duty velcro closure for quick transitions between movements. Contoured design follows your natural torso shape for comfort during dynamic exercises. Machine washable and ultra-lightweight.',
   '5mm neoprene with heavy-duty velcro. Perfect for CrossFit.',
   39.99, 54.99, (SELECT id FROM categories WHERE slug='velcro-belts'),
   'https://images.pexels.com/photos/3735045/pexels-photo-3735045.jpeg?auto=compress&cs=tinysrgb&w=600',
   ARRAY['https://images.pexels.com/photos/3735045/pexels-photo-3735045.jpeg?auto=compress&cs=tinysrgb&w=600'],
   'Neoprene, Heavy-Duty Velcro, Reinforced Edge Binding, Contoured Foam Padding',
   '{"thickness": "5mm", "width": "4.5 inches", "material": "Neoprene", "buckle": "Velcro Closure", "weight": "0.6 lbs"}',
   ARRAY['Quick on/off transitions', 'Contoured for comfort', 'Machine washable', 'Ultra-lightweight design'],
   4.6, 156, 200, 'FCV-003', true, ARRAY['velcro', 'crossfit', 'neoprene', 'lightweight']),

  ('Apex Double Prong Belt', 'apex-double-prong-belt',
   'The Apex Double Prong delivers the most secure fit possible with two steel prongs locking the belt in place. 13mm thick premium leather with a double-prong roller buckle. Preferred by old-school powerlifters who want zero belt movement during maximal lifts. The dual prong design distributes pressure evenly across the abdomen.',
   '13mm premium leather with double prong. Maximum security.',
   109.99, 144.99, (SELECT id FROM categories WHERE slug='prong-belts'),
   'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=600',
   ARRAY['https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=600'],
   'Premium Leather, Double Steel Prong, Chrome Roller Buckle, Hand-Finished Edges',
   '{"thickness": "13mm", "width": "4 inches", "material": "Premium Leather", "buckle": "Double Prong Roller", "weight": "2.3 lbs"}',
   ARRAY['Zero belt movement', 'Even pressure distribution', 'Old-school reliability', 'Competition approved'],
   4.7, 189, 35, 'ADP-004', true, ARRAY['prong', 'powerlifting', 'double-prong', 'leather']),

  ('Stealth Tapered Belt', 'stealth-tapered-belt',
   'The Stealth Tapered Belt features a 4-inch back width tapering to 2.5 inches in the front for maximum comfort during Olympic weightlifting and general training. 6.5mm thick genuine leather with a smooth single-prong buckle. The tapered design allows full range of motion for cleans, snatches, and overhead work while still providing solid back support.',
   'Tapered 4-inch to 2.5-inch design. Ideal for Olympic lifting.',
   69.99, 89.99, (SELECT id FROM categories WHERE slug='leather-belts'),
   'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=600',
   ARRAY['https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=600'],
   'Genuine Leather, Single Prong Buckle, Tapered Design, Smooth Interior',
   '{"thickness": "6.5mm", "back_width": "4 inches", "front_width": "2.5 inches", "material": "Genuine Leather", "buckle": "Single Prong", "weight": "1.2 lbs"}',
   ARRAY['Full range of motion', 'Olympic lifting optimized', 'Comfortable tapered fit', 'Versatile for all training'],
   4.5, 167, 120, 'STB-005', false, ARRAY['tapered', 'olympic', 'leather', 'versatile']),

  ('Forge Lever Belt 13mm', 'forge-lever-belt-13mm',
   'The Forge Lever Belt is our thickest, most rigid belt for elite powerlifters. 13mm of solid leather with a heavy-duty stainless steel lever. This belt does not bend - it provides a wall of support for your heaviest lifts. IPF-approved and built to withstand years of abuse. Includes a spare lever and screws.',
   '13mm solid leather with heavy-duty lever. Elite powerlifting.',
   129.99, 164.99, (SELECT id FROM categories WHERE slug='lever-belts'),
   'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=600',
   ARRAY['https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=600'],
   'Solid Leather 13mm, Stainless Steel Heavy-Duty Lever, Reinforced Stitching, Spare Lever Included',
   '{"thickness": "13mm", "width": "4 inches", "material": "Solid Leather", "buckle": "Heavy-Duty Lever", "weight": "2.5 lbs"}',
   ARRAY['Maximum rigidity for heavy lifts', 'Spare lever included', 'IPF competition approved', 'Built for years of use'],
   4.9, 412, 40, 'FLB-006', true, ARRAY['lever', 'powerlifting', '13mm', 'elite']),

  ('Nylon Training Belt', 'nylon-training-belt',
   'The Nylon Training Belt is perfect for beginners and general gym training. Lightweight yet supportive with a quick-release velcro closure. Breathable mesh backing keeps you cool during intense workouts. The flexible design supports proper form without the rigidity of leather. Great for machine work, accessory lifts, and fitness classes.',
   'Lightweight nylon with velcro closure. Great for beginners.',
   29.99, 39.99, (SELECT id FROM categories WHERE slug='velcro-belts'),
   'https://images.pexels.com/photos/3735045/pexels-photo-3735045.jpeg?auto=compress&cs=tinysrgb&w=600',
   ARRAY['https://images.pexels.com/photos/3735045/pexels-photo-3735045.jpeg?auto=compress&cs=tinysrgb&w=600'],
   'Nylon, EVA Foam Padding, Velcro Closure, Breathable Mesh Backing',
   '{"thickness": "4mm", "width": "4 inches", "material": "Nylon/EVA Foam", "buckle": "Velcro", "weight": "0.4 lbs"}',
   ARRAY['Beginner friendly', 'Breathable mesh backing', 'Lightweight and flexible', 'Affordable quality'],
   4.4, 267, 300, 'NTB-007', false, ARRAY['nylon', 'beginner', 'velcro', 'lightweight']),

  ('Heritage Full Grain Belt', 'heritage-full-grain-belt',
   'The Heritage Full Grain Belt is handcrafted from a single piece of full-grain cowhide. No layers, no fillers - just pure leather that develops a beautiful patina over time. 10mm thick with a classic single-prong roller buckle. Each belt is individually numbered and comes with a lifetime warranty. This is the last belt you will ever need to buy.',
   'Handcrafted single-piece full-grain leather. Lifetime warranty.',
   149.99, 189.99, (SELECT id FROM categories WHERE slug='leather-belts'),
   'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=600',
   ARRAY['https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=600'],
   'Full-Grain Cowhide (Single Piece), Chrome Roller Buckle, Hand-Burnished Edges, Individual Serial Number',
   '{"thickness": "10mm", "width": "4 inches", "material": "Full-Grain Cowhide", "buckle": "Single Prong Roller", "weight": "2.0 lbs"}',
   ARRAY['Lifetime warranty', 'Develops beautiful patina', 'Individually numbered', 'Single-piece construction'],
   4.8, 195, 25, 'HFG-008', true, ARRAY['leather', 'full-grain', 'handcrafted', 'premium']),

  ('QuickDraw Lever Belt', 'quickdraw-lever-belt',
   'The QuickDraw Lever Belt combines the security of a lever with the convenience of quick adjustments. Features our patented micro-adjust lever system that allows 3mm of fine-tuning without tools. 10mm leather with a matte black lever. Perfect for lifters whose weight fluctuates or who share belts between training partners.',
   'Patented micro-adjust lever for tool-free fine-tuning. 10mm leather.',
   94.99, 124.99, (SELECT id FROM categories WHERE slug='lever-belts'),
   'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=600',
   ARRAY['https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=600'],
   'Genuine Leather 10mm, Patented Micro-Adjust Lever, Matte Black Finish, Suede Interior',
   '{"thickness": "10mm", "width": "4 inches", "material": "Genuine Leather", "buckle": "Micro-Adjust Lever", "weight": "1.9 lbs"}',
   ARRAY['Tool-free micro-adjustment', 'Quick on/off lever', 'Matte black finish', 'Shares between users easily'],
   4.7, 143, 60, 'QDL-009', false, ARRAY['lever', 'micro-adjust', 'leather', 'convenient']),

  ('Belt Keeper Pro', 'belt-keeper-pro',
   'The Belt Keeper Pro is a premium leather belt loop that keeps your powerlifting belt neatly rolled and stored. Made from the same genuine leather as our belts with reinforced stitching. Features a snap closure and embossed Body Mold logo. Protects your belt from damage and keeps your gym bag organized.',
   'Premium leather belt keeper for storage and protection.',
   14.99, 19.99, (SELECT id FROM categories WHERE slug='accessories'),
   'https://images.pexels.com/photos/1120922/pexels-photo-1120922.jpeg?auto=compress&cs=tinysrgb&w=600',
   ARRAY['https://images.pexels.com/photos/1120922/pexels-photo-1120922.jpeg?auto=compress&cs=tinysrgb&w=600'],
   'Genuine Leather, Snap Closure, Reinforced Stitching, Embossed Logo',
   '{}',
   ARRAY['Keeps belt neatly stored', 'Protects from damage', 'Premium leather construction', 'Snap closure system'],
   4.4, 89, 500, 'BKP-010', false, ARRAY['accessory', 'storage', 'keeper', 'leather']),

  ('WOD Warrior Velcro Belt', 'wod-warrior-velcro-belt',
   'The WOD Warrior is built specifically for CrossFit competition. 7.5mm contoured design with a competition-grade velcro system rated for 500+ closures. The tapered back provides support during heavy lifts while the flexible front allows full range of motion for gymnastics and conditioning. Approved for all CrossFit-sanctioned events.',
   '7.5mm contoured CrossFit belt. Competition-grade velcro.',
   54.99, 69.99, (SELECT id FROM categories WHERE slug='velcro-belts'),
   'https://images.pexels.com/photos/3735045/pexels-photo-3735045.jpeg?auto=compress&cs=tinysrgb&w=600',
   ARRAY['https://images.pexels.com/photos/3735045/pexels-photo-3735045.jpeg?auto=compress&cs=tinysrgb&w=600'],
   'EVA Foam 7.5mm, Competition-Grade Velcro, Contoured Tapered Design, Moisture-Wicking Interior',
   '{"thickness": "7.5mm", "back_width": "4 inches", "front_width": "3 inches", "material": "EVA Foam/Nylon", "buckle": "Competition Velcro", "weight": "0.7 lbs"}',
   ARRAY['CrossFit competition approved', '500+ closure durability', 'Contoured for WODs', 'Moisture-wicking interior'],
   4.6, 178, 90, 'WWV-011', true, ARRAY['velcro', 'crossfit', 'competition', 'contoured']),

  ('Leather Care Kit', 'leather-care-kit',
   'Keep your leather belt in peak condition with our professional Leather Care Kit. Includes leather conditioner, applicator sponge, microfiber cloth, and edge dressing. Regular conditioning prevents cracking and extends belt life by years. The kit includes enough product for 12+ applications. Compatible with all genuine and full-grain leather belts.',
   'Professional leather care kit. 12+ applications included.',
   24.99, 34.99, (SELECT id FROM categories WHERE slug='accessories'),
   'https://images.pexels.com/photos/1120922/pexels-photo-1120922.jpeg?auto=compress&cs=tinysrgb&w=600',
   ARRAY['https://images.pexels.com/photos/1120922/pexels-photo-1120922.jpeg?auto=compress&cs=tinysrgb&w=600'],
   'Leather Conditioner 4oz, Applicator Sponge, Microfiber Cloth, Edge Dressing Pen',
   '{}',
   ARRAY['Prevents leather cracking', 'Extends belt life by years', '12+ applications included', 'Professional grade products'],
   4.5, 134, 175, 'LCK-012', false, ARRAY['accessory', 'care', 'leather', 'maintenance'])
ON CONFLICT (slug) DO NOTHING;

-- New Reviews
INSERT INTO reviews (product_id, user_name, rating, title, comment, is_verified) VALUES
  ((SELECT id FROM products WHERE slug='titan-pro-lever-belt'), 'Marcus T.', 5, 'Best lever belt I have owned', 'The lever action is smooth and the leather is incredibly rigid. My squat went up 20lbs the first week just from the support. Break-in took about 2 weeks.', true),
  ((SELECT id FROM products WHERE slug='titan-pro-lever-belt'), 'Sarah K.', 5, 'Competition ready out of the box', 'Used this at my last powerlifting meet. IPF approved, zero issues. The lever release between attempts is a game changer.', true),
  ((SELECT id FROM products WHERE slug='ironclad-single-prong-belt'), 'James R.', 5, 'Classic quality', 'You cannot go wrong with a single prong. The leather is thick and the roller buckle is smooth. No pinching at all.', true),
  ((SELECT id FROM products WHERE slug='flexcore-velcro-belt'), 'David L.', 5, 'Perfect for CrossFit', 'Quick transitions between lifts is everything in a WOD. This belt goes on and off in seconds. Holds tight too.', true),
  ((SELECT id FROM products WHERE slug='forge-lever-belt-13mm'), 'Chris W.', 5, 'A wall of support', 'This belt does not bend. Period. 13mm of pure support for my 700lb deadlifts. The spare lever is a nice touch.', true),
  ((SELECT id FROM products WHERE slug='heritage-full-grain-belt'), 'Amanda S.', 5, 'Worth every penny', 'The leather quality is on another level. It is developing a beautiful patina after 6 months. Lifetime warranty gives peace of mind.', true),
  ((SELECT id FROM products WHERE slug='wod-warrior-velcro-belt'), 'Tom H.', 5, 'My go-to for competition', 'Used at the CrossFit Open and Semifinals. The velcro is still going strong after 8 months of daily use.', true),
  ((SELECT id FROM products WHERE slug='nylon-training-belt'), 'Rachel G.', 4, 'Great starter belt', 'Perfect for someone just learning to use a belt. Lightweight and the mesh backing keeps it cool. Not for heavy powerlifting though.', true),
  ((SELECT id FROM products WHERE slug='stealth-tapered-belt'), 'Mike P.', 5, 'Best for Olympic lifting', 'The tapered design lets me hit full depth cleans without the belt digging into my ribs. Great for snatches too.', true),
  ((SELECT id FROM products WHERE slug='quickdraw-lever-belt'), 'Lisa M.', 4, 'Micro-adjust is genius', 'Being able to fine-tune the fit without a screwdriver is amazing. My weight fluctuates and this adapts perfectly.', true)
ON CONFLICT DO NOTHING;

-- New Coupons
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, max_uses, is_active) VALUES
  ('BELT20', '20% off your first belt', 'percentage', 20, 0, 1000, true),
  ('LIFT15', '15% off for lifters', 'percentage', 15, 25, 500, true),
  ('FREE10', '$10 off orders over $75', 'fixed', 10, 75, 300, true)
ON CONFLICT (code) DO NOTHING;

-- New Blog Posts
INSERT INTO blog_posts (title, slug, excerpt, content, image_url, category, tags) VALUES
  ('How to Choose the Right Lifting Belt for Your Sport', 'choose-right-lifting-belt',
   'Not all belts are created equal. Here is how to pick the perfect belt for powerlifting, CrossFit, or Olympic lifting.',
   'Choosing a lifting belt is one of the most important gear decisions you will make. The right belt can add pounds to your lifts, while the wrong one can leave you unsupported and uncomfortable. Here is a complete breakdown.

## Powerlifting Belts
For squats and deadlifts, you want maximum rigidity. A 13mm leather belt with a lever or prong buckle provides a rigid wall to push against, generating maximum intra-abdominal pressure. The IPF allows belts up to 4 inches wide and 13mm thick.

## CrossFit Belts
CrossFit demands quick transitions. A velcro belt lets you slap it on for heavy lifts and rip it off for the next movement. Look for 5-7.5mm thickness with a contoured design that does not interfere with gymnastics.

## Olympic Weightlifting Belts
Olympic lifters need a belt that supports without restricting. A tapered belt (4 inches in back, 2.5 inches in front) provides back support while allowing full hip flexion for cleans and snatches. 6.5-10mm thickness is ideal.

## General Training
If you do a mix of everything, a 10mm lever belt is the most versatile option. It provides solid support for heavy compound lifts while being quick to remove for accessory work.',
   'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=800',
   'Guides', ARRAY['belt-guide', 'powerlifting', 'crossfit', 'olympic']),

  ('Lever vs Prong vs Velcro: Which Belt Closure is Best?', 'lever-vs-prong-vs-velcro',
   'The great belt debate. We break down the pros and cons of each closure type so you can make the right choice.',
   'The closure mechanism is the most debated feature of lifting belts. Each has distinct advantages depending on your training style.

## Lever Belts
Pros: Fastest on/off, most consistent tightness, easy to use solo
Cons: Requires a screwdriver to adjust tightness, lever can break
Best for: Powerlifters who train alone and want quick setup

## Single Prong Belts
Pros: Precise hole-to-hole adjustment, nearly indestructible, no tools needed
Cons: Slower to put on, can pinch skin during break-in
Best for: Traditional powerlifters who want reliability

## Double Prong Belts
Pros: Most secure fit, zero belt movement, even pressure
Cons: Hardest to fasten, can be difficult to align both prongs
Best for: Heavy squatters who want zero belt shift

## Velcro Belts
Pros: Fastest transitions, adjustable tightness, lightweight
Cons: Less rigid than leather, velcro wears over time
Best for: CrossFit, functional fitness, beginners

## Our Recommendation
For powerlifting: Lever or single prong. For CrossFit: Velcro. For general training: Lever for convenience.',
   'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800',
   'Guides', ARRAY['lever', 'prong', 'velcro', 'comparison']),

  ('How to Break In a New Leather Lifting Belt', 'break-in-leather-belt',
   'A new leather belt is stiff for a reason. Here is how to break it in properly without damaging it.',
   'A brand new leather lifting belt should be stiff - that rigidity is what provides support. But it also needs to conform to your body for comfort. Here is the proper break-in process.

## The 2-Week Method
Wear the belt for every training session, but only tighten it to 70-80% of your target tightness for the first week. During week 2, gradually increase to full tightness. By week 3, the leather will have molded to your torso shape.

## Accelerated Break-In
If you need it competition-ready faster: 1) Roll the belt tightly in both directions for 5 minutes daily. 2) Use a leather conditioner on the interior only. 3) Wear it around the house for 30 minutes daily. Never use heat or force to break in leather.

## What NOT to Do
- Do not soak the belt in water
- Do not use a hair dryer or heat gun
- Do not fold the belt in half
- Do not apply conditioner to the exterior (it softens the leather too much)
- Do not store it folded (causes permanent creases)

## Storage
Always roll your belt with the leather facing outward. Use a belt keeper to maintain the roll. Store in a cool, dry place away from direct sunlight.',
   'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800',
   'Maintenance', ARRAY['break-in', 'leather', 'care', 'maintenance']),

  ('The Science Behind Lifting Belts: Do They Actually Work?', 'science-behind-lifting-belts',
   'Research-backed evidence on how lifting belts work and when you should actually use one.',
   'Lifting belts are one of the most misunderstood pieces of gym equipment. Let us look at what the science actually says.

## How Belts Work
A lifting belt does not directly support your spine. Instead, it gives your abdominal muscles something to push against, increasing intra-abdominal pressure (IAP). This pressure acts like an internal brace that stabilizes your spine from the inside.

## What Research Shows
A 2001 study in Medicine and Science in Sports and Exercise found that wearing a belt increased IAP by 20-40% during heavy squats. A 2017 study in the Journal of Strength and Conditioning Research showed belts increased squat performance by 5-15% at 80%+ 1RM.

## When to Use a Belt
- Working sets above 80% 1RM
- Max effort attempts
- Heavy compound movements (squat, deadlift, overhead press)
- Competition lifts

## When NOT to Use a Belt
- Warm-up sets below 70%
- Light accessory work
- Exercises that do not load the spine
- If you are a beginner learning proper bracing technique

## Common Myths
Myth: Belts weaken your core. Truth: Studies show belt users actually have MORE core muscle activation, not less. The belt is a tool that enhances your natural bracing, not a replacement for it.',
   'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=800',
   'Science', ARRAY['science', 'research', 'core', 'bracing']),

  ('5 Mistakes People Make When Using a Lifting Belt', 'lifting-belt-mistakes',
   'Are you using your belt wrong? These common mistakes could be limiting your gains.',
   'Even experienced lifters make these belt mistakes. Here are the top 5 and how to fix them.

## 1. Wearing It Too Low
The belt should sit around your natural waist, not on your hips. If the belt is too low, it cannot provide proper IAP. Position it so the bottom edge sits just above your hip bones.

## 2. Tightening It Too Much
A belt that is too tight actually reduces your ability to breathe and brace properly. You should be able to take a full belly breath with the belt on. Aim for a snug fit that allows your abdomen to expand against the belt.

## 3. Using It for Every Set
If you wear a belt for your warm-up sets, you are missing an opportunity to train your natural bracing. Save the belt for working sets at 80%+ and go beltless for everything else.

## 4. Not Breathing Properly
A belt is useless without proper breathing technique. Take a deep belly breath, push your abs OUT against the belt, then execute the lift. This is the Valsalva maneuver and it is how the belt works.

## 5. Buying the Wrong Thickness
10mm is the sweet spot for most lifters. 13mm is only for elite powerlifters who need maximum rigidity. 5-7mm is for CrossFit and functional training. Buying too thick a belt as a beginner can actually be counterproductive.',
   'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800',
   'Training', ARRAY['mistakes', 'technique', 'bracing', 'tips']),

  ('How to Measure Yourself for a Lifting Belt', 'measure-for-lifting-belt',
   'Getting the right size belt is critical. Here is the correct way to measure and choose your size.',
   'A poorly fitting belt is worse than no belt at all. Here is how to get the perfect size.

## Measuring Your Waist
Use a soft tape measure around your natural waist - the area between your bottom rib and hip bone where the belt will sit. Do NOT use your pants size. Measure over the clothing you typically lift in.

## Size Chart
- XS: 24-28 inches
- S: 28-32 inches
- M: 32-36 inches
- L: 36-40 inches
- XL: 40-44 inches
- XXL: 44-48 inches

## Important Tips
1. Measure at the end of the day when you are largest
2. If between sizes, size UP for prong belts (you can always add holes) and size DOWN for lever belts (levers stretch slightly)
3. Consider your weight fluctuation - if you cut/gain weight for competition, choose a belt that works for both
4. The belt should fasten at the middle holes, not the tightest or loosest

## Lever Belt Sizing
Lever belts have fixed holes. If your weight fluctuates more than 10 lbs, consider our QuickDraw belt with micro-adjust, or choose a prong belt for infinite adjustability.',
   'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=800',
   'Guides', ARRAY['sizing', 'measurement', 'fit', 'guide'])
ON CONFLICT (slug) DO NOTHING;
