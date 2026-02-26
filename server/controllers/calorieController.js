import pool from '../config/database.js';

export const calculateCalories = async (req, res) => {
    try {
        const { age, gender, weight, height, activityLevel, healthCondition } = req.body;

        if (!age || !gender || !weight || !height || !activityLevel) {
            return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
        }

        // استخدام معادلة Mifflin-St Jeor
        let bmr;
        if (gender === 'male' || gender === 'ذكر') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        // معاملات مستويات النشاط
        const activityFactors = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            veryActive: 1.9,
            خامل: 1.2,
            خفيف: 1.375,
            متوسط: 1.55,
            نشط: 1.725,
            نشطجداً: 1.9
        };

        const factor = activityFactors[activityLevel] || 1.55;
        let tdee = bmr * factor;

        // تعديل السعرات بناءً على الحالة الصحية (اختياري)
        let advice = "";
        let recommendedFoods = [];
        let avoidedFoods = [];

        // منطق اقتراح الأطعمة حسب الحالة الصحية
        switch (healthCondition) {
            case 'diabetes': // مريض السكر
                advice = "ينصح بتوزيع الكربوهيدرات بانتظام، والتركيز على الألياف.";
                recommendedFoods = [
                    "خضروات ورقية (سبانخ، خس)",
                    "حبوب كاملة (شوفان، أرز بني)",
                    "بقوليات (عدس، فاصوليا)",
                    "أسماك دهنية (سلمون، تونة)",
                    "مكسرات نيئة",
                    "زبادي يوناني أو قليل الدسم",
                    "توت وفراولة"
                ];
                avoidedFoods = [
                    "سكريات مضافة وحلويات",
                    "مشروبات غازية وعصائر محلاة",
                    "خبز أبيض ومعجنات",
                    "فواكه مجففة بكميات كبيرة",
                    "أطعمة مقلية ومشبعه بالدهون المتحولة"
                ];
                break;

            case 'hypertension': // مريض الضغط
                advice = "يجب تقليل الصوديوم (الملح) والتركيز على البوتاسيوم.";
                recommendedFoods = [
                    "موز وتمر (مصادر بوتاسيوم)",
                    "خضروات وفواكه طازجة",
                    "منتجات ألبان قليلة الدسم",
                    "شوفان وحبوب كاملة",
                    "ثوم وزيت زيتون",
                    "أسماك مشوية"
                ];
                avoidedFoods = [
                    "ملح الطعام والأطعمة المالحة جداً",
                    "مخللات ومعلبات",
                    "لحوم مصنعة (لانشون، سجق)",
                    "شيبس ومقرمشات مملحة",
                    "إفراط في الكافيين"
                ];
                break;

            case 'obesity': // السمنة
                advice = "الهدف هو خلق عجز في السعرات الحرارية مع الحفاظ على الشبع.";
                recommendedFoods = [
                    "خضروات غنية بالألياف (بروكلي، قرنبيط)",
                    "بروتين صافي (صدور دجاج، سمك أبيض)",
                    "بقوليات",
                    "ماء وشاي أخضر",
                    "فواكه منخفضة السكر (تفاح، جريب فروت)"
                ];
                avoidedFoods = [
                    "وجبات سريعة ومقليات",
                    "مشروبات سكرية وغازية",
                    "حلويات وكعك",
                    "لحوم عالية الدهون",
                    "صلصات دسمة (مايونيز)"
                ];
                tdee = tdee - 500; // اقتراح عجز تلقائي
                break;

            case 'underweight': // النحافة
                advice = "الهدف هو زيادة السعرات الحرارية بطريقة صحية.";
                recommendedFoods = [
                    "مكسرات وزبدة الفول السوداني",
                    "حليب كامل الدسم ومشتقاته",
                    "أفوكادو وزيوت صحية",
                    "فواكه مجففة (زبيب، تمر)",
                    "نشويات (بطاطس، أرز، مكرونة)",
                    "لحوم حمراء ودجاج"
                ];
                avoidedFoods = [
                    "شرب الماء قبل الأكل مباشرة (يقلل الشهية)",
                    "سلطات بكميات كبيرة (قليلة السعرات)",
                    "مشروبات دايت (بدون سعرات)",
                    "تخطي الوجبات"
                ];
                tdee = tdee + 500; // اقتراح فائض تلقائي
                break;

            case 'gluten_free': // حساسية الغلوتين
                advice = "تجنب القمح والشعير والجاودار تماماً.";
                recommendedFoods = [
                    "أرز، ذرة، بطاطس",
                    "كينوا، دقيق اللوز",
                    "فواكه وخضروات",
                    "لحوم وأسماك وبيض",
                    "بقوليات"
                ];
                avoidedFoods = [
                    "قمح ومنتجاته (خبز، مكرونة عادية)",
                    "شعير",
                    "جاودار",
                    "بعض الصلصات الجاهزة (قد تحتوي دقيق)"
                ];
                break;

            default: // شخص عادي
                advice = "نظام غذائي متوازن يحتوي على جميع المجموعات الغذائية.";
                recommendedFoods = [
                    "خضروات وفواكه متنوعة",
                    "بروتينات (لحوم، أسماك، بيض)",
                    "حبوب كاملة",
                    "ألبان ومشتقاتها",
                    "دهون صحية"
                ];
                avoidedFoods = [
                    "الإفراط في السكريات والدهون المشبعة",
                    "الأطعمة المصنعة بكثرة"
                ];
                break;
        }

        res.json({
            bmr: Math.round(bmr),
            tdee: Math.round(tdee),
            message: 'تم حساب السعرات واقتراح النظام الغذائي بنجاح',
            healthCondition,
            advice,
            recommendedFoods,
            avoidedFoods,
            recommendations: {
                maintenance: Math.round(tdee),
                weightLoss: Math.round(tdee - 500),
                weightGain: Math.round(tdee + 500)
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'خطأ في حساب السعرات الحرارية' });
    }
};

export const saveCalorieResult = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { age, gender, weight, height, activityLevel, bmr, tdee } = req.body;

        const result = await pool.query(
            'INSERT INTO calorie_calculations (user_id, age, gender, weight, height, activity_level, bmr, tdee, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *',
            [userId, age, gender, weight, height, activityLevel, bmr, tdee]
        );

        res.status(201).json({
            message: 'تم حفظ النتيجة بنجاح',
            result: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'خطأ في حفظ النتيجة' });
    }
};

export const getUserCalorieHistory = async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await pool.query(
            'SELECT * FROM calorie_calculations WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10',
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'خطأ في الحصول على السجل' });
    }
};
