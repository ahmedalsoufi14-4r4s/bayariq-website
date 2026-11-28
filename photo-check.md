# Product photos: what was checked

389 of 15973 products have a photo now (round 1: 166 still on the site, round 2: 222, and one featured product from the last search). 371 come from Open Food Facts, 15 from Open Beauty Facts and 3 from Open Products Facts, all under CC BY-SA 3.0 and all listed on the "Photo credits" page (the link is in the footer).

To remove a wrong one, delete its line from `public/data/photo-credits.json` and its file from `public/images/products/`, then run `npm run products`.

The rule for every photo now: the brand, the product, the variant and the size must be printed on the pack in the photo (or on another photo of the same pack, under the same barcode). If not, the category drawing stays.

## Round 1 checked again

You asked for the 141 round-1 photos whose size had come from the database to be checked one by one. For each one:

1. Every photo of its barcode in the Open Food Facts image bucket, at full size (339 photos, no bulk files downloaded again).
2. The text on them, read twice: the bucket's own OCR and a second OCR run here, to find the places where the size number appears.
3. A look at each product on review sheets (the photo used on the site and all other photos of the pack), then close-ups of 19 places where a size might be printed but was too small to read.

**27 kept, 114 removed.** Most of the removed ones are front photos where the size simply isn't on the visible side (cups, cartons, jars, cans). Some only show a count (slices, triangles, bars) and not the weight, which isn't enough under the rule. Six also had a readable printed date, and one had a price sticker.

Two of these were in your first sample and are now gone: **#3 Saudia gold milk 1 L** (kept before because of the carton's shape; the size isn't printed) and **#20 Luna iced coffee Spanish Latte** (the flavor is printed, the size is not).

The 27 that stay:

| Product                                 | Where the size is printed                          | Source                                                                 |
| --------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------- |
| جبنة كرافت علب وسط ابو مفتاح 100 جم     | "Net Weight: 100g" on another photo of the tin     | [6084012090444](https://world.openfoodfacts.org/product/6084012090444) |
| حليب الخير بودرة اكياس 2250 جم          | 2250 g at the bottom of the bag                    | [6281101492596](https://world.openfoodfacts.org/product/6281101492596) |
| حليب السعودية بودرة 900 جم              | 900 g on the front                                 | [6281039371413](https://world.openfoodfacts.org/product/6281039371413) |
| حليب المراعي مكثف محلي 397 جم           | 397 g on the front                                 | [6281007046725](https://world.openfoodfacts.org/product/6281007046725) |
| حليب انكور بودرة علب 400 جم             | الوزن الصافي ٤٠٠ غ on the front                    | [0070476102058](https://world.openfoodfacts.org/product/0070476102058) |
| حليب مراعي مكثف محلي 397 جم             | 397 g on the front                                 | [6281007046725](https://world.openfoodfacts.org/product/6281007046725) |
| حليب نيدو بودرة علب 900 جم              | 900 g at the side of the front                     | [7616100388318](https://world.openfoodfacts.org/product/7616100388318) |
| زبدة لورباك غير مملحة صغير 100 جم       | 100 g on the front                                 | [5740900864108](https://world.openfoodfacts.org/product/5740900864108) |
| شبية قشطة قيمر بوك صغير 125 جم          | 125 ml on the front                                | [6281048105108](https://world.openfoodfacts.org/product/6281048105108) |
| لبن نادك عيران بالخيار والنعناع 225 مل  | 225 ml on the bottle                               | [6281057004140](https://world.openfoodfacts.org/product/6281057004140) |
| ساديا ناجتس دجاج مقرمش 270 جم           | Net weight 270 g on the front                      | [7893000089624](https://world.openfoodfacts.org/product/7893000089624) |
| ساديا ناجتس دجاج مقرمش بالبقسماط 750 جم | Net weight 750 g on the front                      | [7893000089648](https://world.openfoodfacts.org/product/7893000089648) |
| سن توب برتقال كبير 250 مل               | 250 ml on the side (other photos of the same pack) | [6224001167423](https://world.openfoodfacts.org/product/6224001167423) |
| عصير سيزر جزر و برتقال 250 مل           | ٢٥٠ مل beside the barcode                          | [6281060042719](https://world.openfoodfacts.org/product/6281060042719) |
| عصير سيزر جزر وبرتقال قوارير 250 مل     | ٢٥٠ مل beside the barcode                          | [6281060042719](https://world.openfoodfacts.org/product/6281060042719) |
| كوكا كولا زيرو علب 320 مل               | ٣٢٠ مل on the can                                  | [5449000294982](https://world.openfoodfacts.org/product/5449000294982) |
| نسكافية اسبانيش لاتية جاهز للشرب 225 مل | 1 can (225 ml) in the nutrition table              | [8992696526037](https://world.openfoodfacts.org/product/8992696526037) |
| شراب هيرشيز بالفراولة 623 جم            | Net wt 623 g on the front                          | [6942836715199](https://world.openfoodfacts.org/product/6942836715199) |
| بزاليا لونا صغير 284 جم                 | Net weight 284 g on another photo of the can       | [6281020010918](https://world.openfoodfacts.org/product/6281020010918) |
| شورة كريمة الفطر ماجي 68 جم             | 68 جم on the front                                 | [6294017107232](https://world.openfoodfacts.org/product/6294017107232) |
| صلصة بوك الاجبان الاربعة 500 مل         | 500 ml on the front                                | [5711953074523](https://world.openfoodfacts.org/product/5711953074523) |
| طرشي مشكل بيدر / ديراني وسط 660 جم      | 660 g on the label                                 | [6281100022022](https://world.openfoodfacts.org/product/6281100022022) |
| فول لونا مدمس حبة كبير 380 جرام         | Net weight 380 g on another photo of the can       | [6281020010116](https://world.openfoodfacts.org/product/6281020010116) |
| فول مدمس لونا خلطة سرية 450 جرام        | Net weight 450 g on another photo of the can       | [6281020325937](https://world.openfoodfacts.org/product/6281020325937) |
| فول مدمس لونا خلطة مصرية 450 جم         | Net weight 450 g on another photo of the can       | [6281020325630](https://world.openfoodfacts.org/product/6281020325630) |
| قهوة باجة فاخرة روبوستا 100 جم          | الوزن الصافي ١٠٠ جم on the front                   | [6281105796423](https://world.openfoodfacts.org/product/6281105796423) |
| نسكافية كلاسيك 47.5 جرام                | Net weight 47.5 g on the front                     | [7891000361252](https://world.openfoodfacts.org/product/7891000361252) |

<details>
<summary>The 114 removed (click to open)</summary>

| Product                                            | Why                                                                        |
| -------------------------------------------------- | -------------------------------------------------------------------------- |
| السعودية مشروب الصويا 1 لتر                        | Only "per 100 ml" is printed, not 1 L.                                     |
| جبنة المراعي شرائح ساندوتش 200 جم                  | Only "10 slices" is printed, not 200 g.                                    |
| جبنة المراعي شيدر كاسات ذهبي 120 جم                | The size is not printed, and neither is "ذهبي".                            |
| جبنة بوك شرائح 400 جم 20 شريحة                     | Only "20 slices" is printed, not 400 g.                                    |
| جبنة شرائح بوك شيدر 200 جم 10 شرائح                | Only "10 slices" is printed, not 200 g.                                    |
| جبنة مثلثات المراعي 16 قطعة 240 جم                 | Only "16 triangles" is printed, not 240 g, and the lid has a printed date. |
| جبنة مثلثات المراعي 8 قطعه 120 جم                  | Only "8 triangles" is printed, not 120 g, and the lid has a printed date.  |
| حليب السعودية ذهبى 1 لتر                           | Your earlier sample #3: the size is not printed in its photos.             |
| حليب ندى كامل الدسم 1 لتر                          | Only "per litre" in the nutrition text, not the pack size.                 |
| زبدة الفول السوداني قودي ناعم وسط 510 جم           | The size is not printed, and the expiry date can be read on the jar.       |
| شبيه جبنة مثلثات بوك 480 جم                        | Only "32 portions" is printed, not 480 g.                                  |
| نادك جبنة شرائح برجر 400 جم                        | The size is not printed, and the dates can be read on the pack.            |
| جلاكسي بالبندق 162.5 غرام مينيز اكياس عربي         | Only "13 bars" is printed, not 162.5 g.                                    |
| شوكولاتة نوتيلا صغير 200 جم                        | Only the serving (15 g) is printed, not 200 g.                             |
| كيك جلاكسي بنكهة البندق 27 جم                      | Only "per bar" calories are printed, not 27 g.                             |
| كيك جلاكسي بنكهة شوكولاتة 27 جم                    | Only "per bar" calories are printed, not 27 g.                             |
| كيك جلاكسي بنكهة فانيلا 27 جم                      | Only "per bar" calories are printed, not 27 g.                             |
| جبنة شرائح ساندوتش المراعي 200 جم                  | Only "10 slices" is printed, not 200 g.                                    |
| فرشلي مركز الفراولة 22 اونز 624 جم                 | The size is not printed, and the bottle has a price sticker.               |
| قودي صلصة المكرونة روزية 448 جم                    | The size is not printed, and the dates can be read on the jar.             |
| لونا قهوة مثلجة أيس كوفي سبانيش لاتية 240 مل       | Your earlier sample #20: the flavor is printed, the size is not.           |
| فول سوداني البطل مملح 115 جم                       | 115 g is printed only inside the date stamp, and the dates can be read.    |
| اكتيفيا زبادي الصافي يوناني بالحبوب والشوفان 150جم | The size is not printed in any photo of this barcode.                      |
| جبن موزاريلا و شيدر بريزيدن 450 جم                 | The size is not printed in any photo of this barcode.                      |
| جبنة بوك قليلة الدسم 240 جم                        | The size is not printed in any photo of this barcode.                      |
| جبنة بوك كاش كافال موزاريلا 180 جم                 | The size is not printed in any photo of this barcode.                      |
| جبنة قوارير بوك ازرق كاسات 130 جم                  | The size is not printed in any photo of this barcode.                      |
| جبنة كرافت علب صغير ابو مفتاح 50 جم                | The size is not printed in any photo of this barcode.                      |
| جبنة لونا شيدر علب وسط 113 جم                      | The size is not printed in any photo of this barcode.                      |
| حليب الربيع زين شوكولاتة والبسكويت 125 مل          | The size is not printed in any photo of this barcode.                      |
| حليب الربيع مصاص كامل الدسم 185 مل                 | The size is not printed in any photo of this barcode.                      |
| حليب المراعي نكهة الفراولة 225 مل                  | The size is not printed in any photo of this barcode.                      |
| حليب باسكن روبنز بالفانيلا الصافي 180 مل           | The size is not printed in any photo of this barcode.                      |
| حليب سائل نستلة مكثف صغير 90 جم                    | The size is not printed in any photo of this barcode.                      |
| حليب لونا بودرة 2500 جم                            | The size is not printed in any photo of this barcode.                      |
| حليب نادك خالي الدسم طويل الاجل 1 لتر              | The size is not printed in any photo of this barcode.                      |
| زبدة الفول السوداني قودي خشن صغير 340 جم           | The size is not printed in any photo of this barcode.                      |
| شبية جبنة لونا كريمة كاسات 140 جم                  | The size is not printed in any photo of this barcode.                      |
| قشطة بوك شبيهة سادة 160 جرام                       | The size is not printed in any photo of this barcode.                      |
| قشطة بوك معقمة لايت 160 جم                         | The size is not printed in any photo of this barcode.                      |
| قشطة لونا فرولة كبير 155 جم                        | The size is not printed in any photo of this barcode.                      |
| كريمة الطبخ نادك 1 لتر                             | The size is not printed in any photo of this barcode.                      |
| كريمة خفق بوك وسط 500 مل                           | The size is not printed in any photo of this barcode.                      |
| كريمة خفق نادك 500 مل                              | The size is not printed in any photo of this barcode.                      |
| كريمة طبخ بوك خفيفة 500 مل                         | The size is not printed in any photo of this barcode.                      |
| كريمة طبخ نادك 500 مل                              | The size is not printed in any photo of this barcode.                      |
| لبن اكتيفيا قليل الدسم 375 مل                      | The size is not printed in any photo of this barcode.                      |
| لبنة المراعي 400 جم                                | The size is not printed in any photo of this barcode.                      |
| لبنة بوك سادة 650 جم                               | The size is not printed in any photo of this barcode.                      |
| موزريلا شيدر بوك 180 جم                            | The size is not printed in any photo of this barcode.                      |
| بوك تكس ماكس موزريلا وشيدر حار 180 جم              | The size is not printed in any photo of this barcode.                      |
| جالكسي الموندا ايس كريم عود 58 جم                  | The size is not printed in any photo of this barcode.                      |
| فاصوليا حمراء داكنة حدائق كاليفورنيا 400 جم        | The size is not printed in any photo of this barcode.                      |
| حليب الربيع بسكويت بالشوكولاتة 185 مل              | The size is not printed in any photo of this barcode.                      |
| حليب الربيع فراولة 185 مل                          | The size is not printed in any photo of this barcode.                      |
| حليب الربيع موز 185 مل                             | The size is not printed in any photo of this barcode.                      |
| سن توب مانجو كبير 250 مل                           | The size is not printed in any photo of this barcode.                      |
| عصير الربيع عائلي ليمون ونعناع 1 لتر               | The size is not printed in any photo of this barcode.                      |
| عصير الربيع ميني تفاح 185 مل                       | The size is not printed in any photo of this barcode.                      |
| عصير الصافي عضوي رمان 1 لتر                        | The size is not printed in any photo of this barcode.                      |
| عصير راني اناناس حبيبات 240 مل                     | The size is not printed in any photo of this barcode.                      |
| عصير راني برتقال علب حبيبات 180 مل                 | The size is not printed in any photo of this barcode.                      |
| عصير راني خوخ حبيبات 180 مل                        | The size is not printed in any photo of this barcode.                      |
| عصير سن توب توت مشكل 330 مل                        | The size is not printed in any photo of this barcode.                      |
| عصير سيزر اناناس 250 مل                            | The size is not printed in any photo of this barcode.                      |
| عصير مشكل عضوي الصافي قزاز 1 لتر                   | The size is not printed in any photo of this barcode.                      |
| فيمتو فريزي الليمون والتوت 250 مل                  | The size is not printed in any photo of this barcode.                      |
| مشروب غازي كينزا رمان 250 مل                       | The size is not printed in any photo of this barcode.                      |
| مشروب فانتا برتقال بلاستيك 1 لتر                   | The size is not printed in any photo of this barcode.                      |
| بسكويت بكريمة الشوكولاتة ديمة 68 جم                | The size is not printed in any photo of this barcode.                      |
| بسكويت بكريمة الموز ديمة 68 جم                     | The size is not printed in any photo of this barcode.                      |
| بسكويت جوز الكاجو بران 70 جم                       | The size is not printed in any photo of this barcode.                      |
| بسكويت كريمة فانيلا اسود وابيض ديمة 68 جم          | The size is not printed in any photo of this barcode.                      |
| بطاس البطل فلفل حار 23 جم                          | The size is not printed in any photo of this barcode.                      |
| بطاطس فرفشة ديمة شطة و الليمون 75 جم               | The size is not printed in any photo of this barcode.                      |
| فشار الذرة الصفراء علب فرشلي 284 جم                | The size is not printed in any photo of this barcode.                      |
| لواكر بسكويت بالبندق 80 جم                         | The size is not printed in any photo of this barcode.                      |
| لواكر بسكويتفول سوداني 80 جم                       | The size is not printed in any photo of this barcode.                      |
| ليز فورنو مخبوز زبادي واعشاب 160 جم                | The size is not printed in any photo of this barcode.                      |
| ليز ملح بحري وخل 165 جم                            | The size is not printed in any photo of this barcode.                      |
| بندق بالكاكاو سبريد يمامة 360 جم                   | The size is not printed in any photo of this barcode.                      |
| حليب لونا مركز عدني 170 جم                         | The size is not printed in any photo of this barcode.                      |
| خردل قودي ضغاط 250 مل                              | The size is not printed in any photo of this barcode.                      |
| خوخ انصاف جلوريا 425جم وادي فاطمة                  | The size is not printed in any photo of this barcode.                      |
| ذرة حب كاملة حلوة لونا 185 جرام                    | The size is not printed in any photo of this barcode.                      |
| سيريلاك قمح وعسل مستورد 400 جم                     | The size is not printed in any photo of this barcode.                      |
| شطة حار بيدر صغير 88 مل                            | The size is not printed in any photo of this barcode.                      |
| شطة حمراء مطحونة حلواني (مختارات) 375 جم           | The size is not printed in any photo of this barcode.                      |
| صلصة تشيبوتلي قودي الحارة 250 مل                   | The size is not printed in any photo of this barcode.                      |
| صلصة قودي مكرونة بيستو 190 جم                      | The size is not printed in any photo of this barcode.                      |
| صلصة لونا علب صغير 70 جم                           | The size is not printed in any photo of this barcode.                      |
| طحينة سائلة صغير حلواني 250 جم                     | The size is not printed in any photo of this barcode.                      |
| عسل المراعي الزهور البرية 250 جرام                 | The size is not printed in any photo of this barcode.                      |
| فرشلي كرز للزينة و الحشوة 595 جم 21 اونز           | The size is not printed in any photo of this barcode.                      |
| فشار البطل توفي وقهوة 140 جم                       | The size is not printed in any photo of this barcode.                      |
| فشار قودي علب صغير 284 جم                          | The size is not printed in any photo of this barcode.                      |
| فول حدائق كاليفورنيا سادة 450 جم                   | The size is not printed in any photo of this barcode.                      |
| قودي صلصة الباربكيو المدخن 250 مل                  | The size is not printed in any photo of this barcode.                      |
| قودي صلصة التار تار 250 مل                         | The size is not printed in any photo of this barcode.                      |
| كاتشب قودي ضغاط 425 مل                             | The size is not printed in any photo of this barcode.                      |
| مايونيز قودي كاتشب ضغاط 425 مل                     | The size is not printed in any photo of this barcode.                      |
| مايونيز قودي كبير 946 مل                           | The size is not printed in any photo of this barcode.                      |
| مايونيز قودي ليمون ضغاط 250 مل                     | The size is not printed in any photo of this barcode.                      |
| مربى حلواني برتقال 400 جم                          | The size is not printed in any photo of this barcode.                      |
| مربى حلواني مشمش كبير 800 جم                       | The size is not printed in any photo of this barcode.                      |
| ندى فول خلطة المصرية 400 جم                        | The size is not printed in any photo of this barcode.                      |
| فشار قودي علب 450 جم                               | The size is not printed in any photo of this barcode.                      |
| قهوة باجة سريعه التحضير كابتشينو 15 جم             | The size is not printed in any photo of this barcode.                      |
| قهوة تركي باجة سادة 200 جم                         | The size is not printed in any photo of this barcode.                      |
| نسكافية جولد ذهبي 47.5 جرام                        | The size is not printed in any photo of this barcode.                      |
| حب دوار الشمس باجة مملح 230 جرام                   | The size is not printed in any photo of this barcode.                      |
| حب دوار شمس باجة مالح 15 جم                        | The size is not printed in any photo of this barcode.                      |
| لوز مملح باجة 280 جم                               | The size is not printed in any photo of this barcode.                      |
| مكسرات مشكل ديلوكس بدون ملح باجة 120 جرام          | The size is not printed in any photo of this barcode.                      |

</details>

## The non-food sample

You confirmed the 20 samples. The one you asked about:

- **معجون اسنان الودنت اطفال 50 مل: kept.** The front of the box reads "للأطفال" in large letters, with "آمن تماما للأطفال", "للعناية اليومية بأسنان الأطفال", "بطعم الفراولة اللذيذ" and 50 ml ([Open Beauty Facts, barcode 5029354007126](https://world.openbeautyfacts.org/product/5029354007126)).

## Featured products

3 of 18 have a photo (حليب المراعي طازج 2.85 لتر, خبز التوست لوزين ابيض 600 جم and, since the last search, جبنة بوك قابلة للدهن فيتامين 500 جم). You'll photograph the other 15 in the store and put the photos in `photos/featured/`. Each will then be matched to its product, cut out on white, made a 400 × 400 WebP under 40 KB and credited as "Bayariq Al Khair (own photo)". Until then they keep the drawing:

| Product                                        | Category                     |
| ---------------------------------------------- | ---------------------------- |
| لبن المراعي طازج كامل الدسم 1 لتر              | Dairy & Cheese               |
| حليب نيدو بودرة 1800 جم                        | Dairy & Cheese               |
| بيض طازج غذاء البركة نص طبق 15 حبة             | Dairy & Cheese               |
| رز ابو كاس مزة بسمتي 5 كيلو                    | Tea, Coffee & Grains         |
| سكر الاسرة خشن 5 كجم                           | Tea, Coffee & Grains         |
| زيت ذرة عافية 3 (2 \* 1.5 لتر + 2 \* 500 مل)   | Oils & Ghee                  |
| دجاج الوطنية مبرد 1000 جم                      | Frozen Food                  |
| اندومي بنكهة الدجاج اوبامي 75 جم               | Canned Food & Sauces         |
| شاي ربيع إكسبرس المذاق الاصلي خيط 24 \* 25 خيط | Tea, Coffee & Grains         |
| قهوة عربية المرسال (الخير) 500 جم              | Tea, Coffee & Grains         |
| تمر سكري القصيم انيسة 1 كجم                    | Attara: Spices, Nuts & Herbs |
| مياة نوفا كبير 1.5 لتر                         | Beverages & Water            |
| بيبسي بلاستيك وسط 1 لتر                        | Beverages & Water            |
| صابون تايد اخضر اوتوماتيك 1.5 كيلو             | Cleaning & Household         |
| مناديل فاين وجه فلافي 9 \* 4 \* 130 منديل      | Paper & Disposables          |

### The last search (all 16)

Searched again with the same rule (brand, product, variant and size printed on the pack):

1. **Open Food Facts, Open Beauty Facts, Open Products Facts:** the whole Open Food Facts product file (4.9 million products, any country) by brand and product words, the text read from every Gulf pack photo, and every photographed barcode under each brand's own barcode prefix. Then every candidate's photos at full size.
2. **Wikimedia Commons and Flickr:** searched in Arabic and English, Flickr through Openverse (which lists Flickr's Creative Commons photos), keeping only licenses that allow commercial use and changes (CC0, CC BY, CC BY-SA).
3. **Google Images** with the Creative Commons filter could not be searched from here: Google blocks automated requests. Openverse covers the main sources that filter shows (Flickr, Wikimedia).

**Found: جبنة بوك قابلة للدهن فيتامين 500 جم.** Arla's Puck jar "Processed Cream Cheese Spread / جبنة كريم مطبوخة قابلة للدهن" with "VITAMIN D فيتامين" on the front, and "Net Weight: 500g" on the back (another photo of the same barcode). It is a shelf photo, so the site shows only the lower jar, which is whole and has no sticker (another jar in the photo has a shop's price sticker). License checked on the photo's own page: "licensed under the Creative Commons Attribution-Share Alike 3.0 Unported license", photo by foodless ([Open Food Facts, barcode 5711953153020](https://world.openfoodfacts.org/product/5711953153020)).

**Close, but left out:**

| Product                            | What exists, and why it is not used                                                                                                                                                      |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| رز ابو كاس مزة بسمتي 5 كيلو        | The right bag (أرز مزة هندي بسمتي, "NET WEIGHT: 5 KG" on the back, [6281100410072](https://world.openfoodfacts.org/product/6281100410072)), but the front photo cuts off the bag's side. |
| تمر سكري القصيم انيسة 1 كجم        | Aneesah Farms سكري القصيم طري 1 kg ([6287005130428](https://world.openfoodfacts.org/product/6287005130428)), but the tub is cut off at the edges and the label is a French importer's.   |
| لبن المراعي طازج كامل الدسم 1 لتر  | The 1 L carton is only in close-ups that cut off the top. The whole photo shows the old 1 L bottle from 2018 (the low-fat 1 L on the site is the carton).                                |
| حليب نيدو بودرة 1800 جم            | 1800 g tins of "نيدو المدعم غني بالألياف" and of the European "Instant Full Cream" both exist, and the POS name doesn't say which one the store sells.                                   |
| شاي ربيع إكسبرس 25 خيط             | Only the older box ("Rich Flavor and Smooth Taste", without "المذاق الأصلي"), held in a hand.                                                                                            |
| صابون تايد اخضر اوتوماتيك 1.5 كيلو | Saudi Tide boxes are Tide Original 1.5 kg (not Automatic) and Tide Automatic with Downy 2.5 kg.                                                                                          |
| بيبسي بلاستيك وسط 1 لتر            | No Pepsi 1 L with the size printed; the Saudi "1 Liter" bottle on Open Food Facts is Mountain Dew. Commons and Flickr have other countries' bottles and older designs.                   |
| اندومي بنكهة الدجاج اوبامي 75 جم   | Chicken flavour only as a 10-pack with a shop's price sticker and as a cup; the single 75 g packs on Open Food Facts are other flavors (Special Chicken, Baladi Chicken).                |

Nothing open at all for the other seven: Ghitha Al Baraka eggs, Al Osra coarse sugar 5 kg, the Afia bundle, chilled Al Watania chicken 1000 g, Al Mersal coffee 500 g, Nova 1.5 L and Fine Fluffy. Commons has only logos (Nova, Rabea).

So your own photos are still the way to show these 15.

## How round 2 was checked

The POS export still has no barcodes, so every match went through these steps:

1. **Text on the pack.** Open Food Facts keeps the text of every photo (read by OCR). The Gulf products of all three databases were matched on the words of the POS name and on the size, and only pairs whose size is printed on a photo of the same barcode went on.
2. **First look:** about 1,800 candidate barcodes on review sheets, keeping only those where brand, product and variant agree (ذهبي، كامل الدسم / قليل الدسم / خالي، the flavor, علبة / كيس / زجاج).
3. **Second look at full size:** the photo next to the place on the pack where the size is printed. Out went every photo whose size was only on a shelf tag or in the database, or whose label didn't show the variant. Also out: another shop's price sticker or price tag on the pack, a legible production or expiry date, a pack that is cut off, and packshots that look like a manufacturer's or another shop's picture.
4. **Third look at the finished 400 × 400 photo:** out went those where a hand still showed, the cut-out broke the pack (many frozen-food boxes), or the colors were wrong.

Also removed from round 1 in round 2: جبنة بالقشطة مربعات المراعي 108 جم (readable production and expiry dates), and two Almarai packshots that someone had uploaded to Open Food Facts (جبنة فيتا المراعي كامل الدسم 200جم and كريمة خفق المراعي 500 مل). Almarai's pictures are all rights reserved.

## Photos by category

| Category                     | With a photo | With the category picture |
| ---------------------------- | ------------ | ------------------------- |
| Dairy & Cheese               | 140          | 956                       |
| Frozen Food                  | 36           | 956                       |
| Beverages & Water            | 54           | 1151                      |
| Sweets & Snacks              | 43           | 2624                      |
| Canned Food & Sauces         | 55           | 1514                      |
| Oils & Ghee                  | 10           | 219                       |
| Tea, Coffee & Grains         | 12           | 717                       |
| Attara: Spices, Nuts & Herbs | 2            | 491                       |
| Cleaning & Household         | 14           | 1229                      |
| Personal Care & Beauty       | 17           | 1303                      |
| Baby Care                    | 6            | 216                       |
| Paper & Disposables          | 0            | 1471                      |
| Housewares & Kitchen         | 0            | 1570                      |
| Electrical & Hardware        | 0            | 396                       |
| Accessories & Electronics    | 0            | 262                       |
| Toys & Stationery            | 0            | 379                       |
| Clothing & Linens            | 0            | 56                        |
| Gifts & Party                | 0            | 74                        |
| **All**                      | **389**      | **15584**                 |
